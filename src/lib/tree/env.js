/* eslint-disable prefer-object-spread */

import Expr from './expr';
import * as Prelude from '../prelude';

import { FFI, LITERAL } from './symbols';
import { raise, isPlain } from '../helpers';

const SAFE_GLOBALS = ['Promise', 'RegExp', 'Object', 'Array', 'String', 'Number', 'Math', 'Date', 'JSON'];

const SAFE_PRELUDE = Object.keys(Prelude).reduce((prev, cur) => {
  prev[cur] = Expr.unsafe(Prelude[cur], cur, cur === 'check');
  return prev;
}, {});

export default class Env {
  constructor(value) {
    this.locals = {};
    this.resolved = [];
    this.templates = {};

    // module details
    this.exported = true;
    this.descriptor = null;

    Object.defineProperty(this, 'parent', { value });
  }

  has(name, recursive) {
    return !(recursive && this.parent && !this.locals[name])
      ? typeof this.locals[name] !== 'undefined'
      : this.parent.has(name, recursive);
  }

  get(name) {
    if (this.resolved.includes(name)) {
      const found = Expr.has(this.locals[name].body, LITERAL, name);
      const call = this.locals[name].body[0].isCallable;

      if (found && !call) {
        raise(`Unexpected reference to \`${name}\``);
      }

      return this.locals[name];
    }

    if (!this.locals[name]) {
      if (this.parent) {
        return this.parent.get(name);
      }

      raise(`Undeclared local \`${name}\``);
    }

    // keep refs to back-tracking, see usage above
    this.resolved.push(name);

    return this.locals[name];
  }

  set(name, value, noInheritance) {
    if (typeof value === 'function') {
      let root = this;

      /* istanbul ignore next */
      if (noInheritance !== true) {
        while (root && root.parent) {
          if (root && root.has(name)) break;
          root = root.parent;
        }
      }

      value(root, root.locals[name]);
    } else {
      this.locals[name] = value;
    }
  }

  def(name, ...values) {
    this.set(name, { body: [].concat(values) });
  }

  defn(name, params, tokenInfo) {
    this.set(name, root => {
      root.set(name, { ...params, ctx: tokenInfo });
    }, true);
  }

  static up(name, label, callback, environment) {
    environment.set(name, (root, token) => {
      root.set(name, { body: [Expr.value(callback(), token.ctx || token.body[0].tokenInfo)] });
    });
  }

  static sub(args, target, environment) {
    const scope = new Env(environment);
    const list = Expr.args(args);

    while (target.body && target.body[0].isCallable) {
      Env.merge(list, target.args, true, scope);
      target = target.body[0].value;
    }

    if (target.body && target.args) {
      Env.merge(list, target.args, true, scope);
    }

    return { target, scope };
  }

  static async load(ctx, name, alias, source, environment) {
    let label = `${source.split('/').pop()}/${name}${alias ? `:${alias}` : ''}`;

    const isGlobal = SAFE_GLOBALS.includes(source);

    const shared = Object.assign({
      Prelude: SAFE_PRELUDE,
      Unit: Expr.Unit,
      Frac: Expr.Frac,
    }, Env.shared);

    try {
      let env;

      if (isGlobal) {
        env = global[source];
      } else if (shared[source]) {
        env = shared[source];
      } else {
        env = await Env.resolve(source, name, alias, environment);
      }

      if (!env) {
        raise(`Could not load \`${name}\``, ctx.tokenInfo);
      }

      // save link between environments
      if (env instanceof Env) {
        if (env.descriptor) {
          label = `${env.descriptor}/${label.split('/')[1]}`;
        }

        // reassign name from aliased exports!
        if (typeof env.exported === 'object') {
          name = env.exported[name] || name;
        }

        if (!env.has(name)) {
          raise(`Local \`${name}\` not exported`);
        }

        environment.defn(alias || name, {
          body: [Expr.fn({
            env, label, target: name,
          }, ctx.tokenInfo)],
        }, ctx.tokenInfo);
        return;
      }

      // wrap any given function/class or value!
      if (!isGlobal && typeof env[name] === 'undefined') {
        if (name !== 'default' || (!alias || name === alias)) raise(`Symbol \`${name}\` not exported`);

        environment.def(alias, Expr[isPlain(env) ? 'value' : 'fn'](env, ctx.tokenInfo));
        return;
      }

      let body = env[name];

      // it does not look like an AST-tree? then just wrap the value!
      if (!Array.isArray(body) || !(body[0] instanceof Expr)) {
        body = [Expr.call(env, name, label, ctx.tokenInfo)];
      }

      // values wrapped as FFI are returned as is...
      if (Array.isArray(env[name]) && env[name][0] === FFI) {
        const fixedToken = { ...ctx.tokenInfo };

        if (env[name][3]) {
          fixedToken.kind = 'raw';
        }

        body = [Expr.function({
          type: FFI,
          value: {
            target: env[name][1],
            label: env[name][2],
          },
        }, fixedToken)];
      }

      environment.defn(alias || name, { body }, ctx.tokenInfo);
    } catch (e) {
      raise(`${e.message} (${label})`, ctx.tokenInfo);
    }
  }

  static merge(list, values, hygiene, environment) {
    const args = Expr.args(values, true);

    for (let i = 0, c = args.length; i < c; i++) {
      if (list.length) {
        const key = args[i].value;
        const value = key === '..'
          ? list.splice(0, list.length)
          : list.shift();

        if (!hygiene || !(environment.parent && environment.parent.has(key, true))) {
          environment.def(key, Array.isArray(value) ? Expr.body(value, args[i].tokenInfo) : value);
        }
      } else break;
    }
  }

  static create(values, environment) {
    const scope = new Env(environment);

    Object.keys(values).forEach(key => {
      if (!(values[key] instanceof Expr)) {
        scope.def(key, Expr.value(values[key]));
      } else {
        scope.def(key, values[key]);
      }
    });

    return scope;
  }

  /* istanbul ignore next */
  static register() {
    return undefined;
  }

  /* istanbul ignore next */
  static resolve() {
    return undefined;
  }
}
