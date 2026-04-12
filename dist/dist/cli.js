var global=globalThis;
import { createRequire } from "node:module";
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/lib/ansi.js
function style(open, close) {
  return (value) => `\x1B[${open}m${value}\x1B[${close}m`;
}
var CODES, ansi, names, ansi_default;
var init_ansi = __esm(() => {
  CODES = {
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
    redBright: [91, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    cyanBright: [96, 39],
    bgRedBright: [101, 49]
  };
  ansi = {};
  names = Object.keys(CODES);
  names.forEach((name) => {
    const [open, close] = CODES[name];
    ansi[name] = style(open, close);
  });
  names.forEach((first) => {
    names.forEach((second) => {
      ansi[first][second] = (value) => ansi[first](ansi[second](value));
    });
  });
  ansi_default = ansi;
});

// node_modules/wargs/dist/wargs.js
var require_wargs = __commonJS((exports, module) => {
  var EMPTYARR = [];
  var SHORTSPLIT = /$|[!-@[-`{-~][\s\S]*/g;
  var isArray = Array.isArray;
  var parseValue = function(e) {
    if (e === "")
      return "";
    if (e === "false")
      return false;
    const a = Number(e);
    return 0 * a == 0 ? a : e;
  };
  var parseAlias = function(e) {
    let a, t, r, s, i, o, n, l = {};
    for (a in e)
      for (i = e[a], t = l[a] = isArray(i) ? i : [i], o = 0, s = t.length;o < s; o++)
        for (r = l[t[o]] = [a], n = 0;n < s; n++)
          o !== n && r.push(t[n]);
    return l;
  };
  var parseDefault = function(e, a) {
    let t, r, s, i, o, n = {};
    for (t in a)
      if (s = a[t], r = e[t], n[t] = s, r === undefined)
        e[t] = EMPTYARR;
      else
        for (o = 0, i = r.length;o < i; o++)
          n[r[o]] = s;
    return n;
  };
  var parseOptions = function(e, a, t) {
    let r, s, i, o, n, l, _ = {};
    if (a !== undefined)
      for (n = 0, i = a.length;n < i; n++)
        if (r = a[n], s = e[r], _[r] = t, s === undefined)
          e[r] = EMPTYARR;
        else
          for (l = 0, o = s.length;l < o; l++)
            _[s[l]] = t;
    return _;
  };
  var write = function(e, a, t, r, s) {
    let i, o, n = r[a], l = n === undefined ? -1 : n.length;
    if (l >= 0 || s === undefined || s(a))
      for (o = e[a], o === undefined ? e[a] = t : isArray(o) ? o.push(t) : e[a] = [o, t], i = 0;i < l; i++)
        e[n[i]] = e[a];
  };
  var getopts = function(e, a) {
    let t, r, s, i, o, n = (a = a || {}).unknown, l = parseAlias(a.alias), _ = parseOptions(l, a.string, ""), u = parseDefault(l, a.default), c = parseOptions(l, a.boolean, false), f = a.stopEarly, p = [], E = { _: p }, A = 0, d = 0, S = e.length;
    for (;A < S; A++)
      if (r = e[A], r[0] !== "-" || r === "-")
        if (f)
          for (;A < S; )
            p.push(e[A++]);
        else
          p.push(r);
      else if (r === "--")
        for (;++A < S; )
          p.push(e[A]);
      else if (r[1] === "-")
        s = r.indexOf("=", 2), r[2] === "n" && r[3] === "o" && r[4] === "-" ? (t = r.slice(5, s >= 0 ? s : undefined), o = false) : s >= 0 ? (t = r.slice(2, s), o = c[t] !== undefined || (_[t] === undefined ? parseValue(r.slice(s + 1)) : r.slice(s + 1))) : (t = r.slice(2), o = c[t] !== undefined || (S === A + 1 || e[A + 1][0] === "-" ? _[t] === undefined || "" : _[t] === undefined ? parseValue(e[++A]) : e[++A])), write(E, t, o, l, n);
      else
        for (SHORTSPLIT.lastIndex = 2, i = SHORTSPLIT.exec(r), s = i.index, o = i[0], d = 1;d < s; d++)
          write(E, t = r[d], d + 1 < s ? _[t] === undefined || r.substring(d + 1, d = s) + o : o === "" ? S === A + 1 || e[A + 1][0] === "-" ? _[t] === undefined || "" : c[t] !== undefined || (_[t] === undefined ? parseValue(e[++A]) : e[++A]) : c[t] !== undefined || (_[t] === undefined ? parseValue(o) : o), l, n);
    for (t in u)
      E[t] === undefined && (E[t] = u[t]);
    for (t in c)
      E[t] === undefined && (E[t] = false);
    for (t in _)
      E[t] === undefined && (E[t] = "");
    return E;
  };
  var getopts_1 = getopts;
  var $$ = (e) => `__Symbol@@${e}__`;
  var __QUOTE__ = $$("QUOTE");
  var __APOS__ = $$("APOS");
  var __SPA__ = $$("SPA");
  var RE_CAMEL_CASE = /-(\w)/g;
  var RE_MATCH_KEYVAL = /^((?!\d)[-~+.\w]+)([=:])(.+?)?$/;
  var RE_MATCH_QUOTES = /(["'])(?:(?!\1).)*\1/;
  var RE_SPECIAL_CHARS = ['"', "'", " "];
  var RE_ESCAPE_CHARS = [/\\"/g, /\\'/g, /\\ /g];
  var RE_QUOTED_CHARS = [__QUOTE__, __APOS__, __SPA__];
  var RE_UNESCAPE_CHARS = [__QUOTE__, __APOS__, __SPA__].map((e) => new RegExp(e, "g"));
  function escape(e) {
    return RE_ESCAPE_CHARS.reduce((e2, a, t) => e2.replace(a, RE_QUOTED_CHARS[t]), e);
  }
  function unescape(e) {
    return RE_UNESCAPE_CHARS.reduce((e2, a, t) => e2.replace(a, RE_SPECIAL_CHARS[t]), e);
  }
  function unquote(e, a) {
    for (;RE_MATCH_QUOTES.test(e); ) {
      const a2 = e.match(RE_MATCH_QUOTES), t = a2[0].substr(1, a2[0].length - 2);
      e = e.replace(a2[0], RE_SPECIAL_CHARS.reduce((e2, a3, t2) => e2.replace(a3, RE_QUOTED_CHARS[t2]), t));
    }
    if (a)
      for (;e.indexOf(" ") > -1; )
        e = RE_SPECIAL_CHARS.reduce((e2, a2, t) => e2.replace(a2, RE_QUOTED_CHARS[t]), e);
    return e.split(/\s+/);
  }
  function evaluate(e, a) {
    return typeof a == "function" ? a(e) : e;
  }
  function camelcase(e) {
    return e.replace(RE_CAMEL_CASE, (e2, a) => a.toUpperCase());
  }
  function autocamelcase(e, a) {
    return typeof e == "string" ? !a && e.indexOf("--") !== 0 || e.indexOf("no-") !== -1 ? e : a ? camelcase(e) : `--${camelcase(e.substr(2))}` : e.map((e2) => autocamelcase(e2, a));
  }
  var lib = (e, a, t) => {
    if (typeof (a = a || {}) == "function" && (t = a, a = {}), a.format && (t = a.format, delete a.format), !Array.isArray(e)) {
      let a2;
      e = escape(String(e || ""));
      do {
        a2 = e.match(RE_MATCH_QUOTES), a2 && (e = e.replace(a2[0], unquote(a2[0], true)));
      } while (a2);
      e = e.trim().split(/\s+/).map(unescape).filter((e2) => e2);
    }
    const r = e.indexOf("--"), s = [];
    r > -1 && (e.slice(r + 1).forEach((e2) => {
      s.push(evaluate(e2, t));
    }), e.splice(r + 1, e.length)), typeof a.boolean == "string" && (a.boolean = a.boolean.split("")), typeof a.string == "string" && (a.string = a.string.split("")), a.boolean && (a.boolean = autocamelcase(a.boolean, true)), a.string && (a.string = autocamelcase(a.string, true)), a.alias && Object.keys(a.alias).forEach((e2) => {
      a.alias[e2] = autocamelcase(a.alias[e2], true);
    });
    const i = getopts_1(autocamelcase(e), a), o = i._.slice(), n = {}, l = {};
    return delete i._, Object.keys(i).forEach((e2) => {
      const r2 = i[e2];
      e2.indexOf("-") !== -1 && (delete i[e2], e2 = camelcase(e2)), a.alias && a.alias[e2] && a.alias[e2].indexOf("no-") === 0 && (i[a.alias[e2].substr(3)] = !r2, i[e2] = !r2), Array.isArray(r2) && (i[e2] = r2.map((e3) => evaluate(e3, t))), typeof r2 == "string" && (r2.charAt() === "=" ? i[e2] = evaluate(r2.substr(1), t) : i[e2] = evaluate(r2, t));
    }), { _: o.reduce((e2, a2) => {
      const r2 = a2.match(RE_MATCH_KEYVAL);
      return r2 ? r2[2] === "=" ? n[r2[1]] = evaluate(r2[3] || "", t) : l[r2[1]] ? (Array.isArray(l[r2[1]]) || (l[r2[1]] = [l[r2[1]]]), l[r2[1]].push(evaluate(r2[3] || "", t))) : l[r2[1]] = evaluate(r2[3] || "", t) : e2.push(evaluate(a2, t)), e2;
    }, []), raw: s, data: n, flags: i, params: l };
  };
  module.exports = lib;
});

// node_modules/kleur/index.js
var require_kleur = __commonJS((exports, module) => {
  var { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;
  var $ = {
    enabled: !NODE_DISABLE_COLORS && TERM !== "dumb" && FORCE_COLOR !== "0",
    reset: init(0, 0),
    bold: init(1, 22),
    dim: init(2, 22),
    italic: init(3, 23),
    underline: init(4, 24),
    inverse: init(7, 27),
    hidden: init(8, 28),
    strikethrough: init(9, 29),
    black: init(30, 39),
    red: init(31, 39),
    green: init(32, 39),
    yellow: init(33, 39),
    blue: init(34, 39),
    magenta: init(35, 39),
    cyan: init(36, 39),
    white: init(37, 39),
    gray: init(90, 39),
    grey: init(90, 39),
    bgBlack: init(40, 49),
    bgRed: init(41, 49),
    bgGreen: init(42, 49),
    bgYellow: init(43, 49),
    bgBlue: init(44, 49),
    bgMagenta: init(45, 49),
    bgCyan: init(46, 49),
    bgWhite: init(47, 49)
  };
  function run(arr, str) {
    let i = 0, tmp, beg = "", end = "";
    for (;i < arr.length; i++) {
      tmp = arr[i];
      beg += tmp.open;
      end += tmp.close;
      if (str.includes(tmp.close)) {
        str = str.replace(tmp.rgx, tmp.close + tmp.open);
      }
    }
    return beg + str + end;
  }
  function chain(has, keys) {
    let ctx = { has, keys };
    ctx.reset = $.reset.bind(ctx);
    ctx.bold = $.bold.bind(ctx);
    ctx.dim = $.dim.bind(ctx);
    ctx.italic = $.italic.bind(ctx);
    ctx.underline = $.underline.bind(ctx);
    ctx.inverse = $.inverse.bind(ctx);
    ctx.hidden = $.hidden.bind(ctx);
    ctx.strikethrough = $.strikethrough.bind(ctx);
    ctx.black = $.black.bind(ctx);
    ctx.red = $.red.bind(ctx);
    ctx.green = $.green.bind(ctx);
    ctx.yellow = $.yellow.bind(ctx);
    ctx.blue = $.blue.bind(ctx);
    ctx.magenta = $.magenta.bind(ctx);
    ctx.cyan = $.cyan.bind(ctx);
    ctx.white = $.white.bind(ctx);
    ctx.gray = $.gray.bind(ctx);
    ctx.grey = $.grey.bind(ctx);
    ctx.bgBlack = $.bgBlack.bind(ctx);
    ctx.bgRed = $.bgRed.bind(ctx);
    ctx.bgGreen = $.bgGreen.bind(ctx);
    ctx.bgYellow = $.bgYellow.bind(ctx);
    ctx.bgBlue = $.bgBlue.bind(ctx);
    ctx.bgMagenta = $.bgMagenta.bind(ctx);
    ctx.bgCyan = $.bgCyan.bind(ctx);
    ctx.bgWhite = $.bgWhite.bind(ctx);
    return ctx;
  }
  function init(open, close) {
    let blk = {
      open: `\x1B[${open}m`,
      close: `\x1B[${close}m`,
      rgx: new RegExp(`\\x1b\\[${close}m`, "g")
    };
    return function(txt) {
      if (this !== undefined && this.has !== undefined) {
        this.has.includes(open) || (this.has.push(open), this.keys.push(blk));
        return txt === undefined ? this : $.enabled ? run(this.keys, txt + "") : txt + "";
      }
      return txt === undefined ? chain([open], [blk]) : $.enabled ? run([blk], txt + "") : txt + "";
    };
  }
  module.exports = $;
});

// node_modules/prompts/dist/util/action.js
var require_action = __commonJS((exports, module) => {
  module.exports = (key, isSelect) => {
    if (key.meta)
      return;
    if (key.ctrl) {
      if (key.name === "a")
        return "first";
      if (key.name === "c")
        return "abort";
      if (key.name === "d")
        return "abort";
      if (key.name === "e")
        return "last";
      if (key.name === "g")
        return "reset";
    }
    if (isSelect) {
      if (key.name === "j")
        return "down";
      if (key.name === "k")
        return "up";
    }
    if (key.name === "return")
      return "submit";
    if (key.name === "enter")
      return "submit";
    if (key.name === "backspace")
      return "delete";
    if (key.name === "delete")
      return "deleteForward";
    if (key.name === "abort")
      return "abort";
    if (key.name === "escape")
      return "abort";
    if (key.name === "tab")
      return "next";
    if (key.name === "pagedown")
      return "nextPage";
    if (key.name === "pageup")
      return "prevPage";
    if (key.name === "home")
      return "home";
    if (key.name === "end")
      return "end";
    if (key.name === "up")
      return "up";
    if (key.name === "down")
      return "down";
    if (key.name === "right")
      return "right";
    if (key.name === "left")
      return "left";
    return false;
  };
});

// node_modules/prompts/dist/util/strip.js
var require_strip = __commonJS((exports, module) => {
  module.exports = (str) => {
    const pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|");
    const RGX = new RegExp(pattern, "g");
    return typeof str === "string" ? str.replace(RGX, "") : str;
  };
});

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC = "\x1B";
  var CSI = `${ESC}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI}${x + 1}G`;
      return `${CSI}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI}${-x}D`;
      else if (x > 0)
        ret += `${CSI}${x}C`;
      if (y < 0)
        ret += `${CSI}${-y}A`;
      else if (y > 0)
        ret += `${CSI}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI}${count}A`,
    down: (count = 1) => `${CSI}${count}B`,
    forward: (count = 1) => `${CSI}${count}C`,
    backward: (count = 1) => `${CSI}${count}D`,
    nextLine: (count = 1) => `${CSI}E`.repeat(count),
    prevLine: (count = 1) => `${CSI}F`.repeat(count),
    left: `${CSI}G`,
    hide: `${CSI}?25l`,
    show: `${CSI}?25h`,
    save: `${ESC}7`,
    restore: `${ESC}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI}S`.repeat(count),
    down: (count = 1) => `${CSI}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI}2J`,
    up: (count = 1) => `${CSI}1J`.repeat(count),
    down: (count = 1) => `${CSI}J`.repeat(count),
    line: `${CSI}2K`,
    lineEnd: `${CSI}K`,
    lineStart: `${CSI}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/prompts/dist/util/clear.js
var require_clear = __commonJS((exports, module) => {
  var strip = require_strip();
  var _require = require_src();
  var erase = _require.erase;
  var cursor = _require.cursor;
  var width = (str) => [...strip(str)].length;
  module.exports = function(prompt, perLine = process.stdout.columns) {
    if (!perLine)
      return erase.line + cursor.to(0);
    let rows = 0;
    const lines = prompt.split(/\r?\n/);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
      for (var _iterator = lines[Symbol.iterator](), _step;!(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        let line = _step.value;
        rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return erase.lines(rows);
  };
});

// node_modules/prompts/dist/util/figures.js
var require_figures = __commonJS((exports, module) => {
  var main = {
    arrowUp: "↑",
    arrowDown: "↓",
    arrowLeft: "←",
    arrowRight: "→",
    radioOn: "◉",
    radioOff: "◯",
    tick: "✔",
    cross: "✖",
    ellipsis: "…",
    pointerSmall: "›",
    line: "─",
    pointer: "❯"
  };
  var win = {
    arrowUp: main.arrowUp,
    arrowDown: main.arrowDown,
    arrowLeft: main.arrowLeft,
    arrowRight: main.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "√",
    cross: "×",
    ellipsis: "...",
    pointerSmall: "»",
    line: "─",
    pointer: ">"
  };
  var figures = process.platform === "win32" ? win : main;
  module.exports = figures;
});

// node_modules/prompts/dist/util/style.js
var require_style = __commonJS((exports, module) => {
  var c = require_kleur();
  var figures = require_figures();
  var styles = Object.freeze({
    password: {
      scale: 1,
      render: (input) => "*".repeat(input.length)
    },
    emoji: {
      scale: 2,
      render: (input) => "\uD83D\uDE03".repeat(input.length)
    },
    invisible: {
      scale: 0,
      render: (input) => ""
    },
    default: {
      scale: 1,
      render: (input) => `${input}`
    }
  });
  var render = (type) => styles[type] || styles.default;
  var symbols = Object.freeze({
    aborted: c.red(figures.cross),
    done: c.green(figures.tick),
    default: c.cyan("?")
  });
  var symbol = (done, aborted) => aborted ? symbols.aborted : done ? symbols.done : symbols.default;
  var delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
  var item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
  module.exports = {
    styles,
    render,
    symbols,
    symbol,
    delimiter,
    item
  };
});

// node_modules/prompts/dist/util/lines.js
var require_lines = __commonJS((exports, module) => {
  var strip = require_strip();
  module.exports = function(msg, perLine = process.stdout.columns) {
    let lines = String(strip(msg) || "").split(/\r?\n/);
    if (!perLine)
      return lines.length;
    return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
  };
});

// node_modules/prompts/dist/util/wrap.js
var require_wrap = __commonJS((exports, module) => {
  module.exports = (msg, opts = {}) => {
    const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
    const width = opts.width || process.stdout.columns;
    return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
      if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
        arr[arr.length - 1] += ` ${w}`;
      else
        arr.push(`${tab}${w}`);
      return arr;
    }, [tab]).join(`
`)).join(`
`);
  };
});

// node_modules/prompts/dist/util/entriesToDisplay.js
var require_entriesToDisplay = __commonJS((exports, module) => {
  module.exports = (cursor, total, maxVisible) => {
    maxVisible = maxVisible || total;
    let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
    if (startIndex < 0)
      startIndex = 0;
    let endIndex = Math.min(startIndex + maxVisible, total);
    return {
      startIndex,
      endIndex
    };
  };
});

// node_modules/prompts/dist/util/index.js
var require_util = __commonJS((exports, module) => {
  module.exports = {
    action: require_action(),
    clear: require_clear(),
    style: require_style(),
    strip: require_strip(),
    figures: require_figures(),
    lines: require_lines(),
    wrap: require_wrap(),
    entriesToDisplay: require_entriesToDisplay()
  };
});

// node_modules/prompts/dist/elements/prompt.js
var require_prompt = __commonJS((exports, module) => {
  var readline = __require("readline");
  var _require = require_util();
  var action = _require.action;
  var EventEmitter = __require("events");
  var _require2 = require_src();
  var beep = _require2.beep;
  var cursor = _require2.cursor;
  var color = require_kleur();

  class Prompt extends EventEmitter {
    constructor(opts = {}) {
      super();
      this.firstRender = true;
      this.in = opts.stdin || process.stdin;
      this.out = opts.stdout || process.stdout;
      this.onRender = (opts.onRender || (() => {
        return;
      })).bind(this);
      const rl = readline.createInterface(this.in);
      readline.emitKeypressEvents(this.in, rl);
      if (this.in.isTTY)
        this.in.setRawMode(true);
      const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
      const keypress = (str, key) => {
        let a = action(key, isSelect);
        if (a === false) {
          this._ && this._(str, key);
        } else if (typeof this[a] === "function") {
          this[a](key);
        } else {
          this.bell();
        }
      };
      this.close = () => {
        this.out.write(cursor.show);
        this.in.removeListener("keypress", keypress);
        if (this.in.isTTY)
          this.in.setRawMode(false);
        rl.close();
        this.emit(this.aborted ? "abort" : "submit", this.value);
        this.closed = true;
      };
      this.in.on("keypress", keypress);
    }
    fire() {
      this.emit("state", {
        value: this.value,
        aborted: !!this.aborted
      });
    }
    bell() {
      this.out.write(beep);
    }
    render() {
      this.onRender(color);
      if (this.firstRender)
        this.firstRender = false;
    }
  }
  module.exports = Prompt;
});

// node_modules/prompts/dist/elements/text.js
var require_text = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_src();
  var erase = _require.erase;
  var cursor = _require.cursor;
  var _require2 = require_util();
  var style2 = _require2.style;
  var clear = _require2.clear;
  var lines = _require2.lines;
  var figures = _require2.figures;

  class TextPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style2.render(opts.style);
      this.scale = this.transform.scale;
      this.msg = opts.message;
      this.initial = opts.initial || ``;
      this.validator = opts.validate || (() => true);
      this.value = ``;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.cursor = Number(!!this.initial);
      this.clear = clear(``);
      this.render();
    }
    set value(v) {
      if (!v && this.initial) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(this.initial));
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(v);
      }
      this._value = v;
      this.fire();
    }
    get value() {
      return this._value;
    }
    reset() {
      this.value = ``;
      this.cursor = Number(!!this.initial);
      this.fire();
      this.render();
    }
    abort() {
      this.value = this.value || this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.red = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    validate() {
      var _this = this;
      return _asyncToGenerator(function* () {
        let valid = yield _this.validator(_this.value);
        if (typeof valid === `string`) {
          _this.errorMsg = valid;
          valid = false;
        }
        _this.error = !valid;
      })();
    }
    submit() {
      var _this2 = this;
      return _asyncToGenerator(function* () {
        _this2.value = _this2.value || _this2.initial;
        yield _this2.validate();
        if (_this2.error) {
          _this2.red = true;
          _this2.fire();
          _this2.render();
          return;
        }
        _this2.done = true;
        _this2.aborted = false;
        _this2.fire();
        _this2.render();
        _this2.out.write(`
`);
        _this2.close();
      })();
    }
    next() {
      if (!this.placeholder)
        return this.bell();
      this.value = this.initial;
      this.cursor = this.rendered.length;
      this.fire();
      this.render();
    }
    moveCursor(n) {
      if (this.placeholder)
        return;
      this.cursor = this.cursor + n;
    }
    _(c, key) {
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${c}${s2}`;
      this.red = false;
      this.cursor = this.placeholder ? 0 : s1.length + 1;
      this.render();
    }
    delete() {
      if (this.cursor === 0)
        return this.bell();
      let s1 = this.value.slice(0, this.cursor - 1);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${s2}`;
      this.red = false;
      this.moveCursor(-1);
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor + 1);
      this.value = `${s1}${s2}`;
      this.red = false;
      this.render();
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length;
      this.render();
    }
    left() {
      if (this.cursor <= 0 || this.placeholder)
        return this.bell();
      this.moveCursor(-1);
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      this.moveCursor(1);
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError) - 1) + clear(this.outputError));
        this.out.write(clear(this.outputText));
      }
      super.render();
      this.outputError = "";
      this.outputText = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(this.done), this.red ? color.red(this.rendered) : this.rendered].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`
`).reduce((a, l, i) => a + `
${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
    }
  }
  module.exports = TextPrompt;
});

// node_modules/prompts/dist/elements/select.js
var require_select = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style2 = _require.style;
  var clear = _require.clear;
  var figures = _require.figures;
  var wrap = _require.wrap;
  var entriesToDisplay = _require.entriesToDisplay;
  var _require2 = require_src();
  var cursor = _require2.cursor;

  class SelectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
      this.warn = opts.warn || "- This option is disabled";
      this.cursor = opts.initial || 0;
      this.choices = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = {
            title: ch,
            value: idx
          };
        return {
          title: ch && (ch.title || ch.value || ch),
          value: ch && (ch.value === undefined ? idx : ch.value),
          description: ch && ch.description,
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = (this.choices[this.cursor] || {}).value;
      this.clear = clear("");
      this.render();
    }
    moveCursor(n) {
      this.cursor = n;
      this.value = this.choices[n].value;
      this.fire();
    }
    reset() {
      this.moveCursor(0);
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      if (!this.selection.disabled) {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write(`
`);
        this.close();
      } else
        this.bell();
    }
    first() {
      this.moveCursor(0);
      this.render();
    }
    last() {
      this.moveCursor(this.choices.length - 1);
      this.render();
    }
    up() {
      if (this.cursor === 0)
        return this.bell();
      this.moveCursor(this.cursor - 1);
      this.render();
    }
    down() {
      if (this.cursor === this.choices.length - 1)
        return this.bell();
      this.moveCursor(this.cursor + 1);
      this.render();
    }
    next() {
      this.moveCursor((this.cursor + 1) % this.choices.length);
      this.render();
    }
    _(c, key) {
      if (c === " ")
        return this.submit();
    }
    get selection() {
      return this.choices[this.cursor];
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
      this.outputText = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(false), this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)].join(" ");
      if (!this.done) {
        this.outputText += `
`;
        for (let i = startIndex;i < endIndex; i++) {
          let title, prefix, desc = "", v = this.choices[i];
          if (i === startIndex && startIndex > 0) {
            prefix = figures.arrowUp;
          } else if (i === endIndex - 1 && endIndex < this.choices.length) {
            prefix = figures.arrowDown;
          } else {
            prefix = " ";
          }
          if (v.disabled) {
            title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
            prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
          } else {
            title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
            prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
            if (v.description && this.cursor === i) {
              desc = ` - ${v.description}`;
              if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                desc = `
` + wrap(v.description, {
                  margin: 3,
                  width: this.out.columns
                });
              }
            }
          }
          this.outputText += `${prefix} ${title}${color.gray(desc)}
`;
        }
      }
      this.out.write(this.outputText);
    }
  }
  module.exports = SelectPrompt;
});

// node_modules/prompts/dist/elements/toggle.js
var require_toggle = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style2 = _require.style;
  var clear = _require.clear;
  var _require2 = require_src();
  var cursor = _require2.cursor;
  var erase = _require2.erase;

  class TogglePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = !!opts.initial;
      this.active = opts.active || "on";
      this.inactive = opts.inactive || "off";
      this.initialValue = this.value;
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    deactivate() {
      if (this.value === false)
        return this.bell();
      this.value = false;
      this.render();
    }
    activate() {
      if (this.value === true)
        return this.bell();
      this.value = true;
      this.render();
    }
    delete() {
      this.deactivate();
    }
    left() {
      this.deactivate();
    }
    right() {
      this.activate();
    }
    down() {
      this.deactivate();
    }
    up() {
      this.activate();
    }
    next() {
      this.value = !this.value;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.value = !this.value;
      } else if (c === "1") {
        this.value = true;
      } else if (c === "0") {
        this.value = false;
      } else
        return this.bell();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      this.outputText = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(this.done), this.value ? this.inactive : color.cyan().underline(this.inactive), color.gray("/"), this.value ? color.cyan().underline(this.active) : this.active].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = TogglePrompt;
});

// node_modules/prompts/dist/dateparts/datepart.js
var require_datepart = __commonJS((exports, module) => {
  class DatePart {
    constructor({
      token,
      date,
      parts,
      locales
    }) {
      this.token = token;
      this.date = date || new Date;
      this.parts = parts || [this];
      this.locales = locales || {};
    }
    up() {}
    down() {}
    next() {
      const currentIdx = this.parts.indexOf(this);
      return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    setTo(val) {}
    prev() {
      let parts = [].concat(this.parts).reverse();
      const currentIdx = parts.indexOf(this);
      return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    toString() {
      return String(this.date);
    }
  }
  module.exports = DatePart;
});

// node_modules/prompts/dist/dateparts/meridiem.js
var require_meridiem = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Meridiem extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours((this.date.getHours() + 12) % 24);
    }
    down() {
      this.up();
    }
    toString() {
      let meridiem = this.date.getHours() > 12 ? "pm" : "am";
      return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
    }
  }
  module.exports = Meridiem;
});

// node_modules/prompts/dist/dateparts/day.js
var require_day = __commonJS((exports, module) => {
  var DatePart = require_datepart();
  var pos = (n) => {
    n = n % 10;
    return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  };

  class Day extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setDate(this.date.getDate() + 1);
    }
    down() {
      this.date.setDate(this.date.getDate() - 1);
    }
    setTo(val) {
      this.date.setDate(parseInt(val.substr(-2)));
    }
    toString() {
      let date = this.date.getDate();
      let day = this.date.getDay();
      return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
    }
  }
  module.exports = Day;
});

// node_modules/prompts/dist/dateparts/hours.js
var require_hours = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Hours extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours(this.date.getHours() + 1);
    }
    down() {
      this.date.setHours(this.date.getHours() - 1);
    }
    setTo(val) {
      this.date.setHours(parseInt(val.substr(-2)));
    }
    toString() {
      let hours = this.date.getHours();
      if (/h/.test(this.token))
        hours = hours % 12 || 12;
      return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
    }
  }
  module.exports = Hours;
});

// node_modules/prompts/dist/dateparts/milliseconds.js
var require_milliseconds = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Milliseconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }
    down() {
      this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }
    setTo(val) {
      this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
    }
    toString() {
      return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
    }
  }
  module.exports = Milliseconds;
});

// node_modules/prompts/dist/dateparts/minutes.js
var require_minutes = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Minutes extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMinutes(this.date.getMinutes() + 1);
    }
    down() {
      this.date.setMinutes(this.date.getMinutes() - 1);
    }
    setTo(val) {
      this.date.setMinutes(parseInt(val.substr(-2)));
    }
    toString() {
      let m = this.date.getMinutes();
      return this.token.length > 1 ? String(m).padStart(2, "0") : m;
    }
  }
  module.exports = Minutes;
});

// node_modules/prompts/dist/dateparts/month.js
var require_month = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Month extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMonth(this.date.getMonth() + 1);
    }
    down() {
      this.date.setMonth(this.date.getMonth() - 1);
    }
    setTo(val) {
      val = parseInt(val.substr(-2)) - 1;
      this.date.setMonth(val < 0 ? 0 : val);
    }
    toString() {
      let month = this.date.getMonth();
      let tl = this.token.length;
      return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
    }
  }
  module.exports = Month;
});

// node_modules/prompts/dist/dateparts/seconds.js
var require_seconds = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Seconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setSeconds(this.date.getSeconds() + 1);
    }
    down() {
      this.date.setSeconds(this.date.getSeconds() - 1);
    }
    setTo(val) {
      this.date.setSeconds(parseInt(val.substr(-2)));
    }
    toString() {
      let s = this.date.getSeconds();
      return this.token.length > 1 ? String(s).padStart(2, "0") : s;
    }
  }
  module.exports = Seconds;
});

// node_modules/prompts/dist/dateparts/year.js
var require_year = __commonJS((exports, module) => {
  var DatePart = require_datepart();

  class Year extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    down() {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    setTo(val) {
      this.date.setFullYear(val.substr(-4));
    }
    toString() {
      let year = String(this.date.getFullYear()).padStart(4, "0");
      return this.token.length === 2 ? year.substr(-2) : year;
    }
  }
  module.exports = Year;
});

// node_modules/prompts/dist/dateparts/index.js
var require_dateparts = __commonJS((exports, module) => {
  module.exports = {
    DatePart: require_datepart(),
    Meridiem: require_meridiem(),
    Day: require_day(),
    Hours: require_hours(),
    Milliseconds: require_milliseconds(),
    Minutes: require_minutes(),
    Month: require_month(),
    Seconds: require_seconds(),
    Year: require_year()
  };
});

// node_modules/prompts/dist/elements/date.js
var require_date = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style2 = _require.style;
  var clear = _require.clear;
  var figures = _require.figures;
  var _require2 = require_src();
  var erase = _require2.erase;
  var cursor = _require2.cursor;
  var _require3 = require_dateparts();
  var DatePart = _require3.DatePart;
  var Meridiem = _require3.Meridiem;
  var Day = _require3.Day;
  var Hours = _require3.Hours;
  var Milliseconds = _require3.Milliseconds;
  var Minutes = _require3.Minutes;
  var Month = _require3.Month;
  var Seconds = _require3.Seconds;
  var Year = _require3.Year;
  var regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
  var regexGroups = {
    1: ({
      token
    }) => token.replace(/\\(.)/g, "$1"),
    2: (opts) => new Day(opts),
    3: (opts) => new Month(opts),
    4: (opts) => new Year(opts),
    5: (opts) => new Meridiem(opts),
    6: (opts) => new Hours(opts),
    7: (opts) => new Minutes(opts),
    8: (opts) => new Seconds(opts),
    9: (opts) => new Milliseconds(opts)
  };
  var dfltLocales = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  };

  class DatePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = 0;
      this.typed = "";
      this.locales = Object.assign(dfltLocales, opts.locales);
      this._date = opts.initial || new Date;
      this.errorMsg = opts.error || "Please Enter A Valid Value";
      this.validator = opts.validate || (() => true);
      this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
      this.clear = clear("");
      this.render();
    }
    get value() {
      return this.date;
    }
    get date() {
      return this._date;
    }
    set date(date) {
      if (date)
        this._date.setTime(date.getTime());
    }
    set mask(mask) {
      let result;
      this.parts = [];
      while (result = regex.exec(mask)) {
        let match = result.shift();
        let idx = result.findIndex((gr) => gr != null);
        this.parts.push(idx in regexGroups ? regexGroups[idx]({
          token: result[idx] || match,
          date: this.date,
          parts: this.parts,
          locales: this.locales
        }) : result[idx] || match);
      }
      let parts = this.parts.reduce((arr, i) => {
        if (typeof i === "string" && typeof arr[arr.length - 1] === "string")
          arr[arr.length - 1] += i;
        else
          arr.push(i);
        return arr;
      }, []);
      this.parts.splice(0);
      this.parts.push(...parts);
      this.reset();
    }
    moveCursor(n) {
      this.typed = "";
      this.cursor = n;
      this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    validate() {
      var _this = this;
      return _asyncToGenerator(function* () {
        let valid = yield _this.validator(_this.value);
        if (typeof valid === "string") {
          _this.errorMsg = valid;
          valid = false;
        }
        _this.error = !valid;
      })();
    }
    submit() {
      var _this2 = this;
      return _asyncToGenerator(function* () {
        yield _this2.validate();
        if (_this2.error) {
          _this2.color = "red";
          _this2.fire();
          _this2.render();
          return;
        }
        _this2.done = true;
        _this2.aborted = false;
        _this2.fire();
        _this2.render();
        _this2.out.write(`
`);
        _this2.close();
      })();
    }
    up() {
      this.typed = "";
      this.parts[this.cursor].up();
      this.render();
    }
    down() {
      this.typed = "";
      this.parts[this.cursor].down();
      this.render();
    }
    left() {
      let prev = this.parts[this.cursor].prev();
      if (prev == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(prev));
      this.render();
    }
    right() {
      let next = this.parts[this.cursor].next();
      if (next == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(next));
      this.render();
    }
    next() {
      let next = this.parts[this.cursor].next();
      this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
      this.render();
    }
    _(c) {
      if (/\d/.test(c)) {
        this.typed += c;
        this.parts[this.cursor].setTo(this.typed);
        this.render();
      }
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      this.outputText = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(false), this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")].join(" ");
      if (this.error) {
        this.outputText += this.errorMsg.split(`
`).reduce((a, l, i) => a + `
${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = DatePrompt;
});

// node_modules/prompts/dist/elements/number.js
var require_number = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_src();
  var cursor = _require.cursor;
  var erase = _require.erase;
  var _require2 = require_util();
  var style2 = _require2.style;
  var figures = _require2.figures;
  var clear = _require2.clear;
  var lines = _require2.lines;
  var isNumber = /[0-9]/;
  var isDef = (any) => any !== undefined;
  var round = (number, precision) => {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  class NumberPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style2.render(opts.style);
      this.msg = opts.message;
      this.initial = isDef(opts.initial) ? opts.initial : "";
      this.float = !!opts.float;
      this.round = opts.round || 2;
      this.inc = opts.increment || 1;
      this.min = isDef(opts.min) ? opts.min : -Infinity;
      this.max = isDef(opts.max) ? opts.max : Infinity;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.validator = opts.validate || (() => true);
      this.color = `cyan`;
      this.value = ``;
      this.typed = ``;
      this.lastHit = 0;
      this.render();
    }
    set value(v) {
      if (!v && v !== 0) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(`${this.initial}`));
        this._value = ``;
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(`${round(v, this.round)}`);
        this._value = round(v, this.round);
      }
      this.fire();
    }
    get value() {
      return this._value;
    }
    parse(x) {
      return this.float ? parseFloat(x) : parseInt(x);
    }
    valid(c) {
      return c === `-` || c === `.` && this.float || isNumber.test(c);
    }
    reset() {
      this.typed = ``;
      this.value = ``;
      this.fire();
      this.render();
    }
    abort() {
      let x = this.value;
      this.value = x !== `` ? x : this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    validate() {
      var _this = this;
      return _asyncToGenerator(function* () {
        let valid = yield _this.validator(_this.value);
        if (typeof valid === `string`) {
          _this.errorMsg = valid;
          valid = false;
        }
        _this.error = !valid;
      })();
    }
    submit() {
      var _this2 = this;
      return _asyncToGenerator(function* () {
        yield _this2.validate();
        if (_this2.error) {
          _this2.color = `red`;
          _this2.fire();
          _this2.render();
          return;
        }
        let x = _this2.value;
        _this2.value = x !== `` ? x : _this2.initial;
        _this2.done = true;
        _this2.aborted = false;
        _this2.error = false;
        _this2.fire();
        _this2.render();
        _this2.out.write(`
`);
        _this2.close();
      })();
    }
    up() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min - this.inc;
      }
      if (this.value >= this.max)
        return this.bell();
      this.value += this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    down() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min + this.inc;
      }
      if (this.value <= this.min)
        return this.bell();
      this.value -= this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    delete() {
      let val = this.value.toString();
      if (val.length === 0)
        return this.bell();
      this.value = this.parse(val = val.slice(0, -1)) || ``;
      if (this.value !== "" && this.value < this.min) {
        this.value = this.min;
      }
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    next() {
      this.value = this.initial;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (!this.valid(c))
        return this.bell();
      const now = Date.now();
      if (now - this.lastHit > 1000)
        this.typed = ``;
      this.typed += c;
      this.lastHit = now;
      this.color = `cyan`;
      if (c === `.`)
        return this.fire();
      this.value = Math.min(this.parse(this.typed), this.max);
      if (this.value > this.max)
        this.value = this.max;
      if (this.value < this.min)
        this.value = this.min;
      this.fire();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError) - 1) + clear(this.outputError));
        this.out.write(clear(this.outputText));
      }
      super.render();
      this.outputError = "";
      this.outputText = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(this.done), !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`
`).reduce((a, l, i) => a + `
${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
    }
  }
  module.exports = NumberPrompt;
});

// node_modules/prompts/dist/elements/multiselect.js
var require_multiselect = __commonJS((exports, module) => {
  var color = require_kleur();
  var _require = require_src();
  var cursor = _require.cursor;
  var Prompt = require_prompt();
  var _require2 = require_util();
  var clear = _require2.clear;
  var figures = _require2.figures;
  var style2 = _require2.style;
  var wrap = _require2.wrap;
  var entriesToDisplay = _require2.entriesToDisplay;

  class MultiselectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = opts.cursor || 0;
      this.scrollIndex = opts.cursor || 0;
      this.hint = opts.hint || "";
      this.warn = opts.warn || "- This option is disabled -";
      this.minSelected = opts.min;
      this.showMinError = false;
      this.maxChoices = opts.max;
      this.instructions = opts.instructions;
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = {
            title: ch,
            value: idx
          };
        return {
          title: ch && (ch.title || ch.value || ch),
          description: ch && ch.description,
          value: ch && (ch.value === undefined ? idx : ch.value),
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.clear = clear("");
      if (!opts.overrideRender) {
        this.render();
      }
    }
    reset() {
      this.value.map((v) => !v.selected);
      this.cursor = 0;
      this.fire();
      this.render();
    }
    selected() {
      return this.value.filter((v) => v.selected);
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      const selected = this.value.filter((e) => e.selected);
      if (this.minSelected && selected.length < this.minSelected) {
        this.showMinError = true;
        this.render();
      } else {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write(`
`);
        this.close();
      }
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.value.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.value.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.value.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.value[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.value[this.cursor].selected = true;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.value[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    toggleAll() {
      if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
        return this.bell();
      }
      const newSelected = !this.value[this.cursor].selected;
      this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else if (c === "a") {
        this.toggleAll();
      } else {
        return this.bell();
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return `
Instructions:
` + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
` + (this.maxChoices === undefined ? `    a: Toggle all
` : "") + `    enter/return: Complete answer`;
      }
      return "";
    }
    renderOption(cursor2, v, i, arrowIndicator) {
      const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
      let title, desc;
      if (v.disabled) {
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      } else {
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
        if (cursor2 === i && v.description) {
          desc = ` - ${v.description}`;
          if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
            desc = `
` + wrap(v.description, {
              margin: prefix.length,
              width: this.out.columns
            });
          }
        }
      }
      return prefix + title + color.gray(desc || "");
    }
    paginateOptions(options) {
      if (options.length === 0) {
        return color.red("No matches for this query.");
      }
      let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
      let prefix, styledOptions = [];
      for (let i = startIndex;i < endIndex; i++) {
        if (i === startIndex && startIndex > 0) {
          prefix = figures.arrowUp;
        } else if (i === endIndex - 1 && endIndex < options.length) {
          prefix = figures.arrowDown;
        } else {
          prefix = " ";
        }
        styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
      }
      return `
` + styledOptions.join(`
`);
    }
    renderOptions(options) {
      if (!this.done) {
        return this.paginateOptions(options);
      }
      return "";
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions()];
      if (this.value[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(false), this.renderDoneOrInstructions()].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.value);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt);
    }
  }
  module.exports = MultiselectPrompt;
});

// node_modules/prompts/dist/elements/autocomplete.js
var require_autocomplete = __commonJS((exports, module) => {
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_src();
  var erase = _require.erase;
  var cursor = _require.cursor;
  var _require2 = require_util();
  var style2 = _require2.style;
  var clear = _require2.clear;
  var figures = _require2.figures;
  var wrap = _require2.wrap;
  var entriesToDisplay = _require2.entriesToDisplay;
  var getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
  var getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
  var getIndex = (arr, valOrTitle) => {
    const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
    return index > -1 ? index : undefined;
  };

  class AutocompletePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.suggest = opts.suggest;
      this.choices = opts.choices;
      this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
      this.select = this.initial || opts.cursor || 0;
      this.i18n = {
        noMatches: opts.noMatches || "no matches found"
      };
      this.fallback = opts.fallback || this.initial;
      this.suggestions = [];
      this.input = "";
      this.limit = opts.limit || 10;
      this.cursor = 0;
      this.transform = style2.render(opts.style);
      this.scale = this.transform.scale;
      this.render = this.render.bind(this);
      this.complete = this.complete.bind(this);
      this.clear = clear("");
      this.complete(this.render);
      this.render();
    }
    set fallback(fb) {
      this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
    }
    get fallback() {
      let choice;
      if (typeof this._fb === "number")
        choice = this.choices[this._fb];
      else if (typeof this._fb === "string")
        choice = {
          title: this._fb
        };
      return choice || this._fb || {
        title: this.i18n.noMatches
      };
    }
    moveSelect(i) {
      this.select = i;
      if (this.suggestions.length > 0)
        this.value = getVal(this.suggestions, i);
      else
        this.value = this.fallback.value;
      this.fire();
    }
    complete(cb) {
      var _this = this;
      return _asyncToGenerator(function* () {
        const p = _this.completing = _this.suggest(_this.input, _this.choices);
        const suggestions = yield p;
        if (_this.completing !== p)
          return;
        _this.suggestions = suggestions.map((s, i, arr) => ({
          title: getTitle(arr, i),
          value: getVal(arr, i),
          description: s.description
        }));
        _this.completing = false;
        const l = Math.max(suggestions.length - 1, 0);
        _this.moveSelect(Math.min(l, _this.select));
        cb && cb();
      })();
    }
    reset() {
      this.input = "";
      this.complete(() => {
        this.moveSelect(this.initial !== undefined ? this.initial : 0);
        this.render();
      });
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    _(c, key) {
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${c}${s2}`;
      this.cursor = s1.length + 1;
      this.complete(this.render);
      this.render();
    }
    delete() {
      if (this.cursor === 0)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor - 1);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.cursor = this.cursor - 1;
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor + 1);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.render();
    }
    first() {
      this.moveSelect(0);
      this.render();
    }
    last() {
      this.moveSelect(this.suggestions.length - 1);
      this.render();
    }
    up() {
      if (this.select <= 0)
        return this.bell();
      this.moveSelect(this.select - 1);
      this.render();
    }
    down() {
      if (this.select >= this.suggestions.length - 1)
        return this.bell();
      this.moveSelect(this.select + 1);
      this.render();
    }
    next() {
      if (this.select === this.suggestions.length - 1) {
        this.moveSelect(0);
      } else
        this.moveSelect(this.select + 1);
      this.render();
    }
    nextPage() {
      this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
      this.render();
    }
    prevPage() {
      this.moveSelect(Math.max(this.select - this.limit, 0));
      this.render();
    }
    left() {
      if (this.cursor <= 0)
        return this.bell();
      this.cursor = this.cursor - 1;
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      this.cursor = this.cursor + 1;
      this.render();
    }
    renderOption(v, hovered, isStart, isEnd) {
      let desc;
      let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
      let title = hovered ? color.cyan().underline(v.title) : v.title;
      prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
      if (v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
          desc = `
` + wrap(v.description, {
            margin: 3,
            width: this.out.columns
          });
        }
      }
      return prefix + " " + title + color.gray(desc || "");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit), startIndex = _entriesToDisplay.startIndex, endIndex = _entriesToDisplay.endIndex;
      this.outputText = [color.bold(style2.symbol(this.done, this.aborted)), color.bold(this.msg), style2.delimiter(this.completing), this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(" ");
      if (!this.done) {
        const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join(`
`);
        this.outputText += `
` + (suggestions || color.gray(this.fallback.title));
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = AutocompletePrompt;
});

// node_modules/prompts/dist/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect = __commonJS((exports, module) => {
  var color = require_kleur();
  var _require = require_src();
  var cursor = _require.cursor;
  var MultiselectPrompt = require_multiselect();
  var _require2 = require_util();
  var clear = _require2.clear;
  var style2 = _require2.style;
  var figures = _require2.figures;

  class AutocompleteMultiselectPrompt extends MultiselectPrompt {
    constructor(opts = {}) {
      opts.overrideRender = true;
      super(opts);
      this.inputValue = "";
      this.clear = clear("");
      this.filteredOptions = this.value;
      this.render();
    }
    last() {
      this.cursor = this.filteredOptions.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.filteredOptions.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.filteredOptions.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.filteredOptions.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.filteredOptions[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.filteredOptions[this.cursor].selected = true;
      this.render();
    }
    delete() {
      if (this.inputValue.length) {
        this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
        this.updateFilteredOptions();
      }
    }
    updateFilteredOptions() {
      const currentHighlight = this.filteredOptions[this.cursor];
      this.filteredOptions = this.value.filter((v) => {
        if (this.inputValue) {
          if (typeof v.title === "string") {
            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          if (typeof v.value === "string") {
            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          return false;
        }
        return true;
      });
      const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
      this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.filteredOptions[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    handleInputChange(c) {
      this.inputValue = this.inputValue + c;
      this.updateFilteredOptions();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else {
        this.handleInputChange(c);
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
      }
      return "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}
`;
    }
    renderOption(cursor2, v, i) {
      let title;
      if (v.disabled)
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      else
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
      return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(false), this.renderDoneOrInstructions()].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.filteredOptions);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt);
    }
  }
  module.exports = AutocompleteMultiselectPrompt;
});

// node_modules/prompts/dist/elements/confirm.js
var require_confirm = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt();
  var _require = require_util();
  var style2 = _require.style;
  var clear = _require.clear;
  var _require2 = require_src();
  var erase = _require2.erase;
  var cursor = _require2.cursor;

  class ConfirmPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = opts.initial;
      this.initialValue = !!opts.initial;
      this.yesMsg = opts.yes || "yes";
      this.yesOption = opts.yesOption || "(Y/n)";
      this.noMsg = opts.no || "no";
      this.noOption = opts.noOption || "(y/N)";
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      this.value = this.value || false;
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    _(c, key) {
      if (c.toLowerCase() === "y") {
        this.value = true;
        return this.submit();
      }
      if (c.toLowerCase() === "n") {
        this.value = false;
        return this.submit();
      }
      return this.bell();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      this.outputText = [style2.symbol(this.done, this.aborted), color.bold(this.msg), style2.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = ConfirmPrompt;
});

// node_modules/prompts/dist/elements/index.js
var require_elements = __commonJS((exports, module) => {
  module.exports = {
    TextPrompt: require_text(),
    SelectPrompt: require_select(),
    TogglePrompt: require_toggle(),
    DatePrompt: require_date(),
    NumberPrompt: require_number(),
    MultiselectPrompt: require_multiselect(),
    AutocompletePrompt: require_autocomplete(),
    AutocompleteMultiselectPrompt: require_autocompleteMultiselect(),
    ConfirmPrompt: require_confirm()
  };
});

// node_modules/prompts/dist/prompts.js
var require_prompts = __commonJS((exports) => {
  var $ = exports;
  var el = require_elements();
  var noop = (v) => v;
  function toPrompt(type, args, opts = {}) {
    return new Promise((res, rej) => {
      const p = new el[type](args);
      const onAbort = opts.onAbort || noop;
      const onSubmit = opts.onSubmit || noop;
      p.on("state", args.onState || noop);
      p.on("submit", (x) => res(onSubmit(x)));
      p.on("abort", (x) => rej(onAbort(x)));
    });
  }
  $.text = (args) => toPrompt("TextPrompt", args);
  $.password = (args) => {
    args.style = "password";
    return $.text(args);
  };
  $.invisible = (args) => {
    args.style = "invisible";
    return $.text(args);
  };
  $.number = (args) => toPrompt("NumberPrompt", args);
  $.date = (args) => toPrompt("DatePrompt", args);
  $.confirm = (args) => toPrompt("ConfirmPrompt", args);
  $.list = (args) => {
    const sep = args.separator || ",";
    return toPrompt("TextPrompt", args, {
      onSubmit: (str) => str.split(sep).map((s) => s.trim())
    });
  };
  $.toggle = (args) => toPrompt("TogglePrompt", args);
  $.select = (args) => toPrompt("SelectPrompt", args);
  $.multiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("MultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  $.autocompleteMultiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("AutocompleteMultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  var byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
  $.autocomplete = (args) => {
    args.suggest = args.suggest || byTitle;
    args.choices = [].concat(args.choices || []);
    return toPrompt("AutocompletePrompt", args);
  };
});

// node_modules/prompts/dist/index.js
var require_dist = __commonJS((exports, module) => {
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i = 1;i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  var prompts = require_prompts();
  var passOn = ["suggest", "format", "onState", "validate", "onRender", "type"];
  var noop = () => {};
  function prompt() {
    return _prompt.apply(this, arguments);
  }
  function _prompt() {
    _prompt = _asyncToGenerator(function* (questions = [], {
      onSubmit = noop,
      onCancel = noop
    } = {}) {
      const answers = {};
      const override2 = prompt._override || {};
      questions = [].concat(questions);
      let answer, question, quit, name, type, lastPrompt;
      const getFormattedAnswer = /* @__PURE__ */ function() {
        var _ref = _asyncToGenerator(function* (question2, answer2, skipValidation = false) {
          if (!skipValidation && question2.validate && question2.validate(answer2) !== true) {
            return;
          }
          return question2.format ? yield question2.format(answer2, answers) : answer2;
        });
        return function getFormattedAnswer(_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = questions[Symbol.iterator](), _step;!(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          question = _step.value;
          var _question = question;
          name = _question.name;
          type = _question.type;
          if (typeof type === "function") {
            type = yield type(answer, _objectSpread({}, answers), question);
            question["type"] = type;
          }
          if (!type)
            continue;
          for (let key in question) {
            if (passOn.includes(key))
              continue;
            let value = question[key];
            question[key] = typeof value === "function" ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
          }
          lastPrompt = question;
          if (typeof question.message !== "string") {
            throw new Error("prompt message is required");
          }
          var _question2 = question;
          name = _question2.name;
          type = _question2.type;
          if (prompts[type] === undefined) {
            throw new Error(`prompt type (${type}) is not defined`);
          }
          if (override2[question.name] !== undefined) {
            answer = yield getFormattedAnswer(question, override2[question.name]);
            if (answer !== undefined) {
              answers[name] = answer;
              continue;
            }
          }
          try {
            answer = prompt._injected ? getInjectedAnswer(prompt._injected) : yield prompts[type](question);
            answers[name] = answer = yield getFormattedAnswer(question, answer, true);
            quit = yield onSubmit(question, answer, answers);
          } catch (err) {
            quit = !(yield onCancel(question, answers));
          }
          if (quit)
            return answers;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      return answers;
    });
    return _prompt.apply(this, arguments);
  }
  function getInjectedAnswer(injected) {
    const answer = injected.shift();
    if (answer instanceof Error) {
      throw answer;
    }
    return answer;
  }
  function inject(answers) {
    prompt._injected = (prompt._injected || []).concat(answers);
  }
  function override(answers) {
    prompt._override = Object.assign({}, answers);
  }
  module.exports = Object.assign(prompt, {
    prompt,
    prompts,
    inject,
    override
  });
});

// node_modules/prompts/lib/util/action.js
var require_action2 = __commonJS((exports, module) => {
  module.exports = (key, isSelect) => {
    if (key.meta)
      return;
    if (key.ctrl) {
      if (key.name === "a")
        return "first";
      if (key.name === "c")
        return "abort";
      if (key.name === "d")
        return "abort";
      if (key.name === "e")
        return "last";
      if (key.name === "g")
        return "reset";
    }
    if (isSelect) {
      if (key.name === "j")
        return "down";
      if (key.name === "k")
        return "up";
    }
    if (key.name === "return")
      return "submit";
    if (key.name === "enter")
      return "submit";
    if (key.name === "backspace")
      return "delete";
    if (key.name === "delete")
      return "deleteForward";
    if (key.name === "abort")
      return "abort";
    if (key.name === "escape")
      return "abort";
    if (key.name === "tab")
      return "next";
    if (key.name === "pagedown")
      return "nextPage";
    if (key.name === "pageup")
      return "prevPage";
    if (key.name === "home")
      return "home";
    if (key.name === "end")
      return "end";
    if (key.name === "up")
      return "up";
    if (key.name === "down")
      return "down";
    if (key.name === "right")
      return "right";
    if (key.name === "left")
      return "left";
    return false;
  };
});

// node_modules/prompts/lib/util/strip.js
var require_strip2 = __commonJS((exports, module) => {
  module.exports = (str) => {
    const pattern = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
    ].join("|");
    const RGX = new RegExp(pattern, "g");
    return typeof str === "string" ? str.replace(RGX, "") : str;
  };
});

// node_modules/prompts/lib/util/clear.js
var require_clear2 = __commonJS((exports, module) => {
  var strip = require_strip2();
  var { erase, cursor } = require_src();
  var width = (str) => [...strip(str)].length;
  module.exports = function(prompt, perLine = process.stdout.columns) {
    if (!perLine)
      return erase.line + cursor.to(0);
    let rows = 0;
    const lines = prompt.split(/\r?\n/);
    for (let line of lines) {
      rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
    }
    return erase.lines(rows);
  };
});

// node_modules/prompts/lib/util/figures.js
var require_figures2 = __commonJS((exports, module) => {
  var main = {
    arrowUp: "↑",
    arrowDown: "↓",
    arrowLeft: "←",
    arrowRight: "→",
    radioOn: "◉",
    radioOff: "◯",
    tick: "✔",
    cross: "✖",
    ellipsis: "…",
    pointerSmall: "›",
    line: "─",
    pointer: "❯"
  };
  var win = {
    arrowUp: main.arrowUp,
    arrowDown: main.arrowDown,
    arrowLeft: main.arrowLeft,
    arrowRight: main.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "√",
    cross: "×",
    ellipsis: "...",
    pointerSmall: "»",
    line: "─",
    pointer: ">"
  };
  var figures = process.platform === "win32" ? win : main;
  module.exports = figures;
});

// node_modules/prompts/lib/util/style.js
var require_style2 = __commonJS((exports, module) => {
  var c = require_kleur();
  var figures = require_figures2();
  var styles = Object.freeze({
    password: { scale: 1, render: (input) => "*".repeat(input.length) },
    emoji: { scale: 2, render: (input) => "\uD83D\uDE03".repeat(input.length) },
    invisible: { scale: 0, render: (input) => "" },
    default: { scale: 1, render: (input) => `${input}` }
  });
  var render = (type) => styles[type] || styles.default;
  var symbols = Object.freeze({
    aborted: c.red(figures.cross),
    done: c.green(figures.tick),
    default: c.cyan("?")
  });
  var symbol = (done, aborted) => aborted ? symbols.aborted : done ? symbols.done : symbols.default;
  var delimiter = (completing) => c.gray(completing ? figures.ellipsis : figures.pointerSmall);
  var item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : "+" : figures.line);
  module.exports = {
    styles,
    render,
    symbols,
    symbol,
    delimiter,
    item
  };
});

// node_modules/prompts/lib/util/lines.js
var require_lines2 = __commonJS((exports, module) => {
  var strip = require_strip2();
  module.exports = function(msg, perLine = process.stdout.columns) {
    let lines = String(strip(msg) || "").split(/\r?\n/);
    if (!perLine)
      return lines.length;
    return lines.map((l) => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
  };
});

// node_modules/prompts/lib/util/wrap.js
var require_wrap2 = __commonJS((exports, module) => {
  module.exports = (msg, opts = {}) => {
    const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(" ").join("") : opts.margin || "";
    const width = opts.width || process.stdout.columns;
    return (msg || "").split(/\r?\n/g).map((line) => line.split(/\s+/g).reduce((arr, w) => {
      if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
        arr[arr.length - 1] += ` ${w}`;
      else
        arr.push(`${tab}${w}`);
      return arr;
    }, [tab]).join(`
`)).join(`
`);
  };
});

// node_modules/prompts/lib/util/entriesToDisplay.js
var require_entriesToDisplay2 = __commonJS((exports, module) => {
  module.exports = (cursor, total, maxVisible) => {
    maxVisible = maxVisible || total;
    let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
    if (startIndex < 0)
      startIndex = 0;
    let endIndex = Math.min(startIndex + maxVisible, total);
    return { startIndex, endIndex };
  };
});

// node_modules/prompts/lib/util/index.js
var require_util2 = __commonJS((exports, module) => {
  module.exports = {
    action: require_action2(),
    clear: require_clear2(),
    style: require_style2(),
    strip: require_strip2(),
    figures: require_figures2(),
    lines: require_lines2(),
    wrap: require_wrap2(),
    entriesToDisplay: require_entriesToDisplay2()
  };
});

// node_modules/prompts/lib/elements/prompt.js
var require_prompt2 = __commonJS((exports, module) => {
  var readline = __require("readline");
  var { action } = require_util2();
  var EventEmitter = __require("events");
  var { beep, cursor } = require_src();
  var color = require_kleur();

  class Prompt extends EventEmitter {
    constructor(opts = {}) {
      super();
      this.firstRender = true;
      this.in = opts.stdin || process.stdin;
      this.out = opts.stdout || process.stdout;
      this.onRender = (opts.onRender || (() => {
        return;
      })).bind(this);
      const rl = readline.createInterface(this.in);
      readline.emitKeypressEvents(this.in, rl);
      if (this.in.isTTY)
        this.in.setRawMode(true);
      const isSelect = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
      const keypress = (str, key) => {
        let a = action(key, isSelect);
        if (a === false) {
          this._ && this._(str, key);
        } else if (typeof this[a] === "function") {
          this[a](key);
        } else {
          this.bell();
        }
      };
      this.close = () => {
        this.out.write(cursor.show);
        this.in.removeListener("keypress", keypress);
        if (this.in.isTTY)
          this.in.setRawMode(false);
        rl.close();
        this.emit(this.aborted ? "abort" : "submit", this.value);
        this.closed = true;
      };
      this.in.on("keypress", keypress);
    }
    fire() {
      this.emit("state", {
        value: this.value,
        aborted: !!this.aborted
      });
    }
    bell() {
      this.out.write(beep);
    }
    render() {
      this.onRender(color);
      if (this.firstRender)
        this.firstRender = false;
    }
  }
  module.exports = Prompt;
});

// node_modules/prompts/lib/elements/text.js
var require_text2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { erase, cursor } = require_src();
  var { style: style2, clear, lines, figures } = require_util2();

  class TextPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style2.render(opts.style);
      this.scale = this.transform.scale;
      this.msg = opts.message;
      this.initial = opts.initial || ``;
      this.validator = opts.validate || (() => true);
      this.value = ``;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.cursor = Number(!!this.initial);
      this.clear = clear(``);
      this.render();
    }
    set value(v) {
      if (!v && this.initial) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(this.initial));
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(v);
      }
      this._value = v;
      this.fire();
    }
    get value() {
      return this._value;
    }
    reset() {
      this.value = ``;
      this.cursor = Number(!!this.initial);
      this.fire();
      this.render();
    }
    abort() {
      this.value = this.value || this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.red = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    async validate() {
      let valid = await this.validator(this.value);
      if (typeof valid === `string`) {
        this.errorMsg = valid;
        valid = false;
      }
      this.error = !valid;
    }
    async submit() {
      this.value = this.value || this.initial;
      await this.validate();
      if (this.error) {
        this.red = true;
        this.fire();
        this.render();
        return;
      }
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    next() {
      if (!this.placeholder)
        return this.bell();
      this.value = this.initial;
      this.cursor = this.rendered.length;
      this.fire();
      this.render();
    }
    moveCursor(n) {
      if (this.placeholder)
        return;
      this.cursor = this.cursor + n;
    }
    _(c, key) {
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${c}${s2}`;
      this.red = false;
      this.cursor = this.placeholder ? 0 : s1.length + 1;
      this.render();
    }
    delete() {
      if (this.cursor === 0)
        return this.bell();
      let s1 = this.value.slice(0, this.cursor - 1);
      let s2 = this.value.slice(this.cursor);
      this.value = `${s1}${s2}`;
      this.red = false;
      this.moveCursor(-1);
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      let s1 = this.value.slice(0, this.cursor);
      let s2 = this.value.slice(this.cursor + 1);
      this.value = `${s1}${s2}`;
      this.red = false;
      this.render();
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length;
      this.render();
    }
    left() {
      if (this.cursor <= 0 || this.placeholder)
        return this.bell();
      this.moveCursor(-1);
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder)
        return this.bell();
      this.moveCursor(1);
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError) - 1) + clear(this.outputError));
        this.out.write(clear(this.outputText));
      }
      super.render();
      this.outputError = "";
      this.outputText = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(this.done),
        this.red ? color.red(this.rendered) : this.rendered
      ].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`
`).reduce((a, l, i) => a + `
${i ? " " : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
    }
  }
  module.exports = TextPrompt;
});

// node_modules/prompts/lib/elements/select.js
var require_select2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style: style2, clear, figures, wrap, entriesToDisplay } = require_util2();
  var { cursor } = require_src();

  class SelectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.hint = opts.hint || "- Use arrow-keys. Return to submit.";
      this.warn = opts.warn || "- This option is disabled";
      this.cursor = opts.initial || 0;
      this.choices = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = { title: ch, value: idx };
        return {
          title: ch && (ch.title || ch.value || ch),
          value: ch && (ch.value === undefined ? idx : ch.value),
          description: ch && ch.description,
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = (this.choices[this.cursor] || {}).value;
      this.clear = clear("");
      this.render();
    }
    moveCursor(n) {
      this.cursor = n;
      this.value = this.choices[n].value;
      this.fire();
    }
    reset() {
      this.moveCursor(0);
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      if (!this.selection.disabled) {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write(`
`);
        this.close();
      } else
        this.bell();
    }
    first() {
      this.moveCursor(0);
      this.render();
    }
    last() {
      this.moveCursor(this.choices.length - 1);
      this.render();
    }
    up() {
      if (this.cursor === 0)
        return this.bell();
      this.moveCursor(this.cursor - 1);
      this.render();
    }
    down() {
      if (this.cursor === this.choices.length - 1)
        return this.bell();
      this.moveCursor(this.cursor + 1);
      this.render();
    }
    next() {
      this.moveCursor((this.cursor + 1) % this.choices.length);
      this.render();
    }
    _(c, key) {
      if (c === " ")
        return this.submit();
    }
    get selection() {
      return this.choices[this.cursor];
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);
      this.outputText = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(false),
        this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)
      ].join(" ");
      if (!this.done) {
        this.outputText += `
`;
        for (let i = startIndex;i < endIndex; i++) {
          let title, prefix, desc = "", v = this.choices[i];
          if (i === startIndex && startIndex > 0) {
            prefix = figures.arrowUp;
          } else if (i === endIndex - 1 && endIndex < this.choices.length) {
            prefix = figures.arrowDown;
          } else {
            prefix = " ";
          }
          if (v.disabled) {
            title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
            prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + " " : "  ") + prefix;
          } else {
            title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
            prefix = (this.cursor === i ? color.cyan(figures.pointer) + " " : "  ") + prefix;
            if (v.description && this.cursor === i) {
              desc = ` - ${v.description}`;
              if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
                desc = `
` + wrap(v.description, { margin: 3, width: this.out.columns });
              }
            }
          }
          this.outputText += `${prefix} ${title}${color.gray(desc)}
`;
        }
      }
      this.out.write(this.outputText);
    }
  }
  module.exports = SelectPrompt;
});

// node_modules/prompts/lib/elements/toggle.js
var require_toggle2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style: style2, clear } = require_util2();
  var { cursor, erase } = require_src();

  class TogglePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = !!opts.initial;
      this.active = opts.active || "on";
      this.inactive = opts.inactive || "off";
      this.initialValue = this.value;
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    deactivate() {
      if (this.value === false)
        return this.bell();
      this.value = false;
      this.render();
    }
    activate() {
      if (this.value === true)
        return this.bell();
      this.value = true;
      this.render();
    }
    delete() {
      this.deactivate();
    }
    left() {
      this.deactivate();
    }
    right() {
      this.activate();
    }
    down() {
      this.deactivate();
    }
    up() {
      this.activate();
    }
    next() {
      this.value = !this.value;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.value = !this.value;
      } else if (c === "1") {
        this.value = true;
      } else if (c === "0") {
        this.value = false;
      } else
        return this.bell();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      this.outputText = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(this.done),
        this.value ? this.inactive : color.cyan().underline(this.inactive),
        color.gray("/"),
        this.value ? color.cyan().underline(this.active) : this.active
      ].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = TogglePrompt;
});

// node_modules/prompts/lib/dateparts/datepart.js
var require_datepart2 = __commonJS((exports, module) => {
  class DatePart {
    constructor({ token, date, parts, locales }) {
      this.token = token;
      this.date = date || new Date;
      this.parts = parts || [this];
      this.locales = locales || {};
    }
    up() {}
    down() {}
    next() {
      const currentIdx = this.parts.indexOf(this);
      return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    setTo(val) {}
    prev() {
      let parts = [].concat(this.parts).reverse();
      const currentIdx = parts.indexOf(this);
      return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
    }
    toString() {
      return String(this.date);
    }
  }
  module.exports = DatePart;
});

// node_modules/prompts/lib/dateparts/meridiem.js
var require_meridiem2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Meridiem extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours((this.date.getHours() + 12) % 24);
    }
    down() {
      this.up();
    }
    toString() {
      let meridiem = this.date.getHours() > 12 ? "pm" : "am";
      return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
    }
  }
  module.exports = Meridiem;
});

// node_modules/prompts/lib/dateparts/day.js
var require_day2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();
  var pos = (n) => {
    n = n % 10;
    return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  };

  class Day extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setDate(this.date.getDate() + 1);
    }
    down() {
      this.date.setDate(this.date.getDate() - 1);
    }
    setTo(val) {
      this.date.setDate(parseInt(val.substr(-2)));
    }
    toString() {
      let date = this.date.getDate();
      let day = this.date.getDay();
      return this.token === "DD" ? String(date).padStart(2, "0") : this.token === "Do" ? date + pos(date) : this.token === "d" ? day + 1 : this.token === "ddd" ? this.locales.weekdaysShort[day] : this.token === "dddd" ? this.locales.weekdays[day] : date;
    }
  }
  module.exports = Day;
});

// node_modules/prompts/lib/dateparts/hours.js
var require_hours2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Hours extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setHours(this.date.getHours() + 1);
    }
    down() {
      this.date.setHours(this.date.getHours() - 1);
    }
    setTo(val) {
      this.date.setHours(parseInt(val.substr(-2)));
    }
    toString() {
      let hours = this.date.getHours();
      if (/h/.test(this.token))
        hours = hours % 12 || 12;
      return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
    }
  }
  module.exports = Hours;
});

// node_modules/prompts/lib/dateparts/milliseconds.js
var require_milliseconds2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Milliseconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }
    down() {
      this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }
    setTo(val) {
      this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
    }
    toString() {
      return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
    }
  }
  module.exports = Milliseconds;
});

// node_modules/prompts/lib/dateparts/minutes.js
var require_minutes2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Minutes extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMinutes(this.date.getMinutes() + 1);
    }
    down() {
      this.date.setMinutes(this.date.getMinutes() - 1);
    }
    setTo(val) {
      this.date.setMinutes(parseInt(val.substr(-2)));
    }
    toString() {
      let m = this.date.getMinutes();
      return this.token.length > 1 ? String(m).padStart(2, "0") : m;
    }
  }
  module.exports = Minutes;
});

// node_modules/prompts/lib/dateparts/month.js
var require_month2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Month extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setMonth(this.date.getMonth() + 1);
    }
    down() {
      this.date.setMonth(this.date.getMonth() - 1);
    }
    setTo(val) {
      val = parseInt(val.substr(-2)) - 1;
      this.date.setMonth(val < 0 ? 0 : val);
    }
    toString() {
      let month = this.date.getMonth();
      let tl = this.token.length;
      return tl === 2 ? String(month + 1).padStart(2, "0") : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
    }
  }
  module.exports = Month;
});

// node_modules/prompts/lib/dateparts/seconds.js
var require_seconds2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Seconds extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setSeconds(this.date.getSeconds() + 1);
    }
    down() {
      this.date.setSeconds(this.date.getSeconds() - 1);
    }
    setTo(val) {
      this.date.setSeconds(parseInt(val.substr(-2)));
    }
    toString() {
      let s = this.date.getSeconds();
      return this.token.length > 1 ? String(s).padStart(2, "0") : s;
    }
  }
  module.exports = Seconds;
});

// node_modules/prompts/lib/dateparts/year.js
var require_year2 = __commonJS((exports, module) => {
  var DatePart = require_datepart2();

  class Year extends DatePart {
    constructor(opts = {}) {
      super(opts);
    }
    up() {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    down() {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    setTo(val) {
      this.date.setFullYear(val.substr(-4));
    }
    toString() {
      let year = String(this.date.getFullYear()).padStart(4, "0");
      return this.token.length === 2 ? year.substr(-2) : year;
    }
  }
  module.exports = Year;
});

// node_modules/prompts/lib/dateparts/index.js
var require_dateparts2 = __commonJS((exports, module) => {
  module.exports = {
    DatePart: require_datepart2(),
    Meridiem: require_meridiem2(),
    Day: require_day2(),
    Hours: require_hours2(),
    Milliseconds: require_milliseconds2(),
    Minutes: require_minutes2(),
    Month: require_month2(),
    Seconds: require_seconds2(),
    Year: require_year2()
  };
});

// node_modules/prompts/lib/elements/date.js
var require_date2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style: style2, clear, figures } = require_util2();
  var { erase, cursor } = require_src();
  var { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = require_dateparts2();
  var regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
  var regexGroups = {
    1: ({ token }) => token.replace(/\\(.)/g, "$1"),
    2: (opts) => new Day(opts),
    3: (opts) => new Month(opts),
    4: (opts) => new Year(opts),
    5: (opts) => new Meridiem(opts),
    6: (opts) => new Hours(opts),
    7: (opts) => new Minutes(opts),
    8: (opts) => new Seconds(opts),
    9: (opts) => new Milliseconds(opts)
  };
  var dfltLocales = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  };

  class DatePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = 0;
      this.typed = "";
      this.locales = Object.assign(dfltLocales, opts.locales);
      this._date = opts.initial || new Date;
      this.errorMsg = opts.error || "Please Enter A Valid Value";
      this.validator = opts.validate || (() => true);
      this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
      this.clear = clear("");
      this.render();
    }
    get value() {
      return this.date;
    }
    get date() {
      return this._date;
    }
    set date(date) {
      if (date)
        this._date.setTime(date.getTime());
    }
    set mask(mask) {
      let result;
      this.parts = [];
      while (result = regex.exec(mask)) {
        let match = result.shift();
        let idx = result.findIndex((gr) => gr != null);
        this.parts.push(idx in regexGroups ? regexGroups[idx]({ token: result[idx] || match, date: this.date, parts: this.parts, locales: this.locales }) : result[idx] || match);
      }
      let parts = this.parts.reduce((arr, i) => {
        if (typeof i === "string" && typeof arr[arr.length - 1] === "string")
          arr[arr.length - 1] += i;
        else
          arr.push(i);
        return arr;
      }, []);
      this.parts.splice(0);
      this.parts.push(...parts);
      this.reset();
    }
    moveCursor(n) {
      this.typed = "";
      this.cursor = n;
      this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((p) => p instanceof DatePart));
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    async validate() {
      let valid = await this.validator(this.value);
      if (typeof valid === "string") {
        this.errorMsg = valid;
        valid = false;
      }
      this.error = !valid;
    }
    async submit() {
      await this.validate();
      if (this.error) {
        this.color = "red";
        this.fire();
        this.render();
        return;
      }
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    up() {
      this.typed = "";
      this.parts[this.cursor].up();
      this.render();
    }
    down() {
      this.typed = "";
      this.parts[this.cursor].down();
      this.render();
    }
    left() {
      let prev = this.parts[this.cursor].prev();
      if (prev == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(prev));
      this.render();
    }
    right() {
      let next = this.parts[this.cursor].next();
      if (next == null)
        return this.bell();
      this.moveCursor(this.parts.indexOf(next));
      this.render();
    }
    next() {
      let next = this.parts[this.cursor].next();
      this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex((part) => part instanceof DatePart));
      this.render();
    }
    _(c) {
      if (/\d/.test(c)) {
        this.typed += c;
        this.parts[this.cursor].setTo(this.typed);
        this.render();
      }
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      this.outputText = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(false),
        this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join("")
      ].join(" ");
      if (this.error) {
        this.outputText += this.errorMsg.split(`
`).reduce((a, l, i) => a + `
${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = DatePrompt;
});

// node_modules/prompts/lib/elements/number.js
var require_number2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { cursor, erase } = require_src();
  var { style: style2, figures, clear, lines } = require_util2();
  var isNumber = /[0-9]/;
  var isDef = (any) => any !== undefined;
  var round = (number, precision) => {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  class NumberPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.transform = style2.render(opts.style);
      this.msg = opts.message;
      this.initial = isDef(opts.initial) ? opts.initial : "";
      this.float = !!opts.float;
      this.round = opts.round || 2;
      this.inc = opts.increment || 1;
      this.min = isDef(opts.min) ? opts.min : -Infinity;
      this.max = isDef(opts.max) ? opts.max : Infinity;
      this.errorMsg = opts.error || `Please Enter A Valid Value`;
      this.validator = opts.validate || (() => true);
      this.color = `cyan`;
      this.value = ``;
      this.typed = ``;
      this.lastHit = 0;
      this.render();
    }
    set value(v) {
      if (!v && v !== 0) {
        this.placeholder = true;
        this.rendered = color.gray(this.transform.render(`${this.initial}`));
        this._value = ``;
      } else {
        this.placeholder = false;
        this.rendered = this.transform.render(`${round(v, this.round)}`);
        this._value = round(v, this.round);
      }
      this.fire();
    }
    get value() {
      return this._value;
    }
    parse(x) {
      return this.float ? parseFloat(x) : parseInt(x);
    }
    valid(c) {
      return c === `-` || c === `.` && this.float || isNumber.test(c);
    }
    reset() {
      this.typed = ``;
      this.value = ``;
      this.fire();
      this.render();
    }
    abort() {
      let x = this.value;
      this.value = x !== `` ? x : this.initial;
      this.done = this.aborted = true;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    async validate() {
      let valid = await this.validator(this.value);
      if (typeof valid === `string`) {
        this.errorMsg = valid;
        valid = false;
      }
      this.error = !valid;
    }
    async submit() {
      await this.validate();
      if (this.error) {
        this.color = `red`;
        this.fire();
        this.render();
        return;
      }
      let x = this.value;
      this.value = x !== `` ? x : this.initial;
      this.done = true;
      this.aborted = false;
      this.error = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    up() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min - this.inc;
      }
      if (this.value >= this.max)
        return this.bell();
      this.value += this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    down() {
      this.typed = ``;
      if (this.value === "") {
        this.value = this.min + this.inc;
      }
      if (this.value <= this.min)
        return this.bell();
      this.value -= this.inc;
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    delete() {
      let val = this.value.toString();
      if (val.length === 0)
        return this.bell();
      this.value = this.parse(val = val.slice(0, -1)) || ``;
      if (this.value !== "" && this.value < this.min) {
        this.value = this.min;
      }
      this.color = `cyan`;
      this.fire();
      this.render();
    }
    next() {
      this.value = this.initial;
      this.fire();
      this.render();
    }
    _(c, key) {
      if (!this.valid(c))
        return this.bell();
      const now = Date.now();
      if (now - this.lastHit > 1000)
        this.typed = ``;
      this.typed += c;
      this.lastHit = now;
      this.color = `cyan`;
      if (c === `.`)
        return this.fire();
      this.value = Math.min(this.parse(this.typed), this.max);
      if (this.value > this.max)
        this.value = this.max;
      if (this.value < this.min)
        this.value = this.min;
      this.fire();
      this.render();
    }
    render() {
      if (this.closed)
        return;
      if (!this.firstRender) {
        if (this.outputError)
          this.out.write(cursor.down(lines(this.outputError) - 1) + clear(this.outputError));
        this.out.write(clear(this.outputText));
      }
      super.render();
      this.outputError = "";
      this.outputText = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(this.done),
        !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered
      ].join(` `);
      if (this.error) {
        this.outputError += this.errorMsg.split(`
`).reduce((a, l, i) => a + `
${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
    }
  }
  module.exports = NumberPrompt;
});

// node_modules/prompts/lib/elements/multiselect.js
var require_multiselect2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var { cursor } = require_src();
  var Prompt = require_prompt2();
  var { clear, figures, style: style2, wrap, entriesToDisplay } = require_util2();

  class MultiselectPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.cursor = opts.cursor || 0;
      this.scrollIndex = opts.cursor || 0;
      this.hint = opts.hint || "";
      this.warn = opts.warn || "- This option is disabled -";
      this.minSelected = opts.min;
      this.showMinError = false;
      this.maxChoices = opts.max;
      this.instructions = opts.instructions;
      this.optionsPerPage = opts.optionsPerPage || 10;
      this.value = opts.choices.map((ch, idx) => {
        if (typeof ch === "string")
          ch = { title: ch, value: idx };
        return {
          title: ch && (ch.title || ch.value || ch),
          description: ch && ch.description,
          value: ch && (ch.value === undefined ? idx : ch.value),
          selected: ch && ch.selected,
          disabled: ch && ch.disabled
        };
      });
      this.clear = clear("");
      if (!opts.overrideRender) {
        this.render();
      }
    }
    reset() {
      this.value.map((v) => !v.selected);
      this.cursor = 0;
      this.fire();
      this.render();
    }
    selected() {
      return this.value.filter((v) => v.selected);
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      const selected = this.value.filter((e) => e.selected);
      if (this.minSelected && selected.length < this.minSelected) {
        this.showMinError = true;
        this.render();
      } else {
        this.done = true;
        this.aborted = false;
        this.fire();
        this.render();
        this.out.write(`
`);
        this.close();
      }
    }
    first() {
      this.cursor = 0;
      this.render();
    }
    last() {
      this.cursor = this.value.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.value.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.value.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.value.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.value[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.value[this.cursor].selected = true;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.value[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    toggleAll() {
      if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
        return this.bell();
      }
      const newSelected = !this.value[this.cursor].selected;
      this.value.filter((v) => !v.disabled).forEach((v) => v.selected = newSelected);
      this.render();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else if (c === "a") {
        this.toggleAll();
      } else {
        return this.bell();
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return `
Instructions:
` + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
` + (this.maxChoices === undefined ? `    a: Toggle all
` : "") + `    enter/return: Complete answer`;
      }
      return "";
    }
    renderOption(cursor2, v, i, arrowIndicator) {
      const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + " " + arrowIndicator + " ";
      let title, desc;
      if (v.disabled) {
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      } else {
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
        if (cursor2 === i && v.description) {
          desc = ` - ${v.description}`;
          if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
            desc = `
` + wrap(v.description, { margin: prefix.length, width: this.out.columns });
          }
        }
      }
      return prefix + title + color.gray(desc || "");
    }
    paginateOptions(options) {
      if (options.length === 0) {
        return color.red("No matches for this query.");
      }
      let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
      let prefix, styledOptions = [];
      for (let i = startIndex;i < endIndex; i++) {
        if (i === startIndex && startIndex > 0) {
          prefix = figures.arrowUp;
        } else if (i === endIndex - 1 && endIndex < options.length) {
          prefix = figures.arrowDown;
        } else {
          prefix = " ";
        }
        styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
      }
      return `
` + styledOptions.join(`
`);
    }
    renderOptions(options) {
      if (!this.done) {
        return this.paginateOptions(options);
      }
      return "";
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions()];
      if (this.value[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(false),
        this.renderDoneOrInstructions()
      ].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.value);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt);
    }
  }
  module.exports = MultiselectPrompt;
});

// node_modules/prompts/lib/elements/autocomplete.js
var require_autocomplete2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { erase, cursor } = require_src();
  var { style: style2, clear, figures, wrap, entriesToDisplay } = require_util2();
  var getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
  var getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
  var getIndex = (arr, valOrTitle) => {
    const index = arr.findIndex((el) => el.value === valOrTitle || el.title === valOrTitle);
    return index > -1 ? index : undefined;
  };

  class AutocompletePrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.suggest = opts.suggest;
      this.choices = opts.choices;
      this.initial = typeof opts.initial === "number" ? opts.initial : getIndex(opts.choices, opts.initial);
      this.select = this.initial || opts.cursor || 0;
      this.i18n = { noMatches: opts.noMatches || "no matches found" };
      this.fallback = opts.fallback || this.initial;
      this.suggestions = [];
      this.input = "";
      this.limit = opts.limit || 10;
      this.cursor = 0;
      this.transform = style2.render(opts.style);
      this.scale = this.transform.scale;
      this.render = this.render.bind(this);
      this.complete = this.complete.bind(this);
      this.clear = clear("");
      this.complete(this.render);
      this.render();
    }
    set fallback(fb) {
      this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
    }
    get fallback() {
      let choice;
      if (typeof this._fb === "number")
        choice = this.choices[this._fb];
      else if (typeof this._fb === "string")
        choice = { title: this._fb };
      return choice || this._fb || { title: this.i18n.noMatches };
    }
    moveSelect(i) {
      this.select = i;
      if (this.suggestions.length > 0)
        this.value = getVal(this.suggestions, i);
      else
        this.value = this.fallback.value;
      this.fire();
    }
    async complete(cb) {
      const p = this.completing = this.suggest(this.input, this.choices);
      const suggestions = await p;
      if (this.completing !== p)
        return;
      this.suggestions = suggestions.map((s, i, arr) => ({ title: getTitle(arr, i), value: getVal(arr, i), description: s.description }));
      this.completing = false;
      const l = Math.max(suggestions.length - 1, 0);
      this.moveSelect(Math.min(l, this.select));
      cb && cb();
    }
    reset() {
      this.input = "";
      this.complete(() => {
        this.moveSelect(this.initial !== undefined ? this.initial : 0);
        this.render();
      });
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    _(c, key) {
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${c}${s2}`;
      this.cursor = s1.length + 1;
      this.complete(this.render);
      this.render();
    }
    delete() {
      if (this.cursor === 0)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor - 1);
      let s2 = this.input.slice(this.cursor);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.cursor = this.cursor - 1;
      this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      let s1 = this.input.slice(0, this.cursor);
      let s2 = this.input.slice(this.cursor + 1);
      this.input = `${s1}${s2}`;
      this.complete(this.render);
      this.render();
    }
    first() {
      this.moveSelect(0);
      this.render();
    }
    last() {
      this.moveSelect(this.suggestions.length - 1);
      this.render();
    }
    up() {
      if (this.select <= 0)
        return this.bell();
      this.moveSelect(this.select - 1);
      this.render();
    }
    down() {
      if (this.select >= this.suggestions.length - 1)
        return this.bell();
      this.moveSelect(this.select + 1);
      this.render();
    }
    next() {
      if (this.select === this.suggestions.length - 1) {
        this.moveSelect(0);
      } else
        this.moveSelect(this.select + 1);
      this.render();
    }
    nextPage() {
      this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
      this.render();
    }
    prevPage() {
      this.moveSelect(Math.max(this.select - this.limit, 0));
      this.render();
    }
    left() {
      if (this.cursor <= 0)
        return this.bell();
      this.cursor = this.cursor - 1;
      this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length)
        return this.bell();
      this.cursor = this.cursor + 1;
      this.render();
    }
    renderOption(v, hovered, isStart, isEnd) {
      let desc;
      let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : " ";
      let title = hovered ? color.cyan().underline(v.title) : v.title;
      prefix = (hovered ? color.cyan(figures.pointer) + " " : "  ") + prefix;
      if (v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
          desc = `
` + wrap(v.description, { margin: 3, width: this.out.columns });
        }
      }
      return prefix + " " + title + color.gray(desc || "");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);
      this.outputText = [
        color.bold(style2.symbol(this.done, this.aborted)),
        color.bold(this.msg),
        style2.delimiter(this.completing),
        this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
      ].join(" ");
      if (!this.done) {
        const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join(`
`);
        this.outputText += `
` + (suggestions || color.gray(this.fallback.title));
      }
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = AutocompletePrompt;
});

// node_modules/prompts/lib/elements/autocompleteMultiselect.js
var require_autocompleteMultiselect2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var { cursor } = require_src();
  var MultiselectPrompt = require_multiselect2();
  var { clear, style: style2, figures } = require_util2();

  class AutocompleteMultiselectPrompt extends MultiselectPrompt {
    constructor(opts = {}) {
      opts.overrideRender = true;
      super(opts);
      this.inputValue = "";
      this.clear = clear("");
      this.filteredOptions = this.value;
      this.render();
    }
    last() {
      this.cursor = this.filteredOptions.length - 1;
      this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.filteredOptions.length;
      this.render();
    }
    up() {
      if (this.cursor === 0) {
        this.cursor = this.filteredOptions.length - 1;
      } else {
        this.cursor--;
      }
      this.render();
    }
    down() {
      if (this.cursor === this.filteredOptions.length - 1) {
        this.cursor = 0;
      } else {
        this.cursor++;
      }
      this.render();
    }
    left() {
      this.filteredOptions[this.cursor].selected = false;
      this.render();
    }
    right() {
      if (this.value.filter((e) => e.selected).length >= this.maxChoices)
        return this.bell();
      this.filteredOptions[this.cursor].selected = true;
      this.render();
    }
    delete() {
      if (this.inputValue.length) {
        this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
        this.updateFilteredOptions();
      }
    }
    updateFilteredOptions() {
      const currentHighlight = this.filteredOptions[this.cursor];
      this.filteredOptions = this.value.filter((v) => {
        if (this.inputValue) {
          if (typeof v.title === "string") {
            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          if (typeof v.value === "string") {
            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          return false;
        }
        return true;
      });
      const newHighlightIndex = this.filteredOptions.findIndex((v) => v === currentHighlight);
      this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
      this.render();
    }
    handleSpaceToggle() {
      const v = this.filteredOptions[this.cursor];
      if (v.selected) {
        v.selected = false;
        this.render();
      } else if (v.disabled || this.value.filter((e) => e.selected).length >= this.maxChoices) {
        return this.bell();
      } else {
        v.selected = true;
        this.render();
      }
    }
    handleInputChange(c) {
      this.inputValue = this.inputValue + c;
      this.updateFilteredOptions();
    }
    _(c, key) {
      if (c === " ") {
        this.handleSpaceToggle();
      } else {
        this.handleInputChange(c);
      }
    }
    renderInstructions() {
      if (this.instructions === undefined || this.instructions) {
        if (typeof this.instructions === "string") {
          return this.instructions;
        }
        return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
      }
      return "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray("Enter something to filter")}
`;
    }
    renderOption(cursor2, v, i) {
      let title;
      if (v.disabled)
        title = cursor2 === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
      else
        title = cursor2 === i ? color.cyan().underline(v.title) : v.title;
      return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + "  " + title;
    }
    renderDoneOrInstructions() {
      if (this.done) {
        return this.value.filter((e) => e.selected).map((v) => v.title).join(", ");
      }
      const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
        output.push(color.yellow(this.warn));
      }
      return output.join(" ");
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      super.render();
      let prompt = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(false),
        this.renderDoneOrInstructions()
      ].join(" ");
      if (this.showMinError) {
        prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
        this.showMinError = false;
      }
      prompt += this.renderOptions(this.filteredOptions);
      this.out.write(this.clear + prompt);
      this.clear = clear(prompt);
    }
  }
  module.exports = AutocompleteMultiselectPrompt;
});

// node_modules/prompts/lib/elements/confirm.js
var require_confirm2 = __commonJS((exports, module) => {
  var color = require_kleur();
  var Prompt = require_prompt2();
  var { style: style2, clear } = require_util2();
  var { erase, cursor } = require_src();

  class ConfirmPrompt extends Prompt {
    constructor(opts = {}) {
      super(opts);
      this.msg = opts.message;
      this.value = opts.initial;
      this.initialValue = !!opts.initial;
      this.yesMsg = opts.yes || "yes";
      this.yesOption = opts.yesOption || "(Y/n)";
      this.noMsg = opts.no || "no";
      this.noOption = opts.noOption || "(y/N)";
      this.render();
    }
    reset() {
      this.value = this.initialValue;
      this.fire();
      this.render();
    }
    abort() {
      this.done = this.aborted = true;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    submit() {
      this.value = this.value || false;
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write(`
`);
      this.close();
    }
    _(c, key) {
      if (c.toLowerCase() === "y") {
        this.value = true;
        return this.submit();
      }
      if (c.toLowerCase() === "n") {
        this.value = false;
        return this.submit();
      }
      return this.bell();
    }
    render() {
      if (this.closed)
        return;
      if (this.firstRender)
        this.out.write(cursor.hide);
      else
        this.out.write(clear(this.outputText));
      super.render();
      this.outputText = [
        style2.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style2.delimiter(this.done),
        this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)
      ].join(" ");
      this.out.write(erase.line + cursor.to(0) + this.outputText);
    }
  }
  module.exports = ConfirmPrompt;
});

// node_modules/prompts/lib/elements/index.js
var require_elements2 = __commonJS((exports, module) => {
  module.exports = {
    TextPrompt: require_text2(),
    SelectPrompt: require_select2(),
    TogglePrompt: require_toggle2(),
    DatePrompt: require_date2(),
    NumberPrompt: require_number2(),
    MultiselectPrompt: require_multiselect2(),
    AutocompletePrompt: require_autocomplete2(),
    AutocompleteMultiselectPrompt: require_autocompleteMultiselect2(),
    ConfirmPrompt: require_confirm2()
  };
});

// node_modules/prompts/lib/prompts.js
var require_prompts2 = __commonJS((exports) => {
  var $ = exports;
  var el = require_elements2();
  var noop = (v) => v;
  function toPrompt(type, args, opts = {}) {
    return new Promise((res, rej) => {
      const p = new el[type](args);
      const onAbort = opts.onAbort || noop;
      const onSubmit = opts.onSubmit || noop;
      p.on("state", args.onState || noop);
      p.on("submit", (x) => res(onSubmit(x)));
      p.on("abort", (x) => rej(onAbort(x)));
    });
  }
  $.text = (args) => toPrompt("TextPrompt", args);
  $.password = (args) => {
    args.style = "password";
    return $.text(args);
  };
  $.invisible = (args) => {
    args.style = "invisible";
    return $.text(args);
  };
  $.number = (args) => toPrompt("NumberPrompt", args);
  $.date = (args) => toPrompt("DatePrompt", args);
  $.confirm = (args) => toPrompt("ConfirmPrompt", args);
  $.list = (args) => {
    const sep = args.separator || ",";
    return toPrompt("TextPrompt", args, {
      onSubmit: (str) => str.split(sep).map((s) => s.trim())
    });
  };
  $.toggle = (args) => toPrompt("TogglePrompt", args);
  $.select = (args) => toPrompt("SelectPrompt", args);
  $.multiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("MultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  $.autocompleteMultiselect = (args) => {
    args.choices = [].concat(args.choices || []);
    const toSelected = (items) => items.filter((item) => item.selected).map((item) => item.value);
    return toPrompt("AutocompleteMultiselectPrompt", args, {
      onAbort: toSelected,
      onSubmit: toSelected
    });
  };
  var byTitle = (input, choices) => Promise.resolve(choices.filter((item) => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
  $.autocomplete = (args) => {
    args.suggest = args.suggest || byTitle;
    args.choices = [].concat(args.choices || []);
    return toPrompt("AutocompletePrompt", args);
  };
});

// node_modules/prompts/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var prompts = require_prompts2();
  var passOn = ["suggest", "format", "onState", "validate", "onRender", "type"];
  var noop = () => {};
  async function prompt(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
    const answers = {};
    const override2 = prompt._override || {};
    questions = [].concat(questions);
    let answer, question, quit, name, type, lastPrompt;
    const getFormattedAnswer = async (question2, answer2, skipValidation = false) => {
      if (!skipValidation && question2.validate && question2.validate(answer2) !== true) {
        return;
      }
      return question2.format ? await question2.format(answer2, answers) : answer2;
    };
    for (question of questions) {
      ({ name, type } = question);
      if (typeof type === "function") {
        type = await type(answer, { ...answers }, question);
        question["type"] = type;
      }
      if (!type)
        continue;
      for (let key in question) {
        if (passOn.includes(key))
          continue;
        let value = question[key];
        question[key] = typeof value === "function" ? await value(answer, { ...answers }, lastPrompt) : value;
      }
      lastPrompt = question;
      if (typeof question.message !== "string") {
        throw new Error("prompt message is required");
      }
      ({ name, type } = question);
      if (prompts[type] === undefined) {
        throw new Error(`prompt type (${type}) is not defined`);
      }
      if (override2[question.name] !== undefined) {
        answer = await getFormattedAnswer(question, override2[question.name]);
        if (answer !== undefined) {
          answers[name] = answer;
          continue;
        }
      }
      try {
        answer = prompt._injected ? getInjectedAnswer(prompt._injected) : await prompts[type](question);
        answers[name] = answer = await getFormattedAnswer(question, answer, true);
        quit = await onSubmit(question, answer, answers);
      } catch (err) {
        quit = !await onCancel(question, answers);
      }
      if (quit)
        return answers;
    }
    return answers;
  }
  function getInjectedAnswer(injected) {
    const answer = injected.shift();
    if (answer instanceof Error) {
      throw answer;
    }
    return answer;
  }
  function inject(answers) {
    prompt._injected = (prompt._injected || []).concat(answers);
  }
  function override(answers) {
    prompt._override = Object.assign({}, answers);
  }
  module.exports = Object.assign(prompt, { prompt, prompts, inject, override });
});

// node_modules/prompts/index.js
var require_prompts3 = __commonJS((exports, module) => {
  function isNodeLT(tar) {
    tar = (Array.isArray(tar) ? tar : tar.split(".")).map(Number);
    let i = 0, src = process.versions.node.split(".").map(Number);
    for (;i < tar.length; i++) {
      if (src[i] > tar[i])
        return false;
      if (tar[i] > src[i])
        return true;
    }
    return false;
  }
  module.exports = isNodeLT("8.6.0") ? require_dist() : require_lib();
});

// node_modules/fs-extra/node_modules/universalify/index.js
var require_universalify = __commonJS((exports) => {
  exports.fromCallback = function(fn) {
    return Object.defineProperty(function(...args) {
      if (typeof args[args.length - 1] === "function")
        fn.apply(this, args);
      else {
        return new Promise((resolve, reject) => {
          fn.apply(this, args.concat([(err, res) => err ? reject(err) : resolve(res)]));
        });
      }
    }, "name", { value: fn.name });
  };
  exports.fromPromise = function(fn) {
    return Object.defineProperty(function(...args) {
      const cb = args[args.length - 1];
      if (typeof cb !== "function")
        return fn.apply(this, args);
      else
        fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
    }, "name", { value: fn.name });
  };
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS((exports, module) => {
  var constants = __require("constants");
  var origCwd = process.cwd;
  var cwd = null;
  var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    if (!cwd)
      cwd = origCwd.call(process);
    return cwd;
  };
  try {
    process.cwd();
  } catch (er) {}
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  module.exports = patch;
  function patch(fs2) {
    if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
      patchLchmod(fs2);
    }
    if (!fs2.lutimes) {
      patchLutimes(fs2);
    }
    fs2.chown = chownFix(fs2.chown);
    fs2.fchown = chownFix(fs2.fchown);
    fs2.lchown = chownFix(fs2.lchown);
    fs2.chmod = chmodFix(fs2.chmod);
    fs2.fchmod = chmodFix(fs2.fchmod);
    fs2.lchmod = chmodFix(fs2.lchmod);
    fs2.chownSync = chownFixSync(fs2.chownSync);
    fs2.fchownSync = chownFixSync(fs2.fchownSync);
    fs2.lchownSync = chownFixSync(fs2.lchownSync);
    fs2.chmodSync = chmodFixSync(fs2.chmodSync);
    fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
    fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
    fs2.stat = statFix(fs2.stat);
    fs2.fstat = statFix(fs2.fstat);
    fs2.lstat = statFix(fs2.lstat);
    fs2.statSync = statFixSync(fs2.statSync);
    fs2.fstatSync = statFixSync(fs2.fstatSync);
    fs2.lstatSync = statFixSync(fs2.lstatSync);
    if (!fs2.lchmod) {
      fs2.lchmod = function(path2, mode, cb) {
        if (cb)
          process.nextTick(cb);
      };
      fs2.lchmodSync = function() {};
    }
    if (!fs2.lchown) {
      fs2.lchown = function(path2, uid, gid, cb) {
        if (cb)
          process.nextTick(cb);
      };
      fs2.lchownSync = function() {};
    }
    if (platform === "win32") {
      fs2.rename = function(fs$rename) {
        return function(from, to, cb) {
          var start = Date.now();
          var backoff = 0;
          fs$rename(from, to, function CB(er) {
            if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 60000) {
              setTimeout(function() {
                fs2.stat(to, function(stater, st) {
                  if (stater && stater.code === "ENOENT")
                    fs$rename(from, to, CB);
                  else
                    cb(er);
                });
              }, backoff);
              if (backoff < 100)
                backoff += 10;
              return;
            }
            if (cb)
              cb(er);
          });
        };
      }(fs2.rename);
    }
    fs2.read = function(fs$read) {
      return function(fd, buffer, offset, length, position, callback_) {
        var callback;
        if (callback_ && typeof callback_ === "function") {
          var eagCounter = 0;
          callback = function(er, _, __) {
            if (er && er.code === "EAGAIN" && eagCounter < 10) {
              eagCounter++;
              return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
            }
            callback_.apply(this, arguments);
          };
        }
        return fs$read.call(fs2, fd, buffer, offset, length, position, callback);
      };
    }(fs2.read);
    fs2.readSync = function(fs$readSync) {
      return function(fd, buffer, offset, length, position) {
        var eagCounter = 0;
        while (true) {
          try {
            return fs$readSync.call(fs2, fd, buffer, offset, length, position);
          } catch (er) {
            if (er.code === "EAGAIN" && eagCounter < 10) {
              eagCounter++;
              continue;
            }
            throw er;
          }
        }
      };
    }(fs2.readSync);
    function patchLchmod(fs3) {
      fs3.lchmod = function(path2, mode, callback) {
        fs3.open(path2, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
          if (err) {
            if (callback)
              callback(err);
            return;
          }
          fs3.fchmod(fd, mode, function(err2) {
            fs3.close(fd, function(err22) {
              if (callback)
                callback(err2 || err22);
            });
          });
        });
      };
      fs3.lchmodSync = function(path2, mode) {
        var fd = fs3.openSync(path2, constants.O_WRONLY | constants.O_SYMLINK, mode);
        var threw = true;
        var ret;
        try {
          ret = fs3.fchmodSync(fd, mode);
          threw = false;
        } finally {
          if (threw) {
            try {
              fs3.closeSync(fd);
            } catch (er) {}
          } else {
            fs3.closeSync(fd);
          }
        }
        return ret;
      };
    }
    function patchLutimes(fs3) {
      if (constants.hasOwnProperty("O_SYMLINK")) {
        fs3.lutimes = function(path2, at, mt, cb) {
          fs3.open(path2, constants.O_SYMLINK, function(er, fd) {
            if (er) {
              if (cb)
                cb(er);
              return;
            }
            fs3.futimes(fd, at, mt, function(er2) {
              fs3.close(fd, function(er22) {
                if (cb)
                  cb(er2 || er22);
              });
            });
          });
        };
        fs3.lutimesSync = function(path2, at, mt) {
          var fd = fs3.openSync(path2, constants.O_SYMLINK);
          var ret;
          var threw = true;
          try {
            ret = fs3.futimesSync(fd, at, mt);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs3.closeSync(fd);
              } catch (er) {}
            } else {
              fs3.closeSync(fd);
            }
          }
          return ret;
        };
      } else {
        fs3.lutimes = function(_a, _b, _c, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs3.lutimesSync = function() {};
      }
    }
    function chmodFix(orig) {
      if (!orig)
        return orig;
      return function(target, mode, cb) {
        return orig.call(fs2, target, mode, function(er) {
          if (chownErOk(er))
            er = null;
          if (cb)
            cb.apply(this, arguments);
        });
      };
    }
    function chmodFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, mode) {
        try {
          return orig.call(fs2, target, mode);
        } catch (er) {
          if (!chownErOk(er))
            throw er;
        }
      };
    }
    function chownFix(orig) {
      if (!orig)
        return orig;
      return function(target, uid, gid, cb) {
        return orig.call(fs2, target, uid, gid, function(er) {
          if (chownErOk(er))
            er = null;
          if (cb)
            cb.apply(this, arguments);
        });
      };
    }
    function chownFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, uid, gid) {
        try {
          return orig.call(fs2, target, uid, gid);
        } catch (er) {
          if (!chownErOk(er))
            throw er;
        }
      };
    }
    function statFix(orig) {
      if (!orig)
        return orig;
      return function(target, options, cb) {
        if (typeof options === "function") {
          cb = options;
          options = null;
        }
        function callback(er, stats) {
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          if (cb)
            cb.apply(this, arguments);
        }
        return options ? orig.call(fs2, target, options, callback) : orig.call(fs2, target, callback);
      };
    }
    function statFixSync(orig) {
      if (!orig)
        return orig;
      return function(target, options) {
        var stats = options ? orig.call(fs2, target, options) : orig.call(fs2, target);
        if (stats.uid < 0)
          stats.uid += 4294967296;
        if (stats.gid < 0)
          stats.gid += 4294967296;
        return stats;
      };
    }
    function chownErOk(er) {
      if (!er)
        return true;
      if (er.code === "ENOSYS")
        return true;
      var nonroot = !process.getuid || process.getuid() !== 0;
      if (nonroot) {
        if (er.code === "EINVAL" || er.code === "EPERM")
          return true;
      }
      return false;
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS((exports, module) => {
  var Stream = __require("stream").Stream;
  module.exports = legacy;
  function legacy(fs2) {
    return {
      ReadStream,
      WriteStream
    };
    function ReadStream(path2, options) {
      if (!(this instanceof ReadStream))
        return new ReadStream(path2, options);
      Stream.call(this);
      var self = this;
      this.path = path2;
      this.fd = null;
      this.readable = true;
      this.paused = false;
      this.flags = "r";
      this.mode = 438;
      this.bufferSize = 64 * 1024;
      options = options || {};
      var keys = Object.keys(options);
      for (var index = 0, length = keys.length;index < length; index++) {
        var key = keys[index];
        this[key] = options[key];
      }
      if (this.encoding)
        this.setEncoding(this.encoding);
      if (this.start !== undefined) {
        if (typeof this.start !== "number") {
          throw TypeError("start must be a Number");
        }
        if (this.end === undefined) {
          this.end = Infinity;
        } else if (typeof this.end !== "number") {
          throw TypeError("end must be a Number");
        }
        if (this.start > this.end) {
          throw new Error("start must be <= end");
        }
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          self._read();
        });
        return;
      }
      fs2.open(this.path, this.flags, this.mode, function(err, fd) {
        if (err) {
          self.emit("error", err);
          self.readable = false;
          return;
        }
        self.fd = fd;
        self.emit("open", fd);
        self._read();
      });
    }
    function WriteStream(path2, options) {
      if (!(this instanceof WriteStream))
        return new WriteStream(path2, options);
      Stream.call(this);
      this.path = path2;
      this.fd = null;
      this.writable = true;
      this.flags = "w";
      this.encoding = "binary";
      this.mode = 438;
      this.bytesWritten = 0;
      options = options || {};
      var keys = Object.keys(options);
      for (var index = 0, length = keys.length;index < length; index++) {
        var key = keys[index];
        this[key] = options[key];
      }
      if (this.start !== undefined) {
        if (typeof this.start !== "number") {
          throw TypeError("start must be a Number");
        }
        if (this.start < 0) {
          throw new Error("start must be >= zero");
        }
        this.pos = this.start;
      }
      this.busy = false;
      this._queue = [];
      if (this.fd === null) {
        this._open = fs2.open;
        this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
        this.flush();
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS((exports, module) => {
  module.exports = clone;
  function clone(obj) {
    if (obj === null || typeof obj !== "object")
      return obj;
    if (obj instanceof Object)
      var copy = { __proto__: obj.__proto__ };
    else
      var copy = Object.create(null);
    Object.getOwnPropertyNames(obj).forEach(function(key) {
      Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    });
    return copy;
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS((exports, module) => {
  var fs2 = __require("fs");
  var polyfills = require_polyfills();
  var legacy = require_legacy_streams();
  var clone = require_clone();
  var queue = [];
  var util = __require("util");
  function noop() {}
  var debug = noop;
  if (util.debuglog)
    debug = util.debuglog("gfs4");
  else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
    debug = function() {
      var m = util.format.apply(util, arguments);
      m = "GFS4: " + m.split(/\n/).join(`
GFS4: `);
      console.error(m);
    };
  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
    process.on("exit", function() {
      debug(queue);
      __require("assert").equal(queue.length, 0);
    });
  }
  module.exports = patch(clone(fs2));
  if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs2.__patched) {
    module.exports = patch(fs2);
    fs2.__patched = true;
  }
  module.exports.close = function(fs$close) {
    return function(fd, cb) {
      return fs$close.call(fs2, fd, function(err) {
        if (!err)
          retry();
        if (typeof cb === "function")
          cb.apply(this, arguments);
      });
    };
  }(fs2.close);
  module.exports.closeSync = function(fs$closeSync) {
    return function(fd) {
      var rval = fs$closeSync.apply(fs2, arguments);
      retry();
      return rval;
    };
  }(fs2.closeSync);
  if (!/\bgraceful-fs\b/.test(fs2.closeSync.toString())) {
    fs2.closeSync = module.exports.closeSync;
    fs2.close = module.exports.close;
  }
  function patch(fs3) {
    polyfills(fs3);
    fs3.gracefulify = patch;
    fs3.FileReadStream = ReadStream;
    fs3.FileWriteStream = WriteStream;
    fs3.createReadStream = createReadStream;
    fs3.createWriteStream = createWriteStream;
    var fs$readFile = fs3.readFile;
    fs3.readFile = readFile;
    function readFile(path2, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$readFile(path2, options, cb);
      function go$readFile(path3, options2, cb2) {
        return fs$readFile(path3, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$readFile, [path3, options2, cb2]]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
            retry();
          }
        });
      }
    }
    var fs$writeFile = fs3.writeFile;
    fs3.writeFile = writeFile;
    function writeFile(path2, data, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$writeFile(path2, data, options, cb);
      function go$writeFile(path3, data2, options2, cb2) {
        return fs$writeFile(path3, data2, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$writeFile, [path3, data2, options2, cb2]]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
            retry();
          }
        });
      }
    }
    var fs$appendFile = fs3.appendFile;
    if (fs$appendFile)
      fs3.appendFile = appendFile;
    function appendFile(path2, data, options, cb) {
      if (typeof options === "function")
        cb = options, options = null;
      return go$appendFile(path2, data, options, cb);
      function go$appendFile(path3, data2, options2, cb2) {
        return fs$appendFile(path3, data2, options2, function(err) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$appendFile, [path3, data2, options2, cb2]]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
            retry();
          }
        });
      }
    }
    var fs$readdir = fs3.readdir;
    fs3.readdir = readdir;
    function readdir(path2, options, cb) {
      var args = [path2];
      if (typeof options !== "function") {
        args.push(options);
      } else {
        cb = options;
      }
      args.push(go$readdir$cb);
      return go$readdir(args);
      function go$readdir$cb(err, files) {
        if (files && files.sort)
          files.sort();
        if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
          enqueue([go$readdir, [args]]);
        else {
          if (typeof cb === "function")
            cb.apply(this, arguments);
          retry();
        }
      }
    }
    function go$readdir(args) {
      return fs$readdir.apply(fs3, args);
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var legStreams = legacy(fs3);
      ReadStream = legStreams.ReadStream;
      WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs3.ReadStream;
    if (fs$ReadStream) {
      ReadStream.prototype = Object.create(fs$ReadStream.prototype);
      ReadStream.prototype.open = ReadStream$open;
    }
    var fs$WriteStream = fs3.WriteStream;
    if (fs$WriteStream) {
      WriteStream.prototype = Object.create(fs$WriteStream.prototype);
      WriteStream.prototype.open = WriteStream$open;
    }
    fs3.ReadStream = ReadStream;
    fs3.WriteStream = WriteStream;
    function ReadStream(path2, options) {
      if (this instanceof ReadStream)
        return fs$ReadStream.apply(this, arguments), this;
      else
        return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
      var that = this;
      open(that.path, that.flags, that.mode, function(err, fd) {
        if (err) {
          if (that.autoClose)
            that.destroy();
          that.emit("error", err);
        } else {
          that.fd = fd;
          that.emit("open", fd);
          that.read();
        }
      });
    }
    function WriteStream(path2, options) {
      if (this instanceof WriteStream)
        return fs$WriteStream.apply(this, arguments), this;
      else
        return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
      var that = this;
      open(that.path, that.flags, that.mode, function(err, fd) {
        if (err) {
          that.destroy();
          that.emit("error", err);
        } else {
          that.fd = fd;
          that.emit("open", fd);
        }
      });
    }
    function createReadStream(path2, options) {
      return new ReadStream(path2, options);
    }
    function createWriteStream(path2, options) {
      return new WriteStream(path2, options);
    }
    var fs$open = fs3.open;
    fs3.open = open;
    function open(path2, flags, mode, cb) {
      if (typeof mode === "function")
        cb = mode, mode = null;
      return go$open(path2, flags, mode, cb);
      function go$open(path3, flags2, mode2, cb2) {
        return fs$open(path3, flags2, mode2, function(err, fd) {
          if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
            enqueue([go$open, [path3, flags2, mode2, cb2]]);
          else {
            if (typeof cb2 === "function")
              cb2.apply(this, arguments);
            retry();
          }
        });
      }
    }
    return fs3;
  }
  function enqueue(elem) {
    debug("ENQUEUE", elem[0].name, elem[1]);
    queue.push(elem);
  }
  function retry() {
    var elem = queue.shift();
    if (elem) {
      debug("RETRY", elem[0].name, elem[1]);
      elem[0].apply(null, elem[1]);
    }
  }
});

// node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS((exports) => {
  var u = require_universalify().fromCallback;
  var fs2 = require_graceful_fs();
  var api = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((key) => {
    return typeof fs2[key] === "function";
  });
  Object.keys(fs2).forEach((key) => {
    if (key === "promises") {
      return;
    }
    exports[key] = fs2[key];
  });
  api.forEach((method) => {
    exports[method] = u(fs2[method]);
  });
  exports.exists = function(filename, callback) {
    if (typeof callback === "function") {
      return fs2.exists(filename, callback);
    }
    return new Promise((resolve) => {
      return fs2.exists(filename, resolve);
    });
  };
  exports.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === "function") {
      return fs2.read(fd, buffer, offset, length, position, callback);
    }
    return new Promise((resolve, reject) => {
      fs2.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
        if (err)
          return reject(err);
        resolve({ bytesRead, buffer: buffer2 });
      });
    });
  };
  exports.write = function(fd, buffer, ...args) {
    if (typeof args[args.length - 1] === "function") {
      return fs2.write(fd, buffer, ...args);
    }
    return new Promise((resolve, reject) => {
      fs2.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
        if (err)
          return reject(err);
        resolve({ bytesWritten, buffer: buffer2 });
      });
    });
  };
  if (typeof fs2.writev === "function") {
    exports.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs2.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs2.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
  }
  if (typeof fs2.realpath.native === "function") {
    exports.realpath.native = u(fs2.realpath.native);
  }
});

// node_modules/at-least-node/index.js
var require_at_least_node = __commonJS((exports, module) => {
  module.exports = (r) => {
    const n = process.versions.node.split(".").map((x) => parseInt(x, 10));
    r = r.split(".").map((x) => parseInt(x, 10));
    return n[0] > r[0] || n[0] === r[0] && (n[1] > r[1] || n[1] === r[1] && n[2] >= r[2]);
  };
});

// node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS((exports, module) => {
  var fs2 = require_fs();
  var path2 = __require("path");
  var atLeastNode = require_at_least_node();
  var useNativeRecursiveOption = atLeastNode("10.12.0");
  var checkPath = (pth) => {
    if (process.platform === "win32") {
      const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path2.parse(pth).root, ""));
      if (pathHasInvalidWinCharacters) {
        const error = new Error(`Path contains invalid characters: ${pth}`);
        error.code = "EINVAL";
        throw error;
      }
    }
  };
  var processOptions = (options) => {
    const defaults = { mode: 511 & ~process.umask() };
    if (typeof options === "number")
      options = { mode: options };
    return { ...defaults, ...options };
  };
  var permissionError = (pth) => {
    const error = new Error(`operation not permitted, mkdir '${pth}'`);
    error.code = "EPERM";
    error.errno = -4048;
    error.path = pth;
    error.syscall = "mkdir";
    return error;
  };
  exports.makeDir = async (input, options) => {
    checkPath(input);
    options = processOptions(options);
    if (useNativeRecursiveOption) {
      const pth = path2.resolve(input);
      return fs2.mkdir(pth, {
        mode: options.mode,
        recursive: true
      });
    }
    const make = async (pth) => {
      try {
        await fs2.mkdir(pth, options.mode);
      } catch (error) {
        if (error.code === "EPERM") {
          throw error;
        }
        if (error.code === "ENOENT") {
          if (path2.dirname(pth) === pth) {
            throw permissionError(pth);
          }
          if (error.message.includes("null bytes")) {
            throw error;
          }
          await make(path2.dirname(pth));
          return make(pth);
        }
        try {
          const stats = await fs2.stat(pth);
          if (!stats.isDirectory()) {
            throw new Error("The path is not a directory");
          }
        } catch {
          throw error;
        }
      }
    };
    return make(path2.resolve(input));
  };
  exports.makeDirSync = (input, options) => {
    checkPath(input);
    options = processOptions(options);
    if (useNativeRecursiveOption) {
      const pth = path2.resolve(input);
      return fs2.mkdirSync(pth, {
        mode: options.mode,
        recursive: true
      });
    }
    const make = (pth) => {
      try {
        fs2.mkdirSync(pth, options.mode);
      } catch (error) {
        if (error.code === "EPERM") {
          throw error;
        }
        if (error.code === "ENOENT") {
          if (path2.dirname(pth) === pth) {
            throw permissionError(pth);
          }
          if (error.message.includes("null bytes")) {
            throw error;
          }
          make(path2.dirname(pth));
          return make(pth);
        }
        try {
          if (!fs2.statSync(pth).isDirectory()) {
            throw new Error("The path is not a directory");
          }
        } catch {
          throw error;
        }
      }
    };
    return make(path2.resolve(input));
  };
});

// node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS((exports, module) => {
  var u = require_universalify().fromPromise;
  var { makeDir: _makeDir, makeDirSync } = require_make_dir();
  var makeDir = u(_makeDir);
  module.exports = {
    mkdirs: makeDir,
    mkdirsSync: makeDirSync,
    mkdirp: makeDir,
    mkdirpSync: makeDirSync,
    ensureDir: makeDir,
    ensureDirSync: makeDirSync
  };
});

// node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  function utimesMillis(path2, atime, mtime, callback) {
    fs2.open(path2, "r+", (err, fd) => {
      if (err)
        return callback(err);
      fs2.futimes(fd, atime, mtime, (futimesErr) => {
        fs2.close(fd, (closeErr) => {
          if (callback)
            callback(futimesErr || closeErr);
        });
      });
    });
  }
  function utimesMillisSync(path2, atime, mtime) {
    const fd = fs2.openSync(path2, "r+");
    fs2.futimesSync(fd, atime, mtime);
    return fs2.closeSync(fd);
  }
  module.exports = {
    utimesMillis,
    utimesMillisSync
  };
});

// node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS((exports, module) => {
  var fs2 = require_fs();
  var path2 = __require("path");
  var util = __require("util");
  var atLeastNode = require_at_least_node();
  var nodeSupportsBigInt = atLeastNode("10.5.0");
  var stat = (file) => nodeSupportsBigInt ? fs2.stat(file, { bigint: true }) : fs2.stat(file);
  var statSync = (file) => nodeSupportsBigInt ? fs2.statSync(file, { bigint: true }) : fs2.statSync(file);
  function getStats(src, dest) {
    return Promise.all([
      stat(src),
      stat(dest).catch((err) => {
        if (err.code === "ENOENT")
          return null;
        throw err;
      })
    ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
  }
  function getStatsSync(src, dest) {
    let destStat;
    const srcStat = statSync(src);
    try {
      destStat = statSync(dest);
    } catch (err) {
      if (err.code === "ENOENT")
        return { srcStat, destStat: null };
      throw err;
    }
    return { srcStat, destStat };
  }
  function checkPaths(src, dest, funcName, cb) {
    util.callbackify(getStats)(src, dest, (err, stats) => {
      if (err)
        return cb(err);
      const { srcStat, destStat } = stats;
      if (destStat && areIdentical(srcStat, destStat)) {
        return cb(new Error("Source and destination must not be the same."));
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        return cb(new Error(errMsg(src, dest, funcName)));
      }
      return cb(null, { srcStat, destStat });
    });
  }
  function checkPathsSync(src, dest, funcName) {
    const { srcStat, destStat } = getStatsSync(src, dest);
    if (destStat && areIdentical(srcStat, destStat)) {
      throw new Error("Source and destination must not be the same.");
    }
    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      throw new Error(errMsg(src, dest, funcName));
    }
    return { srcStat, destStat };
  }
  function checkParentPaths(src, srcStat, dest, funcName, cb) {
    const srcParent = path2.resolve(path2.dirname(src));
    const destParent = path2.resolve(path2.dirname(dest));
    if (destParent === srcParent || destParent === path2.parse(destParent).root)
      return cb();
    const callback = (err, destStat) => {
      if (err) {
        if (err.code === "ENOENT")
          return cb();
        return cb(err);
      }
      if (areIdentical(srcStat, destStat)) {
        return cb(new Error(errMsg(src, dest, funcName)));
      }
      return checkParentPaths(src, srcStat, destParent, funcName, cb);
    };
    if (nodeSupportsBigInt)
      fs2.stat(destParent, { bigint: true }, callback);
    else
      fs2.stat(destParent, callback);
  }
  function checkParentPathsSync(src, srcStat, dest, funcName) {
    const srcParent = path2.resolve(path2.dirname(src));
    const destParent = path2.resolve(path2.dirname(dest));
    if (destParent === srcParent || destParent === path2.parse(destParent).root)
      return;
    let destStat;
    try {
      destStat = statSync(destParent);
    } catch (err) {
      if (err.code === "ENOENT")
        return;
      throw err;
    }
    if (areIdentical(srcStat, destStat)) {
      throw new Error(errMsg(src, dest, funcName));
    }
    return checkParentPathsSync(src, srcStat, destParent, funcName);
  }
  function areIdentical(srcStat, destStat) {
    if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
      if (nodeSupportsBigInt || destStat.ino < Number.MAX_SAFE_INTEGER) {
        return true;
      }
      if (destStat.size === srcStat.size && destStat.mode === srcStat.mode && destStat.nlink === srcStat.nlink && destStat.atimeMs === srcStat.atimeMs && destStat.mtimeMs === srcStat.mtimeMs && destStat.ctimeMs === srcStat.ctimeMs && destStat.birthtimeMs === srcStat.birthtimeMs) {
        return true;
      }
    }
    return false;
  }
  function isSrcSubdir(src, dest) {
    const srcArr = path2.resolve(src).split(path2.sep).filter((i) => i);
    const destArr = path2.resolve(dest).split(path2.sep).filter((i) => i);
    return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
  }
  function errMsg(src, dest, funcName) {
    return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
  }
  module.exports = {
    checkPaths,
    checkPathsSync,
    checkParentPaths,
    checkParentPathsSync,
    isSrcSubdir
  };
});

// node_modules/fs-extra/lib/copy-sync/copy-sync.js
var require_copy_sync = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var mkdirsSync = require_mkdirs().mkdirsSync;
  var utimesMillisSync = require_utimes().utimesMillisSync;
  var stat = require_stat();
  function copySync(src, dest, opts) {
    if (typeof opts === "function") {
      opts = { filter: opts };
    }
    opts = opts || {};
    opts.clobber = "clobber" in opts ? !!opts.clobber : true;
    opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
    if (opts.preserveTimestamps && process.arch === "ia32") {
      console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
    }
    const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy");
    stat.checkParentPathsSync(src, srcStat, dest, "copy");
    return handleFilterAndCopy(destStat, src, dest, opts);
  }
  function handleFilterAndCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest))
      return;
    const destParent = path2.dirname(dest);
    if (!fs2.existsSync(destParent))
      mkdirsSync(destParent);
    return startCopy(destStat, src, dest, opts);
  }
  function startCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest))
      return;
    return getStats(destStat, src, dest, opts);
  }
  function getStats(destStat, src, dest, opts) {
    const statSync = opts.dereference ? fs2.statSync : fs2.lstatSync;
    const srcStat = statSync(src);
    if (srcStat.isDirectory())
      return onDir(srcStat, destStat, src, dest, opts);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
      return onFile(srcStat, destStat, src, dest, opts);
    else if (srcStat.isSymbolicLink())
      return onLink(destStat, src, dest, opts);
  }
  function onFile(srcStat, destStat, src, dest, opts) {
    if (!destStat)
      return copyFile(srcStat, src, dest, opts);
    return mayCopyFile(srcStat, src, dest, opts);
  }
  function mayCopyFile(srcStat, src, dest, opts) {
    if (opts.overwrite) {
      fs2.unlinkSync(dest);
      return copyFile(srcStat, src, dest, opts);
    } else if (opts.errorOnExist) {
      throw new Error(`'${dest}' already exists`);
    }
  }
  function copyFile(srcStat, src, dest, opts) {
    fs2.copyFileSync(src, dest);
    if (opts.preserveTimestamps)
      handleTimestamps(srcStat.mode, src, dest);
    return setDestMode(dest, srcStat.mode);
  }
  function handleTimestamps(srcMode, src, dest) {
    if (fileIsNotWritable(srcMode))
      makeFileWritable(dest, srcMode);
    return setDestTimestamps(src, dest);
  }
  function fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
  }
  function makeFileWritable(dest, srcMode) {
    return setDestMode(dest, srcMode | 128);
  }
  function setDestMode(dest, srcMode) {
    return fs2.chmodSync(dest, srcMode);
  }
  function setDestTimestamps(src, dest) {
    const updatedSrcStat = fs2.statSync(src);
    return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
  }
  function onDir(srcStat, destStat, src, dest, opts) {
    if (!destStat)
      return mkDirAndCopy(srcStat.mode, src, dest, opts);
    if (destStat && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
    }
    return copyDir(src, dest, opts);
  }
  function mkDirAndCopy(srcMode, src, dest, opts) {
    fs2.mkdirSync(dest);
    copyDir(src, dest, opts);
    return setDestMode(dest, srcMode);
  }
  function copyDir(src, dest, opts) {
    fs2.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
  }
  function copyDirItem(item, src, dest, opts) {
    const srcItem = path2.join(src, item);
    const destItem = path2.join(dest, item);
    const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy");
    return startCopy(destStat, srcItem, destItem, opts);
  }
  function onLink(destStat, src, dest, opts) {
    let resolvedSrc = fs2.readlinkSync(src);
    if (opts.dereference) {
      resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
    }
    if (!destStat) {
      return fs2.symlinkSync(resolvedSrc, dest);
    } else {
      let resolvedDest;
      try {
        resolvedDest = fs2.readlinkSync(dest);
      } catch (err) {
        if (err.code === "EINVAL" || err.code === "UNKNOWN")
          return fs2.symlinkSync(resolvedSrc, dest);
        throw err;
      }
      if (opts.dereference) {
        resolvedDest = path2.resolve(process.cwd(), resolvedDest);
      }
      if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
        throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
      }
      if (fs2.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
        throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
      }
      return copyLink(resolvedSrc, dest);
    }
  }
  function copyLink(resolvedSrc, dest) {
    fs2.unlinkSync(dest);
    return fs2.symlinkSync(resolvedSrc, dest);
  }
  module.exports = copySync;
});

// node_modules/fs-extra/lib/copy-sync/index.js
var require_copy_sync2 = __commonJS((exports, module) => {
  module.exports = {
    copySync: require_copy_sync()
  };
});

// node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS((exports, module) => {
  var u = require_universalify().fromPromise;
  var fs2 = require_fs();
  function pathExists(path2) {
    return fs2.access(path2).then(() => true).catch(() => false);
  }
  module.exports = {
    pathExists: u(pathExists),
    pathExistsSync: fs2.existsSync
  };
});

// node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var mkdirs = require_mkdirs().mkdirs;
  var pathExists = require_path_exists().pathExists;
  var utimesMillis = require_utimes().utimesMillis;
  var stat = require_stat();
  function copy(src, dest, opts, cb) {
    if (typeof opts === "function" && !cb) {
      cb = opts;
      opts = {};
    } else if (typeof opts === "function") {
      opts = { filter: opts };
    }
    cb = cb || function() {};
    opts = opts || {};
    opts.clobber = "clobber" in opts ? !!opts.clobber : true;
    opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
    if (opts.preserveTimestamps && process.arch === "ia32") {
      console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;

    see https://github.com/jprichardson/node-fs-extra/issues/269`);
    }
    stat.checkPaths(src, dest, "copy", (err, stats) => {
      if (err)
        return cb(err);
      const { srcStat, destStat } = stats;
      stat.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
        if (err2)
          return cb(err2);
        if (opts.filter)
          return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
        return checkParentDir(destStat, src, dest, opts, cb);
      });
    });
  }
  function checkParentDir(destStat, src, dest, opts, cb) {
    const destParent = path2.dirname(dest);
    pathExists(destParent, (err, dirExists) => {
      if (err)
        return cb(err);
      if (dirExists)
        return startCopy(destStat, src, dest, opts, cb);
      mkdirs(destParent, (err2) => {
        if (err2)
          return cb(err2);
        return startCopy(destStat, src, dest, opts, cb);
      });
    });
  }
  function handleFilter(onInclude, destStat, src, dest, opts, cb) {
    Promise.resolve(opts.filter(src, dest)).then((include) => {
      if (include)
        return onInclude(destStat, src, dest, opts, cb);
      return cb();
    }, (error) => cb(error));
  }
  function startCopy(destStat, src, dest, opts, cb) {
    if (opts.filter)
      return handleFilter(getStats, destStat, src, dest, opts, cb);
    return getStats(destStat, src, dest, opts, cb);
  }
  function getStats(destStat, src, dest, opts, cb) {
    const stat2 = opts.dereference ? fs2.stat : fs2.lstat;
    stat2(src, (err, srcStat) => {
      if (err)
        return cb(err);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts, cb);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts, cb);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts, cb);
    });
  }
  function onFile(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat)
      return copyFile(srcStat, src, dest, opts, cb);
    return mayCopyFile(srcStat, src, dest, opts, cb);
  }
  function mayCopyFile(srcStat, src, dest, opts, cb) {
    if (opts.overwrite) {
      fs2.unlink(dest, (err) => {
        if (err)
          return cb(err);
        return copyFile(srcStat, src, dest, opts, cb);
      });
    } else if (opts.errorOnExist) {
      return cb(new Error(`'${dest}' already exists`));
    } else
      return cb();
  }
  function copyFile(srcStat, src, dest, opts, cb) {
    fs2.copyFile(src, dest, (err) => {
      if (err)
        return cb(err);
      if (opts.preserveTimestamps)
        return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
      return setDestMode(dest, srcStat.mode, cb);
    });
  }
  function handleTimestampsAndMode(srcMode, src, dest, cb) {
    if (fileIsNotWritable(srcMode)) {
      return makeFileWritable(dest, srcMode, (err) => {
        if (err)
          return cb(err);
        return setDestTimestampsAndMode(srcMode, src, dest, cb);
      });
    }
    return setDestTimestampsAndMode(srcMode, src, dest, cb);
  }
  function fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
  }
  function makeFileWritable(dest, srcMode, cb) {
    return setDestMode(dest, srcMode | 128, cb);
  }
  function setDestTimestampsAndMode(srcMode, src, dest, cb) {
    setDestTimestamps(src, dest, (err) => {
      if (err)
        return cb(err);
      return setDestMode(dest, srcMode, cb);
    });
  }
  function setDestMode(dest, srcMode, cb) {
    return fs2.chmod(dest, srcMode, cb);
  }
  function setDestTimestamps(src, dest, cb) {
    fs2.stat(src, (err, updatedSrcStat) => {
      if (err)
        return cb(err);
      return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
    });
  }
  function onDir(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat)
      return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
    if (destStat && !destStat.isDirectory()) {
      return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
    }
    return copyDir(src, dest, opts, cb);
  }
  function mkDirAndCopy(srcMode, src, dest, opts, cb) {
    fs2.mkdir(dest, (err) => {
      if (err)
        return cb(err);
      copyDir(src, dest, opts, (err2) => {
        if (err2)
          return cb(err2);
        return setDestMode(dest, srcMode, cb);
      });
    });
  }
  function copyDir(src, dest, opts, cb) {
    fs2.readdir(src, (err, items) => {
      if (err)
        return cb(err);
      return copyDirItems(items, src, dest, opts, cb);
    });
  }
  function copyDirItems(items, src, dest, opts, cb) {
    const item = items.pop();
    if (!item)
      return cb();
    return copyDirItem(items, item, src, dest, opts, cb);
  }
  function copyDirItem(items, item, src, dest, opts, cb) {
    const srcItem = path2.join(src, item);
    const destItem = path2.join(dest, item);
    stat.checkPaths(srcItem, destItem, "copy", (err, stats) => {
      if (err)
        return cb(err);
      const { destStat } = stats;
      startCopy(destStat, srcItem, destItem, opts, (err2) => {
        if (err2)
          return cb(err2);
        return copyDirItems(items, src, dest, opts, cb);
      });
    });
  }
  function onLink(destStat, src, dest, opts, cb) {
    fs2.readlink(src, (err, resolvedSrc) => {
      if (err)
        return cb(err);
      if (opts.dereference) {
        resolvedSrc = path2.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs2.symlink(resolvedSrc, dest, cb);
      } else {
        fs2.readlink(dest, (err2, resolvedDest) => {
          if (err2) {
            if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
              return fs2.symlink(resolvedSrc, dest, cb);
            return cb(err2);
          }
          if (opts.dereference) {
            resolvedDest = path2.resolve(process.cwd(), resolvedDest);
          }
          if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
            return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
          }
          if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
            return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
          }
          return copyLink(resolvedSrc, dest, cb);
        });
      }
    });
  }
  function copyLink(resolvedSrc, dest, cb) {
    fs2.unlink(dest, (err) => {
      if (err)
        return cb(err);
      return fs2.symlink(resolvedSrc, dest, cb);
    });
  }
  module.exports = copy;
});

// node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  module.exports = {
    copy: u(require_copy())
  };
});

// node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var assert = __require("assert");
  var isWindows = process.platform === "win32";
  function defaults(options) {
    const methods = [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ];
    methods.forEach((m) => {
      options[m] = options[m] || fs2[m];
      m = m + "Sync";
      options[m] = options[m] || fs2[m];
    });
    options.maxBusyTries = options.maxBusyTries || 3;
  }
  function rimraf(p, options, cb) {
    let busyTries = 0;
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    assert(p, "rimraf: missing path");
    assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
    assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
    assert(options, "rimraf: invalid options argument provided");
    assert.strictEqual(typeof options, "object", "rimraf: options should be object");
    defaults(options);
    rimraf_(p, options, function CB(er) {
      if (er) {
        if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
          busyTries++;
          const time = busyTries * 100;
          return setTimeout(() => rimraf_(p, options, CB), time);
        }
        if (er.code === "ENOENT")
          er = null;
      }
      cb(er);
    });
  }
  function rimraf_(p, options, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    options.lstat(p, (er, st) => {
      if (er && er.code === "ENOENT") {
        return cb(null);
      }
      if (er && er.code === "EPERM" && isWindows) {
        return fixWinEPERM(p, options, er, cb);
      }
      if (st && st.isDirectory()) {
        return rmdir(p, options, er, cb);
      }
      options.unlink(p, (er2) => {
        if (er2) {
          if (er2.code === "ENOENT") {
            return cb(null);
          }
          if (er2.code === "EPERM") {
            return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
          }
          if (er2.code === "EISDIR") {
            return rmdir(p, options, er2, cb);
          }
        }
        return cb(er2);
      });
    });
  }
  function fixWinEPERM(p, options, er, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    if (er) {
      assert(er instanceof Error);
    }
    options.chmod(p, 438, (er2) => {
      if (er2) {
        cb(er2.code === "ENOENT" ? null : er);
      } else {
        options.stat(p, (er3, stats) => {
          if (er3) {
            cb(er3.code === "ENOENT" ? null : er);
          } else if (stats.isDirectory()) {
            rmdir(p, options, er, cb);
          } else {
            options.unlink(p, cb);
          }
        });
      }
    });
  }
  function fixWinEPERMSync(p, options, er) {
    let stats;
    assert(p);
    assert(options);
    if (er) {
      assert(er instanceof Error);
    }
    try {
      options.chmodSync(p, 438);
    } catch (er2) {
      if (er2.code === "ENOENT") {
        return;
      } else {
        throw er;
      }
    }
    try {
      stats = options.statSync(p);
    } catch (er3) {
      if (er3.code === "ENOENT") {
        return;
      } else {
        throw er;
      }
    }
    if (stats.isDirectory()) {
      rmdirSync(p, options, er);
    } else {
      options.unlinkSync(p);
    }
  }
  function rmdir(p, options, originalEr, cb) {
    assert(p);
    assert(options);
    if (originalEr) {
      assert(originalEr instanceof Error);
    }
    assert(typeof cb === "function");
    options.rmdir(p, (er) => {
      if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
        rmkids(p, options, cb);
      } else if (er && er.code === "ENOTDIR") {
        cb(originalEr);
      } else {
        cb(er);
      }
    });
  }
  function rmkids(p, options, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === "function");
    options.readdir(p, (er, files) => {
      if (er)
        return cb(er);
      let n = files.length;
      let errState;
      if (n === 0)
        return options.rmdir(p, cb);
      files.forEach((f) => {
        rimraf(path2.join(p, f), options, (er2) => {
          if (errState) {
            return;
          }
          if (er2)
            return cb(errState = er2);
          if (--n === 0) {
            options.rmdir(p, cb);
          }
        });
      });
    });
  }
  function rimrafSync(p, options) {
    let st;
    options = options || {};
    defaults(options);
    assert(p, "rimraf: missing path");
    assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
    assert(options, "rimraf: missing options");
    assert.strictEqual(typeof options, "object", "rimraf: options should be object");
    try {
      st = options.lstatSync(p);
    } catch (er) {
      if (er.code === "ENOENT") {
        return;
      }
      if (er.code === "EPERM" && isWindows) {
        fixWinEPERMSync(p, options, er);
      }
    }
    try {
      if (st && st.isDirectory()) {
        rmdirSync(p, options, null);
      } else {
        options.unlinkSync(p);
      }
    } catch (er) {
      if (er.code === "ENOENT") {
        return;
      } else if (er.code === "EPERM") {
        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
      } else if (er.code !== "EISDIR") {
        throw er;
      }
      rmdirSync(p, options, er);
    }
  }
  function rmdirSync(p, options, originalEr) {
    assert(p);
    assert(options);
    if (originalEr) {
      assert(originalEr instanceof Error);
    }
    try {
      options.rmdirSync(p);
    } catch (er) {
      if (er.code === "ENOTDIR") {
        throw originalEr;
      } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
        rmkidsSync(p, options);
      } else if (er.code !== "ENOENT") {
        throw er;
      }
    }
  }
  function rmkidsSync(p, options) {
    assert(p);
    assert(options);
    options.readdirSync(p).forEach((f) => rimrafSync(path2.join(p, f), options));
    if (isWindows) {
      const startTime = Date.now();
      do {
        try {
          const ret = options.rmdirSync(p, options);
          return ret;
        } catch {}
      } while (Date.now() - startTime < 500);
    } else {
      const ret = options.rmdirSync(p, options);
      return ret;
    }
  }
  module.exports = rimraf;
  rimraf.sync = rimrafSync;
});

// node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  var rimraf = require_rimraf();
  module.exports = {
    remove: u(rimraf),
    removeSync: rimraf.sync
  };
});

// node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var mkdir = require_mkdirs();
  var remove = require_remove();
  var emptyDir = u(function emptyDir(dir, callback) {
    callback = callback || function() {};
    fs2.readdir(dir, (err, items) => {
      if (err)
        return mkdir.mkdirs(dir, callback);
      items = items.map((item) => path2.join(dir, item));
      deleteItem();
      function deleteItem() {
        const item = items.pop();
        if (!item)
          return callback();
        remove.remove(item, (err2) => {
          if (err2)
            return callback(err2);
          deleteItem();
        });
      }
    });
  });
  function emptyDirSync(dir) {
    let items;
    try {
      items = fs2.readdirSync(dir);
    } catch {
      return mkdir.mkdirsSync(dir);
    }
    items.forEach((item) => {
      item = path2.join(dir, item);
      remove.removeSync(item);
    });
  }
  module.exports = {
    emptyDirSync,
    emptydirSync: emptyDirSync,
    emptyDir,
    emptydir: emptyDir
  };
});

// node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  var path2 = __require("path");
  var fs2 = require_graceful_fs();
  var mkdir = require_mkdirs();
  function createFile(file, callback) {
    function makeFile() {
      fs2.writeFile(file, "", (err) => {
        if (err)
          return callback(err);
        callback();
      });
    }
    fs2.stat(file, (err, stats) => {
      if (!err && stats.isFile())
        return callback();
      const dir = path2.dirname(file);
      fs2.stat(dir, (err2, stats2) => {
        if (err2) {
          if (err2.code === "ENOENT") {
            return mkdir.mkdirs(dir, (err3) => {
              if (err3)
                return callback(err3);
              makeFile();
            });
          }
          return callback(err2);
        }
        if (stats2.isDirectory())
          makeFile();
        else {
          fs2.readdir(dir, (err3) => {
            if (err3)
              return callback(err3);
          });
        }
      });
    });
  }
  function createFileSync(file) {
    let stats;
    try {
      stats = fs2.statSync(file);
    } catch {}
    if (stats && stats.isFile())
      return;
    const dir = path2.dirname(file);
    try {
      if (!fs2.statSync(dir).isDirectory()) {
        fs2.readdirSync(dir);
      }
    } catch (err) {
      if (err && err.code === "ENOENT")
        mkdir.mkdirsSync(dir);
      else
        throw err;
    }
    fs2.writeFileSync(file, "");
  }
  module.exports = {
    createFile: u(createFile),
    createFileSync
  };
});

// node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  var path2 = __require("path");
  var fs2 = require_graceful_fs();
  var mkdir = require_mkdirs();
  var pathExists = require_path_exists().pathExists;
  function createLink(srcpath, dstpath, callback) {
    function makeLink(srcpath2, dstpath2) {
      fs2.link(srcpath2, dstpath2, (err) => {
        if (err)
          return callback(err);
        callback(null);
      });
    }
    pathExists(dstpath, (err, destinationExists) => {
      if (err)
        return callback(err);
      if (destinationExists)
        return callback(null);
      fs2.lstat(srcpath, (err2) => {
        if (err2) {
          err2.message = err2.message.replace("lstat", "ensureLink");
          return callback(err2);
        }
        const dir = path2.dirname(dstpath);
        pathExists(dir, (err3, dirExists) => {
          if (err3)
            return callback(err3);
          if (dirExists)
            return makeLink(srcpath, dstpath);
          mkdir.mkdirs(dir, (err4) => {
            if (err4)
              return callback(err4);
            makeLink(srcpath, dstpath);
          });
        });
      });
    });
  }
  function createLinkSync(srcpath, dstpath) {
    const destinationExists = fs2.existsSync(dstpath);
    if (destinationExists)
      return;
    try {
      fs2.lstatSync(srcpath);
    } catch (err) {
      err.message = err.message.replace("lstat", "ensureLink");
      throw err;
    }
    const dir = path2.dirname(dstpath);
    const dirExists = fs2.existsSync(dir);
    if (dirExists)
      return fs2.linkSync(srcpath, dstpath);
    mkdir.mkdirsSync(dir);
    return fs2.linkSync(srcpath, dstpath);
  }
  module.exports = {
    createLink: u(createLink),
    createLinkSync
  };
});

// node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS((exports, module) => {
  var path2 = __require("path");
  var fs2 = require_graceful_fs();
  var pathExists = require_path_exists().pathExists;
  function symlinkPaths(srcpath, dstpath, callback) {
    if (path2.isAbsolute(srcpath)) {
      return fs2.lstat(srcpath, (err) => {
        if (err) {
          err.message = err.message.replace("lstat", "ensureSymlink");
          return callback(err);
        }
        return callback(null, {
          toCwd: srcpath,
          toDst: srcpath
        });
      });
    } else {
      const dstdir = path2.dirname(dstpath);
      const relativeToDst = path2.join(dstdir, srcpath);
      return pathExists(relativeToDst, (err, exists) => {
        if (err)
          return callback(err);
        if (exists) {
          return callback(null, {
            toCwd: relativeToDst,
            toDst: srcpath
          });
        } else {
          return fs2.lstat(srcpath, (err2) => {
            if (err2) {
              err2.message = err2.message.replace("lstat", "ensureSymlink");
              return callback(err2);
            }
            return callback(null, {
              toCwd: srcpath,
              toDst: path2.relative(dstdir, srcpath)
            });
          });
        }
      });
    }
  }
  function symlinkPathsSync(srcpath, dstpath) {
    let exists;
    if (path2.isAbsolute(srcpath)) {
      exists = fs2.existsSync(srcpath);
      if (!exists)
        throw new Error("absolute srcpath does not exist");
      return {
        toCwd: srcpath,
        toDst: srcpath
      };
    } else {
      const dstdir = path2.dirname(dstpath);
      const relativeToDst = path2.join(dstdir, srcpath);
      exists = fs2.existsSync(relativeToDst);
      if (exists) {
        return {
          toCwd: relativeToDst,
          toDst: srcpath
        };
      } else {
        exists = fs2.existsSync(srcpath);
        if (!exists)
          throw new Error("relative srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: path2.relative(dstdir, srcpath)
        };
      }
    }
  }
  module.exports = {
    symlinkPaths,
    symlinkPathsSync
  };
});

// node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  function symlinkType(srcpath, type, callback) {
    callback = typeof type === "function" ? type : callback;
    type = typeof type === "function" ? false : type;
    if (type)
      return callback(null, type);
    fs2.lstat(srcpath, (err, stats) => {
      if (err)
        return callback(null, "file");
      type = stats && stats.isDirectory() ? "dir" : "file";
      callback(null, type);
    });
  }
  function symlinkTypeSync(srcpath, type) {
    let stats;
    if (type)
      return type;
    try {
      stats = fs2.lstatSync(srcpath);
    } catch {
      return "file";
    }
    return stats && stats.isDirectory() ? "dir" : "file";
  }
  module.exports = {
    symlinkType,
    symlinkTypeSync
  };
});

// node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  var path2 = __require("path");
  var fs2 = require_graceful_fs();
  var _mkdirs = require_mkdirs();
  var mkdirs = _mkdirs.mkdirs;
  var mkdirsSync = _mkdirs.mkdirsSync;
  var _symlinkPaths = require_symlink_paths();
  var symlinkPaths = _symlinkPaths.symlinkPaths;
  var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
  var _symlinkType = require_symlink_type();
  var symlinkType = _symlinkType.symlinkType;
  var symlinkTypeSync = _symlinkType.symlinkTypeSync;
  var pathExists = require_path_exists().pathExists;
  function createSymlink(srcpath, dstpath, type, callback) {
    callback = typeof type === "function" ? type : callback;
    type = typeof type === "function" ? false : type;
    pathExists(dstpath, (err, destinationExists) => {
      if (err)
        return callback(err);
      if (destinationExists)
        return callback(null);
      symlinkPaths(srcpath, dstpath, (err2, relative) => {
        if (err2)
          return callback(err2);
        srcpath = relative.toDst;
        symlinkType(relative.toCwd, type, (err3, type2) => {
          if (err3)
            return callback(err3);
          const dir = path2.dirname(dstpath);
          pathExists(dir, (err4, dirExists) => {
            if (err4)
              return callback(err4);
            if (dirExists)
              return fs2.symlink(srcpath, dstpath, type2, callback);
            mkdirs(dir, (err5) => {
              if (err5)
                return callback(err5);
              fs2.symlink(srcpath, dstpath, type2, callback);
            });
          });
        });
      });
    });
  }
  function createSymlinkSync(srcpath, dstpath, type) {
    const destinationExists = fs2.existsSync(dstpath);
    if (destinationExists)
      return;
    const relative = symlinkPathsSync(srcpath, dstpath);
    srcpath = relative.toDst;
    type = symlinkTypeSync(relative.toCwd, type);
    const dir = path2.dirname(dstpath);
    const exists = fs2.existsSync(dir);
    if (exists)
      return fs2.symlinkSync(srcpath, dstpath, type);
    mkdirsSync(dir);
    return fs2.symlinkSync(srcpath, dstpath, type);
  }
  module.exports = {
    createSymlink: u(createSymlink),
    createSymlinkSync
  };
});

// node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS((exports, module) => {
  var file = require_file();
  var link = require_link();
  var symlink = require_symlink();
  module.exports = {
    createFile: file.createFile,
    createFileSync: file.createFileSync,
    ensureFile: file.createFile,
    ensureFileSync: file.createFileSync,
    createLink: link.createLink,
    createLinkSync: link.createLinkSync,
    ensureLink: link.createLink,
    ensureLinkSync: link.createLinkSync,
    createSymlink: symlink.createSymlink,
    createSymlinkSync: symlink.createSymlinkSync,
    ensureSymlink: symlink.createSymlink,
    ensureSymlinkSync: symlink.createSymlinkSync
  };
});

// node_modules/fs-extra/node_modules/jsonfile/utils.js
var require_utils = __commonJS((exports, module) => {
  function stringify(obj, options = {}) {
    const EOL = options.EOL || `
`;
    const str = JSON.stringify(obj, options ? options.replacer : null, options.spaces);
    return str.replace(/\n/g, EOL) + EOL;
  }
  function stripBom(content) {
    if (Buffer.isBuffer(content))
      content = content.toString("utf8");
    return content.replace(/^\uFEFF/, "");
  }
  module.exports = { stringify, stripBom };
});

// node_modules/fs-extra/node_modules/jsonfile/index.js
var require_jsonfile = __commonJS((exports, module) => {
  var _fs;
  try {
    _fs = require_graceful_fs();
  } catch (_) {
    _fs = __require("fs");
  }
  var universalify = require_universalify();
  var { stringify, stripBom } = require_utils();
  async function _readFile(file, options = {}) {
    if (typeof options === "string") {
      options = { encoding: options };
    }
    const fs2 = options.fs || _fs;
    const shouldThrow = "throws" in options ? options.throws : true;
    let data = await universalify.fromCallback(fs2.readFile)(file, options);
    data = stripBom(data);
    let obj;
    try {
      obj = JSON.parse(data, options ? options.reviver : null);
    } catch (err) {
      if (shouldThrow) {
        err.message = `${file}: ${err.message}`;
        throw err;
      } else {
        return null;
      }
    }
    return obj;
  }
  var readFile = universalify.fromPromise(_readFile);
  function readFileSync(file, options = {}) {
    if (typeof options === "string") {
      options = { encoding: options };
    }
    const fs2 = options.fs || _fs;
    const shouldThrow = "throws" in options ? options.throws : true;
    try {
      let content = fs2.readFileSync(file, options);
      content = stripBom(content);
      return JSON.parse(content, options.reviver);
    } catch (err) {
      if (shouldThrow) {
        err.message = `${file}: ${err.message}`;
        throw err;
      } else {
        return null;
      }
    }
  }
  async function _writeFile(file, obj, options = {}) {
    const fs2 = options.fs || _fs;
    const str = stringify(obj, options);
    await universalify.fromCallback(fs2.writeFile)(file, str, options);
  }
  var writeFile = universalify.fromPromise(_writeFile);
  function writeFileSync(file, obj, options = {}) {
    const fs2 = options.fs || _fs;
    const str = stringify(obj, options);
    return fs2.writeFileSync(file, str, options);
  }
  var jsonfile = {
    readFile,
    readFileSync,
    writeFile,
    writeFileSync
  };
  module.exports = jsonfile;
});

// node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS((exports, module) => {
  var jsonFile = require_jsonfile();
  module.exports = {
    readJson: jsonFile.readFile,
    readJsonSync: jsonFile.readFileSync,
    writeJson: jsonFile.writeFile,
    writeJsonSync: jsonFile.writeFileSync
  };
});

// node_modules/fs-extra/lib/output/index.js
var require_output = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var mkdir = require_mkdirs();
  var pathExists = require_path_exists().pathExists;
  function outputFile(file, data, encoding, callback) {
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = "utf8";
    }
    const dir = path2.dirname(file);
    pathExists(dir, (err, itDoes) => {
      if (err)
        return callback(err);
      if (itDoes)
        return fs2.writeFile(file, data, encoding, callback);
      mkdir.mkdirs(dir, (err2) => {
        if (err2)
          return callback(err2);
        fs2.writeFile(file, data, encoding, callback);
      });
    });
  }
  function outputFileSync(file, ...args) {
    const dir = path2.dirname(file);
    if (fs2.existsSync(dir)) {
      return fs2.writeFileSync(file, ...args);
    }
    mkdir.mkdirsSync(dir);
    fs2.writeFileSync(file, ...args);
  }
  module.exports = {
    outputFile: u(outputFile),
    outputFileSync
  };
});

// node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS((exports, module) => {
  var { stringify } = require_utils();
  var { outputFile } = require_output();
  async function outputJson(file, data, options = {}) {
    const str = stringify(data, options);
    await outputFile(file, str, options);
  }
  module.exports = outputJson;
});

// node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS((exports, module) => {
  var { stringify } = require_utils();
  var { outputFileSync } = require_output();
  function outputJsonSync(file, data, options) {
    const str = stringify(data, options);
    outputFileSync(file, str, options);
  }
  module.exports = outputJsonSync;
});

// node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS((exports, module) => {
  var u = require_universalify().fromPromise;
  var jsonFile = require_jsonfile2();
  jsonFile.outputJson = u(require_output_json());
  jsonFile.outputJsonSync = require_output_json_sync();
  jsonFile.outputJSON = jsonFile.outputJson;
  jsonFile.outputJSONSync = jsonFile.outputJsonSync;
  jsonFile.writeJSON = jsonFile.writeJson;
  jsonFile.writeJSONSync = jsonFile.writeJsonSync;
  jsonFile.readJSON = jsonFile.readJson;
  jsonFile.readJSONSync = jsonFile.readJsonSync;
  module.exports = jsonFile;
});

// node_modules/fs-extra/lib/move-sync/move-sync.js
var require_move_sync = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var copySync = require_copy_sync2().copySync;
  var removeSync = require_remove().removeSync;
  var mkdirpSync = require_mkdirs().mkdirpSync;
  var stat = require_stat();
  function moveSync(src, dest, opts) {
    opts = opts || {};
    const overwrite = opts.overwrite || opts.clobber || false;
    const { srcStat } = stat.checkPathsSync(src, dest, "move");
    stat.checkParentPathsSync(src, srcStat, dest, "move");
    mkdirpSync(path2.dirname(dest));
    return doRename(src, dest, overwrite);
  }
  function doRename(src, dest, overwrite) {
    if (overwrite) {
      removeSync(dest);
      return rename(src, dest, overwrite);
    }
    if (fs2.existsSync(dest))
      throw new Error("dest already exists.");
    return rename(src, dest, overwrite);
  }
  function rename(src, dest, overwrite) {
    try {
      fs2.renameSync(src, dest);
    } catch (err) {
      if (err.code !== "EXDEV")
        throw err;
      return moveAcrossDevice(src, dest, overwrite);
    }
  }
  function moveAcrossDevice(src, dest, overwrite) {
    const opts = {
      overwrite,
      errorOnExist: true
    };
    copySync(src, dest, opts);
    return removeSync(src);
  }
  module.exports = moveSync;
});

// node_modules/fs-extra/lib/move-sync/index.js
var require_move_sync2 = __commonJS((exports, module) => {
  module.exports = {
    moveSync: require_move_sync()
  };
});

// node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS((exports, module) => {
  var fs2 = require_graceful_fs();
  var path2 = __require("path");
  var copy = require_copy2().copy;
  var remove = require_remove().remove;
  var mkdirp = require_mkdirs().mkdirp;
  var pathExists = require_path_exists().pathExists;
  var stat = require_stat();
  function move(src, dest, opts, cb) {
    if (typeof opts === "function") {
      cb = opts;
      opts = {};
    }
    const overwrite = opts.overwrite || opts.clobber || false;
    stat.checkPaths(src, dest, "move", (err, stats) => {
      if (err)
        return cb(err);
      const { srcStat } = stats;
      stat.checkParentPaths(src, srcStat, dest, "move", (err2) => {
        if (err2)
          return cb(err2);
        mkdirp(path2.dirname(dest), (err3) => {
          if (err3)
            return cb(err3);
          return doRename(src, dest, overwrite, cb);
        });
      });
    });
  }
  function doRename(src, dest, overwrite, cb) {
    if (overwrite) {
      return remove(dest, (err) => {
        if (err)
          return cb(err);
        return rename(src, dest, overwrite, cb);
      });
    }
    pathExists(dest, (err, destExists) => {
      if (err)
        return cb(err);
      if (destExists)
        return cb(new Error("dest already exists."));
      return rename(src, dest, overwrite, cb);
    });
  }
  function rename(src, dest, overwrite, cb) {
    fs2.rename(src, dest, (err) => {
      if (!err)
        return cb();
      if (err.code !== "EXDEV")
        return cb(err);
      return moveAcrossDevice(src, dest, overwrite, cb);
    });
  }
  function moveAcrossDevice(src, dest, overwrite, cb) {
    const opts = {
      overwrite,
      errorOnExist: true
    };
    copy(src, dest, opts, (err) => {
      if (err)
        return cb(err);
      return remove(src, cb);
    });
  }
  module.exports = move;
});

// node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS((exports, module) => {
  var u = require_universalify().fromCallback;
  module.exports = {
    move: u(require_move())
  };
});

// node_modules/fs-extra/lib/index.js
var require_lib2 = __commonJS((exports, module) => {
  module.exports = {
    ...require_fs(),
    ...require_copy_sync2(),
    ...require_copy2(),
    ...require_empty(),
    ...require_ensure(),
    ...require_json(),
    ...require_mkdirs(),
    ...require_move_sync2(),
    ...require_move2(),
    ...require_output(),
    ...require_path_exists(),
    ...require_remove()
  };
  var fs2 = __require("fs");
  if (Object.getOwnPropertyDescriptor(fs2, "promises")) {
    Object.defineProperty(module.exports, "promises", {
      get() {
        return fs2.promises;
      }
    });
  }
});

// src/lib/units/definitions/angle.js
var angle, angle_default;
var init_angle = __esm(() => {
  angle = {
    rad: {
      name: {
        singular: "radian",
        plural: "radians"
      },
      to_anchor: 180 / Math.PI
    },
    deg: {
      name: {
        singular: "degree",
        plural: "degrees"
      },
      to_anchor: 1
    },
    grad: {
      name: {
        singular: "gradian",
        plural: "gradians"
      },
      to_anchor: 9 / 10
    },
    arcmin: {
      name: {
        singular: "arcminute",
        plural: "arcminutes"
      },
      to_anchor: 1 / 60
    },
    arcsec: {
      name: {
        singular: "arcsecond",
        plural: "arcseconds"
      },
      to_anchor: 1 / 3600
    }
  };
  angle_default = {
    metric: angle,
    _anchors: {
      metric: {
        unit: "deg",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/apparentPower.js
var apparentPower, apparentPower_default;
var init_apparentPower = __esm(() => {
  apparentPower = {
    VA: {
      name: {
        singular: "Volt-Ampere",
        plural: "Volt-Amperes"
      },
      to_anchor: 1
    },
    mVA: {
      name: {
        singular: "Millivolt-Ampere",
        plural: "Millivolt-Amperes"
      },
      to_anchor: 0.001
    },
    kVA: {
      name: {
        singular: "Kilovolt-Ampere",
        plural: "Kilovolt-Amperes"
      },
      to_anchor: 1000
    },
    MVA: {
      name: {
        singular: "Megavolt-Ampere",
        plural: "Megavolt-Amperes"
      },
      to_anchor: 1e6
    },
    GVA: {
      name: {
        singular: "Gigavolt-Ampere",
        plural: "Gigavolt-Amperes"
      },
      to_anchor: 1e9
    }
  };
  apparentPower_default = {
    metric: apparentPower,
    _anchors: {
      metric: {
        unit: "VA",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/area.js
var metric, imperial, area_default;
var init_area = __esm(() => {
  metric = {
    mm2: {
      name: {
        singular: "Square Millimeter",
        plural: "Square Millimeters"
      },
      to_anchor: 1 / 1e6
    },
    cm2: {
      name: {
        singular: "Centimeter",
        plural: "Centimeters"
      },
      to_anchor: 1 / 1e4
    },
    m2: {
      name: {
        singular: "Square Meter",
        plural: "Square Meters"
      },
      to_anchor: 1
    },
    ha: {
      name: {
        singular: "Hectare",
        plural: "Hectares"
      },
      to_anchor: 1e4
    },
    km2: {
      name: {
        singular: "Square Kilometer",
        plural: "Square Kilometers"
      },
      to_anchor: 1e6
    }
  };
  imperial = {
    in2: {
      name: {
        singular: "Square Inch",
        plural: "Square Inches"
      },
      to_anchor: 1 / 144
    },
    yd2: {
      name: {
        singular: "Square Yard",
        plural: "Square Yards"
      },
      to_anchor: 9
    },
    ft2: {
      name: {
        singular: "Square Foot",
        plural: "Square Feet"
      },
      to_anchor: 1
    },
    ac: {
      name: {
        singular: "Acre",
        plural: "Acres"
      },
      to_anchor: 43560
    },
    mi2: {
      name: {
        singular: "Square Mile",
        plural: "Square Miles"
      },
      to_anchor: 27878400
    }
  };
  area_default = {
    metric,
    imperial,
    _anchors: {
      metric: {
        unit: "m2",
        ratio: 10.7639
      },
      imperial: {
        unit: "ft2",
        ratio: 1 / 10.7639
      }
    }
  };
});

// src/lib/units/definitions/current.js
var current, current_default;
var init_current = __esm(() => {
  current = {
    A: {
      name: {
        singular: "Ampere",
        plural: "Amperes"
      },
      to_anchor: 1
    },
    mA: {
      name: {
        singular: "Milliampere",
        plural: "Milliamperes"
      },
      to_anchor: 0.001
    },
    kA: {
      name: {
        singular: "Kiloampere",
        plural: "Kiloamperes"
      },
      to_anchor: 1000
    }
  };
  current_default = {
    metric: current,
    _anchors: {
      metric: {
        unit: "A",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/digital.js
var bits, bytes, digital_default;
var init_digital = __esm(() => {
  bits = {
    b: {
      name: {
        singular: "Bit",
        plural: "Bits"
      },
      to_anchor: 1
    },
    Kb: {
      name: {
        singular: "Kilobit",
        plural: "Kilobits"
      },
      to_anchor: 1024
    },
    Mb: {
      name: {
        singular: "Megabit",
        plural: "Megabits"
      },
      to_anchor: 1048576
    },
    Gb: {
      name: {
        singular: "Gigabit",
        plural: "Gigabits"
      },
      to_anchor: 1073741824
    },
    Tb: {
      name: {
        singular: "Terabit",
        plural: "Terabits"
      },
      to_anchor: 1099511627776
    }
  };
  bytes = {
    B: {
      name: {
        singular: "Byte",
        plural: "Bytes"
      },
      to_anchor: 1
    },
    KB: {
      name: {
        singular: "Kilobyte",
        plural: "Kilobytes"
      },
      to_anchor: 1024
    },
    MB: {
      name: {
        singular: "Megabyte",
        plural: "Megabytes"
      },
      to_anchor: 1048576
    },
    GB: {
      name: {
        singular: "Gigabyte",
        plural: "Gigabytes"
      },
      to_anchor: 1073741824
    },
    TB: {
      name: {
        singular: "Terabyte",
        plural: "Terabytes"
      },
      to_anchor: 1099511627776
    }
  };
  digital_default = {
    bits,
    bytes,
    _anchors: {
      bits: {
        unit: "b",
        ratio: 1 / 8
      },
      bytes: {
        unit: "B",
        ratio: 8
      }
    }
  };
});

// src/lib/units/definitions/each.js
var metric2, each_default;
var init_each = __esm(() => {
  metric2 = {
    ea: {
      name: {
        singular: "Each",
        plural: "Each"
      },
      to_anchor: 1
    },
    dz: {
      name: {
        singular: "Dozen",
        plural: "Dozens"
      },
      to_anchor: 12
    }
  };
  each_default = {
    metric: metric2,
    imperial: {},
    _anchors: {
      metric: {
        unit: "ea",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/energy.js
var energy, energy_default;
var init_energy = __esm(() => {
  energy = {
    Wh: {
      name: {
        singular: "Watt-hour",
        plural: "Watt-hours"
      },
      to_anchor: 3600
    },
    mWh: {
      name: {
        singular: "Milliwatt-hour",
        plural: "Milliwatt-hours"
      },
      to_anchor: 3.6
    },
    kWh: {
      name: {
        singular: "Kilowatt-hour",
        plural: "Kilowatt-hours"
      },
      to_anchor: 3600000
    },
    MWh: {
      name: {
        singular: "Megawatt-hour",
        plural: "Megawatt-hours"
      },
      to_anchor: 3600000000
    },
    GWh: {
      name: {
        singular: "Gigawatt-hour",
        plural: "Gigawatt-hours"
      },
      to_anchor: 3600000000000
    },
    J: {
      name: {
        singular: "Joule",
        plural: "Joules"
      },
      to_anchor: 1
    },
    kJ: {
      name: {
        singular: "Kilojoule",
        plural: "Kilojoules"
      },
      to_anchor: 1000
    }
  };
  energy_default = {
    metric: energy,
    _anchors: {
      metric: {
        unit: "J",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/frequency.js
var frequency, frequency_default;
var init_frequency = __esm(() => {
  frequency = {
    mHz: {
      name: {
        singular: "millihertz",
        plural: "millihertz"
      },
      to_anchor: 1 / 1000
    },
    Hz: {
      name: {
        singular: "hertz",
        plural: "hertz"
      },
      to_anchor: 1
    },
    kHz: {
      name: {
        singular: "kilohertz",
        plural: "kilohertz"
      },
      to_anchor: 1000
    },
    MHz: {
      name: {
        singular: "megahertz",
        plural: "megahertz"
      },
      to_anchor: 1000 * 1000
    },
    GHz: {
      name: {
        singular: "gigahertz",
        plural: "gigahertz"
      },
      to_anchor: 1000 * 1000 * 1000
    },
    THz: {
      name: {
        singular: "terahertz",
        plural: "terahertz"
      },
      to_anchor: 1000 * 1000 * 1000 * 1000
    },
    rpm: {
      name: {
        singular: "rotation per minute",
        plural: "rotations per minute"
      },
      to_anchor: 1 / 60
    },
    "deg/s": {
      name: {
        singular: "degree per second",
        plural: "degrees per second"
      },
      to_anchor: 1 / 360
    },
    "rad/s": {
      name: {
        singular: "radian per second",
        plural: "radians per second"
      },
      to_anchor: 1 / (Math.PI * 2)
    }
  };
  frequency_default = {
    metric: frequency,
    _anchors: {
      frequency: {
        unit: "hz",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/illuminance.js
var metric3, imperial2, illuminance_default;
var init_illuminance = __esm(() => {
  metric3 = {
    lx: {
      name: {
        singular: "Lux",
        plural: "Lux"
      },
      to_anchor: 1
    }
  };
  imperial2 = {
    "ft-cd": {
      name: {
        singular: "Foot-candle",
        plural: "Foot-candles"
      },
      to_anchor: 1
    }
  };
  illuminance_default = {
    metric: metric3,
    imperial: imperial2,
    _anchors: {
      metric: {
        unit: "lx",
        ratio: 1 / 10.76391
      },
      imperial: {
        unit: "ft-cd",
        ratio: 10.76391
      }
    }
  };
});

// src/lib/units/definitions/length.js
var metric4, imperial3, length_default;
var init_length = __esm(() => {
  metric4 = {
    mm: {
      name: {
        singular: "Millimeter",
        plural: "Millimeters"
      },
      to_anchor: 1 / 1000
    },
    cm: {
      name: {
        singular: "Centimeter",
        plural: "Centimeters"
      },
      to_anchor: 1 / 100
    },
    m: {
      name: {
        singular: "Meter",
        plural: "Meters"
      },
      to_anchor: 1
    },
    km: {
      name: {
        singular: "Kilometer",
        plural: "Kilometers"
      },
      to_anchor: 1000
    }
  };
  imperial3 = {
    in: {
      name: {
        singular: "Inch",
        plural: "Inches"
      },
      to_anchor: 1 / 12
    },
    yd: {
      name: {
        singular: "Yard",
        plural: "Yards"
      },
      to_anchor: 3
    },
    "ft-us": {
      name: {
        singular: "US Survey Foot",
        plural: "US Survey Feet"
      },
      to_anchor: 1.000002
    },
    ft: {
      name: {
        singular: "Foot",
        plural: "Feet"
      },
      to_anchor: 1
    },
    mi: {
      name: {
        singular: "Mile",
        plural: "Miles"
      },
      to_anchor: 5280
    }
  };
  length_default = {
    metric: metric4,
    imperial: imperial3,
    _anchors: {
      metric: {
        unit: "m",
        ratio: 3.28084
      },
      imperial: {
        unit: "ft",
        ratio: 1 / 3.28084
      }
    }
  };
});

// src/lib/units/definitions/mass.js
var metric5, imperial4, mass_default;
var init_mass = __esm(() => {
  metric5 = {
    mcg: {
      name: {
        singular: "Microgram",
        plural: "Micrograms"
      },
      to_anchor: 1 / 1e6
    },
    mg: {
      name: {
        singular: "Milligram",
        plural: "Milligrams"
      },
      to_anchor: 1 / 1000
    },
    g: {
      name: {
        singular: "Gram",
        plural: "Grams"
      },
      to_anchor: 1
    },
    kg: {
      name: {
        singular: "Kilogram",
        plural: "Kilograms"
      },
      to_anchor: 1000
    },
    mt: {
      name: {
        singular: "Metric Tonne",
        plural: "Metric Tonnes"
      },
      to_anchor: 1e6
    }
  };
  imperial4 = {
    oz: {
      name: {
        singular: "Ounce",
        plural: "Ounces"
      },
      to_anchor: 1 / 16
    },
    lb: {
      name: {
        singular: "Pound",
        plural: "Pounds"
      },
      to_anchor: 1
    },
    t: {
      name: {
        singular: "Ton",
        plural: "Tons"
      },
      to_anchor: 2000
    }
  };
  mass_default = {
    metric: metric5,
    imperial: imperial4,
    _anchors: {
      metric: {
        unit: "g",
        ratio: 1 / 453.592
      },
      imperial: {
        unit: "lb",
        ratio: 453.592
      }
    }
  };
});

// src/lib/units/definitions/pace.js
var metric6, imperial5, pace_default;
var init_pace = __esm(() => {
  metric6 = {
    "min/km": {
      name: {
        singular: "Minute per kilometre",
        plural: "Minutes per kilometre"
      },
      to_anchor: 0.06
    },
    "s/m": {
      name: {
        singular: "Second per metre",
        plural: "Seconds per metre"
      },
      to_anchor: 1
    }
  };
  imperial5 = {
    "min/mi": {
      name: {
        singular: "Minute per mile",
        plural: "Minutes per mile"
      },
      to_anchor: 0.0113636
    },
    "s/ft": {
      name: {
        singular: "Second per foot",
        plural: "Seconds per foot"
      },
      to_anchor: 1
    }
  };
  pace_default = {
    metric: metric6,
    imperial: imperial5,
    _anchors: {
      metric: {
        unit: "s/m",
        ratio: 0.3048
      },
      imperial: {
        unit: "s/ft",
        ratio: 1 / 0.3048
      }
    }
  };
});

// src/lib/units/definitions/partsPer.js
var metric7, partsPer_default;
var init_partsPer = __esm(() => {
  metric7 = {
    ppm: {
      name: {
        singular: "Part-per Million",
        plural: "Parts-per Million"
      },
      to_anchor: 1
    },
    ppb: {
      name: {
        singular: "Part-per Billion",
        plural: "Parts-per Billion"
      },
      to_anchor: 0.001
    },
    ppt: {
      name: {
        singular: "Part-per Trillion",
        plural: "Parts-per Trillion"
      },
      to_anchor: 0.000001
    },
    ppq: {
      name: {
        singular: "Part-per Quadrillion",
        plural: "Parts-per Quadrillion"
      },
      to_anchor: 0.000000001
    }
  };
  partsPer_default = {
    metric: metric7,
    imperial: {},
    _anchors: {
      metric: {
        unit: "ppm",
        ratio: 0.000001
      }
    }
  };
});

// src/lib/units/definitions/power.js
var power, power_default;
var init_power = __esm(() => {
  power = {
    W: {
      name: {
        singular: "Watt",
        plural: "Watts"
      },
      to_anchor: 1
    },
    mW: {
      name: {
        singular: "Milliwatt",
        plural: "Milliwatts"
      },
      to_anchor: 0.001
    },
    kW: {
      name: {
        singular: "Kilowatt",
        plural: "Kilowatts"
      },
      to_anchor: 1000
    },
    MW: {
      name: {
        singular: "Megawatt",
        plural: "Megawatts"
      },
      to_anchor: 1e6
    },
    GW: {
      name: {
        singular: "Gigawatt",
        plural: "Gigawatts"
      },
      to_anchor: 1e9
    }
  };
  power_default = {
    metric: power,
    _anchors: {
      metric: {
        unit: "W",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/pressure.js
var metric8, imperial6, pressure_default;
var init_pressure = __esm(() => {
  metric8 = {
    Pa: {
      name: {
        singular: "pascal",
        plural: "pascals"
      },
      to_anchor: 1 / 1000
    },
    kPa: {
      name: {
        singular: "kilopascal",
        plural: "kilopascals"
      },
      to_anchor: 1
    },
    MPa: {
      name: {
        singular: "megapascal",
        plural: "megapascals"
      },
      to_anchor: 1000
    },
    hPa: {
      name: {
        singular: "hectopascal",
        plural: "hectopascals"
      },
      to_anchor: 1 / 10
    },
    bar: {
      name: {
        singular: "bar",
        plural: "bar"
      },
      to_anchor: 100
    },
    torr: {
      name: {
        singular: "torr",
        plural: "torr"
      },
      to_anchor: 101325 / 760000
    }
  };
  imperial6 = {
    psi: {
      name: {
        singular: "pound per square inch",
        plural: "pounds per square inch"
      },
      to_anchor: 1 / 1000
    },
    ksi: {
      name: {
        singular: "kilopound per square inch",
        plural: "kilopound per square inch"
      },
      to_anchor: 1
    }
  };
  pressure_default = {
    metric: metric8,
    imperial: imperial6,
    _anchors: {
      metric: {
        unit: "kPa",
        ratio: 0.00014503768078
      },
      imperial: {
        unit: "psi",
        ratio: 1 / 0.00014503768078
      }
    }
  };
});

// src/lib/units/definitions/reactiveEnergy.js
var reactiveEnergy, reactiveEnergy_default;
var init_reactiveEnergy = __esm(() => {
  reactiveEnergy = {
    VARh: {
      name: {
        singular: "Volt-Ampere Reactive Hour",
        plural: "Volt-Amperes Reactive Hour"
      },
      to_anchor: 1
    },
    mVARh: {
      name: {
        singular: "Millivolt-Ampere Reactive Hour",
        plural: "Millivolt-Amperes Reactive Hour"
      },
      to_anchor: 0.001
    },
    kVARh: {
      name: {
        singular: "Kilovolt-Ampere Reactive Hour",
        plural: "Kilovolt-Amperes Reactive Hour"
      },
      to_anchor: 1000
    },
    MVARh: {
      name: {
        singular: "Megavolt-Ampere Reactive Hour",
        plural: "Megavolt-Amperes Reactive Hour"
      },
      to_anchor: 1e6
    },
    GVARh: {
      name: {
        singular: "Gigavolt-Ampere Reactive Hour",
        plural: "Gigavolt-Amperes Reactive Hour"
      },
      to_anchor: 1e9
    }
  };
  reactiveEnergy_default = {
    metric: reactiveEnergy,
    _anchors: {
      metric: {
        unit: "VARh",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/reactivePower.js
var reactivePower, reactivePower_default;
var init_reactivePower = __esm(() => {
  reactivePower = {
    VAR: {
      name: {
        singular: "Volt-Ampere Reactive",
        plural: "Volt-Amperes Reactive"
      },
      to_anchor: 1
    },
    mVAR: {
      name: {
        singular: "Millivolt-Ampere Reactive",
        plural: "Millivolt-Amperes Reactive"
      },
      to_anchor: 0.001
    },
    kVAR: {
      name: {
        singular: "Kilovolt-Ampere Reactive",
        plural: "Kilovolt-Amperes Reactive"
      },
      to_anchor: 1000
    },
    MVAR: {
      name: {
        singular: "Megavolt-Ampere Reactive",
        plural: "Megavolt-Amperes Reactive"
      },
      to_anchor: 1e6
    },
    GVAR: {
      name: {
        singular: "Gigavolt-Ampere Reactive",
        plural: "Gigavolt-Amperes Reactive"
      },
      to_anchor: 1e9
    }
  };
  reactivePower_default = {
    metric: reactivePower,
    _anchors: {
      metric: {
        unit: "VAR",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/speed.js
var metric9, imperial7, speed_default;
var init_speed = __esm(() => {
  metric9 = {
    "m/s": {
      name: {
        singular: "Metre per second",
        plural: "Metres per second"
      },
      to_anchor: 3.6
    },
    "km/h": {
      name: {
        singular: "Kilometre per hour",
        plural: "Kilometres per hour"
      },
      to_anchor: 1
    }
  };
  imperial7 = {
    "m/h": {
      name: {
        singular: "Mile per hour",
        plural: "Miles per hour"
      },
      to_anchor: 1
    },
    knot: {
      name: {
        singular: "Knot",
        plural: "Knots"
      },
      to_anchor: 1.150779
    },
    "ft/s": {
      name: {
        singular: "Foot per second",
        plural: "Feet per second"
      },
      to_anchor: 0.681818
    }
  };
  speed_default = {
    metric: metric9,
    imperial: imperial7,
    _anchors: {
      metric: {
        unit: "km/h",
        ratio: 1 / 1.609344
      },
      imperial: {
        unit: "m/h",
        ratio: 1.609344
      }
    }
  };
});

// src/lib/units/definitions/temperature.js
var metric10, imperial8, temperature_default;
var init_temperature = __esm(() => {
  metric10 = {
    C: {
      name: {
        singular: "degree Celsius",
        plural: "degrees Celsius"
      },
      to_anchor: 1,
      anchor_shift: 0
    },
    K: {
      name: {
        singular: "degree Kelvin",
        plural: "degrees Kelvin"
      },
      to_anchor: 1,
      anchor_shift: 273.15
    }
  };
  imperial8 = {
    F: {
      name: {
        singular: "degree Fahrenheit",
        plural: "degrees Fahrenheit"
      },
      to_anchor: 1
    },
    R: {
      name: {
        singular: "degree Rankine",
        plural: "degrees Rankine"
      },
      to_anchor: 1,
      anchor_shift: 459.67
    }
  };
  temperature_default = {
    metric: metric10,
    imperial: imperial8,
    _anchors: {
      metric: {
        unit: "C",
        transform(C) {
          return C / (5 / 9) + 32;
        }
      },
      imperial: {
        unit: "F",
        transform(F) {
          return (F - 32) * (5 / 9);
        }
      }
    }
  };
});

// src/lib/units/definitions/time.js
var time, daysInYear = 365.25, time_default2;
var init_time = __esm(() => {
  time = {
    ns: {
      name: {
        singular: "Nanosecond",
        plural: "Nanoseconds"
      },
      to_anchor: 1 / 1e9
    },
    mu: {
      name: {
        singular: "Microsecond",
        plural: "Microseconds"
      },
      to_anchor: 1 / 1e6
    },
    ms: {
      name: {
        singular: "Millisecond",
        plural: "Milliseconds"
      },
      to_anchor: 1 / 1000
    },
    s: {
      name: {
        singular: "Second",
        plural: "Seconds"
      },
      to_anchor: 1
    },
    min: {
      name: {
        singular: "Minute",
        plural: "Minutes"
      },
      to_anchor: 60
    },
    h: {
      name: {
        singular: "Hour",
        plural: "Hours"
      },
      to_anchor: 60 * 60
    },
    d: {
      name: {
        singular: "Day",
        plural: "Days"
      },
      to_anchor: 60 * 60 * 24
    },
    week: {
      name: {
        singular: "Week",
        plural: "Weeks"
      },
      to_anchor: 60 * 60 * 24 * 7
    },
    month: {
      name: {
        singular: "Month",
        plural: "Months"
      },
      to_anchor: 60 * 60 * 24 * daysInYear / 12
    },
    year: {
      name: {
        singular: "Year",
        plural: "Years"
      },
      to_anchor: 60 * 60 * 24 * daysInYear
    }
  };
  time_default2 = {
    metric: time,
    _anchors: {
      metric: {
        unit: "s",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/voltage.js
var voltage, voltage_default;
var init_voltage = __esm(() => {
  voltage = {
    V: {
      name: {
        singular: "Volt",
        plural: "Volts"
      },
      to_anchor: 1
    },
    mV: {
      name: {
        singular: "Millivolt",
        plural: "Millivolts"
      },
      to_anchor: 0.001
    },
    kV: {
      name: {
        singular: "Kilovolt",
        plural: "Kilovolts"
      },
      to_anchor: 1000
    }
  };
  voltage_default = {
    metric: voltage,
    _anchors: {
      metric: {
        unit: "V",
        ratio: 1
      }
    }
  };
});

// src/lib/units/definitions/volume.js
var metric11, imperial9, volume_default;
var init_volume = __esm(() => {
  metric11 = {
    mm3: {
      name: {
        singular: "Cubic Millimeter",
        plural: "Cubic Millimeters"
      },
      to_anchor: 1 / 1e6
    },
    cm3: {
      name: {
        singular: "Cubic Centimeter",
        plural: "Cubic Centimeters"
      },
      to_anchor: 1 / 1000
    },
    ml: {
      name: {
        singular: "Millilitre",
        plural: "Millilitres"
      },
      to_anchor: 1 / 1000
    },
    cl: {
      name: {
        singular: "Centilitre",
        plural: "Centilitres"
      },
      to_anchor: 1 / 100
    },
    dl: {
      name: {
        singular: "Decilitre",
        plural: "Decilitres"
      },
      to_anchor: 1 / 10
    },
    l: {
      name: {
        singular: "Litre",
        plural: "Litres"
      },
      to_anchor: 1
    },
    kl: {
      name: {
        singular: "Kilolitre",
        plural: "Kilolitres"
      },
      to_anchor: 1000
    },
    m3: {
      name: {
        singular: "Cubic meter",
        plural: "Cubic meters"
      },
      to_anchor: 1000
    },
    km3: {
      name: {
        singular: "Cubic kilometer",
        plural: "Cubic kilometers"
      },
      to_anchor: 1000000000000
    },
    krm: {
      name: {
        singular: "Matsked",
        plural: "Matskedar"
      },
      to_anchor: 1 / 1000
    },
    tsk: {
      name: {
        singular: "Tesked",
        plural: "Teskedar"
      },
      to_anchor: 5 / 1000
    },
    msk: {
      name: {
        singular: "Matsked",
        plural: "Matskedar"
      },
      to_anchor: 15 / 1000
    },
    kkp: {
      name: {
        singular: "Kaffekopp",
        plural: "Kaffekoppar"
      },
      to_anchor: 150 / 1000
    },
    glas: {
      name: {
        singular: "Glas",
        plural: "Glas"
      },
      to_anchor: 200 / 1000
    },
    kanna: {
      name: {
        singular: "Kanna",
        plural: "Kannor"
      },
      to_anchor: 2.617
    }
  };
  imperial9 = {
    tsp: {
      name: {
        singular: "Teaspoon",
        plural: "Teaspoons"
      },
      to_anchor: 1 / 6
    },
    Tbs: {
      name: {
        singular: "Tablespoon",
        plural: "Tablespoons"
      },
      to_anchor: 1 / 2
    },
    in3: {
      name: {
        singular: "Cubic inch",
        plural: "Cubic inches"
      },
      to_anchor: 0.55411
    },
    "fl-oz": {
      name: {
        singular: "Fluid Ounce",
        plural: "Fluid Ounces"
      },
      to_anchor: 1
    },
    cup: {
      name: {
        singular: "Cup",
        plural: "Cups"
      },
      to_anchor: 8
    },
    pnt: {
      name: {
        singular: "Pint",
        plural: "Pints"
      },
      to_anchor: 16
    },
    qt: {
      name: {
        singular: "Quart",
        plural: "Quarts"
      },
      to_anchor: 32
    },
    gal: {
      name: {
        singular: "Gallon",
        plural: "Gallons"
      },
      to_anchor: 128
    },
    ft3: {
      name: {
        singular: "Cubic foot",
        plural: "Cubic feet"
      },
      to_anchor: 957.506
    },
    yd3: {
      name: {
        singular: "Cubic yard",
        plural: "Cubic yards"
      },
      to_anchor: 25852.7
    }
  };
  volume_default = {
    metric: metric11,
    imperial: imperial9,
    _anchors: {
      metric: {
        unit: "l",
        ratio: 33.8140226
      },
      imperial: {
        unit: "fl-oz",
        ratio: 1 / 33.8140226
      }
    }
  };
});

// src/lib/units/definitions/volumeFlowRate.js
var metric12, imperial10, volumeFlowRate_default;
var init_volumeFlowRate = __esm(() => {
  metric12 = {
    "mm3/s": {
      name: {
        singular: "Cubic Millimeter per second",
        plural: "Cubic Millimeters per second"
      },
      to_anchor: 1 / 1e6
    },
    "cm3/s": {
      name: {
        singular: "Cubic Centimeter per second",
        plural: "Cubic Centimeters per second"
      },
      to_anchor: 1 / 1000
    },
    "ml/s": {
      name: {
        singular: "Millilitre per second",
        plural: "Millilitres per second"
      },
      to_anchor: 1 / 1000
    },
    "cl/s": {
      name: {
        singular: "Centilitre per second",
        plural: "Centilitres per second"
      },
      to_anchor: 1 / 100
    },
    "dl/s": {
      name: {
        singular: "Decilitre per second",
        plural: "Decilitres per second"
      },
      to_anchor: 1 / 10
    },
    "l/s": {
      name: {
        singular: "Litre per second",
        plural: "Litres per second"
      },
      to_anchor: 1
    },
    "l/min": {
      name: {
        singular: "Litre per minute",
        plural: "Litres per minute"
      },
      to_anchor: 1 / 60
    },
    "l/h": {
      name: {
        singular: "Litre per hour",
        plural: "Litres per hour"
      },
      to_anchor: 1 / 3600
    },
    "kl/s": {
      name: {
        singular: "Kilolitre per second",
        plural: "Kilolitres per second"
      },
      to_anchor: 1000
    },
    "kl/min": {
      name: {
        singular: "Kilolitre per minute",
        plural: "Kilolitres per minute"
      },
      to_anchor: 50 / 3
    },
    "kl/h": {
      name: {
        singular: "Kilolitre per hour",
        plural: "Kilolitres per hour"
      },
      to_anchor: 5 / 18
    },
    "m3/s": {
      name: {
        singular: "Cubic meter per second",
        plural: "Cubic meters per second"
      },
      to_anchor: 1000
    },
    "m3/min": {
      name: {
        singular: "Cubic meter per minute",
        plural: "Cubic meters per minute"
      },
      to_anchor: 50 / 3
    },
    "m3/h": {
      name: {
        singular: "Cubic meter per hour",
        plural: "Cubic meters per hour"
      },
      to_anchor: 5 / 18
    },
    "km3/s": {
      name: {
        singular: "Cubic kilometer per second",
        plural: "Cubic kilometers per second"
      },
      to_anchor: 1000000000000
    }
  };
  imperial10 = {
    "tsp/s": {
      name: {
        singular: "Teaspoon per second",
        plural: "Teaspoons per second"
      },
      to_anchor: 1 / 6
    },
    "Tbs/s": {
      name: {
        singular: "Tablespoon per second",
        plural: "Tablespoons per second"
      },
      to_anchor: 1 / 2
    },
    "in3/s": {
      name: {
        singular: "Cubic inch per second",
        plural: "Cubic inches per second"
      },
      to_anchor: 0.55411
    },
    "in3/min": {
      name: {
        singular: "Cubic inch per minute",
        plural: "Cubic inches per minute"
      },
      to_anchor: 0.55411 / 60
    },
    "in3/h": {
      name: {
        singular: "Cubic inch per hour",
        plural: "Cubic inches per hour"
      },
      to_anchor: 0.55411 / 3600
    },
    "fl-oz/s": {
      name: {
        singular: "Fluid Ounce per second",
        plural: "Fluid Ounces per second"
      },
      to_anchor: 1
    },
    "fl-oz/min": {
      name: {
        singular: "Fluid Ounce per minute",
        plural: "Fluid Ounces per minute"
      },
      to_anchor: 1 / 60
    },
    "fl-oz/h": {
      name: {
        singular: "Fluid Ounce per hour",
        plural: "Fluid Ounces per hour"
      },
      to_anchor: 1 / 3600
    },
    "cup/s": {
      name: {
        singular: "Cup per second",
        plural: "Cups per second"
      },
      to_anchor: 8
    },
    "pnt/s": {
      name: {
        singular: "Pint per second",
        plural: "Pints per second"
      },
      to_anchor: 16
    },
    "pnt/min": {
      name: {
        singular: "Pint per minute",
        plural: "Pints per minute"
      },
      to_anchor: 4 / 15
    },
    "pnt/h": {
      name: {
        singular: "Pint per hour",
        plural: "Pints per hour"
      },
      to_anchor: 1 / 225
    },
    "qt/s": {
      name: {
        singular: "Quart per second",
        plural: "Quarts per second"
      },
      to_anchor: 32
    },
    "gal/s": {
      name: {
        singular: "Gallon per second",
        plural: "Gallons per second"
      },
      to_anchor: 128
    },
    "gal/min": {
      name: {
        singular: "Gallon per minute",
        plural: "Gallons per minute"
      },
      to_anchor: 32 / 15
    },
    "gal/h": {
      name: {
        singular: "Gallon per hour",
        plural: "Gallons per hour"
      },
      to_anchor: 8 / 225
    },
    "ft3/s": {
      name: {
        singular: "Cubic foot per second",
        plural: "Cubic feet per second"
      },
      to_anchor: 957.506
    },
    "ft3/min": {
      name: {
        singular: "Cubic foot per minute",
        plural: "Cubic feet per minute"
      },
      to_anchor: 957.506 / 60
    },
    "ft3/h": {
      name: {
        singular: "Cubic foot per hour",
        plural: "Cubic feet per hour"
      },
      to_anchor: 957.506 / 3600
    },
    "yd3/s": {
      name: {
        singular: "Cubic yard per second",
        plural: "Cubic yards per second"
      },
      to_anchor: 25852.7
    },
    "yd3/min": {
      name: {
        singular: "Cubic yard per minute",
        plural: "Cubic yards per minute"
      },
      to_anchor: 25852.7 / 60
    },
    "yd3/h": {
      name: {
        singular: "Cubic yard per hour",
        plural: "Cubic yards per hour"
      },
      to_anchor: 25852.7 / 3600
    }
  };
  volumeFlowRate_default = {
    metric: metric12,
    imperial: imperial10,
    _anchors: {
      metric: {
        unit: "l/s",
        ratio: 33.8140227
      },
      imperial: {
        unit: "fl-oz/s",
        ratio: 1 / 33.8140227
      }
    }
  };
});

// src/lib/units/index.js
class Converter {
  constructor(numerator, denominator) {
    this.val = denominator ? numerator / denominator : numerator;
    this.origin = null;
    this.destination = null;
  }
  from(from) {
    if (this.destination) {
      throw new Error(".from must be called before .to");
    }
    this.origin = this.getUnit(from);
    if (!this.origin) {
      this.throwUnsupportedUnitError(from);
    }
    return this;
  }
  to(to) {
    if (!this.origin) {
      throw new Error(".to must be called after .from");
    }
    this.destination = this.getUnit(to);
    if (!this.destination) {
      this.throwUnsupportedUnitError(to);
    }
    if (this.origin.abbr === this.destination.abbr) {
      return this.val;
    }
    if (this.destination.measure !== this.origin.measure) {
      throw new Error(`Cannot convert incompatible measures of ${this.destination.measure} and ${this.origin.measure}`);
    }
    let result = this.val * this.origin.unit.to_anchor;
    if (this.origin.unit.anchor_shift) {
      result -= this.origin.unit.anchor_shift;
    }
    if (this.origin.system !== this.destination.system) {
      const anchor = measures[this.origin.measure]._anchors[this.origin.system];
      if (typeof anchor.transform === "function") {
        result = anchor.transform(result);
      } else {
        result *= anchor.ratio;
      }
    }
    if (this.destination.unit.anchor_shift) {
      result += this.destination.unit.anchor_shift;
    }
    return result / this.destination.unit.to_anchor;
  }
  toBest(opts = {}) {
    if (!this.origin) {
      throw new Error(".toBest must be called after .from");
    }
    const options = {
      exclude: [],
      cutOffNumber: 1,
      ...opts
    };
    let best;
    this.possibilities().forEach((possibility) => {
      const unit = this.describe(possibility);
      const isIncluded = !options.exclude.includes(possibility);
      if (isIncluded && unit.system === this.origin.system) {
        const result = this.to(possibility);
        if (!best || result >= options.cutOffNumber && result < best.val) {
          best = {
            val: result,
            unit: possibility,
            singular: unit.singular,
            plural: unit.plural
          };
        }
      }
    });
    return best;
  }
  getUnit(abbr) {
    let found = null;
    Object.keys(measures).some((measure) => {
      const systems = measures[measure];
      return Object.keys(systems).some((system) => {
        if (system === "_anchors")
          return false;
        const units = systems[system];
        return Object.keys(units).some((testAbbr) => {
          if (testAbbr !== abbr)
            return false;
          found = {
            abbr,
            measure,
            system,
            unit: units[testAbbr]
          };
          return true;
        });
      });
    });
    return found;
  }
  describe(abbr) {
    const resp = this.getUnit(abbr);
    if (!resp) {
      this.throwUnsupportedUnitError(abbr);
    }
    return {
      abbr: resp.abbr,
      measure: resp.measure,
      system: resp.system,
      singular: resp.unit.name.singular,
      plural: resp.unit.name.plural
    };
  }
  list(measure) {
    const list = [];
    Object.keys(measures).forEach((testMeasure) => {
      if (measure && measure !== testMeasure)
        return;
      const systems = measures[testMeasure];
      Object.keys(systems).forEach((system) => {
        if (system === "_anchors")
          return;
        const units = systems[system];
        Object.keys(units).forEach((abbr) => {
          const unit = units[abbr];
          list.push({
            abbr,
            measure: testMeasure,
            system,
            singular: unit.name.singular,
            plural: unit.name.plural
          });
        });
      });
    });
    return list;
  }
  throwUnsupportedUnitError(what) {
    const validUnits = [];
    Object.keys(measures).forEach((measure) => {
      const systems = measures[measure];
      Object.keys(systems).forEach((system) => {
        if (system === "_anchors")
          return;
        validUnits.push(...Object.keys(systems[system]));
      });
    });
    throw new Error(`Unsupported unit ${what}, use one of: ${validUnits.join(", ")}`);
  }
  possibilities(measure) {
    const possibilities = [];
    if (!this.origin && !measure) {
      Object.keys(measures).forEach((group) => {
        Object.keys(measures[group]).forEach((system) => {
          if (system === "_anchors")
            return;
          possibilities.push(...Object.keys(measures[group][system]));
        });
      });
      return possibilities;
    }
    const targetMeasure = measure || this.origin.measure;
    Object.keys(measures[targetMeasure]).forEach((system) => {
      if (system === "_anchors")
        return;
      possibilities.push(...Object.keys(measures[targetMeasure][system]));
    });
    return possibilities;
  }
  measures() {
    return Object.keys(measures);
  }
}
function convert(value) {
  return new Converter(value);
}
var measures;
var init_units = __esm(() => {
  init_angle();
  init_apparentPower();
  init_area();
  init_current();
  init_digital();
  init_each();
  init_energy();
  init_frequency();
  init_illuminance();
  init_length();
  init_mass();
  init_pace();
  init_partsPer();
  init_power();
  init_pressure();
  init_reactiveEnergy();
  init_reactivePower();
  init_speed();
  init_temperature();
  init_time();
  init_voltage();
  init_volume();
  init_volumeFlowRate();
  measures = {
    length: length_default,
    area: area_default,
    mass: mass_default,
    volume: volume_default,
    each: each_default,
    temperature: temperature_default,
    time: time_default2,
    digital: digital_default,
    partsPer: partsPer_default,
    speed: speed_default,
    pace: pace_default,
    pressure: pressure_default,
    current: current_default,
    voltage: voltage_default,
    power: power_default,
    reactivePower: reactivePower_default,
    apparentPower: apparentPower_default,
    energy: energy_default,
    reactiveEnergy: reactiveEnergy_default,
    volumeFlowRate: volumeFlowRate_default,
    illuminance: illuminance_default,
    frequency: frequency_default,
    angle: angle_default
  };
});

// src/lib/tree/symbols.js
var EOF, EOL, FFI, TEXT, REF, CODE, BOLD, ITALIC, OL_ITEM, UL_ITEM, HEADING, BLOCKQUOTE, TABLE, OPEN, CLOSE, COMMA, BEGIN, DONE, MINUS, PLUS, MUL, DIV, MOD, OR, DOT, PIPE, BLOCK, RANGE, SPREAD, SOME, EVERY, REGEX, SYMBOL, DIRECTIVE, LITERAL, NUMBER, STRING, NOT, LIKE, EQUAL, NOT_EQ, EXACT_EQ, LESS, LESS_EQ, GREATER, GREATER_EQ, COMMENT, COMMENT_MULTI, DERIVE_METHODS, CONTROL_TYPES, SYMBOL_TYPES;
var init_symbols = __esm(() => {
  EOF = Symbol("EOF");
  EOL = Symbol("EOL");
  FFI = Symbol("FFI");
  TEXT = Symbol("TEXT");
  REF = Symbol("REF");
  CODE = Symbol("CODE");
  BOLD = Symbol("BOLD");
  ITALIC = Symbol("ITALIC");
  OL_ITEM = Symbol("OL_ITEM");
  UL_ITEM = Symbol("UL_ITEM");
  HEADING = Symbol("HEADING");
  BLOCKQUOTE = Symbol("BLOCKQUOTE");
  TABLE = Symbol("TABLE");
  OPEN = Symbol("OPEN");
  CLOSE = Symbol("CLOSE");
  COMMA = Symbol("COMMA");
  BEGIN = Symbol("BEGIN");
  DONE = Symbol("DONE");
  MINUS = Symbol("MINUS");
  PLUS = Symbol("PLUS");
  MUL = Symbol("MUL");
  DIV = Symbol("DIV");
  MOD = Symbol("MOD");
  OR = Symbol("OR");
  DOT = Symbol("DOT");
  PIPE = Symbol("PIPE");
  BLOCK = Symbol("BLOCK");
  RANGE = Symbol("RANGE");
  SPREAD = Symbol("SPREAD");
  SOME = Symbol("SOME");
  EVERY = Symbol("EVERY");
  REGEX = Symbol("REGEX");
  SYMBOL = Symbol("SYMBOL");
  DIRECTIVE = Symbol("DIRECTIVE");
  LITERAL = Symbol("LITERAL");
  NUMBER = Symbol("NUMBER");
  STRING = Symbol("STRING");
  NOT = Symbol("NOT");
  LIKE = Symbol("LIKE");
  EQUAL = Symbol("EQUAL");
  NOT_EQ = Symbol("NOT_EQ");
  EXACT_EQ = Symbol("EXACT_EQ");
  LESS = Symbol("LESS");
  LESS_EQ = Symbol("LESS_EQ");
  GREATER = Symbol("GREATER");
  GREATER_EQ = Symbol("GREATER_EQ");
  COMMENT = Symbol("COMMENT");
  COMMENT_MULTI = Symbol("COMMENT_MULTI");
  DERIVE_METHODS = [
    "If",
    "It",
    "Then",
    "Else",
    "Try",
    "Check",
    "Rescue",
    "While",
    "Do",
    "Let",
    "Match"
  ];
  CONTROL_TYPES = [
    "@namespace",
    "@table",
    "@if",
    "@else",
    "@ok",
    "@err",
    "@try",
    "@check",
    "@rescue",
    "@while",
    "@do",
    "@let",
    "@loop",
    "@match",
    "@import",
    "@from",
    "@module",
    "@export",
    "@template"
  ];
  SYMBOL_TYPES = [
    ":nil",
    ":on",
    ":off",
    ":click",
    ":focus",
    ":blur",
    ":input",
    ":change",
    ":submit",
    ":load",
    ":error",
    ":mouseenter",
    ":mouseleave",
    ":mousedown",
    ":mouseup",
    ":mouseover",
    ":mouseout",
    ":keydown",
    ":keyup",
    ":keypress",
    ":touchstart",
    ":touchend",
    ":touchmove",
    ":touchcancel"
  ];
});

// src/lib/currency-symbols.js
var currency_symbols_default;
var init_currency_symbols = __esm(() => {
  currency_symbols_default = {
    AED: "د.إ",
    AFN: "؋",
    ALL: "L",
    AMD: "դր.",
    ANG: "ƒ",
    AOA: "Kz",
    ARS: "$",
    AUD: "$",
    AWG: "ƒ",
    AZN: "₼",
    BAM: "КМ",
    BBD: "$",
    BDT: "৳",
    BGN: "лв",
    BHD: "ب.د",
    BIF: "Fr",
    BMD: "$",
    BND: "$",
    BOB: "Bs.",
    BRL: "R$ ",
    BSD: "$",
    BTC: "Ƀ",
    BTN: "Nu.",
    BWP: "P",
    BYR: "Br",
    BZD: "$",
    CAD: "$",
    CDF: "Fr",
    CHF: "Fr",
    CLF: "UF",
    CLP: "$",
    CNY: "¥",
    COP: "$",
    CRC: "₡",
    CUC: "$",
    CUP: "$",
    CVE: "$",
    CZK: "Kč",
    DJF: "Fdj",
    DKK: "kr",
    DOP: "$",
    DZD: "د.ج",
    EEK: "kr",
    EGP: "ج.م",
    ERN: "Nfk",
    ETB: "Br",
    EUR: "€",
    FJD: "$",
    FKP: "£",
    GBP: "£",
    GEL: "ლ",
    GGP: "£",
    GHS: "₵",
    GIP: "£",
    GMD: "D",
    GNF: "Fr",
    GTQ: "Q",
    GYD: "$",
    HKD: "$",
    HNL: "L",
    HRK: "kn",
    HTG: "G",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    IMP: "£",
    INR: "₹",
    IQD: "ع.د",
    IRR: "﷼",
    ISK: "kr",
    JEP: "£",
    JMD: "$",
    JOD: "د.ا",
    JPY: "¥",
    KES: "KSh",
    KGS: "som",
    KHR: "៛",
    KMF: "Fr",
    KPW: "₩",
    KRW: "₩",
    KWD: "د.ك",
    KYD: "$",
    KZT: "〒",
    LAK: "₭",
    LBP: "ل.ل",
    LKR: "₨",
    LRD: "$",
    LSL: "L",
    LTL: "Lt",
    LVL: "Ls",
    LYD: "ل.د",
    MAD: "د.م.",
    MDL: "L",
    MGA: "Ar",
    MKD: "ден",
    MMK: "K",
    MNT: "₮",
    MOP: "P",
    MRO: "UM",
    MTL: "₤",
    MUR: "₨",
    MVR: "MVR",
    MWK: "MK",
    MXN: "$",
    MYR: "RM",
    MZN: "MTn",
    NAD: "$",
    NGN: "₦",
    NIO: "C$",
    NOK: "kr",
    NPR: "₨",
    NZD: "$",
    OMR: "ر.ع.",
    PAB: "B/.",
    PEN: "S/.",
    PGK: "K",
    PHP: "₱",
    PKR: "₨",
    PLN: "zł",
    PYG: "₲",
    QAR: "ر.ق",
    RON: "L",
    RSD: "РСД",
    RUB: "р.",
    RWF: "FRw",
    SAR: "ر.س",
    SBD: "$",
    SCR: "₨",
    SDG: "£",
    SEK: "kr",
    SGD: "$",
    SHP: "£",
    SKK: "Sk",
    SLL: "Le",
    SOS: "Sh",
    SRD: "$",
    STD: "Db",
    SVC: "₡",
    SYP: "£S",
    SZL: "L",
    THB: "฿",
    TJS: "ЅМ",
    TMM: "m",
    TMT: "m",
    TND: "د.ت",
    TOP: "T$",
    TRY: "TL",
    TTD: "$",
    TWD: "$",
    TZS: "Sh",
    UAH: "₴",
    UGX: "USh",
    USD: "$",
    UYU: "$",
    UZS: "лв",
    VEF: "Bs F",
    VND: "₫",
    VUV: "Vt",
    WST: "T",
    XAF: "Fr",
    XAG: "Ag Oz",
    XAU: "Au Oz",
    XCD: "$",
    XDR: "XDR",
    XOF: "Fr",
    XPF: "Fr",
    YER: "﷼",
    ZAR: "R",
    ZMK: "ZK",
    ZMW: "ZK",
    ZWL: "Z$"
  };
});

// src/lib/builtins.js
function getConvert() {
  if (!convertCache) {
    convertCache = new convert;
  }
  return convertCache;
}
function ensureCurrencyMappings() {
  if (currencyMappingsReady)
    return;
  currencyMappingsReady = true;
  Object.assign(CURRENCY_SYMBOLS, currency_symbols_default);
  Object.keys(CURRENCY_SYMBOLS).forEach((key) => {
    const symbol = CURRENCY_SYMBOLS[key];
    CURRENCY_MAPPINGS[symbol] = key;
    DEFAULT_MAPPINGS[key] = key;
  });
}
function ensureDefaultMappings() {
  ensureCurrencyMappings();
  if (unitMappingsReady)
    return DEFAULT_MAPPINGS;
  unitMappingsReady = true;
  const convert2 = getConvert();
  const groups = convert2.measures();
  TIME_UNITS.push(...convert2.list("time").map((x) => x.abbr).sort());
  groups.forEach((group) => {
    convert2.list(group).forEach((unit) => {
      const abbr = unit.abbr;
      const plural = unit.plural;
      const singular = unit.singular;
      DEFAULT_MAPPINGS[abbr] = abbr;
      if (!plural.includes(" ") && singular !== plural) {
        DEFAULT_MAPPINGS[plural.toLowerCase()] = abbr;
        DEFAULT_MAPPINGS[singular.toLowerCase()] = abbr;
        DEFAULT_INFLECTIONS[abbr] = [singular.toLowerCase(), plural.toLowerCase()];
      }
    });
  });
  return DEFAULT_MAPPINGS;
}
async function useCurrencies(opts, fromDate) {
  ensureCurrencyMappings();
  const today2 = fromDate || new Date().toISOString().substr(0, 10);
  const {
    key,
    read,
    write,
    exists,
    resolve
  } = opts;
  if (!exists(key) || read(key).date !== today2) {
    write(key, JSON.stringify({
      ...await resolve(),
      date: today2
    }));
  }
  Object.assign(CURRENCY_EXCHANGES, read(key).rates);
}
var convertCache = null, unitMappingsReady = false, currencyMappingsReady = false, TIME_UNITS, CURRENCY_SYMBOLS, CURRENCY_MAPPINGS, CURRENCY_EXCHANGES, DEFAULT_MAPPINGS, DEFAULT_INFLECTIONS;
var init_builtins = __esm(() => {
  init_units();
  init_currency_symbols();
  TIME_UNITS = [];
  CURRENCY_SYMBOLS = {};
  CURRENCY_MAPPINGS = {};
  CURRENCY_EXCHANGES = {};
  DEFAULT_MAPPINGS = {};
  DEFAULT_INFLECTIONS = {};
});

// node_modules/somedom/dist/somedom.mjs
function g(t) {
  return e.test(t);
}
function y(e2) {
  return !(!a(e2) || !u(e2[0])) || !!(e2 && a(e2) && g(e2[0])) && !!(f(e2[1]) && e2.length >= 2);
}
function v(e2) {
  return e2 === null || !u(e2) && (a(e2) ? e2.length === 0 : f(e2) ? Object.keys(e2).length === 0 : d(e2) || e2 === false);
}
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
        const c2 = t2.replace("@", "data-").replace(r, "");
        if (b(o)) {
          oe(e2, `${se}${c2}`, o);
          const t3 = e2.teardown;
          return void (e2.teardown = () => {
            ce(e2), t3 && t3();
          });
        }
        let l2 = o !== true ? o : !!c2.includes("-") || c2;
        p(l2) && (l2 = u(s) && s(e2, c2, l2) || l2, l2 = l2 !== e2 ? l2 : null, l2 = a(l2) ? l2.join("") : l2);
        const d2 = v(l2);
        if (n && t2 !== c2)
          return void (d2 ? e2.removeAttributeNS(i, c2) : e2.setAttributeNS(i, c2, l2));
        d2 ? e2.removeAttribute(c2) : h(l2) && e2.setAttribute(c2, l2);
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
  let c2 = s ? document.createElementNS("http://www.w3.org/2000/svg", r2) : document.createElement(r2);
  if (i2 && i2.key && c2.setAttribute("data-key", i2.key), u(n) && (c2 = n(c2, r2, i2, o) || c2), u(c2))
    return pe(c2(), s, n);
  v(i2) || ae(c2, i2, s, n), u(c2.oncreate) && c2.oncreate(c2), u(c2.enter) && c2.enter(), c2.remove = () => Promise.resolve().then(() => u(c2.ondestroy) && c2.ondestroy(c2)).then(() => u(c2.teardown) && c2.teardown()).then(() => u(c2.exit) && c2.exit()).then(() => q(c2)), o.forEach((e3) => {
    he(c2, e3, s, n);
  });
  const l2 = c2.childNodes;
  if (l2.length > 0) {
    const e3 = c2.teardown;
    c2.teardown = () => {
      for (let e4 = 0;e4 < l2.length; e4++) {
        const t2 = l2[e4];
        t2._signalDispose && t2._signalDispose();
      }
      e3 && e3();
    };
  }
  return c2;
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
    const r3 = [], i2 = x(t2), o = Math.max(e3.childNodes.length, i2.length), c2 = Array.from(e3.childNodes), a2 = new Map, l2 = new Set;
    for (let e4 = 0;e4 < c2.length; e4++) {
      const t3 = E(c2[e4]);
      t3 && a2.set(t3, { el: c2[e4], index: e4 });
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
var e, r, i = "http://www.w3.org/1999/xlink", c, a = (e2) => Array.isArray(e2), l = (e2) => typeof e2 == "string", u = (e2) => typeof e2 == "function", d = (e2) => e2 == null, f = (e2) => e2 !== null && Object.prototype.toString.call(e2) === "[object Object]", p = (e2) => e2 !== null && (typeof e2 == "function" || typeof e2 == "object"), h = (e2) => l(e2) || typeof e2 == "number" || typeof e2 == "boolean", b = (e2) => e2 !== null && typeof e2 == "object" && ("value" in e2) && typeof e2.peek == "function", m = (e2) => a(e2) && !y(e2), T = (e2) => e2.replace(/-([a-z])/g, (e3, t) => t.toUpperCase()), U = (e2, t) => e2 && e2.removeChild(t), q = (e2, t) => {
  t && (L.valid(t) ? t.mount(e2.parentNode, e2) : e2.parentNode.insertBefore(t, e2)), U(e2.parentNode, e2);
}, G = null, Q, se = "s:", ue = () => typeof Element != "undefined" && ("moveBefore" in Element.prototype), me = (e2 = "div", t = null, ...n) => h(t) ? [e2, {}, [t].concat(n).filter((e3) => !d(e3))] : a(t) && !n.length ? [e2, {}, t] : [e2, t || {}, n];
var init_somedom = __esm(() => {
  e = /^[0-9A-Za-z-]+$/;
  r = /^xlink:?/;
  c = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  Q = new Set;
});

// src/lib/void-tags.js
function isVoidTag(name) {
  return VOID_TAGS.has(String(name || "").toLowerCase());
}
var VOID_TAGS;
var init_void_tags = __esm(() => {
  init_somedom();
  VOID_TAGS = new Set((c || []).map((name) => String(name).toLowerCase()));
});

// src/lib/tag.js
function fail(message) {
  throw new Error(message);
}
function isPlain(value) {
  return value && Object.prototype.toString.call(value) === "[object Object]";
}
function skipSpaces(input2, state) {
  while (state.i < input2.length && /\s/.test(input2[state.i]))
    state.i++;
}
function consumeOptionalClosingTag(input2, state, name) {
  let offset = state.i;
  while (offset < input2.length && /\s/.test(input2[offset]))
    offset++;
  if (input2[offset] !== "<" || input2[offset + 1] !== "/")
    return;
  offset += 2;
  const start = offset;
  while (offset < input2.length && /[A-Za-z0-9:_-]/.test(input2[offset]))
    offset++;
  if (offset === start)
    return;
  const closeName = input2.slice(start, offset);
  if (closeName.toLowerCase() !== String(name || "").toLowerCase())
    return;
  while (offset < input2.length && /\s/.test(input2[offset]))
    offset++;
  if (input2[offset] !== ">")
    return;
  state.i = offset + 1;
}
function readName(input2, state) {
  const start = state.i;
  while (state.i < input2.length && /[A-Za-z0-9:_-]/.test(input2[state.i]))
    state.i++;
  if (state.i === start)
    fail("Invalid tag name");
  return input2.slice(start, state.i);
}
function readQuoted(input2, state) {
  const quote = input2[state.i++];
  const start = state.i;
  while (state.i < input2.length && input2[state.i] !== quote)
    state.i++;
  if (state.i >= input2.length)
    fail("Unterminated attribute string");
  const value = input2.slice(start, state.i);
  state.i++;
  return value;
}
function readUnquoted(input2, state) {
  const start = state.i;
  while (state.i < input2.length && !/[\s/>]/.test(input2[state.i]))
    state.i++;
  return input2.slice(start, state.i);
}
function parseAttrs(input2, state) {
  const attrs = {};
  const spreads = [];
  while (state.i < input2.length) {
    skipSpaces(input2, state);
    if (input2[state.i] === "/" || input2[state.i] === ">")
      break;
    if (input2[state.i] === "{") {
      const spreadExpr = readExpr(input2, state);
      if (!spreadExpr.expr.startsWith("..."))
        fail("Only spread expressions are allowed in tag attrs");
      const source = spreadExpr.expr.slice(3).trim();
      if (!source)
        fail("Missing source after spread operator in tag attrs");
      spreads.push({ expr: source });
      continue;
    }
    const key = readName(input2, state);
    skipSpaces(input2, state);
    if (input2[state.i] === "=") {
      state.i++;
      skipSpaces(input2, state);
      if (input2[state.i] === "{") {
        attrs[key] = readExpr(input2, state);
      } else if (input2[state.i] === '"' || input2[state.i] === "'") {
        attrs[key] = readQuoted(input2, state);
      } else {
        attrs[key] = readUnquoted(input2, state);
      }
    } else {
      attrs[key] = true;
    }
  }
  return { attrs, spreads };
}
function parseText(input2, state) {
  const start = state.i;
  while (state.i < input2.length) {
    const ch = input2[state.i];
    if (ch === "<")
      break;
    if (ch === "#" && input2[state.i + 1] === "{")
      break;
    state.i++;
  }
  return input2.slice(start, state.i);
}
function readExpr(input2, state) {
  if (input2[state.i] !== "{")
    fail("Expecting `{`");
  state.i++;
  let depth = 1;
  let buffer = "";
  let inQuote = null;
  while (state.i < input2.length && depth > 0) {
    const cur = input2[state.i++];
    if (inQuote) {
      buffer += cur;
      if (cur === inQuote && input2[state.i - 2] !== "\\")
        inQuote = null;
      continue;
    }
    if (cur === '"' || cur === "'") {
      inQuote = cur;
      buffer += cur;
      continue;
    }
    if (cur === "{") {
      depth++;
      buffer += cur;
      continue;
    }
    if (cur === "}") {
      depth--;
      if (depth > 0)
        buffer += cur;
      continue;
    }
    buffer += cur;
  }
  if (depth !== 0)
    fail("Unterminated expression in tag");
  const source = buffer.trim();
  if (source === "@render")
    fail("Missing expression after @render");
  if (source.startsWith("@render ")) {
    return { expr: source.slice(8).trim() };
  }
  return { expr: source };
}
function parseNode(input2, state) {
  if (input2[state.i] !== "<")
    fail("Expecting `<`");
  state.i++;
  const name = readName(input2, state);
  const { attrs, spreads } = parseAttrs(input2, state);
  let selfClosing = false;
  if (input2[state.i] === "/") {
    selfClosing = true;
    state.i++;
  }
  if (input2[state.i] !== ">")
    fail("Expecting `>`");
  state.i++;
  const node = {
    name,
    attrs,
    children: [],
    selfClosing
  };
  if (spreads.length)
    node.spreads = spreads;
  if (selfClosing)
    return node;
  if (isVoidTag(name)) {
    node.selfClosing = true;
    consumeOptionalClosingTag(input2, state, name);
    return node;
  }
  while (state.i < input2.length) {
    if (input2[state.i] === "<" && input2[state.i + 1] === "/") {
      state.i += 2;
      const closeName = readName(input2, state);
      if (closeName !== name)
        fail(`Mismatched closing tag: </${closeName}>`);
      skipSpaces(input2, state);
      if (input2[state.i] !== ">")
        fail("Expecting `>`");
      state.i++;
      return node;
    }
    if (input2[state.i] === "<") {
      node.children.push(parseNode(input2, state));
      continue;
    }
    if (input2[state.i] === "#" && input2[state.i + 1] === "{") {
      state.i++;
      node.children.push(readExpr(input2, state));
      continue;
    }
    const text = parseText(input2, state);
    if (text.length) {
      node.children.push(text);
    }
  }
  fail(`Missing closing tag for <${name}>`);
}
function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
function parseTag(input2) {
  if (!input2 || typeof input2 !== "string")
    fail("Invalid tag input");
  const source = input2.trim();
  const state = { i: 0 };
  const node = parseNode(source, state);
  skipSpaces(source, state);
  if (state.i !== source.length)
    fail("Unexpected trailing content after tag");
  return node;
}
function renderTag(node) {
  if (!node || typeof node.name !== "string")
    fail("Invalid tag value");
  const attrs = Object.keys(node.attrs || {}).map((key) => {
    const value = node.attrs[key];
    if (value === true)
      return key;
    return `${key}="${escapeAttr(String(value))}"`;
  }).join(" ");
  const open = attrs.length ? `<${node.name} ${attrs}` : `<${node.name}`;
  const children = (node.children || []).map((child) => {
    if (typeof child === "string")
      return escapeText(child);
    if (typeof child === "number" || typeof child === "boolean")
      return escapeText(String(child));
    if (child && typeof child.expr === "string") {
      return child._resolved !== undefined && child._resolved !== null ? escapeText(String(child._resolved)) : `#{${child.expr}}`;
    }
    return renderTag(child);
  }).join("");
  if (node.selfClosing && !children.length) {
    return `${open} />`;
  }
  return `${open}>${children}</${node.name}>`;
}
function asChild(value) {
  if (value === null || typeof value === "undefined")
    return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (isPlain(value) && typeof value.name === "string")
    return value;
  return String(value);
}
function composeTag(node, args) {
  const next = {
    name: node.name,
    attrs: { ...node.attrs || {} },
    children: [...node.children || []],
    selfClosing: false
  };
  let offset = 0;
  if (args[0] && isPlain(args[0]) && !Array.isArray(args[0]) && !("name" in args[0])) {
    Object.assign(next.attrs, args[0]);
    offset = 1;
  }
  for (let i2 = offset;i2 < args.length; i2++) {
    const child = asChild(args[i2]);
    if (child !== null)
      next.children.push(child);
  }
  return next;
}
var init_tag = __esm(() => {
  init_void_tags();
});

// src/lib/helpers.js
class Token {
  constructor(type, text, value, tokenInfo) {
    const {
      line,
      col,
      kind
    } = tokenInfo || {};
    if (kind)
      this.kind = kind;
    this.value = typeof value !== "undefined" && value !== null ? value : text;
    this.type = type;
    this.line = line;
    this.col = col;
  }
  valueOf() {
    return this.value;
  }
  get isRaw() {
    return this.kind === "raw";
  }
  get isMulti() {
    return this.kind === "multi";
  }
  get isMarkup() {
    return this.kind === "markup";
  }
  static get(token, isWeak) {
    if (typeof token === "undefined")
      throw new Error("Invalid token");
    const result = !isWeak || typeof token.value === "undefined" ? token.valueOf() : token.value;
    if (isWeak && token.type === SYMBOL) {
      return result.substr(1);
    }
    return Array.isArray(result) ? result.map((x2) => {
      if (x2.type === LITERAL && x2.value === "_")
        return LITERAL;
      return Token.get(x2, isWeak);
    }) : result;
  }
}
function isSymbol(t) {
  return t && t.type === SYMBOL;
}
function isDirective(t) {
  return t && t.type === DIRECTIVE;
}
function isNumber(t) {
  return t && t.type === NUMBER;
}
function isString(t) {
  return t && t.type === STRING;
}
function isComma(t) {
  return t && t.type === COMMA;
}
function isEqual(t) {
  return t && t.type === EQUAL;
}
function isBlock(t) {
  return t && t.type === BLOCK;
}
function isRange(t) {
  return t && t.type === RANGE;
}
function isBegin(t) {
  return t && t.type === BEGIN;
}
function isSome(t) {
  return t && t.type === SOME;
}
function isEvery(t) {
  return t && t.type === EVERY;
}
function isDone(t) {
  return t && t.type === DONE;
}
function isClose(t) {
  return t && t.type === CLOSE;
}
function isOpen(t) {
  return t && t.type === OPEN;
}
function isPipe(t) {
  return t && t.type === PIPE;
}
function isText(t) {
  return t && t.type === TEXT;
}
function isCode(t) {
  return t && t.type === CODE;
}
function isDot(t) {
  return t && t.type === DOT;
}
function isMod(t) {
  return t && t.type === MOD;
}
function isNot(t) {
  return t && t.type === NOT;
}
function isRef(t) {
  return t && t.type === REF;
}
function isOR(t) {
  return t && t.type === OR;
}
function isEOF(t) {
  return t && t.type === EOF;
}
function isEOL(t) {
  return t && t.type === EOL;
}
function isInvokable(t) {
  return t && INVOKE_TYPES.includes(t.type);
}
function isComment(t) {
  return t && COMMENT_TYPES.includes(t.type);
}
function isResult(t) {
  return t && RESULT_TYPES.includes(t.type);
}
function isScalar(t) {
  return t && SCALAR_TYPES.includes(t.type);
}
function isLogic(t) {
  return t && LOGIC_TYPES.includes(t.type);
}
function isMath(t) {
  return t && MATH_TYPES.includes(t.type);
}
function isList(t) {
  return t && LIST_TYPES.includes(t.type);
}
function isEnd(t) {
  return t && END_TYPES.includes(t.type);
}
function isCall(t) {
  return t && (t.type === PIPE || t.type === BLOCK && !t.value.body && t.value.args);
}
function isMixed(t, ...o) {
  return t && t.type === LITERAL && t.value && o.includes(typeof t.value);
}
function isPlain2(t) {
  return t && Object.prototype.toString.call(t) === "[object Object]";
}
function isObject(t) {
  return t && t.type === LITERAL && (t.isObject || isMixed(t, "object"));
}
function isLiteral(t, v2) {
  return t && t.type === LITERAL && (v2 ? t.value === v2 : true);
}
function isOperator(t) {
  return isLogic(t) || isMath(t);
}
function isStatement(t) {
  if (!t)
    return false;
  if (typeof t === "string")
    return CONTROL_TYPES.includes(t);
  return isDirective(t) && CONTROL_TYPES.includes(t.value);
}
function isSpecial(t) {
  return t && SYMBOL_TYPES.includes(t.value);
}
function isArray(t) {
  return t && t.type === RANGE && Array.isArray(t.value);
}
function isSlice(t) {
  return t && t.type === SYMBOL && RE_SLICING.test(t.value);
}
function isUnit(t) {
  return t && t.type === NUMBER && isPlain2(t.value);
}
function isData(t) {
  return isRange(t) && Array.isArray(t.value) || isLiteral(t) || isResult(t) && !isInvokable(t);
}
function hasStatements(o) {
  return CONTROL_TYPES.some((k2) => o[k2.substr(1)] && o[k2.substr(1)].isStatement);
}
function hasBreaks(token) {
  if (isString(token) && typeof token.value === "string") {
    return token.value.includes(`
`);
  }
  if (isText(token)) {
    return token.value.buffer.some((x2) => typeof x2 === "string" && x2.includes(`
`));
  }
}
function hasDiff(prev, next, isWeak) {
  if (prev === LITERAL || next === LITERAL)
    return false;
  const prevValue = Token.get(prev, isWeak);
  const nextValue = Token.get(next, isWeak);
  if (prevValue instanceof RegExp || nextValue instanceof RegExp) {
    const regexp = prevValue instanceof RegExp ? prevValue : nextValue;
    const value = prevValue instanceof RegExp ? nextValue : prevValue;
    return !regexp.test(value);
  }
  if (Array.isArray(prevValue)) {
    if (isWeak) {
      prevValue.length = nextValue.length = Math.min(prevValue.length, nextValue.length);
    }
    if (prevValue.length !== nextValue.length)
      return true;
    for (let i2 = 0, c2 = prevValue.length;i2 < c2; i2++) {
      if (hasDiff(prevValue[i2], nextValue[i2], isWeak))
        return true;
    }
    return false;
  }
  if (isPlain2(prevValue)) {
    if (!isPlain2(nextValue))
      return true;
    const a2 = Object.keys(prevValue).sort();
    const b2 = Object.keys(nextValue).sort();
    if (hasDiff(a2, b2, isWeak))
      return true;
    for (let i2 = 0;i2 < a2.length; i2 += 1) {
      if (hasDiff(prevValue[a2[i2]], nextValue[b2[i2]], isWeak))
        return true;
    }
    return false;
  }
  if (isWeak) {
    return prevValue != nextValue;
  }
  return prevValue !== nextValue;
}
function hasIn(prev, next) {
  const prevValue = Token.get(prev, true);
  const nextValue = Token.get(next, true);
  if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
    return nextValue.every((x2) => hasIn(prev, x2));
  }
  if (Array.isArray(prevValue) || typeof prevValue === "string") {
    return prevValue.includes(nextValue);
  }
  if (isObject(prev)) {
    return Array.isArray(nextValue) ? nextValue.every((x2) => (x2 in prevValue)) : (nextValue in prevValue);
  }
  return false;
}
function deindent(source) {
  const matches = source.match(/\n(\s+)/m);
  if (matches) {
    return source.split(`
`).map((line) => {
      if (line.indexOf(matches[1]) === 0) {
        return line.substr(matches[1].length);
      }
      return line;
    }).join(`
`).trim();
  }
  return source;
}
function hilight(value, colorize) {
  return value.replace(/<[^<>]*>/g, (x2) => colorize(STRING, x2));
}
function format3(text) {
  const chunks = text.split(/([`*_]{1,2})(.+?)\1/g);
  const buffer = [];
  for (let i2 = 0, c2 = chunks.length;i2 < c2; i2++) {
    if (!chunks[i2].length)
      continue;
    if (chunks[i2].charAt() === "`") {
      buffer.push([CODE, chunks[i2], chunks[++i2]]);
    } else if ("*_".includes(chunks[i2].charAt())) {
      buffer.push([chunks[i2].length > 1 ? BOLD : ITALIC, chunks[i2], chunks[++i2]]);
    } else {
      buffer.push(chunks[i2]);
    }
  }
  return buffer;
}
function pad(nth) {
  return `     ${nth}`.substr(-5);
}
function copy(obj) {
  if (Array.isArray(obj)) {
    return obj.map(copy);
  }
  return obj.clone();
}
function repr(t) {
  return t.toString().match(/\((\w+)\)/)[1];
}
function raise(summary, tokenInfo, descriptor) {
  summary += tokenInfo ? ` at line ${tokenInfo.line + 1}:${tokenInfo.col + 1}` : "";
  summary += descriptor ? ` (${descriptor})` : "";
  const Err = tokenInfo ? SyntaxError : TypeError;
  const e2 = new Err(summary);
  e2.line = tokenInfo ? tokenInfo.line : 0;
  e2.col = tokenInfo ? tokenInfo.col : 0;
  e2.stack = summary;
  throw e2;
}
function assert(token, inherit, ...allowed) {
  if (!allowed.includes(token.type)) {
    const set = allowed.map(repr);
    const last = set.length > 1 ? set.pop() : "";
    const value = set.join(", ").toLowerCase() + (last ? ` or ${last.toLowerCase()}` : "");
    raise(`Expecting ${value} but found \`${token}\``, inherit ? token.tokenInfo : undefined);
  }
}
function check(token, value, info) {
  const actual = token instanceof Token ? token.value : token;
  const tokenInfo = token.tokenInfo || token;
  if (!value) {
    raise(`Unexpected \`${actual}\``, tokenInfo);
  }
  const suffix = ` ${info || "but found"} \`${actual}\``;
  value = typeof value === "symbol" ? repr(value).toLowerCase() : value;
  raise(`Expecting ${value}${suffix}`, tokenInfo);
}
function argv(set, token, offset) {
  if (set === null) {
    const call3 = token.value.source;
    const head2 = token.value.input[offset];
    raise(`Missing argument \`${head2}\` to call \`${call3}\``);
  }
  const call2 = token.source || token.value.source;
  const head = set[Math.min(offset, set.length - 1)];
  raise(`Unexpected argument \`${head}\` to call \`${call2}\``);
}
function only(token, callback) {
  const source = token.getBody();
  if (source.length > 1 || !callback(source[0])) {
    check(source[1] || source[0]);
  }
}
function debug(err, source, noInfo, callback, colorizeToken = (_2, x2) => x2) {
  err.stack = err.stack || err[err.prevToken ? "summary" : "message"];
  if (typeof source === "undefined") {
    return err.message;
  }
  if (noInfo) {
    return err.stack.replace(/at line \d+:\d+\s+/, "");
  }
  if (err.prevToken) {
    const { line, col } = err.prevToken.tokenInfo;
    if (line !== err.line)
      err.line = line;
    if (col !== err.col)
      err.col = col;
    err.stack += `
  at \`${serialize(err.prevToken, true)}\` at line ${line + 1}:${col + 1}`;
  }
  source = typeof callback === "function" ? callback(source) : source;
  const lines = source.split(`
`).reduce((prev, cur, i2) => {
    prev.push(` ${colorizeToken(err.line !== i2 ? true : null, pad(i2 + 1))} | ${cur}`);
    return prev;
  }, []);
  const padding = Array.from({ length: err.col + 10 }).join("-");
  lines.splice(err.line + 1, 0, `${padding}^`);
  if (err.line) {
    lines.splice(0, err.line - 4);
    lines.length = 10;
  }
  return `${err.stack}

${lines.join(`
`)}
`;
}
function literal(t) {
  switch (t.type) {
    case OPEN:
      return "(";
    case CLOSE:
      return ")";
    case COMMA:
      return ",";
    case BEGIN:
      return "[";
    case DONE:
      return "]";
    case EOL:
      return ".";
    case DOT:
      return ".";
    case MINUS:
      return "-";
    case PLUS:
      return "+";
    case MOD:
      return "%";
    case MUL:
      return "*";
    case DIV:
      return "/";
    case PIPE:
      return "|>";
    case BLOCK:
      return "->";
    case RANGE:
      return "..";
    case SYMBOL:
      return ":";
    case NOT_EQ:
      return "!=";
    case SOME:
      return "?";
    case EVERY:
      return "$";
    case OR:
      return "|";
    case NOT:
      return "!";
    case LIKE:
      return "~";
    case EXACT_EQ:
      return "==";
    case EQUAL:
      return "=";
    case LESS_EQ:
      return "<=";
    case LESS:
      return "<";
    case GREATER_EQ:
      return ">=";
    case GREATER:
      return ">";
    default:
      return t.value;
  }
}
function quote(s) {
  return `"${s.replace(/"/g, "\\\"")}"`;
}
function compactText(text, maxLen = 120) {
  const normalized = String(text ?? "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!normalized)
    return "";
  if (normalized.length <= maxLen)
    return normalized;
  return `${normalized.slice(0, Math.max(1, maxLen - 1)).trim()}…`;
}
function compact(token, maxLen = 120, depth = 0) {
  if (typeof token === "undefined")
    return "";
  if (token === null)
    return ":nil";
  if (token === true)
    return ":on";
  if (token === false)
    return ":off";
  if (depth > 4)
    return "…";
  if (typeof token === "number")
    return String(token);
  if (typeof token === "symbol")
    return token.toString().match(/\((.+?)\)/)?.[1] || "symbol";
  if (typeof token === "string")
    return compactText(quote(token), maxLen);
  if (typeof token === "function")
    return `${token.name || "fn"}(…)`;
  if (token instanceof Date)
    return token.toISOString();
  if (token instanceof RegExp)
    return `/${token.source}/${token.flags}`;
  if (Array.isArray(token)) {
    if (token.length === 1)
      return compact(token[0], maxLen, depth + 1);
    if (!token.length)
      return "[ ]";
    const preview = token.slice(0, 3).map((entry) => compact(entry, 24, depth + 1)).join(" ");
    const more = token.length > 3 ? ` … ${token.length} items` : "";
    return compactText(`[ ${preview}${more} ]`, maxLen);
  }
  if (token && typeof token === "object" && token.__tag && Object.prototype.hasOwnProperty.call(token, "value")) {
    return compact(token.value, maxLen, depth + 1);
  }
  if (isUnit(token)) {
    const text = token && token.value && typeof token.value.toString === "function" ? token.value.toString() : String(token);
    return compactText(text, maxLen);
  }
  if (isNumber(token)) {
    const value = typeof token.valueOf === "function" ? token.valueOf() : token.value;
    return String(value);
  }
  if (isSymbol(token))
    return String(token.value ?? token.valueOf?.() ?? "");
  if (isString(token)) {
    if (typeof token.value === "string")
      return compactText(quote(token.value), maxLen);
    const raw = typeof token.valueOf === "function" ? token.valueOf() : token.value;
    return compactText(quote(typeof raw === "string" ? raw : "…"), maxLen);
  }
  if (isLiteral(token)) {
    if (token.isTag) {
      const rendered = renderTag(token.value);
      const match = rendered.match(/^<\s*([^\s/>]+)/);
      return match ? `<${match[1]} …>` : "<…>";
    }
    if (token.isFunction || token.isCallable) {
      const name = token.value?.label || token.value?.name || token.getName?.() || token.name || "fn";
      return `${name}(…)`;
    }
    if (token.isObject) {
      const data = token.valueOf();
      const keys = Object.keys(data || {});
      if (!keys.length)
        return "{ }";
      if (keys.length <= 6)
        return `{ ${keys.join(" ")} }`;
      return `{ ${keys.slice(0, 6).join(" ")} … ${keys.length} keys }`;
    }
  }
  if (isRange(token)) {
    if (Array.isArray(token.value)) {
      if (!token.value.length)
        return "[ ]";
      const preview = token.value.slice(0, 3).map((entry) => compact(entry, 24, depth + 1)).join(" ");
      const more = token.value.length > 3 ? ` … ${token.value.length} items` : "";
      return compactText(`[ ${preview}${more} ]`, maxLen);
    }
    const begin = compact(token.value?.begin, 24, depth + 1);
    const end = compact(token.value?.end, 24, depth + 1);
    return compactText(`${begin}..${end}`, maxLen);
  }
  if (token && typeof token === "object") {
    if (token.isTag && token.value) {
      const rendered = renderTag(token.value);
      const match = rendered.match(/^<\s*([^\s/>]+)/);
      return match ? `<${match[1]} …>` : "<…>";
    }
    if (token.isFunction || token.isCallable) {
      const name = token.value?.label || token.value?.name || token.name || "fn";
      return `${name}(…)`;
    }
    const keys = Object.keys(token);
    if (keys.length) {
      if (keys.length <= 6)
        return `{ ${keys.join(" ")} }`;
      return `{ ${keys.slice(0, 6).join(" ")} … ${keys.length} keys }`;
    }
  }
  return compactText(String(token), maxLen);
}
function split(s) {
  return s.split(/(?=[\W\x00-\x7F])/);
}
function slice(s) {
  const matches = s.match(RE_SLICING);
  const min2 = matches[1] ? parseFloat(matches[1]) : undefined;
  const max2 = matches[3] ? parseFloat(matches[3]) : undefined;
  if (matches[2] === "..") {
    return { begin: min2, end: max2 };
  }
  if (min2 < 0 && typeof max2 !== "undefined")
    throw new Error(`Invalid take-step \`${s}\``);
  if (max2 < 0)
    throw new Error(`Invalid take-step \`${s}\``);
  return { offset: min2, length: max2 };
}
function isDigit(c2) {
  return c2 >= "0" && c2 <= "9";
}
function isReadable(c2, raw) {
  return c2 === "#" || c2 === "$" || c2 >= "&" && c2 <= "'" || c2 >= "^" && c2 <= "z" || c2 >= "@" && c2 <= "Z" || raw && (c2 === "." || c2 === "-") || c2.charCodeAt() > 127 && c2.charCodeAt() !== 255;
}
function isAlphaNumeric(c2, raw) {
  return isDigit(c2) || isReadable(c2, raw);
}
function getSeparator(_2, o, p2, c2, n, dx) {
  if (isComment(p2) && !isText(c2) || isComment(c2) && !isText(p2)) {
    return (isComment(p2) ? p2 : c2).type === COMMENT_MULTI ? " " : `
`;
  }
  if (dx === "Stmt" && (!o && isBlock(p2) && !isBlock(c2) || isBlock(p2) && isBlock(c2) && !c2.isStatement && c2.isRaw) || isComma(p2) && !isText(c2) || isOperator(p2) && isBlock(c2) || o && isOperator(p2) && (isData(c2) && !isLiteral(c2)) && !(isEOL(o) || isComma(o) || isText(o)) || isData(p2) && isOperator(c2) && isData(n) || isData(o) && isOperator(p2) && isData(c2) || isData(p2) && !isLiteral(p2) && isOperator(c2) || (isBlock(p2) && isOperator(c2) || isBlock(o) && isOperator(p2)) || isLiteral(_2) && isOperator(o) && isOperator(p2) && !isData(n) || isLiteral(p2) && isOperator(c2) && isOperator(n) && c2.value !== n.value || isOperator(o) && isOperator(p2) && o.value !== p2.value && isLiteral(c2))
    return " ";
  if (isBlock(p2) && isBlock(c2) || isBlock(p2) && isData(c2) || isData(p2) && isData(c2) && (!isRange(p2) || !isSymbol(c2)))
    return dx === "Root" || dx !== "Expr" && !isSymbol(p2) ? COMMA : " ";
}
function serialize(token, shorten, colorize = (_2, x2) => typeof x2 === "undefined" ? literal({ type: _2 }) : x2, descriptor = "Root") {
  if (typeof token === "undefined")
    return;
  if (token === null)
    return colorize(SYMBOL, ":nil");
  if (token === true)
    return colorize(SYMBOL, ":on");
  if (token === false)
    return colorize(SYMBOL, ":off");
  if (token instanceof Date)
    return colorize(STRING, `"${token.toISOString()}"`);
  if (token instanceof RegExp)
    return colorize(STRING, `/${token.source}/${token.flags}`);
  if (typeof token === "number")
    return colorize(NUMBER, token);
  if (typeof token === "symbol")
    return colorize(SYMBOL, token.toString().match(/\((.+?)\)/)[1]);
  if (typeof token === "string")
    return colorize(LITERAL, descriptor === "Object" ? `"${token}"` : token);
  if (typeof token === "function") {
    const name = token.toString().match(/constructor\s*\(([\s\S]*?)\)|\(([\s\S]*?)\)|([\s\S]*?)(?==>)/);
    const methods = Object.keys(token).map((k2) => colorize(SYMBOL, `:${k2}`)).join(" ");
    const formatted = (name[3] || name[2] || name[1] || "").trim().replace(/\s+/g, " ");
    return `${colorize(LITERAL, token.name)}${colorize(OPEN, "(")}${formatted.length ? colorize(LITERAL, formatted) : ""}${colorize(CLOSE)}${methods ? `${colorize(BEGIN)}${methods}${colorize(DONE)}` : ""}`;
  }
  if (Array.isArray(token)) {
    if (descriptor === "Object") {
      return `${colorize(BEGIN)}${token.map((x2) => serialize(x2, shorten, colorize, descriptor)).join(`${colorize(COMMA)} `)}${colorize(DONE)}`;
    }
    let prevData = null;
    const hasText = token.some(isText);
    return token.reduce((prev, cur, i2) => {
      const sep = getSeparator(prevData, token[i2 - 2], token[i2 - 1], cur, token[i2 + 1], descriptor);
      const result = serialize(cur, shorten, colorize, descriptor);
      if (sep && !(isEOL(cur) || isComma(cur))) {
        prev.push(![" ", `
`].includes(sep) ? `${colorize(sep)} ` : sep);
      }
      if (isEOL(cur) || isComma(cur))
        prevData = null;
      if (isData(cur))
        prevData = cur;
      prev.push(isEOL(cur) && !hasText ? `${result}
` : result);
      return prev;
    }, []).join("");
  }
  if (isComment(token) && token.type === COMMENT) {
    return colorize(COMMENT, token.value);
  }
  if (isLiteral(token)) {
    if (token.isTag) {
      if (shorten)
        return colorize(STRING, "<.../>");
      return colorize(STRING, renderTag(token.value));
    }
    if (token.cached) {
      return colorize(LITERAL, `${token.value}!`);
    }
    if (token.isFunction) {
      return colorize(LITERAL, token.value.label);
    }
    if (!token.isObject && typeof token.value === "object") {
      return serialize(token.value, shorten, colorize, "Object");
    }
    if (typeof token.value === "undefined") {
      return colorize(true, String(token.value));
    }
    return serialize(token.value, shorten, colorize, descriptor);
  }
  if (typeof token.type === "symbol") {
    if (token.isExpression) {
      return `${colorize(token.type)} ${serialize(token.value, shorten, colorize, "Expr")}`;
    }
    if (isRef(token)) {
      const chunk = token.isRaw && token.value.href || token.value.alt || token.value.href;
      return colorize(true, token.value.text.replace(chunk, colorize(token.isRaw ? REF : TEXT, chunk)));
    }
    if (isUnit(token)) {
      return colorize(NUMBER, token.value.toString());
    }
    if (isCode(token) && token.isMulti) {
      return `${colorize(true, "```")}${colorize(null, token.value)}${colorize(true, "```")}`;
    }
    if (isString(token)) {
      const qt = colorize(STRING, token.isMulti ? '"""' : '"');
      let chunk;
      if (shorten) {
        chunk = colorize(STRING, token.isMarkup ? "<.../>" : '"..."');
      } else if (Array.isArray(token.value)) {
        const subTree = token.valueOf();
        const buffer = [];
        for (let i2 = 0, c2 = subTree.length;i2 < c2; i2++) {
          const cur = subTree[i2];
          const next = subTree[i2 + 1];
          const prev = subTree[i2 - 1];
          if ((!prev || prev.type === PLUS) && cur.type === OPEN && cur.value === "#{") {
            buffer.pop();
            buffer.push(colorize(null, "#{"));
            continue;
          }
          if ((!next || next.type === PLUS) && cur.type === CLOSE && cur.value === "}") {
            buffer.push(colorize(null, "}"));
            i2++;
            continue;
          }
          if (isBlock(cur) && !cur.hasArgs) {
            if (prev && prev.type === PLUS)
              buffer.pop();
            cur.tokenInfo.kind = "";
            buffer.push(colorize(null, "#{"));
            buffer.push(serialize(cur, shorten, colorize, "Str"));
            buffer.push(colorize(null, "}"));
            cur.tokenInfo.kind = "raw";
            if (next && next.type === PLUS)
              i2++;
            continue;
          }
          if (!isString(cur)) {
            buffer.push(serialize(cur, shorten, colorize, descriptor));
          } else {
            buffer.push(colorize(STRING, !cur.isRaw ? `"${cur.value}"` : cur.value));
          }
        }
        chunk = !token.isMarkup ? `${qt}${buffer.join("")}${qt}` : buffer.join("");
      } else {
        chunk = colorize(STRING, !token.isMarkup ? `${qt}${token.value}${qt}` : token.value);
      }
      return chunk;
    }
    if (isBlock(token)) {
      if (typeof token.value === "string")
        return colorize(BLOCK);
      let block2 = "";
      let args = "";
      const parent = token.isStatement || descriptor === "Stmt" ? "Stmt" : "Block";
      if (!token.hasSource) {
        if (token.hasArgs) {
          const renderedArgs = serialize(token.getArgs(), shorten, colorize, parent);
          if (token.hasBody && token.getArgs().length > 1) {
            args += `${colorize(OPEN)}${renderedArgs.replace(/,\s*/g, " ")}${colorize(CLOSE)}`;
          } else {
            args += renderedArgs;
          }
        }
        if (token.hasName)
          block2 += `${colorize(LITERAL, token.getName())}${args} ${colorize(EQUAL)} `;
      }
      if (token.hasBody) {
        block2 += serialize(token.getBody(), shorten, colorize, parent);
      }
      if (!block2) {
        block2 = args;
      } else if (args) {
        block2 = `${args} ${colorize(BLOCK)} ${block2}`;
      }
      if (token.hasArgs && token.getArg(0) && token.getArg(0).isExpression) {
        block2 = `${colorize(token.getArg(0).type)}`;
        if (!shorten) {
          block2 += ` ${serialize(token.getArg(0).value, shorten, colorize, "Expr")}`;
        }
      }
      return token.isRaw ? `${colorize(OPEN)}${block2}${colorize(CLOSE)}` : block2;
    }
    if (isText(token)) {
      let prefix2 = "";
      if (token.value.kind === BLOCKQUOTE) {
        prefix2 = `${colorize(BLOCKQUOTE, ">")} `;
      } else if (token.value.kind === HEADING) {
        prefix2 = `${colorize(HEADING, Array.from({ length: token.value.level + 1 }).join("#"))} `;
      } else if (token.value.kind === UL_ITEM || token.value.kind === OL_ITEM) {
        if (token.value.depth) {
          prefix2 += Array.from({ length: token.value.depth + 1 }).join("  ");
        }
        let offset = token.value.style;
        if (this && token.value.kind === OL_ITEM) {
          const key = [repr(token.value.kind), token.value.depth || 0];
          this.offsets = this.offsets || {};
          this.offsets[key] = this.offsets[key] || token.value.level;
          offset = this.offsets[key];
          this.offsets[key]++;
        }
        prefix2 += `${colorize(token.value.kind, offset + (token.value.kind === OL_ITEM ? "." : ""))} `;
      } else if (this && isText(token) && !hasBreaks(token)) {
        delete this.offsets;
      }
      return colorize(TEXT, `${prefix2}${token.value.buffer.reduce((prev, cur, idx, all) => {
        if (Array.isArray(cur)) {
          prev += colorize(cur[0], `${cur[1]}${cur[2]}${cur[1]}`);
        } else if (isOpen(cur) && cur.value === "#{") {
          prev += colorize(null, "#{");
        } else if (isClose(cur) && cur.value === "}") {
          prev += colorize(null, "}");
        } else if (isMath(cur) && cur.type === PLUS) {
          const left = all[idx - 1];
          const right = all[idx + 1];
          const isPrefixJoin = left && right && isString(left) && left.isRaw && isOpen(right) && right.value === "#{";
          const isSuffixJoin = left && right && isClose(left) && left.value === "}" && isString(right) && right.isRaw;
          if (!isPrefixJoin && !isSuffixJoin) {
            prev += serialize(cur, shorten, colorize, descriptor);
          }
        } else if (cur && cur.type) {
          prev += serialize(cur, shorten, colorize, descriptor);
        } else if (isRef(cur)) {
          prev += serialize(cur, shorten, colorize);
        } else {
          prev += hilight(cur, colorize);
        }
        return prev;
      }, "")}`);
    }
    if (isRange(token)) {
      if (typeof token.value === "string")
        return colorize(RANGE, token.value);
      if (!Array.isArray(token.value)) {
        return colorize(RANGE, `${serialize(token.value.begin, shorten, colorize)}..${serialize(token.value.end, shorten, colorize)}`);
      }
      return `${colorize(BEGIN, "[")}${!shorten ? serialize(token.value, shorten, colorize, descriptor) : colorize(RANGE, "..")}${colorize(DONE, "]")}`;
    }
    return colorize(token.type, token.value);
  }
  if (isPlain2(token) && token.__tag && token.value && typeof token.__tag.getBody === "function" && typeof token.value.getBody === "function") {
    const [tag] = token.__tag.getBody();
    const payload = token.value.getBody();
    if (isSymbol(tag) && [":ok", ":err"].includes(tag.value)) {
      const kind = tag.value.substr(1);
      if (!payload.length)
        return colorize(SYMBOL, `@${kind}`);
      return `${colorize(SYMBOL, `@${kind}`)} ${payload.length === 1 ? serialize(payload[0], shorten, colorize, descriptor) : serialize(payload, shorten, colorize, descriptor)}`;
    }
  }
  const separator = !hasStatements(token) ? `${colorize(COMMA)} ` : " ";
  if (shorten) {
    const prefix2 = hasStatements(token) ? "@" : ":";
    return Object.keys(token).map((k2) => colorize(SYMBOL, `${prefix2}${k2}`)).join(separator);
  }
  const prefix = hasStatements(token) ? "@" : ":";
  const block = Object.keys(token).map((k2) => `${colorize(SYMBOL, `${prefix}${k2}`)} ${serialize(token[k2], shorten, colorize, descriptor)}`);
  return descriptor === "Object" ? `${colorize(OPEN)}${block.join(separator)}${colorize(CLOSE)}` : block.join(separator);
}
function SYMBOL_NAME(sym) {
  if (!sym || typeof sym !== "symbol")
    return "";
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? "";
}
function unitKindFromToken(token) {
  const kind = token?.value?.value?.kind ?? token?.value?.kind;
  if (typeof kind === "string" && kind.trim())
    return kind.trim();
  const asText = String(token?.value?.toString?.() ?? "");
  const match = asText.match(/[A-Za-z]{1,10}$/);
  return match?.[0] || "";
}
function inferTokenType(token) {
  if (!token)
    return "unknown";
  if (token.isCallable || token.isFunction)
    return "fn";
  if (token.isTag)
    return "tag";
  if (token.isObject) {
    const shape = token.valueOf ? token.valueOf() : token.value;
    if (shape && typeof shape === "object" && shape.__tag && shape.value)
      return "result";
    return "record";
  }
  if (token.isRange)
    return Array.isArray(token.value) ? "list" : "range";
  if (token.isNumber) {
    const unitKind = unitKindFromToken(token);
    if (unitKind)
      return `unit<${unitKind}>`;
    return "number";
  }
  if (token.isString)
    return "string";
  if (token.isSymbol)
    return "symbol";
  const symbol = SYMBOL_NAME(token.type);
  return symbol ? symbol.toLowerCase() : "unknown";
}
function inferRuntimeType(value) {
  if (value === null)
    return "nil";
  if (value === undefined)
    return "unknown";
  if (typeof value === "number")
    return "number";
  if (typeof value === "string")
    return "string";
  if (typeof value === "boolean")
    return "boolean";
  if (typeof value === "function")
    return "fn";
  if (Array.isArray(value)) {
    if (!value.length)
      return "list<unknown>";
    if (value.length === 1)
      return inferRuntimeType(value[0]);
    const sample = value.find(Boolean);
    const inner = sample ? inferRuntimeType(sample) : "unknown";
    return `list<${inner}>`;
  }
  if (value && typeof value === "object" && typeof value.type === "symbol") {
    return inferTokenType(value);
  }
  if (value && typeof value === "object") {
    if (value.__tag && value.value)
      return "result";
    return "record";
  }
  return "unknown";
}
function canonicalTypeName(typeName) {
  const text = String(typeName || "").trim().toLowerCase();
  if (!text)
    return "";
  if (text === "num" || text === "number")
    return "number";
  if (text === "str" || text === "string")
    return "string";
  if (text === "bool" || text === "boolean")
    return "boolean";
  if (text.startsWith("unit<") && text.endsWith(">"))
    return "number";
  if (text === "list" || text.startsWith("list<"))
    return "list";
  return text;
}
function matchesType(value, typeStr, env) {
  const declared = canonicalTypeName(typeStr);
  if (!declared || declared === "any" || declared === "unknown")
    return true;
  if (env && typeof env.getAnnotation === "function") {
    const name = value?.name ?? "";
    if (name) {
      const ann = env.getAnnotation(name);
      if (ann)
        return canonicalTypeName(String(ann)) === declared;
    }
  }
  const actual = canonicalTypeName(inferRuntimeType(value));
  if (!actual || actual === "unknown")
    return true;
  return actual === declared;
}
var LOGIC_TYPES, RESULT_TYPES, INVOKE_TYPES, COMMENT_TYPES, MATH_TYPES, END_TYPES, LIST_TYPES, SCALAR_TYPES, RE_SLICING;
var init_helpers = __esm(() => {
  init_symbols();
  init_tag();
  LOGIC_TYPES = [LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, NOT, LIKE, EQUAL, SOME, EVERY];
  RESULT_TYPES = [NUMBER, STRING, SYMBOL, LITERAL, BLOCK, RANGE, REGEX];
  INVOKE_TYPES = [EOL, COMMA, BLOCK, RANGE, LITERAL];
  COMMENT_TYPES = [COMMENT, COMMENT_MULTI];
  MATH_TYPES = [EQUAL, MINUS, PLUS, MUL, DIV, PIPE, MOD, SOME, LIKE, NOT, OR];
  END_TYPES = [OR, EOF, EOL, COMMA, DONE, CLOSE, PIPE];
  LIST_TYPES = [BEGIN, DONE, OPEN, CLOSE];
  SCALAR_TYPES = [NUMBER, STRING];
  RE_SLICING = /^:(-?\d+)?(\.\.|-)?(?:(-?\d+))?$/;
});

// src/lib/tree/expr.js
class Expr {
  constructor(value, tokenInfo) {
    this.type = value.type;
    this.value = value.value;
    if (value.length)
      this.length = value.length;
    if (value.source)
      this.source = value.source;
    if (value.cached) {
      Object.defineProperty(this, "cached", { value: true });
    }
    Object.defineProperty(this, "tokenInfo", {
      value: tokenInfo || (value instanceof Token ? value : null)
    });
  }
  get isFFI() {
    return this.type === FFI;
  }
  get isBlock() {
    return this.type === BLOCK;
  }
  get isRange() {
    return this.type === RANGE;
  }
  get isNumber() {
    return this.type === NUMBER;
  }
  get isString() {
    return this.type === STRING;
  }
  get isSymbol() {
    return this.type === SYMBOL;
  }
  get isScalar() {
    return this.isNumber || this.isString || this.isSymbol;
  }
  get isIterable() {
    return this.isString || this.isBlock || this.isRange;
  }
  get isObject() {
    return this instanceof Expr.Object;
  }
  get isTag() {
    return this instanceof Expr.Tag;
  }
  get isFunction() {
    return this instanceof Expr.Function;
  }
  get isLiteral() {
    return this instanceof Expr.Literal;
  }
  get isCallable() {
    return this instanceof Expr.Callable;
  }
  get isStatement() {
    return this instanceof Expr.Statement;
  }
  get isExpression() {
    return this instanceof Expr.Expression;
  }
  toString() {
    if (this.type === EOL)
      return `.
`;
    return serialize(this, true);
  }
  valueOf() {
    if (this.type === NUMBER && typeof this.value === "string") {
      return parseFloat(this.value);
    }
    if (this.value !== null) {
      return this.value.valueOf();
    }
    return this.value;
  }
  get hasName() {
    return !!this.getName();
  }
  get hasBody() {
    return !!this.value.body;
  }
  get hasArgs() {
    return !!this.value.args;
  }
  get hasInput() {
    return !!this.value.input;
  }
  get hasSource() {
    return !!(this.value.source || this.source);
  }
  get isRaw() {
    return this.tokenInfo?.kind === "raw";
  }
  get isMulti() {
    return this.tokenInfo?.kind === "multi";
  }
  get isMarkup() {
    return this.tokenInfo?.kind === "markup";
  }
  get isOptional() {
    return this.value.charAt(this.value.length - 1) === "?";
  }
  getBody() {
    return this.value.body;
  }
  getArgs() {
    return this.value.args;
  }
  getInput() {
    return this.value.input;
  }
  getArg(n) {
    return this.value.args[n];
  }
  getName() {
    return this.value.source || this.source || this.value.name;
  }
  push(...v2) {
    return this.value.body.push(...v2);
  }
  head() {
    return this.value.body[0];
  }
  get() {
    return Token.get(this);
  }
  clone() {
    if (Array.isArray(this.value)) {
      return new this.constructor({ type: this.type, value: copy(this.value) }, this.tokenInfo);
    }
    if (this.isStatement) {
      return new this.constructor({ type: BLOCK, value: { body: copy(this.getBody()) } }, this.tokenInfo);
    }
    if (this.isLiteral && isBlock(this)) {
      const newBlock = !this.hasBody ? Expr.from(BLOCK, { args: copy(this.getArgs()) }, this.tokenInfo) : Expr.from(BLOCK, { body: copy(this.getBody()) }, this.tokenInfo);
      if (this.isRaw)
        newBlock.tokenInfo.kind = "raw";
      return newBlock;
    }
    if (this.isObject) {
      return Expr.map(Object.keys(this.value).reduce((prev, cur) => {
        prev[cur] = copy(this.value[cur]);
        return prev;
      }, {}), this.tokenInfo);
    }
    if (this.isCallable) {
      return Expr.callable({
        type: BLOCK,
        value: {
          ...this.value,
          body: copy(this.getBody())
        }
      }, this.tokenInfo);
    }
    return this;
  }
  static sub(body, params) {
    if (Array.isArray(body)) {
      const self = body.slice();
      for (let i2 = 0, c2 = self.length;i2 < c2; i2++) {
        if (self[i2].isCallable && params[self[i2].value.name]) {
          const fixedBody = params[self[i2].value.name].slice();
          const fixedName = fixedBody.pop();
          self[i2].value.name = fixedName.value;
          self[i2].value.body = Expr.sub(self[i2].value.body, params);
          self.splice(i2 - 1, 0, ...fixedBody);
        } else if (isLiteral(self[i2]) && typeof self[i2].value === "string") {
          if (!params[self[i2].value])
            continue;
          c2 += params[self[i2].value].length - 1;
          self.splice(i2, 1, ...params[self[i2].value]);
        } else {
          self[i2] = Expr.sub(self[i2], params);
        }
      }
      return self;
    }
    if (Array.isArray(body.value)) {
      body.value = Expr.sub(body.value, params);
    } else if (body.isObject) {
      Object.keys(body.value).forEach((k2) => {
        body.value[k2].value.body = Expr.sub(body.value[k2].value.body, params);
      });
    } else if (isBlock(body)) {
      if (body.value.args)
        body.value.args = Expr.sub(body.getArgs(), params);
      if (body.value.body)
        body.value.body = Expr.sub(body.getBody(), params);
    }
    return body;
  }
  static mix(tpl, ...others) {
    return Expr.sub(copy(tpl.body), tpl.args.reduce((prev, cur, i2) => {
      prev[cur.value] = others[i2];
      return prev;
    }, {}));
  }
  static cut(ast) {
    const count = ast.length;
    const left = [];
    let i2 = 0;
    for (;i2 < count; i2++) {
      if (isResult(ast[i2]) && isResult(left[left.length - 1]))
        break;
      left.push(ast[i2]);
    }
    return left;
  }
  static has(ast, type, value) {
    return ast.some((token) => {
      if (isBlock(token) && token.hasArgs) {
        return Expr.has(token.getArgs(), type, value);
      }
      return token.type === type && token.value === value;
    });
  }
  static from(type, value, tokenInfo) {
    if (Array.isArray(type)) {
      return type.map((x2) => Expr.from(x2));
    }
    if (type === TEXT && typeof value === "string") {
      value = { buffer: [value] };
    }
    if (typeof value === "undefined") {
      if (typeof type === "symbol") {
        return Expr.literal({ type, value: literal({ type }) });
      }
      if (Array.isArray(type.value)) {
        type.value = Expr.from(type.value);
      }
      return type instanceof Expr ? type : Expr.literal(type);
    }
    return Expr.literal({ type, value }, tokenInfo);
  }
  static args(values) {
    const list = [];
    let stack = list;
    let key = 0;
    for (let i2 = 0, c2 = values.length;i2 < c2; i2++) {
      if (isComma(values[i2])) {
        list[list.length - 1] = stack[0];
        stack = list[++key] = [];
      } else {
        stack.push(values[i2]);
      }
    }
    if (stack.length === 1) {
      list[list.length - 1] = stack[0];
    }
    return list;
  }
  static text(buffer, tokenInfo) {
    const head = buffer.charAt();
    const value = {};
    let level = 0;
    let type = TEXT;
    if ("#>".includes(head)) {
      type = head === ">" ? BLOCKQUOTE : HEADING;
      if (head === "#") {
        let i2 = 0;
        for (;i2 < 5; i2++) {
          if (buffer.charAt(i2) === "#")
            level++;
          else
            break;
        }
        buffer = buffer.substr(i2);
      } else {
        buffer = buffer.substr(1);
      }
    }
    if ("-*+".includes(head) && buffer.charAt(1) === " " || isDigit(head) && /^(\d+)\.\s/.test(buffer)) {
      const [nth, ...chunks] = buffer.split(" ");
      level = isDigit(head) ? parseFloat(nth) : 0;
      type = isDigit(head) ? OL_ITEM : UL_ITEM;
      buffer = chunks.join(" ");
    }
    if (type !== TEXT)
      value.kind = type;
    if (level > 1)
      value.level = level;
    value.buffer = format3(buffer.trim());
    return Expr.literal({ type: TEXT, value }, tokenInfo);
  }
  static chunk(values, inc, fx) {
    const body = [];
    let offset = 0;
    for (let c2 = values.length;inc < c2; inc++) {
      if (fx && isCall(body[body.length - 1]))
        break;
      if (!fx && isEnd(values[inc]))
        break;
      body.push(values[inc]);
      offset++;
    }
    return { body, offset };
  }
  static arity(callable) {
    let length = 0;
    length += callable.value.args.length;
    while (callable.hasBody && callable.head().isCallable && callable.getBody().length === 1) {
      length += callable.head().getArgs().length;
      callable = callable.head();
      break;
    }
    return length;
  }
  static cast(list, types) {
    return list.reduce((prev, cur) => {
      if (cur.isStatement) {
        prev.push(...cur.getBody().reduce((p2, c2) => {
          if (!isComma(c2)) {
            if (c2.isObject) {
              p2.push(...Expr.cast([c2], types));
            } else {
              if (!types.includes(c2.type))
                assert(c2, true, ...types);
              p2.push(c2);
            }
          }
          return p2;
        }, []));
      } else if (cur.isObject) {
        const map = cur.valueOf();
        Object.keys(map).forEach((prop) => {
          map[prop].getBody().forEach((c2) => {
            if (!types.includes(c2.type))
              assert(c2, true, ...types);
          });
        });
        prev.push(cur);
      } else if (!types.includes(cur.type)) {
        assert(cur, true, ...types);
      } else {
        prev.push(cur);
      }
      return prev;
    }, []);
  }
  static stmt(type, body, tokenInfo) {
    if (typeof type === "object") {
      tokenInfo = body;
      body = type;
      type = null;
    }
    const params = { type: BLOCK, value: { body } };
    if (type === "@namespace")
      return Expr.namespaceStatement(params, tokenInfo);
    if (type === "@table")
      return Expr.tableStatement(params, tokenInfo);
    if (type === "@if")
      return Expr.ifStatement(params, tokenInfo);
    if (type === "@else")
      return Expr.elseStatement(params, tokenInfo);
    if (type === "@ok")
      return Expr.okStatement(params, tokenInfo);
    if (type === "@err")
      return Expr.errStatement(params, tokenInfo);
    if (type === "@while")
      return Expr.whileStatement(params, tokenInfo);
    if (type === "@do")
      return Expr.doStatement(params, tokenInfo);
    if (type === "@let")
      return Expr.letStatement(params, tokenInfo);
    if (type === "@destructure")
      return Expr.destructureStatement(params, tokenInfo);
    if (type === "@loop")
      return Expr.loopStatement(params, tokenInfo);
    if (type === "@match")
      return Expr.matchStatement(params, tokenInfo);
    if (type === "@try")
      return Expr.tryStatement(params, tokenInfo);
    if (type === "@check")
      return Expr.checkStatement(params, tokenInfo);
    if (type === "@rescue")
      return Expr.rescueStatement(params, tokenInfo);
    if (type === "@from")
      return Expr.fromStatement(params, tokenInfo);
    if (type === "@import")
      return Expr.importStatement(params, tokenInfo);
    if (type === "@module")
      return Expr.moduleStatement(params, tokenInfo);
    if (type === "@export")
      return Expr.exportStatement(params, tokenInfo);
    if (type === "@template")
      return Expr.templateStatement(params, tokenInfo);
    return Expr.statement(params, tokenInfo);
  }
  static value(mixed, tokenInfo) {
    tokenInfo = tokenInfo || { line: 0, col: 0 };
    if (mixed === null)
      return Expr.from(LITERAL, null, tokenInfo);
    if (mixed === true)
      return Expr.from(LITERAL, true, tokenInfo);
    if (mixed === false)
      return Expr.from(LITERAL, false, tokenInfo);
    if (isPlain2(mixed) && mixed instanceof Expr.Val)
      return mixed.toToken();
    if (isPlain2(mixed) && typeof mixed.name === "string" && Array.isArray(mixed.children)) {
      return Expr.tag(mixed, tokenInfo);
    }
    if (typeof mixed === "string")
      return Expr.from(STRING, mixed, tokenInfo);
    if (typeof mixed === "number")
      return Expr.from(NUMBER, mixed.toString(), tokenInfo);
    if (mixed instanceof Expr)
      return Expr.from(mixed.type, mixed.value, mixed.tokenInfo);
    if (Array.isArray(mixed)) {
      return Expr.array(mixed.map((x2) => Expr.value(x2)), tokenInfo);
    }
    return Expr.from(LITERAL, mixed, tokenInfo);
  }
  static plain(mixed, callback, descriptor) {
    if (Array.isArray(mixed)) {
      return mixed.map((x2) => Expr.plain(x2, callback, descriptor));
    }
    if (isRange(mixed)) {
      return Expr.plain(mixed.valueOf(), callback, descriptor);
    }
    if (mixed.isObject) {
      const obj = mixed.valueOf();
      return Object.keys(obj).reduce((prev, cur) => {
        const value = obj[cur].getBody();
        const fixedValue = value.length === 1 ? value[0] : value;
        prev[cur] = Expr.plain(fixedValue, callback, descriptor);
        return prev;
      }, {});
    }
    if (mixed.isCallable) {
      return (...args) => {
        if (typeof callback === "function") {
          return callback(mixed, Expr.value(args).valueOf(), descriptor);
        }
        return [
          Expr.local(mixed.getName(), mixed.tokenInfo),
          Expr.block({ args: Expr.value(args).valueOf() }, mixed.tokenInfo)
        ];
      };
    }
    if (isSymbol(mixed) && typeof mixed.value === "string") {
      return mixed.value.substr(1);
    }
    return mixed.isFunction ? mixed.value.target : mixed.valueOf();
  }
  static each(tokens, callback) {
    const body = Expr.cast(tokens, [LITERAL]);
    const calls = [];
    body.forEach((name) => {
      if (name.isObject) {
        const obj = name.valueOf();
        Object.keys(obj).forEach((key) => {
          const [head, ...tail] = obj[key].getBody();
          if (typeof head.value !== "string")
            check(head);
          calls.push(() => callback(obj[key], key, head.valueOf()));
          tail.forEach((sub) => {
            if (typeof sub.value !== "string")
              check(sub);
            calls.push(() => callback(sub, sub.valueOf()));
          });
        });
      } else {
        if (typeof name.value !== "string")
          check(name);
        calls.push(() => callback(name, name.valueOf()));
      }
    });
    return calls.map((run) => run());
  }
  static call(obj, name, label, tokenInfo) {
    const hasProto = Object.prototype.hasOwnProperty.call(obj, "prototype");
    let target = hasProto && obj.prototype[name] || obj[name];
    if (typeof target !== "function") {
      return Expr.value(target);
    }
    if (hasProto && obj.prototype[name]) {
      target = (...args) => obj.prototype[name].call(...args);
    }
    return Expr.function({ type: LITERAL, value: { label, target } }, tokenInfo);
  }
  static fn(value, tokenInfo) {
    if (typeof value === "function") {
      const F = value;
      const isClass = F.prototype && F.constructor === Function && F.prototype.constructor === F;
      const target = (...args) => isClass ? new F(...args) : F(...args);
      Object.defineProperty(target, "name", { value: F.name });
      Object.defineProperty(target, "toString", { value: () => serialize(F) });
      Object.getOwnPropertyNames(F).forEach((key) => {
        if (!["name", "length", "prototype"].includes(key)) {
          target[key] = F[key];
        }
      });
      return Expr.value(target, tokenInfo);
    }
    return Expr.function({ type: LITERAL, value }, tokenInfo);
  }
  static map(params, tokenInfo) {
    return Expr.object({ type: LITERAL, value: params }, tokenInfo);
  }
  static tag(node, tokenInfo) {
    return Expr.markup({ type: LITERAL, value: node }, tokenInfo);
  }
  static let(params, tokenInfo) {
    return Expr.map({ let: Expr.stmt("@let", params) }, tokenInfo);
  }
  static body(values, tokenInfo) {
    return Expr.from(BLOCK, { body: values || [] }, tokenInfo);
  }
  static frac(a2, b2, tokenInfo) {
    return Expr.from(NUMBER, new Expr.Frac(a2, b2), tokenInfo);
  }
  static unit(num, type, tokenInfo) {
    if (typeof num === "number") {
      return Expr.from(NUMBER, { num, kind: type }, tokenInfo);
    }
    return Expr.from(NUMBER, num, type || tokenInfo);
  }
  static array(values, tokenInfo) {
    return Expr.from(RANGE, values, tokenInfo);
  }
  static local(name, tokenInfo) {
    return Expr.from(LITERAL, name, tokenInfo);
  }
  static symbol(name, optional, tokenInfo) {
    return Expr.from(SYMBOL, name + (optional ? "?" : ""), tokenInfo);
  }
  static group(values, tokenInfo) {
    return !Array.isArray(values) ? Expr.block(values, tokenInfo, true) : Expr.block({ args: values }, tokenInfo, true);
  }
  static range(begin, end, tokenInfo) {
    if (!begin.length && !end.length)
      check(tokenInfo, "values", "around");
    if (!begin.length)
      check(tokenInfo, "value", "before");
    return Expr.from(RANGE, { begin, end }, tokenInfo);
  }
  static block(params, tokenInfo, rawDefinition) {
    if (rawDefinition) {
      tokenInfo = tokenInfo || {};
      tokenInfo.kind = "raw";
    }
    return Expr.from(BLOCK, params || {}, tokenInfo);
  }
  static unsafe(target, label, raw) {
    return {
      [FFI]: true,
      target,
      label: label || `FFI/${target.name || "?"}`,
      raw: !!raw
    };
  }
  static define(type, Class) {
    Expr[Class.name.replace(/_$/, "")] = Class;
    if (!Expr[type]) {
      Expr[type] = (...args) => new Class(...args);
    }
    return Class;
  }
}
var init_expr = __esm(() => {
  init_units();
  init_symbols();
  init_builtins();
  init_helpers();
  Expr.define("val", class Val {
    constructor(num, type) {
      this.num = num;
      this.kind = type;
    }
    get() {
      return this.num;
    }
    from() {
      return this;
    }
    valueOf() {
      return this.num;
    }
    toToken() {
      return Expr.unit(this);
    }
    add(num, type) {
      return this.from(this.get(type) + num, type);
    }
    sub(num, type) {
      return this.from(this.get(type) - num, type);
    }
    mul(num, type) {
      return this.from(this.get(type) * num, type);
    }
    div(num, type) {
      return this.from(this.get(type) / num, type);
    }
    mod(num, type) {
      return this.from(this.get(type) % num, type);
    }
  });
  Expr.define("unit", class Unit extends Expr.Val {
    constructor(num, type) {
      super(num, type);
      this.kind = type.replace(/^:/, "");
    }
    toString() {
      return `${this.num.toFixed(2).replace(/\.0+$/, "")} ${this.kind}`;
    }
    get(type) {
      return type !== this.kind ? this.to(type).num : this.num;
    }
    from(num, type) {
      if (!type) {
        this.num = num;
        return this;
      }
      return new Unit(num, type);
    }
    to(type) {
      ensureDefaultMappings();
      const newKind = type.replace(/^:/, "");
      let value;
      if (CURRENCY_SYMBOLS[this.kind] || CURRENCY_SYMBOLS[newKind]) {
        const a2 = CURRENCY_EXCHANGES[this.kind];
        const b2 = CURRENCY_EXCHANGES[newKind];
        if (!a2)
          throw new Error(`Unsupported ${this.kind} currency`);
        if (!b2)
          throw new Error(`Unsupported ${newKind} currency`);
        value = this.num * b2 / a2;
      } else {
        value = convert(this.num).from(this.kind).to(newKind);
      }
      return this.from(value, newKind);
    }
    static from(num, type) {
      if (Unit.exists(type)) {
        return new Unit(num, type);
      }
    }
    static exists(type) {
      ensureDefaultMappings();
      return DEFAULT_MAPPINGS[type] || DEFAULT_MAPPINGS[type.toLowerCase()];
    }
    static convert(num, base, target) {
      return new Unit(num, base).to(target);
    }
  });
  Expr.define("frac", class Frac extends Expr.Val {
    valueOf() {
      return this.num / this.kind;
    }
    toString() {
      return `${this.num}/${this.kind}`;
    }
    add(other) {
      if (other instanceof Frac) {
        const num = this.num * other.kind + other.num * this.kind;
        const dem = this.kind * other.kind;
        const gcd = Frac.gcd(num, dem);
        return new Frac(num / gcd, dem / gcd);
      }
    }
    sub(other) {
      if (other instanceof Frac) {
        return new Frac(this.num, this.kind).add(new Frac(-other.num, other.kind));
      }
    }
    mul(other) {
      if (other instanceof Frac) {
        return new Frac(this.num * other.num, this.kind * other.kind);
      }
    }
    div(other) {
      if (other instanceof Frac) {
        return Frac.from(this.kind * other.num / (this.num * other.kind));
      }
    }
    mod(other) {
      if (other instanceof Frac) {
        return Frac.from(this * 100 % (other * 100) / 100);
      }
    }
    static from(num) {
      const dec = num.toString().match(/\.0+\d/);
      const length = Math.max(dec ? dec[0].length : 3, 3);
      const div = parseInt(`1${Array.from({ length }).join("0")}`, 10);
      const base = Math.floor(parseFloat(num) * div) / div;
      const [left, right] = base.toString().split(".");
      if (!right)
        return parseFloat(left);
      const a2 = parseFloat(left + right);
      const b2 = 10 ** right.length;
      const factor = Frac.gcd(a2, b2);
      if (left < 1) {
        return new Frac(a2 / factor, b2 / factor);
      }
      return new Frac(b2 / factor, a2 / factor);
    }
    static gcd(a2, b2) {
      if (!b2)
        return a2;
      return Frac.gcd(b2, a2 % b2);
    }
  });
  Expr.define("object", class Object_ extends Expr {
  });
  Expr.define("markup", class Tag extends Expr {
  });
  Expr.define("literal", class Literal extends Expr {
  });
  Expr.define("function", class Function_ extends Expr {
  });
  Expr.define("callable", class Callable extends Expr {
  });
  Expr.define("statement", class Statement extends Expr {
  });
  Expr.define("expression", class Expression extends Expr {
  });
  Expr.define("namespaceStatement", class NamespaceStatement extends Expr.Statement {
  });
  Expr.define("tableStatement", class TableStatement extends Expr.Statement {
  });
  Expr.define("ifStatement", class IfStatement extends Expr.Statement {
  });
  Expr.define("elseStatement", class ElseStatement extends Expr.Statement {
  });
  Expr.define("okStatement", class OkStatement extends Expr.Statement {
  });
  Expr.define("errStatement", class ErrStatement extends Expr.Statement {
  });
  Expr.define("doStatement", class DoStatement extends Expr.Statement {
  });
  Expr.define("whileStatement", class WhileStatement extends Expr.Statement {
  });
  Expr.define("letStatement", class LetStatement extends Expr.Statement {
  });
  Expr.define("destructureStatement", class DestructureStatement extends Expr.Statement {
  });
  Expr.define("loopStatement", class LoopStatement extends Expr.Statement {
  });
  Expr.define("matchStatement", class MatchStatement extends Expr.Statement {
  });
  Expr.define("tryStatement", class TryStatement extends Expr.Statement {
  });
  Expr.define("checkStatement", class CheckStatement extends Expr.Statement {
  });
  Expr.define("rescueStatement", class RescueStatement extends Expr.Statement {
  });
  Expr.define("fromStatement", class FromStatement extends Expr.Statement {
  });
  Expr.define("importStatement", class ImportStatement extends Expr.Statement {
  });
  Expr.define("moduleStatement", class ModuleStatement extends Expr.Statement {
  });
  Expr.define("exportStatement", class ExportStatement extends Expr.Statement {
  });
  Expr.define("templateStatement", class TemplateStatement extends Expr.Statement {
  });
});

// src/lib/range.js
class Range {
  constructor(base, target, increment) {
    this.alpha = this.alpha || false;
    this.step = increment || 1;
    this.offset = null;
    this.length = null;
    this.max = Infinity;
    this.begin = base.valueOf();
    this.end = typeof target === "undefined" || target === null ? Infinity : target.valueOf();
    this.infinite = this.end === Infinity || this.end === -Infinity;
    if (!this.infinite && (isString(base) || isString(target))) {
      this.begin = String(this.begin).charCodeAt();
      this.end = String(this.end).charCodeAt();
      this.alpha = true;
    }
    if (!this.infinite && this.begin > this.end) {
      this.step = -1;
    }
    Object.defineProperty(this, "idx", { value: 0, writable: true });
  }
  getIterator() {
    return Range.build(this.begin, this.end, this.step, this.infinite);
  }
  toString() {
    const prefix = this.infinite ? `${this.begin}..` : [this.begin, this.end].join("..");
    let suffix = "";
    let defs = this.idx;
    if (this.max !== Infinity) {
      suffix += `:${this.max}`;
      defs--;
    }
    if (Math.abs(this.step) !== 1) {
      suffix += `:${this.step}`;
      defs--;
    }
    suffix += Array.from({ length: defs + 1 }).join(":");
    if (this.offset !== null) {
      suffix += `:${this.offset}`;
    }
    return prefix + suffix;
  }
  take(expr) {
    const {
      offset,
      length,
      begin,
      end
    } = slice(expr);
    if (expr === ":") {
      if (this.idx >= 2)
        throw new Error(`Unexpected \`:\` after \`${this}\``);
      this.idx++;
      return this;
    }
    if (typeof begin !== "undefined" && typeof end !== "undefined") {
      if (this.offset !== null || this.idx < 2)
        throw new Error(`Unexpected take-range \`:${begin}..${end}\` after \`${this}\``);
      this.offset = begin;
      this.length = end;
      this.idx += 2;
      if (begin < 0 && end < 0) {
        this.length = (begin - end) * -1;
      }
      return this;
    }
    if (typeof offset !== "undefined" && typeof length !== "undefined") {
      if (this.max !== Infinity || this.idx > 0)
        throw new Error(`Unexpected take-step \`:${offset}-${length}\` after \`${this}\``);
      this.max = offset;
      this.step = length;
      this.idx += 2;
      return this;
    }
    if (this.idx >= 2) {
      if (this.offset !== null)
        throw new Error(`Unexpected take-range \`:${offset}\` after \`${this}\``);
      this.offset = offset;
      this.max = 1;
    } else if (this.idx === 1) {
      this.step = offset;
      this.idx++;
    } else {
      this.max = offset;
      this.idx++;
    }
    return this;
  }
  run(invoke, callback) {
    return invoke ? Range.run(this, callback || ((x2) => x2)) : this;
  }
  static async run(gen, callback) {
    const it = gen.getIterator();
    const seq = [];
    const max2 = gen.infinite ? Infinity : gen.end > gen.begin ? gen.end - gen.begin : gen.begin - gen.end;
    for (let i2 = 0, nextValue = it.next();nextValue.done !== true; nextValue = it.next(), i2++) {
      let keep = true;
      if (gen.offset !== null) {
        if (gen.offset >= 0) {
          keep = i2 >= gen.offset;
        } else if (gen.infinite) {
          throw new Error("Negative offsets are not supported for infinite ranges");
        } else if (gen.begin < 0) {
          keep = max2 - i2 + gen.offset < 0;
        } else {
          keep = i2 >= gen.offset + gen.end;
        }
      }
      if (keep) {
        const newValue = gen.alpha ? String.fromCharCode(nextValue.value) : nextValue.value;
        const fixedValue = await callback(Expr.value(newValue));
        seq.push(...!Array.isArray(fixedValue) ? [fixedValue] : fixedValue);
      }
      if (seq.length >= gen.max)
        break;
      if (gen.length !== null && seq.length >= gen.length)
        break;
    }
    return seq;
  }
  static from(begin, end, take, step, offset, length) {
    const range = new Range(begin, end, step);
    if (typeof take === "number")
      range.max = take;
    if (typeof offset === "number")
      range.offset = offset;
    if (typeof length === "number")
      range.length = length;
    return range;
  }
  static *build(begin, end, i2) {
    const infinite = end === Infinity || end === -Infinity;
    let current2 = begin;
    while (true) {
      yield current2;
      if (!infinite && current2 === end)
        return;
      current2 += i2;
    }
  }
  static async unwrap(result, callback, nextToken) {
    if (!Array.isArray(result)) {
      if (isString(result)) {
        return split(result.value).map((chunk) => Expr.value(chunk));
      }
      if (isNumber(result)) {
        return [new Range(Expr.value(1), result.valueOf())];
      }
      if (result.value instanceof Range) {
        if (nextToken) {
          if (nextToken.value !== ":")
            result.value.idx += 2;
          result.value.take(nextToken.value);
        }
        return result.value.run(true, callback);
      }
      return result.value;
    }
    const seq = [];
    for (let j = 0, k2 = result.length;j < k2; j++) {
      const values = await Range.unwrap(result[j], callback, nextToken);
      for (let i2 = 0, c2 = values.length;i2 < c2; i2++) {
        let data;
        if (values[i2] instanceof Range || isRange(values[i2])) {
          data = await Range.run(values[i2].value || values[i2], callback);
        } else {
          data = await callback(values[i2]);
        }
        seq.push(...data);
      }
    }
    return seq;
  }
}
var init_range = __esm(() => {
  init_helpers();
  init_expr();
});

// src/lib/prelude.js
var exports_prelude = {};
__export(exports_prelude, {
  vals: () => vals,
  take: () => take,
  tail: () => tail,
  size: () => size,
  show: () => show,
  rev: () => rev,
  repr: () => repr2,
  render: () => render,
  push: () => push,
  pairs: () => pairs,
  map: () => map,
  list: () => list,
  keys: () => keys,
  items: () => items,
  head: () => head,
  get: () => get2,
  format: () => format4,
  filter: () => filter,
  equals: () => equals,
  drop: () => drop,
  check: () => check2,
  cast: () => cast
});
function isRangeLike(input2) {
  return input2 instanceof Range || input2 && typeof input2.getIterator === "function" && typeof input2.run === "function";
}
function isLazySeq(input2) {
  return !!(input2 && input2[RE_LAZY]);
}
function asRange(input2) {
  if (isRangeLike(input2))
    return input2;
  if (input2 && input2.value) {
    return asRange(input2.value);
  }
  if (input2 && Array.isArray(input2.begin) && Array.isArray(input2.end) && input2.begin.length) {
    const begin = input2.begin[0];
    const end = input2.end.length ? input2.end[0] : undefined;
    return Range.from(begin, end);
  }
  return null;
}
function collectRange(range, limit = Infinity, offset = 0) {
  const seq = [];
  let index = 0;
  if (range.infinite && limit === Infinity) {
    raise("Infinite range requires explicit limit");
  }
  const iterator = range.getIterator();
  for (let next = iterator.next();next.done !== true; next = iterator.next(), index++) {
    if (index < offset)
      continue;
    seq.push(range.alpha ? String.fromCharCode(next.value) : next.value);
    if (seq.length >= limit)
      break;
  }
  return seq;
}
function toToken(value) {
  return value instanceof Expr ? value : Expr.value(value);
}
function fromToken(value) {
  return value instanceof Expr ? value.valueOf() : value;
}
function toLazy(input2) {
  if (isLazySeq(input2))
    return input2;
  if (input2 && input2.value)
    return toLazy(input2.value);
  const range = asRange(input2);
  if (range) {
    return {
      [RE_LAZY]: true,
      source: range,
      ops: [],
      infinite: !!range.infinite
    };
  }
  return null;
}
function appendLazy(input2, op) {
  const lazy = toLazy(input2);
  if (!lazy)
    return null;
  return {
    [RE_LAZY]: true,
    source: lazy.source,
    ops: lazy.ops.concat(op),
    infinite: lazy.infinite
  };
}
async function collectLazy(input2, limit = Infinity, offset = 0) {
  const lazy = toLazy(input2);
  if (!lazy)
    return null;
  if (lazy.infinite && limit === Infinity)
    raise("Infinite range requires explicit limit");
  let iterator;
  if (isRangeLike(lazy.source)) {
    iterator = lazy.source.getIterator();
  } else if (Array.isArray(lazy.source) || typeof lazy.source[Symbol.iterator] === "function") {
    iterator = lazy.source[Symbol.iterator]();
  } else {
    raise("Input is not iterable");
  }
  const seq = [];
  let index = 0;
  for (let next = iterator.next();next.done !== true; next = iterator.next(), index++) {
    if (index < offset)
      continue;
    let value = next.value;
    if (isRangeLike(lazy.source) && lazy.source.alpha) {
      value = String.fromCharCode(value);
    }
    let keep = true;
    let token = toToken(value);
    for (let i2 = 0, c2 = lazy.ops.length;i2 < c2; i2++) {
      const op = lazy.ops[i2];
      if (op.type === "map") {
        token = toToken(await op.callback(token));
      }
      if (op.type === "filter") {
        keep = !!await op.callback(token);
        if (!keep)
          break;
      }
    }
    if (!keep)
      continue;
    seq.push(fromToken(token));
    if (seq.length >= limit)
      break;
  }
  return seq;
}
function equals(a2, b2, weak) {
  if (typeof a2 === "undefined")
    raise("Missing left value");
  if (typeof b2 === "undefined")
    raise("Missing right value");
  return !hasDiff(a2, b2, weak);
}
function items(...args) {
  return args.reduce((p2, c2) => p2.concat(c2), []);
}
function show(...args) {
  return serialize(args);
}
function render(input2) {
  if (typeof input2 === "undefined")
    raise("No input to render");
  if (input2 && input2.isTag) {
    return renderTag(input2.value);
  }
  if (input2 && input2.isString) {
    return input2.valueOf();
  }
  return serialize(input2);
}
function cast(token, target) {
  if (!token)
    raise("Missing input to cast");
  if (!target)
    raise("Missing type to cast");
  assert(target, null, SYMBOL);
  let value;
  switch (target.get()) {
    case ":number":
      value = parseFloat(token.get());
      break;
    case ":string":
      value = token.get().toString();
      break;
    default:
      raise(`Invalid cast to ${target.get()}`);
  }
  return value;
}
function repr2(token) {
  let type;
  if (token.isTag)
    type = "markup";
  else if (token.isObject)
    type = "object";
  else if (token.isFunction)
    type = "function";
  else if (token.isCallable)
    type = "definition";
  else if (token.isSymbol)
    type = "symbol";
  else if (token.isRange)
    type = "range";
  else if (token.isMarkup)
    type = "markup";
  else
    type = repr(token.type).toLowerCase();
  return Expr.symbol(`:${type}`);
}
function size(token) {
  let obj;
  if (token.isTag)
    obj = token.value.children || [];
  else if (token.isFunction)
    obj = token.valueOf().target;
  else if (token.isObject)
    obj = Object.keys(token.valueOf());
  else if (token.isScalar || token.isRange)
    obj = token.valueOf();
  else
    obj = token;
  return obj.length - (token.isSymbol ? 1 : 0);
}
function get2(target, ...props) {
  const isObject2 = target.length === 1 && (target[0].isObject || target[0].isRange);
  const isArray2 = isObject2 && target[0].isRange;
  const input2 = isObject2 ? target[0].valueOf() : target;
  return props.reduce((prev, cur) => prev.concat(isObject2 && !isArray2 ? input2[cur].getBody() : input2[cur]), []);
}
function push(target, ...sources) {
  if (!target)
    raise("No target given");
  if (!(target.isObject || target.isString || target.isNumber || target.isRange))
    raise("Invalid target");
  sources.forEach((sub) => {
    if (target.isObject && sub.isObject)
      Object.assign(target.value, sub.value);
    if (target.isString)
      target.value += sub.valueOf();
    if (target.isRange) {
      if (sub.isRange)
        target.value.push(...sub.value);
      else
        target.value.push(sub);
    }
    if (target.isNumber) {
      target.value = (target.valueOf() + sub.valueOf()).toString();
    }
  });
  return target;
}
function list(input2) {
  if (!input2)
    raise("No input to list given");
  let data;
  const range = asRange(input2);
  if (Array.isArray(input2)) {
    data = input2;
  } else if (range) {
    data = collectRange(range);
  } else {
    if (!input2.isIterable)
      raise("Input is not iterable");
    data = input2.getArgs() || input2.getBody() || input2.valueOf();
  }
  return data;
}
async function head(input2) {
  const lazy = await collectLazy(input2, 1);
  if (lazy) {
    if (!lazy.length)
      raise("head: empty list");
    return lazy[0];
  }
  const range = asRange(input2);
  if (range) {
    const [first2] = collectRange(range, 1);
    if (typeof first2 === "undefined")
      raise("head: empty list");
    return first2;
  }
  const [first] = list(input2);
  if (typeof first === "undefined")
    raise("head: empty list");
  return first;
}
async function tail(input2) {
  const lazy = await collectLazy(input2, Infinity, 1);
  if (lazy) {
    return lazy;
  }
  const range = asRange(input2);
  if (range) {
    return collectRange(range, Infinity, 1);
  }
  return list(input2).slice(1);
}
async function take(input2, length) {
  const lazy = await collectLazy(input2, length || 1);
  if (lazy) {
    return lazy;
  }
  const range = asRange(input2);
  if (range) {
    return collectRange(range, length || 1);
  }
  return list(input2).slice(0, length || 1);
}
async function drop(input2, length, offset) {
  const lazy = toLazy(input2);
  if (lazy && lazy.infinite && typeof offset === "undefined") {
    const amount = length ? length.valueOf() : 1;
    return appendLazy(input2, {
      type: "filter",
      callback: (() => {
        let count = amount;
        return () => count-- <= 0;
      })()
    });
  }
  const range = asRange(input2);
  if (range) {
    const max2 = range.infinite ? offset ? offset.valueOf() + (length ? length.valueOf() : 1) : (length ? length.valueOf() : 1) + 1 : Infinity;
    const arr2 = collectRange(range, max2);
    const b3 = length ? length.valueOf() : 1;
    const a3 = offset ? offset.valueOf() : arr2.length - b3;
    arr2.splice(a3, b3);
    return arr2;
  }
  const arr = list(input2);
  const b2 = length ? length.valueOf() : 1;
  const a2 = offset ? offset.valueOf() : arr.length - b2;
  arr.splice(a2, b2);
  return input2;
}
async function map(input2, callback) {
  if (typeof callback !== "function")
    raise("Missing map callback");
  const lazy = appendLazy(input2, { type: "map", callback });
  if (lazy) {
    return lazy;
  }
  const arr = await list(input2);
  const out = [];
  for (let i2 = 0, c2 = arr.length;i2 < c2; i2++) {
    out.push(fromToken(await callback(toToken(arr[i2]))));
  }
  return out;
}
async function filter(input2, callback) {
  if (typeof callback !== "function") {
    raise("Missing filter callback");
  }
  const lazy = appendLazy(input2, { type: "filter", callback });
  if (lazy) {
    return lazy;
  }
  const arr = await list(input2);
  const out = [];
  for (let i2 = 0, c2 = arr.length;i2 < c2; i2++) {
    if (await callback(toToken(arr[i2]))) {
      out.push(arr[i2]);
    }
  }
  return out;
}
function rev(input2) {
  return list(input2).reverse();
}
function pairs(input2) {
  if (!input2)
    raise("No input given");
  if (!(input2.isRange || input2.isObject))
    raise("Invalid input");
  return Object.entries(input2.valueOf());
}
function keys(input2) {
  return pairs(input2).map(([k2]) => k2);
}
function vals(input2) {
  return pairs(input2).map((x2) => x2[1]);
}
async function check2(input2, run) {
  if (!input2 || !input2.length)
    raise("Missing expression to check");
  const offset = input2.findIndex((x2) => isSome(x2) || isOR(x2));
  const expr = offset > 0 ? input2.slice(0, offset) : input2;
  const msg = offset > 0 ? input2.slice(offset + 1) : [];
  const [result] = await run(...expr);
  const passed = result && result.get() === true;
  if (!isSome(input2[offset]) ? !passed : passed) {
    let debug2;
    if (msg.length > 0) {
      [debug2] = await run(...msg);
      debug2 = debug2 && debug2.valueOf();
    }
    return `\`${serialize(expr)}\` ${debug2 || "did not passed"}`;
  }
}
function format4(str, ...args) {
  if (!str)
    raise("No format string given");
  if (!str.isString)
    raise("Invalid format string");
  if (!args.length)
    raise("Missing value to format");
  const data = args.reduce((p2, c2) => {
    if (p2[p2.length - 1] && (p2[p2.length - 1].isRange && c2.isRange || p2[p2.length - 1].isObject && c2.isObject)) {
      push(p2[p2.length - 1], c2);
    } else
      p2.push(c2);
    return p2;
  }, []);
  let offset = 0;
  return str.value.replace(RE_PLACEHOLDER, (_2, key) => {
    if (!RE_FORMATTING.test(key))
      raise(`Invalid format \`${_2}\``);
    const [
      idx,
      fill,
      width,
      type,
      precision,
      transform
    ] = key.match(RE_FORMATTING).slice(1);
    let [value] = get2(data, idx || offset++);
    if (typeof value === "undefined")
      return _2;
    let prefix = "";
    let suffix = "";
    if (type === "?")
      value = serialize(value);
    else if (isBlock(value))
      value = value.toString();
    else if (precision && (isUnit(value) || isNumber(value))) {
      const fix = precision.substr(1);
      if (isUnit(value)) {
        const { value: base } = value;
        if (typeof base.kind === "string") {
          value = base.num.toFixed(fix);
          value = `${value} ${base.kind}`;
        } else {
          value = `${base.num}/${base.kind}`;
        }
      } else {
        value = value.valueOf().toFixed(fix);
      }
    } else if (type === "x")
      value = value.valueOf().toString(16);
    else if (type === "o")
      value = value.valueOf().toString(8);
    else if (type === "b")
      value = value.valueOf().toString(2);
    else
      value = value.valueOf().toString();
    if (typeof fill !== "undefined" && fill.length || width > 0) {
      const separator = fill.length > 1 ? fill.substr(0, fill.length - 1) : null;
      const alignment = fill.substr(-1);
      const padding = Array.from({
        length: (parseInt(width, 10) || 0) + 1 - value.length
      }).join(separator || " ");
      if (alignment === "^") {
        prefix = padding.substr(0, padding.length / 2);
        suffix = padding.substr(padding.length / 2);
      } else if (alignment === ">")
        suffix = padding;
      else
        prefix = padding;
    }
    if (transform === "^")
      value = value.toUpperCase();
    if (transform === "$")
      value = value.toLowerCase();
    value = prefix + value + suffix;
    return value;
  });
}
var RE_PLACEHOLDER, RE_FORMATTING, RE_LAZY;
var init_prelude = __esm(() => {
  init_helpers();
  init_symbols();
  init_expr();
  init_tag();
  init_range();
  RE_PLACEHOLDER = /(?<!\{)\{([^{}]*)\}/g;
  RE_FORMATTING = /^([^:]*?)(?::(.*?[<^>](?=\d)|)(\d+|)([?bxo]|)(\.\d+|)([$^]|))?$/;
  RE_LAZY = Symbol("LAZY_SEQ");
});

// src/lib/tree/env.js
class Env {
  constructor(value) {
    this.locals = {};
    this.annotations = {};
    this.resolved = new Set;
    this.templates = {};
    this.exported = true;
    this.exportedTemplates = {};
    this.descriptor = null;
    Object.defineProperty(this, "parent", { value });
  }
  has(name, recursive) {
    return !(recursive && this.parent && !this.locals[name]) ? typeof this.locals[name] !== "undefined" : this.parent.has(name, recursive);
  }
  get(name) {
    if (this.resolved.has(name)) {
      const found = Expr.has(this.locals[name].body, LITERAL, name);
      const call2 = this.locals[name].body[0].isCallable;
      if (found && !call2) {
        raise(`Unexpected reference to \`${name}\``);
      }
      return this.locals[name];
    }
    if (!this.locals[name]) {
      if (this.parent) {
        return this.parent.get(name);
      }
      raise(`Undeclared local \`${name}\``);
    }
    this.resolved.add(name);
    return this.locals[name];
  }
  set(name, value, noInheritance) {
    if (typeof value === "function") {
      let root = this;
      if (noInheritance !== true) {
        while (root && root.parent) {
          if (root && root.has(name))
            break;
          root = root.parent;
        }
      }
      value(root, root.locals[name]);
    } else {
      this.locals[name] = value;
    }
  }
  def(name, ...values) {
    this.set(name, { body: [].concat(values) });
  }
  annotate(name, typeText) {
    this.annotations[name] = String(typeText || "").trim();
  }
  getAnnotation(name, recursive = true) {
    if (this.annotations[name])
      return this.annotations[name];
    if (recursive && this.parent)
      return this.parent.getAnnotation(name, recursive);
    return null;
  }
  defn(name, params, tokenInfo) {
    this.set(name, (root) => {
      root.set(name, { ...params, ctx: tokenInfo });
    }, true);
  }
  static up(name, label, callback, environment) {
    environment.set(name, (root, token) => {
      root.set(name, { body: [Expr.value(callback(), token.ctx || token.body[0].tokenInfo)] });
    });
  }
  static sub(args, target, environment) {
    const scope = new Env(environment);
    const list2 = Expr.args(args);
    while (target.body && target.body[0].isCallable) {
      Env.merge(list2, target.args, true, scope);
      target = target.body[0].value;
    }
    if (target.body && target.args) {
      Env.merge(list2, target.args, true, scope);
    }
    return { target, scope };
  }
  static async load(ctx, name, alias, source, environment) {
    let label = `${source.split("/").pop()}/${name}${alias ? `:${alias}` : ""}`;
    const isGlobal = SAFE_GLOBALS.includes(source);
    const shared = Object.assign({
      Prelude: SAFE_PRELUDE,
      Unit: Expr.Unit,
      Frac: Expr.Frac
    }, Env.shared);
    try {
      let env;
      if (isGlobal) {
        env = globalThis[source];
      } else if (shared[source]) {
        env = shared[source];
      } else {
        env = await Env.resolve(source, name, alias, environment);
      }
      if (!env) {
        raise(`Could not load \`${name}\``, ctx.tokenInfo);
      }
      if (env instanceof Env) {
        if (env.descriptor) {
          label = `${env.descriptor}/${label.split("/")[1]}`;
        }
        if (typeof env.exported === "object") {
          name = env.exported[name] || name;
        }
        if (!env.has(name)) {
          raise(`Local \`${name}\` not exported`);
        }
        environment.defn(alias || name, {
          body: [Expr.fn({
            env,
            label,
            target: name
          }, ctx.tokenInfo)]
        }, ctx.tokenInfo);
        return;
      }
      if (!isGlobal && typeof env[name] === "undefined") {
        if (name !== "default" || (!alias || name === alias))
          raise(`Symbol \`${name}\` not exported`);
        environment.def(alias, Expr[isPlain2(env) ? "value" : "fn"](env, ctx.tokenInfo));
        return;
      }
      let body = env[name];
      if (!Array.isArray(body) || !(body[0] instanceof Expr)) {
        body = [Expr.call(env, name, label, ctx.tokenInfo)];
      }
      if (isPlain2(env[name]) && env[name][FFI]) {
        const fixedToken = { ...ctx.tokenInfo };
        const ffi = env[name];
        if (ffi.raw) {
          fixedToken.kind = "raw";
        }
        body = [Expr.function({
          type: FFI,
          value: {
            target: ffi.target,
            label: ffi.label
          }
        }, fixedToken)];
      }
      environment.defn(alias || name, { body }, ctx.tokenInfo);
    } catch (e2) {
      raise(`${e2.message} (${label})`, ctx.tokenInfo);
    }
  }
  static merge(list2, values, hygiene, environment) {
    const args = Expr.args(values, true);
    for (let i2 = 0, c2 = args.length;i2 < c2; i2++) {
      if (list2.length) {
        const key = args[i2].value;
        const value = key === ".." ? list2.splice(0, list2.length) : list2.shift();
        if (!hygiene || !(environment.parent && environment.parent.has(key, true))) {
          environment.def(key, Array.isArray(value) ? Expr.body(value, args[i2].tokenInfo) : value);
        }
      } else
        break;
    }
  }
  static create(values, environment) {
    const scope = new Env(environment);
    Object.keys(values).forEach((key) => {
      if (!(values[key] instanceof Expr)) {
        scope.def(key, Expr.value(values[key]));
      } else {
        scope.def(key, values[key]);
      }
    });
    return scope;
  }
  static register() {
    return;
  }
  static resolve() {
    return;
  }
}
var SAFE_GLOBALS, SAFE_PRELUDE;
var init_env = __esm(() => {
  init_expr();
  init_prelude();
  init_symbols();
  init_helpers();
  SAFE_GLOBALS = ["Promise", "RegExp", "Object", "Array", "String", "Number", "Math", "Date", "JSON"];
  SAFE_PRELUDE = Object.keys(exports_prelude).reduce((prev, cur) => {
    prev[cur] = Expr.unsafe(exports_prelude[cur], cur, cur === "check");
    return prev;
  }, {});
});

// src/lib/tree/scanner.js
class Scanner {
  constructor(source, tokenInfo) {
    this.refs = {};
    this.chars = split(source);
    this.source = source;
    this.tokens = [];
    this.chunks = [];
    this.current = null;
    this.blank = "";
    this.offset = 0;
    this.start = 0;
    this.line = 0;
    this.col = 0;
    this.afterEOL = null;
    if (tokenInfo) {
      this.line = tokenInfo.line;
      this.col = tokenInfo.col;
    }
  }
  tokenInfo(clear) {
    if (!this.current) {
      this.current = { line: this.line, col: this.col };
    }
    if (clear) {
      const info = this.current;
      delete this.current;
      return info;
    }
  }
  append(value, tokenInfo) {
    if (this.chunks.length) {
      this.chunks.push(new Token(PLUS, "+", null, tokenInfo));
    }
    if (!Array.isArray(value)) {
      if (value.indexOf("#{") === -1) {
        this.chunks.push(new Token(STRING, value, null, { ...tokenInfo, kind: "raw" }));
      } else {
        this.chunks.push(...new Scanner(quote(value), { line: 0, col: 3 }).scanTokens()[0].value);
      }
    } else {
      value.pop();
      this.chunks.push(new Token(OPEN, "#{", null, { ...value[0], kind: "raw" }));
      this.chunks.push(...value);
      this.chunks.push(new Token(CLOSE, "}", null, { ...value[value.length - 1], kind: "raw" }));
    }
  }
  appendText(char, depth) {
    if (this.blank.length) {
      const { line, col } = this.tokenInfo(true);
      let style2;
      let level = 0;
      let kind = TEXT;
      if (char) {
        if (char === "#") {
          let i2 = 0;
          level++;
          for (;i2 < 4; i2++) {
            if (this.blank.charAt(i2) === "#")
              level++;
            else
              break;
          }
          if (this.blank.charAt(i2) !== " ") {
            this.appendBuffer({ buffer: format3(char + this.blank) }, line, col);
            return;
          }
          kind = HEADING;
          this.blank = this.blank.substr(level);
        } else if (char === ">") {
          kind = BLOCKQUOTE;
        } else if (isDigit(char))
          kind = OL_ITEM;
        else
          kind = UL_ITEM;
        this.blank = this.blank.replace(/^\s+/, "");
        if (isDigit(char))
          level = parseFloat(char);
        if (kind === OL_ITEM || kind === UL_ITEM)
          style2 = char;
      }
      const value = {
        buffer: format3(this.blank)
      };
      if (level)
        value.level = level;
      if (style2)
        value.style = style2;
      if (depth)
        value.depth = depth;
      if (kind !== TEXT)
        value.kind = kind;
      this.appendBuffer(value, line, col);
    }
  }
  appendBuffer(value, line, col) {
    let offset = col;
    const extractInterpolationTokens = (chunk, atLine, atCol) => {
      if (chunk.indexOf("#{") === -1)
        return [chunk];
      const [token] = new Scanner(quote(chunk), { line: atLine, col: atCol }).scanTokens();
      const parts = [];
      token.value.forEach((sub, idx, all) => {
        if (sub.type === PLUS) {
          const prev = all[idx - 1];
          const next = all[idx + 1];
          const isPrefixJoin = prev && next && prev.type === STRING && prev.isRaw && next.type === OPEN && next.value === "#{";
          const isSuffixJoin = prev && next && prev.type === CLOSE && prev.value === "}" && next.type === STRING && next.isRaw;
          if (isPrefixJoin || isSuffixJoin)
            return;
        }
        if (sub.type === STRING && sub.isRaw) {
          parts.push(sub.value);
        } else {
          parts.push(sub);
        }
      });
      return parts;
    };
    value.buffer = value.buffer.reduce((prev, cur) => {
      if (typeof cur === "string" && cur.includes("[")) {
        const parts = cur.split(/(!?\[.+?\](?:\s*\[.*?\]|\(.+?\)))/g);
        parts.forEach((chunk) => {
          if (chunk.indexOf("]") !== -1) {
            const matches = chunk.match(/\[(.+?)\](?:\s*\[(.*?)\]|\((.+?)\))/);
            const [href, title] = (matches[3] || matches[2]).split(/\s+/);
            const desc = title && title.charAt() === '"' ? title.substr(1, title.length - 2) : null;
            const alt = matches[1];
            prev.push(new Token(REF, {
              image: chunk.charAt() === "!",
              text: chunk,
              href: href || alt,
              cap: desc || null,
              alt: href ? alt : null
            }, null, { line, col: offset }));
          } else {
            prev.push(...extractInterpolationTokens(chunk, line, offset));
          }
          offset += chunk.length;
        });
      } else if (Array.isArray(cur)) {
        offset += cur[2].length;
        prev.push(cur);
      } else if (typeof cur === "string") {
        prev.push(...extractInterpolationTokens(cur, line, offset));
        offset += cur.length;
      } else {
        prev.push(cur);
      }
      return prev;
    }, []);
    this.tokens.push(new Token(TEXT, value, null, { line, col }));
    this.blank = "";
  }
  scanTokens() {
    while (!this.isDone()) {
      this.start = this.offset;
      if (this.scanToken() === false)
        break;
    }
    if (!this.tokens.length) {
      raise("Missing input", this);
    }
    this.appendText();
    this.tokens.push(new Token(EOF, "", null));
    return this.tokens;
  }
  scanToken() {
    const char = this.getToken();
    if (typeof char !== "string")
      return false;
    if (char !== `
` && this.blank[this.blank.length - 1] === `
`)
      this.appendText();
    if (this.col === 1) {
      if (this.afterEOL !== 1 && char === "[" && this.parseRef(this.col))
        return;
      if (char === "-" && this.parseThematicBreak())
        return;
      if (char === "#" && this.parseBlock(char))
        return;
      if (char === ">" && this.peek() === " " && this.parseBlock(char))
        return;
      if (char === "[" && this.parseLinkLine())
        return;
      if (char === "|" && this.parseTableLine())
        return;
      if (this.afterEOL !== 1 && (isAlphaNumeric(char) && char !== "@" || char === "*") && this.parseText(char))
        return;
      if (char === "`" && char === this.peek() && char === this.peekNext() && this.parseFence(char))
        return;
    }
    if (char === '"' && char === this.peek() && char === this.peekNext() && this.parseFence(char))
      return;
    if (this.blank.length === this.col - 1 && isDigit(char)) {
      let chunk = char;
      while (isDigit(this.peek()))
        chunk += this.getToken();
      if (this.peek() === "." && this.peekNext() === " ") {
        this.parseItem(chunk);
        return;
      }
    }
    if ("-+*".includes(char) && this.blank.length === this.col - 1 && this.peekToken() === " " && this.parseItem(char))
      return;
    switch (char) {
      case "(":
        this.addToken(OPEN);
        break;
      case ")":
        this.addToken(CLOSE);
        break;
      case "{":
        this.addToken(OPEN, char, { kind: "brace" });
        break;
      case "}":
        this.addToken(CLOSE, char, { kind: "brace" });
        break;
      case ",":
        this.addToken(COMMA);
        break;
      case "[":
        this.addToken(BEGIN);
        break;
      case "]":
        this.addToken(DONE);
        break;
      case ".":
        if (this.isMatch(".")) {
          this.addToken(RANGE);
        } else {
          let next = this.peek();
          if (next === " " || next === "\t" || next === "\r") {
            let i2 = 0;
            while (this.peekToken(i2) === " " || this.peekToken(i2) === "\t" || this.peekToken(i2) === "\r")
              i2++;
            next = this.peekToken(i2);
          }
          if (next === `
` || this.isDone() || next === "" || typeof next === "undefined") {
            this.addToken(EOL);
          } else {
            this.addToken(DOT);
          }
        }
        break;
      case "-":
        if (this.isMatch(">")) {
          this.addToken(BLOCK);
        } else {
          this.addToken(MINUS);
        }
        break;
      case "+":
        this.addToken(PLUS);
        break;
      case "*":
        this.addToken(MUL);
        break;
      case "!":
        this.addToken(this.isMatch("=") ? NOT_EQ : NOT);
        break;
      case "=":
        this.addToken(this.isMatch("=") ? EXACT_EQ : EQUAL);
        break;
      case "%":
        this.addToken(MOD);
        break;
      case "~":
        this.addToken(LIKE);
        break;
      case "?":
        this.addToken(SOME);
        break;
      case "$":
        this.addToken(EVERY);
        break;
      case "|":
        this.addToken(this.isMatch(">") ? PIPE : OR);
        break;
      case ">":
        this.addToken(this.isMatch("=") ? GREATER_EQ : GREATER);
        break;
      case "<":
        if (isReadable(this.peekToken())) {
          this.parseMarkup();
        } else {
          this.addToken(this.isMatch("=") ? LESS_EQ : LESS);
        }
        break;
      case "/":
        if (this.isMatch("/")) {
          this.parseComment();
        } else if (this.isMatch("*")) {
          this.parseComment(true);
        } else if (this.peekToken() !== " ") {
          this.parseRegex();
        } else {
          this.addToken(DIV);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        this.pushToken(char);
        break;
      case `
`:
        this.pushToken(char);
        this.col = 0;
        this.line++;
        if (this.afterEOL !== null)
          this.afterEOL++;
        break;
      case '"':
        this.parseString();
        break;
      case ":":
        this.parseSymbol();
        break;
      case "@":
        this.parseDirective();
        break;
      default:
        if (isDigit(char)) {
          this.parseNumber();
        } else if (isReadable(char)) {
          if (this.peek() === "." && this.peekNext() === ".") {
            this.addToken(LITERAL);
          } else {
            this.parseIdentifier();
          }
        } else {
          this.col--;
          raise(`Unexpected ${char}`, this);
        }
        break;
    }
  }
  addToken(type, literal2, tokenInfo) {
    const value = this.getCurrent();
    this.appendText();
    tokenInfo = {
      line: this.line,
      col: this.col - value.length,
      ...tokenInfo
    };
    this.tokens.push(new Token(type, value, literal2, tokenInfo));
    this.afterEOL = type === EOL ? 0 : null;
  }
  nextToken(nth = 1) {
    this.tokenInfo();
    while (nth--) {
      if (this.chars[this.offset] !== "") {
        this.col++;
        this.offset++;
      }
    }
  }
  pushToken(...chars) {
    this.blank += chars.join("");
  }
  peekToken(offset = 0) {
    return this.chars[this.offset + offset];
  }
  getToken() {
    this.nextToken();
    return this.chars[this.offset - 1];
  }
  getCurrent(chunk) {
    if (chunk) {
      return this.source.substring(this.start, this.offset).substr(-chunk.length);
    }
    return this.source.substring(this.start, this.offset);
  }
  parseIdentifier() {
    while (isAlphaNumeric(this.peek()))
      this.nextToken();
    this.addToken(LITERAL);
  }
  parseNumber() {
    let value;
    while (isDigit(this.peek()))
      this.nextToken();
    if (this.peek() === "." && isDigit(this.peekNext())) {
      this.nextToken();
      while (isDigit(this.peek()))
        this.nextToken();
    }
    if (this.peek() === "/" && isDigit(this.peekNext())) {
      let i2 = this.offset + 1;
      while (i2 < this.chars.length && isDigit(this.chars[i2]))
        i2++;
      if (i2 < this.chars.length && this.chars[i2] === ".") {} else {
        this.nextToken();
        while (isDigit(this.peek()))
          this.nextToken();
        const [left, right] = this.getCurrent().split("/");
        value = new Expr.Frac(parseFloat(left), parseFloat(right));
      }
    }
    if (this.peek() === " " || isReadable(this.peek())) {
      const num = value ? value.valueOf() : this.getCurrent();
      let i2 = this.offset + (this.peek() === " " ? 1 : 0);
      let kind = "";
      for (let c2 = this.chars.length;i2 < c2; i2++) {
        if (!isReadable(this.chars[i2]))
          break;
        kind += this.chars[i2];
      }
      const retval = kind && Env.register(parseFloat(num), kind);
      if (isPlain2(retval)) {
        this.offset = this.start = i2;
        this.addToken(NUMBER, retval);
        return;
      }
    }
    this.addToken(NUMBER, value);
  }
  parseRef(col) {
    const offset = this.offset;
    const chunks = ["[", ""];
    this.blank = chunks[0];
    while (!this.isDone() && this.peek() !== `
`) {
      const char = this.getToken();
      this.pushToken(char);
      if (chunks.length >= 4) {
        if (!(chunks[0] === "[" && chunks[2] === "]" && chunks[3] === ":"))
          break;
      } else if (char !== "]" && (isAlphaNumeric(char) || char === " ")) {
        chunks[chunks.length - 1] += char;
      } else {
        chunks.push(char);
      }
    }
    if (chunks[2] !== "]" || chunks[3] !== ":") {
      this.offset = offset;
      this.blank = "";
      this.col = col;
      return;
    }
    const matches = this.blank.match(/\[(.+?)\]:\s+(\S+)(?:\s+(\(.+?\)|".+?"|'.+?'|.+?))?/);
    const fixedHref = matches[2].charAt() === "<" && matches[2].substr(-1) === ">" ? matches[2].substr(1, matches[2].length - 2) : matches[2];
    this.refs[matches[1]] = {
      text: this.blank,
      href: fixedHref,
      alt: matches[3] ? matches[3].substr(1, matches[3].length - 2) : null
    };
    this.blank = "";
    this.addToken(REF, this.refs[matches[1]], { kind: "raw" });
    return true;
  }
  parseLine() {
    while (!this.isDone() && this.peek() !== `
`)
      this.pushToken(this.getToken());
  }
  parseThematicBreak() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end).trim();
    if (!/^-{3,}$/.test(line))
      return false;
    this.appendText();
    this.offset = end;
    this.col = lineCol + (end - start);
    this.blank = "";
    return true;
  }
  parseBlock(char) {
    this.appendText();
    this.parseLine();
    this.appendText(char);
    return true;
  }
  parseLinkLine() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end);
    const matches = line.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/);
    if (!matches)
      return false;
    this.offset = end;
    this.col = lineCol + line.length;
    this.appendText();
    this.tokens.push(new Token(REF, {
      image: false,
      text: line,
      href: matches[2],
      cap: null,
      alt: matches[1]
    }, null, { line: this.line, col: lineCol, kind: "raw" }));
    return true;
  }
  parseTableLine() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end);
    if (!/^\|.+\|\s*$/.test(line))
      return false;
    this.offset = end;
    this.col = lineCol + line.length;
    this.appendText();
    this.tokens.push(new Token(TEXT, {
      kind: TABLE,
      buffer: [line]
    }, null, { line: this.line, col: lineCol }));
    return true;
  }
  parseFence(char) {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: "multi" };
    this.appendText();
    this.nextToken(2);
    while (!this.isDone()) {
      const cur = this.getToken();
      if (cur === `
`) {
        this.col = -1;
        this.line++;
      }
      if (cur === char && this.peek() === char && this.peekNext() === char)
        break;
      this.pushToken(cur);
    }
    const chunk = this.blank;
    this.offset += 2;
    this.blank = "";
    if (char === '"') {
      this.subString(deindent(chunk), false, tokenInfo);
    } else {
      this.addToken(CODE, chunk, tokenInfo);
    }
    return true;
  }
  parseItem(char) {
    const depth = Math.floor(this.blank.length / 2);
    while (this.peek() !== " ")
      this.nextToken();
    if (isDigit(char)) {
      this.blank = "";
    }
    this.parseLine();
    this.appendText(char, depth);
    return true;
  }
  parseText(char) {
    this.appendText();
    let i2 = this.offset;
    if ("*_".includes(char)) {
      if (this.peek() === char) {
        char += this.getToken(++i2);
      } else if (!isAlphaNumeric(this.peek()))
        return;
    } else {
      this.pushToken(char);
    }
    for (let c2 = this.chars.length;i2 < c2; i2++) {
      if ("*_".includes(char)) {
        if (this.chars[i2] === char)
          break;
      } else if (char.length === 2) {
        if (char === this.chars[i2] + this.chars[i2 + 1])
          break;
      } else if (!isAlphaNumeric(this.chars[i2], true))
        break;
      if (this.chars[i2] === "." && /^\d+$/.test(this.blank))
        break;
      this.pushToken(this.chars[i2]);
    }
    const token = this.chars[i2];
    const nextToken = this.chars[i2 + 1];
    if (/^\d+$/.test(this.blank) && token === " " && isAlphaNumeric(nextToken)) {
      this.blank = "";
      return;
    }
    if (/^\d+$/.test(this.blank) && token === "." && nextToken === " ") {
      this.parseItem(this.blank);
      return true;
    }
    if (char.length === 1 && char === token || char.length === 2 && char === token + nextToken) {
      this.offset = this.start = i2 + char.length;
      this.blank = char + this.blank + char;
      this.appendText();
      this.parseLine();
      this.appendText();
      return true;
    }
    const looksLikeUnitLiteral = /^\d+[A-Za-z_][A-Za-z0-9_]*$/.test(this.blank);
    if (isReadable(this.blank) && token === "*" || nextToken === " " && ");:.,".includes(token) && !(token === "." && looksLikeUnitLiteral) || token === " " && (nextToken === "*" || nextToken && isAlphaNumeric(nextToken))) {
      this.pushToken(token, nextToken);
      this.offset = this.start = i2 + 2;
      this.parseLine();
      this.appendText();
      return true;
    }
    if (token === " " && nextToken === "(" && /^[A-Z]/.test(this.blank)) {
      this.pushToken(token);
      this.offset = this.start = i2 + 1;
      this.parseLine();
      this.appendText();
      return true;
    }
    this.blank = "";
  }
  subString(chunk, isMarkup, tokenInfo) {
    if (chunk.indexOf("#{") === -1 || isMarkup) {
      this.addToken(STRING, chunk, tokenInfo);
      return;
    }
    const info = { line: tokenInfo.line, col: tokenInfo.col + 1 };
    const input2 = split(chunk);
    const stack = [];
    let curInfo = { ...info };
    let buffer = "";
    let depth = 0;
    while (input2.length) {
      const char = input2.shift();
      if (char === "\\" && input2[0] === '"') {
        buffer += input2.shift();
        info.col += 2;
        continue;
      }
      if (char === "#" && input2[0] === "{") {
        if (!depth && buffer.length) {
          this.append(buffer, curInfo);
          buffer = "";
        }
        buffer += char + input2.shift();
        info.col += 2;
        curInfo = { ...info };
        stack.push(OPEN);
        depth++;
        continue;
      }
      buffer += char;
      if (char === "}" && stack[stack.length - 1] === OPEN) {
        stack.pop();
        depth--;
        if (!depth) {
          buffer = buffer.substr(2, buffer.length - 3);
          if (buffer.indexOf("#{") !== -1) {
            curInfo.col -= buffer.length - 5;
          }
          this.append(new Scanner(buffer, curInfo).scanTokens(), curInfo);
          buffer = "";
        }
        info.col++;
        continue;
      }
      if (char === '"') {
        info.col++;
        if (stack[stack.length - 1] === BEGIN) {
          stack.pop();
          depth--;
        } else {
          stack.push(BEGIN);
          depth++;
        }
        continue;
      }
      if (char === `
`) {
        info.col = 0;
        info.line++;
      } else {
        info.col++;
      }
    }
    if (buffer.length) {
      curInfo.col += 2;
      this.append(buffer, curInfo);
    }
    if (isMarkup) {
      tokenInfo.kind = "markup";
    }
    this.addToken(STRING, this.chunks, tokenInfo);
    this.chunks = [];
  }
  parseString() {
    const stack = [];
    const info = { line: this.line, col: this.col - 1 };
    let hadInterpolation = false;
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        if (!stack.length && !hadInterpolation)
          raise("Unterminated string", this);
        this.col = -1;
        this.line++;
      }
      if (this.peek() === "#" && this.peekNext() === "{") {
        stack.push(OPEN);
        hadInterpolation = true;
      }
      if (this.peek() === "}" && stack[stack.length - 1] === OPEN)
        stack.pop();
      if (stack.length && this.peek() === '"' && this.peekToken(-1) !== "\\") {
        if (stack[stack.length - 1] === BEGIN)
          stack.pop();
        else
          stack.push(BEGIN);
      }
      if (!stack.length && this.peek() === '"' && this.peekToken(-1) !== "\\")
        break;
      this.nextToken();
    }
    if (stack.length) {
      this.col -= stack[stack.length - 1] === OPEN ? 2 : 1;
      raise(`Expecting \`${stack[stack.length - 1] === OPEN ? '"' : "}"}\``, this);
    }
    if (this.isDone()) {
      raise("Unterminated string", this);
    }
    this.nextToken();
    this.subString(this.source.substring(this.start + 1, this.offset - 1), false, info);
  }
  parseMarkup() {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: "markup" };
    while (isAlphaNumeric(this.peek()))
      this.nextToken();
    const openTag = this.peekCurrent(4);
    const tagName = openTag.substr(1);
    const close = [tagName];
    const hasImmediateClosing = (name) => {
      let idx = this.offset + 1;
      while (idx < this.source.length && /\s/.test(this.source[idx]))
        idx++;
      const closing = `</${name}>`;
      return this.source.slice(idx, idx + closing.length).toLowerCase() === closing.toLowerCase();
    };
    let offset = 0;
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        this.col = -1;
        this.line++;
      }
      const cur = this.peek();
      const old = this.peekToken(-1);
      const next = this.peekNext();
      const tag = `</${close[close.length - 1]}>`;
      if (cur === "/" && next === ">") {
        this.nextToken(2);
        close.pop();
      }
      if (cur === ">" && close.length) {
        const top = String(close[close.length - 1] || "").toLowerCase();
        if (isVoidTag(top) && !hasImmediateClosing(top)) {
          close.pop();
        }
      }
      if (offset && cur === "<" && isAlphaNumeric(next)) {
        let nextTag = "";
        let char;
        do {
          this.nextToken();
          char = this.peek();
          if (!isAlphaNumeric(char))
            break;
          nextTag += char;
        } while (isAlphaNumeric(char));
        this.col -= 2;
        close.push(nextTag);
      }
      if (old === ">" && tag === this.getCurrent(tag))
        close.pop();
      if (!close.length)
        break;
      this.nextToken();
      offset++;
    }
    this.subString(this.getCurrent(), true, tokenInfo);
  }
  parseRegex() {
    const prevToken = this.peekToken(-2);
    if (prevToken && isAlphaNumeric(prevToken)) {
      this.addToken(DIV);
      return;
    }
    let flags = "";
    let pattern = "";
    let i2 = this.offset;
    for (let c2 = this.chars.length;i2 < c2; i2++) {
      const last = this.chars[i2 - 1];
      const cur = this.chars[i2];
      if (flags) {
        if ("igmu".includes(cur)) {
          flags += cur;
          continue;
        }
        if (isAlphaNumeric(cur)) {
          this.col = i2;
          raise(`Unknown modifier \`${cur}\``, this);
        }
        --i2;
        break;
      }
      if (cur === "/" && last !== "\\") {
        const next = this.chars[i2 + 1];
        if (next && isAlphaNumeric(next)) {
          if ("igmu".includes(next)) {
            flags += this.chars[++i2];
            continue;
          }
          this.col = ++i2;
          raise(`Unknown modifier \`${next}\``, this);
        }
        break;
      }
      if (cur === " " || cur === `
`) {
        this.addToken(DIV);
        return;
      }
      pattern += cur;
    }
    this.offset = this.start = ++i2;
    this.addToken(REGEX, new RegExp(pattern, flags));
  }
  parseSymbol() {
    while (!this.isDone()) {
      const cur = this.peek();
      if (cur === "." && (this.peekNext() === `
` || this.offset + 1 >= this.chars.length))
        break;
      if (cur === "/" || isAlphaNumeric(cur, true))
        this.nextToken();
      else
        break;
    }
    this.addToken(SYMBOL);
  }
  parseDirective() {
    while (!this.isDone()) {
      const cur = this.peek();
      if (cur === "." && (this.peekNext() === `
` || this.offset + 1 >= this.chars.length))
        break;
      if (cur === "/" || isAlphaNumeric(cur, true))
        this.nextToken();
      else
        break;
    }
    this.addToken(DIRECTIVE);
  }
  parseComment(multiline) {
    if (multiline) {
      while (this.peek() !== "*" && this.peekNext() !== "/" && !this.isDone()) {
        if (this.peek() === `
`) {
          this.col = -1;
          this.line++;
        }
        this.nextToken();
      }
      if (this.isDone()) {
        raise("Unterminated comment", this);
      }
      this.nextToken(2);
      this.addToken(COMMENT_MULTI);
    } else {
      while (this.peek() !== `
` && !this.isDone())
        this.nextToken();
      this.addToken(COMMENT);
    }
  }
  isMatch(expected) {
    if (this.isDone())
      return false;
    if (this.chars[this.offset] !== expected)
      return false;
    this.nextToken();
    return true;
  }
  isDone() {
    return this.offset >= this.chars.length;
  }
  peek() {
    if (this.isDone())
      return "\x00";
    return this.chars[this.offset];
  }
  peekNext() {
    if (this.offset + 1 >= this.chars.length)
      return "\x00";
    return this.chars[this.offset + 1];
  }
  peekCurrent(offset) {
    const buffer = this.getCurrent();
    this.offset += buffer.length - offset;
    return buffer;
  }
}
var init_scanner = __esm(() => {
  init_symbols();
  init_helpers();
  init_void_tags();
  init_env();
  init_expr();
});

// src/lib/tree/parser.js
class Parser {
  constructor(tokens, plain, ctx) {
    this.templates = ctx && ctx.templates || {};
    this.template = null;
    this.partial = [];
    this.raw = plain;
    this.tokens = tokens;
    this.current = null;
    this.buffer = [];
    this.offset = 0;
    this.depth = 0;
  }
  extension(stmts) {
    stmts.forEach((stmt) => {
      const subTree = stmt.getBody();
      const expr = subTree.pop();
      if (!isBlock(expr) || !expr.hasArgs || !expr.getArg(0) || !expr.getArg(0).isCallable) {
        return;
      }
      let root = this.templates;
      let key;
      while (subTree.length) {
        key = subTree.shift().valueOf();
        if (!root[key])
          root[key] = {};
        if (subTree.length)
          root = root[key];
      }
      root[key] = expr.getArgs()[0].value;
    });
  }
  parseRefImportSpec(alias) {
    const parts = String(alias || "").split(",").map((part) => part.trim()).filter(Boolean);
    const imports = [];
    const templates = [];
    let includeAllTemplates = false;
    parts.forEach((part) => {
      if (!part.startsWith("@template")) {
        imports.push(part);
        return;
      }
      const rest = part.slice("@template".length).trim();
      if (!rest) {
        includeAllTemplates = true;
        return;
      }
      rest.split(/\s+/).map((name) => name.trim()).filter(Boolean).forEach((name) => templates.push(name));
    });
    return { imports, includeAllTemplates, templates };
  }
  collection(token, curToken, nextToken) {
    const isFirstClassMatch = isDirective(token) && token.value === "@match" && isOpen(curToken) && curToken.tokenInfo && curToken.tokenInfo.kind === "brace";
    if (isSpecial(token) || isSlice(token) || isEnd(curToken) || isSome(curToken) && isEnd(nextToken) || isOpen(curToken) && isClose(nextToken) || isSymbol(curToken) && !isSpecial(curToken) || isText(curToken) && !(isDirective(token) && CONTROL_TYPES.includes(token.value)) || isMath(curToken) && !isSome(curToken) && curToken.type !== MINUS && token.value !== "@template") {
      if (token.value === ":nil")
        return Expr.value(null, token);
      if (token.value === ":on")
        return Expr.value(true, token);
      if (token.value === ":off")
        return Expr.value(false, token);
      if (isDirective(token)) {
        return Expr.stmt(token.value, [], token);
      }
      return Expr.symbol(token.value, isSome(curToken) || null, token);
    }
    const map2 = {};
    let optional;
    let stack = [[]];
    let key = token.value;
    while (!this.isDone() && !this.isEnd([OR, PIPE])) {
      const body = stack[stack.length - 1];
      const cur = this.next();
      const keepElseBodyDirective = key === "@else" && !body.length && isDirective(cur) && ["@do", "@match", "@let"].includes(cur.value);
      if (!this.depth && (isSymbol(cur) || isDirective(cur)) && !keepElseBodyDirective) {
        if (isSpecial(cur) || isSlice(cur)) {
          body.push(Expr.from(cur));
          continue;
        }
        this.appendTo(stack, key, map2, token, optional);
        optional = false;
        key = cur.value;
        stack = [[]];
        continue;
      }
      if (!this.depth && isComma(cur)) {
        stack.push([]);
        continue;
      }
      if (!body.length && isSome(cur)) {
        if (optional || isStatement(key)) {
          check(cur);
        }
        optional = true;
        continue;
      }
      if (!isText(cur)) {
        body.push(Expr.from(cur));
      }
    }
    this.appendTo(stack, key, map2, token, optional);
    if (isFirstClassMatch && map2.match instanceof Expr.MatchStatement) {
      const [braceBody] = map2.match.getBody();
      const cases = isBlock(braceBody) ? braceBody.getBody() : [];
      const input2 = Expr.local("$", token);
      return Expr.callable({
        type: BLOCK,
        value: {
          args: [input2.clone()],
          body: [
            Expr.map({
              match: Expr.stmt("@match", [
                Expr.stmt([input2].concat(cases), token)
              ], token)
            }, token)
          ]
        }
      }, token);
    }
    return Expr.map(map2, token);
  }
  definition(token, isAnonymous) {
    let subTree;
    if (isAnonymous) {
      subTree = this.subTree(this.statement([OR, PIPE]));
    } else {
      subTree = this.expression();
    }
    const [head2, ...body] = subTree;
    const node = {
      type: BLOCK,
      value: {}
    };
    if (head2 && head2.type !== EQUAL) {
      body.unshift(head2);
    }
    if (isLiteral(body[0]) && isBlock(body[1])) {
      const args = body[1].getArgs();
      if (args.some((x2) => isLiteral(x2, ".."))) {
        node.value.args = node.value.args || [];
        node.value.args[isLiteral(args[0], "..") ? "unshift" : "push"](Expr.from(LITERAL, "..", token));
      }
    }
    if (body.length)
      node.value.body = body;
    if (!isAnonymous)
      node.value.name = token.value;
    Object.defineProperty(node.value, "plain", {
      value: isBlock(body[0]) && !body[0].hasArgs
    });
    return node;
  }
  destructure(token) {
    const bindings = [{ name: token.value, rest: false }];
    let offset = this.offset;
    let hasRest = false;
    while (offset < this.tokens.length) {
      let cur = this.tokens[offset];
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (!isComma(cur))
        return null;
      offset++;
      cur = this.tokens[offset];
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      const isRest = isRange(cur);
      if (isRest) {
        offset++;
        cur = this.tokens[offset];
        if (cur && cur.type === DOT) {
          offset++;
          cur = this.tokens[offset];
        }
      }
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (!isLiteral(cur))
        return null;
      if (hasRest)
        raise("Rest binding must be last", cur);
      bindings.push({ name: cur.value, rest: isRest });
      hasRest = isRest;
      offset++;
      cur = this.tokens[offset];
      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (isEqual(cur)) {
        return { bindings, offset };
      }
      if (!isComma(cur))
        return null;
    }
    return null;
  }
  expression() {
    const [, ...tail2] = this.statement();
    const body = this.subTree(tail2);
    return body;
  }
  statement(endToken, raw) {
    while (!this.isDone() && !this.isEnd(endToken, raw))
      this.push(raw);
    return this.pull();
  }
  isDone() {
    return isEOF(this.peek());
  }
  isEnd(endToken, raw) {
    const token = this.peek();
    if (isOpen(token) || isBegin(token))
      this.depth++;
    if (isClose(token) || isDone(token))
      this.depth--;
    if (this.depth > 0)
      return false;
    if (this.depth < 0) {
      this.depth = 0;
      return true;
    }
    return isEOL(token) || endToken && endToken.includes(token.type) || !raw && isText(token) && !hasBreaks(token);
  }
  has(token) {
    for (let i2 = this.offset, c2 = this.tokens.length;i2 < c2; i2++) {
      if (this.tokens[i2].type === token)
        return true;
    }
    return false;
  }
  peek() {
    return this.tokens[this.offset];
  }
  blank() {
    const token = this.peek();
    return isText(token) && !(token.value && token.value.kind) && !hasBreaks(token);
  }
  skip(raw) {
    this.current = this.peek();
    this.offset++;
    while (!this.isDone() && (!raw && this.blank()))
      this.offset++;
    return this;
  }
  prev() {
    return this.current || {};
  }
  next(raw) {
    return this.skip(raw).prev();
  }
  seek() {
    let inc = this.offset + 1;
    let token;
    do {
      token = this.tokens[inc++] || {};
    } while (isText(token) || isComma(token));
    return token;
  }
  leaf() {
    return this.subTree(this.statement([OR, PIPE, SOME, COMMA, SYMBOL]), true);
  }
  nextSignificantIndex(offset = this.offset) {
    let idx = offset;
    while (idx < this.tokens.length && isText(this.tokens[idx]))
      idx++;
    return idx;
  }
  tokenSourceText(token) {
    if (!token)
      return "";
    if (isText(token) && token.value && Array.isArray(token.value.buffer)) {
      return token.value.buffer.map((part) => typeof part === "string" ? part : "").join("");
    }
    if (token.type === STRING) {
      return `"${String(token.value || "")}"`;
    }
    return literal(token);
  }
  parseAnnotation(token, tokenInfo) {
    const colon1 = this.nextSignificantIndex(this.offset);
    const first = this.tokens[colon1];
    if (!isSymbol(first) || first.value !== ":")
      return null;
    const colon2 = this.nextSignificantIndex(colon1 + 1);
    const second = this.tokens[colon2];
    if (!isSymbol(second) || second.value !== ":")
      return null;
    let i2 = colon2 + 1;
    const parts = [];
    while (i2 < this.tokens.length && !isEOL(this.tokens[i2]) && !isEOF(this.tokens[i2])) {
      parts.push(this.tokenSourceText(this.tokens[i2]));
      i2++;
    }
    const typeText = parts.join("").trim();
    if (!typeText)
      return null;
    this.offset = i2;
    this.current = this.tokens[Math.min(i2, this.tokens.length - 1)];
    return Expr.map({
      annot: Expr.stmt("@annot", [
        Expr.local(token.value, tokenInfo),
        Expr.value(typeText, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  pull() {
    return this.buffer.splice(0, this.buffer.length);
  }
  push(raw) {
    this.buffer.push(Expr.from(this.next(raw)));
  }
  parse() {
    let root = [];
    const tree = root;
    const stack = [];
    const offsets = [];
    function get3() {
      let leaf = root;
      if (leaf instanceof Expr) {
        leaf = isBlock(leaf) ? leaf.value.args : leaf.valueOf();
      }
      return leaf;
    }
    function pop() {
      const leaf = get3();
      const set = [];
      let count = leaf.length;
      while (count--) {
        const token = leaf[count];
        if (isEnd(token))
          break;
        set.unshift(token);
      }
      leaf.length = ++count;
      return set;
    }
    function push2(...token) {
      let target;
      if (root instanceof Expr) {
        if (isBlock(root)) {
          target = root.value.args || root.value.body;
        } else {
          target = root.value;
        }
      } else {
        target = root;
      }
      target.push(...token);
    }
    while (!this.isDone()) {
      const prev = this.prev();
      const token = this.next();
      const curToken = this.peek();
      const nextToken = this.seek();
      const tokenInfo = token.tokenInfo || token;
      if (isSymbol(token) || isDirective(token)) {
        const fixedToken = this.collection(tokenInfo, curToken, nextToken);
        if (isSymbol(fixedToken) && fixedToken.isOptional)
          this.next();
        if (this.raw !== false && fixedToken.value && Object.keys(fixedToken.value).length === 1 && fixedToken.value.template instanceof Expr.TemplateStatement) {
          this.extension(fixedToken.value.template.value.body);
          if (isEOL(this.peek()))
            this.skip();
          continue;
        }
        push2(fixedToken);
        continue;
      }
      if (isRange(token)) {
        if (prev && [OPEN, BEGIN, COMMA].includes(prev.type) && [CLOSE, DONE, COMMA, BLOCK].includes(curToken.type)) {
          push2(Expr.from(LITERAL, "..", tokenInfo));
          continue;
        }
        push2(Expr.range(pop(), this.leaf(), tokenInfo));
        continue;
      }
      if (!this.template && this.templates[tokenInfo.value]) {
        this.template = this.templates[tokenInfo.value];
        if (curToken.type === OPEN && this.template.body) {
          push2(...Expr.mix(this.template, this.leaf(), []));
          this.template = null;
          continue;
        }
        if (this.template[curToken.value]) {
          this.partial = [tokenInfo];
          continue;
        }
        if (!this.template.args) {
          this.template = null;
        }
      }
      if (this.template && (this.template.args || this.template[tokenInfo.value])) {
        if (!this.template.args) {
          this.template = this.template[tokenInfo.value];
          this.partial.push(tokenInfo);
        }
        if (this.template.args) {
          const left = pop();
          const right = this.leaf();
          if (this.template.args.length === 1) {
            if (left.some(isLiteral) && right.length) {
              push2(Expr.group([...left, ...Expr.mix(this.template, left, [])], tokenInfo), ...right);
            } else if (!left.length) {
              push2(Expr.group([...Expr.mix(this.template, Expr.cut(right), []), ...right], tokenInfo));
            } else {
              push2(Expr.group([...left, ...Expr.mix(this.template, left, [])], tokenInfo));
            }
          } else {
            push2(Expr.group([...Expr.mix(this.template, left, right)], tokenInfo));
          }
          this.template = null;
        }
        continue;
      }
      if (this.template) {
        this.partial.forEach((x2) => push2(Expr.from(x2)));
        this.template = null;
      }
      if (isLiteral(token)) {
        const annotation = this.parseAnnotation(token, tokenInfo);
        if (annotation) {
          push2(annotation);
          continue;
        }
        if (isComma(curToken) && this.has(EQUAL)) {
          const parsed = this.destructure(tokenInfo);
          if (parsed) {
            this.offset = parsed.offset + 1;
            this.current = this.tokens[parsed.offset];
            const body = this.subTree(this.statement([OR, PIPE]));
            push2(Expr.map({
              destructure: Expr.stmt("@destructure", [
                Expr.from(LITERAL, parsed.bindings, tokenInfo),
                Expr.stmt(body, { ...tokenInfo, kind: "raw" })
              ], tokenInfo)
            }, tokenInfo));
            continue;
          }
        }
        if (isEqual(curToken)) {
          push2(Expr.callable(this.definition(token), tokenInfo));
          continue;
        }
        if (isBlock(curToken) && this.has(BLOCK)) {
          const args = Expr.args([Expr.from(token)].concat(this.statement([BLOCK])));
          const body = this.expression();
          args.forEach((x2) => {
            if (isRange(x2))
              x2.type = LITERAL;
            assert(Array.isArray(x2) ? x2[0] : x2, true, LITERAL);
          });
          push2(Expr.callable({
            type: BLOCK,
            value: { args, body }
          }, tokenInfo));
          continue;
        }
      }
      if (isRef(token) && token.isRaw && token.value && token.value.alt && token.value.href) {
        const spec = this.parseRefImportSpec(token.value.alt.trim());
        const importBody = spec.imports.map((name) => Expr.local(name, tokenInfo));
        const map2 = {
          import: Expr.stmt("@import", importBody, tokenInfo),
          from: Expr.stmt("@from", [Expr.value(token.value.href.trim(), tokenInfo)], tokenInfo)
        };
        if (spec.includeAllTemplates || spec.templates.length) {
          const templateBody = [];
          if (spec.includeAllTemplates) {
            templateBody.push(Expr.stmt([Expr.local("*", tokenInfo)], tokenInfo));
          }
          spec.templates.forEach((name) => {
            templateBody.push(Expr.stmt([Expr.local(name, tokenInfo)], tokenInfo));
          });
          map2.template = Expr.stmt("@template", templateBody, tokenInfo);
        }
        push2(Expr.map(map2, tokenInfo));
        continue;
      }
      if (!isLiteral(token) && isBlock(curToken) && !(isOpen(token) || isClose(token) || isComma(token))) {
        raise(`Expecting literal but found \`${token.value}\``, tokenInfo);
      }
      if (isLiteral(token) && isNot(curToken)) {
        push2(Expr.literal({ type: LITERAL, value: token.value, cached: true }, tokenInfo));
        this.next();
        continue;
      }
      if (isBlock(token)) {
        push2(Expr.callable(this.definition(token, true), tokenInfo));
        continue;
      }
      if (isOpen(prev) && isLogic(token) && !isClose(nextToken)) {
        this.depth++;
        push2(Expr.expression({
          type: token.type,
          value: this.subTree(this.statement([CLOSE]), true)
        }, tokenInfo));
        continue;
      }
      if (isList(token)) {
        if (isOpen(token) || isBegin(token)) {
          let leaf;
          if (token.value === "#{") {
            leaf = Expr.body([], tokenInfo);
          } else {
            leaf = isOpen(token) ? Expr.block({ args: [] }, tokenInfo, true) : Expr.array([], tokenInfo);
          }
          push2(leaf);
          stack.push(root);
          offsets.push(token);
          root = leaf;
        } else {
          const start = offsets[offsets.length - 1];
          if (!start) {
            raise(`Expecting \`${isClose(token) ? "(" : "["}\` before \`${token.value}\``, tokenInfo);
          }
          if (isOpen(start) && !isClose(token)) {
            raise(`Expecting \`)\` but found \`${token.value}\``, tokenInfo);
          }
          if (isBegin(start) && !isDone(token)) {
            raise(`Expecting \`]\` but found \`${token.value}\``, tokenInfo);
          }
          root = stack.pop();
          offsets.pop();
          if (isClose(token) && isBlock(curToken)) {
            const leaf = get3();
            const group = leaf[leaf.length - 1];
            if (isBlock(group) && group.hasArgs) {
              let args = group.getArgs();
              if (args.length === 1 && isRange(args[0]) && args[0].value && Array.isArray(args[0].value.begin) && (!args[0].value.end || !args[0].value.end.length)) {
                args = args[0].value.begin.concat([Expr.from(LITERAL, "..", args[0].tokenInfo || tokenInfo)]);
              }
              args = args.map((arg) => {
                if (isRange(arg)) {
                  arg = arg.clone();
                  arg.type = LITERAL;
                }
                return arg;
              });
              if (args.length && args.every((arg) => isLiteral(arg))) {
                this.next();
                const body = this.subTree(this.statement([OR, PIPE]));
                leaf[leaf.length - 1] = Expr.callable({
                  type: BLOCK,
                  value: {
                    args: Expr.args(args),
                    body
                  }
                }, args[0] && args[0].tokenInfo || group.tokenInfo || curToken.tokenInfo || tokenInfo);
                continue;
              }
            }
          }
        }
      } else if (isText(token) && token.value.kind === TABLE) {
        const rows = [token];
        while (!this.isDone()) {
          const nextRow = this.peek();
          if (isText(nextRow) && nextRow.value.kind === TABLE) {
            rows.push(this.next(true));
            continue;
          }
          if (this.isBlankTextToken(nextRow)) {
            this.next(true);
            continue;
          }
          break;
        }
        const table = this.tableFromTokens(rows, tokenInfo);
        if (table) {
          push2(table);
          if (!(isEnd(this.peek()) || isClose(this.peek()) || isDone(this.peek()))) {
            push2(Expr.from(EOL, ".", tokenInfo));
          }
        } else {
          rows.forEach((row) => {
            if (this.isTextConvertible(row)) {
              push2(this.convertTextToString(row, tokenInfo));
            }
          });
        }
      } else if (isText(token) && token.value.kind === HEADING) {
        const namespace = this.namespaceFromHeading(token, tokenInfo);
        if (namespace) {
          push2(namespace);
        } else if (this.hasInterpolation(token)) {
          push2(this.convertTextToString(token, tokenInfo));
        }
      } else if (isText(token) && this.hasInterpolation(token)) {
        push2(this.convertTextToString(token, tokenInfo));
      } else if (!(isText(token) || isCode(token) || isRef(token))) {
        if (isString(token) && tokenInfo.kind === "markup" && typeof token.value === "string") {
          try {
            push2(Expr.tag(parseTag(token.value), tokenInfo));
          } catch (_2) {
            push2(Expr.from(token));
          }
        } else if (isString(token) && Array.isArray(token.value)) {
          push2(Expr.literal({ type: STRING, value: this.subTree(token.value, true) }, tokenInfo));
        } else {
          push2(Expr.from(token));
        }
      }
      if (isNumber(token) && !isUnit(token) && this.raw !== true) {
        if (isNumber(curToken))
          push2(Expr.from(PLUS, "+"));
        if (isLiteral(curToken) && (isMath(nextToken) || isLiteral(nextToken) || isEnd(nextToken) || isComment(nextToken)) || isOpen(curToken) && !(isClose(nextToken) || isComment(nextToken)))
          push2(Expr.from(MUL, "*"));
      }
    }
    if (offsets.length) {
      const lastToken = offsets[offsets.length - 1];
      const { value, line, col } = this.current.tokenInfo || this.current;
      raise(`Expecting \`${isOpen(lastToken) ? ")" : "]"}\``, { line, col: col + value.length });
    }
    return tree;
  }
  isTextConvertible(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.some((chunk) => {
      if (typeof chunk === "string")
        return chunk.trim().length > 0;
      if (Array.isArray(chunk))
        return !!chunk[2];
      return true;
    });
  }
  hasInterpolation(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.some((chunk) => {
      if (Array.isArray(chunk))
        return !!chunk[2];
      if (typeof chunk === "object" && chunk !== null)
        return chunk.kind !== "raw";
      return false;
    });
  }
  isBlankTextToken(token) {
    if (!isText(token) || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.every((chunk) => typeof chunk === "string" && !chunk.trim().length);
  }
  textChunkToSource(chunk) {
    if (typeof chunk === "string")
      return chunk;
    if (Array.isArray(chunk))
      return `${chunk[1]}${chunk[2]}${chunk[1]}`;
    if (isRef(chunk))
      return chunk.value.text;
    if (chunk && typeof chunk.value === "string")
      return chunk.value;
    return "";
  }
  convertTextToString(token, tokenInfo) {
    const source = this.textPrefix(token.value) + token.value.buffer.map((chunk) => this.textChunkToSource(chunk)).join("");
    const [subToken] = new Scanner(quote(source), tokenInfo).scanTokens();
    if (isString(subToken) && Array.isArray(subToken.value)) {
      return Expr.literal({ type: STRING, value: this.subTree(subToken.value, true) }, tokenInfo);
    }
    return Expr.from(subToken);
  }
  textPrefix(value) {
    if (!value || !value.kind)
      return "";
    if (value.kind === BLOCKQUOTE)
      return "> ";
    if (value.kind === HEADING)
      return `${Array.from({ length: value.level || 1 }).join("#")}# `;
    if (value.kind === OL_ITEM)
      return `${value.style || value.level || 1}. `;
    if (value.kind === UL_ITEM)
      return `${value.style || "-"} `;
    return "";
  }
  textTokenToSource(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return "";
    return token.value.buffer.map((chunk) => this.textChunkToSource(chunk)).join("");
  }
  namespaceFromHeading(token, tokenInfo) {
    if (!isText(token) || token.value.kind !== HEADING)
      return null;
    const source = this.textTokenToSource(token).trim();
    const matches = source.match(/^([A-Za-z_][A-Za-z0-9_]*)::$/);
    if (!matches)
      return null;
    return Expr.map({
      namespace: Expr.stmt("@namespace", [
        Expr.value(matches[1], tokenInfo),
        Expr.value(token.value.level || 1, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  tableFromTokens(rows, tokenInfo) {
    if (!rows || rows.length < 2)
      return null;
    const parseRow = (token) => {
      const source = this.textTokenToSource(token).trim();
      if (!source.startsWith("|") || !source.endsWith("|"))
        return null;
      return source.slice(1, -1).split("|").map((cell) => cell.trim());
    };
    const header = parseRow(rows[0]);
    const separator = parseRow(rows[1]);
    if (!header || !separator || header.length !== separator.length)
      return null;
    if (!separator.every((cell) => /^:?-{3,}:?$/.test(cell)))
      return null;
    const dataRows = rows.slice(2).map(parseRow);
    if (dataRows.some((row) => !row || row.length !== header.length))
      return null;
    return Expr.map({
      table: Expr.stmt("@table", [
        Expr.value({ headers: header, rows: dataRows }, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  split() {
    const statements = [];
    let currentLine = 0;
    while (!this.isDone()) {
      const body = this.statement([EOL], true);
      const curToken = this.tokens[this.offset++];
      const lines = [];
      if (!isEOF(curToken)) {
        body.push(Expr.literal(curToken));
      }
      if (!currentLine) {
        lines.push(currentLine++);
      } else if (!isText(body[0]) || !hasBreaks(body[0])) {
        lines.push(currentLine - 1);
      }
      for (let i2 = 0, c2 = body.length;i2 < c2; i2++) {
        if (hasBreaks(body[i2])) {
          let count = 0;
          if (isText(body[i2])) {
            body[i2].value.buffer.forEach((x2) => {
              count += x2.split(`
`).length - 1;
            });
          } else {
            count = body[i2].value.split(`
`).length - 1;
          }
          while (count--)
            lines.push(currentLine++);
        }
      }
      statements.push({ body, lines });
      if (!this.tokens[this.offset])
        break;
    }
    return statements;
  }
  appendTo(set, name, target, tokenInfo, isOptional) {
    const prop = name.substr(1) + (isOptional ? "?" : "");
    if (!isStatement(name)) {
      if (hasStatements(target))
        raise(`Unexpected \`:${prop}\` on statement`, tokenInfo);
      target[prop] = Expr.body([], tokenInfo);
    } else {
      target[prop] = Expr.stmt(name, [], tokenInfo);
    }
    let hasConditional = false;
    set.forEach((sub) => {
      let body = this.subTree(sub, true);
      while (body.length === 1 && isBlock(body[0]) && body[0].tokenInfo.kind !== "brace" && !body[0].isCallable && !(body[0].getArg(0) && body[0].getArg(0).isExpression) && (["@import", "@export"].includes(name) || !(body[0].getArg(0) && body[0].getArg(0).isObject))) {
        body = body[0].getArgs();
      }
      const lastToken = sub[sub.length - 1];
      if (name === "@if" || name === "@while" && !hasConditional) {
        if (!isBlock(body[0])) {
          if (!isClose(lastToken)) {
            raise(`Missing block before \`${lastToken}\``, lastToken.tokenInfo);
          } else {
            raise(`Expecting statement after \`${lastToken}\``, lastToken.tokenInfo);
          }
        }
        if (name === "@while")
          hasConditional = true;
      }
      if (isBlock(body[0]) || body.length > 1) {
        if (body.some(isBlock)) {
          target[prop].push(Expr.body(body, tokenInfo));
        } else {
          target[prop].push(Expr.stmt(body, { ...tokenInfo, kind: "raw" }));
        }
      } else {
        target[prop].push(...body);
      }
    });
  }
  subTree(tokens, raw = false) {
    return new Parser(tokens.concat(new Token(EOF, "", null)), raw || this.raw, this).parse();
  }
  static getAST(source, mode = "parse", environment) {
    const scanner = new Scanner(source, null, environment);
    const tokens = scanner.scanTokens();
    if (mode === "raw" || mode === null)
      return tokens;
    const parserMode = mode === "parse" || typeof mode === "undefined" ? undefined : mode === "inline" ? false : mode === "split" || mode === true;
    const parser = new Parser(tokens, parserMode, environment);
    if (mode === "split")
      return parser.split();
    return parser.parse();
  }
  static sub(source, environment) {
    return Parser.getAST(`.
${source}`, "inline", environment).slice(1);
  }
}
var init_parser = __esm(() => {
  init_expr();
  init_scanner();
  init_tag();
  init_symbols();
  init_helpers();
});

// src/lib/tree/eval.js
function parseAnnotation(annStr) {
  if (!annStr || typeof annStr !== "string")
    return null;
  const trimmed = annStr.trim();
  if (!trimmed)
    return null;
  const arrowIndex = trimmed.indexOf("->");
  if (arrowIndex === -1) {
    return { params: trimmed.split(",").map((s) => s.trim()).filter(Boolean) };
  }
  const paramsStr = trimmed.slice(0, arrowIndex).trim();
  const returnsStr = trimmed.slice(arrowIndex + 2).trim();
  return {
    params: paramsStr ? paramsStr.split(",").map((s) => s.trim()).filter(Boolean) : [],
    returns: returnsStr || null
  };
}

class Eval {
  static getResultTagToken(token) {
    if (!isObject(token))
      return null;
    const value = token.valueOf();
    const tag = value && value.__tag;
    const payload = value && value.value;
    if (!tag || !payload || typeof tag.getBody !== "function" || typeof payload.getBody !== "function") {
      return null;
    }
    const [head2] = tag.getBody();
    if (!isSymbol(head2))
      return null;
    if (![":ok", ":err"].includes(head2.valueOf()))
      return null;
    return head2;
  }
  static async buildResultToken(kind, body, environment, parentTokenInfo) {
    const values = await Eval.do(body, environment, "Result", true, parentTokenInfo);
    return Expr.map({
      __tag: Expr.body([Expr.symbol(`:${kind}`, false, parentTokenInfo)], parentTokenInfo),
      value: Expr.body(values, parentTokenInfo)
    }, parentTokenInfo);
  }
  static normalizeBraceRecordArgs(args) {
    const normalized = [];
    let changed = false;
    for (let i2 = 0, c2 = args.length;i2 < c2; i2++) {
      const cur = args[i2];
      const next = args[i2 + 1];
      if (isString(cur) && isSymbol(next) && next.value === ":") {
        normalized.push(Expr.symbol(`:${cur.value}`, false, cur.tokenInfo || cur));
        changed = true;
        i2++;
        continue;
      }
      normalized.push(cur);
    }
    return changed ? normalized : args;
  }
  static tableCellToken(value, tokenInfo) {
    const input2 = typeof value === "string" ? value.trim() : value;
    if (input2 === "" || input2 === null || typeof input2 === "undefined") {
      return Expr.value(null, tokenInfo);
    }
    if (typeof input2 === "string" && /^-?\d+(?:\.\d+)?$/.test(input2)) {
      return Expr.value(parseFloat(input2), tokenInfo);
    }
    return Expr.value(input2, tokenInfo);
  }
  static splitMatchCases(tokens) {
    const output = [];
    let current2 = [];
    for (let i2 = 0, c2 = tokens.length;i2 < c2; i2++) {
      const token = tokens[i2];
      if (isComma(token)) {
        if (current2.length)
          output.push(current2);
        current2 = [];
        continue;
      }
      current2.push(token);
    }
    if (current2.length)
      output.push(current2);
    return output;
  }
  static templateNameFromEntry(entry) {
    const body = isBlock(entry) ? entry.getBody() : [entry];
    return body.filter((token) => token && !isComma(token) && !isBlock(token)).map((token) => token.valueOf()).join("").trim();
  }
  static templateImportSpec(templateStmt) {
    const spec = {
      hasTemplateImport: false,
      includeAll: false,
      names: []
    };
    if (!(templateStmt instanceof Expr.TemplateStatement)) {
      return spec;
    }
    spec.hasTemplateImport = true;
    templateStmt.getBody().forEach((entry) => {
      const name = Eval.templateNameFromEntry(entry);
      if (!name)
        return;
      if (name === "*" || name === "@template") {
        spec.includeAll = true;
        return;
      }
      if (!spec.names.includes(name)) {
        spec.names.push(name);
      }
    });
    return spec;
  }
  static resolveTemplateByName(templates, name) {
    if (!templates || !name)
      return null;
    let node = templates;
    for (let i2 = 0, c2 = name.length;i2 < c2; i2++) {
      node = node[name[i2]];
      if (!node)
        return null;
    }
    return node && node.args ? node : null;
  }
  static registerTemplateByName(templates, name, definition) {
    if (!templates || !name || !definition)
      return;
    let root = templates;
    for (let i2 = 0, c2 = name.length - 1;i2 < c2; i2++) {
      const key = name[i2];
      if (!root[key])
        root[key] = {};
      root = root[key];
    }
    root[name[name.length - 1]] = definition;
  }
  static async resolveMatchBody(input2, cases, environment, parentTokenInfo) {
    const target = Eval.getResultTagToken(input2) || input2;
    for (let i2 = 0, c2 = cases.length;i2 < c2; i2++) {
      const [head2, ...body] = cases[i2];
      if (!head2)
        continue;
      if (head2 instanceof Expr.ElseStatement) {
        return head2.getBody();
      }
      if (!body.length) {
        check(head2, "statement", "after");
      }
      if (isBlock(head2) && isLogic(head2.getArg(0))) {
        const [kind, ...others] = head2.getArgs();
        const newBody = Expr.expression({ type: kind.type, value: [target].concat(others) }, parentTokenInfo);
        const [result] = await Eval.do([newBody], environment, "Expr", true, parentTokenInfo);
        if (result && result.value === true) {
          return body;
        }
      } else {
        const result = await Eval.do([head2], environment, "Match", true, parentTokenInfo);
        for (let j = 0, k2 = result.length;j < k2; j++) {
          let subBody = result[j];
          if (isArray(subBody)) {
            if (isRange(subBody.value[0])) {
              subBody = await subBody.value[0].value.run(true);
            }
            if (subBody.valueOf().some((x2) => !hasDiff(x2, target))) {
              return body;
            }
          }
          if (!hasDiff(target, subBody)) {
            return body;
          }
        }
      }
    }
    return null;
  }
  constructor(tokens, environment, noInheritance) {
    if (!(environment instanceof Env)) {
      environment = null;
    }
    this.convert = Eval.wrap(this);
    this.derive = !!(noInheritance && environment);
    this.expr = tokens;
    this.env = !this.derive ? new Env(environment) : environment;
    this.rootEnv = this.env;
    this.namespaceStack = [];
    this.namespaceRoots = {};
    this.descriptor = "Root";
    this.result = [];
    this.offset = 0;
    this.key = null;
    this.ctx = null;
  }
  enterNamespace(name, level, tokenInfo) {
    while (this.namespaceStack.length >= level)
      this.namespaceStack.pop();
    const parent = this.namespaceStack[this.namespaceStack.length - 1] || null;
    let node;
    if (parent) {
      node = parent.children[name];
    } else {
      node = this.namespaceRoots[name];
    }
    if (!node) {
      const parentScope = parent ? parent.scope : this.rootEnv;
      const exports = {};
      const scope = new Env(parentScope);
      node = {
        name,
        level,
        scope,
        exports,
        children: {}
      };
      if (parent) {
        parent.children[name] = node;
        parent.exports[name] = Expr.map(exports, tokenInfo);
        parent.scope.def(name, Expr.map(exports, tokenInfo));
      } else {
        this.namespaceRoots[name] = node;
        this.rootEnv.def(name, Expr.map(exports, tokenInfo));
      }
    }
    this.namespaceStack.push(node);
    this.env = node.scope;
  }
  registerNamespaceExport(name) {
    if (!this.namespaceStack.length)
      return;
    if (!this.env.locals[name])
      return;
    const current2 = this.namespaceStack[this.namespaceStack.length - 1];
    current2.exports[name] = this.env.locals[name];
  }
  replace(v2, ctx) {
    if (!ctx) {
      this.result[Math.max(0, this.result.length - 1)] = v2;
    } else {
      this.ctx = v2;
    }
    return this;
  }
  discard(n = 1) {
    while (n--)
      this.result.pop();
    return this;
  }
  append(...a2) {
    this.result.push(...a2);
    return this;
  }
  move(n) {
    this.offset += n || 1;
    return this;
  }
  isLazy() {
    return LAZY_DESCRIPTORS.has(this.descriptor);
  }
  isDone() {
    return this.offset >= this.expr.length;
  }
  getOlder() {
    return this.result[this.result.length - 2];
  }
  getPrev() {
    return this.result[this.result.length - 1];
  }
  olderToken() {
    return this.expr[this.offset - 2];
  }
  newerToken() {
    return this.expr[this.offset + 2];
  }
  nextToken() {
    return this.expr[this.offset + 1];
  }
  oldToken() {
    return this.expr[this.offset - 1];
  }
  async execute(label, callback) {
    const tokens = this.result = [];
    this.descriptor = label;
    this.offset = 0;
    for (;!this.isDone(); this.move())
      try {
        this.ctx = this.expr[this.offset];
        if (isComment(this.ctx))
          continue;
        await callback();
      } catch (e2) {
        if (e2 instanceof TypeError) {
          raise(e2.message, this.ctx.tokenInfo, label);
        }
        e2.prevToken = this.oldToken() || this.olderToken();
        e2.stack = e2.message;
        throw e2;
      }
    this.descriptor = "Root";
    this.result = [];
    return tokens;
  }
  async evalInfixCalls() {
    const prev = this.getPrev();
    const older = this.getOlder();
    const next = this.nextToken();
    if (isResult(older) && prev.isCallable && isResult(this.ctx) && !isEnd(this.olderToken())) {
      if (isBlock(this.ctx)) {
        const [head2, ...tail2] = await Eval.do(this.ctx.getArgs(), this.env, "Fn", false, this.ctx.tokenInfo);
        const args = [older, Expr.from(COMMA), head2];
        this.discard(2).append(...await Eval.do([prev, Expr.block({ args }, prev.tokenInfo)], this.env, "Lit", false, this.ctx.tokenInfo)).append(...tail2);
      } else {
        const args = [older, Expr.from(COMMA), this.ctx];
        this.discard(2).append(...await Eval.do([prev, Expr.block({ args }, prev.tokenInfo)], this.env, "Lit", false, this.ctx.tokenInfo));
      }
      return true;
    }
    if (isPipe(this.ctx)) {
      if (!(isData(prev) || isRange(prev)))
        check(this.ctx, "value", "before");
      if (!next || !isInvokable(next))
        check(this.ctx, "callable", "after");
      assert(next, true, LITERAL, BLOCK);
      const nextToken = this.expr[this.offset + 2];
      let nextArgs = isBlock(nextToken) ? nextToken.getArgs() : null;
      let cutOffset = isBlock(nextToken) ? 2 : 1;
      let fixedBody = [];
      if (isDot(nextToken)) {
        const { body, offset } = Expr.chunk(this.expr, this.offset + 1, true);
        cutOffset = offset;
        nextArgs = isBlock(body[body.length - 1]) ? body.pop().getArgs() : null;
        fixedBody = body.concat(Expr.block({ args: [prev].concat(nextArgs ? Expr.from(COMMA) : [], nextArgs || []) }, next.tokenInfo));
      } else {
        fixedBody = [next, Expr.block({ args: [prev, Expr.from(COMMA)].concat(nextArgs || []) }, next.tokenInfo)];
      }
      this.discard().append(...await Eval.do(fixedBody, this.env, "Fn", false, this.ctx.tokenInfo));
      this.move(cutOffset);
      return true;
    }
    if (isBlock(prev) && isMod(this.ctx) && next.isObject) {
      this.discard().append(...await Eval.do(prev.getBody(), Env.create(next.valueOf()), "%", false, this.ctx.tokenInfo)).move();
      return true;
    }
  }
  async evalDotProps() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isDot(this.ctx)) {
      if (!prev || isNumber(prev) && !isUnit(prev) || isSymbol(prev)) {
        if (isNumber(prev) && isLiteral(next) && this.env.has(next.value)) {
          const call2 = this.env.get(next.value);
          if (call2.body[0].getArgs().length !== 1) {
            raise(`Unexpected call to \`${next.value}\``);
          }
          const scope = new Env(this.env);
          const body = call2.body[0].getBody();
          Env.merge([prev], call2.body[0].getArgs(), false, scope);
          this.discard().append(...await Eval.do(body, scope, "Call", false, this.ctx.tokenInfo)).move(2);
          return true;
        }
        check(prev || this.ctx, "map", prev ? null : "before");
      }
      if (!(isLiteral(next) || isBlock(next) && next.value.name)) {
        if (!next) {
          check(this.ctx, LITERAL, "after");
        } else {
          assert(next, true, LITERAL);
        }
      }
      const key = next.value.name || next.value;
      const map2 = isArray(prev) ? Expr.plain(prev.value) : prev.value;
      if (typeof map2[key] === "undefined") {
        let info;
        if (typeof map2 === "string") {
          info = `\`${serialize(map2)}\``;
        } else if (!Array.isArray(map2)) {
          info = `(${Object.keys(map2).map((k2) => `:${k2}`).join(" ")})`;
        } else {
          info = `[${map2.length > 1 ? `0..${map2.length - 1}` : map2.length}]`;
        }
        raise(`Missing property \`${next}\` in ${info}`, next.tokenInfo);
      }
      const newToken = this.newerToken();
      const entry = map2[key];
      if (isPlain2(entry) && Array.isArray(entry.body) && isBlock(newToken) && newToken.hasArgs) {
        const callable = entry.body[0] && entry.body[0].isCallable ? entry.body[0] : Expr.callable({
          type: BLOCK,
          value: {
            args: entry.args || [],
            body: entry.body,
            name: key
          }
        }, this.ctx.tokenInfo);
        this.discard().append(...await Eval.do([callable, newToken], this.env, "Fn", false, this.ctx.tokenInfo)).move(2);
        return true;
      }
      if (typeof map2[key] === "function" && isBlock(newToken) && newToken.hasArgs) {
        const fixedArgs = await Eval.do(newToken.getArgs(), this.env, "Args", false, this.ctx.tokenInfo);
        const result = await map2[key](...Expr.plain(fixedArgs, this.convert, `<${key}>`));
        this.discard();
        if (typeof result !== "undefined") {
          this.append(Expr.value(result));
        }
        this.move(2);
        return true;
      }
      if (!isBlock(next)) {
        if (isPlain2(entry) && Array.isArray(entry.body)) {
          this.discard().append(...await Eval.do(entry.body, this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else if (map2[key] instanceof Expr) {
          this.discard().append(...await Eval.do(map2[key].getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else {
          this.replace(Expr.value(map2[key])).move();
        }
      } else if (map2[key] instanceof Expr) {
        map2[key].value.body = await Eval.do(next.getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo);
        this.discard().move();
      } else {
        map2[key] = Expr.plain(next.head(), this.convert, `<${key}>`);
        this.discard().move();
      }
      return true;
    }
  }
  async evalRangeSets() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isRange(prev) && isSlice(this.ctx)) {
      if (prev.value instanceof Range) {
        prev.value.take(this.ctx.value);
        if (!this.isLazy()) {
          this.discard().append(...await prev.value.run(true));
        }
      } else {
        this.discard().append(...await Range.unwrap(prev.value, (token) => [token], this.ctx));
      }
      return true;
    }
    if (isRange(this.ctx)) {
      if (this.ctx.value instanceof Range) {
        this.append(this.ctx);
        return true;
      }
      const options = await Eval.do(this.ctx.value, this.env, "Set", false, this.ctx.tokenInfo);
      if (isArray(this.ctx)) {
        this.append(Expr.array(options.reduce((p2, c2) => {
          if (c2.isStatement)
            p2.push(...c2.getBody());
          else
            p2.push(c2);
          return p2;
        }, []), this.ctx.tokenInfo));
      } else {
        assert(options.begin[0], true, NUMBER, STRING);
        const hasEnd = options.end && options.end.length > 0;
        if (hasEnd) {
          assert(options.end[0], true, NUMBER, STRING);
        }
        const fixedRange = Range.from(options.begin[0], hasEnd ? options.end[0] : undefined);
        const shouldRun = !fixedRange.infinite && !this.isLazy() && !isSlice(next);
        const subTree = await fixedRange.run(shouldRun);
        this.replace(Expr.from(RANGE, subTree, this.ctx.tokenInfo));
      }
      return true;
    }
  }
  async evalLiterals() {
    const target = this.env.get(this.ctx.value);
    const next = this.nextToken();
    if (!isLiteral(target.body[0]) && !target.body[0].isCallable && !target.body[0].hasArgs && isBlock(next) && !next.hasBody && !target.args) {
      if (target.body[0].type !== FFI)
        raise(`Unexpected call to \`${this.ctx}\``);
    }
    if (isBlock(next) && target.args && target.args.some((x2) => isLiteral(x2, ".."))) {
      const newToken = Expr.callable({ type: BLOCK, value: target }, this.ctx.tokenInfo).clone();
      Expr.sub(newToken.value.body, { "..": [Expr.body(next.getArgs(), this.ctx.tokenInfo)] });
      this.discard().append(...await Eval.do(newToken.getBody(), this.env, "Lit", false, this.ctx.tokenInfo)).move();
      return true;
    }
    if (target.ctx && isMod(next) && isString(target.body[0])) {
      this.append(...target.body);
      return true;
    }
    if (this.ctx.cached) {
      target.body[0].cached = {};
    }
    this.append(...await Eval.do(target.body, this.env, "Lit", false, this.ctx.tokenInfo));
    return true;
  }
  async evalTagExpr(source) {
    if (!source)
      return [];
    const body = Parser.sub(source, this.env);
    return Eval.do(body, this.env, "TagExpr", false, this.ctx.tokenInfo);
  }
  async evalTags() {
    if (!this.ctx || !this.ctx.isTag)
      return false;
    const normalizeChild = (token) => {
      if (!token)
        return null;
      if (token.isTag)
        return token.value;
      return Expr.plain(token, this.convert, "<TagChild>");
    };
    const evaluateNode = async (node) => {
      const attrs = {};
      const children = [];
      for (const spread of node.spreads || []) {
        const [spreadValue] = await this.evalTagExpr(spread.expr);
        if (typeof spreadValue === "undefined" || spreadValue === null)
          continue;
        const plain = Expr.plain(spreadValue, this.convert, "<TagSpread>");
        if (!plain || Array.isArray(plain) || typeof plain !== "object") {
          raise("Tag spread expects an object value", this.ctx.tokenInfo);
        }
        Object.assign(attrs, plain);
      }
      for (const key of Object.keys(node.attrs || {})) {
        const value = node.attrs[key];
        if (value && typeof value === "object" && typeof value.expr === "string") {
          const [exprValue] = await this.evalTagExpr(value.expr);
          attrs[key] = typeof exprValue === "undefined" ? "" : Expr.plain(exprValue, this.convert, "<TagAttr>");
        } else {
          attrs[key] = value;
        }
      }
      for (const child of node.children || []) {
        if (typeof child === "string") {
          children.push(child);
          continue;
        }
        if (child && typeof child.expr === "string") {
          const rawTextContainer = /^(style|script)$/i.test(String(node.name || ""));
          if (rawTextContainer) {
            children.push(`{${child.expr}}`);
            continue;
          }
          const parts = await this.evalTagExpr(child.expr);
          if (parts.length === 1) {
            const fixed2 = normalizeChild(parts[0]);
            if (fixed2 !== null && typeof fixed2 !== "undefined") {
              const isTagNode = fixed2 && typeof fixed2 === "object" && typeof fixed2.name === "string";
              children.push(isTagNode ? fixed2 : { expr: child.expr, _resolved: fixed2 });
            }
          } else {
            parts.forEach((part) => {
              const fixed2 = normalizeChild(part);
              if (fixed2 !== null && typeof fixed2 !== "undefined")
                children.push(fixed2);
            });
          }
          continue;
        }
        const [resolved] = await Eval.do([Expr.tag(child, this.ctx.tokenInfo)], this.env, "TagNode", false, this.ctx.tokenInfo);
        const fixed = normalizeChild(resolved);
        if (fixed !== null && typeof fixed !== "undefined")
          children.push(fixed);
      }
      const resolvedNode = {
        name: node.name,
        attrs,
        children,
        selfClosing: node.selfClosing && !children.length
      };
      const component = /^[A-Z]/.test(resolvedNode.name) && this.env.has(resolvedNode.name, true);
      if (!component) {
        return [Expr.tag(resolvedNode, this.ctx.tokenInfo)];
      }
      const props = {
        ...resolvedNode.attrs,
        children: resolvedNode.children
      };
      return Eval.do([
        Expr.local(resolvedNode.name, this.ctx.tokenInfo),
        Expr.block({ args: [Expr.value(props, this.ctx.tokenInfo)] }, this.ctx.tokenInfo)
      ], this.env, "TagComp", false, this.ctx.tokenInfo);
    };
    this.append(...await evaluateNode(this.ctx.value));
    return true;
  }
  async evalLogic() {
    const { type, value } = this.ctx;
    let result = await Eval.do(value, this.env, "Expr", true, this.ctx.tokenInfo);
    if (isSome(this.ctx) || isEvery(this.ctx)) {
      const values = await Promise.all(result.map((token) => {
        return Eval.do([token], this.env, "Expr", false, this.ctx.tokenInfo);
      }));
      this.append(Expr.value(values[isSome(this.ctx) ? "some" : "every"]((x2) => x2[0].valueOf())));
      return true;
    }
    if (result.length > 2) {
      for (let i2 = 1, c2 = value.length;i2 < c2; i2++) {
        let left;
        let right;
        try {
          left = await Eval.do(value.slice(0, i2), this.env, "LogicArg", true, this.ctx.tokenInfo);
          right = await Eval.do(value.slice(i2), this.env, "LogicArg", true, this.ctx.tokenInfo);
        } catch (_2) {
          continue;
        }
        if (left.length === 1 && right.length === 1) {
          result = [left[0], right[0]];
          break;
        }
      }
    }
    if (result.length > 2)
      raise(`Expecting exactly 2 arguments, given ${result.length}`);
    this.append(Eval.logic(type, result[0], result[1], this.ctx.tokenInfo));
    return true;
  }
  async evalBlocks() {
    const prev = this.getPrev();
    if (prev && this.descriptor !== "Expr" && !(isMath(prev) || isEnd(prev)) && !isEnd(this.oldToken())) {
      if (!(prev.isFFI || prev.isCallable || prev.isFunction || prev.isTag || isMixed(prev, "function"))) {
        check(prev, "callable");
      }
      if (prev.isFFI && prev.isRaw) {
        const callback = (...input2) => Eval.do(input2, this.env, "FFI", false, this.ctx.tokenInfo);
        const result = await prev.value.target(this.ctx.getArgs(), callback);
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        return true;
      }
      const args2 = await Eval.do(this.ctx.getArgs(), this.env, "Call", false, this.ctx.tokenInfo);
      const fixedArgs = args2.filter((x2) => !isLiteral(x2, "_"));
      if (prev.isTag) {
        const plainArgs = Expr.plain(fixedArgs, this.convert, "<Tag>");
        this.replace(Expr.tag(composeTag(prev.value, plainArgs), this.ctx.tokenInfo));
        return true;
      }
      if (prev.isFFI) {
        let result;
        const label = prev.value.label || "";
        const supportsCallableArgs = ["map", "filter"].includes(label);
        const preparedArgs = fixedArgs.map((arg) => {
          if (supportsCallableArgs && arg && arg.isCallable) {
            return (...input2) => {
              return this.convert(arg, Expr.value(input2).valueOf(), `<${prev.value.label || "FFI"}>`);
            };
          }
          return arg;
        });
        if (!(this.ctx.getArg(0) && this.ctx.getArg(0).isBlock)) {
          result = await prev.value.target(...preparedArgs);
        } else {
          result = await prev.value.target(preparedArgs);
        }
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        return true;
      }
      if (isMixed(prev, "function")) {
        const result = await prev.valueOf()(...Expr.plain(fixedArgs, this.convert, `<${prev.value.name || "Function"}>`));
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr.value(result));
        return true;
      }
      if (prev.value.env instanceof Env) {
        const { env, label, target: target2 } = prev.valueOf();
        if (this.descriptor === "Lit") {
          this.replace(Expr.fn({
            env,
            label,
            target: target2,
            args: fixedArgs
          }, this.ctx.tokenInfo));
        } else {
          const scope2 = new Env(env);
          const { body: body2 } = env.get(target2);
          const nextArgs = (prev.hasArgs ? prev.getArgs() : []).concat(fixedArgs);
          Env.merge(Expr.args(nextArgs), body2[0].getArgs(), false, scope2);
          this.discard().append(...await Eval.do(body2[0].getBody(), scope2, label, false, this.ctx.tokenInfo));
        }
        return true;
      }
      if (prev.isFunction) {
        const { label, target: target2 } = prev.valueOf();
        const nextArgs = (prev.getArgs() || []).concat(fixedArgs);
        const result = await target2(...Expr.plain(nextArgs, this.convert, label));
        if (typeof result !== "undefined") {
          this.replace(Expr.value(result, this.ctx.tokenInfo));
        } else {
          this.discard();
        }
        return true;
      }
      const { target, scope } = Env.sub(fixedArgs, prev.value, this.env);
      if (fixedArgs.length > prev.length && !prev.getArgs().some((x2) => isLiteral(x2, ".."))) {
        argv(args2, prev, prev.length);
      }
      if (prev.hasInput) {
        const nextArgs = prev.getArgs().map((sub, j) => {
          if (isLiteral(sub, "_")) {
            if (!args2.length)
              argv(null, prev, j);
            return args2.shift();
          }
          return sub;
        });
        const offset = nextArgs.length + args2.length;
        if (offset < prev.value.length)
          argv(null, prev, offset);
        if (offset > prev.value.length)
          argv(args2, prev, offset - 1);
        if (nextArgs.length < prev.value.length) {
          nextArgs.push(Expr.from(COMMA), ...fixedArgs);
        }
        this.discard().append(...await Eval.do([
          Expr.callable({
            type: BLOCK,
            value: {
              args: prev.getInput(),
              body: this.env.get(prev.getName()).body
            }
          }, prev.tokenInfo),
          Expr.block({ args: nextArgs }, this.ctx.tokenInfo)
        ], this.env, "Fn", false, prev.tokenInfo));
        return true;
      }
      if (prev.source && fixedArgs.length < prev.length) {
        if (target.args.length < prev.length) {
          target.args = prev.getArgs().concat(target.args);
        }
        if (this.descriptor !== "Lit" && prev.isCallable && prev.length && !fixedArgs.length) {
          raise(`Missing arguments to call \`${prev.getName()}\``);
        }
        this.replace(Expr.callable({
          type: BLOCK,
          value: {
            args: args2,
            input: target.args,
            source: prev.source,
            length: prev.length
          }
        }, prev.tokenInfo));
      } else {
        let clean = false;
        let ctx = scope;
        let key;
        if (prev.cached) {
          key = `#${fixedArgs.toString()}`;
          if (prev.cached[key]) {
            this.discard().append(...prev.cached[key]);
            return true;
          }
        }
        if (target.body.some((x2) => isBlock(x2) && x2.isRaw)) {
          if (this.descriptor === "Eval" || this.descriptor === "Fn") {
            this.env = new Env(this.env);
          }
          ctx = this.env;
          clean = target.body.length === 1 && isBlock(target.body[0]);
        }
        if (target.args && target.args.length === fixedArgs.length) {
          Env.merge(fixedArgs, target.args, clean, ctx);
        }
        const fnName = prev.getName();
        if (fnName) {
          const ann = this.env.getAnnotation(fnName);
          if (ann && typeof ann === "string") {
            const annotation = parseAnnotation(ann);
            if (annotation?.params?.length) {
              for (let i2 = 0;i2 < annotation.params.length && i2 < fixedArgs.length; i2++) {
                const expected = annotation.params[i2];
                const actual = fixedArgs[i2];
                if (!matchesType(actual, expected, this.env)) {
                  const got = inferRuntimeType(actual);
                  raise(`\`${fnName}\`: expected ${expected}, got ${got} (arg ${i2 + 1})`, this.ctx.tokenInfo);
                }
              }
            }
          }
        }
        const result = await Eval.do(target.body, ctx, `:${fnName || ""}`, true, this.ctx.tokenInfo);
        if (key) {
          if (this.descriptor !== "Eval") {
            prev.cached[key] = result;
          } else {
            delete prev.cached;
          }
        }
        this.discard().append(...result);
      }
      return true;
    }
    const { name, args, body } = this.ctx.valueOf();
    if (this.ctx.isCallable) {
      if (name && body) {
        const call2 = !args && this.derive && DERIVE_METHODS.includes(this.descriptor) ? await Eval.do(body, this.env, "Fn", true, this.ctx.tokenInfo) : body;
        if (call2[0].isCallable && call2[0].hasArgs) {
          call2[0].length = Expr.arity(call2[0]);
          call2[0].source = name;
        }
        this.env.defn(name, { args, body: call2 }, this.ctx.tokenInfo);
        this.registerNamespaceExport(name);
      } else {
        this.append(this.ctx);
      }
    } else {
      let fixedBody = args || body;
      if (args && this.ctx.tokenInfo && this.ctx.tokenInfo.value === "{") {
        fixedBody = Eval.normalizeBraceRecordArgs(args);
      }
      const derived = this.derive || fixedBody[0] && fixedBody[0].isObject;
      this.append(...await Eval.do(fixedBody, this.env, derived ? this.descriptor : "...", derived, this.ctx.tokenInfo));
    }
    return true;
  }
  async evalUnary() {
    const prev = this.getPrev();
    const older = this.getOlder();
    if (prev && prev.type === MINUS && !isNumber(this.getOlder())) {
      if (!isNumber(this.ctx)) {
        assert(this.ctx, false, NUMBER);
      }
      this.replace(Expr.value(this.ctx * -1, this.ctx.tokenInfo));
      return true;
    }
    if ((!prev || isEnd(prev)) && isOR(this.ctx)) {
      return true;
    }
    if (isNot(prev) && isResult(this.ctx)) {
      if (isLiteral(this.ctx)) {
        [this.ctx] = await Eval.do([this.ctx], this.env, "Expr", true, this.ctx.tokenInfo);
      }
      this.replace(Expr.value(!this.ctx.valueOf(), this.ctx.tokenInfo));
      return true;
    }
    if (isSome(this.ctx) && isResult(prev)) {
      const tag = Eval.getResultTagToken(prev);
      if (tag) {
        const payloadBody = prev.valueOf().value.getBody();
        if (tag.valueOf() === ":ok") {
          if (payloadBody.length === 1) {
            this.replace(payloadBody[0]);
          } else {
            this.replace(Expr.array(payloadBody));
          }
          this.move(Expr.chunk(this.expr, this.offset + 1).offset);
        } else {
          this.discard();
        }
        return true;
      }
    }
    if (isResult(prev) && isOR(this.ctx) && isObject(prev) && !isSome(older)) {
      const { body, offset } = Expr.chunk(this.expr, this.offset + 1);
      if (body.length) {
        const merged = await Eval.do(body, this.env, "Or", false, this.ctx.tokenInfo);
        if (merged.length === 1 && isObject(merged[0])) {
          this.discard().append(Expr.map({
            ...prev.valueOf(),
            ...merged[0].valueOf()
          }, this.ctx.tokenInfo));
          this.move(offset);
          return true;
        }
      }
    }
    if (isResult(prev) && (isOR(this.ctx) || isSome(this.ctx))) {
      if (isSome(this.ctx) ? !prev.valueOf() : prev.valueOf()) {
        this.move(Expr.chunk(this.expr, this.offset + 1).offset);
      } else {
        this.discard();
      }
      return true;
    }
  }
  async evalSymbols() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isSymbol(this.ctx) && this.ctx.value === ":") {
      if (isBlock(next) || isString(next) && typeof next.value !== "string") {
        let [head2] = await Eval.do(next.getArgs() || next.valueOf(), this.env, "Sym", false, this.ctx.tokenInfo);
        if (!isScalar(head2)) {
          assert(head2, true, STRING, NUMBER, SYMBOL);
        }
        let token;
        if (head2.valueOf() === "nil")
          token = Expr.value(null, this.ctx.tokenInfo);
        if (head2.valueOf() === "on")
          token = Expr.value(true, this.ctx.tokenInfo);
        if (head2.valueOf() === "off")
          token = Expr.value(false, this.ctx.tokenInfo);
        const value = !isSymbol(head2) ? `:${head2.valueOf()}` : head2.valueOf();
        this.replace(token || Expr.symbol(value, false, this.ctx.tokenInfo), true).move();
      }
    }
    if (isArray(prev) && isData(prev.value[0]) && isSymbol(this.ctx)) {
      const value = prev.valueOf();
      const key = this.ctx.value.substr(1);
      this.discard();
      value.forEach((body) => {
        let result;
        if (isScalar(body) || isObject(body) || isArray(body)) {
          result = body.valueOf()[key];
        }
        if (typeof result !== "undefined") {
          this.append(!(result instanceof Expr) ? Expr.value(result) : result);
        }
      });
      return true;
    }
    if (this.key || isSymbol(prev) && isResult(this.ctx)) {
      if (isObject(prev) && isComma(this.ctx)) {
        if (isObject(prev) && isObject(next)) {
          Object.assign(prev.value, next.value);
          this.move();
        } else if (isSymbol(next))
          this.key = next.value.substr(1);
        return true;
      }
      if (!this.key) {
        const key = prev.value.substr(1);
        this.replace(Expr.map({
          [key]: Expr.body([this.ctx], this.ctx.tokenInfo)
        }, prev.tokenInfo));
        if (!(isEOL(next) || isMath(next))) {
          this.key = key;
        }
      } else if (isSymbol(this.ctx) && isResult(next)) {
        this.key = this.ctx.value.substr(1);
        prev.valueOf()[this.key] = Expr.body([], this.ctx.tokenInfo);
      } else {
        if (isDot(this.ctx) || isPipe(this.ctx) || !isComma(this.ctx) && isEnd(this.ctx)) {
          this.key = null;
          return;
        }
        const target = prev.valueOf();
        if (!target[this.key]) {
          this.key = null;
          return;
        }
        target[this.key].push(this.ctx);
      }
      return true;
    }
    if (isNumber(prev) && this.ctx.type === MUL && (isLiteral(next) || isSymbol(next))) {
      let fixedToken = next;
      if (isLiteral(next) && this.env.has(next.value)) {
        const resolved = this.env.get(next.value);
        if (resolved && resolved.ctx) {
          fixedToken = resolved.ctx;
        }
      }
      if (fixedToken && fixedToken.type === SYMBOL) {
        const num = prev.valueOf();
        const kind = fixedToken.value;
        const retval = Env.register(num, kind.substr(1));
        if (isPlain2(retval)) {
          this.replace(Expr.unit(retval, this.ctx.tokenInfo)).move();
          return true;
        }
      }
    }
  }
  async evalStrings() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isString(this.ctx) && typeof this.ctx.value !== "string" && !isMod(next)) {
      const result = await Eval.do(this.ctx.valueOf(), this.env, "Str", false, this.ctx.tokenInfo);
      this.replace(Expr.value(result.map((sub) => sub.value).join(""), this.ctx.tokenInfo), true);
      return;
    }
    if (isString(prev) && isMod(this.ctx)) {
      const { body, offset } = Expr.chunk(this.expr, this.offset + 1);
      const subTree = await Eval.do(body, this.env, "Str", false, this.ctx.tokenInfo);
      if (typeof prev.value !== "string") {
        if (subTree.length > 1 || !isObject(subTree[0])) {
          check(body[0], "map");
        }
        this.discard().append(...await Eval.do(prev.valueOf(), Env.create(subTree[0].valueOf(), this.env), "Str", false, this.ctx.tokenInfo));
      } else {
        let isHead = subTree.length === 1;
        if (isHead) {
          if (isObject(subTree[0]) || !(isBlock(body[0]) || isRange(body[0]))) {
            check(body[0], "block or list");
          }
          isHead = isBlock(subTree[0]) || isRange(subTree[0]);
        }
        let inc = 0;
        const source = isHead ? subTree[0].getArgs() || subTree[0].valueOf() : subTree;
        const values = await Eval.do(source, this.env, "Str", false, next.tokenInfo);
        const newValue = prev.value.replace(/{(\d+)?}/g, (_2, idx) => {
          const fixedValue = typeof idx !== "undefined" ? values[idx] : values[inc++];
          if (typeof fixedValue === "undefined") {
            raise(`Missing argument #${idx || inc}`, next.tokenInfo);
          }
          if (fixedValue.valueOf() === null)
            return ":nil";
          if (fixedValue.valueOf() === true)
            return ":on";
          if (fixedValue.valueOf() === false)
            return ":off";
          return fixedValue.valueOf();
        });
        this.replace(Expr.value(newValue));
      }
      this.move(offset);
      return true;
    }
  }
  async walk(descriptor) {
    if (Eval.detail && Eval.detail.enabled) {
      Eval.detail.calls.push([descriptor, Eval.detail.depth, this.expr]);
    }
    return this.execute(descriptor, async () => {
      if (!(this.ctx instanceof Expr)) {
        raise(`Given \`${JSON.stringify(this.ctx)}\` as token!`);
      }
      if (!this.ctx.tokenInfo || (typeof this.ctx.tokenInfo.line === "undefined" || typeof this.ctx.tokenInfo.col === "undefined")) {
        if (isResult(this.ctx))
          raise(`Given \`${JSON.stringify(this.ctx.tokenInfo)}\` as tokenInfo!`);
      }
      if (this.ctx.isObject) {
        const prev = this.getPrev();
        if (prev && !(isEnd(prev) || isResult(prev)))
          check(prev);
        this.append(...await Eval.map(this.ctx, descriptor, this.env, this.ctx.tokenInfo, this));
        return;
      }
      if (await this.evalUnary() || await this.evalTags() || await this.evalSymbols() || await this.evalStrings() || await this.evalDotProps() || await this.evalRangeSets() || await this.evalInfixCalls() || isBlock(this.ctx) && await this.evalBlocks() || this.ctx.isExpression && await this.evalLogic() || isLiteral(this.ctx) && typeof this.ctx.value === "string" && this.ctx.value !== "_" && await this.evalLiterals())
        return;
      if (isString(this.ctx) && typeof this.ctx.value === "string") {
        this.ctx.value = this.ctx.value.replace(/\\r/g, "\r");
        this.ctx.value = this.ctx.value.replace(/\\n/g, `
`);
        this.ctx.value = this.ctx.value.replace(/\\t/g, "\t");
      }
      this.append(this.ctx);
    });
  }
  async run(descriptor, tokenInfo) {
    let tokens = await this.walk(descriptor);
    tokens = Eval.math(OPS_MUL_DIV, tokens, tokenInfo);
    tokens = Eval.math(OPS_PLUS_MINUS_MOD, tokens, tokenInfo);
    tokens = Eval.walk(OPS_LOGIC, tokens, (left, op, right) => Eval.logic(op.type, left, right, tokenInfo));
    return tokens.filter((x2) => ![EOL, COMMA].includes(x2.type));
  }
  static info(defaults) {
    Eval.detail = defaults;
    return defaults;
  }
  static wrap(self) {
    return async (fn, args, label) => {
      const safeArgs = Array.isArray(args) ? args : [];
      const fnArgs = typeof fn?.getArgs === "function" && Array.isArray(fn.getArgs()) ? fn.getArgs() : [];
      if (typeof fn.length === "number" && fn.length > safeArgs.length) {
        raise(`Missing arguments to call \`${fn.getName()}\``, self.ctx.tokenInfo);
      }
      try {
        const scope = new Env(self.env);
        Env.merge(safeArgs, fnArgs, false, scope);
        const [value] = await Eval.do(fn.getBody(), scope, label, false, self.ctx.tokenInfo);
        return value ? Expr.plain(value, self.convert, `<${fn.name || "Function"}>`) : undefined;
      } catch (e2) {
        raise(e2.message.replace(/\sat line.*$/, ""), self.ctx.tokenInfo);
      }
    };
  }
  static math(ops, expr, tokenInfo) {
    return Eval.walk(ops, expr, (left, op, right) => {
      let result;
      if (op.type === PLUS) {
        assert(left, true, STRING, NUMBER, SYMBOL);
        assert(right, true, STRING, NUMBER, SYMBOL);
      } else {
        assert(left, true, NUMBER);
        assert(right, true, NUMBER);
      }
      if (isUnit(left) || isUnit(right)) {
        let method;
        switch (op.type) {
          case PLUS:
            method = "add";
            break;
          case MINUS:
            method = "sub";
            break;
          case DIV:
            method = "div";
            break;
          case MUL:
            method = "mul";
            break;
          case MOD:
            method = "mod";
            break;
        }
        if (isUnit(left)) {
          try {
            const kind = (isUnit(right) ? right : left).value.kind;
            result = left.value[method](right.value, kind);
            if (typeof result !== "undefined") {
              return Expr.unit(result, tokenInfo);
            }
          } catch (e2) {
            raise(`Failed to call \`${method}\` (${e2.message})`);
          }
        }
        right = right.valueOf();
      }
      switch (op.type) {
        case PLUS:
          if (isSymbol(left))
            left = left.valueOf().substr(1);
          if (isSymbol(right))
            right = right.valueOf().substr(1);
          result = left + right;
          break;
        case MINUS:
          result = left - right;
          break;
        case DIV:
          result = left / right;
          break;
        case MUL:
          result = left * right;
          break;
        case MOD:
          result = left % right;
          break;
      }
      return Expr.value(result, tokenInfo);
    });
  }
  static logic(op, left, right, tokenInfo) {
    let result;
    switch (op) {
      case NOT_EQ:
        result = left.type !== right.type || hasDiff(left, right);
        break;
      case EXACT_EQ:
        result = left.type === right.type && !hasDiff(left, right);
        break;
      case EQUAL:
        result = !hasDiff(left, right, true);
        break;
      case LIKE:
        result = hasIn(left, right);
        break;
      case NOT:
        result = hasDiff(left, right, true);
        break;
      case LESS:
        result = left < right;
        break;
      case LESS_EQ:
        result = left <= right;
        break;
      case GREATER:
        result = left > right;
        break;
      case GREATER_EQ:
        result = left >= right;
        break;
    }
    return Expr.value(result, tokenInfo);
  }
  static walk(ops, expr, callback) {
    if (expr.length < 3)
      return expr;
    const output = [expr[0]];
    for (let i2 = 1, c2 = expr.length;i2 < c2; i2++) {
      const op = expr[i2];
      if (op && ops.has(op.type) && i2 + 1 < c2) {
        const left = output.pop();
        const right = expr[++i2];
        output.push(callback(left, op, right));
      } else {
        output.push(op);
      }
    }
    return output;
  }
  static async loop(body, value, environment, parentTokenInfo) {
    const source = await Eval.do(value, environment, "Loop", false, parentTokenInfo);
    let scope = environment;
    let target = false;
    if (isLiteral(body[0])) {
      target = isBlock(body[1]) || isLiteral(body[1]) ? body.shift() : body[0];
      if (isString(body[1]) && Array.isArray(body[1].value)) {
        body = body[1].valueOf();
      }
    }
    if (isBlock(body[0]) && body[0].isCallable) {
      target = body[0].getArg(0);
      body = body[0].getBody();
    }
    if (target) {
      if (!(environment.has(target.value, true) && body.length === 1)) {
        scope = new Env(environment);
      } else {
        target = null;
      }
    }
    return Range.unwrap(source, (token) => {
      if (target) {
        scope.def(target.value, token);
      }
      if (target === null) {
        return Eval.run(body.concat(Expr.block({ args: [token] }, token.tokenInfo)), scope, "It", true, parentTokenInfo);
      }
      return body.length ? Eval.run(body, scope, "It", true, parentTokenInfo) : [token];
    });
  }
  static async map(token, descriptor, environment, parentTokenInfo, state) {
    const { value } = token;
    const subTree = [];
    const convert2 = state && typeof state.convert === "function" ? state.convert : null;
    const isDirectiveStmt = (stmt) => !!(stmt && typeof stmt.getBody === "function");
    const normalizeDirectiveArgs = (stmt) => {
      if (!isDirectiveStmt(stmt))
        return [];
      const body = stmt.getBody();
      const flat = body.length === 1 && body[0] && body[0].type === BLOCK && body[0].hasBody ? body[0].getBody() : body;
      return flat.filter((part) => part && part.type !== COMMA);
    };
    const toPlain = (valueToken) => Expr.plain(valueToken, convert2, "<Directive>");
    const resolveRuntimeFn = (name) => {
      if (!environment.has(name, true)) {
        raise(`Undeclared local \`${name}\``, parentTokenInfo);
      }
      const entry = environment.get(name);
      const [head2] = entry && entry.body || [];
      const fn = head2 ? toPlain(head2) : null;
      if (typeof fn !== "function") {
        raise(`\`${name}\` is not callable`, parentTokenInfo);
      }
      return fn;
    };
    const isSignalValue = (candidate) => candidate && typeof candidate.get === "function" && typeof candidate.set === "function";
    const hasShadow = isDirectiveStmt(value.shadow);
    const htmlTextFromValue = (entry) => {
      if (entry === null || typeof entry === "undefined")
        return "";
      if (Array.isArray(entry)) {
        return entry.map(htmlTextFromValue).join("");
      }
      if (entry instanceof Expr) {
        if (entry.isTag)
          return renderTag(entry.valueOf());
        return htmlTextFromValue(Expr.plain(entry, convert2, "<HTML>"));
      }
      if (typeof entry === "object" && typeof entry.name === "string" && Array.isArray(entry.children)) {
        return renderTag(entry);
      }
      return String(entry);
    };
    let signalMap = new Map;
    const tagToVdom = (node) => {
      const attrs = {};
      for (const [key, val] of Object.entries(node.attrs || {})) {
        attrs[key] = val && typeof val.expr === "string" ? String(val.expr) : val;
      }
      const children = (node.children || []).map((child) => {
        if (typeof child === "string")
          return child;
        if (child && typeof child.expr === "string") {
          return signalMap.get(child.expr) ?? child._signal ?? child._resolved ?? "";
        }
        if (typeof child === "object" && typeof child.name === "string")
          return tagToVdom(child);
        return String(child);
      });
      return [node.name, attrs, children];
    };
    const htmlVdomFromValue = (entry) => {
      if (entry === null || typeof entry === "undefined")
        return "";
      if (Array.isArray(entry)) {
        return entry.map(htmlVdomFromValue);
      }
      if (entry instanceof Expr) {
        if (entry.isTag)
          return tagToVdom(entry.valueOf());
        return htmlVdomFromValue(Expr.plain(entry, convert2, "<HTML>"));
      }
      if (isSignalValue(entry))
        return entry;
      if (typeof entry === "object" && typeof entry.name === "string" && Array.isArray(entry.children)) {
        return tagToVdom(entry);
      }
      return String(entry);
    };
    const renderDisposers = environment.__xRenderDisposers instanceof Map ? environment.__xRenderDisposers : environment.__xRenderDisposers = new Map;
    const onDisposers = environment.__xOnDisposers instanceof Map ? environment.__xOnDisposers : environment.__xOnDisposers = new Map;
    const resolveShadowHost = (candidate) => {
      let host = candidate;
      if (typeof host === "string") {
        if (typeof document === "undefined" || !document.querySelector) {
          raise(`Shadow host not found: ${host}`, parentTokenInfo);
        }
        host = document.querySelector(host);
      }
      if (!host) {
        host = environment.__xLastShadowHost || null;
      }
      if (!host || typeof host !== "object") {
        raise("Shadow host not found", parentTokenInfo);
      }
      if (!host.shadowRoot) {
        if (typeof host.attachShadow !== "function") {
          raise("Shadow host does not support attachShadow", parentTokenInfo);
        }
        host.attachShadow({ mode: "open" });
      }
      return host;
    };
    let isDone2;
    if (value.annot instanceof Expr.Statement) {
      const [nameToken, typeToken] = value.annot.getBody();
      const name = nameToken && nameToken.valueOf ? String(nameToken.valueOf()) : "";
      const typeText = typeToken && typeToken.valueOf ? String(typeToken.valueOf()) : "";
      if (name) {
        environment.annotate(name, typeText);
      }
      isDone2 = true;
    }
    if (value.let instanceof Expr.LetStatement) {
      subTree.push(...await Eval.do(value.let.getBody(), environment, "Let", true, parentTokenInfo));
      isDone2 = true;
    }
    if (value.destructure instanceof Expr.DestructureStatement) {
      const [bindingsToken, bodyToken] = value.destructure.getBody();
      const bindings = bindingsToken && bindingsToken.value || [];
      const source = await Eval.do(bodyToken.getBody(), environment, "Let", true, parentTokenInfo);
      let values = source;
      if (source.length === 1) {
        if (isArray(source[0])) {
          values = source[0].value;
        } else if (isRange(source[0])) {
          const expanded = await source[0].value.run(true);
          values = expanded.value;
        }
      }
      const restIndex = bindings.findIndex((binding) => binding.rest === true);
      const minRequired = restIndex === -1 ? bindings.length : restIndex;
      if (values.length < minRequired) {
        raise(`Expecting at least ${minRequired} values to destructure, given ${values.length}`, parentTokenInfo);
      }
      bindings.forEach((binding, index) => {
        if (binding.name === "_")
          return;
        const token2 = binding.rest ? Expr.array(values.slice(index), parentTokenInfo) : values[index];
        environment.def(binding.name, token2 || Expr.value(null, parentTokenInfo));
      });
      isDone2 = true;
    }
    if (value.do instanceof Expr.DoStatement && !(value.while instanceof Expr.WhileStatement)) {
      const scope = new Env(environment);
      const result = await Eval.do(value.do.getBody(), scope, "Do", true, parentTokenInfo);
      if (result.length) {
        subTree.push(result[result.length - 1]);
      }
      isDone2 = true;
    }
    if (value.if instanceof Expr.IfStatement) {
      const { body } = value.if.value;
      for (let i2 = 0, c2 = body.length;i2 < c2; i2++) {
        const [head2, ...tail2] = body[i2].getBody();
        const [result] = await Eval.do([head2], environment, "If", true, parentTokenInfo);
        if (result.value === true) {
          subTree.push(...await Eval.do(tail2, environment, "Then", true, parentTokenInfo));
          break;
        }
        if (result.value === false && value.else instanceof Expr.Statement) {
          subTree.push(...await Eval.do(value.else.getBody(), environment, "Else", true, parentTokenInfo));
          break;
        }
      }
      isDone2 = true;
    }
    if (value.namespace instanceof Expr.NamespaceStatement) {
      const [nameToken, levelToken] = value.namespace.getBody();
      const name = nameToken && nameToken.valueOf && nameToken.valueOf() || "";
      const level = levelToken && levelToken.valueOf && levelToken.valueOf() || 1;
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        raise(`Invalid namespace \`${name}\``, parentTokenInfo);
      }
      if (state && typeof state.enterNamespace === "function") {
        state.enterNamespace(name, Math.max(1, parseInt(level, 10) || 1), parentTokenInfo);
      }
      isDone2 = true;
    }
    if (value.table instanceof Expr.TableStatement) {
      const [metaToken] = value.table.getBody();
      const meta = metaToken && metaToken.valueOf && metaToken.valueOf() || {};
      const headers = Array.isArray(meta.headers) ? meta.headers : [];
      const rows = Array.isArray(meta.rows) ? meta.rows : [];
      const items2 = rows.map((row) => {
        const entry = {};
        headers.forEach((header, i2) => {
          entry[header] = Expr.body([Eval.tableCellToken(row[i2], parentTokenInfo)], parentTokenInfo);
        });
        return Expr.map(entry, parentTokenInfo);
      });
      subTree.push(Expr.array(items2, parentTokenInfo));
      isDone2 = true;
    }
    if (value.ok instanceof Expr.OkStatement) {
      subTree.push(await Eval.buildResultToken("ok", value.ok.getBody(), environment, parentTokenInfo));
      isDone2 = true;
    }
    if (value.err instanceof Expr.ErrStatement) {
      subTree.push(await Eval.buildResultToken("err", value.err.getBody(), environment, parentTokenInfo));
      isDone2 = true;
    }
    if (isDirectiveStmt(value.signal)) {
      if (token.__signalCached) {
        subTree.push(token.__signalCached);
        isDone2 = true;
      }
      if (isDone2) {} else {
        const signal = resolveRuntimeFn("signal");
        const args = normalizeDirectiveArgs(value.signal);
        const runtimeArgs = [];
        for (let i2 = 0;i2 < args.length; i2++) {
          const evaluated = await Eval.do([args[i2]], environment, "Expr", true, parentTokenInfo);
          if (!evaluated.length)
            continue;
          runtimeArgs.push(toPlain(evaluated.length === 1 ? evaluated[0] : evaluated));
        }
        const signalName = token && typeof token.getName === "function" ? token.getName() : null;
        if (signalName && runtimeArgs.length < 2) {
          runtimeArgs.push(signalName);
        }
        token.__signalCached = Expr.value(signal(...runtimeArgs), parentTokenInfo);
        subTree.push(token.__signalCached);
        isDone2 = true;
      }
    }
    if (isDirectiveStmt(value.render)) {
      const renderArgs = normalizeDirectiveArgs(value.render);
      const selectorTokens = renderArgs.length ? await Eval.do(renderArgs, environment, "Expr", true, parentTokenInfo) : [];
      const selector = selectorTokens.length ? toPlain(selectorTokens.length === 1 ? selectorTokens[0] : selectorTokens) : undefined;
      const shadowArgs = hasShadow ? normalizeDirectiveArgs(value.shadow) : [];
      let shadowSelector;
      if (shadowArgs.length) {
        const shadowTokens = await Eval.do(shadowArgs, environment, "Expr", true, parentTokenInfo);
        if (shadowTokens.length) {
          shadowSelector = toPlain(shadowTokens.length === 1 ? shadowTokens[0] : shadowTokens);
        }
      }
      if (isDirectiveStmt(value.html)) {
        const html = resolveRuntimeFn("html");
        const render2 = hasShadow ? resolveRuntimeFn("renderShadow") : resolveRuntimeFn("render");
        const htmlBody = normalizeDirectiveArgs(value.html);
        const renderKey = selector != null ? String(selector) : hasShadow ? typeof shadowSelector !== "undefined" ? String(shadowSelector) : "__last_shadow__" : "__default__";
        for (const [key, prev] of renderDisposers) {
          if (key === renderKey || key === `shadow:${renderKey}` || key === `dom:${renderKey}`) {
            if (typeof prev.stop === "function")
              prev.stop();
            renderDisposers.delete(key);
          }
        }
        const view = html(async () => {
          const scope = new Env(environment);
          signalMap = new Map;
          const localNames = Object.keys(environment.locals || {});
          for (let i2 = 0;i2 < localNames.length; i2++) {
            const name = localNames[i2];
            const local = environment.locals[name];
            const [head2] = local && local.body || [];
            if (!(head2 && head2.isObject && head2.value && head2.value.signal))
              continue;
            const signalEntry = environment.get(name);
            const resolvedBody = signalEntry && signalEntry.body ? signalEntry.body : [];
            if (!resolvedBody.length)
              continue;
            const resolved = await Eval.do(resolvedBody, environment, "Lit", false, parentTokenInfo);
            if (!resolved || !resolved.length)
              continue;
            const plain = toPlain(resolved.length === 1 ? resolved[0] : resolved);
            if (!isSignalValue(plain))
              continue;
            signalMap.set(name, plain);
            scope.def(name, Expr.value(plain.peek(), parentTokenInfo));
          }
          const rendered = await Eval.do(htmlBody, scope, "Render", true, parentTokenInfo);
          if (!rendered.length)
            return "";
          const result = htmlVdomFromValue(rendered.length === 1 ? rendered[0] : rendered);
          if (signalMap.size > 0) {
            signalMap.forEach((sig) => sig.get());
          }
          return result;
        });
        if (hasShadow) {
          const host = resolveShadowHost(typeof shadowSelector !== "undefined" ? shadowSelector : selector);
          environment.__xLastShadowHost = host;
          if (host.shadowRoot)
            host.shadowRoot.innerHTML = "";
          renderDisposers.set(renderKey, render2(host, view));
        } else {
          if (typeof document !== "undefined") {
            const target = typeof selector === "string" ? document.querySelector(selector) : selector;
            if (target)
              target.innerHTML = "";
          }
          renderDisposers.set(renderKey, render2(selector, view));
        }
      }
      isDone2 = true;
    }
    if (isDirectiveStmt(value.on)) {
      const on = resolveRuntimeFn("on");
      const args = normalizeDirectiveArgs(value.on);
      const shadowParts = hasShadow ? normalizeDirectiveArgs(value.shadow) : [];
      const unwrapHandlerToken = (candidate) => {
        if (!candidate)
          return null;
        if (candidate.isCallable)
          return candidate;
        if (candidate.isBlock && candidate.hasBody) {
          const body = candidate.getBody();
          if (body.length === 1 && body[0] && body[0].isCallable)
            return body[0];
        }
        return null;
      };
      let eventToken = args[0];
      let selectorToken = args[1];
      let handlerToken = args[2];
      if (!handlerToken && shadowParts.length) {
        const maybeHandler = unwrapHandlerToken(shadowParts[0]);
        if (maybeHandler) {
          handlerToken = maybeHandler;
          shadowParts.shift();
        }
      }
      if (!eventToken || !selectorToken || !handlerToken) {
        raise("`@on` expects event, selector and handler", parentTokenInfo);
      }
      const [eventValue] = await Eval.do([eventToken], environment, "Expr", true, parentTokenInfo);
      const [selectorValue] = await Eval.do([selectorToken], environment, "Expr", true, parentTokenInfo);
      const eventName = toPlain(eventValue);
      const selector = toPlain(selectorValue);
      let shadowSelector;
      if (shadowParts.length) {
        const shadowTokens = await Eval.do(shadowParts, environment, "Expr", true, parentTokenInfo);
        if (shadowTokens.length) {
          shadowSelector = toPlain(shadowTokens.length === 1 ? shadowTokens[0] : shadowTokens);
        }
      }
      let handler;
      if (handlerToken && handlerToken.isCallable && handlerToken.hasBody && handlerToken.getName) {
        const targetName = handlerToken.getName();
        if (environment.has(targetName, true)) {
          const targetEntry = environment.get(targetName);
          const resolvedTarget = targetEntry && targetEntry.body ? await Eval.do(targetEntry.body, environment, "Lit", false, parentTokenInfo) : [];
          const target = resolvedTarget.length ? toPlain(resolvedTarget.length === 1 ? resolvedTarget[0] : resolvedTarget) : null;
          if (isSignalValue(target)) {
            handler = async () => {
              const scope = new Env(environment);
              scope.def(targetName, Expr.value(target.get(), parentTokenInfo));
              const nextTokens = await Eval.do(handlerToken.getBody(), scope, "On", true, parentTokenInfo);
              if (!nextTokens.length)
                return;
              const nextValue = toPlain(nextTokens.length === 1 ? nextTokens[0] : nextTokens);
              target.set(nextValue);
            };
          }
        }
      }
      if (!handler) {
        const [resolvedHandlerToken] = await Eval.do([handlerToken], environment, "Expr", true, parentTokenInfo);
        const resolvedHandler = resolvedHandlerToken ? toPlain(resolvedHandlerToken) : null;
        handler = typeof resolvedHandler === "function" ? resolvedHandler : () => {};
      }
      const shadowRoot = hasShadow ? resolveShadowHost(typeof shadowSelector !== "undefined" ? shadowSelector : undefined).shadowRoot : undefined;
      const onKey = `${eventName}::${selector}::${hasShadow ? typeof shadowSelector !== "undefined" ? shadowSelector : "__last_shadow__" : "document"}`;
      const previousOn = onDisposers.get(onKey);
      if (typeof previousOn === "function")
        previousOn();
      onDisposers.set(onKey, on(eventName, selector, handler, shadowRoot));
      isDone2 = true;
    }
    if (value.loop instanceof Expr.LoopStatement) {
      const body = value.loop.getBody();
      for (let i2 = 0, c2 = body.length;i2 < c2; i2++) {
        let range;
        let args;
        if (isBlock(body[i2])) {
          if (isBlock(body[i2].head())) {
            const [head2, ...tail2] = body[i2].getBody();
            range = [head2];
            args = tail2;
          } else {
            range = body[i2].getBody();
            args = [];
          }
        } else {
          range = [body[i2]];
          args = [];
        }
        subTree.push(...await Eval.loop(args, range, environment, parentTokenInfo));
      }
      isDone2 = true;
    }
    if (value.match instanceof Expr.MatchStatement) {
      const fixedMatches = value.match.clone().getBody();
      const fixedBody = value.match.head().value.body;
      const fixedArgs = isBlock(fixedBody[0]) ? fixedBody[0].getArgs() : [fixedBody[0]];
      const [input2] = await Eval.do(fixedArgs, environment, "Expr", true, parentTokenInfo);
      fixedMatches[0].value.body.shift();
      let cases = fixedMatches.map((x2) => isBlock(x2) ? x2.getBody() : [x2]);
      if (cases.length === 1 && cases[0].some(isComma)) {
        cases = Eval.splitMatchCases(cases[0]);
      }
      cases = cases.map((entry) => {
        if (entry.length !== 1)
          return entry;
        const [head2] = entry;
        if (isObject(head2) && head2.value && head2.value.else instanceof Expr.ElseStatement) {
          return [head2.value.else];
        }
        return entry;
      });
      const found = await Eval.resolveMatchBody(input2, cases, environment, parentTokenInfo);
      if (found) {
        subTree.push(...await Eval.do(found, environment, "It", true, parentTokenInfo));
      }
      if (!found && value.else instanceof Expr.Statement) {
        subTree.push(...await Eval.do(value.else.getBody(), environment, "Else", true, parentTokenInfo));
      }
      isDone2 = true;
    }
    if (value.try instanceof Expr.TryStatement || value.rescue instanceof Expr.RescueStatement) {
      const body = (value.try || value.rescue).getBody();
      while (!isDone2) {
        let result;
        let failure;
        try {
          result = await Eval.do(body, environment, "Try", true, parentTokenInfo);
        } catch (e2) {
          if (!value.rescue)
            throw e2;
          failure = e2;
        }
        if (value.check instanceof Expr.CheckStatement) {
          const [retval] = await Eval.do(value.check.getBody(), environment, "Check", true, parentTokenInfo);
          if (retval && retval.value === true)
            isDone2 = true;
        }
        if (!isDone2 && value.rescue instanceof Expr.RescueStatement) {
          let scope = environment;
          let retry;
          if (failure && value.try) {
            const subBody = value.rescue.getBody();
            for (let i2 = 0, c2 = subBody.length;!isDone2 && i2 < c2; i2++) {
              let fixedBody = isBlock(subBody[i2]) ? subBody[i2].getBody() : [subBody[i2]];
              let newBody = [];
              let head2 = [];
              if (fixedBody[0].isCallable) {
                if (fixedBody[0].hasArgs) {
                  if (fixedBody[0].getArgs().length > 1) {
                    check(fixedBody[0].getArg(1), "block");
                  }
                  scope = new Env(environment);
                  scope.def(fixedBody[0].getArg(0).value, Expr.value(failure.toString()));
                }
                fixedBody = fixedBody[0].getBody();
              }
              if (isBlock(fixedBody[0]) && fixedBody[0].hasArgs) {
                head2 = fixedBody[0].getArgs(0);
                newBody = fixedBody.slice(1);
                if (!fixedBody[0].getArg(0).isExpression) {
                  newBody = newBody[0].getArgs();
                }
              }
              const [retval] = await Eval.do(head2, environment, "Expr", true, parentTokenInfo);
              if (retval && retval.value === true) {
                subTree.push(...await Eval.do(newBody, environment, "Rescue", true, parentTokenInfo));
                retry = true;
              }
              if (!isDone2 && !isBlock(fixedBody[0])) {
                subTree.push(...await Eval.do(fixedBody, environment, "Rescue", true, parentTokenInfo));
                isDone2 = true;
              }
            }
          }
          if (!retry)
            isDone2 = true;
          if (!failure && result) {
            subTree.push(...result);
            isDone2 = true;
          }
        }
      }
      isDone2 = true;
    }
    if (value.while instanceof Expr.WhileStatement) {
      const body = value.while.getBody();
      const head2 = body[0].getBody().shift();
      let enabled = true;
      if (value.do instanceof Expr.DoStatement) {
        do {
          subTree.push(...await Eval.do(value.do.getBody(), environment, "It", true, parentTokenInfo));
          if ((await Eval.do([head2], environment, "Do", true, parentTokenInfo))[0].value !== true)
            break;
        } while (enabled);
        enabled = false;
      }
      while (enabled) {
        if ((await Eval.do([head2], environment, "While", true, parentTokenInfo))[0].value !== true)
          break;
        subTree.push(...await Eval.do(body, environment, "It", true, parentTokenInfo));
      }
      isDone2 = true;
    }
    if (value.import instanceof Expr.ImportStatement) {
      if (!(value.from instanceof Expr.FromStatement)) {
        raise(`Missing \`@from\` for \`${token}\``);
      }
      only(value.from, isString);
      await Promise.all(Expr.each(value.import.getBody(), (ctx, name, alias) => {
        return Env.load(ctx, name, alias, value.from.head().valueOf(), environment);
      }));
      const templateSpec = Eval.templateImportSpec(value.template);
      if (templateSpec.hasTemplateImport) {
        const sourceName = value.from.head().valueOf();
        const source = await Env.resolve(sourceName, "@template", null, environment);
        if (!(source instanceof Env)) {
          raise(`Cannot import templates from \`${sourceName}\``, parentTokenInfo);
        }
        const exported = source.exportedTemplates || {};
        const names2 = templateSpec.includeAll ? Object.keys(exported) : templateSpec.names;
        names2.forEach((requestedName) => {
          const exportedName = exported[requestedName];
          if (!templateSpec.includeAll && !exportedName) {
            raise(`Template \`${requestedName}\` not exported`, parentTokenInfo);
          }
          const realName = exportedName || requestedName;
          const definition = Eval.resolveTemplateByName(source.templates, realName);
          if (!definition) {
            raise(`Missing template \`${realName}\` in \`${sourceName}\``, parentTokenInfo);
          }
          Eval.registerTemplateByName(environment.templates, realName, definition);
        });
      }
      isDone2 = true;
    }
    if (value.module instanceof Expr.ModuleStatement || value.export instanceof Expr.ExportStatement) {
      if (value.module) {
        if (environment.descriptor) {
          raise(`Module name \`${environment.descriptor}\` is already set`);
        }
        only(value.module, isString);
        environment.descriptor = value.module.head().valueOf();
      }
      if (value.export) {
        if (environment.exported === true) {
          environment.exported = {};
        }
        Expr.each(value.export.getBody(), (ctx, name, alias) => {
          if (environment.exported[alias || name]) {
            raise(`Export for \`${alias || name}\` already exists`);
          }
          environment.exported[alias || name] = name;
        });
        if (value.template instanceof Expr.TemplateStatement) {
          const names2 = value.template.getBody().map(Eval.templateNameFromEntry).filter(Boolean);
          names2.forEach((name) => {
            if (environment.exportedTemplates[name]) {
              raise(`Template export for \`${name}\` already exists`);
            }
            if (!Eval.resolveTemplateByName(environment.templates, name)) {
              raise(`Missing template \`${name}\``, parentTokenInfo);
            }
            environment.exportedTemplates[name] = name;
          });
        }
      }
      isDone2 = true;
    }
    if (!isDone2 && (value.do instanceof Expr.DoStatement || value.from instanceof Expr.FromStatement || value.else instanceof Expr.ElseStatement || value.check instanceof Expr.CheckStatement || value.rescue instanceof Expr.RescueStatement))
      check(token);
    if (!subTree.length && !isDone2) {
      if (["Set", "Call", "Match"].includes(descriptor)) {
        const keys2 = Object.keys(value);
        for (let i2 = 0, c2 = keys2.length;i2 < c2; i2++) {
          const subBody = value[keys2[i2]].getBody();
          const fixedBody = await Eval.do(subBody, environment, "Prop", true, parentTokenInfo);
          value[keys2[i2]] = Expr.stmt(fixedBody, parentTokenInfo);
        }
      }
      return [Expr.map(value, token.tokenInfo)];
    }
    return subTree;
  }
  static async run(tokens, environment, descriptor, noInheritance, parentTokenInfo) {
    if (Eval.detail)
      Eval.detail.depth++;
    try {
      if (!Array.isArray(tokens)) {
        raise(`Given \`${JSON.stringify(tokens)}\` as input!`);
      }
      const vm = new Eval(tokens, environment, noInheritance);
      const result = await vm.run(descriptor, parentTokenInfo);
      return result;
    } finally {
      if (Eval.detail)
        Eval.detail.depth--;
    }
  }
  static do(params, ...args) {
    if (Array.isArray(params)) {
      return !(params.length === 1 && isNumber(params[0])) ? Eval.run(params, ...args) : params;
    }
    return Object.keys(params).reduce((prev, cur) => prev.then((target) => {
      return Eval.run(params[cur], ...args).then((result) => {
        target[cur] = result;
        return target;
      });
    }), Promise.resolve({}));
  }
}
var LAZY_DESCRIPTORS, OPS_MUL_DIV, OPS_PLUS_MINUS_MOD, OPS_LOGIC;
var init_eval = __esm(() => {
  init_env();
  init_expr();
  init_parser();
  init_range();
  init_tag();
  init_symbols();
  init_helpers();
  LAZY_DESCRIPTORS = new Set(["Loop", "Set"]);
  OPS_MUL_DIV = new Set([MUL, DIV]);
  OPS_PLUS_MINUS_MOD = new Set([PLUS, MINUS, MOD]);
  OPS_LOGIC = new Set([LESS, LESS_EQ, GREATER, GREATER_EQ, EQUAL, EXACT_EQ, NOT_EQ, LIKE, NOT]);
});

// src/lib/index.js
function ensureBuiltins() {
  if (builtinsReady)
    return;
  builtinsReady = true;
  const mappings = ensureDefaultMappings();
  Expr.Unit.to = Parser.sub("(a b) -> a.to(b)");
  Object.keys(mappings).forEach((kind) => {
    Expr.Unit[kind] = Parser.sub(`:${mappings[kind]}`);
  });
}
async function evaluate(tokens, environment, enabledDetail) {
  ensureBuiltins();
  const info = Eval.info({
    enabled: enabledDetail,
    depth: 0,
    calls: []
  });
  let result;
  let error;
  try {
    result = await Eval.run(tokens, environment, "Eval", !!environment);
  } catch (e2) {
    if (!environment)
      throw e2;
    error = e2;
  }
  return { result, error, info };
}
async function execute(code, environment, enabledDetail) {
  ensureBuiltins();
  let failure = null;
  let value = null;
  let info = {};
  try {
    const res = await evaluate(Parser.getAST(code, "parse", environment), environment, enabledDetail);
    failure = res.error;
    value = res.result;
    info = res.info;
  } catch (e2) {
    failure = failure || e2;
  }
  execute.failure = failure;
  execute.value = value;
  execute.info = info;
  if (failure && !environment) {
    throw failure;
  }
  return value;
}
var builtinsReady = false;
var init_lib = __esm(() => {
  init_expr();
  init_eval();
  init_parser();
  init_builtins();
});

// src/adapters/index.js
function applyAdapter(runtime, adapter, options = {}) {
  if (!adapter)
    return;
  if (typeof adapter.setup === "function") {
    adapter.setup(runtime, options);
  }
}
function createEnv(runtime, adapter, options = {}) {
  applyAdapter(runtime, adapter, options);
  return new runtime.Env(options.parent);
}

// src/compiler/atoms.js
function escapeClassName(value) {
  return String(value).replace(/\//g, "\\/");
}
function makeRule(className, declaration) {
  return `.${escapeClassName(className)}{${declaration}}`;
}
function resolveSpaceDeclaration(kind, axis, value) {
  if (!Object.prototype.hasOwnProperty.call(SPACE_SCALE, value))
    return null;
  const cssValue = SPACE_SCALE[value];
  const longhand = kind === "p" ? ["padding"] : kind === "m" ? ["margin"] : ["gap"];
  if (kind === "gap") {
    if (!axis)
      return `gap:${cssValue}`;
    if (axis === "x")
      return `column-gap:${cssValue}`;
    if (axis === "y")
      return `row-gap:${cssValue}`;
    return null;
  }
  if (!axis)
    return `${longhand[0]}:${cssValue}`;
  const map2 = {
    x: [`${longhand[0]}-left`, `${longhand[0]}-right`],
    y: [`${longhand[0]}-top`, `${longhand[0]}-bottom`],
    t: [`${longhand[0]}-top`],
    r: [`${longhand[0]}-right`],
    b: [`${longhand[0]}-bottom`],
    l: [`${longhand[0]}-left`]
  };
  if (!map2[axis])
    return null;
  return map2[axis].map((prop) => `${prop}:${cssValue}`).join(";");
}
function resolveColorDeclaration(kind, colorName) {
  if (!Object.prototype.hasOwnProperty.call(COLORS, colorName))
    return null;
  const value = COLORS[colorName];
  if (kind === "text")
    return `color:${value}`;
  if (kind === "bg")
    return `background-color:${value}`;
  if (kind === "border")
    return `border-color:${value}`;
  return null;
}
function atomicRule(className) {
  if (Object.prototype.hasOwnProperty.call(STATIC_RULES, className)) {
    return makeRule(className, STATIC_RULES[className]);
  }
  const opacity = /^opacity-(0|50|100)$/.exec(className);
  if (opacity)
    return makeRule(className, `opacity:${OPACITY_SCALE[opacity[1]]}`);
  const spacing = /^(p|m|gap)(x|y|t|r|b|l)?-(.+)$/.exec(className);
  if (spacing) {
    const declaration = resolveSpaceDeclaration(spacing[1], spacing[2], spacing[3]);
    if (declaration)
      return makeRule(className, declaration);
  }
  const color = /^(text|bg|border)-(.+)$/.exec(className);
  if (color) {
    const declaration = resolveColorDeclaration(color[1], color[2]);
    if (declaration)
      return makeRule(className, declaration);
  }
  return null;
}
function generateAtomicCss(classSet) {
  if (!classSet || !classSet.size)
    return "";
  const css = [];
  classSet.forEach((className) => {
    const rule = atomicRule(className);
    if (rule)
      css.push(rule);
  });
  return css.join(`
`);
}
var SPACE_SCALE, OPACITY_SCALE, COLORS, STATIC_RULES;
var init_atoms = __esm(() => {
  SPACE_SCALE = {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    px: "1px",
    auto: "auto"
  };
  OPACITY_SCALE = {
    0: "0",
    50: "0.5",
    100: "1"
  };
  COLORS = {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
    current: "currentColor",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",
    "blue-100": "#dbeafe",
    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "red-500": "#ef4444",
    "red-600": "#dc2626",
    "green-500": "#22c55e",
    "green-600": "#16a34a",
    "yellow-500": "#eab308",
    "purple-500": "#a855f7",
    "pink-500": "#ec4899"
  };
  STATIC_RULES = {
    flex: "display:flex",
    grid: "display:grid",
    block: "display:block",
    inline: "display:inline",
    "inline-flex": "display:inline-flex",
    "inline-block": "display:inline-block",
    hidden: "display:none",
    "flex-col": "flex-direction:column",
    "flex-row": "flex-direction:row",
    "flex-wrap": "flex-wrap:wrap",
    "flex-1": "flex:1 1 0%",
    "flex-auto": "flex:1 1 auto",
    "flex-none": "flex:none",
    "items-start": "align-items:flex-start",
    "items-center": "align-items:center",
    "items-end": "align-items:flex-end",
    "items-stretch": "align-items:stretch",
    "justify-start": "justify-content:flex-start",
    "justify-center": "justify-content:center",
    "justify-end": "justify-content:flex-end",
    "justify-between": "justify-content:space-between",
    "justify-around": "justify-content:space-around",
    "w-full": "width:100%",
    "w-screen": "width:100vw",
    "w-auto": "width:auto",
    "h-full": "height:100%",
    "h-screen": "height:100vh",
    "h-auto": "height:auto",
    "min-w-0": "min-width:0",
    "min-h-0": "min-height:0",
    "text-xs": "font-size:0.75rem;line-height:1rem",
    "text-sm": "font-size:0.875rem;line-height:1.25rem",
    "text-base": "font-size:1rem;line-height:1.5rem",
    "text-lg": "font-size:1.125rem;line-height:1.75rem",
    "text-xl": "font-size:1.25rem;line-height:1.75rem",
    "text-2xl": "font-size:1.5rem;line-height:2rem",
    "text-3xl": "font-size:1.875rem;line-height:2.25rem",
    "text-4xl": "font-size:2.25rem;line-height:2.5rem",
    "font-light": "font-weight:300",
    "font-normal": "font-weight:400",
    "font-medium": "font-weight:500",
    "font-semibold": "font-weight:600",
    "font-bold": "font-weight:700",
    "text-left": "text-align:left",
    "text-center": "text-align:center",
    "text-right": "text-align:right",
    uppercase: "text-transform:uppercase",
    lowercase: "text-transform:lowercase",
    capitalize: "text-transform:capitalize",
    truncate: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
    border: "border-width:1px;border-style:solid",
    "border-0": "border-width:0",
    "border-t": "border-top-width:1px;border-top-style:solid",
    "border-b": "border-bottom-width:1px;border-bottom-style:solid",
    rounded: "border-radius:0.25rem",
    "rounded-md": "border-radius:0.375rem",
    "rounded-lg": "border-radius:0.5rem",
    "rounded-xl": "border-radius:0.75rem",
    "rounded-full": "border-radius:9999px",
    "rounded-none": "border-radius:0",
    shadow: "box-shadow:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
    "shadow-md": "box-shadow:0 4px 6px rgba(0,0,0,0.1),0 2px 4px rgba(0,0,0,0.06)",
    "shadow-lg": "box-shadow:0 10px 15px rgba(0,0,0,0.1),0 4px 6px rgba(0,0,0,0.05)",
    "shadow-none": "box-shadow:none",
    relative: "position:relative",
    absolute: "position:absolute",
    fixed: "position:fixed",
    sticky: "position:sticky",
    "inset-0": "top:0;right:0;bottom:0;left:0",
    "overflow-hidden": "overflow:hidden",
    "overflow-auto": "overflow:auto",
    "overflow-scroll": "overflow:scroll",
    "cursor-pointer": "cursor:pointer",
    "cursor-default": "cursor:default",
    "select-none": "user-select:none",
    "pointer-events-none": "pointer-events:none",
    "box-border": "box-sizing:border-box",
    "sr-only": "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"
  };
});

// src/compiler/index.js
function splitStatements(tokens) {
  const out = [];
  let current2 = [];
  tokens.forEach((token) => {
    if (token.type === EOL) {
      if (current2.length)
        out.push(current2);
      current2 = [];
      return;
    }
    current2.push(token);
  });
  if (current2.length)
    out.push(current2);
  return out;
}
function preserveMarkdownLine(line) {
  return String(line || "").replace(/\s+$/, "");
}
function normalizeProseBlock(lines) {
  const out = [];
  lines.forEach((line) => {
    const isEmpty = !line.trim().length;
    const prev = out[out.length - 1];
    const prevIsEmpty = typeof prev === "string" && !prev.trim().length;
    if (isEmpty && (!out.length || prevIsEmpty))
      return;
    out.push(line);
  });
  while (out.length && !out[0].trim().length)
    out.shift();
  while (out.length && !out[out.length - 1].trim().length)
    out.pop();
  return out;
}
function normalizeDirectiveArgs(body) {
  if (!Array.isArray(body))
    return [];
  const flat = body.length === 1 && body[0] && body[0].type === BLOCK && body[0].hasBody ? body[0].getBody() : body;
  return flat.filter((token) => token && token.type !== COMMA);
}
function collectProseComments(source, statementCount) {
  const sourceLines = String(source || "").split(`
`);
  const raw = Parser.getAST(source, null);
  const commentsByStatement = Array.from({ length: statementCount }, () => []);
  const ranges = [];
  let currentStart = null;
  let currentEnd = null;
  raw.forEach((token) => {
    if (token.type === EOF)
      return;
    if (token.type === EOL) {
      if (currentStart !== null) {
        const line2 = Number.isFinite(token.line) ? token.line : currentEnd;
        ranges.push({ start: currentStart, end: line2 });
        currentStart = null;
        currentEnd = null;
      }
      return;
    }
    if (token.type === TEXT || token.type === COMMENT || token.type === COMMENT_MULTI)
      return;
    const line = Number.isFinite(token.line) ? token.line : null;
    if (line === null)
      return;
    if (currentStart === null) {
      currentStart = line;
      currentEnd = line;
      return;
    }
    currentEnd = Math.max(currentEnd, line);
  });
  if (currentStart !== null) {
    ranges.push({ start: currentStart, end: currentEnd });
  }
  let cursor = 0;
  ranges.slice(0, statementCount).forEach((range, index) => {
    const prose = sourceLines.slice(cursor, range.start).map(preserveMarkdownLine);
    commentsByStatement[index] = normalizeProseBlock(prose);
    cursor = range.end + 1;
  });
  return commentsByStatement;
}
function splitByEol(tokens) {
  const out = [];
  let current2 = [];
  (tokens || []).forEach((token) => {
    if (token.type === EOL) {
      if (current2.length)
        out.push(current2);
      current2 = [];
      return;
    }
    current2.push(token);
  });
  if (current2.length)
    out.push(current2);
  return out;
}
function getRuntimeSiblingPath(runtimePath, moduleName) {
  if (runtimePath.endsWith("/runtime")) {
    return `${runtimePath.slice(0, -"/runtime".length) || "."}/${moduleName}`.replace("//", "/");
  }
  if (runtimePath.endsWith("/runtime/index.js")) {
    return `${runtimePath.slice(0, -"/runtime/index.js".length) || "."}/${moduleName}`.replace("//", "/");
  }
  if (runtimePath === "./runtime")
    return `./${moduleName}`;
  if (runtimePath === "10x/runtime")
    return `10x/${moduleName}`;
  return `./${moduleName}`;
}
function getPreludePath(runtimePath) {
  return getRuntimeSiblingPath(runtimePath, "prelude");
}
function getCoreRuntimePath(runtimePath) {
  if (runtimePath.startsWith("./") || runtimePath.startsWith("../"))
    return runtimePath;
  if (runtimePath.endsWith("/runtime"))
    return `${runtimePath}/core`;
  if (runtimePath.endsWith("/runtime/index.js"))
    return `${runtimePath.slice(0, -"/index.js".length)}/core.js`;
  return runtimePath;
}
function toTokenLike(node) {
  if (!node)
    return node;
  if (node.type)
    return node;
  if (typeof node === "string") {
    if (/^-?\d+(\.\d+)?$/.test(node))
      return { isNumber: true, value: node };
    return { isLiteral: true, value: node };
  }
  if (typeof node === "number") {
    return { isNumber: true, value: String(node) };
  }
  if (typeof node === "object" && Object.prototype.hasOwnProperty.call(node, "value")) {
    return toTokenLike(node.value);
  }
  return node;
}
function splitArgGroups(args) {
  const groups = [];
  let current2 = [];
  (args || []).forEach((token) => {
    if (token.type === COMMA) {
      if (current2.length)
        groups.push(current2);
      current2 = [];
      return;
    }
    current2.push(token);
  });
  if (current2.length)
    groups.push(current2);
  return groups;
}
function unwrapSingleBodyBlock(token) {
  let current2 = token;
  while (current2 && current2.type === BLOCK && current2.hasBody && !current2.hasArgs && current2.getBody().length === 1) {
    [current2] = current2.getBody();
  }
  return current2;
}
function extractPostUpdatePartsFromArgs(args, ctx) {
  if (!Array.isArray(args))
    return null;
  if (args.length !== 2)
    return null;
  const [targetToken, updateToken] = args;
  if (!(targetToken && targetToken.isLiteral && typeof targetToken.value === "string"))
    return null;
  const target = String(targetToken.value);
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(target))
    return null;
  if (!(updateToken && updateToken.isObject && updateToken.value && updateToken.value.let && updateToken.value.let.hasBody))
    return null;
  const [entryRaw] = updateToken.value.let.getBody();
  const entry = unwrapSingleBodyBlock(entryRaw);
  if (!(entry && entry.isCallable && entry.getName && entry.getName() === target && entry.hasBody))
    return null;
  const rhs = compileExpression(entry.getBody(), { ...ctx, autoPrintExpressions: false, exportDefinitions: false });
  return { target, rhs };
}
function isQuestionToken(token) {
  return !!token && (token.type === SOME || token.isLiteral && token.value === "?");
}
function isPipeChoiceToken(token) {
  return !!token && (token.type === OR || token.isLiteral && token.value === "|");
}
function collectImportSpecs(statements, runtimePath) {
  const imports = [];
  const globals = [];
  const seenImport = new Set;
  const seenGlobal = new Set;
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token.isObject || !token.value || !token.value.import)
      return;
    const fromBody = token.value.from && token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === "string" ? fromBody[0].value : null;
    const importToken = token.value.import;
    const importBodyRaw = importToken && importToken.getBody ? importToken.getBody() : [];
    const importBody = importBodyRaw.length === 1 && importBodyRaw[0] && importBodyRaw[0].type === BLOCK && importBodyRaw[0].hasBody ? importBodyRaw[0].getBody() : importBodyRaw;
    const specifiers = (importBody.length ? importBody.filter((x2) => x2 && x2.type !== COMMA).map((x2) => x2.value) : [importToken && importToken.value]).filter(Boolean);
    if (!specifiers.length)
      return;
    if (source === "Prelude" || source === "IO" || source === "Proc" || source === "Array" && specifiers.includes("concat")) {
      const modulePath = source === "Prelude" ? getPreludePath(runtimePath) : source === "IO" ? getRuntimeSiblingPath(runtimePath, "io") : source === "Proc" ? getRuntimeSiblingPath(runtimePath, "proc") : getPreludePath(runtimePath);
      const preludeSpecifiers = source === "Prelude" ? specifiers : source === "IO" || source === "Proc" ? specifiers : specifiers.filter((x2) => x2 === "concat");
      const key = `${modulePath}::${specifiers.join(",")}`;
      if (!seenImport.has(key)) {
        imports.push({ source: modulePath, specifiers: preludeSpecifiers });
        seenImport.add(key);
      }
      if (source === "Array") {
        const remaining = specifiers.filter((x2) => x2 !== "concat");
        if (!remaining.length)
          return;
        const gKey = `${source}::${remaining.join(",")}`;
        if (!seenGlobal.has(gKey)) {
          globals.push({ source, specifiers: remaining });
          seenGlobal.add(gKey);
        }
        return;
      }
      return;
    }
    if (source && /^[A-Z][A-Za-z0-9_]*$/.test(source)) {
      const key = `${source}::${specifiers.join(",")}`;
      if (!seenGlobal.has(key)) {
        globals.push({ source, specifiers });
        seenGlobal.add(key);
      }
    }
  });
  return { imports, globals };
}
function collectNeedsDom(statements) {
  return statements.some((tokens) => {
    if (tokens.length !== 1)
      return false;
    const [token] = tokens;
    if (!token.isObject || !token.value)
      return false;
    return !!(token.value.render || token.value.on || token.value.shadow || token.value.style);
  });
}
function collectPrintStatements(source) {
  const raw = Parser.getAST(source, null);
  const printIdx = new Set;
  let idx = 0;
  let seenCode = false;
  let seenPrint = false;
  raw.forEach((token) => {
    if (token.type === EOF)
      return;
    if (token.type === EOL) {
      if (seenCode) {
        if (seenPrint)
          printIdx.add(idx);
        idx++;
      }
      seenCode = false;
      seenPrint = false;
      return;
    }
    if (token.type === TEXT || token.type === COMMENT || token.type === COMMENT_MULTI)
      return;
    seenCode = true;
    if (token.type === NOT)
      seenPrint = true;
  });
  return printIdx;
}
function quote2(value) {
  return JSON.stringify(String(value));
}
function indentMultiline(value, indent) {
  return String(value).split(`
`).map((line) => `${indent}${line}`).join(`
`);
}
function formatFirstInline(value, indent) {
  const lines = String(value).split(`
`);
  if (lines.length === 1)
    return lines[0];
  return `${lines[0]}
${lines.slice(1).map((line) => `${indent}${line}`).join(`
`)}`;
}
function compileTag(node, depth = 0) {
  const attrEntries = Object.entries(node.attrs || {});
  const attrsStr = attrEntries.length === 0 ? "null" : "{ " + attrEntries.map(([k2, v2]) => {
    if (v2 === true)
      return `${JSON.stringify(k2)}: true`;
    if (v2 && typeof v2 === "object" && typeof v2.expr === "string") {
      const passSignal = /^(d:|s:|class:|style:)/.test(k2) || k2 === "ref";
      return passSignal ? `${JSON.stringify(k2)}: ${v2.expr.trim()}` : `${JSON.stringify(k2)}: $.read(${v2.expr.trim()})`;
    }
    return `${JSON.stringify(k2)}: ${JSON.stringify(String(v2))}`;
  }).join(", ") + " }";
  const childrenParts = (node.children || []).map((child) => {
    if (typeof child === "string")
      return JSON.stringify(child);
    if (child && typeof child.expr === "string")
      return `$.read(${child.expr.trim()})`;
    return compileTag(child, depth + 1);
  });
  if (!childrenParts.length) {
    return `$.h(${JSON.stringify(node.name)}, ${attrsStr})`;
  }
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const [firstRawChild, ...restRawChildren] = childrenParts;
  const firstChild = formatFirstInline(firstRawChild, childIndent);
  const restChildren = restRawChildren.map((part) => indentMultiline(part, childIndent));
  const rest = restChildren.length ? `,
${restChildren.join(`,
`)}` : "";
  return `$.h(${JSON.stringify(node.name)}, ${attrsStr}, ${firstChild}${rest})`;
}
function compileArgs(args, ctx) {
  if (!Array.isArray(args) || !args.length)
    return "";
  const groups = splitArgGroups(args);
  const hasObjectPair = groups.some((group) => group.length === 2 && (group[0].type === SYMBOL || group[0].isString));
  const isObjectArg = hasObjectPair && groups.every((group) => group.length === 2 && (group[0].type === SYMBOL || group[0].isString) || group.length === 1 && (group[0].isObject || group[0].isLiteral && typeof group[0].value === "object"));
  if (isObjectArg) {
    return `{ ${groups.map((group) => {
      if (group.length === 1)
        return `...${compileToken(group[0], ctx)}`;
      const keyRaw = String(group[0].value || "").replace(/^:/, "");
      return `${JSON.stringify(keyRaw)}: ${compileToken(group[1], ctx)}`;
    }).join(", ")} }`;
  }
  return groups.map((group) => {
    const post2 = extractPostUpdatePartsFromArgs(group, ctx);
    if (post2) {
      return `(() => { const __prev = ${post2.target}; ${post2.target} = ${post2.rhs}; return __prev; })()`;
    }
    if (group.some((token) => token.type === EOL)) {
      const nested = splitByEol(group);
      const localCtx = { ...ctx, autoPrintExpressions: false, exportDefinitions: false };
      const head2 = nested.slice(0, -1).map((stmt) => compileStatement(stmt, localCtx, -1));
      const tail2 = compileStatement(nested[nested.length - 1], localCtx, -1).replace(/;\s*$/, "");
      return `(() => { ${head2.join(" ")} return ${tail2}; })()`;
    }
    const hasOperator = group.some((token) => OPERATOR.get(token.type));
    const hasCall = group.some((token) => token.type === BLOCK && token.hasArgs);
    if (!hasOperator && !hasCall && group.length > 1) {
      return `[${group.map((token) => compileToken(token, ctx)).join(", ")}]`;
    }
    return compileExpression(group, ctx);
  }).join(", ");
}
function compileLambda(token, ctx) {
  const args = token.hasArgs ? token.getArgs().map((arg) => compileToken(arg, ctx)).join(", ") : "";
  const body = token.hasBody ? compileExpression(token.getBody(), ctx) : "undefined";
  return `(${args}) => (${body})`;
}
function compileToken(token, ctx = { signalVars: new Set }) {
  if (token && token.isObject) {
    const value = token.value || {};
    const keys2 = Object.keys(value);
    const directiveKeys = [
      "render",
      "on",
      "html",
      "signal",
      "computed",
      "prop",
      "if",
      "else",
      "do",
      "let",
      "match",
      "while",
      "loop",
      "try",
      "rescue",
      "export",
      "import",
      "from",
      "style"
    ];
    const isDirective2 = keys2.some((k2) => directiveKeys.includes(k2));
    if (isDirective2)
      return compileDirectiveObject(token, ctx);
    const pairs2 = keys2.map((key) => {
      const body = value[key] && value[key].getBody ? value[key].getBody() : [];
      const rhs = body.length ? compileExpression(body, ctx) : "undefined";
      return `${JSON.stringify(key)}: ${rhs}`;
    });
    return `{ ${pairs2.join(", ")} }`;
  }
  if (token.isTag) {
    return compileTag(token.value);
  }
  if (token.isCallable && !token.getName()) {
    return compileLambda(token, ctx);
  }
  if (token.isNumber) {
    return token.value;
  }
  if (token.isString) {
    if (Array.isArray(token.value)) {
      return compileExpression(token.value, ctx);
    }
    return quote2(token.value);
  }
  if (token.type === BLOCK && token.hasArgs && !token.hasBody) {
    const groups = splitArgGroups(token.getArgs());
    const objectLike = groups.length && groups.every((group) => group.length === 2 && (group[0].type === SYMBOL || group[0].isString));
    if (objectLike) {
      const pairs2 = groups.map((group) => {
        const keyRaw = String(group[0].value || "").replace(/^:/, "");
        return `${JSON.stringify(keyRaw)}: ${compileToken(group[1], ctx)}`;
      });
      return `{ ${pairs2.join(", ")} }`;
    }
    return `(${compileArgs(token.getArgs(), ctx)})`;
  }
  if (token.type === BLOCK && token.hasBody && !token.isCallable) {
    const body = token.getBody();
    const keyValuePair = body.length === 2 && (body[0].type === SYMBOL || body[0].isString) && (body[1].type === SYMBOL || body[1].isString || body[1].isLiteral);
    if (keyValuePair) {
      const keyRaw = String(body[0].value || "").replace(/^:/, "");
      return `{ ${JSON.stringify(keyRaw)}: ${compileToken(body[1], ctx)} }`;
    }
    return `(${compileExpression(body, ctx)})`;
  }
  if (token.type === SYMBOL) {
    const value = String(token.value || "").replace(/^:/, "");
    return quote2(value);
  }
  if (token.type === RANGE) {
    if (Array.isArray(token.value)) {
      const items2 = token.value.map(toTokenLike).filter((x2) => {
        if (!x2)
          return false;
        if (x2.type === COMMA)
          return false;
        return !(x2.isLiteral && x2.value === ",");
      });
      if (items2.some((x2) => x2.type === DOT)) {
        return `(${compileExpression(items2, ctx)})`;
      }
      return `[${items2.map((x2) => compileToken(x2, ctx)).join(", ")}]`;
    }
    if (token.value && Array.isArray(token.value.begin)) {
      const begin = token.value.begin.map((x2) => compileToken(x2, ctx)).join(", ");
      const end = Array.isArray(token.value.end) && token.value.end.length ? `, ${token.value.end.map((x2) => compileToken(x2, ctx)).join(", ")}` : "";
      return `range(${begin}${end})`;
    }
  }
  if (token.isLiteral) {
    if (token.value === null)
      return "null";
    if (token.value === true)
      return "true";
    if (token.value === false)
      return "false";
    if (typeof token.value === "string") {
      if (token.value === "|")
        return "||";
      if (token.value === "?")
        return "?";
      if (ctx.signalVars.has(token.value))
        return `$.read(${token.value})`;
      return token.value;
    }
    if (token.value && typeof token.value === "object") {
      if (Object.prototype.hasOwnProperty.call(token.value, "value")) {
        return compileToken(token.value, ctx);
      }
      if (Array.isArray(token.value.body)) {
        return compileExpression(token.value.body, ctx);
      }
      if (Array.isArray(token.value.args)) {
        return `(${compileArgs(token.value.args, ctx)})`;
      }
    }
    return JSON.stringify(token.value);
  }
  if (token.type === SOME) {
    const target = compileToken(token.value, ctx);
    return `(${target} != null)`;
  }
  if (token.type === EVERY) {
    const target = compileToken(token.value, ctx);
    return `${target}.every(Boolean)`;
  }
  if (token.type === NOT && token.value !== "!") {
    return "!";
  }
  if (token.type === LIKE && Array.isArray(token.value) && token.value.length >= 2) {
    const parts = token.value.map(toTokenLike).filter(Boolean);
    const leftTokens = parts.length > 2 ? parts.slice(0, -1) : [parts[0]];
    const rightToken = parts.length > 2 ? parts[parts.length - 1] : parts[1];
    const left = leftTokens.length > 1 ? compileExpression(leftTokens, ctx) : compileToken(leftTokens[0], ctx);
    const right = compileToken(rightToken, ctx);
    return `(String(${left}).includes(String(${right})))`;
  }
  if (token.type === BLOCK && token.hasBody && token.isCallable) {
    return compileLambda(token, ctx);
  }
  const op = OPERATOR.get(token.type);
  if (op) {
    if (Array.isArray(token.value)) {
      return token.value.map((x2) => compileToken(x2, ctx)).join(` ${op} `);
    }
    return op;
  }
  throw new Error(`Unsupported token in compiler: ${String(token.type)}`);
}
function compileExpression(tokens, ctx = { signalVars: new Set }) {
  const qIndex = tokens.findIndex(isQuestionToken);
  if (qIndex > 0) {
    const elseIndex = tokens.findIndex((token, index) => index > qIndex && isPipeChoiceToken(token));
    if (elseIndex > qIndex) {
      const cond = tokens.slice(0, qIndex);
      const thenBranch = tokens.slice(qIndex + 1, elseIndex);
      const elseBranch = tokens.slice(elseIndex + 1);
      return `((${compileExpression(cond, ctx)}) ? (${compileExpression(thenBranch, ctx)}) : (${compileExpression(elseBranch, ctx)}))`;
    }
  }
  const out = [];
  for (let i2 = 0;i2 < tokens.length; i2++) {
    const token = tokens[i2];
    const next = tokens[i2 + 1];
    const prev = tokens[i2 - 1];
    if (token.type === PIPE) {
      const left = out.pop();
      const rhs = tokens[i2 + 1];
      const rhsNext = tokens[i2 + 2];
      if (rhs && rhs.isLiteral && rhsNext && rhsNext.type === BLOCK && rhsNext.hasArgs) {
        const args = rhsNext.getArgs().filter((x2) => x2.type !== COMMA).map((x2) => compileToken(x2, ctx));
        out.push(`${compileToken(rhs, ctx)}(${[left].concat(args).join(", ")})`);
        i2 += 2;
        continue;
      }
      if (rhs && rhs.isLiteral) {
        out.push(`${compileToken(rhs, ctx)}(${left})`);
        i2 += 1;
        continue;
      }
    }
    if (token.type === BLOCK && token.hasArgs && !token.hasBody && prev && (prev.isLiteral || prev.isTag || prev.type === BLOCK && prev.hasArgs)) {
      if (prev.isString && prev.value === "" && out.length >= 2) {
        const indexExpr = compileArgs(token.getArgs(), ctx);
        out.pop();
        out[out.length - 1] = `${out[out.length - 1]}[${indexExpr}]`;
        continue;
      }
      out[out.length - 1] = `${out[out.length - 1]}(${compileArgs(token.getArgs(), ctx)})`;
      continue;
    }
    if (token.type === SYMBOL && token.value === ":" && next && next.type === BLOCK && next.hasArgs && out.length) {
      const key = compileArgs(next.getArgs(), ctx);
      out[out.length - 1] = `${out[out.length - 1]}[${key}]`;
      i2 += 1;
      continue;
    }
    if (token.type === DOT && next && next.isLiteral) {
      out.push(".");
      continue;
    }
    out.push(compileToken(token, ctx));
  }
  return out.join(" ").replace(/\s+\./g, ".").replace(/\.\s+/g, ".");
}
function compileHandler(token, ctx) {
  const callable = (() => {
    if (token && token.isCallable && token.getName())
      return token;
    if (token && token.type === BLOCK && token.hasBody) {
      const [first] = token.getBody();
      if (first && first.isCallable && first.getName())
        return first;
    }
    return null;
  })();
  if (callable) {
    if (ctx.signalVars.has(callable.getName())) {
      return `() => { ${callable.getName()}.set(${compileExpression(callable.getBody(), ctx)}); }`;
    }
    return `() => { ${compileDefinition(callable, true, { ...ctx, exportDefinitions: false, autoPrintExpressions: false })} }`;
  }
  if (token && token.type === BLOCK && token.hasBody) {
    return `() => (${compileExpression(token.getBody(), ctx)})`;
  }
  return `() => (${compileToken(token, ctx)})`;
}
function compileSignalDirective(body, ctx) {
  return `$.signal(${compileExpression(body, ctx)})`;
}
function compileIfDirective(value, ctx) {
  const branches = value.if && value.if.getBody ? value.if.getBody() : [];
  const elseBody = value.else && value.else.getBody ? value.else.getBody() : [];
  const branchExprs = branches.map((branch) => {
    const body = branch && branch.hasBody ? branch.getBody() : [];
    const [cond, ...rest] = body;
    return {
      cond: cond ? compileExpression([cond], ctx) : "false",
      thenExpr: rest.length ? compileExpression(rest, ctx) : "undefined"
    };
  });
  let out = elseBody.length ? compileExpression(elseBody, ctx) : "undefined";
  for (let i2 = branchExprs.length - 1;i2 >= 0; i2--) {
    out = `((${branchExprs[i2].cond}) ? (${branchExprs[i2].thenExpr}) : (${out}))`;
  }
  return out;
}
function compileDoDirective(body, ctx) {
  const [block] = body;
  const statements = block && block.hasBody ? splitByEol(block.getBody()) : [];
  if (!statements.length)
    return "(() => undefined)()";
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const head2 = statements.slice(0, -1).map((stmt) => compileStatement(stmt, localCtx, -1));
  const tail2 = compileStatement(statements[statements.length - 1], localCtx, -1).replace(/;\s*$/, "");
  return `(() => { ${head2.join(" ")} return ${tail2}; })()`;
}
function compileLetDirective(body, ctx) {
  const items2 = (body || []).flatMap((part) => part && part.hasBody ? part.getBody() : [part]).filter(Boolean);
  if (!items2.length)
    return "undefined";
  const mode = ctx.letMode || "declare";
  const assignOne = (entry) => {
    if (entry && entry.isCallable && entry.getName()) {
      const left = entry.getName();
      const rhs = compileExpression(entry.getBody(), { ...ctx, exportDefinitions: false, autoPrintExpressions: false });
      if (mode === "assign")
        return `(${left} = ${rhs})`;
      return `let ${left} = ${rhs}`;
    }
    return compileToken(entry, { ...ctx, autoPrintExpressions: false });
  };
  const exprs = items2.map(assignOne);
  if (mode === "assign") {
    return exprs[exprs.length - 1];
  }
  return exprs.join("; ");
}
function compileMatchDirective(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  if (!tokens.length)
    return "undefined";
  const key = compileToken(tokens[0], ctx);
  const pairs2 = [];
  let elseExpr = "undefined";
  for (let i2 = 1;i2 < tokens.length; i2++) {
    const token = tokens[i2];
    if (token.type === COMMA)
      continue;
    if (token.isObject && token.value && token.value.else) {
      elseExpr = compileExpression(token.value.else.getBody(), ctx);
      continue;
    }
    const next = tokens[i2 + 1];
    if (!next)
      break;
    pairs2.push({ when: compileToken(token, ctx), thenExpr: compileToken(next, ctx) });
    i2++;
  }
  let out = elseExpr;
  for (let i2 = pairs2.length - 1;i2 >= 0; i2--) {
    out = `(${key} === ${pairs2[i2].when} ? ${pairs2[i2].thenExpr} : ${out})`;
  }
  return out;
}
function compileWhileDirective(body, ctx) {
  const tokens = (body || []).flatMap((part) => part && part.hasBody ? part.getBody() : [part]).filter(Boolean);
  const [cond, ...rest] = tokens;
  const condition = cond ? compileExpression([cond], { ...ctx, letMode: "assign", autoPrintExpressions: false }) : "false";
  const innerParts = rest.map((token) => {
    if (token && token.isCallable && token.getName()) {
      return `${token.getName()} = ${compileExpression(token.getBody(), { ...ctx, autoPrintExpressions: false })};`;
    }
    return `${compileToken(token, { ...ctx, letMode: "assign", autoPrintExpressions: false })};`;
  });
  const tail2 = innerParts.length ? innerParts[innerParts.length - 1].replace(/;\s*$/, "") : "undefined";
  const bodyLines = innerParts.slice(0, -1).join(" ");
  return `(() => { let __whileResult; while (${condition}) { ${bodyLines} __whileResult = ${tail2}; } return __whileResult; })()`;
}
function compileLoopDirective(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  const [iterableToken, fnToken] = tokens;
  const iterable = iterableToken && iterableToken.hasArgs ? compileArgs(iterableToken.getArgs(), ctx) : compileToken(iterableToken, ctx);
  if (!fnToken || !fnToken.isCallable)
    return `for (const _ of ${iterable}) {}`;
  const args = fnToken.hasArgs ? fnToken.getArgs().map((arg) => compileToken(arg, ctx)).join(", ") : "_";
  const bodyExpr = fnToken.hasBody ? compileExpression(fnToken.getBody(), { ...ctx, autoPrintExpressions: false }) : "undefined";
  return `for (const ${args} of ${iterable}) { ${bodyExpr}; }`;
}
function compileTryDirective(value, ctx) {
  const tryBody = value.try && value.try.getBody ? value.try.getBody() : [];
  const rescueBody = value.rescue && value.rescue.getBody ? value.rescue.getBody() : [];
  const tryExpr = tryBody.length ? compileExpression(tryBody, { ...ctx, autoPrintExpressions: false }) : "undefined";
  let rescueArg = "error";
  let rescueExpr = "undefined";
  if (rescueBody.length) {
    let [first] = rescueBody;
    if (first && first.type === BLOCK && first.hasBody && first.getBody().length === 1) {
      [first] = first.getBody();
    }
    if (first && first.isCallable) {
      rescueArg = first.hasArgs && first.getArgs().length ? compileToken(first.getArgs()[0], ctx) : rescueArg;
      rescueExpr = first.hasBody ? compileExpression(first.getBody(), { ...ctx, autoPrintExpressions: false }) : rescueExpr;
    } else {
      rescueExpr = compileExpression(rescueBody, { ...ctx, autoPrintExpressions: false });
    }
  }
  return `(() => { try { return ${tryExpr}; } catch (${rescueArg}) { return ${rescueExpr}; } })()`;
}
function compileExportDirective(body, ctx) {
  const names2 = normalizeDirectiveArgs(body).map((token) => compileToken(token, ctx));
  return `export { ${names2.join(", ")} }`;
}
function compileHtmlDirective(body, ctx) {
  const [template] = body;
  if (template && template.type === RANGE && Array.isArray(template.value)) {
    const items2 = template.value.filter((token) => token && token.type !== COMMA).map((token) => compileToken(token, ctx));
    return `$.html(() => [${items2.join(", ")}])`;
  }
  return `$.html(() => ${compileToken(template, ctx)})`;
}
function compileComputedDirective(body, ctx) {
  return `$.computed(() => ${compileExpression(body, ctx)})`;
}
function compileStyleDirective(body, ctx) {
  const [arg] = body;
  const hostArg = ctx.shadow ? "host, " : "";
  return `$.style(${hostArg}${compileToken(arg, ctx)})`;
}
function compileHmrFooter() {
  return [
    "if (import.meta.hot) {",
    "  const _hmrUrl = import.meta.url;",
    "  import.meta.hot.dispose(data => {",
    "    data.__signals = {};",
    "    for (const [k, s] of (globalThis.__10x_signals || new Map())) {",
    "      if (typeof k === 'string') data.__signals[k] = s.peek();",
    "    }",
    "  });",
    "  import.meta.hot.accept(newMod => {",
    "    const snap = import.meta.hot.data.__signals || {};",
    "    let _restoredCount = 0;",
    "    for (const [k, s] of (globalThis.__10x_signals || new Map())) {",
    "      if (typeof k === 'string' && snap[k] !== undefined) {",
    "        s.set(snap[k]);",
    "        _restoredCount++;",
    "      }",
    "    }",
    "    if (globalThis.__10x_devtools?.onHmr) {",
    "      globalThis.__10x_devtools.onHmr({ restored: _restoredCount, url: _hmrUrl });",
    "    }",
    "    const hosts = globalThis.__10x_components?.get(_hmrUrl);",
    "    if (hosts && newMod?.setup) {",
    "      hosts.forEach(host => {",
    '        if (host.shadowRoot) host.shadowRoot.innerHTML = "";',
    "        newMod.setup(host);",
    "      });",
    "    }",
    "  });",
    "}"
  ];
}
function compileRenderDirective(body, value, ctx) {
  const htmlExpr = value.html instanceof Object ? compileHtmlDirective(value.html.getBody(), ctx) : "undefined";
  if (value.shadow) {
    const hmrUrlArg = ctx.hmr ? ", import.meta.url" : "";
    return `$.renderShadow(host, ${htmlExpr}${hmrUrlArg})`;
  }
  const selector = body.length ? compileExpression(body, ctx) : "undefined";
  return `$.render(${selector}, ${htmlExpr})`;
}
function compileOnDirective(body, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs(body);
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);
  const handler = compileHandler(handlerToken, ctx);
  const rootArg = ctx.shadow ? ", host.shadowRoot" : "";
  return `$.on(${eventName}, ${selector}, ${handler}${rootArg})`;
}
function compileOnPropDirective(onBody, propBody, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs(onBody);
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);
  let signalName;
  if (handlerToken.type === BLOCK && handlerToken.hasBody) {
    const [first] = handlerToken.getBody();
    signalName = first && first.getName ? first.getName() : String(first && first.value);
  } else if (handlerToken.isCallable) {
    signalName = handlerToken.getName();
  } else {
    signalName = String(handlerToken.value);
  }
  const propArgs = propBody[0].getBody();
  const propName = compileToken(propArgs[0], ctx);
  const fallback = compileToken(propArgs[1], ctx);
  const rootArg = ctx.shadow ? ", host.shadowRoot" : "";
  return `$.on(${eventName}, ${selector}, () => { ${signalName}.set($.prop(host, ${propName}, ${fallback})); }${rootArg})`;
}
function compileDirectiveObject(token, ctx) {
  const { value } = token;
  const keys2 = Object.keys(value || {});
  if (keys2.length > 1 && !value.try && !value.if && !value.match && (value.let || value.while || value.loop || value.do)) {
    const statements = [];
    let tail2 = "undefined";
    keys2.forEach((key, idx) => {
      if (key === "rescue" && value.try)
        return;
      const single = { [key]: value[key] };
      const out = compileDirectiveObject({ value: single }, { ...ctx, autoPrintExpressions: false });
      if (!out)
        return;
      if (idx === keys2.length - 1) {
        tail2 = out.replace(/;\s*$/, "");
      } else {
        statements.push(`${out.replace(/;\s*$/, "")};`);
      }
    });
    return `(() => { ${statements.join(" ")} return ${tail2}; })()`;
  }
  if (value.render) {
    return compileRenderDirective(value.render.getBody(), value, ctx);
  }
  if (value.on && value.prop) {
    return compileOnPropDirective(value.on.getBody(), value.prop.getBody(), ctx);
  }
  if (value.on) {
    return compileOnDirective(value.on.getBody(), ctx);
  }
  if (value.if) {
    return compileIfDirective(value, ctx);
  }
  if (value.do) {
    return compileDoDirective(value.do.getBody(), ctx);
  }
  if (value.let) {
    return compileLetDirective(value.let.getBody(), ctx);
  }
  if (value.match) {
    return compileMatchDirective(value.match.getBody(), ctx);
  }
  if (value.while) {
    return compileWhileDirective(value.while.getBody(), ctx);
  }
  if (value.loop) {
    return compileLoopDirective(value.loop.getBody(), ctx);
  }
  if (value.try) {
    return compileTryDirective(value, ctx);
  }
  if (value.export) {
    return compileExportDirective(value.export.getBody(), ctx);
  }
  if (value.else) {
    return compileExpression(value.else.getBody(), ctx);
  }
  if (value.import) {
    return "";
  }
  if (value.html) {
    return compileHtmlDirective(value.html.getBody(), ctx);
  }
  if (value.signal) {
    return compileSignalDirective(value.signal.getBody(), ctx);
  }
  if (value.computed) {
    return compileComputedDirective(value.computed.getBody(), ctx);
  }
  if (value.style) {
    return compileStyleDirective(value.style.getBody(), ctx);
  }
  throw new Error(`Unsupported directive object: ${Object.keys(value).join(", ")}`);
}
function compileDefinition(token, asStatement = false, ctx = { signalVars: new Set }) {
  const name = token.getName();
  const [head2] = token.getBody();
  const declConst = ctx.exportDefinitions ? "export const" : "const";
  const declLet = ctx.exportDefinitions ? "export let" : "let";
  if (!head2)
    return asStatement ? `${declConst} ${name} = undefined;` : `${declConst} ${name} = undefined`;
  if (head2.isCallable) {
    const args = head2.hasArgs ? head2.getArgs().map((arg) => compileToken(arg, ctx)).join(", ") : "";
    const body = head2.hasBody ? compileExpression(head2.getBody(), ctx) : "undefined";
    const out2 = `${declConst} ${name} = (${args}) => (${body})`;
    return asStatement ? `${out2};` : out2;
  }
  if (head2.isObject && head2.value && head2.value.signal) {
    if (head2.value.prop) {
      const propArgs = head2.value.prop.getBody()[0].getBody();
      const propName = compileToken(propArgs[0], ctx);
      const fallback = compileToken(propArgs[1], ctx);
      const out3 = `${declConst} ${name} = $.signal($.prop(host, ${propName}, ${fallback}), ${JSON.stringify(name)})`;
      return asStatement ? `${out3};` : out3;
    }
    const out2 = `${declConst} ${name} = $.signal(${compileExpression(head2.value.signal.getBody(), ctx)}, ${JSON.stringify(name)})`;
    return asStatement ? `${out2};` : out2;
  }
  if (head2.isObject && head2.value && head2.value.computed) {
    const out2 = `${declConst} ${name} = $.computed(() => ${compileExpression(head2.value.computed.getBody(), ctx)})`;
    return asStatement ? `${out2};` : out2;
  }
  const out = `${declLet} ${name} = ${compileExpression(token.getBody(), ctx)}`;
  return asStatement ? `${out};` : out;
}
function compileStatement(tokens, ctx, statementIndex) {
  if (!tokens.length)
    return "";
  const shouldPrint = ctx.printStatements && ctx.printStatements.has(statementIndex);
  const autoPrint = !!ctx.autoPrintExpressions;
  if (tokens.length === 1) {
    const [token] = tokens;
    if (token.isCallable && token.getName()) {
      return `${compileDefinition(token, false, ctx)};`;
    }
    if (token.isObject) {
      const out3 = compileDirectiveObject(token, ctx);
      if (!out3)
        return "";
      return `${out3};`;
    }
    const out2 = compileToken(token, ctx);
    if (shouldPrint || autoPrint)
      return `console.log(${out2});`;
    return `${out2};`;
  }
  const hasOperator = tokens.some((token) => OPERATOR.get(token.type));
  const looksLikeCall = tokens.length === 2 && tokens[0].isLiteral && tokens[1].type === BLOCK && tokens[1].hasArgs && !tokens[1].hasBody;
  if (!hasOperator && !looksLikeCall) {
    const exprs = tokens.map((token) => compileToken(token, ctx)).join(", ");
    if (shouldPrint || autoPrint)
      return `console.log(${exprs});`;
    return `${exprs};`;
  }
  const out = compileExpression(tokens, ctx);
  if (shouldPrint || autoPrint)
    return `console.log(${out});`;
  return `${out};`;
}
function collectShadowFlag(statements) {
  return statements.some((tokens) => {
    if (tokens.length !== 1)
      return false;
    const [token] = tokens;
    return token.isObject && token.value && token.value.shadow;
  });
}
function collectSignalBindings(statements) {
  const signalVars = new Set;
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token.isCallable || !token.getName())
      return;
    const [head2] = token.getBody();
    if (head2 && head2.isObject && head2.value && head2.value.signal) {
      signalVars.add(token.getName());
    }
  });
  return signalVars;
}
function collectAtomicClasses(statements) {
  const classes = new Set;
  function pushClassAttr(value) {
    if (typeof value !== "string")
      return;
    value.split(/\s+/).filter(Boolean).forEach((name) => classes.add(name));
  }
  function walkTagNode(node) {
    if (!node || typeof node !== "object")
      return;
    pushClassAttr(node.attrs && node.attrs.class);
    (node.children || []).forEach((child) => {
      if (child && typeof child === "object" && !Array.isArray(child) && child.name) {
        walkTagNode(child);
      }
    });
  }
  function walkToken(token) {
    if (!token || typeof token !== "object")
      return;
    if (token.isTag && token.value) {
      walkTagNode(token.value);
    }
    if (token.value && Array.isArray(token.value.args) && typeof token.getArgs === "function") {
      token.getArgs().forEach(walkToken);
    }
    if (token.value && Array.isArray(token.value.body) && typeof token.getBody === "function") {
      token.getBody().forEach(walkToken);
    }
    if (token.isObject && token.value) {
      Object.values(token.value).forEach((value) => {
        if (value && value.getBody)
          value.getBody().forEach(walkToken);
      });
    }
    if (token.type === RANGE && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
    if (token.isString && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
  }
  statements.forEach((tokens) => tokens.forEach(walkToken));
  return classes;
}
function collectImportSources(statements) {
  const sources = [];
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token || !token.isObject || !token.value || !token.value.import || !token.value.from)
      return;
    const fromBody = token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === "string" ? fromBody[0].value : null;
    if (source)
      sources.push(source);
  });
  return sources;
}
function stripModuleExports(line) {
  if (!line.startsWith("export "))
    return line;
  if (/^export\s+\{.*\}\s*;?$/.test(line))
    return "";
  return line.replace(/^export\s+/, "");
}
function splitImportsAndBody(compiled) {
  const imports = [];
  const body = [];
  String(compiled || "").split(`
`).forEach((line) => {
    if (!line.trim())
      return;
    if (line.startsWith("// Generated by 10x compiler"))
      return;
    if (line.startsWith("import ")) {
      imports.push(line);
      return;
    }
    const normalized = stripModuleExports(line);
    if (!normalized.trim())
      return;
    body.push(normalized);
  });
  return { imports, body };
}
function compile(source, options = {}) {
  const normalized = String(source || "").replace(/\r\n/g, `
`);
  const ast = Parser.getAST(normalized, "parse");
  const statements = splitStatements(ast);
  const hasShadow = collectShadowFlag(statements);
  const needsDom = collectNeedsDom(statements);
  const hmrEnabled = options.hmr === true && options.module !== false;
  const runtimePath = options.runtimePath || "./runtime";
  const { imports, globals } = collectImportSpecs(statements, runtimePath);
  const ctx = {
    signalVars: collectSignalBindings(statements),
    shadow: hasShadow,
    hmr: hmrEnabled,
    exportDefinitions: options.module !== false && !hasShadow && options.exportAll !== false,
    printStatements: collectPrintStatements(normalized),
    autoPrintExpressions: options.autoPrintExpressions !== false && options.module !== false && !hasShadow
  };
  const proseComments = collectProseComments(normalized, statements.length);
  const lines = statements.reduce((prev, tokens, index) => {
    const compiled = compileStatement(tokens, ctx, index);
    const comments = (proseComments[index] || []).map((line) => `// ${line}`);
    if (comments.length)
      prev.push(...comments);
    if (compiled)
      prev.push(compiled);
    return prev;
  }, []);
  const atomicCss = options.atomicCss === false ? "" : generateAtomicCss(collectAtomicClasses(statements));
  if (atomicCss) {
    const hostArg = hasShadow ? "host, " : "";
    lines.unshift(`$.style(${hostArg}${JSON.stringify(atomicCss)});`);
  }
  const requiresRuntime = lines.some((line) => line.includes("$."));
  const usesRange = lines.some((line) => line.includes("range("));
  const output = [];
  if (options.module !== false) {
    output.push("// Generated by 10x compiler (experimental AST backend)");
    if (usesRange && !imports.some((x2) => x2.source === getPreludePath(runtimePath) && x2.specifiers.includes("range"))) {
      imports.push({ source: getPreludePath(runtimePath), specifiers: ["range"] });
    }
    imports.forEach(({ source: importSource, specifiers }) => {
      output.push(`import { ${specifiers.join(", ")} } from ${JSON.stringify(importSource)};`);
    });
    globals.forEach(({ source: globalSource, specifiers }) => {
      output.push(`const { ${specifiers.join(", ")} } = ${globalSource};`);
    });
    if (requiresRuntime) {
      const importPath = needsDom ? runtimePath : getCoreRuntimePath(runtimePath);
      output.push(`import * as $ from ${JSON.stringify(importPath)};`);
    }
  }
  if (hasShadow) {
    output.push("export function setup(host) {");
    output.push(...lines.map((l2) => "  " + l2));
    output.push("}");
  } else {
    output.push(...lines);
  }
  if (hmrEnabled)
    output.push(...compileHmrFooter());
  return output.join(`
`);
}
function compileBundle(entryPath, options = {}) {
  const readFile = options.readFile;
  const resolveModule = options.resolveModule;
  if (typeof readFile !== "function") {
    throw new Error("compileBundle requires options.readFile(path)");
  }
  if (typeof resolveModule !== "function") {
    throw new Error("compileBundle requires options.resolveModule(specifier, importerPath)");
  }
  const runtimePath = options.runtimePath || "./runtime";
  const shouldBundleImport = typeof options.shouldBundleImport === "function" ? options.shouldBundleImport : (specifier) => specifier.startsWith(".");
  const order = [];
  const seen = new Set;
  const active = new Set;
  const modules = new Map;
  function visit(modulePath) {
    if (seen.has(modulePath))
      return;
    if (active.has(modulePath)) {
      throw new Error(`Circular local import while bundling: ${modulePath}`);
    }
    active.add(modulePath);
    const source = String(readFile(modulePath) || "");
    const normalized = source.replace(/\r\n/g, `
`);
    const ast = Parser.getAST(normalized, "parse");
    const statements = splitStatements(ast);
    const deps = collectImportSources(statements).filter((specifier) => shouldBundleImport(specifier, modulePath)).map((specifier) => resolveModule(specifier, modulePath));
    deps.forEach(visit);
    active.delete(modulePath);
    seen.add(modulePath);
    const compiled = compile(normalized, {
      runtimePath,
      module: true,
      autoPrintExpressions: options.autoPrintExpressions
    });
    modules.set(modulePath, splitImportsAndBody(compiled));
    order.push(modulePath);
  }
  visit(entryPath);
  const importSet = new Set;
  const body = ["// Generated by 10x compiler bundle (experimental resolver backend)"];
  order.forEach((modulePath) => {
    const chunk = modules.get(modulePath);
    if (!chunk)
      return;
    chunk.imports.forEach((line) => importSet.add(line));
  });
  if (importSet.size) {
    body.push(...Array.from(importSet));
    body.push("");
  }
  order.forEach((modulePath) => {
    const chunk = modules.get(modulePath);
    if (!chunk)
      return;
    body.push(`// Module: ${modulePath}`);
    body.push(...chunk.body);
    body.push("");
  });
  while (body.length && !body[body.length - 1].trim())
    body.pop();
  return body.join(`
`);
}
var OPERATOR;
var init_compiler = __esm(() => {
  init_parser();
  init_atoms();
  init_symbols();
  OPERATOR = new Map([
    [PLUS, "+"],
    [MINUS, "-"],
    [MUL, "*"],
    [DIV, "/"],
    [MOD, "%"],
    [EQUAL, "==="],
    [LESS, "<"],
    [LESS_EQ, "<="],
    [GREATER, ">"],
    [GREATER_EQ, ">="],
    [NOT_EQ, "!="],
    [EXACT_EQ, "==="],
    [OR, "||"],
    [LIKE, "~"],
    [PIPE, "|>"]
  ]);
});

// src/runtime/core.js
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
  set(v2) {
    return this._signal.set(v2);
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
function setDevtoolsActive(active) {
  devtoolsActive = active;
}
function isDevtoolsActive() {
  return devtoolsActive;
}
function nextSignalId() {
  const current2 = Number(globalThis.__10x_signal_id_counter || 0) + 1;
  globalThis.__10x_signal_id_counter = current2;
  return current2;
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
        } catch (_2) {}
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
var SIGNAL, MAX_HISTORY = 20, currentEffect = null, devtoolsActive = false, globalRegistry;
var init_core = __esm(() => {
  SIGNAL = Symbol("10x.signal");
  globalRegistry = (() => {
    if (!globalThis.__10x_signals) {
      globalThis.__10x_signals = new Map;
    }
    return globalThis.__10x_signals;
  })();
});

// src/runtime/dom.js
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
function dashCase(input2) {
  return String(input2 || "").replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
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
function style2(hostOrCss, css) {
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
function render2(selectorOrElement, view) {
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
var componentObservers;
var init_dom = __esm(() => {
  init_somedom();
  init_core();
  componentObservers = new WeakMap;
});

// src/runtime/devtools.js
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
    groupHeader.style.cssText = "font-weight:600;margin:0.75rem 0 0.25rem;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;";
    groupHeader.textContent = moduleUrl === "global" ? "Global" : moduleUrl.split("/").pop() || moduleUrl;
    container.appendChild(groupHeader);
    signals.forEach(({ name, value, subsCount, history }) => {
      const isCollapsed = collapsedSignals.has(name);
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
      key.textContent = String(name);
      key.style.color = "#d2a8ff";
      const valueEl = document.createElement("code");
      formatValue(value, valueEl);
      valueEl.style.cursor = "pointer";
      valueEl.title = "Click to copy";
      valueEl.onclick = (e2) => {
        e2.stopPropagation();
        copyToClipboard(JSON.stringify(value));
      };
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
function renderRows(container, registry, collapsedSignals) {
  const entries = Array.from(registry.entries());
  const moduleGroups = new Map;
  entries.forEach(([name, signal2]) => {
    const moduleUrl = signal2._moduleUrl || "global";
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push({
      id: signal2._devtoolsId || null,
      name,
      value: read(signal2),
      subsCount: signal2.subs ? signal2.subs.size : 0,
      history: signal2._history || []
    });
  });
  renderGroupedRows(container, moduleGroups, collapsedSignals, () => renderRows(container, registry, collapsedSignals));
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
      history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY2) : []
    });
  });
  renderGroupedRows(container, moduleGroups, collapsedSignals, () => renderRowsFromSnapshot(container, snapshot, collapsedSignals));
}
function mergeSignalUpdate(snapshot, update) {
  if (!update || typeof update.name !== "string")
    return snapshot;
  const current2 = Array.isArray(snapshot) ? snapshot : [];
  const next = current2.map((entry) => ({ ...entry }));
  const index = next.findIndex((entry) => entry && (update.id != null && entry.id === update.id || entry.name === update.name));
  const history = Array.isArray(update.history) ? update.history.slice(-MAX_HISTORY2) : [{ ts: update.ts || Date.now(), value: update.value }];
  const merged = {
    id: update.id || null,
    name: update.name,
    moduleUrl: update.moduleUrl || "global",
    value: update.value,
    subs: Number.isFinite(update.subs) ? update.subs : 0,
    history
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
  const hmrStatus = document.createElement("div");
  hmrStatus.id = "10x-hmr-status";
  hmrStatus.style.cssText = "font-size:11px;margin-bottom:0.5rem;padding:0.25rem 0.5rem;background:#238636;border-radius:4px;color:#fff;display:none;";
  const body = document.createElement("div");
  panel.appendChild(title);
  panel.appendChild(hmrStatus);
  panel.appendChild(body);
  if (docked && container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }
  setDevtoolsActive(true);
  effect(() => {
    renderRows(body, registry, collapsedSignals);
  });
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
  const input2 = typeof search === "string" ? search : typeof window !== "undefined" && window.location ? window.location.search : "";
  if (!input2)
    return false;
  const params = new URLSearchParams(input2.startsWith("?") ? input2 : `?${input2}`);
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
    } catch (_2) {}
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    return null;
  }
  return start();
}
var MAX_HISTORY2 = 20;
var init_devtools = __esm(() => {
  init_core();
  maybeEnableDevtools();
});

// src/runtime/index.js
var exports_runtime = {};
__export(exports_runtime, {
  untracked: () => untracked,
  style: () => style2,
  signal: () => signal,
  setDevtoolsActive: () => setDevtoolsActive,
  renderShadow: () => renderShadow,
  render: () => render2,
  read: () => read,
  prop: () => prop,
  on: () => on,
  maybeEnableDevtools: () => maybeEnableDevtools,
  isSignal: () => isSignal,
  isDevtoolsActive: () => isDevtoolsActive,
  html: () => html,
  h: () => me,
  getSignalRegistry: () => getSignalRegistry,
  effect: () => effect,
  devtoolsEnabledByQuery: () => devtoolsEnabledByQuery,
  devtools: () => devtools,
  computed: () => computed,
  batch: () => batch,
  SignalProxy: () => SignalProxy
});
var init_runtime = __esm(() => {
  init_core();
  init_dom();
  init_devtools();
});

// src/util.js
function print(...args) {
  process.stdout.write(args.join(""));
}
function markers(color, value) {
  return value.replace(/(?<![{#])\{(.+?)\}/g, (_2, v2) => color.gray(`{${v2}}`));
}
function colorize(type, value, dimmed) {
  const color = dimmed ? ansi_default.dim : ansi_default;
  value = value || literal({ type });
  if (type === EOF)
    return "";
  switch (type) {
    case true:
    case COMMENT:
    case COMMENT_MULTI:
    case CLOSE:
    case OPEN:
    case BEGIN:
    case DONE:
      return color.gray(value);
    case null:
    case EOL:
    case COMMA:
    case RANGE:
    case DOT:
      return color.white(value);
    case CODE:
      return color.cyanBright(value);
    case BOLD:
      return color.redBright.bold(value);
    case ITALIC:
      return color.yellowBright.italic(value);
    case REF:
      value = ansi_default.underline(value);
    case TEXT:
      return color.white(value);
    case LESS:
    case LESS_EQ:
    case GREATER:
    case GREATER_EQ:
    case EXACT_EQ:
    case NOT_EQ:
    case EQUAL:
    case MINUS:
    case PLUS:
    case MUL:
    case DIV:
    case MOD:
    case NOT:
    case SOME:
    case EVERY:
    case MOD:
    case PIPE:
    case BLOCK:
    case MINUS:
    case PLUS:
    case LIKE:
    case OR:
    case OL_ITEM:
    case UL_ITEM:
    case HEADING:
    case BLOCKQUOTE:
      return color.magenta(value);
    case SYMBOL:
      return color.yellow(value);
    case DIRECTIVE:
      return color.magenta(value);
    case STRING:
      value = markers(color, value);
    case REGEX:
      return color.blueBright(value);
    case LITERAL:
      if (value === null)
        return color.yellow(":nil");
      if (value === true)
        return color.yellow(":on");
      if (value === false)
        return color.yellow(":off");
      return color.white(value);
    case NUMBER:
      return color.blue(value);
    default:
      return color.bgRedBright(value);
  }
}
function summary(e2, code, noInfo) {
  return debug(e2, code, noInfo, (source) => {
    try {
      return Parser.getAST(source, "split").map((chunk) => {
        const highlighted = !chunk.lines.includes(e2.line);
        return chunk.body.map((x2) => {
          return serialize(x2, null, (k2, v2) => colorize(k2, v2, highlighted));
        }).join("");
      }).join("");
    } catch (e3) {
      return ansi_default.red(source);
    }
  }, colorize).trim();
}
function inspect(calls) {
  calls.forEach(([type, depth, tokens], key, items2) => {
    const nextItem = items2[key + 1];
    let prefix = "";
    let pivot = "";
    if (!nextItem || nextItem[1] !== depth) {
      pivot = key ? "└─" : "├──";
    } else {
      pivot = "├─";
    }
    if (depth > 1) {
      prefix += `│${Array.from({ length: depth }).join("  ")}${pivot} `;
    } else {
      prefix += `${pivot} `;
    }
    const value = serialize(tokens, true, colorize, type);
    const indent = `             ${type} `.substr(-15);
    print(indent, prefix, value, `
`);
  });
}
async function format5(code, color, inline) {
  print(serialize.call({}, Parser.getAST(code, inline ? "inline" : "raw"), null, color ? colorize : undefined), `
`);
}
async function main(code, raw, env, info, noInfo, prelude) {
  try {
    if (!raw && typeof prelude === "function") {
      code = await prelude(env, code) || code;
    }
    const result = raw ? Parser.getAST(code, "inline", env) : await execute(code, env, info);
    if (execute.failure) {
      throw execute.failure;
    }
    print("\r");
    if (info) {
      const { length } = execute.info.calls;
      if (length < 100) {
        inspect(execute.info.calls);
      } else {
        inspect([execute.info.calls[0]]);
      }
      print(`               ├ ${colorize(true, `${length} step${length === 1 ? "" : "s"}`)} 
`);
      print("               └ ", serialize(result, null, colorize), `
`);
    } else if (result) {
      print(serialize(result, null, colorize), `
`);
    }
  } catch (e2) {
    print(summary(e2, code, noInfo), `
`);
  }
}
var init_util = __esm(() => {
  init_ansi();
  init_parser();
  init_lib();
  init_helpers();
  init_symbols();
});

// src/main.js
var exports_main = {};
__export(exports_main, {
  useCurrencies: () => useCurrencies,
  serialize: () => serialize,
  repr: () => repr,
  raise: () => raise,
  only: () => only,
  main: () => main,
  hasDiff: () => hasDiff,
  format: () => format5,
  execute: () => execute,
  evaluate: () => evaluate,
  deindent: () => deindent,
  debug: () => debug,
  createEnv: () => createEnv2,
  copy: () => copy,
  compileBundle: () => compileBundle,
  compile: () => compile,
  compact: () => compact,
  check: () => check,
  assert: () => assert,
  argv: () => argv,
  applyAdapter: () => applyAdapter2,
  UL_ITEM: () => UL_ITEM,
  Token: () => Token,
  TEXT: () => TEXT,
  TABLE: () => TABLE,
  SYMBOL_TYPES: () => SYMBOL_TYPES,
  SYMBOL: () => SYMBOL,
  STRING: () => STRING,
  SPREAD: () => SPREAD,
  SOME: () => SOME,
  Runtime: () => exports_runtime,
  REGEX: () => REGEX,
  REF: () => REF,
  RANGE: () => RANGE,
  Parser: () => Parser,
  PLUS: () => PLUS,
  PIPE: () => PIPE,
  OR: () => OR,
  OPEN: () => OPEN,
  OL_ITEM: () => OL_ITEM,
  NUMBER: () => NUMBER,
  NOT_EQ: () => NOT_EQ,
  NOT: () => NOT,
  MUL: () => MUL,
  MOD: () => MOD,
  MINUS: () => MINUS,
  LITERAL: () => LITERAL,
  LIKE: () => LIKE,
  LESS_EQ: () => LESS_EQ,
  LESS: () => LESS,
  ITALIC: () => ITALIC,
  HEADING: () => HEADING,
  GREATER_EQ: () => GREATER_EQ,
  GREATER: () => GREATER,
  FFI: () => FFI,
  Expr: () => Expr,
  Env: () => Env,
  EXACT_EQ: () => EXACT_EQ,
  EVERY: () => EVERY,
  EQUAL: () => EQUAL,
  EOL: () => EOL,
  EOF: () => EOF,
  DOT: () => DOT,
  DONE: () => DONE,
  DIV: () => DIV,
  DIRECTIVE: () => DIRECTIVE,
  DERIVE_METHODS: () => DERIVE_METHODS,
  CONTROL_TYPES: () => CONTROL_TYPES,
  COMMENT_MULTI: () => COMMENT_MULTI,
  COMMENT: () => COMMENT,
  COMMA: () => COMMA,
  CODE: () => CODE,
  CLOSE: () => CLOSE,
  BOLD: () => BOLD,
  BLOCKQUOTE: () => BLOCKQUOTE,
  BLOCK: () => BLOCK,
  BEGIN: () => BEGIN
});
function applyAdapter2(adapter, options) {
  applyAdapter({
    Env,
    Expr,
    execute,
    evaluate
  }, adapter, options);
}
function createEnv2(adapter, options) {
  return createEnv({
    Env,
    Expr,
    execute,
    evaluate
  }, adapter, options);
}
var init_main = __esm(() => {
  init_lib();
  init_env();
  init_expr();
  init_parser();
  init_symbols();
  init_builtins();
  init_compiler();
  init_runtime();
  init_util();
  init_helpers();
  init_symbols();
});

// dist/main.js
var exports_main2 = {};
__export(exports_main2, {
  useCurrencies: () => useCurrencies2,
  serialize: () => serialize2,
  repr: () => repr3,
  raise: () => raise2,
  only: () => only2,
  main: () => main2,
  hasDiff: () => hasDiff2,
  format: () => format32,
  execute: () => execute2,
  evaluate: () => evaluate2,
  deindent: () => deindent2,
  debug: () => debug2,
  createEnv: () => createEnv22,
  copy: () => copy2,
  compileBundle: () => compileBundle2,
  compile: () => compile2,
  compact: () => compact2,
  check: () => check3,
  assert: () => assert2,
  argv: () => argv2,
  applyAdapter: () => applyAdapter22,
  UL_ITEM: () => UL_ITEM2,
  Token: () => Token2,
  TEXT: () => TEXT2,
  TABLE: () => TABLE2,
  SYMBOL_TYPES: () => SYMBOL_TYPES2,
  SYMBOL: () => SYMBOL2,
  STRING: () => STRING2,
  SPREAD: () => SPREAD2,
  SOME: () => SOME2,
  Runtime: () => exports_runtime2,
  REGEX: () => REGEX2,
  REF: () => REF2,
  RANGE: () => RANGE2,
  Parser: () => Parser2,
  PLUS: () => PLUS2,
  PIPE: () => PIPE2,
  OR: () => OR2,
  OPEN: () => OPEN2,
  OL_ITEM: () => OL_ITEM2,
  NUMBER: () => NUMBER2,
  NOT_EQ: () => NOT_EQ2,
  NOT: () => NOT2,
  MUL: () => MUL2,
  MOD: () => MOD2,
  MINUS: () => MINUS2,
  LITERAL: () => LITERAL2,
  LIKE: () => LIKE2,
  LESS_EQ: () => LESS_EQ2,
  LESS: () => LESS2,
  ITALIC: () => ITALIC2,
  HEADING: () => HEADING2,
  GREATER_EQ: () => GREATER_EQ2,
  GREATER: () => GREATER2,
  FFI: () => FFI2,
  Expr: () => Expr2,
  Env: () => Env2,
  EXACT_EQ: () => EXACT_EQ2,
  EVERY: () => EVERY2,
  EQUAL: () => EQUAL2,
  EOL: () => EOL2,
  EOF: () => EOF2,
  DOT: () => DOT2,
  DONE: () => DONE2,
  DIV: () => DIV2,
  DIRECTIVE: () => DIRECTIVE2,
  DERIVE_METHODS: () => DERIVE_METHODS2,
  CONTROL_TYPES: () => CONTROL_TYPES2,
  COMMENT_MULTI: () => COMMENT_MULTI2,
  COMMENT: () => COMMENT2,
  COMMA: () => COMMA2,
  CODE: () => CODE2,
  CLOSE: () => CLOSE2,
  BOLD: () => BOLD2,
  BLOCKQUOTE: () => BLOCKQUOTE2,
  BLOCK: () => BLOCK2,
  BEGIN: () => BEGIN2
});

class Converter2 {
  constructor(numerator, denominator) {
    this.val = denominator ? numerator / denominator : numerator;
    this.origin = null;
    this.destination = null;
  }
  from(from) {
    if (this.destination) {
      throw new Error(".from must be called before .to");
    }
    this.origin = this.getUnit(from);
    if (!this.origin) {
      this.throwUnsupportedUnitError(from);
    }
    return this;
  }
  to(to) {
    if (!this.origin) {
      throw new Error(".to must be called after .from");
    }
    this.destination = this.getUnit(to);
    if (!this.destination) {
      this.throwUnsupportedUnitError(to);
    }
    if (this.origin.abbr === this.destination.abbr) {
      return this.val;
    }
    if (this.destination.measure !== this.origin.measure) {
      throw new Error(`Cannot convert incompatible measures of ${this.destination.measure} and ${this.origin.measure}`);
    }
    let result = this.val * this.origin.unit.to_anchor;
    if (this.origin.unit.anchor_shift) {
      result -= this.origin.unit.anchor_shift;
    }
    if (this.origin.system !== this.destination.system) {
      const anchor = measures2[this.origin.measure]._anchors[this.origin.system];
      if (typeof anchor.transform === "function") {
        result = anchor.transform(result);
      } else {
        result *= anchor.ratio;
      }
    }
    if (this.destination.unit.anchor_shift) {
      result += this.destination.unit.anchor_shift;
    }
    return result / this.destination.unit.to_anchor;
  }
  toBest(opts = {}) {
    if (!this.origin) {
      throw new Error(".toBest must be called after .from");
    }
    const options = {
      exclude: [],
      cutOffNumber: 1,
      ...opts
    };
    let best;
    this.possibilities().forEach((possibility) => {
      const unit = this.describe(possibility);
      const isIncluded = !options.exclude.includes(possibility);
      if (isIncluded && unit.system === this.origin.system) {
        const result = this.to(possibility);
        if (!best || result >= options.cutOffNumber && result < best.val) {
          best = {
            val: result,
            unit: possibility,
            singular: unit.singular,
            plural: unit.plural
          };
        }
      }
    });
    return best;
  }
  getUnit(abbr) {
    let found = null;
    Object.keys(measures2).some((measure) => {
      const systems = measures2[measure];
      return Object.keys(systems).some((system) => {
        if (system === "_anchors")
          return false;
        const units = systems[system];
        return Object.keys(units).some((testAbbr) => {
          if (testAbbr !== abbr)
            return false;
          found = {
            abbr,
            measure,
            system,
            unit: units[testAbbr]
          };
          return true;
        });
      });
    });
    return found;
  }
  describe(abbr) {
    const resp = this.getUnit(abbr);
    if (!resp) {
      this.throwUnsupportedUnitError(abbr);
    }
    return {
      abbr: resp.abbr,
      measure: resp.measure,
      system: resp.system,
      singular: resp.unit.name.singular,
      plural: resp.unit.name.plural
    };
  }
  list(measure) {
    const list2 = [];
    Object.keys(measures2).forEach((testMeasure) => {
      if (measure && measure !== testMeasure)
        return;
      const systems = measures2[testMeasure];
      Object.keys(systems).forEach((system) => {
        if (system === "_anchors")
          return;
        const units = systems[system];
        Object.keys(units).forEach((abbr) => {
          const unit = units[abbr];
          list2.push({
            abbr,
            measure: testMeasure,
            system,
            singular: unit.name.singular,
            plural: unit.name.plural
          });
        });
      });
    });
    return list2;
  }
  throwUnsupportedUnitError(what) {
    const validUnits = [];
    Object.keys(measures2).forEach((measure) => {
      const systems = measures2[measure];
      Object.keys(systems).forEach((system) => {
        if (system === "_anchors")
          return;
        validUnits.push(...Object.keys(systems[system]));
      });
    });
    throw new Error(`Unsupported unit ${what}, use one of: ${validUnits.join(", ")}`);
  }
  possibilities(measure) {
    const possibilities = [];
    if (!this.origin && !measure) {
      Object.keys(measures2).forEach((group) => {
        Object.keys(measures2[group]).forEach((system) => {
          if (system === "_anchors")
            return;
          possibilities.push(...Object.keys(measures2[group][system]));
        });
      });
      return possibilities;
    }
    const targetMeasure = measure || this.origin.measure;
    Object.keys(measures2[targetMeasure]).forEach((system) => {
      if (system === "_anchors")
        return;
      possibilities.push(...Object.keys(measures2[targetMeasure][system]));
    });
    return possibilities;
  }
  measures() {
    return Object.keys(measures2);
  }
}
function convert2(value) {
  return new Converter2(value);
}
function getConvert2() {
  if (!convertCache2) {
    convertCache2 = new convert2;
  }
  return convertCache2;
}
function ensureCurrencyMappings2() {
  if (currencyMappingsReady2)
    return;
  currencyMappingsReady2 = true;
  Object.assign(CURRENCY_SYMBOLS2, currency_symbols_default2);
  Object.keys(CURRENCY_SYMBOLS2).forEach((key) => {
    const symbol = CURRENCY_SYMBOLS2[key];
    CURRENCY_MAPPINGS2[symbol] = key;
    DEFAULT_MAPPINGS2[key] = key;
  });
}
function ensureDefaultMappings2() {
  ensureCurrencyMappings2();
  if (unitMappingsReady2)
    return DEFAULT_MAPPINGS2;
  unitMappingsReady2 = true;
  const convert22 = getConvert2();
  const groups = convert22.measures();
  TIME_UNITS2.push(...convert22.list("time").map((x2) => x2.abbr).sort());
  groups.forEach((group) => {
    convert22.list(group).forEach((unit) => {
      const abbr = unit.abbr;
      const plural = unit.plural;
      const singular = unit.singular;
      DEFAULT_MAPPINGS2[abbr] = abbr;
      if (!plural.includes(" ") && singular !== plural) {
        DEFAULT_MAPPINGS2[plural.toLowerCase()] = abbr;
        DEFAULT_MAPPINGS2[singular.toLowerCase()] = abbr;
        DEFAULT_INFLECTIONS2[abbr] = [singular.toLowerCase(), plural.toLowerCase()];
      }
    });
  });
  return DEFAULT_MAPPINGS2;
}
async function useCurrencies2(opts, fromDate) {
  ensureCurrencyMappings2();
  const today2 = fromDate || new Date().toISOString().substr(0, 10);
  const {
    key,
    read: read2,
    write,
    exists,
    resolve
  } = opts;
  if (!exists(key) || read2(key).date !== today2) {
    write(key, JSON.stringify({
      ...await resolve(),
      date: today2
    }));
  }
  Object.assign(CURRENCY_EXCHANGES2, read2(key).rates);
}
function g2(t) {
  return e2.test(t);
}
function y2(e22) {
  return !(!a2(e22) || !u2(e22[0])) || !!(e22 && a2(e22) && g2(e22[0])) && !!(f2(e22[1]) && e22.length >= 2);
}
function v2(e22) {
  return e22 === null || !u2(e22) && (a2(e22) ? e22.length === 0 : f2(e22) ? Object.keys(e22).length === 0 : d2(e22) || e22 === false);
}
function _2(e22) {
  if (y2(e22) && f2(e22[1]))
    return e22[1].key;
}
function E2(e22) {
  if (e22.nodeType === 1)
    return e22.getAttribute("data-key") || undefined;
}
function N2(e22, t) {
  if (typeof e22 != typeof t)
    return true;
  if (a2(e22)) {
    if (!a2(t) || e22.length !== t.length)
      return true;
    for (let n = 0;n < t.length; n += 1)
      if (N2(e22[n], t[n]))
        return true;
  } else {
    if (!f2(e22) || !f2(t))
      return e22 !== t;
    {
      const n = Object.keys(e22).sort(), s = Object.keys(t).sort();
      if (N2(n, s))
        return true;
      for (let r22 = 0;r22 < n.length; r22 += 1)
        if (N2(e22[n[r22]], t[s[r22]]))
          return true;
    }
  }
}
function k2(e22) {
  return e22.slice(2);
}
function x2(e22) {
  return y2(e22) ? e22 : a2(e22) ? e22.reduce((e3, t) => e3.concat(y2(t) ? [t] : x2(t)), []) : v2(e22) ? [] : [e22];
}
function D2(e22) {
  return e22.attributes && !e22.getAttributeNames ? e22.attributes : e22.getAttributeNames().reduce((t, n) => (t[n.replace("data-", "@")] = e22[n] || e22.getAttribute(n), t), {});
}
function S2(e22, t) {
  if (!d2(e22)) {
    if (a2(e22))
      return e22.map((e3) => S2(e3, t));
    if (typeof NodeList != "undefined" && e22 instanceof NodeList)
      return S2(e22.values(), t);
    if (e22.nodeType === 3)
      return e22.nodeValue;
    if (e22.nodeType === 1) {
      const n = [];
      return t && e22.childNodes.forEach((e3) => {
        n.push(S2(e3, t));
      }), [e22.tagName.toLowerCase(), D2(e22), n];
    }
    return e22.childNodes ? e22.childNodes.map((e3) => S2(e3, t)) : S2([...e22], t);
  }
}

class L2 {
  constructor() {
    this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e22) {
    L2.valid(e22) ? e22.childNodes.forEach((e3) => {
      this.appendChild(e3);
    }) : this.childNodes.push(e22);
  }
  mount(e22, t) {
    for (;this.childNodes.length > 0; ) {
      const n = this.childNodes.shift();
      t ? e22.insertBefore(n, t) : e22.appendChild(n);
    }
  }
  static valid(e22) {
    return e22 instanceof L2;
  }
  static from(e22, t) {
    const n = new L2;
    return t = t.filter((e3) => e3 !== null), n.vnode = t, t.forEach((t2) => {
      n.appendChild(e22(t2));
    }), n;
  }
}
function ee2(e22) {
  let t = null;
  const n = new Set, s = new Set;
  function r22() {
    typeof t == "function" && (t(), t = null), n.forEach((e3) => e3.delete(r22)), n.clear(), s.forEach((e3) => e3.subscribers.delete(r22)), s.clear();
    const i22 = G2;
    G2 = r22, r22._deps = n, r22._signals = s;
    try {
      t = e22();
    } finally {
      G2 = i22;
    }
  }
  return r22._deps = n, r22._signals = s, r22(), function() {
    typeof t == "function" && t(), n.forEach((e3) => e3.delete(r22)), s.forEach((e3) => {
      e3.subscribers.delete(r22), e3.subscribers.size === 0 && e3.wasEmpty && e3.options?.onUnsubscribe && e3.options.onUnsubscribe();
    }), r22._externalDisposers && (r22._externalDisposers.forEach((e3) => e3()), r22._externalDisposers.clear());
  };
}
function re2(e22) {
  return e22.indexOf(se2) === 0;
}
function ie2(e22) {
  return e22.indexOf("d:") === 0;
}
function oe2(e22, t, n) {
  const s = t.slice(2);
  e22._signalDisposers || (e22._signalDisposers = new Map), e22._signalDisposers.has(t) && e22._signalDisposers.get(t)();
  const r22 = ee2(() => {
    const t2 = n.value;
    s === "textContent" ? e22.textContent = t2 == null ? "" : String(t2) : s === "innerHTML" ? e22.innerHTML = t2 == null ? "" : String(t2) : s.startsWith("style.") ? e22.style[s.slice(6)] = t2 : e22[s] = t2;
  });
  if (!r22._deps?.size && typeof n.subscribe == "function") {
    const i22 = n.subscribe(() => {
      const t2 = n.peek();
      s === "textContent" ? e22.textContent = t2 == null ? "" : String(t2) : s === "innerHTML" ? e22.innerHTML = t2 == null ? "" : String(t2) : s.startsWith("style.") ? e22.style[s.slice(6)] = t2 : e22[s] = t2;
    }), o = r22;
    return void e22._signalDisposers.set(t, () => {
      o(), i22();
    });
  }
  e22._signalDisposers.set(t, r22);
}
function ce2(e22) {
  e22._signalDisposers && (e22._signalDisposers.forEach((e3) => e3()), e22._signalDisposers.clear());
}
function ae2(e22, t, n, s) {
  Object.entries(t).forEach(([t2, o]) => {
    if (t2 !== "key" && t2 !== "open")
      if (t2 === "ref")
        e22.oncreate = (e3) => {
          o.current = e3;
        };
      else if (t2 === "@html")
        e22.innerHTML = o;
      else if (re2(t2)) {
        if (o && typeof o == "object" && "value" in o) {
          oe2(e22, t2, o);
          const n2 = e22.teardown;
          e22.teardown = () => {
            ce2(e22), n2 && n2();
          };
        }
      } else if (ie2(t2)) {
        if (o && typeof o == "object" && "value" in o) {
          (function(e3, t3, n3) {
            const s2 = t3.slice(2);
            let r22;
            switch (e3._directiveDisposers || (e3._directiveDisposers = new Map), e3._directiveDisposers.has(t3) && e3._directiveDisposers.get(t3)(), s2) {
              case "show":
                if (r22 = ee2(() => {
                  e3.style.display = n3.value ? "" : "none";
                }), !r22._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.style.display = n3.peek() ? "" : "none";
                  }), s3 = r22;
                  r22 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "hide":
                if (r22 = ee2(() => {
                  e3.style.display = n3.value ? "none" : "";
                }), !r22._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.style.display = n3.peek() ? "none" : "";
                  }), s3 = r22;
                  r22 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "class": {
                const t4 = n3.className || "active";
                if (r22 = ee2(() => {
                  e3.classList.toggle(t4, !!n3.value);
                }), !r22._deps?.size && typeof n3.subscribe == "function") {
                  const s3 = n3.subscribe(() => {
                    e3.classList.toggle(t4, !!n3.peek());
                  }), i22 = r22;
                  r22 = () => {
                    i22(), s3();
                  };
                }
                break;
              }
              case "model": {
                const t4 = n3, s3 = e3;
                s3.value = t4.value;
                const i22 = () => {
                  t4.value = s3.value;
                };
                s3.addEventListener("input", i22), r22 = ee2(() => {
                  document.activeElement !== s3 && (s3.value = t4.value);
                }), r22._cleanup = () => {
                  s3.removeEventListener("input", i22);
                };
                break;
              }
              case "text":
                if (r22 = ee2(() => {
                  e3.textContent = n3.value;
                }), !r22._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.textContent = n3.peek();
                  }), s3 = r22;
                  r22 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "html":
                if (r22 = ee2(() => {
                  e3.innerHTML = n3.value;
                }), !r22._deps?.size && typeof n3.subscribe == "function") {
                  const t4 = n3.subscribe(() => {
                    e3.innerHTML = n3.peek();
                  }), s3 = r22;
                  r22 = () => {
                    s3(), t4();
                  };
                }
                break;
              case "click-outside": {
                const t4 = n3, s3 = (n4) => {
                  e3.contains(n4.target) || t4(n4);
                };
                document.addEventListener("click", s3), r22 = () => document.removeEventListener("click", s3);
                break;
              }
              default:
                return;
            }
            e3._directiveDisposers.set(t3, r22);
          })(e22, t2, o);
          const n2 = e22.teardown;
          e22.teardown = () => {
            (function(e3) {
              e3._directiveDisposers && (e3._directiveDisposers.forEach((e4) => {
                e4._cleanup && e4._cleanup(), e4();
              }), e3._directiveDisposers.clear());
            })(e22), n2 && n2();
          };
        }
      } else if (t2.indexOf("class:") === 0)
        o ? e22.classList.add(t2.substr(6)) : e22.classList.remove(t2.substr(6));
      else if (t2.indexOf("style:") === 0)
        e22.style[T2(t2.substr(6))] = o;
      else {
        const c22 = t2.replace("@", "data-").replace(r2, "");
        if (b2(o)) {
          oe2(e22, `${se2}${c22}`, o);
          const t3 = e22.teardown;
          return void (e22.teardown = () => {
            ce2(e22), t3 && t3();
          });
        }
        let l22 = o !== true ? o : !!c22.includes("-") || c22;
        p2(l22) && (l22 = u2(s) && s(e22, c22, l22) || l22, l22 = l22 !== e22 ? l22 : null, l22 = a2(l22) ? l22.join("") : l22);
        const d22 = v2(l22);
        if (n && t2 !== c22)
          return void (d22 ? e22.removeAttributeNS(i2, c22) : e22.setAttributeNS(i2, c22, l22));
        d22 ? e22.removeAttribute(c22) : h2(l22) && e22.setAttribute(c22, l22);
      }
  });
}

class le2 {
  constructor(e22) {
    this.target = l2(e22) ? document.querySelector(e22) : e22, this.childNodes = [], this.nodeType = 11;
  }
  appendChild(e22) {
    this.childNodes.push(e22);
  }
  mount() {
    this.target && this.childNodes.forEach((e22) => {
      this.target.appendChild(e22);
    });
  }
  unmount() {
    this.childNodes.forEach((e22) => {
      e22.parentNode && e22.parentNode.removeChild(e22);
    }), this.childNodes = [];
  }
  static valid(e22) {
    return e22 instanceof le2;
  }
  static from(e22, t, n) {
    const s = new le2(n);
    return t.forEach((t2) => {
      s.appendChild(e22(t2));
    }), s;
  }
}
function de2(e22, t = (e3) => e3()) {
  const n = () => e22 && e22.remove();
  return t === false ? n() : Promise.resolve().then(() => t(n));
}
function fe2(e22, t, n, s) {
  const r22 = pe2(t, n, s);
  return le2.valid(r22) ? r22.mount() : L2.valid(r22) ? r22.mount(e22) : e22.appendChild(r22), r22;
}
function pe2(e22, t, n) {
  if (d2(e22))
    throw new Error(`Invalid vnode, given '${e22}'`);
  if (!y2(e22))
    return a2(e22) ? L2.from((e3) => pe2(e3, t, n), e22) : b2(e22) ? function(e3) {
      const t2 = document.createTextNode(String(e3.peek())), n2 = ee2(() => {
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
    }(e22) : h2(e22) && document.createTextNode(String(e22)) || e22;
  if (!a2(e22))
    return e22;
  if (n && n.tags && n.tags[e22[0]])
    return pe2(n.tags[e22[0]](e22[1], k2(e22), n), t, n);
  if (!y2(e22))
    return L2.from((e3) => pe2(e3, t, n), e22);
  if (u2(e22[0]))
    return pe2(e22[0](e22[1], e22.slice(2)), t, n);
  if (e22[0] === "portal") {
    const [, s2, ...r3] = e22;
    return le2.from((e3) => pe2(e3, t, n), r3, s2.target);
  }
  const s = t || e22[0].indexOf("svg") === 0, [r22, i22, ...o] = e22;
  let c22 = s ? document.createElementNS("http://www.w3.org/2000/svg", r22) : document.createElement(r22);
  if (i22 && i22.key && c22.setAttribute("data-key", i22.key), u2(n) && (c22 = n(c22, r22, i22, o) || c22), u2(c22))
    return pe2(c22(), s, n);
  v2(i22) || ae2(c22, i22, s, n), u2(c22.oncreate) && c22.oncreate(c22), u2(c22.enter) && c22.enter(), c22.remove = () => Promise.resolve().then(() => u2(c22.ondestroy) && c22.ondestroy(c22)).then(() => u2(c22.teardown) && c22.teardown()).then(() => u2(c22.exit) && c22.exit()).then(() => q2(c22)), o.forEach((e3) => {
    he2(c22, e3, s, n);
  });
  const l22 = c22.childNodes;
  if (l22.length > 0) {
    const e3 = c22.teardown;
    c22.teardown = () => {
      for (let e4 = 0;e4 < l22.length; e4++) {
        const t2 = l22[e4];
        t2._signalDispose && t2._signalDispose();
      }
      e3 && e3();
    };
  }
  return c22;
}
function he2(e22, t, n, s) {
  return u2(t) && (s = t, t = e22, e22 = undefined), u2(n) && (s = n, n = null), d2(t) && (t = e22, e22 = undefined), e22 || (e22 = document.body), typeof e22 == "string" && (e22 = document.querySelector(e22)), m2(t) ? t.forEach((t2) => {
    he2(e22, t2, n, s);
  }) : d2(t) || (e22 = fe2(e22, t, n, s)), e22;
}
async function be2(e22, t, n, s, r22) {
  return h2(n) || !y2(t) || t[0] !== n[0] || e22.nodeType !== 1 ? function(e3, t2, n2, s2) {
    if (u2(e3.onreplace))
      return e3.onreplace(t2, n2, s2);
    const r3 = pe2(t2, n2, s2);
    return le2.valid(r3) ? (r3.mount(), e3.remove()) : L2.valid(r3) ? q2(e3, r3) : e3.replaceWith(r3), r3;
  }(e22, n, s, r22) : (function(e3, t2, n2, s2, r3) {
    let i22;
    const o = Object.keys(t2).concat(Object.keys(n2)).reduce((e4, s3) => ((s3 in t2) && !(s3 in n2) ? (e4[s3] = null, i22 = true) : N2(t2[s3], n2[s3]) && (e4[s3] = n2[s3], i22 = true), e4), {});
    return i22 && (Object.keys(t2).forEach((t3) => {
      if (re2(t3) && !(t3 in n2) && e3._signalDisposers && e3._signalDisposers.has(t3) && (e3._signalDisposers.get(t3)(), e3._signalDisposers.delete(t3)), ie2(t3) && !(t3 in n2) && e3._directiveDisposers && e3._directiveDisposers.has(t3)) {
        const n3 = e3._directiveDisposers.get(t3);
        n3._cleanup && n3._cleanup(), n3(), e3._directiveDisposers.delete(t3);
      }
    }), ae2(e3, o, s2, r3)), i22;
  }(e22, t[1] || [], n[1] || [], s, r22) && (u2(e22.onupdate) && await e22.onupdate(e22), u2(e22.update) && await e22.update()), n[1] && n[1]["@html"] ? e22 : ge2(e22, k2(t), k2(n), s, r22));
}
async function ge2(e22, t, n, s, r22) {
  if (!t || y2(t) && y2(n))
    return be2(e22, t, n, s, r22);
  if (y2(t)) {
    for (;a2(n) && n.length === 1; )
      n = n[0];
    return ge2(e22, [t], n, s, r22);
  }
  return y2(n) ? be2(e22, t, n, s, r22) : (await async function(e3, t2, n2, s2) {
    const r3 = [], i22 = x2(t2), o = Math.max(e3.childNodes.length, i22.length), c22 = Array.from(e3.childNodes), a22 = new Map, l22 = new Set;
    for (let e4 = 0;e4 < c22.length; e4++) {
      const t3 = E2(c22[e4]);
      t3 && a22.set(t3, { el: c22[e4], index: e4 });
    }
    let u22, f22, p22, h22 = 0;
    for (let t3 = 0;t3 < o; t3 += 1) {
      u22 !== h22 && (f22 = e3.childNodes[h22], p22 = S2(f22), u22 = h22);
      const t4 = i22.shift(), n3 = _2(t4);
      if (d2(t4))
        r3.push({ rm: f22 }), u22 = null;
      else if (d2(p22))
        if (n3 && a22.has(n3) && !l22.has(n3)) {
          const e4 = a22.get(n3).el, s3 = a22.get(n3).index;
          l22.add(n3), s3 < h22 ? (r3.push({ move: e4, target: f22 }), h22++) : (r3.push({ patch: S2(e4), with: t4, target: e4 }), l22.add(n3));
        } else
          r3.push({ add: t4 }), h22++;
      else {
        const e4 = E2(f22);
        if (n3 && n3 === e4 && !l22.has(n3))
          r3.push({ patch: p22, with: t4, target: f22 }), l22.add(n3), h22++;
        else if (n3 && a22.has(n3) && !l22.has(n3)) {
          const e5 = a22.get(n3).el;
          r3.push({ move: e5, target: f22 }), l22.add(n3), h22++;
        } else
          r3.push({ patch: p22, with: t4, target: f22 }), h22++;
      }
    }
    if (h22 !== e3.childNodes.length)
      for (let t3 = e3.childNodes.length;t3 > h22; t3--) {
        const n3 = e3.childNodes[t3 - 1], s3 = E2(n3);
        s3 && l22.has(s3) || r3.push({ rm: n3 });
      }
    for (const t3 of r3)
      t3.rm && await de2(t3.rm), d2(t3.add) || fe2(e3, t3.add, n2, s2), t3.move && (ue2() ? e3.moveBefore(t3.move, t3.target) : e3.insertBefore(t3.move, t3.target)), d2(t3.patch) || await ye2(t3.target, t3.patch, t3.with, n2, s2);
  }(e22, [n], s, r22), e22);
}
async function ye2(e22, t, n, s, r22) {
  if (L2.valid(n)) {
    let t2 = e22;
    for (;n.childNodes.length > 0; ) {
      const s2 = n.childNodes.pop();
      e22.parentNode.insertBefore(s2, t2), t2 = s2;
    }
    return q2(e22), t2;
  }
  return e22.nodeType === 3 && h2(n) ? N2(t, n) && (e22.nodeValue = String(n)) : e22 = await be2(e22, t, n, s, r22), e22;
}
function isVoidTag2(name) {
  return VOID_TAGS2.has(String(name || "").toLowerCase());
}
function fail2(message) {
  throw new Error(message);
}
function isPlain3(value) {
  return value && Object.prototype.toString.call(value) === "[object Object]";
}
function skipSpaces2(input2, state) {
  while (state.i < input2.length && /\s/.test(input2[state.i]))
    state.i++;
}
function consumeOptionalClosingTag2(input2, state, name) {
  let offset = state.i;
  while (offset < input2.length && /\s/.test(input2[offset]))
    offset++;
  if (input2[offset] !== "<" || input2[offset + 1] !== "/")
    return;
  offset += 2;
  const start = offset;
  while (offset < input2.length && /[A-Za-z0-9:_-]/.test(input2[offset]))
    offset++;
  if (offset === start)
    return;
  const closeName = input2.slice(start, offset);
  if (closeName.toLowerCase() !== String(name || "").toLowerCase())
    return;
  while (offset < input2.length && /\s/.test(input2[offset]))
    offset++;
  if (input2[offset] !== ">")
    return;
  state.i = offset + 1;
}
function readName2(input2, state) {
  const start = state.i;
  while (state.i < input2.length && /[A-Za-z0-9:_-]/.test(input2[state.i]))
    state.i++;
  if (state.i === start)
    fail2("Invalid tag name");
  return input2.slice(start, state.i);
}
function readQuoted2(input2, state) {
  const quote3 = input2[state.i++];
  const start = state.i;
  while (state.i < input2.length && input2[state.i] !== quote3)
    state.i++;
  if (state.i >= input2.length)
    fail2("Unterminated attribute string");
  const value = input2.slice(start, state.i);
  state.i++;
  return value;
}
function readUnquoted2(input2, state) {
  const start = state.i;
  while (state.i < input2.length && !/[\s/>]/.test(input2[state.i]))
    state.i++;
  return input2.slice(start, state.i);
}
function parseAttrs2(input2, state) {
  const attrs = {};
  const spreads = [];
  while (state.i < input2.length) {
    skipSpaces2(input2, state);
    if (input2[state.i] === "/" || input2[state.i] === ">")
      break;
    if (input2[state.i] === "{") {
      const spreadExpr = readExpr2(input2, state);
      if (!spreadExpr.expr.startsWith("..."))
        fail2("Only spread expressions are allowed in tag attrs");
      const source = spreadExpr.expr.slice(3).trim();
      if (!source)
        fail2("Missing source after spread operator in tag attrs");
      spreads.push({ expr: source });
      continue;
    }
    const key = readName2(input2, state);
    skipSpaces2(input2, state);
    if (input2[state.i] === "=") {
      state.i++;
      skipSpaces2(input2, state);
      if (input2[state.i] === "{") {
        attrs[key] = readExpr2(input2, state);
      } else if (input2[state.i] === '"' || input2[state.i] === "'") {
        attrs[key] = readQuoted2(input2, state);
      } else {
        attrs[key] = readUnquoted2(input2, state);
      }
    } else {
      attrs[key] = true;
    }
  }
  return { attrs, spreads };
}
function parseText2(input2, state) {
  const start = state.i;
  while (state.i < input2.length) {
    const ch = input2[state.i];
    if (ch === "<")
      break;
    if (ch === "#" && input2[state.i + 1] === "{")
      break;
    state.i++;
  }
  return input2.slice(start, state.i);
}
function readExpr2(input2, state) {
  if (input2[state.i] !== "{")
    fail2("Expecting `{`");
  state.i++;
  let depth = 1;
  let buffer = "";
  let inQuote = null;
  while (state.i < input2.length && depth > 0) {
    const cur = input2[state.i++];
    if (inQuote) {
      buffer += cur;
      if (cur === inQuote && input2[state.i - 2] !== "\\")
        inQuote = null;
      continue;
    }
    if (cur === '"' || cur === "'") {
      inQuote = cur;
      buffer += cur;
      continue;
    }
    if (cur === "{") {
      depth++;
      buffer += cur;
      continue;
    }
    if (cur === "}") {
      depth--;
      if (depth > 0)
        buffer += cur;
      continue;
    }
    buffer += cur;
  }
  if (depth !== 0)
    fail2("Unterminated expression in tag");
  const source = buffer.trim();
  if (source === "@render")
    fail2("Missing expression after @render");
  if (source.startsWith("@render ")) {
    return { expr: source.slice(8).trim() };
  }
  return { expr: source };
}
function parseNode2(input2, state) {
  if (input2[state.i] !== "<")
    fail2("Expecting `<`");
  state.i++;
  const name = readName2(input2, state);
  const { attrs, spreads } = parseAttrs2(input2, state);
  let selfClosing = false;
  if (input2[state.i] === "/") {
    selfClosing = true;
    state.i++;
  }
  if (input2[state.i] !== ">")
    fail2("Expecting `>`");
  state.i++;
  const node = {
    name,
    attrs,
    children: [],
    selfClosing
  };
  if (spreads.length)
    node.spreads = spreads;
  if (selfClosing)
    return node;
  if (isVoidTag2(name)) {
    node.selfClosing = true;
    consumeOptionalClosingTag2(input2, state, name);
    return node;
  }
  while (state.i < input2.length) {
    if (input2[state.i] === "<" && input2[state.i + 1] === "/") {
      state.i += 2;
      const closeName = readName2(input2, state);
      if (closeName !== name)
        fail2(`Mismatched closing tag: </${closeName}>`);
      skipSpaces2(input2, state);
      if (input2[state.i] !== ">")
        fail2("Expecting `>`");
      state.i++;
      return node;
    }
    if (input2[state.i] === "<") {
      node.children.push(parseNode2(input2, state));
      continue;
    }
    if (input2[state.i] === "#" && input2[state.i + 1] === "{") {
      state.i++;
      node.children.push(readExpr2(input2, state));
      continue;
    }
    const text = parseText2(input2, state);
    if (text.length) {
      node.children.push(text);
    }
  }
  fail2(`Missing closing tag for <${name}>`);
}
function escapeText2(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr2(value) {
  return escapeText2(value).replace(/"/g, "&quot;");
}
function parseTag2(input2) {
  if (!input2 || typeof input2 !== "string")
    fail2("Invalid tag input");
  const source = input2.trim();
  const state = { i: 0 };
  const node = parseNode2(source, state);
  skipSpaces2(source, state);
  if (state.i !== source.length)
    fail2("Unexpected trailing content after tag");
  return node;
}
function renderTag2(node) {
  if (!node || typeof node.name !== "string")
    fail2("Invalid tag value");
  const attrs = Object.keys(node.attrs || {}).map((key) => {
    const value = node.attrs[key];
    if (value === true)
      return key;
    return `${key}="${escapeAttr2(String(value))}"`;
  }).join(" ");
  const open = attrs.length ? `<${node.name} ${attrs}` : `<${node.name}`;
  const children = (node.children || []).map((child) => {
    if (typeof child === "string")
      return escapeText2(child);
    if (typeof child === "number" || typeof child === "boolean")
      return escapeText2(String(child));
    if (child && typeof child.expr === "string") {
      return child._resolved !== undefined && child._resolved !== null ? escapeText2(String(child._resolved)) : `#{${child.expr}}`;
    }
    return renderTag2(child);
  }).join("");
  if (node.selfClosing && !children.length) {
    return `${open} />`;
  }
  return `${open}>${children}</${node.name}>`;
}
function asChild2(value) {
  if (value === null || typeof value === "undefined")
    return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (isPlain3(value) && typeof value.name === "string")
    return value;
  return String(value);
}
function composeTag2(node, args) {
  const next = {
    name: node.name,
    attrs: { ...node.attrs || {} },
    children: [...node.children || []],
    selfClosing: false
  };
  let offset = 0;
  if (args[0] && isPlain3(args[0]) && !Array.isArray(args[0]) && !("name" in args[0])) {
    Object.assign(next.attrs, args[0]);
    offset = 1;
  }
  for (let i22 = offset;i22 < args.length; i22++) {
    const child = asChild2(args[i22]);
    if (child !== null)
      next.children.push(child);
  }
  return next;
}

class Token2 {
  constructor(type, text, value, tokenInfo) {
    const {
      line,
      col,
      kind
    } = tokenInfo || {};
    if (kind)
      this.kind = kind;
    this.value = typeof value !== "undefined" && value !== null ? value : text;
    this.type = type;
    this.line = line;
    this.col = col;
  }
  valueOf() {
    return this.value;
  }
  get isRaw() {
    return this.kind === "raw";
  }
  get isMulti() {
    return this.kind === "multi";
  }
  get isMarkup() {
    return this.kind === "markup";
  }
  static get(token, isWeak) {
    if (typeof token === "undefined")
      throw new Error("Invalid token");
    const result = !isWeak || typeof token.value === "undefined" ? token.valueOf() : token.value;
    if (isWeak && token.type === SYMBOL2) {
      return result.substr(1);
    }
    return Array.isArray(result) ? result.map((x22) => {
      if (x22.type === LITERAL2 && x22.value === "_")
        return LITERAL2;
      return Token2.get(x22, isWeak);
    }) : result;
  }
}
function isSymbol2(t) {
  return t && t.type === SYMBOL2;
}
function isDirective2(t) {
  return t && t.type === DIRECTIVE2;
}
function isNumber2(t) {
  return t && t.type === NUMBER2;
}
function isString2(t) {
  return t && t.type === STRING2;
}
function isComma2(t) {
  return t && t.type === COMMA2;
}
function isEqual2(t) {
  return t && t.type === EQUAL2;
}
function isBlock2(t) {
  return t && t.type === BLOCK2;
}
function isRange2(t) {
  return t && t.type === RANGE2;
}
function isBegin2(t) {
  return t && t.type === BEGIN2;
}
function isSome2(t) {
  return t && t.type === SOME2;
}
function isEvery2(t) {
  return t && t.type === EVERY2;
}
function isDone2(t) {
  return t && t.type === DONE2;
}
function isClose2(t) {
  return t && t.type === CLOSE2;
}
function isOpen2(t) {
  return t && t.type === OPEN2;
}
function isPipe2(t) {
  return t && t.type === PIPE2;
}
function isText2(t) {
  return t && t.type === TEXT2;
}
function isCode2(t) {
  return t && t.type === CODE2;
}
function isDot2(t) {
  return t && t.type === DOT2;
}
function isMod2(t) {
  return t && t.type === MOD2;
}
function isNot2(t) {
  return t && t.type === NOT2;
}
function isRef2(t) {
  return t && t.type === REF2;
}
function isOR2(t) {
  return t && t.type === OR2;
}
function isEOF2(t) {
  return t && t.type === EOF2;
}
function isEOL2(t) {
  return t && t.type === EOL2;
}
function isInvokable2(t) {
  return t && INVOKE_TYPES2.includes(t.type);
}
function isComment2(t) {
  return t && COMMENT_TYPES2.includes(t.type);
}
function isResult2(t) {
  return t && RESULT_TYPES2.includes(t.type);
}
function isScalar2(t) {
  return t && SCALAR_TYPES2.includes(t.type);
}
function isLogic2(t) {
  return t && LOGIC_TYPES2.includes(t.type);
}
function isMath2(t) {
  return t && MATH_TYPES2.includes(t.type);
}
function isList2(t) {
  return t && LIST_TYPES2.includes(t.type);
}
function isEnd2(t) {
  return t && END_TYPES2.includes(t.type);
}
function isCall2(t) {
  return t && (t.type === PIPE2 || t.type === BLOCK2 && !t.value.body && t.value.args);
}
function isMixed2(t, ...o) {
  return t && t.type === LITERAL2 && t.value && o.includes(typeof t.value);
}
function isPlain22(t) {
  return t && Object.prototype.toString.call(t) === "[object Object]";
}
function isObject2(t) {
  return t && t.type === LITERAL2 && (t.isObject || isMixed2(t, "object"));
}
function isLiteral2(t, v22) {
  return t && t.type === LITERAL2 && (v22 ? t.value === v22 : true);
}
function isOperator2(t) {
  return isLogic2(t) || isMath2(t);
}
function isStatement2(t) {
  if (!t)
    return false;
  if (typeof t === "string")
    return CONTROL_TYPES2.includes(t);
  return isDirective2(t) && CONTROL_TYPES2.includes(t.value);
}
function isSpecial2(t) {
  return t && SYMBOL_TYPES2.includes(t.value);
}
function isArray2(t) {
  return t && t.type === RANGE2 && Array.isArray(t.value);
}
function isSlice2(t) {
  return t && t.type === SYMBOL2 && RE_SLICING2.test(t.value);
}
function isUnit2(t) {
  return t && t.type === NUMBER2 && isPlain22(t.value);
}
function isData2(t) {
  return isRange2(t) && Array.isArray(t.value) || isLiteral2(t) || isResult2(t) && !isInvokable2(t);
}
function hasStatements2(o) {
  return CONTROL_TYPES2.some((k22) => o[k22.substr(1)] && o[k22.substr(1)].isStatement);
}
function hasBreaks2(token) {
  if (isString2(token) && typeof token.value === "string") {
    return token.value.includes(`
`);
  }
  if (isText2(token)) {
    return token.value.buffer.some((x22) => typeof x22 === "string" && x22.includes(`
`));
  }
}
function hasDiff2(prev, next, isWeak) {
  if (prev === LITERAL2 || next === LITERAL2)
    return false;
  const prevValue = Token2.get(prev, isWeak);
  const nextValue = Token2.get(next, isWeak);
  if (prevValue instanceof RegExp || nextValue instanceof RegExp) {
    const regexp = prevValue instanceof RegExp ? prevValue : nextValue;
    const value = prevValue instanceof RegExp ? nextValue : prevValue;
    return !regexp.test(value);
  }
  if (Array.isArray(prevValue)) {
    if (isWeak) {
      prevValue.length = nextValue.length = Math.min(prevValue.length, nextValue.length);
    }
    if (prevValue.length !== nextValue.length)
      return true;
    for (let i22 = 0, c22 = prevValue.length;i22 < c22; i22++) {
      if (hasDiff2(prevValue[i22], nextValue[i22], isWeak))
        return true;
    }
    return false;
  }
  if (isPlain22(prevValue)) {
    if (!isPlain22(nextValue))
      return true;
    const a22 = Object.keys(prevValue).sort();
    const b22 = Object.keys(nextValue).sort();
    if (hasDiff2(a22, b22, isWeak))
      return true;
    for (let i22 = 0;i22 < a22.length; i22 += 1) {
      if (hasDiff2(prevValue[a22[i22]], nextValue[b22[i22]], isWeak))
        return true;
    }
    return false;
  }
  if (isWeak) {
    return prevValue != nextValue;
  }
  return prevValue !== nextValue;
}
function hasIn2(prev, next) {
  const prevValue = Token2.get(prev, true);
  const nextValue = Token2.get(next, true);
  if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
    return nextValue.every((x22) => hasIn2(prev, x22));
  }
  if (Array.isArray(prevValue) || typeof prevValue === "string") {
    return prevValue.includes(nextValue);
  }
  if (isObject2(prev)) {
    return Array.isArray(nextValue) ? nextValue.every((x22) => (x22 in prevValue)) : (nextValue in prevValue);
  }
  return false;
}
function deindent2(source) {
  const matches = source.match(/\n(\s+)/m);
  if (matches) {
    return source.split(`
`).map((line) => {
      if (line.indexOf(matches[1]) === 0) {
        return line.substr(matches[1].length);
      }
      return line;
    }).join(`
`).trim();
  }
  return source;
}
function hilight2(value, colorize2) {
  return value.replace(/<[^<>]*>/g, (x22) => colorize2(STRING2, x22));
}
function format6(text) {
  const chunks = text.split(/([`*_]{1,2})(.+?)\1/g);
  const buffer = [];
  for (let i22 = 0, c22 = chunks.length;i22 < c22; i22++) {
    if (!chunks[i22].length)
      continue;
    if (chunks[i22].charAt() === "`") {
      buffer.push([CODE2, chunks[i22], chunks[++i22]]);
    } else if ("*_".includes(chunks[i22].charAt())) {
      buffer.push([chunks[i22].length > 1 ? BOLD2 : ITALIC2, chunks[i22], chunks[++i22]]);
    } else {
      buffer.push(chunks[i22]);
    }
  }
  return buffer;
}
function pad2(nth) {
  return `     ${nth}`.substr(-5);
}
function copy2(obj) {
  if (Array.isArray(obj)) {
    return obj.map(copy2);
  }
  return obj.clone();
}
function repr3(t) {
  return t.toString().match(/\((\w+)\)/)[1];
}
function raise2(summary2, tokenInfo, descriptor) {
  summary2 += tokenInfo ? ` at line ${tokenInfo.line + 1}:${tokenInfo.col + 1}` : "";
  summary2 += descriptor ? ` (${descriptor})` : "";
  const Err = tokenInfo ? SyntaxError : TypeError;
  const e22 = new Err(summary2);
  e22.line = tokenInfo ? tokenInfo.line : 0;
  e22.col = tokenInfo ? tokenInfo.col : 0;
  e22.stack = summary2;
  throw e22;
}
function assert2(token, inherit, ...allowed) {
  if (!allowed.includes(token.type)) {
    const set = allowed.map(repr3);
    const last = set.length > 1 ? set.pop() : "";
    const value = set.join(", ").toLowerCase() + (last ? ` or ${last.toLowerCase()}` : "");
    raise2(`Expecting ${value} but found \`${token}\``, inherit ? token.tokenInfo : undefined);
  }
}
function check3(token, value, info) {
  const actual = token instanceof Token2 ? token.value : token;
  const tokenInfo = token.tokenInfo || token;
  if (!value) {
    raise2(`Unexpected \`${actual}\``, tokenInfo);
  }
  const suffix = ` ${info || "but found"} \`${actual}\``;
  value = typeof value === "symbol" ? repr3(value).toLowerCase() : value;
  raise2(`Expecting ${value}${suffix}`, tokenInfo);
}
function argv2(set, token, offset) {
  if (set === null) {
    const call22 = token.value.source;
    const head22 = token.value.input[offset];
    raise2(`Missing argument \`${head22}\` to call \`${call22}\``);
  }
  const call2 = token.source || token.value.source;
  const head2 = set[Math.min(offset, set.length - 1)];
  raise2(`Unexpected argument \`${head2}\` to call \`${call2}\``);
}
function only2(token, callback) {
  const source = token.getBody();
  if (source.length > 1 || !callback(source[0])) {
    check3(source[1] || source[0]);
  }
}
function debug2(err, source, noInfo, callback, colorizeToken = (_22, x22) => x22) {
  err.stack = err.stack || err[err.prevToken ? "summary" : "message"];
  if (typeof source === "undefined") {
    return err.message;
  }
  if (noInfo) {
    return err.stack.replace(/at line \d+:\d+\s+/, "");
  }
  if (err.prevToken) {
    const { line, col } = err.prevToken.tokenInfo;
    if (line !== err.line)
      err.line = line;
    if (col !== err.col)
      err.col = col;
    err.stack += `
  at \`${serialize2(err.prevToken, true)}\` at line ${line + 1}:${col + 1}`;
  }
  source = typeof callback === "function" ? callback(source) : source;
  const lines = source.split(`
`).reduce((prev, cur, i22) => {
    prev.push(` ${colorizeToken(err.line !== i22 ? true : null, pad2(i22 + 1))} | ${cur}`);
    return prev;
  }, []);
  const padding = Array.from({ length: err.col + 10 }).join("-");
  lines.splice(err.line + 1, 0, `${padding}^`);
  if (err.line) {
    lines.splice(0, err.line - 4);
    lines.length = 10;
  }
  return `${err.stack}

${lines.join(`
`)}
`;
}
function literal2(t) {
  switch (t.type) {
    case OPEN2:
      return "(";
    case CLOSE2:
      return ")";
    case COMMA2:
      return ",";
    case BEGIN2:
      return "[";
    case DONE2:
      return "]";
    case EOL2:
      return ".";
    case DOT2:
      return ".";
    case MINUS2:
      return "-";
    case PLUS2:
      return "+";
    case MOD2:
      return "%";
    case MUL2:
      return "*";
    case DIV2:
      return "/";
    case PIPE2:
      return "|>";
    case BLOCK2:
      return "->";
    case RANGE2:
      return "..";
    case SYMBOL2:
      return ":";
    case NOT_EQ2:
      return "!=";
    case SOME2:
      return "?";
    case EVERY2:
      return "$";
    case OR2:
      return "|";
    case NOT2:
      return "!";
    case LIKE2:
      return "~";
    case EXACT_EQ2:
      return "==";
    case EQUAL2:
      return "=";
    case LESS_EQ2:
      return "<=";
    case LESS2:
      return "<";
    case GREATER_EQ2:
      return ">=";
    case GREATER2:
      return ">";
    default:
      return t.value;
  }
}
function quote3(s) {
  return `"${s.replace(/"/g, "\\\"")}"`;
}
function compactText2(text, maxLen = 120) {
  const normalized = String(text ?? "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!normalized)
    return "";
  if (normalized.length <= maxLen)
    return normalized;
  return `${normalized.slice(0, Math.max(1, maxLen - 1)).trim()}…`;
}
function compact2(token, maxLen = 120, depth = 0) {
  if (typeof token === "undefined")
    return "";
  if (token === null)
    return ":nil";
  if (token === true)
    return ":on";
  if (token === false)
    return ":off";
  if (depth > 4)
    return "…";
  if (typeof token === "number")
    return String(token);
  if (typeof token === "symbol")
    return token.toString().match(/\((.+?)\)/)?.[1] || "symbol";
  if (typeof token === "string")
    return compactText2(quote3(token), maxLen);
  if (typeof token === "function")
    return `${token.name || "fn"}(…)`;
  if (token instanceof Date)
    return token.toISOString();
  if (token instanceof RegExp)
    return `/${token.source}/${token.flags}`;
  if (Array.isArray(token)) {
    if (token.length === 1)
      return compact2(token[0], maxLen, depth + 1);
    if (!token.length)
      return "[ ]";
    const preview = token.slice(0, 3).map((entry) => compact2(entry, 24, depth + 1)).join(" ");
    const more = token.length > 3 ? ` … ${token.length} items` : "";
    return compactText2(`[ ${preview}${more} ]`, maxLen);
  }
  if (token && typeof token === "object" && token.__tag && Object.prototype.hasOwnProperty.call(token, "value")) {
    return compact2(token.value, maxLen, depth + 1);
  }
  if (isUnit2(token)) {
    const text = token && token.value && typeof token.value.toString === "function" ? token.value.toString() : String(token);
    return compactText2(text, maxLen);
  }
  if (isNumber2(token)) {
    const value = typeof token.valueOf === "function" ? token.valueOf() : token.value;
    return String(value);
  }
  if (isSymbol2(token))
    return String(token.value ?? token.valueOf?.() ?? "");
  if (isString2(token)) {
    if (typeof token.value === "string")
      return compactText2(quote3(token.value), maxLen);
    const raw = typeof token.valueOf === "function" ? token.valueOf() : token.value;
    return compactText2(quote3(typeof raw === "string" ? raw : "…"), maxLen);
  }
  if (isLiteral2(token)) {
    if (token.isTag) {
      const rendered = renderTag2(token.value);
      const match = rendered.match(/^<\s*([^\s/>]+)/);
      return match ? `<${match[1]} …>` : "<…>";
    }
    if (token.isFunction || token.isCallable) {
      const name = token.value?.label || token.value?.name || token.getName?.() || token.name || "fn";
      return `${name}(…)`;
    }
    if (token.isObject) {
      const data = token.valueOf();
      const keys2 = Object.keys(data || {});
      if (!keys2.length)
        return "{ }";
      if (keys2.length <= 6)
        return `{ ${keys2.join(" ")} }`;
      return `{ ${keys2.slice(0, 6).join(" ")} … ${keys2.length} keys }`;
    }
  }
  if (isRange2(token)) {
    if (Array.isArray(token.value)) {
      if (!token.value.length)
        return "[ ]";
      const preview = token.value.slice(0, 3).map((entry) => compact2(entry, 24, depth + 1)).join(" ");
      const more = token.value.length > 3 ? ` … ${token.value.length} items` : "";
      return compactText2(`[ ${preview}${more} ]`, maxLen);
    }
    const begin = compact2(token.value?.begin, 24, depth + 1);
    const end = compact2(token.value?.end, 24, depth + 1);
    return compactText2(`${begin}..${end}`, maxLen);
  }
  if (token && typeof token === "object") {
    if (token.isTag && token.value) {
      const rendered = renderTag2(token.value);
      const match = rendered.match(/^<\s*([^\s/>]+)/);
      return match ? `<${match[1]} …>` : "<…>";
    }
    if (token.isFunction || token.isCallable) {
      const name = token.value?.label || token.value?.name || token.name || "fn";
      return `${name}(…)`;
    }
    const keys2 = Object.keys(token);
    if (keys2.length) {
      if (keys2.length <= 6)
        return `{ ${keys2.join(" ")} }`;
      return `{ ${keys2.slice(0, 6).join(" ")} … ${keys2.length} keys }`;
    }
  }
  return compactText2(String(token), maxLen);
}
function split2(s) {
  return s.split(/(?=[\W\x00-\x7F])/);
}
function slice2(s) {
  const matches = s.match(RE_SLICING2);
  const min2 = matches[1] ? parseFloat(matches[1]) : undefined;
  const max2 = matches[3] ? parseFloat(matches[3]) : undefined;
  if (matches[2] === "..") {
    return { begin: min2, end: max2 };
  }
  if (min2 < 0 && typeof max2 !== "undefined")
    throw new Error(`Invalid take-step \`${s}\``);
  if (max2 < 0)
    throw new Error(`Invalid take-step \`${s}\``);
  return { offset: min2, length: max2 };
}
function isDigit2(c22) {
  return c22 >= "0" && c22 <= "9";
}
function isReadable2(c22, raw) {
  return c22 === "#" || c22 === "$" || c22 >= "&" && c22 <= "'" || c22 >= "^" && c22 <= "z" || c22 >= "@" && c22 <= "Z" || raw && (c22 === "." || c22 === "-") || c22.charCodeAt() > 127 && c22.charCodeAt() !== 255;
}
function isAlphaNumeric2(c22, raw) {
  return isDigit2(c22) || isReadable2(c22, raw);
}
function getSeparator2(_22, o, p22, c22, n, dx) {
  if (isComment2(p22) && !isText2(c22) || isComment2(c22) && !isText2(p22)) {
    return (isComment2(p22) ? p22 : c22).type === COMMENT_MULTI2 ? " " : `
`;
  }
  if (dx === "Stmt" && (!o && isBlock2(p22) && !isBlock2(c22) || isBlock2(p22) && isBlock2(c22) && !c22.isStatement && c22.isRaw) || isComma2(p22) && !isText2(c22) || isOperator2(p22) && isBlock2(c22) || o && isOperator2(p22) && (isData2(c22) && !isLiteral2(c22)) && !(isEOL2(o) || isComma2(o) || isText2(o)) || isData2(p22) && isOperator2(c22) && isData2(n) || isData2(o) && isOperator2(p22) && isData2(c22) || isData2(p22) && !isLiteral2(p22) && isOperator2(c22) || (isBlock2(p22) && isOperator2(c22) || isBlock2(o) && isOperator2(p22)) || isLiteral2(_22) && isOperator2(o) && isOperator2(p22) && !isData2(n) || isLiteral2(p22) && isOperator2(c22) && isOperator2(n) && c22.value !== n.value || isOperator2(o) && isOperator2(p22) && o.value !== p22.value && isLiteral2(c22))
    return " ";
  if (isBlock2(p22) && isBlock2(c22) || isBlock2(p22) && isData2(c22) || isData2(p22) && isData2(c22) && (!isRange2(p22) || !isSymbol2(c22)))
    return dx === "Root" || dx !== "Expr" && !isSymbol2(p22) ? COMMA2 : " ";
}
function serialize2(token, shorten, colorize2 = (_22, x22) => typeof x22 === "undefined" ? literal2({ type: _22 }) : x22, descriptor = "Root") {
  if (typeof token === "undefined")
    return;
  if (token === null)
    return colorize2(SYMBOL2, ":nil");
  if (token === true)
    return colorize2(SYMBOL2, ":on");
  if (token === false)
    return colorize2(SYMBOL2, ":off");
  if (token instanceof Date)
    return colorize2(STRING2, `"${token.toISOString()}"`);
  if (token instanceof RegExp)
    return colorize2(STRING2, `/${token.source}/${token.flags}`);
  if (typeof token === "number")
    return colorize2(NUMBER2, token);
  if (typeof token === "symbol")
    return colorize2(SYMBOL2, token.toString().match(/\((.+?)\)/)[1]);
  if (typeof token === "string")
    return colorize2(LITERAL2, descriptor === "Object" ? `"${token}"` : token);
  if (typeof token === "function") {
    const name = token.toString().match(/constructor\s*\(([\s\S]*?)\)|\(([\s\S]*?)\)|([\s\S]*?)(?==>)/);
    const methods = Object.keys(token).map((k22) => colorize2(SYMBOL2, `:${k22}`)).join(" ");
    const formatted = (name[3] || name[2] || name[1] || "").trim().replace(/\s+/g, " ");
    return `${colorize2(LITERAL2, token.name)}${colorize2(OPEN2, "(")}${formatted.length ? colorize2(LITERAL2, formatted) : ""}${colorize2(CLOSE2)}${methods ? `${colorize2(BEGIN2)}${methods}${colorize2(DONE2)}` : ""}`;
  }
  if (Array.isArray(token)) {
    if (descriptor === "Object") {
      return `${colorize2(BEGIN2)}${token.map((x22) => serialize2(x22, shorten, colorize2, descriptor)).join(`${colorize2(COMMA2)} `)}${colorize2(DONE2)}`;
    }
    let prevData = null;
    const hasText = token.some(isText2);
    return token.reduce((prev, cur, i22) => {
      const sep = getSeparator2(prevData, token[i22 - 2], token[i22 - 1], cur, token[i22 + 1], descriptor);
      const result = serialize2(cur, shorten, colorize2, descriptor);
      if (sep && !(isEOL2(cur) || isComma2(cur))) {
        prev.push(![" ", `
`].includes(sep) ? `${colorize2(sep)} ` : sep);
      }
      if (isEOL2(cur) || isComma2(cur))
        prevData = null;
      if (isData2(cur))
        prevData = cur;
      prev.push(isEOL2(cur) && !hasText ? `${result}
` : result);
      return prev;
    }, []).join("");
  }
  if (isComment2(token) && token.type === COMMENT2) {
    return colorize2(COMMENT2, token.value);
  }
  if (isLiteral2(token)) {
    if (token.isTag) {
      if (shorten)
        return colorize2(STRING2, "<.../>");
      return colorize2(STRING2, renderTag2(token.value));
    }
    if (token.cached) {
      return colorize2(LITERAL2, `${token.value}!`);
    }
    if (token.isFunction) {
      return colorize2(LITERAL2, token.value.label);
    }
    if (!token.isObject && typeof token.value === "object") {
      return serialize2(token.value, shorten, colorize2, "Object");
    }
    if (typeof token.value === "undefined") {
      return colorize2(true, String(token.value));
    }
    return serialize2(token.value, shorten, colorize2, descriptor);
  }
  if (typeof token.type === "symbol") {
    if (token.isExpression) {
      return `${colorize2(token.type)} ${serialize2(token.value, shorten, colorize2, "Expr")}`;
    }
    if (isRef2(token)) {
      const chunk = token.isRaw && token.value.href || token.value.alt || token.value.href;
      return colorize2(true, token.value.text.replace(chunk, colorize2(token.isRaw ? REF2 : TEXT2, chunk)));
    }
    if (isUnit2(token)) {
      return colorize2(NUMBER2, token.value.toString());
    }
    if (isCode2(token) && token.isMulti) {
      return `${colorize2(true, "```")}${colorize2(null, token.value)}${colorize2(true, "```")}`;
    }
    if (isString2(token)) {
      const qt = colorize2(STRING2, token.isMulti ? '"""' : '"');
      let chunk;
      if (shorten) {
        chunk = colorize2(STRING2, token.isMarkup ? "<.../>" : '"..."');
      } else if (Array.isArray(token.value)) {
        const subTree = token.valueOf();
        const buffer = [];
        for (let i22 = 0, c22 = subTree.length;i22 < c22; i22++) {
          const cur = subTree[i22];
          const next = subTree[i22 + 1];
          const prev = subTree[i22 - 1];
          if ((!prev || prev.type === PLUS2) && cur.type === OPEN2 && cur.value === "#{") {
            buffer.pop();
            buffer.push(colorize2(null, "#{"));
            continue;
          }
          if ((!next || next.type === PLUS2) && cur.type === CLOSE2 && cur.value === "}") {
            buffer.push(colorize2(null, "}"));
            i22++;
            continue;
          }
          if (isBlock2(cur) && !cur.hasArgs) {
            if (prev && prev.type === PLUS2)
              buffer.pop();
            cur.tokenInfo.kind = "";
            buffer.push(colorize2(null, "#{"));
            buffer.push(serialize2(cur, shorten, colorize2, "Str"));
            buffer.push(colorize2(null, "}"));
            cur.tokenInfo.kind = "raw";
            if (next && next.type === PLUS2)
              i22++;
            continue;
          }
          if (!isString2(cur)) {
            buffer.push(serialize2(cur, shorten, colorize2, descriptor));
          } else {
            buffer.push(colorize2(STRING2, !cur.isRaw ? `"${cur.value}"` : cur.value));
          }
        }
        chunk = !token.isMarkup ? `${qt}${buffer.join("")}${qt}` : buffer.join("");
      } else {
        chunk = colorize2(STRING2, !token.isMarkup ? `${qt}${token.value}${qt}` : token.value);
      }
      return chunk;
    }
    if (isBlock2(token)) {
      if (typeof token.value === "string")
        return colorize2(BLOCK2);
      let block2 = "";
      let args = "";
      const parent = token.isStatement || descriptor === "Stmt" ? "Stmt" : "Block";
      if (!token.hasSource) {
        if (token.hasArgs) {
          const renderedArgs = serialize2(token.getArgs(), shorten, colorize2, parent);
          if (token.hasBody && token.getArgs().length > 1) {
            args += `${colorize2(OPEN2)}${renderedArgs.replace(/,\s*/g, " ")}${colorize2(CLOSE2)}`;
          } else {
            args += renderedArgs;
          }
        }
        if (token.hasName)
          block2 += `${colorize2(LITERAL2, token.getName())}${args} ${colorize2(EQUAL2)} `;
      }
      if (token.hasBody) {
        block2 += serialize2(token.getBody(), shorten, colorize2, parent);
      }
      if (!block2) {
        block2 = args;
      } else if (args) {
        block2 = `${args} ${colorize2(BLOCK2)} ${block2}`;
      }
      if (token.hasArgs && token.getArg(0) && token.getArg(0).isExpression) {
        block2 = `${colorize2(token.getArg(0).type)}`;
        if (!shorten) {
          block2 += ` ${serialize2(token.getArg(0).value, shorten, colorize2, "Expr")}`;
        }
      }
      return token.isRaw ? `${colorize2(OPEN2)}${block2}${colorize2(CLOSE2)}` : block2;
    }
    if (isText2(token)) {
      let prefix2 = "";
      if (token.value.kind === BLOCKQUOTE2) {
        prefix2 = `${colorize2(BLOCKQUOTE2, ">")} `;
      } else if (token.value.kind === HEADING2) {
        prefix2 = `${colorize2(HEADING2, Array.from({ length: token.value.level + 1 }).join("#"))} `;
      } else if (token.value.kind === UL_ITEM2 || token.value.kind === OL_ITEM2) {
        if (token.value.depth) {
          prefix2 += Array.from({ length: token.value.depth + 1 }).join("  ");
        }
        let offset = token.value.style;
        if (this && token.value.kind === OL_ITEM2) {
          const key = [repr3(token.value.kind), token.value.depth || 0];
          this.offsets = this.offsets || {};
          this.offsets[key] = this.offsets[key] || token.value.level;
          offset = this.offsets[key];
          this.offsets[key]++;
        }
        prefix2 += `${colorize2(token.value.kind, offset + (token.value.kind === OL_ITEM2 ? "." : ""))} `;
      } else if (this && isText2(token) && !hasBreaks2(token)) {
        delete this.offsets;
      }
      return colorize2(TEXT2, `${prefix2}${token.value.buffer.reduce((prev, cur, idx, all) => {
        if (Array.isArray(cur)) {
          prev += colorize2(cur[0], `${cur[1]}${cur[2]}${cur[1]}`);
        } else if (isOpen2(cur) && cur.value === "#{") {
          prev += colorize2(null, "#{");
        } else if (isClose2(cur) && cur.value === "}") {
          prev += colorize2(null, "}");
        } else if (isMath2(cur) && cur.type === PLUS2) {
          const left = all[idx - 1];
          const right = all[idx + 1];
          const isPrefixJoin = left && right && isString2(left) && left.isRaw && isOpen2(right) && right.value === "#{";
          const isSuffixJoin = left && right && isClose2(left) && left.value === "}" && isString2(right) && right.isRaw;
          if (!isPrefixJoin && !isSuffixJoin) {
            prev += serialize2(cur, shorten, colorize2, descriptor);
          }
        } else if (cur && cur.type) {
          prev += serialize2(cur, shorten, colorize2, descriptor);
        } else if (isRef2(cur)) {
          prev += serialize2(cur, shorten, colorize2);
        } else {
          prev += hilight2(cur, colorize2);
        }
        return prev;
      }, "")}`);
    }
    if (isRange2(token)) {
      if (typeof token.value === "string")
        return colorize2(RANGE2, token.value);
      if (!Array.isArray(token.value)) {
        return colorize2(RANGE2, `${serialize2(token.value.begin, shorten, colorize2)}..${serialize2(token.value.end, shorten, colorize2)}`);
      }
      return `${colorize2(BEGIN2, "[")}${!shorten ? serialize2(token.value, shorten, colorize2, descriptor) : colorize2(RANGE2, "..")}${colorize2(DONE2, "]")}`;
    }
    return colorize2(token.type, token.value);
  }
  if (isPlain22(token) && token.__tag && token.value && typeof token.__tag.getBody === "function" && typeof token.value.getBody === "function") {
    const [tag] = token.__tag.getBody();
    const payload = token.value.getBody();
    if (isSymbol2(tag) && [":ok", ":err"].includes(tag.value)) {
      const kind = tag.value.substr(1);
      if (!payload.length)
        return colorize2(SYMBOL2, `@${kind}`);
      return `${colorize2(SYMBOL2, `@${kind}`)} ${payload.length === 1 ? serialize2(payload[0], shorten, colorize2, descriptor) : serialize2(payload, shorten, colorize2, descriptor)}`;
    }
  }
  const separator = !hasStatements2(token) ? `${colorize2(COMMA2)} ` : " ";
  if (shorten) {
    const prefix2 = hasStatements2(token) ? "@" : ":";
    return Object.keys(token).map((k22) => colorize2(SYMBOL2, `${prefix2}${k22}`)).join(separator);
  }
  const prefix = hasStatements2(token) ? "@" : ":";
  const block = Object.keys(token).map((k22) => `${colorize2(SYMBOL2, `${prefix}${k22}`)} ${serialize2(token[k22], shorten, colorize2, descriptor)}`);
  return descriptor === "Object" ? `${colorize2(OPEN2)}${block.join(separator)}${colorize2(CLOSE2)}` : block.join(separator);
}
function SYMBOL_NAME2(sym) {
  if (!sym || typeof sym !== "symbol")
    return "";
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? "";
}
function unitKindFromToken2(token) {
  const kind = token?.value?.value?.kind ?? token?.value?.kind;
  if (typeof kind === "string" && kind.trim())
    return kind.trim();
  const asText = String(token?.value?.toString?.() ?? "");
  const match = asText.match(/[A-Za-z]{1,10}$/);
  return match?.[0] || "";
}
function inferTokenType2(token) {
  if (!token)
    return "unknown";
  if (token.isCallable || token.isFunction)
    return "fn";
  if (token.isTag)
    return "tag";
  if (token.isObject) {
    const shape = token.valueOf ? token.valueOf() : token.value;
    if (shape && typeof shape === "object" && shape.__tag && shape.value)
      return "result";
    return "record";
  }
  if (token.isRange)
    return Array.isArray(token.value) ? "list" : "range";
  if (token.isNumber) {
    const unitKind = unitKindFromToken2(token);
    if (unitKind)
      return `unit<${unitKind}>`;
    return "number";
  }
  if (token.isString)
    return "string";
  if (token.isSymbol)
    return "symbol";
  const symbol = SYMBOL_NAME2(token.type);
  return symbol ? symbol.toLowerCase() : "unknown";
}
function inferRuntimeType2(value) {
  if (value === null)
    return "nil";
  if (value === undefined)
    return "unknown";
  if (typeof value === "number")
    return "number";
  if (typeof value === "string")
    return "string";
  if (typeof value === "boolean")
    return "boolean";
  if (typeof value === "function")
    return "fn";
  if (Array.isArray(value)) {
    if (!value.length)
      return "list<unknown>";
    if (value.length === 1)
      return inferRuntimeType2(value[0]);
    const sample = value.find(Boolean);
    const inner = sample ? inferRuntimeType2(sample) : "unknown";
    return `list<${inner}>`;
  }
  if (value && typeof value === "object" && typeof value.type === "symbol") {
    return inferTokenType2(value);
  }
  if (value && typeof value === "object") {
    if (value.__tag && value.value)
      return "result";
    return "record";
  }
  return "unknown";
}
function canonicalTypeName2(typeName) {
  const text = String(typeName || "").trim().toLowerCase();
  if (!text)
    return "";
  if (text === "num" || text === "number")
    return "number";
  if (text === "str" || text === "string")
    return "string";
  if (text === "bool" || text === "boolean")
    return "boolean";
  if (text.startsWith("unit<") && text.endsWith(">"))
    return "number";
  if (text === "list" || text.startsWith("list<"))
    return "list";
  return text;
}
function matchesType2(value, typeStr, env) {
  const declared = canonicalTypeName2(typeStr);
  if (!declared || declared === "any" || declared === "unknown")
    return true;
  if (env && typeof env.getAnnotation === "function") {
    const name = value?.name ?? "";
    if (name) {
      const ann = env.getAnnotation(name);
      if (ann)
        return canonicalTypeName2(String(ann)) === declared;
    }
  }
  const actual = canonicalTypeName2(inferRuntimeType2(value));
  if (!actual || actual === "unknown")
    return true;
  return actual === declared;
}

class Expr2 {
  constructor(value, tokenInfo) {
    this.type = value.type;
    this.value = value.value;
    if (value.length)
      this.length = value.length;
    if (value.source)
      this.source = value.source;
    if (value.cached) {
      Object.defineProperty(this, "cached", { value: true });
    }
    Object.defineProperty(this, "tokenInfo", {
      value: tokenInfo || (value instanceof Token2 ? value : null)
    });
  }
  get isFFI() {
    return this.type === FFI2;
  }
  get isBlock() {
    return this.type === BLOCK2;
  }
  get isRange() {
    return this.type === RANGE2;
  }
  get isNumber() {
    return this.type === NUMBER2;
  }
  get isString() {
    return this.type === STRING2;
  }
  get isSymbol() {
    return this.type === SYMBOL2;
  }
  get isScalar() {
    return this.isNumber || this.isString || this.isSymbol;
  }
  get isIterable() {
    return this.isString || this.isBlock || this.isRange;
  }
  get isObject() {
    return this instanceof Expr2.Object;
  }
  get isTag() {
    return this instanceof Expr2.Tag;
  }
  get isFunction() {
    return this instanceof Expr2.Function;
  }
  get isLiteral() {
    return this instanceof Expr2.Literal;
  }
  get isCallable() {
    return this instanceof Expr2.Callable;
  }
  get isStatement() {
    return this instanceof Expr2.Statement;
  }
  get isExpression() {
    return this instanceof Expr2.Expression;
  }
  toString() {
    if (this.type === EOL2)
      return `.
`;
    return serialize2(this, true);
  }
  valueOf() {
    if (this.type === NUMBER2 && typeof this.value === "string") {
      return parseFloat(this.value);
    }
    if (this.value !== null) {
      return this.value.valueOf();
    }
    return this.value;
  }
  get hasName() {
    return !!this.getName();
  }
  get hasBody() {
    return !!this.value.body;
  }
  get hasArgs() {
    return !!this.value.args;
  }
  get hasInput() {
    return !!this.value.input;
  }
  get hasSource() {
    return !!(this.value.source || this.source);
  }
  get isRaw() {
    return this.tokenInfo?.kind === "raw";
  }
  get isMulti() {
    return this.tokenInfo?.kind === "multi";
  }
  get isMarkup() {
    return this.tokenInfo?.kind === "markup";
  }
  get isOptional() {
    return this.value.charAt(this.value.length - 1) === "?";
  }
  getBody() {
    return this.value.body;
  }
  getArgs() {
    return this.value.args;
  }
  getInput() {
    return this.value.input;
  }
  getArg(n) {
    return this.value.args[n];
  }
  getName() {
    return this.value.source || this.source || this.value.name;
  }
  push(...v22) {
    return this.value.body.push(...v22);
  }
  head() {
    return this.value.body[0];
  }
  get() {
    return Token2.get(this);
  }
  clone() {
    if (Array.isArray(this.value)) {
      return new this.constructor({ type: this.type, value: copy2(this.value) }, this.tokenInfo);
    }
    if (this.isStatement) {
      return new this.constructor({ type: BLOCK2, value: { body: copy2(this.getBody()) } }, this.tokenInfo);
    }
    if (this.isLiteral && isBlock2(this)) {
      const newBlock = !this.hasBody ? Expr2.from(BLOCK2, { args: copy2(this.getArgs()) }, this.tokenInfo) : Expr2.from(BLOCK2, { body: copy2(this.getBody()) }, this.tokenInfo);
      if (this.isRaw)
        newBlock.tokenInfo.kind = "raw";
      return newBlock;
    }
    if (this.isObject) {
      return Expr2.map(Object.keys(this.value).reduce((prev, cur) => {
        prev[cur] = copy2(this.value[cur]);
        return prev;
      }, {}), this.tokenInfo);
    }
    if (this.isCallable) {
      return Expr2.callable({
        type: BLOCK2,
        value: {
          ...this.value,
          body: copy2(this.getBody())
        }
      }, this.tokenInfo);
    }
    return this;
  }
  static sub(body, params) {
    if (Array.isArray(body)) {
      const self = body.slice();
      for (let i22 = 0, c22 = self.length;i22 < c22; i22++) {
        if (self[i22].isCallable && params[self[i22].value.name]) {
          const fixedBody = params[self[i22].value.name].slice();
          const fixedName = fixedBody.pop();
          self[i22].value.name = fixedName.value;
          self[i22].value.body = Expr2.sub(self[i22].value.body, params);
          self.splice(i22 - 1, 0, ...fixedBody);
        } else if (isLiteral2(self[i22]) && typeof self[i22].value === "string") {
          if (!params[self[i22].value])
            continue;
          c22 += params[self[i22].value].length - 1;
          self.splice(i22, 1, ...params[self[i22].value]);
        } else {
          self[i22] = Expr2.sub(self[i22], params);
        }
      }
      return self;
    }
    if (Array.isArray(body.value)) {
      body.value = Expr2.sub(body.value, params);
    } else if (body.isObject) {
      Object.keys(body.value).forEach((k22) => {
        body.value[k22].value.body = Expr2.sub(body.value[k22].value.body, params);
      });
    } else if (isBlock2(body)) {
      if (body.value.args)
        body.value.args = Expr2.sub(body.getArgs(), params);
      if (body.value.body)
        body.value.body = Expr2.sub(body.getBody(), params);
    }
    return body;
  }
  static mix(tpl, ...others) {
    return Expr2.sub(copy2(tpl.body), tpl.args.reduce((prev, cur, i22) => {
      prev[cur.value] = others[i22];
      return prev;
    }, {}));
  }
  static cut(ast) {
    const count = ast.length;
    const left = [];
    let i22 = 0;
    for (;i22 < count; i22++) {
      if (isResult2(ast[i22]) && isResult2(left[left.length - 1]))
        break;
      left.push(ast[i22]);
    }
    return left;
  }
  static has(ast, type, value) {
    return ast.some((token) => {
      if (isBlock2(token) && token.hasArgs) {
        return Expr2.has(token.getArgs(), type, value);
      }
      return token.type === type && token.value === value;
    });
  }
  static from(type, value, tokenInfo) {
    if (Array.isArray(type)) {
      return type.map((x22) => Expr2.from(x22));
    }
    if (type === TEXT2 && typeof value === "string") {
      value = { buffer: [value] };
    }
    if (typeof value === "undefined") {
      if (typeof type === "symbol") {
        return Expr2.literal({ type, value: literal2({ type }) });
      }
      if (Array.isArray(type.value)) {
        type.value = Expr2.from(type.value);
      }
      return type instanceof Expr2 ? type : Expr2.literal(type);
    }
    return Expr2.literal({ type, value }, tokenInfo);
  }
  static args(values) {
    const list2 = [];
    let stack = list2;
    let key = 0;
    for (let i22 = 0, c22 = values.length;i22 < c22; i22++) {
      if (isComma2(values[i22])) {
        list2[list2.length - 1] = stack[0];
        stack = list2[++key] = [];
      } else {
        stack.push(values[i22]);
      }
    }
    if (stack.length === 1) {
      list2[list2.length - 1] = stack[0];
    }
    return list2;
  }
  static text(buffer, tokenInfo) {
    const head2 = buffer.charAt();
    const value = {};
    let level = 0;
    let type = TEXT2;
    if ("#>".includes(head2)) {
      type = head2 === ">" ? BLOCKQUOTE2 : HEADING2;
      if (head2 === "#") {
        let i22 = 0;
        for (;i22 < 5; i22++) {
          if (buffer.charAt(i22) === "#")
            level++;
          else
            break;
        }
        buffer = buffer.substr(i22);
      } else {
        buffer = buffer.substr(1);
      }
    }
    if ("-*+".includes(head2) && buffer.charAt(1) === " " || isDigit2(head2) && /^(\d+)\.\s/.test(buffer)) {
      const [nth, ...chunks] = buffer.split(" ");
      level = isDigit2(head2) ? parseFloat(nth) : 0;
      type = isDigit2(head2) ? OL_ITEM2 : UL_ITEM2;
      buffer = chunks.join(" ");
    }
    if (type !== TEXT2)
      value.kind = type;
    if (level > 1)
      value.level = level;
    value.buffer = format6(buffer.trim());
    return Expr2.literal({ type: TEXT2, value }, tokenInfo);
  }
  static chunk(values, inc, fx) {
    const body = [];
    let offset = 0;
    for (let c22 = values.length;inc < c22; inc++) {
      if (fx && isCall2(body[body.length - 1]))
        break;
      if (!fx && isEnd2(values[inc]))
        break;
      body.push(values[inc]);
      offset++;
    }
    return { body, offset };
  }
  static arity(callable) {
    let length = 0;
    length += callable.value.args.length;
    while (callable.hasBody && callable.head().isCallable && callable.getBody().length === 1) {
      length += callable.head().getArgs().length;
      callable = callable.head();
      break;
    }
    return length;
  }
  static cast(list2, types) {
    return list2.reduce((prev, cur) => {
      if (cur.isStatement) {
        prev.push(...cur.getBody().reduce((p22, c22) => {
          if (!isComma2(c22)) {
            if (c22.isObject) {
              p22.push(...Expr2.cast([c22], types));
            } else {
              if (!types.includes(c22.type))
                assert2(c22, true, ...types);
              p22.push(c22);
            }
          }
          return p22;
        }, []));
      } else if (cur.isObject) {
        const map2 = cur.valueOf();
        Object.keys(map2).forEach((prop2) => {
          map2[prop2].getBody().forEach((c22) => {
            if (!types.includes(c22.type))
              assert2(c22, true, ...types);
          });
        });
        prev.push(cur);
      } else if (!types.includes(cur.type)) {
        assert2(cur, true, ...types);
      } else {
        prev.push(cur);
      }
      return prev;
    }, []);
  }
  static stmt(type, body, tokenInfo) {
    if (typeof type === "object") {
      tokenInfo = body;
      body = type;
      type = null;
    }
    const params = { type: BLOCK2, value: { body } };
    if (type === "@namespace")
      return Expr2.namespaceStatement(params, tokenInfo);
    if (type === "@table")
      return Expr2.tableStatement(params, tokenInfo);
    if (type === "@if")
      return Expr2.ifStatement(params, tokenInfo);
    if (type === "@else")
      return Expr2.elseStatement(params, tokenInfo);
    if (type === "@ok")
      return Expr2.okStatement(params, tokenInfo);
    if (type === "@err")
      return Expr2.errStatement(params, tokenInfo);
    if (type === "@while")
      return Expr2.whileStatement(params, tokenInfo);
    if (type === "@do")
      return Expr2.doStatement(params, tokenInfo);
    if (type === "@let")
      return Expr2.letStatement(params, tokenInfo);
    if (type === "@destructure")
      return Expr2.destructureStatement(params, tokenInfo);
    if (type === "@loop")
      return Expr2.loopStatement(params, tokenInfo);
    if (type === "@match")
      return Expr2.matchStatement(params, tokenInfo);
    if (type === "@try")
      return Expr2.tryStatement(params, tokenInfo);
    if (type === "@check")
      return Expr2.checkStatement(params, tokenInfo);
    if (type === "@rescue")
      return Expr2.rescueStatement(params, tokenInfo);
    if (type === "@from")
      return Expr2.fromStatement(params, tokenInfo);
    if (type === "@import")
      return Expr2.importStatement(params, tokenInfo);
    if (type === "@module")
      return Expr2.moduleStatement(params, tokenInfo);
    if (type === "@export")
      return Expr2.exportStatement(params, tokenInfo);
    if (type === "@template")
      return Expr2.templateStatement(params, tokenInfo);
    return Expr2.statement(params, tokenInfo);
  }
  static value(mixed, tokenInfo) {
    tokenInfo = tokenInfo || { line: 0, col: 0 };
    if (mixed === null)
      return Expr2.from(LITERAL2, null, tokenInfo);
    if (mixed === true)
      return Expr2.from(LITERAL2, true, tokenInfo);
    if (mixed === false)
      return Expr2.from(LITERAL2, false, tokenInfo);
    if (isPlain22(mixed) && mixed instanceof Expr2.Val)
      return mixed.toToken();
    if (isPlain22(mixed) && typeof mixed.name === "string" && Array.isArray(mixed.children)) {
      return Expr2.tag(mixed, tokenInfo);
    }
    if (typeof mixed === "string")
      return Expr2.from(STRING2, mixed, tokenInfo);
    if (typeof mixed === "number")
      return Expr2.from(NUMBER2, mixed.toString(), tokenInfo);
    if (mixed instanceof Expr2)
      return Expr2.from(mixed.type, mixed.value, mixed.tokenInfo);
    if (Array.isArray(mixed)) {
      return Expr2.array(mixed.map((x22) => Expr2.value(x22)), tokenInfo);
    }
    return Expr2.from(LITERAL2, mixed, tokenInfo);
  }
  static plain(mixed, callback, descriptor) {
    if (Array.isArray(mixed)) {
      return mixed.map((x22) => Expr2.plain(x22, callback, descriptor));
    }
    if (isRange2(mixed)) {
      return Expr2.plain(mixed.valueOf(), callback, descriptor);
    }
    if (mixed.isObject) {
      const obj = mixed.valueOf();
      return Object.keys(obj).reduce((prev, cur) => {
        const value = obj[cur].getBody();
        const fixedValue = value.length === 1 ? value[0] : value;
        prev[cur] = Expr2.plain(fixedValue, callback, descriptor);
        return prev;
      }, {});
    }
    if (mixed.isCallable) {
      return (...args) => {
        if (typeof callback === "function") {
          return callback(mixed, Expr2.value(args).valueOf(), descriptor);
        }
        return [
          Expr2.local(mixed.getName(), mixed.tokenInfo),
          Expr2.block({ args: Expr2.value(args).valueOf() }, mixed.tokenInfo)
        ];
      };
    }
    if (isSymbol2(mixed) && typeof mixed.value === "string") {
      return mixed.value.substr(1);
    }
    return mixed.isFunction ? mixed.value.target : mixed.valueOf();
  }
  static each(tokens, callback) {
    const body = Expr2.cast(tokens, [LITERAL2]);
    const calls = [];
    body.forEach((name) => {
      if (name.isObject) {
        const obj = name.valueOf();
        Object.keys(obj).forEach((key) => {
          const [head2, ...tail2] = obj[key].getBody();
          if (typeof head2.value !== "string")
            check3(head2);
          calls.push(() => callback(obj[key], key, head2.valueOf()));
          tail2.forEach((sub) => {
            if (typeof sub.value !== "string")
              check3(sub);
            calls.push(() => callback(sub, sub.valueOf()));
          });
        });
      } else {
        if (typeof name.value !== "string")
          check3(name);
        calls.push(() => callback(name, name.valueOf()));
      }
    });
    return calls.map((run) => run());
  }
  static call(obj, name, label, tokenInfo) {
    const hasProto = Object.prototype.hasOwnProperty.call(obj, "prototype");
    let target = hasProto && obj.prototype[name] || obj[name];
    if (typeof target !== "function") {
      return Expr2.value(target);
    }
    if (hasProto && obj.prototype[name]) {
      target = (...args) => obj.prototype[name].call(...args);
    }
    return Expr2.function({ type: LITERAL2, value: { label, target } }, tokenInfo);
  }
  static fn(value, tokenInfo) {
    if (typeof value === "function") {
      const F = value;
      const isClass = F.prototype && F.constructor === Function && F.prototype.constructor === F;
      const target = (...args) => isClass ? new F(...args) : F(...args);
      Object.defineProperty(target, "name", { value: F.name });
      Object.defineProperty(target, "toString", { value: () => serialize2(F) });
      Object.getOwnPropertyNames(F).forEach((key) => {
        if (!["name", "length", "prototype"].includes(key)) {
          target[key] = F[key];
        }
      });
      return Expr2.value(target, tokenInfo);
    }
    return Expr2.function({ type: LITERAL2, value }, tokenInfo);
  }
  static map(params, tokenInfo) {
    return Expr2.object({ type: LITERAL2, value: params }, tokenInfo);
  }
  static tag(node, tokenInfo) {
    return Expr2.markup({ type: LITERAL2, value: node }, tokenInfo);
  }
  static let(params, tokenInfo) {
    return Expr2.map({ let: Expr2.stmt("@let", params) }, tokenInfo);
  }
  static body(values, tokenInfo) {
    return Expr2.from(BLOCK2, { body: values || [] }, tokenInfo);
  }
  static frac(a22, b22, tokenInfo) {
    return Expr2.from(NUMBER2, new Expr2.Frac(a22, b22), tokenInfo);
  }
  static unit(num, type, tokenInfo) {
    if (typeof num === "number") {
      return Expr2.from(NUMBER2, { num, kind: type }, tokenInfo);
    }
    return Expr2.from(NUMBER2, num, type || tokenInfo);
  }
  static array(values, tokenInfo) {
    return Expr2.from(RANGE2, values, tokenInfo);
  }
  static local(name, tokenInfo) {
    return Expr2.from(LITERAL2, name, tokenInfo);
  }
  static symbol(name, optional, tokenInfo) {
    return Expr2.from(SYMBOL2, name + (optional ? "?" : ""), tokenInfo);
  }
  static group(values, tokenInfo) {
    return !Array.isArray(values) ? Expr2.block(values, tokenInfo, true) : Expr2.block({ args: values }, tokenInfo, true);
  }
  static range(begin, end, tokenInfo) {
    if (!begin.length && !end.length)
      check3(tokenInfo, "values", "around");
    if (!begin.length)
      check3(tokenInfo, "value", "before");
    return Expr2.from(RANGE2, { begin, end }, tokenInfo);
  }
  static block(params, tokenInfo, rawDefinition) {
    if (rawDefinition) {
      tokenInfo = tokenInfo || {};
      tokenInfo.kind = "raw";
    }
    return Expr2.from(BLOCK2, params || {}, tokenInfo);
  }
  static unsafe(target, label, raw) {
    return {
      [FFI2]: true,
      target,
      label: label || `FFI/${target.name || "?"}`,
      raw: !!raw
    };
  }
  static define(type, Class) {
    Expr2[Class.name.replace(/_$/, "")] = Class;
    if (!Expr2[type]) {
      Expr2[type] = (...args) => new Class(...args);
    }
    return Class;
  }
}

class Range2 {
  constructor(base, target, increment) {
    this.alpha = this.alpha || false;
    this.step = increment || 1;
    this.offset = null;
    this.length = null;
    this.max = Infinity;
    this.begin = base.valueOf();
    this.end = typeof target === "undefined" || target === null ? Infinity : target.valueOf();
    this.infinite = this.end === Infinity || this.end === -Infinity;
    if (!this.infinite && (isString2(base) || isString2(target))) {
      this.begin = String(this.begin).charCodeAt();
      this.end = String(this.end).charCodeAt();
      this.alpha = true;
    }
    if (!this.infinite && this.begin > this.end) {
      this.step = -1;
    }
    Object.defineProperty(this, "idx", { value: 0, writable: true });
  }
  getIterator() {
    return Range2.build(this.begin, this.end, this.step, this.infinite);
  }
  toString() {
    const prefix = this.infinite ? `${this.begin}..` : [this.begin, this.end].join("..");
    let suffix = "";
    let defs = this.idx;
    if (this.max !== Infinity) {
      suffix += `:${this.max}`;
      defs--;
    }
    if (Math.abs(this.step) !== 1) {
      suffix += `:${this.step}`;
      defs--;
    }
    suffix += Array.from({ length: defs + 1 }).join(":");
    if (this.offset !== null) {
      suffix += `:${this.offset}`;
    }
    return prefix + suffix;
  }
  take(expr) {
    const {
      offset,
      length,
      begin,
      end
    } = slice2(expr);
    if (expr === ":") {
      if (this.idx >= 2)
        throw new Error(`Unexpected \`:\` after \`${this}\``);
      this.idx++;
      return this;
    }
    if (typeof begin !== "undefined" && typeof end !== "undefined") {
      if (this.offset !== null || this.idx < 2)
        throw new Error(`Unexpected take-range \`:${begin}..${end}\` after \`${this}\``);
      this.offset = begin;
      this.length = end;
      this.idx += 2;
      if (begin < 0 && end < 0) {
        this.length = (begin - end) * -1;
      }
      return this;
    }
    if (typeof offset !== "undefined" && typeof length !== "undefined") {
      if (this.max !== Infinity || this.idx > 0)
        throw new Error(`Unexpected take-step \`:${offset}-${length}\` after \`${this}\``);
      this.max = offset;
      this.step = length;
      this.idx += 2;
      return this;
    }
    if (this.idx >= 2) {
      if (this.offset !== null)
        throw new Error(`Unexpected take-range \`:${offset}\` after \`${this}\``);
      this.offset = offset;
      this.max = 1;
    } else if (this.idx === 1) {
      this.step = offset;
      this.idx++;
    } else {
      this.max = offset;
      this.idx++;
    }
    return this;
  }
  run(invoke, callback) {
    return invoke ? Range2.run(this, callback || ((x22) => x22)) : this;
  }
  static async run(gen, callback) {
    const it = gen.getIterator();
    const seq = [];
    const max2 = gen.infinite ? Infinity : gen.end > gen.begin ? gen.end - gen.begin : gen.begin - gen.end;
    for (let i22 = 0, nextValue = it.next();nextValue.done !== true; nextValue = it.next(), i22++) {
      let keep = true;
      if (gen.offset !== null) {
        if (gen.offset >= 0) {
          keep = i22 >= gen.offset;
        } else if (gen.infinite) {
          throw new Error("Negative offsets are not supported for infinite ranges");
        } else if (gen.begin < 0) {
          keep = max2 - i22 + gen.offset < 0;
        } else {
          keep = i22 >= gen.offset + gen.end;
        }
      }
      if (keep) {
        const newValue = gen.alpha ? String.fromCharCode(nextValue.value) : nextValue.value;
        const fixedValue = await callback(Expr2.value(newValue));
        seq.push(...!Array.isArray(fixedValue) ? [fixedValue] : fixedValue);
      }
      if (seq.length >= gen.max)
        break;
      if (gen.length !== null && seq.length >= gen.length)
        break;
    }
    return seq;
  }
  static from(begin, end, take2, step, offset, length) {
    const range = new Range2(begin, end, step);
    if (typeof take2 === "number")
      range.max = take2;
    if (typeof offset === "number")
      range.offset = offset;
    if (typeof length === "number")
      range.length = length;
    return range;
  }
  static *build(begin, end, i22) {
    const infinite = end === Infinity || end === -Infinity;
    let current22 = begin;
    while (true) {
      yield current22;
      if (!infinite && current22 === end)
        return;
      current22 += i22;
    }
  }
  static async unwrap(result, callback, nextToken) {
    if (!Array.isArray(result)) {
      if (isString2(result)) {
        return split2(result.value).map((chunk) => Expr2.value(chunk));
      }
      if (isNumber2(result)) {
        return [new Range2(Expr2.value(1), result.valueOf())];
      }
      if (result.value instanceof Range2) {
        if (nextToken) {
          if (nextToken.value !== ":")
            result.value.idx += 2;
          result.value.take(nextToken.value);
        }
        return result.value.run(true, callback);
      }
      return result.value;
    }
    const seq = [];
    for (let j = 0, k22 = result.length;j < k22; j++) {
      const values = await Range2.unwrap(result[j], callback, nextToken);
      for (let i22 = 0, c22 = values.length;i22 < c22; i22++) {
        let data;
        if (values[i22] instanceof Range2 || isRange2(values[i22])) {
          data = await Range2.run(values[i22].value || values[i22], callback);
        } else {
          data = await callback(values[i22]);
        }
        seq.push(...data);
      }
    }
    return seq;
  }
}
function isRangeLike2(input2) {
  return input2 instanceof Range2 || input2 && typeof input2.getIterator === "function" && typeof input2.run === "function";
}
function isLazySeq2(input2) {
  return !!(input2 && input2[RE_LAZY2]);
}
function asRange2(input2) {
  if (isRangeLike2(input2))
    return input2;
  if (input2 && input2.value) {
    return asRange2(input2.value);
  }
  if (input2 && Array.isArray(input2.begin) && Array.isArray(input2.end) && input2.begin.length) {
    const begin = input2.begin[0];
    const end = input2.end.length ? input2.end[0] : undefined;
    return Range2.from(begin, end);
  }
  return null;
}
function collectRange2(range, limit = Infinity, offset = 0) {
  const seq = [];
  let index = 0;
  if (range.infinite && limit === Infinity) {
    raise2("Infinite range requires explicit limit");
  }
  const iterator = range.getIterator();
  for (let next = iterator.next();next.done !== true; next = iterator.next(), index++) {
    if (index < offset)
      continue;
    seq.push(range.alpha ? String.fromCharCode(next.value) : next.value);
    if (seq.length >= limit)
      break;
  }
  return seq;
}
function toToken2(value) {
  return value instanceof Expr2 ? value : Expr2.value(value);
}
function fromToken2(value) {
  return value instanceof Expr2 ? value.valueOf() : value;
}
function toLazy2(input2) {
  if (isLazySeq2(input2))
    return input2;
  if (input2 && input2.value)
    return toLazy2(input2.value);
  const range = asRange2(input2);
  if (range) {
    return {
      [RE_LAZY2]: true,
      source: range,
      ops: [],
      infinite: !!range.infinite
    };
  }
  return null;
}
function appendLazy2(input2, op) {
  const lazy = toLazy2(input2);
  if (!lazy)
    return null;
  return {
    [RE_LAZY2]: true,
    source: lazy.source,
    ops: lazy.ops.concat(op),
    infinite: lazy.infinite
  };
}
async function collectLazy2(input2, limit = Infinity, offset = 0) {
  const lazy = toLazy2(input2);
  if (!lazy)
    return null;
  if (lazy.infinite && limit === Infinity)
    raise2("Infinite range requires explicit limit");
  let iterator;
  if (isRangeLike2(lazy.source)) {
    iterator = lazy.source.getIterator();
  } else if (Array.isArray(lazy.source) || typeof lazy.source[Symbol.iterator] === "function") {
    iterator = lazy.source[Symbol.iterator]();
  } else {
    raise2("Input is not iterable");
  }
  const seq = [];
  let index = 0;
  for (let next = iterator.next();next.done !== true; next = iterator.next(), index++) {
    if (index < offset)
      continue;
    let value = next.value;
    if (isRangeLike2(lazy.source) && lazy.source.alpha) {
      value = String.fromCharCode(value);
    }
    let keep = true;
    let token = toToken2(value);
    for (let i22 = 0, c22 = lazy.ops.length;i22 < c22; i22++) {
      const op = lazy.ops[i22];
      if (op.type === "map") {
        token = toToken2(await op.callback(token));
      }
      if (op.type === "filter") {
        keep = !!await op.callback(token);
        if (!keep)
          break;
      }
    }
    if (!keep)
      continue;
    seq.push(fromToken2(token));
    if (seq.length >= limit)
      break;
  }
  return seq;
}
function equals2(a22, b22, weak) {
  if (typeof a22 === "undefined")
    raise2("Missing left value");
  if (typeof b22 === "undefined")
    raise2("Missing right value");
  return !hasDiff2(a22, b22, weak);
}
function items2(...args) {
  return args.reduce((p22, c22) => p22.concat(c22), []);
}
function show2(...args) {
  return serialize2(args);
}
function render3(input2) {
  if (typeof input2 === "undefined")
    raise2("No input to render");
  if (input2 && input2.isTag) {
    return renderTag2(input2.value);
  }
  if (input2 && input2.isString) {
    return input2.valueOf();
  }
  return serialize2(input2);
}
function cast2(token, target) {
  if (!token)
    raise2("Missing input to cast");
  if (!target)
    raise2("Missing type to cast");
  assert2(target, null, SYMBOL2);
  let value;
  switch (target.get()) {
    case ":number":
      value = parseFloat(token.get());
      break;
    case ":string":
      value = token.get().toString();
      break;
    default:
      raise2(`Invalid cast to ${target.get()}`);
  }
  return value;
}
function repr22(token) {
  let type;
  if (token.isTag)
    type = "markup";
  else if (token.isObject)
    type = "object";
  else if (token.isFunction)
    type = "function";
  else if (token.isCallable)
    type = "definition";
  else if (token.isSymbol)
    type = "symbol";
  else if (token.isRange)
    type = "range";
  else if (token.isMarkup)
    type = "markup";
  else
    type = repr3(token.type).toLowerCase();
  return Expr2.symbol(`:${type}`);
}
function size2(token) {
  let obj;
  if (token.isTag)
    obj = token.value.children || [];
  else if (token.isFunction)
    obj = token.valueOf().target;
  else if (token.isObject)
    obj = Object.keys(token.valueOf());
  else if (token.isScalar || token.isRange)
    obj = token.valueOf();
  else
    obj = token;
  return obj.length - (token.isSymbol ? 1 : 0);
}
function get3(target, ...props) {
  const isObject22 = target.length === 1 && (target[0].isObject || target[0].isRange);
  const isArray22 = isObject22 && target[0].isRange;
  const input2 = isObject22 ? target[0].valueOf() : target;
  return props.reduce((prev, cur) => prev.concat(isObject22 && !isArray22 ? input2[cur].getBody() : input2[cur]), []);
}
function push2(target, ...sources) {
  if (!target)
    raise2("No target given");
  if (!(target.isObject || target.isString || target.isNumber || target.isRange))
    raise2("Invalid target");
  sources.forEach((sub) => {
    if (target.isObject && sub.isObject)
      Object.assign(target.value, sub.value);
    if (target.isString)
      target.value += sub.valueOf();
    if (target.isRange) {
      if (sub.isRange)
        target.value.push(...sub.value);
      else
        target.value.push(sub);
    }
    if (target.isNumber) {
      target.value = (target.valueOf() + sub.valueOf()).toString();
    }
  });
  return target;
}
function list2(input2) {
  if (!input2)
    raise2("No input to list given");
  let data;
  const range = asRange2(input2);
  if (Array.isArray(input2)) {
    data = input2;
  } else if (range) {
    data = collectRange2(range);
  } else {
    if (!input2.isIterable)
      raise2("Input is not iterable");
    data = input2.getArgs() || input2.getBody() || input2.valueOf();
  }
  return data;
}
async function head2(input2) {
  const lazy = await collectLazy2(input2, 1);
  if (lazy) {
    if (!lazy.length)
      raise2("head: empty list");
    return lazy[0];
  }
  const range = asRange2(input2);
  if (range) {
    const [first2] = collectRange2(range, 1);
    if (typeof first2 === "undefined")
      raise2("head: empty list");
    return first2;
  }
  const [first] = list2(input2);
  if (typeof first === "undefined")
    raise2("head: empty list");
  return first;
}
async function tail2(input2) {
  const lazy = await collectLazy2(input2, Infinity, 1);
  if (lazy) {
    return lazy;
  }
  const range = asRange2(input2);
  if (range) {
    return collectRange2(range, Infinity, 1);
  }
  return list2(input2).slice(1);
}
async function take2(input2, length) {
  const lazy = await collectLazy2(input2, length || 1);
  if (lazy) {
    return lazy;
  }
  const range = asRange2(input2);
  if (range) {
    return collectRange2(range, length || 1);
  }
  return list2(input2).slice(0, length || 1);
}
async function drop2(input2, length, offset) {
  const lazy = toLazy2(input2);
  if (lazy && lazy.infinite && typeof offset === "undefined") {
    const amount = length ? length.valueOf() : 1;
    return appendLazy2(input2, {
      type: "filter",
      callback: (() => {
        let count = amount;
        return () => count-- <= 0;
      })()
    });
  }
  const range = asRange2(input2);
  if (range) {
    const max2 = range.infinite ? offset ? offset.valueOf() + (length ? length.valueOf() : 1) : (length ? length.valueOf() : 1) + 1 : Infinity;
    const arr2 = collectRange2(range, max2);
    const b3 = length ? length.valueOf() : 1;
    const a3 = offset ? offset.valueOf() : arr2.length - b3;
    arr2.splice(a3, b3);
    return arr2;
  }
  const arr = list2(input2);
  const b22 = length ? length.valueOf() : 1;
  const a22 = offset ? offset.valueOf() : arr.length - b22;
  arr.splice(a22, b22);
  return input2;
}
async function map2(input2, callback) {
  if (typeof callback !== "function")
    raise2("Missing map callback");
  const lazy = appendLazy2(input2, { type: "map", callback });
  if (lazy) {
    return lazy;
  }
  const arr = await list2(input2);
  const out = [];
  for (let i22 = 0, c22 = arr.length;i22 < c22; i22++) {
    out.push(fromToken2(await callback(toToken2(arr[i22]))));
  }
  return out;
}
async function filter2(input2, callback) {
  if (typeof callback !== "function") {
    raise2("Missing filter callback");
  }
  const lazy = appendLazy2(input2, { type: "filter", callback });
  if (lazy) {
    return lazy;
  }
  const arr = await list2(input2);
  const out = [];
  for (let i22 = 0, c22 = arr.length;i22 < c22; i22++) {
    if (await callback(toToken2(arr[i22]))) {
      out.push(arr[i22]);
    }
  }
  return out;
}
function rev2(input2) {
  return list2(input2).reverse();
}
function pairs2(input2) {
  if (!input2)
    raise2("No input given");
  if (!(input2.isRange || input2.isObject))
    raise2("Invalid input");
  return Object.entries(input2.valueOf());
}
function keys2(input2) {
  return pairs2(input2).map(([k22]) => k22);
}
function vals2(input2) {
  return pairs2(input2).map((x22) => x22[1]);
}
async function check22(input2, run) {
  if (!input2 || !input2.length)
    raise2("Missing expression to check");
  const offset = input2.findIndex((x22) => isSome2(x22) || isOR2(x22));
  const expr = offset > 0 ? input2.slice(0, offset) : input2;
  const msg = offset > 0 ? input2.slice(offset + 1) : [];
  const [result] = await run(...expr);
  const passed = result && result.get() === true;
  if (!isSome2(input2[offset]) ? !passed : passed) {
    let debug22;
    if (msg.length > 0) {
      [debug22] = await run(...msg);
      debug22 = debug22 && debug22.valueOf();
    }
    return `\`${serialize2(expr)}\` ${debug22 || "did not passed"}`;
  }
}
function format22(str, ...args) {
  if (!str)
    raise2("No format string given");
  if (!str.isString)
    raise2("Invalid format string");
  if (!args.length)
    raise2("Missing value to format");
  const data = args.reduce((p22, c22) => {
    if (p22[p22.length - 1] && (p22[p22.length - 1].isRange && c22.isRange || p22[p22.length - 1].isObject && c22.isObject)) {
      push2(p22[p22.length - 1], c22);
    } else
      p22.push(c22);
    return p22;
  }, []);
  let offset = 0;
  return str.value.replace(RE_PLACEHOLDER2, (_22, key) => {
    if (!RE_FORMATTING2.test(key))
      raise2(`Invalid format \`${_22}\``);
    const [
      idx,
      fill,
      width,
      type,
      precision,
      transform
    ] = key.match(RE_FORMATTING2).slice(1);
    let [value] = get3(data, idx || offset++);
    if (typeof value === "undefined")
      return _22;
    let prefix = "";
    let suffix = "";
    if (type === "?")
      value = serialize2(value);
    else if (isBlock2(value))
      value = value.toString();
    else if (precision && (isUnit2(value) || isNumber2(value))) {
      const fix = precision.substr(1);
      if (isUnit2(value)) {
        const { value: base } = value;
        if (typeof base.kind === "string") {
          value = base.num.toFixed(fix);
          value = `${value} ${base.kind}`;
        } else {
          value = `${base.num}/${base.kind}`;
        }
      } else {
        value = value.valueOf().toFixed(fix);
      }
    } else if (type === "x")
      value = value.valueOf().toString(16);
    else if (type === "o")
      value = value.valueOf().toString(8);
    else if (type === "b")
      value = value.valueOf().toString(2);
    else
      value = value.valueOf().toString();
    if (typeof fill !== "undefined" && fill.length || width > 0) {
      const separator = fill.length > 1 ? fill.substr(0, fill.length - 1) : null;
      const alignment = fill.substr(-1);
      const padding = Array.from({
        length: (parseInt(width, 10) || 0) + 1 - value.length
      }).join(separator || " ");
      if (alignment === "^") {
        prefix = padding.substr(0, padding.length / 2);
        suffix = padding.substr(padding.length / 2);
      } else if (alignment === ">")
        suffix = padding;
      else
        prefix = padding;
    }
    if (transform === "^")
      value = value.toUpperCase();
    if (transform === "$")
      value = value.toLowerCase();
    value = prefix + value + suffix;
    return value;
  });
}

class Env2 {
  constructor(value) {
    this.locals = {};
    this.annotations = {};
    this.resolved = new Set;
    this.templates = {};
    this.exported = true;
    this.exportedTemplates = {};
    this.descriptor = null;
    Object.defineProperty(this, "parent", { value });
  }
  has(name, recursive) {
    return !(recursive && this.parent && !this.locals[name]) ? typeof this.locals[name] !== "undefined" : this.parent.has(name, recursive);
  }
  get(name) {
    if (this.resolved.has(name)) {
      const found = Expr2.has(this.locals[name].body, LITERAL2, name);
      const call2 = this.locals[name].body[0].isCallable;
      if (found && !call2) {
        raise2(`Unexpected reference to \`${name}\``);
      }
      return this.locals[name];
    }
    if (!this.locals[name]) {
      if (this.parent) {
        return this.parent.get(name);
      }
      raise2(`Undeclared local \`${name}\``);
    }
    this.resolved.add(name);
    return this.locals[name];
  }
  set(name, value, noInheritance) {
    if (typeof value === "function") {
      let root = this;
      if (noInheritance !== true) {
        while (root && root.parent) {
          if (root && root.has(name))
            break;
          root = root.parent;
        }
      }
      value(root, root.locals[name]);
    } else {
      this.locals[name] = value;
    }
  }
  def(name, ...values) {
    this.set(name, { body: [].concat(values) });
  }
  annotate(name, typeText) {
    this.annotations[name] = String(typeText || "").trim();
  }
  getAnnotation(name, recursive = true) {
    if (this.annotations[name])
      return this.annotations[name];
    if (recursive && this.parent)
      return this.parent.getAnnotation(name, recursive);
    return null;
  }
  defn(name, params, tokenInfo) {
    this.set(name, (root) => {
      root.set(name, { ...params, ctx: tokenInfo });
    }, true);
  }
  static up(name, label, callback, environment) {
    environment.set(name, (root, token) => {
      root.set(name, { body: [Expr2.value(callback(), token.ctx || token.body[0].tokenInfo)] });
    });
  }
  static sub(args, target, environment) {
    const scope = new Env2(environment);
    const list22 = Expr2.args(args);
    while (target.body && target.body[0].isCallable) {
      Env2.merge(list22, target.args, true, scope);
      target = target.body[0].value;
    }
    if (target.body && target.args) {
      Env2.merge(list22, target.args, true, scope);
    }
    return { target, scope };
  }
  static async load(ctx, name, alias, source, environment) {
    let label = `${source.split("/").pop()}/${name}${alias ? `:${alias}` : ""}`;
    const isGlobal = SAFE_GLOBALS2.includes(source);
    const shared = Object.assign({
      Prelude: SAFE_PRELUDE2,
      Unit: Expr2.Unit,
      Frac: Expr2.Frac
    }, Env2.shared);
    try {
      let env;
      if (isGlobal) {
        env = globalThis[source];
      } else if (shared[source]) {
        env = shared[source];
      } else {
        env = await Env2.resolve(source, name, alias, environment);
      }
      if (!env) {
        raise2(`Could not load \`${name}\``, ctx.tokenInfo);
      }
      if (env instanceof Env2) {
        if (env.descriptor) {
          label = `${env.descriptor}/${label.split("/")[1]}`;
        }
        if (typeof env.exported === "object") {
          name = env.exported[name] || name;
        }
        if (!env.has(name)) {
          raise2(`Local \`${name}\` not exported`);
        }
        environment.defn(alias || name, {
          body: [Expr2.fn({
            env,
            label,
            target: name
          }, ctx.tokenInfo)]
        }, ctx.tokenInfo);
        return;
      }
      if (!isGlobal && typeof env[name] === "undefined") {
        if (name !== "default" || (!alias || name === alias))
          raise2(`Symbol \`${name}\` not exported`);
        environment.def(alias, Expr2[isPlain22(env) ? "value" : "fn"](env, ctx.tokenInfo));
        return;
      }
      let body = env[name];
      if (!Array.isArray(body) || !(body[0] instanceof Expr2)) {
        body = [Expr2.call(env, name, label, ctx.tokenInfo)];
      }
      if (isPlain22(env[name]) && env[name][FFI2]) {
        const fixedToken = { ...ctx.tokenInfo };
        const ffi = env[name];
        if (ffi.raw) {
          fixedToken.kind = "raw";
        }
        body = [Expr2.function({
          type: FFI2,
          value: {
            target: ffi.target,
            label: ffi.label
          }
        }, fixedToken)];
      }
      environment.defn(alias || name, { body }, ctx.tokenInfo);
    } catch (e22) {
      raise2(`${e22.message} (${label})`, ctx.tokenInfo);
    }
  }
  static merge(list22, values, hygiene, environment) {
    const args = Expr2.args(values, true);
    for (let i22 = 0, c22 = args.length;i22 < c22; i22++) {
      if (list22.length) {
        const key = args[i22].value;
        const value = key === ".." ? list22.splice(0, list22.length) : list22.shift();
        if (!hygiene || !(environment.parent && environment.parent.has(key, true))) {
          environment.def(key, Array.isArray(value) ? Expr2.body(value, args[i22].tokenInfo) : value);
        }
      } else
        break;
    }
  }
  static create(values, environment) {
    const scope = new Env2(environment);
    Object.keys(values).forEach((key) => {
      if (!(values[key] instanceof Expr2)) {
        scope.def(key, Expr2.value(values[key]));
      } else {
        scope.def(key, values[key]);
      }
    });
    return scope;
  }
  static register() {
    return;
  }
  static resolve() {
    return;
  }
}

class Scanner2 {
  constructor(source, tokenInfo) {
    this.refs = {};
    this.chars = split2(source);
    this.source = source;
    this.tokens = [];
    this.chunks = [];
    this.current = null;
    this.blank = "";
    this.offset = 0;
    this.start = 0;
    this.line = 0;
    this.col = 0;
    this.afterEOL = null;
    if (tokenInfo) {
      this.line = tokenInfo.line;
      this.col = tokenInfo.col;
    }
  }
  tokenInfo(clear) {
    if (!this.current) {
      this.current = { line: this.line, col: this.col };
    }
    if (clear) {
      const info = this.current;
      delete this.current;
      return info;
    }
  }
  append(value, tokenInfo) {
    if (this.chunks.length) {
      this.chunks.push(new Token2(PLUS2, "+", null, tokenInfo));
    }
    if (!Array.isArray(value)) {
      if (value.indexOf("#{") === -1) {
        this.chunks.push(new Token2(STRING2, value, null, { ...tokenInfo, kind: "raw" }));
      } else {
        this.chunks.push(...new Scanner2(quote3(value), { line: 0, col: 3 }).scanTokens()[0].value);
      }
    } else {
      value.pop();
      this.chunks.push(new Token2(OPEN2, "#{", null, { ...value[0], kind: "raw" }));
      this.chunks.push(...value);
      this.chunks.push(new Token2(CLOSE2, "}", null, { ...value[value.length - 1], kind: "raw" }));
    }
  }
  appendText(char, depth) {
    if (this.blank.length) {
      const { line, col } = this.tokenInfo(true);
      let style3;
      let level = 0;
      let kind = TEXT2;
      if (char) {
        if (char === "#") {
          let i22 = 0;
          level++;
          for (;i22 < 4; i22++) {
            if (this.blank.charAt(i22) === "#")
              level++;
            else
              break;
          }
          if (this.blank.charAt(i22) !== " ") {
            this.appendBuffer({ buffer: format6(char + this.blank) }, line, col);
            return;
          }
          kind = HEADING2;
          this.blank = this.blank.substr(level);
        } else if (char === ">") {
          kind = BLOCKQUOTE2;
        } else if (isDigit2(char))
          kind = OL_ITEM2;
        else
          kind = UL_ITEM2;
        this.blank = this.blank.replace(/^\s+/, "");
        if (isDigit2(char))
          level = parseFloat(char);
        if (kind === OL_ITEM2 || kind === UL_ITEM2)
          style3 = char;
      }
      const value = {
        buffer: format6(this.blank)
      };
      if (level)
        value.level = level;
      if (style3)
        value.style = style3;
      if (depth)
        value.depth = depth;
      if (kind !== TEXT2)
        value.kind = kind;
      this.appendBuffer(value, line, col);
    }
  }
  appendBuffer(value, line, col) {
    let offset = col;
    const extractInterpolationTokens = (chunk, atLine, atCol) => {
      if (chunk.indexOf("#{") === -1)
        return [chunk];
      const [token] = new Scanner2(quote3(chunk), { line: atLine, col: atCol }).scanTokens();
      const parts = [];
      token.value.forEach((sub, idx, all) => {
        if (sub.type === PLUS2) {
          const prev = all[idx - 1];
          const next = all[idx + 1];
          const isPrefixJoin = prev && next && prev.type === STRING2 && prev.isRaw && next.type === OPEN2 && next.value === "#{";
          const isSuffixJoin = prev && next && prev.type === CLOSE2 && prev.value === "}" && next.type === STRING2 && next.isRaw;
          if (isPrefixJoin || isSuffixJoin)
            return;
        }
        if (sub.type === STRING2 && sub.isRaw) {
          parts.push(sub.value);
        } else {
          parts.push(sub);
        }
      });
      return parts;
    };
    value.buffer = value.buffer.reduce((prev, cur) => {
      if (typeof cur === "string" && cur.includes("[")) {
        const parts = cur.split(/(!?\[.+?\](?:\s*\[.*?\]|\(.+?\)))/g);
        parts.forEach((chunk) => {
          if (chunk.indexOf("]") !== -1) {
            const matches = chunk.match(/\[(.+?)\](?:\s*\[(.*?)\]|\((.+?)\))/);
            const [href, title] = (matches[3] || matches[2]).split(/\s+/);
            const desc = title && title.charAt() === '"' ? title.substr(1, title.length - 2) : null;
            const alt = matches[1];
            prev.push(new Token2(REF2, {
              image: chunk.charAt() === "!",
              text: chunk,
              href: href || alt,
              cap: desc || null,
              alt: href ? alt : null
            }, null, { line, col: offset }));
          } else {
            prev.push(...extractInterpolationTokens(chunk, line, offset));
          }
          offset += chunk.length;
        });
      } else if (Array.isArray(cur)) {
        offset += cur[2].length;
        prev.push(cur);
      } else if (typeof cur === "string") {
        prev.push(...extractInterpolationTokens(cur, line, offset));
        offset += cur.length;
      } else {
        prev.push(cur);
      }
      return prev;
    }, []);
    this.tokens.push(new Token2(TEXT2, value, null, { line, col }));
    this.blank = "";
  }
  scanTokens() {
    while (!this.isDone()) {
      this.start = this.offset;
      if (this.scanToken() === false)
        break;
    }
    if (!this.tokens.length) {
      raise2("Missing input", this);
    }
    this.appendText();
    this.tokens.push(new Token2(EOF2, "", null));
    return this.tokens;
  }
  scanToken() {
    const char = this.getToken();
    if (typeof char !== "string")
      return false;
    if (char !== `
` && this.blank[this.blank.length - 1] === `
`)
      this.appendText();
    if (this.col === 1) {
      if (this.afterEOL !== 1 && char === "[" && this.parseRef(this.col))
        return;
      if (char === "-" && this.parseThematicBreak())
        return;
      if (char === "#" && this.parseBlock(char))
        return;
      if (char === ">" && this.peek() === " " && this.parseBlock(char))
        return;
      if (char === "[" && this.parseLinkLine())
        return;
      if (char === "|" && this.parseTableLine())
        return;
      if (this.afterEOL !== 1 && (isAlphaNumeric2(char) && char !== "@" || char === "*") && this.parseText(char))
        return;
      if (char === "`" && char === this.peek() && char === this.peekNext() && this.parseFence(char))
        return;
    }
    if (char === '"' && char === this.peek() && char === this.peekNext() && this.parseFence(char))
      return;
    if (this.blank.length === this.col - 1 && isDigit2(char)) {
      let chunk = char;
      while (isDigit2(this.peek()))
        chunk += this.getToken();
      if (this.peek() === "." && this.peekNext() === " ") {
        this.parseItem(chunk);
        return;
      }
    }
    if ("-+*".includes(char) && this.blank.length === this.col - 1 && this.peekToken() === " " && this.parseItem(char))
      return;
    switch (char) {
      case "(":
        this.addToken(OPEN2);
        break;
      case ")":
        this.addToken(CLOSE2);
        break;
      case "{":
        this.addToken(OPEN2, char, { kind: "brace" });
        break;
      case "}":
        this.addToken(CLOSE2, char, { kind: "brace" });
        break;
      case ",":
        this.addToken(COMMA2);
        break;
      case "[":
        this.addToken(BEGIN2);
        break;
      case "]":
        this.addToken(DONE2);
        break;
      case ".":
        if (this.isMatch(".")) {
          this.addToken(RANGE2);
        } else {
          let next = this.peek();
          if (next === " " || next === "\t" || next === "\r") {
            let i22 = 0;
            while (this.peekToken(i22) === " " || this.peekToken(i22) === "\t" || this.peekToken(i22) === "\r")
              i22++;
            next = this.peekToken(i22);
          }
          if (next === `
` || this.isDone() || next === "" || typeof next === "undefined") {
            this.addToken(EOL2);
          } else {
            this.addToken(DOT2);
          }
        }
        break;
      case "-":
        if (this.isMatch(">")) {
          this.addToken(BLOCK2);
        } else {
          this.addToken(MINUS2);
        }
        break;
      case "+":
        this.addToken(PLUS2);
        break;
      case "*":
        this.addToken(MUL2);
        break;
      case "!":
        this.addToken(this.isMatch("=") ? NOT_EQ2 : NOT2);
        break;
      case "=":
        this.addToken(this.isMatch("=") ? EXACT_EQ2 : EQUAL2);
        break;
      case "%":
        this.addToken(MOD2);
        break;
      case "~":
        this.addToken(LIKE2);
        break;
      case "?":
        this.addToken(SOME2);
        break;
      case "$":
        this.addToken(EVERY2);
        break;
      case "|":
        this.addToken(this.isMatch(">") ? PIPE2 : OR2);
        break;
      case ">":
        this.addToken(this.isMatch("=") ? GREATER_EQ2 : GREATER2);
        break;
      case "<":
        if (isReadable2(this.peekToken())) {
          this.parseMarkup();
        } else {
          this.addToken(this.isMatch("=") ? LESS_EQ2 : LESS2);
        }
        break;
      case "/":
        if (this.isMatch("/")) {
          this.parseComment();
        } else if (this.isMatch("*")) {
          this.parseComment(true);
        } else if (this.peekToken() !== " ") {
          this.parseRegex();
        } else {
          this.addToken(DIV2);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        this.pushToken(char);
        break;
      case `
`:
        this.pushToken(char);
        this.col = 0;
        this.line++;
        if (this.afterEOL !== null)
          this.afterEOL++;
        break;
      case '"':
        this.parseString();
        break;
      case ":":
        this.parseSymbol();
        break;
      case "@":
        this.parseDirective();
        break;
      default:
        if (isDigit2(char)) {
          this.parseNumber();
        } else if (isReadable2(char)) {
          if (this.peek() === "." && this.peekNext() === ".") {
            this.addToken(LITERAL2);
          } else {
            this.parseIdentifier();
          }
        } else {
          this.col--;
          raise2(`Unexpected ${char}`, this);
        }
        break;
    }
  }
  addToken(type, literal22, tokenInfo) {
    const value = this.getCurrent();
    this.appendText();
    tokenInfo = {
      line: this.line,
      col: this.col - value.length,
      ...tokenInfo
    };
    this.tokens.push(new Token2(type, value, literal22, tokenInfo));
    this.afterEOL = type === EOL2 ? 0 : null;
  }
  nextToken(nth = 1) {
    this.tokenInfo();
    while (nth--) {
      if (this.chars[this.offset] !== "") {
        this.col++;
        this.offset++;
      }
    }
  }
  pushToken(...chars) {
    this.blank += chars.join("");
  }
  peekToken(offset = 0) {
    return this.chars[this.offset + offset];
  }
  getToken() {
    this.nextToken();
    return this.chars[this.offset - 1];
  }
  getCurrent(chunk) {
    if (chunk) {
      return this.source.substring(this.start, this.offset).substr(-chunk.length);
    }
    return this.source.substring(this.start, this.offset);
  }
  parseIdentifier() {
    while (isAlphaNumeric2(this.peek()))
      this.nextToken();
    this.addToken(LITERAL2);
  }
  parseNumber() {
    let value;
    while (isDigit2(this.peek()))
      this.nextToken();
    if (this.peek() === "." && isDigit2(this.peekNext())) {
      this.nextToken();
      while (isDigit2(this.peek()))
        this.nextToken();
    }
    if (this.peek() === "/" && isDigit2(this.peekNext())) {
      let i22 = this.offset + 1;
      while (i22 < this.chars.length && isDigit2(this.chars[i22]))
        i22++;
      if (i22 < this.chars.length && this.chars[i22] === ".") {} else {
        this.nextToken();
        while (isDigit2(this.peek()))
          this.nextToken();
        const [left, right] = this.getCurrent().split("/");
        value = new Expr2.Frac(parseFloat(left), parseFloat(right));
      }
    }
    if (this.peek() === " " || isReadable2(this.peek())) {
      const num = value ? value.valueOf() : this.getCurrent();
      let i22 = this.offset + (this.peek() === " " ? 1 : 0);
      let kind = "";
      for (let c22 = this.chars.length;i22 < c22; i22++) {
        if (!isReadable2(this.chars[i22]))
          break;
        kind += this.chars[i22];
      }
      const retval = kind && Env2.register(parseFloat(num), kind);
      if (isPlain22(retval)) {
        this.offset = this.start = i22;
        this.addToken(NUMBER2, retval);
        return;
      }
    }
    this.addToken(NUMBER2, value);
  }
  parseRef(col) {
    const offset = this.offset;
    const chunks = ["[", ""];
    this.blank = chunks[0];
    while (!this.isDone() && this.peek() !== `
`) {
      const char = this.getToken();
      this.pushToken(char);
      if (chunks.length >= 4) {
        if (!(chunks[0] === "[" && chunks[2] === "]" && chunks[3] === ":"))
          break;
      } else if (char !== "]" && (isAlphaNumeric2(char) || char === " ")) {
        chunks[chunks.length - 1] += char;
      } else {
        chunks.push(char);
      }
    }
    if (chunks[2] !== "]" || chunks[3] !== ":") {
      this.offset = offset;
      this.blank = "";
      this.col = col;
      return;
    }
    const matches = this.blank.match(/\[(.+?)\]:\s+(\S+)(?:\s+(\(.+?\)|".+?"|'.+?'|.+?))?/);
    const fixedHref = matches[2].charAt() === "<" && matches[2].substr(-1) === ">" ? matches[2].substr(1, matches[2].length - 2) : matches[2];
    this.refs[matches[1]] = {
      text: this.blank,
      href: fixedHref,
      alt: matches[3] ? matches[3].substr(1, matches[3].length - 2) : null
    };
    this.blank = "";
    this.addToken(REF2, this.refs[matches[1]], { kind: "raw" });
    return true;
  }
  parseLine() {
    while (!this.isDone() && this.peek() !== `
`)
      this.pushToken(this.getToken());
  }
  parseThematicBreak() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end).trim();
    if (!/^-{3,}$/.test(line))
      return false;
    this.appendText();
    this.offset = end;
    this.col = lineCol + (end - start);
    this.blank = "";
    return true;
  }
  parseBlock(char) {
    this.appendText();
    this.parseLine();
    this.appendText(char);
    return true;
  }
  parseLinkLine() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end);
    const matches = line.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/);
    if (!matches)
      return false;
    this.offset = end;
    this.col = lineCol + line.length;
    this.appendText();
    this.tokens.push(new Token2(REF2, {
      image: false,
      text: line,
      href: matches[2],
      cap: null,
      alt: matches[1]
    }, null, { line: this.line, col: lineCol, kind: "raw" }));
    return true;
  }
  parseTableLine() {
    const start = this.start;
    const lineCol = this.col - 1;
    let end = this.offset;
    while (end < this.chars.length && this.chars[end] !== `
`)
      end++;
    const line = this.source.substring(start, end);
    if (!/^\|.+\|\s*$/.test(line))
      return false;
    this.offset = end;
    this.col = lineCol + line.length;
    this.appendText();
    this.tokens.push(new Token2(TEXT2, {
      kind: TABLE2,
      buffer: [line]
    }, null, { line: this.line, col: lineCol }));
    return true;
  }
  parseFence(char) {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: "multi" };
    this.appendText();
    this.nextToken(2);
    while (!this.isDone()) {
      const cur = this.getToken();
      if (cur === `
`) {
        this.col = -1;
        this.line++;
      }
      if (cur === char && this.peek() === char && this.peekNext() === char)
        break;
      this.pushToken(cur);
    }
    const chunk = this.blank;
    this.offset += 2;
    this.blank = "";
    if (char === '"') {
      this.subString(deindent2(chunk), false, tokenInfo);
    } else {
      this.addToken(CODE2, chunk, tokenInfo);
    }
    return true;
  }
  parseItem(char) {
    const depth = Math.floor(this.blank.length / 2);
    while (this.peek() !== " ")
      this.nextToken();
    if (isDigit2(char)) {
      this.blank = "";
    }
    this.parseLine();
    this.appendText(char, depth);
    return true;
  }
  parseText(char) {
    this.appendText();
    let i22 = this.offset;
    if ("*_".includes(char)) {
      if (this.peek() === char) {
        char += this.getToken(++i22);
      } else if (!isAlphaNumeric2(this.peek()))
        return;
    } else {
      this.pushToken(char);
    }
    for (let c22 = this.chars.length;i22 < c22; i22++) {
      if ("*_".includes(char)) {
        if (this.chars[i22] === char)
          break;
      } else if (char.length === 2) {
        if (char === this.chars[i22] + this.chars[i22 + 1])
          break;
      } else if (!isAlphaNumeric2(this.chars[i22], true))
        break;
      if (this.chars[i22] === "." && /^\d+$/.test(this.blank))
        break;
      this.pushToken(this.chars[i22]);
    }
    const token = this.chars[i22];
    const nextToken = this.chars[i22 + 1];
    if (/^\d+$/.test(this.blank) && token === " " && isAlphaNumeric2(nextToken)) {
      this.blank = "";
      return;
    }
    if (/^\d+$/.test(this.blank) && token === "." && nextToken === " ") {
      this.parseItem(this.blank);
      return true;
    }
    if (char.length === 1 && char === token || char.length === 2 && char === token + nextToken) {
      this.offset = this.start = i22 + char.length;
      this.blank = char + this.blank + char;
      this.appendText();
      this.parseLine();
      this.appendText();
      return true;
    }
    const looksLikeUnitLiteral = /^\d+[A-Za-z_][A-Za-z0-9_]*$/.test(this.blank);
    if (isReadable2(this.blank) && token === "*" || nextToken === " " && ");:.,".includes(token) && !(token === "." && looksLikeUnitLiteral) || token === " " && (nextToken === "*" || nextToken && isAlphaNumeric2(nextToken))) {
      this.pushToken(token, nextToken);
      this.offset = this.start = i22 + 2;
      this.parseLine();
      this.appendText();
      return true;
    }
    if (token === " " && nextToken === "(" && /^[A-Z]/.test(this.blank)) {
      this.pushToken(token);
      this.offset = this.start = i22 + 1;
      this.parseLine();
      this.appendText();
      return true;
    }
    this.blank = "";
  }
  subString(chunk, isMarkup, tokenInfo) {
    if (chunk.indexOf("#{") === -1 || isMarkup) {
      this.addToken(STRING2, chunk, tokenInfo);
      return;
    }
    const info = { line: tokenInfo.line, col: tokenInfo.col + 1 };
    const input2 = split2(chunk);
    const stack = [];
    let curInfo = { ...info };
    let buffer = "";
    let depth = 0;
    while (input2.length) {
      const char = input2.shift();
      if (char === "\\" && input2[0] === '"') {
        buffer += input2.shift();
        info.col += 2;
        continue;
      }
      if (char === "#" && input2[0] === "{") {
        if (!depth && buffer.length) {
          this.append(buffer, curInfo);
          buffer = "";
        }
        buffer += char + input2.shift();
        info.col += 2;
        curInfo = { ...info };
        stack.push(OPEN2);
        depth++;
        continue;
      }
      buffer += char;
      if (char === "}" && stack[stack.length - 1] === OPEN2) {
        stack.pop();
        depth--;
        if (!depth) {
          buffer = buffer.substr(2, buffer.length - 3);
          if (buffer.indexOf("#{") !== -1) {
            curInfo.col -= buffer.length - 5;
          }
          this.append(new Scanner2(buffer, curInfo).scanTokens(), curInfo);
          buffer = "";
        }
        info.col++;
        continue;
      }
      if (char === '"') {
        info.col++;
        if (stack[stack.length - 1] === BEGIN2) {
          stack.pop();
          depth--;
        } else {
          stack.push(BEGIN2);
          depth++;
        }
        continue;
      }
      if (char === `
`) {
        info.col = 0;
        info.line++;
      } else {
        info.col++;
      }
    }
    if (buffer.length) {
      curInfo.col += 2;
      this.append(buffer, curInfo);
    }
    if (isMarkup) {
      tokenInfo.kind = "markup";
    }
    this.addToken(STRING2, this.chunks, tokenInfo);
    this.chunks = [];
  }
  parseString() {
    const stack = [];
    const info = { line: this.line, col: this.col - 1 };
    let hadInterpolation = false;
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        if (!stack.length && !hadInterpolation)
          raise2("Unterminated string", this);
        this.col = -1;
        this.line++;
      }
      if (this.peek() === "#" && this.peekNext() === "{") {
        stack.push(OPEN2);
        hadInterpolation = true;
      }
      if (this.peek() === "}" && stack[stack.length - 1] === OPEN2)
        stack.pop();
      if (stack.length && this.peek() === '"' && this.peekToken(-1) !== "\\") {
        if (stack[stack.length - 1] === BEGIN2)
          stack.pop();
        else
          stack.push(BEGIN2);
      }
      if (!stack.length && this.peek() === '"' && this.peekToken(-1) !== "\\")
        break;
      this.nextToken();
    }
    if (stack.length) {
      this.col -= stack[stack.length - 1] === OPEN2 ? 2 : 1;
      raise2(`Expecting \`${stack[stack.length - 1] === OPEN2 ? '"' : "}"}\``, this);
    }
    if (this.isDone()) {
      raise2("Unterminated string", this);
    }
    this.nextToken();
    this.subString(this.source.substring(this.start + 1, this.offset - 1), false, info);
  }
  parseMarkup() {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: "markup" };
    while (isAlphaNumeric2(this.peek()))
      this.nextToken();
    const openTag = this.peekCurrent(4);
    const tagName = openTag.substr(1);
    const close = [tagName];
    const hasImmediateClosing = (name) => {
      let idx = this.offset + 1;
      while (idx < this.source.length && /\s/.test(this.source[idx]))
        idx++;
      const closing = `</${name}>`;
      return this.source.slice(idx, idx + closing.length).toLowerCase() === closing.toLowerCase();
    };
    let offset = 0;
    while (!this.isDone()) {
      if (this.peek() === `
`) {
        this.col = -1;
        this.line++;
      }
      const cur = this.peek();
      const old = this.peekToken(-1);
      const next = this.peekNext();
      const tag = `</${close[close.length - 1]}>`;
      if (cur === "/" && next === ">") {
        this.nextToken(2);
        close.pop();
      }
      if (cur === ">" && close.length) {
        const top = String(close[close.length - 1] || "").toLowerCase();
        if (isVoidTag2(top) && !hasImmediateClosing(top)) {
          close.pop();
        }
      }
      if (offset && cur === "<" && isAlphaNumeric2(next)) {
        let nextTag = "";
        let char;
        do {
          this.nextToken();
          char = this.peek();
          if (!isAlphaNumeric2(char))
            break;
          nextTag += char;
        } while (isAlphaNumeric2(char));
        this.col -= 2;
        close.push(nextTag);
      }
      if (old === ">" && tag === this.getCurrent(tag))
        close.pop();
      if (!close.length)
        break;
      this.nextToken();
      offset++;
    }
    this.subString(this.getCurrent(), true, tokenInfo);
  }
  parseRegex() {
    const prevToken = this.peekToken(-2);
    if (prevToken && isAlphaNumeric2(prevToken)) {
      this.addToken(DIV2);
      return;
    }
    let flags = "";
    let pattern = "";
    let i22 = this.offset;
    for (let c22 = this.chars.length;i22 < c22; i22++) {
      const last = this.chars[i22 - 1];
      const cur = this.chars[i22];
      if (flags) {
        if ("igmu".includes(cur)) {
          flags += cur;
          continue;
        }
        if (isAlphaNumeric2(cur)) {
          this.col = i22;
          raise2(`Unknown modifier \`${cur}\``, this);
        }
        --i22;
        break;
      }
      if (cur === "/" && last !== "\\") {
        const next = this.chars[i22 + 1];
        if (next && isAlphaNumeric2(next)) {
          if ("igmu".includes(next)) {
            flags += this.chars[++i22];
            continue;
          }
          this.col = ++i22;
          raise2(`Unknown modifier \`${next}\``, this);
        }
        break;
      }
      if (cur === " " || cur === `
`) {
        this.addToken(DIV2);
        return;
      }
      pattern += cur;
    }
    this.offset = this.start = ++i22;
    this.addToken(REGEX2, new RegExp(pattern, flags));
  }
  parseSymbol() {
    while (!this.isDone()) {
      const cur = this.peek();
      if (cur === "." && (this.peekNext() === `
` || this.offset + 1 >= this.chars.length))
        break;
      if (cur === "/" || isAlphaNumeric2(cur, true))
        this.nextToken();
      else
        break;
    }
    this.addToken(SYMBOL2);
  }
  parseDirective() {
    while (!this.isDone()) {
      const cur = this.peek();
      if (cur === "." && (this.peekNext() === `
` || this.offset + 1 >= this.chars.length))
        break;
      if (cur === "/" || isAlphaNumeric2(cur, true))
        this.nextToken();
      else
        break;
    }
    this.addToken(DIRECTIVE2);
  }
  parseComment(multiline) {
    if (multiline) {
      while (this.peek() !== "*" && this.peekNext() !== "/" && !this.isDone()) {
        if (this.peek() === `
`) {
          this.col = -1;
          this.line++;
        }
        this.nextToken();
      }
      if (this.isDone()) {
        raise2("Unterminated comment", this);
      }
      this.nextToken(2);
      this.addToken(COMMENT_MULTI2);
    } else {
      while (this.peek() !== `
` && !this.isDone())
        this.nextToken();
      this.addToken(COMMENT2);
    }
  }
  isMatch(expected) {
    if (this.isDone())
      return false;
    if (this.chars[this.offset] !== expected)
      return false;
    this.nextToken();
    return true;
  }
  isDone() {
    return this.offset >= this.chars.length;
  }
  peek() {
    if (this.isDone())
      return "\x00";
    return this.chars[this.offset];
  }
  peekNext() {
    if (this.offset + 1 >= this.chars.length)
      return "\x00";
    return this.chars[this.offset + 1];
  }
  peekCurrent(offset) {
    const buffer = this.getCurrent();
    this.offset += buffer.length - offset;
    return buffer;
  }
}

class Parser2 {
  constructor(tokens, plain, ctx) {
    this.templates = ctx && ctx.templates || {};
    this.template = null;
    this.partial = [];
    this.raw = plain;
    this.tokens = tokens;
    this.current = null;
    this.buffer = [];
    this.offset = 0;
    this.depth = 0;
  }
  extension(stmts) {
    stmts.forEach((stmt) => {
      const subTree = stmt.getBody();
      const expr = subTree.pop();
      if (!isBlock2(expr) || !expr.hasArgs || !expr.getArg(0) || !expr.getArg(0).isCallable) {
        return;
      }
      let root = this.templates;
      let key;
      while (subTree.length) {
        key = subTree.shift().valueOf();
        if (!root[key])
          root[key] = {};
        if (subTree.length)
          root = root[key];
      }
      root[key] = expr.getArgs()[0].value;
    });
  }
  parseRefImportSpec(alias) {
    const parts = String(alias || "").split(",").map((part) => part.trim()).filter(Boolean);
    const imports = [];
    const templates = [];
    let includeAllTemplates = false;
    parts.forEach((part) => {
      if (!part.startsWith("@template")) {
        imports.push(part);
        return;
      }
      const rest = part.slice("@template".length).trim();
      if (!rest) {
        includeAllTemplates = true;
        return;
      }
      rest.split(/\s+/).map((name) => name.trim()).filter(Boolean).forEach((name) => templates.push(name));
    });
    return { imports, includeAllTemplates, templates };
  }
  collection(token, curToken, nextToken) {
    const isFirstClassMatch = isDirective2(token) && token.value === "@match" && isOpen2(curToken) && curToken.tokenInfo && curToken.tokenInfo.kind === "brace";
    if (isSpecial2(token) || isSlice2(token) || isEnd2(curToken) || isSome2(curToken) && isEnd2(nextToken) || isOpen2(curToken) && isClose2(nextToken) || isSymbol2(curToken) && !isSpecial2(curToken) || isText2(curToken) && !(isDirective2(token) && CONTROL_TYPES2.includes(token.value)) || isMath2(curToken) && !isSome2(curToken) && curToken.type !== MINUS2 && token.value !== "@template") {
      if (token.value === ":nil")
        return Expr2.value(null, token);
      if (token.value === ":on")
        return Expr2.value(true, token);
      if (token.value === ":off")
        return Expr2.value(false, token);
      if (isDirective2(token)) {
        return Expr2.stmt(token.value, [], token);
      }
      return Expr2.symbol(token.value, isSome2(curToken) || null, token);
    }
    const map22 = {};
    let optional;
    let stack = [[]];
    let key = token.value;
    while (!this.isDone() && !this.isEnd([OR2, PIPE2])) {
      const body = stack[stack.length - 1];
      const cur = this.next();
      const keepElseBodyDirective = key === "@else" && !body.length && isDirective2(cur) && ["@do", "@match", "@let"].includes(cur.value);
      if (!this.depth && (isSymbol2(cur) || isDirective2(cur)) && !keepElseBodyDirective) {
        if (isSpecial2(cur) || isSlice2(cur)) {
          body.push(Expr2.from(cur));
          continue;
        }
        this.appendTo(stack, key, map22, token, optional);
        optional = false;
        key = cur.value;
        stack = [[]];
        continue;
      }
      if (!this.depth && isComma2(cur)) {
        stack.push([]);
        continue;
      }
      if (!body.length && isSome2(cur)) {
        if (optional || isStatement2(key)) {
          check3(cur);
        }
        optional = true;
        continue;
      }
      if (!isText2(cur)) {
        body.push(Expr2.from(cur));
      }
    }
    this.appendTo(stack, key, map22, token, optional);
    if (isFirstClassMatch && map22.match instanceof Expr2.MatchStatement) {
      const [braceBody] = map22.match.getBody();
      const cases = isBlock2(braceBody) ? braceBody.getBody() : [];
      const input2 = Expr2.local("$", token);
      return Expr2.callable({
        type: BLOCK2,
        value: {
          args: [input2.clone()],
          body: [
            Expr2.map({
              match: Expr2.stmt("@match", [
                Expr2.stmt([input2].concat(cases), token)
              ], token)
            }, token)
          ]
        }
      }, token);
    }
    return Expr2.map(map22, token);
  }
  definition(token, isAnonymous) {
    let subTree;
    if (isAnonymous) {
      subTree = this.subTree(this.statement([OR2, PIPE2]));
    } else {
      subTree = this.expression();
    }
    const [head22, ...body] = subTree;
    const node = {
      type: BLOCK2,
      value: {}
    };
    if (head22 && head22.type !== EQUAL2) {
      body.unshift(head22);
    }
    if (isLiteral2(body[0]) && isBlock2(body[1])) {
      const args = body[1].getArgs();
      if (args.some((x22) => isLiteral2(x22, ".."))) {
        node.value.args = node.value.args || [];
        node.value.args[isLiteral2(args[0], "..") ? "unshift" : "push"](Expr2.from(LITERAL2, "..", token));
      }
    }
    if (body.length)
      node.value.body = body;
    if (!isAnonymous)
      node.value.name = token.value;
    Object.defineProperty(node.value, "plain", {
      value: isBlock2(body[0]) && !body[0].hasArgs
    });
    return node;
  }
  destructure(token) {
    const bindings = [{ name: token.value, rest: false }];
    let offset = this.offset;
    let hasRest = false;
    while (offset < this.tokens.length) {
      let cur = this.tokens[offset];
      while (isText2(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (!isComma2(cur))
        return null;
      offset++;
      cur = this.tokens[offset];
      while (isText2(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      const isRest = isRange2(cur);
      if (isRest) {
        offset++;
        cur = this.tokens[offset];
        if (cur && cur.type === DOT2) {
          offset++;
          cur = this.tokens[offset];
        }
      }
      while (isText2(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (!isLiteral2(cur))
        return null;
      if (hasRest)
        raise2("Rest binding must be last", cur);
      bindings.push({ name: cur.value, rest: isRest });
      hasRest = isRest;
      offset++;
      cur = this.tokens[offset];
      while (isText2(cur)) {
        offset++;
        cur = this.tokens[offset];
      }
      if (isEqual2(cur)) {
        return { bindings, offset };
      }
      if (!isComma2(cur))
        return null;
    }
    return null;
  }
  expression() {
    const [, ...tail22] = this.statement();
    const body = this.subTree(tail22);
    return body;
  }
  statement(endToken, raw) {
    while (!this.isDone() && !this.isEnd(endToken, raw))
      this.push(raw);
    return this.pull();
  }
  isDone() {
    return isEOF2(this.peek());
  }
  isEnd(endToken, raw) {
    const token = this.peek();
    if (isOpen2(token) || isBegin2(token))
      this.depth++;
    if (isClose2(token) || isDone2(token))
      this.depth--;
    if (this.depth > 0)
      return false;
    if (this.depth < 0) {
      this.depth = 0;
      return true;
    }
    return isEOL2(token) || endToken && endToken.includes(token.type) || !raw && isText2(token) && !hasBreaks2(token);
  }
  has(token) {
    for (let i22 = this.offset, c22 = this.tokens.length;i22 < c22; i22++) {
      if (this.tokens[i22].type === token)
        return true;
    }
    return false;
  }
  peek() {
    return this.tokens[this.offset];
  }
  blank() {
    const token = this.peek();
    return isText2(token) && !(token.value && token.value.kind) && !hasBreaks2(token);
  }
  skip(raw) {
    this.current = this.peek();
    this.offset++;
    while (!this.isDone() && (!raw && this.blank()))
      this.offset++;
    return this;
  }
  prev() {
    return this.current || {};
  }
  next(raw) {
    return this.skip(raw).prev();
  }
  seek() {
    let inc = this.offset + 1;
    let token;
    do {
      token = this.tokens[inc++] || {};
    } while (isText2(token) || isComma2(token));
    return token;
  }
  leaf() {
    return this.subTree(this.statement([OR2, PIPE2, SOME2, COMMA2, SYMBOL2]), true);
  }
  nextSignificantIndex(offset = this.offset) {
    let idx = offset;
    while (idx < this.tokens.length && isText2(this.tokens[idx]))
      idx++;
    return idx;
  }
  tokenSourceText(token) {
    if (!token)
      return "";
    if (isText2(token) && token.value && Array.isArray(token.value.buffer)) {
      return token.value.buffer.map((part) => typeof part === "string" ? part : "").join("");
    }
    if (token.type === STRING2) {
      return `"${String(token.value || "")}"`;
    }
    return literal2(token);
  }
  parseAnnotation(token, tokenInfo) {
    const colon1 = this.nextSignificantIndex(this.offset);
    const first = this.tokens[colon1];
    if (!isSymbol2(first) || first.value !== ":")
      return null;
    const colon2 = this.nextSignificantIndex(colon1 + 1);
    const second = this.tokens[colon2];
    if (!isSymbol2(second) || second.value !== ":")
      return null;
    let i22 = colon2 + 1;
    const parts = [];
    while (i22 < this.tokens.length && !isEOL2(this.tokens[i22]) && !isEOF2(this.tokens[i22])) {
      parts.push(this.tokenSourceText(this.tokens[i22]));
      i22++;
    }
    const typeText = parts.join("").trim();
    if (!typeText)
      return null;
    this.offset = i22;
    this.current = this.tokens[Math.min(i22, this.tokens.length - 1)];
    return Expr2.map({
      annot: Expr2.stmt("@annot", [
        Expr2.local(token.value, tokenInfo),
        Expr2.value(typeText, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  pull() {
    return this.buffer.splice(0, this.buffer.length);
  }
  push(raw) {
    this.buffer.push(Expr2.from(this.next(raw)));
  }
  parse() {
    let root = [];
    const tree = root;
    const stack = [];
    const offsets = [];
    function get22() {
      let leaf = root;
      if (leaf instanceof Expr2) {
        leaf = isBlock2(leaf) ? leaf.value.args : leaf.valueOf();
      }
      return leaf;
    }
    function pop() {
      const leaf = get22();
      const set = [];
      let count = leaf.length;
      while (count--) {
        const token = leaf[count];
        if (isEnd2(token))
          break;
        set.unshift(token);
      }
      leaf.length = ++count;
      return set;
    }
    function push22(...token) {
      let target;
      if (root instanceof Expr2) {
        if (isBlock2(root)) {
          target = root.value.args || root.value.body;
        } else {
          target = root.value;
        }
      } else {
        target = root;
      }
      target.push(...token);
    }
    while (!this.isDone()) {
      const prev = this.prev();
      const token = this.next();
      const curToken = this.peek();
      const nextToken = this.seek();
      const tokenInfo = token.tokenInfo || token;
      if (isSymbol2(token) || isDirective2(token)) {
        const fixedToken = this.collection(tokenInfo, curToken, nextToken);
        if (isSymbol2(fixedToken) && fixedToken.isOptional)
          this.next();
        if (this.raw !== false && fixedToken.value && Object.keys(fixedToken.value).length === 1 && fixedToken.value.template instanceof Expr2.TemplateStatement) {
          this.extension(fixedToken.value.template.value.body);
          if (isEOL2(this.peek()))
            this.skip();
          continue;
        }
        push22(fixedToken);
        continue;
      }
      if (isRange2(token)) {
        if (prev && [OPEN2, BEGIN2, COMMA2].includes(prev.type) && [CLOSE2, DONE2, COMMA2, BLOCK2].includes(curToken.type)) {
          push22(Expr2.from(LITERAL2, "..", tokenInfo));
          continue;
        }
        push22(Expr2.range(pop(), this.leaf(), tokenInfo));
        continue;
      }
      if (!this.template && this.templates[tokenInfo.value]) {
        this.template = this.templates[tokenInfo.value];
        if (curToken.type === OPEN2 && this.template.body) {
          push22(...Expr2.mix(this.template, this.leaf(), []));
          this.template = null;
          continue;
        }
        if (this.template[curToken.value]) {
          this.partial = [tokenInfo];
          continue;
        }
        if (!this.template.args) {
          this.template = null;
        }
      }
      if (this.template && (this.template.args || this.template[tokenInfo.value])) {
        if (!this.template.args) {
          this.template = this.template[tokenInfo.value];
          this.partial.push(tokenInfo);
        }
        if (this.template.args) {
          const left = pop();
          const right = this.leaf();
          if (this.template.args.length === 1) {
            if (left.some(isLiteral2) && right.length) {
              push22(Expr2.group([...left, ...Expr2.mix(this.template, left, [])], tokenInfo), ...right);
            } else if (!left.length) {
              push22(Expr2.group([...Expr2.mix(this.template, Expr2.cut(right), []), ...right], tokenInfo));
            } else {
              push22(Expr2.group([...left, ...Expr2.mix(this.template, left, [])], tokenInfo));
            }
          } else {
            push22(Expr2.group([...Expr2.mix(this.template, left, right)], tokenInfo));
          }
          this.template = null;
        }
        continue;
      }
      if (this.template) {
        this.partial.forEach((x22) => push22(Expr2.from(x22)));
        this.template = null;
      }
      if (isLiteral2(token)) {
        const annotation = this.parseAnnotation(token, tokenInfo);
        if (annotation) {
          push22(annotation);
          continue;
        }
        if (isComma2(curToken) && this.has(EQUAL2)) {
          const parsed = this.destructure(tokenInfo);
          if (parsed) {
            this.offset = parsed.offset + 1;
            this.current = this.tokens[parsed.offset];
            const body = this.subTree(this.statement([OR2, PIPE2]));
            push22(Expr2.map({
              destructure: Expr2.stmt("@destructure", [
                Expr2.from(LITERAL2, parsed.bindings, tokenInfo),
                Expr2.stmt(body, { ...tokenInfo, kind: "raw" })
              ], tokenInfo)
            }, tokenInfo));
            continue;
          }
        }
        if (isEqual2(curToken)) {
          push22(Expr2.callable(this.definition(token), tokenInfo));
          continue;
        }
        if (isBlock2(curToken) && this.has(BLOCK2)) {
          const args = Expr2.args([Expr2.from(token)].concat(this.statement([BLOCK2])));
          const body = this.expression();
          args.forEach((x22) => {
            if (isRange2(x22))
              x22.type = LITERAL2;
            assert2(Array.isArray(x22) ? x22[0] : x22, true, LITERAL2);
          });
          push22(Expr2.callable({
            type: BLOCK2,
            value: { args, body }
          }, tokenInfo));
          continue;
        }
      }
      if (isRef2(token) && token.isRaw && token.value && token.value.alt && token.value.href) {
        const spec = this.parseRefImportSpec(token.value.alt.trim());
        const importBody = spec.imports.map((name) => Expr2.local(name, tokenInfo));
        const map22 = {
          import: Expr2.stmt("@import", importBody, tokenInfo),
          from: Expr2.stmt("@from", [Expr2.value(token.value.href.trim(), tokenInfo)], tokenInfo)
        };
        if (spec.includeAllTemplates || spec.templates.length) {
          const templateBody = [];
          if (spec.includeAllTemplates) {
            templateBody.push(Expr2.stmt([Expr2.local("*", tokenInfo)], tokenInfo));
          }
          spec.templates.forEach((name) => {
            templateBody.push(Expr2.stmt([Expr2.local(name, tokenInfo)], tokenInfo));
          });
          map22.template = Expr2.stmt("@template", templateBody, tokenInfo);
        }
        push22(Expr2.map(map22, tokenInfo));
        continue;
      }
      if (!isLiteral2(token) && isBlock2(curToken) && !(isOpen2(token) || isClose2(token) || isComma2(token))) {
        raise2(`Expecting literal but found \`${token.value}\``, tokenInfo);
      }
      if (isLiteral2(token) && isNot2(curToken)) {
        push22(Expr2.literal({ type: LITERAL2, value: token.value, cached: true }, tokenInfo));
        this.next();
        continue;
      }
      if (isBlock2(token)) {
        push22(Expr2.callable(this.definition(token, true), tokenInfo));
        continue;
      }
      if (isOpen2(prev) && isLogic2(token) && !isClose2(nextToken)) {
        this.depth++;
        push22(Expr2.expression({
          type: token.type,
          value: this.subTree(this.statement([CLOSE2]), true)
        }, tokenInfo));
        continue;
      }
      if (isList2(token)) {
        if (isOpen2(token) || isBegin2(token)) {
          let leaf;
          if (token.value === "#{") {
            leaf = Expr2.body([], tokenInfo);
          } else {
            leaf = isOpen2(token) ? Expr2.block({ args: [] }, tokenInfo, true) : Expr2.array([], tokenInfo);
          }
          push22(leaf);
          stack.push(root);
          offsets.push(token);
          root = leaf;
        } else {
          const start = offsets[offsets.length - 1];
          if (!start) {
            raise2(`Expecting \`${isClose2(token) ? "(" : "["}\` before \`${token.value}\``, tokenInfo);
          }
          if (isOpen2(start) && !isClose2(token)) {
            raise2(`Expecting \`)\` but found \`${token.value}\``, tokenInfo);
          }
          if (isBegin2(start) && !isDone2(token)) {
            raise2(`Expecting \`]\` but found \`${token.value}\``, tokenInfo);
          }
          root = stack.pop();
          offsets.pop();
          if (isClose2(token) && isBlock2(curToken)) {
            const leaf = get22();
            const group = leaf[leaf.length - 1];
            if (isBlock2(group) && group.hasArgs) {
              let args = group.getArgs();
              if (args.length === 1 && isRange2(args[0]) && args[0].value && Array.isArray(args[0].value.begin) && (!args[0].value.end || !args[0].value.end.length)) {
                args = args[0].value.begin.concat([Expr2.from(LITERAL2, "..", args[0].tokenInfo || tokenInfo)]);
              }
              args = args.map((arg) => {
                if (isRange2(arg)) {
                  arg = arg.clone();
                  arg.type = LITERAL2;
                }
                return arg;
              });
              if (args.length && args.every((arg) => isLiteral2(arg))) {
                this.next();
                const body = this.subTree(this.statement([OR2, PIPE2]));
                leaf[leaf.length - 1] = Expr2.callable({
                  type: BLOCK2,
                  value: {
                    args: Expr2.args(args),
                    body
                  }
                }, args[0] && args[0].tokenInfo || group.tokenInfo || curToken.tokenInfo || tokenInfo);
                continue;
              }
            }
          }
        }
      } else if (isText2(token) && token.value.kind === TABLE2) {
        const rows = [token];
        while (!this.isDone()) {
          const nextRow = this.peek();
          if (isText2(nextRow) && nextRow.value.kind === TABLE2) {
            rows.push(this.next(true));
            continue;
          }
          if (this.isBlankTextToken(nextRow)) {
            this.next(true);
            continue;
          }
          break;
        }
        const table = this.tableFromTokens(rows, tokenInfo);
        if (table) {
          push22(table);
          if (!(isEnd2(this.peek()) || isClose2(this.peek()) || isDone2(this.peek()))) {
            push22(Expr2.from(EOL2, ".", tokenInfo));
          }
        } else {
          rows.forEach((row) => {
            if (this.isTextConvertible(row)) {
              push22(this.convertTextToString(row, tokenInfo));
            }
          });
        }
      } else if (isText2(token) && token.value.kind === HEADING2) {
        const namespace = this.namespaceFromHeading(token, tokenInfo);
        if (namespace) {
          push22(namespace);
        } else if (this.hasInterpolation(token)) {
          push22(this.convertTextToString(token, tokenInfo));
        }
      } else if (isText2(token) && this.hasInterpolation(token)) {
        push22(this.convertTextToString(token, tokenInfo));
      } else if (!(isText2(token) || isCode2(token) || isRef2(token))) {
        if (isString2(token) && tokenInfo.kind === "markup" && typeof token.value === "string") {
          try {
            push22(Expr2.tag(parseTag2(token.value), tokenInfo));
          } catch (_22) {
            push22(Expr2.from(token));
          }
        } else if (isString2(token) && Array.isArray(token.value)) {
          push22(Expr2.literal({ type: STRING2, value: this.subTree(token.value, true) }, tokenInfo));
        } else {
          push22(Expr2.from(token));
        }
      }
      if (isNumber2(token) && !isUnit2(token) && this.raw !== true) {
        if (isNumber2(curToken))
          push22(Expr2.from(PLUS2, "+"));
        if (isLiteral2(curToken) && (isMath2(nextToken) || isLiteral2(nextToken) || isEnd2(nextToken) || isComment2(nextToken)) || isOpen2(curToken) && !(isClose2(nextToken) || isComment2(nextToken)))
          push22(Expr2.from(MUL2, "*"));
      }
    }
    if (offsets.length) {
      const lastToken = offsets[offsets.length - 1];
      const { value, line, col } = this.current.tokenInfo || this.current;
      raise2(`Expecting \`${isOpen2(lastToken) ? ")" : "]"}\``, { line, col: col + value.length });
    }
    return tree;
  }
  isTextConvertible(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.some((chunk) => {
      if (typeof chunk === "string")
        return chunk.trim().length > 0;
      if (Array.isArray(chunk))
        return !!chunk[2];
      return true;
    });
  }
  hasInterpolation(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.some((chunk) => {
      if (Array.isArray(chunk))
        return !!chunk[2];
      if (typeof chunk === "object" && chunk !== null)
        return chunk.kind !== "raw";
      return false;
    });
  }
  isBlankTextToken(token) {
    if (!isText2(token) || !token.value || !Array.isArray(token.value.buffer))
      return false;
    return token.value.buffer.every((chunk) => typeof chunk === "string" && !chunk.trim().length);
  }
  textChunkToSource(chunk) {
    if (typeof chunk === "string")
      return chunk;
    if (Array.isArray(chunk))
      return `${chunk[1]}${chunk[2]}${chunk[1]}`;
    if (isRef2(chunk))
      return chunk.value.text;
    if (chunk && typeof chunk.value === "string")
      return chunk.value;
    return "";
  }
  convertTextToString(token, tokenInfo) {
    const source = this.textPrefix(token.value) + token.value.buffer.map((chunk) => this.textChunkToSource(chunk)).join("");
    const [subToken] = new Scanner2(quote3(source), tokenInfo).scanTokens();
    if (isString2(subToken) && Array.isArray(subToken.value)) {
      return Expr2.literal({ type: STRING2, value: this.subTree(subToken.value, true) }, tokenInfo);
    }
    return Expr2.from(subToken);
  }
  textPrefix(value) {
    if (!value || !value.kind)
      return "";
    if (value.kind === BLOCKQUOTE2)
      return "> ";
    if (value.kind === HEADING2)
      return `${Array.from({ length: value.level || 1 }).join("#")}# `;
    if (value.kind === OL_ITEM2)
      return `${value.style || value.level || 1}. `;
    if (value.kind === UL_ITEM2)
      return `${value.style || "-"} `;
    return "";
  }
  textTokenToSource(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer))
      return "";
    return token.value.buffer.map((chunk) => this.textChunkToSource(chunk)).join("");
  }
  namespaceFromHeading(token, tokenInfo) {
    if (!isText2(token) || token.value.kind !== HEADING2)
      return null;
    const source = this.textTokenToSource(token).trim();
    const matches = source.match(/^([A-Za-z_][A-Za-z0-9_]*)::$/);
    if (!matches)
      return null;
    return Expr2.map({
      namespace: Expr2.stmt("@namespace", [
        Expr2.value(matches[1], tokenInfo),
        Expr2.value(token.value.level || 1, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  tableFromTokens(rows, tokenInfo) {
    if (!rows || rows.length < 2)
      return null;
    const parseRow = (token) => {
      const source = this.textTokenToSource(token).trim();
      if (!source.startsWith("|") || !source.endsWith("|"))
        return null;
      return source.slice(1, -1).split("|").map((cell) => cell.trim());
    };
    const header = parseRow(rows[0]);
    const separator = parseRow(rows[1]);
    if (!header || !separator || header.length !== separator.length)
      return null;
    if (!separator.every((cell) => /^:?-{3,}:?$/.test(cell)))
      return null;
    const dataRows = rows.slice(2).map(parseRow);
    if (dataRows.some((row) => !row || row.length !== header.length))
      return null;
    return Expr2.map({
      table: Expr2.stmt("@table", [
        Expr2.value({ headers: header, rows: dataRows }, tokenInfo)
      ], tokenInfo)
    }, tokenInfo);
  }
  split() {
    const statements = [];
    let currentLine = 0;
    while (!this.isDone()) {
      const body = this.statement([EOL2], true);
      const curToken = this.tokens[this.offset++];
      const lines = [];
      if (!isEOF2(curToken)) {
        body.push(Expr2.literal(curToken));
      }
      if (!currentLine) {
        lines.push(currentLine++);
      } else if (!isText2(body[0]) || !hasBreaks2(body[0])) {
        lines.push(currentLine - 1);
      }
      for (let i22 = 0, c22 = body.length;i22 < c22; i22++) {
        if (hasBreaks2(body[i22])) {
          let count = 0;
          if (isText2(body[i22])) {
            body[i22].value.buffer.forEach((x22) => {
              count += x22.split(`
`).length - 1;
            });
          } else {
            count = body[i22].value.split(`
`).length - 1;
          }
          while (count--)
            lines.push(currentLine++);
        }
      }
      statements.push({ body, lines });
      if (!this.tokens[this.offset])
        break;
    }
    return statements;
  }
  appendTo(set, name, target, tokenInfo, isOptional) {
    const prop2 = name.substr(1) + (isOptional ? "?" : "");
    if (!isStatement2(name)) {
      if (hasStatements2(target))
        raise2(`Unexpected \`:${prop2}\` on statement`, tokenInfo);
      target[prop2] = Expr2.body([], tokenInfo);
    } else {
      target[prop2] = Expr2.stmt(name, [], tokenInfo);
    }
    let hasConditional = false;
    set.forEach((sub) => {
      let body = this.subTree(sub, true);
      while (body.length === 1 && isBlock2(body[0]) && body[0].tokenInfo.kind !== "brace" && !body[0].isCallable && !(body[0].getArg(0) && body[0].getArg(0).isExpression) && (["@import", "@export"].includes(name) || !(body[0].getArg(0) && body[0].getArg(0).isObject))) {
        body = body[0].getArgs();
      }
      const lastToken = sub[sub.length - 1];
      if (name === "@if" || name === "@while" && !hasConditional) {
        if (!isBlock2(body[0])) {
          if (!isClose2(lastToken)) {
            raise2(`Missing block before \`${lastToken}\``, lastToken.tokenInfo);
          } else {
            raise2(`Expecting statement after \`${lastToken}\``, lastToken.tokenInfo);
          }
        }
        if (name === "@while")
          hasConditional = true;
      }
      if (isBlock2(body[0]) || body.length > 1) {
        if (body.some(isBlock2)) {
          target[prop2].push(Expr2.body(body, tokenInfo));
        } else {
          target[prop2].push(Expr2.stmt(body, { ...tokenInfo, kind: "raw" }));
        }
      } else {
        target[prop2].push(...body);
      }
    });
  }
  subTree(tokens, raw = false) {
    return new Parser2(tokens.concat(new Token2(EOF2, "", null)), raw || this.raw, this).parse();
  }
  static getAST(source, mode = "parse", environment) {
    const scanner = new Scanner2(source, null, environment);
    const tokens = scanner.scanTokens();
    if (mode === "raw" || mode === null)
      return tokens;
    const parserMode = mode === "parse" || typeof mode === "undefined" ? undefined : mode === "inline" ? false : mode === "split" || mode === true;
    const parser = new Parser2(tokens, parserMode, environment);
    if (mode === "split")
      return parser.split();
    return parser.parse();
  }
  static sub(source, environment) {
    return Parser2.getAST(`.
${source}`, "inline", environment).slice(1);
  }
}
function parseAnnotation2(annStr) {
  if (!annStr || typeof annStr !== "string")
    return null;
  const trimmed = annStr.trim();
  if (!trimmed)
    return null;
  const arrowIndex = trimmed.indexOf("->");
  if (arrowIndex === -1) {
    return { params: trimmed.split(",").map((s) => s.trim()).filter(Boolean) };
  }
  const paramsStr = trimmed.slice(0, arrowIndex).trim();
  const returnsStr = trimmed.slice(arrowIndex + 2).trim();
  return {
    params: paramsStr ? paramsStr.split(",").map((s) => s.trim()).filter(Boolean) : [],
    returns: returnsStr || null
  };
}

class Eval2 {
  static getResultTagToken(token) {
    if (!isObject2(token))
      return null;
    const value = token.valueOf();
    const tag = value && value.__tag;
    const payload = value && value.value;
    if (!tag || !payload || typeof tag.getBody !== "function" || typeof payload.getBody !== "function") {
      return null;
    }
    const [head22] = tag.getBody();
    if (!isSymbol2(head22))
      return null;
    if (![":ok", ":err"].includes(head22.valueOf()))
      return null;
    return head22;
  }
  static async buildResultToken(kind, body, environment, parentTokenInfo) {
    const values = await Eval2.do(body, environment, "Result", true, parentTokenInfo);
    return Expr2.map({
      __tag: Expr2.body([Expr2.symbol(`:${kind}`, false, parentTokenInfo)], parentTokenInfo),
      value: Expr2.body(values, parentTokenInfo)
    }, parentTokenInfo);
  }
  static normalizeBraceRecordArgs(args) {
    const normalized = [];
    let changed = false;
    for (let i22 = 0, c22 = args.length;i22 < c22; i22++) {
      const cur = args[i22];
      const next = args[i22 + 1];
      if (isString2(cur) && isSymbol2(next) && next.value === ":") {
        normalized.push(Expr2.symbol(`:${cur.value}`, false, cur.tokenInfo || cur));
        changed = true;
        i22++;
        continue;
      }
      normalized.push(cur);
    }
    return changed ? normalized : args;
  }
  static tableCellToken(value, tokenInfo) {
    const input2 = typeof value === "string" ? value.trim() : value;
    if (input2 === "" || input2 === null || typeof input2 === "undefined") {
      return Expr2.value(null, tokenInfo);
    }
    if (typeof input2 === "string" && /^-?\d+(?:\.\d+)?$/.test(input2)) {
      return Expr2.value(parseFloat(input2), tokenInfo);
    }
    return Expr2.value(input2, tokenInfo);
  }
  static splitMatchCases(tokens) {
    const output = [];
    let current22 = [];
    for (let i22 = 0, c22 = tokens.length;i22 < c22; i22++) {
      const token = tokens[i22];
      if (isComma2(token)) {
        if (current22.length)
          output.push(current22);
        current22 = [];
        continue;
      }
      current22.push(token);
    }
    if (current22.length)
      output.push(current22);
    return output;
  }
  static templateNameFromEntry(entry) {
    const body = isBlock2(entry) ? entry.getBody() : [entry];
    return body.filter((token) => token && !isComma2(token) && !isBlock2(token)).map((token) => token.valueOf()).join("").trim();
  }
  static templateImportSpec(templateStmt) {
    const spec = {
      hasTemplateImport: false,
      includeAll: false,
      names: []
    };
    if (!(templateStmt instanceof Expr2.TemplateStatement)) {
      return spec;
    }
    spec.hasTemplateImport = true;
    templateStmt.getBody().forEach((entry) => {
      const name = Eval2.templateNameFromEntry(entry);
      if (!name)
        return;
      if (name === "*" || name === "@template") {
        spec.includeAll = true;
        return;
      }
      if (!spec.names.includes(name)) {
        spec.names.push(name);
      }
    });
    return spec;
  }
  static resolveTemplateByName(templates, name) {
    if (!templates || !name)
      return null;
    let node = templates;
    for (let i22 = 0, c22 = name.length;i22 < c22; i22++) {
      node = node[name[i22]];
      if (!node)
        return null;
    }
    return node && node.args ? node : null;
  }
  static registerTemplateByName(templates, name, definition) {
    if (!templates || !name || !definition)
      return;
    let root = templates;
    for (let i22 = 0, c22 = name.length - 1;i22 < c22; i22++) {
      const key = name[i22];
      if (!root[key])
        root[key] = {};
      root = root[key];
    }
    root[name[name.length - 1]] = definition;
  }
  static async resolveMatchBody(input2, cases, environment, parentTokenInfo) {
    const target = Eval2.getResultTagToken(input2) || input2;
    for (let i22 = 0, c22 = cases.length;i22 < c22; i22++) {
      const [head22, ...body] = cases[i22];
      if (!head22)
        continue;
      if (head22 instanceof Expr2.ElseStatement) {
        return head22.getBody();
      }
      if (!body.length) {
        check3(head22, "statement", "after");
      }
      if (isBlock2(head22) && isLogic2(head22.getArg(0))) {
        const [kind, ...others] = head22.getArgs();
        const newBody = Expr2.expression({ type: kind.type, value: [target].concat(others) }, parentTokenInfo);
        const [result] = await Eval2.do([newBody], environment, "Expr", true, parentTokenInfo);
        if (result && result.value === true) {
          return body;
        }
      } else {
        const result = await Eval2.do([head22], environment, "Match", true, parentTokenInfo);
        for (let j = 0, k22 = result.length;j < k22; j++) {
          let subBody = result[j];
          if (isArray2(subBody)) {
            if (isRange2(subBody.value[0])) {
              subBody = await subBody.value[0].value.run(true);
            }
            if (subBody.valueOf().some((x22) => !hasDiff2(x22, target))) {
              return body;
            }
          }
          if (!hasDiff2(target, subBody)) {
            return body;
          }
        }
      }
    }
    return null;
  }
  constructor(tokens, environment, noInheritance) {
    if (!(environment instanceof Env2)) {
      environment = null;
    }
    this.convert = Eval2.wrap(this);
    this.derive = !!(noInheritance && environment);
    this.expr = tokens;
    this.env = !this.derive ? new Env2(environment) : environment;
    this.rootEnv = this.env;
    this.namespaceStack = [];
    this.namespaceRoots = {};
    this.descriptor = "Root";
    this.result = [];
    this.offset = 0;
    this.key = null;
    this.ctx = null;
  }
  enterNamespace(name, level, tokenInfo) {
    while (this.namespaceStack.length >= level)
      this.namespaceStack.pop();
    const parent = this.namespaceStack[this.namespaceStack.length - 1] || null;
    let node;
    if (parent) {
      node = parent.children[name];
    } else {
      node = this.namespaceRoots[name];
    }
    if (!node) {
      const parentScope = parent ? parent.scope : this.rootEnv;
      const exports = {};
      const scope = new Env2(parentScope);
      node = {
        name,
        level,
        scope,
        exports,
        children: {}
      };
      if (parent) {
        parent.children[name] = node;
        parent.exports[name] = Expr2.map(exports, tokenInfo);
        parent.scope.def(name, Expr2.map(exports, tokenInfo));
      } else {
        this.namespaceRoots[name] = node;
        this.rootEnv.def(name, Expr2.map(exports, tokenInfo));
      }
    }
    this.namespaceStack.push(node);
    this.env = node.scope;
  }
  registerNamespaceExport(name) {
    if (!this.namespaceStack.length)
      return;
    if (!this.env.locals[name])
      return;
    const current22 = this.namespaceStack[this.namespaceStack.length - 1];
    current22.exports[name] = this.env.locals[name];
  }
  replace(v22, ctx) {
    if (!ctx) {
      this.result[Math.max(0, this.result.length - 1)] = v22;
    } else {
      this.ctx = v22;
    }
    return this;
  }
  discard(n = 1) {
    while (n--)
      this.result.pop();
    return this;
  }
  append(...a22) {
    this.result.push(...a22);
    return this;
  }
  move(n) {
    this.offset += n || 1;
    return this;
  }
  isLazy() {
    return LAZY_DESCRIPTORS2.has(this.descriptor);
  }
  isDone() {
    return this.offset >= this.expr.length;
  }
  getOlder() {
    return this.result[this.result.length - 2];
  }
  getPrev() {
    return this.result[this.result.length - 1];
  }
  olderToken() {
    return this.expr[this.offset - 2];
  }
  newerToken() {
    return this.expr[this.offset + 2];
  }
  nextToken() {
    return this.expr[this.offset + 1];
  }
  oldToken() {
    return this.expr[this.offset - 1];
  }
  async execute(label, callback) {
    const tokens = this.result = [];
    this.descriptor = label;
    this.offset = 0;
    for (;!this.isDone(); this.move())
      try {
        this.ctx = this.expr[this.offset];
        if (isComment2(this.ctx))
          continue;
        await callback();
      } catch (e22) {
        if (e22 instanceof TypeError) {
          raise2(e22.message, this.ctx.tokenInfo, label);
        }
        e22.prevToken = this.oldToken() || this.olderToken();
        e22.stack = e22.message;
        throw e22;
      }
    this.descriptor = "Root";
    this.result = [];
    return tokens;
  }
  async evalInfixCalls() {
    const prev = this.getPrev();
    const older = this.getOlder();
    const next = this.nextToken();
    if (isResult2(older) && prev.isCallable && isResult2(this.ctx) && !isEnd2(this.olderToken())) {
      if (isBlock2(this.ctx)) {
        const [head22, ...tail22] = await Eval2.do(this.ctx.getArgs(), this.env, "Fn", false, this.ctx.tokenInfo);
        const args = [older, Expr2.from(COMMA2), head22];
        this.discard(2).append(...await Eval2.do([prev, Expr2.block({ args }, prev.tokenInfo)], this.env, "Lit", false, this.ctx.tokenInfo)).append(...tail22);
      } else {
        const args = [older, Expr2.from(COMMA2), this.ctx];
        this.discard(2).append(...await Eval2.do([prev, Expr2.block({ args }, prev.tokenInfo)], this.env, "Lit", false, this.ctx.tokenInfo));
      }
      return true;
    }
    if (isPipe2(this.ctx)) {
      if (!(isData2(prev) || isRange2(prev)))
        check3(this.ctx, "value", "before");
      if (!next || !isInvokable2(next))
        check3(this.ctx, "callable", "after");
      assert2(next, true, LITERAL2, BLOCK2);
      const nextToken = this.expr[this.offset + 2];
      let nextArgs = isBlock2(nextToken) ? nextToken.getArgs() : null;
      let cutOffset = isBlock2(nextToken) ? 2 : 1;
      let fixedBody = [];
      if (isDot2(nextToken)) {
        const { body, offset } = Expr2.chunk(this.expr, this.offset + 1, true);
        cutOffset = offset;
        nextArgs = isBlock2(body[body.length - 1]) ? body.pop().getArgs() : null;
        fixedBody = body.concat(Expr2.block({ args: [prev].concat(nextArgs ? Expr2.from(COMMA2) : [], nextArgs || []) }, next.tokenInfo));
      } else {
        fixedBody = [next, Expr2.block({ args: [prev, Expr2.from(COMMA2)].concat(nextArgs || []) }, next.tokenInfo)];
      }
      this.discard().append(...await Eval2.do(fixedBody, this.env, "Fn", false, this.ctx.tokenInfo));
      this.move(cutOffset);
      return true;
    }
    if (isBlock2(prev) && isMod2(this.ctx) && next.isObject) {
      this.discard().append(...await Eval2.do(prev.getBody(), Env2.create(next.valueOf()), "%", false, this.ctx.tokenInfo)).move();
      return true;
    }
  }
  async evalDotProps() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isDot2(this.ctx)) {
      if (!prev || isNumber2(prev) && !isUnit2(prev) || isSymbol2(prev)) {
        if (isNumber2(prev) && isLiteral2(next) && this.env.has(next.value)) {
          const call2 = this.env.get(next.value);
          if (call2.body[0].getArgs().length !== 1) {
            raise2(`Unexpected call to \`${next.value}\``);
          }
          const scope = new Env2(this.env);
          const body = call2.body[0].getBody();
          Env2.merge([prev], call2.body[0].getArgs(), false, scope);
          this.discard().append(...await Eval2.do(body, scope, "Call", false, this.ctx.tokenInfo)).move(2);
          return true;
        }
        check3(prev || this.ctx, "map", prev ? null : "before");
      }
      if (!(isLiteral2(next) || isBlock2(next) && next.value.name)) {
        if (!next) {
          check3(this.ctx, LITERAL2, "after");
        } else {
          assert2(next, true, LITERAL2);
        }
      }
      const key = next.value.name || next.value;
      const map22 = isArray2(prev) ? Expr2.plain(prev.value) : prev.value;
      if (typeof map22[key] === "undefined") {
        let info;
        if (typeof map22 === "string") {
          info = `\`${serialize2(map22)}\``;
        } else if (!Array.isArray(map22)) {
          info = `(${Object.keys(map22).map((k22) => `:${k22}`).join(" ")})`;
        } else {
          info = `[${map22.length > 1 ? `0..${map22.length - 1}` : map22.length}]`;
        }
        raise2(`Missing property \`${next}\` in ${info}`, next.tokenInfo);
      }
      const newToken = this.newerToken();
      const entry = map22[key];
      if (isPlain22(entry) && Array.isArray(entry.body) && isBlock2(newToken) && newToken.hasArgs) {
        const callable = entry.body[0] && entry.body[0].isCallable ? entry.body[0] : Expr2.callable({
          type: BLOCK2,
          value: {
            args: entry.args || [],
            body: entry.body,
            name: key
          }
        }, this.ctx.tokenInfo);
        this.discard().append(...await Eval2.do([callable, newToken], this.env, "Fn", false, this.ctx.tokenInfo)).move(2);
        return true;
      }
      if (typeof map22[key] === "function" && isBlock2(newToken) && newToken.hasArgs) {
        const fixedArgs = await Eval2.do(newToken.getArgs(), this.env, "Args", false, this.ctx.tokenInfo);
        const result = await map22[key](...Expr2.plain(fixedArgs, this.convert, `<${key}>`));
        this.discard();
        if (typeof result !== "undefined") {
          this.append(Expr2.value(result));
        }
        this.move(2);
        return true;
      }
      if (!isBlock2(next)) {
        if (isPlain22(entry) && Array.isArray(entry.body)) {
          this.discard().append(...await Eval2.do(entry.body, this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else if (map22[key] instanceof Expr2) {
          this.discard().append(...await Eval2.do(map22[key].getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo)).move();
        } else {
          this.replace(Expr2.value(map22[key])).move();
        }
      } else if (map22[key] instanceof Expr2) {
        map22[key].value.body = await Eval2.do(next.getBody(), this.env, `:${key}`, false, this.ctx.tokenInfo);
        this.discard().move();
      } else {
        map22[key] = Expr2.plain(next.head(), this.convert, `<${key}>`);
        this.discard().move();
      }
      return true;
    }
  }
  async evalRangeSets() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isRange2(prev) && isSlice2(this.ctx)) {
      if (prev.value instanceof Range2) {
        prev.value.take(this.ctx.value);
        if (!this.isLazy()) {
          this.discard().append(...await prev.value.run(true));
        }
      } else {
        this.discard().append(...await Range2.unwrap(prev.value, (token) => [token], this.ctx));
      }
      return true;
    }
    if (isRange2(this.ctx)) {
      if (this.ctx.value instanceof Range2) {
        this.append(this.ctx);
        return true;
      }
      const options = await Eval2.do(this.ctx.value, this.env, "Set", false, this.ctx.tokenInfo);
      if (isArray2(this.ctx)) {
        this.append(Expr2.array(options.reduce((p22, c22) => {
          if (c22.isStatement)
            p22.push(...c22.getBody());
          else
            p22.push(c22);
          return p22;
        }, []), this.ctx.tokenInfo));
      } else {
        assert2(options.begin[0], true, NUMBER2, STRING2);
        const hasEnd = options.end && options.end.length > 0;
        if (hasEnd) {
          assert2(options.end[0], true, NUMBER2, STRING2);
        }
        const fixedRange = Range2.from(options.begin[0], hasEnd ? options.end[0] : undefined);
        const shouldRun = !fixedRange.infinite && !this.isLazy() && !isSlice2(next);
        const subTree = await fixedRange.run(shouldRun);
        this.replace(Expr2.from(RANGE2, subTree, this.ctx.tokenInfo));
      }
      return true;
    }
  }
  async evalLiterals() {
    const target = this.env.get(this.ctx.value);
    const next = this.nextToken();
    if (!isLiteral2(target.body[0]) && !target.body[0].isCallable && !target.body[0].hasArgs && isBlock2(next) && !next.hasBody && !target.args) {
      if (target.body[0].type !== FFI2)
        raise2(`Unexpected call to \`${this.ctx}\``);
    }
    if (isBlock2(next) && target.args && target.args.some((x22) => isLiteral2(x22, ".."))) {
      const newToken = Expr2.callable({ type: BLOCK2, value: target }, this.ctx.tokenInfo).clone();
      Expr2.sub(newToken.value.body, { "..": [Expr2.body(next.getArgs(), this.ctx.tokenInfo)] });
      this.discard().append(...await Eval2.do(newToken.getBody(), this.env, "Lit", false, this.ctx.tokenInfo)).move();
      return true;
    }
    if (target.ctx && isMod2(next) && isString2(target.body[0])) {
      this.append(...target.body);
      return true;
    }
    if (this.ctx.cached) {
      target.body[0].cached = {};
    }
    this.append(...await Eval2.do(target.body, this.env, "Lit", false, this.ctx.tokenInfo));
    return true;
  }
  async evalTagExpr(source) {
    if (!source)
      return [];
    const body = Parser2.sub(source, this.env);
    return Eval2.do(body, this.env, "TagExpr", false, this.ctx.tokenInfo);
  }
  async evalTags() {
    if (!this.ctx || !this.ctx.isTag)
      return false;
    const normalizeChild = (token) => {
      if (!token)
        return null;
      if (token.isTag)
        return token.value;
      return Expr2.plain(token, this.convert, "<TagChild>");
    };
    const evaluateNode = async (node) => {
      const attrs = {};
      const children = [];
      for (const spread of node.spreads || []) {
        const [spreadValue] = await this.evalTagExpr(spread.expr);
        if (typeof spreadValue === "undefined" || spreadValue === null)
          continue;
        const plain = Expr2.plain(spreadValue, this.convert, "<TagSpread>");
        if (!plain || Array.isArray(plain) || typeof plain !== "object") {
          raise2("Tag spread expects an object value", this.ctx.tokenInfo);
        }
        Object.assign(attrs, plain);
      }
      for (const key of Object.keys(node.attrs || {})) {
        const value = node.attrs[key];
        if (value && typeof value === "object" && typeof value.expr === "string") {
          const [exprValue] = await this.evalTagExpr(value.expr);
          attrs[key] = typeof exprValue === "undefined" ? "" : Expr2.plain(exprValue, this.convert, "<TagAttr>");
        } else {
          attrs[key] = value;
        }
      }
      for (const child of node.children || []) {
        if (typeof child === "string") {
          children.push(child);
          continue;
        }
        if (child && typeof child.expr === "string") {
          const rawTextContainer = /^(style|script)$/i.test(String(node.name || ""));
          if (rawTextContainer) {
            children.push(`{${child.expr}}`);
            continue;
          }
          const parts = await this.evalTagExpr(child.expr);
          if (parts.length === 1) {
            const fixed2 = normalizeChild(parts[0]);
            if (fixed2 !== null && typeof fixed2 !== "undefined") {
              const isTagNode = fixed2 && typeof fixed2 === "object" && typeof fixed2.name === "string";
              children.push(isTagNode ? fixed2 : { expr: child.expr, _resolved: fixed2 });
            }
          } else {
            parts.forEach((part) => {
              const fixed2 = normalizeChild(part);
              if (fixed2 !== null && typeof fixed2 !== "undefined")
                children.push(fixed2);
            });
          }
          continue;
        }
        const [resolved] = await Eval2.do([Expr2.tag(child, this.ctx.tokenInfo)], this.env, "TagNode", false, this.ctx.tokenInfo);
        const fixed = normalizeChild(resolved);
        if (fixed !== null && typeof fixed !== "undefined")
          children.push(fixed);
      }
      const resolvedNode = {
        name: node.name,
        attrs,
        children,
        selfClosing: node.selfClosing && !children.length
      };
      const component = /^[A-Z]/.test(resolvedNode.name) && this.env.has(resolvedNode.name, true);
      if (!component) {
        return [Expr2.tag(resolvedNode, this.ctx.tokenInfo)];
      }
      const props = {
        ...resolvedNode.attrs,
        children: resolvedNode.children
      };
      return Eval2.do([
        Expr2.local(resolvedNode.name, this.ctx.tokenInfo),
        Expr2.block({ args: [Expr2.value(props, this.ctx.tokenInfo)] }, this.ctx.tokenInfo)
      ], this.env, "TagComp", false, this.ctx.tokenInfo);
    };
    this.append(...await evaluateNode(this.ctx.value));
    return true;
  }
  async evalLogic() {
    const { type, value } = this.ctx;
    let result = await Eval2.do(value, this.env, "Expr", true, this.ctx.tokenInfo);
    if (isSome2(this.ctx) || isEvery2(this.ctx)) {
      const values = await Promise.all(result.map((token) => {
        return Eval2.do([token], this.env, "Expr", false, this.ctx.tokenInfo);
      }));
      this.append(Expr2.value(values[isSome2(this.ctx) ? "some" : "every"]((x22) => x22[0].valueOf())));
      return true;
    }
    if (result.length > 2) {
      for (let i22 = 1, c22 = value.length;i22 < c22; i22++) {
        let left;
        let right;
        try {
          left = await Eval2.do(value.slice(0, i22), this.env, "LogicArg", true, this.ctx.tokenInfo);
          right = await Eval2.do(value.slice(i22), this.env, "LogicArg", true, this.ctx.tokenInfo);
        } catch (_22) {
          continue;
        }
        if (left.length === 1 && right.length === 1) {
          result = [left[0], right[0]];
          break;
        }
      }
    }
    if (result.length > 2)
      raise2(`Expecting exactly 2 arguments, given ${result.length}`);
    this.append(Eval2.logic(type, result[0], result[1], this.ctx.tokenInfo));
    return true;
  }
  async evalBlocks() {
    const prev = this.getPrev();
    if (prev && this.descriptor !== "Expr" && !(isMath2(prev) || isEnd2(prev)) && !isEnd2(this.oldToken())) {
      if (!(prev.isFFI || prev.isCallable || prev.isFunction || prev.isTag || isMixed2(prev, "function"))) {
        check3(prev, "callable");
      }
      if (prev.isFFI && prev.isRaw) {
        const callback = (...input2) => Eval2.do(input2, this.env, "FFI", false, this.ctx.tokenInfo);
        const result = await prev.value.target(this.ctx.getArgs(), callback);
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr2.value(result, this.ctx.tokenInfo));
        return true;
      }
      const args2 = await Eval2.do(this.ctx.getArgs(), this.env, "Call", false, this.ctx.tokenInfo);
      const fixedArgs = args2.filter((x22) => !isLiteral2(x22, "_"));
      if (prev.isTag) {
        const plainArgs = Expr2.plain(fixedArgs, this.convert, "<Tag>");
        this.replace(Expr2.tag(composeTag2(prev.value, plainArgs), this.ctx.tokenInfo));
        return true;
      }
      if (prev.isFFI) {
        let result;
        const label = prev.value.label || "";
        const supportsCallableArgs = ["map", "filter"].includes(label);
        const preparedArgs = fixedArgs.map((arg) => {
          if (supportsCallableArgs && arg && arg.isCallable) {
            return (...input2) => {
              return this.convert(arg, Expr2.value(input2).valueOf(), `<${prev.value.label || "FFI"}>`);
            };
          }
          return arg;
        });
        if (!(this.ctx.getArg(0) && this.ctx.getArg(0).isBlock)) {
          result = await prev.value.target(...preparedArgs);
        } else {
          result = await prev.value.target(preparedArgs);
        }
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr2.value(result, this.ctx.tokenInfo));
        return true;
      }
      if (isMixed2(prev, "function")) {
        const result = await prev.valueOf()(...Expr2.plain(fixedArgs, this.convert, `<${prev.value.name || "Function"}>`));
        if (typeof result === "undefined")
          this.discard();
        else
          this.replace(Expr2.value(result));
        return true;
      }
      if (prev.value.env instanceof Env2) {
        const { env, label, target: target2 } = prev.valueOf();
        if (this.descriptor === "Lit") {
          this.replace(Expr2.fn({
            env,
            label,
            target: target2,
            args: fixedArgs
          }, this.ctx.tokenInfo));
        } else {
          const scope2 = new Env2(env);
          const { body: body2 } = env.get(target2);
          const nextArgs = (prev.hasArgs ? prev.getArgs() : []).concat(fixedArgs);
          Env2.merge(Expr2.args(nextArgs), body2[0].getArgs(), false, scope2);
          this.discard().append(...await Eval2.do(body2[0].getBody(), scope2, label, false, this.ctx.tokenInfo));
        }
        return true;
      }
      if (prev.isFunction) {
        const { label, target: target2 } = prev.valueOf();
        const nextArgs = (prev.getArgs() || []).concat(fixedArgs);
        const result = await target2(...Expr2.plain(nextArgs, this.convert, label));
        if (typeof result !== "undefined") {
          this.replace(Expr2.value(result, this.ctx.tokenInfo));
        } else {
          this.discard();
        }
        return true;
      }
      const { target, scope } = Env2.sub(fixedArgs, prev.value, this.env);
      if (fixedArgs.length > prev.length && !prev.getArgs().some((x22) => isLiteral2(x22, ".."))) {
        argv2(args2, prev, prev.length);
      }
      if (prev.hasInput) {
        const nextArgs = prev.getArgs().map((sub, j) => {
          if (isLiteral2(sub, "_")) {
            if (!args2.length)
              argv2(null, prev, j);
            return args2.shift();
          }
          return sub;
        });
        const offset = nextArgs.length + args2.length;
        if (offset < prev.value.length)
          argv2(null, prev, offset);
        if (offset > prev.value.length)
          argv2(args2, prev, offset - 1);
        if (nextArgs.length < prev.value.length) {
          nextArgs.push(Expr2.from(COMMA2), ...fixedArgs);
        }
        this.discard().append(...await Eval2.do([
          Expr2.callable({
            type: BLOCK2,
            value: {
              args: prev.getInput(),
              body: this.env.get(prev.getName()).body
            }
          }, prev.tokenInfo),
          Expr2.block({ args: nextArgs }, this.ctx.tokenInfo)
        ], this.env, "Fn", false, prev.tokenInfo));
        return true;
      }
      if (prev.source && fixedArgs.length < prev.length) {
        if (target.args.length < prev.length) {
          target.args = prev.getArgs().concat(target.args);
        }
        if (this.descriptor !== "Lit" && prev.isCallable && prev.length && !fixedArgs.length) {
          raise2(`Missing arguments to call \`${prev.getName()}\``);
        }
        this.replace(Expr2.callable({
          type: BLOCK2,
          value: {
            args: args2,
            input: target.args,
            source: prev.source,
            length: prev.length
          }
        }, prev.tokenInfo));
      } else {
        let clean = false;
        let ctx = scope;
        let key;
        if (prev.cached) {
          key = `#${fixedArgs.toString()}`;
          if (prev.cached[key]) {
            this.discard().append(...prev.cached[key]);
            return true;
          }
        }
        if (target.body.some((x22) => isBlock2(x22) && x22.isRaw)) {
          if (this.descriptor === "Eval" || this.descriptor === "Fn") {
            this.env = new Env2(this.env);
          }
          ctx = this.env;
          clean = target.body.length === 1 && isBlock2(target.body[0]);
        }
        if (target.args && target.args.length === fixedArgs.length) {
          Env2.merge(fixedArgs, target.args, clean, ctx);
        }
        const fnName = prev.getName();
        if (fnName) {
          const ann = this.env.getAnnotation(fnName);
          if (ann && typeof ann === "string") {
            const annotation = parseAnnotation2(ann);
            if (annotation?.params?.length) {
              for (let i22 = 0;i22 < annotation.params.length && i22 < fixedArgs.length; i22++) {
                const expected = annotation.params[i22];
                const actual = fixedArgs[i22];
                if (!matchesType2(actual, expected, this.env)) {
                  const got = inferRuntimeType2(actual);
                  raise2(`\`${fnName}\`: expected ${expected}, got ${got} (arg ${i22 + 1})`, this.ctx.tokenInfo);
                }
              }
            }
          }
        }
        const result = await Eval2.do(target.body, ctx, `:${fnName || ""}`, true, this.ctx.tokenInfo);
        if (key) {
          if (this.descriptor !== "Eval") {
            prev.cached[key] = result;
          } else {
            delete prev.cached;
          }
        }
        this.discard().append(...result);
      }
      return true;
    }
    const { name, args, body } = this.ctx.valueOf();
    if (this.ctx.isCallable) {
      if (name && body) {
        const call2 = !args && this.derive && DERIVE_METHODS2.includes(this.descriptor) ? await Eval2.do(body, this.env, "Fn", true, this.ctx.tokenInfo) : body;
        if (call2[0].isCallable && call2[0].hasArgs) {
          call2[0].length = Expr2.arity(call2[0]);
          call2[0].source = name;
        }
        this.env.defn(name, { args, body: call2 }, this.ctx.tokenInfo);
        this.registerNamespaceExport(name);
      } else {
        this.append(this.ctx);
      }
    } else {
      let fixedBody = args || body;
      if (args && this.ctx.tokenInfo && this.ctx.tokenInfo.value === "{") {
        fixedBody = Eval2.normalizeBraceRecordArgs(args);
      }
      const derived = this.derive || fixedBody[0] && fixedBody[0].isObject;
      this.append(...await Eval2.do(fixedBody, this.env, derived ? this.descriptor : "...", derived, this.ctx.tokenInfo));
    }
    return true;
  }
  async evalUnary() {
    const prev = this.getPrev();
    const older = this.getOlder();
    if (prev && prev.type === MINUS2 && !isNumber2(this.getOlder())) {
      if (!isNumber2(this.ctx)) {
        assert2(this.ctx, false, NUMBER2);
      }
      this.replace(Expr2.value(this.ctx * -1, this.ctx.tokenInfo));
      return true;
    }
    if ((!prev || isEnd2(prev)) && isOR2(this.ctx)) {
      return true;
    }
    if (isNot2(prev) && isResult2(this.ctx)) {
      if (isLiteral2(this.ctx)) {
        [this.ctx] = await Eval2.do([this.ctx], this.env, "Expr", true, this.ctx.tokenInfo);
      }
      this.replace(Expr2.value(!this.ctx.valueOf(), this.ctx.tokenInfo));
      return true;
    }
    if (isSome2(this.ctx) && isResult2(prev)) {
      const tag = Eval2.getResultTagToken(prev);
      if (tag) {
        const payloadBody = prev.valueOf().value.getBody();
        if (tag.valueOf() === ":ok") {
          if (payloadBody.length === 1) {
            this.replace(payloadBody[0]);
          } else {
            this.replace(Expr2.array(payloadBody));
          }
          this.move(Expr2.chunk(this.expr, this.offset + 1).offset);
        } else {
          this.discard();
        }
        return true;
      }
    }
    if (isResult2(prev) && isOR2(this.ctx) && isObject2(prev) && !isSome2(older)) {
      const { body, offset } = Expr2.chunk(this.expr, this.offset + 1);
      if (body.length) {
        const merged = await Eval2.do(body, this.env, "Or", false, this.ctx.tokenInfo);
        if (merged.length === 1 && isObject2(merged[0])) {
          this.discard().append(Expr2.map({
            ...prev.valueOf(),
            ...merged[0].valueOf()
          }, this.ctx.tokenInfo));
          this.move(offset);
          return true;
        }
      }
    }
    if (isResult2(prev) && (isOR2(this.ctx) || isSome2(this.ctx))) {
      if (isSome2(this.ctx) ? !prev.valueOf() : prev.valueOf()) {
        this.move(Expr2.chunk(this.expr, this.offset + 1).offset);
      } else {
        this.discard();
      }
      return true;
    }
  }
  async evalSymbols() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isSymbol2(this.ctx) && this.ctx.value === ":") {
      if (isBlock2(next) || isString2(next) && typeof next.value !== "string") {
        let [head22] = await Eval2.do(next.getArgs() || next.valueOf(), this.env, "Sym", false, this.ctx.tokenInfo);
        if (!isScalar2(head22)) {
          assert2(head22, true, STRING2, NUMBER2, SYMBOL2);
        }
        let token;
        if (head22.valueOf() === "nil")
          token = Expr2.value(null, this.ctx.tokenInfo);
        if (head22.valueOf() === "on")
          token = Expr2.value(true, this.ctx.tokenInfo);
        if (head22.valueOf() === "off")
          token = Expr2.value(false, this.ctx.tokenInfo);
        const value = !isSymbol2(head22) ? `:${head22.valueOf()}` : head22.valueOf();
        this.replace(token || Expr2.symbol(value, false, this.ctx.tokenInfo), true).move();
      }
    }
    if (isArray2(prev) && isData2(prev.value[0]) && isSymbol2(this.ctx)) {
      const value = prev.valueOf();
      const key = this.ctx.value.substr(1);
      this.discard();
      value.forEach((body) => {
        let result;
        if (isScalar2(body) || isObject2(body) || isArray2(body)) {
          result = body.valueOf()[key];
        }
        if (typeof result !== "undefined") {
          this.append(!(result instanceof Expr2) ? Expr2.value(result) : result);
        }
      });
      return true;
    }
    if (this.key || isSymbol2(prev) && isResult2(this.ctx)) {
      if (isObject2(prev) && isComma2(this.ctx)) {
        if (isObject2(prev) && isObject2(next)) {
          Object.assign(prev.value, next.value);
          this.move();
        } else if (isSymbol2(next))
          this.key = next.value.substr(1);
        return true;
      }
      if (!this.key) {
        const key = prev.value.substr(1);
        this.replace(Expr2.map({
          [key]: Expr2.body([this.ctx], this.ctx.tokenInfo)
        }, prev.tokenInfo));
        if (!(isEOL2(next) || isMath2(next))) {
          this.key = key;
        }
      } else if (isSymbol2(this.ctx) && isResult2(next)) {
        this.key = this.ctx.value.substr(1);
        prev.valueOf()[this.key] = Expr2.body([], this.ctx.tokenInfo);
      } else {
        if (isDot2(this.ctx) || isPipe2(this.ctx) || !isComma2(this.ctx) && isEnd2(this.ctx)) {
          this.key = null;
          return;
        }
        const target = prev.valueOf();
        if (!target[this.key]) {
          this.key = null;
          return;
        }
        target[this.key].push(this.ctx);
      }
      return true;
    }
    if (isNumber2(prev) && this.ctx.type === MUL2 && (isLiteral2(next) || isSymbol2(next))) {
      let fixedToken = next;
      if (isLiteral2(next) && this.env.has(next.value)) {
        const resolved = this.env.get(next.value);
        if (resolved && resolved.ctx) {
          fixedToken = resolved.ctx;
        }
      }
      if (fixedToken && fixedToken.type === SYMBOL2) {
        const num = prev.valueOf();
        const kind = fixedToken.value;
        const retval = Env2.register(num, kind.substr(1));
        if (isPlain22(retval)) {
          this.replace(Expr2.unit(retval, this.ctx.tokenInfo)).move();
          return true;
        }
      }
    }
  }
  async evalStrings() {
    const prev = this.getPrev();
    const next = this.nextToken();
    if (isString2(this.ctx) && typeof this.ctx.value !== "string" && !isMod2(next)) {
      const result = await Eval2.do(this.ctx.valueOf(), this.env, "Str", false, this.ctx.tokenInfo);
      this.replace(Expr2.value(result.map((sub) => sub.value).join(""), this.ctx.tokenInfo), true);
      return;
    }
    if (isString2(prev) && isMod2(this.ctx)) {
      const { body, offset } = Expr2.chunk(this.expr, this.offset + 1);
      const subTree = await Eval2.do(body, this.env, "Str", false, this.ctx.tokenInfo);
      if (typeof prev.value !== "string") {
        if (subTree.length > 1 || !isObject2(subTree[0])) {
          check3(body[0], "map");
        }
        this.discard().append(...await Eval2.do(prev.valueOf(), Env2.create(subTree[0].valueOf(), this.env), "Str", false, this.ctx.tokenInfo));
      } else {
        let isHead = subTree.length === 1;
        if (isHead) {
          if (isObject2(subTree[0]) || !(isBlock2(body[0]) || isRange2(body[0]))) {
            check3(body[0], "block or list");
          }
          isHead = isBlock2(subTree[0]) || isRange2(subTree[0]);
        }
        let inc = 0;
        const source = isHead ? subTree[0].getArgs() || subTree[0].valueOf() : subTree;
        const values = await Eval2.do(source, this.env, "Str", false, next.tokenInfo);
        const newValue = prev.value.replace(/{(\d+)?}/g, (_22, idx) => {
          const fixedValue = typeof idx !== "undefined" ? values[idx] : values[inc++];
          if (typeof fixedValue === "undefined") {
            raise2(`Missing argument #${idx || inc}`, next.tokenInfo);
          }
          if (fixedValue.valueOf() === null)
            return ":nil";
          if (fixedValue.valueOf() === true)
            return ":on";
          if (fixedValue.valueOf() === false)
            return ":off";
          return fixedValue.valueOf();
        });
        this.replace(Expr2.value(newValue));
      }
      this.move(offset);
      return true;
    }
  }
  async walk(descriptor) {
    if (Eval2.detail && Eval2.detail.enabled) {
      Eval2.detail.calls.push([descriptor, Eval2.detail.depth, this.expr]);
    }
    return this.execute(descriptor, async () => {
      if (!(this.ctx instanceof Expr2)) {
        raise2(`Given \`${JSON.stringify(this.ctx)}\` as token!`);
      }
      if (!this.ctx.tokenInfo || (typeof this.ctx.tokenInfo.line === "undefined" || typeof this.ctx.tokenInfo.col === "undefined")) {
        if (isResult2(this.ctx))
          raise2(`Given \`${JSON.stringify(this.ctx.tokenInfo)}\` as tokenInfo!`);
      }
      if (this.ctx.isObject) {
        const prev = this.getPrev();
        if (prev && !(isEnd2(prev) || isResult2(prev)))
          check3(prev);
        this.append(...await Eval2.map(this.ctx, descriptor, this.env, this.ctx.tokenInfo, this));
        return;
      }
      if (await this.evalUnary() || await this.evalTags() || await this.evalSymbols() || await this.evalStrings() || await this.evalDotProps() || await this.evalRangeSets() || await this.evalInfixCalls() || isBlock2(this.ctx) && await this.evalBlocks() || this.ctx.isExpression && await this.evalLogic() || isLiteral2(this.ctx) && typeof this.ctx.value === "string" && this.ctx.value !== "_" && await this.evalLiterals())
        return;
      if (isString2(this.ctx) && typeof this.ctx.value === "string") {
        this.ctx.value = this.ctx.value.replace(/\\r/g, "\r");
        this.ctx.value = this.ctx.value.replace(/\\n/g, `
`);
        this.ctx.value = this.ctx.value.replace(/\\t/g, "\t");
      }
      this.append(this.ctx);
    });
  }
  async run(descriptor, tokenInfo) {
    let tokens = await this.walk(descriptor);
    tokens = Eval2.math(OPS_MUL_DIV2, tokens, tokenInfo);
    tokens = Eval2.math(OPS_PLUS_MINUS_MOD2, tokens, tokenInfo);
    tokens = Eval2.walk(OPS_LOGIC2, tokens, (left, op, right) => Eval2.logic(op.type, left, right, tokenInfo));
    return tokens.filter((x22) => ![EOL2, COMMA2].includes(x22.type));
  }
  static info(defaults) {
    Eval2.detail = defaults;
    return defaults;
  }
  static wrap(self) {
    return async (fn, args, label) => {
      const safeArgs = Array.isArray(args) ? args : [];
      const fnArgs = typeof fn?.getArgs === "function" && Array.isArray(fn.getArgs()) ? fn.getArgs() : [];
      if (typeof fn.length === "number" && fn.length > safeArgs.length) {
        raise2(`Missing arguments to call \`${fn.getName()}\``, self.ctx.tokenInfo);
      }
      try {
        const scope = new Env2(self.env);
        Env2.merge(safeArgs, fnArgs, false, scope);
        const [value] = await Eval2.do(fn.getBody(), scope, label, false, self.ctx.tokenInfo);
        return value ? Expr2.plain(value, self.convert, `<${fn.name || "Function"}>`) : undefined;
      } catch (e22) {
        raise2(e22.message.replace(/\sat line.*$/, ""), self.ctx.tokenInfo);
      }
    };
  }
  static math(ops, expr, tokenInfo) {
    return Eval2.walk(ops, expr, (left, op, right) => {
      let result;
      if (op.type === PLUS2) {
        assert2(left, true, STRING2, NUMBER2, SYMBOL2);
        assert2(right, true, STRING2, NUMBER2, SYMBOL2);
      } else {
        assert2(left, true, NUMBER2);
        assert2(right, true, NUMBER2);
      }
      if (isUnit2(left) || isUnit2(right)) {
        let method;
        switch (op.type) {
          case PLUS2:
            method = "add";
            break;
          case MINUS2:
            method = "sub";
            break;
          case DIV2:
            method = "div";
            break;
          case MUL2:
            method = "mul";
            break;
          case MOD2:
            method = "mod";
            break;
        }
        if (isUnit2(left)) {
          try {
            const kind = (isUnit2(right) ? right : left).value.kind;
            result = left.value[method](right.value, kind);
            if (typeof result !== "undefined") {
              return Expr2.unit(result, tokenInfo);
            }
          } catch (e22) {
            raise2(`Failed to call \`${method}\` (${e22.message})`);
          }
        }
        right = right.valueOf();
      }
      switch (op.type) {
        case PLUS2:
          if (isSymbol2(left))
            left = left.valueOf().substr(1);
          if (isSymbol2(right))
            right = right.valueOf().substr(1);
          result = left + right;
          break;
        case MINUS2:
          result = left - right;
          break;
        case DIV2:
          result = left / right;
          break;
        case MUL2:
          result = left * right;
          break;
        case MOD2:
          result = left % right;
          break;
      }
      return Expr2.value(result, tokenInfo);
    });
  }
  static logic(op, left, right, tokenInfo) {
    let result;
    switch (op) {
      case NOT_EQ2:
        result = left.type !== right.type || hasDiff2(left, right);
        break;
      case EXACT_EQ2:
        result = left.type === right.type && !hasDiff2(left, right);
        break;
      case EQUAL2:
        result = !hasDiff2(left, right, true);
        break;
      case LIKE2:
        result = hasIn2(left, right);
        break;
      case NOT2:
        result = hasDiff2(left, right, true);
        break;
      case LESS2:
        result = left < right;
        break;
      case LESS_EQ2:
        result = left <= right;
        break;
      case GREATER2:
        result = left > right;
        break;
      case GREATER_EQ2:
        result = left >= right;
        break;
    }
    return Expr2.value(result, tokenInfo);
  }
  static walk(ops, expr, callback) {
    if (expr.length < 3)
      return expr;
    const output = [expr[0]];
    for (let i22 = 1, c22 = expr.length;i22 < c22; i22++) {
      const op = expr[i22];
      if (op && ops.has(op.type) && i22 + 1 < c22) {
        const left = output.pop();
        const right = expr[++i22];
        output.push(callback(left, op, right));
      } else {
        output.push(op);
      }
    }
    return output;
  }
  static async loop(body, value, environment, parentTokenInfo) {
    const source = await Eval2.do(value, environment, "Loop", false, parentTokenInfo);
    let scope = environment;
    let target = false;
    if (isLiteral2(body[0])) {
      target = isBlock2(body[1]) || isLiteral2(body[1]) ? body.shift() : body[0];
      if (isString2(body[1]) && Array.isArray(body[1].value)) {
        body = body[1].valueOf();
      }
    }
    if (isBlock2(body[0]) && body[0].isCallable) {
      target = body[0].getArg(0);
      body = body[0].getBody();
    }
    if (target) {
      if (!(environment.has(target.value, true) && body.length === 1)) {
        scope = new Env2(environment);
      } else {
        target = null;
      }
    }
    return Range2.unwrap(source, (token) => {
      if (target) {
        scope.def(target.value, token);
      }
      if (target === null) {
        return Eval2.run(body.concat(Expr2.block({ args: [token] }, token.tokenInfo)), scope, "It", true, parentTokenInfo);
      }
      return body.length ? Eval2.run(body, scope, "It", true, parentTokenInfo) : [token];
    });
  }
  static async map(token, descriptor, environment, parentTokenInfo, state) {
    const { value } = token;
    const subTree = [];
    const convert22 = state && typeof state.convert === "function" ? state.convert : null;
    const isDirectiveStmt = (stmt) => !!(stmt && typeof stmt.getBody === "function");
    const normalizeDirectiveArgs2 = (stmt) => {
      if (!isDirectiveStmt(stmt))
        return [];
      const body = stmt.getBody();
      const flat = body.length === 1 && body[0] && body[0].type === BLOCK2 && body[0].hasBody ? body[0].getBody() : body;
      return flat.filter((part) => part && part.type !== COMMA2);
    };
    const toPlain = (valueToken) => Expr2.plain(valueToken, convert22, "<Directive>");
    const resolveRuntimeFn = (name) => {
      if (!environment.has(name, true)) {
        raise2(`Undeclared local \`${name}\``, parentTokenInfo);
      }
      const entry = environment.get(name);
      const [head22] = entry && entry.body || [];
      const fn = head22 ? toPlain(head22) : null;
      if (typeof fn !== "function") {
        raise2(`\`${name}\` is not callable`, parentTokenInfo);
      }
      return fn;
    };
    const isSignalValue = (candidate) => candidate && typeof candidate.get === "function" && typeof candidate.set === "function";
    const hasShadow = isDirectiveStmt(value.shadow);
    const htmlTextFromValue = (entry) => {
      if (entry === null || typeof entry === "undefined")
        return "";
      if (Array.isArray(entry)) {
        return entry.map(htmlTextFromValue).join("");
      }
      if (entry instanceof Expr2) {
        if (entry.isTag)
          return renderTag2(entry.valueOf());
        return htmlTextFromValue(Expr2.plain(entry, convert22, "<HTML>"));
      }
      if (typeof entry === "object" && typeof entry.name === "string" && Array.isArray(entry.children)) {
        return renderTag2(entry);
      }
      return String(entry);
    };
    let signalMap = new Map;
    const tagToVdom = (node) => {
      const attrs = {};
      for (const [key, val] of Object.entries(node.attrs || {})) {
        attrs[key] = val && typeof val.expr === "string" ? String(val.expr) : val;
      }
      const children = (node.children || []).map((child) => {
        if (typeof child === "string")
          return child;
        if (child && typeof child.expr === "string") {
          return signalMap.get(child.expr) ?? child._signal ?? child._resolved ?? "";
        }
        if (typeof child === "object" && typeof child.name === "string")
          return tagToVdom(child);
        return String(child);
      });
      return [node.name, attrs, children];
    };
    const htmlVdomFromValue = (entry) => {
      if (entry === null || typeof entry === "undefined")
        return "";
      if (Array.isArray(entry)) {
        return entry.map(htmlVdomFromValue);
      }
      if (entry instanceof Expr2) {
        if (entry.isTag)
          return tagToVdom(entry.valueOf());
        return htmlVdomFromValue(Expr2.plain(entry, convert22, "<HTML>"));
      }
      if (isSignalValue(entry))
        return entry;
      if (typeof entry === "object" && typeof entry.name === "string" && Array.isArray(entry.children)) {
        return tagToVdom(entry);
      }
      return String(entry);
    };
    const renderDisposers = environment.__xRenderDisposers instanceof Map ? environment.__xRenderDisposers : environment.__xRenderDisposers = new Map;
    const onDisposers = environment.__xOnDisposers instanceof Map ? environment.__xOnDisposers : environment.__xOnDisposers = new Map;
    const resolveShadowHost = (candidate) => {
      let host = candidate;
      if (typeof host === "string") {
        if (typeof document === "undefined" || !document.querySelector) {
          raise2(`Shadow host not found: ${host}`, parentTokenInfo);
        }
        host = document.querySelector(host);
      }
      if (!host) {
        host = environment.__xLastShadowHost || null;
      }
      if (!host || typeof host !== "object") {
        raise2("Shadow host not found", parentTokenInfo);
      }
      if (!host.shadowRoot) {
        if (typeof host.attachShadow !== "function") {
          raise2("Shadow host does not support attachShadow", parentTokenInfo);
        }
        host.attachShadow({ mode: "open" });
      }
      return host;
    };
    let isDone22;
    if (value.annot instanceof Expr2.Statement) {
      const [nameToken, typeToken] = value.annot.getBody();
      const name = nameToken && nameToken.valueOf ? String(nameToken.valueOf()) : "";
      const typeText = typeToken && typeToken.valueOf ? String(typeToken.valueOf()) : "";
      if (name) {
        environment.annotate(name, typeText);
      }
      isDone22 = true;
    }
    if (value.let instanceof Expr2.LetStatement) {
      subTree.push(...await Eval2.do(value.let.getBody(), environment, "Let", true, parentTokenInfo));
      isDone22 = true;
    }
    if (value.destructure instanceof Expr2.DestructureStatement) {
      const [bindingsToken, bodyToken] = value.destructure.getBody();
      const bindings = bindingsToken && bindingsToken.value || [];
      const source = await Eval2.do(bodyToken.getBody(), environment, "Let", true, parentTokenInfo);
      let values = source;
      if (source.length === 1) {
        if (isArray2(source[0])) {
          values = source[0].value;
        } else if (isRange2(source[0])) {
          const expanded = await source[0].value.run(true);
          values = expanded.value;
        }
      }
      const restIndex = bindings.findIndex((binding) => binding.rest === true);
      const minRequired = restIndex === -1 ? bindings.length : restIndex;
      if (values.length < minRequired) {
        raise2(`Expecting at least ${minRequired} values to destructure, given ${values.length}`, parentTokenInfo);
      }
      bindings.forEach((binding, index) => {
        if (binding.name === "_")
          return;
        const token2 = binding.rest ? Expr2.array(values.slice(index), parentTokenInfo) : values[index];
        environment.def(binding.name, token2 || Expr2.value(null, parentTokenInfo));
      });
      isDone22 = true;
    }
    if (value.do instanceof Expr2.DoStatement && !(value.while instanceof Expr2.WhileStatement)) {
      const scope = new Env2(environment);
      const result = await Eval2.do(value.do.getBody(), scope, "Do", true, parentTokenInfo);
      if (result.length) {
        subTree.push(result[result.length - 1]);
      }
      isDone22 = true;
    }
    if (value.if instanceof Expr2.IfStatement) {
      const { body } = value.if.value;
      for (let i22 = 0, c22 = body.length;i22 < c22; i22++) {
        const [head22, ...tail22] = body[i22].getBody();
        const [result] = await Eval2.do([head22], environment, "If", true, parentTokenInfo);
        if (result.value === true) {
          subTree.push(...await Eval2.do(tail22, environment, "Then", true, parentTokenInfo));
          break;
        }
        if (result.value === false && value.else instanceof Expr2.Statement) {
          subTree.push(...await Eval2.do(value.else.getBody(), environment, "Else", true, parentTokenInfo));
          break;
        }
      }
      isDone22 = true;
    }
    if (value.namespace instanceof Expr2.NamespaceStatement) {
      const [nameToken, levelToken] = value.namespace.getBody();
      const name = nameToken && nameToken.valueOf && nameToken.valueOf() || "";
      const level = levelToken && levelToken.valueOf && levelToken.valueOf() || 1;
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
        raise2(`Invalid namespace \`${name}\``, parentTokenInfo);
      }
      if (state && typeof state.enterNamespace === "function") {
        state.enterNamespace(name, Math.max(1, parseInt(level, 10) || 1), parentTokenInfo);
      }
      isDone22 = true;
    }
    if (value.table instanceof Expr2.TableStatement) {
      const [metaToken] = value.table.getBody();
      const meta = metaToken && metaToken.valueOf && metaToken.valueOf() || {};
      const headers = Array.isArray(meta.headers) ? meta.headers : [];
      const rows = Array.isArray(meta.rows) ? meta.rows : [];
      const items22 = rows.map((row) => {
        const entry = {};
        headers.forEach((header, i22) => {
          entry[header] = Expr2.body([Eval2.tableCellToken(row[i22], parentTokenInfo)], parentTokenInfo);
        });
        return Expr2.map(entry, parentTokenInfo);
      });
      subTree.push(Expr2.array(items22, parentTokenInfo));
      isDone22 = true;
    }
    if (value.ok instanceof Expr2.OkStatement) {
      subTree.push(await Eval2.buildResultToken("ok", value.ok.getBody(), environment, parentTokenInfo));
      isDone22 = true;
    }
    if (value.err instanceof Expr2.ErrStatement) {
      subTree.push(await Eval2.buildResultToken("err", value.err.getBody(), environment, parentTokenInfo));
      isDone22 = true;
    }
    if (isDirectiveStmt(value.signal)) {
      if (token.__signalCached) {
        subTree.push(token.__signalCached);
        isDone22 = true;
      }
      if (isDone22) {} else {
        const signal2 = resolveRuntimeFn("signal");
        const args = normalizeDirectiveArgs2(value.signal);
        const runtimeArgs = [];
        for (let i22 = 0;i22 < args.length; i22++) {
          const evaluated = await Eval2.do([args[i22]], environment, "Expr", true, parentTokenInfo);
          if (!evaluated.length)
            continue;
          runtimeArgs.push(toPlain(evaluated.length === 1 ? evaluated[0] : evaluated));
        }
        const signalName = token && typeof token.getName === "function" ? token.getName() : null;
        if (signalName && runtimeArgs.length < 2) {
          runtimeArgs.push(signalName);
        }
        token.__signalCached = Expr2.value(signal2(...runtimeArgs), parentTokenInfo);
        subTree.push(token.__signalCached);
        isDone22 = true;
      }
    }
    if (isDirectiveStmt(value.render)) {
      const renderArgs = normalizeDirectiveArgs2(value.render);
      const selectorTokens = renderArgs.length ? await Eval2.do(renderArgs, environment, "Expr", true, parentTokenInfo) : [];
      const selector = selectorTokens.length ? toPlain(selectorTokens.length === 1 ? selectorTokens[0] : selectorTokens) : undefined;
      const shadowArgs = hasShadow ? normalizeDirectiveArgs2(value.shadow) : [];
      let shadowSelector;
      if (shadowArgs.length) {
        const shadowTokens = await Eval2.do(shadowArgs, environment, "Expr", true, parentTokenInfo);
        if (shadowTokens.length) {
          shadowSelector = toPlain(shadowTokens.length === 1 ? shadowTokens[0] : shadowTokens);
        }
      }
      if (isDirectiveStmt(value.html)) {
        const html2 = resolveRuntimeFn("html");
        const render22 = hasShadow ? resolveRuntimeFn("renderShadow") : resolveRuntimeFn("render");
        const htmlBody = normalizeDirectiveArgs2(value.html);
        const renderKey = selector != null ? String(selector) : hasShadow ? typeof shadowSelector !== "undefined" ? String(shadowSelector) : "__last_shadow__" : "__default__";
        for (const [key, prev] of renderDisposers) {
          if (key === renderKey || key === `shadow:${renderKey}` || key === `dom:${renderKey}`) {
            if (typeof prev.stop === "function")
              prev.stop();
            renderDisposers.delete(key);
          }
        }
        const view = html2(async () => {
          const scope = new Env2(environment);
          signalMap = new Map;
          const localNames = Object.keys(environment.locals || {});
          for (let i22 = 0;i22 < localNames.length; i22++) {
            const name = localNames[i22];
            const local = environment.locals[name];
            const [head22] = local && local.body || [];
            if (!(head22 && head22.isObject && head22.value && head22.value.signal))
              continue;
            const signalEntry = environment.get(name);
            const resolvedBody = signalEntry && signalEntry.body ? signalEntry.body : [];
            if (!resolvedBody.length)
              continue;
            const resolved = await Eval2.do(resolvedBody, environment, "Lit", false, parentTokenInfo);
            if (!resolved || !resolved.length)
              continue;
            const plain = toPlain(resolved.length === 1 ? resolved[0] : resolved);
            if (!isSignalValue(plain))
              continue;
            signalMap.set(name, plain);
            scope.def(name, Expr2.value(plain.peek(), parentTokenInfo));
          }
          const rendered = await Eval2.do(htmlBody, scope, "Render", true, parentTokenInfo);
          if (!rendered.length)
            return "";
          const result = htmlVdomFromValue(rendered.length === 1 ? rendered[0] : rendered);
          if (signalMap.size > 0) {
            signalMap.forEach((sig) => sig.get());
          }
          return result;
        });
        if (hasShadow) {
          const host = resolveShadowHost(typeof shadowSelector !== "undefined" ? shadowSelector : selector);
          environment.__xLastShadowHost = host;
          if (host.shadowRoot)
            host.shadowRoot.innerHTML = "";
          renderDisposers.set(renderKey, render22(host, view));
        } else {
          if (typeof document !== "undefined") {
            const target = typeof selector === "string" ? document.querySelector(selector) : selector;
            if (target)
              target.innerHTML = "";
          }
          renderDisposers.set(renderKey, render22(selector, view));
        }
      }
      isDone22 = true;
    }
    if (isDirectiveStmt(value.on)) {
      const on2 = resolveRuntimeFn("on");
      const args = normalizeDirectiveArgs2(value.on);
      const shadowParts = hasShadow ? normalizeDirectiveArgs2(value.shadow) : [];
      const unwrapHandlerToken = (candidate) => {
        if (!candidate)
          return null;
        if (candidate.isCallable)
          return candidate;
        if (candidate.isBlock && candidate.hasBody) {
          const body = candidate.getBody();
          if (body.length === 1 && body[0] && body[0].isCallable)
            return body[0];
        }
        return null;
      };
      let eventToken = args[0];
      let selectorToken = args[1];
      let handlerToken = args[2];
      if (!handlerToken && shadowParts.length) {
        const maybeHandler = unwrapHandlerToken(shadowParts[0]);
        if (maybeHandler) {
          handlerToken = maybeHandler;
          shadowParts.shift();
        }
      }
      if (!eventToken || !selectorToken || !handlerToken) {
        raise2("`@on` expects event, selector and handler", parentTokenInfo);
      }
      const [eventValue] = await Eval2.do([eventToken], environment, "Expr", true, parentTokenInfo);
      const [selectorValue] = await Eval2.do([selectorToken], environment, "Expr", true, parentTokenInfo);
      const eventName = toPlain(eventValue);
      const selector = toPlain(selectorValue);
      let shadowSelector;
      if (shadowParts.length) {
        const shadowTokens = await Eval2.do(shadowParts, environment, "Expr", true, parentTokenInfo);
        if (shadowTokens.length) {
          shadowSelector = toPlain(shadowTokens.length === 1 ? shadowTokens[0] : shadowTokens);
        }
      }
      let handler;
      if (handlerToken && handlerToken.isCallable && handlerToken.hasBody && handlerToken.getName) {
        const targetName = handlerToken.getName();
        if (environment.has(targetName, true)) {
          const targetEntry = environment.get(targetName);
          const resolvedTarget = targetEntry && targetEntry.body ? await Eval2.do(targetEntry.body, environment, "Lit", false, parentTokenInfo) : [];
          const target = resolvedTarget.length ? toPlain(resolvedTarget.length === 1 ? resolvedTarget[0] : resolvedTarget) : null;
          if (isSignalValue(target)) {
            handler = async () => {
              const scope = new Env2(environment);
              scope.def(targetName, Expr2.value(target.get(), parentTokenInfo));
              const nextTokens = await Eval2.do(handlerToken.getBody(), scope, "On", true, parentTokenInfo);
              if (!nextTokens.length)
                return;
              const nextValue = toPlain(nextTokens.length === 1 ? nextTokens[0] : nextTokens);
              target.set(nextValue);
            };
          }
        }
      }
      if (!handler) {
        const [resolvedHandlerToken] = await Eval2.do([handlerToken], environment, "Expr", true, parentTokenInfo);
        const resolvedHandler = resolvedHandlerToken ? toPlain(resolvedHandlerToken) : null;
        handler = typeof resolvedHandler === "function" ? resolvedHandler : () => {};
      }
      const shadowRoot = hasShadow ? resolveShadowHost(typeof shadowSelector !== "undefined" ? shadowSelector : undefined).shadowRoot : undefined;
      const onKey = `${eventName}::${selector}::${hasShadow ? typeof shadowSelector !== "undefined" ? shadowSelector : "__last_shadow__" : "document"}`;
      const previousOn = onDisposers.get(onKey);
      if (typeof previousOn === "function")
        previousOn();
      onDisposers.set(onKey, on2(eventName, selector, handler, shadowRoot));
      isDone22 = true;
    }
    if (value.loop instanceof Expr2.LoopStatement) {
      const body = value.loop.getBody();
      for (let i22 = 0, c22 = body.length;i22 < c22; i22++) {
        let range;
        let args;
        if (isBlock2(body[i22])) {
          if (isBlock2(body[i22].head())) {
            const [head22, ...tail22] = body[i22].getBody();
            range = [head22];
            args = tail22;
          } else {
            range = body[i22].getBody();
            args = [];
          }
        } else {
          range = [body[i22]];
          args = [];
        }
        subTree.push(...await Eval2.loop(args, range, environment, parentTokenInfo));
      }
      isDone22 = true;
    }
    if (value.match instanceof Expr2.MatchStatement) {
      const fixedMatches = value.match.clone().getBody();
      const fixedBody = value.match.head().value.body;
      const fixedArgs = isBlock2(fixedBody[0]) ? fixedBody[0].getArgs() : [fixedBody[0]];
      const [input2] = await Eval2.do(fixedArgs, environment, "Expr", true, parentTokenInfo);
      fixedMatches[0].value.body.shift();
      let cases = fixedMatches.map((x22) => isBlock2(x22) ? x22.getBody() : [x22]);
      if (cases.length === 1 && cases[0].some(isComma2)) {
        cases = Eval2.splitMatchCases(cases[0]);
      }
      cases = cases.map((entry) => {
        if (entry.length !== 1)
          return entry;
        const [head22] = entry;
        if (isObject2(head22) && head22.value && head22.value.else instanceof Expr2.ElseStatement) {
          return [head22.value.else];
        }
        return entry;
      });
      const found = await Eval2.resolveMatchBody(input2, cases, environment, parentTokenInfo);
      if (found) {
        subTree.push(...await Eval2.do(found, environment, "It", true, parentTokenInfo));
      }
      if (!found && value.else instanceof Expr2.Statement) {
        subTree.push(...await Eval2.do(value.else.getBody(), environment, "Else", true, parentTokenInfo));
      }
      isDone22 = true;
    }
    if (value.try instanceof Expr2.TryStatement || value.rescue instanceof Expr2.RescueStatement) {
      const body = (value.try || value.rescue).getBody();
      while (!isDone22) {
        let result;
        let failure;
        try {
          result = await Eval2.do(body, environment, "Try", true, parentTokenInfo);
        } catch (e22) {
          if (!value.rescue)
            throw e22;
          failure = e22;
        }
        if (value.check instanceof Expr2.CheckStatement) {
          const [retval] = await Eval2.do(value.check.getBody(), environment, "Check", true, parentTokenInfo);
          if (retval && retval.value === true)
            isDone22 = true;
        }
        if (!isDone22 && value.rescue instanceof Expr2.RescueStatement) {
          let scope = environment;
          let retry;
          if (failure && value.try) {
            const subBody = value.rescue.getBody();
            for (let i22 = 0, c22 = subBody.length;!isDone22 && i22 < c22; i22++) {
              let fixedBody = isBlock2(subBody[i22]) ? subBody[i22].getBody() : [subBody[i22]];
              let newBody = [];
              let head22 = [];
              if (fixedBody[0].isCallable) {
                if (fixedBody[0].hasArgs) {
                  if (fixedBody[0].getArgs().length > 1) {
                    check3(fixedBody[0].getArg(1), "block");
                  }
                  scope = new Env2(environment);
                  scope.def(fixedBody[0].getArg(0).value, Expr2.value(failure.toString()));
                }
                fixedBody = fixedBody[0].getBody();
              }
              if (isBlock2(fixedBody[0]) && fixedBody[0].hasArgs) {
                head22 = fixedBody[0].getArgs(0);
                newBody = fixedBody.slice(1);
                if (!fixedBody[0].getArg(0).isExpression) {
                  newBody = newBody[0].getArgs();
                }
              }
              const [retval] = await Eval2.do(head22, environment, "Expr", true, parentTokenInfo);
              if (retval && retval.value === true) {
                subTree.push(...await Eval2.do(newBody, environment, "Rescue", true, parentTokenInfo));
                retry = true;
              }
              if (!isDone22 && !isBlock2(fixedBody[0])) {
                subTree.push(...await Eval2.do(fixedBody, environment, "Rescue", true, parentTokenInfo));
                isDone22 = true;
              }
            }
          }
          if (!retry)
            isDone22 = true;
          if (!failure && result) {
            subTree.push(...result);
            isDone22 = true;
          }
        }
      }
      isDone22 = true;
    }
    if (value.while instanceof Expr2.WhileStatement) {
      const body = value.while.getBody();
      const head22 = body[0].getBody().shift();
      let enabled = true;
      if (value.do instanceof Expr2.DoStatement) {
        do {
          subTree.push(...await Eval2.do(value.do.getBody(), environment, "It", true, parentTokenInfo));
          if ((await Eval2.do([head22], environment, "Do", true, parentTokenInfo))[0].value !== true)
            break;
        } while (enabled);
        enabled = false;
      }
      while (enabled) {
        if ((await Eval2.do([head22], environment, "While", true, parentTokenInfo))[0].value !== true)
          break;
        subTree.push(...await Eval2.do(body, environment, "It", true, parentTokenInfo));
      }
      isDone22 = true;
    }
    if (value.import instanceof Expr2.ImportStatement) {
      if (!(value.from instanceof Expr2.FromStatement)) {
        raise2(`Missing \`@from\` for \`${token}\``);
      }
      only2(value.from, isString2);
      await Promise.all(Expr2.each(value.import.getBody(), (ctx, name, alias) => {
        return Env2.load(ctx, name, alias, value.from.head().valueOf(), environment);
      }));
      const templateSpec = Eval2.templateImportSpec(value.template);
      if (templateSpec.hasTemplateImport) {
        const sourceName = value.from.head().valueOf();
        const source = await Env2.resolve(sourceName, "@template", null, environment);
        if (!(source instanceof Env2)) {
          raise2(`Cannot import templates from \`${sourceName}\``, parentTokenInfo);
        }
        const exported = source.exportedTemplates || {};
        const names2 = templateSpec.includeAll ? Object.keys(exported) : templateSpec.names;
        names2.forEach((requestedName) => {
          const exportedName = exported[requestedName];
          if (!templateSpec.includeAll && !exportedName) {
            raise2(`Template \`${requestedName}\` not exported`, parentTokenInfo);
          }
          const realName = exportedName || requestedName;
          const definition = Eval2.resolveTemplateByName(source.templates, realName);
          if (!definition) {
            raise2(`Missing template \`${realName}\` in \`${sourceName}\``, parentTokenInfo);
          }
          Eval2.registerTemplateByName(environment.templates, realName, definition);
        });
      }
      isDone22 = true;
    }
    if (value.module instanceof Expr2.ModuleStatement || value.export instanceof Expr2.ExportStatement) {
      if (value.module) {
        if (environment.descriptor) {
          raise2(`Module name \`${environment.descriptor}\` is already set`);
        }
        only2(value.module, isString2);
        environment.descriptor = value.module.head().valueOf();
      }
      if (value.export) {
        if (environment.exported === true) {
          environment.exported = {};
        }
        Expr2.each(value.export.getBody(), (ctx, name, alias) => {
          if (environment.exported[alias || name]) {
            raise2(`Export for \`${alias || name}\` already exists`);
          }
          environment.exported[alias || name] = name;
        });
        if (value.template instanceof Expr2.TemplateStatement) {
          const names2 = value.template.getBody().map(Eval2.templateNameFromEntry).filter(Boolean);
          names2.forEach((name) => {
            if (environment.exportedTemplates[name]) {
              raise2(`Template export for \`${name}\` already exists`);
            }
            if (!Eval2.resolveTemplateByName(environment.templates, name)) {
              raise2(`Missing template \`${name}\``, parentTokenInfo);
            }
            environment.exportedTemplates[name] = name;
          });
        }
      }
      isDone22 = true;
    }
    if (!isDone22 && (value.do instanceof Expr2.DoStatement || value.from instanceof Expr2.FromStatement || value.else instanceof Expr2.ElseStatement || value.check instanceof Expr2.CheckStatement || value.rescue instanceof Expr2.RescueStatement))
      check3(token);
    if (!subTree.length && !isDone22) {
      if (["Set", "Call", "Match"].includes(descriptor)) {
        const keys22 = Object.keys(value);
        for (let i22 = 0, c22 = keys22.length;i22 < c22; i22++) {
          const subBody = value[keys22[i22]].getBody();
          const fixedBody = await Eval2.do(subBody, environment, "Prop", true, parentTokenInfo);
          value[keys22[i22]] = Expr2.stmt(fixedBody, parentTokenInfo);
        }
      }
      return [Expr2.map(value, token.tokenInfo)];
    }
    return subTree;
  }
  static async run(tokens, environment, descriptor, noInheritance, parentTokenInfo) {
    if (Eval2.detail)
      Eval2.detail.depth++;
    try {
      if (!Array.isArray(tokens)) {
        raise2(`Given \`${JSON.stringify(tokens)}\` as input!`);
      }
      const vm = new Eval2(tokens, environment, noInheritance);
      const result = await vm.run(descriptor, parentTokenInfo);
      return result;
    } finally {
      if (Eval2.detail)
        Eval2.detail.depth--;
    }
  }
  static do(params, ...args) {
    if (Array.isArray(params)) {
      return !(params.length === 1 && isNumber2(params[0])) ? Eval2.run(params, ...args) : params;
    }
    return Object.keys(params).reduce((prev, cur) => prev.then((target) => {
      return Eval2.run(params[cur], ...args).then((result) => {
        target[cur] = result;
        return target;
      });
    }), Promise.resolve({}));
  }
}
function ensureBuiltins2() {
  if (builtinsReady2)
    return;
  builtinsReady2 = true;
  const mappings = ensureDefaultMappings2();
  Expr2.Unit.to = Parser2.sub("(a b) -> a.to(b)");
  Object.keys(mappings).forEach((kind) => {
    Expr2.Unit[kind] = Parser2.sub(`:${mappings[kind]}`);
  });
}
async function evaluate2(tokens, environment, enabledDetail) {
  ensureBuiltins2();
  const info = Eval2.info({
    enabled: enabledDetail,
    depth: 0,
    calls: []
  });
  let result;
  let error;
  try {
    result = await Eval2.run(tokens, environment, "Eval", !!environment);
  } catch (e22) {
    if (!environment)
      throw e22;
    error = e22;
  }
  return { result, error, info };
}
async function execute2(code, environment, enabledDetail) {
  ensureBuiltins2();
  let failure = null;
  let value = null;
  let info = {};
  try {
    const res = await evaluate2(Parser2.getAST(code, "parse", environment), environment, enabledDetail);
    failure = res.error;
    value = res.result;
    info = res.info;
  } catch (e22) {
    failure = failure || e22;
  }
  execute2.failure = failure;
  execute2.value = value;
  execute2.info = info;
  if (failure && !environment) {
    throw failure;
  }
  return value;
}
function applyAdapter3(runtime, adapter, options = {}) {
  if (!adapter)
    return;
  if (typeof adapter.setup === "function") {
    adapter.setup(runtime, options);
  }
}
function createEnv3(runtime, adapter, options = {}) {
  applyAdapter3(runtime, adapter, options);
  return new runtime.Env(options.parent);
}
function escapeClassName2(value) {
  return String(value).replace(/\//g, "\\/");
}
function makeRule2(className, declaration) {
  return `.${escapeClassName2(className)}{${declaration}}`;
}
function resolveSpaceDeclaration2(kind, axis, value) {
  if (!Object.prototype.hasOwnProperty.call(SPACE_SCALE2, value))
    return null;
  const cssValue = SPACE_SCALE2[value];
  const longhand = kind === "p" ? ["padding"] : kind === "m" ? ["margin"] : ["gap"];
  if (kind === "gap") {
    if (!axis)
      return `gap:${cssValue}`;
    if (axis === "x")
      return `column-gap:${cssValue}`;
    if (axis === "y")
      return `row-gap:${cssValue}`;
    return null;
  }
  if (!axis)
    return `${longhand[0]}:${cssValue}`;
  const map22 = {
    x: [`${longhand[0]}-left`, `${longhand[0]}-right`],
    y: [`${longhand[0]}-top`, `${longhand[0]}-bottom`],
    t: [`${longhand[0]}-top`],
    r: [`${longhand[0]}-right`],
    b: [`${longhand[0]}-bottom`],
    l: [`${longhand[0]}-left`]
  };
  if (!map22[axis])
    return null;
  return map22[axis].map((prop2) => `${prop2}:${cssValue}`).join(";");
}
function resolveColorDeclaration2(kind, colorName) {
  if (!Object.prototype.hasOwnProperty.call(COLORS2, colorName))
    return null;
  const value = COLORS2[colorName];
  if (kind === "text")
    return `color:${value}`;
  if (kind === "bg")
    return `background-color:${value}`;
  if (kind === "border")
    return `border-color:${value}`;
  return null;
}
function atomicRule2(className) {
  if (Object.prototype.hasOwnProperty.call(STATIC_RULES2, className)) {
    return makeRule2(className, STATIC_RULES2[className]);
  }
  const opacity = /^opacity-(0|50|100)$/.exec(className);
  if (opacity)
    return makeRule2(className, `opacity:${OPACITY_SCALE2[opacity[1]]}`);
  const spacing = /^(p|m|gap)(x|y|t|r|b|l)?-(.+)$/.exec(className);
  if (spacing) {
    const declaration = resolveSpaceDeclaration2(spacing[1], spacing[2], spacing[3]);
    if (declaration)
      return makeRule2(className, declaration);
  }
  const color = /^(text|bg|border)-(.+)$/.exec(className);
  if (color) {
    const declaration = resolveColorDeclaration2(color[1], color[2]);
    if (declaration)
      return makeRule2(className, declaration);
  }
  return null;
}
function generateAtomicCss2(classSet) {
  if (!classSet || !classSet.size)
    return "";
  const css = [];
  classSet.forEach((className) => {
    const rule = atomicRule2(className);
    if (rule)
      css.push(rule);
  });
  return css.join(`
`);
}
function splitStatements2(tokens) {
  const out = [];
  let current22 = [];
  tokens.forEach((token) => {
    if (token.type === EOL2) {
      if (current22.length)
        out.push(current22);
      current22 = [];
      return;
    }
    current22.push(token);
  });
  if (current22.length)
    out.push(current22);
  return out;
}
function preserveMarkdownLine2(line) {
  return String(line || "").replace(/\s+$/, "");
}
function normalizeProseBlock2(lines) {
  const out = [];
  lines.forEach((line) => {
    const isEmpty = !line.trim().length;
    const prev = out[out.length - 1];
    const prevIsEmpty = typeof prev === "string" && !prev.trim().length;
    if (isEmpty && (!out.length || prevIsEmpty))
      return;
    out.push(line);
  });
  while (out.length && !out[0].trim().length)
    out.shift();
  while (out.length && !out[out.length - 1].trim().length)
    out.pop();
  return out;
}
function normalizeDirectiveArgs2(body) {
  if (!Array.isArray(body))
    return [];
  const flat = body.length === 1 && body[0] && body[0].type === BLOCK2 && body[0].hasBody ? body[0].getBody() : body;
  return flat.filter((token) => token && token.type !== COMMA2);
}
function collectProseComments2(source, statementCount) {
  const sourceLines = String(source || "").split(`
`);
  const raw = Parser2.getAST(source, null);
  const commentsByStatement = Array.from({ length: statementCount }, () => []);
  const ranges = [];
  let currentStart = null;
  let currentEnd = null;
  raw.forEach((token) => {
    if (token.type === EOF2)
      return;
    if (token.type === EOL2) {
      if (currentStart !== null) {
        const line2 = Number.isFinite(token.line) ? token.line : currentEnd;
        ranges.push({ start: currentStart, end: line2 });
        currentStart = null;
        currentEnd = null;
      }
      return;
    }
    if (token.type === TEXT2 || token.type === COMMENT2 || token.type === COMMENT_MULTI2)
      return;
    const line = Number.isFinite(token.line) ? token.line : null;
    if (line === null)
      return;
    if (currentStart === null) {
      currentStart = line;
      currentEnd = line;
      return;
    }
    currentEnd = Math.max(currentEnd, line);
  });
  if (currentStart !== null) {
    ranges.push({ start: currentStart, end: currentEnd });
  }
  let cursor = 0;
  ranges.slice(0, statementCount).forEach((range, index) => {
    const prose = sourceLines.slice(cursor, range.start).map(preserveMarkdownLine2);
    commentsByStatement[index] = normalizeProseBlock2(prose);
    cursor = range.end + 1;
  });
  return commentsByStatement;
}
function splitByEol2(tokens) {
  const out = [];
  let current22 = [];
  (tokens || []).forEach((token) => {
    if (token.type === EOL2) {
      if (current22.length)
        out.push(current22);
      current22 = [];
      return;
    }
    current22.push(token);
  });
  if (current22.length)
    out.push(current22);
  return out;
}
function getRuntimeSiblingPath2(runtimePath, moduleName) {
  if (runtimePath.endsWith("/runtime")) {
    return `${runtimePath.slice(0, -"/runtime".length) || "."}/${moduleName}`.replace("//", "/");
  }
  if (runtimePath.endsWith("/runtime/index.js")) {
    return `${runtimePath.slice(0, -"/runtime/index.js".length) || "."}/${moduleName}`.replace("//", "/");
  }
  if (runtimePath === "./runtime")
    return `./${moduleName}`;
  if (runtimePath === "10x/runtime")
    return `10x/${moduleName}`;
  return `./${moduleName}`;
}
function getPreludePath2(runtimePath) {
  return getRuntimeSiblingPath2(runtimePath, "prelude");
}
function getCoreRuntimePath2(runtimePath) {
  if (runtimePath.startsWith("./") || runtimePath.startsWith("../"))
    return runtimePath;
  if (runtimePath.endsWith("/runtime"))
    return `${runtimePath}/core`;
  if (runtimePath.endsWith("/runtime/index.js"))
    return `${runtimePath.slice(0, -"/index.js".length)}/core.js`;
  return runtimePath;
}
function toTokenLike2(node) {
  if (!node)
    return node;
  if (node.type)
    return node;
  if (typeof node === "string") {
    if (/^-?\d+(\.\d+)?$/.test(node))
      return { isNumber: true, value: node };
    return { isLiteral: true, value: node };
  }
  if (typeof node === "number") {
    return { isNumber: true, value: String(node) };
  }
  if (typeof node === "object" && Object.prototype.hasOwnProperty.call(node, "value")) {
    return toTokenLike2(node.value);
  }
  return node;
}
function splitArgGroups2(args) {
  const groups = [];
  let current22 = [];
  (args || []).forEach((token) => {
    if (token.type === COMMA2) {
      if (current22.length)
        groups.push(current22);
      current22 = [];
      return;
    }
    current22.push(token);
  });
  if (current22.length)
    groups.push(current22);
  return groups;
}
function unwrapSingleBodyBlock2(token) {
  let current22 = token;
  while (current22 && current22.type === BLOCK2 && current22.hasBody && !current22.hasArgs && current22.getBody().length === 1) {
    [current22] = current22.getBody();
  }
  return current22;
}
function extractPostUpdatePartsFromArgs2(args, ctx) {
  if (!Array.isArray(args))
    return null;
  if (args.length !== 2)
    return null;
  const [targetToken, updateToken] = args;
  if (!(targetToken && targetToken.isLiteral && typeof targetToken.value === "string"))
    return null;
  const target = String(targetToken.value);
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(target))
    return null;
  if (!(updateToken && updateToken.isObject && updateToken.value && updateToken.value.let && updateToken.value.let.hasBody))
    return null;
  const [entryRaw] = updateToken.value.let.getBody();
  const entry = unwrapSingleBodyBlock2(entryRaw);
  if (!(entry && entry.isCallable && entry.getName && entry.getName() === target && entry.hasBody))
    return null;
  const rhs = compileExpression2(entry.getBody(), { ...ctx, autoPrintExpressions: false, exportDefinitions: false });
  return { target, rhs };
}
function isQuestionToken2(token) {
  return !!token && (token.type === SOME2 || token.isLiteral && token.value === "?");
}
function isPipeChoiceToken2(token) {
  return !!token && (token.type === OR2 || token.isLiteral && token.value === "|");
}
function collectImportSpecs2(statements, runtimePath) {
  const imports = [];
  const globals = [];
  const seenImport = new Set;
  const seenGlobal = new Set;
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token.isObject || !token.value || !token.value.import)
      return;
    const fromBody = token.value.from && token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === "string" ? fromBody[0].value : null;
    const importToken = token.value.import;
    const importBodyRaw = importToken && importToken.getBody ? importToken.getBody() : [];
    const importBody = importBodyRaw.length === 1 && importBodyRaw[0] && importBodyRaw[0].type === BLOCK2 && importBodyRaw[0].hasBody ? importBodyRaw[0].getBody() : importBodyRaw;
    const specifiers = (importBody.length ? importBody.filter((x22) => x22 && x22.type !== COMMA2).map((x22) => x22.value) : [importToken && importToken.value]).filter(Boolean);
    if (!specifiers.length)
      return;
    if (source === "Prelude" || source === "IO" || source === "Proc" || source === "Array" && specifiers.includes("concat")) {
      const modulePath = source === "Prelude" ? getPreludePath2(runtimePath) : source === "IO" ? getRuntimeSiblingPath2(runtimePath, "io") : source === "Proc" ? getRuntimeSiblingPath2(runtimePath, "proc") : getPreludePath2(runtimePath);
      const preludeSpecifiers = source === "Prelude" ? specifiers : source === "IO" || source === "Proc" ? specifiers : specifiers.filter((x22) => x22 === "concat");
      const key = `${modulePath}::${specifiers.join(",")}`;
      if (!seenImport.has(key)) {
        imports.push({ source: modulePath, specifiers: preludeSpecifiers });
        seenImport.add(key);
      }
      if (source === "Array") {
        const remaining = specifiers.filter((x22) => x22 !== "concat");
        if (!remaining.length)
          return;
        const gKey = `${source}::${remaining.join(",")}`;
        if (!seenGlobal.has(gKey)) {
          globals.push({ source, specifiers: remaining });
          seenGlobal.add(gKey);
        }
        return;
      }
      return;
    }
    if (source && /^[A-Z][A-Za-z0-9_]*$/.test(source)) {
      const key = `${source}::${specifiers.join(",")}`;
      if (!seenGlobal.has(key)) {
        globals.push({ source, specifiers });
        seenGlobal.add(key);
      }
    }
  });
  return { imports, globals };
}
function collectNeedsDom2(statements) {
  return statements.some((tokens) => {
    if (tokens.length !== 1)
      return false;
    const [token] = tokens;
    if (!token.isObject || !token.value)
      return false;
    return !!(token.value.render || token.value.on || token.value.shadow || token.value.style);
  });
}
function collectPrintStatements2(source) {
  const raw = Parser2.getAST(source, null);
  const printIdx = new Set;
  let idx = 0;
  let seenCode = false;
  let seenPrint = false;
  raw.forEach((token) => {
    if (token.type === EOF2)
      return;
    if (token.type === EOL2) {
      if (seenCode) {
        if (seenPrint)
          printIdx.add(idx);
        idx++;
      }
      seenCode = false;
      seenPrint = false;
      return;
    }
    if (token.type === TEXT2 || token.type === COMMENT2 || token.type === COMMENT_MULTI2)
      return;
    seenCode = true;
    if (token.type === NOT2)
      seenPrint = true;
  });
  return printIdx;
}
function quote22(value) {
  return JSON.stringify(String(value));
}
function indentMultiline2(value, indent) {
  return String(value).split(`
`).map((line) => `${indent}${line}`).join(`
`);
}
function formatFirstInline2(value, indent) {
  const lines = String(value).split(`
`);
  if (lines.length === 1)
    return lines[0];
  return `${lines[0]}
${lines.slice(1).map((line) => `${indent}${line}`).join(`
`)}`;
}
function compileTag2(node, depth = 0) {
  const attrEntries = Object.entries(node.attrs || {});
  const attrsStr = attrEntries.length === 0 ? "null" : "{ " + attrEntries.map(([k22, v22]) => {
    if (v22 === true)
      return `${JSON.stringify(k22)}: true`;
    if (v22 && typeof v22 === "object" && typeof v22.expr === "string") {
      const passSignal = /^(d:|s:|class:|style:)/.test(k22) || k22 === "ref";
      return passSignal ? `${JSON.stringify(k22)}: ${v22.expr.trim()}` : `${JSON.stringify(k22)}: $.read(${v22.expr.trim()})`;
    }
    return `${JSON.stringify(k22)}: ${JSON.stringify(String(v22))}`;
  }).join(", ") + " }";
  const childrenParts = (node.children || []).map((child) => {
    if (typeof child === "string")
      return JSON.stringify(child);
    if (child && typeof child.expr === "string")
      return `$.read(${child.expr.trim()})`;
    return compileTag2(child, depth + 1);
  });
  if (!childrenParts.length) {
    return `$.h(${JSON.stringify(node.name)}, ${attrsStr})`;
  }
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const [firstRawChild, ...restRawChildren] = childrenParts;
  const firstChild = formatFirstInline2(firstRawChild, childIndent);
  const restChildren = restRawChildren.map((part) => indentMultiline2(part, childIndent));
  const rest = restChildren.length ? `,
${restChildren.join(`,
`)}` : "";
  return `$.h(${JSON.stringify(node.name)}, ${attrsStr}, ${firstChild}${rest})`;
}
function compileArgs2(args, ctx) {
  if (!Array.isArray(args) || !args.length)
    return "";
  const groups = splitArgGroups2(args);
  const hasObjectPair = groups.some((group) => group.length === 2 && (group[0].type === SYMBOL2 || group[0].isString));
  const isObjectArg = hasObjectPair && groups.every((group) => group.length === 2 && (group[0].type === SYMBOL2 || group[0].isString) || group.length === 1 && (group[0].isObject || group[0].isLiteral && typeof group[0].value === "object"));
  if (isObjectArg) {
    return `{ ${groups.map((group) => {
      if (group.length === 1)
        return `...${compileToken2(group[0], ctx)}`;
      const keyRaw = String(group[0].value || "").replace(/^:/, "");
      return `${JSON.stringify(keyRaw)}: ${compileToken2(group[1], ctx)}`;
    }).join(", ")} }`;
  }
  return groups.map((group) => {
    const post2 = extractPostUpdatePartsFromArgs2(group, ctx);
    if (post2) {
      return `(() => { const __prev = ${post2.target}; ${post2.target} = ${post2.rhs}; return __prev; })()`;
    }
    if (group.some((token) => token.type === EOL2)) {
      const nested = splitByEol2(group);
      const localCtx = { ...ctx, autoPrintExpressions: false, exportDefinitions: false };
      const head22 = nested.slice(0, -1).map((stmt) => compileStatement2(stmt, localCtx, -1));
      const tail22 = compileStatement2(nested[nested.length - 1], localCtx, -1).replace(/;\s*$/, "");
      return `(() => { ${head22.join(" ")} return ${tail22}; })()`;
    }
    const hasOperator = group.some((token) => OPERATOR2.get(token.type));
    const hasCall = group.some((token) => token.type === BLOCK2 && token.hasArgs);
    if (!hasOperator && !hasCall && group.length > 1) {
      return `[${group.map((token) => compileToken2(token, ctx)).join(", ")}]`;
    }
    return compileExpression2(group, ctx);
  }).join(", ");
}
function compileLambda2(token, ctx) {
  const args = token.hasArgs ? token.getArgs().map((arg) => compileToken2(arg, ctx)).join(", ") : "";
  const body = token.hasBody ? compileExpression2(token.getBody(), ctx) : "undefined";
  return `(${args}) => (${body})`;
}
function compileToken2(token, ctx = { signalVars: new Set }) {
  if (token && token.isObject) {
    const value = token.value || {};
    const keys22 = Object.keys(value);
    const directiveKeys = [
      "render",
      "on",
      "html",
      "signal",
      "computed",
      "prop",
      "if",
      "else",
      "do",
      "let",
      "match",
      "while",
      "loop",
      "try",
      "rescue",
      "export",
      "import",
      "from",
      "style"
    ];
    const isDirective22 = keys22.some((k22) => directiveKeys.includes(k22));
    if (isDirective22)
      return compileDirectiveObject2(token, ctx);
    const pairs22 = keys22.map((key) => {
      const body = value[key] && value[key].getBody ? value[key].getBody() : [];
      const rhs = body.length ? compileExpression2(body, ctx) : "undefined";
      return `${JSON.stringify(key)}: ${rhs}`;
    });
    return `{ ${pairs22.join(", ")} }`;
  }
  if (token.isTag) {
    return compileTag2(token.value);
  }
  if (token.isCallable && !token.getName()) {
    return compileLambda2(token, ctx);
  }
  if (token.isNumber) {
    return token.value;
  }
  if (token.isString) {
    if (Array.isArray(token.value)) {
      return compileExpression2(token.value, ctx);
    }
    return quote22(token.value);
  }
  if (token.type === BLOCK2 && token.hasArgs && !token.hasBody) {
    const groups = splitArgGroups2(token.getArgs());
    const objectLike = groups.length && groups.every((group) => group.length === 2 && (group[0].type === SYMBOL2 || group[0].isString));
    if (objectLike) {
      const pairs22 = groups.map((group) => {
        const keyRaw = String(group[0].value || "").replace(/^:/, "");
        return `${JSON.stringify(keyRaw)}: ${compileToken2(group[1], ctx)}`;
      });
      return `{ ${pairs22.join(", ")} }`;
    }
    return `(${compileArgs2(token.getArgs(), ctx)})`;
  }
  if (token.type === BLOCK2 && token.hasBody && !token.isCallable) {
    const body = token.getBody();
    const keyValuePair = body.length === 2 && (body[0].type === SYMBOL2 || body[0].isString) && (body[1].type === SYMBOL2 || body[1].isString || body[1].isLiteral);
    if (keyValuePair) {
      const keyRaw = String(body[0].value || "").replace(/^:/, "");
      return `{ ${JSON.stringify(keyRaw)}: ${compileToken2(body[1], ctx)} }`;
    }
    return `(${compileExpression2(body, ctx)})`;
  }
  if (token.type === SYMBOL2) {
    const value = String(token.value || "").replace(/^:/, "");
    return quote22(value);
  }
  if (token.type === RANGE2) {
    if (Array.isArray(token.value)) {
      const items22 = token.value.map(toTokenLike2).filter((x22) => {
        if (!x22)
          return false;
        if (x22.type === COMMA2)
          return false;
        return !(x22.isLiteral && x22.value === ",");
      });
      if (items22.some((x22) => x22.type === DOT2)) {
        return `(${compileExpression2(items22, ctx)})`;
      }
      return `[${items22.map((x22) => compileToken2(x22, ctx)).join(", ")}]`;
    }
    if (token.value && Array.isArray(token.value.begin)) {
      const begin = token.value.begin.map((x22) => compileToken2(x22, ctx)).join(", ");
      const end = Array.isArray(token.value.end) && token.value.end.length ? `, ${token.value.end.map((x22) => compileToken2(x22, ctx)).join(", ")}` : "";
      return `range(${begin}${end})`;
    }
  }
  if (token.isLiteral) {
    if (token.value === null)
      return "null";
    if (token.value === true)
      return "true";
    if (token.value === false)
      return "false";
    if (typeof token.value === "string") {
      if (token.value === "|")
        return "||";
      if (token.value === "?")
        return "?";
      if (ctx.signalVars.has(token.value))
        return `$.read(${token.value})`;
      return token.value;
    }
    if (token.value && typeof token.value === "object") {
      if (Object.prototype.hasOwnProperty.call(token.value, "value")) {
        return compileToken2(token.value, ctx);
      }
      if (Array.isArray(token.value.body)) {
        return compileExpression2(token.value.body, ctx);
      }
      if (Array.isArray(token.value.args)) {
        return `(${compileArgs2(token.value.args, ctx)})`;
      }
    }
    return JSON.stringify(token.value);
  }
  if (token.type === SOME2) {
    const target = compileToken2(token.value, ctx);
    return `(${target} != null)`;
  }
  if (token.type === EVERY2) {
    const target = compileToken2(token.value, ctx);
    return `${target}.every(Boolean)`;
  }
  if (token.type === NOT2 && token.value !== "!") {
    return "!";
  }
  if (token.type === LIKE2 && Array.isArray(token.value) && token.value.length >= 2) {
    const parts = token.value.map(toTokenLike2).filter(Boolean);
    const leftTokens = parts.length > 2 ? parts.slice(0, -1) : [parts[0]];
    const rightToken = parts.length > 2 ? parts[parts.length - 1] : parts[1];
    const left = leftTokens.length > 1 ? compileExpression2(leftTokens, ctx) : compileToken2(leftTokens[0], ctx);
    const right = compileToken2(rightToken, ctx);
    return `(String(${left}).includes(String(${right})))`;
  }
  if (token.type === BLOCK2 && token.hasBody && token.isCallable) {
    return compileLambda2(token, ctx);
  }
  const op = OPERATOR2.get(token.type);
  if (op) {
    if (Array.isArray(token.value)) {
      return token.value.map((x22) => compileToken2(x22, ctx)).join(` ${op} `);
    }
    return op;
  }
  throw new Error(`Unsupported token in compiler: ${String(token.type)}`);
}
function compileExpression2(tokens, ctx = { signalVars: new Set }) {
  const qIndex = tokens.findIndex(isQuestionToken2);
  if (qIndex > 0) {
    const elseIndex = tokens.findIndex((token, index) => index > qIndex && isPipeChoiceToken2(token));
    if (elseIndex > qIndex) {
      const cond = tokens.slice(0, qIndex);
      const thenBranch = tokens.slice(qIndex + 1, elseIndex);
      const elseBranch = tokens.slice(elseIndex + 1);
      return `((${compileExpression2(cond, ctx)}) ? (${compileExpression2(thenBranch, ctx)}) : (${compileExpression2(elseBranch, ctx)}))`;
    }
  }
  const out = [];
  for (let i22 = 0;i22 < tokens.length; i22++) {
    const token = tokens[i22];
    const next = tokens[i22 + 1];
    const prev = tokens[i22 - 1];
    if (token.type === PIPE2) {
      const left = out.pop();
      const rhs = tokens[i22 + 1];
      const rhsNext = tokens[i22 + 2];
      if (rhs && rhs.isLiteral && rhsNext && rhsNext.type === BLOCK2 && rhsNext.hasArgs) {
        const args = rhsNext.getArgs().filter((x22) => x22.type !== COMMA2).map((x22) => compileToken2(x22, ctx));
        out.push(`${compileToken2(rhs, ctx)}(${[left].concat(args).join(", ")})`);
        i22 += 2;
        continue;
      }
      if (rhs && rhs.isLiteral) {
        out.push(`${compileToken2(rhs, ctx)}(${left})`);
        i22 += 1;
        continue;
      }
    }
    if (token.type === BLOCK2 && token.hasArgs && !token.hasBody && prev && (prev.isLiteral || prev.isTag || prev.type === BLOCK2 && prev.hasArgs)) {
      if (prev.isString && prev.value === "" && out.length >= 2) {
        const indexExpr = compileArgs2(token.getArgs(), ctx);
        out.pop();
        out[out.length - 1] = `${out[out.length - 1]}[${indexExpr}]`;
        continue;
      }
      out[out.length - 1] = `${out[out.length - 1]}(${compileArgs2(token.getArgs(), ctx)})`;
      continue;
    }
    if (token.type === SYMBOL2 && token.value === ":" && next && next.type === BLOCK2 && next.hasArgs && out.length) {
      const key = compileArgs2(next.getArgs(), ctx);
      out[out.length - 1] = `${out[out.length - 1]}[${key}]`;
      i22 += 1;
      continue;
    }
    if (token.type === DOT2 && next && next.isLiteral) {
      out.push(".");
      continue;
    }
    out.push(compileToken2(token, ctx));
  }
  return out.join(" ").replace(/\s+\./g, ".").replace(/\.\s+/g, ".");
}
function compileHandler2(token, ctx) {
  const callable = (() => {
    if (token && token.isCallable && token.getName())
      return token;
    if (token && token.type === BLOCK2 && token.hasBody) {
      const [first] = token.getBody();
      if (first && first.isCallable && first.getName())
        return first;
    }
    return null;
  })();
  if (callable) {
    if (ctx.signalVars.has(callable.getName())) {
      return `() => { ${callable.getName()}.set(${compileExpression2(callable.getBody(), ctx)}); }`;
    }
    return `() => { ${compileDefinition2(callable, true, { ...ctx, exportDefinitions: false, autoPrintExpressions: false })} }`;
  }
  if (token && token.type === BLOCK2 && token.hasBody) {
    return `() => (${compileExpression2(token.getBody(), ctx)})`;
  }
  return `() => (${compileToken2(token, ctx)})`;
}
function compileSignalDirective2(body, ctx) {
  return `$.signal(${compileExpression2(body, ctx)})`;
}
function compileIfDirective2(value, ctx) {
  const branches = value.if && value.if.getBody ? value.if.getBody() : [];
  const elseBody = value.else && value.else.getBody ? value.else.getBody() : [];
  const branchExprs = branches.map((branch) => {
    const body = branch && branch.hasBody ? branch.getBody() : [];
    const [cond, ...rest] = body;
    return {
      cond: cond ? compileExpression2([cond], ctx) : "false",
      thenExpr: rest.length ? compileExpression2(rest, ctx) : "undefined"
    };
  });
  let out = elseBody.length ? compileExpression2(elseBody, ctx) : "undefined";
  for (let i22 = branchExprs.length - 1;i22 >= 0; i22--) {
    out = `((${branchExprs[i22].cond}) ? (${branchExprs[i22].thenExpr}) : (${out}))`;
  }
  return out;
}
function compileDoDirective2(body, ctx) {
  const [block] = body;
  const statements = block && block.hasBody ? splitByEol2(block.getBody()) : [];
  if (!statements.length)
    return "(() => undefined)()";
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const head22 = statements.slice(0, -1).map((stmt) => compileStatement2(stmt, localCtx, -1));
  const tail22 = compileStatement2(statements[statements.length - 1], localCtx, -1).replace(/;\s*$/, "");
  return `(() => { ${head22.join(" ")} return ${tail22}; })()`;
}
function compileLetDirective2(body, ctx) {
  const items22 = (body || []).flatMap((part) => part && part.hasBody ? part.getBody() : [part]).filter(Boolean);
  if (!items22.length)
    return "undefined";
  const mode = ctx.letMode || "declare";
  const assignOne = (entry) => {
    if (entry && entry.isCallable && entry.getName()) {
      const left = entry.getName();
      const rhs = compileExpression2(entry.getBody(), { ...ctx, exportDefinitions: false, autoPrintExpressions: false });
      if (mode === "assign")
        return `(${left} = ${rhs})`;
      return `let ${left} = ${rhs}`;
    }
    return compileToken2(entry, { ...ctx, autoPrintExpressions: false });
  };
  const exprs = items22.map(assignOne);
  if (mode === "assign") {
    return exprs[exprs.length - 1];
  }
  return exprs.join("; ");
}
function compileMatchDirective2(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  if (!tokens.length)
    return "undefined";
  const key = compileToken2(tokens[0], ctx);
  const pairs22 = [];
  let elseExpr = "undefined";
  for (let i22 = 1;i22 < tokens.length; i22++) {
    const token = tokens[i22];
    if (token.type === COMMA2)
      continue;
    if (token.isObject && token.value && token.value.else) {
      elseExpr = compileExpression2(token.value.else.getBody(), ctx);
      continue;
    }
    const next = tokens[i22 + 1];
    if (!next)
      break;
    pairs22.push({ when: compileToken2(token, ctx), thenExpr: compileToken2(next, ctx) });
    i22++;
  }
  let out = elseExpr;
  for (let i22 = pairs22.length - 1;i22 >= 0; i22--) {
    out = `(${key} === ${pairs22[i22].when} ? ${pairs22[i22].thenExpr} : ${out})`;
  }
  return out;
}
function compileWhileDirective2(body, ctx) {
  const tokens = (body || []).flatMap((part) => part && part.hasBody ? part.getBody() : [part]).filter(Boolean);
  const [cond, ...rest] = tokens;
  const condition = cond ? compileExpression2([cond], { ...ctx, letMode: "assign", autoPrintExpressions: false }) : "false";
  const innerParts = rest.map((token) => {
    if (token && token.isCallable && token.getName()) {
      return `${token.getName()} = ${compileExpression2(token.getBody(), { ...ctx, autoPrintExpressions: false })};`;
    }
    return `${compileToken2(token, { ...ctx, letMode: "assign", autoPrintExpressions: false })};`;
  });
  const tail22 = innerParts.length ? innerParts[innerParts.length - 1].replace(/;\s*$/, "") : "undefined";
  const bodyLines = innerParts.slice(0, -1).join(" ");
  return `(() => { let __whileResult; while (${condition}) { ${bodyLines} __whileResult = ${tail22}; } return __whileResult; })()`;
}
function compileLoopDirective2(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  const [iterableToken, fnToken] = tokens;
  const iterable = iterableToken && iterableToken.hasArgs ? compileArgs2(iterableToken.getArgs(), ctx) : compileToken2(iterableToken, ctx);
  if (!fnToken || !fnToken.isCallable)
    return `for (const _ of ${iterable}) {}`;
  const args = fnToken.hasArgs ? fnToken.getArgs().map((arg) => compileToken2(arg, ctx)).join(", ") : "_";
  const bodyExpr = fnToken.hasBody ? compileExpression2(fnToken.getBody(), { ...ctx, autoPrintExpressions: false }) : "undefined";
  return `for (const ${args} of ${iterable}) { ${bodyExpr}; }`;
}
function compileTryDirective2(value, ctx) {
  const tryBody = value.try && value.try.getBody ? value.try.getBody() : [];
  const rescueBody = value.rescue && value.rescue.getBody ? value.rescue.getBody() : [];
  const tryExpr = tryBody.length ? compileExpression2(tryBody, { ...ctx, autoPrintExpressions: false }) : "undefined";
  let rescueArg = "error";
  let rescueExpr = "undefined";
  if (rescueBody.length) {
    let [first] = rescueBody;
    if (first && first.type === BLOCK2 && first.hasBody && first.getBody().length === 1) {
      [first] = first.getBody();
    }
    if (first && first.isCallable) {
      rescueArg = first.hasArgs && first.getArgs().length ? compileToken2(first.getArgs()[0], ctx) : rescueArg;
      rescueExpr = first.hasBody ? compileExpression2(first.getBody(), { ...ctx, autoPrintExpressions: false }) : rescueExpr;
    } else {
      rescueExpr = compileExpression2(rescueBody, { ...ctx, autoPrintExpressions: false });
    }
  }
  return `(() => { try { return ${tryExpr}; } catch (${rescueArg}) { return ${rescueExpr}; } })()`;
}
function compileExportDirective2(body, ctx) {
  const names2 = normalizeDirectiveArgs2(body).map((token) => compileToken2(token, ctx));
  return `export { ${names2.join(", ")} }`;
}
function compileHtmlDirective2(body, ctx) {
  const [template] = body;
  if (template && template.type === RANGE2 && Array.isArray(template.value)) {
    const items22 = template.value.filter((token) => token && token.type !== COMMA2).map((token) => compileToken2(token, ctx));
    return `$.html(() => [${items22.join(", ")}])`;
  }
  return `$.html(() => ${compileToken2(template, ctx)})`;
}
function compileComputedDirective2(body, ctx) {
  return `$.computed(() => ${compileExpression2(body, ctx)})`;
}
function compileStyleDirective2(body, ctx) {
  const [arg] = body;
  const hostArg = ctx.shadow ? "host, " : "";
  return `$.style(${hostArg}${compileToken2(arg, ctx)})`;
}
function compileHmrFooter2() {
  return [
    "if (import.meta.hot) {",
    "  const _hmrUrl = import.meta.url;",
    "  import.meta.hot.dispose(data => {",
    "    data.__signals = {};",
    "    for (const [k, s] of (globalThis.__10x_signals || new Map())) {",
    "      if (typeof k === 'string') data.__signals[k] = s.peek();",
    "    }",
    "  });",
    "  import.meta.hot.accept(newMod => {",
    "    const snap = import.meta.hot.data.__signals || {};",
    "    let _restoredCount = 0;",
    "    for (const [k, s] of (globalThis.__10x_signals || new Map())) {",
    "      if (typeof k === 'string' && snap[k] !== undefined) {",
    "        s.set(snap[k]);",
    "        _restoredCount++;",
    "      }",
    "    }",
    "    if (globalThis.__10x_devtools?.onHmr) {",
    "      globalThis.__10x_devtools.onHmr({ restored: _restoredCount, url: _hmrUrl });",
    "    }",
    "    const hosts = globalThis.__10x_components?.get(_hmrUrl);",
    "    if (hosts && newMod?.setup) {",
    "      hosts.forEach(host => {",
    '        if (host.shadowRoot) host.shadowRoot.innerHTML = "";',
    "        newMod.setup(host);",
    "      });",
    "    }",
    "  });",
    "}"
  ];
}
function compileRenderDirective2(body, value, ctx) {
  const htmlExpr = value.html instanceof Object ? compileHtmlDirective2(value.html.getBody(), ctx) : "undefined";
  if (value.shadow) {
    const hmrUrlArg = ctx.hmr ? ", import.meta.url" : "";
    return `$.renderShadow(host, ${htmlExpr}${hmrUrlArg})`;
  }
  const selector = body.length ? compileExpression2(body, ctx) : "undefined";
  return `$.render(${selector}, ${htmlExpr})`;
}
function compileOnDirective2(body, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs2(body);
  const eventName = compileToken2(eventToken, ctx);
  const selector = compileToken2(selectorToken, ctx);
  const handler = compileHandler2(handlerToken, ctx);
  const rootArg = ctx.shadow ? ", host.shadowRoot" : "";
  return `$.on(${eventName}, ${selector}, ${handler}${rootArg})`;
}
function compileOnPropDirective2(onBody, propBody, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs2(onBody);
  const eventName = compileToken2(eventToken, ctx);
  const selector = compileToken2(selectorToken, ctx);
  let signalName;
  if (handlerToken.type === BLOCK2 && handlerToken.hasBody) {
    const [first] = handlerToken.getBody();
    signalName = first && first.getName ? first.getName() : String(first && first.value);
  } else if (handlerToken.isCallable) {
    signalName = handlerToken.getName();
  } else {
    signalName = String(handlerToken.value);
  }
  const propArgs = propBody[0].getBody();
  const propName = compileToken2(propArgs[0], ctx);
  const fallback = compileToken2(propArgs[1], ctx);
  const rootArg = ctx.shadow ? ", host.shadowRoot" : "";
  return `$.on(${eventName}, ${selector}, () => { ${signalName}.set($.prop(host, ${propName}, ${fallback})); }${rootArg})`;
}
function compileDirectiveObject2(token, ctx) {
  const { value } = token;
  const keys22 = Object.keys(value || {});
  if (keys22.length > 1 && !value.try && !value.if && !value.match && (value.let || value.while || value.loop || value.do)) {
    const statements = [];
    let tail22 = "undefined";
    keys22.forEach((key, idx) => {
      if (key === "rescue" && value.try)
        return;
      const single = { [key]: value[key] };
      const out = compileDirectiveObject2({ value: single }, { ...ctx, autoPrintExpressions: false });
      if (!out)
        return;
      if (idx === keys22.length - 1) {
        tail22 = out.replace(/;\s*$/, "");
      } else {
        statements.push(`${out.replace(/;\s*$/, "")};`);
      }
    });
    return `(() => { ${statements.join(" ")} return ${tail22}; })()`;
  }
  if (value.render) {
    return compileRenderDirective2(value.render.getBody(), value, ctx);
  }
  if (value.on && value.prop) {
    return compileOnPropDirective2(value.on.getBody(), value.prop.getBody(), ctx);
  }
  if (value.on) {
    return compileOnDirective2(value.on.getBody(), ctx);
  }
  if (value.if) {
    return compileIfDirective2(value, ctx);
  }
  if (value.do) {
    return compileDoDirective2(value.do.getBody(), ctx);
  }
  if (value.let) {
    return compileLetDirective2(value.let.getBody(), ctx);
  }
  if (value.match) {
    return compileMatchDirective2(value.match.getBody(), ctx);
  }
  if (value.while) {
    return compileWhileDirective2(value.while.getBody(), ctx);
  }
  if (value.loop) {
    return compileLoopDirective2(value.loop.getBody(), ctx);
  }
  if (value.try) {
    return compileTryDirective2(value, ctx);
  }
  if (value.export) {
    return compileExportDirective2(value.export.getBody(), ctx);
  }
  if (value.else) {
    return compileExpression2(value.else.getBody(), ctx);
  }
  if (value.import) {
    return "";
  }
  if (value.html) {
    return compileHtmlDirective2(value.html.getBody(), ctx);
  }
  if (value.signal) {
    return compileSignalDirective2(value.signal.getBody(), ctx);
  }
  if (value.computed) {
    return compileComputedDirective2(value.computed.getBody(), ctx);
  }
  if (value.style) {
    return compileStyleDirective2(value.style.getBody(), ctx);
  }
  throw new Error(`Unsupported directive object: ${Object.keys(value).join(", ")}`);
}
function compileDefinition2(token, asStatement = false, ctx = { signalVars: new Set }) {
  const name = token.getName();
  const [head22] = token.getBody();
  const declConst = ctx.exportDefinitions ? "export const" : "const";
  const declLet = ctx.exportDefinitions ? "export let" : "let";
  if (!head22)
    return asStatement ? `${declConst} ${name} = undefined;` : `${declConst} ${name} = undefined`;
  if (head22.isCallable) {
    const args = head22.hasArgs ? head22.getArgs().map((arg) => compileToken2(arg, ctx)).join(", ") : "";
    const body = head22.hasBody ? compileExpression2(head22.getBody(), ctx) : "undefined";
    const out2 = `${declConst} ${name} = (${args}) => (${body})`;
    return asStatement ? `${out2};` : out2;
  }
  if (head22.isObject && head22.value && head22.value.signal) {
    if (head22.value.prop) {
      const propArgs = head22.value.prop.getBody()[0].getBody();
      const propName = compileToken2(propArgs[0], ctx);
      const fallback = compileToken2(propArgs[1], ctx);
      const out3 = `${declConst} ${name} = $.signal($.prop(host, ${propName}, ${fallback}), ${JSON.stringify(name)})`;
      return asStatement ? `${out3};` : out3;
    }
    const out2 = `${declConst} ${name} = $.signal(${compileExpression2(head22.value.signal.getBody(), ctx)}, ${JSON.stringify(name)})`;
    return asStatement ? `${out2};` : out2;
  }
  if (head22.isObject && head22.value && head22.value.computed) {
    const out2 = `${declConst} ${name} = $.computed(() => ${compileExpression2(head22.value.computed.getBody(), ctx)})`;
    return asStatement ? `${out2};` : out2;
  }
  const out = `${declLet} ${name} = ${compileExpression2(token.getBody(), ctx)}`;
  return asStatement ? `${out};` : out;
}
function compileStatement2(tokens, ctx, statementIndex) {
  if (!tokens.length)
    return "";
  const shouldPrint = ctx.printStatements && ctx.printStatements.has(statementIndex);
  const autoPrint = !!ctx.autoPrintExpressions;
  if (tokens.length === 1) {
    const [token] = tokens;
    if (token.isCallable && token.getName()) {
      return `${compileDefinition2(token, false, ctx)};`;
    }
    if (token.isObject) {
      const out3 = compileDirectiveObject2(token, ctx);
      if (!out3)
        return "";
      return `${out3};`;
    }
    const out2 = compileToken2(token, ctx);
    if (shouldPrint || autoPrint)
      return `console.log(${out2});`;
    return `${out2};`;
  }
  const hasOperator = tokens.some((token) => OPERATOR2.get(token.type));
  const looksLikeCall = tokens.length === 2 && tokens[0].isLiteral && tokens[1].type === BLOCK2 && tokens[1].hasArgs && !tokens[1].hasBody;
  if (!hasOperator && !looksLikeCall) {
    const exprs = tokens.map((token) => compileToken2(token, ctx)).join(", ");
    if (shouldPrint || autoPrint)
      return `console.log(${exprs});`;
    return `${exprs};`;
  }
  const out = compileExpression2(tokens, ctx);
  if (shouldPrint || autoPrint)
    return `console.log(${out});`;
  return `${out};`;
}
function collectShadowFlag2(statements) {
  return statements.some((tokens) => {
    if (tokens.length !== 1)
      return false;
    const [token] = tokens;
    return token.isObject && token.value && token.value.shadow;
  });
}
function collectSignalBindings2(statements) {
  const signalVars = new Set;
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token.isCallable || !token.getName())
      return;
    const [head22] = token.getBody();
    if (head22 && head22.isObject && head22.value && head22.value.signal) {
      signalVars.add(token.getName());
    }
  });
  return signalVars;
}
function collectAtomicClasses2(statements) {
  const classes = new Set;
  function pushClassAttr(value) {
    if (typeof value !== "string")
      return;
    value.split(/\s+/).filter(Boolean).forEach((name) => classes.add(name));
  }
  function walkTagNode(node) {
    if (!node || typeof node !== "object")
      return;
    pushClassAttr(node.attrs && node.attrs.class);
    (node.children || []).forEach((child) => {
      if (child && typeof child === "object" && !Array.isArray(child) && child.name) {
        walkTagNode(child);
      }
    });
  }
  function walkToken(token) {
    if (!token || typeof token !== "object")
      return;
    if (token.isTag && token.value) {
      walkTagNode(token.value);
    }
    if (token.value && Array.isArray(token.value.args) && typeof token.getArgs === "function") {
      token.getArgs().forEach(walkToken);
    }
    if (token.value && Array.isArray(token.value.body) && typeof token.getBody === "function") {
      token.getBody().forEach(walkToken);
    }
    if (token.isObject && token.value) {
      Object.values(token.value).forEach((value) => {
        if (value && value.getBody)
          value.getBody().forEach(walkToken);
      });
    }
    if (token.type === RANGE2 && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
    if (token.isString && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
  }
  statements.forEach((tokens) => tokens.forEach(walkToken));
  return classes;
}
function collectImportSources2(statements) {
  const sources = [];
  statements.forEach((tokens) => {
    if (tokens.length !== 1)
      return;
    const [token] = tokens;
    if (!token || !token.isObject || !token.value || !token.value.import || !token.value.from)
      return;
    const fromBody = token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === "string" ? fromBody[0].value : null;
    if (source)
      sources.push(source);
  });
  return sources;
}
function stripModuleExports2(line) {
  if (!line.startsWith("export "))
    return line;
  if (/^export\s+\{.*\}\s*;?$/.test(line))
    return "";
  return line.replace(/^export\s+/, "");
}
function splitImportsAndBody2(compiled) {
  const imports = [];
  const body = [];
  String(compiled || "").split(`
`).forEach((line) => {
    if (!line.trim())
      return;
    if (line.startsWith("// Generated by 10x compiler"))
      return;
    if (line.startsWith("import ")) {
      imports.push(line);
      return;
    }
    const normalized = stripModuleExports2(line);
    if (!normalized.trim())
      return;
    body.push(normalized);
  });
  return { imports, body };
}
function compile2(source, options = {}) {
  const normalized = String(source || "").replace(/\r\n/g, `
`);
  const ast = Parser2.getAST(normalized, "parse");
  const statements = splitStatements2(ast);
  const hasShadow = collectShadowFlag2(statements);
  const needsDom = collectNeedsDom2(statements);
  const hmrEnabled = options.hmr === true && options.module !== false;
  const runtimePath = options.runtimePath || "./runtime";
  const { imports, globals } = collectImportSpecs2(statements, runtimePath);
  const ctx = {
    signalVars: collectSignalBindings2(statements),
    shadow: hasShadow,
    hmr: hmrEnabled,
    exportDefinitions: options.module !== false && !hasShadow && options.exportAll !== false,
    printStatements: collectPrintStatements2(normalized),
    autoPrintExpressions: options.autoPrintExpressions !== false && options.module !== false && !hasShadow
  };
  const proseComments = collectProseComments2(normalized, statements.length);
  const lines = statements.reduce((prev, tokens, index) => {
    const compiled = compileStatement2(tokens, ctx, index);
    const comments = (proseComments[index] || []).map((line) => `// ${line}`);
    if (comments.length)
      prev.push(...comments);
    if (compiled)
      prev.push(compiled);
    return prev;
  }, []);
  const atomicCss = options.atomicCss === false ? "" : generateAtomicCss2(collectAtomicClasses2(statements));
  if (atomicCss) {
    const hostArg = hasShadow ? "host, " : "";
    lines.unshift(`$.style(${hostArg}${JSON.stringify(atomicCss)});`);
  }
  const requiresRuntime = lines.some((line) => line.includes("$."));
  const usesRange = lines.some((line) => line.includes("range("));
  const output = [];
  if (options.module !== false) {
    output.push("// Generated by 10x compiler (experimental AST backend)");
    if (usesRange && !imports.some((x22) => x22.source === getPreludePath2(runtimePath) && x22.specifiers.includes("range"))) {
      imports.push({ source: getPreludePath2(runtimePath), specifiers: ["range"] });
    }
    imports.forEach(({ source: importSource, specifiers }) => {
      output.push(`import { ${specifiers.join(", ")} } from ${JSON.stringify(importSource)};`);
    });
    globals.forEach(({ source: globalSource, specifiers }) => {
      output.push(`const { ${specifiers.join(", ")} } = ${globalSource};`);
    });
    if (requiresRuntime) {
      const importPath = needsDom ? runtimePath : getCoreRuntimePath2(runtimePath);
      output.push(`import * as $ from ${JSON.stringify(importPath)};`);
    }
  }
  if (hasShadow) {
    output.push("export function setup(host) {");
    output.push(...lines.map((l22) => "  " + l22));
    output.push("}");
  } else {
    output.push(...lines);
  }
  if (hmrEnabled)
    output.push(...compileHmrFooter2());
  return output.join(`
`);
}
function compileBundle2(entryPath, options = {}) {
  const readFile = options.readFile;
  const resolveModule = options.resolveModule;
  if (typeof readFile !== "function") {
    throw new Error("compileBundle requires options.readFile(path)");
  }
  if (typeof resolveModule !== "function") {
    throw new Error("compileBundle requires options.resolveModule(specifier, importerPath)");
  }
  const runtimePath = options.runtimePath || "./runtime";
  const shouldBundleImport = typeof options.shouldBundleImport === "function" ? options.shouldBundleImport : (specifier) => specifier.startsWith(".");
  const order = [];
  const seen = new Set;
  const active = new Set;
  const modules = new Map;
  function visit(modulePath) {
    if (seen.has(modulePath))
      return;
    if (active.has(modulePath)) {
      throw new Error(`Circular local import while bundling: ${modulePath}`);
    }
    active.add(modulePath);
    const source = String(readFile(modulePath) || "");
    const normalized = source.replace(/\r\n/g, `
`);
    const ast = Parser2.getAST(normalized, "parse");
    const statements = splitStatements2(ast);
    const deps = collectImportSources2(statements).filter((specifier) => shouldBundleImport(specifier, modulePath)).map((specifier) => resolveModule(specifier, modulePath));
    deps.forEach(visit);
    active.delete(modulePath);
    seen.add(modulePath);
    const compiled = compile2(normalized, {
      runtimePath,
      module: true,
      autoPrintExpressions: options.autoPrintExpressions
    });
    modules.set(modulePath, splitImportsAndBody2(compiled));
    order.push(modulePath);
  }
  visit(entryPath);
  const importSet = new Set;
  const body = ["// Generated by 10x compiler bundle (experimental resolver backend)"];
  order.forEach((modulePath) => {
    const chunk = modules.get(modulePath);
    if (!chunk)
      return;
    chunk.imports.forEach((line) => importSet.add(line));
  });
  if (importSet.size) {
    body.push(...Array.from(importSet));
    body.push("");
  }
  order.forEach((modulePath) => {
    const chunk = modules.get(modulePath);
    if (!chunk)
      return;
    body.push(`// Module: ${modulePath}`);
    body.push(...chunk.body);
    body.push("");
  });
  while (body.length && !body[body.length - 1].trim())
    body.pop();
  return body.join(`
`);
}

class SignalProxy2 {
  constructor(signal2) {
    this._signal = signal2;
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
  set(v22) {
    return this._signal.set(v22);
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
function setDevtoolsActive2(active) {
  devtoolsActive2 = active;
}
function isDevtoolsActive2() {
  return devtoolsActive2;
}
function nextSignalId2() {
  const current22 = Number(globalThis.__10x_signal_id_counter || 0) + 1;
  globalThis.__10x_signal_id_counter = current22;
  return current22;
}
function signal2(initialValue, name) {
  const key = name || Symbol("signal");
  const signalName = String(key);
  const signalId = nextSignalId2();
  const state = {
    [SIGNAL2]: true,
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
      if (currentEffect2) {
        this.subs.add(currentEffect2);
        if (currentEffect2._deps)
          currentEffect2._deps.add(this);
      }
      return this._value;
    },
    set(nextValue) {
      const prev = this._value;
      this._value = nextValue;
      if (devtoolsActive2 && this._history) {
        this._history.push({ value: nextValue, prev, ts: Date.now() });
        if (this._history.length > MAX_HISTORY3)
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
            history: Array.isArray(this._history) ? this._history.slice(-MAX_HISTORY3) : [],
            ts: Date.now()
          });
          if (globalThis.__10x_devtools_debug) {
            console.debug("[10x:core] notified devtools", {
              id: this._devtoolsId,
              name: this._devtoolsName,
              value: nextValue
            });
          }
        } catch (_22) {}
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
  globalRegistry2.set(key, state);
  return state;
}
function isSignal2(value) {
  return !!(value && value[SIGNAL2]);
}
function read2(value) {
  return isSignal2(value) ? value.get() : value;
}
function effect2(fn) {
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
    currentEffect2 = run;
    let result;
    try {
      result = fn();
    } catch (error) {
      currentEffect2 = null;
      throw error;
    }
    if (result && typeof result.then === "function") {
      return result.finally(() => {
        if (currentEffect2 === run)
          currentEffect2 = null;
      });
    }
    currentEffect2 = null;
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
function computed2(fn) {
  const out = signal2(undefined);
  effect2(() => out.set(fn()));
  return out;
}
function batch2(fn) {
  return fn();
}
function untracked2(fn) {
  const prev = currentEffect2;
  currentEffect2 = null;
  try {
    return fn();
  } finally {
    currentEffect2 = prev;
  }
}
function html2(renderFn) {
  if (typeof renderFn !== "function") {
    throw new Error("html(...) expects a function");
  }
  return {
    render: renderFn
  };
}
function prop2(host, name, fallback) {
  const raw = host.getAttribute(name);
  return raw !== null ? Number(raw) || raw : fallback;
}
function getSignalRegistry2() {
  return globalRegistry2;
}
function registerShadowHost2(host, moduleUrl) {
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
  let byModule = componentObservers2.get(host);
  if (!byModule) {
    byModule = new Map;
    componentObservers2.set(host, byModule);
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
    const currentByModule = componentObservers2.get(host);
    if (currentByModule) {
      const observer2 = currentByModule.get(moduleUrl);
      if (observer2)
        observer2.disconnect();
      currentByModule.delete(moduleUrl);
      if (!currentByModule.size)
        componentObservers2.delete(host);
    }
  };
  const observer = new MutationObserver(() => {
    if (!host.isConnected)
      cleanup();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  byModule.set(moduleUrl, observer);
}
function hashStr2(str) {
  let hash = 0;
  for (let i22 = 0;i22 < str.length; i22++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i22) | 0;
  }
  return Math.abs(hash).toString(36);
}
function dashCase2(input2) {
  return String(input2 || "").replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}
function objectToCss2(value, selector = ":host") {
  if (!value || typeof value !== "object")
    return "";
  const declarations = [];
  const nested = [];
  Object.entries(value).forEach(([key, entry]) => {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const nestedSelector = selector === ":host" ? key : `${selector} ${key}`;
      const nestedCss = objectToCss2(entry, nestedSelector);
      if (nestedCss)
        nested.push(nestedCss);
      return;
    }
    declarations.push(`  ${dashCase2(key)}: ${entry};`);
  });
  const block = declarations.length ? `${selector} {
${declarations.join(`
`)}
}` : "";
  return [block].concat(nested).filter(Boolean).join(`
`);
}
function style3(hostOrCss, css) {
  if (typeof document === "undefined")
    return;
  const hasHost = css !== undefined;
  const host = hasHost ? hostOrCss : null;
  const raw = hasHost ? css : hostOrCss;
  const cssText = typeof raw === "string" ? raw : objectToCss2(raw);
  if (!cssText || !cssText.trim())
    return;
  if (hasHost) {
    const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    const element2 = document.createElement("style");
    element2.textContent = cssText;
    shadow.insertBefore(element2, shadow.firstChild);
    return;
  }
  const id = `10x-${hashStr2(cssText)}`;
  if (document.getElementById(id))
    return;
  const element = document.createElement("style");
  element.id = id;
  element.textContent = cssText;
  document.head.appendChild(element);
}
function render22(selectorOrElement, view) {
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
    untracked2(() => he2(target, next));
    root = y2(next) ? target.firstChild : null;
    prev = next;
  };
  return effect2(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      target.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked2(() => he2(target, next));
      root = y2(next) ? target.firstChild : null;
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked2(() => ge2(root, prev, next)));
        root = node || root;
        prev = next;
      } catch (_22) {
        remount(next);
      }
    } else {
      remount(next);
    }
  });
}
function on2(eventName, selectorOrElement, handler, root) {
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
function renderShadow2(host, view, moduleUrl) {
  if (typeof document === "undefined") {
    return () => {};
  }
  if (!view || typeof view.render !== "function") {
    throw new Error("renderShadow(...) expects a view from html(...)");
  }
  const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
  registerShadowHost2(host, moduleUrl);
  const outlet = document.createElement("div");
  shadow.appendChild(outlet);
  let prev = null;
  let root = null;
  const remount = (next) => {
    outlet.innerHTML = "";
    untracked2(() => he2(outlet, next));
    root = y2(next) ? outlet.firstChild : null;
    prev = next;
  };
  return effect2(async () => {
    const next = await view.render();
    if (typeof next === "string") {
      outlet.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      untracked2(() => he2(outlet, next));
      root = y2(next) ? outlet.firstChild : null;
      prev = next;
    } else if (root) {
      try {
        const node = await Promise.resolve().then(() => untracked2(() => ge2(root, prev, next)));
        root = node || root;
        prev = next;
      } catch (_22) {
        remount(next);
      }
    } else {
      remount(next);
    }
  });
}
function getValueColor2(value) {
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
function formatValue2(value, container) {
  const str = JSON.stringify(value);
  container.textContent = str;
  container.style.color = getValueColor2(value);
}
function copyToClipboard2(text) {
  navigator.clipboard.writeText(text).then(() => {});
}
function renderGroupedRows2(container, groups, collapsedSignals, rerender) {
  container.innerHTML = "";
  groups.forEach((signals, moduleUrl) => {
    const groupHeader = document.createElement("div");
    groupHeader.style.cssText = "font-weight:600;margin:0.75rem 0 0.25rem;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;";
    groupHeader.textContent = moduleUrl === "global" ? "Global" : moduleUrl.split("/").pop() || moduleUrl;
    container.appendChild(groupHeader);
    signals.forEach(({ name, value, subsCount, history }) => {
      const isCollapsed = collapsedSignals.has(name);
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
      key.textContent = String(name);
      key.style.color = "#d2a8ff";
      const valueEl = document.createElement("code");
      formatValue2(value, valueEl);
      valueEl.style.cursor = "pointer";
      valueEl.title = "Click to copy";
      valueEl.onclick = (e22) => {
        e22.stopPropagation();
        copyToClipboard2(JSON.stringify(value));
      };
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
        [...history].reverse().forEach((h22, i22) => {
          const entry = document.createElement("div");
          entry.style.cssText = "display:flex;justify-content:space-between;gap:0.5rem;margin:0.15rem 0;";
          const ts = document.createElement("span");
          const date = new Date(h22.ts);
          ts.textContent = date.toLocaleTimeString();
          ts.style.color = "#666";
          const val = document.createElement("span");
          formatValue2(h22.value, val);
          val.style.fontWeight = i22 === 0 ? "600" : "400";
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
function renderRows2(container, registry, collapsedSignals) {
  const entries = Array.from(registry.entries());
  const moduleGroups = new Map;
  entries.forEach(([name, signal22]) => {
    const moduleUrl = signal22._moduleUrl || "global";
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push({
      id: signal22._devtoolsId || null,
      name,
      value: read2(signal22),
      subsCount: signal22.subs ? signal22.subs.size : 0,
      history: signal22._history || []
    });
  });
  renderGroupedRows2(container, moduleGroups, collapsedSignals, () => renderRows2(container, registry, collapsedSignals));
}
function renderRowsFromSnapshot2(container, snapshot, collapsedSignals) {
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
      history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY22) : []
    });
  });
  renderGroupedRows2(container, moduleGroups, collapsedSignals, () => renderRowsFromSnapshot2(container, snapshot, collapsedSignals));
}
function mergeSignalUpdate2(snapshot, update) {
  if (!update || typeof update.name !== "string")
    return snapshot;
  const current22 = Array.isArray(snapshot) ? snapshot : [];
  const next = current22.map((entry) => ({ ...entry }));
  const index = next.findIndex((entry) => entry && (update.id != null && entry.id === update.id || entry.name === update.name));
  const history = Array.isArray(update.history) ? update.history.slice(-MAX_HISTORY22) : [{ ts: update.ts || Date.now(), value: update.value }];
  const merged = {
    id: update.id || null,
    name: update.name,
    moduleUrl: update.moduleUrl || "global",
    value: update.value,
    subs: Number.isFinite(update.subs) ? update.subs : 0,
    history
  };
  if (index >= 0) {
    next[index] = merged;
  } else {
    next.push(merged);
  }
  return next;
}
function devtools3(options = {}) {
  if (typeof document === "undefined")
    return null;
  const { docked = false, container = null } = options;
  const dockedPane = docked && container ? container.closest(".devtools-pane") || container : null;
  const dockedLayout = dockedPane ? dockedPane.closest(".layout") : null;
  let panel = document.getElementById("10x-devtools-panel");
  if (panel)
    return panel;
  const registry = getSignalRegistry2();
  const collapsedSignals = new Set;
  let latestSnapshot = [];
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
  const hmrStatus = document.createElement("div");
  hmrStatus.id = "10x-hmr-status";
  hmrStatus.style.cssText = "font-size:11px;margin-bottom:0.5rem;padding:0.25rem 0.5rem;background:#238636;border-radius:4px;color:#fff;display:none;";
  const body = document.createElement("div");
  panel.appendChild(title);
  panel.appendChild(hmrStatus);
  panel.appendChild(body);
  if (docked && container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }
  setDevtoolsActive2(true);
  effect2(() => {
    renderRows2(body, registry, collapsedSignals);
  });
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
      renderRowsFromSnapshot2(body, latestSnapshot, collapsedSignals);
    },
    toggle
  };
  globalThis.__10x_devtools_notify = (update) => {
    if (globalThis.__10x_devtools_debug) {
      console.debug("[10x:devtools] notify update", update);
    }
    latestSnapshot = mergeSignalUpdate2(latestSnapshot, update);
    renderRowsFromSnapshot2(body, latestSnapshot, collapsedSignals);
  };
  document.addEventListener("keydown", (e22) => {
    const isAltD = e22.altKey && (e22.key === "d" || e22.key === "D");
    const isCtrlShiftD = e22.ctrlKey && e22.shiftKey && (e22.key === "d" || e22.key === "D");
    if (isAltD || isCtrlShiftD) {
      e22.preventDefault();
      toggle();
    }
  });
  return panel;
}
function devtoolsEnabledByQuery2(search) {
  const input2 = typeof search === "string" ? search : typeof window !== "undefined" && window.location ? window.location.search : "";
  if (!input2)
    return false;
  const params = new URLSearchParams(input2.startsWith("?") ? input2 : `?${input2}`);
  if (!params.has("devtools"))
    return false;
  const value = params.get("devtools");
  return value !== "0" && value !== "false" && value !== "off";
}
function maybeEnableDevtools2(options = {}) {
  if (typeof document === "undefined" || typeof window === "undefined")
    return null;
  if (!devtoolsEnabledByQuery2(window.location && window.location.search) && !options.force)
    return null;
  const start = () => {
    try {
      devtools3(options);
    } catch (_22) {}
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    return null;
  }
  return start();
}
function style22(open, close) {
  return (value) => `\x1B[${open}m${value}\x1B[${close}m`;
}
function print2(...args) {
  process.stdout.write(args.join(""));
}
function markers2(color, value) {
  return value.replace(/(?<![{#])\{(.+?)\}/g, (_22, v22) => color.gray(`{${v22}}`));
}
function colorize2(type, value, dimmed) {
  const color = dimmed ? ansi_default2.dim : ansi_default2;
  value = value || literal2({ type });
  if (type === EOF2)
    return "";
  switch (type) {
    case true:
    case COMMENT2:
    case COMMENT_MULTI2:
    case CLOSE2:
    case OPEN2:
    case BEGIN2:
    case DONE2:
      return color.gray(value);
    case null:
    case EOL2:
    case COMMA2:
    case RANGE2:
    case DOT2:
      return color.white(value);
    case CODE2:
      return color.cyanBright(value);
    case BOLD2:
      return color.redBright.bold(value);
    case ITALIC2:
      return color.yellowBright.italic(value);
    case REF2:
      value = ansi_default2.underline(value);
    case TEXT2:
      return color.white(value);
    case LESS2:
    case LESS_EQ2:
    case GREATER2:
    case GREATER_EQ2:
    case EXACT_EQ2:
    case NOT_EQ2:
    case EQUAL2:
    case MINUS2:
    case PLUS2:
    case MUL2:
    case DIV2:
    case MOD2:
    case NOT2:
    case SOME2:
    case EVERY2:
    case MOD2:
    case PIPE2:
    case BLOCK2:
    case MINUS2:
    case PLUS2:
    case LIKE2:
    case OR2:
    case OL_ITEM2:
    case UL_ITEM2:
    case HEADING2:
    case BLOCKQUOTE2:
      return color.magenta(value);
    case SYMBOL2:
      return color.yellow(value);
    case DIRECTIVE2:
      return color.magenta(value);
    case STRING2:
      value = markers2(color, value);
    case REGEX2:
      return color.blueBright(value);
    case LITERAL2:
      if (value === null)
        return color.yellow(":nil");
      if (value === true)
        return color.yellow(":on");
      if (value === false)
        return color.yellow(":off");
      return color.white(value);
    case NUMBER2:
      return color.blue(value);
    default:
      return color.bgRedBright(value);
  }
}
function summary2(e22, code, noInfo) {
  return debug2(e22, code, noInfo, (source) => {
    try {
      return Parser2.getAST(source, "split").map((chunk) => {
        const highlighted = !chunk.lines.includes(e22.line);
        return chunk.body.map((x22) => {
          return serialize2(x22, null, (k22, v22) => colorize2(k22, v22, highlighted));
        }).join("");
      }).join("");
    } catch (e3) {
      return ansi_default2.red(source);
    }
  }, colorize2).trim();
}
function inspect2(calls) {
  calls.forEach(([type, depth, tokens], key, items22) => {
    const nextItem = items22[key + 1];
    let prefix = "";
    let pivot = "";
    if (!nextItem || nextItem[1] !== depth) {
      pivot = key ? "└─" : "├──";
    } else {
      pivot = "├─";
    }
    if (depth > 1) {
      prefix += `│${Array.from({ length: depth }).join("  ")}${pivot} `;
    } else {
      prefix += `${pivot} `;
    }
    const value = serialize2(tokens, true, colorize2, type);
    const indent = `             ${type} `.substr(-15);
    print2(indent, prefix, value, `
`);
  });
}
async function format32(code, color, inline) {
  print2(serialize2.call({}, Parser2.getAST(code, inline ? "inline" : "raw"), null, color ? colorize2 : undefined), `
`);
}
async function main2(code, raw, env, info, noInfo, prelude) {
  try {
    if (!raw && typeof prelude === "function") {
      code = await prelude(env, code) || code;
    }
    const result = raw ? Parser2.getAST(code, "inline", env) : await execute2(code, env, info);
    if (execute2.failure) {
      throw execute2.failure;
    }
    print2("\r");
    if (info) {
      const { length } = execute2.info.calls;
      if (length < 100) {
        inspect2(execute2.info.calls);
      } else {
        inspect2([execute2.info.calls[0]]);
      }
      print2(`               ├ ${colorize2(true, `${length} step${length === 1 ? "" : "s"}`)} 
`);
      print2("               └ ", serialize2(result, null, colorize2), `
`);
    } else if (result) {
      print2(serialize2(result, null, colorize2), `
`);
    }
  } catch (e22) {
    print2(summary2(e22, code, noInfo), `
`);
  }
}
function applyAdapter22(adapter, options) {
  applyAdapter3({
    Env: Env2,
    Expr: Expr2,
    execute: execute2,
    evaluate: evaluate2
  }, adapter, options);
}
function createEnv22(adapter, options) {
  return createEnv3({
    Env: Env2,
    Expr: Expr2,
    execute: execute2,
    evaluate: evaluate2
  }, adapter, options);
}
var __defProp2, __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
}, angle2, angle_default2, apparentPower2, apparentPower_default2, metric13, imperial11, area_default2, current2, current_default2, bits2, bytes2, digital_default2, metric22, each_default2, energy2, energy_default2, frequency2, frequency_default2, metric32, imperial22, illuminance_default2, metric42, imperial32, length_default2, metric52, imperial42, mass_default2, metric62, imperial52, pace_default2, metric72, partsPer_default2, power2, power_default2, metric82, imperial62, pressure_default2, reactiveEnergy2, reactiveEnergy_default2, reactivePower2, reactivePower_default2, metric92, imperial72, speed_default2, metric102, imperial82, temperature_default2, time2, daysInYear2 = 365.25, time_default3, voltage2, voltage_default2, metric112, imperial92, volume_default2, metric122, imperial102, volumeFlowRate_default2, measures2, EOF2, EOL2, FFI2, TEXT2, REF2, CODE2, BOLD2, ITALIC2, OL_ITEM2, UL_ITEM2, HEADING2, BLOCKQUOTE2, TABLE2, OPEN2, CLOSE2, COMMA2, BEGIN2, DONE2, MINUS2, PLUS2, MUL2, DIV2, MOD2, OR2, DOT2, PIPE2, BLOCK2, RANGE2, SPREAD2, SOME2, EVERY2, REGEX2, SYMBOL2, DIRECTIVE2, LITERAL2, NUMBER2, STRING2, NOT2, LIKE2, EQUAL2, NOT_EQ2, EXACT_EQ2, LESS2, LESS_EQ2, GREATER2, GREATER_EQ2, COMMENT2, COMMENT_MULTI2, DERIVE_METHODS2, CONTROL_TYPES2, SYMBOL_TYPES2, currency_symbols_default2, convertCache2 = null, unitMappingsReady2 = false, currencyMappingsReady2 = false, TIME_UNITS2, CURRENCY_SYMBOLS2, CURRENCY_MAPPINGS2, CURRENCY_EXCHANGES2, DEFAULT_MAPPINGS2, DEFAULT_INFLECTIONS2, e2, r2, i2 = "http://www.w3.org/1999/xlink", c2, a2 = (e22) => Array.isArray(e22), l2 = (e22) => typeof e22 == "string", u2 = (e22) => typeof e22 == "function", d2 = (e22) => e22 == null, f2 = (e22) => e22 !== null && Object.prototype.toString.call(e22) === "[object Object]", p2 = (e22) => e22 !== null && (typeof e22 == "function" || typeof e22 == "object"), h2 = (e22) => l2(e22) || typeof e22 == "number" || typeof e22 == "boolean", b2 = (e22) => e22 !== null && typeof e22 == "object" && ("value" in e22) && typeof e22.peek == "function", m2 = (e22) => a2(e22) && !y2(e22), T2 = (e22) => e22.replace(/-([a-z])/g, (e3, t) => t.toUpperCase()), U2 = (e22, t) => e22 && e22.removeChild(t), q2 = (e22, t) => {
  t && (L2.valid(t) ? t.mount(e22.parentNode, e22) : e22.parentNode.insertBefore(t, e22)), U2(e22.parentNode, e22);
}, G2 = null, Q2, se2 = "s:", ue2 = () => typeof Element != "undefined" && ("moveBefore" in Element.prototype), me2 = (e22 = "div", t = null, ...n) => h2(t) ? [e22, {}, [t].concat(n).filter((e3) => !d2(e3))] : a2(t) && !n.length ? [e22, {}, t] : [e22, t || {}, n], VOID_TAGS2, LOGIC_TYPES2, RESULT_TYPES2, INVOKE_TYPES2, COMMENT_TYPES2, MATH_TYPES2, END_TYPES2, LIST_TYPES2, SCALAR_TYPES2, RE_SLICING2, exports_prelude2, RE_PLACEHOLDER2, RE_FORMATTING2, RE_LAZY2, SAFE_GLOBALS2, SAFE_PRELUDE2, LAZY_DESCRIPTORS2, OPS_MUL_DIV2, OPS_PLUS_MINUS_MOD2, OPS_LOGIC2, builtinsReady2 = false, SPACE_SCALE2, OPACITY_SCALE2, COLORS2, STATIC_RULES2, OPERATOR2, exports_runtime2, SIGNAL2, MAX_HISTORY3 = 20, currentEffect2 = null, devtoolsActive2 = false, globalRegistry2, componentObservers2, MAX_HISTORY22 = 20, CODES2, ansi2, names2, ansi_default2;
var init_main2 = __esm(() => {
  __defProp2 = Object.defineProperty;
  angle2 = {
    rad: {
      name: {
        singular: "radian",
        plural: "radians"
      },
      to_anchor: 180 / Math.PI
    },
    deg: {
      name: {
        singular: "degree",
        plural: "degrees"
      },
      to_anchor: 1
    },
    grad: {
      name: {
        singular: "gradian",
        plural: "gradians"
      },
      to_anchor: 9 / 10
    },
    arcmin: {
      name: {
        singular: "arcminute",
        plural: "arcminutes"
      },
      to_anchor: 1 / 60
    },
    arcsec: {
      name: {
        singular: "arcsecond",
        plural: "arcseconds"
      },
      to_anchor: 1 / 3600
    }
  };
  angle_default2 = {
    metric: angle2,
    _anchors: {
      metric: {
        unit: "deg",
        ratio: 1
      }
    }
  };
  apparentPower2 = {
    VA: {
      name: {
        singular: "Volt-Ampere",
        plural: "Volt-Amperes"
      },
      to_anchor: 1
    },
    mVA: {
      name: {
        singular: "Millivolt-Ampere",
        plural: "Millivolt-Amperes"
      },
      to_anchor: 0.001
    },
    kVA: {
      name: {
        singular: "Kilovolt-Ampere",
        plural: "Kilovolt-Amperes"
      },
      to_anchor: 1000
    },
    MVA: {
      name: {
        singular: "Megavolt-Ampere",
        plural: "Megavolt-Amperes"
      },
      to_anchor: 1e6
    },
    GVA: {
      name: {
        singular: "Gigavolt-Ampere",
        plural: "Gigavolt-Amperes"
      },
      to_anchor: 1e9
    }
  };
  apparentPower_default2 = {
    metric: apparentPower2,
    _anchors: {
      metric: {
        unit: "VA",
        ratio: 1
      }
    }
  };
  metric13 = {
    mm2: {
      name: {
        singular: "Square Millimeter",
        plural: "Square Millimeters"
      },
      to_anchor: 1 / 1e6
    },
    cm2: {
      name: {
        singular: "Centimeter",
        plural: "Centimeters"
      },
      to_anchor: 1 / 1e4
    },
    m2: {
      name: {
        singular: "Square Meter",
        plural: "Square Meters"
      },
      to_anchor: 1
    },
    ha: {
      name: {
        singular: "Hectare",
        plural: "Hectares"
      },
      to_anchor: 1e4
    },
    km2: {
      name: {
        singular: "Square Kilometer",
        plural: "Square Kilometers"
      },
      to_anchor: 1e6
    }
  };
  imperial11 = {
    in2: {
      name: {
        singular: "Square Inch",
        plural: "Square Inches"
      },
      to_anchor: 1 / 144
    },
    yd2: {
      name: {
        singular: "Square Yard",
        plural: "Square Yards"
      },
      to_anchor: 9
    },
    ft2: {
      name: {
        singular: "Square Foot",
        plural: "Square Feet"
      },
      to_anchor: 1
    },
    ac: {
      name: {
        singular: "Acre",
        plural: "Acres"
      },
      to_anchor: 43560
    },
    mi2: {
      name: {
        singular: "Square Mile",
        plural: "Square Miles"
      },
      to_anchor: 27878400
    }
  };
  area_default2 = {
    metric: metric13,
    imperial: imperial11,
    _anchors: {
      metric: {
        unit: "m2",
        ratio: 10.7639
      },
      imperial: {
        unit: "ft2",
        ratio: 1 / 10.7639
      }
    }
  };
  current2 = {
    A: {
      name: {
        singular: "Ampere",
        plural: "Amperes"
      },
      to_anchor: 1
    },
    mA: {
      name: {
        singular: "Milliampere",
        plural: "Milliamperes"
      },
      to_anchor: 0.001
    },
    kA: {
      name: {
        singular: "Kiloampere",
        plural: "Kiloamperes"
      },
      to_anchor: 1000
    }
  };
  current_default2 = {
    metric: current2,
    _anchors: {
      metric: {
        unit: "A",
        ratio: 1
      }
    }
  };
  bits2 = {
    b: {
      name: {
        singular: "Bit",
        plural: "Bits"
      },
      to_anchor: 1
    },
    Kb: {
      name: {
        singular: "Kilobit",
        plural: "Kilobits"
      },
      to_anchor: 1024
    },
    Mb: {
      name: {
        singular: "Megabit",
        plural: "Megabits"
      },
      to_anchor: 1048576
    },
    Gb: {
      name: {
        singular: "Gigabit",
        plural: "Gigabits"
      },
      to_anchor: 1073741824
    },
    Tb: {
      name: {
        singular: "Terabit",
        plural: "Terabits"
      },
      to_anchor: 1099511627776
    }
  };
  bytes2 = {
    B: {
      name: {
        singular: "Byte",
        plural: "Bytes"
      },
      to_anchor: 1
    },
    KB: {
      name: {
        singular: "Kilobyte",
        plural: "Kilobytes"
      },
      to_anchor: 1024
    },
    MB: {
      name: {
        singular: "Megabyte",
        plural: "Megabytes"
      },
      to_anchor: 1048576
    },
    GB: {
      name: {
        singular: "Gigabyte",
        plural: "Gigabytes"
      },
      to_anchor: 1073741824
    },
    TB: {
      name: {
        singular: "Terabyte",
        plural: "Terabytes"
      },
      to_anchor: 1099511627776
    }
  };
  digital_default2 = {
    bits: bits2,
    bytes: bytes2,
    _anchors: {
      bits: {
        unit: "b",
        ratio: 1 / 8
      },
      bytes: {
        unit: "B",
        ratio: 8
      }
    }
  };
  metric22 = {
    ea: {
      name: {
        singular: "Each",
        plural: "Each"
      },
      to_anchor: 1
    },
    dz: {
      name: {
        singular: "Dozen",
        plural: "Dozens"
      },
      to_anchor: 12
    }
  };
  each_default2 = {
    metric: metric22,
    imperial: {},
    _anchors: {
      metric: {
        unit: "ea",
        ratio: 1
      }
    }
  };
  energy2 = {
    Wh: {
      name: {
        singular: "Watt-hour",
        plural: "Watt-hours"
      },
      to_anchor: 3600
    },
    mWh: {
      name: {
        singular: "Milliwatt-hour",
        plural: "Milliwatt-hours"
      },
      to_anchor: 3.6
    },
    kWh: {
      name: {
        singular: "Kilowatt-hour",
        plural: "Kilowatt-hours"
      },
      to_anchor: 3600000
    },
    MWh: {
      name: {
        singular: "Megawatt-hour",
        plural: "Megawatt-hours"
      },
      to_anchor: 3600000000
    },
    GWh: {
      name: {
        singular: "Gigawatt-hour",
        plural: "Gigawatt-hours"
      },
      to_anchor: 3600000000000
    },
    J: {
      name: {
        singular: "Joule",
        plural: "Joules"
      },
      to_anchor: 1
    },
    kJ: {
      name: {
        singular: "Kilojoule",
        plural: "Kilojoules"
      },
      to_anchor: 1000
    }
  };
  energy_default2 = {
    metric: energy2,
    _anchors: {
      metric: {
        unit: "J",
        ratio: 1
      }
    }
  };
  frequency2 = {
    mHz: {
      name: {
        singular: "millihertz",
        plural: "millihertz"
      },
      to_anchor: 1 / 1000
    },
    Hz: {
      name: {
        singular: "hertz",
        plural: "hertz"
      },
      to_anchor: 1
    },
    kHz: {
      name: {
        singular: "kilohertz",
        plural: "kilohertz"
      },
      to_anchor: 1000
    },
    MHz: {
      name: {
        singular: "megahertz",
        plural: "megahertz"
      },
      to_anchor: 1000 * 1000
    },
    GHz: {
      name: {
        singular: "gigahertz",
        plural: "gigahertz"
      },
      to_anchor: 1000 * 1000 * 1000
    },
    THz: {
      name: {
        singular: "terahertz",
        plural: "terahertz"
      },
      to_anchor: 1000 * 1000 * 1000 * 1000
    },
    rpm: {
      name: {
        singular: "rotation per minute",
        plural: "rotations per minute"
      },
      to_anchor: 1 / 60
    },
    "deg/s": {
      name: {
        singular: "degree per second",
        plural: "degrees per second"
      },
      to_anchor: 1 / 360
    },
    "rad/s": {
      name: {
        singular: "radian per second",
        plural: "radians per second"
      },
      to_anchor: 1 / (Math.PI * 2)
    }
  };
  frequency_default2 = {
    metric: frequency2,
    _anchors: {
      frequency: {
        unit: "hz",
        ratio: 1
      }
    }
  };
  metric32 = {
    lx: {
      name: {
        singular: "Lux",
        plural: "Lux"
      },
      to_anchor: 1
    }
  };
  imperial22 = {
    "ft-cd": {
      name: {
        singular: "Foot-candle",
        plural: "Foot-candles"
      },
      to_anchor: 1
    }
  };
  illuminance_default2 = {
    metric: metric32,
    imperial: imperial22,
    _anchors: {
      metric: {
        unit: "lx",
        ratio: 1 / 10.76391
      },
      imperial: {
        unit: "ft-cd",
        ratio: 10.76391
      }
    }
  };
  metric42 = {
    mm: {
      name: {
        singular: "Millimeter",
        plural: "Millimeters"
      },
      to_anchor: 1 / 1000
    },
    cm: {
      name: {
        singular: "Centimeter",
        plural: "Centimeters"
      },
      to_anchor: 1 / 100
    },
    m: {
      name: {
        singular: "Meter",
        plural: "Meters"
      },
      to_anchor: 1
    },
    km: {
      name: {
        singular: "Kilometer",
        plural: "Kilometers"
      },
      to_anchor: 1000
    }
  };
  imperial32 = {
    in: {
      name: {
        singular: "Inch",
        plural: "Inches"
      },
      to_anchor: 1 / 12
    },
    yd: {
      name: {
        singular: "Yard",
        plural: "Yards"
      },
      to_anchor: 3
    },
    "ft-us": {
      name: {
        singular: "US Survey Foot",
        plural: "US Survey Feet"
      },
      to_anchor: 1.000002
    },
    ft: {
      name: {
        singular: "Foot",
        plural: "Feet"
      },
      to_anchor: 1
    },
    mi: {
      name: {
        singular: "Mile",
        plural: "Miles"
      },
      to_anchor: 5280
    }
  };
  length_default2 = {
    metric: metric42,
    imperial: imperial32,
    _anchors: {
      metric: {
        unit: "m",
        ratio: 3.28084
      },
      imperial: {
        unit: "ft",
        ratio: 1 / 3.28084
      }
    }
  };
  metric52 = {
    mcg: {
      name: {
        singular: "Microgram",
        plural: "Micrograms"
      },
      to_anchor: 1 / 1e6
    },
    mg: {
      name: {
        singular: "Milligram",
        plural: "Milligrams"
      },
      to_anchor: 1 / 1000
    },
    g: {
      name: {
        singular: "Gram",
        plural: "Grams"
      },
      to_anchor: 1
    },
    kg: {
      name: {
        singular: "Kilogram",
        plural: "Kilograms"
      },
      to_anchor: 1000
    },
    mt: {
      name: {
        singular: "Metric Tonne",
        plural: "Metric Tonnes"
      },
      to_anchor: 1e6
    }
  };
  imperial42 = {
    oz: {
      name: {
        singular: "Ounce",
        plural: "Ounces"
      },
      to_anchor: 1 / 16
    },
    lb: {
      name: {
        singular: "Pound",
        plural: "Pounds"
      },
      to_anchor: 1
    },
    t: {
      name: {
        singular: "Ton",
        plural: "Tons"
      },
      to_anchor: 2000
    }
  };
  mass_default2 = {
    metric: metric52,
    imperial: imperial42,
    _anchors: {
      metric: {
        unit: "g",
        ratio: 1 / 453.592
      },
      imperial: {
        unit: "lb",
        ratio: 453.592
      }
    }
  };
  metric62 = {
    "min/km": {
      name: {
        singular: "Minute per kilometre",
        plural: "Minutes per kilometre"
      },
      to_anchor: 0.06
    },
    "s/m": {
      name: {
        singular: "Second per metre",
        plural: "Seconds per metre"
      },
      to_anchor: 1
    }
  };
  imperial52 = {
    "min/mi": {
      name: {
        singular: "Minute per mile",
        plural: "Minutes per mile"
      },
      to_anchor: 0.0113636
    },
    "s/ft": {
      name: {
        singular: "Second per foot",
        plural: "Seconds per foot"
      },
      to_anchor: 1
    }
  };
  pace_default2 = {
    metric: metric62,
    imperial: imperial52,
    _anchors: {
      metric: {
        unit: "s/m",
        ratio: 0.3048
      },
      imperial: {
        unit: "s/ft",
        ratio: 1 / 0.3048
      }
    }
  };
  metric72 = {
    ppm: {
      name: {
        singular: "Part-per Million",
        plural: "Parts-per Million"
      },
      to_anchor: 1
    },
    ppb: {
      name: {
        singular: "Part-per Billion",
        plural: "Parts-per Billion"
      },
      to_anchor: 0.001
    },
    ppt: {
      name: {
        singular: "Part-per Trillion",
        plural: "Parts-per Trillion"
      },
      to_anchor: 0.000001
    },
    ppq: {
      name: {
        singular: "Part-per Quadrillion",
        plural: "Parts-per Quadrillion"
      },
      to_anchor: 0.000000001
    }
  };
  partsPer_default2 = {
    metric: metric72,
    imperial: {},
    _anchors: {
      metric: {
        unit: "ppm",
        ratio: 0.000001
      }
    }
  };
  power2 = {
    W: {
      name: {
        singular: "Watt",
        plural: "Watts"
      },
      to_anchor: 1
    },
    mW: {
      name: {
        singular: "Milliwatt",
        plural: "Milliwatts"
      },
      to_anchor: 0.001
    },
    kW: {
      name: {
        singular: "Kilowatt",
        plural: "Kilowatts"
      },
      to_anchor: 1000
    },
    MW: {
      name: {
        singular: "Megawatt",
        plural: "Megawatts"
      },
      to_anchor: 1e6
    },
    GW: {
      name: {
        singular: "Gigawatt",
        plural: "Gigawatts"
      },
      to_anchor: 1e9
    }
  };
  power_default2 = {
    metric: power2,
    _anchors: {
      metric: {
        unit: "W",
        ratio: 1
      }
    }
  };
  metric82 = {
    Pa: {
      name: {
        singular: "pascal",
        plural: "pascals"
      },
      to_anchor: 1 / 1000
    },
    kPa: {
      name: {
        singular: "kilopascal",
        plural: "kilopascals"
      },
      to_anchor: 1
    },
    MPa: {
      name: {
        singular: "megapascal",
        plural: "megapascals"
      },
      to_anchor: 1000
    },
    hPa: {
      name: {
        singular: "hectopascal",
        plural: "hectopascals"
      },
      to_anchor: 1 / 10
    },
    bar: {
      name: {
        singular: "bar",
        plural: "bar"
      },
      to_anchor: 100
    },
    torr: {
      name: {
        singular: "torr",
        plural: "torr"
      },
      to_anchor: 101325 / 760000
    }
  };
  imperial62 = {
    psi: {
      name: {
        singular: "pound per square inch",
        plural: "pounds per square inch"
      },
      to_anchor: 1 / 1000
    },
    ksi: {
      name: {
        singular: "kilopound per square inch",
        plural: "kilopound per square inch"
      },
      to_anchor: 1
    }
  };
  pressure_default2 = {
    metric: metric82,
    imperial: imperial62,
    _anchors: {
      metric: {
        unit: "kPa",
        ratio: 0.00014503768078
      },
      imperial: {
        unit: "psi",
        ratio: 1 / 0.00014503768078
      }
    }
  };
  reactiveEnergy2 = {
    VARh: {
      name: {
        singular: "Volt-Ampere Reactive Hour",
        plural: "Volt-Amperes Reactive Hour"
      },
      to_anchor: 1
    },
    mVARh: {
      name: {
        singular: "Millivolt-Ampere Reactive Hour",
        plural: "Millivolt-Amperes Reactive Hour"
      },
      to_anchor: 0.001
    },
    kVARh: {
      name: {
        singular: "Kilovolt-Ampere Reactive Hour",
        plural: "Kilovolt-Amperes Reactive Hour"
      },
      to_anchor: 1000
    },
    MVARh: {
      name: {
        singular: "Megavolt-Ampere Reactive Hour",
        plural: "Megavolt-Amperes Reactive Hour"
      },
      to_anchor: 1e6
    },
    GVARh: {
      name: {
        singular: "Gigavolt-Ampere Reactive Hour",
        plural: "Gigavolt-Amperes Reactive Hour"
      },
      to_anchor: 1e9
    }
  };
  reactiveEnergy_default2 = {
    metric: reactiveEnergy2,
    _anchors: {
      metric: {
        unit: "VARh",
        ratio: 1
      }
    }
  };
  reactivePower2 = {
    VAR: {
      name: {
        singular: "Volt-Ampere Reactive",
        plural: "Volt-Amperes Reactive"
      },
      to_anchor: 1
    },
    mVAR: {
      name: {
        singular: "Millivolt-Ampere Reactive",
        plural: "Millivolt-Amperes Reactive"
      },
      to_anchor: 0.001
    },
    kVAR: {
      name: {
        singular: "Kilovolt-Ampere Reactive",
        plural: "Kilovolt-Amperes Reactive"
      },
      to_anchor: 1000
    },
    MVAR: {
      name: {
        singular: "Megavolt-Ampere Reactive",
        plural: "Megavolt-Amperes Reactive"
      },
      to_anchor: 1e6
    },
    GVAR: {
      name: {
        singular: "Gigavolt-Ampere Reactive",
        plural: "Gigavolt-Amperes Reactive"
      },
      to_anchor: 1e9
    }
  };
  reactivePower_default2 = {
    metric: reactivePower2,
    _anchors: {
      metric: {
        unit: "VAR",
        ratio: 1
      }
    }
  };
  metric92 = {
    "m/s": {
      name: {
        singular: "Metre per second",
        plural: "Metres per second"
      },
      to_anchor: 3.6
    },
    "km/h": {
      name: {
        singular: "Kilometre per hour",
        plural: "Kilometres per hour"
      },
      to_anchor: 1
    }
  };
  imperial72 = {
    "m/h": {
      name: {
        singular: "Mile per hour",
        plural: "Miles per hour"
      },
      to_anchor: 1
    },
    knot: {
      name: {
        singular: "Knot",
        plural: "Knots"
      },
      to_anchor: 1.150779
    },
    "ft/s": {
      name: {
        singular: "Foot per second",
        plural: "Feet per second"
      },
      to_anchor: 0.681818
    }
  };
  speed_default2 = {
    metric: metric92,
    imperial: imperial72,
    _anchors: {
      metric: {
        unit: "km/h",
        ratio: 1 / 1.609344
      },
      imperial: {
        unit: "m/h",
        ratio: 1.609344
      }
    }
  };
  metric102 = {
    C: {
      name: {
        singular: "degree Celsius",
        plural: "degrees Celsius"
      },
      to_anchor: 1,
      anchor_shift: 0
    },
    K: {
      name: {
        singular: "degree Kelvin",
        plural: "degrees Kelvin"
      },
      to_anchor: 1,
      anchor_shift: 273.15
    }
  };
  imperial82 = {
    F: {
      name: {
        singular: "degree Fahrenheit",
        plural: "degrees Fahrenheit"
      },
      to_anchor: 1
    },
    R: {
      name: {
        singular: "degree Rankine",
        plural: "degrees Rankine"
      },
      to_anchor: 1,
      anchor_shift: 459.67
    }
  };
  temperature_default2 = {
    metric: metric102,
    imperial: imperial82,
    _anchors: {
      metric: {
        unit: "C",
        transform(C) {
          return C / (5 / 9) + 32;
        }
      },
      imperial: {
        unit: "F",
        transform(F) {
          return (F - 32) * (5 / 9);
        }
      }
    }
  };
  time2 = {
    ns: {
      name: {
        singular: "Nanosecond",
        plural: "Nanoseconds"
      },
      to_anchor: 1 / 1e9
    },
    mu: {
      name: {
        singular: "Microsecond",
        plural: "Microseconds"
      },
      to_anchor: 1 / 1e6
    },
    ms: {
      name: {
        singular: "Millisecond",
        plural: "Milliseconds"
      },
      to_anchor: 1 / 1000
    },
    s: {
      name: {
        singular: "Second",
        plural: "Seconds"
      },
      to_anchor: 1
    },
    min: {
      name: {
        singular: "Minute",
        plural: "Minutes"
      },
      to_anchor: 60
    },
    h: {
      name: {
        singular: "Hour",
        plural: "Hours"
      },
      to_anchor: 60 * 60
    },
    d: {
      name: {
        singular: "Day",
        plural: "Days"
      },
      to_anchor: 60 * 60 * 24
    },
    week: {
      name: {
        singular: "Week",
        plural: "Weeks"
      },
      to_anchor: 60 * 60 * 24 * 7
    },
    month: {
      name: {
        singular: "Month",
        plural: "Months"
      },
      to_anchor: 60 * 60 * 24 * daysInYear2 / 12
    },
    year: {
      name: {
        singular: "Year",
        plural: "Years"
      },
      to_anchor: 60 * 60 * 24 * daysInYear2
    }
  };
  time_default3 = {
    metric: time2,
    _anchors: {
      metric: {
        unit: "s",
        ratio: 1
      }
    }
  };
  voltage2 = {
    V: {
      name: {
        singular: "Volt",
        plural: "Volts"
      },
      to_anchor: 1
    },
    mV: {
      name: {
        singular: "Millivolt",
        plural: "Millivolts"
      },
      to_anchor: 0.001
    },
    kV: {
      name: {
        singular: "Kilovolt",
        plural: "Kilovolts"
      },
      to_anchor: 1000
    }
  };
  voltage_default2 = {
    metric: voltage2,
    _anchors: {
      metric: {
        unit: "V",
        ratio: 1
      }
    }
  };
  metric112 = {
    mm3: {
      name: {
        singular: "Cubic Millimeter",
        plural: "Cubic Millimeters"
      },
      to_anchor: 1 / 1e6
    },
    cm3: {
      name: {
        singular: "Cubic Centimeter",
        plural: "Cubic Centimeters"
      },
      to_anchor: 1 / 1000
    },
    ml: {
      name: {
        singular: "Millilitre",
        plural: "Millilitres"
      },
      to_anchor: 1 / 1000
    },
    cl: {
      name: {
        singular: "Centilitre",
        plural: "Centilitres"
      },
      to_anchor: 1 / 100
    },
    dl: {
      name: {
        singular: "Decilitre",
        plural: "Decilitres"
      },
      to_anchor: 1 / 10
    },
    l: {
      name: {
        singular: "Litre",
        plural: "Litres"
      },
      to_anchor: 1
    },
    kl: {
      name: {
        singular: "Kilolitre",
        plural: "Kilolitres"
      },
      to_anchor: 1000
    },
    m3: {
      name: {
        singular: "Cubic meter",
        plural: "Cubic meters"
      },
      to_anchor: 1000
    },
    km3: {
      name: {
        singular: "Cubic kilometer",
        plural: "Cubic kilometers"
      },
      to_anchor: 1000000000000
    },
    krm: {
      name: {
        singular: "Matsked",
        plural: "Matskedar"
      },
      to_anchor: 1 / 1000
    },
    tsk: {
      name: {
        singular: "Tesked",
        plural: "Teskedar"
      },
      to_anchor: 5 / 1000
    },
    msk: {
      name: {
        singular: "Matsked",
        plural: "Matskedar"
      },
      to_anchor: 15 / 1000
    },
    kkp: {
      name: {
        singular: "Kaffekopp",
        plural: "Kaffekoppar"
      },
      to_anchor: 150 / 1000
    },
    glas: {
      name: {
        singular: "Glas",
        plural: "Glas"
      },
      to_anchor: 200 / 1000
    },
    kanna: {
      name: {
        singular: "Kanna",
        plural: "Kannor"
      },
      to_anchor: 2.617
    }
  };
  imperial92 = {
    tsp: {
      name: {
        singular: "Teaspoon",
        plural: "Teaspoons"
      },
      to_anchor: 1 / 6
    },
    Tbs: {
      name: {
        singular: "Tablespoon",
        plural: "Tablespoons"
      },
      to_anchor: 1 / 2
    },
    in3: {
      name: {
        singular: "Cubic inch",
        plural: "Cubic inches"
      },
      to_anchor: 0.55411
    },
    "fl-oz": {
      name: {
        singular: "Fluid Ounce",
        plural: "Fluid Ounces"
      },
      to_anchor: 1
    },
    cup: {
      name: {
        singular: "Cup",
        plural: "Cups"
      },
      to_anchor: 8
    },
    pnt: {
      name: {
        singular: "Pint",
        plural: "Pints"
      },
      to_anchor: 16
    },
    qt: {
      name: {
        singular: "Quart",
        plural: "Quarts"
      },
      to_anchor: 32
    },
    gal: {
      name: {
        singular: "Gallon",
        plural: "Gallons"
      },
      to_anchor: 128
    },
    ft3: {
      name: {
        singular: "Cubic foot",
        plural: "Cubic feet"
      },
      to_anchor: 957.506
    },
    yd3: {
      name: {
        singular: "Cubic yard",
        plural: "Cubic yards"
      },
      to_anchor: 25852.7
    }
  };
  volume_default2 = {
    metric: metric112,
    imperial: imperial92,
    _anchors: {
      metric: {
        unit: "l",
        ratio: 33.8140226
      },
      imperial: {
        unit: "fl-oz",
        ratio: 1 / 33.8140226
      }
    }
  };
  metric122 = {
    "mm3/s": {
      name: {
        singular: "Cubic Millimeter per second",
        plural: "Cubic Millimeters per second"
      },
      to_anchor: 1 / 1e6
    },
    "cm3/s": {
      name: {
        singular: "Cubic Centimeter per second",
        plural: "Cubic Centimeters per second"
      },
      to_anchor: 1 / 1000
    },
    "ml/s": {
      name: {
        singular: "Millilitre per second",
        plural: "Millilitres per second"
      },
      to_anchor: 1 / 1000
    },
    "cl/s": {
      name: {
        singular: "Centilitre per second",
        plural: "Centilitres per second"
      },
      to_anchor: 1 / 100
    },
    "dl/s": {
      name: {
        singular: "Decilitre per second",
        plural: "Decilitres per second"
      },
      to_anchor: 1 / 10
    },
    "l/s": {
      name: {
        singular: "Litre per second",
        plural: "Litres per second"
      },
      to_anchor: 1
    },
    "l/min": {
      name: {
        singular: "Litre per minute",
        plural: "Litres per minute"
      },
      to_anchor: 1 / 60
    },
    "l/h": {
      name: {
        singular: "Litre per hour",
        plural: "Litres per hour"
      },
      to_anchor: 1 / 3600
    },
    "kl/s": {
      name: {
        singular: "Kilolitre per second",
        plural: "Kilolitres per second"
      },
      to_anchor: 1000
    },
    "kl/min": {
      name: {
        singular: "Kilolitre per minute",
        plural: "Kilolitres per minute"
      },
      to_anchor: 50 / 3
    },
    "kl/h": {
      name: {
        singular: "Kilolitre per hour",
        plural: "Kilolitres per hour"
      },
      to_anchor: 5 / 18
    },
    "m3/s": {
      name: {
        singular: "Cubic meter per second",
        plural: "Cubic meters per second"
      },
      to_anchor: 1000
    },
    "m3/min": {
      name: {
        singular: "Cubic meter per minute",
        plural: "Cubic meters per minute"
      },
      to_anchor: 50 / 3
    },
    "m3/h": {
      name: {
        singular: "Cubic meter per hour",
        plural: "Cubic meters per hour"
      },
      to_anchor: 5 / 18
    },
    "km3/s": {
      name: {
        singular: "Cubic kilometer per second",
        plural: "Cubic kilometers per second"
      },
      to_anchor: 1000000000000
    }
  };
  imperial102 = {
    "tsp/s": {
      name: {
        singular: "Teaspoon per second",
        plural: "Teaspoons per second"
      },
      to_anchor: 1 / 6
    },
    "Tbs/s": {
      name: {
        singular: "Tablespoon per second",
        plural: "Tablespoons per second"
      },
      to_anchor: 1 / 2
    },
    "in3/s": {
      name: {
        singular: "Cubic inch per second",
        plural: "Cubic inches per second"
      },
      to_anchor: 0.55411
    },
    "in3/min": {
      name: {
        singular: "Cubic inch per minute",
        plural: "Cubic inches per minute"
      },
      to_anchor: 0.55411 / 60
    },
    "in3/h": {
      name: {
        singular: "Cubic inch per hour",
        plural: "Cubic inches per hour"
      },
      to_anchor: 0.55411 / 3600
    },
    "fl-oz/s": {
      name: {
        singular: "Fluid Ounce per second",
        plural: "Fluid Ounces per second"
      },
      to_anchor: 1
    },
    "fl-oz/min": {
      name: {
        singular: "Fluid Ounce per minute",
        plural: "Fluid Ounces per minute"
      },
      to_anchor: 1 / 60
    },
    "fl-oz/h": {
      name: {
        singular: "Fluid Ounce per hour",
        plural: "Fluid Ounces per hour"
      },
      to_anchor: 1 / 3600
    },
    "cup/s": {
      name: {
        singular: "Cup per second",
        plural: "Cups per second"
      },
      to_anchor: 8
    },
    "pnt/s": {
      name: {
        singular: "Pint per second",
        plural: "Pints per second"
      },
      to_anchor: 16
    },
    "pnt/min": {
      name: {
        singular: "Pint per minute",
        plural: "Pints per minute"
      },
      to_anchor: 4 / 15
    },
    "pnt/h": {
      name: {
        singular: "Pint per hour",
        plural: "Pints per hour"
      },
      to_anchor: 1 / 225
    },
    "qt/s": {
      name: {
        singular: "Quart per second",
        plural: "Quarts per second"
      },
      to_anchor: 32
    },
    "gal/s": {
      name: {
        singular: "Gallon per second",
        plural: "Gallons per second"
      },
      to_anchor: 128
    },
    "gal/min": {
      name: {
        singular: "Gallon per minute",
        plural: "Gallons per minute"
      },
      to_anchor: 32 / 15
    },
    "gal/h": {
      name: {
        singular: "Gallon per hour",
        plural: "Gallons per hour"
      },
      to_anchor: 8 / 225
    },
    "ft3/s": {
      name: {
        singular: "Cubic foot per second",
        plural: "Cubic feet per second"
      },
      to_anchor: 957.506
    },
    "ft3/min": {
      name: {
        singular: "Cubic foot per minute",
        plural: "Cubic feet per minute"
      },
      to_anchor: 957.506 / 60
    },
    "ft3/h": {
      name: {
        singular: "Cubic foot per hour",
        plural: "Cubic feet per hour"
      },
      to_anchor: 957.506 / 3600
    },
    "yd3/s": {
      name: {
        singular: "Cubic yard per second",
        plural: "Cubic yards per second"
      },
      to_anchor: 25852.7
    },
    "yd3/min": {
      name: {
        singular: "Cubic yard per minute",
        plural: "Cubic yards per minute"
      },
      to_anchor: 25852.7 / 60
    },
    "yd3/h": {
      name: {
        singular: "Cubic yard per hour",
        plural: "Cubic yards per hour"
      },
      to_anchor: 25852.7 / 3600
    }
  };
  volumeFlowRate_default2 = {
    metric: metric122,
    imperial: imperial102,
    _anchors: {
      metric: {
        unit: "l/s",
        ratio: 33.8140227
      },
      imperial: {
        unit: "fl-oz/s",
        ratio: 1 / 33.8140227
      }
    }
  };
  measures2 = {
    length: length_default2,
    area: area_default2,
    mass: mass_default2,
    volume: volume_default2,
    each: each_default2,
    temperature: temperature_default2,
    time: time_default3,
    digital: digital_default2,
    partsPer: partsPer_default2,
    speed: speed_default2,
    pace: pace_default2,
    pressure: pressure_default2,
    current: current_default2,
    voltage: voltage_default2,
    power: power_default2,
    reactivePower: reactivePower_default2,
    apparentPower: apparentPower_default2,
    energy: energy_default2,
    reactiveEnergy: reactiveEnergy_default2,
    volumeFlowRate: volumeFlowRate_default2,
    illuminance: illuminance_default2,
    frequency: frequency_default2,
    angle: angle_default2
  };
  EOF2 = Symbol("EOF");
  EOL2 = Symbol("EOL");
  FFI2 = Symbol("FFI");
  TEXT2 = Symbol("TEXT");
  REF2 = Symbol("REF");
  CODE2 = Symbol("CODE");
  BOLD2 = Symbol("BOLD");
  ITALIC2 = Symbol("ITALIC");
  OL_ITEM2 = Symbol("OL_ITEM");
  UL_ITEM2 = Symbol("UL_ITEM");
  HEADING2 = Symbol("HEADING");
  BLOCKQUOTE2 = Symbol("BLOCKQUOTE");
  TABLE2 = Symbol("TABLE");
  OPEN2 = Symbol("OPEN");
  CLOSE2 = Symbol("CLOSE");
  COMMA2 = Symbol("COMMA");
  BEGIN2 = Symbol("BEGIN");
  DONE2 = Symbol("DONE");
  MINUS2 = Symbol("MINUS");
  PLUS2 = Symbol("PLUS");
  MUL2 = Symbol("MUL");
  DIV2 = Symbol("DIV");
  MOD2 = Symbol("MOD");
  OR2 = Symbol("OR");
  DOT2 = Symbol("DOT");
  PIPE2 = Symbol("PIPE");
  BLOCK2 = Symbol("BLOCK");
  RANGE2 = Symbol("RANGE");
  SPREAD2 = Symbol("SPREAD");
  SOME2 = Symbol("SOME");
  EVERY2 = Symbol("EVERY");
  REGEX2 = Symbol("REGEX");
  SYMBOL2 = Symbol("SYMBOL");
  DIRECTIVE2 = Symbol("DIRECTIVE");
  LITERAL2 = Symbol("LITERAL");
  NUMBER2 = Symbol("NUMBER");
  STRING2 = Symbol("STRING");
  NOT2 = Symbol("NOT");
  LIKE2 = Symbol("LIKE");
  EQUAL2 = Symbol("EQUAL");
  NOT_EQ2 = Symbol("NOT_EQ");
  EXACT_EQ2 = Symbol("EXACT_EQ");
  LESS2 = Symbol("LESS");
  LESS_EQ2 = Symbol("LESS_EQ");
  GREATER2 = Symbol("GREATER");
  GREATER_EQ2 = Symbol("GREATER_EQ");
  COMMENT2 = Symbol("COMMENT");
  COMMENT_MULTI2 = Symbol("COMMENT_MULTI");
  DERIVE_METHODS2 = [
    "If",
    "It",
    "Then",
    "Else",
    "Try",
    "Check",
    "Rescue",
    "While",
    "Do",
    "Let",
    "Match"
  ];
  CONTROL_TYPES2 = [
    "@namespace",
    "@table",
    "@if",
    "@else",
    "@ok",
    "@err",
    "@try",
    "@check",
    "@rescue",
    "@while",
    "@do",
    "@let",
    "@loop",
    "@match",
    "@import",
    "@from",
    "@module",
    "@export",
    "@template"
  ];
  SYMBOL_TYPES2 = [
    ":nil",
    ":on",
    ":off",
    ":click",
    ":focus",
    ":blur",
    ":input",
    ":change",
    ":submit",
    ":load",
    ":error",
    ":mouseenter",
    ":mouseleave",
    ":mousedown",
    ":mouseup",
    ":mouseover",
    ":mouseout",
    ":keydown",
    ":keyup",
    ":keypress",
    ":touchstart",
    ":touchend",
    ":touchmove",
    ":touchcancel"
  ];
  currency_symbols_default2 = {
    AED: "د.إ",
    AFN: "؋",
    ALL: "L",
    AMD: "դր.",
    ANG: "ƒ",
    AOA: "Kz",
    ARS: "$",
    AUD: "$",
    AWG: "ƒ",
    AZN: "₼",
    BAM: "КМ",
    BBD: "$",
    BDT: "৳",
    BGN: "лв",
    BHD: "ب.د",
    BIF: "Fr",
    BMD: "$",
    BND: "$",
    BOB: "Bs.",
    BRL: "R$ ",
    BSD: "$",
    BTC: "Ƀ",
    BTN: "Nu.",
    BWP: "P",
    BYR: "Br",
    BZD: "$",
    CAD: "$",
    CDF: "Fr",
    CHF: "Fr",
    CLF: "UF",
    CLP: "$",
    CNY: "¥",
    COP: "$",
    CRC: "₡",
    CUC: "$",
    CUP: "$",
    CVE: "$",
    CZK: "Kč",
    DJF: "Fdj",
    DKK: "kr",
    DOP: "$",
    DZD: "د.ج",
    EEK: "kr",
    EGP: "ج.م",
    ERN: "Nfk",
    ETB: "Br",
    EUR: "€",
    FJD: "$",
    FKP: "£",
    GBP: "£",
    GEL: "ლ",
    GGP: "£",
    GHS: "₵",
    GIP: "£",
    GMD: "D",
    GNF: "Fr",
    GTQ: "Q",
    GYD: "$",
    HKD: "$",
    HNL: "L",
    HRK: "kn",
    HTG: "G",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    IMP: "£",
    INR: "₹",
    IQD: "ع.د",
    IRR: "﷼",
    ISK: "kr",
    JEP: "£",
    JMD: "$",
    JOD: "د.ا",
    JPY: "¥",
    KES: "KSh",
    KGS: "som",
    KHR: "៛",
    KMF: "Fr",
    KPW: "₩",
    KRW: "₩",
    KWD: "د.ك",
    KYD: "$",
    KZT: "〒",
    LAK: "₭",
    LBP: "ل.ل",
    LKR: "₨",
    LRD: "$",
    LSL: "L",
    LTL: "Lt",
    LVL: "Ls",
    LYD: "ل.د",
    MAD: "د.م.",
    MDL: "L",
    MGA: "Ar",
    MKD: "ден",
    MMK: "K",
    MNT: "₮",
    MOP: "P",
    MRO: "UM",
    MTL: "₤",
    MUR: "₨",
    MVR: "MVR",
    MWK: "MK",
    MXN: "$",
    MYR: "RM",
    MZN: "MTn",
    NAD: "$",
    NGN: "₦",
    NIO: "C$",
    NOK: "kr",
    NPR: "₨",
    NZD: "$",
    OMR: "ر.ع.",
    PAB: "B/.",
    PEN: "S/.",
    PGK: "K",
    PHP: "₱",
    PKR: "₨",
    PLN: "zł",
    PYG: "₲",
    QAR: "ر.ق",
    RON: "L",
    RSD: "РСД",
    RUB: "р.",
    RWF: "FRw",
    SAR: "ر.س",
    SBD: "$",
    SCR: "₨",
    SDG: "£",
    SEK: "kr",
    SGD: "$",
    SHP: "£",
    SKK: "Sk",
    SLL: "Le",
    SOS: "Sh",
    SRD: "$",
    STD: "Db",
    SVC: "₡",
    SYP: "£S",
    SZL: "L",
    THB: "฿",
    TJS: "ЅМ",
    TMM: "m",
    TMT: "m",
    TND: "د.ت",
    TOP: "T$",
    TRY: "TL",
    TTD: "$",
    TWD: "$",
    TZS: "Sh",
    UAH: "₴",
    UGX: "USh",
    USD: "$",
    UYU: "$",
    UZS: "лв",
    VEF: "Bs F",
    VND: "₫",
    VUV: "Vt",
    WST: "T",
    XAF: "Fr",
    XAG: "Ag Oz",
    XAU: "Au Oz",
    XCD: "$",
    XDR: "XDR",
    XOF: "Fr",
    XPF: "Fr",
    YER: "﷼",
    ZAR: "R",
    ZMK: "ZK",
    ZMW: "ZK",
    ZWL: "Z$"
  };
  TIME_UNITS2 = [];
  CURRENCY_SYMBOLS2 = {};
  CURRENCY_MAPPINGS2 = {};
  CURRENCY_EXCHANGES2 = {};
  DEFAULT_MAPPINGS2 = {};
  DEFAULT_INFLECTIONS2 = {};
  e2 = /^[0-9A-Za-z-]+$/;
  r2 = /^xlink:?/;
  c2 = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  Q2 = new Set;
  VOID_TAGS2 = new Set((c2 || []).map((name) => String(name).toLowerCase()));
  LOGIC_TYPES2 = [LESS2, LESS_EQ2, GREATER2, GREATER_EQ2, EXACT_EQ2, NOT_EQ2, NOT2, LIKE2, EQUAL2, SOME2, EVERY2];
  RESULT_TYPES2 = [NUMBER2, STRING2, SYMBOL2, LITERAL2, BLOCK2, RANGE2, REGEX2];
  INVOKE_TYPES2 = [EOL2, COMMA2, BLOCK2, RANGE2, LITERAL2];
  COMMENT_TYPES2 = [COMMENT2, COMMENT_MULTI2];
  MATH_TYPES2 = [EQUAL2, MINUS2, PLUS2, MUL2, DIV2, PIPE2, MOD2, SOME2, LIKE2, NOT2, OR2];
  END_TYPES2 = [OR2, EOF2, EOL2, COMMA2, DONE2, CLOSE2, PIPE2];
  LIST_TYPES2 = [BEGIN2, DONE2, OPEN2, CLOSE2];
  SCALAR_TYPES2 = [NUMBER2, STRING2];
  RE_SLICING2 = /^:(-?\d+)?(\.\.|-)?(?:(-?\d+))?$/;
  Expr2.define("val", class Val2 {
    constructor(num, type) {
      this.num = num;
      this.kind = type;
    }
    get() {
      return this.num;
    }
    from() {
      return this;
    }
    valueOf() {
      return this.num;
    }
    toToken() {
      return Expr2.unit(this);
    }
    add(num, type) {
      return this.from(this.get(type) + num, type);
    }
    sub(num, type) {
      return this.from(this.get(type) - num, type);
    }
    mul(num, type) {
      return this.from(this.get(type) * num, type);
    }
    div(num, type) {
      return this.from(this.get(type) / num, type);
    }
    mod(num, type) {
      return this.from(this.get(type) % num, type);
    }
  });
  Expr2.define("unit", class Unit2 extends Expr2.Val {
    constructor(num, type) {
      super(num, type);
      this.kind = type.replace(/^:/, "");
    }
    toString() {
      return `${this.num.toFixed(2).replace(/\.0+$/, "")} ${this.kind}`;
    }
    get(type) {
      return type !== this.kind ? this.to(type).num : this.num;
    }
    from(num, type) {
      if (!type) {
        this.num = num;
        return this;
      }
      return new Unit2(num, type);
    }
    to(type) {
      ensureDefaultMappings2();
      const newKind = type.replace(/^:/, "");
      let value;
      if (CURRENCY_SYMBOLS2[this.kind] || CURRENCY_SYMBOLS2[newKind]) {
        const a22 = CURRENCY_EXCHANGES2[this.kind];
        const b22 = CURRENCY_EXCHANGES2[newKind];
        if (!a22)
          throw new Error(`Unsupported ${this.kind} currency`);
        if (!b22)
          throw new Error(`Unsupported ${newKind} currency`);
        value = this.num * b22 / a22;
      } else {
        value = convert2(this.num).from(this.kind).to(newKind);
      }
      return this.from(value, newKind);
    }
    static from(num, type) {
      if (Unit2.exists(type)) {
        return new Unit2(num, type);
      }
    }
    static exists(type) {
      ensureDefaultMappings2();
      return DEFAULT_MAPPINGS2[type] || DEFAULT_MAPPINGS2[type.toLowerCase()];
    }
    static convert(num, base, target) {
      return new Unit2(num, base).to(target);
    }
  });
  Expr2.define("frac", class Frac2 extends Expr2.Val {
    valueOf() {
      return this.num / this.kind;
    }
    toString() {
      return `${this.num}/${this.kind}`;
    }
    add(other) {
      if (other instanceof Frac2) {
        const num = this.num * other.kind + other.num * this.kind;
        const dem = this.kind * other.kind;
        const gcd = Frac2.gcd(num, dem);
        return new Frac2(num / gcd, dem / gcd);
      }
    }
    sub(other) {
      if (other instanceof Frac2) {
        return new Frac2(this.num, this.kind).add(new Frac2(-other.num, other.kind));
      }
    }
    mul(other) {
      if (other instanceof Frac2) {
        return new Frac2(this.num * other.num, this.kind * other.kind);
      }
    }
    div(other) {
      if (other instanceof Frac2) {
        return Frac2.from(this.kind * other.num / (this.num * other.kind));
      }
    }
    mod(other) {
      if (other instanceof Frac2) {
        return Frac2.from(this * 100 % (other * 100) / 100);
      }
    }
    static from(num) {
      const dec = num.toString().match(/\.0+\d/);
      const length = Math.max(dec ? dec[0].length : 3, 3);
      const div = parseInt(`1${Array.from({ length }).join("0")}`, 10);
      const base = Math.floor(parseFloat(num) * div) / div;
      const [left, right] = base.toString().split(".");
      if (!right)
        return parseFloat(left);
      const a22 = parseFloat(left + right);
      const b22 = 10 ** right.length;
      const factor = Frac2.gcd(a22, b22);
      if (left < 1) {
        return new Frac2(a22 / factor, b22 / factor);
      }
      return new Frac2(b22 / factor, a22 / factor);
    }
    static gcd(a22, b22) {
      if (!b22)
        return a22;
      return Frac2.gcd(b22, a22 % b22);
    }
  });
  Expr2.define("object", class Object_2 extends Expr2 {
  });
  Expr2.define("markup", class Tag2 extends Expr2 {
  });
  Expr2.define("literal", class Literal2 extends Expr2 {
  });
  Expr2.define("function", class Function_2 extends Expr2 {
  });
  Expr2.define("callable", class Callable2 extends Expr2 {
  });
  Expr2.define("statement", class Statement2 extends Expr2 {
  });
  Expr2.define("expression", class Expression2 extends Expr2 {
  });
  Expr2.define("namespaceStatement", class NamespaceStatement2 extends Expr2.Statement {
  });
  Expr2.define("tableStatement", class TableStatement2 extends Expr2.Statement {
  });
  Expr2.define("ifStatement", class IfStatement2 extends Expr2.Statement {
  });
  Expr2.define("elseStatement", class ElseStatement2 extends Expr2.Statement {
  });
  Expr2.define("okStatement", class OkStatement2 extends Expr2.Statement {
  });
  Expr2.define("errStatement", class ErrStatement2 extends Expr2.Statement {
  });
  Expr2.define("doStatement", class DoStatement2 extends Expr2.Statement {
  });
  Expr2.define("whileStatement", class WhileStatement2 extends Expr2.Statement {
  });
  Expr2.define("letStatement", class LetStatement2 extends Expr2.Statement {
  });
  Expr2.define("destructureStatement", class DestructureStatement2 extends Expr2.Statement {
  });
  Expr2.define("loopStatement", class LoopStatement2 extends Expr2.Statement {
  });
  Expr2.define("matchStatement", class MatchStatement2 extends Expr2.Statement {
  });
  Expr2.define("tryStatement", class TryStatement2 extends Expr2.Statement {
  });
  Expr2.define("checkStatement", class CheckStatement2 extends Expr2.Statement {
  });
  Expr2.define("rescueStatement", class RescueStatement2 extends Expr2.Statement {
  });
  Expr2.define("fromStatement", class FromStatement2 extends Expr2.Statement {
  });
  Expr2.define("importStatement", class ImportStatement2 extends Expr2.Statement {
  });
  Expr2.define("moduleStatement", class ModuleStatement2 extends Expr2.Statement {
  });
  Expr2.define("exportStatement", class ExportStatement2 extends Expr2.Statement {
  });
  Expr2.define("templateStatement", class TemplateStatement2 extends Expr2.Statement {
  });
  exports_prelude2 = {};
  __export2(exports_prelude2, {
    vals: () => vals2,
    take: () => take2,
    tail: () => tail2,
    size: () => size2,
    show: () => show2,
    rev: () => rev2,
    repr: () => repr22,
    render: () => render3,
    push: () => push2,
    pairs: () => pairs2,
    map: () => map2,
    list: () => list2,
    keys: () => keys2,
    items: () => items2,
    head: () => head2,
    get: () => get3,
    format: () => format22,
    filter: () => filter2,
    equals: () => equals2,
    drop: () => drop2,
    check: () => check22,
    cast: () => cast2
  });
  RE_PLACEHOLDER2 = /(?<!\{)\{([^{}]*)\}/g;
  RE_FORMATTING2 = /^([^:]*?)(?::(.*?[<^>](?=\d)|)(\d+|)([?bxo]|)(\.\d+|)([$^]|))?$/;
  RE_LAZY2 = Symbol("LAZY_SEQ");
  SAFE_GLOBALS2 = ["Promise", "RegExp", "Object", "Array", "String", "Number", "Math", "Date", "JSON"];
  SAFE_PRELUDE2 = Object.keys(exports_prelude2).reduce((prev, cur) => {
    prev[cur] = Expr2.unsafe(exports_prelude2[cur], cur, cur === "check");
    return prev;
  }, {});
  LAZY_DESCRIPTORS2 = new Set(["Loop", "Set"]);
  OPS_MUL_DIV2 = new Set([MUL2, DIV2]);
  OPS_PLUS_MINUS_MOD2 = new Set([PLUS2, MINUS2, MOD2]);
  OPS_LOGIC2 = new Set([LESS2, LESS_EQ2, GREATER2, GREATER_EQ2, EQUAL2, EXACT_EQ2, NOT_EQ2, LIKE2, NOT2]);
  SPACE_SCALE2 = {
    0: "0",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    px: "1px",
    auto: "auto"
  };
  OPACITY_SCALE2 = {
    0: "0",
    50: "0.5",
    100: "1"
  };
  COLORS2 = {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
    current: "currentColor",
    "gray-100": "#f3f4f6",
    "gray-200": "#e5e7eb",
    "gray-300": "#d1d5db",
    "gray-400": "#9ca3af",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
    "gray-700": "#374151",
    "gray-800": "#1f2937",
    "gray-900": "#111827",
    "blue-100": "#dbeafe",
    "blue-500": "#3b82f6",
    "blue-600": "#2563eb",
    "blue-700": "#1d4ed8",
    "red-500": "#ef4444",
    "red-600": "#dc2626",
    "green-500": "#22c55e",
    "green-600": "#16a34a",
    "yellow-500": "#eab308",
    "purple-500": "#a855f7",
    "pink-500": "#ec4899"
  };
  STATIC_RULES2 = {
    flex: "display:flex",
    grid: "display:grid",
    block: "display:block",
    inline: "display:inline",
    "inline-flex": "display:inline-flex",
    "inline-block": "display:inline-block",
    hidden: "display:none",
    "flex-col": "flex-direction:column",
    "flex-row": "flex-direction:row",
    "flex-wrap": "flex-wrap:wrap",
    "flex-1": "flex:1 1 0%",
    "flex-auto": "flex:1 1 auto",
    "flex-none": "flex:none",
    "items-start": "align-items:flex-start",
    "items-center": "align-items:center",
    "items-end": "align-items:flex-end",
    "items-stretch": "align-items:stretch",
    "justify-start": "justify-content:flex-start",
    "justify-center": "justify-content:center",
    "justify-end": "justify-content:flex-end",
    "justify-between": "justify-content:space-between",
    "justify-around": "justify-content:space-around",
    "w-full": "width:100%",
    "w-screen": "width:100vw",
    "w-auto": "width:auto",
    "h-full": "height:100%",
    "h-screen": "height:100vh",
    "h-auto": "height:auto",
    "min-w-0": "min-width:0",
    "min-h-0": "min-height:0",
    "text-xs": "font-size:0.75rem;line-height:1rem",
    "text-sm": "font-size:0.875rem;line-height:1.25rem",
    "text-base": "font-size:1rem;line-height:1.5rem",
    "text-lg": "font-size:1.125rem;line-height:1.75rem",
    "text-xl": "font-size:1.25rem;line-height:1.75rem",
    "text-2xl": "font-size:1.5rem;line-height:2rem",
    "text-3xl": "font-size:1.875rem;line-height:2.25rem",
    "text-4xl": "font-size:2.25rem;line-height:2.5rem",
    "font-light": "font-weight:300",
    "font-normal": "font-weight:400",
    "font-medium": "font-weight:500",
    "font-semibold": "font-weight:600",
    "font-bold": "font-weight:700",
    "text-left": "text-align:left",
    "text-center": "text-align:center",
    "text-right": "text-align:right",
    uppercase: "text-transform:uppercase",
    lowercase: "text-transform:lowercase",
    capitalize: "text-transform:capitalize",
    truncate: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap",
    border: "border-width:1px;border-style:solid",
    "border-0": "border-width:0",
    "border-t": "border-top-width:1px;border-top-style:solid",
    "border-b": "border-bottom-width:1px;border-bottom-style:solid",
    rounded: "border-radius:0.25rem",
    "rounded-md": "border-radius:0.375rem",
    "rounded-lg": "border-radius:0.5rem",
    "rounded-xl": "border-radius:0.75rem",
    "rounded-full": "border-radius:9999px",
    "rounded-none": "border-radius:0",
    shadow: "box-shadow:0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
    "shadow-md": "box-shadow:0 4px 6px rgba(0,0,0,0.1),0 2px 4px rgba(0,0,0,0.06)",
    "shadow-lg": "box-shadow:0 10px 15px rgba(0,0,0,0.1),0 4px 6px rgba(0,0,0,0.05)",
    "shadow-none": "box-shadow:none",
    relative: "position:relative",
    absolute: "position:absolute",
    fixed: "position:fixed",
    sticky: "position:sticky",
    "inset-0": "top:0;right:0;bottom:0;left:0",
    "overflow-hidden": "overflow:hidden",
    "overflow-auto": "overflow:auto",
    "overflow-scroll": "overflow:scroll",
    "cursor-pointer": "cursor:pointer",
    "cursor-default": "cursor:default",
    "select-none": "user-select:none",
    "pointer-events-none": "pointer-events:none",
    "box-border": "box-sizing:border-box",
    "sr-only": "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"
  };
  OPERATOR2 = new Map([
    [PLUS2, "+"],
    [MINUS2, "-"],
    [MUL2, "*"],
    [DIV2, "/"],
    [MOD2, "%"],
    [EQUAL2, "==="],
    [LESS2, "<"],
    [LESS_EQ2, "<="],
    [GREATER2, ">"],
    [GREATER_EQ2, ">="],
    [NOT_EQ2, "!="],
    [EXACT_EQ2, "==="],
    [OR2, "||"],
    [LIKE2, "~"],
    [PIPE2, "|>"]
  ]);
  exports_runtime2 = {};
  __export2(exports_runtime2, {
    untracked: () => untracked2,
    style: () => style3,
    signal: () => signal2,
    setDevtoolsActive: () => setDevtoolsActive2,
    renderShadow: () => renderShadow2,
    render: () => render22,
    read: () => read2,
    prop: () => prop2,
    on: () => on2,
    maybeEnableDevtools: () => maybeEnableDevtools2,
    isSignal: () => isSignal2,
    isDevtoolsActive: () => isDevtoolsActive2,
    html: () => html2,
    h: () => me2,
    getSignalRegistry: () => getSignalRegistry2,
    effect: () => effect2,
    devtoolsEnabledByQuery: () => devtoolsEnabledByQuery2,
    devtools: () => devtools3,
    computed: () => computed2,
    batch: () => batch2,
    SignalProxy: () => SignalProxy2
  });
  SIGNAL2 = Symbol("10x.signal");
  globalRegistry2 = (() => {
    if (!globalThis.__10x_signals) {
      globalThis.__10x_signals = new Map;
    }
    return globalThis.__10x_signals;
  })();
  componentObservers2 = new WeakMap;
  maybeEnableDevtools2();
  CODES2 = {
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
    redBright: [91, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    cyanBright: [96, 39],
    bgRedBright: [101, 49]
  };
  ansi2 = {};
  names2 = Object.keys(CODES2);
  names2.forEach((name) => {
    const [open, close] = CODES2[name];
    ansi2[name] = style22(open, close);
  });
  names2.forEach((first) => {
    names2.forEach((second) => {
      ansi2[first][second] = (value) => ansi2[first](ansi2[second](value));
    });
  });
  ansi_default2 = ansi2;
});

// src/index.js
init_ansi();
var import_wargs2 = __toESM(require_wargs(), 1);
import readline from "readline";
import os2 from "os";
import path3 from "path";
import fs3 from "fs";

// src/adapters/node/loader.js
import path from "path";
import fs from "fs";
var SAFE_UNITS = [];
var CACHED_MODULES = {};
var loader_default = ({ Env, Expr, execute }) => {
  Env.import = async (filepath, environment) => {
    if (!CACHED_MODULES[filepath]) {
      const code = fs.readFileSync(filepath).toString();
      const env = CACHED_MODULES[filepath] = new Env(environment);
      await execute(code, env);
    }
    return CACHED_MODULES[filepath];
  };
  Env.resolve = async (src, name, alias, environment) => {
    let file = path.resolve(src);
    let source;
    if (fs.existsSync(file)) {
      if (src.includes(".js"))
        return import(file);
      source = await Env.import(file, environment);
    } else {
      const exts = ["md", "js"];
      for (let i = 0, c = exts.length;i < c; i++) {
        file = path.resolve(`${src}.${exts[i]}`);
        if (fs.existsSync(file)) {
          if (exts[i] === "js")
            return import(file);
          source = await Env.import(file, environment);
          break;
        }
      }
    }
    return source || import(src);
  };
  Env.register = (num, kind) => {
    if (typeof num === "function") {
      SAFE_UNITS.push(num);
      return;
    }
    for (let i = 0, c = SAFE_UNITS.length;i < c; i++) {
      const retval = SAFE_UNITS[i](num, kind);
      if (retval) {
        return retval;
      }
    }
    return Expr.Unit.from(num, kind);
  };
};

// src/adapters/node/shared.js
var import_prompts = __toESM(require_prompts3(), 1);
var import_wargs = __toESM(require_wargs(), 1);
var import_fs_extra = __toESM(require_lib2(), 1);
import { Transform } from "stream";
import path2 from "path";
import os from "os";

// src/lib/std/time.js
var UNITS = {
  ms: 1,
  millisecond: 1,
  s: 1000,
  second: 1000,
  m: 60000,
  minute: 60000,
  h: 3600000,
  hour: 3600000,
  d: 86400000,
  day: 86400000,
  w: 604800000,
  week: 604800000,
  M: 2592000000,
  month: 2592000000,
  y: 31536000000,
  year: 31536000000
};
function toDate(input) {
  if (input === undefined || input === null)
    return new Date;
  if (input instanceof Date)
    return input;
  if (typeof input === "number")
    return new Date(input);
  return new Date(input);
}
function now() {
  return Date.now();
}
function today() {
  const d = new Date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function format(date, pattern, locale) {
  const d = toDate(date);
  if (!pattern || pattern === "iso") {
    return d.toISOString();
  }
  const opts = {};
  if (pattern.includes("date")) {
    opts.dateStyle = "full";
  }
  if (pattern.includes("time")) {
    opts.timeStyle = "long";
  }
  if (Object.keys(opts).length) {
    return new Intl.DateTimeFormat(locale || "en", opts).format(d);
  }
  const pad = (n) => String(n).padStart(2, "0");
  return pattern.replace(/YYYY/g, d.getFullYear()).replace(/YY/g, String(d.getFullYear()).slice(-2)).replace(/MM/g, pad(d.getMonth() + 1)).replace(/M/g, d.getMonth() + 1).replace(/DD/g, pad(d.getDate())).replace(/D/g, d.getDate()).replace(/HH/g, pad(d.getHours())).replace(/H/g, d.getHours()).replace(/mm/g, pad(d.getMinutes())).replace(/m/g, d.getMinutes()).replace(/ss/g, pad(d.getSeconds())).replace(/s/g, d.getSeconds());
}
function add(date, amount, unit) {
  const d = toDate(date);
  const ms = UNITS[unit] || UNITS[unit.toLowerCase()] || 1;
  return new Date(d.getTime() + amount * ms);
}
function subtract(date, amount, unit) {
  return add(date, -amount, unit);
}
function startOf(date, unit) {
  const d = toDate(date);
  switch (unit.toLowerCase()) {
    case "day":
    case "d":
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    case "month":
    case "m":
      return new Date(d.getFullYear(), d.getMonth(), 1);
    case "year":
    case "y":
      return new Date(d.getFullYear(), 0, 1);
    case "hour":
    case "h":
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    case "minute":
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
    default:
      return d;
  }
}
function endOf(date, unit) {
  const d = toDate(date);
  switch (unit.toLowerCase()) {
    case "day":
    case "d":
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    case "month":
    case "m":
      return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    case "year":
    case "y":
      return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
    default:
      return d;
  }
}
function parse(str) {
  return new Date(str);
}
function dayOfWeek(date) {
  return toDate(date).getDay();
}
function dayOfMonth(date) {
  return toDate(date).getDate();
}
function month(date) {
  return toDate(date).getMonth() + 1;
}
function year(date) {
  return toDate(date).getFullYear();
}
function hour(date) {
  return toDate(date).getHours();
}
function minute(date) {
  return toDate(date).getMinutes();
}
function diff(a, b, unit) {
  const d1 = toDate(a);
  const d2 = toDate(b);
  const ms = Math.abs(d1.getTime() - d2.getTime());
  const divisor = UNITS[unit] || UNITS[unit.toLowerCase()] || 1;
  return Math.floor(ms / divisor);
}
var time_default = {
  now,
  today,
  format,
  add,
  subtract,
  startOf,
  endOf,
  parse,
  dayOfWeek,
  dayOfMonth,
  month,
  year,
  hour,
  minute,
  diff
};

// src/lib/std/num.js
function format2(value, pattern, locale) {
  const num = typeof value === "object" ? value.valueOf() : value;
  if (!pattern) {
    return new Intl.NumberFormat(locale || "en").format(num);
  }
  if (pattern.startsWith("$") || pattern.startsWith("€") || pattern.startsWith("£")) {
    const currency = pattern[0] === "$" ? "USD" : pattern[0] === "€" ? "EUR" : "GBP";
    return new Intl.NumberFormat(locale || "en", {
      style: "currency",
      currency
    }).format(num);
  }
  if (pattern.includes("%")) {
    return new Intl.NumberFormat(locale || "en", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num / 100);
  }
  const opts = {};
  if (pattern.includes(",")) {
    opts.useGrouping = true;
  }
  const decimals = pattern.match(/\.(\d+)/);
  if (decimals) {
    opts.minimumFractionDigits = parseInt(decimals[1], 10);
    opts.maximumFractionDigits = parseInt(decimals[1], 10);
  }
  return new Intl.NumberFormat(locale || "en", opts).format(num);
}
function round(value, decimals) {
  const num = typeof value === "object" ? value.valueOf() : value;
  const d = decimals ?? 0;
  const factor = Math.pow(10, d);
  return Math.round(num * factor) / factor;
}
function floor(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.floor(num);
}
function ceil(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.ceil(num);
}
function truncate(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.trunc(num);
}
function clamp(value, min, max) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.min(Math.max(num, min), max);
}
function min(...values) {
  const nums = values.map((v) => typeof v === "object" ? v.valueOf() : v);
  return Math.min(...nums);
}
function max(...values) {
  const nums = values.map((v) => typeof v === "object" ? v.valueOf() : v);
  return Math.max(...nums);
}
function abs(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.abs(num);
}
function pow(base, exp) {
  const b = typeof base === "object" ? base.valueOf() : base;
  const e = typeof exp === "object" ? exp.valueOf() : exp;
  return Math.pow(b, e);
}
function sqrt(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.sqrt(num);
}
function log(value, base) {
  const num = typeof value === "object" ? value.valueOf() : value;
  if (base) {
    const b = typeof base === "object" ? base.valueOf() : base;
    return Math.log(num) / Math.log(b);
  }
  return Math.log(num);
}
function sin(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.sin(num);
}
function cos(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.cos(num);
}
function tan(value) {
  const num = typeof value === "object" ? value.valueOf() : value;
  return Math.tan(num);
}
function random(min2, max2) {
  if (min2 === undefined)
    return Math.random();
  if (max2 === undefined)
    return Math.random() * min2;
  return min2 + Math.random() * (max2 - min2);
}
var num_default = {
  format: format2,
  round,
  floor,
  ceil,
  truncate,
  clamp,
  min,
  max,
  abs,
  pow,
  sqrt,
  log,
  sin,
  cos,
  tan,
  random
};

// src/lib/std/uuid.js
function v4() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const hex = "0123456789abcdef";
  const chars = new Array(36);
  for (let i = 0;i < 36; i += 1) {
    chars[i] = hex[Math.floor(Math.random() * 16)];
  }
  chars[8] = "-";
  chars[13] = "-";
  chars[14] = "4";
  chars[18] = "-";
  chars[23] = "-";
  chars[19] = hex[8 + Math.floor(Math.random() * 4)];
  return chars.join("");
}
var uuid_default = {
  v4
};

// src/lib/std/http.js
async function get(url, options) {
  const res = await fetch(url, {
    method: "GET",
    headers: options?.headers
  });
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json(),
    blob: () => res.blob()
  };
}
async function post(url, body, options) {
  const headers = { "Content-Type": "application/json", ...options?.headers };
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json(),
    blob: () => res.blob()
  };
}
async function put(url, body, options) {
  const headers = { "Content-Type": "application/json", ...options?.headers };
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body)
  });
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json()
  };
}
async function del(url, options) {
  const res = await fetch(url, {
    method: "DELETE",
    headers: options?.headers
  });
  return {
    ok: res.ok,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text: () => res.text(),
    json: () => res.json()
  };
}
var http_default = {
  get,
  post,
  put,
  del
};

// src/adapters/node/shared.js
var cwd = process.cwd();
function call(cb) {
  return (p, ...a) => new Promise((k, r) => cb(p, ...a, (e, d) => e ? r(e) : k(d)));
}
function input() {
  if (process.stdin.isTTY)
    return null;
  return new Promise((ok) => {
    process.stdin.on("end", () => ok(null)).pipe(new Transform({
      transform(entry, enc, callback) {
        ok(Buffer.from(entry, enc).toString());
        callback();
      }
    }));
  });
}
function promptFn(...args) {
  const o = args.reduce((p, c) => p.concat(c), []);
  return import_prompts.default(o.map((_o) => ({
    type: _o.type,
    name: _o.name,
    message: _o.message,
    validate: _o.validate
  })));
}
function string(cb) {
  return (...args) => cb(...args).then((data) => data.toString());
}
var shared_default = ({ Env }, argv = process.argv.slice(2)) => {
  const _argv = argv;
  Env.shared = {
    Proc: {
      cwd: () => cwd,
      chdir: (p) => {
        cwd = path2.resolve(cwd, p);
      },
      setenv: (k, v) => {
        process.env[k] = String(v);
      },
      unsetenv: (k) => {
        delete process.env[k];
      },
      homedir: () => os.homedir(),
      tmpdir: () => os.tmpdir(),
      getenv: (k) => process.env[k],
      getopts: (p) => import_wargs.default(_argv, p),
      exit: (n) => {
        process.exit(n);
      },
      wait: (ms) => new Promise((ok) => setTimeout(ok, ms))
    },
    IO: {
      input: (...a) => a.length ? promptFn(...a) : input(),
      puts: (...a) => {
        process.stdout.write(a.join(""));
      },
      err: (...a) => {
        process.stderr.write(a.join(""));
      }
    },
    Fs: {
      read: string(call(import_fs_extra.default.readFile)),
      write: call(import_fs_extra.default.outputFile),
      readJSON: string(call(import_fs_extra.default.readJson)),
      writeJSON: call(import_fs_extra.default.outputJson),
      copyFile: call(import_fs_extra.default.copyFile),
      move: call(import_fs_extra.default.move),
      readdir: call(import_fs_extra.default.readdir),
      pathExists: call(import_fs_extra.default.pathExists),
      stat: call(import_fs_extra.default.stat),
      emptyDir: call(import_fs_extra.default.emptyDir),
      mkdirp: call(import_fs_extra.default.mkdirp),
      remove: call(import_fs_extra.default.remove),
      ensureDir: call(import_fs_extra.default.ensureDir),
      ensureFile: call(import_fs_extra.default.ensureFile)
    },
    Time: time_default,
    Num: num_default,
    UUID: uuid_default,
    Http: http_default
  };
};

// src/adapters/node/index.js
function createNodeAdapter(argv = process.argv.slice(2)) {
  return {
    name: "node",
    setup(runtime) {
      loader_default(runtime);
      shared_default(runtime, argv);
    }
  };
}

// src/index.js
var Env3;
var Expr3;
var Token3;
var Parser3;
var main3;
var debug3;
var format7;
var execute3;
var serialize3;
var evaluate3;
var useCurrencies3;
var createEnv4;
var applyAdapter4;
var compile3;
var compileBundle3;
var runtimeReady = Promise.resolve().then(() => (init_main(), exports_main)).catch(() => Promise.resolve().then(() => (init_main2(), exports_main2))).then((x10) => {
  ({
    Env: Env3,
    Expr: Expr3,
    Token: Token3,
    Parser: Parser3,
    main: main3,
    debug: debug3,
    format: format7,
    execute: execute3,
    serialize: serialize3,
    evaluate: evaluate3,
    useCurrencies: useCurrencies3,
    createEnv: createEnv4,
    applyAdapter: applyAdapter4,
    compile: compile3,
    compileBundle: compileBundle3
  } = x10);
});
var HISTORY_FILE = path3.join(os2.homedir(), ".10x_history");
var MAX_HISTORY4 = 1000;
var argv3 = import_wargs2.default(process.argv.slice(2), {
  boolean: ["trace", "color", "print", "inline", "source", "lint", "check", "fix", "dry-run", "bundle"]
});
var nodeAdapter = createNodeAdapter(process.argv.slice(2));
function annotationNameRE(name) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function collectSourceFacts(source) {
  const lines = String(source || "").split(`
`);
  const annotations = [];
  const bindings = [];
  lines.forEach((line, index) => {
    const ann = line.match(/^\s*([A-Za-z_][A-Za-z0-9_!?-]*)\s*::\s*(.+?)\.\s*$/);
    if (ann) {
      annotations.push({
        name: ann[1],
        typeText: ann[2].trim(),
        line: index
      });
    }
    const bind = line.match(/^\s*([A-Za-z_][A-Za-z0-9_!?-]*)\s*=/);
    if (bind) {
      bindings.push({
        name: bind[1],
        line: index
      });
    }
  });
  return { lines, annotations, bindings };
}
function lintAnnotationSource(source) {
  const { lines, annotations } = collectSourceFacts(source);
  const warnings = [];
  const seen = new Map;
  for (const ann of annotations) {
    if (seen.has(ann.name)) {
      warnings.push({
        line: ann.line,
        message: `Duplicate annotation for \`${ann.name}\``
      });
    }
    seen.set(ann.name, ann.line);
    let cursor = ann.line + 1;
    while (cursor < lines.length) {
      const line = lines[cursor];
      if (!line.trim() || /^\s*\/\//.test(line)) {
        cursor += 1;
        continue;
      }
      const re3 = new RegExp(`^\\s*${annotationNameRE(ann.name)}\\s*=`);
      if (!re3.test(line)) {
        warnings.push({
          line: ann.line,
          message: `Orphan annotation for \`${ann.name}\` (next statement is not \`${ann.name} = ...\`)`
        });
      }
      break;
    }
    if (cursor >= lines.length) {
      warnings.push({
        line: ann.line,
        message: `Orphan annotation for \`${ann.name}\` (no following binding)`
      });
    }
  }
  return warnings;
}
function lintMarkdown(source) {
  const warnings = [];
  const lines = source.split(`
`);
  let inFence = false;
  let fenceOpenLine = -1;
  let fenceChar = "";
  for (let i3 = 0;i3 < lines.length; i3++) {
    const line = lines[i3];
    const trimmed = line.trim();
    if (!inFence && /^(`{3,}|"{3,})/.test(trimmed)) {
      inFence = true;
      fenceChar = trimmed[0];
      fenceOpenLine = i3;
      if (!/^(`{3,}|"{3,})\w/.test(trimmed)) {
        warnings.push({ line: i3, code: "missing-lang-tag", message: "Code block missing language tag — evaluator will skip it" });
      }
      continue;
    }
    if (inFence && trimmed.startsWith(fenceChar.repeat(3))) {
      inFence = false;
      fenceOpenLine = -1;
      continue;
    }
    if (inFence)
      continue;
    if (/^---+$/.test(trimmed)) {
      warnings.push({ line: i3, code: "thematic-break", message: "`---` evaluates as subtraction in 10x — use `***` instead" });
    }
    if (i3 === 0 && trimmed === "---") {
      warnings.push({ line: i3, code: "frontmatter", message: "Frontmatter `---` block is not supported — evaluates as subtraction" });
    }
    if (/^#{1,6}\s.+\.$/.test(trimmed) || /^[-*+]\s.+\.$/.test(trimmed)) {
      warnings.push({ line: i3, code: "trailing-dot", message: "Trailing `.` on heading/list item may conflict with EOL token" });
    }
    if (/^\s*@on\b/.test(trimmed) && /\s@shadow\.\s*$/.test(trimmed)) {
      warnings.push({
        line: i3,
        code: "on-shadow-order",
        message: "Prefer canonical order: `@on ... @shadow <handler>.`"
      });
    }
  }
  if (inFence) {
    warnings.push({ line: fenceOpenLine, code: "unclosed-fence", message: "Unclosed code fence" });
  }
  return warnings;
}
function fixMarkdown(source) {
  const lines = source.split(`
`);
  let inFence = false;
  return lines.map((line, i3) => {
    const trimmed = line.trim();
    if (!inFence && /^(`{3,}|"{3,})/.test(trimmed)) {
      inFence = true;
      if (!/^(`{3,}|"{3,})\w/.test(trimmed)) {
        return line.replace(/^(`{3,}|"{3,})/, "$110x");
      }
    }
    if (inFence && /^(`{3,}|"{3,})$/.test(trimmed)) {
      inFence = false;
    }
    if (inFence)
      return line;
    if (/^---+$/.test(trimmed))
      return line.replace(/^-+/, "***");
    if (/^#{1,6}\s.+\.$/.test(trimmed) || /^[-*+]\s.+\.$/.test(trimmed)) {
      return line.replace(/\.$/, "");
    }
    if (/^\s*@on\b/.test(trimmed) && /\s@shadow\.\s*$/.test(trimmed)) {
      const fixed = line.match(/^(\s*@on\s+\S+\s+("[^"]+"|'[^']+'|\S+)\s+)(.+?)\s+@shadow\.\s*$/);
      if (fixed) {
        return `${fixed[1]}@shadow ${fixed[3]}.`;
      }
    }
    return line;
  }).join(`
`);
}
function inferBindingRuntimeType(token) {
  if (!token)
    return "unknown";
  if (token.isCallable || token.isFunction)
    return "fn";
  if (token.isTag)
    return "tag";
  if (token.isObject)
    return "record";
  if (token.isRange)
    return Array.isArray(token.value) ? "list" : "range";
  if (token.isNumber) {
    const kind = token?.value?.kind ?? token?.value?.value?.kind;
    if (typeof kind === "string" && kind.trim())
      return `unit<${kind.trim()}>`;
    return "number";
  }
  if (token.isString)
    return "string";
  if (token.isSymbol)
    return "symbol";
  if (token.value === true || token.value === false)
    return "bool";
  if (token.value === null)
    return "nil";
  return "unknown";
}
function canonicalTypeName3(typeName) {
  const text = String(typeName || "").trim().toLowerCase();
  if (!text)
    return "";
  if (text === "num" || text === "number")
    return "number";
  if (text === "str" || text === "string")
    return "string";
  if (text === "bool" || text === "boolean")
    return "boolean";
  return text;
}
function toAnnotationTypeName(typeName) {
  const canon = canonicalTypeName3(typeName);
  if (canon === "number")
    return "num";
  if (canon === "string")
    return "str";
  if (canon === "boolean")
    return "bool";
  return String(typeName || "any");
}
async function runTypeChecksForFile(source) {
  const env = createEnv4(nodeAdapter);
  await execute3(source, env);
  const { annotations, bindings } = collectSourceFacts(source);
  const annByName = new Map;
  annotations.forEach((ann) => annByName.set(ann.name, ann.typeText));
  const warnings = [];
  const inferredByName = new Map;
  for (const bind of bindings) {
    const token = env?.locals?.[bind.name]?.body?.[0];
    const inferred = inferBindingRuntimeType(token);
    const inferredAnn = toAnnotationTypeName(inferred);
    inferredByName.set(bind.name, inferred);
    const expected = annByName.get(bind.name);
    if (!expected) {
      warnings.push({
        line: bind.line,
        message: `Unannotated binding \`${bind.name}\` (inferred: ${inferredAnn})`,
        hint: true
      });
      continue;
    }
    if (expected && inferred !== "unknown" && canonicalTypeName3(expected) !== canonicalTypeName3(inferred)) {
      warnings.push({
        line: bind.line,
        message: `Type mismatch for \`${bind.name}\`: annotated \`${expected}\`, inferred \`${inferredAnn}\``
      });
    }
  }
  return { warnings, inferredByName, annotations, bindings };
}
async function prelude() {
  await runtimeReady;
  process.stderr.write(`\r${ansi_default.gray("Checking for installed currencies...")}\r`);
  await useCurrencies3({
    key: path3.join(os2.tmpdir(), `currencies-${new Date().toISOString().substr(0, 13)}.json`),
    read: (path4) => JSON.parse(fs3.readFileSync(path4, "utf8")),
    write: fs3.writeFileSync,
    exists: fs3.existsSync,
    resolve: async () => {
      const sources = [
        "https://api.exchangeratesapi.io/latest",
        "https://api.exchangerate-api.com/v4/latest/EUR"
      ];
      for (const url of sources) {
        try {
          const res = await fetch(url);
          if (res.ok)
            return res.json();
        } catch (_3) {}
      }
      throw new Error("Failed to fetch currency info");
    }
  });
  process.stderr.write("\r\x1B[K");
  applyAdapter4(nodeAdapter);
}
function loadHistory() {
  try {
    if (fs3.existsSync(HISTORY_FILE)) {
      return fs3.readFileSync(HISTORY_FILE, "utf8").split(`
`).filter(Boolean);
    }
  } catch {}
  return [];
}
function saveHistory(history) {
  try {
    const lines = history.slice(-MAX_HISTORY4);
    fs3.writeFileSync(HISTORY_FILE, lines.join(`
`) + `
`, "utf8");
  } catch {}
}
async function repl() {
  await runtimeReady;
  const history = loadHistory();
  let historyIndex = history.length;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    history: history.length > 0 ? history : undefined,
    historySize: MAX_HISTORY4,
    removeHistoryDuplicates: true
  });
  const env = createEnv4(nodeAdapter);
  const info = argv3.flags.trace;
  const raw = argv3.flags.raw;
  const prompt = (q3) => new Promise((resolve) => rl.question(q3, resolve));
  rl.on("close", () => {
    saveHistory(rl.history);
  });
  while (true) {
    const code = await prompt(info ? ">>> " : "> ");
    if (eject(code)) {
      rl.close();
      break;
    }
    if (!code.trim())
      continue;
    if (info)
      console.time("time");
    try {
      const { result, error, info: details } = await evaluate3(Parser3.getAST(code, "parse", env), env, argv3.flags.trace);
      if (raw) {
        console.log(JSON.stringify(result));
      } else if (result !== undefined) {
        console.log(serialize3(result));
      }
      if (details) {
        if (info)
          console.timeEnd("time");
        if (details.enabled)
          console.log(format7(details));
      }
    } catch (e3) {
      console.error(debug3(e3, code));
    }
  }
}
function eject(code) {
  if (code === null || code === undefined) {
    console.log("exit");
    return true;
  }
  if (code === "exit" || code === "quit" || code === "exit()" || code === "quit()") {
    console.log("exit");
    return true;
  }
  return false;
}
async function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}
function toAliasEntries(rawAlias) {
  const list3 = Array.isArray(rawAlias) ? rawAlias : rawAlias ? [rawAlias] : [];
  return list3.flatMap((item) => String(item).split(",")).map((item) => item.trim()).filter(Boolean).map((entry) => {
    const idx = entry.indexOf("=");
    if (idx <= 0)
      return null;
    const key = entry.slice(0, idx).trim();
    const target = entry.slice(idx + 1).trim();
    if (!key || !target)
      return null;
    return [key, target];
  }).filter(Boolean);
}
function resolveWithAliases(specifier, importerPath, aliasEntries) {
  const importerDir = path3.dirname(path3.resolve(importerPath));
  const resolvePath = (value) => {
    const withExt = path3.extname(value) ? value : `${value}.md`;
    return path3.resolve(importerDir, withExt);
  };
  if (specifier.startsWith("."))
    return resolvePath(specifier);
  for (const [key, rawTarget] of aliasEntries) {
    if (specifier === key || specifier.startsWith(`${key}/`)) {
      const tail3 = specifier === key ? "" : specifier.slice(key.length);
      const mapped = rawTarget.endsWith("/") && tail3.startsWith("/") ? `${rawTarget}${tail3.slice(1)}` : `${rawTarget}${tail3}`;
      return resolvePath(mapped);
    }
  }
  throw new Error(`Cannot resolve bundled import "${specifier}" from ${importerPath}. Use --alias <prefix=path> or keep it as runtime import.`);
}
async function cli() {
  await runtimeReady;
  if (argv3.flags.lint || argv3.flags.check || argv3.flags.fix) {
    const files = argv3._;
    let hasError = false;
    const runCheck = !!argv3.flags.check || !!argv3.flags.fix;
    const runFix = !!argv3.flags.fix;
    const dryRun = !!(argv3.flags["dry-run"] || argv3.flags.dryRun || argv3.flags.dry_run);
    if (runCheck || runFix) {
      await prelude();
    }
    for (const file of files) {
      const filePath = file + (!file.includes(".") ? ".md" : "");
      const src = fs3.readFileSync(filePath).toString();
      try {
        Parser3.getAST(src, "parse");
        const lintWarnings = lintAnnotationSource(src);
        lintWarnings.forEach((w) => {
          console.error(`${file}:${w.line + 1}:1: warning: ${w.message}`);
        });
        const mdWarnings = lintMarkdown(src);
        mdWarnings.forEach((w) => {
          console.error(`${file}:${w.line + 1}:1: warning: ${w.message}`);
        });
        let checkWarnings = [];
        let fixedOutput = null;
        if (runFix) {
          fixedOutput = fixMarkdown(src);
        }
        if (runCheck || runFix) {
          try {
            const checked = await runTypeChecksForFile(fixedOutput || src);
            checkWarnings = checked.warnings;
            checkWarnings.forEach((w) => {
              const level = w.hint ? "hint" : "warning";
              console.error(`${file}:${w.line + 1}:1: ${level}: ${w.message}`);
            });
            if (runFix && fixedOutput !== src) {
              if (dryRun) {
                console.log(`${file}: fix available (dry-run)`);
              } else {
                fs3.writeFileSync(filePath, fixedOutput, "utf8");
                console.log(`${file}: fixed`);
              }
            }
          } catch (e3) {
            const line = Number.isFinite(e3.line) ? e3.line + 1 : 1;
            const col = Number.isFinite(e3.col) ? e3.col + 1 : 1;
            console.error(`${file}:${line}:${col}: ${e3.name}: ${e3.message}`);
            hasError = true;
            continue;
          }
        }
        if (!runFix) {
          console.log(`${file}: ok`);
        }
        if (lintWarnings.some((w) => !w.hint) || mdWarnings.length || checkWarnings.some((w) => !w.hint)) {
          hasError = true;
        }
      } catch (e3) {
        const line = Number.isFinite(e3.line) ? e3.line + 1 : 1;
        const col = Number.isFinite(e3.col) ? e3.col + 1 : 1;
        console.error(`${file}:${line}:${col}: ${e3.name}: ${e3.message}`);
        hasError = true;
      }
    }
    process.exit(hasError ? 1 : 0);
  }
  const { _: _3, raw, ...flags } = argv3;
  if (_3[0] === "compile") {
    const inputArg = _3[1];
    const outputArg = _3[2];
    if (!inputArg) {
      throw new Error("Missing input file. Usage: 10x compile <input.md> [output.mjs] [--runtime ./runtime] [--bundle] [--alias @app=./src]");
    }
    const inputFile = inputArg.includes(".") ? inputArg : `${inputArg}.md`;
    const runtimePath = argv3.flags.runtime || "./runtime";
    const aliasEntries = toAliasEntries(argv3.flags.alias);
    const compiled = argv3.flags.bundle ? compileBundle3(inputFile, {
      runtimePath,
      readFile: (modulePath) => fs3.readFileSync(modulePath, "utf8"),
      shouldBundleImport: (specifier) => {
        const isRelativeOrAlias = specifier.startsWith(".") || aliasEntries.some(([key]) => specifier === key || specifier.startsWith(`${key}/`));
        return isRelativeOrAlias;
      },
      resolveModule: (specifier, importerPath) => resolveWithAliases(specifier, importerPath, aliasEntries)
    }) : compile3(fs3.readFileSync(inputFile, "utf8"), { runtimePath });
    if (outputArg) {
      fs3.writeFileSync(outputArg, `${compiled}
`, "utf8");
    } else {
      process.stdout.write(`${compiled}
`);
    }
    return;
  }
  let code = "";
  if (!_3.length && !raw.length && !process.stdin.isTTY) {
    code = await readStdin();
  }
  if (!code.length && !_3.length && !raw.length) {
    return repl();
  }
  if (_3.length) {
    const file = _3[0] + (!_3[0].includes(".") ? ".md" : "");
    code += fs3.readFileSync(file).toString();
  }
  if (raw.length) {
    if (code.trim().length) {
      code += `;
`;
    }
    code += raw.join(" ");
  }
  if (flags.print) {
    await format7(code, flags.color, flags.inline);
  } else {
    await main3(code, flags.source, null, flags.trace, false, prelude);
  }
}

// src/cli.js
cli().catch((error) => {
  console.error(error);
  process.exit(1);
});
