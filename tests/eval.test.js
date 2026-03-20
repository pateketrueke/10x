import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { execute as run } from '../src/lib';

import Env from '../src/lib/tree/env';
import Expr from '../src/lib/tree/expr';
import Range from '../src/lib/range';
import { failWith } from './helpers';

import { RANGE, LITERAL } from '../src/lib/tree/symbols';

describe('Eval', () => {
  describe('Basics', () => {
    test('should operate simple math', async () => {
      expect(await run('1 2 3.\n4 (5 6), 7/8')).toEqual([
        Expr.value(6),
        Expr.value(44),
        Expr.frac(7, 8),
      ]);
    });

    test('should operate on fractions', async () => {
      expect(await run('1/2 + 1')).toEqual([Expr.value((1 / 2) + 1)]);
      expect(await run('1/2 + 1')).toEqual([Expr.value((1 / 2) + 1)]);
      expect(await run('1/3 - 0.1')).toEqual([Expr.value((1 / 3) - 0.1)]);
      expect(await run('1/2 * 3')).toEqual([Expr.value((1 / 2) * 3)]);
      expect(await run('1/3 / 2')).toEqual([Expr.value((1 / 3) / 2)]);
      expect(await run('1/3 % 0.3')).toEqual([Expr.value((1 / 3) % 0.3)]);

      expect(await run('1/2 + 3/4')).toEqual([Expr.frac(5, 4)]);
      expect(await run('3/4 - 1/2')).toEqual([Expr.frac(1, 4)]);
      expect(await run('1/2 * 3/4')).toEqual([Expr.frac(3, 8)]);
      expect(await run('1/2 / 3/4')).toEqual([Expr.frac(2, 3)]);
      expect(await run('1/4 % 3/4')).toEqual([Expr.frac(1, 4)]);
    });

    test('should resolve boolean/null', async () => {
      expect(await run(':nil')).toEqual([Expr.value(null)]);
      expect(await run(':on')).toEqual([Expr.value(true)]);
      expect(await run(':off')).toEqual([Expr.value(false)]);
    });

    test('should evaluate unary operators', async () => {
      expect(await run('-1')).toEqual([Expr.value(-1)]);
      expect(await run('!0')).toEqual([Expr.value(true)]);
    });

    test('should evaluate symbol expressions', async () => {
      expect(await run(':(3/2)')).toEqual([Expr.symbol(':1.5')]);
      expect(await run(':("nil")')).toEqual([Expr.value(null)]);
      expect(await run(':"1..#{5-3}"')).toEqual([Expr.symbol(':1..2')]);
      expect(await run(':"#{"o#{"n"}"}"')).toEqual([Expr.value(true)]);
      expect(await run(':"#{"o#{"ff"}"}"')).toEqual([Expr.value(false)]);
      expect(await run('foo="o#{"n"}".\n:"#{foo}"')).toEqual([Expr.value(true)]);
      expect(await run(':foo + "bar"')).toEqual([Expr.value('foobar')]);
      expect(await run('"foo" + :bar')).toEqual([Expr.value('foobar')]);
      expect(await run('"foo#{:bar}"')).toEqual([Expr.value('foobar')]);
      expect(await run(':(:on ? :ok | :no)')).toEqual([Expr.symbol(':ok')]);
    });

    test('should evaluate if-then-else operators', async () => {
      expect(await run('0 | 2')).toEqual([Expr.value(2)]);
      expect(await run('1 | 2')).toEqual([Expr.value(1)]);
      expect(await run(':on ? 42 | -1')).toEqual([Expr.value(42)]);
      expect(await run(':off ? 42 | -1')).toEqual([Expr.value(-1)]);
      expect(await run('@if (:off) 0 @else @do (x = 99.\nx)')).toEqual([Expr.value(99)]);
      expect(await run('@if (:on) "yes" @else @do (x = 42.\nx)')).toEqual([Expr.value('yes')]);
    });

    test('should not evaluate comments', async () => {
      expect(await run('21*// x\n2')).toEqual([Expr.value(42)]);
    });

    test('should allow variables', async () => {
      expect(await run('a=1.\na')).toEqual([Expr.value(1)]);
      expect(await run('a=1 2.\na')).toEqual([Expr.value(3)]);
    });

    test('should store binding type annotations without affecting runtime', async () => {
      const env = new Env();
      expect(await run('a :: num.\na=1.\na', env)).toEqual([Expr.value(1)]);
      expect(env.getAnnotation('a')).toEqual('num');
    });

    test('should invoke definitions', async () => {
      expect(await run('x=3.\n3x')).toEqual([Expr.value(9)]);
      expect(await run('a=b->1+b.\na(3)')).toEqual([Expr.value(4)]);
      expect(await run('x=42.\nx.\n\n//\n(0)')).toEqual([Expr.value(42), Expr.value(0)]);
    });

    test('should allow string concatenation/interpolation', async () => {
      expect(await run('"foo" + "bar"')).toEqual([Expr.value('foobar')]);
      expect(await run('x=42.\ny="#{x}.".\ny')).toEqual([Expr.value('42.')]);
      expect(await run('bar=42.\n"foo#{bar}"')).toEqual([Expr.value('foo42')]);
    });

    test('should support tag values and callable tag composition', async () => {
      expect(await run('<div />')).toEqual([
        Expr.tag({
          name: 'div',
          attrs: {},
          children: [],
          selfClosing: true,
        }),
      ]);

      expect(await run(`
        @import render @from "Prelude".
        box = <div class="a" />.
        render(box((:id "main"), "ok")).
      `)).toEqual([Expr.value('<div class="a" id="main">ok</div>')]);
    });

    test('should evaluate tag expressions and component tags', async () => {
      expect(await run(`
        @import render @from "Prelude".
        x = 2.
        render(<div n={x}>{x + 1}</div>).
      `)).toEqual([Expr.value('<div n="2">3</div>')]);

      expect(await run(`
        @import render @from "Prelude".
        Box = props -> <div class={props.kind} />.
        render(<Box kind={"ok"} />).
      `)).toEqual([Expr.value('<div class="ok" />')]);

      expect(await run(`
        @import render @from "Prelude".
        view = -> <span>ok</span>.
        render(<div>{@render view()}</div>).
      `)).toEqual([Expr.value('<div><span>ok</span></div>')]);

      expect(await run(`
        @import render @from "Prelude".
        props = (:id "x", :class "from-spread").
        render(<div {...props} class="fixed" />).
      `)).toEqual([Expr.value('<div id="x" class="fixed" />')]);
    });

    test('should evaluate markdown text buffers as strings', async () => {
      const env = new Env();
      env.set('x', { body: [Expr.value(2)] });

      expect(await run('hello #{x}.', env)).toEqual([Expr.value('hello 2.')]);
      expect(await run('# title #{x}.', env)).toEqual([Expr.value('# title 2.')]);
      expect(await run('> quote #{x}.', env)).toEqual([Expr.value('> quote 2.')]);
    });

    test('should format strings through mod-operator', async () => {
      expect(await run('"Test: {} {} {} {}" % (1, :nil, :on, :off)')).toEqual([Expr.value('Test: 1 :nil :on :off')]);
      expect(await run('"Test: #{env}" % (:env "VALUE")')).toEqual([Expr.value('Test: VALUE')]);
      expect(await run('"Test: {1} {0}" % [1, 2]')).toEqual([Expr.value('Test: 2 1')]);
      expect(await run('x="OK: #{y}".\nd=:y 42.\nx%d')).toEqual([Expr.value('OK: 42')]);
    });

    test('should use plain-objects as context through mod-operator', async () => {
      Env.resolve = source => ({
        Test: { z: { y: { t: 42 } } },
      })[source];

      expect(await run('@import z @from "Test".\n"x: #{y.t}" % z')).toEqual([Expr.value('x: 42')]);
    });

    test('should allow access through dot-operator', async () => {
      expect(await run('[].length')).toEqual([Expr.value(0)]);
      expect(await run('"foo".length')).toEqual([Expr.value(3)]);
      expect(await run('data = :nested (:value 42).\ndata.nested.value')).toEqual([Expr.value(42)]);
      expect(await run('data = :foo "bar" "buzz".\ndata.foo')).toEqual([Expr.value('bar'), Expr.value('buzz')]);
      expect(await run('data = :foo ("bar" "buzz").\ndata.foo')).toEqual([Expr.value('bar'), Expr.value('buzz')]);
    });

    test('should call existing methods through dot-operator', async () => {
      expect(await run('twice=x->x*2.\n1.twice')).toEqual([Expr.value(2)]);
    });

    test('should allow access through range & symbol', async () => {
      expect(await run('user = :name "John", "Doe".\n[user]:("name")')).toEqual([
        Expr.body([Expr.value('John'), Expr.value('Doe')]),
      ]);

      expect(await run('[:nil, []]:1')).toEqual([]);
      expect(await run('["foo"]:0')).toEqual([Expr.value('f')]);

      expect(await run('[("foo", "bar")].join(" ")')).toEqual([Expr.value('foo bar')]);
      expect(await run('["foo", "bar"].join(" ")')).toEqual([Expr.value('foo bar')]);
      expect(await run('[("foo", "bar")].join(" ")')).toEqual([Expr.value('foo bar')]);

      expect(await run('[:t 42]:t')).toEqual([Expr.body([Expr.value(42)])]);
      expect(await run('[:t 42]:(:t)')).toEqual([Expr.body([Expr.value(42)])]);
      expect(await run('[:t 42]:"#{:t}"')).toEqual([Expr.body([Expr.value(42)])]);

      expect(await run('[[:k 1, 2]:k]')).toEqual([Expr.array([Expr.value(1), Expr.value(2)])]);
    });

    test('should allow to set props through dot-operator', async () => {
      Env.resolve = source => ({
        Test: { obj: { nested: { t: 42 } } },
      })[source];

      expect(await run('@import obj @from "Test".\nobj.nested.t = 43.\nobj.nested.t')).toEqual([Expr.value(43)]);

      expect(await run('data=:t 42.\ndata.t = 43.\ndata.t')).toEqual([Expr.value(43)]);
      expect(await run('data=(:nested (:t 42)).\ndata.nested.t = 43.\ndata.nested.t')).toEqual([Expr.value(43)]);
      expect(await run('data=:t 42.\ndata.t = 1,2,3.\ndata.t')).toEqual([Expr.value(1), Expr.value(2), Expr.value(3)]);
    });

    test('should allow to call methods through dot-operator', async () => {
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

      expect(await run('@import obj @from "Test".\nx=obj.undef.\nx()')).toEqual([]);
      expect(await run('@import obj @from "Test".\nx=obj.fn.\nx(1)')).toEqual([Expr.value(2)]);
      expect(await run('@import obj @from "Test".\nobj.nested.t()')).toEqual([Expr.value(nested)]);
      expect(await run('@import obj @from "Test".\nfn=obj.undef.\nobj.call(fn)')).toEqual([]);
      expect(await run('@import obj @from "Test".\nobj.call(x -> x * 2)')).toEqual([Expr.value(42)]);
      expect(await run('@import obj @from "Test".\nfn=x->@if (> 0 x) :on.\nobj.call(fn)')).toEqual([]);
      expect(await run('@import anonymous @from "Test".\nfn=anonymous.get(-42).\nfn()')).toEqual([Expr.value(-42)]);
    });

    test('should allow to call methods through pipe-operator', async () => {
      Env.resolve = source => ({
        Test: { obj: { nested: { f: n => n * 2 } } },
      })[source];

      expect(await run('@import obj @from "Test".\n21 |> obj.nested.f')).toEqual([Expr.value(42)]);
      expect(await run('@import obj @from "Test".\n21 |> obj.nested.f(1) + 2')).toEqual([Expr.value(44)]);
    });

    test('should detect classes/functions and use new-operator on them', async () => {
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

      expect(await run('@import (:default F) @from "TestClass".\n@let c = F(42, 1, 2, 3).\n[c.truth(), c.opts]')).toEqual([
        Expr.value([42, [1, 2, 3]]),
      ]);

      expect(await run('@import (:default f) @from "testFunction".\n@let c = f(42, 1, 2, 3).\nc.value')).toEqual([
        Expr.value(42),
      ]);
    });

    test('should allow to invoke def-props', async () => {
      expect(await run('Math=:sum((a b) -> a+b).\nMath.sum(2,3)')).toEqual([Expr.value(5)]);
      expect(await run('sum=(a b) -> a+b.\nMath=:sum sum.\nMath.sum(5,3)')).toEqual([Expr.value(8)]);
    });

    test('should keep outer context safe', async () => {
      expect(await run('a=4.\n(a=1.2.\na*2),(a=3.\na*2).\na')).toEqual([
        Expr.value(2.4),
        Expr.value(6),
        Expr.value(4),
      ]);
    });

    test('should handle lists of values', async () => {
      expect(await run('a=1.\nb=a.\nc=b.\na,b,c')).toEqual([
        Expr.value(1),
        Expr.value(1),
        Expr.value(1),
      ]);
    });

    test('should evaluate from arrays', async () => {
      expect(await run('a=2.\nb=4.\nc=5.\n[1, a], 3, [b, [c]]')).toEqual([
        Expr.array([Expr.value(1), Expr.value(2)]),
        Expr.value(3),
        Expr.array([Expr.value(4), Expr.array([Expr.value(5)])]),
      ]);
    });

    test('should evaluate from arguments', async () => {
      expect(await run('sum=a -> b -> a + b.\nsum(1, 1.5 * 2)')).toEqual([Expr.value(4)]);
    });

    test('should evaluate from anonymous functions', async () => {
      expect(await run('fun=f->f().\nfun(-> 42)')).toEqual([Expr.value(42)]);
      expect(await run('fun=(_ f) -> f().\nfun(1,-> 42)')).toEqual([Expr.value(42)]);
    });
  });

  describe('Mappings', () => {
    test('should be able to build maps on-the-fly', async () => {
      expect(await run(':a :b, :c, :d')).toEqual([
        Expr.map({ a: Expr.body([Expr.symbol(':b')]) }),
        Expr.symbol(':c'),
        Expr.symbol(':d'),
      ]);

      expect(await run(':a :b, :c 42')).toEqual([
        Expr.map({ a: Expr.body([Expr.symbol(':b')]), c: Expr.body([Expr.value(42)]) }),
      ]);

      expect(await run(':a :b, (:c 42)')).toEqual([
        Expr.map({
          a: Expr.body([
            Expr.symbol(':b'),
            Expr.group([Expr.map({ c: Expr.body([Expr.value(42)]) })]),
          ]),
        }),
      ]);

      expect(await run('(:a :b), :c 42')).toEqual([
        Expr.map({ a: Expr.body([Expr.symbol(':b')]) }),
        Expr.map({ c: Expr.body([Expr.value(42)]) }),
      ]);

      expect(await run(':"#{"foo"}" ("bar" 42) . foo')).toEqual([
        Expr.value('bar'),
        Expr.value(42),
      ]);

      expect(await run(':"#{"foo"}" "bar".\n42')).toEqual([Expr.map({
        foo: Expr.body([Expr.value('bar')]),
      }), Expr.value(42)]);

      expect(await run(':"#{"foo"}" "bar", 42')).toEqual([Expr.map({
        foo: Expr.body([Expr.value('bar'), Expr.value(42)]),
      })]);

      expect(await run(':"#{"foo"}" "bar" 42')).toEqual([Expr.map({
        foo: Expr.body([Expr.value('bar'), Expr.value(42)]),
      })]);

      expect(await run(':"#{"foo"}" "bar" . foo')).toEqual([Expr.value('bar')]);

      expect(await run(':"#{"foo"}" "bar", 42 :"#{"baz"}" "buzz"')).toEqual([Expr.map({
        foo: Expr.body([Expr.value('bar'), Expr.value(42)]),
        baz: Expr.body([Expr.value('buzz')]),
      })]);

      expect(await run('fn=x->x.\nfn(:foo "bar").foo')).toEqual([Expr.value('bar')]);
    });

    test('should support JSON-style string keys and record merge', async () => {
      expect(await run('{"name": "Alice", "age": 30}.name')).toEqual([Expr.value('Alice')]);
      expect(await run('{:a 1} | {"b": 2}')).toEqual([Expr.map({
        a: Expr.body([Expr.value(1)]),
        b: Expr.body([Expr.value(2)]),
      })]);
      expect(await run('{"a": 1} | {:a 2}')).toEqual([Expr.map({
        a: Expr.body([Expr.value(2)]),
      })]);
    });
  });

  describe('Result', () => {
    test('should build and unwrap @ok/@err values with ?', async () => {
      expect(await run('(@ok 42) ? 0')).toEqual([Expr.value(42)]);
      expect(await run('(@err "boom") ? 0')).toEqual([Expr.value(0)]);
      expect(await run('(@ok 5) ? 0 |> (x -> x * 2)')).toEqual([Expr.value(10)]);
      expect(await run('(@err "boom") ? 0 |> (x -> x * 2)')).toEqual([Expr.value(0)]);
    });

    test('should allow matching Result values by :ok/:err tag', async () => {
      expect(await run('@match (@ok 1) (:ok) 42, (:err) 0')).toEqual([Expr.value(42)]);
      expect(await run('@match (@err "x") (:ok) 42, (:err) 0')).toEqual([Expr.value(0)]);
    });
  });

  describe('Markdown Native', () => {
    test('should evaluate heading namespaces with dot access', async () => {
      expect(await run('# Math::\npi=3.\narea=r->pi*r*r.\nMath.area(2)')).toEqual([Expr.value(12)]);
    });

    test('should evaluate markdown tables as list-of-records', async () => {
      expect(await run(`
        @import head @from "Prelude".
        people = (
| name | age |
|------|-----|
| Alice | 30 |
| Bob | 25 |
        ).
        head(people).age
      `)).toEqual([Expr.value(30)]);
    });

    test('should evaluate standalone markdown links as imports', async () => {
      const resolve = Env.resolve;

      try {
        Env.resolve = source => {
          if (source === './utils.md') {
            return { utils: { format: input => `ok:${input}` } };
          }
          return null;
        };

        expect(await run('[utils](./utils.md)\nutils.format("x")')).toEqual([Expr.value('ok:x')]);
      } finally {
        Env.resolve = resolve;
      }
    });

    test('should ignore prose-like markdown elements without interpolation', async () => {
      expect(await run('x = 1.\n---\nx.')).toEqual([Expr.value(1)]);
      expect(await run('x = 1.\n> A note.\nx.')).toEqual([Expr.value(1)]);
      expect(await run('x = 1.\n- A bullet.\nx.')).toEqual([Expr.value(1)]);
      expect(await run('x = 1.\n1. Ordered.\nx.')).toEqual([Expr.value(1)]);
      expect(await run('Some prose.\n\nx = 1.\nx.')).toEqual([Expr.value(1)]);
      expect(await run('Hello (world).\n\nx = 1.\nx.')).toEqual([Expr.value(1)]);
    });

    test('should keep standalone markdown table separated from following code', async () => {
      const tableDoc = '| a | b |\n|---|---|\n| 1 | 2 |\n\nx = 1.\nx.';

      expect(await run(tableDoc)).toEqual([
        Expr.array([
          Expr.map({
            a: Expr.body([Expr.value(1)]),
            b: Expr.body([Expr.value(2)]),
          }),
        ]),
        Expr.value(1),
      ]);
    });

    test('should import exported templates from markdown links on demand', async () => {
      const resolve = Env.resolve;
      const moduleEnv = new Env();
      const scope = new Env();

      try {
        await run(`
          @module "Ops" @export ops.
          @export @template >>.
          ops = -> :on.
          @template >> ((a b) -> (!= a b)).
        `, moduleEnv);

        Env.resolve = source => {
          if (source === './ops.md') return moduleEnv;
          return null;
        };

        await run('[ops, @template >>](./ops.md)', scope);
        expect(await run('1 >> 2.', scope)).toEqual([Expr.value(true)]);
      } finally {
        Env.resolve = resolve;
      }
    });

    test('should import all exported templates from markdown links', async () => {
      const resolve = Env.resolve;
      const moduleEnv = new Env();
      const scope = new Env();

      try {
        await run(`
          @module "Ops" @export ops.
          @export @template >>.
          ops = -> :on.
          @template >> ((a b) -> (!= a b)).
        `, moduleEnv);

        Env.resolve = source => {
          if (source === './ops.md') return moduleEnv;
          return null;
        };

        await run('[ops, @template](./ops.md)', scope);
        expect(await run('1 >> 2.', scope)).toEqual([Expr.value(true)]);
      } finally {
        Env.resolve = resolve;
      }
    });
  });

  describe('Functions', () => {
    test('should evaluate lambda expressions', async () => {
      expect(await run('x=->42.\nx()')).toEqual([Expr.value(42)]);
      expect(await run('sum=a->b->a+b.\nsum(3, 4).\n')).toEqual([Expr.value(7)]);
    });

    test('should carry given arguments as scope', async () => {
      expect(await run('f = n -> (m -> m + n).\nf(1)(2).\n')).toEqual([Expr.value(3)]);
    });

    test('should allow partial application', async () => {
      expect(await run('sum=a->b->a+b.\nsum(1,2)')).toEqual([Expr.value(3)]);
      expect(await run('sum=a->b->a+b.\nadd3=sum(3).\nadd3(5)')).toEqual([Expr.value(8)]);
      expect(await run('div=a->b->a/b.\ndiv2=div(2).\ndiv2(1)')).toEqual([Expr.value(2)]);
    });

    test('should allow application of operator-calls', async () => {
      expect(await run('(1+)(2)')).toEqual([Expr.value(3)]);
      expect(await run('(3/)(4)')).toEqual([Expr.value(0.75)]);
      expect(await run('add=x->x+.\nadd3=add(3).\nadd3(5)')).toEqual([Expr.value(8)]);
      expect(await run('div=x->x/.\ndiv2=div(2).\ndiv2(3)')).toEqual([Expr.value(0.6666666666666666)]);
    });

    test('should apply values through pipe-operator', async () => {
      expect(await run('4|>n->n*2')).toEqual([Expr.value(8)]);
      expect(await run('fn=->42.\n0|>fn|>fn|>fn|>fn')).toEqual([Expr.value(42)]);
      expect(await run('sum=a->b->a+b.\n-3 |> sum(5) + 4 |> sum(9)')).toEqual([Expr.value(15)]);
      expect(await run('sum=a->b->a+b.\ntwice = n -> n |> sum(n).\ntwice(3)')).toEqual([Expr.value(6)]);
      expect(await run('fn=(a b) -> a+b(a).\n3|>fn()(n -> n * 2)')).toEqual([Expr.value(9)]);
      expect(await run('fn=(a b) -> a+b(a).\n3|>fn(n -> n * 2)')).toEqual([Expr.value(9)]);
    });

    test('should allow to bind nested definitions', async () => {
      expect(await run('sum=a->b->a+b.\nadd3=sum(3).\njust8=add3(5).\njust8')).toEqual([Expr.value(8)]);
    });

    test('should allow to use _ as placeholder', async () => {
      expect(await run('div=a->b->a/b.\ndiv2=div(_, 2).\ndiv2(1)')).toEqual([Expr.value(0.5)]);
      expect(await run('test=(a b c) -> a+b+c.\nfix=test("?","B",_).\nfix("X")')).toEqual([Expr.value('?BX')]);
      expect(await run('test=(a b c) -> a+b+c.\nfix=test(_,"B",_).\nfix("X","Y")')).toEqual([Expr.value('XBY')]);
    });

    test('should resolve callees from any expression', async () => {
      expect(await run('x=1.\n(((((x))))).\n')).toEqual([Expr.value(1)]);
      expect(await run('fn=->42.\nsum=fn.\nsum()')).toEqual([Expr.value(42)]);
      expect(await run('pi=3.1416.\nx=pi * 2.5.\nx.\n')).toEqual([Expr.value(7.854)]);
      expect(await run('truth=fn->fn(42).\ntruth(x->x)')).toEqual([Expr.value(42)]);
      expect(await run('sum=a->b->a+b.\n(((((sum)))))(1, 2).\n')).toEqual([Expr.value(3)]);
      expect(await run('addPair=a->b->a+b.\nidentity=a->a.\nidentity(addPair)(1, 2).\n')).toEqual([Expr.value(3)]);
      expect(await run('addPair=a->b->a+b.\nidentity=a->a.\nfn=identity(addPair).\nfn(1, 2).\n')).toEqual([Expr.value(3)]);
    });

    test('should allow to use definitions as binary-operators', async () => {
      const env = new Env();

      expect(await run('adds = (a b) -> a + b.\n', env)).toEqual([]);
      expect(await run('1 adds (5 / (2 - 4))', env)).toEqual([Expr.value(-1.5)]);

      expect(await run('infix = (a b) -> a + "_" + b.\n"FOO" infix "BAR"')).toEqual([Expr.value('FOO_BAR')]);
    });

    test('should not mutate arguments from bound-calls', async () => {
      expect(await run('div = n -> d -> (= n % d 0).\nfn=div(2).\nfn(1), div(3)(2).\ndiv(4, 2)')).toEqual([
        Expr.value(true),
        Expr.value(false),
        Expr.value(true),
      ]);
    });

    test('should allow to call through mod-operator', async () => {
      expect(await run('sum=(a b) -> a+b.\nsum % :a 3 :b 5')).toEqual([Expr.value(8)]);
    });
  });

  describe('Logic', () => {
    test('should evaluate from logical operators', async () => {
      expect(await run('(! 1 "2")')).toEqual([Expr.value(true)]);
      expect(await run('(! 1 "1")')).toEqual([Expr.value(false)]);
      expect(await run('(= 1 "1")')).toEqual([Expr.value(true)]);
      expect(await run('(== 1 2)')).toEqual([Expr.value(false)]);
      expect(await run('(!= 1 2)')).toEqual([Expr.value(true)]);
      expect(await run('(!= 1 "1")')).toEqual([Expr.value(true)]);
      expect(await run('(<= 1 2)')).toEqual([Expr.value(true)]);
      expect(await run('(> 1 2)')).toEqual([Expr.value(false)]);
      expect(await run('(> 1 (2/0.5))')).toEqual([Expr.value(false)]);
      expect(await run('(= 4 % 2 0)')).toEqual([Expr.value(true)]);
      expect(await run('(? (5 - 5) (0 -1) 3)')).toEqual([Expr.value(true)]);
      expect(await run('($ (5 - 5) (0 -1) 3)')).toEqual([Expr.value(false)]);
      expect(await run('(= [1,2] [1,2])')).toEqual([Expr.value(true)]);
      expect(await run('(= /^x/ "xyz")')).toEqual([Expr.value(true)]);
      expect(await run('(! "abc" /x/)')).toEqual([Expr.value(true)]);
      expect(await run('(== [1,2] [1,2,3])')).toEqual([Expr.value(false)]);
      expect(await run('(== (:t 42) (:t 42))')).toEqual([Expr.value(true)]);
      expect(await run('(== (:t 42) (:t 43))')).toEqual([Expr.value(false)]);
      expect(await run('(== (:t 42) (:t 42, :y 0))')).toEqual([Expr.value(false)]);
      expect(await run('(== [1,"2",:x "y"] [1,2,3,:a "b","c"])')).toEqual([Expr.value(false)]);
    });

    test('should test for inclusion through the like-operator', async () => {
      expect(await run('(~ 2 1)')).toEqual([Expr.value(false)]);
      expect(await run('(~ :nil 2)')).toEqual([Expr.value(false)]);
      expect(await run('(~ "abc" "a")')).toEqual([Expr.value(true)]);
      expect(await run('(~ [1, 2, 3] 4)')).toEqual([Expr.value(false)]);
      expect(await run('(~ (:x 1 :y 2) :z)')).toEqual([Expr.value(false)]);
      expect(await run('(~ [1, 2, 3] [2, 3])')).toEqual([Expr.value(true)]);
      expect(await run('(~ (:x 1 :y 2) [:x, :y])')).toEqual([Expr.value(true)]);
    });

    test('should by-pass checks when placeholder is given', async () => {
      expect(await run('(= [1, 2, 3] [1, _, 3])')).toEqual([Expr.value(true)]);
      expect(await run('(= (:foo "BAR") (:foo _))')).toEqual([Expr.value(true)]);
    });

    test('should skip additional items/properties on weak-mode', async () => {
      expect(await run('(= [1, 2, 3] [1, 2])')).toEqual([Expr.value(true)]);
      expect(await run('(= (:foo "bar") (:foo "bar" :x "y"))')).toEqual([Expr.value(true)]);
    });

    test('should allow to rewrite syntax with templates', async () => {
      expect(await run(`
        @template
          ~ (a -> @let a = a + 1).

        x = 1.
        y = -1.

        1, ~y.
      `)).toEqual([Expr.value(1), Expr.value(0)]);

      expect(await run(`
        @template += ((a b) -> @let a = a + b).
        @template *= ((a b) -> @let a = a * b).

        i = 0.
        i += 2.
        i *= 3.
        i
      `)).toEqual([Expr.value(6)]);

      expect(await run(`
        @template
          >> ((a b) -> a + b),
          fun (a -> "Fun: #{a}").

        fun("osoms").
        2 >> 4.
      `)).toEqual([Expr.value('Fun: osoms'), Expr.value(6)]);

      expect(await run(`
        @template
          <=> ((a b) -> (!= a b)).

        [@if (1 <=> 2) 42.
        2 <=> 2.
        (<= 1 2)]
      `)).toEqual([Expr.array([Expr.value(42), Expr.value(false), Expr.value(true)])]);

      expect(await run(`
        @template
          /= ((a b) -> @let a = a / b).

        j = :k 42.
        j.k /= 2.
        j.k
      `)).toEqual([Expr.value(21)]);

      expect(await run(`
        @template ++ (a -> @let a = a + 1).
        c = :d 42.
        d = 0.
        a = 0.
        b = 0.
        a++, ++b, ++c.d, (> ++d 0)
      `)).toEqual([Expr.value(0), Expr.value(1), Expr.value(43), Expr.value(true)]);
    });

    test('should let you mutate definitions', async () => {
      expect(await run('i = 0.\n@let i = i + 1.\ni')).toEqual([Expr.value(1)]);
      expect(await run('x = 6.\n@let x = x / 2.\nx')).toEqual([Expr.value(3)]);
      expect(await run('x = 1.5.\n@let x = x * 3.\nx')).toEqual([Expr.value(4.5)]);
      expect(await run('z = 1.\ni = 0.\n@let i = i + z.\ni')).toEqual([Expr.value(1)]);
      expect(await run('fun = n -> n.\ni = 0.\n@let i = i + fun(2 * 3) / 2.\ni')).toEqual([Expr.value(3)]);
      expect(await run('x = 0.\n@if (< 1 2) (@let x = x + 3.\nx).\nx')).toEqual([Expr.value(3), Expr.value(3)]);
      expect(await run('@let x = 0 @if (< 1 2) (@let x = x + 3.\nx).\nx')).toEqual([Expr.value(3), Expr.value(3)]);
    });

    test('should resolve from conditional mappings', async () => {
      expect(await run('@if (!:nil) 42')).toEqual([Expr.value(42)]);
      expect(await run('@if (:off) _')).toEqual([]);
      expect(await run('@if (:off) _')).toEqual([]);
      expect(await run('@if (:on) :off')).toEqual([Expr.value(false)]);
      expect(await run('@if (< 1 2) "X" @else "Y"')).toEqual([Expr.value('X')]);
      expect(await run('@if (< 2 1) "X" @else "Y"')).toEqual([Expr.value('Y')]);
      expect(await run('@from "Prelude" @import (size).\n@if (< size([1,2]) 5) "small" @else "big"')).toEqual([Expr.value('small')]);
      expect(await run('f = x -> @if (>= x 3) "_" @else ".".\nf(1), f(2), f(3), f(4)')).toEqual([
        Expr.value('.'),
        Expr.value('.'),
        Expr.value('_'),
        Expr.value('_'),
      ]);
      expect(await run('@from "Prelude" @import (filter).\nfilter([1,4,2], x -> x < 3)')).toEqual([Expr.array([Expr.value(1), Expr.value(2)])]);
    });

    test('should evaluate from if-do-let mappings', async () => {
      expect(await run('@let x=3 @if (> x 0) (x = x - 1).\nx')).toEqual([Expr.value(2)]);
      expect(await run('@let n=3 @while (> n 0) @do (n = n - 1.\nn + 1)')).toEqual([
        Expr.value(3),
        Expr.value(2),
        Expr.value(1),
      ]);
      expect(await run('@do (x = 1.\ny = 2.\nx + y)')).toEqual([Expr.value(3)]);
      expect(await run('x = 10.\n@do (x = 1.\nx).\nx')).toEqual([Expr.value(1), Expr.value(10)]);
      await failWith(run('@do (x = 1).\nx'), 'Undeclared local `x` at line 2:1');
    });
  });

  describe('Match', () => {
    test('should allow simple pattern-matching through equality', async () => {
      expect(await run('@match 1 1 42')).toEqual([Expr.value(42)]);
      expect(await run('@match (2) (4, 3..2) 42 @else 0')).toEqual([Expr.value(42)]);
    });

    test('should check values for inclusion through range-expressions', async () => {
      expect(await run('@match 2 [1..3] 42')).toEqual([Expr.value(42)]);
      expect(await run('@match 2 (1..3) 42')).toEqual([Expr.value(42)]);
    });

    test('should check values for comparison through logical-expressions', async () => {
      expect(await run('@match 1 (< 2) 42')).toEqual([Expr.value(42)]);
      expect(await run('@match 1 (= 2) 42 @else 0')).toEqual([Expr.value(0)]);
    });

    test('should compare values if they are lists, mappings or mixed-tokens', async () => {
      expect(await run('@match [1, 2, 3] [1, 2, 3] 42')).toEqual([Expr.value(42)]);
      expect(await run('@if (@match (:foo "bar") (:foo "bar") :on) "OK"')).toEqual([Expr.value('OK')]);
    });

    test('should try to evaluate from all given conditions', async () => {
      expect(await run('@match (:x (:y 42)) 1 2, 3 4 | 0')).toEqual([Expr.value(0)]);
    });

    test('should allow first-class @match{...} functions', async () => {
      expect(await run(`
        classify = @match{1 42, 2 0, @else 9}.
        classify(2).
      `)).toEqual([Expr.value(0)]);

      expect(await run(`
        classify = @match{1 "one", 2 "two", @else "?"}.
        classify(7).
      `)).toEqual([Expr.value('?')]);
    });
  });

  describe('Destructuring', () => {
    test('should bind comma-separated locals from rhs values', async () => {
      expect(await run('a,b=(1,2).\na,b')).toEqual([Expr.value(1), Expr.value(2)]);
      expect(await run('x,y,z=(10,20,30).\ny')).toEqual([Expr.value(20)]);
    });

    test('should support rest bindings and discards', async () => {
      expect(await run('a,b,...rest=(1,2,3,4).\na,b,rest')).toEqual([
        Expr.value(1),
        Expr.value(2),
        Expr.array([Expr.value(3), Expr.value(4)]),
      ]);

      expect(await run('_,b=(4,5).\nb')).toEqual([Expr.value(5)]);
    });

    test('should fail if rhs does not provide enough values', async () => {
      await failWith(run('a,b,c=(1,2).'), 'Expecting at least 3 values to destructure, given 2');
    });
  });

  describe('Rescue', () => {
    test('should return nothing on failure', async () => {
      expect(await run('@rescue x')).toEqual([]);
      expect(await run('@rescue x | 0')).toEqual([Expr.value(0)]);
    });

    test('should return statement otherwise', async () => {
      expect(await run('@rescue 1')).toEqual([Expr.value(1)]);
    });

    test('should return @rescue on try-presence', async () => {
      expect(await run('@try x @rescue 0')).toEqual([Expr.value(0)]);
      expect(await run('@try 1 @rescue 0')).toEqual([Expr.value(1)]);
    });

    test('should @check statements as failure-constraints', async () => {
      expect(await run('@try x @rescue x -> 42')).toEqual([Expr.value(42)]);
      expect(await run('@try x @rescue (> 1 2) 3')).toEqual([]);
      expect(await run('@try x @rescue -> (> 1 2) 3')).toEqual([]);

      expect(await run(`
        attempts = 0.
        server = :is_connected 1.
        @try
          server.connect()
        @check
          server.is_connected
        @rescue
          (< attempts 10)
            (@let attempts = attempts + 1).
        attempts.
      `)).toEqual([Expr.value(10)]);
    });

    test('should resolve from @try @rescue if @check evaluates to true', async () => {
      expect(await run(`
        enabled = :off.
        @try x
        @check enabled
        @rescue (!enabled) (
          @let enabled = :on.
        ) | enabled.
      `)).toEqual([Expr.value(true)]);
    });
  });

  describe('Ranges', () => {
    test('should spread arguments on calls', async () => {
      expect(await run(`
        div=(a b) -> a/b.
        div2=div(2,..).
        div2(4).
        div2'=div(..,2).
        div2'(4).
      `)).toEqual([Expr.value(0.5), Expr.value(2)]);

      expect(await run(`
        try=(a b ..) -> [a, b, ..].
        try(1, 2, 3, 4, 5).
      `)).toEqual([Expr.value([1, 2, 3, 4, 5])]);
    });

    test('should expand from ranges into arrays', async () => {
      expect(await run('1..3')).toEqual([Expr.array([
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
      ])]);

      expect(await run('-3..0')).toEqual([Expr.array([
        Expr.value(-3),
        Expr.value(-2),
        Expr.value(-1),
        Expr.value(0),
      ])]);
    });

    test('should allow open-ended ranges with lazy consumption', async () => {
      expect(await run('1..:5')).toEqual([
        Expr.value(1),
        Expr.value(2),
        Expr.value(3),
        Expr.value(4),
        Expr.value(5),
      ]);

      expect(await run(`
        @import (head, take, map, filter) @from "Prelude".
        head(1..), take(1.., 5),
        1.. |> filter(n -> (= n % 2 0)) |> take(5),
        1.. |> map(n -> n * 3) |> take(4)
      `)).toEqual([
        Expr.value(1),
        Expr.array([
          Expr.value(1),
          Expr.value(2),
          Expr.value(3),
          Expr.value(4),
          Expr.value(5),
        ]),
        Expr.array([
          Expr.value(2),
          Expr.value(4),
          Expr.value(6),
          Expr.value(8),
          Expr.value(10),
        ]),
        Expr.array([
          Expr.value(3),
          Expr.value(6),
          Expr.value(9),
          Expr.value(12),
        ]),
      ]);
    });

    test('should allow consecutive values', async () => {
      expect(await run('[1,2].\n[3,4]')).toEqual([
        Expr.array([Expr.value(1), Expr.value(2)]),
        Expr.array([Expr.value(3), Expr.value(4)]),
      ]);
    });

    test('should allow to take nth-items', async () => {
      expect(await run('0..3:2')).toEqual([Expr.value(0), Expr.value(1)]);
      expect(await run('(0..3:2)')).toEqual([Expr.value(0), Expr.value(1)]);
    });

    test('should evaluate any expression', async () => {
      expect(await run('test=n->n-2.\n0..test(3)')).toEqual([
        Expr.array([Expr.value(0), Expr.value(1)]),
      ]);

      expect(await run('test=n->n-2.\n0..(test(3) + 1)')).toEqual([
        Expr.array([Expr.value(0), Expr.value(1), Expr.value(2)]),
      ]);
    });

    test('should use lazy-ranges on arrays', async () => {
      expect(await run('[-10..10:5-3]')).toEqual([
        Expr.array([Expr.from(RANGE, Range.from(-10, 10, 5, 3))]),
      ]);

      expect(await run('([-1..1], [2..3:1])')).toEqual([
        Expr.array([Expr.from(RANGE, Range.from(-1, 1))]),
        Expr.array([Expr.from(RANGE, Range.from(2, 3, 1))]),
      ]);
    });

    test('should configure access on lazy-ranges', async () => {
      expect(await run('[1..3 ::]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3))])]);
      expect(await run('[1..3 :1]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1))])]);
      expect(await run('[1..3 :1-2]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2))])]);
      expect(await run('[1..3 :1 :2]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2))])]);
      expect(await run('[1..3 : :1]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, null, 1))])]);
      expect(await run('[1..3 :1-2 :3]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2, 3))])]);
      expect(await run('[1..3 :1 :2 :3]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2, 3))])]);
      expect(await run('[1..3 :: :1]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, null, 1))])]);
      expect(await run('[1..3 :1 :2 :3..4]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, 1, 2, 3, 4))])]);
      expect(await run('[1..3 :: :-5..-2]')).toEqual([Expr.array([Expr.from(RANGE, Range.from(1, 3, null, null, -5, 3))])]);
    });

    test('should evaluate lazy-ranges on access', async () => {
      expect(await run('[-3..0]:')).toEqual([Expr.value(-3), Expr.value(-2), Expr.value(-1), Expr.value(0)]);
      expect(await run('[1..3]:-1')).toEqual([Expr.value(3)]);
      expect(await run('[1..10]:-1')).toEqual([Expr.value(10)]);
      expect(await run('[1..10]:(2-3)')).toEqual([Expr.value(10)]);

      expect(await run('[-3..0]:-2')).toEqual([Expr.value(-1)]);
      expect(await run('[-3..0]:-2..2')).toEqual([Expr.value(-1), Expr.value(0)]);
      expect(await run('[-3..3]:-5..3')).toEqual([Expr.value(-1), Expr.value(0), Expr.value(1)]);
      expect(await run('[-10..10]:-5..3')).toEqual([Expr.value(6), Expr.value(7), Expr.value(8)]);

      expect(await run('[1..10]:0')).toEqual([Expr.value(1)]);
      expect(await run('[1..10]:-5..-2')).toEqual([Expr.value(6), Expr.value(7), Expr.value(8)]);
      expect(await run('["A".."F"]:1..3')).toEqual([Expr.value('B'), Expr.value('C'), Expr.value('D')]);
    });

    test('should expand any value within loops', async () => {
      expect(await run('@loop 0..3:2')).toEqual([Expr.value(0), Expr.value(1)]);
      expect(await run('@loop (0..3:2)')).toEqual([Expr.value(0), Expr.value(1)]);
      expect(await run('@loop ("OK")')).toEqual([Expr.value('O'), Expr.value('K')]);

      expect(await run('@loop [-10..10:5-3]'))
        .toEqual([Expr.value(-10), Expr.value(-7), Expr.value(-4), Expr.value(-1), Expr.value(2)]);

      expect(await run('@loop ([-10..10:5-3])'))
        .toEqual([Expr.value(-10), Expr.value(-7), Expr.value(-4), Expr.value(-1), Expr.value(2)]);

      expect(await run('@loop (1, (2, (3)), 4)')).toEqual([
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

      expect(await run('@loop (3, [4, 5], 5..3, "a".."c", "OSOM")')).toEqual([
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

    test('should yield from arguments on block-less loops', async () => {
      expect(await run('x=1.\ny=[4,5,6,7].\n@loop x, y, 3')).toEqual([
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

    test('should take the first literal as iterator-index', async () => {
      expect(await run('x=[1, 2, 3].\n@loop (x) i * 2')).toEqual([
        Expr.value(2),
        Expr.value(4),
        Expr.value(6),
      ]);
    });

    test('should discard first literal from body if block is given', async () => {
      expect(await run('x=[1, 2, 3].\n@loop (x) i (i * 2)')).toEqual([
        Expr.value(2),
        Expr.value(4),
        Expr.value(6),
      ]);
    });

    test('should evaluate from given blocks as functions', async () => {
      expect(await run('@loop(1..3) x -> x * 2')).toEqual([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });

    test('should evaluate from given strings as functions', async () => {
      expect(await run('@loop(1..3) x "#{x * 2}"')).toEqual([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });

    test('should evaluate iterator-index if it is a function', async () => {
      expect(await run('thrice=fn->@loop(1..3) fn.\nthrice(x->x*2)')).toEqual([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });

    test('should allow calls after iterator-index', async () => {
      expect(await run('thrice=fn->@loop(1..3) x fn(x).\nthrice(x->x*2)')).toEqual([Expr.value(2), Expr.value(4), Expr.value(6)]);
    });
  });

  describe('Modules', () => {
    test('should allow to call methods from native objects', async () => {
      expect(await run('@import concat @from "Array".\nconcat([1,2], [3, [4]])')).toEqual([
        Expr.array([Expr.value(1), Expr.value(2), Expr.value(3), Expr.array([Expr.value(4)])]),
      ]);

      expect(await run('@import (:toFixed d) @from "Number".\nd(0.1234, 2)')).toEqual([Expr.value('0.12')]);

      expect(await run('@import entries @from "Object".\nentries(:foo "bar")')).toEqual([Expr.array([
        Expr.array([Expr.value('foo'), Expr.value('bar')]),
      ])]);

      expect(await run('@import concat @from "Array".\nconcat(1..2,3).\n')).toEqual([
        Expr.array([Expr.value(1), Expr.value(2), Expr.value(3)]),
      ]);

      expect(await run('@import concat @from "Array".\na=concat(-1..2,3,4).\na')).toEqual([
        Expr.array([Expr.value(-1), Expr.value(0), Expr.value(1), Expr.value(2), Expr.value(3), Expr.value(4)]),
      ]);
    });

    test('should require to use range-operator to spread given args', async () => {
      expect(await run(`
        @import (:substr s, concat) @from "String".
        test=concat("foo",..).
        test'=x->concat(x,"foo").
        test(s("_bar", 1), "!").
        test(42).
        test'(0).
      `)).toEqual([Expr.value('foobar!'), Expr.value('foo42'), Expr.value('0foo')]);
    });

    test('should allow to import from external sources', async () => {
      const env = new Env();

      await run('thrice = n -> n * 3.\nsum = (a b) -> a + b.\n', env);

      Env.resolve = source => ({
        './example.js': require('./fixtures/example'),
        './other.md': env,
      })[source];

      expect(await run(`
        @import wait, twice @from "./example.js".
        @import sum, thrice @from "./other.md".

        twice(21).
        thrice(9).
        wait(200).
        fix=sum(3).
        fix(5).
      `)).toEqual([Expr.value(42), Expr.value(27), Expr.value(8)]);
    });

    test('should allow to export specific definitions', async () => {
      const env = new Env();

      await run(`
        @module "Test" @export (:sum s).
        sum = (a b) -> a + b.
      `, env);

      Env.resolve = source => ({
        './other.md': env,
      })[source];

      expect(await run(`
        @import (:s sum) @from "./other.md".

        fix=sum(3).
        fix(5).
      `)).toEqual([Expr.value(8)]);
    });

    test('should keep arguments through FFI calls', async () => {
      Env.resolve = source => ({
        Test: { f: (...args) => ({ args }) },
      })[source];

      expect(await run('@import f @from "Test".\nf(:number, :n, "OK")')).toEqual([Expr.value({
        args: ['number', 'n', 'OK'],
      })]);

      expect(await run(`
        @import f @from "Test".
        f([(:type :multiselect, :name :color, :message "Pick colors", :choices [(:title "Red", :value "#FF0000")])])
      `)).toEqual([Expr.from(LITERAL, {
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
    test('should allow recursion, e.g. factorial', async () => {
      expect(await run(`
        fact = n ->
          (< n 1) ? 1 | n * fact(n - 1).
        fact(5).
      `)).toEqual([Expr.value(120)]);
    });

    test('should perform memoization on marked calls, e.g. fibonacci!', async () => {
      expect(await run(`
        fib = n ->
          @if (< n 2) 1, (< n 1) 0
          @else fib(n - 1) + fib(n - 2).
        fib!(20).
      `)).toEqual([Expr.value(10946)]);
    });

    test('should allow while-loops to collect from calculations, e.g. fibonacci', async () => {
      const start2 = Date.now();

      expect(await run(`
        @template
          += ((a b) -> @let a = a + b),
          -- (a -> @let a = a - 1).

        fib = n ->
          @let
            a = 1, b = 0, temp = 0
          @while (>= n-- 0)
            temp = a, a += b, b = temp, b
          .
        fib(20)
      `)).toEqual([
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

      if (process.env.CI) expect((Date.now() - start2) / 1000).toBeLessThan(0.01);
    });

    test('should allow to implement Y-combinator', async () => {
      expect(await run(`
        Y = f -> (x -> x(x))(g -> f(y -> g(g)(y))).
        fn = fact -> (n -> ((< n 2) ? 1 | n * fact(n - 1))).
        Y(fn)(5).
      `)).toEqual([Expr.value(120)]);
    });
  });
});
