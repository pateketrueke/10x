import {
  calculateFromTokens,
} from './solver';

import {
  hasOp,
} from './shared';

import {
  isInt, isArray,
  toList, toValue, toNumber, toFraction, toProperty, toArguments,
} from './utils';

import Err from './error';
import Range from './range';

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
    if (isArray(output)) {
      while (output.length === 1 && isArray(output[0])) output = output[0];

      output = output
        .reduce((p, c) => p.concat(Expr.ok(c)), [])
        .filter(x => !isArray(x) && x.token[0] !== 'symbol');

      // FIXME: use helpers!!!
      if (output.some(x => !isArray(x) && x.token[0] === 'expr' && hasOp(x.token[1]))) {
        return [Expr.value(output)];
      }

      return output;
    }

    if (
      output.token[0] === 'object'
      && isArray(output.token[1])
      && output.token[1].some(x => !isArray(x) && x.token[0] === 'expr')
    ) {
      return Expr.ok(output.token[1]);
    }

    return output;
  }

  static map(value, cb) {
    return Range.resolve(value.token[0] === 'range' ? value.token[2] : Expr.input(value), cb);
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

    if (!(token instanceof Expr)) {
      throw new Error(`Unexpected token, given \`${token}\``);
    }

    if (typeof args === 'function') {
      cb = args;
      args = undefined;
    }

    token = token.token;

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
      return Range.resolve(token[2]);
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

    if (token[0] === 'string') fixedValue = token.slice(1).reduce((p, c) => p + c, '');
    if (token[0] === 'number') fixedValue = parseFloat(toNumber(fixedValue));

    return fixedValue;
  }

  static plain(tokens) {
    return Expr.input(Expr.ok(tokens));
  }

  static value(tokens) {
    return Expr.from(calculateFromTokens(toList(tokens)));
  }

  static merge(tokens) {
    while (tokens.length === 1 && isArray(tokens[0])) tokens = tokens[0];

    if (tokens[0].token[0] === 'object') {
      return tokens[0].token[1];
    }

    return tokens;
  }

  static derive(value) {
    if (isArray(value)) {
      return value.map(x => Expr.derive(x));
    }

    // FIXME: add object support?

    let token;

    if (value === null) token = ['symbol', null];
    if (value === true) token = ['symbol', true];
    if (value === false) token = ['symbol', false];

    if (typeof token === 'undefined') {
      token = [typeof value, value];
    }

    return Expr.from(token);
  }

  static resolve(token, formatter, inflections) {
    if (token[0] === 'number') {
      token[1] = toNumber(token[1]);
    }

    if (
      token[2]
      && token[0] === 'number'
      && !(isInt(token[1]) || token[1] instanceof Date)
    ) {
      // remove trailing words from units
      token[1] = String(token[1]).replace(/[\sa-z/-]+$/ig, '');
    }

    let fixedValue = toValue(token);
    let fixedUnit = typeof token[2] === 'string' && token[2];

    // adjust unit-fractions
    if (fixedUnit && (fixedUnit.indexOf('fr-') === 0 || fixedUnit === 'x-fraction')) {
      fixedValue = toFraction(fixedValue);
      fixedUnit = fixedUnit.split('fr-')[1];
    }

    // add thousand separators
    if (token[0] === 'number' && isInt(fixedValue)) {
      fixedValue = fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    if (
      fixedUnit
      && !(['datetime', 'x-fraction'].includes(fixedUnit) || token[1] instanceof Date)
    ) {
      // apply well-known inflections
      if (fixedUnit.length === 1 && inflections[fixedUnit]) {
        const [one, many] = inflections[fixedUnit];
        const base = parseFloat(fixedValue);

        if (base === 1.0 && one) fixedUnit = one;
        if (base !== 1.0 && many) fixedUnit = many;
      }

      if (fixedUnit !== 'fr' && !fixedValue.includes(fixedUnit)) {
        fixedValue += ` ${fixedUnit}`;
      }
    }

    let formattedValue = typeof fixedValue !== 'string'
      ? JSON.stringify(fixedValue)
      : fixedValue;

    if (typeof formatter === 'function') {
      formattedValue = formatter(token[0], formattedValue);
    }

    return {
      val: token[1],
      type: token[0],
      format: formattedValue,
    };
  }
}
