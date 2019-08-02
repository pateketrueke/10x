import transform from './transform';

import {
  isOp, isSep, toNumber, toValue,
  parseBuffer, joinTokens, cleanTree,
} from './parser';

import { reduceFromAST } from './reducer';
import { calculateFromTokens } from './solver';

import {
  unitFrom, convertFrom,
  DEFAULT_TYPES, DEFAULT_MAPPINGS, DEFAULT_EXPRESSIONS,
} from './convert';

export default class Soulvelte {
  constructor(opts) {
    this.expressions = {
      ...DEFAULT_EXPRESSIONS,
    };

    this.units = {
      ...DEFAULT_MAPPINGS,
    };

    this.types = [
      ...DEFAULT_TYPES,
    ];

    // try built-ins first
    this.convert = (num, base, target) => {
      return convertFrom(num, base, target);
    };

    // extend with custom expressions
    if (typeof opts.expressions === 'object') {
      Object.keys(opts.expressions).forEach(key => {
        this.expressions[key] = opts.expressions[key];
        this.units[key] = key;
      });
    }
  }

  resolve(sample) {
    const out = parseBuffer(sample, unitFrom(this.types));
    const all = joinTokens(out.tokens, this.units, out.types);
    const tokens = transform(all, this.units, out.types);
    const fixedTree = cleanTree(tokens.tree);
    const normalized = [];

    let chunks;
    let info = {};
    let _e;

    try {
      let offset = 0;

      // split over single values...
      chunks = reduceFromAST(fixedTree, this.convert, this.expressions).reduce((prev, cur) => {
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
        }
      }

      info.results = normalized.map(x => {
        let value = calculateFromTokens(x);

        if (value[0] === 'number') {
          value = toNumber(value);
        }

        return {
          fmt: toValue(value[1], value[2]),
          val: value[1],
          type: value[0],
          unit: value[2],
        };
      });
    } catch (e) {
      info.error = e;
    } finally {
      info.tokens = all;
      info.input = tokens.ast;
      info.tree = fixedTree;
    }

    return info;
  }
}
