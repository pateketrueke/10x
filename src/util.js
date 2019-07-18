import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

const convert = new Convert();
const groups = convert.measures();
const keywords = Object.keys(currencySymbols.settings.symbols);
const mappings = {};

class TError extends Error {
  constructor(message, offset) {
    super(message);
    this.offset = offset;
  }
}

const TIME_UNITS = convert.list('time').map(x => x.abbr).sort();

const OP_TYPES = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
};

groups.forEach(group => {
  convert.list(group).forEach(unit => {
    // FIXME: ignore hard-to-recognize ones?
    keywords.push(unit.abbr);
    keywords.push(unit.plural);
    keywords.push(unit.singular);

    // memoize for fast look-up
    mappings[unit.plural.toLowerCase()] = unit.abbr;
    mappings[unit.singular.toLowerCase()] = unit.abbr;
  });
});

keywords.sort((a, b) => b.length - a.length);

const RE_NUM = /^\d|\d$/;
const RE_FMT = /^[_*~]$/;
const RE_OPS = /^[-+=*/_]$/;
const RE_WORD = /^[a-zA-Z]$/;
const RE_PAIRS = /^[([\])]$/;
const RE_EXPRS = /^(?:of|a[ts]|in)$/i;
const RE_DIGIT = /-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/;
const RE_TOKEN = /^(?:number|equal|plus|min|mul|div|expr|unit)$/;
const RE_DAYS = /^(?:now|today|tonight|tomorrow|yesterday|weekend)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::[0-5]?[0-9])*(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)/i;
const RE_DATES = `${RE_HOURS.source.substr(1, RE_HOURS.source.length - 2)}|${RE_MONTHS.source.substr(1)}\\s*\\d{1,2}(,?\\s+\\d{4})?`;
const RE_UNIT = new RegExp(`^(?:${RE_DIGIT.source}\\s*(?:${keywords.join('|')})?|${RE_DATES}|${RE_DAYS.source.substr(1, RE_DAYS.source.length - 2)})$`, 'i');

// FIXME: cleanup...
const isOp = (a, b = '') => RE_OPS.test(a) && !b.includes(a);
const isSep = x => RE_PAIRS.test(x) || x === ' ';
const isFmt = x => RE_FMT.test(x);
const isExpr = x => RE_EXPRS.test(x);
const isWord = x => RE_WORD.test(x);
const hasNum = x => RE_NUM.test(x);
const hasDate = x => RE_MONTHS.test(x);
const hasKeyword = x => x && (!keywords.includes(x) ? mappings[x.toLowerCase()] : x);

export function toChunks(input) {
  let mayNumber = false;
  let inFormat = false;
  let oldChar = '';
  let offset = 0;

  const chars = input.replace(/\s/g, ' ').split('');
  const tokens = chars.reduce((prev, cur, i) => {
    const buffer = prev[offset] || (prev[offset] = []);
    const last = buffer[buffer.length - 1];
    const next = chars[i + 1];

    // normalize well-known dates
    if (hasDate(buffer.join(''))) {
      if (cur === ',' || (cur === ' ' && hasNum(next)) || hasNum(cur)) {
        buffer.push(cur);
        return prev;
      }

      if (!hasNum(cur)) {
        prev[++offset] = [cur];
        return prev;
      }
    }

    // otherwise, we just add anything to the current buffer line
    if (
      inFormat || typeof last === 'undefined'

      // add consecutive format-chars
      || (isFmt(last) && isFmt(cur) && last === cur)

      // add possible numbers
      || (hasNum(cur) && last === '/')
      || (hasNum(last) && cur === ':')
      || (hasNum(oldChar) && last === ' ' && isWord(cur))
      || (hasNum(last) && (cur === '%' || cur === ' ') && isWord(next))
    ) {
      buffer.push(cur);
    } else if (
      // skip separators
      isSep(cur) || isSep(last)


      // skip possible numbers
      || (hasNum(last) && isOp(cur) && cur !== '/')
      || (hasNum(last) && cur === '/' && !hasNum(next))
      || (hasNum(last) && cur === ',' && !hasNum(next))
      || (isOp(last, '-') && hasNum(cur) && !mayNumber)
      || (!hasNum(last) && isOp(cur) && oldChar !== cur)
      || (hasNum(oldChar) && last === '-' && hasNum(cur))
    ) {
      prev[++offset] = [cur];
    } else buffer.push(cur);

    // flag possible negative numbers
    mayNumber = last === '-' && hasNum(cur);

    // handle backticks for inline-code
    if (cur === '`') inFormat = !inFormat;

    // allow skip from open/close chars
    if (last === cur && isFmt(cur)) {
      inFormat = !inFormat;
      oldChar = '';
    } else if (last !== ' ') {
      oldChar = last;
    }

    return prev;
  }, []);

  return tokens.map(l => l.join(''));
}

