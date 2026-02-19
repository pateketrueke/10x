const path = require('path');
const fs = require('fs');

const SAFE_UNITS = [];
const CACHED_MODULES = {};

module.exports = ({ Env, Expr, execute }) => {
  Env.import = async (filepath, environment) => {
    if (!CACHED_MODULES[filepath]) {
      const code = fs.readFileSync(filepath).toString();
      const env = CACHED_MODULES[filepath] = new Env(environment);

      await execute(code, env);
    }

    return CACHED_MODULES[filepath];
  };

  Env.resolve = async (src, name, alias, environment) => {
    let file = path.resolve(src);
    let source;

    if (fs.existsSync(file)) {
      if (src.includes('.js')) return require(file);
      source = await Env.import(file, environment);
    } else {
      const exts = ['md', 'js'];

      for (let i = 0, c = exts.length; i < c; i++) {
        file = path.resolve(`${src}.${exts[i]}`);

        if (fs.existsSync(file)) {
          if (exts[i] === 'js') return require(file);
          source = await Env.import(file, environment);
          break;
        }
      }
    }

    return source || require(src);
  };

  Env.register = (num, kind) => {
    if (typeof num === 'function') {
      SAFE_UNITS.push(num);
      return;
    }

    for (let i = 0, c = SAFE_UNITS.length; i < c; i++) {
      const retval = SAFE_UNITS[i](num, kind);

      if (retval) {
        return retval;
      }
    }

    return Expr.Unit.from(num, kind);
  };
};
