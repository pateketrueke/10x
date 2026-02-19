/* eslint-disable no-nested-ternary */

import {
  COMMENT, COMMENT_MULTI, CODE, BOLD, ITALIC, BLOCKQUOTE, HEADING, OL_ITEM, UL_ITEM, REF,
  TEXT, OPEN, CLOSE, COMMA, BEGIN, DONE, EOF, EOL,
  MINUS, PLUS, MUL, DIV, MOD, DOT, OR, SOME, EVERY,
  PIPE, BLOCK, RANGE, REGEX, SYMBOL, LITERAL, NUMBER, STRING, NOT_EQ,
  NOT, LIKE, EXACT_EQ, EQUAL, LESS_EQ, LESS, GREATER_EQ, GREATER,
  CONTROL_TYPES, SYMBOL_TYPES,
} from './tree/symbols';

const LOGIC_TYPES = [LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, NOT, LIKE, EQUAL, SOME, EVERY];
const RESULT_TYPES = [NUMBER, STRING, SYMBOL, LITERAL, BLOCK, RANGE, REGEX];
const INVOKE_TYPES = [EOL, COMMA, BLOCK, RANGE, LITERAL];
const COMMENT_TYPES = [COMMENT, COMMENT_MULTI];

const MATH_TYPES = [EQUAL, MINUS, PLUS, MUL, DIV, PIPE, MOD, SOME, LIKE, NOT, OR];
const END_TYPES = [OR, EOF, EOL, COMMA, DONE, CLOSE, PIPE];
const LIST_TYPES = [BEGIN, DONE, OPEN, CLOSE];
const SCALAR_TYPES = [NUMBER, STRING];

const RE_SLICING = /^:(-?\d+)?(\.\.|-)?(?:(-?\d+))?$/;

export class Token {
  constructor(type, text, value, tokenInfo) {
    const {
      line, col, kind,
    } = tokenInfo || {};

    if (kind) this.kind = kind;

    this.value = typeof value !== 'undefined' && value !== null ? value : text;
    this.type = type;
    this.line = line;
    this.col = col;
  }

  valueOf() {
    return this.value;
  }

  get isRaw() { return this.kind === 'raw'; }
  get isMulti() { return this.kind === 'multi'; }
  get isMarkup() { return this.kind === 'markup'; }

  static get(token, isWeak) {
    if (typeof token === 'undefined') throw new Error('Invalid token');

    const result = !isWeak || typeof token.value === 'undefined'
      ? token.valueOf()
      : token.value;

    if (isWeak && token.type === SYMBOL) {
      return result.substr(1);
    }

    return Array.isArray(result)
      ? result.map(x => {
          if (x.type === LITERAL && x.value === '_') return LITERAL;
          return Token.get(x, isWeak);
        })
      : result;
  }
}

export function isSymbol(t) { return t && t.type === SYMBOL; }
export function isNumber(t) { return t && t.type === NUMBER; }
export function isString(t) { return t && t.type === STRING; }
export function isComma(t) { return t && t.type === COMMA; }
export function isEqual(t) { return t && t.type === EQUAL; }
export function isBlock(t) { return t && t.type === BLOCK; }
export function isRange(t) { return t && t.type === RANGE; }
export function isBegin(t) { return t && t.type === BEGIN; }
export function isSome(t) { return t && t.type === SOME; }
export function isEvery(t) { return t && t.type === EVERY; }
export function isDone(t) { return t && t.type === DONE; }
export function isClose(t) { return t && t.type === CLOSE; }
export function isOpen(t) { return t && t.type === OPEN; }
export function isPipe(t) { return t && t.type === PIPE; }
export function isText(t) { return t && t.type === TEXT; }
export function isCode(t) { return t && t.type === CODE; }
export function isDot(t) { return t && t.type === DOT; }
export function isMod(t) { return t && t.type === MOD; }
export function isNot(t) { return t && t.type === NOT; }
export function isRef(t) { return t && t.type === REF; }

export function isOR(t) { return t && t.type === OR; }
export function isEOF(t) { return t && t.type === EOF; }
export function isEOL(t) { return t && t.type === EOL; }

export function isInvokable(t) { return t && INVOKE_TYPES.includes(t.type); }
export function isComment(t) { return t && COMMENT_TYPES.includes(t.type); }
export function isResult(t) { return t && RESULT_TYPES.includes(t.type); }
export function isScalar(t) { return t && SCALAR_TYPES.includes(t.type); }
export function isLogic(t) { return t && LOGIC_TYPES.includes(t.type); }
export function isMath(t) { return t && MATH_TYPES.includes(t.type); }
export function isList(t) { return t && LIST_TYPES.includes(t.type); }
export function isEnd(t) { return t && END_TYPES.includes(t.type); }

