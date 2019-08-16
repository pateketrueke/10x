import {
  isFx, isSep, isTime, isExpr,
  hasNum, hasMonths, hasTagName, hasOwnKeyword,
} from './parser';

import {
  evaluateComparison, calculateFromTokens,
} from './solver';

import {
  toValue, toNumber,
  fixArgs, fixTokens,
} from './ast';

export function reduceFromValue(token) {
  let text = token[1];

  // adjust hours given as numbers
  if (!text.includes(':') && /[ap]m$/.test(text)) {
    text = text.split(/(?=\d{2})/).join(':');
    text = text.replace(/(\d)(\w)/, '$1 $2');
  }

  // handle ISO strings
  if (text.length >= 10 && !text.includes(' ')) return new Date(text);

  const now = new Date();
  const year = now.getFullYear();
  const today = now.toString().split(' ').slice(0, 4).join(' ');

  if (text.includes(':')) return new Date(`${today} ${text}`);

  if (hasMonths(text)) {
    // remove number suffixes
    text = text.replace(/(\d+)[\sa-z]+$/, '$1');
    text = !text.includes(',') ? `${text}, ${year}` : text;

    return new Date(`${text} 00:00:00`);
  }

  // adjust weekdays
  if (['week', 'weekend'].includes(text.toLowerCase())) {
    const diffDay = text.toLowerCase() === 'weekend' ? 6 : 1;

    now.setDate(now.getDate() + (diffDay + 7 - now.getDay()) % 7);

    return now;
  }

  if (text.toLowerCase() === 'yesterday') return (now.setDate(now.getDate() - 1), now);
  if (text.toLowerCase() === 'tomorrow') return (now.setDate(now.getDate() + 1), now);
  if (text.toLowerCase() === 'today') return new Date(`${today} 00:00:00`);

  return now;
}

export function reduceFromTokens(tree, values) {
  return tree.reduce((prev, cur) => {
    const item = cur.slice();

    // iterate until we visit all tokens
    if (Array.isArray(item[0])) {
      prev.push(reduceFromTokens(item, values));
      return prev;
    }

    // replace token within unit-calls
    // if (item[0] === 'def' && item[2]) {
    //   item[2] = [reduceFromTokens(item[2][0], values)];
    // }

    // return as soon one matches!
    if (item[0] === 'unit' && values[item[1]]) {
      prev.push(values[item[1]]);
      return prev;
    }

    prev.push(item);

    return prev;
  }, []);
}

export function reduceFromArgs(keys, values) {
  const props = keys.filter(x => x[0] === 'unit');

  // compute a map from given units and values
  return props.reduce((prev, cur, i) => {
    let value = values.shift();

    // unwrap from nested values
    while (value.length === 1) value = value[0];

    if (!Array.isArray(value)) {
      value = [typeof value, typeof value === 'string' ? `"${value}"` : value];
    } else if (typeof value[0] !== 'string') {
      value = [typeof value, value];
    }

    prev[cur[1]] = value;
    return prev;
  }, {});
}

export function reduceFromInput(token) {
  // make sure we're parsing values!
  let fixedValue = token[1];

  if (token[0] === 'string') fixedValue = toValue(fixedValue);
  if (token[0] === 'number') fixedValue = parseFloat(toNumber(fixedValue));

  return fixedValue;
}

