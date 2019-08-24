import { getTokensFrom } from '../src/lib/lexer';

describe('Lexer', () => {
  describe('getTokensFrom', () => {
    it('should split given source as tokens', () => {
      console.log(getTokensFrom('a b c'));
      console.log(getTokensFrom('foo bar'));
    });
  });
});
