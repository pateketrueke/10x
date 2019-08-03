export function getClipbordText(e) {
  e.preventDefault();

  const content = window.clipboardData
    ? window.clipboardData.getData('Text')
    : e.clipboardData.getData('text/plain');

  return content;
}

export function getTextNodeAtPosition(target, offset = 0) {
  const c = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, elem => {
    if (offset >= elem.textContent.length) {
      offset -= elem.textContent.length;
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  }).nextNode();

  return {
    node: c || target,
    position: c ? offset : 0,
  };
}

export function getSelectionStart() {
  const node = document.getSelection().anchorNode;

  return (node && node.nodeType === 3) ? node.parentNode : node;
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

  try {
    range.setStart(pos.node, pos.position);
    selection.addRange(range);
  } catch (e) {
    // do nothing
  }
}
