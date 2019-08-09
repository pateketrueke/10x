import {
  TIME_UNITS, CURRENCY_MAPPINGS, ALPHA_MAPPINGS,
} from './convert';

const TAG_TYPES = ['blockquote', 'comment', 'heading', 'check', 'em', 'b', 'code', 'text'];

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
  '||': 'x-or',
  '~>': 'void',
  '|>': 'rpipe',
  '<|': 'lpipe',
  '<': 'lt',
  '>': 'gt',
  '[': 'begin',
  ']': 'end',
  '{': 'begin',
  '}': 'end',
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

export const isFx = y => y && y.length >= 2 && '-+=~:<!|&>'.includes(y[0]);
export const isOp = (a, b = '') => `${b}-+=~<!|&>*/`.includes(a);
export const isSep = (a, b = '') => `${b}{[]}|;,`.includes(a);
export const isChar = (a, b = '') => /^[a-zA-Z]+/.test(a) || b.includes(a);

export const isFmt = x => /^["`_*~]$/.test(x);
export const isNth = x => /^\d+(?:t[hy]|[rn]d)$/.test(x);
export const isAny = (x, a = '') => /^[^\s\w\d_*~$€£¢%({[~<!>\]})"`|:;_,.+=*/-]$/.test(x) || a.includes(x);
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
export const hasOwnKeyword = (o, k) => Object.prototype.hasOwnProperty.call(o, k) && o[k];

export const highestCommonFactor = (a, b) => {
  return b !== 0 ? highestCommonFactor(b, a % b) : a;
};

export const hasPercent = x => {
  return typeof x === 'string' && x.charAt(x.length - 1) === '%';
};

export const hasKeyword = (x, units) => {
  if (!x) return false;

  const key = x.replace(RE_NO_ALPHA, '');
  const test = key && (hasOwnKeyword(units, key) || hasOwnKeyword(units, key.toLowerCase()));

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
  if (typeof value === 'string') {
    // handle JSON-values
    // if (value.charAt() === '"' && value[value.length - 1] === '"') {
    //   if (
    //     (value[1] === '[' && value.charAt(value.length - 2) === ']')
    //     || (value[1] === '{' && value.charAt(value.length - 2) === '}')
    //   ) {
    //     // this would allow to parse well-formed objects?
    //     value = value.substr(1, value.length - 2);
    //     value = value.replace(/\\(?!\\)/g, '');
    //   }

    //   return JSON.parse(value);
    // }

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

    // handle placeholders
    if (
      (cur === '_'
        && (isSep(next, ' ') || isOp(next) || isFx(next))
        && (isSep(oldChar, ' ') || isOp(oldChar) || isFx(oldChar))
        ) || (data[i - 1] === '_' && (isSep(cur, ' ') || isOp(cur) || isFx(cur)))
    ) {
      stack.push(cur);
      inFmt = false;
      continue;
    }

    // keep formatting blocks together
    if (inFmt && oldChar.indexOf(cur) === 0) {
      buffer[offset - 1].push(cur);
      buffer.length = offset;
      inFmt = false;
      continue;
    }

    // handle unit expressions, with numbers
    if (cur === ' ' && !hasUnit && hasNum(oldChar) && !hasNum(next) && hasKeyword(next, units)) {
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
    if (isFmt(cur[0]) && cur[1] !== '>' && (cur.length === 2 || cur !== '*')) {
      inFmt = !inFmt;
    } else if (inFmt) {
      buffer[offset - 1].push(cur);
      buffer.length = offset;
      continue;
    }

    if (
      // glue ISO-dates together
      (hasNum(cur)
        && hasDatetime(oldChar) === 'ISO'
        && cur.charAt() === '.' && cur.charAt(cur.length - 1) === 'Z')

      // glue hours together
      || ((isInt(oldChar) || (hasNum(oldChar) && oldChar[oldChar.length - 1] === ':')) && cur[0] === ':' && hasNum(cur))
    ) {
      buffer[offset - 1].push(cur);
      buffer.length = offset;
      continue;
    }

    if (
      // keep hours-like values together
      (isInt(oldChar) && cur === ' ' && ['am', 'pm'].includes(next))

      // keep symbol-like values together
      || (oldChar[0] === ':' && isOp(cur, ':') && (isInt(next) || isChar(next)))
    ) {
      buffer[offset - 1].push(cur + next);
      buffer.splice(offset, 1);
      data.splice(i, 1);
      stack.pop();
      continue;
    }

    // flag well-known date formats
    if (hasMonths(cur)) hasDate = true;

    if (
      // handle fractions,
      (isInt(oldChar) && cur === '/' && isInt(next))

      // skip numbers within parenthesis
      || (!inCall && (oldChar === '(' && hasNum(cur) && next === ')'))

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
    if ((isChar(cur) || isFx(cur)) && nextToken === '(') inCall = true;
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

      if (
        // enable headings/blockquotes, skip everything
        ('#>'.includes(cur) && i === 0)

        // enable comments, skip everything
        || (last === '/' && '/*'.includes(cur))
      ) inBlock = true;
    } else if (
      // disable multiline-style comments
      cur === '*'
      && next === '/'
      && buffer.join('').includes('/*')
      && buffer.join('').indexOf('/*') <= Math.max(0, buffer.join('').indexOf('//'))
    ) {
      inBlock = false;
    }

    if (
      inBlock || typeof last === 'undefined'

      // non-keywords
      || (last === '\\')
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

      // handle checkboxes
      || (last === '[' && next === ']') || (' x'.includes(last) && cur === ']' && chars[i - 2] === '[')

      // handle numbers, including negatives between ops; notice all N-N are splitted
      || (((last === '-' && cur === '.' && isNum(next)) || (last === '-' && isNum(cur))) && next !== last)

      // keep some logical operators together
      || ('!='.includes(last) && cur === '~')
      || ('+-'.includes(last) && cur === last)
      || ('.|&'.includes(last) && last === cur)
      || ('!<>='.includes(last) && cur === '=')
      || (last === ':' && (cur === ':' || hasNum(cur) || isChar(cur)))
      || ('|~'.includes(last) && cur === '>') || (last === '<' && cur === '|')

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
    if (['open', 'close'].includes(t[0]) || ['begin', 'end'].includes(t[2])) {
      if (t[0] === 'open' || t[2] === 'begin') {
        const leaf = [];

        // flag tokens for further detection...
        if (t[1] === '{') root._object = true;
        if (t[1] === '[') root._array = true;

        root._offset = i;
        root.push(leaf);
        stack.push(root);
        root = leaf;
      } else {
        root = stack.pop();
      }
    } else {
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

// FIXME: cleanup...
export function fixToken(ast) {
  if (!Array.isArray(ast[0])) return ast;

  const target = ast[0][0] === 'symbol' ? {} : [];
  const array = Array.isArray(target);

  let lastKeyName;
  let keyName;

  return ast.reduce((prev, cur) => {
    if (cur[0] === 'expr' && cur[1] === ',') return prev;

    if (array) {
      prev.push(fixToken(cur));
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
      // console.log(2,{keyName,cur});
      prev[keyName] = [fixToken(cur)];
      lastKeyName = keyName;
      keyName = null;
    } else if (prev[lastKeyName]) {
      prev[lastKeyName].push(cur);
    }

    return prev;
  }, target);
}

export function fixArgs(values) {
  let offset = 0;

  const stack = [];

  // flatten all single-nodes
  while (values.length === 1) values = values[0];

  // break values into single arguments
  for (let i = 0; i < values.length; i += 1) {
    const last = stack[offset] || (stack[offset] = []);
    const cur = values[i];

    last.push(cur);

    if (cur[0] === 'expr' && cur[1] === ',') {
      last.pop();
      offset++;
    }
  }

  return stack;
}

export function fixTree(ast) {
  const tokens = ast.filter(x => !hasTagName(x[0]));

  let sym = false;
  let arr = ast._array;
  let obj = ast._object;

  for (let i = 0; i < tokens.length; i += 1) {
    let cur = Array.isArray(tokens[i][0])
      ? fixTree(tokens[i])
      : tokens[i];

    const prev = tokens[i - 1];
    const next = tokens[i + 1];

    // compose all tokens, or before a terminator ; char
    if (prev && prev[0] === 'symbol' && ['unit', 'symbol', 'number'].includes(cur[0])) {
      let subTree;

      const rightNext = tokens[i + 2];

      // collect all ops from tokens
      if (next && next[0] === 'expr' && isOp(next[1])) {
        prev[2] = fixToken(tokens.splice(i, i + tokens.length));
        continue;
      }

      // ensure we consume from lists only!
      if (rightNext && rightNext[0] === 'expr' && rightNext[1] === ',') {
        const cut = tokens.slice(i + 1).indexOf(';');
        const offset = cut !== -1 ? cut : tokens.length - 1;

        subTree = fixTree(tokens.splice(i, i + offset).slice(1));
      } else {
        subTree = fixTree(next || []);
        tokens.splice(i, next ? 2 : 1);
      }

      // keep side-effects without modification
      if (Array.isArray(subTree[0]) && subTree[0][0] !== 'fx') {
        cur[2] = fixToken(subTree);
        prev[2] = ['object', cur];
      } else if (!prev[2]) {
        // skip :symbol continuations
        if (next && next[0] === 'symbol' && !['unit', 'symbol'].includes(cur[0])) {
          tokens.splice(i, 0, cur, subTree);
          continue;
        }

        prev[2] = prev[2] || (prev[2] = []);

        if (subTree.length) {
          prev[2].push(cur);

          // skip from expressions
          if (subTree[0] !== 'expr') {
            prev[2].push(subTree);
          }
        } else {
          prev[2].push(cur);

          // skip when tokens are not values...
          if (!(arr || obj) && ['unit', 'symbol'].includes(cur[0])) continue;

          // apply type, but only on valid tokens...
          if ((arr || obj) && ['unit', 'symbol'].includes(prev[2][0][0])) {
            prev[2][0][2] = arr ? [] : {};
            prev[2] = ['object', prev[2][0]];
          }
        }
      }
      continue;
    }

    if (cur[0] === 'def' && Array.isArray(cur[2])) {
      cur = [cur[0], cur[1], fixTree(cur[2])];
    }

    tokens[i] = cur;
  }

  return tokens;
}
