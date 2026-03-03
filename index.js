import readline from 'readline';
import os from 'os';
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import wargs from 'wargs';

import * as x10 from './dist/main.js';
import { createNodeAdapter } from './src/adapters/node/index.js';

const __dirname = import.meta.dirname;
const HISTORY_FILE = path.join(os.homedir(), '.tenx_history');
const MAX_HISTORY = 1000;

const {
  Env, Expr, Token, Parser, main, debug, format, execute, serialize, evaluate, useCurrencies, createEnv, applyAdapter,
} = x10;

const argv = wargs(process.argv.slice(2), {
  boolean: ['trace', 'color', 'print', 'inline', 'source', 'watch', 'bake', 'clean'],
});
const nodeAdapter = createNodeAdapter(process.argv.slice(2));

async function prelude() {
  process.stderr.write(`\r${chalk.gray('Checking for installed currencies...')}\r`);

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

const RE_EXPR = /\$\{([^}]+)\}/g;
const RE_RESULT_COMMENT = / <!-- (=|!)([^>]*) -->/g;

function extractExpressions(content) {
  const expressions = [];
  let match;
  RE_EXPR.lastIndex = 0;
  
  while ((match = RE_EXPR.exec(content)) !== null) {
    expressions.push({
      start: match.index,
      end: match.index + match[0].length,
      code: match[1],
      full: match[0],
    });
  }
  
  return expressions;
}

function evaluateExpressions(expressions, env) {
  return expressions.map(expr => {
    try {
      const result = execute(expr.code, env);
      return { ...expr, result: serialize(result), error: null };
    } catch (e) {
      return { ...expr, result: null, error: e.message };
    }
  });
}

function patchResults(content, results) {
  let offset = 0;
  let patched = content;
  
  for (const expr of results) {
    const insertPos = expr.end + offset;
    const existing = patched.slice(insertPos).match(/^ <!-- [=!]([^>]*) -->/);
    
    let annotation;
    if (expr.error) {
      annotation = ` <!-- !${expr.error.replace(/-->/g, '')} -->`;
    } else {
      annotation = ` <!-- =${expr.result} -->`;
    }
    
    if (existing) {
      const oldLen = existing[0].length;
      patched = patched.slice(0, insertPos) + annotation + patched.slice(insertPos + oldLen);
      offset += annotation.length - oldLen;
    } else {
      patched = patched.slice(0, insertPos) + annotation + patched.slice(insertPos);
      offset += annotation.length;
    }
  }
  
  return patched;
}

function cleanResults(content) {
  return content.replace(RE_RESULT_COMMENT, '');
}

async function watchFile(filepath, options) {
  const env = createEnv(nodeAdapter);
  
  await prelude();
  
  const evalAndPrint = debounce(async () => {
    const content = fs.readFileSync(filepath, 'utf8');
    const expressions = extractExpressions(content);
    
    if (options.bake) {
      const results = evaluateExpressions(expressions, env);
      const patched = patchResults(content, results);
      fs.writeFileSync(filepath, patched);
      process.stdout.write(`\r${chalk.green('✓')} ${path.basename(filepath)} (${results.length} expressions)\n`);
    } else if (options.clean) {
      const cleaned = cleanResults(content);
      fs.writeFileSync(filepath, cleaned);
      process.stdout.write(`\r${chalk.green('✓')} ${path.basename(filepath)} (cleaned)\n`);
    } else {
      const results = evaluateExpressions(expressions, env);
      process.stdout.write('\x1b[2J\x1b[H');
      process.stdout.write(`${chalk.bold(filepath)}\n${chalk.gray('─'.repeat(40))}\n\n`);
      
      for (const expr of results) {
        process.stdout.write(`${chalk.cyan(expr.code)}`);
        if (expr.error) {
          process.stdout.write(` ${chalk.red('→')} ${chalk.red(expr.error)}\n`);
        } else {
          process.stdout.write(` ${chalk.gray('→')} ${chalk.yellow(expr.result)}\n`);
        }
      }
      
      process.stdout.write(`\n${chalk.gray('Watching for changes...')}\n`);
    }
  }, 200);
  
  let fsWait;
  fs.watch(filepath, (event) => {
    if (event === 'change') {
      clearTimeout(fsWait);
      fsWait = setTimeout(evalAndPrint, 100);
    }
  });
  
  await evalAndPrint();
}

function debounce(fn, ms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
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

  if (flags.watch && _.length) {
    const file = _[0] + (!_[0].includes('.') ? '.md' : '');
    if (!fs.existsSync(file)) {
      console.error(chalk.red(`File not found: ${file}`));
      process.exit(1);
    }
    return watchFile(file, { bake: flags.bake, clean: flags.clean });
  }

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

  if (flags.bake || flags.clean) {
    await prelude();
    const env = createEnv(nodeAdapter);
    const expressions = extractExpressions(code);
    
    if (flags.clean) {
      console.log(cleanResults(code));
    } else {
      const results = evaluateExpressions(expressions, env);
      console.log(patchResults(code, results));
    }
  } else if (flags.print) {
    await format(code, flags.color, flags.inline);
  } else {
    await main(code, flags.source, null, flags.trace, false, prelude);
  }
}

export { cli, main, format, execute, evaluate, useCurrencies, createEnv, applyAdapter };
