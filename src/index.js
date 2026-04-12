import readline from 'readline';
import os from 'os';
import path from 'path';
import fs from 'fs';

import ansi from './lib/ansi.js';
import wargs from 'wargs';

import { createNodeAdapter } from './adapters/node/index.js';
import { lintCode } from './linter.js';

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
let compile;
let compileBundle;

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
      compile,
      compileBundle,
    } = x10);
  });

const __dirname = import.meta.dirname;
const HISTORY_FILE = path.join(os.homedir(), '.10x_history');
const MAX_HISTORY = 1000;

const argv = wargs(process.argv.slice(2), {
  boolean: ['trace', 'color', 'print', 'inline', 'source', 'lint', 'check', 'fix', 'dry-run', 'bundle'],
});
const nodeAdapter = createNodeAdapter(process.argv.slice(2));

function annotationNameRE(name) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectSourceFacts(source) {
  const lines = String(source || '').split('\n');
  const annotations = [];
  const bindings = [];

  lines.forEach((line, index) => {
    const ann = line.match(/^\s*([A-Za-z_][A-Za-z0-9_!?-]*)\s*::\s*(.+?)\.\s*$/);
    if (ann) {
      annotations.push({
        name: ann[1],
        typeText: ann[2].trim(),
        line: index,
      });
    }

    const bind = line.match(/^\s*([A-Za-z_][A-Za-z0-9_!?-]*)\s*=/);
    if (bind) {
      bindings.push({
        name: bind[1],
        line: index,
      });
    }
  });

  return { lines, annotations, bindings };
}

function lintAnnotationSource(source) {
  const { lines, annotations } = collectSourceFacts(source);
  const warnings = [];
  const seen = new Map();

  for (const ann of annotations) {
    if (seen.has(ann.name)) {
      warnings.push({
        line: ann.line,
        message: `Duplicate annotation for \`${ann.name}\``,
      });
    }
    seen.set(ann.name, ann.line);

    let cursor = ann.line + 1;
    while (cursor < lines.length) {
      const line = lines[cursor];
      if (!line.trim() || /^\s*\/\//.test(line)) {
        cursor += 1;
        continue;
      }
      const re = new RegExp(`^\\s*${annotationNameRE(ann.name)}\\s*=`);
      if (!re.test(line)) {
        warnings.push({
          line: ann.line,
          message: `Orphan annotation for \`${ann.name}\` (next statement is not \`${ann.name} = ...\`)`,
        });
      }
      break;
    }

    if (cursor >= lines.length) {
      warnings.push({
        line: ann.line,
        message: `Orphan annotation for \`${ann.name}\` (no following binding)`,
      });
    }
  }

  return warnings;
}

function lintMarkdown(source) {
  const warnings = [];
  const lines = source.split('\n');
  let inFence = false;
  let fenceOpenLine = -1;
  let fenceChar = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!inFence && /^(`{3,}|"{3,})/.test(trimmed)) {
      inFence = true;
      fenceChar = trimmed[0];
      fenceOpenLine = i;
      if (!/^(`{3,}|"{3,})\w/.test(trimmed)) {
        warnings.push({ line: i, code: 'missing-lang-tag', message: 'Code block missing language tag — evaluator will skip it' });
      }
      continue;
    }
    if (inFence && trimmed.startsWith(fenceChar.repeat(3))) {
      inFence = false;
      fenceOpenLine = -1;
      continue;
    }
    if (inFence) continue;

    if (/^---+$/.test(trimmed)) {
      warnings.push({ line: i, code: 'thematic-break', message: '`---` evaluates as subtraction in 10x — use `***` instead' });
    }

    if (i === 0 && trimmed === '---') {
      warnings.push({ line: i, code: 'frontmatter', message: 'Frontmatter `---` block is not supported — evaluates as subtraction' });
    }

    if (/^#{1,6}\s.+\.$/.test(trimmed) || /^[-*+]\s.+\.$/.test(trimmed)) {
      warnings.push({ line: i, code: 'trailing-dot', message: 'Trailing `.` on heading/list item may conflict with EOL token' });
    }

    if (/^\s*@on\b/.test(trimmed) && /\s@shadow\.\s*$/.test(trimmed)) {
      warnings.push({
        line: i,
        code: 'on-shadow-order',
        message: 'Prefer canonical order: `@on ... @shadow <handler>.`',
      });
    }
  }

  if (inFence) {
    warnings.push({ line: fenceOpenLine, code: 'unclosed-fence', message: 'Unclosed code fence' });
  }

  return warnings;
}

