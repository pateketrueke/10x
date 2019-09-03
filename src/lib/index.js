import { getTokensFrom } from './lexer';
import { transform } from './parser';

import {
  isInt, isArray, toToken,
} from './shared';

import {
  fixArgs,
  toFraction, toNumber, toValue, toList,
} from './ast';

import LangErr from './error';
import LangExpr from './expr';

import { reduceFromAST } from './reducer';
import { calculateFromTokens } from './solver';

import {
  convertFrom,
  DEFAULT_MAPPINGS, DEFAULT_EXPRESSIONS, DEFAULT_INFLECTIONS,
} from './convert';

export default class Solv {
  constructor(opts = {}) {
    Object.defineProperty(this, 'expressions', {
      value: {
        ...DEFAULT_EXPRESSIONS,
        ...(opts.expressions || {}),
      },
    });

    Object.defineProperty(this, 'inflections', {
      value: {
        ...DEFAULT_INFLECTIONS,
        ...(opts.inflections || {}),
      },
    });

    Object.defineProperty(this, 'units', {
      value: {
        ...DEFAULT_MAPPINGS,
        ...(opts.units || {}),
      },
    });

    // shared registry for memoization
    Object.defineProperty(this, '_', {
      value: {},
      writable: false,
      enumerable: false,
      configurable: false,
    });

    // shared registry for included files
    Object.defineProperty(this, '$', {
      value: {},
      writable: false,
      enumerable: false,
      configurable: false,
    });

    // empty defaults
    this.error = null;
    this.input = [];
    this.tree = [];
    this.ast = [];

    // public properties
    this.filepath = opts.filepath;
    this.source = opts.source;

    try {
      Object.assign(this, this.partial(opts.source));
    } catch (e) {
      this.error = LangErr.build(e, opts.source, 2, this.filepath);
    }
  }

  partial(source, parent, offset) {
    const output = {
      error: null,
      input: [],
      tree: [],
      ast: [],
    };

    output.input = getTokensFrom(source, this.units, parent, offset);

    Object.assign(output, transform(output, this));

    if (output.error) throw output.error;
    return output;
  }

  // external(source, filepath) {
  //   // FIXME: clone or inherit units/expressions?
  //   if (!this.include[filepath] || this.include[filepath].source !== source) {
  //     this.include[filepath] = new Solv().resolve(source, filepath);
  //   }

  //   return this.include[filepath];
  // }

  format(result, indent, formatter, separator, parentheses) {
    if (isArray(result)) {
      const fixedResult = result.map(x => this.value(x, indent, formatter, separator, parentheses).format);

      if (separator) {
        if (parentheses) {
          return `${formatter('open', '(')}${fixedResult.join(separator)}${formatter('close', ')')}`;
        }

        if (isArray(result[0]) || result[0].token[0] === 'object') {
          const tabs = Array.from({ length: indent + 2 }).join(' ');

          return fixedResult.join(`${separator}\n${tabs}`);
        }

        return fixedResult.join(separator);
      }

      return fixedResult;
    }

    return this.value(result, indent, formatter, separator, parentheses).format;
  }

  value(result, indent, formatter, separator, parentheses) {
    if (!result) {
      return null;
    }

    if (isArray(result)) {
      return {
        val: result,
        type: 'object',
        format: this.format(result, indent, formatter, separator, !parentheses || isArray(result[0])),
      };
    }

    if (result instanceof LangExpr) {
      const { token } = result;

      if (token[0] === 'object') {
        const fixedObject = this.value(token[1], indent, formatter, separator).format;

        return {
          val: token[1],
          type: token[0],
          format: fixedObject,
        };
      }

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
      let fixedUnit = token[2];

      // adjust unit-fractions
      if (typeof fixedUnit === 'string' && fixedUnit.indexOf('fr-') === 0) {
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
        if (fixedUnit.length === 1 && this.inflections[fixedUnit]) {
          const [one, many] = this.inflections[fixedUnit];
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

    const tabs = Array.from({ length: indent + 3 }).join(' ');
    const out = [];

    Object.keys(result).forEach((key, i) => {
      out.push(`${i ? tabs : ''}${formatter('symbol', key)} ${this.format(result[key], indent, formatter, separator)}`);
    });

    return {
      value: result,
      type: 'object',
      format: `${formatter('open', '(')}${out.join(`${separator}\n`)}${formatter('close', ')')}`,
    };
  }

  eval(tokens, source) {
    const cb = ast => reduceFromAST(ast, this, { convertFrom }, null, this.expressions, this._);
    const output = [];

    try {
      this.error = null;
      (tokens || this.tree).forEach(ast => {
        if (ast) output.push(...fixArgs(cb(ast)));
      });
    } catch (e) {
      this.error = LangErr.build(e, source || this.source, 2, this.filepath);
      return [];
    }

    return output
      .filter(x => x.length)
      .map(x => {
        // evaluate last chunks with expressions...
        if (x.length > 1 && x.some(y => !isArray(y) && y.token[0] === 'expr')) {
          return toToken(calculateFromTokens(toList(x)));
        }

        return x;
      })
      .reduce((p, c) => p.concat(c), []);
  }
}
