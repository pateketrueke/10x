import Convert from 'convert-units';

const convert = new Convert();
const groups = convert.measures();

const types = {
  '?': 'result',
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
  ',': 'and',
  ';': 'or',
  '.': 'k',
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

const RE_UNIT = new RegExp(`(-?[$€£¢]?(?:\\.\d+|\\d+(?:[_,.]\\d+)*)[a-z%]?)(\\s*)(${keys.join('|')}|)([\\s\\])]*)([-+/*=;,.?]?)(?!\\5)`, 'ig');

export function basicFormat(text) {
  return text.replace(/&nbsp;/ig, ' ')
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\d+)\/(\d+)/g, '<var data-number><sup>$1</sup><span>/</span><sub>$2</sub></var>')
    .replace(RE_UNIT, (_, pre, mid, post, suff, op) => {
      op = op ? `<var data-${types[op] || 'unit'}>${op}</var>` : '';

      if (!post) {
        return `<var data-number>${pre}</var>${mid}${suff}${op}`;
      }

      return `<var data-number>${pre}${mid}${post}</var>${suff}${op}`;
    })
    .replace(/[([\])]/g, char => {
      return `<var data-${(char === '[' || char === '(') ? 'open' : 'close'}>${char}</var>`;
    })
    .replace(/(\s|\/\w+>)([-+/*=;,.?])(\s*|<)/g, (_, ll, op, rr) => {
      return `${ll || ''}<var data-${types[op] || 'unit'}>${op}</var>${rr || ''}`;
    });
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

export function truncateDecimals(value, length) {
  return value.toFixed(length).replace(/\.0+$/, '');
}

export function reduceOperations(input) {
  let currentOp = null;

  return truncateDecimals(input.reduce((prev, cur) => {
    if (currentOp) {
      if (currentOp === '+') prev += cur;
      if (currentOp === '-') prev -= cur;
      if (currentOp === '/') prev /= cur;
      if (currentOp === '*') prev *= cur;

      currentOp = null;

      return prev;
    }

    if (typeof cur !== 'number') currentOp = cur;
    else return prev || cur;

    return prev;
  }, 0), 2);
}

export function calculateFromTokens(tokens) {
  const groupedInput = [];

  let offset = 0;
  let fixedStack;

  tokens.forEach(token => {
    if (!fixedStack || token[0] === 'open') {
      if (fixedStack && fixedStack.length) {
        groupedInput[offset] = [parseFloat(reduceOperations(groupedInput[offset])), ...fixedStack];
      }

      fixedStack = token[0] !== 'open' ? [parseNumber(token[1])] : [];
      offset += 1;
      return;
    }

    if (['k', 'or', 'and', 'equal', 'result'].includes(token[0]) || token[0] === 'close') {
      groupedInput.push(fixedStack);
      fixedStack = [];

      if (token[0] === 'close') offset -= 1;
      return;
    }

    fixedStack.push(token[0] === 'number' ? parseNumber(token[1]) : token[1]);
  });

  const reduced = groupedInput.map(ops => {
    if (typeof ops[0] === 'number' && typeof ops[ops.length - 1] === 'number') {
      return parseFloat(reduceOperations(ops));
    }

    return ops;
  }).reduce((prev, cur) => {
    if (typeof cur === 'number') {
      return prev.concat(cur);
    }

    if (typeof prev[prev.length - 1] === 'number' && typeof cur[0] !== 'number') {
      return prev.concat(parseFloat(reduceOperations([prev.pop(), ...cur])));
    }

    return prev.concat(cur);
  }, []);

  return {
    normalized: reduceOperations(reduced),
    simplified: reduced.join(''),
  };
}