export function isCall(t) { return t && (t.type === PIPE || (t.type === BLOCK && !t.value.body && t.value.args)); }
export function isMixed(t, ...o) { return t && t.type === LITERAL && t.value && o.includes(typeof t.value); }
export function isPlain(t) { return t && Object.prototype.toString.call(t) === '[object Object]'; }
export function isObject(t) { return t && t.type === LITERAL && (t.isObject || isMixed(t, 'object')); }
export function isLiteral(t, v) { return t && t.type === LITERAL && (v ? t.value === v : true); }
export function isOperator(t) { return isLogic(t) || isMath(t); }

export function isStatement(t) { return t && CONTROL_TYPES.includes(t); }
export function isSpecial(t) { return t && SYMBOL_TYPES.includes(t.value); }
export function isArray(t) { return t && t.type === RANGE && Array.isArray(t.value); }
export function isSlice(t) { return t && t.type === SYMBOL && RE_SLICING.test(t.value); }
export function isUnit(t) { return t && t.type === NUMBER && isPlain(t.value); }
export function isData(t) { return (isRange(t) && Array.isArray(t.value)) || isLiteral(t) || (isResult(t) && !isInvokable(t)); }

export function hasStatements(o) {
  return CONTROL_TYPES.some(k => o[k.substr(1)] && o[k.substr(1)].isStatement);
}

export function hasBreaks(token) {
  if (isString(token) && typeof token.value === 'string') {
    return token.value.includes('\n');
  }

  if (isText(token)) {
    return token.value.buffer.some(x => typeof x === 'string' && x.includes('\n'));
  }
}

export function hasDiff(prev, next, isWeak) {
  // ignore checks from any value given as `_` (placeholder)
  if (prev === LITERAL || next === LITERAL) return false;

  const prevValue = Token.get(prev, isWeak);
  const nextValue = Token.get(next, isWeak);

  // evaluate regexp against given values!
  if (prevValue instanceof RegExp || nextValue instanceof RegExp) {
    const regexp = prevValue instanceof RegExp ? prevValue : nextValue;
    const value = prevValue instanceof RegExp ? nextValue : prevValue;

    return !regexp.test(value);
  }

  if (Array.isArray(prevValue)) {
    // ignore extra items if weak-mode is enabled
    if (isWeak) {
      prevValue.length = nextValue.length = Math.min(prevValue.length, nextValue.length);
    }

    if (prevValue.length !== nextValue.length) return true;

    for (let i = 0, c = prevValue.length; i < c; i++) {
      if (hasDiff(prevValue[i], nextValue[i], isWeak)) return true;
    }

    return false;
  }

  if (isPlain(prevValue)) {
    if (!isPlain(nextValue)) return true;

    const a = Object.keys(prevValue).sort();
    const b = Object.keys(nextValue).sort();

    if (hasDiff(a, b, isWeak)) return true;

    for (let i = 0; i < a.length; i += 1) {
      if (hasDiff(prevValue[a[i]], nextValue[b[i]], isWeak)) return true;
    }

    return false;
  }

  if (isWeak) {
    return prevValue != nextValue; // eslint-disable-line
  }

  return prevValue !== nextValue;
}

export function hasIn(prev, next) {
  const prevValue = Token.get(prev, true);
  const nextValue = Token.get(next, true);

  if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
    return nextValue.every(x => hasIn(prev, x));
  }

  if (Array.isArray(prevValue) || typeof prevValue === 'string') {
    return prevValue.includes(nextValue);
  }

  if (isObject(prev)) {
    return Array.isArray(nextValue) ? nextValue.every(x => x in prevValue) : nextValue in prevValue;
  }

  return false;
}

export function deindent(source) {
  const matches = source.match(/\n(\s+)/m);

  if (matches) {
    return source.split('\n').map(line => {
      if (line.indexOf(matches[1]) === 0) {
        return line.substr(matches[1].length);
      }
      return line;
    }).join('\n').trim();
  }

  return source;
}

export function hilight(value, colorize) {
  return value
    .replace(/<[^<>]*>/g, x => colorize(STRING, x));
}

