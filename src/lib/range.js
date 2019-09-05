import {
  hasChar,
} from './shared';

import {
  isArray,
  tokenize,
} from './utils';

import LangExpr from './expr';

export default class RangeExpr {
  constructor(base, target, increment) {
    this.begin = base;
    this.end = typeof target === 'string'
      ? target.replace('..', '')
      : target;

    // default increment
    this.alpha = false;
    this.offsets = [this.begin, this.end];
    this.step = increment || 1;

    // handle alpha-numeric ranges...
    if (hasChar(this.begin) || hasChar(this.end)) {
      this.begin = String(this.begin).charCodeAt();
      this.end = String(this.end).charCodeAt();
      this.alpha = true;
    } else {
      this.begin = parseFloat(this.begin);
      this.end = parseFloat(this.end);
    }

    // handle reverse-loops
    if (this.begin > this.end) {
      this.step = -1;
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
      const fixedValue = value.alpha
        ? String.fromCharCode(nextValue.value)
        : nextValue.value;

      seq.push(...cb({ _: { body: [LangExpr.from(tokenize(fixedValue))] } }));
    }

    return seq;
  }

  static resolve(value, cb) {
    if (isArray(value)) {
      return value.map(x => cb({ _: { body: [LangExpr.from(tokenize(x))] } }));
    }

    if (typeof value === 'number') {
      value = new RangeExpr(1, value);
    }

    if (value instanceof RangeExpr) {
      return RangeExpr.fromIterator(value, cb);
    }

    console.log('UNDEF_SEQ', { value });
    return [];
  }

  static* build(begin, end, i) {
    yield begin;
    if (begin === end) return;
    yield* RangeExpr.build(begin + i, end, i);
  }
}
