import {
  transform, toToken,
} from './transform';

import {
  parseBuffer, joinTokens, cleanTree,
  isOp, isInt, isSep, toFraction, toNumber, toValue,
} from './parser';

import { reduceFromAST } from './reducer';
import { calculateFromTokens } from './solver';

import {
  unitFrom, convertFrom,
  DEFAULT_TYPES, DEFAULT_MAPPINGS, DEFAULT_EXPRESSIONS, DEFAULT_INFLECTIONS,
} from './convert';

export default class Solvente {
  constructor(opts = {}) {
    this.expressions = {
      ...DEFAULT_EXPRESSIONS,
      ...(opts.expressions || {}),
    };

    this.inflections = {
      ...DEFAULT_INFLECTIONS,
      ...(opts.inflections || {}),
    };

    this.units = {
      ...DEFAULT_MAPPINGS,
      ...(opts.units || {}),
    };

    this.types = [
      ...DEFAULT_TYPES,
      ...(opts.types || []),
    ];

    // try built-ins first
    this.convert = (num, base, target) => {
      return convertFrom(num, base, target);
    };

    // extend units from custom expressions
    if (typeof opts.expressions === 'object') {
      Object.keys(opts.expressions).forEach(key => {
        this.units[key] = key;
      });
    }
  }

  resolve(sample) {
    let info = {
      tokens: [],
      input: [],
      tree: [],
    };

    const out = parseBuffer(sample, unitFrom(this.types));
    const all = joinTokens(out.tokens, this.units, out.types);

    info.input = all;

    try {
      const tokens = transform(all, this.units, out.types);
      const fixedAST = tokens.ast.map(x => toToken(x._offset, () => x.slice()));

      info.error = tokens.error;
      info.tokens = fixedAST;

      // FIXME: make math lazy in order to manipulate AST...

      // rethrow tree-building errors
      if (tokens.error) throw tokens.error;

      // mutates on AST manipulation!!!
      info.tree = cleanTree(tokens.tree);

      const normalized = [];

      let offset = 0;
      let chunks;

      // split over single values...
      chunks = reduceFromAST(cleanTree(tokens.tree), this.convert, this.expressions).reduce((prev, cur) => {
        const lastValue = prev[prev.length - 1] || [];

        if (lastValue[0] === 'number' && cur[0] === 'number') {
          prev.push(['expr', ';', 'k'], cur);
        } else prev.push(cur);

        return prev;
      }, []);

      // join chunks into final expressions
      for (let i = 0; i < chunks.length; i += 1) {
        const cur = chunks[i];

        normalized[offset] = normalized[offset] || [];
        normalized[offset].push(cur);

        // make sure we split from all remaining separators
        if (cur[0] === 'expr' && isSep(cur[1])) {
          normalized[offset].pop();

          // ensure we keep no empty chunks
          if (normalized[offset].length) offset += 1;
          else normalized.length = offset;
        }
      }

      info.results = normalized.map(x => {
        const value = calculateFromTokens(x);

        value[1] = toNumber(value[1]);

        if (
          value[2]
          && value[0] === 'number'
          && !(isInt(value[1]) || value[1] instanceof Date)
        ) {
          // remove trailing words from units
          value[1] = value[1].replace(/[\sa-z/-]+$/ig, '');
        }

        let fixedValue = toValue(value[1]);
        let fixedUnit = value[2];

        // adjust unit-fractions
        if (fixedUnit && fixedUnit.indexOf('fr-') === 0) {
          fixedValue = toFraction(fixedValue);
          fixedUnit = fixedUnit.split('fr-')[1];
        }

        // add thousand separators
        if (isInt(fixedValue)) {
          fixedValue = fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        if (fixedUnit && !(['datetime', 'x-fraction'].includes(fixedUnit) || value[1] instanceof Date)) {
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
          val: value[1],
          type: value[0],
          format: typeof fixedValue !== 'string' ? JSON.stringify(fixedValue) : fixedValue,
        };
      });
    } catch (e) {
      info.error = {
        message: e.message,
        stack: e.stack,
      };
    }

    return info;
  }
}
