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

export function insertTextAtCursor(text, offset = 0, remove = 0) {
  if (window.getSelection) {
    const selection = window.getSelection();

    if (selection.getRangeAt && selection.rangeCount) {
      const range = selection.getRangeAt(0);

      if (offset || remove) {
        range.setStart(range.endContainer, offset - remove);
        range.setEnd(range.endContainer, offset);
      }

      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  } else if (document.selection && document.selection.createRange) {
    document.selection.createRange().text = text;
  }
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

    if (window.getSelection) {
      const selObj = window.getSelection();
      const selRange = selObj.getRangeAt(0);

      selRange.deleteContents();
      selRange.insertNode(document.createTextNode(content));
    }
  } else if (e.clipboardData) {
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  }
}