export function format(text) {
  const chunks = text.split(/([`*_]{1,2})(.+?)\1/g);
  const buffer = [];

  for (let i = 0, c = chunks.length; i < c; i++) {
    // skip empty chunks
    if (!chunks[i].length) continue;

    // append only well-known tags
    if (chunks[i].charAt() === '`') {
      buffer.push([CODE, chunks[i], chunks[++i]]);
    } else if ('*_'.includes(chunks[i].charAt())) {
      buffer.push([chunks[i].length > 1 ? BOLD : ITALIC, chunks[i], chunks[++i]]);
    } else {
      buffer.push(chunks[i]);
    }
  }

  return buffer;
}

export function pad(nth) {
  return `     ${nth}`.substr(-5);
}

export function copy(obj) {
  if (Array.isArray(obj)) {
    return obj.map(copy);
  }

  return obj.clone();
}

export function repr(t) {
  return t.toString().match(/\((\w+)\)/)[1];
}

export function raise(summary, tokenInfo, descriptor) {
  summary += tokenInfo ? ` at line ${tokenInfo.line + 1}:${tokenInfo.col + 1}` : '';
  summary += descriptor ? ` (${descriptor})` : '';

  const Err = tokenInfo ? SyntaxError : TypeError;
  const e = new Err(summary);

  e.line = tokenInfo ? tokenInfo.line : 0;
  e.col = tokenInfo ? tokenInfo.col : 0;
  e.stack = summary;

  throw e;
}

export function assert(token, inherit, ...allowed) {
  if (!allowed.includes(token.type)) {
    const set = allowed.map(repr);
    const last = set.length > 1 ? set.pop() : '';
    const value = set.join(', ').toLowerCase() + (last ? ` or ${last.toLowerCase()}` : '');

    raise(`Expecting ${value} but found \`${token}\``, inherit ? token.tokenInfo : undefined);
  }
}

export function check(token, value, info) {
  const actual = token instanceof Token ? token.value : token;
  const tokenInfo = token.tokenInfo || token;

  if (!value) {
    raise(`Unexpected \`${actual}\``, tokenInfo);
  }

  const suffix = ` ${info || 'but found'} \`${actual}\``;

  value = typeof value === 'symbol'
    ? repr(value).toLowerCase()
    : value;

  raise(`Expecting ${value}${suffix}`, tokenInfo);
}

export function argv(set, token, offset) {
  if (set === null) {
    const call = token.value.source;
    const head = token.value.input[offset];

    raise(`Missing argument \`${head}\` to call \`${call}\``);
  }

  const call = token.source || token.value.source;
  const head = set[Math.min(offset, set.length - 1)];

  raise(`Unexpected argument \`${head}\` to call \`${call}\``);
}

export function only(token, callback) {
  const source = token.getBody();

  if (source.length > 1 || !callback(source[0])) {
    check(source[1] || source[0]);
  }
}

export function debug(err, source, noInfo, callback, colorizeToken = (_, x) => x) {
  err.stack = err.stack || err[err.prevToken ? 'summary' : 'message'];

  if (typeof source === 'undefined') {
    return err.message;
  }

  if (noInfo) {
    return err.stack.replace(/at line \d+:\d+\s+/, '');
  }

  if (err.prevToken) {
    const { line, col } = err.prevToken.tokenInfo;

    if (line !== err.line) err.line = line;
    if (col !== err.col) err.col = col;
    err.stack += `\n  at \`${err.prevToken}\` at line ${line + 1}:${col + 1}`;
  }

  source = typeof callback === 'function' ? callback(source) : source;

  const lines = source.split('\n').reduce((prev, cur, i) => {
    prev.push(` ${colorizeToken(err.line !== i ? true : null, pad(i + 1))} | ${cur}`);
    return prev;
  }, []);

  const padding = Array.from({ length: err.col + 10 }).join('-');

  lines.splice(err.line + 1, 0, `${padding}^`);

  if (err.line) {
    lines.splice(0, err.line - 4);
    lines.length = 10;
  }

  return `${err.stack}\n\n${lines.join('\n')}\n`;
}

export function literal(t) {
  switch (t.type) {
    case OPEN: return '(';
    case CLOSE: return ')';
    case COMMA: return ',';
    case BEGIN: return '[';
    case DONE: return ']';
    case EOL: return ';';
    case DOT: return '.';
    case MINUS: return '-';
    case PLUS: return '+';
    case MOD: return '%';
    case MUL: return '*';
    case DIV: return '/';
    case PIPE: return '|>';
    case BLOCK: return '->';
    case RANGE: return '..';
    case SYMBOL: return ':';
    case NOT_EQ: return '!=';
    case SOME: return '?';
    case EVERY: return '$';
    case OR: return '|';
    case NOT: return '!';
    case LIKE: return '~';
    case EXACT_EQ: return '==';
    case EQUAL: return '=';
    case LESS_EQ: return '<=';
    case LESS: return '<';
    case GREATER_EQ: return '>=';
    case GREATER: return '>';

    default: return t.value;
  }
}

export function quote(s) {
  return `"${s.replace(/"/g, '\\"')}"`;
}

export function split(s) {
  return s.split(/(?=[\W\x00-\x7F])/); // eslint-disable-line
}

export function slice(s) {
  const matches = s.match(RE_SLICING);

  const min = matches[1] ? parseFloat(matches[1]) : undefined;
  const max = matches[3] ? parseFloat(matches[3]) : undefined;

  if (matches[2] === '..') {
    return { begin: min, end: max };
  }

  if (min < 0 && typeof max !== 'undefined') throw new Error(`Invalid take-step \`${s}\``);
  if (max < 0) throw new Error(`Invalid take-step \`${s}\``);

  return { offset: min, length: max };
}

export function isDigit(c) {
  return c >= '0' && c <= '9';
}

export function isReadable(c, raw) {
  return (c === '#' || c === '$')
    || (c >= '&' && c <= "'")
    || (c >= '^' && c <= 'z')
    || (c >= '@' && c <= 'Z')
    || (raw && (c === '.' || c === '-'))
    || (c.charCodeAt() > 127 && c.charCodeAt() !== 255);
}

export function isAlphaNumeric(c, raw) {
  return isDigit(c) || isReadable(c, raw);
}

export function getSeparator(_, o, p, c, n, dx) {
  // add white-space or newline if not followed by text...
  if ((isComment(p) && !isText(c)) || (isComment(c) && !isText(p))) {
    return (isComment(p) ? p : c).type === COMMENT_MULTI ? ' ' : '\n';
  }

  if (
    // add white-space on first statement after blocks, e.g. `(...) x` OR `(...) (...)`
    (dx === 'Stmt'
      && ((!o && isBlock(p) && !isBlock(c))
      || (isBlock(p) && isBlock(c) && !c.isStatement && c.isRaw)))

    // add white-space after token delimiters, e.g. `; x` OR `, x`
    || (isEOL(p) && !isText(c) && !isEOF(c))
    || (isComma(p) && !isText(c))

    // add white-space before blocks, e.g. `=> (...)`
    || (isOperator(p) && isBlock(c))

    // add white-space around single-operators, e.g. `n - 1`
    || (o
      && isOperator(p)
      && (isData(c) && !isLiteral(c))
      && !(isEOL(o) || isComma(o) || isText(o))
    ) || (isData(p) && isOperator(c) && isData(n))

    // add white-space around mixed operators (if needed), e.g. `i += 2`
    || (isData(o) && isOperator(p) && isData(c))
    || (isData(p) && !isLiteral(p) && isOperator(c))

    // add white-space between blocks and operators, e.g. `f() + g()`
    || ((isBlock(p) && isOperator(c)) || (isBlock(o) && isOperator(p)))

    // skip adding white-space if operators are duplicated, e.g. `a++ b` OR `1 --c`
    || (isLiteral(_) && isOperator(o) && isOperator(p) && !isData(n))
    || (isLiteral(p) && isOperator(c) && isOperator(n) && c.value !== n.value)
    || (isOperator(o) && isOperator(p) && o.value !== p.value && isLiteral(c))) return ' ';

  if (
    // add commas between blocks or after blocks, e.g. `x = 1, y`
    ((isBlock(p) && isBlock(c))
    || (isBlock(p) && isData(c)))

    // add commas betwen values, but not after ranges, e.g. `a, b`
    || (isData(p) && isData(c) && (!isRange(p) || !isSymbol(c)))
  ) return dx === 'Root' || (dx !== 'Expr' && !isSymbol(p)) ? COMMA : ' ';
}

export function serialize(token, shorten, colorize = (_, x) => (typeof x === 'undefined' ? literal({ type: _ }) : x), descriptor = 'Root') {
  if (typeof token === 'undefined') return;

  if (token === null) return colorize(SYMBOL, ':nil');
  if (token === true) return colorize(SYMBOL, ':on');
  if (token === false) return colorize(SYMBOL, ':off');

  if (token instanceof Date) return colorize(STRING, `"${token.toISOString()}"`);
  if (token instanceof RegExp) return colorize(STRING, `/${token.source}/${token.flags}`);

  if (typeof token === 'number') return colorize(NUMBER, token);
  if (typeof token === 'symbol') return colorize(SYMBOL, token.toString().match(/\((.+?)\)/)[1]);
  if (typeof token === 'string') return colorize(LITERAL, descriptor === 'Object' ? `"${token}"` : token);

  if (typeof token === 'function') {
    const name = token.toString().match(/constructor\s*\(([\s\S]*?)\)|\(([\s\S]*?)\)|([\s\S]*?)(?==>)/);
    const methods = Object.keys(token).map(k => colorize(SYMBOL, `:${k}`)).join(' ');
    const formatted = (name[3] || name[2] || name[1] || '').trim().replace(/\s+/g, ' ');

    return `${colorize(LITERAL, token.name)}${colorize(OPEN, '(')}${
      formatted.length ? colorize(LITERAL, formatted) : ''
    }${colorize(CLOSE)}${methods ? `${colorize(BEGIN)}${methods}${colorize(DONE)}` : ''}`;
  }

  if (Array.isArray(token)) {
    if (descriptor === 'Object') {
      return `${colorize(BEGIN)}${
        token.map(x => serialize(x, shorten, colorize, descriptor)).join(`${colorize(COMMA)} `)
      }${colorize(DONE)}`;
    }

    let prevData = null;

    return token.reduce((prev, cur, i) => {
      const sep = getSeparator(prevData, token[i - 2], token[i - 1], cur, token[i + 1], descriptor);
      const result = serialize(cur, shorten, colorize, descriptor);

      if (sep && !(isEOL(cur) || isComma(cur))) {
        prev.push(![' ', '\n'].includes(sep) ? `${colorize(sep)} ` : sep);
      }

      if (isEOL(cur) || isComma(cur)) prevData = null;
      if (isData(cur)) prevData = cur;

      prev.push(result);
      return prev;
    }, []).join('');
  }

  if (isComment(token) && token.type === COMMENT) {
    return colorize(COMMENT, token.value);
  }

  if (isLiteral(token)) {
    if (token.cached) {
      return colorize(LITERAL, `${token.value}!`);
    }

    if (token.isFunction) {
      return colorize(LITERAL, token.value.label);
    }

    if (!token.isObject && typeof token.value === 'object') {
      return serialize(token.value, shorten, colorize, 'Object');
    }

    if (typeof token.value === 'undefined') {
      return colorize(true, String(token.value));
    }

    return serialize(token.value, shorten, colorize, descriptor);
  }

  if (typeof token.type === 'symbol') {
    if (token.isExpression) {
      return `${colorize(token.type)} ${serialize(token.value, shorten, colorize, 'Expr')}`;
    }

    if (isRef(token)) {
      const chunk = (token.isRaw && token.value.href) || token.value.alt || token.value.href;

      return colorize(true, token.value.text.replace(chunk, colorize(token.isRaw ? REF : TEXT, chunk)));
    }

    if (isUnit(token)) {
      return colorize(NUMBER, token.value.toString());
    }

    if (isCode(token) && token.isMulti) {
      return `${colorize(true, '```')}${colorize(null, token.value)}${colorize(true, '```')}`;
    }

    if (isString(token)) {
      const qt = colorize(STRING, token.isMulti ? '"""' : '"');

      let chunk;

      if (shorten) {
        chunk = colorize(STRING, token.isMarkup ? '<.../>' : '"..."');
      } else if (Array.isArray(token.value)) {
        const subTree = token.valueOf();
        const buffer = [];

        for (let i = 0, c = subTree.length; i < c; i++) {
          const cur = subTree[i];
          const next = subTree[i + 1];
          const prev = subTree[i - 1];

          if ((!prev || prev.type === PLUS) && cur.type === OPEN && cur.value === '#{') {
            buffer.pop();
            buffer.push(colorize(null, '#{'));
            continue;
          }

          if ((!next || next.type === PLUS) && cur.type === CLOSE && cur.value === '}') {
            buffer.push(colorize(null, '}'));
            i++;
            continue;
          }

          if (isBlock(cur) && !cur.hasArgs) {
            if (prev && prev.type === PLUS) buffer.pop();

            cur.tokenInfo.kind = '';
            buffer.push(colorize(null, '#{'));
            buffer.push(serialize(cur, shorten, colorize, 'Str'));
            buffer.push(colorize(null, '}'));
            cur.tokenInfo.kind = 'raw';

            if (next && next.type === PLUS) i++;
            continue;
          }

          if (!isString(cur)) {
            buffer.push(serialize(cur, shorten, colorize, descriptor));
          } else {
            buffer.push(colorize(STRING, !cur.isRaw ? `"${cur.value}"` : cur.value));
          }
        }

        chunk = (!token.isMarkup ? `${qt}${buffer.join('')}${qt}` : buffer.join(''));
      } else {
        chunk = colorize(STRING, !token.isMarkup ? `${qt}${token.value}${qt}` : token.value);
      }

      return chunk;
    }

    if (isBlock(token)) {
      if (typeof token.value === 'string') return colorize(BLOCK);

      let block = '';
      let args = '';

      const parent = token.isStatement || descriptor === 'Stmt' ? 'Stmt' : 'Block';

      if (!token.hasSource) {
        if (token.hasArgs) args += serialize(token.getArgs(), shorten, colorize, parent);
        if (token.hasName) block += `${colorize(LITERAL, token.getName())}${args} ${colorize(EQUAL)} `;
      }

      if (token.hasBody) {
        block += serialize(token.getBody(), shorten, colorize, parent);
      }

      if (!block) {
        block = args;
      } else if (args) {
        block = `${args} ${colorize(BLOCK)} ${block}`;
      }

      if (token.hasArgs && token.getArg(0) && token.getArg(0).isExpression) {
        block = `${colorize(token.getArg(0).type)}`;

        if (!shorten) {
          block += ` ${serialize(token.getArg(0).value, shorten, colorize, 'Expr')}`;
        }
      }

      return token.isRaw ? `${colorize(OPEN)}${block}${colorize(CLOSE)}` : block;
    }

    if (isText(token)) {
      let prefix = '';

      if (token.value.kind === BLOCKQUOTE) {
        prefix = `${colorize(BLOCKQUOTE, '>')} `;
      } else if (token.value.kind === HEADING) {
        prefix = `${colorize(HEADING, Array.from({ length: token.value.level + 1 }).join('#'))} `;
      } else if (token.value.kind === UL_ITEM || token.value.kind === OL_ITEM) {
        if (token.value.depth) {
          prefix += Array.from({ length: token.value.depth + 1 }).join('  ');
        }

        let offset = token.value.style;

        if (this && token.value.kind === OL_ITEM) {
          const key = [repr(token.value.kind), token.value.depth || 0];

          this.offsets = this.offsets || {};
          this.offsets[key] = this.offsets[key] || token.value.level;

          offset = this.offsets[key];

          this.offsets[key]++;
        }

        prefix += `${colorize(token.value.kind, offset + (token.value.kind === OL_ITEM ? '.' : ''))} `;
      } else if (this && isText(token) && !hasBreaks(token)) {
        delete this.offsets;
      }

      return colorize(TEXT, `${prefix}${token.value.buffer.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
          prev += colorize(cur[0], `${cur[1]}${cur[2]}${cur[1]}`);
        } else if (isRef(cur)) {
          prev += serialize(cur, shorten, colorize);
        } else {
          prev += hilight(cur, colorize);
        }
        return prev;
      }, '')}`);
    }

    if (isRange(token)) {
      if (typeof token.value === 'string') return colorize(RANGE, token.value);

      if (!Array.isArray(token.value)) {
        return colorize(RANGE, `${serialize(token.value.begin, shorten, colorize)}..${serialize(token.value.end, shorten, colorize)}`);
      }

      return `${colorize(BEGIN, '[')}${
        !shorten ? serialize(token.value, shorten, colorize, descriptor) : colorize(RANGE, '..')
      }${colorize(DONE, ']')}`;
    }

    return colorize(token.type, token.value);
  }

  // skip separators from all statements!
  const separator = !hasStatements(token) ? `${colorize(COMMA)} ` : ' ';

  if (shorten) {
    return Object.keys(token).map(k => colorize(SYMBOL, `:${k}`)).join(separator);
  }

  const block = Object.keys(token).map(k => `${colorize(SYMBOL, `:${k}`)} ${serialize(token[k], shorten, colorize, descriptor)}`);

  return descriptor === 'Object'
    ? `${colorize(OPEN)}${block.join(separator)}${colorize(CLOSE)}`
    : block.join(separator);
}
