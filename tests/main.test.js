import { expect } from 'chai';
import Solvente from '../src/lib';

const calc = (expr, opts, no) => {
  const x = new Solvente(opts).resolve(expr);
  if (!no && x.error) throw x.error;
  return x;
};

const value = (expr, opts, no) => {
  const c = calc(expr, opts, no);
  const x = c.maths();
  if (!no && c.error) throw c.error;
  return x.map(x => x.format);
}

const toTree = (expr, opts) => calc(expr, opts, true).tree;

describe('DSL', () => {
  describe('Basic math operations', () => {
    it('should handle common errors', () => {
      expect(()=> value('1ml - 1cm')).to.throw(/Cannot convert incompatible measures of volume and length/);
    });

    it('should handle most basic units', () => {
      expect(value('1cm')).to.eql(['1 cm']);
    });

    it('should handle most basic operators', () => {
      expect(value('1+2, 3-4, 5/6, 7*8')).to.eql(['3', '-1', '0.83', '56']);
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
      expect(value(';;;')).to.eql([]);
    });

    it('should apply well-known inflections', () => {
      expect(value('2 weeks as day')).to.eql(['14 days']);
      expect(value('1d')).to.eql(['1 day']);
    });

    it('should skip bad sequences from input', () => {
      expect(value('1 ) 2')).to.eql(['1', '2']);
    });

    it('should handle nested sub-expressions', () => {
      expect(value('1 + ( 2 + ( 3 - 4 ) - 2 )')).to.eql(['0']);
    });

    it('should validate nested sub-expressions', () => {
      expect(() => value('f(n')).to.throw(/Missing terminator/);
      expect(() => value('1+(2+(3-4)-2')).to.throw(/Missing terminator/);
      expect(() => value('1 + ( 2 + ( 3 - 4 ) - 2')).to.throw(/Missing terminator/);
    });

    it('should handle separated sub-expressions', () => {
      expect(value('1 2 or 3 4 or 5 6')).to.eql(['3', '7', '11']);
    });

    it('should add basic operators between numbers', () => {
      expect(value('1 2 3')).to.eql(['6']);
      expect(value('1 - 2 3')).to.eql(['-4']);
      expect(value('1 ( 2 3 )')).to.eql(['6']);
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

    it('should handle fixed-length expressions', () => {
      expect(value('1123foo', { types: [['0000foo', 'cm']] })).to.eql(['1,123 cm']);
    });

    it('should handle local expressions', () => {
      expect(value("x'=1.2;3x'")).to.eql(['3.6']);
    });

    it('should handle external expressions', () => {
      expect(value('2x', { expressions: { x: [['expr', '=', 'equal'], ['number', 1.5], ['expr', ';', 'k']] } })).to.eql(['3']);
    });

    it('should handle number suffixes', () => {
      expect(value('Jun 3rd')).to.eql(['Sun Jun 03 2012 00:00:00']);
      expect(value('Jun 20ty')).to.eql(['Wed Jun 20 2012 00:00:00']);
      expect(value('Jun 4th')).to.eql(['Mon Jun 04 2012 00:00:00']);
      expect(value('Jun 10th')).to.eql(['Sun Jun 10 2012 00:00:00']);
    });

    it('should handle well-known dates', () => {
      expect(value('900am')).to.eql(['Fri Mar 02 2012 09:00:00']);
      expect(value('900 am')).to.eql(['Fri Mar 02 2012 09:00:00']);
      expect(value('9:00 am')).to.eql(['Fri Mar 02 2012 09:00:00']);
      expect(value('now')).to.eql(['Fri Mar 02 2012 11:38:49']);
      expect(value('today')).to.eql(['Fri Mar 02 2012 00:00:00']);
      expect(value('tomorrow')).to.eql(['Sat Mar 03 2012 11:38:49']);
      expect(value('yesterday')).to.eql(['Thu Mar 01 2012 11:38:49']);
    });

    it('should allow ISO dates', () => {
      expect(value('1987-06-10T06:00:00.000Z')).to.eql(['Wed Jun 10 1987 06:00:00']);
    });
  });

  describe('Function application', () => {
    it('should handle local functions', () => {
      expect(value('undef(1,2,3)')).to.eql([]);
      expect(value("f(x',y)=x'*y;f(2, 3)")).to.eql(['6']);
      expect(value("f(x',y)=(x'*y);f(2, 3)")).to.eql(['6']);
      expect(value("f(a,b)=a+b;f1(a',b',c')=a'-f(b',c');f1(1,2,3)")).to.eql(['-4']);
    });

    it.skip('[FIXME] evaluation is failing...', () => {
      expect(value('sum(x,y)=x+y;add5(_)=sum<|5;add5(3)')).to.eql(['8']);
      expect(toTree('add5(_)=sum(5,_);')).to.eql(toTree('add5(_)=sum<|5;'));
      expect(value('sum(x,y)=x+y;add5(_)=sum|>5;always7=add5|>2;always7')).to.eql(['7']);
    });

    it('should handle partial application', () => {
      expect(value('sum(x,y)=x+y;sum(5,3)')).to.eql(['8']);
      expect(toTree('always7=add5<|2;')).to.eql(toTree('always7=add5(2);'));
      expect(toTree('0|>sum 1|>sum 2;')).to.eql(toTree('0|>sum(1)|>sum(2);'));
      expect(toTree('0|>sum 1|>sum(2);')).to.eql(toTree('0|>sum(1)|>sum(2);'));
      expect(value('sum(x,y)=x+y;0|>sum 1|>sum 2')).to.eql(['3']);
      expect(toTree('0|>sum 1 2|>sum(3,4)')).to.eql(toTree('0|>sum(1,2)|>sum 3 4'));
      expect(value('sum(x,y,z)=x+y+z;0|>sum 1 2|>sum 3 4')).to.eql(['10']);

      expect(toTree('0|>sum 1 2 3')).to.eql([
        ['number', '0'],
        ['fx', '|>', 'rpipe'],
        ['def', 'sum', [[['number', '1'], ['expr', ',', 'or'], ['number', '2'], ['expr', ',', 'or'], ['number', '3']]]],
      ]);

      expect(value('sum(a,b,c)=a+b+c;2|>sum 4 6')).to.eql(['12']);
      expect(value('sum(a,b,c)=a+b+c;0<|sum 1 2 3')).to.eql(['3']);
      expect(value('sum(a,b,c)=a+b+c;0<|sum _ 2 3')).to.eql(['5']);
      expect(value('sum(a,b,c)=a+b+c;0<|sum 1 _ 3')).to.eql(['4']);
      expect(value('sum(a,b,c)=a+b+c;0<|sum 1 2 _')).to.eql(['3']);

      expect(toTree('a= b() <| c 1 2;')).to.eql([
        ['def', 'a', [
          ['expr', '=', 'equal'],
          ['def', 'b', [[]]],
          ['fx', '<|', 'lpipe'],
          ['def', 'c', [[['number', '1'], ['expr', ',', 'or'], ['number', '2']]]],
          ['expr', ';', 'k'],
        ]]
      ]);

      expect(toTree('a= b() <| c 1;')).to.eql([
        ['def', 'a', [
          ['expr', '=', 'equal'],
          ['def', 'b', [[]]],
          ['fx', '<|', 'lpipe'],
          ['def', 'c', [[['number', '1']]]],
          ['expr', ';', 'k'],
        ]]
      ]);
    });
  })

  describe('Markdown-like formatting', () => {
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

  describe('Symbols, strings and objects', () => {
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
      expect(toTree(':foo :bar')).to.eql([['symbol', ':foo', [['symbol', ':bar']]]]);
      expect(toTree(':a :b :c')).to.eql([['symbol', ':a', [['symbol', ':b'], ['symbol', ':c']]]]);
      expect(toTree(':a :b "c"')).to.eql([['symbol', ':a', [['symbol', ':b'], ['string', '"c"']]]]);
      expect(toTree('"a" :b :c')).to.eql([['string', '"a"'], ['symbol', ':b', [['symbol', ':c']]]]);
    });

    it('should handle array-like values', () => {
      expect(toTree('[:a]')).to.eql([[['symbol', ':a']]]);
      expect(toTree(':a [:b]')).to.eql([['symbol', ':a'], [['symbol', ':b']]]);
      expect(toTree(':a [:b "c"]')).to.eql([['symbol', ':a'], [['symbol', ':b'], ['string', '"c"']]]);
      expect(toTree('"a" [:b "c"]')).to.eql([['string', '"a"'], [['symbol', ':b'], ['string', '"c"']]]);
    });

    it('should handle object-like values', () => {
      expect(toTree('a[b]')).to.eql([]);
      expect(toTree(':a[b]')).to.eql([['symbol', ':a']]);
      expect(toTree('a[:b]')).to.eql([['unit', 'a'], [['symbol', ':b']]]);
      expect(toTree(':a[:b]')).to.eql([['symbol', ':a'], [['symbol', ':b']]]);
      expect(toTree('a[:b "c"]')).to.eql([['unit', 'a'], [['symbol', ':b'], ['string', '"c"']]]);
      expect(toTree(':a[:b "c"]')).to.eql([['symbol', ':a'], [['symbol', ':b'], ['string', '"c"']]]);
      expect(toTree(':x a[]')).to.eql([['symbol', ':x', ['object', ['unit', 'a', []]]]]);
      expect(toTree(':x a{}')).to.eql([['symbol', ':x', ['object', ['unit', 'a', {}]]]]);
      expect(toTree(':x a[v 2]')).to.eql([['symbol', ':x', ['object', ['unit', 'a', [['unit', 'v'], ['number', '2']]]]]]);
      expect(toTree(':x a[:b c]')).to.eql([['symbol', ':x', ['object', ['unit', 'a', { ':b': [['unit', 'c']] }]]]]);
      expect(toTree(':x a{:b c}')).to.eql([['symbol', ':x', ['object', ['unit', 'a', { ':b': [['unit', 'c']] }]]]]);
      expect(toTree(':x a[:b "c"]')).to.eql([['symbol', ':x', ['object', ['unit', 'a', { ':b': [['string', '"c"']] }]]]]);
      expect(toTree(':x a{:b "c"}')).to.eql([['symbol', ':x', ['object', ['unit', 'a', { ':b': [['string', '"c"']] }]]]]);
    });
  });

  describe('Using :symbols for definitions', () => {
    it('should apply ::symbol-calls', () => {
      expect(toTree(`123::toString(36)`).length).to.eql(3);
      expect(value(`123::toString(36)`)).to.eql(['3f']);
      expect(toTree(`"foo"::toUpperCase(36)`).length).to.eql(3);
      expect(value(`"foo"::toUpperCase(36)`)).to.eql(['FOO']);
    });

    it('should treat symbols as units too', () => {
      expect(value('sum(x,_)=x+_;sum(1,2)')).to.eql(['3']);
      expect(value('sum(x,:y)=x+:y;sum(1,2)')).to.eql(['3']);
    });

    it('should consume all tokens if they are lists', () => {
      expect(toTree(`:set o' 1, 2, 3`)).to.eql([['symbol', ':set', ['object', ['unit', "o'", [['number', '1'], ['number', '2'], ['number', '3']]]]]]);
      expect(toTree(`:set o' 1, 2, 3`).length).to.eql(1);
      expect(toTree(`:set o' {:k v}, 1`).length).to.eql(1);
      expect(toTree(`:set o' :foo "bar"`).length).to.eql(2);
      expect(toTree(`:set o' "foo" "bar"`).length).to.eql(2);

      expect(toTree(`:set buffer head(buffer)::concat tail(buffer)`).length).to.eql(3);
      expect(toTree(`:set buffer "foo" "bar", "baz buzz", "bazzinga"`).length).to.eql(6);
      expect(toTree(`:set buffer "foo", "bar", "baz buzz", "bazzinga"`).length).to.eql(1);

      expect(toTree(`:set headers :content-type "text/html"`).length).to.eql(2);
      expect(toTree(`:set headers "Content-Type" "text/html", "Length: 0"`).length).to.eql(4);
      expect(toTree(`:set headers {:content-type "text/html"}, "Length: 0"`).length).to.eql(1);
      expect(toTree(`:set headers ["Content-Type" "text/html", "Length: 0"]`).length).to.eql(1);
      expect(toTree(`:set headers [{:content-type "text/html"}, "Length: 0"]`).length).to.eql(1);
    });

    it('should consume all tokens if they are ops', () => {
      expect(toTree(':a b { :y d, :k y }')).to.eql([
        ['symbol', ':a', ['object', ['unit', 'b', {
          ':y': [['unit', 'd']],
          ':k': [['unit', 'y']],
        }]]]
      ]);

      expect(toTree(':a b { :x [{ :y d * v / c, :k y } 2] :e 4 }')).to.eql([
        ['symbol', ':a', ['object', ['unit', 'b', {
          ':x': [[
            {
              ':y': [['unit', 'd'], ['expr', '*', 'mul'], ['unit', 'v'], ['expr', '/', 'div'], ['unit', 'c']],
              ':k': [['unit', 'y']],
            },
            ['number', '2'],
          ]],
          ':e': [['number', '4']],
        }]]]
      ]);
    });

    it('should allow mixed structures, like for pattern-matching, if-then-else, etc.', () => {
      expect(toTree(':match x {:test (2 * 4) :whatever 3}')).to.eql([
        ['symbol', ':match', ['object', ['unit', 'x', {
          ':test': [['number', '2'], ['expr', '*', 'mul'], ['number', '4']],
          ':whatever': [['number', '3']],
        }]]],
      ]);

      expect(toTree(':if (== 1 2) :then 3 :else 4')).to.eql([
        ['symbol', ':if'], [['fx', '==', 'iseq'], ['number', '1'], ['number', '2']],
        ['symbol', ':then', ['number', '3']],
        ['symbol', ':else', ['number', '4']],
      ]);

      expect(toTree(':do x')).to.eql([['symbol', ':do', [['unit', 'x']]]]);
      expect(toTree(':do x y z')).to.eql([['symbol', ':do', [['unit', 'x'], ['unit', 'y']]], ['unit', 'z']]);
      expect(toTree(':do x, y')).to.eql([['symbol', ':do', [['unit', 'x']]], ['expr', ',', 'or'], ['unit', 'y']]);
      expect(toTree(':do x ~> y')).to.eql([['symbol', ':do', [['unit', 'x']]], ['fx', '~>', 'void'], ['unit', 'y']]);
      expect(toTree(':do x ~> :null')).to.eql([['symbol', ':do', [['unit', 'x']]], ['fx', '~>', 'void'], ['symbol', null]]);

      expect(toTree(':when (< 1 2) :do a ~> :null, (> 2 1) :do b ~> :false, :otherwise :do c ~> :true')).to.eql([
        ['symbol', ':when'],
        [['fx', '<', 'lt'], ['number', '1'], ['number', '2']],
        ['symbol', ':do', [['unit', 'a']]], ['fx', '~>', 'void'], ['symbol', null], ['expr', ',', 'or'],
        [['fx', '>', 'gt'], ['number', '2'], ['number', '1']],
        ['symbol', ':do', [['unit', 'b']]], ['fx', '~>', 'void'], ['symbol', false], ['expr', ',', 'or'],
        ['symbol', ':otherwise', [['symbol', ':do'], ['unit', 'c']]], ['fx', '~>', 'void'], ['symbol', true]
      ]);

      expect(toTree(':repeat 5 :do 3')).to.eql([['symbol', ':repeat', ['number', '5']], ['symbol', ':do', ['number', '3']]]);
      expect(toTree(':loop 1..3 :do x')).to.eql([['symbol', ':loop'], ['range', '1..3'], ['symbol', ':do', [['unit', 'x']]]]);

      expect(toTree(`:loop c'..f(3) :do x`)).to.eql([
        ['symbol', ':loop', [['unit', "c'"], ['range', '..'], ['def', 'f', [[['number', '3']]]]]],
        ['symbol', ':do', [['unit', 'x']]],
      ]);

      expect(toTree(`:loop x(c')..f(3) :do x`)).to.eql([
        ['symbol', ':loop'],
        ['def', 'x', [[['unit', "c'"]]]],
        ['range', '..'],
        ['def', 'f', [[['number', '3']]]],
        ['symbol', ':do', [['unit', 'x']]],
      ]);

      expect(toTree(`:let i'=0; :while (< i' 3) :do n ~> 2, i'++`)).to.eql([
        ['symbol', ':let'],
        ['def', "i'", [['expr', '=', 'equal'], ['number', '0'], ['expr', ';', 'k']]],
        ['symbol', ':while'], [['fx', '<', 'lt'], ['unit', "i'"], ['number', '3']],
        ['symbol', ':do', [['unit', 'n']]],
        ['fx', '~>', 'void'], ['number', '2'],
        ['expr', ',', 'or'], ['unit', "i'"], ['fx', '++', 'inc'],
      ]);
    });
  });
});
