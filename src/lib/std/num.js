export function format(value, pattern, locale) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  
  if (!pattern) {
    return new Intl.NumberFormat(locale || 'en').format(num);
  }
  
  if (pattern.startsWith('$') || pattern.startsWith('€') || pattern.startsWith('£')) {
    const currency = pattern[0] === '$' ? 'USD' : pattern[0] === '€' ? 'EUR' : 'GBP';
    return new Intl.NumberFormat(locale || 'en', {
      style: 'currency',
      currency,
    }).format(num);
  }
  
  if (pattern.includes('%')) {
    return new Intl.NumberFormat(locale || 'en', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num / 100);
  }
  
  const opts = {};
  
  if (pattern.includes(',')) {
    opts.useGrouping = true;
  }
  
  const decimals = pattern.match(/\.(\d+)/);
  if (decimals) {
    opts.minimumFractionDigits = parseInt(decimals[1], 10);
    opts.maximumFractionDigits = parseInt(decimals[1], 10);
  }
  
  return new Intl.NumberFormat(locale || 'en', opts).format(num);
}

export function round(value, decimals) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  const d = decimals ?? 0;
  const factor = Math.pow(10, d);
  return Math.round(num * factor) / factor;
}

export function floor(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.floor(num);
}

export function ceil(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.ceil(num);
}

export function truncate(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.trunc(num);
}

export function clamp(value, min, max) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.min(Math.max(num, min), max);
}

export function min(...values) {
  const nums = values.map(v => typeof v === 'object' ? v.valueOf() : v);
  return Math.min(...nums);
}

export function max(...values) {
  const nums = values.map(v => typeof v === 'object' ? v.valueOf() : v);
  return Math.max(...nums);
}

export function abs(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.abs(num);
}

export function pow(base, exp) {
  const b = typeof base === 'object' ? base.valueOf() : base;
  const e = typeof exp === 'object' ? exp.valueOf() : exp;
  return Math.pow(b, e);
}

export function sqrt(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.sqrt(num);
}

export function log(value, base) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  if (base) {
    const b = typeof base === 'object' ? base.valueOf() : base;
    return Math.log(num) / Math.log(b);
  }
  return Math.log(num);
}

export function sin(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.sin(num);
}

export function cos(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.cos(num);
}

export function tan(value) {
  const num = typeof value === 'object' ? value.valueOf() : value;
  return Math.tan(num);
}

export function random(min, max) {
  if (min === undefined) return Math.random();
  if (max === undefined) return Math.random() * min;
  return min + Math.random() * (max - min);
}

export default {
  format,
  round,
  floor,
  ceil,
  truncate,
  clamp,
  min,
  max,
  abs,
  pow,
  sqrt,
  log,
  sin,
  cos,
  tan,
  random,
};
