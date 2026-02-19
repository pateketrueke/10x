const promptSyncHistory = require('prompt-sync-history');
const promptSync = require('prompt-sync');

const chalk = require('chalk');
const wargs = require('wargs');
const fs = require('fs');

const x10 = require('./dist/main.cjs');

const {
  Env, Expr, Token, Parser, main, format, execute, evaluate, useCurrencies,
} = x10;

const argv = wargs(process.argv.slice(2), {
  boolean: ['trace', 'color', 'print', 'inline', 'source'],
});

async function prelude() {
  process.stderr.write(`\r${chalk.gray('Checking for installed currencies...')}\r`);

  await useCurrencies({
    key: `${__dirname}/currencies-${new Date().toISOString().substr(0, 13)}.json`,
    read: require,
    write: fs.writeFileSync,
    exists: fs.existsSync,
    resolve: () => new Promise((done, reject) => {
      const sources = [
        'https://api.exchangeratesapi.io/latest',
        'https://api.exchangerate-api.com/v4/latest/EUR',
      ];

      let offset = 0;

      function retry() {
        if (offset >= sources.length) {
          reject(new Error('Failed to fetch currency info'));
        }

        const url = sources[offset++];

        require('https').get(url, resp => {
          let data = '';

          resp.on('data', chunk => { data += chunk; });
          resp.on('end', () => done(JSON.parse(data)));
        }).on('err', retry);
      }

      retry();
    }),
  });

  process.stderr.write('\r\x1b[K');

  // shared utils and loader for nodejs
  require('./lib/loader')(x10);
  require('./lib/shared')(x10);
}

function repl() {
  const prompt = promptSync({
    history: promptSyncHistory('history.log'),
  });

  const env = new Env();

  let info = argv.flags.trace;
  let raw = argv.flags.raw;
  let code;

  async function run() {
    try {
      do {
        code = prompt(`${(raw && '?') || (info ? '!' : '>')} `);

        if (code === null) break;
        if (code === '') continue;

        if (code === '?') {
          raw = !raw;
          continue;
        }

        if (code === '!') {
          info = !info;
          continue;
        }

        await main(code, raw, env, raw ? false : info, true, prelude); // eslint-disable-line
      } while (true); // eslint-disable-line
    } catch (e) {
      process.stderr.write(e.stack);
    } finally {
      prompt.history.save();
    }
  }
  run();
}

function cli() {
  if (!(argv.raw.length || argv._.length)) {
    repl();
    return;
  }

  let file = argv._[0];
  let code = '';

  if (file) {
    file += !file.includes('.') ? '.md' : '';
    code += fs.readFileSync(file).toString();
  }

  if (argv.raw.length) {
    if (code.trim().length) {
      code += ';\n';
    }

    code += argv.raw.join(' ');
  }

  if (argv.flags.print) {
    format(code, argv.flags.color, argv.flags.inline);
    return;
  }

  main(code, argv.flags.source, null, argv.flags.trace, false, prelude);
}

module.exports = {
  Env, Expr, Token, Parser, repl, cli, argv, execute, evaluate,
};
