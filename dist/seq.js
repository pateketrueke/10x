var global=globalThis;

// src/runtime/prelude.js
function toArray(input) {
  if (Array.isArray(input))
    return input;
  if (input == null)
    return [];
  return Array.from(input);
}
function* range(start, end = Infinity, step = 1) {
  if (step === 0)
    throw new Error("range(...) step cannot be 0");
  if (!Number.isFinite(end)) {
    for (let n = start;; n += step) {
      yield n;
    }
  }
  if (step > 0) {
    for (let n = start;n <= end; n += step)
      yield n;
    return;
  }
  for (let n = start;n >= end; n += step)
    yield n;
}
function head(list) {
  return toArray(list)[0];
}
function tail(list) {
  return toArray(list).slice(1);
}
function filter(list, fn) {
  if (Array.isArray(list))
    return list.filter(fn);
  return function* () {
    for (const item of list || []) {
      if (fn(item))
        yield item;
    }
  }();
}
function map(list, fn) {
  if (Array.isArray(list))
    return list.map(fn);
  return function* () {
    for (const item of list || []) {
      yield fn(item);
    }
  }();
}
function take(list, n) {
  if (Array.isArray(list))
    return list.slice(0, n);
  const out = [];
  let i = 0;
  for (const item of list || []) {
    out.push(item);
    i++;
    if (i >= n)
      break;
  }
  return out;
}
function drop(list, n) {
  return toArray(list).slice(n);
}
export {
  take,
  tail,
  range,
  map,
  head,
  filter,
  drop
};
