import Convert from './units/index.js';
import currencySymbols from './currency-symbols.js';

export const INC_DEC = [
  ['week', 'weekend'],
  ['yesterday', 'today', 'now', 'tonight', 'tomorrow'],
  ['jan', 'feb', 'mar', 'apr', 'mar', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
];

let convertCache = null;
let unitMappingsReady = false;
let currencyMappingsReady = false;

function getConvert() {
  if (!convertCache) {
    convertCache = new Convert();
  }
  return convertCache;
}

export const TIME_UNITS = [];

export const CURRENCY_SYMBOLS = {};
export const CURRENCY_MAPPINGS = {};
export const CURRENCY_EXCHANGES = {};

// FIXME: normalization of units (plural vs singulars)
export const DEFAULT_MAPPINGS = {};
export const DEFAULT_EXPRESSIONS = {};
export const DEFAULT_INFLECTIONS = {};

function ensureCurrencyMappings() {
  if (currencyMappingsReady) return;
  currencyMappingsReady = true;

  Object.assign(CURRENCY_SYMBOLS, currencySymbols);

  Object.keys(CURRENCY_SYMBOLS).forEach(key => {
    const symbol = CURRENCY_SYMBOLS[key];
    CURRENCY_MAPPINGS[symbol] = key;
    DEFAULT_MAPPINGS[key] = key;
  });
}

export function ensureDefaultMappings() {
  ensureCurrencyMappings();
  if (unitMappingsReady) return DEFAULT_MAPPINGS;
  unitMappingsReady = true;

  const convert = getConvert();
  const groups = convert.measures();

  // Keep the existing mutable export shape while deferring work until needed.
  TIME_UNITS.push(...convert.list('time').map(x => x.abbr).sort());

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

  return DEFAULT_MAPPINGS;
}

export async function useCurrencies(opts, fromDate) {
  ensureCurrencyMappings();
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
