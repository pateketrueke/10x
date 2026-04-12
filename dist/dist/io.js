var global=globalThis;

// src/runtime/io.js
var { default: fs} = (() => ({}));
function puts(value) {
  process.stdout.write(`${String(value)}
`);
}
function err(value) {
  process.stderr.write(String(value));
}
function input(prompt = "") {
  if (prompt)
    process.stdout.write(String(prompt));
  return fs.readFileSync(0, "utf8").replace(/\r?\n$/, "");
}
export {
  puts,
  input,
  err
};
