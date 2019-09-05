export const isInt = x => /^-?(?!0)\d+(\.\d+)?$/.test(x);
export const isArray = x => x instanceof Array;

export const pad = (nth, length) => `     ${nth}`.substr(-length);
export const repeat = (char, length) => Array.from({ length }).join(char);
export const flatten = x => x.reduce((p, c) => p.concat(isArray(c) ? flatten(c) : c), []);

export const deindent = (text, length) => {
  const tabs = ((text.match(/^\s+/m) || [])[0] || '').substr(1);

  return text.split('\n').map(x => repeat(' ', length || 0) + x.substr(tabs.length)).join('\n').trim();
};

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
    return JSON.stringify(token[1].join(''));
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
