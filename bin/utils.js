const chalk = require('chalk');

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
    case 'error':
      return chalk.red(text);
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

module.exports = {
  out,
  puts,
  chalk,
};
