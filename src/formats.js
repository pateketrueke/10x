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

const RE_UNIT = new RegExp(`(-?[$€£¢]?\\d[\\d,.]*)(\\s*)([-+/*=]|${keys.join('|')})?`, 'ig');

export function basicFormat(text) {
  return text.replace(/&nbsp;/ig, ' ')
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(RE_UNIT, (_, pre, mid, post) => {
      let type;

      switch (post) {
        case '=': type = 'equal'; break;
        case '+': type = 'plus'; break;
        case '-': type = 'min'; break;
        case '/': type = 'div'; break;
        case '*': type = 'mul'; break;
        default: type = 'unit'; break;
      }

      return `${pre ? `<var data-number>${pre}</var>` : ''}${mid}${post ? `<var data-${type}>${post}</var>` : ''}`;
    });
}

export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
}
