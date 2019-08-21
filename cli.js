const fs = require('fs');

global.console.log = (...args) => {
  args.forEach(value => {
    process.stderr.write(require('util').inspect(value, { colors: true, depth: 10, maxArrayLength: Infinity }) + '\n');
  });
};

const Solv = require('./dist/lib.js');

const returnRawJSON = process.argv.slice(2).indexOf('--raw') !== -1;
const returnAsJSON = process.argv.slice(2).indexOf('--json') !== -1;
const showDebugInfo = process.argv.slice(2).indexOf('--debug') !== -1;
const hasNoColors = process.argv.slice(2).indexOf('--no-colors') !== -1;
const sharedFileOffset = process.argv.slice(2).indexOf('--shared');
const sharedFilePath = sharedFileOffset >= 0 && process.argv.slice(2)[sharedFileOffset + 1];
const sharedFile = sharedFilePath && require('path').resolve(sharedFilePath);
const sharedExpressions = {};

if (sharedFile && require('fs').existsSync(sharedFile)) {
  Object.assign(sharedExpressions, JSON.parse(require('fs').readFileSync(sharedFile)));
}

const colors = !hasNoColors;
const argv = process.argv.slice(2);
const cut = argv.indexOf('--');

const args = cut >= 0 ? argv.slice(cut + 1) : [];
const file = argv.slice(Math.max(0, cut), 1)[0];

const calc = new Solv({
  expressions: sharedExpressions,
});

let code = '';

if (file && fs.existsSync(file)) {
  code += fs.readFileSync(file).toString();
}

code += args.join(' ');

calc.resolve(code, file);

const fixedResults = calc.eval();
const fixedError = calc.error && calc.error.stack;

if (returnAsJSON) {
  process.stdout.write(JSON.stringify({
    error: returnRawJSON ? JSON.stringify(fixedError) : fixedError,
    tree: returnRawJSON ? JSON.stringify(calc.tree) : calc.tree,
    input: calc.input.map(x => returnRawJSON ? JSON.stringify(x) : x),
    tokens: calc.tokens.map(x => returnRawJSON ? JSON.stringify(x) : x),
    results: fixedResults.map(x => returnRawJSON ? JSON.stringify(x) : x),
  }));
} else {
  if (fixedError) {
    process.stderr.write(fixedError);
  }

  if (showDebugInfo) {
    console.log(calc);
  }

  console.log(fixedResults);
}

if (sharedFile) require('fs').writeFileSync(sharedFile, JSON.stringify(calc.expressions));
