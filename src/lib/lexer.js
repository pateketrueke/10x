import {
  hasMonths, hasHours, hasKeyword, hasFmt, hasOp, hasSep, hasChar, hasNum, hasExpr,
} from './shared';

import {
  isInt,
} from './utils';

export function getTokensFrom(text, units, parentNode, fixedOffset) {
  let inSym = false;
  let inBlock = false;
  let inFormat = false;

  let oldScore = 0;
  let offset = 0;
  let depth = 0;
  let row = 0;
  let col = -1;

  const chars = text.split(/(?=[\x00-\x7F])/); // eslint-disable-line
  const tokens = [];

  if (parentNode && fixedOffset) {
    row += parentNode.begin[0];
    col += parentNode.begin[1] + fixedOffset;
  }

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

    // flag for symbols
    if (last === ':' && (hasChar(cur) || hasNum(cur))) inSym = true;
    if (inSym && !(cur === '-' || hasChar(cur) || hasNum(cur))) inSym = false;

    // keep formatting blocks together
    if (!inBlock && !inFormat && hasFmt(cur)) {
      if (typeof last === 'undefined' || !(hasChar(last) || hasNum(last))) {
        if (cur === '*') {
          inFormat = next === '*' || hasChar(next);
        } else if (cur === '_') {
          inFormat = next === '_' || hasChar(next);
        } else if (cur === '~') {
          inFormat = !'=>'.includes(next);
        } else {
          inFormat = next !== cur;
        }
      }

      if (inFormat) {
        if (buffer.length) tokens[++offset] = [{ cur, row, col }];
        else buffer.push({ cur, row, col });

        // allow empty strings
        inFormat = [(cur === next && cur !== '"') ? i + 1 : i, cur];
        continue;
      }
    }

    // disable formatting (avoid escapes)
    if (
      inFormat
      && (i > inFormat[0])
      && inFormat[1] === cur && last !== '\\' && cur !== next
    ) {
      buffer.push({ cur, row, col });
      inFormat = false;
      continue;
    }

    if (!inFormat) {
      if (
        (!col && '#>'.includes(cur))
        || (cur === '/' && '/*'.includes(next))
      ) inBlock = next === '*' ? 'multiline' : 'block';

      // enable pre-code blocks
      if (cur + next + chars[i + 2] === '```') {
        inBlock = 'multiline';
      }
    }

    // split on white-space at the beginning
    if (' \n'.includes(last) && buffer.length === 1) {
      tokens[++offset] = [{ cur, row, col }];
      continue;
    }

    // disable consecutive line-breaks on formatting blocks
    if (inBlock === 'block' && cur === '\n' && next === '\n') inBlock = false;

    if (
      inBlock || inFormat || typeof last === 'undefined'

      // allow escapes and identical tokens
      || (last === '\\') || (last === cur && !hasSep(cur))

      // well-known operators
      || hasOp(last + cur)

      // keep numbers and words
      || (last === '-' && cur === '.' && hasNum(next))
      || (last === ':' && (hasNum(cur) || hasChar(cur)))
      || (hasNum(last) && ':.'.includes(cur) && hasNum(next))
      || ((hasNum(last) || '-.'.includes(last)) && hasNum(cur))
      || ((hasChar(last) || isInt(last)) && cur === '!' && next === '(')
      || ((hasChar(last) || hasNum(last)) && (hasChar(cur) || hasNum(cur)))
      || (isInt(last) && cur === '/' && isInt(next)) || (last === '/' && isInt(buffer[0].cur))
      || (inSym && ((hasChar(last) && cur === '-' && hasChar(next)) || (last === '-' && hasChar(cur))))

      // handle checkboxes
      || (last === '[' && ' x'.includes(cur) && next === ']') || (' x'.includes(last) && cur === ']')
    ) {
      buffer.push({ cur, row, col });
    } else {
      tokens[++offset] = [{ cur, row, col }];
    }

    // turn-off formatting/blocks...
    if (
      (!inBlock && cur === '\n')
      || (inBlock === 'block' && cur === '\n')
      || (inBlock === 'multiline' && last === '*' && cur === '/')
    ) inBlock = inFormat = false;

    if (!inBlock && cur === '\n') {
      offset++;
    }
  }

  // join all tokens!
  return tokens.reduce((prev, x, i) => {
    const oldestValue = (prev[prev.length - 3] || {}).cur;
    const olderValue = (prev[prev.length - 2] || {}).cur;
    const lastValue = (prev[prev.length - 1] || {}).cur;
    const value = x.map(t => t.cur).join('');

    // handle common sigils around units/numbers, e.g. `a)`
    if (
      !depth
      && value === ')'
      && (!olderValue || olderValue === '\n')
      && (hasNum(lastValue) || hasChar(lastValue))
    ) {
      prev[prev.length - 1].cur += value;
      return prev;
    }

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
      || ((hasNum(olderValue) && lastValue === ' ' && ['am', 'pm'].includes(value)) || hasHours(olderValue + lastValue + value))
    ) {
      prev[prev.length - 2].cur += lastValue + value;
      prev.pop();
      return prev;
    }

    let score = 0;

    // keep expresions and units together, e.g. `3 weeks as days`
    if (
      (hasExpr(olderValue) && hasKeyword(value, units))
      || (hasNum(olderValue) && hasExpr(value))
    ) {
      score += 2;
    }

    const nextChar = ((tokens[i + 1] || [])[0] || {}).cur;

    if (
      // numbers
      hasNum(value)

      // definitions
      || (hasChar(value) && '(='.includes(nextChar))

      // separators and operators
      || (oldScore && (hasSep(value) || hasOp(value)))

      // symbols
      || (
        value.charAt() === ':'
        && (hasChar(value.substr(1)) || hasNum(value.substr(1)))
      )

      // strings
      || (value.charAt() === '"' && value.substr(value.length - 1) === '"')
    ) score += 3;

    if (
      // comments
      (
        value.indexOf('//') === 0
        || (value.indexOf('/*') === 0 && value.substr(value.length - 2) === '*/')
      )

      // (inside parentheses)
      || (depth && oldScore && (hasSep(value) || hasChar(value)))

      // definitions
      || ('(='.includes(value) && oldScore)

      // side-effects
      || (hasOp(nextChar) && value === '(')

      // rnages
      || (value.indexOf('..') === 0)
    ) score += 1.5;

    // formatting
    if (hasFmt(x[0].cur) && x[0].cur === x[x.length - 1].cur) score += 0.5;

    // always give score to parentheses
    if ('()'.includes(value)) score += 1;

    // increase depth if we're into a definition, not inside any parentheses!
    if ('(='.includes(value) && oldScore) depth++;
    else if (');'.includes(value) && depth) depth--;

    prev.push({
      depth,
      score,
      cur: value,
      row: x[0].row,
      col: x[0].col,
    });

    if (!' \n'.includes(value)) {
      oldScore = score;
    }

    return prev;
  }, []);
}
