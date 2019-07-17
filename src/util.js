import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

class TError extends Error {
  constructor(message, offset) {
    super(message);
    this.offset = offset;
  }
}

const OP_TYPES = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
};

const convert = new Convert();
const groups = convert.measures();
const keywords = Object.keys(currencySymbols.settings.symbols);
const mappings = {};

groups.forEach(group => {
  convert.list(group).forEach(unit => {
    keywords.push(unit.abbr);
    keywords.push(unit.plural);
    keywords.push(unit.singular);

    // memoize for fast look-up
    mappings[unit.plural.toLowerCase()] = unit.abbr;
    mappings[unit.singular.toLowerCase()] = unit.abbr;
  });
});

keywords.sort((a, b) => b.length - a.length);

const RE_NUM = /\d/;
const RE_FMT = /^[_*~]$/;
const RE_OPS = /^[-+=*/_]$/;
const RE_WORD = /^[a-zA-Z]$/;
const RE_PAIRS = /^[([\])]$/;
const RE_DIGIT = /-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/;
const RE_HOURS = /\d+(?::\d+){1,2}(?:\s*[ap]m)?/i;
const RE_DAYS = /^today|tonight|tomorrow|yesterday$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)/i;
const RE_DATES = `${RE_HOURS.source}|${RE_MONTHS.source.substr(1)}\\s*\\d{1,2}(,\\s+\\d{4})?`;
const RE_UNIT = new RegExp(`^(?:${RE_DIGIT.source}\\s*(?:${keywords.join('|')})?|${RE_DATES}|${RE_DAYS.source.substr(1, RE_DAYS.source.length - 2)})$`, 'i');

// FIXME: cleanup...
const isOp = (a, b = '') => RE_OPS.test(a) && !b.includes(a);
const isSep = x => RE_PAIRS.test(x) || x === ' ';
const isFmt = x => RE_FMT.test(x);
const isWord = x => RE_WORD.test(x);
const hasNum = x => RE_NUM.test(x);
const hasDate = x => RE_MONTHS.test(x);

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
  return text
    // basic operators
    .replace(/^[-+*=/]$/, op => `<var data-op="${OP_TYPES[op]}">${op}</var>`)

    // fractions
    .replace(/^(\d+)\/(\d+)$/, '<var data-op="number"><sup>$1</sup><span>/</span><sub>$2</sub></var>')

    // separators
    .replace(/^[([\])]$/, char => `<var data-op="${(char === '[' || char === '(') ? 'open' : 'close'}">${char}</var>`);
}

export function basicFormat(text) {
  const all = toChunks(text);

  let prevToken;
  let nextToken;

  return all.reduce((prev, cur, i) => {
    do {
      nextToken = all[++i];
    } while (nextToken && nextToken.charAt() === ' ');

    if (
      isSep(cur) || hasNum(cur)
      || ((RE_UNIT.test(prevToken)) && hasNum(nextToken))
      || (hasNum(prevToken) && (isOp(cur) || hasNum(nextToken)))
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

export function parseNumber(text, unit) {
  if (text.includes('/')) {
    const [a, b] = text.split('/');

    return a / b;
  }

  const num = text.replace(/[^%\d.-]/g, '');

  // console.log('>>>', text, unit);

  // FIXME: how handle these stuff?
  // if (text.charAt() === '$') {
  //   text = text.substr(1);
  // }

  return num;
}

export function evaluateExpression(op, left, right) {
  if (op === '+') return left + right;
  if (op === '-') return left - right;
  if (op === '*') return left * right;
  if (op === '/') return left / right;
}

export function operateExpression(ops, expr) {
  for (let i = 0, c = expr.length; i < c; i += 1) {
    if (ops.indexOf(expr[i]) > -1) {
      const old = expr;
      const cur = expr[i];
      const prev = parseFloat(expr[i - 1]);

      // calculate from percentages
      if (typeof expr[i + 1] === 'string' && expr[i + 1].charAt(expr[i + 1].length - 1) === '%') {
        const result = prev * (parseFloat(expr[i + 1]) / 100);

        expr.splice(i - 1, 3, evaluateExpression(cur, prev, result));

        return operateExpression(ops, expr);
      }

      const next = parseFloat(expr[i + 1]);
      const result = evaluateExpression(cur, prev, next);

      if (!isNaN(result)) {
        expr.splice(i - 1, 3, result);

        return operateExpression(ops, expr);
      } else {
        throw new TError(`Invalid expression around: ${prev} ${cur} ${next}`, i + 1);
      }
    }
  }

  return expr;
}

export function calculateFromString(expr) {
  expr = operateExpression(['*', '/'], expr);
  expr = operateExpression(['+', '-'], expr);

  return parseFloat(expr[0]);
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
      root.push(t[0] === 'number' ? parseNumber(t[1], t[2]) : t[1]);
    } else {
      throw new TError(`Invalid terminator around: ${tokens.slice(0, i).map(x => x[1]).join('')}`, i);
    }
  }

  return tree;
}

export function reduceFromAST(tokens) {
  return tokens.reduce((prev, cur) => {
    if (Array.isArray(cur)) {
      const ops = reduceFromAST(cur);

      if (ops.length) {
        prev.push(calculateFromString(ops));
      }
    } else if (!(typeof cur === 'number' && isNaN(cur))) {
      prev.push(cur);
    }

    return prev;
  }, []);
}

export function calculateFromTokens(tokens) {
  const simplified = reduceFromAST(buildTree(tokens));
  const chunks = [];

  let offset = 0;
  let lastOp = '+';

  // operate all possible expressions...
  const normalized = simplified.reduce((prev, cur, i) => {
    if (hasNum(prev[prev.length - 1]) && hasNum(cur)) prev.push(lastOp, cur);
    else if (hasNum(cur) || isOp(cur)) prev.push(cur);
    if (isOp(cur, '/*')) lastOp = cur;
    return prev;
  }, []);

  for (let i = 0; i < normalized.length; i += 1) {
    const cur = normalized[i];
    const next = normalized[i + 1];

    chunks[offset] = chunks[offset] || [];
    chunks[offset].push(cur);

    if (typeof next === 'number' && typeof cur === 'number' || cur === '=') {
      if (cur === '=') chunks[offset].pop();
      offset += 1;
    }
  }

  const results = chunks
    .map(x => calculateFromString(x))
    .filter(x => !isNaN(x));

  return {
    chunks,
    results,
  };
}