export function reduceFromEffect(value, args, def, cb) {
  const fixedValue = value[0][0] !== 'object'
    ? value.map(x => reduceFromInput(x))
    : reduceFromInput(value[0]);

  let fixedResult;

  // FIXME: apply ranges, e.g. n-m, -n, n..-m, etc. (strings, arrays only)
  if (def[1].substr(0, 2) === '::') {
    // FIXME: what to do?
  } else {
    fixedResult = fixedValue[def[1].substr(1)];
  }

  // handle lambda-calls as side-effects
  if (!args.length && def[2][0][0] === 'fn') {
    const input = def[2][0][2][0];
    const body = def[2][0][2].slice(1);
    const fixedArgs = {};

    args = fixArgs(def[2]).map(x => {
      const t = Array.isArray(x[0]) ? x[0] : x;
      const b = fixArgs(body[0].length === 1 ? body[0] : body);

      if (t[0] === 'fn') {
        return (...context) => {
          Object.assign(fixedArgs, reduceFromArgs(input, context));

          const peek = cb(reduceFromTokens(b[0], fixedArgs));
          const subTree = cb(reduceFromTokens(b.slice(1), fixedArgs));

          // return the last value from additional expressions
          if (subTree.length) return subTree.pop();

          // otherwise, we evaluate and return
          return calculateFromTokens(peek);
        };
      }

      return t;
    });
  }

  // apply side-effects!
  if (typeof fixedResult === 'function') {
    fixedResult = fixedResult.apply(fixedValue, args.map(x => {
      // FIXME: use classes/symbols to properly identify tokens?
      if (typeof x !== 'function') return [x];
      return x;
    }));
  }

  fixedResult = typeof fixedResult === 'string' ? `"${fixedResult}"` : fixedResult;

  // flatten back nested values from side-effects...
  if (fixedResult[0] === 'object' && Array.isArray(fixedResult[1])) {
    fixedResult[1] = fixedResult[1].map(x => x.length === 1 ? x[0] : x);
  }

  // recast previous token with the new value
  return [typeof fixedResult, fixedResult];
}

