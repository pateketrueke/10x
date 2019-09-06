import {
  hasMonths, hasOwnKeyword,
  hasTimeUnit, hasExpr, hasChar, hasSep,
} from './shared';

import {
  evaluateComparison, calculateFromTokens,
} from './solver';

import {
  isArray,
  toList, toSlice, toNumber, toArguments,
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
    const subTree = fixArgs(cb(ctx.env[ctx.cur.token[2]].body, ctx), true);

    ctx.cur = subTree.map(x => Expr.value(cb([
      Expr.from(['number', base]),
      Expr.from(['expr', '*', 'mul']),
    ].concat([x]), ctx)));
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
          env[x[1]] = fixBinding(fromInfo[0], x[0].substr(1), x[1], self);
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

        const retval = Expr.value(cb(test[0].slice(), ctx));

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

        const seq = initialArgs.reduce((prev, cur, i) => {
          const it = Expr.input(cur);

          if (isArray(it)) {
            prev.push(...Range.resolve(it, y => cb(forBranch, ctx, y)));
          } else {
            prev.push(Range.resolve(typeof it === 'number' && i > 0 ? [it] : it, y => cb(forBranch, ctx, y)));
          }

          return prev;
        }, []);

        ctx.isDef = true;
        ctx.cur = Expr.from(['object', seq]);
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
    const [lft, rgt, ...others] = cb(toSlice(ctx.i, ctx.tokens, ctx.endOffset).slice(1), ctx).map(x => Expr.input(x));
    const result = evaluateComparison(ctx.cur.token[1], lft, typeof rgt === 'undefined' ? true : rgt, others);

    ctx.cur = Expr.derive(result);
    return;
  }

  // handle ranges...
  if (
    !ctx.cur.token[2]
    && !isArray(ctx.right)
    && ctx.cur.token[0] === 'range'
    && ctx.right.token[0] !== 'symbol'
  ) {
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

    if (target.token[0] === 'range') {
      target.token[0] = 'number';
      target.token[1] = target.token[1].substr(2);
    }

    ctx.isDef = true;

    const [fixedBase, fixedTarget] = cb([base, target], ctx);

    // recompose tokens on-the-fly
    ctx.cur = Expr.from(ctx.cur);
    ctx.cur.token[1] = base.token[1] + ctx.cur.token[1] + (ctx.cur.token[1] === '..' ? target.token[1] : '');
    ctx.cur.token[2] = new Range(Expr.input(fixedBase), Expr.input(fixedTarget));

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

    const args = Expr.ok(fixValues(cb(call.args, ctx), x => cb(x, ctx)));
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
      const fixedValue = fixValues(ctx.cur.token[1][2](...fixedArgs), Expr.value);

      if (isArray(fixedValue) && !(fixedValue[0] instanceof Expr)) {
        ctx.cur = Expr.from(['object', Expr.derive(fixedValue)]);
      } else {
        ctx.cur = Expr.from(['object', fixedValue]);
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
      // console.log('>>>',ctx.cur);

      // let fixedValue = Expr.value(ctx.cur);

      // if (fixedValue instanceof Expr) {
      //   ctx.ast.push(fixedValue);
      // } else {
      //   console.log({fixedValue});
      // }


      // // if (!isArray(ctx.cur[0]) && ctx.cur[0].token[0] === 'fx') {
      // //   ctx.ast.push(...ctx.cur);
      // //   continue;
      // // }

      // // const fixedValue = fixArgs(cb(ctx.cur, ctx), true);

      // // // skip single leafs
      // // if (fixedValue.length === 1) {
      // //   ctx.ast.push(fixedValue[0]);
      // //   continue;
      // // }

      // // if (!fixedValue.some(x => !isArray(x) && x.token[0] === 'expr')) {
      // //   ctx.ast.push(Expr.from(['object', fixedValue]));
      // // } else if (!ctx.isDef && !isArray(ctx.left) && ['unit', 'number'].includes(ctx.left.token[0])) {
      // //   ctx.ast.push(Expr.from(['expr', '*', 'mul']), Expr.value(fixedValue));
      // // } else {
      // //   ctx.ast.push(fixedValue);
      // // }
      ctx.ast.push(Expr.value(ctx.cur));
      continue;
    }

    if (!isArray(ctx.left)) {
      // flag well-known definitions, as they are open...
      if (['object', 'def', 'fx'].includes(ctx.cur.token[0])) ctx.isDef = true;

      // append last-operator between consecutive unit-expressions
      if (!ctx.isDef && ctx.left.token[0] === 'number' && ctx.cur.token[0] === 'number') {
        // console.log(ctx);
        ctx.ast.push(Expr.from(ctx.lastOp));
      }

      try {
        reduceFromLogic(cb, ctx, context);
        reduceFromFX(cb, ctx);
        reduceFromDefs(cb, ctx, context, memoizedInternals);
        reduceFromUnits(cb, ctx, context, settings.convertFrom);

        // handle interpolated strings
        // if (!isArray(ctx.cur) && ctx.cur.token[0] === 'string') {
        //   ctx.ast.push(Expr.from(['string', ...ctx.cur.token.slice(1).reduce((prev, cur) => {
        //     if (isArray(cur)) {
        //       prev.push(Expr.plain(cb(cur, ctx)));
        //     } else {
        //       prev.push(cur);
        //     }

        //     return prev;
        //   }, [])]));
        //   continue;
        // }

        // evaluate resulting object
        // if (!isArray(ctx.cur) && ctx.cur.token[0] === 'object') {
        //   if (!isArray(ctx.cur.token[1])) {
        //     console.log('OBJ');
        //     ctx.cur.token[1] = fixValues(ctx.cur.token[1], x => Expr.ok(cb(x, ctx)), true);
        //   }

        //   if (
        //     !isArray(ctx.cur)
        //     && ctx.cur.token[0] === 'object'
        //     && ctx.left.token[0] === 'range' && ctx.left.token[1] === '..'
        //   ) {
        //     if (!isArray(ctx.cur.token[1])) {
        //       throw new Error(`Expecting sequence to unwind, given ${ctx.cur.token[1]}`);
        //     }

        //     ctx.ast.pop();
        //     ctx.ast.push(...ctx.cur.token[1]);
        //     continue;
        //   }
        // }

        // unwind ranges that were left untouched...
        // if (!isArray(ctx.cur) && ctx.cur.token[0] === 'range' && ctx.cur.token[2]) {
        //   ctx.ast.push(Range.resolve(ctx.cur.token[2], x => x._.body));
        //   continue;
        // }
      } catch (e) {
        console.log(e)
        if (!(e instanceof Err)) {
          throw new Err(e, ctx);
        }

        throw e;
      }
    }

    // skip definitions and symbols!
    if (!isArray(ctx.cur)) {
      if (
        // keep non-string symbols...
        (ctx.cur.token[0] === 'symbol' && typeof ctx.cur.token[1] !== 'string')

        // keep most values and such...
        || (['expr', 'number', 'string', 'object'].includes(ctx.cur.token[0]))

        // keep definition calls only...
        || (ctx.cur.token[0] === 'def' && !ctx.cur._body)
      ) {
        ctx.ast.push(ctx.cur);
      }
    } else {
      ctx.ast.push(...ctx.cur);
    }
  }

  return ctx.ast;
}
