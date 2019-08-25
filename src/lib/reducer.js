import {
  hasSep, hasTimeUnit, hasExpr,
  hasNum, hasMonths, hasTagName, hasOwnKeyword,
} from './shared';

import {
  evaluateComparison, calculateFromTokens,
} from './solver';

import {
  fixArgs, fixTokens,
  toToken, toValue, toNumber,
} from './ast';

import ParseError from './error';

export function reduceFromValue(token) {
  let text = token[1];

  // adjust hours given as numbers
  if (!text.includes(':') && /[ap]m$/.test(text)) {
    text = text.split(/(?=\d{2})/).join(':');
    text = text.replace(/(\d)(\w)/, '$1 $2');
  }

  // handle ISO strings
  if (text.length >= 10 && !isAny(text, ' ')) return new Date(text);

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
    // iterate until we visit all tokens
    if (Array.isArray(cur[0])) {
      prev.push(reduceFromTokens(cur, values));
      return prev;
    }

    // replace token within unit-calls
    if (cur[0] === 'def' && cur[2]) {
      cur[2].args = reduceFromTokens(cur[2].args, values);
    }

    if (
      // return as soon one matches!
      (cur[0] === 'unit' && values[cur[1]])

      // however, we replace _ symbols
      || (cur[0] === 'symbol' && cur[1] === '_')
    ) {
      prev.push(values[cur[1]]);
      return prev;
    }

    prev.push(cur);

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

export function reduceFromEffect(cb, def, args, value) {
  console.log('FX', {def,args,value});
  return [];
  // const fixedValue = value[0][0] !== 'object'
  //   ? value.map(x => reduceFromInput(x))
  //   : reduceFromInput(value[0]);

  // let fixedResult;

  // // FIXME: apply ranges, e.g. n-m, -n, n..-m, etc. (strings, arrays only)
  // if (def[1].substr(0, 2) === '::') {
  //   // FIXME: what to do?
  // } else {
  //   fixedResult = fixedValue[def[1].substr(1)];
  // }

  // // handle lambda-calls as side-effects
  // if (!args.length && def[2][0][0] === 'fn') {
  //   const input = def[2][0][2][0];
  //   const body = def[2][0][2].slice(1);
  //   const fixedArgs = {};

  //   args = fixArgs(def[2]).map(x => {
  //     const t = Array.isArray(x[0]) ? x[0] : x;
  //     const b = fixArgs(body[0].length === 1 ? body[0] : body);

  //     if (t[0] === 'fn') {
  //       return (...context) => {
  //         Object.assign(fixedArgs, reduceFromArgs(input, context));

  //         const peek = reduceFromTokens(b[0], fixedArgs);
  //         const subTree = reduceFromTokens(b.slice(1), fixedArgs);

  //         // return the last value from additional expressions
  //         if (subTree.length) return subTree.pop();

  //         // otherwise, we evaluate and return
  //         return calculateFromTokens(peek);
  //       };
  //     }

  //     return t;
  //   });
  // }

  // // apply side-effects!
  // if (typeof fixedResult === 'function') {
  //   fixedResult = fixedResult.apply(fixedValue, args.map(x => {
  //     // FIXME: use classes/symbols to properly identify tokens?
  //     if (typeof x !== 'function') return [x];
  //     return x;
  //   }));
  // }

  // fixedResult = typeof fixedResult === 'string' ? `"${fixedResult}"` : fixedResult;

  // // flatten back nested values from side-effects...
  // if (fixedResult[0] === 'object' && Array.isArray(fixedResult[1])) {
  //   fixedResult[1] = fixedResult[1].map(x => x.length === 1 ? x[0] : x);
  // }

  // // recast previous token with the new value
  // return [typeof fixedResult, fixedResult];
}

export function reduceFromUnits(cb, ctx, convert, expressions, supportedUnits) {
  // handle unit expressions
  if (ctx.cur[0] === 'unit') {
    if (!ctx.root.isDef && !ctx.isDef) {
      if (!hasOwnKeyword(expressions, ctx.cur[1])) {
        throw new ParseError(`Missing definition of ${ctx.cur[0]} \`${ctx.cur[1]}\``, ctx);
      }

      // resolve definition body
      if (expressions[ctx.cur[1]]) {
        ctx.cur = fixArgs(cb(expressions[ctx.cur[1]].body, ctx)).reduce((p, c) => p.concat(c), []);
      }
    }
  }

  // handle N-unit, return a new expression from 3x to [3, *, x]
  if (
    ctx.cur[0] === 'number'
    && !supportedUnits[ctx.cur[2]]
    && ctx.cur[2] && ctx.cur[2] !== 'x-fraction'
  ) {
    if (!hasOwnKeyword(expressions, ctx.cur[2])) {
      throw new ParseError(`Missing definition of ${ctx.cur[0]} \`${ctx.cur[1]}\``, ctx);
    }

    if (expressions[ctx.cur[2]].args.length) {
      throw new ParseError(`Invalid usage of ${ctx.cur[0]} \`${ctx.cur[1]}\``, ctx);
    }

    const base = parseFloat(ctx.cur[1]);
    const subTree = fixArgs(cb(expressions[ctx.cur[2]].body, ctx)).reduce((p, c) => p.concat(c), []);

    ctx.cur = calculateFromTokens(subTree.map(x => calculateFromTokens(cb([['number', base], ['expr', '*', 'mul']].concat([x]), ctx))));
  }

  // convert into Date values
  if (ctx.cur[2] === 'datetime') {
    ctx.isDate = true;
    ctx.cur[1] = reduceFromValue(ctx.cur);
    return;
  }

  const left = ctx.left || [];
  const right = ctx.right || [];

  // handle converting between expressions
  if (ctx.cur[0] === 'expr' && left[0] === 'number' && hasExpr(ctx.cur[1])) {
    const fixedUnit = right[0] === 'unit' ? (right[2] || right[1]) : right[2];

    if (fixedUnit && !['datetime', 'fr'].includes(fixedUnit) && left[2] && left[2] !== 'datetime') {
      left[1] = convert(parseFloat(toNumber(left[1])), left[2], fixedUnit);
      left[2] = fixedUnit;
    } else if (hasTimeUnit(left[2])) {
      left[1] = convert(parseFloat(toNumber(left[1])), left[2], 's');
      left[2] = 's';
    }
  }

  if (ctx.cur[0] === 'number') {
    // convert time-expressions into seconds
    if (ctx.isDate && hasTimeUnit(ctx.cur[2])) {
      ctx.cur[1] = convert(parseFloat(toNumber(ctx.cur[1])), ctx.cur[2], 's');
      ctx.cur[2] = 's';
    }

    // convert between units
    if (ctx.lastUnit && ctx.cur[2] && ctx.lastUnit !== ctx.cur[2]) {
      ctx.cur[1] = convert(parseFloat(toNumber(ctx.cur[1])), ctx.cur[2], ctx.lastUnit);
      ctx.cur[2] = ctx.lastUnit;
    }

    // save initial unit
    if (ctx.cur[2] && !ctx.lastUnit) ctx.lastUnit = ctx.cur[2];
  }

  // save last used operator
  if (ctx.cur[1] === '+' || ctx.cur[1] === '-') ctx.lastOp = ctx.cur;

  // flag the expression for dates
  if (hasTimeUnit(ctx.cur[2])) ctx.isDate = true;
}

export function reduceFromLogic(ctx, tokens, expressions) {
  // // collect all tokens after symbols
  // if (isSymbol || (!value && cur[0] === 'symbol'))  {
  //   isSymbol = true;
  //   fixedStack.push(cur);

  //   if (fixedStack.length && ((i == tokens.length - 1) || (cur[0] === 'expr' && hasSep(cur[1])))) {
  //     const branches = fixTokens(fixedStack, false);

  //     console.log({branches});

  //     // handle if-then-else logic
  //     if (branches[':if'] || branches[':unless']) {
  //       const ifBranch = branches[':if'] || branches[':unless'];
  //       const orBranch = branches[':else'] || branches[':otherwise'];

  //       let not = branches[':unless'] && !branches[':if'];
  //       let test = (branches[':if'] || branches[':unless']).shift();

  //       // handle negative variations
  //       if (test[0] === 'expr' && test[2] === 'not') {
  //         not = true;
  //         test = ifBranch.shift();
  //         test = [].concat.apply([test[0]], test.slice(1));
  //       }

  //       const retval = calculateFromTokens(cb(test));

  //       // evaluate respective branches
  //       if (not ? !retval[1] : retval[1]) {
  //         fixedTokens.push(calculateFromTokens(cb(ifBranch)));
  //       } else if (orBranch) {
  //         fixedTokens.push(calculateFromTokens(cb(orBranch)));
  //       }
  //     }

  //     isSymbol = false;
  //   }
  //   continue;
  // }
}

export function reduceFromFX(cb, ctx, expressions) {
  // partial calls
  if (ctx.left && ctx.cur[0] === 'fx' && ['lpipe', 'rpipe'].includes(ctx.cur[2]) && ctx.right && ctx.right[0] === 'def') {
    console.log('FX_PIPE_DEF');
    // const rightToken = [right[0], right[1], [right[2][0].map(x => x.slice())]];
    // const placeholder = rightToken[2][0].findIndex(x => x[0] === 'symbol' && x[1] === '_');

    // // inject argument!
    // if (placeholder >= 0) {
    //   rightToken[2][0][placeholder] = left;
    // } else {
    //   if (cur[2] === 'lpipe') rightToken[2][0].unshift(left, ['expr', ',', 'or']);
    //   if (cur[2] === 'rpipe') rightToken[2][0].push(['expr', ',', 'or'], left);
    // }

    // const result = cb([rightToken]);
    // const subTree = result.concat(tokens.slice(i + 2));

    // fixedTokens.pop();
    // fixedTokens.push(cb(subTree)[0]);
    // break;
  }

  // apply symbol-accessor op
  if (ctx.current && ctx.cur[0] === 'symbol' && ['unit', 'number', 'string', 'object'].includes(ctx.current[0])) {
    const args = fixArgs(cb(ctx.tokens[ctx.i + 1] || [], ctx), false)
      .map(x => calculateFromTokens(x));

    console.log('SYM_FX',{args,ctx});

    ctx.current = cb(fixArgs(ctx.left), ctx);

    // FIXME: this should receive whole context instead...
    ctx.current = reduceFromEffect(cb, ctx.cur, args, ctx.current);

    ctx.stack[ctx.stack.length - 1] = ctx.current;
    return;
  }

  // handle logical expressions
  if (ctx.cur[0] === 'fx') {
    const [op, ...body] = ctx.tokens.slice(ctx.i);
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
      ctx.stack.push(ctx.cur);
      return;
    }

    // FIXME: validate input or something?
    const [lft, rgt, ...others] = args.map(x => calculateFromTokens(cb(x, ctx)));
    const result = evaluateComparison(ctx.cur[1], lft[1], rgt ? rgt[1] : undefined, others.map(x => x[1]));

    // also, how these values are rendered back?
    ctx.stack.push([typeof result, typeof result === 'string' ? `"${result}"` : result]);
  }
}

