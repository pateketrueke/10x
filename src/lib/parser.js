import {
  TIME_UNITS, CURRENCY_MAPPINGS, ALPHA_MAPPINGS,
} from './convert';

import {
  reduceFromTokens
} from './reducer';

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
  '->': 'func',
  '<-': 'bind',
  '|>': 'rpipe',
  '<|': 'lpipe',
  '<': 'lt',
  '>': 'gt',
  '!': 'not',
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
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)\w*\b/i;
const RE_NO_ALPHA = new RegExp(`^[^a-zA-Z${Object.keys(ALPHA_MAPPINGS).join('')}]*`, 'g');

export const isFx = y => y && y.length >= 2 && '-+=~:<!|&>'.includes(y[0]);
export const isOp = (a, b = '') => `${b}-+=~<!|&>*/`.includes(a);
export const isSep = (a, b = '') => `${b}{[]}|;:,.`.includes(a);
export const isChar = a => /^[a-zA-Z]+/.test(a);

export const isFmt = x => /^["`_*~]$/.test(x);
export const isNth = x => /^\d+(?:t[hy]|[rn]d)$/.test(x);
export const isAny = (x, a = '') => /^[^\s\w\d_*~$€£¢%({[~<!>\]})"`|:;_,.+=*/-]$/.test(x) || a.includes(x);
export const isInt = x => typeof x === 'number' || /^-?(?!0)\d+(\.\d+)?$/.test(x);
export const isNum = x => /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const isExpr = x => /^(?:from|for|to|of|a[ts]|in)$/i.test(x);
export const isTime = x => TIME_UNITS.includes(x);
export const isMoney = x => CURRENCY_MAPPINGS[x];
export const isAlpha = x => ALPHA_MAPPINGS[x];
export const isUpper = x => /^[A-Z]+/.test(x);
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

export function parseBuffer(text, units) {
  let inBlock = false;
  let inFormat = false;

  let oldChar = '';
  let offset = 0;
  let open = 0;
  let row = 0;
  let col = -1;

  const chars = text.split('');
  const tokens = [];

  for (let i = 0; i < chars.length; i += 1) {
    const buffer = tokens[offset] || (tokens[offset] = []);
    const last = (buffer[buffer.length - 1] || {}).cur;
    const next = chars[i + 1];
    const cur = chars[i];

    // increase line/column
    if (last === '\n') {
      col = 0;
      row++;
    } else {
      col++;
    }

    // keep formatting blocks together
    if (!inBlock && !inFormat && isFmt(cur) && !isOp(last)) {
      if (cur === '*')  {
        inFormat = next === '*';
      } else if (cur === '_') {
        inFormat = isSep(last, '( )')
          && (next === '_' || isChar(next) || isNum(next));
      } else if (cur === '~') {
        inFormat = next !== '>';
      } else {
        inFormat = true;
      }

      if (inFormat) {
        if (buffer.length) tokens[++offset] = [{ cur, row, col }];
        else buffer.push({ cur, row, col });

        inFormat = [i, cur];
        continue;
      }
    }

    // disable formatting (avoid escapes)
    if (inFormat && inFormat[0] !== i - 1 && inFormat[1] === cur && last !== '\\' && cur !== next) {
      inFormat = false;
      buffer.push({ cur, row, col });
      continue;
    }

    if (!inFormat) {
      if (!inBlock) {
        // flag to allow numbers with commas as separators
        if (cur === '(' && isChar(oldChar)) open++;
        else if (cur === ')' && open) open--;

        if (
          // enable headings/blockquotes, skip everything
          ('#>'.includes(cur) && col === 1)

          // enable comments, skip everything
          || (last === '/' && '/*'.includes(cur))
        ) inBlock = cur === '*' ? 'multiline' : 'block';
      } else if (cur === '*' && next === '/') {
        // disable multiline-style comments
        if (inBlock === 'multiline') {
          buffer.push({ cur: cur + next, row, col: col + 1 });
          chars.splice(i, 1);
          inBlock = false;
          continue;
        }
      }
    }

    // FIXME: clean combinations...
    if (
      inBlock || inFormat || typeof last === 'undefined'

      // non-keywords
      || (last !== ' ' && isAny(cur))
      || (last === '-' && isNum(cur))
      || (last === '_' && isChar(cur))
      || (hasNum(last) && cur === '%')
      || (isMoney(last) && hasNum(cur))
      || (last === '.' && cur === '-' && isNum(next))
      || (buffer[0].cur === ':' && cur === '-' && isNum(next))
      || (hasNum(last) && cur === ',' && isNum(next) && !open)
      || (last === ',' && isNum(cur) && isNum(oldChar) && !open)
      || (last === '[' && cur === ']') || (last === '{' && cur === '}')
      || ((isChar(last) || hasNum(last)) && cur === '_' && (isChar(next) || hasNum(next)))
      || (isChar(last) && isAny(cur, ':') && !(':-'.includes(next) || isNum(next) || isChar(next)))

      // keep some separators between numbers
      || (isJoin(last) && isNum(cur)) || (isNum(last) && isJoin(cur) && isNum(next))

      // handle checkboxes
      || (' x'.includes(last) && cur === ']')
      || (last === '[' && !hasNum(cur) && next === ']')

      // handle numbers, including negatives between ops; notice all N-N are splitted
      || (((last === '-' && cur === '.' && isNum(next)) || (last === '-' && isNum(cur))) && next !== last)

      // keep some logical operators together
      || ('!='.includes(last) && cur === '~')
      || ('+-'.includes(last) && cur === last)
      || ('.|&'.includes(last) && last === cur)
      || ('!<>='.includes(last) && cur === '=')
      || ('-|~'.includes(last) && cur === '>') || (last === '<' && '|-'.includes(cur))
      || (last === ':' && (cur === ':' || hasNum(cur) || (isChar(cur) && !isUpper(cur))))

      // keep chars and numbers together
      || ((isNum(last) || isChar(last)) && (isNum(cur) || isChar(cur)))
      || (hasNum(last) && cur === '.' && next === '.')
    ) {
      buffer.push({ cur, row, col });

      // store for open/close checks
      if (last !== ' ') {
        oldChar = last;
      }
    } else {
      tokens[++offset] = [{ cur, row, col }];
    }
  }

  // re-assign tokens on the fly!
  return tokens.reduce((prev, cur, i) => {
    const oldestValue = i > 2 ? prev[prev.length - 3].content : null;
    const olderValue = i > 1 ? prev[prev.length - 2].content : null;
    const lastValue = i > 0 ? prev[prev.length - 1].content : null;
    const value = cur.map(t => t.cur).join('');

    // keep long-format dates, e.g. `Jun 10, 1987`
    if (hasMonths(oldestValue) && olderValue === ',' && isNum(value)) {
      prev[prev.length - 3].content += olderValue + lastValue + value;
      prev[prev.length - 3].end[1] = cur[cur.length - 1].col + 1;
      prev.pop();
      prev.pop();
      return prev;
    }

    if (
      // keep numbers and units together, e.g `5 days` or `$15,000 MXN`
      (hasNum(olderValue) && lastValue === ' ' && hasKeyword(value, units))

      // keep well-known date formats, e.g `Jun 10`, `Jun, 1987` or `Jun 10, 1987`
      || (hasMonths(olderValue) && ' ,'.includes(lastValue) && isNum(value))
    ) {
      prev[prev.length - 2].content += lastValue + value;
      prev[prev.length - 2].end[1] = cur[cur.length - 1].col + 1;
      prev.pop();
      return prev;
    }

    // FIXME: needed?
    // handle placeholders
    // keep hours-like values together
    // keep symbol-like values together
    // handle fractions,
    // skip numbers within parenthesis
    // keep mixed units together, e.g. ft-us

    prev.push({
      content: value,
      begin: value === '\n' ? [cur[0].row, cur[0].col] : [cur[0].row, cur[0].col],
      end: value === '\n' ? [cur[0].row, cur[0].col + 1] : [cur[cur.length - 1].row, cur[cur.length - 1].col + 1],
    });

    return prev;
  }, []);
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
      if (!root) {
        stack.push(t);
        break;
      }

      root.push(t);
    }
  }

  return tree;
}

