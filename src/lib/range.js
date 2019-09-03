import {
  hasNum,
  toToken,
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

    // if (hasNum(base))

    this.step = increment || 1;
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

  static *build(begin, end, i) {
    if (typeof begin === 'number' && typeof end === 'number') {
      yield begin;
      if (begin === end) return;
      yield* RangeExpr.build(begin + i, end, i);
    } else if (hasNum(begin)) {
      yield* RangeExpr.build(parseFloat(begin), parseFloat(end), i);
    }
  }

  static resolve(value, cb) {
    if (typeof value === 'number') {
      value = new RangeExpr(0, value);
    }

    if (value instanceof RangeExpr) {
      return RangeExpr.fromIterator(value, cb);
    }

    console.log('UNDEF_SEQ', value);
    return [];
  }
}
