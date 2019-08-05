import Convert from 'convert-units';
import currencySymbols from 'currency-symbol.js';

const convert = new Convert();
const groups = convert.measures();

export const TIME_UNITS = convert.list('time').map(x => x.abbr).sort();

export const CURRENCY_SYMBOLS = currencySymbols.settings.symbols;
export const CURRENCY_MAPPINGS = {};

Object.keys(CURRENCY_SYMBOLS).forEach(key => {
  CURRENCY_MAPPINGS[CURRENCY_SYMBOLS[key]] = key;
});

export const DEFAULT_EXPRESSIONS = {};
export const DEFAULT_INFLECTIONS = {};

// fraction handling is built-in
export const DEFAULT_MAPPINGS = {
  fr: 'fr',
  frac: 'fr',
  fraction: 'fr',
  fractions: 'fr',
};

export const ALPHA_CHARS = {
  Alpha: ['Α', 'α'],
  Beta: ['Β', 'β'],
  Gamma: ['Γ', 'γ'],
  Delta: ['Δ', 'δ'],
  Epsilon: ['Ε', 'ε'],
  Zeta: ['Ζ', 'ζ'],
  Eta: ['Η', 'η'],
  Theta: ['Θ', 'θ'],
  Iota: ['Ι', 'ι'],
  Kappa: ['Κ', 'κ'],
  Lambda: ['Λ', 'λ'],
  Mu: ['Μ', 'μ'],
  Nu: ['Ν', 'ν'],
  Xi: ['Ξ', 'ξ'],
  Omicron: ['Ο', 'ο'],
  Pi: ['Π', 'π'],
  Rho: ['Ρ', 'ρ'],
  Sigma: ['Σ', 'σ'],
  Tau: ['Τ', 'τ'],
  Upsilon: ['Υ', 'υ'],
  Phi: ['Φ', 'φ'],
  Chi: ['Χ', 'χ'],
  Psi: ['Ψ', 'ψ'],
  Omega: ['Ω', 'ω'],
};

export const ALPHA_MAPPINGS = Object.keys(ALPHA_CHARS)
  .reduce((prev, cur) => {
    ALPHA_CHARS[cur].forEach(i => {
      prev[i] = cur;
    });

    return prev;
  }, {});

// fixed-length types
export const DEFAULT_TYPES = [
  ['0000-00-00T00:00:00', 'datetime'],
  ['0000-00-00', 'datetime'],
];

export const INC_DEC = [
  ['week', 'weekend'],
  ['yesterday', 'today', 'now', 'tonight', 'tomorrow'],
  ['jan', 'feb', 'mar', 'apr', 'mar', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
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
      DEFAULT_INFLECTIONS[abbr] = [singular.toLowerCase(), plural.toLowerCase()];
    }
  });
});

export function possibilitiesFrom(num, unit) {
  const index = !num && INC_DEC.find(x => x.includes(unit));

  if (index) {
    return index;
  }

  const test = DEFAULT_MAPPINGS[unit] || DEFAULT_MAPPINGS[unit.toLowerCase()];

  if (test) {
    const opts = convert.from(test).possibilities();

    return opts;
  }

  return [unit];
}

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
      const result = tokens[j][0].every((f, i) => f(v[i]));

      if (result) {
        found = [j, tokens[j][0].length];
        break;
      }
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
