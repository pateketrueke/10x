import tk from 'timekeeper';
import { expect } from 'chai';
import Solvente from '../src/lib';

const calc = (expr, opts, no) => {
  const x = new Solvente(opts).resolve(expr);
  if (!no && x.error) throw x.error;
  return x;
};

const value = (expr, opts, no) => {
  const c = calc(expr, opts, no);
  const x = c.eval();
  if (!no && c.error) throw c.error;
  return c.format(x);
}

const toTree = (expr, opts) => calc(expr, opts, true).tree;
const toTokens = (expr, opts) => calc(expr, opts, true).tokens.filter(x => x !== null);

const fix = subTree => [subTree.map(x => ({ token: x }))];

const time = new Date(550303200000);

describe('DSL', () => {
  describe('Basic math operations', () => {
    beforeEach(() => {
      tk.freeze(time);
    });

    afterEach(() => {
      tk.reset();
    });

    it('should handle most basic operators', () => {
      expect(value('1+2, 3-4, 5/6, 7*8')).to.eql(['3', '-1', '0.83', '56']);
    });

    it('should handle common errors', () => {
      expect(() => value('1ml - 1cm')).to.throw(/Cannot convert incompatible measures of volume and length/);
      expect(() => value('cm=1.2;')).to.throw(/Cannot override built-in unit/);
    });

    it('should handle most basic units', () => {
      expect(value('1cm')).to.eql(['1 cm']);
    });

    it('should tokenize double-quoted strings', () => {
      expect(toTokens('Foo "bar baz" Buz')[1].token[0]).to.eql('string');
    });

    it('should tokenize symbol-like values', () => {
      expect(toTokens('Foo :bar ::baz-buzz Bazzinga')[1].token[0]).to.eql('symbol');
      expect(toTokens('Foo :bar ::baz-buzz Bazzinga')[3].token[0]).to.eql('text');
    });

    it('should skip empty sub-expressions', () => {
      expect(calc(';;;').eval()).to.eql([]);
    });

    it('should apply well-known inflections', () => {
      expect(value('2 weeks as day')).to.eql(['14 days']);
      expect(value('1d')).to.eql(['1 day']);
    });

    it('should skip bad sequences from input', () => {
      expect(() => value('1 ) 2')).to.throw(/Unexpected end/);
    });

    it('should handle nested sub-expressions', () => {
      expect(value('1 + 2')).to.eql(['3']);
      expect(value('(1 + 2)')).to.eql(['3']);
      expect(value('1 + (2 + 3)')).to.eql(['6']);
      expect(value('(1 + (2 + 3))')).to.eql(['6']);
      expect(value('1 + (2 + (3 + 4))')).to.eql(['10']);
      expect(value('(1 + (2 + (3 + 4)))')).to.eql(['10']);
      expect(value('1 + (2 + (3 - 4) - 2)')).to.eql(['0']);
    });

    it('should validate nested sub-expressions', () => {
      expect(() => value('f(n')).to.throw(/Missing terminator/);
      expect(() => value('1+(2+(3-4)-2')).to.throw(/Missing terminator/);
      expect(() => value('1 + ( 2 + ( 3 - 4 ) - 2')).to.throw(/Missing terminator/);
    });

    it('should handle separated sub-expressions', () => {
      expect(value('1 2 or 3 4 and 5 6')).to.eql(['3', '7', '11']);
    });

    it('should add basic operators between numbers', () => {
      expect(value('1 2 3')).to.eql(['6']);
      expect(value('1 - 2 3')).to.eql(['-4']);
      expect(value('2 ( 3 4 )')).to.eql(['14']);
      expect(value('1 - ( 2 3 )')).to.eql(['-4']);
      expect(value('1 2 3 / 4 5')).to.eql(['8.75']);
    });

    it('should handle converting to fractions', () => {
      expect(value('0.5 as fr')).to.eql(['1/2']);
      expect(value('0.5 as frac')).to.eql(['1/2']);
      expect(value('0.5 as fraction')).to.eql(['1/2']);
      expect(value('0.5 as fractions')).to.eql(['1/2']);
      expect(value('3 from 10 as fr')).to.eql(['30/1']);
      expect(value('3 inches - 2 cm as fr')).to.eql(['221/100 in']);
    });

    it('should handle converting from units', () => {
      expect(value('3cm as inches')).to.eql(['1.18 in']);
    });

    it('should skip converting from currencies', () => {
      expect(value('1 MXN as USD')).to.eql(['1 USD']);
    });

    it('should handle local expressions', () => {
      expect(value("x'=1.2;3x'")).to.eql(['3.6']);
      expect(value("x'=(1.2);3x'")).to.eql(['3.6']);
      expect(value('just1_fix=0.1;2just1_fix')).to.eql(['0.2']);
    });

    it('should handle external expressions', () => {
      expect(value('2x', { expressions: { x: {
        body: [{ token: ['number', 1.5] }],
      } } })).to.eql(['3']);
    });

    it.skip('should handle number suffixes', () => {
      expect(value('Jun 3rd')).to.eql(['Sun Jun 03 2012 00:00:00']);
      expect(value('Jun 20ty')).to.eql(['Wed Jun 20 2012 00:00:00']);
      expect(value('Jun 4th')).to.eql(['Mon Jun 04 2012 00:00:00']);
      expect(value('Jun 10th')).to.eql(['Sun Jun 10 2012 00:00:00']);
    });

    it('should handle well-known dates', () => {
      expect(value('900am')).to.eql(['Wed Jun 10 1987 09:00:00']);
      expect(value('900 am')).to.eql(['Wed Jun 10 1987 09:00:00']);
      expect(value('9:00 am')).to.eql(['Wed Jun 10 1987 09:00:00']);
      // expect(value('now')).to.eql(['Wed Jun 10 1987 11:38:49']);
      // expect(value('today')).to.eql(['Wed Jun 10 1987 00:00:00']);
      // expect(value('tomorrow')).to.eql(['Thu Jun 11 1987 11:38:49']);
      // expect(value('yesterday')).to.eql(['Tue Jun 09 1987 11:38:49']);
    });
  });

  describe('Markdown-like formatting', () => {
    it('should handle code tags', () => {
      expect(toTokens('foo `bar baz` buzz')[1].token[0]).to.eql('code');
      expect(toTokens('foo `bar baz` buzz')[1].token[1]).to.eql('`bar baz`');
    });

    it('should handle del tags', () => {
      expect(toTokens('foo ~bar baz~ buzz')[1].token[0]).to.eql('del');
      expect(toTokens('foo ~bar baz~ buzz')[1].token[1]).to.eql('~bar baz~');
    });

    it('should handle bold tags', () => {
      expect(toTokens('foo **bar baz** buzz')[1].token[0]).to.eql('b');
      expect(toTokens('foo __bar baz__ buzz')[1].token[0]).to.eql('b');
      expect(toTokens('foo __bar baz__ buzz')[1].token[1]).to.eql('__bar baz__');
    });

    it('should handle em tags', () => {
      expect(toTokens('foo _bar baz_ buzz')[1].token[0]).to.eql('em');
      expect(toTokens('foo _bar baz_ buzz')[1].token[1]).to.eql('_bar baz_');
    });

    it('should handle heading tags', () => {
      expect(toTokens('## ~~foo~~ `bar` __baz__ **buzz**')[0].token[0]).to.eql('heading');
      expect(toTokens('## ~~foo~~ `bar` __baz__ **buzz**')[0].token[2]).to.eql(2);
      expect(toTokens('## ~~foo~~ `bar` __baz__ **buzz**')[0].token[1]).to.eql('## ~~foo~~ `bar` __baz__ **buzz**');
    });

    it('should handle blockquote tags', () => {
      expect(toTokens('> ~~foo~~ `bar` __baz__ **buzz**')[0].token[0]).to.eql('blockquote');
      expect(toTokens('> ~~foo~~ `bar` __baz__ **buzz**')[0].token[1]).to.eql('> ~~foo~~ `bar` __baz__ **buzz**');
    });
  });

  describe('Symbols, strings and objects', () => {
    it('should handle symbols and strings', () => {
      expect(toTree(':foo')).to.eql(fix([['symbol', ':foo']]));
      expect(toTree('"foo"')).to.eql(fix([['string', '"foo"']]));
    });

    it('should split strings and symbols', () => {
      expect(toTree(':foo "bar"')).to.eql(fix([['symbol', ':foo'], ['string', '"bar"']]));
      expect(toTree('"foo"')).to.eql(fix([['string', '"foo"']]));
      expect(toTree('"foo" :bar')).to.eql(fix([['string', '"foo"'], ['symbol', ':bar']]));
      expect(toTree('"foo" "bar"')).to.eql(fix([['string', '"foo"'], ['string', '"bar"']]));

      expect(toTree(':a "b" :c')).to.eql(fix([['symbol', ':a'], ['string', '"b"'], ['symbol', ':c']]));
      expect(toTree(':a "b" "c"')).to.eql(fix([['symbol', ':a'], ['string', '"b"'], ['string', '"c"']]));

      expect(toTree('"a" :b "c"')).to.eql(fix([['string', '"a"'], ['symbol', ':b'], ['string', '"c"']]));
      expect(toTree('"a" "b" :c')).to.eql(fix([['string', '"a"'], ['string', '"b"'], ['symbol', ':c']]));
    });

    it('should keep symbols separated', () => {
      expect(toTree(':foo :bar')).to.eql(fix([['symbol', ':foo'], ['symbol', ':bar']]));
      expect(toTree(':a :b :c')).to.eql(fix([['symbol', ':a'], ['symbol', ':b'], ['symbol', ':c']]));
      expect(toTree(':a :b "c"')).to.eql(fix([['symbol', ':a'], ['symbol', ':b'], ['string', '"c"']]));
      expect(toTree('"a" :b :c')).to.eql(fix([['string', '"a"'], ['symbol', ':b'], ['symbol', ':c']]));
    });

    it('should handle tuple-like structures', () => {
      expect(toTree('(:foo "bar")')).to.eql([[{
        token: ['object', {
          ':foo': [{ token: ['string', '"bar"'] }],
        }],
      }]]);
    });
  });
});
