import {
  hasChar,
} from './shared';

import {
  isArray,
} from './utils';

import Expr from './expr';

export default class Range {
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
    return Range.build(this.begin, this.end, this.step);
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

      seq.push(...cb({ _: { body: [Expr.derive(fixedValue)] } }));
    }

    return seq;
  }

  static resolve(value, cb) {
    if (isArray(value)) {
      return value.map(x => cb({ _: { body: [Expr.derive(x)] } }));
    }

    if (typeof value === 'number') {
      value = new Range(1, value);
    }

    if (value instanceof Range) {
      return Range.fromIterator(value, cb);
    }

    console.log('UNDEF_SEQ', { value });
    return [];
  }

  static* build(begin, end, i) {
    yield begin;
    if (begin === end) return;
    yield* Range.build(begin + i, end, i);
  }
}
