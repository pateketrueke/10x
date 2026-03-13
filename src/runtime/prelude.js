function toArray(input) {
  if (Array.isArray(input)) return input;
  if (input == null) return [];
  return Array.from(input);
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
  if (Array.isArray(list)) return list.filter(fn);
  return (function* () { // eslint-disable-line func-names
    for (const item of list || []) {
      if (fn(item)) yield item;
    }
  }());
}

export function map(list, fn) {
  if (Array.isArray(list)) return list.map(fn);
  return (function* () { // eslint-disable-line func-names
    for (const item of list || []) {
      yield fn(item);
    }
  }());
}

export function take(list, n) {
  if (Array.isArray(list)) return list.slice(0, n);
  const out = [];
  let i = 0;
  for (const item of list || []) {
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
