/* eslint-disable curly */
/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */

import Env from './env';
import Expr from './expr';
import Range from '../range';

import {
  EOL, COMMA, MINUS, PLUS, MUL, DIV, MOD, BLOCK, TUPLE, RANGE, LITERAL, NUMBER, STRING, SYMBOL,
  EQUAL, LESS_EQ, LESS, GREATER_EQ, GREATER, NOT, LIKE, NOT_EQ, EXACT_EQ, FFI,
  DERIVE_METHODS,
} from './symbols';

import {
  argv, only, raise, check, assert, hasDiff, hasIn, serialize,
  isInvokable, isComment, isObject, isLiteral, isScalar, isResult, isString, isNumber, isSymbol, isLogic, isData, isUnit, isBlock,
  isMixed, isPlain, isRange, isSlice, isArray, isSome, isEvery, isTuple, isComma, isPipe, isMath, isNot, isMod, isEnd, isDot, isEOL, isOR,
} from '../helpers';

export default class Eval {
  constructor(tokens, environment, noInheritance) {
    if (!(environment instanceof Env)) {
      environment = null;
    }

    this.convert = Eval.wrap(this);
    this.derive = !!(noInheritance && environment);
    this.expr = tokens;
    this.env = !this.derive ? new Env(environment) : environment;

    this.descriptor = 'Root';
    this.result = [];
    this.offset = 0;

    this.key = null;
    this.ctx = null;
  }

  replace(v, ctx) {
    if (!ctx) {
      this.result[Math.max(0, this.result.length - 1)] = v;
    } else {
      this.ctx = v;
    }

    return this;
  }

  discard(n = 1) { while (n--) this.result.pop(); return this; }
  append(...a) { this.result.push(...a); return this; }
  move(n) { this.offset += n || 1; return this; }

  isLazy() { return ['Loop', 'Set'].includes(this.descriptor); }
  isDone() { return this.offset >= this.expr.length; }

  getOlder() { return this.result[this.result.length - 2]; }
  getPrev() { return this.result[this.result.length - 1]; }

  olderToken() { return this.expr[this.offset - 2]; }
  newerToken() { return this.expr[this.offset + 2]; }
  nextToken() { return this.expr[this.offset + 1]; }
  oldToken() { return this.expr[this.offset - 1]; }

  async execute(label, callback) {
    const tokens = this.result = [];

    this.descriptor = label;
    this.offset = 0;

    for (; !this.isDone(); this.move()) try {
      this.ctx = this.expr[this.offset];
      if (isComment(this.ctx)) continue;
      await callback();
    } catch (e) {
      if (e instanceof TypeError) {
        raise(e.message, this.ctx.tokenInfo, label);
      }

      e.prevToken = this.oldToken() || this.olderToken();
      e.stack = e.message;

      throw e;
    }

    this.descriptor = 'Root';
    this.result = [];

    return tokens;
  }

  async evalInfixCalls() {
    const prev = this.getPrev();
    const older = this.getOlder();
    const next = this.nextToken();

    // evaluate infix operators, e,.g. `"foo" calls "bar"` (only for scalar values!)
    if (
      isResult(older)
      && prev.isCallable
      && isResult(this.ctx)
      && !isEnd(this.olderToken())
    ) {
      if (isTuple(this.ctx)) {
        const [head, ...tail] = await Eval.do(this.ctx.getArgs(), this.env, 'Fn', false, this.ctx.tokenInfo);
        const args = [older, Expr.from(COMMA), head];

        this.discard(2)
          .append(...await Eval.do([prev, Expr.block({ args }, prev.tokenInfo)], this.env, 'Lit', false, this.ctx.tokenInfo))
          .append(...tail);
      } else {
        const args = [older, Expr.from(COMMA), this.ctx];

        this.discard(2).append(...await Eval.do([prev, Expr.block({ args }, prev.tokenInfo)], this.env, 'Lit', false, this.ctx.tokenInfo));
      }
      return true;
    }

    // evaluate pipe-operator, e.g. `3 |> sum(5) |> sum(8)`
    if (isPipe(this.ctx)) {
      if (!isData(prev)) check(this.ctx, 'value', 'before');
      if (!next || !isInvokable(next)) check(this.ctx, 'callable', 'after');

      assert(next, true, LITERAL, TUPLE);

      const nextToken = this.expr[this.offset + 2];

      let nextArgs = isTuple(nextToken) ? nextToken.getArgs() : null;
      let cutOffset = isTuple(nextToken) ? 2 : 1;
      let fixedBody = [];

      // eat whole expression before block-calls, e.g. `x |> a.b.c()`
      if (isDot(nextToken)) {
        const { body, offset } = Expr.chunk(this.expr, this.offset + 1, true);

        cutOffset = offset;
        nextArgs = isTuple(body[body.length - 1]) ? body.pop().getArgs() : null;
        fixedBody = body.concat(Expr.block({ args: [prev].concat(nextArgs ? Expr.from(COMMA) : [], nextArgs || []) }, next.tokenInfo));
      } else {
        fixedBody = [next, Expr.block({ args: [prev, Expr.from(COMMA)].concat(nextArgs || []) }, next.tokenInfo)];
      }

      this.discard().append(...await Eval.do(fixedBody, this.env, 'Fn', false, this.ctx.tokenInfo));
      this.move(cutOffset);
      return true;
    }

    // evaluate context-in-literals, e.g. `fn % :n 2`
    if (isBlock(prev) && isMod(this.ctx) && next.isObject) {
      this.discard().append(...await Eval.do(prev.getBody(), Env.create(next.valueOf()), '%', false, this.ctx.tokenInfo)).move();
      return true;
    }
  }

