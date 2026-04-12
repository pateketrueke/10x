var global=globalThis;

// node_modules/somedom/dist/somedom.mjs
var e = /^[0-9A-Za-z-]+$/;
var r = /^xlink:?/;
var i = "http://www.w3.org/1999/xlink";
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
function v(e2) {
  return e2 === null || !u(e2) && (a(e2) ? e2.length === 0 : f(e2) ? Object.keys(e2).length === 0 : d(e2) || e2 === false);
}
var m = (e2) => a(e2) && !y(e2);
function _(e2) {
  if (y(e2) && f(e2[1]))
    return e2[1].key;
}
function E(e2) {
  if (e2.nodeType === 1)
    return e2.getAttribute("data-key") || undefined;
}
function N(e2, t) {
  if (typeof e2 != typeof t)
    return true;
  if (a(e2)) {
    if (!a(t) || e2.length !== t.length)
      return true;
    for (let n = 0;n < t.length; n += 1)
      if (N(e2[n], t[n]))
        return true;
  } else {
    if (!f(e2) || !f(t))
      return e2 !== t;
    {
      const n = Object.keys(e2).sort(), s = Object.keys(t).sort();
      if (N(n, s))
        return true;
      for (let r2 = 0;r2 < n.length; r2 += 1)
        if (N(e2[n[r2]], t[s[r2]]))
          return true;
    }
  }
}
function k(e2) {
  return e2.slice(2);
}
function x(e2) {
  return y(e2) ? e2 : a(e2) ? e2.reduce((e3, t) => e3.concat(y(t) ? [t] : x(t)), []) : v(e2) ? [] : [e2];
}
function D(e2) {
  return e2.attributes && !e2.getAttributeNames ? e2.attributes : e2.getAttributeNames().reduce((t, n) => (t[n.replace("data-", "@")] = e2[n] || e2.getAttribute(n), t), {});
}
function S(e2, t) {
  if (!d(e2)) {
    if (a(e2))
      return e2.map((e3) => S(e3, t));
    if (typeof NodeList != "undefined" && e2 instanceof NodeList)
      return S(e2.values(), t);
    if (e2.nodeType === 3)
      return e2.nodeValue;
    if (e2.nodeType === 1) {
      const n = [];
      return t && e2.childNodes.forEach((e3) => {
        n.push(S(e3, t));
      }), [e2.tagName.toLowerCase(), D(e2), n];
    }
    return e2.childNodes ? e2.childNodes.map((e3) => S(e3, t)) : S([...e2], t);
  }
}

