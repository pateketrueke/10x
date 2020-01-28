const { Transform } = require('stream');

const prompts = require('prompts');
const wargs = require('wargs');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

let cwd = process.cwd();

function call(cb) {
  return (p, ...a) => new Promise((k, r) => cb(p, ...a, (e, d) => (e ? r(e) : k(d))));
}

function input() {
  if (process.stdin.isTTY) return null;
  return new Promise(ok => {
    process.stdin.on('end', () => ok(null))
      .pipe(new Transform({
        transform(entry, enc, callback) {
          ok(Buffer.from(entry, enc).toString());
          callback();
        },
    }));
  });
}

function prompt(...args) {
  const o = args.reduce((p, c) => p.concat(c), []);

  return prompts(o.map(_o => ({
    type: _o.type,
    name: _o.name,
    message: _o.message,
    validate: _o.validate,
  })));
}

function string(cb) {
  return (...args) => cb(...args).then(data => data.toString());
}

const _argv = process.argv.slice(2);

module.exports = ({ Env }) => {
  Env.shared = {
    Proc: {
      cwd: () => cwd,
      chdir: p => { cwd = path.resolve(cwd, p); },
      setenv: (k, v) => { process.env[k] = v; },
      unsetenv: k => { delete process.env[k]; },
      homedir: () => os.homedir(),
      tmpdir: () => os.tmpdir(),
      getenv: k => process.env[k],
      getopts: p => wargs(_argv, p),
      exit: n => { process.exit(n); },
      wait: ms => new Promise(ok => setTimeout(ok, ms)),
    },
    IO: {
      input: (...a) => (a.length ? prompt(...a) : input()),
      puts: (...a) => { process.stdout.write(a.join('')); },
      err: (...a) => { process.stderr.write(a.join('')); },
    },
    Fs: {
      read: string(call(fs.readFile)),
      write: call(fs.outputFile),
      readJSON: string(call(fs.readJson)),
      writeJSON: call(fs.outputJson),
      copyFile: call(fs.copyFile),
      move: call(fs.move),
      readdir: call(fs.readdir),
      pathExists: call(fs.pathExists),
      stat: call(fs.stat),
      emptyDir: call(fs.emptyDir),
      mkdirp: call(fs.mkdirp),
      remove: call(fs.remove),
      ensureDir: call(fs.ensureDir),
      ensureFile: call(fs.ensureFile),
    },
  };
};
