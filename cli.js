const fs = require('fs');

global.console.log = (...args) => {
  args.forEach(value => {
    process.stderr.write(require('util').inspect(value, { colors: true, depth: 10, maxArrayLength: Infinity }) + '\n');
  });
};

const chalk = require('chalk');
const Solv = require('./dist/lib.js');

const returnAsMarkdown = process.argv.slice(2).indexOf('--md') !== -1;
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

// FIXME: since all evaluation can be async...
if (returnAsMarkdown) {
  const buffer = [];

  function puts(type, chunk, speed) {
    return chunk.split(/(?=[\x00-\x7F])/)
      .reduce((prev, cur) => prev.then(() => {
        switch (type) {
          case null:
            process.stdout.write(cur);
            break;
          case 'comment':
            process.stdout.write(chalk.gray(cur));
            break;
          case 'symbol':
          case 'close':
          case 'open':
          case 'fx':
            process.stdout.write(chalk.red(cur));
          case 'expr':
            process.stdout.write(chalk.magentaBright(cur));
            break;
          case 'number':
            process.stdout.write(chalk.blueBright(cur));
            break;
          case 'heading':
            process.stdout.write(chalk.bold.underline.whiteBright(cur));
            break;
          case 'code':
            process.stdout.write(chalk.dim(cur));
            break;
          case 'em':
            process.stdout.write(chalk.italic.white(cur));
            break;
          case 'b':
            process.stdout.write(chalk.bold.white(cur));
            break;
          default:
            process.stdout.write(chalk.white(cur));
            break;
        }

        if (speed > 0) {
          return new Promise(ok => setTimeout(ok, Math.floor(speed / chunk.length)));
        }
      }), Promise.resolve());
  }

  // FIXME: enable options...
  const ANIMATION_SPEED = 0;

  function push(type, chunk) {
    buffer.push(() => new Promise(ok => {
      if (chunk === ' ') {
        return ok(puts(type, chunk, 0));
      }

      setTimeout(() => {
        puts(type, chunk, (Math.random() * ANIMATION_SPEED) + (ANIMATION_SPEED / 2)).then(ok);
      }, (Math.random() * (ANIMATION_SPEED / 10)) + 1);
    }));
  }

  calc.tree.forEach(subTree => {
    const results = calc.eval([subTree]);

    let isOpen = false;

    subTree.forEach(node => {
      if (Array.isArray(node[0])) {
        node.forEach(t => {
          if (Array.isArray(t[0])) {
            t.forEach(s => {
              push(s[0], s[1]);
            });
          } else {
            push(t[0], t[1]);
          }
        });

        if (isOpen) {
          push('def', ')');
          isOpen = false;
        }
      } else if (node[0] === 'def') {
        push(node[0], node[1] + '(');
        isOpen = true;
      } else {
        push(node[0], node[1]);
      }
    });

    if (results.length) {
      push(null, `${chalk.gray('\n//=>')} ${require('util').inspect(results, { colors: true })}`);
    }
  });

  buffer.reduce((prev, cur) => prev.then(() => cur()), Promise.resolve());
} else {
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
}

if (sharedFile) require('fs').writeFileSync(sharedFile, JSON.stringify(calc.expressions));
