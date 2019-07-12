export function basicFormat(text) {
  return text
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(/(?![<*])([=*/+-])/g, (_, $1) => {
      let type;

      switch ($1) {
        case '=': type = 'equal'; break;
        case '+': type = 'plus'; break;
        case '-': type = 'min'; break;
        case '/': type = 'div'; break;
        case '*': type = 'mul'; break;
        default: break;
      }

      return `<var data-${type}>${$1}</var>`;
    })
    .replace(/([$]?\d[\d,.]*)/g, '<var data-number>$1</var>');
}

export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
}