export function simpleMarkdown(text) {
  return text
    // escape for HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // bold and italics
    .replace(/\*\*([^<>]+?)\*\*/, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>]+?)__/, '<i><span>__</span>$1<span>__</span></i>')

    // inline code
    .replace(/`(.+?)`/, '<code><span>`</span>$1<span>`</span></code>');
}

export function simpleNumbers(text) {
  return text
    // hardcode white-space boundaries
    .replace(/^\s|\s$/, String.fromCharCode(160))

    // regular units/dates
    .replace(RE_UNIT, chunk => {
      if (RE_MONTHS.test(chunk) || RE_DAYS.test(chunk) || RE_HOURS.test(chunk)) {
        return `<var data-op="number" data-unit="datetime">${chunk}</var>`;
      }

      if (RE_DIGIT.test(chunk)) {
        const unit = chunk.replace(RE_DIGIT, '').trim();
        const fixed = mappings[unit.toLowerCase()] || unit;

        return `<var data-op="number" data-unit="${fixed}">${chunk}</var>`;
      }

      return `<var data-op="number">${chunk}</var>`;
    });
}

export function lineFormat(text) {
  const fixedUnit = hasKeyword(text);

  if (fixedUnit) {
    return `<var data-op="unit" data-unit="${fixedUnit}">${text}</var>`;
  }

  return text
    // basic operators
    .replace(/^[-+*=/]$/, op => `<var data-op="${OP_TYPES[op]}">${op}</var>`)

    // fractions
    .replace(/^(\d+)\/(\d+)$/, '<var data-op="number"><sup>$1</sup><span>/</span><sub>$2</sub></var>')

    // separators
    .replace(/^[([\])]$/, char => `<var data-op="${(char === '[' || char === '(') ? 'open' : 'close'}">${char}</var>`);
}

export function basicFormat(text) {
  // handle markdown-like headings
  if (text.charAt() === '#') {
    const matches = text.match(/^(#+)(.+?)$/);
    const nth = Math.min(matches[1].length, 6);

    return `<h${nth}><span>${matches[1]}</span>${matches[2]}</h${nth}>`;
  }

  const all = toChunks(text);

  let prevToken;
  let nextToken;

  return all.reduce((prev, cur, i) => {
    do {
      nextToken = all[++i];
    } while (nextToken && nextToken.charAt() === ' ');

    if (isExpr(cur) && (hasKeyword(nextToken) || hasNum(nextToken))) {
      prev.push(`<var data-op="expr">${cur}</var>`);
      prevToken = cur;
      return prev;
    }

    if (
      isSep(cur) || hasNum(cur)

      // handle equal symbols
      || (hasNum(prevToken) && cur === '=')

      // handle units after expressions
      || (isExpr(prevToken) && hasKeyword(cur))

      // handle operators between expressions
      || (hasNum(prevToken) && isOp(cur) && isSep(nextToken))

      // handle operators between dates
      || (RE_DAYS.test(prevToken) && RE_DAYS.test(nextToken) && isOp(cur))

      // handle operators between numbers
      || ((RE_UNIT.test(prevToken) || hasNum(prevToken)) && hasNum(nextToken))
    ) {
      prev.push(simpleNumbers(lineFormat(cur)))
    } else {
      prev.push(simpleNumbers(simpleMarkdown(cur)));
    }

    if (!isSep(cur)) prevToken = cur;
    return prev;
  }, []).join('');
}

export function getClipbordText(e) {
  e.preventDefault();

  const content = window.clipboardData
    ? window.clipboardData.getData('Text')
    : e.clipboardData.getData('text/plain');

  return content;
}

export function getTextNodeAtPosition(target, offset = 0) {
  let lastNode = null;

  const c = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, elem => {
    if (offset >= elem.textContent.length) {
      offset -= elem.textContent.length;
      lastNode = elem;
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  }).nextNode();

  return {
    node: c ? c : target,
    position: c ? offset : 0,
  };
}

export function getSelectionStart() {
  const node = document.getSelection().anchorNode;

  return node.nodeType == 3 ? node.parentNode : node;
}

export function removeSelectedText() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  range.deleteContents();
}

export function getCursor(target) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  range.setStart(target, 0);

  const { length } = range.toString();

  return length;
}

