import {
  isArray,
} from './utils';

import LangErr from './error';

export default class LangExpr {
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

  static from(token, fromCallback, arg1, arg2, arg3, arg4) {
    if (isArray(token)) {
      return new LangExpr({ token });
    }

    if (!(token instanceof LangExpr) && typeof fromCallback === 'function') {
      const retval = fromCallback(token.content, arg1, arg2, arg3, arg4);

      if (!retval) {
        throw new LangErr(`Unexpected token \`${token.content}\``, token);
      }

      return new LangExpr(token, retval);
    }

    return new LangExpr(token);
  }
}