function fixMarkdown(source) {
  const lines = source.split('\n');
  let inFence = false;

  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (!inFence && /^(`{3,}|"{3,})/.test(trimmed)) {
      inFence = true;
      if (!/^(`{3,}|"{3,})\w/.test(trimmed)) {
        return line.replace(/^(`{3,}|"{3,})/, '$110x');
      }
    }
    if (inFence && /^(`{3,}|"{3,})$/.test(trimmed)) { inFence = false; }
    if (inFence) return line;

    if (/^---+$/.test(trimmed)) return line.replace(/^-+/, '***');

    if (/^#{1,6}\s.+\.$/.test(trimmed) || /^[-*+]\s.+\.$/.test(trimmed)) {
      return line.replace(/\.$/, '');
    }

    if (/^\s*@on\b/.test(trimmed) && /\s@shadow\.\s*$/.test(trimmed)) {
      const fixed = line.match(/^(\s*@on\s+\S+\s+("[^"]+"|'[^']+'|\S+)\s+)(.+?)\s+@shadow\.\s*$/);
      if (fixed) {
        return `${fixed[1]}@shadow ${fixed[3]}.`;
      }
    }

    return line;
  }).join('\n');
}

function inferBindingRuntimeType(token) {
  if (!token) return 'unknown';
  if (token.isCallable || token.isFunction) return 'fn';
  if (token.isTag) return 'tag';
  if (token.isObject) return 'record';
  if (token.isRange) return Array.isArray(token.value) ? 'list' : 'range';
  if (token.isNumber) {
    const kind = token?.value?.kind ?? token?.value?.value?.kind;
    if (typeof kind === 'string' && kind.trim()) return `unit<${kind.trim()}>`;
    return 'number';
  }
  if (token.isString) return 'string';
  if (token.isSymbol) return 'symbol';
  if (token.value === true || token.value === false) return 'bool';
  if (token.value === null) return 'nil';
  return 'unknown';
}

function canonicalTypeName(typeName) {
  const text = String(typeName || '').trim().toLowerCase();
  if (!text) return '';
  if (text === 'num' || text === 'number') return 'number';
  if (text === 'str' || text === 'string') return 'string';
  if (text === 'bool' || text === 'boolean') return 'boolean';
  return text;
}

function toAnnotationTypeName(typeName) {
  const canon = canonicalTypeName(typeName);
  if (canon === 'number') return 'num';
  if (canon === 'string') return 'str';
  if (canon === 'boolean') return 'bool';
  return String(typeName || 'any');
}

async function runTypeChecksForFile(source) {
  const env = createEnv(nodeAdapter);
  await execute(source, env);

  const { annotations, bindings } = collectSourceFacts(source);
  const annByName = new Map();
  annotations.forEach(ann => annByName.set(ann.name, ann.typeText));

  const warnings = [];
  const inferredByName = new Map();

  for (const bind of bindings) {
    const token = env?.locals?.[bind.name]?.body?.[0];
    const inferred = inferBindingRuntimeType(token);
    const inferredAnn = toAnnotationTypeName(inferred);
    inferredByName.set(bind.name, inferred);

    const expected = annByName.get(bind.name);
    if (!expected) {
      warnings.push({
        line: bind.line,
        message: `Unannotated binding \`${bind.name}\` (inferred: ${inferredAnn})`,
        hint: true,
      });
      continue;
    }

    if (
      expected
      && inferred !== 'unknown'
      && canonicalTypeName(expected) !== canonicalTypeName(inferred)
    ) {
      warnings.push({
        line: bind.line,
        message: `Type mismatch for \`${bind.name}\`: annotated \`${expected}\`, inferred \`${inferredAnn}\``,
      });
    }
  }

  return { warnings, inferredByName, annotations, bindings };
}

function applyMissingAnnotations(source, inferredByName, annotations, bindings) {
  const lines = String(source || '').split('\n');
  const existing = new Set(annotations.map(x => x.name));
  const inserts = new Map();

  for (const bind of bindings) {
    if (existing.has(bind.name)) continue;
    const inferred = inferredByName.get(bind.name) || '';
    if (!inferred || inferred === 'unknown') continue;
    inserts.set(bind.line, `${bind.name} :: ${toAnnotationTypeName(inferred)}.`);
  }

  if (!inserts.size) return source;

  const out = [];
  lines.forEach((line, idx) => {
    if (inserts.has(idx)) out.push(inserts.get(idx));
    out.push(line);
  });
  return `${out.join('\n')}${source.endsWith('\n') ? '' : '\n'}`;
}

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

function toAliasEntries(rawAlias) {
  const list = Array.isArray(rawAlias) ? rawAlias : (rawAlias ? [rawAlias] : []);
  return list
    .flatMap(item => String(item).split(','))
    .map(item => item.trim())
    .filter(Boolean)
    .map(entry => {
      const idx = entry.indexOf('=');
      if (idx <= 0) return null;
      const key = entry.slice(0, idx).trim();
      const target = entry.slice(idx + 1).trim();
      if (!key || !target) return null;
      return [key, target];
    })
    .filter(Boolean);
}

function resolveWithAliases(specifier, importerPath, aliasEntries) {
  const importerDir = path.dirname(path.resolve(importerPath));
  const resolvePath = value => {
    const withExt = path.extname(value) ? value : `${value}.md`;
    return path.resolve(importerDir, withExt);
  };

  if (specifier.startsWith('.')) return resolvePath(specifier);

  for (const [key, rawTarget] of aliasEntries) {
    if (specifier === key || specifier.startsWith(`${key}/`)) {
      const tail = specifier === key ? '' : specifier.slice(key.length);
      const mapped = rawTarget.endsWith('/') && tail.startsWith('/') ? `${rawTarget}${tail.slice(1)}` : `${rawTarget}${tail}`;
      return resolvePath(mapped);
    }
  }

  throw new Error(`Cannot resolve bundled import "${specifier}" from ${importerPath}. Use --alias <prefix=path> or keep it as runtime import.`);
}

async function cli() {
  await runtimeReady;

  if (argv.flags.lint || argv.flags.check || argv.flags.fix) {
    const files = argv._;
    let hasError = false;
    const runCheck = !!argv.flags.check || !!argv.flags.fix;
    const runFix = !!argv.flags.fix;
    const dryRun = !!(argv.flags['dry-run'] || argv.flags.dryRun || argv.flags.dry_run);

    if (runCheck || runFix) {
      await prelude();
    }

    for (const file of files) {
      const filePath = file + (!file.includes('.') ? '.md' : '');
      const src = fs.readFileSync(filePath).toString();
      try {
        const ast = Parser.getAST(src, 'parse');

        const lintWarnings = lintAnnotationSource(src);
        lintWarnings.forEach(w => {
          console.error(`${file}:${w.line + 1}:1: warning: ${w.message}`);
        });

        const mdWarnings = lintMarkdown(src);
        const codeWarnings = lintCode(src, ast);
        [...mdWarnings, ...codeWarnings]
          .sort((a, b) => a.line - b.line)
          .forEach(w => {
            const col = w.col != null ? w.col + 1 : 1;
            console.error(`${file}:${w.line + 1}:${col}: warning [${w.code}]: ${w.message}`);
          });

        let checkWarnings = [];
        let fixedOutput = null;

        if (runFix) {
          fixedOutput = fixMarkdown(src);
        }

        if (runCheck || runFix) {
          try {
            const checked = await runTypeChecksForFile(fixedOutput || src);
            checkWarnings = checked.warnings;
            checkWarnings.forEach(w => {
              const level = w.hint ? 'hint' : 'warning';
              console.error(`${file}:${w.line + 1}:1: ${level}: ${w.message}`);
            });

            if (runFix && fixedOutput !== src) {
              if (dryRun) {
                console.log(`${file}: fix available (dry-run)`);
              } else {
                fs.writeFileSync(filePath, fixedOutput, 'utf8');
                console.log(`${file}: fixed`);
              }
            }
          } catch (e) {
            const line = Number.isFinite(e.line) ? e.line + 1 : 1;
            const col = Number.isFinite(e.col) ? e.col + 1 : 1;
            console.error(`${file}:${line}:${col}: ${e.name}: ${e.message}`);
            hasError = true;
            continue;
          }
        }

        if (!runFix) {
          console.log(`${file}: ok`);
        }

        if (lintWarnings.some(w => !w.hint) || mdWarnings.length || checkWarnings.some(w => !w.hint)) {
          hasError = true;
        }
      } catch (e) {
        const line = Number.isFinite(e.line) ? e.line + 1 : 1;
        const col = Number.isFinite(e.col) ? e.col + 1 : 1;
        console.error(`${file}:${line}:${col}: ${e.name}: ${e.message}`);
        hasError = true;
      }
    }

    process.exit(hasError ? 1 : 0);
  }

  const { _, raw, ...flags } = argv;

  if (_[0] === 'compile') {
    const inputArg = _[1];
    const outputArg = _[2];

    if (!inputArg) {
      throw new Error('Missing input file. Usage: 10x compile <input.md> [output.mjs] [--runtime ./runtime] [--bundle] [--alias @app=./src]');
    }

    const inputFile = inputArg.includes('.') ? inputArg : `${inputArg}.md`;
    const runtimePath = argv.flags.runtime || './runtime';
    const aliasEntries = toAliasEntries(argv.flags.alias);
    const compiled = argv.flags.bundle
      ? compileBundle(inputFile, {
        runtimePath,
        readFile: modulePath => fs.readFileSync(modulePath, 'utf8'),
        shouldBundleImport: specifier => {
          const isRelativeOrAlias = specifier.startsWith('.')
            || aliasEntries.some(([key]) => specifier === key || specifier.startsWith(`${key}/`));
          return isRelativeOrAlias;
        },
        resolveModule: (specifier, importerPath) => resolveWithAliases(specifier, importerPath, aliasEntries),
      })
      : compile(fs.readFileSync(inputFile, 'utf8'), { runtimePath });

    if (outputArg) {
      fs.writeFileSync(outputArg, `${compiled}\n`, 'utf8');
    } else {
      process.stdout.write(`${compiled}\n`);
    }

    return;
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

  if (flags.print) {
    await format(code, flags.color, flags.inline);
  } else {
    await main(code, flags.source, null, flags.trace, false, prelude);
  }
}

export { cli, main, format, execute, evaluate, useCurrencies, createEnv, applyAdapter };
