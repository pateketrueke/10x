import {
  toToken,
  isArray,
  hasNum, hasChar,
} from './shared';

import {
  fixResult,
} from './ast';

export default class RangeExpr {
  constructor(base, target, increment) {
    // FIXME: validate input here...

    this.begin = base;
    this.end = typeof target === 'string'
      ? target.replace('..', '')
      : target;

    // default increment
    this.step = increment || 1;

    // handle alpha-numeric ranges...
    if (hasChar(this.begin) || hasChar(this.end)) {
    } else {
      this.begin = parseFloat(this.begin);
      this.end = parseFloat(this.end);

      // handle reverse-loops
      if (this.begin > this.end) {
        this.step = -1;
      }
    }
  }

  getIterator() {
    return RangeExpr.build(this.begin, this.end, this.step);
  }

  toString() {
    return [this.begin, this.end].join('');
  }

  static fromIterator(value, cb) {
    const it = value.getIterator();
    const seq = [];

    for (let nextValue = it.next(); nextValue.done !== true; nextValue = it.next()) {
      const locals = { _: { body: [toToken(fixResult(nextValue.value))] } };

      seq.push(...cb(locals));
    }

    return seq;
  }

  static resolve(value, cb) {
    if (isArray(value)) {
      return value.map(x => cb({ _: { body: [toToken(fixResult(x))] } }));
    }

    if (typeof value === 'number') {
      value = new RangeExpr(0, value);
    }

    if (value instanceof RangeExpr) {
      return RangeExpr.fromIterator(value, cb);
    }

    console.log('UNDEF_SEQ', value);
    return [];
  }

  static *build(begin, end, i) {
    yield begin;
    if (begin === end) return;
    yield* RangeExpr.build(begin + i, end, i);
  }
}
