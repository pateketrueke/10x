import { expect } from 'chai';
import { getTokensFrom } from '../src/lib/lexer';

describe('Lexer', () => {
  describe('getTokensFrom', () => {
    it('should split given source as chars', () => {
      expect(getTokensFrom('a 1 ?').length).to.eql(5);
    });

    it('should handle characters', () => {
      expect(getTokensFrom('foo bar').length).to.eql(3);
    });

    it('should handle numbers', () => {
      expect(getTokensFrom('123 456').length).to.eql(3);
      expect(getTokensFrom('3- 3').length).to.eql(4);
      expect(getTokensFrom('3.-3').length).to.eql(3);
      expect(getTokensFrom('3-.3').length).to.eql(3);
      expect(getTokensFrom('3-3').length).to.eql(2);
    });

    it('should handle decimals', () => {
      expect(getTokensFrom('3.21').length).to.eql(1);
      expect(getTokensFrom('.21').length).to.eql(1);
      expect(getTokensFrom('.21.').length).to.eql(2);
      expect(getTokensFrom('3.21.21').length).to.eql(1);
    });

    it('should handle characters and numbers', () => {
      expect(getTokensFrom('a2 1b').length).to.eql(3);
    });

    it('should handle operators', () => {
      expect(getTokensFrom('1<=2').length).to.eql(3);
    });

    it('should handle comments', () => {
      expect(getTokensFrom('// foo\nbar').length).to.eql(2);
      expect(getTokensFrom('/* foo\nbar */').length).to.eql(1);
    });
  });
});