export function setCursor(target, offset = 0) {
  const selection = window.getSelection();
  const pos = getTextNodeAtPosition(target, offset);

  selection.removeAllRanges();

  const range = new Range();

  range.setStart(pos.node, pos.position);
  selection.addRange(range);
}

export function parseNumber(value) {
  value = value.replace(/[^\/\d.-]/g, '');

  if (value.includes('/')) {
    const [a, b] = value.split('/');

    return a / b;
  }

  return parseFloat(value);
}

export function parseFromValue(token) {
  let text = token[1];

  if (typeof text === 'number') {
    text = text.toString().split(/(?=\d{2})/).join(':');
    text += token[2] ? ` ${token[2]}` : '';
  }

  const now = new Date();
  const year = now.getFullYear();
  const today = now.toString().split(' ').slice(0, 4).join(' ');

  if (text.includes(':')) return new Date(`${today} ${text}`);
  if (hasDate(text)) return new Date(!text.includes(',') ? `${text}, ${year}` : text);
  if (text.toLowerCase() === 'yesterday') return (now.setDate(now.getDate() - 1), now);
  if (text.toLowerCase() === 'tomorrow') return (now.setDate(now.getDate() + 1), now);
  if (text.toLowerCase() === 'today') return new Date(`${today} 00:00:00`);
  if (text.toLowerCase() === 'now') return now;

  return text;
}

export function calculateFromDate(op, left, right) {
  const oldYear = left.getFullYear();
  const oldMonth = left.getMonth();
  const oldDate = left.getDate();
  const oldHours = left.getHours();
  const oldMinutes = left.getMinutes();
  const oldSeconds = left.getSeconds();

  if (right instanceof Date) {
    const newYear = right.getFullYear();
    const newMonth = right.getMonth();
    const newDate = right.getDate();
    const newHours = right.getHours();
    const newMinutes = right.getMinutes();
    const newSeconds = right.getSeconds();

    if (op === '+' || op === 'at') {
      let isToday = true;

      if (oldYear !== newYear) isToday = !left.setYear(oldYear + newYear);
      if (oldMonth !== newMonth) isToday = !left.setMonth(oldMonth + newMonth);
      if (oldDate !== newDate) isToday = !left.setDate(oldDate + newDate);

      // operate only when both dates are not from same day!
      if (!isToday) {
        if (oldHours !== newHours) left.setHours(oldHours + newHours);
        if (oldMinutes !== newMinutes) left.setMinutes(oldMinutes + newMinutes);
        if (oldSeconds !== newSeconds) left.setSeconds(oldSeconds + newSeconds);
      } else {
        if (oldHours !== newHours) left.setHours(newHours);
        if (oldMinutes !== newMinutes) left.setMinutes(newMinutes);
        if (oldSeconds !== newSeconds) left.setSeconds(newSeconds);
      }
    }

    if (op === '-') {
      if (oldYear !== newYear) left.setYear(oldYear - newYear);
      if (oldMonth !== newMonth) left.setMonth(oldMonth - newMonth);
      if (oldDate !== newDate) left.setDate(oldDate - newDate);
      if (oldHours !== newHours) left.setHours(oldHours - newHours);
      if (oldMinutes !== newMinutes) left.setMinutes(oldMinutes - newMinutes);
      if (oldSeconds !== newSeconds) left.setSeconds(oldSeconds - newSeconds);
    }
  } else {
    if (op === '+') left.setSeconds(left.getSeconds() + right);
    if (op === '-') left.setSeconds(left.getSeconds() - right);
  }

  return left;
}

