import Convert from 'convert-units';

import {
  TEXT, UL_ITEM, OL_ITEM, HEADING, BLOCKQUOTE,
  FFI, BLOCK, TUPLE, RANGE, NUMBER, STRING, LITERAL, SYMBOL,
} from './symbols';

import {
  CURRENCY_SYMBOLS, CURRENCY_EXCHANGES, DEFAULT_MAPPINGS,
} from '../builtins';

import {
  Token, copy, check, format, assert, literal, serialize,
  isLiteral, isSymbol, isResult, isPlain, isRange, isBlock, isTuple, isComma, isDigit, isCall, isEnd,
} from '../helpers';

export default class Expr {
  constructor(value, tokenInfo) {
    this.type = value.type;
    this.value = value.value;

    // keep function details if given!
    if (value.length) this.length = value.length;
    if (value.source) this.source = value.source;

    if (value.cached) {
      Object.defineProperty(this, 'cached', { value: true });
    }

    // keep token line/col references for error-handling
    Object.defineProperty(this, 'tokenInfo', {
      value: tokenInfo || (value instanceof Token ? value : null),
    });
  }

  get isFFI() { return this.type === FFI; }
  get isBlock() { return this.type === BLOCK; }
  get isTuple() { return this.type === TUPLE; }
  get isRange() { return this.type === RANGE; }
  get isNumber() { return this.type === NUMBER; }
  get isString() { return this.type === STRING; }
  get isSymbol() { return this.type === SYMBOL; }

  get isScalar() { return this.isNumber || this.isString || this.isSymbol; }
  get isIterable() { return this.isString || this.isTuple || this.isRange; }

  get isObject() { return this instanceof Expr.Object; }
  get isFunction() { return this instanceof Expr.Function; }

  get isLiteral() { return this instanceof Expr.Literal; }
  get isCallable() { return this instanceof Expr.Callable; }
  get isStatement() { return this instanceof Expr.Statement; }
  get isExpression() { return this instanceof Expr.Expression; }

  toString() {
    return serialize(this, true);
  }

  valueOf() {
    if (this.type === NUMBER && typeof this.value === 'string') {
      return parseFloat(this.value);
    }

    if (this.value !== null) {
      return this.value.valueOf();
    }

    return this.value;
  }

  get hasName() { return !!this.getName(); }
  get hasBody() { return !!this.value.body; }
  get hasArgs() { return !!this.value.args; }
  get hasInput() { return !!this.value.input; }
  get hasSource() { return !!(this.value.source || this.source); }

  get isRaw() { return this.tokenInfo.kind === 'raw'; }
  get isMulti() { return this.tokenInfo.kind === 'multi'; }
  get isMarkup() { return this.tokenInfo.kind === 'markup'; }
  get isOptional() { return this.value.charAt(this.value.length - 1) === '?'; }

  getBody() { return this.value.body; }
  getArgs() { return this.value.args; }
  getInput() { return this.value.input; }

  getArg(n) { return this.value.args[n]; }
  getName() { return this.value.source || this.source || this.value.name; }

  push(...v) { return this.value.body.push(...v); }
  head() { return this.value.body[0]; }
  get() { return Token.get(this); }

  clone() {
    if (Array.isArray(this.value)) {
      return new this.constructor({ type: this.type, value: copy(this.value) }, this.tokenInfo);
    }

    if (this.isStatement) {
      return new this.constructor({ type: BLOCK, value: { body: copy(this.getBody()) } }, this.tokenInfo);
    }

    if (this.isLiteral && isBlock(this)) {
      const newBlock = !this.hasBody
        ? Expr.from(BLOCK, { args: copy(this.getArgs()) }, this.tokenInfo)
        : Expr.from(BLOCK, { body: copy(this.getBody()) }, this.tokenInfo);

      if (this.isRaw) newBlock.tokenInfo.kind = 'raw';
      return newBlock;
    }

    if (this.isObject) {
      return Expr.map(Object.keys(this.value).reduce((prev, cur) => {
        prev[cur] = copy(this.value[cur]);
        return prev;
      }, {}), this.tokenInfo);
    }

    if (this.isCallable) {
      return Expr.callable({
        type: BLOCK,
        value: {
          ...this.value,
          body: copy(this.getBody()),
        },
      }, this.tokenInfo);
    }

    return this;
  }

