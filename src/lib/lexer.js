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

export const hasOp = x => !!OP_TYPES[x];
export const hasFmt = x => /^["`_*~]$/.test(x);
export const hasSep = x => '{[( )]}|;,.'.includes(x);
export const hasNum = x => /^-?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const hasChar = x => !!CURRENCY_MAPPINGS[x] || !!ALPHA_MAPPINGS[x] || /^[a-zA-Z_#']/.test(x);

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
      if (inBlock && inBlock === 'block' && cur === '\n') inBlock = false;
    }

    // split on white-space at the beginning
    if (' \n'.includes(last) && buffer.length === 1) {
      tokens[++offset] = [{ cur, row, col }];
      continue;
    }

    if (
      inBlock || inFormat || typeof last === 'undefined'

      // allow escapes
      || (last === '\\')

      // identical tokens
      || (last === cur)

      // well-known operators
      || hasOp(last + cur)

      // keep numbers and words
      || (hasNum(last) && hasNum(cur))
      || (hasNum(last) && cur === '.' && hasNum(next))
      || ((hasChar(last) || hasNum(last)) && (hasChar(cur) || hasNum(cur)))
    ) {
      buffer.push({ cur, row, col });
    } else {
      tokens[++offset] = [{ cur, row, col }];
    }
  }

  // join all tokens!
  return tokens.map(x => {
    if (x.length > 1) {
      let fixedScore = 0;

      // FIXME: rank by... you know

      return {
        cur: x.map(x => x.cur).join(''),
        row: x[0].row,
        col: x[0].col,
        score: fixedScore,
      };
    }

    return {
      cur: x[0].cur,
      row: x[0].row,
      col: x[0].col,
      score: 0,
    };
  });
}
