const SIGNAL = Symbol('10x.signal');
const MAX_HISTORY = 20;

// Thin proxy that satisfies both 10x's isSignalValue (get+set) and somedom's
// isSignal (value+peek) while behaving like a primitive in JS coercions.
// Used so live signals can be threaded into vdom children without breaking eval.
export class SignalProxy {
  constructor(signal) {
    this._signal = signal;
  }
  valueOf() { return this._signal.peek(); }
  toString() { return String(this._signal.peek()); }
  // 10x isSignalValue interface
  get() { return this._signal.peek(); }
  set(v) { return this._signal.set(v); }
  // somedom isSignal interface
  get value() { return this._signal.peek(); }
  peek() { return this._signal.peek(); }
  subscribe(cb) { return this._signal.subscribe(cb); }
}

import { AsyncLocalStorage } from 'node:async_hooks';

export let effectStack = [];
export let renderIdStack = [];
export let asyncRenderContexts = new Map();
let asyncContextId = 0;
let effectIdCounter = 0;
let devtoolsActive = false;

// Async context tracking using Node.js AsyncLocalStorage
const asyncLocalStorage = new AsyncLocalStorage();

export function getCurrentEffect() { 
  const store = asyncLocalStorage.getStore();
  if (store && store.effect) return store.effect;
  return effectStack[effectStack.length - 1] || null; 
}
export function getCurrentRenderId() { 
  const store = asyncLocalStorage.getStore();
  if (store && store.renderId) return store.renderId;
  return renderIdStack[renderIdStack.length - 1] || null; 
}
export function pushRenderId(id) { renderIdStack.push(id); return renderIdStack.length - 1; }
export function removeRenderIdAt(idx) { if (idx >= 0 && idx < renderIdStack.length) renderIdStack.splice(idx, 1); }

// Run an async function with a specific context
export function withAsyncContext(effect, renderId, fn) {
  return asyncLocalStorage.run({ effect, renderId }, fn);
}

function nextEffectId() {
  return ++effectIdCounter;
}

function nextAsyncContextId() {
  return ++asyncContextId;
}

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

function nextSignalId() {
  const current = Number(globalThis.__10x_signal_id_counter || 0) + 1;
  globalThis.__10x_signal_id_counter = current;
  return current;
}

export function signal(initialValue, name, moduleUrl) {
  const signalId = nextSignalId();
  const key = Symbol(`signal_${signalId}`);
  const signalName = name || `signal_${signalId}`;
  
  // Debug logging
  if (globalThis.__10x_debug_signal) {
    console.log('[core:signal] creating signal:', { signalId, name, signalName, moduleUrl });
  }
  
  const state = {
    [SIGNAL]: true,
    _devtoolsId: signalId,
    _devtoolsName: signalName,
    _value: initialValue,
    _history: [],
    _moduleUrl: moduleUrl,
    subs: new Set(),
    get value() {
      return this.get();
    },
    set value(nextValue) {
      this.set(nextValue);
    },
    get() {
      const effect = getCurrentEffect();
      const renderId = getCurrentRenderId();
      if (process.env.DEBUG_SIGNAL) {
        console.log(`[signal.get] ${this._devtoolsName}:`, { effectRenderId: effect?._renderId, renderId });
      }
      if (effect) {
        // Subscribe if the effect belongs to the current render context
        // or if there's no render context (non-async effect)
        if (!renderId || effect._renderId === renderId) {
          this.subs.add(effect);
          if (effect._deps) effect._deps.add(this);
        }
      }
      return this._value;
    },
    set(nextValue) {
      const prev = this._value;
      this._value = nextValue;
      if (process.env.DEBUG_SIGNAL) {
        console.log(`[signal.set] ${this._devtoolsName}: ${prev} -> ${nextValue}, subs: ${this.subs.size}`);
      }
      if (devtoolsActive && this._history) {
        this._history.push({ value: nextValue, prev, ts: Date.now() });
        if (this._history.length > MAX_HISTORY) this._history.shift();
      }
      const notify = globalThis.__10x_devtools_notify;
      if (typeof notify === 'function') {
        try {
          notify({
            id: this._devtoolsId,
            name: this._devtoolsName,
            moduleUrl: this._moduleUrl || 'global',
            value: nextValue,
            subs: this.subs ? this.subs.size : 0,
            history: Array.isArray(this._history) ? this._history.slice(-MAX_HISTORY) : [],
            ts: Date.now(),
          });
          if (globalThis.__10x_devtools_debug) {
            console.debug('[10x:core] notified devtools', {
              id: this._devtoolsId,
              name: this._devtoolsName,
              value: nextValue,
            });
          }
        } catch (_) {
          // no-op; devtools hooks should not interfere with signal updates
        }
      }
      Array.from(this.subs).forEach(fn => fn());
      return this._value;
    },
    peek() {
      return this._value;
    },
    subscribe(cb) {
      this.subs.add(cb);
      return () => { this.subs.delete(cb); };
    },
  };

  globalRegistry.set(key, state);

  const onCreated = globalThis.__10x_devtools_signal_created;
  if (typeof onCreated === 'function') {
    try {
      onCreated({
        id: signalId,
        name: signalName,
        moduleUrl: moduleUrl || 'global',
        signal: state,
      });
    } catch (_) {}
  }

  return state;
}

export function isSignal(value) {
  return !!(value && value[SIGNAL]);
}

export function read(value) {
  return isSignal(value) ? value.get() : value;
}

export function effect(fn) {
  const effectId = nextEffectId();
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
    effectStack.push(run);
    let result;
    try {
      result = fn();
    } catch (error) {
      effectStack.pop();
      throw error;
    }

    if (result && typeof result.then === 'function') {
      return result.finally(() => {
        const idx = effectStack.indexOf(run);
        if (idx !== -1) effectStack.splice(idx, 1);
      });
    }

    effectStack.pop();
    return result;
  };
  run._id = effectId;
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
  const out = signal(undefined, 'computed');
  effect(() => out.set(fn()));
  return out;
}

export function batch(fn) {
  return fn();
}

export function untracked(fn) {
  const prev = effectStack.slice();
  effectStack = [];
  try {
    return fn();
  } finally {
    effectStack = prev;
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

export function getEffectsRegistry() {
  if (!globalThis.__10x_effects) {
    globalThis.__10x_effects = new Map();
  }
  return globalThis.__10x_effects;
}

let _componentInstanceId = 0;

export function getComponentInstanceId() {
  return _componentInstanceId;
}

export function resetComponentInstanceId(value) {
  _componentInstanceId = value;
}
