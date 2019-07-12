export function getTextNodeAtPosition(target, offset) {
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

export function saveCaretPosition(target) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  range.setStart(target, 0);

  const { length } = range.toString();

  return () => {
    const pos = getTextNodeAtPosition(target, length);

    selection.removeAllRanges();

    const range = new Range();

    range.setStart(pos.node, pos.position);
    selection.addRange(range);
  };
}
