var global=globalThis;

// src/runtime/core.js
var SIGNAL = Symbol("10x.signal");
var currentEffect = null;
var globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map;
  }
  return globalThis.__10x_signals;
})();
function signal(initialValue, name) {
  const state = {
    [SIGNAL]: true,
    _value: initialValue,
    subs: new Set,
    get value() {
      return this.get();
    },
    set value(nextValue) {
      this.set(nextValue);
    },
    get() {
      if (currentEffect)
        this.subs.add(currentEffect);
      return this._value;
    },
    set(nextValue) {
      this._value = nextValue;
      this.subs.forEach((fn) => fn());
      return this._value;
    },
    peek() {
      return this._value;
    }
  };
  const key = name || Symbol("signal");
  globalRegistry.set(key, state);
  return state;
}
function isSignal(value) {
  return !!(value && value[SIGNAL]);
}
function read(value) {
  return isSignal(value) ? value.get() : value;
}
function effect(fn) {
  const run = () => {
    currentEffect = run;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };
  run();
  return run;
}
function computed(fn) {
  const out = signal(undefined);
  effect(() => out.set(fn()));
  return out;
}
function batch(fn) {
  return fn();
}
function untracked(fn) {
  const prev = currentEffect;
  currentEffect = null;
  try {
    return fn();
  } finally {
    currentEffect = prev;
  }
}
function html(renderFn) {
  if (typeof renderFn !== "function") {
    throw new Error("html(...) expects a function");
  }
  return {
    render: renderFn
  };
}
function prop(host, name, fallback) {
  const raw = host.getAttribute(name);
  return raw !== null ? Number(raw) || raw : fallback;
}
function getSignalRegistry() {
  return globalRegistry;
}
export {
  untracked,
  signal,
  read,
  prop,
  isSignal,
  html,
  getSignalRegistry,
  effect,
  computed,
  batch
};
