export function getTextNodeAtPosition(root, index) {
  let lastNode = null;

  const c = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, elem => {
    if (index >= elem.textContent.length) {
      index -= elem.textContent.length;
      lastNode = elem;
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  }).nextNode();

  return {
    node: c ? c : root,
    position: c ? index : 0,
  };
}

export function setCursor(target, offset) {
  const pos = getTextNodeAtPosition(target, offset);
  const selection = window.getSelection();
  const range = new Range();

  selection.removeAllRanges();
  range.setStart(pos.node, pos.position);
  selection.addRange(range);
}

export function getCursor(target) {
  let caretPos = 0;
  let sel;
  let range;

  if (window.getSelection) {
    sel = window.getSelection();

    if (sel.rangeCount) {
      range = sel.getRangeAt(0);

      if (range.commonAncestorContainer.parentNode === target) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();

    if (range.parentElement() === target) {
      const tempEl = document.createElement('span');
      const tempRange = range.duplicate();

      editableDiv.insertBefore(tempEl, target.firstChild);
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint('EndToEnd', range);
      caretPos = tempRange.text.length;
    }
  }

  return caretPos;
}
