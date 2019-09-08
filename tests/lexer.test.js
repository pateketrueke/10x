import { expect } from 'chai';
import { getTokensFrom } from '../src/lib/lexer';
import { DEFAULT_MAPPINGS } from '../src/lib/convert';

describe('Lexer', () => {
  describe('basic tokens', () => {
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
      expect(getTokensFrom('3-.3').length).to.eql(2);
      expect(getTokensFrom('3-3').length).to.eql(2);
    });

    it('should handle decimals', () => {
      expect(getTokensFrom('3/2').length).to.eql(1);
      expect(getTokensFrom('3/ 2').length).to.eql(4);
      expect(getTokensFrom('3 /2').length).to.eql(4);
      expect(getTokensFrom('3 / 2').length).to.eql(5);
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
      expect(getTokensFrom('~> void').length).to.eql(3);
    });

    it('should handle comments', () => {
      expect(getTokensFrom('// foo\nbar').length).to.eql(2);
      expect(getTokensFrom('/* foo\nbar */').length).to.eql(1);
    });

    it('should handle markdown-like tags', () => {
      expect(getTokensFrom('# foo\nbar').length).to.eql(2);
      expect(getTokensFrom('> foo\nbar').length).to.eql(2);
      expect(getTokensFrom('~foo~ _123_ *bar* **bazz** __bu\nzz__ `bazzinga`').length).to.eql(12);
    });

    it('should handle checkboxes-like tags', () => {
      expect(getTokensFrom('[x] or [ ]').length).to.eql(5);
    });
  });

  describe('mixed tokens', () => {
    it('should handle units', () => {
      expect(getTokensFrom('1cm', DEFAULT_MAPPINGS).length).to.eql(1);
      expect(getTokensFrom('1 cm', DEFAULT_MAPPINGS).length).to.eql(1);
      expect(getTokensFrom('1 cm3/s', DEFAULT_MAPPINGS).length).to.eql(1);
      expect(getTokensFrom('1 ft-us', DEFAULT_MAPPINGS).length).to.eql(1);
      expect(getTokensFrom('1 undef', DEFAULT_MAPPINGS).length).to.eql(3);
    });

    it('should handle dates', () => {
      expect(getTokensFrom('Jun 10').length).to.eql(1);
      expect(getTokensFrom('Jun, 1987').length).to.eql(1);
      expect(getTokensFrom('Jun 10, 1987').length).to.eql(1);
    });

    it('should handle hours', () => {
      expect(getTokensFrom('200 am', DEFAULT_MAPPINGS).length).to.eql(1);
      expect(getTokensFrom('16:20:00 pm', DEFAULT_MAPPINGS).length).to.eql(1);
    });
  });

  describe('score tokens', () => {
    const sumTokensFrom = x => getTokensFrom(x).reduce((p, c) => p + c.score, 0);

    it('should not rank words', () => {
      expect(sumTokensFrom('foo bar baz')).to.eql(0);
    });

    it('should rank numbers and separators', () => {
      expect(sumTokensFrom('1, 2, 3')).to.eql(15);
    });

    it('should rank symbols and strings', () => {
      expect(sumTokensFrom(':foo "bar baz"')).to.eql(6.5);
    });

    it('should rank comments', () => {
      expect(sumTokensFrom('// foo bar\nbaz buzz')).to.eql(1.5);
      expect(sumTokensFrom('/* foo bar\nbaz */ buzz')).to.eql(1.5);
    });

    it('should rank operators', () => {
      expect(sumTokensFrom('(<= 1 2)')).to.eql(15.5);
    });

    it('should rank definitions', () => {
      expect(sumTokensFrom('x = 1.2 ;')).to.eql(6);
    });
  });
});
