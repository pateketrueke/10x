const { out, puts, chalk } = require('./utils');

module.exports = ({
  calc, playBack, showDebugInfo,
}) => {
  // FIXME: enable more options...
  const ANIMATION_SPEED = playBack === true ? 260 : playBack || 0;

  const buffer = [];

  let mayFlush = false;
  let indent = '';
  let values = [];

  function ms() {
    return (Math.random() * ANIMATION_SPEED) + (ANIMATION_SPEED / 2);
  }

  function peek() {
    const subTree = calc.tree.shift();
    const results = calc.eval([subTree]);

    if (calc.error) {
      values.push(calc.error);

      if (calc.error.target.begin) {
        indent = Array.from({ length: calc.error.target.begin[1] + 1 }).join(' ');
      }
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
        push(null, `${chalk.red(`//! ${x[showDebugInfo ? 'stack' : 'message'].trim()}`)}\n`);
      } else {
        push(null, `${indent}${chalk.gray('//=>')} ${chalk.dim(calc.value(x, indent.length + 4, out, chalk.gray(', '), false).format)}\n`);
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
      if (node.token[0] === 'text' && node.token[1].includes('\n')) {
        if (values.length) flush();
        mayFlush = true;
      }
    }
  }

  // evaluate and print remaining trees
  while (calc.tree.length) peek();

  if (values.length) {
    if (!mayFlush) push(null, '\n');
    flush();
  }

  buffer.reduce((prev, cur) => prev.then(() => cur()), Promise.resolve());
};
