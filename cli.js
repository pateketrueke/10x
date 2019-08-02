global.console.log = (...args) => {
  process.stderr.write(require('util').inspect(args, { colors: true, depth: 10 }) + '\n');
};

const Solvente = require('./dist/solvente.js');

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

process.stdout.write(JSON.stringify(calc.resolve(argv.join(' '))));

if (sharedFile) require('fs').writeFileSync(sharedFile, JSON.stringify(calc.expressions));