  static sub(body, params) {
    if (Array.isArray(body)) {
      const self = body.slice();

      for (let i = 0, c = self.length; i < c; i++) {
        // rename matching callable by name and replace body!
        if (self[i].isCallable && params[self[i].value.name]) {
          const fixedBody = params[self[i].value.name].slice();
          const fixedName = fixedBody.pop();

          self[i].value.name = fixedName.value;
          self[i].value.body = Expr.sub(self[i].value.body, params);
          self.splice(i - 1, 0, ...fixedBody);
        } else if (isLiteral(self[i]) && typeof self[i].value === 'string') {
          // match and replace current token by lteral name!
          if (!params[self[i].value]) continue;
          c += params[self[i].value].length - 1;
          self.splice(i, 1, ...params[self[i].value]);
        } else {
          self[i] = Expr.sub(self[i], params);
        }
      }

      return self;
    }

    if (Array.isArray(body.value)) {
      body.value = Expr.sub(body.value, params);
    } else if (body.isObject) {
      Object.keys(body.value).forEach(k => {
        body.value[k].value.body = Expr.sub(body.value[k].value.body, params);
      });
    } else if (isBlock(body)) {
      if (body.value.args) body.value.args = Expr.sub(body.getArgs(), params);
      if (body.value.body) body.value.body = Expr.sub(body.getBody(), params);
    } else if (isTuple(body)) {
      if (body.value.args) body.value.args = Expr.sub(body.getArgs(), params);
    // } else {
    //   console.log(body, params);
    }

    return body;
  }

  static mix(tpl, ...others) {
    // console.log('---');
    // console.log(tpl, others);
    return Expr.sub(copy(tpl.body), tpl.args.reduce((prev, cur, i) => {
      prev[cur.value] = copy(others[i]);
      return prev;
    }, {}));
  }

  static cut(ast) {
    const count = ast.length;
    const left = [];

    let i = 0;

    for (; i < count; i++) {
      if (isResult(ast[i]) && isResult(left[left.length - 1])) break;
      left.push(ast[i]);
    }

    return left;
  }

  static has(ast, type, value) {
    return ast.some(token => {
      if (isBlock(token) && token.hasArgs) {
        return Expr.has(token.getArgs(), type, value);
      }

      return token.type === type && token.value === value;
    });
  }

  static from(type, value, tokenInfo) {
    if (Array.isArray(type)) {
      return type.map(x => Expr.from(x));
    }

    if (type === TEXT && typeof value === 'string') {
      value = { buffer: [value] };
    }

    if (typeof value === 'undefined') {
      if (typeof type === 'symbol') {
        return Expr.literal({ type, value: literal({ type }) });
      }

      if (Array.isArray(type.value)) {
        type.value = Expr.from(type.value);
      }

      return type instanceof Expr ? type : Expr.literal(type);
    }

    return Expr.literal({ type, value }, tokenInfo);
  }

  static args(values) {
    const list = [];

    let stack = list;
    let key = 0;

    for (let i = 0, c = values.length; i < c; i++) {
      if (isComma(values[i])) {
        list[list.length - 1] = stack[0];
        stack = list[++key] = [];
      } else {
        stack.push(values[i]);
      }
    }

    if (stack.length === 1) {
      list[list.length - 1] = stack[0];
    }

    return list;
  }