// FIXME: cleanup...
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

export function fixArgs(values, flatten) {
  let offset = 0;

  const stack = [];

  // flatten all single-nodes
  if (flatten !== false) {
    while (values.length === 1) values = values[0];
  }

  // break values into single arguments
  for (let i = 0; i < values.length; i += 1) {
    const last = stack[offset] || (stack[offset] = []);
    const cur = values[i];

    last.push(cur);

    if (cur[0] === 'expr' && isSep(cur[1])) {
      last.pop();
      offset++;
    }
  }

  return stack;
}

export function fixInput(args, lpipe) {
  return args.filter(x => !hasTagName(x[0])).reduce((p, c) => p.concat(c[0] === 'expr' ? [c] : (
    lpipe ? [['expr', ',', 'or'], c] : [c, ['expr', ',', 'or']]
  )), []);
}

export function fixApply(kind, body, args) {
  if (!Array.isArray(args[0])) args = [];

  if (kind === 'lpipe') return [body].concat(fixInput(args, true));
  if (kind === 'rpipe') return fixInput(args).concat([body]);

  return [];
}

export function fixCalls(def, skip) {
  const tokens = def.filter(x => !hasTagName(x[0]));

  let args = [];

  // eat arguments from input, usually an array
  if (Array.isArray(tokens[0][0])) {
    args = tokens.shift();
  }

  for (let i = 0; i < tokens.length; i += 1) {
    const cur = tokens[i];
    const left = tokens[i - 1];
    const right = tokens[i + 1];

    // group unit-calls and arguments
    if (cur[0] === 'def' && !cur[2] && right && Array.isArray(right[0])) {
      tokens.splice(i + 1, 1);
      cur[2] = [right];
      continue;
    }

    // append all given tokens to previous unit-definitions
    if (left && left[0] === 'def' && cur[0] !== 'fx') {
      if (left[2] && cur[0] !== 'expr') {
        const cut = tokens.slice(i).findIndex(x => ['fx', 'expr'].includes(x[0]));
        const subTree = cut > 0 ? tokens.splice(i, cut) : tokens.splice(i);

        left[2][0] = left[2][0].concat(fixInput(subTree, true));
        continue;
      }
    }

    // handle units with single arguments
    if (left && left[0] === 'fx' && ['lpipe', 'rpipe'].includes(left[2]) && cur[0] === 'unit') {
      if (right && right[0] !== 'expr') {
        cur[0] = 'def';
        cur[2] = [[right]];
        tokens.splice(i + 1, 1);
        continue;
      }
    }

    // handle partial-application calls
    if (left && cur[0] === 'fx' && ['lpipe', 'rpipe'].includes(cur[2]) && right) {
      if (Array.isArray(left[0]) && right[0] === 'def' && tokens[i - 2]) {
        tokens[i - 2][0] = 'def';
        tokens[i - 2][2] = [left];
        tokens.splice(i - 3, 3, cur, tokens[i - 2]);
        continue;
      }

      // compose from previous calls
      if (left[0] === 'unit') {
        tokens.splice(i, 2, fixApply(cur[2], right, args));
        left._curry = cur.slice();
        left[0] = 'def';
        continue;
      }
    }

    // unit-calls without arguments receives _
    if (left
      && left[0] === 'fx'
      && cur[0] === 'unit'
      && (!right || (right[0] === 'expr' && isSep(right[1])))
    ) {
      cur[2] = [[['symbol', '_']]];
      cur[0] = 'def';
    }
  }

  return [].concat(args.length ? [args] : []).concat(tokens);
}

