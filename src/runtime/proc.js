import wargs from 'wargs';

export const argv = process.argv.slice(2);

export function getopts(spec = {}) {
  return wargs(argv, spec);
}

export function exit(code = 0) {
  process.exit(code);
}
