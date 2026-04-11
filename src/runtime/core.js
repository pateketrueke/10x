const SIGNAL = Symbol('10x.signal');

let currentEffect = null;
let devtoolsActive = false;

export function setDevtoolsActive(active) {
  devtoolsActive = active;
}

export function isDevtoolsActive() {
  return devtoolsActive;
}
const globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map();
  }
  return globalThis.__10x_signals;
})();

export function signal(initialValue, name) {
  const state = {
    [SIGNAL]: true,
    _value: initialValue,
    _history: [],
    _moduleUrl: undefined,
    subs: new Set(),
    get value() {
      return this.get();
    },
    set value(nextValue) {
      this.set(nextValue);
    },
    get() {
      if (currentEffect) {
        this.subs.add(currentEffect);
        if (currentEffect._deps) currentEffect._deps.add(this);
      }
      return this._value;
    },
    set(nextValue) {
      const prev = this._value;
      this._value = nextValue;
      if (devtoolsActive && this._history) {
        this._history.push({ value: nextValue, prev, ts: Date.now() });
        if (this._history.length > 20) this._history.shift();
      }
      Array.from(this.subs).forEach(fn => fn());
      return this._value;
    },
    peek() {
      return this._value;
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
  const cleanup = () => {
    if (!run._deps) return;
    run._deps.forEach(dep => {
      if (dep && dep.subs) dep.subs.delete(run);
    });
    run._deps.clear();
  };

  const run = () => {
    if (run._stopped) return undefined;
    cleanup();
    currentEffect = run;
    let result;
    try {
      result = fn();
    } catch (error) {
      currentEffect = null;
      throw error;
    }

    if (result && typeof result.then === 'function') {
      return result.finally(() => {
        if (currentEffect === run) currentEffect = null;
      });
    }

    currentEffect = null;
    return result;
  };
  run._deps = new Set();
  run._stopped = false;
  run.stop = () => {
    run._stopped = true;
    cleanup();
  };

  run();
  return run;
}

export function computed(fn) {
  const out = signal(undefined);
  effect(() => out.set(fn()));
  return out;
}

export function batch(fn) {
  return fn();
}

export function untracked(fn) {
  const prev = currentEffect;
  currentEffect = null;
  try {
    return fn();
  } finally {
    currentEffect = prev;
  }
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
