export const argv = process.argv.slice(2);

export function exit(code = 0) {
  process.exit(code);
}