  static text(buffer, tokenInfo) {
    const head = buffer.charAt();
    const value = {};

    let level = 0;
    let type = TEXT;

    // detect block-elements
    if ('#>'.includes(head)) {
      type = head === '>' ? BLOCKQUOTE : HEADING;

      if (head === '#') {
        let i = 0;

        for (; i < 5; i++) {
          if (buffer.charAt(i) === '#') level++;
          else break;
        }

        buffer = buffer.substr(i);
      } else {
        buffer = buffer.substr(1);
      }
    }

    // detect ordered/unordered list-items
    if (
      ('-*+'.includes(head) && buffer.charAt(1) === ' ')
      || (isDigit(head) && /^(\d+)\.\s/.test(buffer))
    ) {
      const [nth, ...chunks] = buffer.split(' ');

      level = isDigit(head) ? parseFloat(nth) : 0;
      type = isDigit(head) ? OL_ITEM : UL_ITEM;
      buffer = chunks.join(' ');
    }

    if (type !== TEXT) value.kind = type;
    if (level > 1) value.level = level;

    value.buffer = format(buffer.trim());

    return Expr.literal({ type: TEXT, value }, tokenInfo);
  }

  static chunk(values, inc, fx) {
    const body = [];

    let offset = 0;

    for (let c = values.length; inc < c; inc++) {
      if (fx && isCall(body[body.length - 1])) break;
      if (!fx && isEnd(values[inc])) break;
      body.push(values[inc]);
      offset++;
    }

    return { body, offset };
  }

  static arity(callable) {
    let length = 0;

    length += callable.value.args.length;

    while (
      callable.hasBody
      && callable.head().isCallable
      && callable.getBody().length === 1
    ) {
      length += callable.head().getArgs().length;
      callable = callable.head();
      break;
    }

    return length;
  }

  static cast(list, types) {
    return list.reduce((prev, cur) => {
      if (cur.isStatement) {
        prev.push(...cur.getBody().reduce((p, c) => {
          if (!isComma(c)) {
            if (c.isObject) {
              p.push(...Expr.cast([c], types));
            } else {
              if (!types.includes(c.type)) assert(c, true, ...types);
              p.push(c);
            }
          }

          return p;
        }, []));
      } else if (cur.isObject) {
        const map = cur.valueOf();

        Object.keys(map).forEach(prop => {
          map[prop].getBody().forEach(c => {
            if (!types.includes(c.type)) assert(c, true, ...types);
          });
        });

        prev.push(cur);
      } else if (!types.includes(cur.type)) {
        assert(cur, true, ...types);
      } else {
        prev.push(cur);
      }

      return prev;
    }, []);
  }

  static stmt(type, body, tokenInfo) {
    if (typeof type === 'object') {
      tokenInfo = body;
      body = type;
      type = null;
    }

    const params = { type: BLOCK, value: { body } };

    if (type === ':if') return Expr.ifStatement(params, tokenInfo);
    if (type === ':else') return Expr.elseStatement(params, tokenInfo);

    if (type === ':while') return Expr.whileStatement(params, tokenInfo);
    if (type === ':do') return Expr.doStatement(params, tokenInfo);

    if (type === ':let') return Expr.letStatement(params, tokenInfo);
    if (type === ':loop') return Expr.loopStatement(params, tokenInfo);
    if (type === ':match') return Expr.matchStatement(params, tokenInfo);

    if (type === ':try') return Expr.tryStatement(params, tokenInfo);
    if (type === ':check') return Expr.checkStatement(params, tokenInfo);
    if (type === ':rescue') return Expr.rescueStatement(params, tokenInfo);

    if (type === ':from') return Expr.fromStatement(params, tokenInfo);
    if (type === ':import') return Expr.importStatement(params, tokenInfo);
    if (type === ':module') return Expr.moduleStatement(params, tokenInfo);
    if (type === ':export') return Expr.exportStatement(params, tokenInfo);

    if (type === ':template') return Expr.templateStatement(params, tokenInfo);

    return Expr.statement(params, tokenInfo);
  }