export function reduceFromDefs(cb, ctx, expressions) {
  // handle var/call definitions
  // console.log({t:ctx.cur});

  if (ctx.cur[0] === 'def') {
    // define var/call
    if (ctx.cur._body) {
      expressions[ctx.cur[1]] = ctx.cur[2];
      return;
    }

    // side-effects will operate on previous values
    const def = expressions[ctx.cur[1]];
    const call = ctx.cur[2];

    // warn on undefined calls
    if (!(def && call)) {
      throw new ParseError(`Missing ${def ? 'arguments' : 'definition'} to call \`${ctx.cur[1]}\``, ctx);
    }

    // FIXME: improve error objects and such...
    if (def.args.length && def.args.length !== call.args.length && def.body[0][0] !== 'fn') {
      throw new ParseError(`Expecting \`${ctx.cur[1]}.#${def.args.length}\` args, given #${call.args.length}`, ctx);
    }

    // prepend _ symbol for currying
    if (!def.args.length) {
      if (call.args) {
        // FIXME: don't throw on lambda calls...
        // throw new ParseError(`Unexpected arguments for ${ctx.cur[0]} \`${ctx.cur[1]}\``, ctx);
      }

      def.args.unshift(['unit', '_']);
    }

    // FIXME: there is a side-effect, symbol/unit _ can appear twice...
    const locals = reduceFromArgs(def.args, cb(call.args, ctx));
    const definition = ctx.cur[1];

    // replace all given units within the AST
    ctx.cur = reduceFromTokens(def.body, locals);

    // FIXME: validate arity while recursing...
    if (ctx.cur[0][0] === 'fn') {
      const fixedArgs = cb(call.args, ctx);
      const fixedLength = fixedArgs.length;

      if (ctx.cur.length > 1) {
        console.log('FNX', ctx.cur);
      }

      // apply lambda-calls as we have arguments
      while (ctx.cur[0][0] === 'fn' && fixedArgs.length) {
        Object.assign(locals, reduceFromArgs(ctx.cur[0][2].args, fixedArgs));
        ctx.cur = reduceFromTokens(ctx.cur[0][2].body, locals);
      }

      if (fixedArgs.length) {
        throw new ParseError(`Expecting \`${definition}.#${fixedLength - fixedArgs.length}\` args, given #${fixedLength}`, ctx);
      }
    }

    ctx.cur = calculateFromTokens(cb(ctx.cur, ctx));
  }
}

