import {
  hasSep, hasTimeUnit, hasExpr,
  hasNum, hasMonths, hasTagName, hasOwnKeyword,
} from './shared';

import {
  evaluateComparison, calculateFromTokens,
} from './solver';

import {
  fixArgs, fixTokens,
  toPlain, toInput, toToken, toValue, toNumber,
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

export function reduceFromArgs(keys, values) {
  const props = keys.filter(x => x.token[0] === 'unit');

  // compute a map from given units and values
  return props.reduce((prev, cur, i) => {
    prev[cur.token[1]] = { body: [values.shift()] };
    return prev;
  }, {});
}

export function reduceFromUnits(cb, ctx, convert, expressions, supportedUnits) {
  // handle unit expressions
  if (ctx.cur.token[0] === 'unit') {
    if (!ctx.root.isDef && !ctx.isDef && !hasOwnKeyword(supportedUnits, ctx.cur.token[1])) {
      if (!hasOwnKeyword(expressions, ctx.cur.token[1])) {
        throw new ParseError(`Missing definition of ${ctx.cur.token[0]} \`${ctx.cur.token[1]}\``, ctx);
      }
    }

    // resolve definition body
    if (hasOwnKeyword(expressions, ctx.cur.token[1])) {
      ctx.cur = cb(expressions[ctx.cur.token[1]].body, ctx);
      return;
    }
  }

  // handle N-unit, return a new expression from 3x to [3, *, x]
  if (
    ctx.cur.token[0] === 'number'
    && !hasOwnKeyword(supportedUnits, ctx.cur.token[2])
    && ctx.cur.token[2] && !['x-fraction', 'datetime'].includes(ctx.cur.token[2])
  ) {
    if (!hasOwnKeyword(expressions, ctx.cur.token[2])) {
      throw new ParseError(`Missing definition of ${ctx.cur.token[0]} \`${ctx.cur.token[1]}\``, ctx);
    }

    if (expressions[ctx.cur.token[2]].args && expressions[ctx.cur.token[2]].args.length) {
      throw new ParseError(`Invalid usage of ${ctx.cur.token[0]} \`${ctx.cur.token[1]}\``, ctx);
    }

    const base = parseFloat(ctx.cur.token[1]);
    const subTree = fixArgs(cb(expressions[ctx.cur.token[2]].body, ctx)).reduce((p, c) => p.concat(c), []);

    ctx.cur = subTree.map(x => toToken(calculateFromTokens(cb([
      toToken(['number', base]),
      toToken(['expr', '*', 'mul']),
    ].concat([x]), ctx))));
    return;
  }

  // convert into Date values
  if (ctx.cur.token[2] === 'datetime') {
    ctx.isDate = true;
    ctx.cur.token[1] = reduceFromValue(ctx.cur.token);
    return;
  }

  // handle converting between expressions
  if (ctx.cur.token[0] === 'expr' && ctx.left.token[0] === 'number' && hasExpr(ctx.cur.token[1])) {
    const fixedUnit = ctx.right.token[0] === 'unit' ? (ctx.right.token[2] || ctx.right.token[1]) : ctx.right.token[2];

    if (fixedUnit && !['datetime', 'fr'].includes(fixedUnit) && ctx.left.token[2] && ctx.left.token[2] !== 'datetime') {
      ctx.left.token[1] = convert(parseFloat(toNumber(ctx.left.token[1])), ctx.left.token[2], fixedUnit);
      ctx.left.token[2] = fixedUnit;
    } else if (hasTimeUnit(ctx.left.token[2])) {
      ctx.left.token[1] = convert(parseFloat(toNumber(ctx.left.token[1])), ctx.left.token[2], 's');
      ctx.left.token[2] = 's';
    }
  }

  if (ctx.cur.token[0] === 'number') {
    // convert time-expressions into seconds
    if (ctx.isDate && hasTimeUnit(ctx.cur.token[2])) {
      ctx.cur.token[1] = convert(parseFloat(toNumber(ctx.cur.token[1])), ctx.cur.token[2], 's');
      ctx.cur.token[2] = 's';
    }

    // convert between units
    if (ctx.lastUnit && ctx.cur.token[2] && ctx.lastUnit !== ctx.cur.token[2]) {
      ctx.cur.token[1] = convert(parseFloat(toNumber(ctx.cur.token[1])), ctx.cur.token[2], ctx.lastUnit);
      ctx.cur.token[2] = ctx.lastUnit;
    }

    // save initial unit
    if (ctx.cur.token[2] && !ctx.lastUnit) ctx.lastUnit = ctx.cur.token[2];
  }

  // save last used operator
  if (ctx.cur.token[1] === '+' || ctx.cur.token[1] === '-') {
    ctx.lastOp = ctx.cur.token;
  }

  // flag the expression for dates
  if (hasTimeUnit(ctx.cur.token[2])) ctx.isDate = true;
}

export function reduceFromLogic(cb, ctx, expressions) {
  // collect all tokens after symbols
  if (ctx.cur.token[0] === 'symbol') {
    const subTree = ctx.cutFromOffset();
    const symbol = subTree.shift();

    // handle multiple branches
    fixArgs(subTree, false).some(x => {
      const branches = fixTokens([symbol].concat(x));
      // handle if-then-else logic
      if (branches[':if'] || branches[':unless']) {
        const ifBranch = branches[':if'] || branches[':unless'];
        const orBranch = branches[':else'] || branches[':otherwise'];

        let not = branches[':unless'] && !branches[':if'];
        let test = ifBranch.shift();

        // handle negative variations
        if (!Array.isArray(test) && test.token[0] === 'expr' && test.token[2] === 'not') {
          test = ifBranch.shift();
          not = !not;
        }

        const retval = calculateFromTokens(cb(test.slice(), ctx));

        // evaluate respective branches
        if (not ? !retval[1] : retval[1]) {
          ctx.ast.push(...cb(ifBranch, ctx));
        } else if (orBranch) {
          ctx.ast.push(...cb(orBranch, ctx));
        }

        return true;
      }

      // handle foreign-imports
      if (branches[':import']) {
        // FIXME: validate inputs...
        console.log(toPlain(branches, x => x.map(y => toInput(y.token))));
        return false;
      }

      console.log('SYM_LOGIC', branches);
      return false;
    });
  }
}

export function reduceFromFX(cb, ctx, expressions) {
  // handle logical expressions
  if (ctx.cur.token[0] === 'fx') {
    // FIXME: ... improve all this shit...
    const [lft, rgt, ...others] = cb(ctx.cutFromOffset().slice(1), ctx).map(x => toInput(x.token));
    const result = evaluateComparison(ctx.cur.token[1], lft, rgt || true, others);

    ctx.cur = toToken([typeof result, typeof result === 'string' ? `"${result}"` : result]);
  }
}

export function reduceFromDefs(cb, ctx, expressions, supportedUnits, memoizedInternals) {
  // handle var/call definitions
  if (ctx.cur.token[0] === 'def') {
    // define var/call
    if (ctx.cur._body) {
      if (hasOwnKeyword(supportedUnits, ctx.cur.token[1])) {
        throw new ParseError(`Cannot override built-in unit \`${ctx.cur.token[1]}\``, ctx);
      }

      expressions[ctx.cur.token[1]] = ctx.cur.token[2];
      return;
    }

    // side-effects will operate on previous values
    const name = ctx.cur.token[1];
    const call = ctx.cur.token[2];
    const def = expressions[name];

    // warn on undefined calls
    if (!(def && call)) {
      throw new ParseError(`Missing ${def ? 'arguments' : 'definition'} to call \`${name}\``, ctx);
    }

    // FIXME: improve error objects and such...
    if (def.args && def.args.length !== call.args.length && def.body[0][0] !== 'fn') {
      throw new ParseError(`Expecting \`${name}.#${def.args.length}\` args, given #${call.args.length}`, ctx);
    }

    const fixedArgs = cb(call.args, ctx);
    const fixedKey = JSON.stringify({ name, fixedArgs });

    // this helps to compute faster!
    if (memoizedInternals[fixedKey]) {
      ctx.cur = memoizedInternals[fixedKey];
      return;
    }

    const locals = def.args ? reduceFromArgs(def.args, fixedArgs) : {};

    ctx.cur = def.args ? cb(def.body.slice(), ctx, locals) : def.body.slice();

    // FIXME: validate arity while recursing...
    if (!Array.isArray(ctx.cur[0]) && ctx.cur[0].token[0] === 'fn') {
      const fixedLength = fixedArgs.length;

      if (ctx.cur.length > 1) {
        console.log('FNX', ctx.cur);
      }

      // apply lambda-calls as we have arguments
      while (!Array.isArray(ctx.cur[0]) && ctx.cur[0].token[0] === 'fn' && fixedArgs.length) {
        Object.assign(locals, reduceFromArgs(ctx.cur[0].token[2].args, fixedArgs));
        ctx.cur = cb(ctx.cur[0].token[2].body, ctx, locals);
      }

      if (fixedArgs.length) {
        throw new ParseError(`Expecting \`${name}.#${fixedLength - fixedArgs.length}\` args, given #${fixedLength}`, ctx);
      }
    }

    memoizedInternals[fixedKey] = ctx.cur = toToken(calculateFromTokens(ctx.cur));
  }
}

// FIXME: split into phases, let maths to be reusable... also, reuse helpers, lots of them!
export function reduceFromAST(tokens, convert, expressions, parentContext, supportedUnits, memoizedInternals = {}) {
  const ctx = {
    tokens,
    ast: [],
    isDate: null,
    lastUnit: null,
    lastOp: ['expr', '+', 'plus'],
  };

  // resolve from nested AST expressions
  const cb = (t, context, subExpressions) =>
    reduceFromAST(t, convert, Object.assign({}, expressions, subExpressions), context, supportedUnits, memoizedInternals);

  // iterate all tokens to produce a new AST
  for (let i = 0; i < tokens.length; i += 1) {
    ctx.root = parentContext || {};

    // shared context
    ctx.i = i;
    ctx.cur = tokens[i];
    ctx.left = tokens[i - 1] || { token: [] };
    ctx.right = tokens[i + 1] || { token: [] };

    // FIXME: improve this shit...
    ctx.endOffset = tokens.findIndex(x => !Array.isArray(x) && x.token[0] === 'expr' && x.token[2] === 'k') - i;
    ctx.cutFromOffset = () => (ctx.endOffset >= 0 ? ctx.tokens.splice(ctx.i, ctx.endOffset) : ctx.tokens.splice(ctx.i));

    // handle anonymous sub-expressions
    if (Array.isArray(ctx.cur)) {
      const fixedValue = calculateFromTokens(cb(ctx.cur, ctx));

      // prepend multiplication if goes after units/numbers
      if (!ctx.isDef && !Array.isArray(ctx.left) && ['unit', 'number'].includes(ctx.left.token[0])) {
        ctx.ast.push(toToken(['expr', '*', 'mul']));
      }

      ctx.ast.push(toToken(fixedValue));
      continue;
    }

    if (!Array.isArray(ctx.left)) {
      // flag well-known definitions, as they are open...
      if (ctx.root.isDef || ['def', 'fx'].includes(ctx.cur.token[0])) ctx.isDef = true;

      // append last-operator between consecutive unit-expressions
      if (!ctx.isDef && ctx.left.token[0] === 'number' && ctx.cur.token[0] === 'number') {
        ctx.ast.push(toToken(ctx.lastOp));
      }

      if (ctx.cur.token[0] === 'object') {
        ctx.ast.push(toToken(['object', toPlain(ctx.cur.token[1], x => cb(x, ctx))]));
        continue;
      }

      reduceFromLogic(cb, ctx, expressions);
      reduceFromFX(cb, ctx, expressions);
      reduceFromDefs(cb, ctx, expressions, supportedUnits, memoizedInternals);
      reduceFromUnits(cb, ctx, convert, expressions, supportedUnits);
    }

    // skip definitions only!
    if (Array.isArray(ctx.cur)) ctx.ast.push(...ctx.cur);
    else if (!['symbol', 'def'].includes(ctx.cur.token[0])) ctx.ast.push(ctx.cur);
  }

  return ctx.ast;
}
