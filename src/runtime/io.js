import fs from 'fs';

export function puts(value) {
  process.stdout.write(`${String(value)}\n`);
}

export function err(value) {
  process.stderr.write(String(value));
}

export function input(prompt = '') {
  if (prompt) process.stdout.write(String(prompt));
  return fs.readFileSync(0, 'utf8').replace(/\r?\n$/, '');
}
