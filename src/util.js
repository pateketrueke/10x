import Convert from 'convert-units';

class TError extends Error {
  constructor(message, offset) {
    super(message);
    this.offset = offset;
  }
}

const convert = new Convert();
const groups = convert.measures();

const types = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
};

const keys = ['usd', 'mxn'];

groups.forEach(group => {
  convert.list(group).forEach(unit => {
    keys.push(unit.abbr);
    keys.push(unit.plural);
    keys.push(unit.singular);
  });
});

keys.sort((a, b) => b.length - a.length);

const RE_DIGIT = '-?[$€£¢]?(?:\\.\\d+|\\d+(?:[_,.]\\d+)*)%?';
const RE_DATE = 'tomorrow|yesterday|today|now|\\d+(?::\\d+)*(?:\\s*[ap]m)?';
const RE_UNIT = new RegExp(`^(?:${RE_DIGIT}\\s*(?:${keys.join('|')})?|${RE_DATE})$`, 'i');

// FIXME: for date-keywords, e.g. ["Jun", " ", "10", ", ", "1987"]
// we need to reduce to a well-known format... e.g. "June 10, 1987"
const isOp = (a, b) => /[-+=*/_]/.test(a) && a !== b;
const isSep = x => /[([\])]/.test(x) || x === ' ';
const isNum = x => /\d/.test(x);
const isFmt = x => /[_*~]/.test(x);
const isWord = x => /[a-zA-Z]/.test(x);

export function toChunks(input) {
  let mayNumber = false;
  let inFormat = false;
  let prevToken = '';
  let oldChar = '';
  let offset = 0;

  const chars = input.replace(/\s/g, ' ').split('');
  const tokens = chars.reduce((prev, cur, i) => {
    const buffer = prev[offset] || (prev[offset] = []);
    const last = buffer[buffer.length - 1];
    const next = chars[i + 1];

    // otherwise, we just add anything to the current buffer line
    if (
      inFormat || typeof last === 'undefined'

      // add consecutive format-chars
      || (isFmt(last) && isFmt(cur) && last === cur)

      // add possible numbers
      || (isNum(cur) && last === '/')
      || (isNum(last) && cur === ':')
      || (isNum(oldChar) && last === ' ' && isWord(cur))
      || (isNum(last) && (cur === '%' || cur === ' ') && isWord(next))
    ) {
      buffer.push(cur);
    } else if (
      // skip separators
      isSep(cur) || isSep(last)

      // skip possible numbers
      || (isNum(last) && isOp(cur) && cur !== '/')
      || (isNum(last) && cur === '/' && !isNum(next))
      || (isNum(last) && cur === ',' && !isNum(next))
      || (isOp(last, '-') && isNum(cur) && !mayNumber)
      || (!isNum(last) && isOp(cur) && oldChar !== cur)
    ) {
      // we store the previously added token, if is not empty
      prevToken = buffer.join('').trim() || prevToken;
      mayNumber = false;
      prev[++offset] = [cur];
    } else buffer.push(cur);

    // flag possible negative numbers
    mayNumber = last === '-' && isNum(cur);

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
  // hardcode white-space
  return text.replace(/\s/g, String.fromCharCode(160))
    // escape for HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // bold and italics
    .replace(/\*\*(.+?)\*\*/, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__(.+?)__/, '<i><span>__</span>$1<span>__</span></i>');
}

export function lineFormat(text) {
  // basic operators
  return text.replace(/^[-+*=/]$/, op => `<var data-${types[op]}>${op}</var>`)

    // fractions
    .replace(/^(\d+)\/(\d+)$/, '<var data-number><sup>$1</sup><span>/</span><sub>$2</sub></var>')

    // separators
    .replace(/^[([\])]$/, char => `<var data-${(char === '[' || char === '(') ? 'open' : 'close'}>${char}</var>`)

    // regular units/dates
    .replace(RE_UNIT, '<var data-number>$&</var>');
}

export function basicFormat(text) {
  let prevToken = '';

  return toChunks(text).reduce((prev, cur) => {
    // highlight all expressions near numbers only
    if (isSep(cur) || /\d/.test(cur) || /\d/.test(prevToken)) {
      prev.push(lineFormat(cur));
    } else {
      prev.push(simpleMarkdown(cur));
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

export function parseNumber(text) {
  if (text.includes('/')) {
    const [a, b] = text.split('/');

    return a / b;
  }

  // FIXME: how handle these stuff?
  // if (text.charAt() === '$') {
  //   text = text.substr(1);
  // }

  text = text.replace(/[^\d.-]/g, '');

  return parseFloat(text);
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
      const next = parseFloat(expr[i + 1]);
      const result = evaluateExpression(cur, prev, next);

      // FIXME: analyze this...
      expr.splice(i - 1, 3, result);

      if (old.length !== expr.length) return operateExpression(ops, expr);
    }
  }

  return expr;
}

export function calculateFromString(expr) {
  expr = expr.split(/\s+/);
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
      // FIXME: extract unit-types and such?
      root.push(t[0] === 'number' ? parseNumber(t[1]) : t[1]);
    } else {
      throw new TError(`Invalid terminator for: ${
        tokens.slice(0, i).map(x => x[1])
      }`, i);
    }
  }

  return tree;
}

export function reduceFromAST(tokens) {
  return tokens.reduce((prev, cur) => {
    if (Array.isArray(cur)) {
      const ops = reduceFromAST(cur);

      if (ops.length) {
        prev.push(calculateFromString(ops.join(' ')));
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

  for (let i = 0; i < simplified.length; i += 1) {
    const cur = simplified[i];
    const next = simplified[i + 1];

    chunks[offset] = chunks[offset] || [];
    chunks[offset].push(cur);

    if (typeof next === 'number' && typeof cur === 'number' || cur === '=') {
      offset += 1;
    }
  }

  const results = chunks
    .map(x => calculateFromString(x.join(' ')))
    .filter(x => !isNaN(x));

  return {
    chunks,
    results,
  };
}
