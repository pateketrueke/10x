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

export function insertTextAtCursor(text) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  range.deleteContents();
  range.insertNode(document.createTextNode(text));
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

export function noMarkup(e) {
  e.preventDefault();

  if (window.clipboardData) {
    const content = window.clipboardData.getData('Text');
    const selObj = window.getSelection();
    const selRange = selObj.getRangeAt(0);

    selRange.deleteContents();
    selRange.insertNode(document.createTextNode(content));
  } else if (e.clipboardData) {
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  }
}
