const isSignal = v => v && typeof v === 'object' && typeof v.peek === 'function';
const readSignal = v => isSignal(v) ? v.peek() : v;

function toArray(input) {
  const value = readSignal(input);
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return Array.from(value);
}

export function* range(start, end = Infinity, step = 1) {
  if (step === 0) throw new Error('range(...) step cannot be 0');
  if (!Number.isFinite(end)) {
    for (let n = start; ; n += step) {
      yield n;
    }
  }
  if (step > 0) {
    for (let n = start; n <= end; n += step) yield n;
    return;
  }
  for (let n = start; n >= end; n += step) yield n;
}

export function size(list) {
  return toArray(list).length;
}

export function head(list) {
  return toArray(list)[0];
}

export function tail(list) {
  return toArray(list).slice(1);
}

export function filter(list, fn) {
  const value = readSignal(list);
  if (Array.isArray(value)) return value.filter(fn);
  return (function* () {
    for (const item of value || []) {
      if (fn(item)) yield item;
    }
  }());
}

export function map(list, fn) {
  const value = readSignal(list);
  if (Array.isArray(value)) return value.map(fn);
  return (function* () {
    for (const item of value || []) {
      yield fn(item);
    }
  }());
}

export function take(list, n) {
  const value = readSignal(list);
  if (Array.isArray(value)) return value.slice(0, n);
  const out = [];
  let i = 0;
  for (const item of value || []) {
    out.push(item);
    i++;
    if (i >= n) break;
  }
  return out;
}

export function drop(list, n) {
  return toArray(list).slice(n);
}

export function concat(...parts) {
  return parts.reduce((prev, cur) => prev.concat(toArray(cur)), []);
}

export function rev(list) {
  return toArray(list).slice().reverse();
}

export function keys(value) {
  return Object.keys(value || {});
}

export function vals(value) {
  return Object.values(value || {});
}

export function pairs(value) {
  return Object.entries(value || {});
}

export function push(list, ...values) {
  return toArray(list).concat(values);
}

export function get(value, key) {
  if (value == null) return undefined;
  return value[key];
}

export function equals(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function show(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}
