import {
  hasSep, hasTagName, hasPercent,
} from './shared';

import ParseError from './error';

export function highestCommonFactor(a, b) {
  return b !== 0 ? highestCommonFactor(b, a % b) : a;
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
    const sub = value.toString().match(/^.*?\.0+\d{1,3}/);

    if (!sub) {
      value = value.toFixed(2).replace(/\.0+$/, '');
    } else value = sub[0];
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

export function toList(tokens, nums) {
  const normalized = [];

  let chunks = [];

  for (let i = 0; i < tokens.length; i += 1) {
    if (!tokens[i]) continue;

    if (tokens[i][0] === 'expr' && hasSep(tokens[i][1])) {
      normalized.push(chunks);
      chunks = [];
      continue;
    }

    if (nums !== false) {
      const lastValue = chunks[chunks.length - 1] || [];

      if (lastValue[0] === 'number' && tokens[i][0] === 'number') {
        normalized.push(chunks);
        chunks = [tokens[i]];
        continue;
      }
    }

    chunks.push(tokens[i]);
  }

  if (chunks.length) {
    normalized.push(chunks);
    chunks = [];
  }

  return normalized;
}

export function toToken(token, fromCallback, arg1, arg2, arg3, arg4) {
  if (Array.isArray(token)) {
    const fixedToken = token.slice();

    fixedToken._offset = token._offset;

    return fixedToken;
  }

  const retval = fromCallback(token.content, arg1, arg2, arg3, arg4);

  if (!retval) {
    throw new ParseError(`Unexpected token \`${token.content}\``, token);
  }

  retval._offset = [token.begin, token.end]

  return retval;
}

export function fixTokens(ast, flatten) {
  if (!Array.isArray(ast[0])) return ast;

  const target = ast[0][0] === 'symbol' ? {} : [];
  const array = Array.isArray(target);

  let lastKeyName;
  let keyName;

  return ast.reduce((prev, cur) => {
    if (cur[0] === 'expr' && cur[1] === ',') return prev;

    // flatten nested tokens...
    while (cur.length === 1) cur = cur[0];

    if (array) {
      prev.push(fixTokens(cur));
      return prev;
    }

    if (!keyName && ['unit', 'symbol'].includes(cur[0])) {
      keyName = cur[1];

      if (cur[2]) {
        prev[keyName] = cur[2];
        lastKeyName = keyName;
        keyName = null;
      }
    } else if (keyName) {
      const sub = fixTokens(cur);

      // avoid wrapping tokens twice...
      prev[keyName] = (flatten !== false && Array.isArray(sub[0])) ? sub : [sub];
      lastKeyName = keyName;
      keyName = null;
    } else if (prev[lastKeyName]) {
      prev[lastKeyName].push(cur);
    }

    return prev;
  }, target);
}

export function fixStrings(tokens, split) {
  return tokens.reduce((prev, cur) => {
    if (
      prev.length
      && cur[0] === 'text'
      && prev[prev.length - 1][1] !== '\n'
      && prev[prev.length - 1][0] === 'text'
      && (split === false || !cur[1].includes(' '))
    ) {
      if (!cur._offset) {
        prev.push(cur);
      } else {
        prev[prev.length - 1][1] += cur[1];
        prev[prev.length - 1]._offset[1] = cur._offset[1];
      }
    } else {
      prev.push(cur);
    }

    return prev;
  }, [])
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

    last.push(cur);

    // normalize raw separators
    if (cur[0] === 'expr' && (flatten === null ? cur[1] === null : hasSep(cur[1]))) {
      last.pop();
      offset++;
    }
  }

  if (flatten === null) {
    return stack.reduce((prev, cur) => {
      const firstValue = cur.findIndex(t => t[0] !== 'text');

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