export function reduceFromAST(tokens, convert, expressions) {
  const cb = x => reduceFromAST(x, convert, Object.assign({}, expressions));

  const fixedTokens = [];
  const fixedStack = [];

  let isDate;
  let isSymbol;

  let lastUnit;
  let lastOp = ['expr', '+', 'plus'];

  for (let i = 0; i < tokens.length; i += 1) {
    let value = fixedTokens[fixedTokens.length - 1];

    let cur = tokens[i];
    let left = tokens[i - 1]
    let right = tokens[i + 1];

    // collect all tokens after symbols
    if (isSymbol || (!value && cur[0] === 'symbol'))  {
      isSymbol = true;
      fixedStack.push(cur);

      if (fixedStack.length && ((i == tokens.length - 1) || (cur[0] === 'expr' && isSep(cur[1])))) {
        const branches = fixTokens(fixedStack, false);

        console.log({branches});

        // handle if-then-else logic
        if (branches[':if'] || branches[':unless']) {
          const ifBranch = branches[':if'] || branches[':unless'];
          const orBranch = branches[':else'] || branches[':otherwise'];

          let not = branches[':unless'] && !branches[':if'];
          let test = (branches[':if'] || branches[':unless']).shift();

          // handle negative variations
          if (test[0] === 'expr' && test[2] === 'not') {
            not = true;
            test = ifBranch.shift();
            test = [].concat.apply([test[0]], test.slice(1));
          }

          const retval = calculateFromTokens(cb(test));

          // evaluate respective branches
          if (not ? !retval[1] : retval[1]) {
            fixedTokens.push(calculateFromTokens(cb(ifBranch)));
          } else if (orBranch) {
            fixedTokens.push(calculateFromTokens(cb(orBranch)));
          }
        }

        isSymbol = false;
      }
      continue;
    }

    // partial calls
    // if (left && cur[0] === 'fx' && ['lpipe', 'rpipe'].includes(cur[2]) && right && right[0] === 'def') {
    //   const rightToken = [right[0], right[1], [right[2][0].map(x => x.slice())]];
    //   const placeholder = rightToken[2][0].findIndex(x => x[0] === 'symbol' && x[1] === '_');

    //   // inject argument!
    //   if (placeholder >= 0) {
    //     rightToken[2][0][placeholder] = left;
    //   } else {
    //     if (cur[2] === 'lpipe') rightToken[2][0].unshift(left, ['expr', ',', 'or']);
    //     if (cur[2] === 'rpipe') rightToken[2][0].push(['expr', ',', 'or'], left);
    //   }

    //   const result = cb([rightToken]);
    //   const subTree = result.concat(tokens.slice(i + 2));

    //   fixedTokens.pop();
    //   fixedTokens.push(cb(subTree)[0]);
    //   break;
    // }

    // apply symbol-accessor op
    if (value && cur[0] === 'symbol' && ['unit', 'number', 'string', 'object'].includes(value[0])) {
      const args = fixArgs(cb(tokens[i + 1] || []), false)
        .map(x => calculateFromTokens(x));

      value = cb(fixArgs(left));
      value = reduceFromEffect(value, args, cur, cb);

      fixedTokens[fixedTokens.length - 1] = value;
      continue;
    }

    // just return from non-values or ops
    if (['string', 'object', 'boolean', 'function', 'undefined'].includes(cur[0])) {
      fixedTokens.push(cur);
      continue;
    }

    // handle logical expressions
    if (cur[0] === 'fx') {
      const [op, ...body] = tokens.slice(i);
      const args = [];

      let buffer = [];
      let offset = -1;

      // split on consecutive values
      for (let i = 0; i < body.length; i += 1) {
        if (['string', 'symbol', 'number', 'object', 'boolean', 'function', 'undefined'].includes(body[i][0])) offset++;
        if (offset >= 0) {
          buffer = args[offset] || (args[offset] = []);
          buffer.push(body[i]);
        }
      }

      // skip from non-arguments
      if (!args.length) {
        fixedTokens.push(cur);
        break;
      }

      // FIXME: validate input or something?
      const [lft, rgt, ...others] = args.map(x => calculateFromTokens(cb(x)));
      const result = evaluateComparison(cur[1], lft[1], rgt ? rgt[1] : undefined, others.map(x => x[1]));

      // also, how these values are rendered back?
      fixedTokens.push([typeof result, typeof result === 'string' ? `"${result}"` : result]);
      break;
    }

    // handle var/call definitions
    // if (cur[0] === 'def') {
    //   // console.log({left,cur,right});
    //   const isDef = cur[2]
    //     && ((cur[2][0][0] === 'expr' && cur[2][0][1] === '=')
    //     || (cur[2][1] && cur[2][1][0] === 'expr' && cur[2][1][1] === '='));

    //   // define var/call
    //   if (isDef) {
    //     expressions[cur[1]] = cur[2];
    //     continue;
    //   }

    //   // side-effects will operate on previous values
    //   const call = expressions[cur[1]] ? expressions[cur[1]].slice() : null;
    //   const args = cur[2];

    //   // skip undefined calls
    //   if (!call) continue;

    //   // compute valid sub-expressions from arguments
    //   const locals = reduceFromArgs(call[0], fixArgs(args));

    //   // prepend the  _ symbol to already curried functions
    //   if (call[1][0] === 'def' && call[1]._curry) {
    //     call.splice(1, 0, ...(args[0] || [['unit', '_']]), call[1]._curry);
    //   }

    //   // make sure we don't cut definitions without arguments
    //   const cut = (call[0][0] === 'expr' && call[0][1] === '=') ? 1 : 2;

    //   // replace all given units within the AST
    //   cur = reduceFromTokens(call.slice(cut), locals);

    //   if (cur[0][0] === 'fn') {
    //     const fixedArgs = fixArgs(args);

    //     // apply lambda-calls as we have arguments
    //     while (cur[0][0] === 'fn' && fixedArgs.length) {
    //       Object.assign(locals, reduceFromArgs(cur[0][2][0], fixedArgs));
    //       cur = reduceFromTokens(cur[0][2][1], locals);
    //     }
    //   }

    //   cur = calculateFromTokens(cb(cur));
    // }

    // handle unit expressions
    if (cur[0] === 'unit' && hasOwnKeyword(expressions, cur[1])) {
      cur = expressions[cur[1]].slice(1, expressions[cur[1]].length - 1);
    }

    // handle N-unit expressions
    if (cur[0] === 'number' && hasOwnKeyword(expressions, cur[2])) {
      const old = expressions[cur[2]];
      const val = parseFloat(cur[1]);
      const next = old.slice(1, old.length - 1);

      // we return a new expression from 3x to [3, *, x]
      cur = [['number', val], ['expr', '*', 'mul']].concat(next);
    }

    // handle resolution by recursion
    if (Array.isArray(cur[0])) {
      cur = calculateFromTokens(cb(cur));
    }

    // convert into Date values
    if (cur[2] === 'datetime') {
      isDate = true;
      cur[1] = reduceFromValue(cur);
    } else {
      const left = tokens[i - 1] || [];
      const right = tokens[i + 1] || [];

      // append last-operator between consecutive unit-expressions
      if (left[0] === 'number' && cur[0] === 'number') {
        // distance between tokens should be short!
        if ((cur._offset || 1) - (left._offset || 0) <= 2) {
          fixedTokens.push(lastOp);
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

    fixedTokens.push(cur);
  }

  return fixedTokens;
}
