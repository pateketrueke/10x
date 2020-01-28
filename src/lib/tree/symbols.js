export const EOF = Symbol('EOF');
export const EOL = Symbol('EOL');
export const FFI = Symbol('FFI');
export const TEXT = Symbol('TEXT');

export const REF = Symbol('REF');
export const CODE = Symbol('CODE');
export const BOLD = Symbol('BOLD');
export const ITALIC = Symbol('ITALIC');
export const OL_ITEM = Symbol('OL_ITEM');
export const UL_ITEM = Symbol('UL_ITEM');
export const HEADING = Symbol('HEADING');
export const BLOCKQUOTE = Symbol('BLOCKQUOTE');

export const OPEN = Symbol('OPEN');
export const CLOSE = Symbol('CLOSE');
export const COMMA = Symbol('COMMA');
export const BEGIN = Symbol('BEGIN');
export const DONE = Symbol('DONE');

export const MINUS = Symbol('MINUS');
export const PLUS = Symbol('PLUS');
export const MUL = Symbol('MUL');
export const DIV = Symbol('DIV');
export const MOD = Symbol('MOD');

export const OR = Symbol('OR');
export const DOT = Symbol('DOT');
export const PIPE = Symbol('PIPE');
export const BLOCK = Symbol('BLOCK');
export const RANGE = Symbol('RANGE');
export const SPREAD = Symbol('SPREAD');

export const SOME = Symbol('SOME');
export const EVERY = Symbol('EVERY');

export const REGEX = Symbol('REGEX');
export const SYMBOL = Symbol('SYMBOL');
export const LITERAL = Symbol('LITERAL');
export const NUMBER = Symbol('NUMBER');
export const STRING = Symbol('STRING');

export const NOT = Symbol('NOT');
export const LIKE = Symbol('LIKE');
export const EQUAL = Symbol('EQUAL');
export const NOT_EQ = Symbol('NOT_EQ');
export const EXACT_EQ = Symbol('EXACT_EQ');

export const LESS = Symbol('LESS');
export const LESS_EQ = Symbol('LESS_EQ');
export const GREATER = Symbol('GREATER');
export const GREATER_EQ = Symbol('GREATER_EQ');

export const COMMENT = Symbol('COMMENT');
export const COMMENT_MULTI = Symbol('COMMENT_MULTI');

export const DERIVE_METHODS = [
  'If', 'It', 'Then', 'Else',
  'Try', 'Check', 'Rescue',
  'While', 'Do',
  'Let', 'Match',
];

export const CONTROL_TYPES = [
  ':if', ':else',
  ':try', ':check', ':rescue',
  ':while', ':do',
  ':let', ':loop', ':match',
  ':import', ':from', ':module', ':export', ':template',
];

export const SYMBOL_TYPES = [
  ':nil', ':on', ':off',
];
