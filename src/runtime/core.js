const SIGNAL = Symbol('10x.signal');

let currentEffect = null;
const globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map();
  }
  return globalThis.__10x_signals;
})();

export function signal(initialValue, name) {
  const state = {
    [SIGNAL]: true,
    value: initialValue,
    subs: new Set(),
    get() {
      if (currentEffect) this.subs.add(currentEffect);
      return this.value;
    },
    set(nextValue) {
      this.value = nextValue;
      this.subs.forEach(fn => fn());
      return this.value;
    },
    peek() {
      return this.value;
    },
  };

  const key = name || Symbol('signal');
  globalRegistry.set(key, state);
  return state;
}

export function isSignal(value) {
  return !!(value && value[SIGNAL]);
}

export function read(value) {
  return isSignal(value) ? value.get() : value;
}

export function effect(fn) {
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

export function html(renderFn) {
  if (typeof renderFn !== 'function') {
    throw new Error('html(...) expects a function');
  }

  return {
    render: renderFn,
  };
}

export function prop(host, name, fallback) {
  const raw = host.getAttribute(name);
  return raw !== null ? (Number(raw) || raw) : fallback;
}

export function getSignalRegistry() {
  return globalRegistry;
}
