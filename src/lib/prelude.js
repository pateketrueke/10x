import {
  assert, raise, serialize, hasDiff, repr as kindOf,
  isOR, isSome, isUnit, isBlock, isNumber,
} from './helpers';

import {
  SYMBOL,
} from './tree/symbols';

import Expr from './tree/expr';
import { renderTag } from './tag';
import Range from './range';

const RE_PLACEHOLDER = /(?<!\{)\{([^{}]*)\}/g;
const RE_FORMATTING = /^([^:]*?)(?::(.*?[<^>](?=\d)|)(\d+|)([?bxo]|)(\.\d+|)([$^]|))?$/;
export const RE_LAZY = Symbol('LAZY_SEQ');

function isRangeLike(input) {
  return input instanceof Range || (input && typeof input.getIterator === 'function' && typeof input.run === 'function');
}

function isLazySeq(input) {
  return !!(input && input[RE_LAZY]);
}

function asRange(input) {
  if (isRangeLike(input)) return input;

  if (input && input.value) {
    return asRange(input.value);
  }

  if (
    input
    && Array.isArray(input.begin)
    && Array.isArray(input.end)
    && input.begin.length
  ) {
    const begin = input.begin[0];
    const end = input.end.length ? input.end[0] : undefined;
    return Range.from(begin, end);
  }

  return null;
}

function collectRange(range, limit = Infinity, offset = 0) {
  const seq = [];
  let index = 0;

  if (range.infinite && limit === Infinity) {
    raise('Infinite range requires explicit limit');
  }

  const iterator = range.getIterator();

  for (let next = iterator.next(); next.done !== true; next = iterator.next(), index++) {
    if (index < offset) continue;

    seq.push(range.alpha ? String.fromCharCode(next.value) : next.value);
    if (seq.length >= limit) break;
  }

  return seq;
}

function toToken(value) {
  return value instanceof Expr ? value : Expr.value(value);
}

function fromToken(value) {
  return value instanceof Expr ? value.valueOf() : value;
}

function toLazy(input) {
  if (isLazySeq(input)) return input;
  if (input && input.value) return toLazy(input.value);

  const range = asRange(input);
  
  if (range) {
    return {
      [RE_LAZY]: true,
      source: range,
      ops: [],
      infinite: !!range.infinite,
    };
  }

  return null;
}

function appendLazy(input, op) {
  const lazy = toLazy(input);

  if (!lazy) return null;

  return {
    [RE_LAZY]: true,
    source: lazy.source,
    ops: lazy.ops.concat(op),
    infinite: lazy.infinite,
  };
}

export async function collectLazy(input, limit = Infinity, offset = 0) {
  const lazy = toLazy(input);

  if (!lazy) return null;
  if (lazy.infinite && limit === Infinity) raise('Infinite range requires explicit limit');

  let iterator;

  if (isRangeLike(lazy.source)) {
    iterator = lazy.source.getIterator();
  } else if (Array.isArray(lazy.source) || typeof lazy.source[Symbol.iterator] === 'function') {
    iterator = lazy.source[Symbol.iterator]();
  } else {
    raise('Input is not iterable');
  }

  const seq = [];
  let index = 0;

  for (let next = iterator.next(); next.done !== true; next = iterator.next(), index++) {
    if (index < offset) continue;

    let value = next.value;

    if (isRangeLike(lazy.source) && lazy.source.alpha) {
      value = String.fromCharCode(value);
    }

    let keep = true;
    let token = toToken(value);

    for (let i = 0, c = lazy.ops.length; i < c; i++) {
      const op = lazy.ops[i];

      if (op.type === 'map') {
        token = toToken(await op.callback(token));
      }

      if (op.type === 'filter') {
        keep = !!(await op.callback(token));
        if (!keep) break;
      }
    }

    if (!keep) continue;

    seq.push(fromToken(token));
    if (seq.length >= limit) break;
  }

  return seq;
}

export function equals(a, b, weak) {
  if (typeof a === 'undefined') raise('Missing left value');
  if (typeof b === 'undefined') raise('Missing right value');

  return !hasDiff(a, b, weak);
}

export function items(...args) {
  return args.reduce((p, c) => p.concat(c), []);
}

export function show(...args) {
  return serialize(args);
}

export function render(input) {
  if (typeof input === 'undefined') raise('No input to render');

  if (input && input.isTag) {
    return renderTag(input.value);
  }

  if (input && input.isString) {
    return input.valueOf();
  }

  return serialize(input);
}

export function cast(token, target) {
  if (!token) raise('Missing input to cast');
  if (!target) raise('Missing type to cast');

  assert(target, null, SYMBOL);

  let value;

  switch (target.get()) {
    case ':number': value = parseFloat(token.get()); break;
    case ':string': value = token.get().toString(); break;
    default: raise(`Invalid cast to ${target.get()}`);
  }

  return value;
}

export function repr(token) {
  let type;

  if (token.isTag) type = 'markup';
  else if (token.isObject) type = 'object';
  else if (token.isFunction) type = 'function';
  else if (token.isCallable) type = 'definition';
  else if (token.isSymbol) type = 'symbol';
  else if (token.isRange) type = 'range';
  else if (token.isMarkup) type = 'markup';
  else type = kindOf(token.type).toLowerCase();

  return Expr.symbol(`:${type}`);
}

export function size(token) {
  let obj;

  if (token.isTag) obj = token.value.children || [];
  else
  if (token.isFunction) obj = token.valueOf().target;
  else if (token.isObject) obj = Object.keys(token.valueOf());
  else if (token.isScalar || token.isRange) obj = token.valueOf();
  else obj = token;

  return obj.length - (token.isSymbol ? 1 : 0);
}

export function get(target, ...props) {
  const isObject = target.length === 1 && (target[0].isObject || target[0].isRange);
  const isArray = isObject && target[0].isRange;
  const input = isObject ? target[0].valueOf() : target;

  return props.reduce((prev, cur) => prev.concat(isObject && !isArray ? input[cur].getBody() : input[cur]), []);
}

export function push(target, ...sources) {
  if (!target) raise('No target given');

  if (!(target.isObject
    || target.isString
    || target.isNumber
    || target.isRange)) raise('Invalid target');

  sources.forEach(sub => {
    if (target.isObject && sub.isObject) Object.assign(target.value, sub.value);
    if (target.isString) target.value += sub.valueOf();

    if (target.isRange) {
      if (sub.isRange) target.value.push(...sub.value);
      else target.value.push(sub);
    }

    if (target.isNumber) {
      target.value = (target.valueOf() + sub.valueOf()).toString();
    }
  });

  return target;
}

export function list(input) {
  if (!input) raise('No input to list given');

  let data;

  const range = asRange(input);

  if (Array.isArray(input)) {
    data = input;
  } else if (range) {
    data = collectRange(range);
  } else {
    if (!input.isIterable) raise('Input is not iterable');

    data = input.getArgs() || input.getBody() || input.valueOf();
  }

  return data;
}

export async function head(input) {
  const lazy = await collectLazy(input, 1);

  if (lazy) {
    if (!lazy.length) raise('head: empty list');
    return lazy[0];
  }

  const range = asRange(input);

  if (range) {
    const [first] = collectRange(range, 1);
    if (typeof first === 'undefined') raise('head: empty list');
    return first;
  }

  const [first] = list(input);

  if (typeof first === 'undefined') raise('head: empty list');
  return first;
}

export async function tail(input) {
  const lazy = await collectLazy(input, Infinity, 1);

  if (lazy) {
    return lazy;
  }

  const range = asRange(input);

  if (range) {
    return collectRange(range, Infinity, 1);
  }

  return list(input).slice(1);
}

export async function take(input, length) {
  const lazy = await collectLazy(input, length || 1);

  if (lazy) {
    return lazy;
  }

  const range = asRange(input);

  if (range) {
    return collectRange(range, length || 1);
  }

  return list(input).slice(0, length || 1);
}

export async function drop(input, length, offset) {
  const lazy = toLazy(input);

  if (lazy && lazy.infinite && typeof offset === 'undefined') {
    const amount = length ? length.valueOf() : 1;

    return appendLazy(input, {
      type: 'filter',
      callback: (() => {
        let count = amount;
        return () => count-- <= 0;
      })(),
    });
  }

  const range = asRange(input);

  if (range) {
    const max = range.infinite
      ? (offset
        ? offset.valueOf() + (length ? length.valueOf() : 1)
        : (length ? length.valueOf() : 1) + 1)
      : Infinity;
    const arr = collectRange(range, max);
    const b = length ? length.valueOf() : 1;
    const a = offset ? offset.valueOf() : arr.length - b;
    arr.splice(a, b);
    return arr;
  }

  const arr = list(input);
  const b = length ? length.valueOf() : 1;
  const a = offset ? offset.valueOf() : arr.length - b;

  arr.splice(a, b);
  return input;
}

export async function map(input, callback) {
  if (typeof callback !== 'function') raise('Missing map callback');

  const isSignal = v => v && typeof v === 'object' && typeof v.peek === 'function';
  const isLiteralWithSignal = v => v && typeof v === 'object' && v.type && v.type.toString() === 'Symbol(LITERAL)' && isSignal(v.value);
  const readSignal = v => {
    if (isLiteralWithSignal(v)) return v.value.peek();
    if (isSignal(v)) return v.peek();
    return v;
  };
  
  const unwrapped = readSignal(input);
  if (Array.isArray(unwrapped)) {
    const out = [];
    for (let i = 0, c = unwrapped.length; i < c; i++) {
      try {
        out.push(fromToken(await callback(toToken(unwrapped[i]))));
      } catch (err) {
        const msg = err.message || String(err);
        const newErr = new Error(`[map] ${msg}\n  Index: ${i}\n  Value: ${serialize(unwrapped[i])}`);
        newErr.cause = err;
        throw newErr;
      }
    }
    return out;
  }

  const lazy = appendLazy(input, { type: 'map', callback });

  if (lazy) {
    return lazy;
  }

  const arr = await list(input);
  const out = [];

  for (let i = 0, c = arr.length; i < c; i++) {
    try {
      out.push(fromToken(await callback(toToken(arr[i]))));
    } catch (err) {
      const msg = err.message || String(err);
      const newErr = new Error(`[map] ${msg}\n  Index: ${i}\n  Value: ${serialize(arr[i])}`);
      newErr.cause = err;
      throw newErr;
    }
  }

  return out;
}

export async function filter(input, callback) {
  if (typeof callback !== 'function') {
    raise('Missing filter callback');
  }

  const lazy = appendLazy(input, { type: 'filter', callback });

  if (lazy) {
    return lazy;
  }

  const arr = await list(input);
  const out = [];

  for (let i = 0, c = arr.length; i < c; i++) {
    try {
      if (await callback(toToken(arr[i]))) {
        out.push(arr[i]);
      }
    } catch (err) {
      const msg = err.message || String(err);
      const newErr = new Error(`[filter] ${msg}\n  Index: ${i}\n  Value: ${serialize(arr[i])}`);
      newErr.cause = err;
      throw newErr;
    }
  }

  return out;
}

export function rev(input) {
  return list(input).reverse();
}

export function pairs(input) {
  if (!input) raise('No input given');
  if (!(input.isRange || input.isObject)) raise('Invalid input');

  return Object.entries(input.valueOf());
}

export function keys(input) {
  return pairs(input).map(([k]) => k);
}

export function vals(input) {
  return pairs(input).map(x => x[1]);
}

export async function check(input, run) {
  if (!input || !input.length) raise('Missing expression to check');

  const offset = input.findIndex(x => isSome(x) || isOR(x));
  const expr = offset > 0 ? input.slice(0, offset) : input;
  const msg = offset > 0 ? input.slice(offset + 1) : [];

  const [result] = await run(...expr);
  const passed = result && result.get() === true;

  if (!isSome(input[offset]) ? !passed : passed) {
    let debug;

    if (msg.length > 0) {
      [debug] = await run(...msg);
      debug = debug && debug.valueOf();
    }

    return `\`${serialize(expr)}\` ${debug || 'did not passed'}`;
  }
}

export function format(str, ...args) {
  if (!str) raise('No format string given');
  if (!str.isString) raise('Invalid format string');
  if (!args.length) raise('Missing value to format');

  const data = args.reduce((p, c) => {
    if (p[p.length - 1] && (
      (p[p.length - 1].isRange && c.isRange)
      || (p[p.length - 1].isObject && c.isObject)
    )) {
      push(p[p.length - 1], c);
    } else p.push(c);
    return p;
  }, []);

  let offset = 0;

  return str.value.replace(RE_PLACEHOLDER, (_, key) => {
    if (!RE_FORMATTING.test(key)) raise(`Invalid format \`${_}\``);

    const [
      idx, fill, width, type, precision, transform,
    ] = key.match(RE_FORMATTING).slice(1);

    let [value] = get(data, idx || offset++);

    // return placeholder if no-match was found!
    if (typeof value === 'undefined') return _;

    let prefix = '';
    let suffix = '';


    if (type === '?') value = serialize(value);
    else if (isBlock(value)) value = value.toString();
    else if (precision && (isUnit(value) || isNumber(value))) {
      const fix = precision.substr(1);

      if (isUnit(value)) {
        const { value: base } = value;

        if (typeof base.kind === 'string') {
          value = base.num.toFixed(fix);
          value = `${value} ${base.kind}`;
        } else {
          value = `${base.num}/${base.kind}`;
        }
      } else {
        value = value.valueOf().toFixed(fix);
      }
    } else if (type === 'x') value = value.valueOf().toString(16);
    else if (type === 'o') value = value.valueOf().toString(8);
    else if (type === 'b') value = value.valueOf().toString(2);
    else value = value.valueOf().toString();

    if ((typeof fill !== 'undefined' && fill.length) || width > 0) {
      const separator = fill.length > 1 ? fill.substr(0, fill.length - 1) : null;
      const alignment = fill.substr(-1);
      const padding = Array.from({
        length: ((parseInt(width, 10) || 0) + 1) - value.length,
      }).join(separator || ' ');

      if (alignment === '^') {
        prefix = padding.substr(0, padding.length / 2);
        suffix = padding.substr(padding.length / 2);
      } else if (alignment === '>') suffix = padding;
      else prefix = padding;
    }

    if (transform === '^') value = value.toUpperCase();
    if (transform === '$') value = value.toLowerCase();

    value = prefix + value + suffix;

    return value;
  });
}
