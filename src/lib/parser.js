import {
  TIME_UNITS, CURRENCY_MAPPINGS,
} from './convert';

const TAG_TYPES = ['blockquote', 'heading', 'em', 'b', 'code', 'text'];

const OP_TYPES = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
  ',': 'or',
};

const RE_NUM = /^-?\.?\d|^.?\w+\s*\d/;
const RE_DAYS = /^(?:now|today|tonight|tomorrow|yesterday|weekend)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::?[0-5]?[0-9])*(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)/i;

export const isIn = (x, a, b) => x >= a && x <= b;
export const isOp = (a, b = '') => `${b}-+=*/;_`.includes(a);
export const isSep = (a, b = '') => `${b}(|:;,)`.includes(a);
export const isChar = (a, b = '') => /^[a-zA-Z]+\S*$/.test(a) || b.includes(a);

export const isFmt = x => /^[_*~]$/.test(x);
export const isNth = x => /^\d+(?:t[hy]|[rn]d)$/.test(x);
export const isAny = x => /^[^\s\w\d_*~$€£¢%()|:;_,.+=*/-]$/.test(x);
export const isInt = x => typeof x === 'number' || /^-?(?!0)\d+(\.\d+)?$/.test(x);
export const isNum = x => /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const isExpr = x => /^(?:from|for|to|of|a[ts]|in)$/i.test(x);
export const isTime = x => TIME_UNITS.includes(x);
export const isMoney = x => CURRENCY_MAPPINGS[x];
export const isJoin = x => '_,.'.includes(x);

export const getOp = x => OP_TYPES[x];

export const hasNum = x => RE_NUM.test(x);
export const hasDays = x => RE_DAYS.test(x);
export const hasMonths = x => RE_MONTHS.test(x);
export const hasTagName = x => TAG_TYPES.includes(x);

export const highestCommonFactor = (a, b) => {
  return b !== 0 ? highestCommonFactor(b, a % b) : a;
};

export const hasPercent = x => {
  return typeof x === 'string' && x.charAt(x.length - 1) === '%';
};

export const hasKeyword = (x, units) => {
  if (!x) return false;

  const key = x.replace(/^[^a-zA-Z]*/g, '');
  const test = key && (units[key] || units[key.toLowerCase()]);

  return test;
};

export const hasDatetime = x => {
  return x && (RE_MONTHS.test(x) || RE_DAYS.test(x) || RE_HOURS.test(x));
};