  static value(mixed, tokenInfo) {
    tokenInfo = tokenInfo || { line: 0, col: 0 };

    if (mixed === null) return Expr.from(LITERAL, null, tokenInfo);
    if (mixed === true) return Expr.from(LITERAL, true, tokenInfo);
    if (mixed === false) return Expr.from(LITERAL, false, tokenInfo);

    if (isPlain(mixed) && mixed instanceof Expr.Val) return mixed.toToken();

    if (typeof mixed === 'string') return Expr.from(STRING, mixed, tokenInfo);
    if (typeof mixed === 'number') return Expr.from(NUMBER, mixed.toString(), tokenInfo);

    if (mixed instanceof Expr) return Expr.from(mixed.type, mixed.value, mixed.tokenInfo);

    if (Array.isArray(mixed)) {
      return Expr.array(mixed.map(x => Expr.value(x)), tokenInfo);
    }

    return Expr.from(LITERAL, mixed, tokenInfo);
  }

  static plain(mixed, callback, descriptor) {
    if (Array.isArray(mixed)) {
      return mixed.map(x => Expr.plain(x, callback, descriptor));
    }

    if (isRange(mixed)) {
      return Expr.plain(mixed.valueOf(), callback, descriptor);
    }

    if (mixed.isObject) {
      const obj = mixed.valueOf();

      return Object.keys(obj).reduce((prev, cur) => {
        const value = obj[cur].getBody();
        const fixedValue = value.length === 1 ? value[0] : value;

        prev[cur] = Expr.plain(fixedValue, callback, descriptor);
        return prev;
      }, {});
    }

    if (mixed.isCallable) {
      return (...args) => {
        if (typeof callback === 'function') {
          return callback(mixed, Expr.value(args).valueOf(), descriptor);
        }

        return [
          Expr.local(mixed.getName(), mixed.tokenInfo),
          Expr.tuple(Expr.value(args).valueOf(), mixed.tokenInfo),
        ];
      };
    }

    if (isSymbol(mixed) && typeof mixed.value === 'string') {
      return mixed.value.substr(1);
    }

    return mixed.isFunction
      ? mixed.value.target
      : mixed.valueOf();
  }

  static each(tokens, callback) {
    const body = Expr.cast(tokens, [LITERAL]);
    const calls = [];

    // validate first,
    body.forEach(name => {
      if (name.isObject) {
        const obj = name.valueOf();

        Object.keys(obj).forEach(key => {
          const [head, ...tail] = obj[key].getBody();

          if (typeof head.value !== 'string') check(head);
          calls.push(() => callback(obj[key], key, head.valueOf()));

          tail.forEach(sub => {
            if (typeof sub.value !== 'string') check(sub);
            calls.push(() => callback(sub, sub.valueOf()));
          });
        });
      } else {
        if (typeof name.value !== 'string') check(name);
        calls.push(() => callback(name, name.valueOf()));
      }
    });

    // then execute...
    return calls.map(run => run());
  }

  static call(obj, name, label, tokenInfo) {
    const hasProto = Object.prototype.hasOwnProperty.call(obj, 'prototype');

    let target = (hasProto && obj.prototype[name]) || obj[name];

    // return non-functions as is...
    if (typeof target !== 'function') {
      return Expr.value(target);
    }

    // wrap prototype calls into regular functions
    if (hasProto && obj.prototype[name]) {
      target = (...args) => obj.prototype[name].call(...args);
    }

    return Expr.function({ type: LITERAL, value: { label, target } }, tokenInfo);
  }

  static fn(value, tokenInfo) {
    if (typeof value === 'function') {
      const F = value;

      const isClass = F.prototype
        && F.constructor === Function
        && F.prototype.constructor === F;

      const target = (...args) => (isClass ? new F(...args) : F(...args));

      Object.defineProperty(target, 'name', { value: F.name });
      Object.defineProperty(target, 'toString', { value: () => serialize(F) });

      // copy static properties/methods into factory target!
      Object.getOwnPropertyNames(F).forEach(key => {
        if (!['name', 'length', 'prototype'].includes(key)) {
          target[key] = F[key];
        }
      });

      return Expr.value(target, tokenInfo);
    }

    return Expr.function({ type: LITERAL, value }, tokenInfo);
  }

