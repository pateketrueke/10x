import {
  isSep, isTime, isExpr, toNumber, hasMonths, hasTagName,
} from './parser';

import { calculateFromTokens } from './solver';

export function reduceFromValue(token) {
  let text = token[1];

  if (typeof text === 'number') {
    text = text.toString().split(/(?=\d{2})/).join(':');
    text += token[2] ? ` ${token[2]}` : '';
  }

  // handle ISO strings
  if (text.length > 20) return new Date(text);

  const now = new Date();
  const year = now.getFullYear();
  const today = now.toString().split(' ').slice(0, 4).join(' ');

  if (text.includes(':')) return new Date(`${today} ${text}`);
  if (hasMonths(text)) return new Date(`${!text.includes(',') ? `${text}, ${year}` : text} 00:00:00`);
  if (text.toLowerCase() === 'yesterday') return (now.setDate(now.getDate() - 1), now);
  if (text.toLowerCase() === 'tomorrow') return (now.setDate(now.getDate() + 1), now);
  if (text.toLowerCase() === 'today') return new Date(`${today} 00:00:00`);
  if (text.toLowerCase() === 'now') return now;

  return text;
}

export function reduceFromTokens(tree, values) {
  return tree.map(item => {
    // iterate until we visit all tokens
    if (Array.isArray(item[0])) {
      return reduceFromTokens(item, values);
    }

    // one matches, replace!
    if (values[item[1]]) {
      return values[item[1]];
    }

    return item;
  });
}

export function reduceFromArgs(keys, values) {
  let offset = 0;

  const locals = [];

  // break values into single arguments
  for (let i = 0; i < values.length; i += 1) {
    const stack = locals[offset] || (locals[offset] = []);
    const cur = values[i];

    stack.push(cur);

    if (cur[0] === 'expr' && cur[1] === ',') {
      stack.pop();
      offset++;
    }
  }

  // compute a map from given units and values
  return keys.reduce((prev, cur, i) => {
    prev[cur[1]] = locals[i];
    return prev;
  }, {});
}

export function reduceFromAST(tokens, convert, expressions = {}) {
  let isDate;
  let lastUnit;
  let lastOp = ['expr', '+', 'plus'];

  return tokens.reduce((prev, cur, i) => {
    // handle var/call definitions
    if (cur[0] === 'def' && cur[2]) {
      const isDef = (cur[2][0][0] === 'expr' && cur[2][0][1] === '=')
        || (cur[2][1] && cur[2][1][0] === 'expr' && cur[2][1][1] === '=');

      // define var/call
      if (isDef) {
        expressions[cur[1]] = cur[2];
        return prev;
      }

      const args = cur[2] || tokens[i + 1];
      const call = expressions[cur[1]];

      // skip undefined calls
      if (!call) {
        return prev;
      }

      // compute valid sub-expressions from arguments
      const locals = reduceFromArgs(call[0].filter(x => x[0] === 'unit'), args[0]);

      // replace all given units within the AST
      cur = reduceFromTokens(call.slice(2), locals);
      cur = calculateFromTokens(reduceFromAST(cur, convert, expressions));
    }

    // handle unit expressions
    if (cur[0] === 'unit' && expressions[cur[1]]) {
      cur = expressions[cur[1]].slice(1, expressions[cur[1]].length - 1);
    }

    // handle N-unit expressions
    if (cur[0] === 'number' && expressions[cur[2]]) {
      const old = expressions[cur[2]];
      const val = parseFloat(cur[1]);
      const next = old.slice(1, old.length - 1);

      // we return a new expression from 3x to [3, *, x]
      cur = [['number', val], ['expr', '*', 'mul']].concat(next);
    }

    // handle resolution by recursion
    if (Array.isArray(cur[0])) {
      cur = calculateFromTokens(reduceFromAST(cur, convert, expressions));
    }

    // convert into Date values
    if (cur[2] === 'datetime') {
      isDate = true;
      cur[1] = reduceFromValue(cur);
    } else {
      const left = tokens[i - 1] || [];
      const right = tokens[i + 1] || [];

      // apply given unit on further operations
      if (left[0] === 'expr' && cur[0] === 'unit' && ['as', 'in', 'to'].includes(left[1])) {
        for (let x = i + 1; x < tokens.length; x += 1) {
          if (tokens[x][0] === 'number' && !tokens[x][2]) {
            tokens[x][2] = cur[1];
            prev.pop();
            return prev;
          }
        }
      }

      // append last-operator between consecutive unit-expressions
      if (left[0] === 'number' && cur[0] === 'number') {
        // distance between tokens should be short!
        if ((cur._offset || 1) - (left._offset || 0) <= 2) {
          prev.push(lastOp);
        }
      }

      // handle converting between expressions
      if (cur[0] === 'expr' && left[0] === 'number' && isExpr(cur[1])) {
        const fixedUnit = right[0] === 'unit' ? (right[2] || right[1]) : right[2];

        if (fixedUnit && !['datetime', 'fr'].includes(fixedUnit) && left[2] && left[2] !== 'datetime') {
          left[1] = convert(parseFloat(toNumber(left[1])), left[2], fixedUnit);
          left[2] = fixedUnit;
        } else if (isTime(left[2])) {
          left[1] = convert(parseFloat(toNumber(left[1])), left[2], 's');
          left[2] = 's';
        }
      }

      if (cur[0] === 'number') {
        // convert time-expressions into seconds
        if (isDate && isTime(cur[2])) {
          cur[1] = convert(parseFloat(toNumber(cur[1])), cur[2], 's');
          cur[2] = 's';
        }

        // convert between units
        if (lastUnit && cur[2] && lastUnit !== cur[2]) {
          cur[1] = convert(parseFloat(toNumber(cur[1])), cur[2], lastUnit);
          cur[2] = lastUnit;
        }

        // save initial unit
        if (cur[2] && !lastUnit) lastUnit = cur[2];
      }

      // save last used operator
      if (cur[1] === '+' || cur[1] === '-') lastOp = cur;

      // flag the expression for dates
      if (isTime(cur[2])) isDate = true;
    }

    prev.push(cur);
    return prev;
  }, []);
}
