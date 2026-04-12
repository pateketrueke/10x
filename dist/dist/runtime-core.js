var global=globalThis;

// src/runtime/core.js
var SIGNAL = Symbol("10x.signal");
var MAX_HISTORY = 20;

class SignalProxy {
  constructor(signal) {
    this._signal = signal;
  }
  valueOf() {
    return this._signal.peek();
  }
  toString() {
    return String(this._signal.peek());
  }
  get() {
    return this._signal.peek();
  }
  set(v) {
    return this._signal.set(v);
  }
  get value() {
    return this._signal.peek();
  }
  peek() {
    return this._signal.peek();
  }
  subscribe(cb) {
    return this._signal.subscribe(cb);
  }
}
var currentEffect = null;
var devtoolsActive = false;
function setDevtoolsActive(active) {
  devtoolsActive = active;
}
function isDevtoolsActive() {
  return devtoolsActive;
}
var globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map;
  }
  return globalThis.__10x_signals;
})();
function nextSignalId() {
  const current = Number(globalThis.__10x_signal_id_counter || 0) + 1;
  globalThis.__10x_signal_id_counter = current;
  return current;
}
function signal(initialValue, name) {
  const key = name || Symbol("signal");
  const signalName = String(key);
  const signalId = nextSignalId();
  const state = {
    [SIGNAL]: true,
    _devtoolsId: signalId,
    _devtoolsName: signalName,
    _value: initialValue,
    _history: [],
    _moduleUrl: undefined,
    subs: new Set,
    get value() {
      return this.get();
    },
    set value(nextValue) {
      this.set(nextValue);
    },
    get() {
      if (currentEffect) {
        this.subs.add(currentEffect);
        if (currentEffect._deps)
          currentEffect._deps.add(this);
      }
      return this._value;
    },
    set(nextValue) {
      const prev = this._value;
      this._value = nextValue;
      if (devtoolsActive && this._history) {
        this._history.push({ value: nextValue, prev, ts: Date.now() });
        if (this._history.length > MAX_HISTORY)
          this._history.shift();
      }
      const notify = globalThis.__10x_devtools_notify;
      if (typeof notify === "function") {
        try {
          notify({
            id: this._devtoolsId,
            name: this._devtoolsName,
            moduleUrl: this._moduleUrl || "global",
            value: nextValue,
            subs: this.subs ? this.subs.size : 0,
            history: Array.isArray(this._history) ? this._history.slice(-MAX_HISTORY) : [],
            ts: Date.now()
          });
          if (globalThis.__10x_devtools_debug) {
            console.debug("[10x:core] notified devtools", {
              id: this._devtoolsId,
              name: this._devtoolsName,
              value: nextValue
            });
          }
        } catch (_) {}
      }
      Array.from(this.subs).forEach((fn) => fn());
      return this._value;
    },
    peek() {
      return this._value;
    },
    subscribe(cb) {
      this.subs.add(cb);
      return () => this.subs.delete(cb);
    }
  };
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
  const cleanup = () => {
    if (!run._deps)
      return;
    run._deps.forEach((dep) => {
      if (dep && dep.subs)
        dep.subs.delete(run);
    });
    run._deps.clear();
  };
  const run = () => {
    if (run._stopped)
      return;
    cleanup();
    currentEffect = run;
    let result;
    try {
      result = fn();
    } catch (error) {
      currentEffect = null;
      throw error;
    }
    if (result && typeof result.then === "function") {
      return result.finally(() => {
        if (currentEffect === run)
          currentEffect = null;
      });
    }
    currentEffect = null;
    return result;
  };
  run._deps = new Set;
  run._stopped = false;
  run.stop = () => {
    run._stopped = true;
    cleanup();
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
  setDevtoolsActive,
  read,
  prop,
  isSignal,
  isDevtoolsActive,
  html,
  getSignalRegistry,
  effect,
  computed,
  batch,
  SignalProxy
};
