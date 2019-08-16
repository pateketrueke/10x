global.console.log = (...args) => {
  args.forEach(value => {
    process.stderr.write(require('util').inspect(value, { colors: true, depth: 10 }) + '\n');
  });
};

const Solvente = require('./dist/solvente.js');

const returnRawJSON = process.argv.slice(2).indexOf('--raw') !== -1;
const sharedFileOffset = process.argv.slice(2).indexOf('--shared');
const sharedFilePath = sharedFileOffset >= 0 && process.argv.slice(2)[sharedFileOffset + 1];
const sharedFile = sharedFilePath && require('path').resolve(sharedFilePath);
const sharedExpressions = {};

if (sharedFile && require('fs').existsSync(sharedFile)) {
  Object.assign(sharedExpressions, JSON.parse(require('fs').readFileSync(sharedFile)));
}

const argv = process.argv.slice(Math.max(2, process.argv.indexOf('--') + 1));

const calc = new Solvente({
  expressions: sharedExpressions,
});

calc.resolve(argv.join(' '));

const fixedResults = calc.eval();
const fixedError = calc.error && calc.error.stack;

process.stdout.write(JSON.stringify({
  error: returnRawJSON ? JSON.stringify(fixedError) : fixedError,
  tree: returnRawJSON ? JSON.stringify(calc.tree) : calc.tree,
  input: calc.input.map(x => returnRawJSON ? JSON.stringify(x) : x),
  tokens: calc.tokens.map(x => returnRawJSON ? JSON.stringify(x) : x),
  results: fixedResults.map(x => returnRawJSON ? JSON.stringify(x) : x),
}));

if (sharedFile) require('fs').writeFileSync(sharedFile, JSON.stringify(calc.expressions));
