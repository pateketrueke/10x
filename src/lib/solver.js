import {
  isInt, isTime, isExpr, hasPercent, toNumber,
} from './parser';

export function calculateFromMS(diff) {
  const hourTime = 1000 * 60;
  const seconds = Math.floor(diff / 1000 % 60);
  const minutes = Math.floor(diff / hourTime % 60);
  const hours = Math.floor(diff / (hourTime * 60) % 24);
  const days = Math.floor(diff / (hourTime * 60 * 24) % 365);

  return [
    days ? `${days}d` : '',
    hours ? `${hours}h` : '',
    minutes ? `${minutes}m` : '',
    seconds ? `${seconds}s` : '',
  ].filter(Boolean).join(' ');
}

export function calculateFromDate(op, left, right) {
  if (!(left instanceof Date)) {
    const now = new Date();
    const nowMonth = now.toString().split(' ')[1];
    const nowDate = now.getDate();

    // add given seconds
    if (op === 'from') return calculateFromDate('+', right, left);
    if (op === 'as') return calculateFromDate('+', parseFloat(right), left);

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
      if (oldYear !== newYear) left.setFullYear(newYear);
      if (oldMonth !== newMonth) left.setMonth(newMonth);
    }

    if (op === '-') {
      return Math.abs(right.getTime() - left.getTime());
    }

    if (op === '+' || op === 'at') {
      let isToday = true;

      if (oldYear !== newYear) isToday = !left.setFullYear(oldYear + newYear);
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
    if ((op === 'of' || op === 'from') && isInt(right)) left.setFullYear(right);
    if (op === 'as' && isInt(right)) left.setDate(right);
    if (op === '-') left.setSeconds(left.getSeconds() - right);
    if (op === '+') left.setSeconds(left.getSeconds() + right);
  }

  return left;
}

export function evaluateExpression(op, left, right) {
  // handle basic arithmetic
  if (op === '*' || op === 'for') return left * right;
  if (op === '/' || isExpr(op)) return left / right;
  if (op === '+') return left + right;
  if (op === '-') return left - right;
}

export function operateExpression(ops, expr) {
  for (let i = 1, c = expr.length - 1; i < c; i += 1) {
    const cur = expr[i];
    const prev = expr[i - 1];
    const next = expr[i + 1];

    if (cur && ops.indexOf(cur[1]) > -1) {
      let result;

      if (prev[0] === 'number' || next[0] === 'number') {
        if (
          prev[1] instanceof Date
          || next[1] instanceof Date
          || (prev[2] === 's' && isExpr(cur[1]) && isInt(next[1]))
        ) {
          result = calculateFromDate(cur[1], prev[1], next[1]);

          // adjust time-differences in days
          if (typeof result === 'number') {
            result = calculateFromMS(result);
            prev.pop();
            next.pop();
          }
        } else {
          if ((cur[1] === 'in' || cur[1] === 'as') && next[0] === 'unit') {
            // carry units
            result = prev[1];
            prev[2] = prev[2] || next[1];
          } else if (hasPercent(next[1])) {
            result = parseFloat(prev[1]) + (parseFloat(prev[1]) * (parseFloat(next[1]) / 100));
          } else {
            result = evaluateExpression(cur[1], parseFloat(toNumber(prev[1])), parseFloat(toNumber(next[1])));
          }

          // remove units as result from fractions
          if (prev[2] === 'fraction') {
            prev.pop();
            next.pop();
          }
        }
      }

      if (typeof result !== 'undefined') {
        expr.splice(i - 1, 3, ['number', result, prev[2] || next[2]]);

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
  expr = operateExpression(['for', '*', '/'], expr);
  expr = operateExpression(['at', 'of', 'from', '+', '-', 'as', 'in'], expr);

  return expr[0];
}