class L {
  constructor() {
    this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e2) {
    L.valid(e2) ? e2.childNodes.forEach((e3) => {
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
    return e2 instanceof L;
  }
  static from(e2, t) {
    const n = new L;
    return t = t.filter((e3) => e3 !== null), n.vnode = t, t.forEach((t2) => {
      n.appendChild(e2(t2));
    }), n;
  }
}
var T = (e2) => e2.replace(/-([a-z])/g, (e3, t) => t.toUpperCase());
var U = (e2, t) => e2 && e2.removeChild(t);
var q = (e2, t) => {
  t && (L.valid(t) ? t.mount(e2.parentNode, e2) : e2.parentNode.insertBefore(t, e2)), U(e2.parentNode, e2);
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
    }), o = r2;
    return void e2._signalDisposers.set(t, () => {
      o(), i2();
    });
  }
  e2._signalDisposers.set(t, r2);
}
function ce(e2) {
  e2._signalDisposers && (e2._signalDisposers.forEach((e3) => e3()), e2._signalDisposers.clear());
}
function ae(e2, t, n, s) {
  Object.entries(t).forEach(([t2, o]) => {
    if (t2 !== "key" && t2 !== "open")
      if (t2 === "ref")
        e2.oncreate = (e3) => {
          o.current = e3;
        };
      else if (t2 === "@html")
        e2.innerHTML = o;
      else if (re(t2)) {
        if (o && typeof o == "object" && "value" in o) {
          oe(e2, t2, o);
          const n2 = e2.teardown;
          e2.teardown = () => {
            ce(e2), n2 && n2();
          };
        }
      } else if (ie(t2)) {
        if (o && typeof o == "object" && "value" in o) {
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
          })(e2, t2, o);
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
        o ? e2.classList.add(t2.substr(6)) : e2.classList.remove(t2.substr(6));
      else if (t2.indexOf("style:") === 0)
        e2.style[T(t2.substr(6))] = o;
      else {
        const c = t2.replace("@", "data-").replace(r, "");
        if (b(o)) {
          oe(e2, `${se}${c}`, o);
          const t3 = e2.teardown;
          return void (e2.teardown = () => {
            ce(e2), t3 && t3();
          });
        }
        let l2 = o !== true ? o : !!c.includes("-") || c;
        p(l2) && (l2 = u(s) && s(e2, c, l2) || l2, l2 = l2 !== e2 ? l2 : null, l2 = a(l2) ? l2.join("") : l2);
        const d2 = v(l2);
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
var ue = () => typeof Element != "undefined" && ("moveBefore" in Element.prototype);
function de(e2, t = (e3) => e3()) {
  const n = () => e2 && e2.remove();
  return t === false ? n() : Promise.resolve().then(() => t(n));
}
function fe(e2, t, n, s) {
  const r2 = pe(t, n, s);
  return le.valid(r2) ? r2.mount() : L.valid(r2) ? r2.mount(e2) : e2.appendChild(r2), r2;
}
function pe(e2, t, n) {
  if (d(e2))
    throw new Error(`Invalid vnode, given '${e2}'`);
  if (!y(e2))
    return a(e2) ? L.from((e3) => pe(e3, t, n), e2) : b(e2) ? function(e3) {
      const t2 = document.createTextNode(String(e3.peek())), n2 = ee(() => {
        t2.nodeValue = String(e3.value);
      });
      if (!n2._deps?.size && typeof e3.subscribe == "function") {
        const s2 = e3.subscribe(() => {
          t2.nodeValue = String(e3.peek());
        }), r3 = n2;
        return t2._signalDispose = () => {
          r3(), s2();
        }, t2;
      }
      return t2._signalDispose = n2, t2;
    }(e2) : h(e2) && document.createTextNode(String(e2)) || e2;
  if (!a(e2))
    return e2;
  if (n && n.tags && n.tags[e2[0]])
    return pe(n.tags[e2[0]](e2[1], k(e2), n), t, n);
  if (!y(e2))
    return L.from((e3) => pe(e3, t, n), e2);
  if (u(e2[0]))
    return pe(e2[0](e2[1], e2.slice(2)), t, n);
  if (e2[0] === "portal") {
    const [, s2, ...r3] = e2;
    return le.from((e3) => pe(e3, t, n), r3, s2.target);
  }
  const s = t || e2[0].indexOf("svg") === 0, [r2, i2, ...o] = e2;
  let c = s ? document.createElementNS("http://www.w3.org/2000/svg", r2) : document.createElement(r2);
  if (i2 && i2.key && c.setAttribute("data-key", i2.key), u(n) && (c = n(c, r2, i2, o) || c), u(c))
    return pe(c(), s, n);
  v(i2) || ae(c, i2, s, n), u(c.oncreate) && c.oncreate(c), u(c.enter) && c.enter(), c.remove = () => Promise.resolve().then(() => u(c.ondestroy) && c.ondestroy(c)).then(() => u(c.teardown) && c.teardown()).then(() => u(c.exit) && c.exit()).then(() => q(c)), o.forEach((e3) => {
    he(c, e3, s, n);
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
function he(e2, t, n, s) {
  return u(t) && (s = t, t = e2, e2 = undefined), u(n) && (s = n, n = null), d(t) && (t = e2, e2 = undefined), e2 || (e2 = document.body), typeof e2 == "string" && (e2 = document.querySelector(e2)), m(t) ? t.forEach((t2) => {
    he(e2, t2, n, s);
  }) : d(t) || (e2 = fe(e2, t, n, s)), e2;
}
async function be(e2, t, n, s, r2) {
  return h(n) || !y(t) || t[0] !== n[0] || e2.nodeType !== 1 ? function(e3, t2, n2, s2) {
    if (u(e3.onreplace))
      return e3.onreplace(t2, n2, s2);
    const r3 = pe(t2, n2, s2);
    return le.valid(r3) ? (r3.mount(), e3.remove()) : L.valid(r3) ? q(e3, r3) : e3.replaceWith(r3), r3;
  }(e2, n, s, r2) : (function(e3, t2, n2, s2, r3) {
    let i2;
    const o = Object.keys(t2).concat(Object.keys(n2)).reduce((e4, s3) => ((s3 in t2) && !(s3 in n2) ? (e4[s3] = null, i2 = true) : N(t2[s3], n2[s3]) && (e4[s3] = n2[s3], i2 = true), e4), {});
    return i2 && (Object.keys(t2).forEach((t3) => {
      if (re(t3) && !(t3 in n2) && e3._signalDisposers && e3._signalDisposers.has(t3) && (e3._signalDisposers.get(t3)(), e3._signalDisposers.delete(t3)), ie(t3) && !(t3 in n2) && e3._directiveDisposers && e3._directiveDisposers.has(t3)) {
        const n3 = e3._directiveDisposers.get(t3);
        n3._cleanup && n3._cleanup(), n3(), e3._directiveDisposers.delete(t3);
      }
    }), ae(e3, o, s2, r3)), i2;
  }(e2, t[1] || [], n[1] || [], s, r2) && (u(e2.onupdate) && await e2.onupdate(e2), u(e2.update) && await e2.update()), n[1] && n[1]["@html"] ? e2 : ge(e2, k(t), k(n), s, r2));
}
async function ge(e2, t, n, s, r2) {
  if (!t || y(t) && y(n))
    return be(e2, t, n, s, r2);
  if (y(t)) {
    for (;a(n) && n.length === 1; )
      n = n[0];
    return ge(e2, [t], n, s, r2);
  }
  return y(n) ? be(e2, t, n, s, r2) : (await async function(e3, t2, n2, s2) {
    const r3 = [], i2 = x(t2), o = Math.max(e3.childNodes.length, i2.length), c = Array.from(e3.childNodes), a2 = new Map, l2 = new Set;
    for (let e4 = 0;e4 < c.length; e4++) {
      const t3 = E(c[e4]);
      t3 && a2.set(t3, { el: c[e4], index: e4 });
    }
    let u2, f2, p2, h2 = 0;
    for (let t3 = 0;t3 < o; t3 += 1) {
      u2 !== h2 && (f2 = e3.childNodes[h2], p2 = S(f2), u2 = h2);
      const t4 = i2.shift(), n3 = _(t4);
      if (d(t4))
        r3.push({ rm: f2 }), u2 = null;
      else if (d(p2))
        if (n3 && a2.has(n3) && !l2.has(n3)) {
          const e4 = a2.get(n3).el, s3 = a2.get(n3).index;
          l2.add(n3), s3 < h2 ? (r3.push({ move: e4, target: f2 }), h2++) : (r3.push({ patch: S(e4), with: t4, target: e4 }), l2.add(n3));
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
      t3.rm && await de(t3.rm), d(t3.add) || fe(e3, t3.add, n2, s2), t3.move && (ue() ? e3.moveBefore(t3.move, t3.target) : e3.insertBefore(t3.move, t3.target)), d(t3.patch) || await ye(t3.target, t3.patch, t3.with, n2, s2);
  }(e2, [n], s, r2), e2);
}
async function ye(e2, t, n, s, r2) {
  if (L.valid(n)) {
    let t2 = e2;
    for (;n.childNodes.length > 0; ) {
      const s2 = n.childNodes.pop();
      e2.parentNode.insertBefore(s2, t2), t2 = s2;
    }
    return q(e2), t2;
  }
  return e2.nodeType === 3 && h(n) ? N(t, n) && (e2.nodeValue = String(n)) : e2 = await be(e2, t, n, s, r2), e2;
}
var me = (e2 = "div", t = null, ...n) => h(t) ? [e2, {}, [t].concat(n).filter((e3) => !d(e3))] : a(t) && !n.length ? [e2, {}, t] : [e2, t || {}, n];

// src/runtime/core.js
var SIGNAL = Symbol("10x.signal");
var currentEffect = null;
var globalRegistry = (() => {
  if (!globalThis.__10x_signals) {
    globalThis.__10x_signals = new Map;
  }
  return globalThis.__10x_signals;
})();
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
function untracked(fn) {
  const prev = currentEffect;
  currentEffect = null;
  try {
    return fn();
  } finally {
    currentEffect = prev;
  }
}

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
  let prev = null;
  let root = null;
  const remount = (next) => {
    target.innerHTML = "";
    untracked(() => he(target, next));
    root = y(next) ? target.firstChild : null;
    prev = next;
  };
  return effect(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      target.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked(() => he(target, next));
      root = y(next) ? target.firstChild : null;
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked(() => ge(root, prev, next)));
        root = node || root;
        prev = next;
      } catch (_2) {
        remount(next);
      }
    } else {
      remount(next);
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
  const remount = (next) => {
    outlet.innerHTML = "";
    untracked(() => he(outlet, next));
    root = y(next) ? outlet.firstChild : null;
    prev = next;
  };
  return effect(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      outlet.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked(() => he(outlet, next));
      root = y(next) ? outlet.firstChild : null;
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked(() => ge(root, prev, next)));
        root = node || root;
        prev = next;
      } catch (_2) {
        remount(next);
      }
    } else {
      remount(next);
    }
  });
}
export {
  style,
  renderShadow,
  render,
  on,
  me as h
};
