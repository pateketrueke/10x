import {
  calculateFromTokens,
} from './solver';

import {
  toList,
  isArray,
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

  static from(token, fromCallback, arg1, arg2, arg3) {
    if (isArray(token)) {
      return new Expr({ token });
    }

    if (!(token instanceof Expr) && typeof fromCallback === 'function') {
      const retval = fromCallback(token.content, arg1, arg2, arg3);

      if (!retval) {
        throw new Err(`Unexpected token \`${token.content}\``, token);
      }

      return new Expr(token, retval);
    }

    return new Expr(token);
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