  static map(params, tokenInfo) {
    return Expr.object({ type: LITERAL, value: params }, tokenInfo);
  }

  static let(params, tokenInfo) {
    return Expr.map({ let: Expr.stmt(':let', params) }, tokenInfo);
  }

  static body(values, tokenInfo) {
    return Expr.from(BLOCK, { body: values || [] }, tokenInfo);
  }

  static frac(a, b, tokenInfo) {
    return Expr.from(NUMBER, new Expr.Frac(a, b), tokenInfo);
  }

  static unit(num, type, tokenInfo) {
    if (typeof num === 'number') {
      return Expr.from(NUMBER, { num, kind: type }, tokenInfo);
    }

    return Expr.from(NUMBER, num, type || tokenInfo);
  }

  static array(values, tokenInfo) {
    return Expr.from(RANGE, values, tokenInfo);
  }

  static local(name, tokenInfo) {
    return Expr.from(LITERAL, name, tokenInfo);
  }

  static symbol(name, optional, tokenInfo) {
    return Expr.from(SYMBOL, name + (optional ? '?' : ''), tokenInfo);
  }

  static range(begin, end, tokenInfo) {
    if (!begin.length && !end.length) check(tokenInfo, 'values', 'around');
    if (!begin.length) check(tokenInfo, 'value', 'before');
    if (!end.length) check(tokenInfo, 'value', 'after');

    return Expr.from(RANGE, { begin, end }, tokenInfo);
  }

  static block(params, tokenInfo) {
    return Expr.from(BLOCK, params || {}, tokenInfo);
  }

  static tuple(values, tokenInfo) {
    tokenInfo = tokenInfo || {};
    tokenInfo.kind = 'raw';

    return Expr.from(TUPLE, { args: values }, tokenInfo);
  }

  static unsafe(target, label, raw) {
    return [FFI, target, label || `FFI/${target.name || '?'}`, raw || null];
  }

  static define(type, Class) {
    Expr[Class.name.replace(/_$/, '')] = Class;

    if (!Expr[type]) {
      Expr[type] = (...args) => new Class(...args);
    }

    return Class;
  }
}

Expr.define('val', class Val {
  constructor(num, type) {
    this.num = num;
    this.kind = type;
  }

  /* istanbul ignore next */
  get() { return this.num; }

  /* istanbul ignore next */
  from() { return this; }

  // casting/conversion methods
  valueOf() { return this.num; }

  /* istanbul ignore next */
  toToken() { return Expr.unit(this); }

  // required methods for Eval.math() calls
  add(num, type) { return this.from(this.get(type) + num, type); }
  sub(num, type) { return this.from(this.get(type) - num, type); }
  mul(num, type) { return this.from(this.get(type) * num, type); }
  div(num, type) { return this.from(this.get(type) / num, type); }
  mod(num, type) { return this.from(this.get(type) % num, type); }
});

Expr.define('unit', class Unit extends Expr.Val {
  constructor(num, type) {
    super(num, type);
    this.kind = type.replace(/^:/, '');
  }

  toString() {
    return `${this.num.toFixed(2).replace(/\.0+$/, '')} ${this.kind}`;
  }

  get(type) {
    return type !== this.kind ? this.to(type).num : this.num;
  }

  from(num, type) {
    if (!type) {
      this.num = num;
      return this;
    }

    return new Unit(num, type);
  }

  to(type) {
    const newKind = type.replace(/^:/, '');

    let value;

    if (CURRENCY_SYMBOLS[this.kind] || CURRENCY_SYMBOLS[newKind]) {
      const a = CURRENCY_EXCHANGES[this.kind];
      const b = CURRENCY_EXCHANGES[newKind];

      if (!a) throw new Error(`Unsupported ${this.kind} currency`);
      if (!b) throw new Error(`Unsupported ${newKind} currency`);

      value = (this.num * b) / a;
    } else {
      value = Convert(this.num).from(this.kind).to(newKind);
    }

    return this.from(value, newKind);
  }

  static from(num, type) {
    if (Unit.exists(type)) {
      return new Unit(num, type);
    }
  }

  static exists(type) {
    return DEFAULT_MAPPINGS[type] || DEFAULT_MAPPINGS[type.toLowerCase()];
  }

  static convert(num, base, target) {
    return new Unit(num, base).to(target);
  }
});

