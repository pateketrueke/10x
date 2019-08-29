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
          { token: ['def', 'x'] },
          { token: ['expr', '=', 'equal'] },
          { token: ['number', '1.2'] },
          { token: ['expr', ';', 'k'] },
        ],
      ]);
    });
  });
});
