import Convert from 'convert-units';

const convert = new Convert();
const groups = convert.measures();
const keys = [];

groups.forEach(group => {
  convert.list(group).forEach(unit => {
    keys.push(unit.abbr);
    keys.push(unit.plural);
    keys.push(unit.singular);
  });
});

keys.sort((a, b) => b.length - a.length);

const RE_UNIT = new RegExp(`(-?[$€£¢]?\\.?\\d[\\d,.]*[a-z%]?)(\\s*)(${keys.join('|')}|)([\\s\\])]*)([-+/*=]?)(?!\\5)`, 'ig');

export function basicFormat(text) {
  return text.replace(/&nbsp;/ig, ' ')
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\d+)\/(\d+)/g, '<var data-number><sup>$1</sup><span>/</span><sub>$2</sub></var>')
    .replace(RE_UNIT, (_, pre, mid, post, suff, op) => {
      let type;

      switch (op) {
        case '=': type = 'equal'; break;
        case '+': type = 'plus'; break;
        case '-': type = 'min'; break;
        case '/': type = 'div'; break;
        case '*': type = 'mul'; break;
        default: type = 'unit'; break;
      }

      op = op ? `<var data-${type}>${op}</var>` : '';

      if (!post) {
        return `<var data-number>${pre}</var>${mid}${suff}${op}`;
      }

      return `<var data-number>${pre}${mid}${post}</var>${suff}${op}`;
    })
    .replace(/[([\])]/g, char => {
      return `<var data-${(char === '[' || char === '(') ? 'open' : 'close'}>${char}</var>`;
    })
    .replace(/(\s+|data-\w+>)([-+/*=])(\s+|<)/g, (_, ll, op, rr) => {
      let type;

      switch (op) {
        case '=': type = 'equal'; break;
        case '+': type = 'plus'; break;
        case '-': type = 'min'; break;
        case '/': type = 'div'; break;
        case '*': type = 'mul'; break;
        default: type = 'unit'; break;
      }

      return `${ll || ''}<var data-${type}>${op}</var>${rr || ''}`;
    });
}

export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
}

export function getClipbordText(e) {
  e.preventDefault();

  let content = window.clipboardData
    ? window.clipboardData.getData('Text')
    : e.clipboardData.getData('text/plain');

  // encode incoming HTML-chars for safety!
  content = content.replace(/</g, '&lt;');
  content = content.replace(/>/g, '&gt;');
  content = content.replace(/&/g, '&amp;');

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
