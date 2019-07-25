import transform from './src/lib/transform';

import {
  isOp, isSep, toNumber, toValue,
} from './src/lib/parser';

import { reduceFromAST } from './src/lib/reducer';
import { calculateFromTokens } from './src/lib/solver';
import { convertFrom, DEFAULT_MAPPINGS } from './src/lib/convert';

// FIXME: nice to have on CLI only...
global.console.log = (...args) => {
  process.stderr.write(require('util').inspect(args, { colors: true, depth: 10 }) + '\n');
};

const argv = process.argv.slice(Math.max(2, process.argv.indexOf('--') + 1));

const units = {
  ...DEFAULT_MAPPINGS,
};

// try built-ins first
const convert = (num, base, target) => {
  return convertFrom(num, base, target);
};

const normalized = [];
const expressions = {};

if (require('fs').existsSync('shared.json')) {
  Object.assign(expressions, JSON.parse(require('fs').readFileSync('shared.json')));
  Object.assign(units, Object.keys(expressions).reduce((prev, cur) => {
    prev[cur] = cur;
    return prev;
  }, {}));
}

const tokens = transform(argv.join(' '), units);

let chunks;
let info = {};
let _e;

try {
  // FIXME: move these to a better module... also, `1 1 => 1 + 2` transform could occur
  // during resolve... or tree, transform, whatever... not here!

  let offset = 0;

  // split over single values...
  chunks = reduceFromAST(tokens.tree, convert, expressions).reduce((prev, cur) => {
    const lastValue = prev[prev.length - 1] || [];

    if (lastValue[0] === 'number' && cur[0] === 'number') {
      prev.push(['expr', ';', 'k'], cur);
    } else prev.push(cur);

    return prev;
  }, []);

  require('fs').writeFileSync('shared.json', JSON.stringify(expressions, null, 2));

  // join chunks into final expressions
  for (let i = 0; i < chunks.length; i += 1) {
    const cur = chunks[i];

    normalized[offset] = normalized[offset] || [];
    normalized[offset].push(cur);

    // make sure we split from all remaining separators
    if (cur[0] === 'expr' && isSep(cur[1])) {
      normalized[offset].pop();

      // ensure we keep no empty chunks
      if (normalized[offset].length) offset += 1;
    }
  }

  info.results = normalized.map(x => {
    let value = calculateFromTokens(x);

    if (value[0] === 'number') {
      value = toNumber(value);
    }

    return {
      fmt: toValue(value[1], value[2]),
      val: value[1],
      type: value[0],
      unit: value[2],
    };
  });
} catch (e) {
  process.stderr.write(e.stack);
  _e = e;
} finally {
  if (_e || process.argv.includes('--debug')) {
    info.chunks = chunks;
    Object.assign(info, tokens);
  }

  process.stdout.write(JSON.stringify(info));
}
