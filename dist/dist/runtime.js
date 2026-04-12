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
function getCurrentEffect() {
  return currentEffect;
}
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
function signal(initialValue, name, moduleUrl) {
  const signalId = nextSignalId();
  const key = Symbol(`signal_${signalId}`);
  const signalName = name || `signal_${signalId}`;
  const state = {
    [SIGNAL]: true,
    _devtoolsId: signalId,
    _devtoolsName: signalName,
    _value: initialValue,
    _history: [],
    _moduleUrl: moduleUrl,
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
      } else {}
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
      return () => {
        this.subs.delete(cb);
      };
    }
  };
  globalRegistry.set(key, state);
  const onCreated = globalThis.__10x_devtools_signal_created;
  if (typeof onCreated === "function") {
    try {
      onCreated({
        id: signalId,
        name: signalName,
        moduleUrl: moduleUrl || "global",
        signal: state
      });
    } catch (_) {}
  }
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
// node_modules/somedom/dist/somedom.mjs
var e = /^[0-9A-Za-z-]+$/;
var r = /^xlink:?/;
var i = "http://www.w3.org/1999/xlink";
var o = ["oncreate", "onupdate", "onreplace", "ondestroy"];
var a = (e2) => Array.isArray(e2);
var l = (e2) => typeof e2 == "string";
var u = (e2) => typeof e2 == "function";
var d = (e2) => e2 == null;
var f = (e2) => e2 !== null && Object.prototype.toString.call(e2) === "[object Object]";
var p = (e2) => e2 !== null && (typeof e2 == "function" || typeof e2 == "object");
var h = (e2) => l(e2) || typeof e2 == "number" || typeof e2 == "boolean";
var b = (e2) => e2 !== null && typeof e2 == "object" && ("value" in e2) && typeof e2.peek == "function";
function g(t) {
  return e.test(t);
}
function y(e2) {
  return !(!a(e2) || !u(e2[0])) || !!(e2 && a(e2) && g(e2[0])) && !!(f(e2[1]) && e2.length >= 2);
}
function m(e2) {
  return e2 === null || !u(e2) && (a(e2) ? e2.length === 0 : f(e2) ? Object.keys(e2).length === 0 : d(e2) || e2 === false);
}
var v = (e2) => a(e2) && !y(e2);
function w(e2) {
  if (y(e2) && f(e2[1]))
    return e2[1].key;
}
function E(e2) {
  if (e2.nodeType === 1)
    return e2.getAttribute("data-key") || undefined;
}
function D(e2, t) {
  if (typeof e2 != typeof t)
    return true;
  if (a(e2)) {
    if (!a(t) || e2.length !== t.length)
      return true;
    for (let n = 0;n < t.length; n += 1)
      if (D(e2[n], t[n]))
        return true;
  } else {
    if (!f(e2) || !f(t))
      return e2 !== t;
    {
      const n = Object.keys(e2).sort(), s = Object.keys(t).sort();
      if (D(n, s))
        return true;
      for (let r2 = 0;r2 < n.length; r2 += 1)
        if (D(e2[n[r2]], t[s[r2]]))
          return true;
    }
  }
}
function N(e2) {
  return e2.slice(2);
}
function x(e2) {
  return y(e2) ? e2 : a(e2) ? e2.reduce((e3, t) => e3.concat(y(t) ? [t] : x(t)), []) : m(e2) ? [] : [e2];
}
function k(e2) {
  return e2.attributes && !e2.getAttributeNames ? e2.attributes : e2.getAttributeNames().reduce((t, n) => (t[n.replace("data-", "@")] = e2[n] || e2.getAttribute(n), t), {});
}
function T(e2, t) {
  if (!d(e2)) {
    if (a(e2))
      return e2.map((e3) => T(e3, t));
    if (typeof NodeList != "undefined" && e2 instanceof NodeList)
      return T(e2.values(), t);
    if (e2.nodeType === 3)
      return e2.nodeValue;
    if (e2.nodeType === 1) {
      const n = [];
      return t && e2.childNodes.forEach((e3) => {
        n.push(T(e3, t));
      }), [e2.tagName.toLowerCase(), k(e2), n];
    }
    return e2.childNodes ? e2.childNodes.map((e3) => T(e3, t)) : T([...e2], t);
  }
}

