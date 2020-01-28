/* eslint-disable no-await-in-loop */

import {
  isString, isNumber, isRange, slice, split,
} from './helpers';

import Expr from './tree/expr';

export default class Range {
  constructor(base, target, increment) {
    // default increment
    this.alpha = this.alpha || false;
    this.step = increment || 1;

    // slice options
    this.offset = null;
    this.length = null;

    // range options
    this.max = Infinity;

    // range boundaries
    this.begin = base.valueOf();
    this.end = target.valueOf();

    // handle alpha-numeric ranges...
    if (isString(base) || isString(target)) {
      this.begin = String(this.begin).charCodeAt();
      this.end = String(this.end).charCodeAt();
      this.alpha = true;
    }

    // handle reverse-loops
    if (this.begin > this.end) {
      this.step = -1;
    }

    Object.defineProperty(this, 'idx', { value: 0, writable: true });
  }

  getIterator() {
    return Range.build(this.begin, this.end, this.step);
  }

  toString() {
    const prefix = [this.begin, this.end].join('..');

    let suffix = '';
    let defs = this.idx;

    if (this.max !== Infinity) {
      suffix += `:${this.max}`;
      defs--;
    }

    if (Math.abs(this.step) !== 1) {
      suffix += `:${this.step}`;
      defs--;
    }

    suffix += Array.from({ length: defs + 1 }).join(':');

    if (this.offset !== null) {
      suffix += `:${this.offset}`;
    }

    return prefix + suffix;
  }

  take(expr) {
    const {
      offset, length, begin, end,
    } = slice(expr);

    if (expr === ':') {
      if (this.idx >= 2) throw new Error(`Unexpected \`:\` after \`${this}\``);
      this.idx++;
      return this;
    }

    if (typeof begin !== 'undefined' && typeof end !== 'undefined') {
      if (this.offset !== null || this.idx < 2) throw new Error(`Unexpected take-range \`:${begin}..${end}\` after \`${this}\``);

      this.offset = begin;
      this.length = end;
      this.idx += 2;

      if (begin < 0 && end < 0) {
        this.length = (begin - end) * -1;
      }

      return this;
    }

    if (typeof offset !== 'undefined' && typeof length !== 'undefined') {
      if (this.max !== Infinity || this.idx > 0) throw new Error(`Unexpected take-step \`:${offset}-${length}\` after \`${this}\``);

      this.max = offset;
      this.step = length;
      this.idx += 2;
      return this;
    }

    if (this.idx >= 2) {
      if (this.offset !== null) throw new Error(`Unexpected take-range \`:${offset}\` after \`${this}\``);

      this.offset = offset;
      this.max = 1;
    } else if (this.idx === 1) {
      this.step = offset;
      this.idx++;
    } else {
      this.max = offset;
      this.idx++;
    }

    return this;
  }

  run(invoke, callback) {
    return invoke ? Range.run(this, callback || (x => x)) : this;
  }

  static async run(gen, callback) {
    const it = gen.getIterator();
    const seq = [];

    const max = gen.end > gen.begin
      ? gen.end - gen.begin
      : gen.begin - gen.end;

    for (let i = 0, nextValue = it.next(); nextValue.done !== true; nextValue = it.next(), i++) {
      let keep = true;

      if (gen.offset !== null) {
        if (gen.offset >= 0) {
          keep = i >= gen.offset;
        } else if (gen.begin < 0) {
          keep = max - i + gen.offset < 0;
        } else {
          keep = i >= gen.offset + gen.end;
        }
      }

      if (keep) {
        const newValue = gen.alpha
          ? String.fromCharCode(nextValue.value)
          : nextValue.value;

        const fixedValue = await callback(Expr.value(newValue));

        seq.push(...(!Array.isArray(fixedValue) ? [fixedValue] : fixedValue));
      }

      if (seq.length >= gen.max) break;
      if (gen.length !== null && seq.length >= gen.length) break;
    }

    return seq;
  }

  static from(begin, end, take, step, offset, length) {
    const range = new Range(begin, end, step);

    if (typeof take === 'number') range.max = take;
    if (typeof offset === 'number') range.offset = offset;
    if (typeof length === 'number') range.length = length;

    return range;
  }

  static* build(begin, end, i) {
    yield begin;
    if (begin === end) return;
    yield* Range.build(begin + i, end, i);
  }

  static async unwrap(result, callback, nextToken) {
    if (!Array.isArray(result)) {
      if (isString(result)) {
        return split(result.value).map(chunk => Expr.value(chunk)); // eslint-disable-line;
      }

      if (isNumber(result)) {
        return [new Range(Expr.value(1), result.valueOf())];
      }

      if (result.value instanceof Range) {
        if (nextToken) {
          // increment access-rules to use offset instead, e.g. `[1..3]:1`
          if (nextToken.value !== ':') result.value.idx += 2;

          result.value.take(nextToken.value);
        }

        return result.value.run(true, callback);
      }

      return result.value;
    }

    const seq = [];

    for (let j = 0, k = result.length; j < k; j++) {
      const values = await Range.unwrap(result[j], callback, nextToken);

      for (let i = 0, c = values.length; i < c; i++) {
        let data;

        if (values[i] instanceof Range || isRange(values[i])) {
          data = await Range.run(values[i].value || values[i], callback);
        } else {
          data = await callback(values[i]);
        }

        seq.push(...data);
      }
    }

    return seq;
  }
}