  // evaluate accessors, e.g. `ctx.prop`
  async evalDotProps() {
    const prev = this.getPrev();
    const next = this.nextToken();

    if (isDot(this.ctx)) {
      if (!prev || (isNumber(prev) && !isUnit(prev)) || isSymbol(prev)) {
        // allow method-calls through numbers, e.g. `1.times`
        if (isNumber(prev) && isLiteral(next) && this.env.has(next.value)) {
          const call = this.env.get(next.value);

          if (call.body[0].getArgs().length !== 1) {
            raise(`Unexpected call to \`${next.value}\``);
          }

          const scope = new Env(this.env);
          const body = call.body[0].getBody();

          Env.merge([prev], call.body[0].getArgs(), false, scope);

          this.discard()
            .append(...await Eval.do(body, scope, 'Call', false, this.ctx.tokenInfo))
            .move(2);
          return true;
        }

        check(prev || this.ctx, 'map', prev ? null : 'before');
      }

      if (!(isLiteral(next) || (isBlock(next) && next.value.name))) {
        if (!next) {
          check(this.ctx, LITERAL, 'after');
        } else {
          assert(next, true, LITERAL);
        }
      }

      const key = next.value.name || next.value;
      const map = isArray(prev) ? Expr.plain(prev.value) : prev.value;

      if (typeof map[key] === 'undefined') {
        let info;

        if (typeof map === 'string') {
          info = `\`${serialize(map)}\``;
        } else if (!Array.isArray(map)) {
          info = `(${Object.keys(map).map(k => `:${k}`).join(' ')})`;
        } else {
          info = `[${map.length > 1 ? `0..${map.length - 1}` : map.length}]`;
        }

        raise(`Missing property \`${next}\` in ${info}`, next.tokenInfo);
      }

      // handle method-calls, e.g. `foo.bar()`
      const newToken = this.newerToken();

      if (typeof map[key] === 'function' && isTuple(newToken) && newToken.hasArgs) {
        const fixedArgs = await Eval.do(newToken.getArgs(), this.env, 'Args', false, this.ctx.tokenInfo);
        const result = await map[key](...Expr.plain(fixedArgs, this.convert, `<${key}>`));

        this.discard();

        if (typeof result !== 'undefined') {
          this.append(Expr.value(result));
        }

        this.move(2);
        return true;
      }

      // extract or convert from resolved value, otherwise update props, e.g. `foo.bar = 42`
      if (!isTuple(next) && !isBlock(next)) {
        if (map[key] instanceof Expr) {
          this.discard().append(...await Eval.do(map[key].getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else {
          this.replace(Expr.value(map[key])).move();
        }
      } else if (map[key] instanceof Expr) {
        map[key].value.body = await Eval.do(next.getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo);
        this.discard().move();
      } else {
        map[key] = Expr.plain(next.head(), this.convert, `<${key}>`);
        this.discard().move();
      }
      return true;
    }
  }

  async evalRangeSets() {
    const prev = this.getPrev();
    const next = this.nextToken();

    // evaluate partial ranges from next values, e.g. `[1..3:1-3:0..2]`
    if (isRange(prev) && isSlice(this.ctx)) {
      if (prev.value instanceof Range) {
        prev.value.take(this.ctx.value);

        if (!this.isLazy()) {
          this.discard().append(...await prev.value.run(true));
        }
      } else {
        this.discard().append(...await Range.unwrap(prev.value, token => [token], this.ctx));
      }
      return true;
    }

    // handle partial and full ranges
    if (isRange(this.ctx)) {
      const options = await Eval.do(this.ctx.value, this.env, 'Set', false, this.ctx.tokenInfo);

      if (isArray(this.ctx)) {
        // unpack statements within ranges, e.g. `[[:k 1, 2]:k]`
        this.append(Expr.array(options.reduce((p, c) => {
          if (c.isStatement) p.push(...c.getBody());
          else p.push(c);
          return p;
        }, []), this.ctx.tokenInfo));
      } else {
        assert(options.begin[0], true, NUMBER, STRING);
        assert(options.end[0], true, NUMBER, STRING);

        const fixedRange = Range.from(options.begin[0], options.end[0]);
        const subTree = await fixedRange.run(!this.isLazy() && !isSlice(next));

        this.replace(Expr.from(RANGE, subTree, this.ctx.tokenInfo));
      }
      return true;
    }
  }

  async evalLiterals() {
    const target = this.env.get(this.ctx.value);
    const next = this.nextToken();

    if (
      !isLiteral(target.body[0])
      && !target.body[0].isCallable
      && !target.body[0].hasArgs
      && isTuple(next)
      && !next.hasBody
      && !target.args
    ) {
      if (target.body[0].type !== FFI) raise(`Unexpected call to \`${this.ctx}\``);
    }

    // invoke definitions with `..` args
    if (
      isTuple(next)
      && target.body[0].isCallable
      && target.body[0].value.args === null
    ) {
      const body = target.body[0].value.body[1].value.args.slice();
      const offset = body.findIndex(x => isLiteral(x, '..'));

      body.splice(offset, 1, ...next.value.args);

      const input = await Eval.do([
        target.body[0].value.body[0],
        Expr.from(TUPLE, { args: body }, this.ctx.tokenInfo),
      ], this.env, 'Lit', false, this.ctx.tokenInfo);

      this.append(...input).move();
      return true;
    }

    // consume and merge next arguments into range-literals!
    if (
      isTuple(next)
      && target.args
      && target.args.some(x => isLiteral(x, '..'))
    ) {
      const newToken = Expr.callable({ type: BLOCK, value: target }, this.ctx.tokenInfo).clone();

      Expr.sub(newToken.value.body, { '..': [Expr.body(next.getArgs(), this.ctx.tokenInfo)] });
      this.discard().append(...await Eval.do(newToken.getBody(), this.env, 'Lit', false, this.ctx.tokenInfo)).move();
      return true;
    }

    // keep strings unevaluated if they're followed by `%`
    if (target.ctx && isMod(next) && isString(target.body[0])) {
      this.append(...target.body);
      return true;
    }

    if (this.ctx.cached) {
      target.body[0].cached = {};
    }

    // pre-evaluate most expressions from literals
    this.append(...await Eval.do(target.body, this.env, 'Lit', false, this.ctx.tokenInfo));
    return true;
  }

  async evalLogic() {
    // evaluate logical expressions, e.g. `(< 1 2)`
    const { type, value } = this.ctx;
    const result = await Eval.do(value, this.env, 'Expr', true, this.ctx.tokenInfo);

    // evaluate multiple checks, e.g. `(? a b c)` OR `($ x y z)`
    if (isSome(this.ctx) || isEvery(this.ctx)) {
      const values = await Promise.all(result.map(token => {
        return Eval.do([token], this.env, 'Expr', false, this.ctx.tokenInfo);
      }));

      this.append(Expr.value(values[isSome(this.ctx) ? 'some' : 'every'](x => x[0].valueOf())));
      return true;
    }

    if (result.length > 2) raise(`Expecting exactly 2 arguments, given ${result.length}`);

    this.append(Eval.logic(type, result[0], result[1], this.ctx.tokenInfo));
    return true;
  }

  async evalBlocks() {
    const prev = this.getPrev();

     // pre-evaluate from any callable expressions, e.g. (fn)(...)
    if (
      prev && this.descriptor !== 'Expr'
      && !(isMath(prev) || isEnd(prev))
      && !isEnd(this.oldToken())
    ) {
      if (!(prev.isFFI || prev.isCallable || prev.isFunction || isMixed(prev, 'function'))) {
        check(prev, 'callable');
      }

      // pass unevaluated arguments to raw (very low-level) FFI-calls
      if (prev.isFFI && prev.isRaw) {
        const callback = (...input) => Eval.do(input, this.env, 'FFI', false, this.ctx.tokenInfo);
        const result = await prev.value.target(this.ctx.getArgs(), callback);

        if (typeof result === 'undefined') this.discard();
        else this.replace(Expr.value(result, this.ctx.tokenInfo));
        return true;
      }

      // filter out placeholders to consume values
      const args = await Eval.do(this.ctx.getArgs(), this.env, 'Call', false, this.ctx.tokenInfo);
      const fixedArgs = args.filter(x => !isLiteral(x, '_'));

      // pass evaluated args to low-level FFIs
      if (prev.isFFI) {
        let result;

        // spread arguments if not block is given... e.g. `f((1, 2))`
        if (!(this.ctx.getArg(0) && this.ctx.getArg(0).isTuple)) {
          result = await prev.value.target(...fixedArgs);
        } else {
          result = await prev.value.target(fixedArgs);
        }

        if (typeof result === 'undefined') this.discard();
        else this.replace(Expr.value(result, this.ctx.tokenInfo));
        return true;
      }

      // invoke plain functions from literals (interop mostly)
      if (isMixed(prev, 'function')) {
        const result = await prev.valueOf()(...Expr.plain(fixedArgs, this.convert, `<${prev.value.name || 'Function'}>`));

        // ensure undefined values are discarded from the stack!
        if (typeof result === 'undefined') this.discard();
        else this.replace(Expr.value(result));
        return true;
      }

      // invoke foreign-calls from external imports
      if (prev.value.env instanceof Env) {
        const { env, label, target } = prev.valueOf();

        if (this.descriptor === 'Lit') {
          this.replace(Expr.fn({
            env, label, target, args: fixedArgs,
          }, this.ctx.tokenInfo));
        } else {
          const scope = new Env(env);
          const { body } = env.get(target);
          const nextArgs = (prev.hasArgs ? prev.getArgs() : []).concat(fixedArgs);

          Env.merge(Expr.args(nextArgs), body[0].getArgs(), false, scope);

          this.discard()
            .append(...await Eval.do(body[0].getBody(), scope, label, false, this.ctx.tokenInfo));
        }
        return true;
      }

      // invoke functions (high-level FFIs, interop only)
      if (prev.isFunction) {
        const { label, target } = prev.valueOf();
        const nextArgs = (prev.getArgs() || []).concat(fixedArgs);
        const result = await target(...Expr.plain(nextArgs, this.convert, label));

        if (typeof result !== 'undefined') {
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        } else {
          this.discard();
        }
        return true;
      }

      // prefill scope with current arguments
      const { target, scope } = Env.sub(fixedArgs, prev.value, this.env);

      // check arguments length, but skip such validation if spread args are given!
      if (fixedArgs.length > prev.length && !prev.getArgs().some(x => isLiteral(x, '..'))) {
        argv(args, prev, prev.length);
      }

      if (prev.hasInput) {
        // insert given args at placeholder positions!
        const nextArgs = prev.getArgs().map((sub, j) => {
          if (isLiteral(sub, '_')) {
            if (!args.length) argv(null, prev, j);
            return args.shift();
          }

          return sub;
        });

        const offset = nextArgs.length + args.length;

        // validate given arguments
        if (offset < prev.value.length) argv(null, prev, offset);
        if (offset > prev.value.length) argv(args, prev, offset - 1);

        // append given arguments for next-call
        if (nextArgs.length < prev.value.length) {
          nextArgs.push(Expr.from(COMMA), ...fixedArgs);
        }

        this.discard().append(...await Eval.do([
          Expr.callable({
            type: BLOCK,
            value: {
              args: prev.getInput(),
              body: this.env.get(prev.getName()).body,
            },
          }, prev.tokenInfo),
          Expr.block({ args: nextArgs }, this.ctx.tokenInfo),
        ], this.env, 'Fn', false, prev.tokenInfo));
        return true;
      }

      // handle partial-application from immediate calls, e.g. `add5=sum(5)`
      if (prev.source && fixedArgs.length < prev.length) {
        if (target.args.length < prev.length) {
          target.args = prev.getArgs().concat(target.args);
        }

        if (
          this.descriptor !== 'Lit'
          && prev.isCallable
          && prev.length && !fixedArgs.length
        ) {
          raise(`Missing arguments to call \`${prev.getName()}\``);
        }

        this.replace(Expr.callable({
          type: BLOCK,
          value: {
            args,
            input: target.args,
            source: prev.source,
            length: prev.length,
          },
        }, prev.tokenInfo));
      } else {
        let clean = false;
        let ctx = scope;
        let key;

        if (prev.cached) {
          key = `#${fixedArgs.toString()}`;

          if (prev.cached[key]) {
            this.discard().append(...prev.cached[key]);
            return true;
          }
        }

        // extend current scope with any given locals (not perfectly!)
        if (target.body.some(x => isTuple(x) && x.isRaw)) {
          if (this.descriptor === 'Eval' || this.descriptor === 'Fn') {
            this.env = new Env(this.env);
          }

          ctx = this.env;
          clean = target.body.length === 1 && isTuple(target.body[0]);
        }

        // make sure we fulfill the arguments!
        if (target.args && target.args.length === fixedArgs.length) {
          Env.merge(fixedArgs, target.args, clean, ctx);
        }

        const result = await Eval.do(target.body, ctx, `:${prev.getName() || ''}`, true, this.ctx.tokenInfo);

        if (key) {
          if (this.descriptor !== 'Eval') {
            prev.cached[key] = result;
          } else {
            delete prev.cached;
          }
        }

        this.discard().append(...result);
      }
      return true;
    }

    const { name, args, body } = this.ctx.valueOf();

    // evaluate or expand definitions in place!
    if (this.ctx.isCallable) {
      if (name && body) {
        const call = !args && this.derive && DERIVE_METHODS.includes(this.descriptor)
          ? await Eval.do(body, this.env, 'Fn', true, this.ctx.tokenInfo)
          : body;

        // extract arity from nested definitions
        if (call[0].isCallable && call[0].hasArgs) {
          call[0].length = Expr.arity(call[0]);
          call[0].source = name;
        }

        this.env.defn(name, { args, body: call }, this.ctx.tokenInfo);
      } else {
        this.append(this.ctx);
      }
    } else {
      const fixedBody = args || body;
      const derived = this.derive || (fixedBody[0] && fixedBody[0].isObject);

      this.append(...await Eval.do(args || body, this.env, derived ? this.descriptor : '...', derived, this.ctx.tokenInfo));
    }
    return true;
  }

  async evalUnary() {
    const prev = this.getPrev();

    // evaluate negative numbers that are lone, e.g. `-1` BUT NOT `1-2`
    if (prev && prev.type === MINUS && !isNumber(this.getOlder())) {
      if (!isNumber(this.ctx)) {
        assert(this.ctx, false, NUMBER);
      }

      this.replace(Expr.value(this.ctx * -1, this.ctx.tokenInfo));
      return true;
    }

    // short-circuit from missing values!
    if ((!prev || isEnd(prev)) && isOR(this.ctx)) {
      return true;
    }

    // evaluate negations on values, e.g. `!0` OR `!"foo"`
    if (isNot(prev) && isResult(this.ctx)) {
      // evaluate literals and blocks, e.g. `!(1)` OR `!foo`
      if (isLiteral(this.ctx)) {
        [this.ctx] = await Eval.do([this.ctx], this.env, 'Expr', true, this.ctx.tokenInfo);
      }

      this.replace(Expr.value(!this.ctx.valueOf(), this.ctx.tokenInfo));
      return true;
    }

    // evaluate if-then/else-operator, e.g. `x ? y | z`
    if (isResult(prev) && (isOR(this.ctx) || isSome(this.ctx))) {
      if (isSome(this.ctx) ? !prev.valueOf() : prev.valueOf()) {
        this.move(Expr.chunk(this.expr, this.offset + 1).offset);
      } else {
        this.discard();
      }
      return true;
    }
  }

  async evalSymbols() {
    const prev = this.getPrev();
    const next = this.nextToken();

    // expand expressions into symbols, e.g. `:(...)` OR `:"#{...}"`
    if (isSymbol(this.ctx) && this.ctx.value === ':') {
      if (isTuple(next) || (isString(next) && typeof next.value !== 'string')) {
        let [head] = await Eval.do(next.getArgs() || next.valueOf(), this.env, 'Sym', false, this.ctx.tokenInfo);

        if (!isScalar(head)) {
          assert(head, true, STRING, NUMBER, SYMBOL);
        }

        let token;

        if (head.valueOf() === 'nil') token = Expr.value(null, this.ctx.tokenInfo);
        if (head.valueOf() === 'on') token = Expr.value(true, this.ctx.tokenInfo);
        if (head.valueOf() === 'off') token = Expr.value(false, this.ctx.tokenInfo);

        const value = !isSymbol(head) ? `:${head.valueOf()}` : head.valueOf();

        this.replace(token || Expr.symbol(value, false, this.ctx.tokenInfo), true).move();
      }
    }

    // evaluate access through if previous value is a range, e.g. `[data]:prop`
    if (isArray(prev) && isData(prev.value[0]) && isSymbol(this.ctx)) {
      const value = prev.valueOf();
      const key = this.ctx.value.substr(1);

      this.discard();
      value.forEach(body => {
        let result;

        if (isScalar(body) || isObject(body) || isArray(body)) {
          result = body.valueOf()[key];
        }

        if (typeof result !== 'undefined') {
          this.append(!(result instanceof Expr) ? Expr.value(result) : result);
        }
      });
      return true;
    }

    // accumulate values to build objects at runtime, no statements!
    if (this.key || (isSymbol(prev) && isResult(this.ctx))) {
      // keep eating objects...
      if (isObject(prev) && isComma(this.ctx)) {
        if (isObject(prev) && isObject(next)) {
          Object.assign(prev.value, next.value);
          this.move();
        } else if (isSymbol(next)) this.key = next.value.substr(1);
        return true;
      }

      if (!this.key) {
        const key = prev.value.substr(1);

        this.replace(Expr.map({
          [key]: Expr.body([this.ctx], this.ctx.tokenInfo),
        }, prev.tokenInfo));

        if (!(isEOL(next) || isMath(next))) {
          this.key = key;
        }
      } else if (isSymbol(this.ctx) && isResult(next)) {
        this.key = this.ctx.value.substr(1);
        prev.valueOf()[this.key] = Expr.body([], this.ctx.tokenInfo);
      } else {
        // break on access, pipe-calls or terminators!
        if (isDot(this.ctx) || isPipe(this.ctx) || (!isComma(this.ctx) && isEnd(this.ctx))) {
          this.key = null;
          return;
        }

        const target = prev.valueOf();

        if (!target[this.key]) {
          this.key = null;
          return;
        }

        // keep adding tokens...
        target[this.key].push(this.ctx);
      }
      return true;
    }

    // evaluate literals if they resolve as symbols... e.g. `15 pesos` => `15 * :MXN`
    if (isNumber(prev) && this.ctx.type === MUL && (isLiteral(next) || isSymbol(next))) {
      let fixedToken = next;

      if (isLiteral(next) && this.env.has(next.value)) {
        fixedToken = this.env.get(next.value).ctx;
      }

      if (fixedToken.type === SYMBOL) {
        const num = prev.valueOf();
        const kind = fixedToken.value;
        const retval = Env.register(num, kind.substr(1));

        if (isPlain(retval)) {
          this.replace(Expr.unit(retval, this.ctx.tokenInfo)).move();
          return true;
        }
      }
    }
  }

  async evalStrings() {
    const prev = this.getPrev();
    const next = this.nextToken();

    // evaluate interpolated strings, e.g. `"x#{y}"`
    if (isString(this.ctx) && typeof this.ctx.value !== 'string' && !isMod(next)) {
      const result = await Eval.do(this.ctx.valueOf(), this.env, 'Str', false, this.ctx.tokenInfo);

      this.replace(Expr.value(result.map(sub => sub.value).join(''), this.ctx.tokenInfo), true);
      return;
    }

    // evaluate context-in-strings, `"x#{y}" % (:...)`
    if (isString(prev) && isMod(this.ctx)) {
      const { body, offset } = Expr.chunk(this.expr, this.offset + 1);
      const subTree = await Eval.do(body, this.env, 'Str', false, this.ctx.tokenInfo);

      if (typeof prev.value !== 'string') {
        if (subTree.length > 1 || !isObject(subTree[0])) {
          check(body[0], 'map');
        }

        this.discard().append(...await Eval.do(prev.valueOf(), Env.create(subTree[0].valueOf(), this.env), 'Str', false, this.ctx.tokenInfo));
      } else {
        let isHead = subTree.length === 1;

        if (isHead) {
          if (isObject(subTree[0]) || !(isTuple(body[0]) || isRange(body[0]))) {
            check(body[0], 'block or list');
          }

          isHead = isTuple(subTree[0]) || isRange(subTree[0]);
        }

        let inc = 0;

        // evaluate positional arguments before replacing them, e.g. `"{0} {}" % (...)|[...]`
        const source = isHead ? (subTree[0].getArgs() || subTree[0].valueOf()) : subTree;
        const values = await Eval.do(source, this.env, 'Str', false, next.tokenInfo);

        const newValue = prev.value.replace(/{(\d+)?}/g, (_, idx) => {
          const fixedValue = typeof idx !== 'undefined' ? values[idx] : values[inc++];

          if (typeof fixedValue === 'undefined') {
            raise(`Missing argument #${idx || inc}`, next.tokenInfo);
          }

          if (fixedValue.valueOf() === null) return ':nil';
          if (fixedValue.valueOf() === true) return ':on';
          if (fixedValue.valueOf() === false) return ':off';

          return fixedValue.valueOf();
        });

        this.replace(Expr.value(newValue));
      }

      this.move(offset);
      return true;
    }
  }

  async walk(descriptor) {
    if (Eval.detail && Eval.detail.enabled) {
      Eval.detail.calls.push([descriptor, Eval.detail.depth, this.expr]);
    }

    return this.execute(descriptor, async () => {
      if (!(this.ctx instanceof Expr)) {
        raise(`Given \`${JSON.stringify(this.ctx)}\` as token!`);
      }

      if (!this.ctx.tokenInfo || (typeof this.ctx.tokenInfo.line === 'undefined' || typeof this.ctx.tokenInfo.col === 'undefined')) {
        if (isResult(this.ctx)) raise(`Given \`${JSON.stringify(this.ctx.tokenInfo)}\` as tokenInfo!`);
      }

      // evaluate mappings, e.g. `:foo (...) x :bar y` (also if-then-else, etc.)
      if (this.ctx.isObject) {
        const prev = this.getPrev();

        if (prev && !(isEnd(prev) || isResult(prev))) check(prev);

        this.append(...await Eval.map(this.ctx, descriptor, this.env, this.ctx.tokenInfo));
        return;
      }

      if (
        await this.evalUnary()
        || await this.evalSymbols()
        || await this.evalStrings()
        || await this.evalDotProps()
        || await this.evalRangeSets()
        || await this.evalInfixCalls()

        // blocks are expressions, conditions, etc.
        || (this.ctx.isExpression && await this.evalLogic())
        || ((isBlock(this.ctx) || isTuple(this.ctx)) && await this.evalBlocks())

        // evaluate scalar literals from environment, not calls! (placeholder returns its identity)
        || (isLiteral(this.ctx) && typeof this.ctx.value === 'string' && this.ctx.value !== '_' && await this.evalLiterals())
      ) return;

      // unescape string sequences
      if (isString(this.ctx) && typeof this.ctx.value === 'string') {
        this.ctx.value = this.ctx.value.replace(/\\r/g, '\r');
        this.ctx.value = this.ctx.value.replace(/\\n/g, '\n');
        this.ctx.value = this.ctx.value.replace(/\\t/g, '\t');
      }

      // append all values
      this.append(this.ctx);
    });
  }

  async run(descriptor, tokenInfo) {
    let tokens = await this.walk(descriptor);

    tokens = Eval.math([MUL, DIV], tokens, tokenInfo);
    tokens = Eval.math([PLUS, MINUS, MOD], tokens, tokenInfo);

    return tokens.filter(x => ![EOL, COMMA].includes(x.type));
  }

  static info(defaults) {
    Eval.detail = defaults;
    return defaults;
  }

  static wrap(self) {
    return async (fn, args, label) => {
      if (fn.length > args.length) {
        raise(`Missing arguments to call \`${fn.getName()}\``, self.ctx.tokenInfo);
      }

      try {
        const scope = new Env(self.env);

        Env.merge(args, fn.getArgs(), false, scope);

        const [value] = await Eval.do(fn.getBody(), scope, label, false, self.ctx.tokenInfo);

        return value ? Expr.plain(value, self.convert, `<${fn.name || 'Function'}>`) : undefined;
      } catch (e) {
        raise(e.message.replace(/\sat line.*$/, ''), self.ctx.tokenInfo);
      }
    };
  }

  static math(ops, expr, tokenInfo) {
    return Eval.walk(ops, expr, (left, op, right) => {
      let result;

      if (op.type === PLUS) {
        assert(left, true, STRING, NUMBER, SYMBOL);
        assert(right, true, STRING, NUMBER, SYMBOL);
      } else {
        assert(left, true, NUMBER);
        assert(right, true, NUMBER);
      }

      // evaluate given units for special accesors!
      if (isUnit(left) || isUnit(right)) {
        let method;

        switch (op.type) {
          case PLUS: method = 'add'; break;
          case MINUS: method = 'sub'; break;
          case DIV: method = 'div'; break;
          case MUL: method = 'mul'; break;
          case MOD: method = 'mod'; break;
        }

        // invoke accessors on left-value
        if (isUnit(left)) {
          try {
            const kind = (isUnit(right) ? right : left).value.kind;

            result = left.value[method](right.value, kind);

            if (typeof result !== 'undefined') {
              return Expr.unit(result, tokenInfo);
            }
          } catch (e) {
            raise(`Failed to call \`${method}\` (${e.message})`);
          }
        }

        // or, extract its value!
        right = right.valueOf();
      }

      switch (op.type) {
        case PLUS:
          if (isSymbol(left)) left = left.valueOf().substr(1);
          if (isSymbol(right)) right = right.valueOf().substr(1);

          result = left + right;
          break;

        case MINUS: result = left - right; break;
        case DIV: result = left / right; break;
        case MUL: result = left * right; break;
        case MOD: result = left % right; break;
      }

      return Expr.value(result, tokenInfo);
    });
  }

  static logic(op, left, right, tokenInfo) {
    let result;

    switch (op) {
      case NOT_EQ:
        result = left.type !== right.type || hasDiff(left, right);
        break;
      case EXACT_EQ:
        result = left.type === right.type && !hasDiff(left, right);
        break;

      case EQUAL: result = !hasDiff(left, right, true); break;
      case LIKE: result = hasIn(left, right); break;
      case NOT: result = hasDiff(left, right, true); break;
      case LESS: result = left < right; break;
      case LESS_EQ: result = left <= right; break;
      case GREATER: result = left > right; break;
      case GREATER_EQ: result = left >= right; break;
    }

    return Expr.value(result, tokenInfo);
  }

  static walk(ops, expr, callback) {
    for (let i = 1, c = expr.length - 1; i < c; i++) {
      const op = expr[i];
      const left = expr[i - 1];
      const right = expr[i + 1];

      if (op && ops.indexOf(op.type) > -1) {
        expr.splice(i - 1, 3, callback(left, op, right));

        if (expr.length >= 3) {
          return Eval.walk(ops, expr, callback);
        }
      }
    }

    return expr;
  }

  static async loop(body, value, environment, parentTokenInfo) {
    const source = await Eval.do(value, environment, 'Loop', false, parentTokenInfo);

    let scope = environment;
    let target = false;

    // discard target if next element is executable
    if (isLiteral(body[0])) {
      target = isTuple(body[1]) || isLiteral(body[1]) ? body.shift() : body[0];

      // evaluate strings as functions, e.g. `:loop (...) x "y: #{x * 2}"`
      if (isString(body[1]) && Array.isArray(body[1].value)) {
        body = body[1].valueOf();
      }
    }

    // extract details from block-definition
    if (isTuple(body[0]) && body[0].isCallable) {
      target = body[0].getArg(0);
      body = body[0].getBody();
    }

    if (target) {
      // recompose statement into call, e.g. `:loop (...) fn` => `:loop (...) _ fn(_)`
      if (!(environment.has(target.value, true) && body.length === 1)) {
        scope = new Env(environment);
      } else {
        target = null;
      }
    }

    return Range.unwrap(source, token => {
      if (target) {
        scope.def(target.value, token);
      }

      if (target === null) {
        return Eval.run(body.concat(Expr.block({ args: [token] }, token.tokenInfo)), scope, 'It', true, parentTokenInfo);
      }

      return body.length ? Eval.run(body, scope, 'It', true, parentTokenInfo) : [token];
    });
  }

  static async map(token, descriptor, environment, parentTokenInfo) {
    const { value } = token;
    const subTree = [];

    let isDone;

    // derive local scope for further calls
    if (value.let instanceof Expr.LetStatement) {
      subTree.push(...await Eval.do(value.let.getBody(), environment, 'Let', true, parentTokenInfo));
      isDone = true;
    }

    // evaluate if-then-else logic
    if (value.if instanceof Expr.IfStatement) {
      const { body } = value.if.value;

      for (let i = 0, c = body.length; i < c; i++) {
        const [head, ...tail] = body[i].getBody();
        const [result] = await Eval.do([head], environment, 'If', true, parentTokenInfo);

        if (result.value === true) {
          subTree.push(...await Eval.do(tail, environment, 'Then', true, parentTokenInfo));
          break;
        }

        if (result.value === false && value.else instanceof Expr.Statement) {
          subTree.push(...await Eval.do(value.else.getBody(), environment, 'Else', true, parentTokenInfo));
          break;
        }
      }

      isDone = true;
    }

    // iterate lists, arrays, ranges or numeric value, e.g. `:loop (3)` OR `:loop (1..3, 5)` OR `:loop [1, 2]`
    if (value.loop instanceof Expr.LoopStatement) {
      const body = value.loop.getBody();

      for (let i = 0, c = body.length; i < c; i++) {
        let range;
        let args;

        // evaluate body after range, e.g. `:loop (...) x` where `x` will be also a placeholder
        if (isTuple(body[i])) {
          if (isTuple(body[i].head())) {
            const [head, ...tail] = body[i].getBody();

            range = [head];
            args = tail;
          } else {
            range = body[i].getBody();
            args = [];
          }
        } else {
          range = [body[i]];
          args = [];
        }

        subTree.push(...await Eval.loop(args, range, environment, parentTokenInfo));
      }

      isDone = true;
    }

    // evaluate pattern-matching, e.g. `:match (x) y z, a b, ... :else ...`
    if (value.match instanceof Expr.MatchStatement) {
      const fixedMatches = value.match.clone().getBody();
      const fixedBody = value.match.head().value.body;
      const fixedArgs = isBlock(fixedBody[0]) ? fixedBody[0].getArgs() : [fixedBody[0]];
      const [input] = await Eval.do(fixedArgs, environment, 'Expr', true, parentTokenInfo);

      // drop initial value from the input-stack!
      fixedMatches[0].value.body.shift();

      let found;

      for (let i = 0, c = fixedMatches.length; i < c; i++) {
        const [head, ...body] = isBlock(fixedMatches[i]) ? fixedMatches[i].getBody() : [fixedMatches[i]];

        if (!body.length) {
          check(head, 'statement', 'after');
        }

        // evaluate partial logical-expressions, e.g. `(< a b)`
        if (isBlock(head) && isLogic(head.getArg(0))) {
          const [kind, ...others] = head.getArgs();
          const newBody = Expr.expression({ type: kind.type, value: [input].concat(others) }, parentTokenInfo);
          const [result] = await Eval.do([newBody], environment, 'Expr', true, parentTokenInfo);

          if (result && result.value === true) {
            found = body;
            break;
          }
        } else {
          const result = await Eval.do([head], environment, 'Match', true, parentTokenInfo);

          // evaluate all given values...
          for (let j = 0, k = result.length; j < k; j++) {
            let subBody = result[j];

            // check ranges for inclusion
            if (isArray(subBody)) {
              if (isRange(subBody.value[0])) {
                subBody = await subBody.value[0].value.run(true);
              }

              if (subBody.valueOf().some(x => !hasDiff(x, input))) {
                found = body;
                break;
              }
            }

            // otherwise, just compare values
            if (!hasDiff(input, subBody)) {
              found = body;
              break;
            }
          }

          if (found) break;
        }
      }

      if (found) {
        subTree.push(...await Eval.do(found, environment, 'It', true, parentTokenInfo));
      }

      if (!found && value.else instanceof Expr.Statement) {
        subTree.push(...await Eval.do(value.else.getBody(), environment, 'Else', true, parentTokenInfo));
      }

      isDone = true;
    }

    // evaluate code with error-handling support, e.g. `:try undef | 0`
    if (value.try instanceof Expr.TryStatement || value.rescue instanceof Expr.RescueStatement) {
      const body = (value.try || value.rescue).getBody();

      while (!isDone) {
        let result;
        let failure;

        try {
          result = await Eval.do(body, environment, 'Try', true, parentTokenInfo);
        } catch (e) {
          if (!value.rescue) throw e;
          failure = e;
        }

        // evaluate guard-expression before continue, e.g. `:check expr`
        if (value.check instanceof Expr.CheckStatement) {
          const [retval] = await Eval.do(value.check.getBody(), environment, 'Check', true, parentTokenInfo);

          if (retval && retval.value === true) isDone = true;
        }

        // append rescue statements or nothing, depending on try-presence, e.g. `:rescue ...`
        if (!isDone && value.rescue instanceof Expr.RescueStatement) {
          let scope = environment;
          let retry;

          if (failure && value.try) {
            const subBody = value.rescue.getBody();

            for (let i = 0, c = subBody.length; !isDone && i < c; i++) {
              let fixedBody = isTuple(subBody[i]) ? subBody[i].getBody() : [subBody[i]];
              let newBody = [];
              let head = [];

              // inject failure into given block, e.g. `:rescue e -> ...`
              if (fixedBody[0].isCallable) {
                if (fixedBody[0].hasArgs) {
                  if (fixedBody[0].getArgs().length > 1) {
                    check(fixedBody[0].getArg(1), 'block');
                  }

                  scope = new Env(environment);
                  scope.def(fixedBody[0].getArg(0).value, Expr.value(failure.toString()));
                }

                fixedBody = fixedBody[0].getBody();
              }

              // normalize conditions for check and retry
              if (isTuple(fixedBody[0]) && fixedBody[0].hasArgs) {
                head = fixedBody[0].getArgs(0);
                newBody = fixedBody.slice(1);

                // extract next-body if we're not within a expression!
                if (!fixedBody[0].getArg(0).isExpression) {
                  newBody = newBody[0].getArgs();
                }
              }

              const [retval] = await Eval.do(head, environment, 'Expr', true, parentTokenInfo);

              // retry if given condition evaluates to true!
              if (retval && retval.value === true) {
                subTree.push(...await Eval.do(newBody, environment, 'Rescue', true, parentTokenInfo));
                retry = true;
              }

              // append any non-block value
              if (!isDone && !isTuple(fixedBody[0])) {
                subTree.push(...await Eval.do(fixedBody, environment, 'Rescue', true, parentTokenInfo));
                isDone = true;
              }
            }
          }

          if (!retry) isDone = true;
          if (!failure && result) {
            subTree.push(...result);
            isDone = true;
          }
        }
      }

      isDone = true;
    }

    // run standard while, e.g. `:while (...) x` where `x` is the body
    if (value.while instanceof Expr.WhileStatement) {
      const body = value.while.getBody();
      const head = body[0].getBody().shift();

      let enabled = true;

      // if do-block is given, evaluate and repeat, e.g. `:do ... :while (...)`
      if (value.do instanceof Expr.DoStatement) {
        do {
          subTree.push(...await Eval.do(value.do.getBody(), environment, 'It', true, parentTokenInfo));
          if ((await Eval.do([head], environment, 'Do', true, parentTokenInfo))[0].value !== true) break;
        } while (enabled);
        enabled = false;
      }

      // otherwise, a while-block is used... e.g. `:while (...) ...`
      while (enabled) {
        if ((await Eval.do([head], environment, 'While', true, parentTokenInfo))[0].value !== true) break;
        subTree.push(...await Eval.do(body, environment, 'It', true, parentTokenInfo));
      }

      isDone = true;
    }

    // evaluate import statements, e.g. `:import thing :from "Stuff";`
    if (value.import instanceof Expr.ImportStatement) {
      if (!(value.from instanceof Expr.FromStatement)) {
        raise(`Missing \`:from\` for \`${token}\``);
      }

      only(value.from, isString);

      await Promise.all(Expr.each(value.import.getBody(), (ctx, name, alias) => {
        return Env.load(ctx, name, alias, value.from.head().valueOf(), environment);
      }));

      isDone = true;
    }

    // extract module/export details to current environment
    if (value.module instanceof Expr.ModuleStatement || value.export instanceof Expr.ExportStatement) {
      if (value.module) {
        if (environment.descriptor) {
          raise(`Module name \`${environment.descriptor}\` is already set`);
        }

        only(value.module, isString);
        environment.descriptor = value.module.head().valueOf();
      }

      if (value.export) {
        if (environment.exported === true) {
          environment.exported = {};
        }

        Expr.each(value.export.getBody(), (ctx, name, alias) => {
          if (environment.exported[alias || name]) {
            raise(`Export for \`${alias || name}\` already exists`);
          }

          environment.exported[alias || name] = name;
        });
      }

      isDone = true;
    }

    // invalidate head-less blocks
    if (!isDone && (
      value.do instanceof Expr.DoStatement
      || value.from instanceof Expr.FromStatement
      || value.else instanceof Expr.ElseStatement
      || value.check instanceof Expr.CheckStatement
      || value.rescue instanceof Expr.RescueStatement
    )) check(token);

    // return un-evaluated tokens!
    if (!subTree.length && !isDone) {
      if (['Set', 'Call', 'Match'].includes(descriptor)) {
        const keys = Object.keys(value);

        for (let i = 0, c = keys.length; i < c; i++) {
          const subBody = value[keys[i]].getBody();
          const fixedBody = await Eval.do(subBody, environment, 'Prop', true, parentTokenInfo);

          value[keys[i]] = Expr.stmt(fixedBody, parentTokenInfo);
        }
      }

      return [Expr.map(value, token.tokenInfo)];
    }

    return subTree;
  }

  static async run(tokens, environment, descriptor, noInheritance, parentTokenInfo) {
    if (Eval.detail) Eval.detail.depth++;

    try {
      if (!Array.isArray(tokens)) {
        raise(`Given \`${JSON.stringify(tokens)}\` as input!`);
      }

      const vm = new Eval(tokens, environment, noInheritance);
      const result = await vm.run(descriptor, parentTokenInfo);

      return result;
    } finally {
      if (Eval.detail) Eval.detail.depth--;
    }
  }

  static do(params, ...args) {
    if (Array.isArray(params)) {
      return !(params.length === 1 && isNumber(params[0])) ? Eval.run(params, ...args) : params;
    }

    return Object.keys(params).reduce((prev, cur) => prev.then(target => {
      return Eval.run(params[cur], ...args).then(result => {
        target[cur] = result;
        return target;
      });
    }), Promise.resolve({}));
  }
}
