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

let code = '';

if (file && fs.existsSync(file)) {
  code += fs.readFileSync(file).toString();
}

code += args.join(' ');

const calc = new Solv({
  source: code,
  filepath: file,
  expressions: sharedExpressions,
});

if (showVerboseInfo) {
  console.log(calc);
}

// FIXME: since all evaluation can be async...
if (!returnAsJSON) {
  require('./render')({
    calc, chalk, playBack, showDebugInfo,
  });
} else {
  const { out } = require('./utils');
  const fixedResults = calc.raw(calc.eval());

  if (returnAsJSON) {
    process.stdout.write(JSON.stringify({
      error: returnRawJSON ? JSON.stringify(calc.error) : calc.error,
      results: returnRawJSON ? JSON.stringify(fixedResults) : fixedResults,
    }));
  } else {
    fixedResults.forEach(x => {
      process.stderr.write(`${chalk.gray('//=>')} ${calc.value(x, 4, out, chalk.gray(', '), false).format}\n`);
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