Expr.define('frac', class Frac extends Expr.Val {
  valueOf() { return this.num / this.kind; }
  toString() { return `${this.num}/${this.kind}`; }

  add(other) {
    if (other instanceof Frac) {
      const num = this.num * other.kind + other.num * this.kind;
      const dem = this.kind * other.kind;
      const gcd = Frac.gcd(num, dem);

      return new Frac(num / gcd, dem / gcd);
    }
  }

  sub(other) {
    if (other instanceof Frac) {
      return new Frac(this.num, this.kind).add(new Frac(-other.num, other.kind));
    }
  }

  mul(other) {
    if (other instanceof Frac) {
      return new Frac(this.num * other.num, this.kind * other.kind);
    }
  }

  div(other) {
    if (other instanceof Frac) {
      return Frac.from((this.kind * other.num) / (this.num * other.kind));
    }
  }

  mod(other) {
    if (other instanceof Frac) {
      return Frac.from(((this * 100) % (other * 100)) / 100);
    }
  }

  static from(num) {
    const dec = num.toString().match(/\.0+\d/);
    const length = Math.max(dec ? dec[0].length : 3, 3);

    // adjust correction from zero-left padded decimals
    const div = parseInt(`1${Array.from({ length }).join('0')}`, 10);
    const base = Math.floor(parseFloat(num) * div) / div;

    const [left, right] = base.toString().split('.');

    // return numbers without fractions!
    if (!right) return parseFloat(left);

    const a = parseFloat(left + right);
    const b = 10 ** right.length;

    const factor = Frac.gcd(a, b);

    if (left < 1) {
      return new Frac(a / factor, b / factor);
    }

    return new Frac(b / factor, a / factor);
  }

  static gcd(a, b) {
    if (!b) return a;
    return Frac.gcd(b, a % b);
  }
});

Expr.define('object', class Object_ extends Expr {});
Expr.define('literal', class Literal extends Expr {});
Expr.define('function', class Function_ extends Expr {});
Expr.define('callable', class Callable extends Expr {});
Expr.define('statement', class Statement extends Expr {});
Expr.define('expression', class Expression extends Expr {});

Expr.define('ifStatement', class IfStatement extends Expr.Statement {});
Expr.define('elseStatement', class ElseStatement extends Expr.Statement {});

Expr.define('doStatement', class DoStatement extends Expr.Statement {});
Expr.define('whileStatement', class WhileStatement extends Expr.Statement {});

Expr.define('letStatement', class LetStatement extends Expr.Statement {});
Expr.define('loopStatement', class LoopStatement extends Expr.Statement {});
Expr.define('matchStatement', class MatchStatement extends Expr.Statement {});

Expr.define('tryStatement', class TryStatement extends Expr.Statement {});
Expr.define('checkStatement', class CheckStatement extends Expr.Statement {});
Expr.define('rescueStatement', class RescueStatement extends Expr.Statement {});

Expr.define('fromStatement', class FromStatement extends Expr.Statement {});
Expr.define('importStatement', class ImportStatement extends Expr.Statement {});

Expr.define('moduleStatement', class ModuleStatement extends Expr.Statement {});
Expr.define('exportStatement', class ExportStatement extends Expr.Statement {});

Expr.define('templateStatement', class TemplateStatement extends Expr.Statement {});
