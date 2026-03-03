const UNITS = {
  ms: 1,
  millisecond: 1,
  s: 1000,
  second: 1000,
  m: 60000,
  minute: 60000,
  h: 3600000,
  hour: 3600000,
  d: 86400000,
  day: 86400000,
  w: 604800000,
  week: 604800000,
  M: 2592000000,
  month: 2592000000,
  y: 31536000000,
  year: 31536000000,
};

function toDate(input) {
  if (input === undefined || input === null) return new Date();
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  return new Date(input);
}

export function now() {
  return Date.now();
}

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function format(date, pattern, locale) {
  const d = toDate(date);

  if (!pattern || pattern === 'iso') {
    return d.toISOString();
  }

  const opts = {};

  if (pattern.includes('date')) {
    opts.dateStyle = 'full';
  }
  if (pattern.includes('time')) {
    opts.timeStyle = 'long';
  }

  if (Object.keys(opts).length) {
    return new Intl.DateTimeFormat(locale || 'en', opts).format(d);
  }

  const pad = n => String(n).padStart(2, '0');

  return pattern
    .replace(/YYYY/g, d.getFullYear())
    .replace(/YY/g, String(d.getFullYear()).slice(-2))
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/M/g, d.getMonth() + 1)
    .replace(/DD/g, pad(d.getDate()))
    .replace(/D/g, d.getDate())
    .replace(/HH/g, pad(d.getHours()))
    .replace(/H/g, d.getHours())
    .replace(/mm/g, pad(d.getMinutes()))
    .replace(/m/g, d.getMinutes())
    .replace(/ss/g, pad(d.getSeconds()))
    .replace(/s/g, d.getSeconds());
}

export function add(date, amount, unit) {
  const d = toDate(date);
  const ms = UNITS[unit] || UNITS[unit.toLowerCase()] || 1;
  return new Date(d.getTime() + (amount * ms));
}

export function subtract(date, amount, unit) {
  return add(date, -amount, unit);
}

export function startOf(date, unit) {
  const d = toDate(date);

  switch (unit.toLowerCase()) {
    case 'day':
    case 'd':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    case 'month':
    case 'm':
      return new Date(d.getFullYear(), d.getMonth(), 1);
    case 'year':
    case 'y':
      return new Date(d.getFullYear(), 0, 1);
    case 'hour':
    case 'h':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    case 'minute':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
    default:
      return d;
  }
}

export function endOf(date, unit) {
  const d = toDate(date);

  switch (unit.toLowerCase()) {
    case 'day':
    case 'd':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    case 'month':
    case 'm':
      return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    case 'year':
    case 'y':
      return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
    default:
      return d;
  }
}

export function parse(str) {
  return new Date(str);
}

export function dayOfWeek(date) {
  return toDate(date).getDay();
}

export function dayOfMonth(date) {
  return toDate(date).getDate();
}

export function month(date) {
  return toDate(date).getMonth() + 1;
}

export function year(date) {
  return toDate(date).getFullYear();
}

export function hour(date) {
  return toDate(date).getHours();
}

export function minute(date) {
  return toDate(date).getMinutes();
}

export function diff(a, b, unit) {
  const d1 = toDate(a);
  const d2 = toDate(b);
  const ms = Math.abs(d1.getTime() - d2.getTime());
  const divisor = UNITS[unit] || UNITS[unit.toLowerCase()] || 1;
  return Math.floor(ms / divisor);
}

export default {
  now,
  today,
  format,
  add,
  subtract,
  startOf,
  endOf,
  parse,
  dayOfWeek,
  dayOfMonth,
  month,
  year,
  hour,
  minute,
  diff,
};
