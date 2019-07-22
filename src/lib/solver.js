import Convert from 'convert-units';

import {
  isOp, isTime, isExpr, hasMonths,
} from './parser';

export function toNumber(token) {
  if (token[2] === 'fraction') {
    const [a, b] = token[1].split('/');

    return a / b;
  }

  if (typeof token[1] === 'string') {
    return parseFloat(token[1].replace(/[^a-z\s\d.-]/ig, ''));
  }

  return token[1];
}

export function fromValue(token) {
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

export function calculateFromDate(op, left, right) {
  if (!(left instanceof Date)) {
    const now = new Date();
    const nowMonth = now.toString().split(' ')[1];
    const nowDate = now.getDate();

    // convert from given units
    if (Array.isArray(left)) {
      const secs = new Convert(left[1]).from(left[2]).to('s');

      left = new Date();
      left.setSeconds(secs);
    }

    // otherwise, just take the year
    if (typeof left === 'number') left = new Date(`${nowMonth} ${nowDate}, ${left} 00:00`);
  }

  const oldYear = left.getFullYear();
  const oldMonth = left.getMonth();
  const oldDate = left.getDate();
  const oldHours = left.getHours();
  const oldMinutes = left.getMinutes();
  const oldSeconds = left.getSeconds();

  if (right instanceof Date) {
    const newYear = right.getFullYear();
    const newMonth = right.getMonth();
    const newDate = right.getDate();
    const newHours = right.getHours();
    const newMinutes = right.getMinutes();
    const newSeconds = right.getSeconds();

    if (op !== 'at' && isExpr(op)) {
      if (oldYear !== newYear) left.setYear(newYear);
      if (oldMonth !== newMonth) left.setMonth(newMonth);
    }

    if (op === '-') {
      if (oldYear !== newYear) left.setYear(oldYear - newYear);
      if (oldMonth !== newMonth) left.setMonth(oldMonth - newMonth);
      if (oldDate !== newDate) left.setDate(oldDate - newDate);
      if (oldHours !== newHours) left.setHours(oldHours - newHours);
      if (oldMinutes !== newMinutes) left.setMinutes(oldMinutes - newMinutes);
      if (oldSeconds !== newSeconds) left.setSeconds(oldSeconds - newSeconds);
    }

    if (op === '+' || op === 'at') {
      let isToday = true;

      if (oldYear !== newYear) isToday = !left.setYear(oldYear + newYear);
      if (oldMonth !== newMonth) isToday = !left.setMonth(oldMonth + newMonth);
      if (oldDate !== newDate) isToday = !left.setDate(oldDate + newDate);

      // operate only when both dates are not from same day!
      if (!isToday) {
        if (oldHours !== newHours) left.setHours(oldHours + newHours);
        if (oldMinutes !== newMinutes) left.setMinutes(oldMinutes + newMinutes);
        if (oldSeconds !== newSeconds) left.setSeconds(oldSeconds + newSeconds);
      } else {
        if (oldHours !== newHours) left.setHours(newHours);
        if (oldMinutes !== newMinutes) left.setMinutes(newMinutes);
        if (oldSeconds !== newSeconds) left.setSeconds(newSeconds);
      }
    }
  } else {
    if (op === '-') left.setSeconds(left.getSeconds() - right);
    if (op === '+' || isExpr(op)) left.setSeconds(left.getSeconds() + right);
  }

  return left;
}

export function evaluateExpression(op, left, right) {
  if (op === '+') return left + right;
  if (op === '-') return left - right;
  if (op === '*') return left * right;
  if (op === '/') return left / right;
}

export function operateExpression(ops, expr) {
  for (let i = 1, c = expr.length - 1; i < c; i += 1) {
    const cur = expr[i];
    const prev = expr[i - 1];
    const next = expr[i + 1];

    if (cur && ops.indexOf(cur[1]) > -1) {
      let result;

      if (prev[0] === 'number' || next[0] === 'number') {
        if (prev[1] instanceof Date) {
          result = calculateFromDate(cur[1], prev[1], next[1]);
        } else {
          result = evaluateExpression(cur[1], toNumber(prev), toNumber(next));
        }
      }

      if (!isNaN(result)) {
        const unit = expr.find(x => x[0] === 'unit');

        expr.splice(i - 1, 3, ['number', result, unit ? unit[1] : prev[2]]);

        // if tokens are left...
        if (expr.length >= 3) {
          return operateExpression(ops, expr);
        }
      } else {
        throw new Error(`Invalid expression: ${prev[1]} ${cur[1]} ${next[1]}`);
      }
    }
  }

  return expr;
}

export function calculateFromTokens(expr) {
  expr = operateExpression(['*', '/'], expr);
  expr = operateExpression(['at', 'of', 'from', '+', '-', 'as', 'in'], expr);

  return expr[0];
}

export function reduceFromAST(tokens, convert, expressions = {}) {
  let isDate;
  let lastUnit;

  return tokens.reduce((prev, cur, i) => {
    if (cur[0] === 'def') {
      expressions[cur[1]] = cur[2];
      return prev;
    }

    // handle unit expressions
    if (cur[0] === 'unit' && expressions[cur[1]]) {
      cur = expressions[cur[1]].slice(1, expressions[cur[1]].length - 1);
    } else if (cur[0] === 'number' && expressions[cur[2]]) {
      cur = [['number', parseInt(cur[1]), expressions[cur[2]][1][2]], ['expr', '*', 'mul']]
        .concat(expressions[cur[2]].slice(1, expressions[cur[2]].length - 1));
    }

    // handle resolution by recursion
    if (Array.isArray(cur[0])) {
      cur = calculateFromTokens(reduceFromAST(cur, convert, expressions));
    }

    // convert into Date values
    if (cur[2] === 'datetime') {
      isDate = true;
      cur[1] = fromValue(cur);
    } else {
      // flag the expression for dates
      if (isTime(cur[2])) isDate = true;

      if (cur[0] === 'number') {
        // convert time-expressions into seconds
        if (isDate && isTime(cur[2])) {
          cur[1] = convert(toNumber(cur), cur[2], 's');
          cur[2] = 's';
        }

        // convert between units
        if (lastUnit && cur[2] && lastUnit !== cur[2]) {
          cur[1] = convert(toNumber(cur), cur[2], lastUnit);
          cur[2] = lastUnit;
        }

        // save initial unit
        if (cur[2] && !lastUnit) lastUnit = cur[2];
      }
    }

    prev.push(cur);
    return prev;
  }, []);
}
