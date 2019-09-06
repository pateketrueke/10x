import { getTokensFrom } from './lexer';
import { transform } from './parser';

import {
  repeat,
  isArray,
} from './utils';

import {
  fixArgs,
} from './ast';

import Err from './error';
import Expr from './expr';

import { reduceFromAST } from './reducer';

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
      this.error = Err.build(e, opts.source, 2, this.filepath);
    }
  }

  include(source, filepath) {
    // FIXME: clone or inherit units/expressions?
    if (!this.$[filepath] || this.$[filepath].source !== source) {
      this.$[filepath] = new Solv({ source, filepath });
    }

    return this.$[filepath];
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

  value(result, indent, formatter, separator, parentheses) {
    if (!result) {
      return null;
    }

    if (isArray(result)) {
      const fixedResult = result.map(x => this.value(x, indent, formatter, separator, !isArray(x[0])).format);

      return {
        val: result,
        type: 'object',
        format: parentheses !== false
          ? `${formatter('open', '(')}${fixedResult.join(separator)}${formatter('close', ')')}`
          : fixedResult.join(`${separator.trim()}\n${repeat(' ', indent + 2)}`),
      };
    }

    if (result instanceof Expr) {
      if (isArray(result.token[0])) {
        return {
          val: result.token,
          type: 'object',
          format: result.token.map(x => Expr.resolve(x, formatter, this.inflections)).join(separator),
        };
      }

      if (result.token[0] === 'object') {
        return this.value(result.token[1], indent, formatter, separator);
      }

      return Expr.resolve(result.token, formatter, this.inflections);
    }

    const tabs = repeat(' ', indent + 3);
    const out = [];

    Object.keys(result).forEach((key, i) => {
      const fixedResult = this.value(result[key], indent, formatter, separator, !isArray(result[key][0])).format;

      out.push(`${i ? tabs : ''}${formatter('symbol', key)} ${fixedResult}`);
    });

    return {
      val: result,
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
      this.error = Err.build(e, source || this.source, 2, this.filepath);
      return [];
    }

    return output
      .filter(x => x.length)
      .reduce((p, c) => p.concat(Expr.ok(c)), []);
  }

  raw(tokens) {
    return Expr.input(tokens, null, x => this.raw(x));
  }
}
