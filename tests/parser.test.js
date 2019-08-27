import { expect } from 'chai';
import { transform } from '../src/lib/parser';
import { getTokensFrom } from '../src/lib/lexer';
import { DEFAULT_MAPPINGS } from '../src/lib/convert';

describe('Parser', () => {
  const tree = sample => transform(getTokensFrom(sample, DEFAULT_MAPPINGS), DEFAULT_MAPPINGS).tree;

  describe('tokenization', () => {
    it('should produce fixed tokens', () => {
      expect(tree('x=1.2;')).to.eql([
        [
          { depth: 0, begin: [0, 0], end: [0, 1], token: ['def', 'x'] },
          { depth: 1, begin: [0, 1], end: [0, 2], token: ['expr', '=', 'equal'] },
          { depth: 1, begin: [0, 2], end: [0, 5], token: ['number', '1.2'] },
          { depth: 0, begin: [0, 5], end: [0, 6], token: ['expr', ';', 'k'] },
        ],
      ]);
    });
  });
});