class S {
  constructor() {
    this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e2) {
    S.valid(e2) ? e2.childNodes.forEach((e3) => {
      this.appendChild(e3);
    }) : this.childNodes.push(e2);
  }
  mount(e2, t) {
    for (;this.childNodes.length > 0; ) {
      const n = this.childNodes.shift();
      t ? e2.insertBefore(n, t) : e2.appendChild(n);
    }
  }
  static valid(e2) {
    return e2 instanceof S;
  }
  static from(e2, t) {
    const n = new S;
    return t = t.filter((e3) => e3 !== null), n.vnode = t, t.forEach((t2) => {
      n.appendChild(e2(t2));
    }), n;
  }
}
var L = (e2) => e2.replace(/-([a-z])/g, (e3, t) => t.toUpperCase());
var M = (e2, t, n = {}) => (...s) => t === s.length && e2(...s, n);
var W = (e2, t) => e2 && e2.removeChild(t);
var V = (e2, t) => {
  t && (S.valid(t) ? t.mount(e2.parentNode, e2) : e2.parentNode.insertBefore(t, e2)), W(e2.parentNode, e2);
};
var G = null;
var Q = new Set;
function ee(e2) {
  let t = null;
  const n = new Set, s = new Set;
  function r2() {
    typeof t == "function" && (t(), t = null), n.forEach((e3) => e3.delete(r2)), n.clear(), s.forEach((e3) => e3.subscribers.delete(r2)), s.clear();
    const i2 = G;
    G = r2, r2._deps = n, r2._signals = s;
    try {
      t = e2();
    } finally {
      G = i2;
    }
  }
  return r2._deps = n, r2._signals = s, r2(), function() {
    typeof t == "function" && t(), n.forEach((e3) => e3.delete(r2)), s.forEach((e3) => {
      e3.subscribers.delete(r2), e3.subscribers.size === 0 && e3.wasEmpty && e3.options?.onUnsubscribe && e3.options.onUnsubscribe();
    }), r2._externalDisposers && (r2._externalDisposers.forEach((e3) => e3()), r2._externalDisposers.clear());
  };
}
var se = "s:";
function re(e2) {
  return e2.indexOf(se) === 0;
}
function ie(e2) {
  return e2.indexOf("d:") === 0;
}
function oe(e2, t, n) {
  const s = t.slice(2);
  e2._signalDisposers || (e2._signalDisposers = new Map), e2._signalDisposers.has(t) && e2._signalDisposers.get(t)();
  const r2 = ee(() => {
    const t2 = n.value;
    s === "textContent" ? e2.textContent = t2 == null ? "" : String(t2) : s === "innerHTML" ? e2.innerHTML = t2 == null ? "" : String(t2) : s.startsWith("style.") ? e2.style[s.slice(6)] = t2 : e2[s] = t2;
  });
  if (!r2._deps?.size && typeof n.subscribe == "function") {
    const i2 = n.subscribe(() => {
      const t2 = n.peek();
      s === "textContent" ? e2.textContent = t2 == null ? "" : String(t2) : s === "innerHTML" ? e2.innerHTML = t2 == null ? "" : String(t2) : s.startsWith("style.") ? e2.style[s.slice(6)] = t2 : e2[s] = t2;
    }), o2 = r2;
    return void e2._signalDisposers.set(t, () => {
      o2(), i2();
    });
  }
  e2._signalDisposers.set(t, r2);
}
function ce(e2) {
  e2._signalDisposers && (e2._signalDisposers.forEach((e3) => e3()), e2._signalDisposers.clear());
}
function ae(e2, t, n, s) {
  Object.entries(t).forEach(([t2, o2]) => {
    if (t2 !== "key" && t2 !== "open")
      if (t2 === "ref")
        e2.oncreate = (e3) => {
          o2.current = e3;
        };
      else if (t2 === "@html")
        e2.innerHTML = o2;
      else if (re(t2)) {
        if (o2 && typeof o2 == "object" && "value" in o2) {
          oe(e2, t2, o2);
          const n2 = e2.teardown;
          e2.teardown = () => {
            ce(e2), n2 && n2();
          };
        }
      } else if (ie(t2)) {
        if (o2 && typeof o2 == "object" && "value" in o2) {
          (function(e3, t3, n3) {
            const s2 = t3.slice(2);
            let r2;
            switch (e3._directiveDisposers || (e3._directiveDisposers = new Map), e3._directiveDisposers.has(t3) && e3._directiveDisposers.get(t3)(), s2) {
              case "show":
                if (r2 = ee(() => {
                  e3.style.display = n3.value ? "" : "none";
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.style.display = n3.peek() ? "" : "none";
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "hide":
                if (r2 = ee(() => {
                  e3.style.display = n3.value ? "none" : "";
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.style.display = n3.peek() ? "none" : "";
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "class": {
                const t4 = n3.className || "active";
                if (r2 = ee(() => {
                  e3.classList.toggle(t4, !!n3.value);
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const s3 = n3.subscribe(() => {
                    e3.classList.toggle(t4, !!n3.peek());
                  }), i2 = r2;
                  r2 = () => {
                    i2(), s3();
                  };
                }
                break;
              }
              case "model": {
                const t4 = n3, s3 = e3;
                s3.value = t4.value;
                const i2 = () => {
                  t4.value = s3.value;
                };
                s3.addEventListener("input", i2), r2 = ee(() => {
                  document.activeElement !== s3 && (s3.value = t4.value);
                }), r2._cleanup = () => {
                  s3.removeEventListener("input", i2);
                };
                break;
              }
              case "text":
                if (r2 = ee(() => {
                  e3.textContent = n3.value;
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.textContent = n3.peek();
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "html":
                if (r2 = ee(() => {
                  e3.innerHTML = n3.value;
                }), !r2._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.innerHTML = n3.peek();
                  }), s3 = r2;
                  r2 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "click-outside": {
                const t4 = n3, s3 = (n4) => {
                  e3.contains(n4.target) || t4(n4);
                };
                document.addEventListener("click", s3), r2 = () => document.removeEventListener("click", s3);
                break;
              }
              default:
                return;
            }
            e3._directiveDisposers.set(t3, r2);
          })(e2, t2, o2);
          const n2 = e2.teardown;
          e2.teardown = () => {
            (function(e3) {
              e3._directiveDisposers && (e3._directiveDisposers.forEach((e4) => {
                e4._cleanup && e4._cleanup(), e4();
              }), e3._directiveDisposers.clear());
            })(e2), n2 && n2();
          };
        }
      } else if (t2.indexOf("class:") === 0)
        o2 ? e2.classList.add(t2.substr(6)) : e2.classList.remove(t2.substr(6));
      else if (t2.indexOf("style:") === 0)
        e2.style[L(t2.substr(6))] = o2;
      else {
        const c = t2.replace("@", "data-").replace(r, "");
        if (b(o2)) {
          oe(e2, `${se}${c}`, o2);
          const t3 = e2.teardown;
          return void (e2.teardown = () => {
            ce(e2), t3 && t3();
          });
        }
        let l2 = o2 !== true ? o2 : !!c.includes("-") || c;
        p(l2) && (l2 = u(s) && s(e2, c, l2) || l2, l2 = l2 !== e2 ? l2 : null, l2 = a(l2) ? l2.join("") : l2);
        const d2 = m(l2);
        if (n && t2 !== c)
          return void (d2 ? e2.removeAttributeNS(i, c) : e2.setAttributeNS(i, c, l2));
        d2 ? e2.removeAttribute(c) : h(l2) && e2.setAttribute(c, l2);
      }
  });
}

class le {
  constructor(e2) {
    this.target = l(e2) ? document.querySelector(e2) : e2, this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e2) {
    this.childNodes.push(e2);
  }
  mount() {
    this.target && this.childNodes.forEach((e2) => {
      this.target.appendChild(e2);
    });
  }
  unmount() {
    this.childNodes.forEach((e2) => {
      e2.parentNode && e2.parentNode.removeChild(e2);
    }), this.childNodes = [];
  }
  static valid(e2) {
    return e2 instanceof le;
  }
  static from(e2, t, n) {
    const s = new le(n);
    return t.forEach((t2) => {
      s.appendChild(e2(t2));
    }), s;
  }
}
function ue(e2, t, n) {
  return function(e3, t2, n2) {
    let s = document.createTextNode(""), r2 = null;
    const i2 = async () => {
      const i3 = e3.peek(), o3 = s._signalDispose;
      if (d(i3) || i3 === false) {
        if (s.nodeType === 3)
          s.nodeValue = "";
        else {
          const e4 = document.createTextNode("");
          e4._signalDispose = o3, s.replaceWith(e4), s = e4;
        }
        r2 = null;
      } else if (h(i3)) {
        if (s.nodeType === 3)
          s.nodeValue = String(i3);
        else {
          const e4 = document.createTextNode(String(i3));
          e4._signalDispose = o3, s.replaceWith(e4), s = e4;
        }
        r2 = null;
      } else if (s.nodeType === 3) {
        const e4 = he(i3, t2, n2);
        e4._signalDispose = o3, s.replaceWith(e4), s = e4, r2 = i3;
      } else
        s = await ge(s, r2, i3, t2, n2), s._signalDispose = o3, r2 = i3;
    };
    Promise.resolve().then(i2);
    const o2 = ee(() => {
      e3.value;
    });
    if (o2._deps?.size || typeof e3.subscribe != "function") {
      let t3 = false;
      const n3 = ee(() => {
        e3.value, t3 && i2(), t3 = true;
      });
      s._signalDispose = n3;
    } else {
      const t3 = e3.subscribe(() => i2());
      s._signalDispose = () => {
        o2(), t3();
      };
    }
    return s;
  }(e2, t, n);
}
var de = () => typeof Element != "undefined" && ("moveBefore" in Element.prototype);
function fe(e2, t = (e3) => e3()) {
  const n = () => e2 && e2.remove();
  return t === false ? n() : Promise.resolve().then(() => t(n));
}
function pe(e2, t, n, s) {
  const r2 = he(t, n, s);
  return le.valid(r2) ? r2.mount() : S.valid(r2) ? r2.mount(e2) : e2.appendChild(r2), r2;
}
function he(e2, t, n) {
  if (d(e2))
    throw new Error(`Invalid vnode, given '${e2}'`);
  if (!y(e2))
    return a(e2) ? S.from((e3) => he(e3, t, n), e2) : b(e2) ? ue(e2, t, n) : h(e2) && document.createTextNode(String(e2)) || e2;
  if (!a(e2))
    return e2;
  if (n && n.tags && n.tags[e2[0]])
    return he(n.tags[e2[0]](e2[1], N(e2), n), t, n);
  if (!y(e2))
    return S.from((e3) => he(e3, t, n), e2);
  if (u(e2[0]))
    return he(e2[0](e2[1], e2.slice(2)), t, n);
  if (e2[0] === "portal") {
    const [, s2, ...r3] = e2;
    return le.from((e3) => he(e3, t, n), r3, s2.target);
  }
  const s = t || e2[0].indexOf("svg") === 0, [r2, i2, ...o2] = e2;
  let c = s ? document.createElementNS("http://www.w3.org/2000/svg", r2) : document.createElement(r2);
  if (i2 && i2.key && c.setAttribute("data-key", i2.key), u(n) && (c = n(c, r2, i2, o2) || c), u(c))
    return he(c(), s, n);
  m(i2) || ae(c, i2, s, n), u(c.oncreate) && c.oncreate(c), u(c.enter) && c.enter(), c.remove = () => Promise.resolve().then(() => u(c.ondestroy) && c.ondestroy(c)).then(() => u(c.teardown) && c.teardown()).then(() => u(c.exit) && c.exit()).then(() => V(c)), o2.forEach((e3) => {
    be(c, e3, s, n);
  });
  const l2 = c.childNodes;
  if (l2.length > 0) {
    const e3 = c.teardown;
    c.teardown = () => {
      for (let e4 = 0;e4 < l2.length; e4++) {
        const t2 = l2[e4];
        t2._signalDispose && t2._signalDispose();
      }
      e3 && e3();
    };
  }
  return c;
}
function be(e2, t, n, s) {
  return u(t) && (s = t, t = e2, e2 = undefined), u(n) && (s = n, n = null), d(t) && (t = e2, e2 = undefined), e2 || (e2 = document.body), typeof e2 == "string" && (e2 = document.querySelector(e2)), v(t) ? t.forEach((t2) => {
    be(e2, t2, n, s);
  }) : d(t) || (e2 = pe(e2, t, n, s)), e2;
}
async function ge(e2, t, n, s, r2) {
  return h(n) || !y(t) || t[0] !== n[0] || e2.nodeType !== 1 ? function(e3, t2, n2, s2) {
    if (u(e3.onreplace))
      return e3.onreplace(t2, n2, s2);
    const r3 = he(t2, n2, s2);
    return le.valid(r3) ? (r3.mount(), e3.remove()) : S.valid(r3) ? V(e3, r3) : e3.replaceWith(r3), r3;
  }(e2, n, s, r2) : (function(e3, t2, n2, s2, r3) {
    let i2;
    const o2 = Object.keys(t2).concat(Object.keys(n2)).reduce((e4, s3) => ((s3 in t2) && !(s3 in n2) ? (e4[s3] = null, i2 = true) : D(t2[s3], n2[s3]) && (e4[s3] = n2[s3], i2 = true), e4), {});
    return i2 && (Object.keys(t2).forEach((t3) => {
      if (re(t3) && !(t3 in n2) && e3._signalDisposers && e3._signalDisposers.has(t3) && (e3._signalDisposers.get(t3)(), e3._signalDisposers.delete(t3)), ie(t3) && !(t3 in n2) && e3._directiveDisposers && e3._directiveDisposers.has(t3)) {
        const n3 = e3._directiveDisposers.get(t3);
        n3._cleanup && n3._cleanup(), n3(), e3._directiveDisposers.delete(t3);
      }
    }), ae(e3, o2, s2, r3)), i2;
  }(e2, t[1] || [], n[1] || [], s, r2) && (u(e2.onupdate) && await e2.onupdate(e2), u(e2.update) && await e2.update()), n[1] && n[1]["@html"] ? e2 : ye(e2, N(t), N(n), s, r2));
}
async function ye(e2, t, n, s, r2) {
  if (!t || y(t) && y(n))
    return ge(e2, t, n, s, r2);
  if (y(t)) {
    for (;a(n) && n.length === 1; )
      n = n[0];
    return ye(e2, [t], n, s, r2);
  }
  return y(n) ? ge(e2, t, n, s, r2) : (await async function(e3, t2, n2, s2) {
    const r3 = [], i2 = x(t2), o2 = Math.max(e3.childNodes.length, i2.length), c = Array.from(e3.childNodes), a2 = new Map, l2 = new Set;
    for (let e4 = 0;e4 < c.length; e4++) {
      const t3 = E(c[e4]);
      t3 && a2.set(t3, { el: c[e4], index: e4 });
    }
    let u2, f2, p2, h2 = 0;
    for (let t3 = 0;t3 < o2; t3 += 1) {
      u2 !== h2 && (f2 = e3.childNodes[h2], p2 = T(f2), u2 = h2);
      const t4 = i2.shift(), n3 = w(t4);
      if (d(t4))
        r3.push({ rm: f2 }), u2 = null;
      else if (d(p2))
        if (n3 && a2.has(n3) && !l2.has(n3)) {
          const e4 = a2.get(n3).el, s3 = a2.get(n3).index;
          l2.add(n3), s3 < h2 ? (r3.push({ move: e4, target: f2 }), h2++) : (r3.push({ patch: T(e4), with: t4, target: e4 }), l2.add(n3));
        } else
          r3.push({ add: t4 }), h2++;
      else {
        const e4 = E(f2);
        if (n3 && n3 === e4 && !l2.has(n3))
          r3.push({ patch: p2, with: t4, target: f2 }), l2.add(n3), h2++;
        else if (n3 && a2.has(n3) && !l2.has(n3)) {
          const e5 = a2.get(n3).el;
          r3.push({ move: e5, target: f2 }), l2.add(n3), h2++;
        } else
          r3.push({ patch: p2, with: t4, target: f2 }), h2++;
      }
    }
    if (h2 !== e3.childNodes.length)
      for (let t3 = e3.childNodes.length;t3 > h2; t3--) {
        const n3 = e3.childNodes[t3 - 1], s3 = E(n3);
        s3 && l2.has(s3) || r3.push({ rm: n3 });
      }
    for (const t3 of r3)
      t3.rm && await fe(t3.rm), d(t3.add) || pe(e3, t3.add, n2, s2), t3.move && (de() ? e3.moveBefore(t3.move, t3.target) : e3.insertBefore(t3.move, t3.target)), d(t3.patch) || await me(t3.target, t3.patch, t3.with, n2, s2);
  }(e2, [n], s, r2), e2);
}
async function me(e2, t, n, s, r2) {
  if (S.valid(n)) {
    let t2 = e2;
    for (;n.childNodes.length > 0; ) {
      const s2 = n.childNodes.pop();
      e2.parentNode.insertBefore(s2, t2), t2 = s2;
    }
    return V(e2), t2;
  }
  return e2.nodeType === 3 && h(n) ? D(t, n) && (e2.nodeValue = String(n)) : e2 = await ge(e2, t, n, s, r2), e2;
}
function ve(e2, t, n, s) {
  if (u(n))
    if (e2.listeners = e2.listeners || {}, e2.events = e2.events || {}, e2.teardown || (e2.teardown = () => {
      Object.keys(e2.events).forEach((t2) => {
        e2.removeEventListener(t2, e2.listeners[t2]), e2.events[t2] = [];
      });
    }), t.substr(0, 2) === "on" && o.indexOf(t) === -1) {
      const r2 = t.substr(2);
      e2.events[r2] || (e2.listeners[r2] = function(e3) {
        return (t2) => t2.currentTarget.events[e3](t2);
      }(r2), e2.addEventListener(r2, e2.listeners[r2], false)), e2.events[r2] = (e3) => function(e4, t2, n2, s2) {
        let r3;
        p(s2) && (u(s2) ? r3 = s2(t2, e4) === false : u(s2[t2]) && (r3 = s2[t2](e4) === false)), r3 || n2(e4);
      }(e3, t, n, s);
    } else
      (o.indexOf(t) > -1 ? e2 : e2.events)[t] = n;
}
var _e = (e2 = "div", t = null, ...n) => h(t) ? [e2, {}, [t].concat(n).filter((e3) => !d(e3))] : a(t) && !n.length ? [e2, {}, t] : [e2, t || {}, n];
var Ne = (e2) => M(ve, 3, e2);

// src/runtime/dom.js
var componentObservers = new WeakMap;
function registerShadowHost(host, moduleUrl) {
  if (!moduleUrl)
    return;
  const globalObj = globalThis;
  const registry = globalObj.__10x_components instanceof Map ? globalObj.__10x_components : globalObj.__10x_components = new Map;
  let hosts = registry.get(moduleUrl);
  if (!hosts) {
    hosts = new Set;
    registry.set(moduleUrl, hosts);
  }
  hosts.add(host);
  if (typeof MutationObserver !== "function")
    return;
  if (typeof document === "undefined" || !document.body)
    return;
  let byModule = componentObservers.get(host);
  if (!byModule) {
    byModule = new Map;
    componentObservers.set(host, byModule);
  }
  if (byModule.has(moduleUrl))
    return;
  const cleanup = () => {
    const currentHosts = registry.get(moduleUrl);
    if (currentHosts) {
      currentHosts.delete(host);
      if (!currentHosts.size)
        registry.delete(moduleUrl);
    }
    const currentByModule = componentObservers.get(host);
    if (currentByModule) {
      const observer2 = currentByModule.get(moduleUrl);
      if (observer2)
        observer2.disconnect();
      currentByModule.delete(moduleUrl);
      if (!currentByModule.size)
        componentObservers.delete(host);
    }
  };
  const observer = new MutationObserver(() => {
    if (!host.isConnected)
      cleanup();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  byModule.set(moduleUrl, observer);
}
function hashStr(str) {
  let hash = 0;
  for (let i2 = 0;i2 < str.length; i2++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i2) | 0;
  }
  return Math.abs(hash).toString(36);
}
function dashCase(input) {
  return String(input || "").replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
function objectToCss(value, selector = ":host") {
  if (!value || typeof value !== "object")
    return "";
  const declarations = [];
  const nested = [];
  Object.entries(value).forEach(([key, entry]) => {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const nestedSelector = selector === ":host" ? key : `${selector} ${key}`;
      const nestedCss = objectToCss(entry, nestedSelector);
      if (nestedCss)
        nested.push(nestedCss);
      return;
    }
    declarations.push(`  ${dashCase(key)}: ${entry};`);
  });
  const block = declarations.length ? `${selector} {
${declarations.join(`
`)}
}` : "";
  return [block].concat(nested).filter(Boolean).join(`
`);
}
function style(hostOrCss, css) {
  if (typeof document === "undefined")
    return;
  const hasHost = css !== undefined;
  const host = hasHost ? hostOrCss : null;
  const raw = hasHost ? css : hostOrCss;
  const cssText = typeof raw === "string" ? raw : objectToCss(raw);
  if (!cssText || !cssText.trim())
    return;
  if (hasHost) {
    const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    const element2 = document.createElement("style");
    element2.textContent = cssText;
    shadow.insertBefore(element2, shadow.firstChild);
    return;
  }
  const id = `10x-${hashStr(cssText)}`;
  if (document.getElementById(id))
    return;
  const element = document.createElement("style");
  element.id = id;
  element.textContent = cssText;
  document.head.appendChild(element);
}
function render(selectorOrElement, view) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (!view || typeof view.render !== "function") {
    throw new Error("render(...) expects a view from html(...)");
  }
  const target = typeof selectorOrElement === "string" ? document.querySelector(selectorOrElement) : selectorOrElement;
  if (!target)
    throw new Error(`Render target not found: ${selectorOrElement}`);
  const cb = Ne();
  let prev = null;
  let root = null;
  const rootFor = (next) => y(next) ? target.firstChild : target;
  const remount = (next) => {
    target.innerHTML = "";
    untracked(() => be(target, next, false, cb));
    root = rootFor(next);
    prev = next;
  };
  return effect(async () => {
    let next;
    try {
      next = await view.render();
    } catch (err) {
      console.error("[10x:dom] view.render() threw:", err);
      return;
    }
    try {
      if (typeof next === "string") {
        target.innerHTML = next;
        prev = null;
        root = null;
      } else if (!prev) {
        untracked(() => be(target, next, false, cb));
        root = rootFor(next);
        prev = next;
      } else if (root) {
        try {
          const node = await Promise.resolve().then(() => untracked(() => ye(root, prev, next, false, cb)));
          root = node || root;
          prev = next;
        } catch (_) {
          remount(next);
        }
      } else {
        remount(next);
      }
    } catch (err) {
      console.error("[10x:dom] mount/patch threw:", err);
    }
  });
}
function on(eventName, selectorOrElement, handler, root) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (typeof handler !== "function")
    throw new Error("on(...) expects a handler function");
  if (typeof selectorOrElement === "string") {
    const eventRoot = root ?? document;
    const delegated = (event) => {
      const origin = event && event.target;
      const matched = origin && typeof origin.closest === "function" ? origin.closest(selectorOrElement) : null;
      if (matched)
        handler(event);
    };
    eventRoot.addEventListener(eventName, delegated);
    return () => eventRoot.removeEventListener(eventName, delegated);
  }
  const target = selectorOrElement;
  if (!target)
    throw new Error(`Event target not found: ${selectorOrElement}`);
  target.addEventListener(eventName, handler);
  return () => target.removeEventListener(eventName, handler);
}
function renderShadow(host, view, moduleUrl) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (!view || typeof view.render !== "function") {
    throw new Error("renderShadow(...) expects a view from html(...)");
  }
  const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
  registerShadowHost(host, moduleUrl);
  const outlet = document.createElement("div");
  shadow.appendChild(outlet);
  let prev = null;
  let root = null;
  const rootFor = (next) => y(next) ? outlet.firstChild : outlet;
  const cb = Ne();
  const remount = (next) => {
    outlet.innerHTML = "";
    untracked(() => be(outlet, next, false, cb));
    root = rootFor(next);
    prev = next;
  };
  return effect(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      outlet.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked(() => be(outlet, next, false, cb));
      root = rootFor(next);
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked(() => ye(root, prev, next, false, cb)));
        root = node || root;
        prev = next;
      } catch (_) {
        remount(next);
      }
    } else {
      remount(next);
    }
  });
}
// src/runtime/devtools.js
var MAX_HISTORY2 = 20;
function getValueColor(value) {
  if (value === null || value === undefined)
    return "#888";
  if (typeof value === "number")
    return "#79c0ff";
  if (typeof value === "string")
    return "#7ee787";
  if (Array.isArray(value))
    return "#ffa657";
  if (typeof value === "object")
    return "#ffa657";
  return "#d8dde4";
}
function formatValue(value, container) {
  const str = JSON.stringify(value);
  container.textContent = str;
  container.style.color = getValueColor(value);
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {});
}
function renderGroupedRows(container, groups, collapsedSignals, rerender) {
  container.innerHTML = "";
  groups.forEach((signals, moduleUrl) => {
    const groupHeader = document.createElement("div");
    groupHeader.style.cssText = "font-weight:600;margin:0.75rem 0 0.25rem;font-size:11px;color:#888;letter-spacing:0.5px;";
    groupHeader.textContent = moduleUrl === "global" ? "Global" : moduleUrl.split("/").pop() || moduleUrl;
    container.appendChild(groupHeader);
    signals.forEach(({ name, value, subsCount, history, lazy, restored }) => {
      const isCollapsed = collapsedSignals.has(name);
      const displayName = name.includes(".") ? name.split(".").pop() : name;
      const row = document.createElement("div");
      row.style.cssText = "margin-bottom:0.25rem;";
      const header = document.createElement("div");
      header.style.cssText = "display:grid;grid-template-columns:1fr auto auto;gap:0.6rem;padding:0.25rem 0;cursor:pointer;";
      header.onclick = () => {
        if (collapsedSignals.has(name)) {
          collapsedSignals.delete(name);
        } else {
          collapsedSignals.add(name);
        }
        rerender();
      };
      const key = document.createElement("code");
      key.textContent = displayName;
      key.style.color = "#d2a8ff";
      const valueEl = document.createElement("code");
      if (restored) {
        const indicator = document.createElement("span");
        indicator.textContent = "↻ ";
        indicator.style.color = "#238636";
        indicator.title = "Restored from previous mount";
        valueEl.appendChild(indicator);
        formatValue(value, valueEl);
        valueEl.style.cursor = "pointer";
        valueEl.onclick = (e2) => {
          e2.stopPropagation();
          copyToClipboard(JSON.stringify(value));
        };
      } else if (lazy && value === undefined) {
        valueEl.textContent = "…";
        valueEl.style.color = "#555";
        valueEl.style.fontStyle = "italic";
      } else {
        formatValue(value, valueEl);
        valueEl.style.cursor = "pointer";
        valueEl.title = "Click to copy";
        valueEl.onclick = (e2) => {
          e2.stopPropagation();
          copyToClipboard(JSON.stringify(value));
        };
      }
      const subs = document.createElement("code");
      subs.textContent = `subs:${subsCount}`;
      subs.style.color = "#8b949e";
      header.appendChild(key);
      header.appendChild(valueEl);
      header.appendChild(subs);
      row.appendChild(header);
      if (!isCollapsed && history.length > 0) {
        const historyDiv = document.createElement("div");
        historyDiv.style.cssText = "font-size:10px;margin-left:1rem;padding:0.25rem;background:rgba(255,255,255,0.03);border-radius:4px;max-height:120px;overflow:auto;";
        const historyHeader = document.createElement("div");
        historyHeader.style.cssText = "color:#888;margin-bottom:0.25rem;";
        historyHeader.textContent = `History (${history.length})`;
        historyDiv.appendChild(historyHeader);
        [...history].reverse().forEach((h2, i2) => {
          const entry = document.createElement("div");
          entry.style.cssText = "display:flex;justify-content:space-between;gap:0.5rem;margin:0.15rem 0;";
          const ts = document.createElement("span");
          const date = new Date(h2.ts);
          ts.textContent = date.toLocaleTimeString();
          ts.style.color = "#666";
          const val = document.createElement("span");
          formatValue(h2.value, val);
          val.style.fontWeight = i2 === 0 ? "600" : "400";
          entry.appendChild(ts);
          entry.appendChild(val);
          historyDiv.appendChild(entry);
        });
        row.appendChild(historyDiv);
      }
      container.appendChild(row);
    });
  });
}
function renderRowsFromSnapshot(container, snapshot, collapsedSignals) {
  const moduleGroups = new Map;
  (Array.isArray(snapshot) ? snapshot : []).forEach((entry) => {
    if (!entry || !entry.name)
      return;
    const moduleUrl = entry.moduleUrl || "global";
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push({
      id: entry.id || null,
      name: entry.name,
      value: entry.value,
      subsCount: Number.isFinite(entry.subs) ? entry.subs : 0,
      history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY2) : [],
      lazy: !!entry.lazy,
      restored: !!entry.restored
    });
  });
  renderGroupedRows(container, moduleGroups, collapsedSignals, () => renderRowsFromSnapshot(container, snapshot, collapsedSignals));
}
function mergeSignalUpdate(snapshot, update) {
  if (!update || typeof update.name !== "string")
    return snapshot;
  const current = Array.isArray(snapshot) ? snapshot : [];
  const next = current.map((entry) => ({ ...entry }));
  const index = next.findIndex((entry) => entry && (update.id != null && entry.id === update.id || entry.name === update.name));
  const history = Array.isArray(update.history) ? update.history.slice(-MAX_HISTORY2) : [{ ts: update.ts || Date.now(), value: update.value }];
  const merged = {
    id: update.id || null,
    name: update.name,
    moduleUrl: update.moduleUrl || "global",
    value: update.value,
    subs: Number.isFinite(update.subs) ? update.subs : 0,
    history,
    lazy: false,
    restored: false
  };
  if (index >= 0) {
    next[index] = merged;
  } else {
    next.push(merged);
  }
  return next;
}
function devtools(options = {}) {
  if (typeof document === "undefined")
    return null;
  const { docked = false, container = null } = options;
  const dockedPane = docked && container ? container.closest(".devtools-pane") || container : null;
  const dockedLayout = dockedPane ? dockedPane.closest(".layout") : null;
  let panel = document.getElementById("10x-devtools-panel");
  if (panel)
    return panel;
  const registry = getSignalRegistry();
  const collapsedSignals = new Set;
  let latestSnapshot = [];
  let remountSnapshot = {};
  let hmrMessage = null;
  let hmrTimeout = null;
  panel = document.createElement("aside");
  panel.id = "10x-devtools-panel";
  panel.style.cssText = docked ? "width:100%;height:100%;overflow:auto;padding:0.5rem;" : "position:fixed;bottom:1rem;right:1rem;width:360px;max-height:45vh;overflow:auto;z-index:99999;padding:0.7rem;border-radius:12px;border:1px solid rgba(255,255,255,0.15);background:rgba(12,16,22,0.94);color:#d8dde4;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;";
  if (!docked) {
    panel.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
  }
  const title = document.createElement("div");
  title.style.cssText = "font-weight:700;margin-bottom:0.5rem;display:flex;justify-content:space-between;align-items:center;";
  title.innerHTML = `<span>10x DevTools</span><span style="font-weight:400;font-size:10px;color:#888;">Alt+D / Ctrl+Shift+D</span>`;
  const buildStatus = document.createElement("div");
  buildStatus.style.cssText = "font-size:10px;color:#666;margin-bottom:0.5rem;";
  function formatAgo(ms) {
    const s = Math.floor(ms / 1000);
    const m2 = Math.floor(s / 60);
    const h2 = Math.floor(m2 / 60);
    if (h2 > 0)
      return `${h2}h ago`;
    if (m2 > 0)
      return `${m2}m ago`;
    return "just now";
  }
  function updateBuildStatus() {
    const ts = globalThis.__10x_BUILD_TS;
    if (!ts) {
      buildStatus.textContent = "";
      return;
    }
    const diff = Date.now() - new Date(ts).getTime();
    buildStatus.textContent = `build: ${formatAgo(diff)}`;
  }
  updateBuildStatus();
  setInterval(updateBuildStatus, 60000);
  const hmrStatus = document.createElement("div");
  hmrStatus.id = "10x-hmr-status";
  hmrStatus.style.cssText = "font-size:11px;margin-bottom:0.5rem;padding:0.25rem 0.5rem;background:#238636;border-radius:4px;color:#fff;display:none;";
  const body = document.createElement("div");
  panel.appendChild(title);
  panel.appendChild(buildStatus);
  panel.appendChild(hmrStatus);
  panel.appendChild(body);
  if (docked && container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }
  setDevtoolsActive(true);
  latestSnapshot = [];
  renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  function toggle() {
    const target = dockedPane || panel;
    const hidden = target.style.display === "none";
    if (hidden) {
      target.style.display = "";
      if (dockedLayout && dockedPane) {
        dockedLayout.style.gridTemplateColumns = "";
      }
    } else {
      target.style.display = "none";
      if (dockedLayout && dockedPane) {
        dockedLayout.style.gridTemplateColumns = "1fr";
      }
    }
  }
  function showHmrMessage(count, url) {
    hmrMessage = { count, url, ts: Date.now() };
    hmrStatus.textContent = `HMR — ${count} signals restored`;
    hmrStatus.style.display = "block";
    clearTimeout(hmrTimeout);
    hmrTimeout = setTimeout(() => {
      hmrStatus.style.display = "none";
      hmrMessage = null;
    }, 3000);
  }
  globalThis.__10x_devtools = {
    active: true,
    onHmr: ({ restored = 0, url = "" }) => showHmrMessage(restored, url),
    onSignals: (snapshot) => {
      latestSnapshot = Array.isArray(snapshot) ? snapshot : [];
      if (globalThis.__10x_devtools_debug) {
        console.debug("[10x:devtools] onSignals snapshot", { count: latestSnapshot.length });
      }
      renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
    },
    toggle
  };
  globalThis.__10x_devtools_notify = (update) => {
    if (globalThis.__10x_devtools_debug) {
      console.debug("[10x:devtools] notify update", update);
    }
    latestSnapshot = mergeSignalUpdate(latestSnapshot, update);
    renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  };
  globalThis.__10x_devtools_signal_created = (info) => {
    const existing = latestSnapshot.find((e2) => e2 && (e2.id === info.id || e2.name === info.name));
    if (existing)
      return;
    const restored = remountSnapshot[info.name];
    const isRestored = restored !== undefined;
    latestSnapshot.push({
      id: info.id || null,
      name: info.name,
      moduleUrl: info.moduleUrl || "global",
      value: isRestored ? restored.value : undefined,
      subs: 0,
      history: isRestored ? restored.history : [],
      lazy: !isRestored,
      restored: isRestored
    });
    if (isRestored) {
      delete remountSnapshot[info.name];
    }
    if (isRestored && info.signal && typeof info.signal.set === "function") {
      info.signal.set(restored.value);
    }
    renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  };
  globalThis.__10x_devtools_before_remount = (moduleUrl, externalSnapshot) => {
    remountSnapshot = {};
    const source = Array.isArray(externalSnapshot) ? externalSnapshot : latestSnapshot;
    source.forEach((entry) => {
      if (entry && entry.name && entry.value !== undefined) {
        remountSnapshot[entry.name] = {
          value: entry.value,
          history: entry.history || []
        };
      }
    });
    latestSnapshot = [];
    renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  };
  document.addEventListener("keydown", (e2) => {
    const isAltD = e2.altKey && (e2.key === "d" || e2.key === "D");
    const isCtrlShiftD = e2.ctrlKey && e2.shiftKey && (e2.key === "d" || e2.key === "D");
    if (isAltD || isCtrlShiftD) {
      e2.preventDefault();
      toggle();
    }
  });
  return panel;
}
function devtoolsEnabledByQuery(search) {
  const input = typeof search === "string" ? search : typeof window !== "undefined" && window.location ? window.location.search : "";
  if (!input)
    return false;
  const params = new URLSearchParams(input.startsWith("?") ? input : `?${input}`);
  if (!params.has("devtools"))
    return false;
  const value = params.get("devtools");
  return value !== "0" && value !== "false" && value !== "off";
}
function maybeEnableDevtools(options = {}) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return null;
  if (!devtoolsEnabledByQuery(window.location && window.location.search) && !options.force)
    return null;
  const start = () => {
    try {
      devtools(options);
    } catch (_) {}
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    return null;
  }
  return start();
}
maybeEnableDevtools();
export {
  untracked,
  style,
  signal,
  setDevtoolsActive,
  renderShadow,
  render,
  read,
  prop,
  on,
  maybeEnableDevtools,
  isSignal,
  isDevtoolsActive,
  html,
  _e as h,
  getSignalRegistry,
  getCurrentEffect,
  effect,
  devtoolsEnabledByQuery,
  devtools,
  computed,
  batch,
  SignalProxy
};
