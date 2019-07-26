import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

const convert = new Convert();
const groups = convert.measures();

export const TIME_UNITS = convert.list('time').map(x => x.abbr).sort();
export const CURRENCY_SYMBOLS = currencySymbols.settings.symbols;
export const DEFAULT_MAPPINGS = {};

// fixed-length types
export const DEFAULT_TYPES = [
  ['0000-00-00T00:00:00.000Z', 'datetime'],
];

// assign currency-codes as mappings
Object.keys(CURRENCY_SYMBOLS)
  .forEach(k => {
    DEFAULT_MAPPINGS[k] = k;
  });

// iterate over convert-units
groups.forEach(group => {
  convert.list(group).forEach(unit => {
    const abbr = unit.abbr;
    const plural = unit.plural;
    const singular = unit.singular;

    DEFAULT_MAPPINGS[abbr] = abbr;

    // memoize for fast look-up
    if (!plural.includes(' ') && singular !== plural) {
      DEFAULT_MAPPINGS[plural.toLowerCase()] = abbr;
      DEFAULT_MAPPINGS[singular.toLowerCase()] = abbr;
    }
  });
});


export function convertFrom(num, base, target) {
  if (CURRENCY_SYMBOLS[base] || CURRENCY_SYMBOLS[target]) {
    // FIXME: not supported yet...
    return num;
  }

  return new Convert(num).from(base).to(target);
}

export function unitFrom(types) {
  const tokens = types
    .sort((a, b) => b[0].length - a[0].length)
    .map(x => [x[0].split('').map((v, l) => (s => (v === '0' ? (s >= 0) : v === s))), x[1]]);

  const find = v => {
    let found = [];

    for (let j = 0; j < tokens.length; j += 1) {
      for (let i = 0; i < tokens[j][0].length; i += 1) {
        if (!tokens[j][0][i](v[i])) {
          found = [];
          break;
        }

        found = [j, tokens[j][0].length];
        break;
      }

      if (found) break;
    }

    return found;
  }

  return value => {
    const [offset, length] = find(value);

    if (length && tokens[offset]) {
      return [value.slice(0, length).join(''), tokens[offset][1]];
    }

    return null;
  };
}
