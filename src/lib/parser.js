import {
  TIME_UNITS, CURRENCY_MAPPINGS, ALPHA_MAPPINGS,
} from './convert';

const TAG_TYPES = ['blockquote', 'heading', 'check', 'em', 'b', 'code', 'text'];

const OP_TYPES = {
  '!~': 'notlike',
  '!=': 'noteq',
  '==': 'iseq',
  '<=': 'lteq',
  '>=': 'gteq',
  '=~': 'like',
  '++': 'inc',
  '--': 'dec',
  '&&': 'and',
  '|>': 'rpipe',
  '<|': 'lpipe',
  '<': 'lt',
  '>': 'gt',
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
  ',': 'or',
  ';': 'k',
};

const RE_NUM = /^(?:-?\.?\d|[^()]?\w+\s*\d)(?![)])/;
const RE_ISO = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?/;
const RE_DATE = /^[a-z]{3}(?:\s\d{1,2})?(?:,\s(?:\d{2}|\d{4}))?$/i;
const RE_DAYS = /^(?:now|to(?:day|night|morrow)|yesterday|week(?:end)?)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::?[0-5]?[0-9])*(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)\b/i;
const RE_NO_ALPHA = new RegExp(`^[^a-zA-Z${Object.keys(ALPHA_MAPPINGS).join('')}]*`, 'g');

export const isIn = (x, a, b) => x >= a && x <= b;
export const isOp = (a, b = '') => `${b}-+=~<!&>*/`.includes(a);
export const isSep = (a, b = '') => `${b}|;,`.includes(a);
export const isChar = (a, b = '') => /^[a-zA-Z]+/.test(a) || b.includes(a);

export const isFmt = x => /^["`_*~]$/.test(x);
export const isNth = x => /^\d+(?:t[hy]|[rn]d)$/.test(x);
export const isAny = (x, a = '') => /^[^\s\w\d_*~$€£¢%(~<!>)"`|:;_,.+=*/-]$/.test(x) || a.includes(x);
export const isInt = x => typeof x === 'number' || /^-?(?!0)\d+(\.\d+)?$/.test(x);
export const isNum = x => /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const isExpr = x => /^(?:from|for|to|of|a[ts]|in)$/i.test(x);
export const isTime = x => TIME_UNITS.includes(x);
export const isMoney = x => CURRENCY_MAPPINGS[x];
export const isAlpha = x => ALPHA_MAPPINGS[x];
export const isJoin = x => '_.'.includes(x);

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

  const key = x.replace(RE_NO_ALPHA, '');
  const test = key && (units[key] || units[key.toLowerCase()]);

  return test;
};

export const hasDatetime = x => {
  if (x && RE_ISO.test(x)) return 'ISO';
  if (x && RE_DAYS.test(x)) return 'DAYS';
  if (x && RE_HOURS.test(x)) return 'HOURS';
  if (x && RE_MONTHS.test(x)) return 'MONTHS';
};

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
  let depth = 0;

  let inFmt = false;
  let inCall = false;

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

    // keep formatting blocks together
    if (inFmt && oldChar.indexOf(cur) === 0) {
      buffer[offset - 1].push(cur);
      inFmt = false;
      continue;
    }

    if (
      // handle unit expressions, with numbers
      (cur === ' ' && !hasUnit && hasNum(oldChar) && !hasNum(next) && hasKeyword(next, units))

      // handle and validate hours
      || (hasNum(oldChar) && cur === ' ' && RE_HOURS.test(oldChar + cur + next))
      || (isInt(oldChar) && cur === ' ' && ['am', 'pm'].includes(next))
      || (cur === ':' && isIn(oldChar, 0, 24) && isIn(next, 0, 60))
    ) {
      buffer.splice(offset - 1, 2, [oldChar + cur + next]);
      hasUnit = !hasNum(next);
      data.splice(i - 1, 1);
      stack.pop();
      continue;
    }

    // keep previous month-format plus year
    if (hasDate) {
      // break on given years...
      if (oldChar === ',' && cur === ' ' && isInt(next)) {
        stack.push(cur, next);
        data.splice(i, 1);
        hasDate = false;
        continue;
      }

      // break on any word...
      if (isChar(cur) || isOp(cur) || isAny(cur)) {
        buffer[++offset] = [stack[stack.length - 1]];
        buffer[++offset] = [cur];
        stack.pop();
        hasDate = false;
      }

      // keep eating tokens...
      if (cur === ' ' || cur === ',' || (isInt(cur) || isNth(cur))) {
        stack.push(cur);
      }

      continue;
    }

    // reset flags to continue
    hasDate = false;
    hasUnit = !!types[cur];

    let key = i;
    let nextToken;

    do { nextToken = data[++key]; } while (nextToken === ' ');

    // keep formatting block together, ** symbols required twice!
    if (isFmt(cur[0]) && (cur.length === 2 || cur !== '*')) {
      inFmt = !inFmt;
    } else if (inFmt) {
      buffer[offset - 1].push(cur);
      continue;
    }

    // glue ISO-dates together
    if (
      hasNum(cur)
      && hasDatetime(oldChar) === 'ISO'
      && cur.charAt() === '.' && cur.charAt(cur.length - 1) === 'Z'
    ) {
      buffer[offset - 1].push(cur);
      continue;
    }

    // flag well-known date formats
    if (hasMonths(cur)) hasDate = true;

    if (
      // handle fractions,
      (isInt(oldChar) && cur === '/' && isInt(next))

      // skip numbers within parenthesis
      || (!inCall && (oldChar === '(' && hasNum(cur) && next === ')'))

      // keep hour/seconds format together
      || (oldChar && oldChar.includes(':') && cur === ':' && hasNum(next))

      // keep mixed units together, e.g. ft-us
      || (
        hasKeyword(oldChar, units)
        && '/-'.includes(cur) && isChar(next)
        && hasKeyword(oldChar + cur + next, units)
      ) || (isInt(oldChar) && cur === ' ' && hasKeyword(next, units))
    ) {
      buffer.splice(offset - 1, 2, [oldChar + cur + next]);
      data.splice(i, 1);
      stack.pop();
      continue;
    }

    if (
      isAny(cur)

      // concatenate until we reach ops/units
      || (!isOp(nextToken, '()')
        && (isChar(cur) || cur === ' ')
        && !(isSep(stack[0]) || isOp(stack[0])))

      // handle other ops between words...
      || (next === '-' && isChar(cur) && !isOp(oldChar))
      || (cur === '-' && isChar(next) && !isOp(oldChar))
    ) {
      // make sure we're not adding units... or keywords
      if (cur !== ' ' && !(isExpr(next) || hasKeyword(next, units))) {
        stack.push(cur);
        continue;
      }
    }

    // flag possible def/call expressions
    if (isChar(cur) && nextToken === '(') inCall = true;
    if (cur === ';' || cur === ')') inCall = false;

    // otherwise, just continue splitting...
    if (!buffer[offset].length) offset--;
    buffer[++offset] = [cur];
    offset++;
  }

  return buffer.map(x => x.join(''));
}