export function evaluateExpression(op, left, right) {
  if (op === '+') return left + right;
  if (op === '-') return left - right;
  if (op === '*') return left * right;
  if (op === '/') return left / right;
}

export function operateExpression(ops, expr) {
  for (let i = 1, c = expr.length - 1; i < c; i += 1) {
    if (ops.indexOf(expr[i][1]) > -1) {
      const cur = expr[i];
      const prev = expr[i - 1];
      const next = expr[i + 1];

      let result;

      // operate datetime
      if (prev[1] instanceof Date) {
        result = calculateFromDate(cur[1], prev[1], next[1]);
      } else if (prev[0] === 'number' && next[0] === 'number') {
        // apply percentage
        if (next[2] === '%') {
          next[1] = prev[1] * (next[1] / 100);
        }

        // ideally both values are integers
        result = evaluateExpression(cur[1], prev[1], next[1]);
      }

      if (!isNaN(result)) {
        expr.splice(i - 1, 3, ['number', result]);

        // if tokens are left...
        if (expr.length >= 3) {
          return operateExpression(ops, expr);
        }
      } else {
        throw new TError(`Invalid expression around: ${prev[1]} ${cur[1]} ${next[1]}`, i + 1);
      }
    }
  }

  return expr;
}

export function calculateFromString(expr) {
  expr = operateExpression(['*', '/'], expr);
  expr = operateExpression(['at', 'of', '+', '-', 'as', 'in'], expr);

  return expr[0];
}

export function buildTree(tokens) {
  let root = [];

  const tree = root;
  const stack = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];

    if (t[0] === 'open' || t[0] === 'close') {
      if (t[0] === 'open') {
        const leaf = [];

        root.push(leaf);
        stack.push(root);
        root = leaf;
      } else if (t[0] === 'close') {
        root = stack.pop();
      }
    } else if (root) {
      const matches = t[1].match(/(%|[ap]m)$/i);
      const type = matches ? matches[1] : t[2];

      root.push([t[0], /^[a-z-+=*/](?!\.?\d|\s)/i.test(t[1]) ? t[1] : parseNumber(t[1]), type]);
    } else {
      throw new TError(`Invalid terminator around: ${tokens.slice(0, i).map(x => x[1]).join('')}`, i);
    }
  }

  return tree;
}

export function reduceFromAST(tokens) {
  let isDate;

  for (let i = 0, c = tokens.length; i < c; i += 1) {
    const cur = tokens[i];

    if (Array.isArray(cur[0])) {
      tokens[i] = calculateFromString(reduceFromAST(cur));
    } else if (cur && /(?:datetime|a[mp])/.test(cur[2])) {
      cur[1] = parseFromValue(cur);
      isDate = true;
    } else {
      const left = tokens[i - 1];
      const right = tokens[i + 1];

      if (isDate && right) {
        if (TIME_UNITS.includes(right[2])) {
          right[1] = new Convert(right[1]).from(right[2]).to('s');
        } else {
          right[1] = parseFromValue(right);
        }
      }
    }
  }

  return tokens;
}

// FIXME: there are two reducers, one from tokens into arrays of coerced types
// and the last one, is the one that performs simple math on resolved values

export function calculateFromTokens(tokens) {
  const simplified = reduceFromAST(buildTree(tokens));
  const normalized = [];

  let offset = 0;
  let lastOp = ['plus', '+'];

  // operate all possible expressions...
  const chunks = simplified.reduce((prev, cur, i) => {
    const lastValue = prev[prev.length - 1] || [];

    if (lastValue[0] === 'number' && cur[0] === 'number') prev.push(lastOp, cur);
    else if (cur[0] === 'number' || isOp(cur[1])) prev.push(cur);
    else if (isExpr(cur[1])) prev.push(cur);

    if (isOp(cur[1], '/*')) lastOp = cur;
    return prev;
  }, []);

  for (let i = 0; i < chunks.length; i += 1) {
    const cur = chunks[i];
    const next = chunks[i + 1];

    normalized[offset] = normalized[offset] || [];
    normalized[offset].push(cur);

    if (cur[0] === 'equal') {
      normalized[offset].pop();
      offset += 1;
    }
  }

  const results = normalized
    .map(x => calculateFromString(x));

  return {
    chunks,
    results,
  };
}
