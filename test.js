import transform from './src/lib/transform';

import {
  isOp,
} from './src/lib/parser';

import {
  reduceFromAST,
  calculateFromTokens,
} from './src/lib/solver';

import {
  convertFrom,
  DEFAULT_MAPPINGS,
} from './src/lib/convert';

const argv = process.argv.slice(Math.max(2, process.argv.indexOf('--') + 1));

const units = {
  ...DEFAULT_MAPPINGS,
};

// try built-ins first
const convert = (num, base, target) => {
  return convertFrom(num, base, target);
};

const tokens = transform(argv.join(' '), units);

// OK, now we have tokens, and they're transformed into a validated sequence
// next, is transform that into a tree... and finally, resolve everything inside
// the thin is... how the AST should be parsed for, how defs/calls are handled by?

// each time a unit is reached, we lookup for its value, if exists,
// evaluate that chunk; otherwise probably the value is missing, and a simple conversion would work

// maths are simple to solve as previously we did... but now, we need to understand function-calls and such,
// so, the solver must care about that? I don't think so... it should care only of solved values, a reducer may?

// yeah, the reduces would take those chunks and replace them in place, at the end we just need a new tree without fns/calls
console.log('--- tree ---');
console.log(require('util').inspect(tokens.tree, { colors: true, depth: 5 }));

let lastOp = ['plus', '+'];

// operate all possible expressions...
const chunks = reduceFromAST(tokens.tree, convert).reduce((prev, cur) => {
  const lastValue = prev[prev.length - 1] || [];

  if (lastValue[0] === 'number' && cur[0] === 'number') prev.push(lastOp, cur);
  else prev.push(cur);

  if (isOp(cur[1], '/*')) lastOp = cur;
  return prev;
}, []);

console.log('--- chunks ---');
console.log(require('util').inspect(chunks, { colors: true, depth: 5 }));

console.log('--- results ---');
console.log(require('util').inspect(calculateFromTokens(chunks), { colors: true, depth: 5 }));
