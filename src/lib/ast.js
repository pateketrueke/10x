import {
  hasSep, hasTagName, hasPercent,
} from './shared';

import LangErr from './error';
import LangExpr from './expr';

export function highestCommonFactor(a, b) {
  return b !== 0 ? highestCommonFactor(b, a % b) : a;
}

export function toProperty(value) {
  return value.substr(1).replace(/-([a-z])/g, (_, prop) => prop.toUpperCase());
}

export function toFraction(number) {
  const decimals = number.toString().match(/\.0+\d/);
  const length = Math.max(decimals ? decimals[0].length : 3, 3);

  // adjust correction from zero-left padded decimals
  const div = parseInt(`1${Array.from({ length }).join('0')}`);
  const base = Math.floor(parseFloat(number) * div) / div;

  const [left, right] = base.toString().split('.');

  if (!right) {
    return `${left}/1`;
  }

  let numerator = left + right;
  let denominator = Math.pow(10, right.length);

  const factor = highestCommonFactor(numerator, denominator);

  denominator /= factor;
  numerator /= factor;

  return `${numerator}/${denominator}`;
}

export function toNumber(value) {
  if (typeof value === 'string') {
    if (value.includes('/')) {
      const [a, b] = value.split(/[\s/]/);

      return a / b;
    }

    return value.replace(/[^%:a-z\s\d.-]/ig, '');
  }

  return value;
}

export function toValue(value) {
  if (value instanceof Date) {
    return value.toString().split(' ').slice(0, 5).join(' ');
  }

  if (typeof value === 'number') {
    if (value >= Number.MAX_SAFE_INTEGER) {
      return value.toString().replace(/e[+-]/i, '^');
    }

    const sub = value.toString().match(/^.*?\.0+\d{1,3}/);

    if (!sub) {
      value = value.toFixed(2).replace(/\.0+$/, '');
    } else value = sub[0];

    return value.replace(/(?<=\.\d+)0+$/, '');
  }

  // simplify decimals
  if (typeof value === 'string' && value.includes('.')) {
    const [base, decimals] = value.replace('%', '').split('.');
    const input = decimals.split('');
    const out = [];

    for (let i = 0; i < input.length; i += 1) {
      const old = out[out.length - 1];

      if (old > 0) {
        if (input[i] > 0) out.push(input[i]);
        break;
      }

      out.push(input[i]);
    }

    value = `${base}.${out.join('')}${hasPercent(value) ? '%' : ''}`;
  }

  return value;
}

export function toToken(token, fromCallback, arg1, arg2, arg3, arg4) {
  if (Array.isArray(token)) {
    return new LangExpr({ token });
  }

  if (!(token instanceof LangExpr) && typeof fromCallback === 'function') {
    const retval = fromCallback(token.content, arg1, arg2, arg3, arg4);

    if (!retval) {
      throw new LangErr(`Unexpected token \`${token.content}\``, token);
    }

    return new LangExpr(token, retval);
  }

  return new LangExpr(token);
}

export function toInput(token, cb) {
  let fixedValue = token[1];

  if (token[0] === 'object') {
    if (Array.isArray(token[1])) {
      return token[1].map(x => toInput(x, cb));
    }

    Object.keys(token[1]).forEach(k => {
      const fixedTokens = token[1][k].map(x => Array.isArray(x) ? fixArgs(x) : x);

      let fixedValue = cb && !Array.isArray(fixedTokens[0])
        ? cb(fixedTokens)
        : fixedTokens;

      if (Array.isArray(fixedValue[0])) {
        fixedValue = ['object', fixedValue.reduce((prev, cur) => prev.concat(cur), []).map(x => cb ? cb(x) : x)];
      } else if (fixedValue[0] === 'object') {
        fixedValue = fixedValue[1];
      }

      delete token[1][k];

      token[1][toProperty(k)] = fixedValue;
    });
  }

  if (token[0] === 'string') fixedValue = JSON.parse(fixedValue);
  if (token[0] === 'number') fixedValue = parseFloat(toNumber(fixedValue));

  return fixedValue;
}

export function toPlain(values, cb) {
  if (!cb) {
    cb = x => x.map(y => !Array.isArray(y) ? toInput(y.token) : y);
  }

  if (Array.isArray(values)) {
    return cb(values.map(x => toPlain(x, cb)));
  }

  Object.keys(values).forEach(key => {
    let fixedValue = values[key];

    if (fixedValue[0] === 'object') {
      Object.keys(fixedValue[1]).forEach(key => {
        fixedValue[1][key] = cb(fixedValue[1][key]);
      });
    }

    values[key] = fixedValue;
  });

  return values;
}

