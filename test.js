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
const expressions = {};

if (require('fs').existsSync('shared.json')) {
  Object.assign(expressions, JSON.parse(require('fs').readFileSync('shared.json')));
  Object.assign(units, Object.keys(expressions).reduce((prev, cur) => {
    prev[cur] = cur;
    return prev;
  }, {}));
}

// FIXME: move these to a better module...
let lastOp = ['plus', '+'];
let offset = 0;

// operate all possible expressions...
const chunks = reduceFromAST(tokens.tree, convert, expressions).reduce((prev, cur) => {
  const lastValue = prev[prev.length - 1] || [];

  if (lastValue[0] === 'number' && cur[0] === 'number') prev.push(lastOp, cur);
  else prev.push(cur);

  if (isOp(cur[1], '/*')) lastOp = cur;
  return prev;
}, []);

require('fs').writeFileSync('shared.json', JSON.stringify(expressions));

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

let info = {};
let _e;

try {
  info.results = normalized.map(x => calculateFromTokens(x));
} catch (e) {
  console.log(e.stack);
  _e = e;
}

if (_e || process.argv.includes('--debug')) {
  info.chunks = chunks;
  Object.assign(info, tokens);
}

process.stdout.write(JSON.stringify(info));
