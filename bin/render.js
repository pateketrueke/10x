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

    if (type === 'string') {
      process.stdout.write(chalk.greenBright(`"${chunk.replace(/#\{([^{}]+?)\}/g, chalk.dim('#{$1}'))}"`));
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
    const subTree = calc.tree.shift();
    const results = calc.eval([subTree]);

    if (calc.error) {
      values.push(calc.error);
      indent = Array.from({ length: calc.error.target.begin[1] + 1 }).join(' ');
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
        push(null, `${indent}${chalk.red(x[showDebugInfo ? 'stack' : 'message'].trim())}\n`);
      } else {
        push(null, `${indent}${chalk.gray('//=>')} ${chalk.dim(calc.format(x, indent.length + 4, out, chalk.gray(', ')))}\n`);
      }
    });

    indent = '';
    values = [];
  }

  if (calc.error) {
    values.push(calc.error);
  }

  for (let i = 0; i < calc.ast.length; i += 1) {
    const node = calc.ast[i];

    if (node !== null) {
      push(node.token[0], node.token[1]);

      // evaluate as soon we reach splits
      if (calc.ast[i + 1] === null && calc.ast[i + 2] === null) peek();

      // capture current identation to format results
      if (typeof node.token[1] === 'string' && !node.begin[1]) {
        indent = (node.token[1].match(/^ +/) || [])[0] || '';
      }

      // but output results after any newline
      if (values.length && node.token[0] === 'text' && node.token[1].includes('\n')) flush();
    }
  }

  // evaluate and print remaining trees
  while (calc.tree.length) peek();

  if (values.length) {
    push(null, '\n');
    flush();
  }

  buffer.reduce((prev, cur) => prev.then(() => cur()), Promise.resolve());
};
