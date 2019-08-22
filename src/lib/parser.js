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
  '->': 'func',
  '<-': 'bind',
  '=>': 'arrow',
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
export const isSep = (a, b = '') => `${b}{[]}|;,.`.includes(a);
export const isChar = a => /^[a-zA-Z]+/.test(a);

export const isOp = a => OP_TYPES[a];
export const isFmt = x => /^["`_*~]$/.test(x);
export const isNth = x => /^\d+(?:t[hy]|[rn]d)$/.test(x);
export const isAny = (x, a = '') => a ? a.includes(x) : /^[^\s\w\d_*~$€£¢%({[~<!>\]})"`|:;_,.+=*/-]$/.test(x);
export const isInt = x => typeof x === 'number' || /^-?(?!0)\d+(\.\d+)?$/.test(x);
export const isNum = x => /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const isExpr = x => /^(?:from|to|of|a[ts]|i[ns])$/i.test(x);
export const isTime = x => TIME_UNITS.includes(x);
export const isMoney = x => CURRENCY_MAPPINGS[x];
export const isAlpha = x => ALPHA_MAPPINGS[x];
export const isUpper = x => /^[A-Z]+/.test(x);
export const isJoin = x => '_,.'.includes(x);

export const hasNum = x => RE_NUM.test(x);
export const hasDays = x => RE_DAYS.test(x);
export const hasMonths = x => RE_MONTHS.test(x);
export const hasTagName = x => TAG_TYPES.includes(x);
export const hasOwnKeyword = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export const hasPercent = x => {
  return typeof x === 'string' && x.charAt(x.length - 1) === '%';
};

export const hasKeyword = (x, units, fallback) => {
  if (!x) return false;

  const key = x.replace(RE_NO_ALPHA, '');

  // skip further detection on white-space
  if (isAny(key, ' ')) return false;

  if (fallback) {
    return key;
  }

  const test = key && (hasOwnKeyword(units, key) || hasOwnKeyword(units, key.toLowerCase()));

  return test;
};

export const hasDatetime = x => {
  if (x && RE_ISO.test(x)) return 'ISO';
  if (x && RE_DAYS.test(x)) return 'DAYS';
  if (x && RE_HOURS.test(x)) return 'HOURS';
  if (x && RE_MONTHS.test(x)) return 'MONTHS';
};

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

    // rank tokens
    let score = 0;
    let key = i;
    let peek;

    do { peek = chars[++key]; } while (isAny(peek, ' \n'));

    if (!open) {
      // ban ops/words outside parenthesis
      if ((isOp(cur) || isJoin(cur)) && !isNum(peek)) score = -1;
    }

    // numbers have higher score
    if (isNum(cur)) score += 5;

    // separators are important
    if (isSep(cur, '()')) score += 2.5;

    // numbers before unit-expressions
    if (isNum(last) && isChar(cur)) score += 2;

    // handle operators, no formatting!
    if ((isOp(cur) || isFx(cur)) && cur !== next) score += 3;

    // any word or printable-character...
    if (isChar(cur) || isAlpha(cur) || isMoney(cur)) score += 1;

    // bonus points: values or side-effects after expression-separators
    if (open && isChar(cur)) score += 2.5;
    if (open && isSep(cur, '()')) score += 1.5;
    if (isJoin(cur) && isNum(next)) score += 1.5;
    if (isNum(cur) && next === '.') score += 1.5;
    if (cur === '(' && peek === ')') score += 1.5;

    if (open && cur === ',' && (isFx(peek) || isChar(peek) || hasNum(peek))) score += 1.5;
    if (cur === '(' && (peek === '(' || isFx(peek) || isChar(peek) || hasNum(peek))) score += 1.5;
    if (cur === ')' && (oldChar === ')' || isFx(oldChar) || isChar(oldChar) || hasNum(oldChar))) score += 1.5;

    // flag to allow numbers with commas as separators
    if (cur === '(') open++;
    if (cur === ')') open--;

    // increase line/column
    if (chars[i - 1] === '\n') {
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
        if (buffer.length) tokens[++offset] = [{ cur, row, col, score }];
        else buffer.push({ cur, row, col, score });

        inFormat = [i, cur];
        continue;
      }
    }

    // disable formatting (avoid escapes)
    if (inFormat && inFormat[0] !== i - 1 && inFormat[1] === cur && last !== '\\' && cur !== next) {
      inFormat = false;
      buffer.push({ cur, row, col, score });
      continue;
    }

    if (!inFormat) {
      if (
        (!col && '#>'.includes(cur))
        || (cur === '/' && '/*'.includes(next))
      ) inBlock = next === '*' ? 'multiline' : 'block';
      if (inBlock && inBlock === 'block' && cur === '\n') inBlock = false;
    }

    // FIXME: clean combinations...
    if (
      inBlock || inFormat || typeof last === 'undefined'

      // non-keywords
      || (last === '\\')
      || (last !== ' ' && isAny(cur))
      || (last === '-' && isNum(cur))
      || (last === '_' && isChar(cur))
      || (isMoney(last) && hasNum(cur))
      || (hasNum(last) && '%:'.includes(cur))
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
      // split on white-space at the beginning
      if (isAny(last, ' \n') && buffer.length === 1) {
        tokens[++offset] = [{ cur, row, col, score }];
      } else {
        buffer.push({ cur, row, col, score });
      }

      // store for open/close checks
      if (last !== ' ') oldChar = last;
    } else {
      tokens[++offset] = [{ cur, row, col, score }];
    }
  }

  // re-assign tokens on the fly!
  return tokens.reduce((prev, cur, i) => {
    const value = cur.map(t => t.cur).join('');
    const lastValue = (prev[prev.length - 1] || {}).content;
    const olderValue = (prev[prev.length - 2] || {}).content;
    const oldestValue = (prev[prev.length - 3] || {}).content;

    // high-rank definition calls
    if (isChar(lastValue) && value === '(') {
      prev[prev.length - 1].complexity += 2;
    }

    // keep strings and other expressions high-ranked
    if (/^(\/\/|:)|^".*?"$/.test(value)) {
      prev.push({
        complexity: 3,
        content: value,
        begin: [cur[0].row, cur[0].col],
        end: [cur[0].row, cur[0].col + value.length],
      });
      return prev;
    }

    // keep long-format dates, e.g. `Jun 10, 1987`
    if (hasMonths(oldestValue) && olderValue === ',' && isNum(value)) {
      prev[prev.length - 3].content += olderValue + lastValue + value;
      prev[prev.length - 3].end[1] = cur[cur.length - 1].col + 1;
      prev.pop();
      prev.pop();
      return prev;
    }

    // skip formatting!
    if (!(isFmt(cur[0].cur) && isFmt(cur[cur.length - 1].cur))) {
      if (
        // handle fractions
        (isInt(olderValue) && lastValue === '/' && isInt(value))

        // handle checkboxes
        || (olderValue === '[' && ' x'.includes(lastValue) && value === ']')

        // keep well-known dates, e.g `Jun 10`, `Jun, 1987` or `Jun 10, 1987`
        || (hasMonths(olderValue) && ' ,'.includes(lastValue) && isNum(value))

        // concatenate unknown words
        || (cur.length > 1 && isChar(olderValue) && !isExpr(olderValue) && isAny(lastValue, ' '))

        // skip numbers within groups or parenthesis
        || (!isChar(oldestValue) && '{[(<'.includes(olderValue) && isInt(lastValue) && '>)]}'.includes(value))

        // keep numbers and units together, e.g `5 days` or `$15,000 MXN`; also handle mixed-units
        || (hasNum(olderValue) && ' /-'.includes(lastValue) && hasKeyword(olderValue + lastValue + value, units))

        // keep hours-like values together, e.g. `200 am`, '4 pm' or `16:20:00 pm`
        || ((isInt(olderValue) && lastValue === ' ' && ['am', 'pm'].includes(value)) || RE_HOURS.test(olderValue + lastValue + value))
      ) {
        prev[prev.length - 2].complexity = hasNum(value) ? 3 : 0;
        prev[prev.length - 2].content += lastValue + value;
        prev[prev.length - 2].end[1] = cur[cur.length - 1].col + 1;
        prev.pop();
        return prev;
      }
    }

    // keep common tokens together
    const fixedTokens = cur.reduce((p, c, j) => {
      const old = p[p.length - 1];

      if (old) {
        if (
          isOp(old.cur + c.cur)
          || (old.cur === c.cur)
          || (hasNum(old.cur) && hasNum(c.cur))
          || (hasNum(old.cur) && c.cur === '.' && hasNum(cur[j + 1].cur))
          || ((isChar(old.cur) || hasNum(old.cur)) && (isChar(c.cur) || hasNum(c.cur)))
        ) {
          old.cur += c.cur;
          return p;
        }
      }

      p.push(c);
      return p;
    }, []);

    // keep lower-ranked tokens together...
    if (fixedTokens.length > 1 && fixedTokens[0].score < 3) {
      prev.push({
        complexity: 0, // fixedTokens.reduce((p, c) => p + c.score) / fixedTokens.length,
        content: fixedTokens.map(t => t.cur).join(''),
        begin: [fixedTokens[0].row, fixedTokens[0].col],
        end: [fixedTokens[fixedTokens.length - 1].row, fixedTokens[fixedTokens.length - 1].col + 1],
      });
    } else {
      fixedTokens.forEach(t => {
        prev.push({
          content: t.cur,
          complexity: t.score,
          begin: [t.row, t.col],
          end: [t.row, t.col + t.cur.length],
        });
      });
    }

    return prev;
  }, []);
}
