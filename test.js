import transform from './src/lib/transform';
import { isOp } from './src/lib/parser';
import { reduceFromAST } from './src/lib/reducer';
import { calculateFromTokens } from './src/lib/solver';
import { convertFrom, DEFAULT_MAPPINGS } from './src/lib/convert';

const argv = process.argv.slice(Math.max(2, process.argv.indexOf('--') + 1));

const units = {
  ...DEFAULT_MAPPINGS,
};

// try built-ins first
const convert = (num, base, target) => {
  return convertFrom(num, base, target);
};

const tokens = transform(argv.join(' '), units);
const normalized = [];

// FIXME: move these to a better module...
let lastOp = ['plus', '+'];
let offset = 0;

// operate all possible expressions...
const chunks = reduceFromAST(tokens.tree, convert).reduce((prev, cur) => {
  const lastValue = prev[prev.length - 1] || [];

  if (lastValue[0] === 'number' && cur[0] === 'number') prev.push(lastOp, cur);
  else prev.push(cur);

  if (isOp(cur[1], '/*')) lastOp = cur;
  return prev;
}, []);

// join chunks into final expressions
for (let i = 0; i < chunks.length; i += 1) {
  const cur = chunks[i];

  normalized[offset] = normalized[offset] || [];
  normalized[offset].push(cur);

  if (cur[0] === 'expr' && (cur[1] === '=' || cur[1] === ';')) {
    normalized[offset].pop();
    offset += 1;
  }
}

try {
  console.log('--- results ---');
  console.log(require('util').inspect(normalized.map(x => calculateFromTokens(x)), { colors: true, depth: 5 }));
} catch (e) {
  console.log(e.stack);

  console.log('--- chunks ---');
  console.log(require('util').inspect(chunks, { colors: true, depth: 5 }));

  console.log('--- tree ---');
  console.log(require('util').inspect(tokens.tree, { colors: true, depth: 5 }));

  console.log('--- tokens ---');
  console.log(require('util').inspect(tokens.input, { colors: true, depth: 5 }));
  console.log(require('util').inspect(tokens.output, { colors: true, depth: 5 }));
}
