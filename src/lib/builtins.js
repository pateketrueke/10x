import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

const convert = new Convert();
const groups = convert.measures();

export const INC_DEC = [
  ['week', 'weekend'],
  ['yesterday', 'today', 'now', 'tonight', 'tomorrow'],
  ['jan', 'feb', 'mar', 'apr', 'mar', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
];

export const TIME_UNITS = convert.list('time').map(x => x.abbr).sort();

export const CURRENCY_SYMBOLS = currencySymbols.settings.symbols;
export const CURRENCY_MAPPINGS = {};
export const CURRENCY_EXCHANGES = {};

Object.keys(CURRENCY_SYMBOLS).forEach(key => {
  CURRENCY_MAPPINGS[CURRENCY_SYMBOLS[key]] = key;
});

// FIXME: normalization of units (plural vs singulars)
export const DEFAULT_MAPPINGS = {};
export const DEFAULT_EXPRESSIONS = {};
export const DEFAULT_INFLECTIONS = {};

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
      DEFAULT_INFLECTIONS[abbr] = [singular.toLowerCase(), plural.toLowerCase()];
    }
  });
});

export async function useCurrencies(opts, fromDate) {
  const today = fromDate || new Date().toISOString().substr(0, 10);

  const {
    key, read, write, exists, resolve,
  } = opts;

  if (!exists(key) || read(key).date !== today) {
    write(key, JSON.stringify({
      ...(await resolve()),
      date: today,
    }));
  }

  // all rate conversions are EUR-based!
  Object.assign(CURRENCY_EXCHANGES, read(key).rates);
}
