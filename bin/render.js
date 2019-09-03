module.exports = ({
  calc, chalk, playBack, showDebugInfo,
}) => {
  // FIXME: enable more options...
  const ANIMATION_SPEED = playBack === true ? 260 : playBack || 0;

  const buffer = [];

  let indent = '';
  let values = [];

  function ms() {
    return (Math.random() * ANIMATION_SPEED) + (ANIMATION_SPEED / 2);
  }

  function out(type, text) {
    switch (type) {
      case null:
        return text;
      case 'blockquote':
        return chalk.bold.whiteBright(text);
      case 'comment':
        return chalk.gray(text);
      case 'symbol':
        return chalk.yellow(text);
      case 'string':
        return chalk.greenBright(text);
      case 'unit':
        return chalk.magentaBright(text);
      case 'number':
      case 'range':
        return chalk.blueBright(text);
      case 'def':
        return chalk.blue(text);
      case 'heading':
        return chalk.bold.underline.whiteBright(text);
      case 'code':
        return chalk.bgBlackBright.black(text);
      case 'close':
      case 'open':
      case 'pre':
        return chalk.dim(text);
      case 'em':
        return chalk.italic.white(text);
      case 'b':
        return chalk.bold(text);
      case 'expr':
      case 'fx':
      default:
        return chalk.white(text);
    }
  }

  function puts(type, chunk, speed) {
    if (type !== 'number' && typeof chunk !== 'string') {
      process.stdout.write(chalk.yellow(`:${chunk}`));
      return;
    }

    return String(chunk).split(speed ? /(?=[\x00-\x7F])/ : /(?=\b)/) // eslint-disable-line
      .reduce((prev, cur) => prev.then(() => {
        process.stdout.write(out(type, cur));

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
          .then(() => puts(type, chunk, ms()))
          .then(ok);
      }, (Math.random() * (ANIMATION_SPEED / 10)) + 1);
    }));
  }

  function flush() {
    values.forEach(x => {
      if (x instanceof Error) {
        push(null, `${indent}${chalk.red(x[showDebugInfo ? 'stack' : 'message'])}\n`);
      } else {
        push(null, `${indent}${chalk.gray('//=>')} ${calc.format(x, indent.length + 4, out, chalk.gray(', '))}\n`);
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
