const fs = require('fs');
const path = require('path');
const wargs = require('wargs');
const chalk = require('chalk');

const Solv = require('../dist/lib.js');

const argv = wargs(process.argv.slice(2), {
  boolean: 'rjdVC',
  alias: {
    r: 'raw',
    j: 'json',
    d: 'debug',
    V: 'verbose',
    C: 'no-colors',
    s: 'shared',
    p: 'playback',
  },
});

const returnRawJSON = argv.flags.raw;
const returnAsJSON = argv.flags.json;
const showDebugInfo = argv.flags.debug;
const showVerboseInfo = argv.flags.verbose;
const hasNoColors = !argv.flags.colors;
const playBack = argv.flags.playback;

const sharedFilePath = argv.flags.shared;
const sharedFile = sharedFilePath && path.resolve(sharedFilePath);
const sharedExpressions = {};

if (sharedFile && fs.existsSync(sharedFile)) {
  Object.assign(sharedExpressions, JSON.parse(fs.readFileSync(sharedFile)));
}

const colors = !hasNoColors;

global.console.log = (...args) => {
  args.forEach(value => {
    process.stderr.write(`${require('util').inspect(value, { colors, depth: 10, maxArrayLength: Infinity })}\n`);
  });
};

const args = argv.raw;
const file = argv._.shift();

const calc = new Solv({
  expressions: sharedExpressions,
});

let code = '';

if (file && fs.existsSync(file)) {
  code += fs.readFileSync(file).toString();
}

code += args.join(' ');

calc.resolve(code, file);

if (showVerboseInfo) {
  console.log(calc);
}

// FIXME: since all evaluation can be async...
if (!returnAsJSON) {
  require('./render')({
    calc, chalk, playBack, showDebugInfo,
  });
} else {
  const fixedResults = calc.eval();

  if (returnAsJSON) {
    process.stdout.write(JSON.stringify({
      error: returnRawJSON ? JSON.stringify(calc.error) : calc.error,
      tree: returnRawJSON ? JSON.stringify(calc.tree) : calc.tree,
      input: calc.input.map(x => (returnRawJSON ? JSON.stringify(x) : x)),
      tokens: calc.tokens.map(x => (returnRawJSON ? JSON.stringify(x) : x)),
      results: fixedResults.map(x => (returnRawJSON ? JSON.stringify(x) : x)),
    }));
  } else {
    fixedResults.forEach(x => {
      process.stderr.write(`${chalk.gray('//=>')} ${calc.format(x, 4, out, chalk.gray(', '))}\n`);
    });
  }

  if (calc.error && !returnAsJSON) {
    process.stderr.write(chalk.red(calc.error.stack));
    process.exit(1);
  }
}

if (sharedFile) {
  fs.writeFileSync(sharedFile, JSON.stringify(calc.expressions, (k, v) => {
    if (['begin', 'end'].includes(k)) return undefined;
    return v;
  }));
}
