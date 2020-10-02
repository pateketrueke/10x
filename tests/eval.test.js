import { expect } from 'chai';
import { execute as run } from '../src/lib';

import Env from '../src/lib/tree/env';
import Expr from '../src/lib/tree/expr';
import Range from '../src/lib/range';

import { RANGE, LITERAL } from '../src/lib/tree/symbols';

/* global describe, it */

describe('Eval', () => {
  describe('Basics', () => {
    it('should operate simple math', async () => {
      expect(await run('; 1 2 3; 4 (5 6), 7/8')).to.eql([
        Expr.value(6),
        Expr.value(44),
        Expr.frac(7, 8),
      ]);
    });

    it('should operate on fractions', async () => {
      expect(await run('1/2 + 1')).to.eql([Expr.value((1 / 2) + 1)]);
      expect(await run('1/2 + 1')).to.eql([Expr.value((1 / 2) + 1)]);
      expect(await run('1/3 - .1')).to.eql([Expr.value((1 / 3) - 0.1)]);
      expect(await run('1/2 * 3')).to.eql([Expr.value((1 / 2) * 3)]);
      expect(await run('1/3 / 2')).to.eql([Expr.value((1 / 3) / 2)]);
      expect(await run('1/3 % .3')).to.eql([Expr.value((1 / 3) % 0.3)]);

      expect(await run('1/2 + 3/4')).to.eql([Expr.frac(5, 4)]);
      expect(await run('3/4 - 1/2')).to.eql([Expr.frac(1, 4)]);
      expect(await run('1/2 * 3/4')).to.eql([Expr.frac(3, 8)]);
      expect(await run('1/2 / 3/4')).to.eql([Expr.frac(2, 3)]);
      expect(await run('1/4 % 3/4')).to.eql([Expr.frac(1, 4)]);
    });

    it('should resolve boolean/null', async () => {
      expect(await run(':nil')).to.eql([Expr.value(null)]);
      expect(await run(':on')).to.eql([Expr.value(true)]);
      expect(await run(':off')).to.eql([Expr.value(false)]);
    });

    it('should evaluate unary operators', async () => {
      expect(await run('-1')).to.eql([Expr.value(-1)]);
      expect(await run('!0')).to.eql([Expr.value(true)]);
    });

    it('should evaluate symbol expressions', async () => {
      expect(await run(':(3/2)')).to.eql([Expr.symbol(':1.5')]);
      expect(await run(':("nil")')).to.eql([Expr.value(null)]);
      expect(await run(':"1..#{5-3}"')).to.eql([Expr.symbol(':1..2')]);
      expect(await run(':"#{"o#{"n"}"}"')).to.eql([Expr.value(true)]);
      expect(await run(':"#{"o#{"ff"}"}"')).to.eql([Expr.value(false)]);
      expect(await run('foo="o#{"n"}";:"#{foo}"')).to.eql([Expr.value(true)]);
      expect(await run(':foo + "bar"')).to.eql([Expr.value('foobar')]);
      expect(await run('"foo" + :bar')).to.eql([Expr.value('foobar')]);
      expect(await run('"foo#{:bar}"')).to.eql([Expr.value('foobar')]);
      expect(await run(':(:on ? :ok | :no)')).to.eql([Expr.symbol(':ok')]);
    });

    it('should evaluate if-then-else operators', async () => {
      expect(await run('0 | 2')).to.eql([Expr.value(2)]);
      expect(await run('1 | 2')).to.eql([Expr.value(1)]);
      expect(await run(':on ? 42 | -1')).to.eql([Expr.value(42)]);
      expect(await run(':off ? 42 | -1')).to.eql([Expr.value(-1)]);
    });

    it('should not evaluate comments', async () => {
      expect(await run('21*// x\n2')).to.eql([Expr.value(42)]);
    });

    it('should allow variables', async () => {
      expect(await run('a=1;a')).to.eql([Expr.value(1)]);
      expect(await run('a=1 2;a')).to.eql([Expr.value(3)]);
    });

    it('should invoke definitions', async () => {
      expect(await run('x=3; 3x')).to.eql([Expr.value(9)]);
      expect(await run('a=b->1+b;a(3)')).to.eql([Expr.value(4)]);
      expect(await run('a=b{1+b};a(3)')).to.eql([Expr.value(4)]);
      expect(await run('sum=a,b{a+b};sum(3,5)')).to.eql([Expr.value(8)]);
      expect(await run('x=42;x;\n//\n(0)')).to.eql([Expr.value(42), Expr.value(0)]);
    });

    it('should allow string concatenation/interpolation', async () => {
      expect(await run('"foo" + "bar"')).to.eql([Expr.value('foobar')]);
      expect(await run('x=42; y="#{x}."; y')).to.eql([Expr.value('42.')]);
      expect(await run('bar=42; "foo#{bar}"')).to.eql([Expr.value('foo42')]);
    });

    it('should format strings through mod-operator', async () => {
      expect(await run('"Test: {} {} {} {}" % (1, :nil, :on, :off)')).to.eql([Expr.value('Test: 1 :nil :on :off')]);
      expect(await run('"Test: #{env}" % (:env "VALUE")')).to.eql([Expr.value('Test: VALUE')]);
      expect(await run('"Test: {1} {0}" % [1, 2]')).to.eql([Expr.value('Test: 2 1')]);
      expect(await run('x="OK: #{y}";d=:y 42;x%d')).to.eql([Expr.value('OK: 42')]);
    });

    it('should use plain-objects as context through mod-operator', async () => {
      Env.resolve = source => ({
        Test: { z: { y: { t: 42 } } },
      })[source];

      expect(await run(':import z :from "Test"; "x: #{y.t}" % z')).to.eql([Expr.value('x: 42')]);
    });

    it('should allow access through dot-operator', async () => {
      expect(await run('[].length')).to.eql([Expr.value(0)]);
      expect(await run('"foo".length')).to.eql([Expr.value(3)]);
      expect(await run('data = :nested (:value 42); data.nested.value')).to.eql([Expr.value(42)]);
      expect(await run('data = :foo "bar" "buzz"; data.foo')).to.eql([Expr.value('bar'), Expr.value('buzz')]);
      expect(await run('data = :foo ("bar" "buzz"); data.foo')).to.eql([Expr.value('bar'), Expr.value('buzz')]);
    });

    it('should call existing methods through dot-operator', async () => {
      expect(await run('twice=x->x*2; 1.twice')).to.eql([Expr.value(2)]);
    });

    it('should allow access through range & symbol', async () => {
      expect(await run('user = :name "John", "Doe"; [user]:("name")')).to.eql([
        Expr.body([Expr.value('John'), Expr.value('Doe')]),
      ]);

      expect(await run('[:nil, []]:1')).to.eql([]);
      expect(await run('["foo"]:0')).to.eql([Expr.value('f')]);

      expect(await run('[("foo", "bar")].join(" ")')).to.eql([Expr.value('foo bar')]);
      expect(await run('["foo", "bar"].join(" ")')).to.eql([Expr.value('foo bar')]);
      expect(await run('[("foo", "bar")].join(" ")')).to.eql([Expr.value('foo bar')]);

      expect(await run('[:t 42]:t')).to.eql([Expr.body([Expr.value(42)])]);
      expect(await run('[:t 42]:(:t)')).to.eql([Expr.body([Expr.value(42)])]);
      expect(await run('[:t 42]:"#{:t}"')).to.eql([Expr.body([Expr.value(42)])]);

      expect(await run('[[:k 1, 2]:k]')).to.eql([Expr.array([Expr.value(1), Expr.value(2)])]);
    });

    it.skip('should allow to set props through dot-operator', async () => {
      Env.resolve = source => ({
        Test: { obj: { nested: { t: 42 } } },
      })[source];

      expect(await run(':import obj :from "Test"; obj.nested.t = 43; obj.nested.t')).to.eql([Expr.value(43)]);

      expect(await run('data=:t 42; data.t = 43; data.t')).to.eql([Expr.value(43)]);
      expect(await run('data=(:nested (:t 42)); data.nested.t = 43; data.nested.t')).to.eql([Expr.value(43)]);
      expect(await run('data=:t 42; data.t = 1,2,3; data.t')).to.eql([Expr.value(1), Expr.value(2), Expr.value(3)]);
    });

    it('should allow to call methods through dot-operator', async () => {
      const nested = { t() { return this; } };

      Env.resolve = source => ({
        Test: {
          obj: {
            nested,
            fn: x => x * 2,
            call: fn => fn(21),
            undef: () => undefined,
          },
          anonymous: {
            get: x => () => x,
          },
        },
      })[source];

      expect(await run(':import obj :from "Test"; x=obj.undef; x()')).to.eql([]);
      expect(await run(':import obj :from "Test"; x=obj.fn; x(1)')).to.eql([Expr.value(2)]);
      expect(await run(':import obj :from "Test"; obj.nested.t()')).to.eql([Expr.value(nested)]);
      expect(await run(':import obj :from "Test"; fn=obj.undef; obj.call(fn)')).to.eql([]);
      expect(await run(':import obj :from "Test"; obj.call(x -> x * 2)')).to.eql([Expr.value(42)]);
      expect(await run(':import obj :from "Test"; fn=x->:if (> 0 x) :on; obj.call(fn)')).to.eql([]);
      expect(await run(':import anonymous :from "Test"; fn=anonymous.get(-42); fn()')).to.eql([Expr.value(-42)]);
    });

    it('should allow to call methods through pipe-operator', async () => {
      Env.resolve = source => ({
        Test: { obj: { nested: { f: n => n * 2 } } },
      })[source];

      expect(await run(':import obj :from "Test"; 21 |> obj.nested.f')).to.eql([Expr.value(42)]);
      expect(await run(':import obj :from "Test"; 21 |> obj.nested.f(1) + 2')).to.eql([Expr.value(44)]);
    });

    it('should detect classes/functions and use new-operator on them', async () => {
      Env.resolve = source => ({
        TestClass: class TestClass {
          constructor(value, ...opts) {
            this.value = value;
            this.opts = opts;
          }
          truth() {
            return this.value;
          }
        },
        testFunction: (value, ...opts) => {
          return { value, opts };
        },
      })[source];

      expect(await run(':import (:default F) :from "TestClass"; :let c = F(42, 1, 2, 3); [c.truth(), c.opts]')).to.eql([
        Expr.value([42, [1, 2, 3]]),
      ]);

      expect(await run(':import (:default f) :from "testFunction"; :let c = f(42, 1, 2, 3); c.value')).to.eql([
        Expr.value(42),
      ]);
    });

    it('should allow to invoke def-props', async () => {
      expect(await run('Math=:sum(a,b->a+b);Math.sum(2,3)')).to.eql([Expr.value(5)]);
      expect(await run('sum=a,b->a+b;Math=:sum sum;Math.sum(5,3)')).to.eql([Expr.value(8)]);
    });

    it('should keep outer context safe', async () => {
      expect(await run('a=4;(a=1.2;a*2),(a=3;a*2);a')).to.eql([
        Expr.value(2.4),
        Expr.value(6),
        Expr.value(4),
      ]);
    });

    it('should handle lists of values', async () => {
      expect(await run('a=1;b=a;c=b;a,b,c')).to.eql([
        Expr.value(1),
        Expr.value(1),
        Expr.value(1),
      ]);
    });

    it('should evaluate from arrays', async () => {
      expect(await run('a=2;b=4;c=5; [1, a], 3, [b, [c]]')).to.eql([
        Expr.array([Expr.value(1), Expr.value(2)]),
        Expr.value(3),
        Expr.array([Expr.value(4), Expr.array([Expr.value(5)])]),
      ]);
    });

    it('should evaluate from arguments', async () => {
      expect(await run('sum=a -> b -> a + b; sum(1, 1.5 * 2)')).to.eql([Expr.value(4)]);
    });

    it('should evaluate from anonymous functions', async () => {
      expect(await run('fun=f->f();fun(-> 42)')).to.eql([Expr.value(42)]);
      expect(await run('fun=_,f->f();fun(1,-> 42)')).to.eql([Expr.value(42)]);
    });
  });

  describe('Mappings', () => {
    it('should be able to build maps on-the-fly', async () => {
      expect(await run(':a :b, :c, :d')).to.eql([
        Expr.map({ a: Expr.body([Expr.symbol(':b')]) }),
        Expr.symbol(':c'),
        Expr.symbol(':d'),
      ]);

      expect(await run(':a :b, :c 42')).to.eql([
        Expr.map({ a: Expr.body([Expr.symbol(':b')]), c: Expr.body([Expr.value(42)]) }),
      ]);

      expect(await run(':a :b, (:c 42)')).to.eql([
        Expr.map({
          a: Expr.body([
            Expr.symbol(':b'),
            Expr.tuple([Expr.map({ c: Expr.body([Expr.value(42)]) })]),
          ]),
        }),
      ]);

      expect(await run('(:a :b), :c 42')).to.eql([
        Expr.map({ a: Expr.body([Expr.symbol(':b')]) }),
        Expr.map({ c: Expr.body([Expr.value(42)]) }),
      ]);

      expect(await run(':"#{"foo"}" ("bar" 42) . foo')).to.eql([
        Expr.value('bar'),
        Expr.value(42),
      ]);

      expect(await run(':"#{"foo"}" "bar"; 42')).to.eql([Expr.map({
        foo: Expr.body([Expr.value('bar')]),
      }), Expr.value(42)]);

      expect(await run(':"#{"foo"}" "bar", 42')).to.eql([Expr.map({
        foo: Expr.body([Expr.value('bar'), Expr.value(42)]),
      })]);

      expect(await run(':"#{"foo"}" "bar" 42')).to.eql([Expr.map({
        foo: Expr.body([Expr.value('bar'), Expr.value(42)]),
      })]);

      expect(await run(':"#{"foo"}" "bar" . foo')).to.eql([Expr.value('bar')]);

      expect(await run(':"#{"foo"}" "bar", 42 :"#{"baz"}" "buzz"')).to.eql([Expr.map({
        foo: Expr.body([Expr.value('bar'), Expr.value(42)]),
        baz: Expr.body([Expr.value('buzz')]),
      })]);

      expect(await run('fn=x->x;fn(:foo "bar").foo')).to.eql([Expr.value('bar')]);
    });
  });

  describe('Functions', () => {
    it('should evaluate lambda expressions', async () => {
      expect(await run('x=->42;x()')).to.eql([Expr.value(42)]);
      expect(await run('sum=a->b->a+b; sum(3, 4);')).to.eql([Expr.value(7)]);
    });

    it('should carry given arguments as scope', async () => {
      expect(await run('f = n -> (m -> m + n); f(1)(2);')).to.eql([Expr.value(3)]);
    });

    it('should allow partial application', async () => {
      expect(await run('sum=a->b->a+b;sum(1,2)')).to.eql([Expr.value(3)]);
      expect(await run('sum=a->b->a+b;add3=sum(3);add3(5)')).to.eql([Expr.value(8)]);
      expect(await run('div=a->b->a/b;div2=div(2);div2(1)')).to.eql([Expr.value(2)]);
    });

    it('should allow application of operator-calls', async () => {
      expect(await run('(1+)(2)')).to.eql([Expr.value(3)]);
      expect(await run('(3/)(4)')).to.eql([Expr.value(0.75)]);
      expect(await run('add=x->x+; add3=add(3); add3(5)')).to.eql([Expr.value(8)]);
      expect(await run('div=x->x/; div2=div(2); div2(3)')).to.eql([Expr.value(0.6666666666666666)]);
    });

    it.skip('should apply values through pipe-operator', async () => {
      expect(await run('4|>n->n*2')).to.eql([Expr.value(8)]);
      expect(await run('fn=->42;0|>fn|>fn|>fn|>fn')).to.eql([Expr.value(42)]);
      expect(await run('sum=a->b->a+b; -3 |> sum(5) + 4 |> sum(9)')).to.eql([Expr.value(15)]);
      expect(await run('sum=a->b->a+b; twice = n -> n |> sum(n); twice(3)')).to.eql([Expr.value(6)]);
      expect(await run('fn=a,b->a+b(a);3|>fn()(n -> n * 2)')).to.eql([Expr.value(9)]);
      expect(await run('fn=a,b->a+b(a);3|>fn(n -> n * 2)')).to.eql([Expr.value(9)]);
    });

    it('should allow to bind nested definitions', async () => {
      expect(await run('sum=a->b->a+b;add3=sum(3);just8=add3(5);just8')).to.eql([Expr.value(8)]);
    });

    it('should allow to use _ as placeholder', async () => {
      expect(await run('div=a->b->a/b;div2=div(_, 2);div2(1)')).to.eql([Expr.value(0.5)]);
      expect(await run('test=a,b,c->a+b+c;fix=test("?","B",_);fix("X")')).to.eql([Expr.value('?BX')]);
      expect(await run('test=a,b,c->a+b+c;fix=test(_,"B",_);fix("X","Y")')).to.eql([Expr.value('XBY')]);
    });

    it('should resolve callees from any expression', async () => {
      expect(await run('x=1;(((((x)))));')).to.eql([Expr.value(1)]);
      expect(await run('fn=->42; sum=fn; sum()')).to.eql([Expr.value(42)]);
      expect(await run('pi=3.1416; x=pi * 2.5; x;')).to.eql([Expr.value(7.854)]);
      expect(await run('truth=fn->fn(42); truth(x->x)')).to.eql([Expr.value(42)]);
      expect(await run('sum=a->b->a+b; (((((sum)))))(1, 2);')).to.eql([Expr.value(3)]);
      expect(await run('addPair=a->b->a+b; identity=a->a; identity(addPair)(1, 2);')).to.eql([Expr.value(3)]);
      expect(await run('addPair=a->b->a+b; identity=a->a; fn=identity(addPair); fn(1, 2);')).to.eql([Expr.value(3)]);
    });

    it('should allow to use definitions as binary-operators', async () => {
      const env = new Env();

      expect(await run('adds = a, b -> a + b;', env)).to.eql([]);
      expect(await run('1 adds (5 / (2 - 4))', env)).to.eql([Expr.value(-1.5)]);

      expect(await run('infix = a, b -> a + "_" + b; "FOO" infix "BAR"')).to.eql([Expr.value('FOO_BAR')]);
    });

    it('should not mutate arguments from bound-calls', async () => {
      expect(await run('div = n -> d -> (= n % d 0); fn=div(2); fn(1), div(3)(2); div(4, 2)')).to.eql([
        Expr.value(true),
        Expr.value(false),
        Expr.value(true),
      ]);
    });

    it.skip('should allow to call through mod-operator', async () => {
      expect(await run('sum=a,b->a+b; sum % :a 3 :b 5')).to.eql([Expr.value(8)]);
    });
  });

  describe('Logic', () => {
    it('should evaluate from logical operators', async () => {
      expect(await run('(! 1 "2")')).to.eql([Expr.value(true)]);
      expect(await run('(! 1 "1")')).to.eql([Expr.value(false)]);
      expect(await run('(= 1 "1")')).to.eql([Expr.value(true)]);
      expect(await run('(== 1 2)')).to.eql([Expr.value(false)]);
      expect(await run('(!= 1 2)')).to.eql([Expr.value(true)]);
      expect(await run('(!= 1 "1")')).to.eql([Expr.value(true)]);
      expect(await run('(<= 1 2)')).to.eql([Expr.value(true)]);
      expect(await run('(> 1 2)')).to.eql([Expr.value(false)]);
      expect(await run('(> 1 (2/.5))')).to.eql([Expr.value(false)]);
      expect(await run('(= 4 % 2 0)')).to.eql([Expr.value(true)]);
      expect(await run('(? (5 - 5) (0 -1) 3)')).to.eql([Expr.value(true)]);
      expect(await run('($ (5 - 5) (0 -1) 3)')).to.eql([Expr.value(false)]);
      expect(await run('(= [1,2] [1,2])')).to.eql([Expr.value(true)]);
      expect(await run('(= /^x/ "xyz")')).to.eql([Expr.value(true)]);
      expect(await run('(! "abc" /x/)')).to.eql([Expr.value(true)]);
      expect(await run('(== [1,2] [1,2,3])')).to.eql([Expr.value(false)]);
      expect(await run('(== (:t 42) (:t 42))')).to.eql([Expr.value(true)]);
      expect(await run('(== (:t 42) (:t 43))')).to.eql([Expr.value(false)]);
      expect(await run('(== (:t 42) (:t 42, :y 0))')).to.eql([Expr.value(false)]);
      expect(await run('(== [1,"2",:x "y"] [1,2,3,:a "b","c"])')).to.eql([Expr.value(false)]);
    });

    it('should test for inclusion through the like-operator', async () => {
      expect(await run('(~ 2 1)')).to.eql([Expr.value(false)]);
      expect(await run('(~ :nil 2)')).to.eql([Expr.value(false)]);
      expect(await run('(~ "abc" "a")')).to.eql([Expr.value(true)]);
      expect(await run('(~ [1, 2, 3] 4)')).to.eql([Expr.value(false)]);
      expect(await run('(~ (:x 1 :y 2) :z)')).to.eql([Expr.value(false)]);
      expect(await run('(~ [1, 2, 3] [2, 3])')).to.eql([Expr.value(true)]);
      expect(await run('(~ (:x 1 :y 2) [:x, :y])')).to.eql([Expr.value(true)]);
    });

    it('should by-pass checks when placeholder is given', async () => {
      expect(await run('(= [1, 2, 3] [1, _, 3])')).to.eql([Expr.value(true)]);
      expect(await run('(= (:foo "BAR") (:foo _))')).to.eql([Expr.value(true)]);
    });

    it('should skip additional items/properties on weak-mode', async () => {
      expect(await run('(= [1, 2, 3] [1, 2])')).to.eql([Expr.value(true)]);
      expect(await run('(= (:foo "bar") (:foo "bar" :x "y"))')).to.eql([Expr.value(true)]);
    });

    it.skip('should allow to rewrite syntax with templates', async () => {
      expect(await run(`
        :template
          ~ (a -> :let a = a + 1);

        x = 1;
        y = -1;

        1, ~y;
      `)).to.eql([Expr.value(1), Expr.value(0)]);

      expect(await run(`
        :template += (a, b -> :let a = a + b);
        :template *= (a, b -> :let a = a * b);

        i = 0; i += 2; i *= 3; i
      `)).to.eql([Expr.value(6)]);

      expect(await run(`
        :template
          >> (a, b -> a + b),
          fun (a -> "Fun: #{a}");

        fun("osoms");
        2 >> 4;
      `)).to.eql([Expr.value('Fun: osoms'), Expr.value(6)]);

      expect(await run(`
        :template
          <=> (a, b -> (!= a b));

        [:if (1 <=> 2) 42; 2 <=> 2; (<= 1 2)]
      `)).to.eql([Expr.array([Expr.value(42), Expr.value(false), Expr.value(true)])]);

      expect(await run(`
        :template
          /= (a, b -> :let a = a / b);

        j = :k 42; j.k /= 2; j.k
      `)).to.eql([Expr.value(21)]);

      expect(await run(`
        :template ++ (a -> :let a = a + 1);
        c = :d 42; d = 0;
        a = 0; b = 0; a++, ++b, ++c.d, (> ++d 0)
      `)).to.eql([Expr.value(0), Expr.value(1), Expr.value(43), Expr.value(true)]);
    });

    it('should let you mutate definitions', async () => {
      expect(await run('i = 0; :let i = i + 1; i')).to.eql([Expr.value(1)]);
      expect(await run('x = 6; :let x = x / 2; x')).to.eql([Expr.value(3)]);
      expect(await run('x = 1.5; :let x = x * 3; x')).to.eql([Expr.value(4.5)]);
      expect(await run('z = 1; i = 0; :let i = i + z; i')).to.eql([Expr.value(1)]);
      expect(await run('fun = n -> n; i = 0; :let i = i + fun(2 * 3) / 2; i')).to.eql([Expr.value(3)]);
      expect(await run('x = 0; :if (< 1 2) (:let x = x + 3; x); x')).to.eql([Expr.value(3), Expr.value(3)]);
      expect(await run(':let x = 0 :if (< 1 2) (:let x = x + 3; x); x')).to.eql([Expr.value(3), Expr.value(3)]);
    });

    it('should resolve from conditional mappings', async () => {
      expect(await run(':if (!:nil) 42')).to.eql([Expr.value(42)]);
      expect(await run(':if (:off) _')).to.eql([]);
      expect(await run(':if (:off) _')).to.eql([]);
      expect(await run(':if (:on) :off')).to.eql([Expr.value(false)]);
      expect(await run(':if (< 1 2) "X" :else "Y"')).to.eql([Expr.value('X')]);
      expect(await run(':if (< 2 1) "X" :else "Y"')).to.eql([Expr.value('Y')]);
      expect(await run('f = x -> :if (>= x 3) "_" :else "."; f(1), f(2), f(3), f(4)')).to.eql([
        Expr.value('.'),
        Expr.value('.'),
        Expr.value('_'),
        Expr.value('_'),
      ]);
    });

    it('should evaluate from if-do-let mappings', async () => {
      expect(await run(':let x=3 :if (> x 0) (x = x - 1); x')).to.eql([Expr.value(2)]);
      expect(await run(':let n=3 :while (> n 0) :do (n = n - 1; n + 1)')).to.eql([
        Expr.value(3),
        Expr.value(2),
        Expr.value(1),
      ]);
    });
  });

  describe('Match', () => {
    it.skip('should allow simple pattern-matching through equality', async () => {
      expect(await run(':match 1 1 42')).to.eql([Expr.value(42)]);
      expect(await run(':match (2) (4, 3..2) 42 :else 0')).to.eql([Expr.value(42)]);
    });

    it.skip('should check values for inclusion through range-expressions', async () => {
      expect(await run(':match 2 [1..3] 42')).to.eql([Expr.value(42)]);
      expect(await run(':match 2 (1..3) 42')).to.eql([Expr.value(42)]);
    });

    it.skip('should check values for comparison through logical-expressions', async () => {
      expect(await run(':match 1 (< 2) 42')).to.eql([Expr.value(42)]);
      expect(await run(':match 1 (= 2) 42 :else 0')).to.eql([Expr.value(0)]);
    });

    it.skip('should compare values if they are lists, mappings or mixed-tokens', async () => {
      expect(await run(':match [1, 2, 3] [1, 2, 3] 42')).to.eql([Expr.value(42)]);
      expect(await run(':if (:match (:foo "bar") (:foo "bar") :on) "OK"')).to.eql([Expr.value('OK')]);
    });

    it.skip('should try to evaluate from all given conditions', async () => {
      expect(await run(':match (:x (:y 42)) 1 2, 3 4 | 0')).to.eql([Expr.value(0)]);
    });
  });

  describe('Rescue', () => {
    it('should return nothing on failure', async () => {
      expect(await run(':rescue x')).to.eql([]);
      expect(await run(':rescue x | 0')).to.eql([Expr.value(0)]);
    });

    it('should return statement otherwise', async () => {
      expect(await run(':rescue 1')).to.eql([Expr.value(1)]);
    });

    it('should return :rescue on try-presence', async () => {
      expect(await run(':try x :rescue 0')).to.eql([Expr.value(0)]);
      expect(await run(':try 1 :rescue 0')).to.eql([Expr.value(1)]);
    });

    it.skip('should :check statements as failure-constraints', async () => {
      expect(await run(':try x :rescue x -> 42')).to.eql([Expr.value(42)]);
      expect(await run(':try x :rescue (> 1 2) 3')).to.eql([]);
      expect(await run(':try x :rescue -> (> 1 2) 3')).to.eql([]);

      expect(await run(`
        attempts = 0;
        server = :is_connected 1;
        :try
          server.connect()
        :check
          server.is_connected
        :rescue
          (< attempts 10)
            (:let attempts = attempts + 1);
        attempts;
      `)).to.eql([Expr.value(10)]);
    });

    it.skip('should resolve from :try :rescue if :check evaluates to true', async () => {
      expect(await run(`
        enabled = :off;
        :try x
        :check enabled
        :rescue (!enabled) (
          :let enabled = :on;
        ) | enabled;
      `)).to.eql([Expr.value(true)]);
    });
  });

  describe('Ranges', () => {
    it.skip('should spread arguments on calls', async () => {
      expect(await run(`
        div=a,b->a/b;
        div2=div(2,..);
        div2(4);
        div2'=div(..,2);
        div2'(4);
      `)).to.eql([Expr.value(0.5), Expr.value(2)]);

      expect(await run(`
        try=a, b, .. -> [a, b, ..];
        try(1, 2, 3, 4, 5);
      `)).to.eql([Expr.value([1, 2, 3, 4, 5])]);
    });

    it('should expand from ranges into arrays', async () => {
      expect(await run('1..3')).to.eql([Expr.array([
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
      ])]);

      expect(await run('-3..0')).to.eql([Expr.array([
        Expr.value(-3),
        Expr.value(-2),
        Expr.value(-1),
        Expr.value(0),
      ])]);
    });

    it('should allow consecutive values', async () => {
      expect(await run('[1,2];[3,4]')).to.eql([
        Expr.array([Expr.value(1), Expr.value(2)]),
        Expr.array([Expr.value(3), Expr.value(4)]),
      ]);
    });

    it('should allow to take nth-items', async () => {
      expect(await run('0..3:2')).to.eql([Expr.value(0), Expr.value(1)]);
      expect(await run('(0..3:2)')).to.eql([Expr.value(0), Expr.value(1)]);
    });

    it('should evaluate any expression', async () => {
      expect(await run('test=n->n-2; 0..test(3)')).to.eql([
        Expr.array([Expr.value(0), Expr.value(1)]),
      ]);

      expect(await run('test=n->n-2; 0..(test(3) + 1)')).to.eql([
        Expr.array([Expr.value(0), Expr.value(1), Expr.value(2)]),
      ]);
    });

    it('should use lazy-ranges on arrays', async () => {
      expect(await run('[-10..10:5-3]')).to.eql([
        Expr.array([Expr.from(RANGE, Range.from(-10, 10, 5, 3))]),
      ]);

      expect(await run('([-1..1], [2..3:1])')).to.eql([
        Expr.array([Expr.from(RANGE, Range.from(-1, 1))]),
        Expr.array([Expr.from(RANGE, Range.from(2, 3, 1))]),
      ]);
    });

    it('should configure access on lazy-ranges', async () => {
      expect(await run('[1..3 ::]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3))])]);
      expect(await run('[1..3 :1]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1))])]);
      expect(await run('[1..3 :1-2]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2))])]);
      expect(await run('[1..3 :1 :2]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2))])]);
      expect(await run('[1..3 : :1]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, null, 1))])]);
      expect(await run('[1..3 :1-2 :3]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2, 3))])]);
      expect(await run('[1..3 :1 :2 :3]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2, 3))])]);
      expect(await run('[1..3 :: :1]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, null, 1))])]);
      expect(await run('[1..3 :1 :2 :3..4]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2, 3, 4))])]);
      expect(await run('[1..3 :: :-5..-2]')).to.eql([Expr.array([Expr.from(RANGE, Range.from(1, 3, null, null, -5, 3))])]);
    });

    it('should evaluate lazy-ranges on access', async () => {
      expect(await run('[-3..0]:')).to.eql([Expr.value(-3), Expr.value(-2), Expr.value(-1), Expr.value(0)]);
      expect(await run('[1..3]:-1')).to.eql([Expr.value(3)]);
      expect(await run('[1..10]:-1')).to.eql([Expr.value(10)]);
      expect(await run('[1..10]:(2-3)')).to.eql([Expr.value(10)]);

      expect(await run('[-3..0]:-2')).to.eql([Expr.value(-1)]);
      expect(await run('[-3..0]:-2..2')).to.eql([Expr.value(-1), Expr.value(0)]);
      expect(await run('[-3..3]:-5..3')).to.eql([Expr.value(-1), Expr.value(0), Expr.value(1)]);
      expect(await run('[-10..10]:-5..3')).to.eql([Expr.value(6), Expr.value(7), Expr.value(8)]);

      expect(await run('[1..10]:0')).to.eql([Expr.value(1)]);
      expect(await run('[1..10]:-5..-2')).to.eql([Expr.value(6), Expr.value(7), Expr.value(8)]);
      expect(await run('["A".."F"]:1..3')).to.eql([Expr.value('B'), Expr.value('C'), Expr.value('D')]);
    });

    it.skip('should expand any value within loops', async () => {
      expect(await run(':loop 0..3:2')).to.eql([Expr.value(0), Expr.value(1)]);
      expect(await run(':loop (0..3:2)')).to.eql([Expr.value(0), Expr.value(1)]);
      expect(await run(':loop ("OK")')).to.eql([Expr.value('O'), Expr.value('K')]);

      expect(await run(':loop [-10..10:5-3]'))
        .to.eql([Expr.value(-10), Expr.value(-7), Expr.value(-4), Expr.value(-1), Expr.value(2)]);

      expect(await run(':loop ([-10..10:5-3])'))
        .to.eql([Expr.value(-10), Expr.value(-7), Expr.value(-4), Expr.value(-1), Expr.value(2)]);

      expect(await run(':loop (1, (2, (3)), 4)')).to.eql([
        Expr.value(1),
        Expr.value(1),
        Expr.value(2),
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
        Expr.value(4),
      ]);

      expect(await run(':loop (3, [4, 5], 5..3, "a".."c", "OSOM")')).to.eql([
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
        Expr.value(4),
        Expr.value(5),
        Expr.value(5),
        Expr.value(4),
        Expr.value(3),
        Expr.value('a'),
        Expr.value('b'),
        Expr.value('c'),
        Expr.value('O'),
        Expr.value('S'),
        Expr.value('O'),
        Expr.value('M'),
      ]);
    });

    it('should yield from arguments on block-less loops', async () => {
      expect(await run('x=1; y=[4,5,6,7]; :loop x, y, 3')).to.eql([
        Expr.value(1),
        Expr.value(4),
        Expr.value(5),
        Expr.value(6),
        Expr.value(7),
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
      ]);
    });

    it.skip('should take the first literal as iterator-index', async () => {
      expect(await run('x=[1, 2, 3]; :loop (x) i * 2')).to.eql([
        Expr.value(2),
        Expr.value(4),
        Expr.value(6),
      ]);
    });

    it.skip('should discard first literal from body if block is given', async () => {
      expect(await run('x=[1, 2, 3]; :loop (x) i (i * 2)')).to.eql([
        Expr.value(2),
        Expr.value(4),
        Expr.value(6),
      ]);
    });

    it.skip('should evaluate from given blocks as functions', async () => {
      expect(await run(':loop(1..3) x -> x * 2')).to.eql([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });

    it.skip('should evaluate from given strings as functions', async () => {
      expect(await run(':loop(1..3) x "#{x * 2}"')).to.eql([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });

    it.skip('should evaluate iterator-index if it is a function', async () => {
      expect(await run('thrice=fn->:loop(1..3) fn; thrice(x->x*2)')).to.eql([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });

    it.skip('should allow calls after iterator-index', async () => {
      expect(await run('thrice=fn->:loop(1..3) x fn(x); thrice(x->x*2)')).to.eql([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });
  });

  describe('Modules', () => {
    it('should allow to call methods from native objects', async () => {
      expect(await run(':import concat :from "Array"; concat([1,2], [3, [4]])')).to.eql([
        Expr.array([Expr.value(1), Expr.value(2), Expr.value(3), Expr.array([Expr.value(4)])]),
      ]);

      expect(await run(':import (:toFixed d) :from "Number"; d(0.1234, 2)')).to.eql([Expr.value('0.12')]);

      expect(await run(':import entries :from "Object"; entries(:foo "bar")')).to.eql([Expr.array([
        Expr.array([Expr.value('foo'), Expr.value('bar')]),
      ])]);

      expect(await run(':import concat :from "Array"; concat(1..2,3);')).to.eql([
        Expr.array([Expr.value(1), Expr.value(2), Expr.value(3)]),
      ]);

      expect(await run(':import concat :from "Array"; a=concat(-1..2,3,4); a')).to.eql([
        Expr.array([Expr.value(-1), Expr.value(0), Expr.value(1), Expr.value(2), Expr.value(3), Expr.value(4)]),
      ]);
    });

    it.skip('should require to use range-operator to spread given args', async () => {
      expect(await run(`
        :import (:substr s, concat) :from "String";
        test=concat("foo",..);
        test'=x->concat(x,"foo");
        test(s("_bar", 1), "!");
        test(42);
        test'(0);
      `)).to.eql([Expr.value('foobar!'), Expr.value('foo42'), Expr.value('0foo')]);
    });

    it.skip('should allow to import from external sources', async () => {
      const env = new Env();

      await run('thrice = n -> n * 3; sum = a, b -> a + b;', env);

      Env.resolve = source => ({
        './example.js': require('./fixtures/example'),
        './other.x': env,
      })[source];

      expect(await run(`
        :import wait, twice :from "./example.js";
        :import sum, thrice :from "./other.x";

        twice(21);
        thrice(9);
        wait.skip(200);
        fix=sum(3);
        fix(5);
      `)).to.eql([Expr.value(42), Expr.value(27), Expr.value(8)]);
    });

    it('should allow to export specific definitions', async () => {
      const env = new Env();

      await run(`
        :module "Test" :export (:sum s);
        sum = a, b -> a + b;
      `, env);

      Env.resolve = source => ({
        './other.x': env,
      })[source];

      expect(await run(`
        :import (:s sum) :from "./other.x";

        fix=sum(3);
        fix(5);
      `)).to.eql([Expr.value(8)]);
    });

    it('should keep arguments through FFI calls', async () => {
      Env.resolve = source => ({
        Test: { f: (...args) => ({ args }) },
      })[source];

      expect(await run(':import f :from "Test"; f(:number, :n, "OK")')).to.eql([Expr.value({
        args: ['number', 'n', 'OK'],
      })]);

      expect(await run(`
        :import f :from "Test";
        f([(:type :multiselect, :name :color, :message "Pick colors", :choices [(:title "Red", :value "#FF0000")])])
      `)).to.eql([Expr.from(LITERAL, {
        args: [[{
          choices: [{
            args: [Expr.value({
              title: Expr.body([Expr.value('Red')]),
              value: Expr.body([Expr.value('#FF0000')]),
            })],
          }],
          message: 'Pick colors',
          name: 'color',
          type: 'multiselect',
        }]],
      })]);
    });
  });

  describe('Advanced', () => {
    it('should allow recursion, e.g. factorial', async () => {
      expect(await run(`
        fact = n ->
          (< n 1) ? 1 | n * fact(n - 1);
        fact(5);
      `)).to.eql([Expr.value(120)]);
    });

    it('should perform memoization on marked calls, e.g. fibonacci!', async () => {
      expect(await run(`
        fib = n ->
          :if (< n 2) 1, (< n 1) 0
          :else fib(n - 1) + fib(n - 2);
        fib!(20);
      `)).to.eql([Expr.value(10946)]);
    });

    it('should allow while-loops to collect from calculations, e.g. fibonacci', async () => {
      const start2 = Date.now();

      expect(await run(`
        :template
          += (a, b -> :let a = a + b),
          -- (a -> :let a = a - 1);

        fib = n ->
          :let
            a = 1, b = 0, temp = 0
          :while (>= n-- 0)
            temp = a, a += b, b = temp, b
          ;
        fib(20)
      `)).to.eql([
        Expr.value(1),
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
        Expr.value(5),
        Expr.value(8),
        Expr.value(13),
        Expr.value(21),
        Expr.value(34),
        Expr.value(55),
        Expr.value(89),
        Expr.value(144),
        Expr.value(233),
        Expr.value(377),
        Expr.value(610),
        Expr.value(987),
        Expr.value(1597),
        Expr.value(2584),
        Expr.value(4181),
        Expr.value(6765),
        Expr.value(10946),
      ]);

      if (process.env.CI) expect((Date.now() - start2) / 1000).to.be.below(0.01);
    });

    it('should allow to implement Y-combinator', async () => {
      expect(await run(`
        Y = f -> (x -> x(x))(g -> f(y -> g(g)(y)));
        fn = fact -> (n -> ((< n 2) ? 1 | n * fact(n - 1)));
        Y(fn)(5);
      `)).to.eql([Expr.value(120)]);
    });
  });
});
