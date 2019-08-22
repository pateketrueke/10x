const fs = require('fs');

global.console.log = (...args) => {
  args.forEach(value => {
    process.stderr.write(require('util').inspect(value, { colors: true, depth: 10, maxArrayLength: Infinity }) + '\n');
  });
};

const chalk = require('chalk');
const Solv = require('./dist/lib.js');

const argv = require('wargs')(process.argv.slice(2), {
  boolean: 'mrjdC',
  alias: {
    m: 'md',
    r: 'raw',
    j: 'json',
    d: 'debug',
    C: 'no-colors',
    s: 'shared',
    p: 'playback',
  },
});

const returnAsMarkdown = argv.flags.md;
const returnRawJSON = argv.flags.raw;
const returnAsJSON = argv.flags.json;
const showDebugInfo = argv.flags.debug;
const hasNoColors = !argv.flags.colors;
const playBack = argv.flags.playback;

const sharedFilePath = argv.flags.shared;
const sharedFile = sharedFilePath && require('path').resolve(sharedFilePath);
const sharedExpressions = {};

if (sharedFile && require('fs').existsSync(sharedFile)) {
  Object.assign(sharedExpressions, JSON.parse(require('fs').readFileSync(sharedFile)));
}

const colors = !hasNoColors;

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
            process.stdout.write(chalk.yellow(cur));
            break;
          case 'unit':
            process.stdout.write(chalk.redBright(cur));
            break;
          case 'number':
            process.stdout.write(chalk.blueBright(cur));
            break;
          case 'def':
            process.stdout.write(chalk.blue(cur));
            break;
          case 'heading':
            process.stdout.write(chalk.bold.underline.whiteBright(cur));
            break;
          case 'close':
          case 'open':
          case 'code':
            process.stdout.write(chalk.dim(cur));
            break;
          case 'em':
            process.stdout.write(chalk.italic.white(cur));
            break;
          case 'b':
            process.stdout.write(chalk.bold.white(cur));
            break;
          case 'expr':
          case 'fx':
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
  const ANIMATION_SPEED = playBack === true ? 260 : playBack || 0;

  function push(type, chunk) {
    buffer.push(() => new Promise(ok => {
      if (!type) {
        return ok(puts(type, chunk, 0));
      }

      setTimeout(() => {
        puts(type, chunk, (Math.random() * ANIMATION_SPEED) + (ANIMATION_SPEED / 2)).then(ok);
      }, (Math.random() * (ANIMATION_SPEED / 10)) + 1);
    }));
  }

  let isOut = false;
  let tmp = [];

  calc.tree.forEach(subTree => {
    const results = calc.eval([subTree]);

    if (results.length) {
      tmp.push(results);
    }

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
          isOpen = false;
          push('close', ')');
        }
      } else if (node[0] === 'def') {
        push(node[0], node[1]);

        if (node._args) {
          isOpen = true;
          push('open', '(');
        }
      } else {
        push(node[0], node[1]);

        if (node[1].includes('\n') && tmp.length) {
          tmp.forEach(x => {
            push(null, `${chalk.gray('//=>')} ${require('util').inspect(x, { colors, depth: 10 })}\n`);
          });

          tmp = [];
          isOut = false;
        }
      }
    });
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
