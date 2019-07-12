export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
}
