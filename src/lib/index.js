import {
  transform, toToken, toList,
} from './transform';

import {
  parseBuffer, joinTokens, fixTree,
  isInt, toFraction, toNumber, toValue,
} from './parser';

import { reduceFromAST } from './reducer';
import { calculateFromTokens } from './solver';

import {
  unitFrom, convertFrom,
  DEFAULT_TYPES, DEFAULT_MAPPINGS, DEFAULT_EXPRESSIONS, DEFAULT_INFLECTIONS,
} from './convert';

export default class Solvente {
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

    Object.defineProperty(this, 'types', {
      value: [
        ...DEFAULT_TYPES,
        ...(opts.types || []),
      ],
    });

    // public properties
    this.tokens = [];
    this.input = [];
    this.tree = [];

    // extend units from custom expressions
    if (typeof opts.expressions === 'object') {
      Object.keys(opts.expressions).forEach(key => {
        this.units[key] = key;
      });
    }
  }

  resolve(sample) {
    this.input = parseBuffer(sample, this.units);

    try {
      const tokens = transform(this.input, this.units);
      const fixedAST = JSON.parse(JSON.stringify(tokens.ast));

      this.error = tokens.error;
      this.tokens = fixedAST;

      // rethrow tree-building errors
      if (tokens.error) throw tokens.error;

      // mutates on AST manipulation!!!
      this.tree = fixTree(tokens.tree);
    } catch (e) {
      this.error = e;
    }

    return this;
  }

  value(token) {
    if (!token) {
      return null;
    }

    if (token[0] === 'number') {
      token[1] = toNumber(token[1]);
    }

    // if (
    //   token[2]
    //   && token[0] === 'number'
    //   && !(isInt(token[1]) || token[1] instanceof Date)
    // ) {
    //   // remove trailing words from units
    //   token[1] = token[1].replace(/[\sa-z/-]+$/ig, '');
    // }

    let fixedValue = toValue(token[1]);
    let fixedUnit = token[2];

    // adjust unit-fractions
    if (fixedUnit && fixedUnit.indexOf('fr-') === 0) {
      fixedValue = toFraction(fixedValue);
      fixedUnit = fixedUnit.split('fr-')[1];
    }

    // add thousand separators
    // if (isInt(fixedValue)) {
    //   fixedValue = fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // }

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

    return {
      val: token[1],
      type: token[0],
      format: typeof fixedValue !== 'string'
        ? JSON.stringify(fixedValue)
        : fixedValue,
    };
  }

  eval(tokens) {
    tokens = tokens || this.tree;

    const chunks = toList(tokens, false);
    const results = [];

    try {
      chunks.forEach(ast => {
        results.push(...toList(reduceFromAST(ast, convertFrom, this.expressions)));
      });
    } catch (e) {
      this.error = e;
      return null;
    }

    return results.map(x => this.value(calculateFromTokens(x)));
  }
}
