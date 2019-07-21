import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

const convert = new Convert();
const groups = convert.measures();

export const DEFAULT_MAPPINGS = {};

// assign currency-codes as mappings
Object.keys(currencySymbols.settings.symbols)
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
  // FIXME: implements...
}
