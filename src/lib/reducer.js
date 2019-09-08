import {
  hasMonths, hasOwnKeyword,
  hasTimeUnit, hasExpr, hasChar,
} from './shared';

import {
  evaluateComparison,
} from './solver';

import {
  isArray,
  toSlice, toNumber, toFraction, toProperty, toArguments,
} from './utils';

import {
  fixArgs, fixValues, fixTokens, fixBinding,
} from './ast';

import Err from './error';
import Expr from './expr';
import Range from './range';

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
    const subTree = cb(ctx.env[ctx.cur.token[2]].body, ctx);

    ctx.cur = subTree.map(x => Expr.value(cb([
      Expr.from(['number', base]),
      Expr.from(['expr', '*', 'mul']),
    ].concat(x), ctx)));
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
    } else if (fixedUnit === 'fr') {
      ctx.left.token[1] = toFraction(ctx.left.token[1]);
      ctx.left.token[2] = ctx.left.token[2] ? `fr-${ctx.left.token[2]}` : 'x-fraction';
    }

    ctx.tokens.splice(ctx.i, 1);
    return false;
  }

  if (ctx.cur.token[0] === 'number') {
    // convert time-expressions into seconds
    if (ctx.isDate && hasTimeUnit(ctx.cur.token[2])) {
      ctx.cur.token[1] = convert(parseFloat(toNumber(ctx.cur.token[1])), ctx.cur.token[2], 's');
      ctx.cur.token[2] = 's';
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
      sub.forEach(x => {
        if (!x.every(y => ['symbol', 'unit'].includes(y.token[0]))) {
          throw new Error(`
            Methods to :import should be units,
              e.g. \`:import (a ...) :from "...";\`
          `);
        }

        if (x[0].token[0] === 'symbol' && x.length > 2) {
          throw new Error(`
            Expecting only one alias per method to :import,
              e.g. \`:import (..., :method alias) :from "...";\`
          `);
        }
      });
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

  const importInfo = Expr.input(set[':import']);
  const fromInfo = Expr.input(set[':from']);

  // extend current context with resolved bindings
  importInfo.forEach(def => {
    if (!isArray(def)) {
      Object.keys(def).forEach(k => {
        env[def[k][0]] = fixBinding(fromInfo[0], k, def[k][0], self);
      });
    } else {
      def.forEach(x => {
        if (x[0].charAt() === ':') {
          env[x[1]] = fixBinding(fromInfo[0], toProperty(x[0]), x[1], self);
        } else {
          x.forEach(y => {
            env[y] = fixBinding(fromInfo[0], y, null, self);
          });
        }
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
    return !fixArgs(subTree, false).some(x => {
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

        const args = test.reduce((p, c) => p.concat(c), []);
        const retval = Expr.value(cb(args, ctx));

        // evaluate respective branches
        if (not ? !retval.token[1] : retval.token[1]) {
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

        const seq = initialArgs.reduce((prev, cur) => {
          prev.push(...Range.resolve(cur.token[0] === 'range' ? cur.token[2] : Expr.input(cur), y =>
             Expr.ok(cb(forBranch, ctx, { _: { body: [Expr.derive(y)] } }))));

          return prev;
        }, []);

        ctx.ast.push(Expr.from(['object', seq.reduce((p, c) => p.concat(c), [])]));
        return true;
      } else if (set[':try'] || set[':catch']) {
        const tryBranch = set[':try'] || set[':catch'];
        const catchBranch = set[':try'] && set[':catch'];

        try {
          ctx.ast.push(...cb(tryBranch, ctx));
        } catch (e) {
          if (catchBranch) {
            ctx.ast.push(...cb(catchBranch, ctx));
          } else if (set[':try']) {
            ctx.ast.push(Expr.from(['error', e.message]));
          }
        }
        return true;
      } else if (Object.keys(set).length) {
        console.log('USER_LOGIC', fixValues(set));
        return true;
      }
      return false;
    });
  }
}

export function reduceFromFX(cb, ctx) {
  // handle logical expressions
  if (ctx.cur.token[0] === 'fx') {
    const [lft, rgt, ...others] = Expr.input(cb(toSlice(ctx.i, ctx.tokens, ctx.endOffset).slice(1), ctx));
    const result = evaluateComparison(ctx.cur.token[1], lft, typeof rgt === 'undefined' ? true : rgt, others);

    ctx.cur = Expr.derive(result);
    return;
  }

  // handle ranges...
  if (!isArray(ctx.right) && !ctx.cur.token[2] && ctx.cur.token[0] === 'range') {
    if (ctx.cur.token[1] === '..') {
      if (!(ctx.left.token[0] || ctx.right.token[0])) {
        throw new Error('Range has not given boundaries');
      }

      if (
        ctx.right.token[0]
        && !['number', 'string', 'object'].includes(ctx.right.token[0])
      ) {
        throw new Error(`Invalid range value, given \`${ctx.right.token[0]}\``);
      }
    }

    if (!['number', 'string', 'object'].includes(ctx.left.token[0])) {
      throw new Error(`Cannot unwind from \`${ctx.left.token[0]}\``);
    }

    // merge objects
    if (ctx.left.token[0] === 'object' && ctx.right.token[0] === 'object') {
      Object.assign(ctx.left.token[1], ctx.right.token[1]);
      ctx.tokens.splice(ctx.i, 2);
      return;
    }

    let target = Expr.from(ctx.cur);
    let base = ctx.left;

    if (!base.token[0]) {
      base = Expr.from(['number', 0]);
    } else {
      // drop token from left...
      ctx.tokens.splice(ctx.i - 1, 1);
    }

    // consume next token on untyped-ranges
    if (ctx.cur.token[1] === '..') {
      target = Expr.from(ctx.right);
      ctx.tokens.splice(ctx.i, 1);
    }

    if (!target.token[0]) {
      target = Expr.from(['number', 0]);
    }

    if (target.token[0] === 'range') {
      target.token[0] = 'number';
      target.token[1] = target.token[1].substr(2);
    }

    // mock AST
    ctx.isDef = true;

    const [fixedBase, fixedTarget] = cb([base, target], ctx);
    const fixedToken = Expr.from(ctx.cur);

    // recompose tokens on-the-fly
    fixedToken.token[1] = base.token[1] + ctx.cur.token[1] + (ctx.cur.token[1] === '..' ? target.token[1] : '');
    fixedToken.token[2] = new Range(Expr.input(fixedBase), Expr.input(fixedTarget));

    fixedToken.begin = base.begin || fixedToken.begin;
    fixedToken.end = target.end;

    ctx.ast.pop();
    ctx.ast.push(fixedToken);
    return false;
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

      ctx.env[name] = { ...call };
      Object.defineProperty(ctx.env[name], '_memo', { value: ctx.cur._memo });
      return false;
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

    const args = fixValues(cb(call.args, ctx), x => cb(x, ctx));
    const key = def._memo && JSON.stringify([name, args]);

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
    ctx.cur = Expr.value(ctx.cur);

    // flag token for future bindings...
    if (Object.keys(locals).length > 0) {
      Object.defineProperty(ctx.cur, '_bound', { value: locals });
    }

    // forward arguments to bindings, from the past!
    if (ctx.cur.token[0] === 'bind') {
      const fixedArgs = fixValues(args, x => x.map(y => Expr.input(y, y._bound, (z, data) => cb(z, ctx, data))));
      const fixedValue = ctx.cur.token[1][2](...fixedArgs);

      if (typeof fixedValue !== 'undefined') {
        if (isArray(fixedValue)) {
          ctx.ast.push(Expr.from(['object', fixedValue.reduce((p, c) => p.concat(Expr.ok(c)), [])]));
        } else {
          ctx.ast.push(Expr.derive(fixedValue));
        }
      }
      return false;
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
    isDef: null,
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
    ctx.isDef = ctx.root.isDef || ctx.isDef;

    // shared context
    ctx.i = i;
    ctx.cur = tokens[i];
    ctx.left = tokens[i - 1] || { token: [] };
    ctx.right = tokens[i + 1] || { token: [] };

    // store nearest offset to cut right before delimiters!
    ctx.endOffset = tokens.findIndex(x => !isArray(x) && x.token[0] === 'expr' && x.token[2] === 'k') - i;

    // handle anonymous sub-expressions
    if (isArray(ctx.cur)) {
      // unwind and keep side-effects as is
      if (!isArray(ctx.cur[0]) && ctx.cur[0].token[0] === 'fx') {
        ctx.ast.push(...fixArgs(ctx.cur));
        continue;
      }

      // evaluate the current node
      let fixedValue = fixArgs(cb(ctx.cur, ctx));

      // handle multiplication, e.g. `2(3)`
      if (
        !ctx.isDef
        && !isArray(ctx.left)
        && ['unit', 'number'].includes(ctx.left.token[0])
      ) {
        ctx.ast.push(Expr.from(['expr', '*', 'mul']), ...fixedValue);
      } else {
        // flatten intermediate AST to simplify validations
        fixedValue = fixedValue.reduce((prev, cur) => prev.concat(cur), []);

        // we're not inside a def-call...
        if (!ctx.isDef) {
          if (
            // handle multiple results
            fixedValue.length > 1

            // or nested-values (unknown)
            || !(fixedValue[0] instanceof Expr)

            // or anything that is not a range!
            || fixedValue[0].token[0] !== 'range'
          ) {
            // keep list-like values as objects
            ctx.ast.push(Expr.from(['object', fixedValue]));
          } else {
            // otherwise, just unwind and continue
            ctx.ast.push(...fixedValue);
          }
        } else if (fixedValue[0].token === 'range') {
          // ranges
          console.log('UNWIND RANGE');
          // ctx.ast.push(...fixedValue);
        } else {
          // evaluate reulting maths...
          fixedValue = Expr.ok(fixedValue);

          // just one result? unwind it...
          if (fixedValue.length === 1) {
            ctx.ast.push(...fixedValue);
          } else {
            // otherwise, just keep as object...
            ctx.ast.push(Expr.from(['object', fixedValue]));
          }
        }
      }
      continue;
    }

    if (!isArray(ctx.left)) {
      // flag well-known definitions, as they are open...
      if (['object', 'def', 'fx'].includes(ctx.cur.token[0])) ctx.isDef = true;

      // append last-operator between consecutive unit-expressions
      if (!ctx.isDef && ctx.left.token[0] === 'number' && ctx.cur.token[0] === 'number') {
        ctx.ast.push(Expr.from(ctx.lastOp));
      }

      try {
        if ([
          reduceFromLogic(cb, ctx, context),
          reduceFromFX(cb, ctx),
          reduceFromDefs(cb, ctx, context, memoizedInternals),
          reduceFromUnits(cb, ctx, context, settings.convertFrom),
        ].some(x => x === false)) continue;

        // handle interpolated strings
        if (!isArray(ctx.cur) && ctx.cur.token[0] === 'string') {
          ctx.ast.push(Expr.from(['string', ...ctx.cur.token.slice(1).reduce((prev, cur) => {
            if (isArray(cur)) {
              prev.push(Expr.plain(cb(cur, ctx)));
            } else {
              prev.push(cur);
            }

            return prev;
          }, [])]));
          continue;
        }

        if (!isArray(ctx.cur) && ctx.cur.token[0] === 'range' && ctx.cur.token[1] === '..') {
          const nextValue = Expr.input(cb(fixArgs(ctx.right), ctx)).map(x => Range.resolve(x, y => [Expr.derive(y)]));
          const nextAST = nextValue.reduce((p, c) => p.concat(c), []);

          ctx.tokens.splice(ctx.i + 1, 1);
          ctx.ast.push(nextAST);
          continue;
        }
      } catch (e) {
        // console.log(e);

        if (!(e instanceof Err)) {
          throw new Err(e, ctx);
        }

        throw e;
      }
    } else if (ctx.cur.token[0] === 'range' && ctx.cur.token[1] === '..') {
      // merge lists
      if (isArray(ctx.right)) {
        ctx.tokens.splice(ctx.i, 2);
        ctx.ast[ctx.ast.length - 1].token[1].push(...fixArgs(cb(ctx.right, ctx), true));
        continue;
      }

      // unwind lists
      if (!ctx.right.token[0]) {
        if (ctx.ast[ctx.ast.length - 1].token[0] !== 'object') {
          throw new Error(`Cannot unwind \`${ctx.ast[ctx.ast.length - 1].token[0]}\``);
        }

        ctx.ast.push(ctx.ast.pop().token[1]);
        continue;
      }
    }

    // skip definitions and symbols!
    if (!isArray(ctx.cur)) {
      ctx.ast.push(ctx.cur);
    } else {
      ctx.ast.push(...ctx.cur);
    }
  }

  return ctx.ast;
}
