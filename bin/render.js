module.exports = ({
  calc, chalk, playBack, showDebugInfo,
}) => {
  // FIXME: enable more options...
  const ANIMATION_SPEED = playBack === true ? 260 : playBack || 0;

  const buffer = [];

  let indent = '';
  let values = [];

  function puts(type, chunk, speed) {
    if (type !== 'number' && typeof chunk !== 'string') {
      process.stdout.write(chalk.yellow(`:${chunk}`));
      return;
    }

    return String(chunk).split(speed ? /(?=[\x00-\x7F])/ : /(?=\b)/) // eslint-disable-line
      .reduce((prev, cur) => prev.then(() => {
        switch (type) {
          case null:
            process.stdout.write(cur);
            break;
          case 'blockquote':
            process.stdout.write(chalk.bold.whiteBright(cur));
            break;
          case 'comment':
            process.stdout.write(chalk.gray(cur));
            break;
          case 'symbol':
            process.stdout.write(chalk.yellow(cur));
            break;
          case 'string':
            process.stdout.write(chalk.greenBright(cur));
            break;
          case 'unit':
            process.stdout.write(chalk.magentaBright(cur));
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
          case 'code':
            process.stdout.write(chalk.bgBlackBright.black(cur));
            break;
          case 'close':
          case 'open':
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

  function peek() {
    const results = calc.eval([calc.tree.shift()]);

    if (calc.error) {
      values.push(calc.error);
    }

    if (results.length) {
      values.push(results);
    }
  }

  function push(type, chunk) {
    buffer.push(() => new Promise(ok => {
      if (!type || !playBack) {
        return ok(puts(type, chunk, 0));
      }

      setTimeout(() => {
        Promise.resolve()
          .then(() => puts(type, chunk, (Math.random() * ANIMATION_SPEED) + (ANIMATION_SPEED / 2)))
          .then(ok);
      }, (Math.random() * (ANIMATION_SPEED / 10)) + 1);
    }));
  }

  function flush() {
    values.forEach(x => {
      if (x instanceof Error) {
        push(null, `${indent}${chalk.red(x[showDebugInfo ? 'stack' : 'message'])}\n`);
      } else {
        push(null, `${indent}${chalk.gray('//=>')} ${calc.format(x, chalk.gray(', '), v => chalk.cyanBright(v))}\n`);
      }
    });

    indent = '';
    values = [];
  }

  for (let i = 0; i < calc.tokens.length; i += 1) {
    const node = calc.tokens[i];

    if (node !== null) {
      if (node.begin[1] === 0) {
        indent = (node.token[1].match(/^ +/) || [])[0] || '';
      }

      // FIXME: highlight errored tokens...
      // if (calc.error && calc.error.target === node) {
      //   push(null, chalk.bgRed(node.token[1]));
      // } else {
      //   push(node.token[0], node.token[1]);
      // }

      push(node.token[0], node.token[1]);

      if (
        typeof node.token[1] === 'string'
        && node.token[1].includes('\n')
        && values.length
      ) {
        flush();
      }
    }

    if (calc.tokens[i] === null && calc.tokens[i + 1] === null) peek();
  }

  while (calc.tree.length) peek();

  if (values.length) {
    push(null, '\n');
    flush();
  }

  buffer.reduce((prev, cur) => prev.then(() => cur()), Promise.resolve());
};
