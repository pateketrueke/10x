import readline from 'readline';
import os from 'os';
import path from 'path';
import fs from 'fs';

import ansi from './lib/ansi.js';
import wargs from 'wargs';

import { createNodeAdapter } from './adapters/node/index.js';

let Env;
let Expr;
let Token;
let Parser;
let main;
let debug;
let format;
let execute;
let serialize;
let evaluate;
let useCurrencies;
let createEnv;
let applyAdapter;

const runtimeReady = import('./main.js')
  .catch(() => import('../dist/main.js'))
  .then(x10 => {
    ({
      Env,
      Expr,
      Token,
      Parser,
      main,
      debug,
      format,
      execute,
      serialize,
      evaluate,
      useCurrencies,
      createEnv,
      applyAdapter,
    } = x10);
  });

const __dirname = import.meta.dirname;
const HISTORY_FILE = path.join(os.homedir(), '.tenx_history');
const MAX_HISTORY = 1000;

const argv = wargs(process.argv.slice(2), {
  boolean: ['trace', 'color', 'print', 'inline', 'source'],
});
const nodeAdapter = createNodeAdapter(process.argv.slice(2));

async function prelude() {
  await runtimeReady;
  process.stderr.write(`\r${ansi.gray('Checking for installed currencies...')}\r`);

  await useCurrencies({
    key: path.join(os.tmpdir(), `currencies-${new Date().toISOString().substr(0, 13)}.json`),
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
  applyAdapter(nodeAdapter);
}

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean);
    }
  } catch {}
  return [];
}

function saveHistory(history) {
  try {
    const lines = history.slice(-MAX_HISTORY);
    fs.writeFileSync(HISTORY_FILE, lines.join('\n') + '\n', 'utf8');
  } catch {}
}

async function repl() {
  await runtimeReady;
  const history = loadHistory();
  let historyIndex = history.length;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    history: history.length > 0 ? history : undefined,
    historySize: MAX_HISTORY,
    removeHistoryDuplicates: true,
  });

  const env = createEnv(nodeAdapter);
  const info = argv.flags.trace;
  const raw = argv.flags.raw;

  const prompt = (q) => new Promise(resolve => rl.question(q, resolve));

  rl.on('close', () => {
    saveHistory(rl.history);
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const code = await prompt(info ? '>>> ' : '> ');

    if (eject(code)) {
      rl.close();
      break;
    }

    if (!code.trim()) continue;

    if (info) console.time('time');

    try {
      const { result, error, info: details } = await evaluate(Parser.getAST(code, 'parse', env), env, argv.flags.trace);

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
  }
}

function eject(code) {
  if (code === null || code === undefined) {
    console.log('exit');
    return true;
  }
  if (code === 'exit' || code === 'quit' || code === 'exit()' || code === 'quit()') {
    console.log('exit');
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
  await runtimeReady;
  const { _, raw, ...flags } = argv;

  let code = '';

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

export { cli, main, format, execute, evaluate, useCurrencies, createEnv, applyAdapter };
