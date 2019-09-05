import {
  calculateFromTokens,
} from './solver';

import {
  hasOp,
} from './shared';

import {
  isArray,
  toList, toNumber, toProperty, toArguments,
} from './utils';

import Err from './error';

export default class Expr {
  constructor(info, token) {
    if (!token) {
      token = info.token;
    }

    // clone exact properties!
    ['depth', 'begin', 'end'].forEach(k => {
      Object.defineProperty(this, k, {
        value: info[k],
        writable: true,
        configurable: true,
      });
    });

    this.token = token.slice();
  }

  static ok(output) {
    // FIXME: use helpers!!!
    if (output.some(x => !isArray(x) && x.token[0] === 'expr' && hasOp(x.token[1]))) {
      return Expr.value(output);
    }

    return output;
  }

  static from(token, fromCallback, arg1, arg2, arg3) {
    if (!(token instanceof Expr) && typeof fromCallback === 'function') {
      const retval = fromCallback(token.content, arg1, arg2, arg3);

      if (!retval) {
        throw new Err(`Unexpected token \`${token.content}\``, token);
      }

      return new Expr(token, retval);
    }

    if (isArray(token)) {
      return new Expr({ token });
    }

    return new Expr(token);
  }

  static input(token, args, cb) {
    if (isArray(token)) {
      return token.map(x => Expr.input(x, args, cb));
    }

    if (token instanceof Expr) {
      token = token.token;
    }

    // handle lambda-calls as side-effects
    if (token[0] === 'fn') {
      const fixedArgs = { ...args };

      return (...context) => {
        const newArgs = toArguments(token[2].args, context.map(x => Expr.derive(x)));

        return cb(token[2].body.slice(), Object.assign(fixedArgs, newArgs));
      };
    }

    // return range-expressions as is...
    if (token[0] === 'range') {
      return token[2];
    }

    // intermediate state for objects
    if (token[0] === 'object') {
      if (isArray(token[1])) {
        return token[1].map(y => Expr.input(y, args, cb));
      }

      Object.keys(token[1]).forEach(k => {
        const value = Expr.input(token[1][k], args, cb);
        const key = toProperty(k);

        delete token[1][k];

        token[1][key] = value;
      });
    }

    // plain values
    let fixedValue = token[1];

    if (token[0] === 'string') fixedValue = fixedValue.reduce((p, c) => p + c, '');
    if (token[0] === 'number') fixedValue = parseFloat(toNumber(fixedValue));

    return fixedValue;
  }

  static plain(tokens) {
    return Expr.input(Expr.value(tokens));
  }

  static value(tokens) {
    return !isArray(tokens[0])
      ? Expr.from(calculateFromTokens(toList(tokens)))
      : tokens;
  }

  static derive(value) {
    let token;

    if (value === null) token = ['symbol', null];
    if (value === true) token = ['symbol', true];
    if (value === false) token = ['symbol', false];

    if (typeof token === 'undefined') {
      token = [typeof value, typeof value === 'string' ? [value] : value];
    }

    return Expr.from(token);
  }
}
