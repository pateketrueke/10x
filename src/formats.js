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

const RE_UNIT = new RegExp(`(-?[$€£¢]?\\d[\\d,.]*)\s*(?:${keys.join('|')}|\s*[-+/*=])?`, 'gi');

export function basicFormat(text) {
  return text
    .replace(/<\/font[^<>]*>/ig, '')
    .replace(/=/g, '<span data-equal>=</span>')
    .replace(RE_UNIT, (_, prefix, operator, unitType, suffix) => {
      console.log(operator, unitType)
      return _.trim();
    });
    // .replace(/(\s+)([-+/*])(\s+(=>(?!\1)))/g, (_, $1, $2, $3) => {
    //   let type;

    //   switch ($2) {
    //     case '+': type = 'plus'; break;
    //     case '-': type = 'min'; break;
    //     case '/': type = 'div'; break;
    //     case '*': type = 'mul'; break;
    //     default: break;
    //   }

    //   return `${$1}<var data-${type}>${$2}</var>${$3}`;
    // });
}

export function simpleMarkdown(text) {
  return text
    .replace(/\*\*([^<>*]+?)\*\*/g, '<b><span>**</span>$1<span>**</span></b>')
    .replace(/__([^<>_]+?)__/g, '<i><span>__</span>$1<span>__</span></i>');
}
