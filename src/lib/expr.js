import {
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

  static to(value) {
    if (value === null) return ['symbol', null];
    if (value === true) return ['symbol', true];
    if (value === false) return ['symbol', false];

    return [typeof value, typeof value === 'string' ? [value] : value];
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
}
