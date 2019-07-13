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

const RE_UNIT = new RegExp(`(-?[$€£¢]?\\d[\\d,.]*(?:${keys.join('|')})?)`, 'gi');

export function basicFormat(text) {
  return text
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(/=/g, '<var data-equal>=</var>')
    .replace(RE_UNIT, '<var data-number>$1</var>')
    .replace(/(?!\w)([-+/*])(?!\w)/g, (_, $1, $2) => {
      let type;

      switch ($1) {
        case '+': type = 'plus'; break;
        case '-': type = 'min'; break;
        case '/': type = 'div'; break;
        case '*': type = 'mul'; break;
        default: break;
      }

      return `<var data-${type}>${$1}</var>`;
    });
}

export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
}
