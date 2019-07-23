import {
  isTime, isExpr, toNumber, hasMonths,
} from './parser';

import { calculateFromTokens } from './solver';

export function reduceFromValue(token) {
  let text = token[1];

  if (typeof text === 'number') {
    text = text.toString().split(/(?=\d{2})/).join(':');
    text += token[2] ? ` ${token[2]}` : '';
  }

  const now = new Date();
  const year = now.getFullYear();
  const today = now.toString().split(' ').slice(0, 4).join(' ');

  if (text.includes(':')) return new Date(`${today} ${text}`);
  if (hasMonths(text)) return new Date(!text.includes(',') ? `${text}, ${year}` : text);
  if (text.toLowerCase() === 'yesterday') return (now.setDate(now.getDate() - 1), now);
  if (text.toLowerCase() === 'tomorrow') return (now.setDate(now.getDate() + 1), now);
  if (text.toLowerCase() === 'today') return new Date(`${today} 00:00`);
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

  return tokens.reduce((prev, cur, i) => {
    const leaf = (cur[2] && cur[2][2]) || [];

    // handle var/call definitions
    if (cur[0] === 'def' && leaf[0] === 'expr' && leaf[1] === '=') {
      expressions[cur[1]] = cur[2];
      return prev;
    }

    // handle call expressions
    if (cur[0] === 'def') {
      const call = expressions[cur[1]];
      const args = cur[2] || tokens[i + 1];

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

      // we return a new expressions from 3x to [3, *, x]
      cur = [['number', val, old[1][2]], ['expr', '*', 'mul']].concat(next);
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

      // handle converting between expressions
      if (cur[0] === 'expr' && isExpr(cur[1])) {
        const fixedUnit = right[0] === 'unit' ? (right[2] || right[1]) : right[2];

        if (fixedUnit && fixedUnit !== 'datetime' && left[2] !== 'datetime') {
          left[1] = left[2] ? convert(toNumber(left[1]), left[2], fixedUnit) : left[1];
          left[2] = fixedUnit;
          tokens.splice(i, 2);
        }
      }

      if (cur[0] === 'number') {
        // convert time-expressions into seconds
        if (isDate && isTime(cur[2])) {
          cur[1] = convert(toNumber(cur[1]), cur[2], 's');
          cur[2] = 's';
        }

        // convert between units
        if (lastUnit && cur[2] && lastUnit !== cur[2]) {
          cur[1] = convert(toNumber(cur[1]), cur[2], lastUnit);
          cur[2] = lastUnit;
        }

        // save initial unit
        if (cur[2] && !lastUnit) lastUnit = cur[2];
      }

      // flag the expression for dates
      if (isTime(cur[2])) isDate = true;
    }

    prev.push(cur);
    return prev;
  }, []);
}