export function fixTree(ast) {
  let tokens = ast.filter(x => !hasTagName(x[0]));

  let arr = ast._array;
  let obj = ast._object;

  for (let i = 0; i < tokens.length; i += 1) {
    let cur = Array.isArray(tokens[i][0])
      ? fixTree(fixCalls(tokens[i]))
      : tokens[i];

    const prev = tokens[i - 1];
    const next = tokens[i + 1];

    // skip and merge empty leafs
    if (cur.length === 0) {
      if (prev && prev[0] === 'def') {
        tokens.splice(i, 1);
        prev[2] = [cur];
      }
      continue;
    }

    // look for partial-applications
    if (cur[0] === 'def' && cur[2]) {
      cur[2] = fixTree(cur[2]);

      if (!(arr || obj)) {
        cur[2] = fixCalls(cur[2]);
      }
    }

    // compose lambda-calls with multiple arguments...
    if (cur[0] === 'unit' && next && ((next[0] === 'expr' && next[1] === ',') || (next[0] === 'fx' && next[2] === 'func'))) {
      const offset = tokens.slice(i).findIndex(x => x[0] === 'fx' && x[2] === 'func');

      if (offset > 0) {
        const cut = tokens.slice(offset).findIndex(x => x[0] === 'expr' && isSep(x[1]));
        const endPos = cut >= 0 ? cut : tokens.length - offset;

        const args = tokens.splice(i, offset);
        const subTree = tokens.splice(i, endPos).slice(1);

        tokens.splice(i, 0, ['fn', '$', [args, fixTree(subTree)]]);
        break;
      }
    }

    if (next && next[0] === 'fx' && ['lpipe', 'rpipe'].includes(next[2]) && cur[0] !== 'symbol') {
      const offset  = tokens.slice(i).findIndex(x => x[0] === 'expr' || x[0] === 'fx');

      // make sure we're extending valid combinations...
      if (prev && prev[0] !== 'expr' && offset > 0) {
        if (prev[0] === 'def' && !prev[2]) {
          tokens.splice(i + 1, 0, ...fixCalls(tokens.splice(i + 1, i + offset - 1)));
          continue;
        }
      }

      // otherwise, we just fix everything!
      tokens.splice(i, i + tokens.length, ...fixCalls(tokens.slice(i)));
      while (tokens.length === 1) tokens = tokens[0];
      break;
    }

    // compose all tokens, or before a terminator ; char
    if (prev && prev[0] === 'symbol' && ['unit', 'symbol', 'number'].includes(cur[0])) {
      let subTree;

      const rightNext = tokens[i + 2];

      // collect all ops from tokens
      if (next && next[0] === 'expr' && isOp(next[1])) {
        const fixedTree = fixTokens(fixArgs(tokens.splice(i, i + tokens.length)));
        const target = fixTokens([prev, fixedTree.shift()]);

        return fixedTree.reduce((p, c) => {
          if (Array.isArray(p)) p.push(c);
          else Object.assign(p, c);
          return p;
        }, target);
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

      // keep pairs of symbols together
      if (next && next[0] === 'symbol' && rightNext && rightNext[0] !== 'symbol') {
        prev[2] = cur;
        subTree[2] = rightNext;
        tokens.splice(i, 1, subTree);
        continue;
      }

      // keep side-effects without modification
      if (Array.isArray(subTree[0])) {
        cur[2] = fixTokens(subTree);
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

          // skip and reinject from expressions and side-effects
          if (['fx', 'expr', 'range'].includes(subTree[0])) {
            // eat one more token in case of ranges...
            if (subTree[0] === 'range') {
              prev[2].push(next, rightNext);
              tokens.splice(i, 1);
            } else {
              tokens.splice(i, 0, subTree);
            }
          } else {
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

    // merge lambda-calls and symbols as single tokens
    if (prev && prev[0] === 'symbol' && cur[0][0] === 'fn') {
      tokens.splice(i, 1);
      prev[2] = cur;
      continue;
    }

    tokens[i] = cur;
  }

  return tokens;
}