export function toFraction(number) {
  const decimals = number.toString().match(/\.0+\d/);
  const length = Math.max(decimals ? decimals[0].length : 3, 3);

  // adjust correction from zero-left padded decimals
  const div = parseInt(`1${Array.from({ length }).join('0')}`);
  const base = Math.floor(parseFloat(number) * div) / div;

  const [left, right] = base.toString().split('.');

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

    return value.replace(/[^%a-z\s\d.-]/ig, '');
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
  if (value.includes('.')) {
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

export function joinTokens(data, units, types) {
  const buffer = [];

  let offset = 0;
  let hasDate = false;
  let hasUnit = false;

  for (let i = 0; i < data.length; i += 1) {
    const cur = data[i];
    const next = data[i + 1];

    // accumulated tokens from current line
    const stack = buffer[offset] || (buffer[offset] = []);

    // last added token on the stack
    const oldChar = stack[stack.length - 1]
      || (buffer.length > 1 && buffer[offset - 1][0]);

    if (
      // handle unit expressions, with numbers
      (cur === ' ' && !hasUnit && hasNum(oldChar) && !hasNum(next) && hasKeyword(next, units))

      // handle and validate hours
      || (hasNum(oldChar) && cur === ' ' && RE_HOURS.test(oldChar + cur + next))
      || (isInt(oldChar) && cur === ' ' && ['am', 'pm'].includes(next))
      || (cur === ':' && isIn(oldChar, 0, 24) && isIn(next, 0, 60))
    ) {
      if (stack.length) {
        buffer[offset++] = [oldChar + cur + next];
      } else {
        buffer.splice(offset - 1, 2, [oldChar + cur + next]);
      }

      hasUnit = !hasNum(next);
      data.splice(i - 1, 1);
      stack.pop();
      continue;
    }

    // keep basic month-format together
    if (hasMonths(oldChar) && cur === ' ' && (isInt(next) || isNth(next))) {
      stack[stack.length - 1] += cur + (next || '');
      data.splice(i, 1);
      hasDate = true;
      continue;
    }

    // keep previous month-format plus year
    if (hasDate && oldChar === ',' && cur === ' ' && isInt(next)) {
      buffer.splice(offset - 2, 1, [buffer[offset - 2] + oldChar + cur + next]);
      buffer[--offset] = [];
      data.splice(i, 1);
      hasDate = false;
      continue;
    }

    // reset flags to continue
    hasDate = hasDate && !isInt(cur);
    hasUnit = !!types[cur];

    let key = i;
    let nextToken;

    do { nextToken = data[++key]; } while (nextToken === ' ');

    // concatenate until we reach ops/units
    if (
      (!isOp(nextToken, '()')
        && (isChar(cur) || cur === ' ')
        && !(isSep(stack[0]) || isOp(stack[0])))

      // handle other ops between words...
      || (isChar(oldChar) && (isSep(cur, ' ') || (next === ',' || next === ' ')))
      || ((next === '-' && isChar(cur) && isChar(stack[0])) || (cur === '-' && isChar(next)))
    ) {
      // make sure we're not adding units... or keywords
      if (cur !== ' ' && !(hasNum(oldChar) || isExpr(cur) || hasKeyword(cur, units))) {
        stack.push(cur);
        continue;
      }
    }

    // handle fractions
    if (isInt(oldChar) && cur === '/' && isInt(next)) {
      buffer.splice(i - 1, 2, [oldChar + cur + next]);
      data.splice(i, 1);
      stack.pop();
      continue;
    }

    // otherwise, just continue splitting...
    if (!buffer[offset].length) offset--;
    buffer[++offset] = [cur];
    offset++;
  }

  return buffer.map(x => x.join(''));
}

export function parseBuffer(text, fixeds) {
  let inFormat = false;
  let inBlock = false;
  let offset = 0;
  let open = 0;

  const chars = text.replace(/\s/g, ' ').split('');
  const tokens = [];
  const types = {};

  for (let i = 0; i < chars.length; i += 1) {
    const buffer = tokens[offset] || (tokens[offset] = []);

    // consume fixed-length units first...
    const fixedUnit = (!chars[i - 1] || isAny(chars[i - 1])) && fixeds(chars.slice(i));
    const [fixedValue, fixedType] = fixedUnit || [];

    if (fixedType && (!chars[i + fixedValue.length] || isAny(chars[i + fixedValue.length]))) {
      tokens[offset] = [fixedValue];
      types[fixedValue] = fixedType;
      chars.splice(i + 1, fixedValue.length - 1);
      continue;
    }

    const last = buffer[buffer.length - 1];
    const line = buffer.join('');
    const next = chars[i + 1];
    const cur = chars[i];

    if (!inBlock) {
      // skip closing chars if they're not well paired
      if (!open && cur === ')') {
        buffer.push(cur);
        continue;
      }

      if (cur === '(') open++;
      if (cur === ')') open--;

      // enable backticks
      if (cur === '`') {
        inFormat = !inFormat;

        if (inFormat) {
          tokens[++offset] = [cur];
        } else {
          buffer.push(cur);
          offset++;
        }

        continue;
      }

      // enable headings/blockquotes, skip everything
      if ('#>'.includes(cur) && i === 0) inBlock = true;

      // allow skip from open/close formatting chars
      if (isFmt(cur) && last === cur) {
        inFormat = !inFormat;

        // stop concatenation!
        if (!inFormat) {
          buffer.push(cur);
          continue;
        }
      }
    }

    if (
      inFormat || inBlock || typeof last === 'undefined'

      // percentages
      || (hasNum(last) && cur === '%')

      // non-keywords
      || (isAny(cur) && last !== ' ')
      || (isMoney(last) && hasNum(cur))

      // keep words and numbers together
      || (isNum(last) && isNum(cur)) || (isChar(last) && isChar(cur))
      || (isNum(last) && isChar(cur)) || (isChar(last) && isNum(cur))

      // keep some separators between numbers
      || (isJoin(last) && isNum(cur)) || (isNum(last) && isJoin(cur) && isNum(next))

      // handle numbers, including negatives between ops; notice all N-N are splitted
      || (((last === '-' && cur === '.' && isNum(next)) || (last === '-' && isNum(cur))) && next !== last)
    ) {
      // make sure we're skipping from words
      if (last && isChar(last) && isSep(cur, '.') && !isNum(next)) {
        tokens[++offset] = [cur];
      } else {
        buffer.push(cur);
      }
    } else {
      tokens[++offset] = [cur];
    }
  }

  return {
    tokens: tokens.map(l => l.join('')),
    types,
  };
}

export function buildTree(tokens) {
  let ops = false;
  let root = [];
  let depth = 0;

  const tree = root;
  const stack = [];
  const calls = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];

    // fix nested-nodes
    if (t[0] === 'def' && t[2]) {
      t[2] = buildTree(t[2]);
    }

    // handle nesting
    if (t[0] === 'open' || t[0] === 'close') {
      if (t[0] === 'open') {
        const leaf = [];

        root._offset = i;
        root.push(leaf);
        stack.push(root);
        root = leaf;
        ops = false;
      } else {
        root = stack.pop();
        ops = false;
      }
    } else {
      if (isOp(t[1])) ops = true;
      root.push(t);
    }
  }

  // handle exceptions
  if (depth || calls.length || stack.length) {
    depth = depth || (calls[0] || stack[0])._offset;

    const err = new Error(`Missing terminator for \`${
      tokens.slice(0, Math.max(2, depth + 1)).map(x => x[1]).join('')
    }\``);

    err.offset = depth;

    throw err;
  }

  return tree;
}

export function cleanTree(ast) {
  return ast.reduce((prev, cur) => {
    // skip non math-tokens
    if (hasTagName(cur[0])) return prev;

    // clean arguments/body from definitions...
    if (cur[0] === 'def' && Array.isArray(cur[2])) prev.push([cur[0], cur[1], cleanTree(cur[2])]);
    else if (Array.isArray(cur[0])) prev.push(cleanTree(cur));
    else prev.push(cur);

    return prev;
  }, []);
}
