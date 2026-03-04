import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

function ensureFile(relPath) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing required file: ${relPath}`);
  }
}

function ensureContains(relPath, text) {
  const abs = path.join(root, relPath);
  const content = fs.readFileSync(abs, 'utf8');
  if (!content.includes(text)) {
    throw new Error(`Expected ${relPath} to include: ${text}`);
  }
}

run('npm run lsp:build');
run('npm run ts:generate');
run('npm run ts:test');

ensureFile('lsp/dist/server.mjs');
ensureFile('tree-sitter-10x/src/parser.c');
ensureFile('tree-sitter-10x/queries/highlights.scm');
ensureFile('zed-10x/extension.toml');
ensureContains('zed-10x/extension.toml', '../lsp/dist/server.mjs');
ensureContains('zed-10x/extension.toml', '../tree-sitter-10x');

console.log('tooling smoke: ok');