export function parseBuffer(text, fixeds) {
  let inBlock = false;
  let offset = 0;
  let open = 0;

  const chars = text.replace(/\s/g, ' ').split('');
  const tokens = [];
  const types = {};

  for (let i = 0; i < chars.length; i += 1) {
    const buffer = tokens[offset] || (tokens[offset] = []);

    // consume fixed-length units first...
    const fixedUnit = fixeds(chars.slice(i));
    const [fixedValue, fixedType] = fixedUnit || [];

    if (fixedType) {
      if (i > 0) {
        tokens[offset] = [chars[i - 1]];
        tokens[++offset] = [fixedValue];
      } else {
        tokens[offset] = [fixedValue];
      }

      offset++;
      types[fixedValue] = fixedType;
      chars.splice(i, fixedValue.length - 1);
      continue;
    }

    const last = buffer[buffer.length - 1];
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

      // enable headings/blockquotes, skip everything
      if ('#>'.includes(cur) && i === 0) inBlock = true;
    }

    if (
      inBlock || typeof last === 'undefined'

      // non-keywords
      // || (isOp(cur) && isOp(last) && !hasNum(next))
      || (last === '[' && (cur === ' ' || cur === 'x'))
      || ((last === ' ' || last === 'x') && cur === ']')
      || (last === cur && isFmt(cur))
      || (last === '-' && isNum(cur))
      || (last !== ' ' && isAny(cur))
      || (hasNum(last) && cur === '%')
      || (isMoney(last) && hasNum(cur))
      || (isChar(last) && isAny(cur, ':'))
      || (last === ',' && isNum(cur) && !open)
      || (hasNum(last) && cur === ',' && isNum(next) && !open)

      // keep some separators between numbers
      || (isJoin(last) && isNum(cur)) || (isNum(last) && isJoin(cur) && isNum(next))

      // handle numbers, including negatives between ops; notice all N-N are splitted
      || (((last === '-' && cur === '.' && isNum(next)) || (last === '-' && isNum(cur))) && next !== last)

      // keep some logical operators together
      || ('!='.includes(last) && cur === '~')
      || ('+-'.includes(last) && cur === last)
      || ('!<>='.includes(last) && cur === '=')
      || (last === '|' && cur === '>') || (last === '<' && cur === '|')

      // keep chars and numbers together
      || ((isNum(last) || isChar(last)) && (isNum(cur) || isChar(cur)))
    ) {
      buffer.push(cur);
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
  if (calls.length || stack.length) {
    depth = (calls[0] || stack[0])._offset;

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