// FIXME: split into phases, let maths to be reusable...
export function reduceFromAST(tokens, convert, expressions, parentContext, supportedUnits) {
  const ctx = {
    tokens,
    ast: [],
    stack: [],
    isDate: null,
    isSymbol: null,
    lastUnit: null,
    lastOp: ['expr', '+', 'plus'],
  };

  // create inner scope from given expressions
  const env = Object.assign({}, expressions);

  // resolve from nested AST expressions
  const cb = (t, context) => reduceFromAST(t, convert, env, context, supportedUnits);

  // iterate all tokens to produce a new AST
  for (let i = 0; i < tokens.length; i += 1) {
    ctx.root = parentContext || {};

    // shared context
    ctx.i = i;
    ctx.cur = tokens[i];
    ctx.left = tokens[i - 1] || { token: [] };
    ctx.right = tokens[i + 1] || { token: [] };
    ctx.current = ctx.ast[ctx.ast.length - 1];

    // handle anonymous sub-expressions
    if (Array.isArray(ctx.cur)) {
      const values = fixArgs(ctx.cur).map(x => x.length === 1 ? x[0] : x);

      // FIXME: return last value if void-op is given?
      // also, see if this whole shit is a pattern...
      const fixedValues = values.map(x => calculateFromTokens(cb(x, ctx)));
      const fixedToken = fixedValues.length !== 1
      ? fixedValues.reduce((p, c) => p.concat(cb([c], ctx)), [])
      : fixedValues[0];

      ctx.ast.push(toToken(fixedToken));
      continue;
    }

    // flag well-known definitions, as they are open...
    if (ctx.root.isDef || ctx.cur.token[0] === 'def') ctx.isDef = true;

    // append last-operator between consecutive unit-expressions
    if (!ctx.isDef && ctx.left.token[0] === 'number' && ctx.cur.token[0] === 'number') {
      ctx.ast.push(toToken(ctx.lastOp));
    }

    // if (Array.isArray(tokens[i][0]) && !Array.isArray(tokens[i][0][0])) {
    //   const values = fixArgs(tokens[i]).map(x => x.length === 1 ? x[0] : x);

    //   // prepend multiplication if goes after units/numbers
    //   // if (ctx.left && ['unit', 'number'].includes(ctx.left[0])) {
    //   //   ctx.ast.push(['expr', '*', 'mul']);
    //   // }

    //   // FIXME: return last value if void-op is given?
    //   // also, see if this whole shit is a pattern...
    //   const fixedValues = values.map(x => Array.isArray(x[0]) ? calculateFromTokens(x) : x);

    //   ctx.ast.push(fixedValues.length === 1 ? fixedValues[0] : fixedValues.reduce((p, c) => p.concat(cb([c], ctx)), []));
    //   continue;
    // }

    // reduceFromLogic(cb, ctx, expressions);
    // reduceFromFX(cb, ctx, expressions);
    // reduceFromDefs(cb, ctx, expressions);
    // console.log(ctx)
    // reduceFromUnits(cb, ctx, convert, expressions, supportedUnits);

    // skip definitions only
    if (!['def', 'symbol'].includes(ctx.cur.token[0])) ctx.ast.push(ctx.cur);
  }

  return ctx.ast;
}
