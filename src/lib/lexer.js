import {
  CURRENCY_MAPPINGS, ALPHA_MAPPINGS,
} from './convert';

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

const RE_DAYS = /^(?:now|to(?:day|night|morrow)|yesterday|week(?:end)?)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::?[0-5]?[0-9]){,2}(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)\w*\b/i;
const RE_NO_ALPHA = new RegExp(`^[^a-zA-Z${Object.keys(ALPHA_MAPPINGS).join('')}]*`, 'g');

export const isInt = x => /^-?(?!0)\d+(\.\d+)?$/.test(x);

export const hasOp = x => !!OP_TYPES[x];
export const hasDays = x => RE_DAYS.test(x);
export const hasMonths = x => RE_MONTHS.test(x);
export const hasFmt = x => /^["`_*~]$/.test(x);
export const hasSep = x => '{[( )]}|;,.'.includes(x);
export const hasNum = x => /^-?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const hasChar = x => !!CURRENCY_MAPPINGS[x] || !!ALPHA_MAPPINGS[x] || /^[a-zA-Z_#']/.test(x);

export const hasOwnKeyword = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export const hasKeyword = (x, units, fallback) => {
  if (!x) return false;

  const key = x.replace(RE_NO_ALPHA, '');

  // skip further detection on white-space
  if (key.includes(' ')) return false;

  if (fallback) {
    return key;
  }

  const test = key && (hasOwnKeyword(units, key) || hasOwnKeyword(units, key.toLowerCase()));

  return test;
};

export function getTokensFrom(text, units) {
  let inBlock = false;
  let inFormat = false;

  let oldChar = '';
  let offset = 0;
  let row = 0;
  let col = -1;

  const chars = text.split(/(?=[\x00-\x7F])/);
  const tokens = [];

  for (let i = 0; i < chars.length; i += 1) {
    const buffer = tokens[offset] || (tokens[offset] = []);
    const last = (buffer[buffer.length - 1] || {}).cur;
    const next = chars[i + 1];
    const cur = chars[i];

    // increase line/column
    if (chars[i - 1] === '\n') {
      col = 0;
      row++;
    } else {
      col++;
    }

    // keep formatting blocks together
    if (!inBlock && !inFormat && hasFmt(cur) && !hasOp(last)) {
      if (cur === '*')  {
        inFormat = next === '*';
      } else if (cur === '_') {
        inFormat = hasSep(last)
          && (next === '_' || hasChar(next) || hasNum(next));
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
      if (
        (!col && '#>'.includes(cur))
        || (cur === '/' && '/*'.includes(next))
      ) inBlock = next === '*' ? 'multiline' : 'block';
    }

    // split on white-space at the beginning
    if (' \n'.includes(last) && buffer.length === 1) {
      tokens[++offset] = [{ cur, row, col }];
      continue;
    }

    if (
      inBlock || inFormat || typeof last === 'undefined'

      // allow escapes and identical tokens
      || (last === '\\') || (last === cur)

      // well-known operators
      || hasOp(last + cur)

      // keep numbers and words
      || (hasNum(last) && cur === '.' && hasNum(next))
      || ((hasNum(last) || '-.'.includes(last)) && hasNum(cur))
      || ((hasChar(last) || hasNum(last)) && (hasChar(cur) || hasNum(cur)))
      || (isInt(last) && cur === '/' && isInt(next)) || (last === '/' && isInt(buffer[0].cur))

      // handle checkboxes
      || (last === '[' && ' x'.includes(cur) && next === ']') || (' x'.includes(last) && cur === ']')
    ) {
      buffer.push({ cur, row, col });
    } else {
      tokens[++offset] = [{ cur, row, col }];
    }

    // turn-off comment blocks...
    if (inBlock === 'block' && cur === '\n') inBlock = false;
    if (inBlock === 'multiline' && last === '*' && cur === '/') inBlock = false;
  }

  // join all tokens!
  return tokens.reduce((prev, x) => {
    const oldestValue = (prev[prev.length - 3] || {}).cur;
    const olderValue = (prev[prev.length - 2] || {}).cur;
    const lastValue = (prev[prev.length - 1] || {}).cur;
    const value = x.map(t => t.cur).join('');

    // keep long-format dates, e.g. `Jun 10, 1987`
    if (hasMonths(oldestValue) && olderValue === ',' && isInt(value)) {
      prev[prev.length - 3].cur += olderValue + lastValue + value;
      prev.pop();
      prev.pop();
      return prev;
    }

    if (
      // keep well-known dates, e.g `Jun 10`, `Jun, 1987` or `Jun 10, 1987`
      (hasMonths(olderValue) && ' ,'.includes(lastValue) && isInt(value))

      // keep numbers and units together, e.g `5 days` or `$15,000 MXN`; also handle mixed-units
      || (hasNum(olderValue) && ' /-'.includes(lastValue) && hasKeyword(olderValue + lastValue + value, units))

      // keep hours-like values together, e.g. `200 am`, '4 pm' or `16:20:00 pm`
      || ((isInt(olderValue) && lastValue === ' ' && ['am', 'pm'].includes(value)) || RE_HOURS.test(olderValue + lastValue + value))
    ) {
      prev[prev.length - 2].cur += lastValue + value;
      prev.pop();
      return prev;
    }

    if (x.length > 1) {
      let fixedScore = 0;

      // FIXME: rank by... you know

      prev.push({
        cur: x.map(x => x.cur).join(''),
        row: x[0].row,
        col: x[0].col,
        score: fixedScore,
      });
    } else {
      prev.push({
        ...x[0],
        score: 0,
      });
    }

    return prev;
  }, []);
}
