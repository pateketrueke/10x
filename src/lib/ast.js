import {
  isArray, toToken,
  hasNum, hasSep, hasTagName, hasPercent,
} from './shared';

import {
  tokenize,
} from './utils';

import LangErr from './error';
import RangeExpr from './range';

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
  }, []);
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

    if (!isArray(cur)) {
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
    } else if (flatten !== false) {
      last.push(...fixArgs(cur, flatten));
    } else {
      last.push(fixArgs(cur, flatten));
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

export function fixTokens(ast, z) {
  if (!isArray(ast)) return ast;

  const target = ast[0].token[0] === 'symbol' ? {} : [];
  const array = isArray(target);

  let keyName;

  return ast.reduce((prev, cur) => {
    if (!isArray(cur) && cur.token[0] === 'symbol') {
      keyName = cur.token[1];
    } else if (isArray(cur) || !(cur.token[0] === 'expr' && hasSep(cur.token[1]))) {
      const fixedToken = z && isArray(cur) ? fixArgs(cur, true) : cur;

      if (!array && keyName) {
        prev[keyName] = prev[keyName] || (prev[keyName] = []);
        prev[keyName].push(fixedToken);
      }

      if (array) {
        prev.push(fixedToken);
      }
    }

    return prev;
  }, target);
}

// FIXME: clean up this shit...
export function fixChunk(tokens, i) {
  const offset = tokens.slice(i).findIndex(x => !isArray(x) && x.token[0] === 'expr' && x.token[2] === 'k');
  const subTree = offset > 0 ? tokens.splice(i, offset) : tokens.splice(i);

  return subTree;
}

export function fixTree(ast, self) {
  const tokens = ast.filter(x => isArray(x) || !hasTagName(x.token[0]));

  for (let i = 0; i < tokens.length; i += 1) {
    const cur = isArray(tokens[i])
      ? fixTree(tokens[i])
      : tokens[i];

    const prev = tokens[i - 1] || { token: [] };
    const next = tokens[i + 1] || { token: [] };

    if (isArray(cur) && cur.length > 1 && !isArray(cur[0])) {
      // handle tuples
      // FIXME: more helpers
      if (
        !isArray(cur[1])
        && cur[0].token[0] === 'symbol'
        && ['number', 'string', 'unit'].includes(cur[1].token[0])
      ) {
        tokens.splice(i, 1, toToken(['object', fixTokens(cur, true)]));
        continue;
      }
    }

    // sub-tokenize strings
    if (!isArray(cur) && cur.token[0] === 'string') {
      let fixedOffset = 0;

      cur.token[1] = cur.token[1].split(/(#{[^{}]*?})/)
        .reduce((prev, x) => {
          if (x.indexOf('#{') === 0 && x.substr(-1) === '}') {
            prev.push(self.partial(x.substr(2, x.length - 3), cur, fixedOffset + 3).tree);
          } else {
            prev.push(x);
          }

          fixedOffset += x.length;

          return prev;
        }, []);
      continue;
    }

    // compose definition calls
    if (!isArray(prev) && prev.token[0] === 'def' && !prev.token[2]) {
      let subTree = [];

      // FIXME: dedupe...
      if (isArray(cur)) {
        Object.defineProperty(prev, '_args', { value: true });
        tokens.splice(i, 1);
        // FIXME: more helpers
      } else if (cur.token[0] === 'expr' && cur.token[2] === 'equal') {
        Object.defineProperty(prev, '_body', { value: true });
        subTree = fixChunk(tokens, i);
      }

      // FIXME: more helpers
      if (!isArray(next) && next.token[0] === 'expr' && next.token[2] === 'equal' && !prev._body) {
        Object.defineProperty(prev, '_body', { value: true });
        subTree = fixChunk(tokens, i);
      }

      // discard token separator
      if (prev._body && !prev._args) {
        tokens.splice(i, 1);
      }

      // flag definition for memoization
      if (prev.token[1].substr(-1) === '!') {
        prev.token[1] = prev.token[1].replace('!', '');
        prev._memo = true;
      }

      // update token definition
      prev.token[2] = {
        args: prev._args ? fixArgs(cur, true) : null,
        body: prev._body ? fixTree(subTree.slice(1)) : null,
      };
      continue;
    }

    // FIXME: compose lambda-calls with multiple arguments... helpers!!
    if (
      !isArray(cur)
      && !isArray(next)
      && cur.token[0] === 'unit'
      && ((next.token[0] === 'expr' && next.token[2] === 'or') || (next.token[0] === 'fx' && next.token[2] === 'func'))
    ) {
      const offset = tokens.slice(i).findIndex(x => !isArray(x) && x.token[0] === 'fx' && x.token[2] === 'func');

      if (offset !== -1) {
        const cutBody = tokens.slice(i).findIndex(x => !isArray(x) && x.token[0] === 'expr' && hasSep(x.token[1]));
        const cutOffset = cutBody >= 0 ? cutBody : tokens.length - offset;
        const fixedTokens = tokens.splice(i, cutOffset + 1);

        tokens.splice(i, 1, toToken(['fn', '$', {
          args: fixArgs(fixedTokens.slice(0, offset), true),
          body: fixTree(fixedTokens.slice(offset + 1)),
        }]));
      }
      continue;
    }

    tokens[i] = cur;
  }

  return tokens;
}

export function fixValues(tokens, cb, y) {
  if (isArray(tokens[0])) {
    const subTree = tokens.map(x => fixValues(x, cb, y));

    return y && subTree.length === 1
      ? subTree[0]
      : subTree;
  }

  const subTree = cb(tokens);

  if (y
    && Array.isArray(subTree)
    && subTree.length === 1 && typeof subTree[0] !== 'string'
  ) {
    return subTree[0];
  }

  return subTree;
}

export function fixBinding(obj, name, alias, context) {
  let target;

  // FIXME: load from well-knwon symbols, and for external sources?
  // e.g. white-list or allow most methods as they are?
  switch (obj) {
    case 'Object':
    case 'String':
    case 'Array':
    case 'Math':
      target = Function.prototype.call.bind(global[obj].prototype[name]);
      break;
    default: {
      // FIXME: for browser usage, decouple this...
      const fs = require('fs');
      const path = require('path');

      const srcDir = context.filepath
        ? path.dirname(context.filepath)
        : process.cwd();

      const srcFile = path.resolve(srcDir, obj);

      // FIXME: cache this shit... also, disable for browser!! (or replace...)
      if (fs.existsSync(srcFile)) {
        if (srcFile.indexOf('.js') === srcFile.length - 3) {
          let def = require(srcFile);

          // normalize default-exported functions
          def = typeof def === 'function'
            ? { default: def }
            : def;

          if (def) {
            target = def[name];
          }
        } else {
          const ast = context.include(fs.readFileSync(srcFile).toString(), srcFile).tree;

          for (let i = 0; i < ast.length; i += 1) {
            const subTree = ast[i];

            for (let j = 0; j < subTree.length; j += 1) {
              const node = subTree[j];

              if (!isArray(node) && node.token[0] === 'def' && node.token[1] === name && node._body) {
                // rename matching definition if it's aliased!
                fixValues(node.token[2].body, x => x.map(y => {
                  if (!isArray(y) && y.token[0] === 'def' && y.token[1] === name && alias) y.token[1] = alias;
                  return y;
                }));

                return node.token[2];
              }
            }
          }
        }
      }

      if (!target) {
        throw new Error(`Missing \`${name}\` binding from \`${obj}\``);
      }
    }
      break;
  }

  // FIXME: this would lead to disasters?
  if (typeof target !== 'function') {
    return {
      body: [toToken(tokenize(target))],
    };
  }

  return {
    body: [toToken(['bind', [obj, name, target]])],
  };
}

export function buildTree(tokens) {
  let root = [];

  const tree = root;
  const stack = [];
  const offsets = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];

    // handle nesting
    // FIXME: more helpers
    if (['open', 'close'].includes(t.token[0])) {
      if (t.token[0] === 'open') {
        const leaf = [];

        root.push(leaf);
        stack.push(root);
        offsets.push(t);
        root = leaf;
      } else {
        root = stack.pop();
        offsets.pop(t);
      }
    } else {
      if (!root) {
        throw new LangErr('Unexpected end, missing `(`', tokens[i - 1]);
      }

      root.push(t);
    }
  }

  if (stack.length) {
    const fixedOffset = offsets.pop();
    const fixedToken = fixedOffset.token[1];

    throw new LangErr(`Missing terminator for \`${fixedToken}\``, fixedOffset);
  }

  return tree;
}

export function highestCommonFactor(a, b) {
  return b !== 0 ? highestCommonFactor(b, a % b) : a;
}

export function toFraction(number) {
  const decimals = number.toString().match(/\.0+\d/);
  const length = Math.max(decimals ? decimals[0].length : 3, 3);

  // adjust correction from zero-left padded decimals
  const div = parseInt(`1${Array.from({ length }).join('0')}`, 10);
  const base = Math.floor(parseFloat(number) * div) / div;

  const [left, right] = base.toString().split('.');

  if (!right) {
    return `${left}/1`;
  }

  let numerator = left + right;
  let denominator = 10 ** right.length;

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

export function toValue(token) {
  let value = token[1];

  if (token[0] === 'range') {
    return token[1].toString();
  }

  if (token[0] === 'string') {
    return token[1].join('');
  }

  if (token[0] === 'number' && value instanceof Date) {
    return value.toString().split(' ').slice(0, 5).join(' ');
  }

  if (token[0] === 'number') {
    if (value >= Number.MAX_SAFE_INTEGER) {
      return value.toString().replace(/e[+-]/i, '^');
    }

    const sub = value.toString().match(/^.*?\.0+\d{1,3}/);

    if (!sub) {
      value = parseFloat(value).toFixed(2).replace(/\.0+$/, '');
    } else value = sub[0];

    return value.replace(/(?<=\.\d+)0+$/, '');
  }

  // simplify decimals
  if (token[0] === 'number' && typeof value === 'string' && value.includes('.')) {
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

export function toList(tokens) {
  return tokens.map(x => (isArray(x) ? toList(x) : x.token));
}

export function toSlice(begin, tokens, endOffset) {
  return endOffset >= 0 ? tokens.splice(begin, endOffset) : tokens.splice(begin);
}

export function toProperty(value) {
  return value.substr(1).replace(/-([a-z])/g, (_, prop) => prop.toUpperCase());
}

export function toArguments(keys, values) {
  const props = keys.filter(x => x.token[0] === 'unit');

  // compute a map from given units and values
  return props.reduce((prev, cur) => {
    prev[cur.token[1]] = { body: [values.shift()] };
    return prev;
  }, {});
}

export function toInput(token, cb, z) {
  if (isArray(token[0])) {
    return token.map(x => toInput(x, cb, z));
  }

  // handle lambda-calls as side-effects
  if (token[0] === 'fn') {
    const fixedArgs = { ...z };

    return (...context) => {
      const newArgs = toArguments(token[2].args, context.map(x => toToken(tokenize(x))));

      return cb(token[2].body.slice(), Object.assign(fixedArgs, newArgs));
    };
  }

  // return range-expressions as is...
  if (token[0] === 'range') {
    return token[2];
  }

  // intermediate state for objects
  if (token[0] === 'object') {
    if (isArray(token[1])) {
      return fixValues(token[1], x => x.map(y => toInput(y.token, cb, z)), true);
    }

    Object.keys(token[1]).forEach(k => {
      const fixedTokens = token[1][k].map(x => (isArray(x) ? fixArgs(x) : x));

      let fixedValue = cb && !isArray(fixedTokens[0])
        ? cb(fixedTokens)
        : fixedTokens;

      if (isArray(fixedValue[0])) {
        fixedValue = ['object', fixedValue];
      } else if (fixedValue[0] === 'object') {
        fixedValue = fixedValue[1];
      }

      delete token[1][k];

      token[1][toProperty(k)] = fixedValue;
    });
  }

  // plain values
  let fixedValue = token[1];

  if (token[0] === 'string') fixedValue = fixedValue.reduce((p, c) => p + c, '');
  if (token[0] === 'number') fixedValue = parseFloat(toNumber(fixedValue));

  return fixedValue;
}

export function toPlain(values, raw, cb) {
  if (!cb) {
    cb = x => x.map(y => (!isArray(y) ? toInput(y.token) : y));
  }

  if (isArray(values)) {
    return cb(values.map(x => toPlain(x, raw, cb)));
  }

  if (!values || typeof values !== 'object') {
    return values;
  }

  const copy = {};

  Object.keys(values).forEach(key => {
    if (raw) {
      copy[key] = !isArray(values[key])
        ? toPlain(values[key], raw, cb)
        : cb(values[key]);
      return;
    }

    const fixedValue = values[key].slice();

    if (fixedValue[0] === 'object') {
      fixedValue[1] = Object.keys(fixedValue[1]).reduce((prev, k) => {
        prev[k] = cb(fixedValue[1][k]);
        return prev;
      }, {});
    }

    copy[key] = fixedValue;
  });

  return copy;
}
