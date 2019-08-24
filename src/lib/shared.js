import {
  CURRENCY_MAPPINGS, ALPHA_MAPPINGS,
} from './convert';

const OP_TYPES = {
  '!~': 'notlike',
  '!=': 'noteq',
  '==': 'iseq',
  '<=': 'lteq',
  '>=': 'gteq',
  '=~': 'like',
  '++': 'inc',
  '--': 'dec',
  '&&': 'and',
  '||': 'x-or',
  '~>': 'void',
  '->': 'func',
  '<-': 'bind',
  '=>': 'arrow',
  '|>': 'rpipe',
  '<|': 'lpipe',
  '<': 'lt',
  '>': 'gt',
  '!': 'not',
  '[': 'begin',
  ']': 'end',
  '{': 'begin',
  '}': 'end',
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
  ',': 'or',
  ';': 'k',
};

const RE_DAYS = /^(?:now|to(?:day|night|morrow)|yesterday|week(?:end)?)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::?[0-5]?[0-9]){,2}(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)\w*\b/i;
const RE_NO_ALPHA = new RegExp(`^[^a-zA-Z${Object.keys(ALPHA_MAPPINGS).join('')}]*`, 'g');

export const isInt = x => /^-?(?!0)\d+(\.\d+)?$/.test(x);

export const hasOp = x => OP_TYPES[x];
export const hasDays = x => RE_DAYS.test(x);
export const hasHours = x => RE_HOURS.test(x);
export const hasMonths = x => RE_MONTHS.test(x);
export const hasFmt = x => /^["`_*~]$/.test(x);
export const hasSep = x => '{[( )]}|;,.'.includes(x);
export const hasNum = x => /^-?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const hasChar = x => !!CURRENCY_MAPPINGS[x] || !!ALPHA_MAPPINGS[x] || /^[a-zA-Z_#']/.test(x);

export const hasOwnKeyword = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export const hasKeyword = (x, units, fallback) => {
  if (!x) return false;

  const key = x.replace(RE_NO_ALPHA, '');

  // skip further detection on white-space
  if (key.includes(' ')) return false;

  if (fallback) {
    return key;
  }

  const test = key && (hasOwnKeyword(units, key) || hasOwnKeyword(units, key.toLowerCase()));

  return test;
};
