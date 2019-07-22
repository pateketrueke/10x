import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

const convert = new Convert();
const groups = convert.measures();

export const TIME_UNITS = convert.list('time').map(x => x.abbr).sort();
export const CURRENCY_SYMBOLS = currencySymbols.settings.symbols;
export const DEFAULT_MAPPINGS = {};

// assign currency-codes as mappings
Object.keys(CURRENCY_SYMBOLS)
  .map(k => {
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
