import {
  isInt, hasExpr, hasPercent,
} from './shared';

import {
  toList, toValue, toNumber, toFraction,
} from './ast';

export function calculateFromMS(diff) {
  const hourTime = 1000 * 60;
  const seconds = Math.floor(diff / 1000 % 60);
  const minutes = Math.floor(diff / hourTime % 60);
  const hours = Math.floor(diff / (hourTime * 60) % 24);
  const days = Math.floor(diff / (hourTime * 60 * 24) % 365);

  return []
    .concat(days ? `${days}d` : [])
    .concat(hours ? `${hours}h` : [])
    .concat(minutes ? `${minutes}m` : [])
    .concat(seconds ? `${seconds}s` : [])
    .join(' ');
}

export function calculateFromDate(op, left, right) {
  if (!(left instanceof Date)) {
    // add given seconds
    if (op === 'from') return calculateFromDate('+', right, left);
    if (['as', 'in', 'to'].includes(op)) return calculateFromDate('+', parseFloat(right), left);

    const now = new Date();
    const nowMonth = now.toString().split(' ')[1];
    const nowDate = now.getDate();

    // otherwise, just take the year
    left = new Date(`${nowMonth} ${nowDate}, ${left} 00:00`);
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

    if (op !== 'at' && hasExpr(op)) {
      if (oldYear !== newYear) left.setFullYear(newYear);
      if (oldMonth !== newMonth) left.setMonth(newMonth);
    }

    if (op === 'at') {
      if (oldHours !== newHours) left.setHours(newHours);
      if (oldMinutes !== newMinutes) left.setMinutes(newMinutes);
      if (oldSeconds !== newSeconds) left.setSeconds(newSeconds);
    }

    if (op === '-') {
      return Math.abs(right.getTime() - left.getTime());
    }

    if (op === '+') {
      if (oldYear !== newYear) left.setFullYear(oldYear + newYear);
      if (oldMonth !== newMonth) left.setMonth(oldMonth + newMonth);
      if (oldDate !== newDate) left.setDate(oldDate + newDate);
      if (oldHours !== newHours) left.setHours(oldHours + newHours);
      if (oldMinutes !== newMinutes) left.setMinutes(oldMinutes + newMinutes);
      if (oldSeconds !== newSeconds) left.setSeconds(oldSeconds + newSeconds);
    }
  } else {
    if ((op === 'of' || op === 'from') && isInt(right)) left.setFullYear(right);
    if (['as', 'in', 'to'].includes(op) && isInt(right)) left.setDate(right);
    if (op === '-') left.setSeconds(left.getSeconds() - right);
    if (op === '+') left.setSeconds(left.getSeconds() + right);
  }

  return left;
}

// handle basic conditions
export function evaluateComparison(op, left, right, others) {
  // parse from JSON as it's already escaped...
  // if (typeof left === 'string') left = toValue(left);
  // if (typeof right === 'string') right = toValue(right);

  switch (op) {
    case '!~': return !left.includes(right);
    case '=~': return left.includes(right);
    case '!=': return left !== right;
    case '==': return left === right;
    case '<=': return left <= right;
    case '>=': return left >= right;
    case '<': return left < right;
    case '>': return left > right;
    case '&&': return left && right;

    // FIXME: WAT?
    case '++': return left + right;
    case '--': return left.substr(right.length);
    default: return null;
  }
}

// handle basic arithmetic
export function evaluateExpression(op, left, right) {
  switch (op) {
    case '*': return left * right;
    case '/': return left / right;
    case '+': return left + right;
    default: return left - right;
  }
}

export function operateExpression(ops, expr) {
  for (let i = 1, c = expr.length - 1; i < c; i += 1) {
    const cur = expr[i];
    const prev = expr[i - 1];
    const next = expr[i + 1];

    if (cur && ops.indexOf(cur[1]) > -1) {
      let result;

      if (
        prev[1] instanceof Date
        || next[1] instanceof Date
        || (prev[2] === 's' && hasExpr(cur[1]) && isInt(next[1]))
      ) {
        result = calculateFromDate(cur[1], prev[1], next[1]);

        // adjust time-differences in days
        if (typeof result === 'number') {
          result = calculateFromMS(result);
          prev[2] = undefined;
          next[2] = undefined;
        }
      } else {
        if (['as', 'in', 'to'].includes(cur[1]) && next[0] === 'unit') {
          // carry units
          result = toNumber(prev[1]);
          prev[2] = prev[2] || next[1];
        } else if (hasExpr(cur[1])) {
          if (!(prev[2] && next[2])) {
            result = `${prev[1] / parseFloat(next[1]) * 100}%`;
          } else {
            result = toNumber(prev[1]);
          }
        } else if (hasPercent(next[1]) || hasPercent(prev[1])) {
          // FIXME: improve this shit=
          result = hasPercent(next[1])
            ? parseFloat(prev[1]) + (parseFloat(prev[1]) * (parseFloat(next[1]) / 100))
            : parseFloat(next[1]) + (parseFloat(next[1]) * (parseFloat(prev[1]) / 100));
        } else {
          result = evaluateExpression(cur[1], parseFloat(toNumber(prev[1])), parseFloat(toNumber(next[1])));
        }

        // escape unit-fractions for later
        if (next[0] === 'unit' && (next[2] === 'fr' || next[1] === 'fr')) {
          prev[2] = `fr-${prev[2].indexOf('fr') === 0 ? 'fr' : prev[2]}`;
          result = toFraction(result);
          next[2] = undefined;
        }

        // fixed-unit as result from fractions
        if (prev[2] === 'x-fraction') {
          prev[2] = undefined;
          next[2] = undefined;
        }
      }

      expr.splice(i - 1, 3, ['number', result, prev[2] || next[2]]);

      // if tokens are left...
      if (expr.length >= 3) {
        return operateExpression(ops, expr);
      }
    }
  }

  return expr;
}

// FIXME: cleanup?
export function calculateFromTokens(expr) {
  // if (Array.isArray(expr[0]) && re !== false) {
  //   expr = expr.filter(x => x[0] !== 'def');

  //   return toList(expr).map(x => {
  //     if (Array.isArray(x[0])) {
  //       return x.map(y => {
  //         if (Array.isArray(y[0])) {
  //           const z = calculateFromTokens(y);

  //           if (Array.isArray(z[0])) {
  //             return z.map(u => calculateFromTokens(u, false));
  //           }
  //           return z;
  //         }
  //         return y;
  //       });
  //     }
  //     return x;
  //   });
  // }

  expr = operateExpression(['for', '*', '/'], expr);
  expr = operateExpression(['at', 'of', 'from', '+', '-', 'as', 'in', 'to'], expr);

  return expr[0];
}
