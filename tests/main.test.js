import { expect } from 'chai';
import Solvente from '../src/lib';

const calc = (expr, opts) => new Solvente(opts).resolve(expr);
const value = ({ results }) => results.map(x => x.format);
const toTree = (expr, opts) => calc(expr, opts).tree;

describe('DSL', () => {
  describe('Basic operations', () => {
    it('should handle common errors', () => {
       expect(calc('1ml - 1cm').error.message).to.eql('Cannot convert incompatible measures of volume and length');
    });

    it('should handle most basic units', () => {
      expect(value(calc('1cm'))).to.eql(['1 cm']);
    });

    it('should handle most basic operators', () => {
      expect(value(calc('1+2, 3-4, 5/6, 7*8'))).to.eql(['3', '-1', '0.83', '56']);
    });

    it('should handle some logical operators', () => {
      expect(calc('<= >= == != !~ =~ -- ++ < > = && |> <|').tokens.filter(x => x[1] !== ' ').map(x => x[2]))
        .to.eql(['lteq', 'gteq', 'iseq', 'noteq', 'notlike', 'like', 'dec', 'inc', 'lt', 'gt', 'equal', 'and', 'rpipe', 'lpipe']);
    });

    it('should tokenize double-quoted strings', () => {
      expect(calc('Foo "bar baz" Buz').tokens[2][0]).to.eql('string');
    });

    it('should tokenize symbol-like values', () => {
      expect(calc('Foo :bar ::baz-buzz Bazzinga').tokens[2][0]).to.eql('symbol');
      expect(calc('Foo :bar ::baz-buzz Bazzinga').tokens[4][0]).to.eql('symbol');
    });

    it('should skip empty sub-expressions', () => {
      expect(calc(';;;').results).to.eql([]);
    });

    it('should apply well-known inflections', () => {
      expect(value(calc('2 weeks as day'))).to.eql(['14 days']);
      expect(value(calc('1d'))).to.eql(['1 day']);
    });

    it('should skip bad sequences from input', () => {
      expect(value(calc('1 ) 2'))).to.eql(['1', '2']);
    });

    it('should handle nested sub-expressions', () => {
      expect(value(calc('1 + ( 2 + ( 3 - 4 ) - 2 )'))).to.eql(['0']);
    });

    it('should validate nested sub-expressions', () => {
      expect(calc('f(n').error.message).to.match(/Missing terminator for `\(n`/);
      expect(calc('1+(2+(3-4)-2').error.message).to.match(/Missing terminator for `1\+\(`/);
      expect(calc('1 + ( 2 + ( 3 - 4 ) - 2').error.message).to.match(/Missing terminator for `1 \+ \(`/);
    });

    it('should handle separated sub-expressions', () => {
      expect(value(calc('1 2 or 3 4 or 5 6'))).to.eql(['3', '7', '11']);
    });

    it('should add basic operators between numbers', () => {
      expect(value(calc('1 2 3'))).to.eql(['6']);
      expect(value(calc('1 - 2 3'))).to.eql(['-4']);
      expect(value(calc('1 ( 2 3 )'))).to.eql(['6']);
      expect(value(calc('1 - ( 2 3 )'))).to.eql(['-4']);
      expect(value(calc('1 2 3 / 4 5'))).to.eql(['8.75']);
    });

    it('should handle converting to fractions', () => {
      expect(value(calc('0.5 as fr'))).to.eql(['1/2']);
      expect(value(calc('0.5 as frac'))).to.eql(['1/2']);
      expect(value(calc('0.5 as fraction'))).to.eql(['1/2']);
      expect(value(calc('0.5 as fractions'))).to.eql(['1/2']);
      expect(value(calc('3 from 10 as fr'))).to.eql(['30/1']);
      expect(value(calc('3 inches - 2 cm as fr'))).to.eql(['221/100 in']);
    });

    it('should handle converting from units', () => {
      expect(value(calc('3cm as inches'))).to.eql(['1.18 in']);
    });

    it('should skip converting from currencies', () => {
      expect(value(calc('1 MXN as USD'))).to.eql(['1 USD']);
    });

    it('should handle fixed-length expressions', () => {
      expect(value(calc('1123foo', { types: [['0000foo', 'cm']] }))).to.eql(['1,123 cm']);
    });

    it('should handle local functions', () => {
      expect(calc('undef(1,2,3)').results).to.eql([]);
      expect(value(calc("f(x',y)=x'*y;f(2, 3)"))).to.eql(['6']);
      expect(value(calc("f(x',y)=(x'*y);f(2, 3)"))).to.eql(['6']);
      expect(value(calc("f(a,b)=a+b;f1(a',b',c')=a'-f(b',c');f1(1,2,3)"))).to.eql(['-4']);
    });

    it('should handle local expressions', () => {
      expect(value(calc("x'=1.2;3x'"))).to.eql(['3.6']);
    });

    it('should handle external expressions', () => {
      expect(value(calc('2x', { expressions: { x: [['expr', '=', 'equal'], ['number', 1.5], ['expr', ';', 'k']] } }))).to.eql(['3']);
    });

    it('should handle number suffixes', () => {
      expect(value(calc('Jun 3rd'))).to.eql(['Sun Jun 03 2012 00:00:00']);
      expect(value(calc('Jun 20ty'))).to.eql(['Wed Jun 20 2012 00:00:00']);
      expect(value(calc('Jun 4th'))).to.eql(['Mon Jun 04 2012 00:00:00']);
      expect(value(calc('Jun 10th'))).to.eql(['Sun Jun 10 2012 00:00:00']);
    });

    it('should handle well-known dates', () => {
      expect(value(calc('900am'))).to.eql(['Fri Mar 02 2012 09:00:00']);
      expect(value(calc('900 am'))).to.eql(['Fri Mar 02 2012 09:00:00']);
      expect(value(calc('9:00 am'))).to.eql(['Fri Mar 02 2012 09:00:00']);
      expect(value(calc('now'))).to.eql(['Fri Mar 02 2012 11:38:49']);
      expect(value(calc('today'))).to.eql(['Fri Mar 02 2012 00:00:00']);
      expect(value(calc('tomorrow'))).to.eql(['Sat Mar 03 2012 11:38:49']);
      expect(value(calc('yesterday'))).to.eql(['Thu Mar 01 2012 11:38:49']);
    });

    it('should allow ISO dates', () => {
      expect(value(calc('1987-06-10T06:00:00.000Z'))).to.eql(['Wed Jun 10 1987 06:00:00']);
    });
  });

  describe('Formatting', () => {
    it('should handle code tags', () => {
      expect(calc('foo `bar baz` buzz').tokens[2][0]).to.eql('code');
      expect(calc('foo `bar baz` buzz').tokens[2][1]).to.eql('`bar baz`');
    });

    it('should handle del tags', () => {
      expect(calc('foo ~bar baz~ buzz').tokens[2][0]).to.eql('del');
      expect(calc('foo ~bar baz~ buzz').tokens[2][1]).to.eql('~bar baz~');
    });

    it('should handle bold tags', () => {
      expect(calc('foo **bar baz** buzz').tokens[2][0]).to.eql('b');
      expect(calc('foo __bar baz__ buzz').tokens[2][1]).to.eql('__bar baz__');
    });

    it('should handle em tags', () => {
      expect(calc('foo _bar baz_ buzz').tokens[2][0]).to.eql('em');
      expect(calc('foo _bar baz_ buzz').tokens[2][1]).to.eql('_bar baz_');
    });

    it('should handle heading tags', () => {
      expect(calc('## ~~foo~~ `bar` __baz__ **buzz**').tokens[0][0]).to.eql('heading');
      expect(calc('## ~~foo~~ `bar` __baz__ **buzz**').tokens[0][2]).to.eql(2);
      expect(calc('## ~~foo~~ `bar` __baz__ **buzz**').tokens[0][1]).to.eql('## ~~foo~~ `bar` __baz__ **buzz**');
    });

    it('should handle blockquote tags', () => {
      expect(calc('> ~~foo~~ `bar` __baz__ **buzz**').tokens[0][0]).to.eql('blockquote');
      expect(calc('> ~~foo~~ `bar` __baz__ **buzz**').tokens[0][1]).to.eql('> ~~foo~~ `bar` __baz__ **buzz**');
    });
  });

  describe.only('Tokenizer', () => {
    it('should handle symbols and strings', () => {
      expect(toTree(':foo')).to.eql([['symbol', ':foo']]);
      expect(toTree('"foo"')).to.eql([['string', '"foo"']]);
    });

    it('should split strings and symbols', () => {
      expect(toTree(':foo "bar"')).to.eql([['symbol', ':foo'], ['string', '"bar"']]);
      expect(toTree('"foo"')).to.eql([['string', '"foo"']]);
      expect(toTree('"foo" :bar')).to.eql([['string', '"foo"'], ['symbol', ':bar']]);
      expect(toTree('"foo" "bar"')).to.eql([['string', '"foo"'], ['string', '"bar"']]);

      expect(toTree(':a "b" :c')).to.eql([['symbol', ':a'], ['string', '"b"'], ['symbol', ':c']]);
      expect(toTree(':a "b" "c"')).to.eql([['symbol', ':a'], ['string', '"b"'], ['string', '"c"']]);

      expect(toTree('"a" :b "c"')).to.eql([['string', '"a"'], ['symbol', ':b'], ['string', '"c"']]);
      expect(toTree('"a" "b" :c')).to.eql([['string', '"a"'], ['string', '"b"'], ['symbol', ':c']]);
    });

    it('should keep symbols together', () => {
      expect(toTree(':foo :bar')).to.eql([['symbol', ':foo', [['symbol', ':bar'], []]]]);
      expect(toTree(':a :b :c')).to.eql([['symbol', ':a', [['symbol', ':b'], ['symbol', ':c']]]]);
      expect(toTree(':a :b "c"')).to.eql([['symbol', ':a', [['symbol', ':b'], ['string', '"c"']]]]);
      expect(toTree('"a" :b :c')).to.eql([['string', '"a"'], ['symbol', ':b', [['symbol', ':c'], []]]]);
    });

    it('should handle array-like values', () => {
      expect(toTree('[:a]')).to.eql([[['symbol', ':a']]]);
      expect(toTree(':a [:b]')).to.eql([['symbol', ':a'], [['symbol', ':b']]]);
      expect(toTree(':a [:b "c"]')).to.eql([['symbol', ':a'], [['symbol', ':b'], ['string', '"c"']]]);
      expect(toTree('"a" [:b "c"]')).to.eql([['string', '"a"'], [['symbol', ':b'], ['string', '"c"']]]);
    });

    it('should handle array-like values', () => {
      expect(toTree('a[b]')).to.eql([]);
      expect(toTree(':a[b]')).to.eql([['symbol', ':a']]);
      expect(toTree('a[:b]')).to.eql([['unit', 'a'], [['symbol', ':b']]]);
      expect(toTree(':a[:b]')).to.eql([['symbol', ':a'], [['symbol', ':b']]]);
      expect(toTree('a[:b "c"]')).to.eql([['unit', 'a'], [['symbol', ':b'], ['string', '"c"']]]);
      expect(toTree(':a[:b "c"]')).to.eql([['symbol', ':a'], [['symbol', ':b'], ['string', '"c"']]]);
    });

    it('should handle object-like values', () => {
      expect(calc(':x a[:b "c"]').tree).to.eql([['symbol', ':x', ['object', ['unit', 'a', { b: ['string', '"c"'] }]]]]);
      expect(calc(':x a{:b "c"}').tree).to.eql([['symbol', ':x', ['object', ['unit', 'a', { b: ['string', '"c"'] }]]]]);
    });
  });
});
