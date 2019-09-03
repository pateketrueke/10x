import {
  isArray, toToken,
  hasNum, hasMonths, hasOwnKeyword,
  hasTimeUnit, hasExpr, hasChar, hasSep, hasOp,
} from './shared';

import {
  evaluateComparison, calculateFromTokens,
} from './solver';

import {
  fixArgs, fixValues, fixTokens, fixResult, fixBinding,
  toSlice, toList, toPlain, toInput, toNumber, toArguments,
} from './ast';

import LangErr from './error';
import RangeExpr from './range';

export function reduceFromValue(token) {
  let text = token[1];

  // adjust hours given as numbers
  if (!text.includes(':') && /[ap]m$/.test(text)) {
    text = text.split(/(?=\d{2})/).join(':');
    text = text.replace(/(\d)(\w)/, '$1 $2');
  }

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

    now.setDate(now.getDate() + ((diffDay + 7 - now.getDay()) % 7));

    return now;
  }

  if (text.toLowerCase() === 'yesterday') return (now.setDate(now.getDate() - 1), now);
  if (text.toLowerCase() === 'tomorrow') return (now.setDate(now.getDate() + 1), now);
  if (text.toLowerCase() === 'today') return new Date(`${today} 00:00:00`);

  return now;
}

export function reduceFromUnits(cb, ctx, self, convert) {
  // handle unit expressions
  if (ctx.cur.token[0] === 'unit' && (ctx.isDef || !hasOwnKeyword(self.units, ctx.cur.token[1]))) {
    if (!hasOwnKeyword(ctx.env, ctx.cur.token[1])) {
      throw new Error(`Missing definition of ${ctx.cur.token[0]} \`${ctx.cur.token[1]}\``);
    }

    // resolve definition body
    ctx.cur = cb(ctx.env[ctx.cur.token[1]].body.slice(), ctx);
    return;
  }

  // handle N-unit, return a new expression from 3x to [3, *, x]
  if (
    ctx.cur.token[0] === 'number'
    && !hasOwnKeyword(self.units, ctx.cur.token[2])
    && ctx.cur.token[2] && !['x-fraction', 'datetime'].includes(ctx.cur.token[2])
  ) {
    if (!hasOwnKeyword(ctx.env, ctx.cur.token[2])) {
      throw new Error(`Missing definition of ${ctx.cur.token[0]} \`${ctx.cur.token[1]}\``);
    }

    if (ctx.env[ctx.cur.token[2]].args) {
      throw new Error(`Unable to call ${ctx.cur.token[0]} definition \`${ctx.cur.token[1]}\``);
    }

    const base = parseFloat(ctx.cur.token[1]);
    const subTree = fixArgs(cb(ctx.env[ctx.cur.token[2]].body, ctx), true);

    ctx.cur = subTree.map(x => toToken(calculateFromTokens(toList(cb([
      toToken(['number', base]),
      toToken(['expr', '*', 'mul']),
    ].concat([x]), ctx)))));
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

export function reduceFromImports(set, env, self) {
  if (!set[':from']) {
    throw new Error(`
      Missing :from definition,
        e.g. \`:import (...) :from "...";\`
    `);
  }

  if (set[':from'].length > 1) {
    throw new Error(`
      Expecting only one :from definition,
        e.g. \`:import (...) :from "...";\`
    `);
  }

  set[':import'].forEach(sub => {
    if (isArray(sub)) {
      if (!sub[0].every(x => x.token[0] === 'unit')) {
        throw new Error(`
          Methods to :import should be units,
            e.g. \`:import (a ...) :from "...";\`
        `);
      }
    } else {
      const fixedKeys = Object.keys(sub.token[1]);

      if (!fixedKeys.every(x => hasChar(x.substr(1)))) {
        throw new Error(`
          Aliased methods to :import should be units,
            e.g. \`:import (:a ...) :from "...";\`
        `);
      }

      fixedKeys.forEach(key => {
        if (sub.token[1][key].length > 1) {
          throw new Error(`
            Expecting only one alias per method to :import,
              e.g. \`:import (:method alias) :from "...";\`
          `);
        }

        if (sub.token[1][key][0].token[0] !== 'unit') {
          throw new Error(`
            Aliased methods to :import should be units,
              e.g. \`:import (:method alias) :from "...";\`
          `);
        }
      });
    }
  });

  const importInfo = toPlain(set[':import']);
  const fromInfo = toPlain(set[':from']);

  // extend current context with resolved bindings
  importInfo.forEach(def => {
    if (!isArray(def)) {
      Object.keys(def).forEach(k => {
        env[def[k][0]] = fixBinding(fromInfo[0], k, def[k][0], self);
      });
    } else {
      def.reduce((prev, cur) => prev.concat(cur), []).forEach(y => {
        env[y] = fixBinding(fromInfo[0], y, null, self);
      });
    }
  });
}

export function reduceFromLogic(cb, ctx, self) {
  // collect all tokens after symbols
  if (ctx.cur.token[0] === 'symbol') {
    const subTree = toSlice(ctx.i, ctx.tokens, ctx.endOffset);
    const symbol = subTree.shift();

    // handle multiple branches
    fixArgs(subTree, false).some(x => {
      const set = fixTokens([symbol].concat(x));

      // handle foreign-imports
      if (set[':import']) {
        reduceFromImports(set, ctx.env, self);
        return false;
      }

      // handle if-then-else logic
      if (set[':if'] || set[':match'] || set[':not'] || set[':unless']) {
        const ifBranch = set[':if'] || set[':not'] || set[':match'] || set[':unless'];
        const orBranch = set[':else'] || set[':otherwise'];

        let not = (set[':not'] || set[':unless']) && !(set[':if'] || set[':match']);
        let test = ifBranch.shift();

        // handle negative variations
        if (!isArray(test) && test.token[0] === 'expr' && test.token[2] === 'not') {
          test = ifBranch.shift();
          not = !not;
        }

        const retval = toInput(calculateFromTokens(toList(cb(test, ctx))));

        // evaluate respective branches
        if (not ? !retval : retval) {
          ctx.ast.push(...cb(ifBranch, ctx));
          return true;
        }

        if (orBranch) {
          ctx.ast.push(...cb(orBranch, ctx));
          return true;
        }
      } else if (set[':each'] || set[':loop'] || set[':repeat']) {
        const forBranch = set[':each'] || set[':loop'] || set[':repeat'];
        const initialArgs = cb(forBranch.shift(), ctx);

        // handle between lists and chunks
        const seq = !isArray(initialArgs[0])
          ? RangeExpr.resolve(toInput(calculateFromTokens(toList(cb(initialArgs, ctx)))), x => cb(forBranch, ctx, x))
          : RangeExpr.resolve(toList(initialArgs).reduce((p, c) => p.concat(toInput(c)), []), x => cb(forBranch, ctx, x));

        if (
          seq.length === 1
          && !isArray(seq[0])
          && seq[0].token[0] === 'object'
        ) {
          ctx.cur = seq[0];
        } else {
          ctx.isDef = true;
          ctx.cur = toToken(['object', cb(seq, ctx)]);
        }
        return true;
      } else {
        console.log('SYM_LOGIC', set);
      }
      return false;
    });
  }
}

export function reduceFromFX(cb, ctx) {
  // handle logical expressions
  if (ctx.cur.token[0] === 'fx') {
    const [lft, rgt, ...others] = cb(toSlice(ctx.i, ctx.tokens, ctx.endOffset).slice(1), ctx).map(x => toInput(x.token));
    const result = evaluateComparison(ctx.cur.token[1], lft, rgt || true, others);

    ctx.cur = toToken(fixResult(result));
    return;
  }

  // handle ranges...
  if (
    !ctx.cur.token[2]
    && !isArray(ctx.right)
    && ctx.cur.token[0] === 'range'
    && ctx.right.token[0] !== 'symbol'
  ) {
    let target = toToken(ctx.cur);
    let base = ctx.left;
    let offset = 1;

    if (!base.token[0]) {
      base = toToken(['number', 0]);
    } else {
      // drop token from left...
      ctx.tokens.splice(ctx.i - 1, 1);
    }

    // consume next token on untyped-ranges
    if (ctx.cur.token[1] === '..') {
      target = toToken(ctx.right);
      ctx.tokens.splice(ctx.i, 1);
    }

    if (target.token[0] === 'range') {
      target.token[0] = 'number';
      target.token[1] = target.token[1].substr(2);
    }

    ctx.isDef = true;

    const [fixedBase, fixedTarget] = cb([base, target], ctx);

    // recompose tokens on-the-fly
    ctx.cur = toToken(ctx.cur);
    ctx.cur.token[1] = base.token[1] + ctx.cur.token[1] + (ctx.cur.token[1] === '..' ? target.token[1] : '');
    ctx.cur.token[2] = new RangeExpr(toInput(fixedBase.token), toInput(fixedTarget.token));

    ctx.cur.begin = base.begin || ctx.cur.begin;
    ctx.cur.end = target.end;
    ctx.ast.pop();
  }
}

export function reduceFromDefs(cb, ctx, self, memoizedInternals) {
  // handle var/call definitions
  if (ctx.cur.token[0] === 'def') {
    const name = ctx.cur.token[1];
    const call = ctx.cur.token[2];

    // define var/call
    if (ctx.cur._body) {
      if (hasOwnKeyword(self.units, name)) {
        throw new Error(`Cannot override built-in unit \`${name}\``);
      }

      ctx.env[name] = { ...call, _memo: ctx.cur._memo };
      return;
    }

    // side-effects will operate on previous values
    const def = ctx.env[name];

    // warn on undefined calls
    if (!(def && call)) {
      throw new Error(`Missing ${def ? 'arguments' : 'definition'} to call \`${name}\``);
    }

    // FIXME: improve error objects and such...
    if (def.args && def.args.length !== call.args.length && def.body[0][0] !== 'fn') {
      throw new Error(`Expecting \`${name}.#${def.args.length}\` args, given #${call.args.length}`);
    }

    const args = fixValues(call.args, x => cb(!isArray(x) ? [x] : x, ctx));
    const key = def._memo && JSON.stringify([name, toPlain(args)]);

    // this helps to compute faster!
    if (key && memoizedInternals[key]) {
      ctx.cur = memoizedInternals[key];
      return;
    }

    const locals = def.args ? toArguments(def.args, args) : {};

    ctx.cur = def.args
      ? cb(def.body.slice(), ctx, locals)
      : def.body.slice();

    if (!isArray(ctx.cur[0]) && ctx.cur[0].token[0] === 'fn') {
      if (ctx.cur.length > 1) {
        console.log('FNX', ctx.cur);
      }

      // apply lambda-calls as we have arguments
      while (!isArray(ctx.cur[0]) && ctx.cur[0].token[0] === 'fn' && args.length) {
        Object.assign(locals, toArguments(ctx.cur[0].token[2].args, args));
        ctx.cur = cb(ctx.cur[0].token[2].body, ctx, locals);
      }
    }

    // resolve intermediate values
    ctx.cur = toToken(calculateFromTokens(toList(ctx.cur)));

    // flag token for future bindings...
    if (Object.keys(locals).length > 0) {
      Object.defineProperty(ctx.cur, '_bound', { value: locals });
    }

    // forward arguments to bindings, from the past!
    if (ctx.cur.token[0] === 'bind') {
      const inputArgs = fixValues(args, x => x.map(y => toInput(y.token, (z, data) => cb(z, ctx, data), y._bound)), true);
      const inputValue = ctx.cur.token[1][2](...inputArgs);

      if (Array.isArray(inputValue)) {
        const fixedValues = inputValue.map(x => (isArray(x) ? calculateFromTokens(toList(x)) : x));

        ctx.cur = toToken(['object', fixedValues.map(x => (!isArray(x) ? toToken(fixResult(x)) : toToken(x)))]);
      } else {
        ctx.cur = toToken(fixResult(inputValue));
      }
      return;
    }

    // skip memoization from non scalar-values
    if (key && ['number', 'string'].includes(ctx.cur.token[0])) {
      memoizedInternals[key] = ctx.cur;
    }
  }
}

// FIXME: split into phases, let maths to be reusable... also, reuse helpers, lots of them!
export function reduceFromAST(tokens, context, settings, parentContext, parentExpressions = {}, memoizedInternals = {}) {
  const ctx = {
    tokens,
    ast: [],
    env: parentExpressions,
    isDate: null,
    lastUnit: null,
    lastOp: ['expr', '+', 'plus'],
  };

  // resolve from nested AST expressions
  const cb = (t, subContext, subExpressions) => {
    return reduceFromAST(t, context, settings, subContext, Object.assign({}, ctx.env, subExpressions), memoizedInternals);
  };

  // iterate all tokens to produce a new AST
  for (let i = 0; i < tokens.length; i += 1) {
    ctx.root = parentContext || {};

    // shared context
    ctx.i = i;
    ctx.cur = tokens[i];
    ctx.left = tokens[i - 1] || { token: [] };
    ctx.right = tokens[i + 1] || { token: [] };

    // store nearest offset to cut right before delimiters!
    ctx.endOffset = tokens.findIndex(x => !isArray(x) && x.token[0] === 'expr' && x.token[2] === 'k') - i;

    // handle anonymous sub-expressions
    if (isArray(ctx.cur)) {
      let fixedValue;

      // handle plain arrays
      if (
        ctx.root.cur
        && !isArray(ctx.root.cur)
        && ctx.root.cur.token[0] === 'object'
      ) {
        ctx.isDef = true;
        ctx.ast.push(cb(ctx.cur, ctx));
        continue;
      }

      // return unique leafs!
      if (
        !isArray(ctx.cur[0])
        && ctx.cur.length === 1
        && !['def', 'unit', 'range'].includes(ctx.cur[0].token[0])
      ) {
        ctx.ast.push(ctx.cur);
        continue;
      }

      // evaluate simple lists only (no separators)
      if (
        !isArray(ctx.cur[0])
        && !ctx.cur.some(x => !isArray(x) && x.token[0] === 'expr' && hasSep(x.token[1]))
      ) {
        fixedValue = calculateFromTokens(toList(cb(ctx.cur, ctx)));

        // prepend multiplication if goes after units/numbers
        if (!ctx.isDef && !isArray(ctx.left) && ['unit', 'number'].includes(ctx.left.token[0])) {
          ctx.ast.push(toToken(['expr', '*', 'mul']));
        }
      } else {
        fixedValue = ['object', fixArgs(cb(ctx.cur, ctx))];
      }

      ctx.ast.push(toToken(fixedValue));
      continue;
    }

    if (!isArray(ctx.left)) {
      // flag well-known definitions, as they are open...
      if (ctx.root.isDef || ['object', 'def', 'fx'].includes(ctx.cur.token[0])) ctx.isDef = true;

      // append last-operator between consecutive unit-expressions
      if (!ctx.isDef && ctx.left.token[0] === 'number' && ctx.cur.token[0] === 'number') {
        ctx.ast.push(toToken(ctx.lastOp));
      }

      try {
        reduceFromLogic(cb, ctx, context);
        reduceFromFX(cb, ctx);
        reduceFromDefs(cb, ctx, context, memoizedInternals);
        reduceFromUnits(cb, ctx, context, settings.convertFrom);

        // handle interpolated strings
        if (!isArray(ctx.cur) && ctx.cur.token[0] === 'string') {
          ctx.ast.push(toToken(['string', ctx.cur.token[1].reduce((prev, cur) => {
            if (isArray(cur)) {
              prev.push(toInput(calculateFromTokens(toList(cb(cur, ctx)))));
            } else {
              prev.push(cur);
            }

            return prev;
          }, [])]));
          continue;
        }

        // evaluate resulting object
        if (!isArray(ctx.cur) && ctx.cur.token[0] === 'object') {
          if (!isArray(ctx.cur.token[1])) {
            ctx.cur.token[1] = toPlain(ctx.cur.token[1], true, x => {
              const subTree = cb(x, ctx);

              return !isArray(subTree[0])
                ? [toToken(calculateFromTokens(toList(subTree)))]
                : subTree;
            });
          }

          if (
            !isArray(ctx.cur)
            && ctx.cur.token[0] === 'object'
            && ctx.left.token[0] === 'range' && ctx.left.token[1] === '..'
          ) {
            if (!isArray(ctx.cur.token[1])) {
              throw new Error(`Expecting sequence to unwind, given ${ctx.cur.token[1]}`);
            }

            ctx.ast.pop();
            ctx.ast.push(...ctx.cur.token[1]);
            continue;
          }
        }

        // unwind ranges that were left untouched...
        if (!isArray(ctx.cur) && ctx.cur.token[0] === 'range' && ctx.cur.token[2]) {
          ctx.ast.push(RangeExpr.resolve(ctx.cur.token[2], x => x._.body));
          continue;
        }
      } catch (e) {
        console.log(e)
        throw new LangErr(e.message, ctx);
      }
    }

    // skip definitions and symbols!
    if (isArray(ctx.cur)) ctx.ast.push(...ctx.cur);
    else if (!['symbol', 'def'].includes(ctx.cur.token[0])) ctx.ast.push(ctx.cur);
  }

  return ctx.ast;
}
