var global=globalThis;
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/wargs/dist/wargs.min.js
var require_wargs_min = __commonJS((exports, module) => {
  (function(e, r) {
    typeof exports == "object" && typeof module != "undefined" ? module.exports = r() : typeof define == "function" && define.amd ? define(r) : (e = e || self).wargs = r();
  })(exports, function() {
    const e = [], r = /$|[!-@[-`{-~][\s\S]*/g, n = Array.isArray, t = function(e2) {
      if (e2 === "")
        return "";
      if (e2 === "false")
        return false;
      const r2 = Number(e2);
      return 0 * r2 == 0 ? r2 : e2;
    }, i = function(r2, n2, t2) {
      let i2, o2, s2, f2, l2, a2, u2 = {};
      if (n2 !== undefined)
        for (l2 = 0, s2 = n2.length;l2 < s2; l2++)
          if (i2 = n2[l2], o2 = r2[i2], u2[i2] = t2, o2 === undefined)
            r2[i2] = e;
          else
            for (a2 = 0, f2 = o2.length;a2 < f2; a2++)
              u2[o2[a2]] = t2;
      return u2;
    }, o = function(e2, r2, t2, i2, o2) {
      let s2, f2, l2 = i2[r2], a2 = l2 === undefined ? -1 : l2.length;
      if (a2 >= 0 || o2 === undefined || o2(r2))
        for (f2 = e2[r2], f2 === undefined ? e2[r2] = t2 : n(f2) ? f2.push(t2) : e2[r2] = [f2, t2], s2 = 0;s2 < a2; s2++)
          e2[l2[s2]] = e2[r2];
    };
    var s = function(s2, f2) {
      let l2, a2, u2, c2, d2, p2 = (f2 = f2 || {}).unknown, g2 = function(e2) {
        let r2, t2, i2, o2, s3, f3, l3, a3 = {};
        for (r2 in e2)
          for (s3 = e2[r2], t2 = a3[r2] = n(s3) ? s3 : [s3], f3 = 0, o2 = t2.length;f3 < o2; f3++)
            for (i2 = a3[t2[f3]] = [r2], l3 = 0;l3 < o2; l3++)
              f3 !== l3 && i2.push(t2[l3]);
        return a3;
      }(f2.alias), h2 = i(g2, f2.string, ""), v2 = function(r2, n2) {
        let t2, i2, o2, s3, f3, l3 = {};
        for (t2 in n2)
          if (o2 = n2[t2], i2 = r2[t2], l3[t2] = o2, i2 === undefined)
            r2[t2] = e;
          else
            for (f3 = 0, s3 = i2.length;f3 < s3; f3++)
              l3[i2[f3]] = o2;
        return l3;
      }(g2, f2.default), y2 = i(g2, f2.boolean, false), b2 = f2.stopEarly, m2 = [], x2 = { _: m2 }, A2 = 0, O2 = 0, _ = s2.length;
      for (;A2 < _; A2++)
        if (a2 = s2[A2], a2[0] !== "-" || a2 === "-")
          if (b2)
            for (;A2 < _; )
              m2.push(s2[A2++]);
          else
            m2.push(a2);
        else if (a2 === "--")
          for (;++A2 < _; )
            m2.push(s2[A2]);
        else if (a2[1] === "-")
          u2 = a2.indexOf("=", 2), a2[2] === "n" && a2[3] === "o" && a2[4] === "-" ? (l2 = a2.slice(5, u2 >= 0 ? u2 : undefined), d2 = false) : u2 >= 0 ? (l2 = a2.slice(2, u2), d2 = y2[l2] !== undefined || (h2[l2] === undefined ? t(a2.slice(u2 + 1)) : a2.slice(u2 + 1))) : (l2 = a2.slice(2), d2 = y2[l2] !== undefined || (_ === A2 + 1 || s2[A2 + 1][0] === "-" ? h2[l2] === undefined || "" : h2[l2] === undefined ? t(s2[++A2]) : s2[++A2])), o(x2, l2, d2, g2, p2);
        else
          for (r.lastIndex = 2, c2 = r.exec(a2), u2 = c2.index, d2 = c2[0], O2 = 1;O2 < u2; O2++)
            o(x2, l2 = a2[O2], O2 + 1 < u2 ? h2[l2] === undefined || a2.substring(O2 + 1, O2 = u2) + d2 : d2 === "" ? _ === A2 + 1 || s2[A2 + 1][0] === "-" ? h2[l2] === undefined || "" : y2[l2] !== undefined || (h2[l2] === undefined ? t(s2[++A2]) : s2[++A2]) : y2[l2] !== undefined || (h2[l2] === undefined ? t(d2) : d2), g2, p2);
      for (l2 in v2)
        x2[l2] === undefined && (x2[l2] = v2[l2]);
      for (l2 in y2)
        x2[l2] === undefined && (x2[l2] = false);
      for (l2 in h2)
        x2[l2] === undefined && (x2[l2] = "");
      return x2;
    };
    const f = (e2) => `__Symbol@@${e2}__`, l = f("QUOTE"), a = f("APOS"), u = f("SPA"), c = /-(\w)/g, d = /^((?!\d)[-~+.\w]+)([=:])(.+?)?$/, p = /(["'])(?:(?!\1).)*\1/, g = ['"', "'", " "], h = [/\\"/g, /\\'/g, /\\ /g], v = [l, a, u], y = [l, a, u].map((e2) => new RegExp(e2, "g"));
    function b(e2) {
      return y.reduce((e3, r2, n2) => e3.replace(r2, g[n2]), e2);
    }
    function m(e2, r2) {
      for (;p.test(e2); ) {
        const r3 = e2.match(p), n2 = r3[0].substr(1, r3[0].length - 2);
        e2 = e2.replace(r3[0], g.reduce((e3, r4, n3) => e3.replace(r4, v[n3]), n2));
      }
      if (r2)
        for (;e2.indexOf(" ") > -1; )
          e2 = g.reduce((e3, r3, n2) => e3.replace(r3, v[n2]), e2);
      return e2.split(/\s+/);
    }
    function x(e2, r2) {
      return typeof r2 == "function" ? r2(e2) : e2;
    }
    function A(e2) {
      return e2.replace(c, (e3, r2) => r2.toUpperCase());
    }
    function O(e2, r2) {
      return typeof e2 == "string" ? !r2 && e2.indexOf("--") !== 0 || e2.indexOf("no-") !== -1 ? e2 : r2 ? A(e2) : `--${A(e2.substr(2))}` : e2.map((e3) => O(e3, r2));
    }
    return (e2, r2, n2) => {
      if (typeof (r2 = r2 || {}) == "function" && (n2 = r2, r2 = {}), r2.format && (n2 = r2.format, delete r2.format), !Array.isArray(e2)) {
        let r3;
        e2 = function(e3) {
          return h.reduce((e4, r4, n3) => e4.replace(r4, v[n3]), e3);
        }(String(e2 || ""));
        do {
          r3 = e2.match(p), r3 && (e2 = e2.replace(r3[0], m(r3[0], true)));
        } while (r3);
        e2 = e2.trim().split(/\s+/).map(b).filter((e3) => e3);
      }
      const t2 = e2.indexOf("--"), i2 = [];
      t2 > -1 && (e2.slice(t2 + 1).forEach((e3) => {
        i2.push(x(e3, n2));
      }), e2.splice(t2 + 1, e2.length)), typeof r2.boolean == "string" && (r2.boolean = r2.boolean.split("")), typeof r2.string == "string" && (r2.string = r2.string.split("")), r2.boolean && (r2.boolean = O(r2.boolean, true)), r2.string && (r2.string = O(r2.string, true)), r2.alias && Object.keys(r2.alias).forEach((e3) => {
        r2.alias[e3] = O(r2.alias[e3], true);
      });
      const o2 = s(O(e2), r2), f2 = o2._.slice(), l2 = {}, a2 = {};
      return delete o2._, Object.keys(o2).forEach((e3) => {
        const t3 = o2[e3];
        e3.indexOf("-") !== -1 && (delete o2[e3], e3 = A(e3)), r2.alias && r2.alias[e3] && r2.alias[e3].indexOf("no-") === 0 && (o2[r2.alias[e3].substr(3)] = !t3, o2[e3] = !t3), Array.isArray(t3) && (o2[e3] = t3.map((e4) => x(e4, n2))), typeof t3 == "string" && (t3.charAt() === "=" ? o2[e3] = x(t3.substr(1), n2) : o2[e3] = x(t3, n2));
      }), { _: f2.reduce((e3, r3) => {
        const t3 = r3.match(d);
        return t3 ? t3[2] === "=" ? l2[t3[1]] = x(t3[3] || "", n2) : a2[t3[1]] ? (Array.isArray(a2[t3[1]]) || (a2[t3[1]] = [a2[t3[1]]]), a2[t3[1]].push(x(t3[3] || "", n2))) : a2[t3[1]] = x(t3[3] || "", n2) : e3.push(x(r3, n2)), e3;
      }, []), raw: i2, data: l2, flags: o2, params: a2 };
    };
  });
});

// src/runtime/proc.js
var import_wargs = __toESM(require_wargs_min(), 1);
var argv = process.argv.slice(2);
function getopts(spec = {}) {
  return import_wargs.default(argv, spec);
}
function exit(code = 0) {
  process.exit(code);
}
export {
  getopts,
  exit,
  argv
};
