import promptSyncHistory from 'prompt-sync-history';
import promptSync from 'prompt-sync';

import chalk from 'chalk';
import wargs from 'wargs';
import fs from 'fs';

import * as x10 from './dist/main.js';

const __dirname = import.meta.dirname;

const {
  Env, Expr, Token, Parser, main, debug, format, execute, serialize, evaluate, useCurrencies,
} = x10;

const argv = wargs(process.argv.slice(2), {
  boolean: ['trace', 'color', 'print', 'inline', 'source'],
});

async function prelude() {
  process.stderr.write(`\r${chalk.gray('Checking for installed currencies...')}\r`);

  await useCurrencies({
    key: `${__dirname}/currencies-${new Date().toISOString().substr(0, 13)}.json`,
    read: path => JSON.parse(fs.readFileSync(path, 'utf8')),
    write: fs.writeFileSync,
    exists: fs.existsSync,
    resolve: async () => {
      const sources = [
        'https://api.exchangeratesapi.io/latest',
        'https://api.exchangerate-api.com/v4/latest/EUR',
      ];

      for (const url of sources) {
        try {
          const res = await fetch(url);
          if (res.ok) return res.json();
        } catch (_) {
          // try next source
        }
      }

      throw new Error('Failed to fetch currency info');
    },
  });

  process.stderr.write('\r\x1b[K');

  // shared utils and loader for nodejs
  const [loader, shared] = await Promise.all([
    import('./lib/loader.js'),
    import('./lib/shared.js'),
  ]);

  loader.default(x10);
  shared.default(x10);
}

async function repl() {
  const prompt = promptSync({
    history: promptSyncHistory('history.log'),
  });

  const env = new Env();

  let info = argv.flags.trace;
  let raw = argv.flags.raw;
  let code;

  /* eslint-disable no-cond-assign */
  while ((code = prompt(info ? '>>> ' : '> '))) {
    if (info) console.time('time');

    try {
      const { result, error, info: details } = await evaluate(Parser.getAST(code, undefined, env), env, argv.flags.trace);

      if (raw) {
        console.log(JSON.stringify(result));
      } else if (result !== undefined) {
        console.log(serialize(result));
      }

      if (details) {
        if (info) console.timeEnd('time');
        if (details.enabled) console.log(format(details));
      }
    } catch (e) {
      console.error(debug(e, code));
    }

    if (eject(code)) {
      break;
    }
  }
}

function eject(code) {
  if (code === null) {
    console.log('exit');
    return true;
  }
  if (code === 'exit' || code === 'quit' || code === 'exit()' || code === 'quit()') {
    return true;
  }

  return false;
}

async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
  });
}

async function cli() {
  const { _, raw, ...flags } = argv;

  let code = '';

  // Check if there's stdin input
  if (!_.length && !raw.length && !process.stdin.isTTY) {
    code = await readStdin();
  }

  if (!code.length && !_.length && !raw.length) {
    return repl();
  }

  if (_.length) {
    const file = _[0] + (!_[0].includes('.') ? '.md' : '');
    code += fs.readFileSync(file).toString();
  }

  if (raw.length) {
    if (code.trim().length) {
      code += ';\n';
    }
    code += raw.join(' ');
  }

  if (flags.print) {
    await format(code, flags.color, flags.inline);
  } else {
    await main(code, flags.source, null, flags.trace, false, prelude);
  }
}

export { cli, main, format, execute, evaluate, useCurrencies };
