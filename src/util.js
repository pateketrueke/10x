import Convert from 'convert-units';

const convert = new Convert();
const groups = convert.measures();

const types = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
};

const keys = [];

groups.forEach(group => {
  convert.list(group).forEach(unit => {
    keys.push(unit.abbr);
    keys.push(unit.plural);
    keys.push(unit.singular);
  });
});

keys.sort((a, b) => b.length - a.length);

const RE_UNIT = new RegExp(`-?[$€£¢]?\\.?(?:\\d+|\\d+(?:[_,.]\\d+)*)%?\\s*(?:${keys.join('|')})?(?!<)`, 'ig');

export function basicFormat(text) {
  return text.replace(/&nbsp;/ig, ' ')
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(/([-+/*=])(?!\1)(?=\D)/g, (_, op) => `<var data-${types[op]}>${op}</var>`)
    .replace(/(\d+)\/(\d+)/g, '<var data-number><sup>$1</sup><span>/</span><sub>$2</sub></var>')
    .replace(/[([\])]/g, char => `<var data-${(char === '[' || char === '(') ? 'open' : 'close'}>${char}</var>`)
    .replace(RE_UNIT, '<var data-number>$&</var>');
}

export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
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

  for (let t; t = tokens.shift();) {
    if (t[0] === 'open' || t[0] === 'close') {
      if (t[0] === 'open') {
        const leaf = [];
        root.push(leaf);
        stack.push(root);
        root = leaf;
      } else if (t[0] === 'close') {
        root = stack.pop();
      }
    } else if (!['k', 'or', 'and', 'equal', 'result'].includes(t[0])) {
      root.push(t[0] === 'number' ? parseNumber(t[1]) : t[1]);
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

    if (typeof next === 'number' && typeof cur === 'number') {
      offset += 1;
    }
  }

  const results = chunks.map(ops => {
    return calculateFromString(ops.join(' '));
  });

  return {
    chunks,
    results,
  };
}