export function toCut(from, tokens, endOffset) {
  return endOffset >= 0 ? tokens.splice(from, endOffset) : tokens.splice(from);
}

export function fixBinding(obj, name) {
  let target;

  // FIXME: load from well-knwon symbols, and for external sources?
  // e.g. white-list or allow most methods as they are?
  switch (obj) {
    case 'String':
      target = global[obj].prototype[name];
      break;
    default:
      // FIXME: for browser usage, decouple this...
      // const fs = require('fs');
      // const path = require('path');
      // const srcFile = path.resolve();

      throw new Error(`Missing \`${name}\` binding from \`${obj}\``);
  }

  if (typeof target !== 'function') {
    throw new Error(`Expecting \`${name}\` binding to be a function, given \`${target}\``);
  }

  return ['bind', [obj, name, target]];
}

export function fixResult(value) {
  return [typeof value, typeof value === 'string' ? `"${value}"` : value];
}

export function fixTokens(ast) {
  if (!Array.isArray(ast)) return ast;

  const target = ast[0].token[0] === 'symbol' ? {} : [];
  const array = Array.isArray(target);

  let keyName;

  return ast.reduce((prev, cur) => {
    if (!Array.isArray(cur) && cur.token[0] === 'symbol') {
      keyName = cur.token[1];
    } else if (Array.isArray(cur) || !(cur.token[0] === 'expr' && hasSep(cur.token[1]))) {
      if (!array && keyName) {
        prev[keyName] = prev[keyName] || (prev[keyName] = []);
        prev[keyName].push(cur);
      }

      if (array) {
        prev.push(cur);
      }
    }

    return prev;
  }, target);
}

export function fixStrings(tokens, split) {
  return tokens.reduce((prev, cur) => {
    if (
      cur
      && cur.token[0] === 'text'
      && prev[prev.length - 1]
      && prev[prev.length - 1].token[1] !== '\n'
      && prev[prev.length - 1].token[0] === 'text'
      && (split === false || !cur.token[1].includes(' '))
    ) {
      prev[prev.length - 1].token[1] += cur.token[1];
      prev[prev.length - 1].end = cur.end;
    } else {
      prev.push(cur);
    }

    return prev;
  }, [])
}

export function fixValues(tokens, cb) {
  if (Array.isArray(tokens[0])) {
    return tokens.map(x => fixValues(x, cb));
  }

  return cb(tokens);
}

export function fixArgs(values, flatten) {
  let offset = 0;

  const stack = [];

  // FIXME: also, a pattern...
  if (flatten === true) {
    values = fixArgs(values.map(x => {
      while (x.length === 1) x = x[0];
      return x;
    }));

    return values.reduce((p, c) => {
      while (c.length === 1) c = c[0];
      p.push(c);
      return p;
    }, stack);
  }

  // break values into single arguments
  for (let i = 0; i < values.length; i += 1) {
    const last = stack[offset] || (stack[offset] = []);
    const cur = values[i];

    if (!Array.isArray(cur)) {
      last.push(cur);

      // normalize raw separators
      if (
        flatten === null
        ? cur === null
        : (cur.token[0] === 'expr' && ';,'.includes(cur.token[1]))
      ) {
        last.pop();
        offset++;
      }
    } else {
      if (flatten !== false) {
        last.push(...fixArgs(cur, flatten));
      } else {
        last.push(fixArgs(cur, flatten));
      }
    }
  }

  if (flatten === null) {
    return stack.reduce((prev, cur) => {
      const firstValue = cur.findIndex(x => x.token[0] !== 'text');

      // prepend non values
      if (firstValue > 0) {
        prev.push(cur.slice(0, firstValue), cur.slice(firstValue));
        return prev;
      }

      prev.push(fixStrings(cur, false));

      return prev;
    }, []);
  }

  return stack;
}

export function fixInput(args, lpipe) {
  return args.filter(x => !hasTagName(x[0])).reduce((p, c) => p.concat(c[0] === 'expr' ? [] : (
    lpipe ? [['expr', ',', 'or'], c] : [c, ['expr', ',', 'or']]
  )), []);
}

export function fixApply(kind, body, args) {
  if (!Array.isArray(args[0])) args = [];

  if (kind === 'lpipe') return [body].concat(fixInput(args, true));
  if (kind === 'rpipe') return fixInput(args).concat([body]);

  return [];
}

export function fixCut(ast, slice, offset) {
  const pos = ast.slice(offset + slice).findIndex(x => (x[0] === 'expr' && hasSep(x[1])) || x[0] === 'fx');
  const subTree = pos >= 0 ? ast.splice(offset, pos) : ast.splice(offset);

  return subTree;
}
