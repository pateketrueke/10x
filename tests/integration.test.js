/* eslint-disable no-unused-expressions */

import fs from 'fs';
import path from 'path';

import tk from 'timekeeper';
import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { stdout } from 'stdout-stderr';

import { summary } from '../src/util';
import { execute as run, evaluate } from '../src/lib';
import { useCurrencies } from '../src/lib/builtins';

import {
  Token, debug, hasDiff, copy, literal, serialize, deindent,
} from '../src/lib/helpers';

import {
  EOL, PLUS, MINUS, MUL, TEXT, BLOCK, NUMBER, LITERAL, UL_ITEM, OL_ITEM, HEADING, BLOCKQUOTE,
  OPEN, CLOSE, COMMA, BEGIN, DONE, DOT, DIV, RANGE, SOME, EVERY, OR, EQUAL, LESS,
  MOD, PIPE, SYMBOL, NOT_EQ, NOT, LIKE, EXACT_EQ, LESS_EQ, GREATER_EQ, GREATER,
} from '../src/lib/tree/symbols';

import Expr from '../src/lib/tree/expr';
import Env from '../src/lib/tree/env';
import Parser from '../src/lib/tree/parser';
import Scanner from '../src/lib/tree/scanner';
import shared from '../src/adapters/node/shared.js';

tk.freeze(1577858400000);
shared({ Env }, process.argv.slice(2));

function stringify(source, ctx) {
  return new Scanner(source).scanTokens().map(x => serialize.call(ctx, x)).join('');
}

function example(src) {
  return fs.readFileSync(path.join(__dirname, '../examples', src)).toString();
}

describe('Integration', () => {
  const token = { type: 'x', value: 'y' };
  const value = Symbol('OK');

  test('should fail on invalid tokens', () => {
    expect(() => Token.get()).toThrow('Invalid token');
  });

  test('should wrap well-known values as tokens', () => {
    expect(Expr.value(42)).toEqual(Expr.value(42));
    expect(Expr.value('foo')).toEqual(Expr.value('foo'));
    expect(Expr.value(null)).toEqual(Expr.value(null));
    expect(Expr.value(true)).toEqual(Expr.value(true));
    expect(Expr.value(false)).toEqual(Expr.value(false));
    expect(Expr.value([false])).toEqual(Expr.array([Expr.value(false)]));
  });

  test('should keep objects as plain literals', () => {
    expect(Expr.value({ foo: 'bar' })).toEqual(Expr.map({ foo: 'bar' }));
  });

  test('should keep instances without wrapping', () => {
    class Dummy {}
    const instance = new Dummy();

    expect(Expr.value(instance)).toEqual(Expr.value(instance));
  });

  test('should wrap unknown values as LITERAL tokens', () => {
    expect(Expr.value(value)).toEqual(Expr.value(value));
  });

  test('should wrap lists of tokens as Expr symbols', () => {
    expect(Expr.from([new Expr(token)])).toEqual([token]);
  });

  test('should parse markdown-tags within TEXT values', () => {
    expect(Expr.text('- fun')).toEqual({
      type: TEXT,
      value: {
        buffer: ['fun'],
        kind: UL_ITEM,
      },
    });

    expect(Expr.text('## fun')).toEqual({
      type: TEXT,
      value: {
        buffer: ['fun'],
        level: 2,
        kind: HEADING,
      },
    });

    expect(Expr.text('> fun')).toEqual({
      type: TEXT,
      value: {
        buffer: ['fun'],
        kind: BLOCKQUOTE,
      },
    });

    expect(Expr.text('1111. fun')).toEqual({
      type: TEXT,
      value: {
        buffer: ['fun'],
        level: 1111,
        kind: OL_ITEM,
      },
    });
  });

  test('should allow to set/update environment locals', async () => {
    const env = new Env();

    env.set('test', { body: [Expr.value(0)] });
    Env.up('test', 'Tets', () => 42, env);

    expect(env.get('test')).toEqual({
      body: [Expr.value(42)],
    });
  });

  test('should share templates through top-level environment', async () => {
    const env = new Env();

    await run('@template <> ((a b) -> (!= a b))', env);

    expect(await run('1 <> 2', env)).toEqual([Expr.value(true)]);
  });

  test('should allow call locals from other environments', async () => {
    stdout.start();

    const a = new Env();
    const b = new Env();

    await run(`
      @from "Prelude" @import check, items.
      @from "IO" @import puts.

      test = (desc block) -> (
        output = block() | :nil.
        failed = (? output :nil).
        puts("# #{failed ? "not ok" | "ok"} — #{desc}\\n").
        @if (failed) puts("  - ", items(output).join("\\n  - "), "\\n").
      ).
    `, b);

    a.defn('proxy', {
      body: [Expr.fn({
        env: b, label: 'Proxy/test', target: 'test',
      }, { line: 0, col: 0 })],
    }, { line: 0, col: 0 });

    const result = await run(`
      proxy("msg", -> (
        check((= 1 2)).
      )).
    `, a);

    stdout.stop();

    if (run.failure) throw run.failure;

    expect(stdout.output, `${deindent(`
      # not ok — msg
        - \`(= 1 2)\` did not passed
    `)}\n`);

    expect(result, []);
  });

  describe('Diffing', () => {
    const a = Parser.getAST('[1, :foo "bar"]');
    const b = Parser.getAST('[1, :foo "bar"]');

    test('should help to strictly compare any value', () => {
      expect(hasDiff(0, 1)).toBe(true);
      expect(hasDiff([0], [])).toBe(true);
      expect(hasDiff([0], [0])).toBe(false);
      expect(hasDiff({ x: 1 }, { x: 0 })).toBe(true);
      expect(hasDiff({ x: 0 }, { x: 0 })).toBe(false);
    });

    test('should compare full tokens in strict-mode', () => {
      expect(hasDiff(a, b)).toBe(false);
    });

    test('should help to compare any value in weak-mode', () => {
      expect(hasDiff(0, '0', true)).toBe(false);
      expect(hasDiff(a, copy(a), true)).toBe(false);
    });

    test('should compare type and value from any given token', () => {
      expect(hasDiff(Expr.value(0), Expr.value('0'))).toBe(true);
      expect(hasDiff(Expr.value(0), Expr.value('0'), true)).toBe(false);
    });
  });

  describe('Builtins', () => {
    describe('Unit', () => {
      beforeEach(() => {
        Env.register = (...args) => new Expr.Unit(...args);
      });

      afterEach(() => {
        Env.register = () => null;
      });

      test('should allow fractions as regular units', async () => {
        expect(await run('1/2 thing')).toEqual([Expr.unit(0.5, 'thing')]);
      });

      test('should allow to register external units', async () => {
        expect(await run('1x')).toEqual([Expr.unit(1, 'x')]);
      });

      test('should respond to most basic math-calls', async () => {
        expect(await run('3 - 2a')).toEqual([Expr.value(1)]);
        expect(await run('4mm % 2')).toEqual([Expr.unit(0, 'mm')]);
        expect(await run('3cm - 2cm')).toEqual([Expr.unit(1, 'cm')]);
        expect(await run('1cm + 1.5in')).toEqual([Expr.unit(1.8937008, 'in')]);
        expect(await run('7 d / 2')).toEqual([Expr.unit(3.5, 'd')]);
        expect(await run('.\n3cm * 1.5mm')).toEqual([Expr.unit(45, 'mm')]);
      });

      test('should allow to work with fractions', async () => {
        expect(await run(`
          @import (:default Frac) @from "Frac".
          Frac.from(12).
          Frac.from(0.5).
          Frac.from(0.005).
        `)).toEqual([Expr.value(12), Expr.frac(1, 2), Expr.frac(1, 200)]);

        expect(await run('@import (:default fr) @from "Frac".\nfr(1, 2)')).toEqual([Expr.frac(1, 2)]);
      });

      test('should convert between currencies', async () => {
        await useCurrencies({
          key: null,
          read: () => ({
            rates: {
              USD: 1.0842,
              MXN: 20.1606,
            },
          }),
          write: () => null,
          exists: () => true,
          resolve: () => null,
        });

        expect(await run('@import to, MXN @from "Unit".\n1000USD to MXN')).toEqual([
          Expr.unit(18594.908688433865, 'MXN'),
        ]);
      });

      test('should convert between values', async () => {
        expect(await run(`
          @import to, inches, convert @from "Unit".
          convert(5, :cm, :in).
          2 cm to inches
        `)).toEqual([
          Expr.unit(1.9685040000000003, 'in'),
          Expr.unit(0.7874016, 'in'),
        ]);
      });

      test('should allow to compare between units', async () => {
        expect(await run('(> 1cm 2cm)')).toEqual([Expr.value(false)]);
      });

      test('should set value of unit-less calls', () => {
        expect(new Expr.Unit(1, 'cm').from(-1)).toEqual(Expr.unit(-1, 'cm').value);
      });

      test('should return values from alised units', () => {
        expect(Expr.Unit.exists('d')).toEqual('d');
        expect(Expr.Unit.exists('day')).toEqual('d');
        expect(Expr.Unit.exists('days')).toEqual('d');
      });

      test('should return nothing on missing units', () => {
        expect(Expr.Unit.from(1, 'foo')).toBeUndefined();
      });

      test('should evaluate other literals as units', async () => {
        Env.register = Expr.Unit.from;

        expect(await run('@import (:MXN pesos) @from "Unit".\n15pesos')).toEqual([Expr.unit(15, 'MXN')]);
      });
    });
  });

  describe('Callstack', () => {
    const err = new Error('Oh noes!');
    const code = 'FIXME';

    err.prevToken = Expr.from(TEXT, code, { line: 0, col: 0 });
    err.stack = '';

    test('should repair errors before formatting', () => {
      expect(debug(new Error('Unexpected!'))).toEqual('Unexpected!');

      const test = debug(err, code);

      expect(test).toContain('at `FIXME` at line 1:1');
      expect(test).toContain('1 | FIXME');

      expect(debug(new Error('FIXME: at line 0:0'), '', true)).not.toContain('at line 0:0');
    });

    test('should report failures on formatting', async () => {
      try {
        await run('"\n"');
      } catch (e) {
        expect(summary(e, '"\n"')).toContain('Unterminated string at line 1:2');
      }
    });

    test('should report previous token from callstack', () => {
      err.prevToken = undefined;
      err.stack = undefined;
      err.line = 0;
      err.col = 0;

      expect(debug(err, code)).toEqual(`${deindent(`
        Oh noes!

             1 | FIXME
        ---------^
      `)}\n`);
    });

    test('should allow formatting of single errors', async () => {
      let error;

      try {
        await run('x');
      } catch (e) {
        error = e;
      } finally {
        expect(debug(error)).toEqual('Undeclared local `x` at line 1:1 (Eval)');
        expect(debug(error, 'x')).toEqual([
          'Undeclared local `x` at line 1:1 (Eval)',
          '',
          '     1 | x',
          '---------^',
          '',
        ].join('\n'));
      }
    });

    test('should allow formatting of nested errors', async () => {
      let error;

      try {
        await run('x = y.\nx');
      } catch (e) {
        error = e;
      } finally {
        expect(debug(error)).toEqual('Undeclared local `y` at line 1:5 (Lit)');
        expect(debug(error, 'x = y.\nx')).toEqual([
          'Undeclared local `y` at line 1:5 (Lit)',
          '  at `.` at line 1:6',
          '',
          '     1 | x = y.',
          '--------------^',
          '     2 | x',
          '',
        ].join('\n'));
      }
    });

    test('should report callstack if enabled', async () => {
      await run('x = 42.\ny = x * 2.\n3y', null, true);

      const x = [Expr.value(42)];
      const y = [Expr.local('x'), Expr.from(MUL, '*'), Expr.value(2)];

      expect(run.info.enabled).toBe(true);
      expect(run.info.depth, 0);
      expect(run.info.calls, [
        ['Eval', 1, [
          Expr.block({ body: x, name: 'x' }),
          Expr.from(EOL),
          Expr.block({ body: y, name: 'y' }),
          Expr.from(EOL),
          Expr.value(3),
          Expr.from(MUL),
          Expr.local('y'),
        ]],
        ['Lit', 2, y],
      ]);
    });

    test('should allow tu parse/format on debug', async () => {
      const e = new Error('OK');

      e.stack = e.message;
      e.line = 0;
      e.col = 1;

      expect(debug(e, '1+2', false, source => Parser.getAST(source, 'raw').map(x => x.value).join(''))).toEqual(`${deindent(`
        OK

             1 | 1+2
        ----------^
      `)}\n`);
    });

    test('should cut around the errored line', async () => {
      const e = new Error('OK');

      e.stack = e.message;
      e.line = 6;
      e.col = 0;

      expect(debug(e, '-\n-\n-\n-\n-\n-\n+\n-\n-\n-\n-\n-')).toEqual(`${deindent(`
        OK

             3 | -
             4 | -
             5 | -
             6 | -
             7 | +
        ---------^
             8 | -
             9 | -
            10 | -
            11 | -
      `)}\n`);
    });
  });

  describe('Conversion', () => {
    test('should allow wrapping functions to keep tokenInfo', async () => {
      const type = Expr.unsafe(t => t.type);
      const undef = Expr.unsafe(() => undefined);
      const truth = Expr.unsafe(() => Expr.value(true));

      Env.resolve = source => ({
        Test: { type, truth, undef },
      })[source];

      const result = await run('@import type, undef, truth @from "Test".\ntype(42).\ntruth().\nundef()');

      expect(result, [Expr.from(LITERAL, NUMBER), Expr.value(true)]);
    });

    test('should transform tokens into plain-values', async () => {
      expect(Expr.plain(await run('1..3'))).toEqual([[1, 2, 3]]);
      expect(Expr.plain(await run(':foo "bar"'))).toEqual([{ foo: 'bar' }]);
      expect(Expr.plain(await run(':foo "bar", "buzz"'))).toEqual([{ foo: ['bar', 'buzz'] }]);
      expect(Expr.plain(await run('@import fromCharCode @from "String".\nfromCharCode'))).toEqual([String.fromCharCode]);
    });

    test('should export definitions as functions', async () => {
      const env = new Env();
      const [sum] = Expr.plain(await run('sum=a->b->a+b.\nsum', env));

      expect(await evaluate(sum(1, 3), env)).toEqual({
        info: { calls: [], depth: 0, enabled: undefined },
        error: undefined,
        result: [Expr.value(4)],
      });
    });

    test('should run through any callback if given', async () => {
      const output = [];
      const source = await run('sum=(a b) -> a+b.\nsum');
      const result = Expr.plain(source, async (call, args) => {
        output.push({ call, args });
      });

      await result[0]();

      expect(output, [{
        call: Expr.from({
          source: 'sum',
          length: 2,
          type: BLOCK,
          value: {
            args: [Expr.local('a'), Expr.local('b')],
            body: [Expr.local('a'), Expr.from(PLUS), Expr.local('b')],
          },
        }),
        args: [],
      }]);
    });

    test('should convert-back values from foreign-calls', async () => {
      Env.resolve = source => ({
        Fun: { test: fn => fn(1, 2) },
        Test: { nested: { noop: () => {} } },
      })[source];

      expect(await run('@import test @from "Fun".\nsum=(a b) -> a+b.\ntest(sum)')).toEqual([Expr.value(3)]);
      expect(await run('@import nested @from "Test".\nnested.noop()')).toEqual([]);

      expect(await run(`
        @import (:test fun) @from "Fun".
        x = fun((a b) -> [a, b]).
        @if (== x [1, 2]) 42.
      `)).toEqual([Expr.value(42)]);
    });

    test('should allow most values as literals', async () => {
      const Url = require('url');

      Env.resolve = source => ({
        Test: {
          obj: { foo: { nested: 'bar' } },
          mixed: { location: Url.parse('/'), twice: n => n * 2 },
        },
      })[source];

      expect(await run('@import obj @from "Test".\nobj.foo.nested')).toEqual([Expr.value('bar')]);
      expect(await run('@import (:default test) @from "Test".\ntest.obj.foo.nested')).toEqual([Expr.value('bar')]);
      expect(await run('@import mixed @from "Test".\nmixed.location.path.\nmixed.twice(21)')).toEqual([Expr.value('/'), Expr.value(42)]);
    });
  });

  describe('Serialization', () => {
    test('should serialize scalar values', () => {
      expect(serialize(null)).toEqual(':nil');
      expect(serialize(true)).toEqual(':on');
      expect(serialize(false)).toEqual(':off');
      expect(serialize('OK')).toEqual('OK');
      expect(serialize(42)).toEqual(42);
    });

    test('should serialize string types', () => {
      expect(serialize(Parser.getAST(deindent(`
        tpl = <div>
          #{42}
        </div>.
      `)))).toEqual('tpl = <div>\n  #{42}\n</div>.\n');

      expect(serialize(Parser.getAST(deindent(`
        tpl = """
          <div>
            #{42}
          </div>
        """.
      `)))).toEqual('tpl = """<div>\n  #{42}\n</div>""".\n');

      expect(Parser.getAST('"EXAMPLE"').join('')).toEqual('"..."');

      expect(serialize(Parser.getAST('<div>X</div>'))).toEqual('<div>X</div>');
      expect(serialize(Parser.getAST('<div>X</div>'), true)).toEqual('<.../>');

      expect(serialize(Parser.getAST('"#{bar}"'))).toEqual('"#{bar}"');
      expect(serialize(Parser.getAST('"#{42}x"'))).toEqual('"#{42}x"');
      expect(serialize(Parser.getAST('"x:#{1+2}"'))).toEqual('"x:#{1 + 2}"');
      expect(serialize(Parser.getAST('"foo"+"bar"'))).toEqual('"foo" + "bar"');
      expect(serialize(Parser.getAST('"foo: #{bar}"'))).toEqual('"foo: #{bar}"');
      expect(serialize(Parser.getAST('"#{foo}: bar"'))).toEqual('"#{foo}: bar"');

      expect(serialize('"foo#{1 2 3 4}!!"')).toEqual('"foo#{1 2 3 4}!!"');
      expect(serialize('"foo#{bar / 2 + "BUZZ"}!!"')).toEqual('"foo#{bar / 2 + "BUZZ"}!!"');
      expect(serialize('"foo#{bar / 2 + "BUZZ" + 2}!!"')).toEqual('"foo#{bar / 2 + "BUZZ" + 2}!!"');
    });

    test('should serialize mixed values', () => {
      const F = () => 42;
      F.x = () => -1;
      F.y = 2;

      expect(serialize(F)).toEqual('F()[:x :y]');
      expect(serialize(Symbol('TEST'))).toEqual('TEST');
      expect(serialize(new Date())).toEqual('"2020-01-01T06:00:00.000Z"');
      expect(serialize(() => -1)).toEqual('()');
      expect(serialize(/xxx/i)).toEqual('/xxx/i');
      expect(serialize(class X { constructor(a, b) { return [a, b]; } })).toEqual('X(a, b)');
    });

    test('should serialize other values', () => {
      expect(serialize({ foo: 'BAR' }, true)).toEqual(':foo');
      expect(serialize({ type: LITERAL, value: 'TEST' })).toEqual('TEST');
    });

    test('should serialize on toString() calls', async () => {
      expect(Expr.value(undefined).toString()).toEqual('undefined');

      expect(Expr.fn(x => x).toString()).toEqual('(x)');
      expect(Expr.fn(function $(x) { return x; }).toString()).toEqual('$(x)');

      expect(Parser.getAST(':x?').join('')).toEqual(':x?');
      expect(Parser.getAST(':x? y').join('')).toEqual(':x?');

      expect(Parser.getAST('(< 1 2)').join('')).toEqual('(<)');
      expect(Parser.getAST('[1, 2, 3]').join('')).toEqual('[..]');
      expect(Parser.getAST('x=y->fn(y,..).\n').join('')).toEqual('x = y -> fn(y, ..).\n');

      expect((await run('@import map @from "Array".\nmap')).join('')).toEqual('Array/map');

      expect(serialize(Parser.getAST('[1, 2, 3]'))).toEqual('[1, 2, 3]');
      expect(serialize(Parser.getAST('[1..3:1]'))).toEqual('[1..3:1]');
      expect(serialize(Parser.getAST('[..,x]'))).toEqual('[.., x]');
      expect(serialize(Parser.getAST(':t 42'))).toEqual(':t 42');
      expect(serialize(Parser.getAST('1..3'))).toEqual('1..3');

      expect((await run('[1..3]')).join('')).toEqual('[..]');

      const fixedEnv = new Env();

      fixedEnv.defn('x', {
        body: [Expr.fn({
          env: fixedEnv, label: 'Proxy/test', target: 'test',
        }, { line: 0, col: 0 })],
      });

      Env.resolve = source => ({
        Other: fixedEnv,
      })[source];

      expect(serialize(await run('@import x @from "Other".\nx'))).toEqual('Other/x');
    });

    test('should serialize well-known symbols', () => {
      expect(serialize(Expr.from(OPEN))).toEqual('(');
      expect(serialize(Expr.from(CLOSE))).toEqual(')');
      expect(serialize(Expr.from(COMMA))).toEqual(',');
      expect(serialize(Expr.from(BEGIN))).toEqual('[');
      expect(serialize(Expr.from(DONE))).toEqual(']');
      expect(serialize(Expr.from(EOL))).toEqual('.');
      expect(serialize(Expr.from(DOT))).toEqual('.');
      expect(serialize(Expr.from(MINUS))).toEqual('-');
      expect(serialize(Expr.from(PLUS))).toEqual('+');
      expect(serialize(Expr.from(MOD))).toEqual('%');
      expect(serialize(Expr.from(MUL))).toEqual('*');
      expect(serialize(Expr.from(DIV))).toEqual('/');
      expect(serialize(Expr.from(PIPE))).toEqual('|>');
      expect(serialize(Expr.from(BLOCK))).toEqual('->');
      expect(serialize(Expr.from(RANGE))).toEqual('..');
      expect(serialize(Expr.from(SYMBOL))).toEqual(':');
      expect(serialize(Expr.from(NOT_EQ))).toEqual('!=');
      expect(serialize(Expr.from(SOME))).toEqual('?');
      expect(serialize(Expr.from(EVERY))).toEqual('$');
      expect(serialize(Expr.from(OR))).toEqual('|');
      expect(serialize(Expr.from(NOT))).toEqual('!');
      expect(serialize(Expr.from(LIKE))).toEqual('~');
      expect(serialize(Expr.from(EXACT_EQ))).toEqual('==');
      expect(serialize(Expr.from(EQUAL))).toEqual('=');
      expect(serialize(Expr.from(LESS_EQ))).toEqual('<=');
      expect(serialize(Expr.from(LESS))).toEqual('<');
      expect(serialize(Expr.from(GREATER_EQ))).toEqual('>=');
      expect(serialize(Expr.from(GREATER))).toEqual('>');
    });

    test('should return literal values on unknown types', () => {
      expect(literal({ value: 'OK' })).toEqual('OK');
    });
  });

  describe('Formatting', () => {
    test('should add commas between values', () => {
      expect(serialize(Parser.getAST('x = a b c'))).toEqual('x = a, b, c');
    });

    test('should add white-space around operators', () => {
      expect(serialize(Parser.getAST('1 2 3'))).toEqual('1 + 2 + 3');
    });

    test('should add white-space around single operators', () => {
      expect(serialize(Parser.getAST('n-1'))).toEqual('n - 1');
    });

    test('should add white-space around mixed operators', () => {
      expect(serialize(Parser.getAST('a>>b'))).toEqual('a>> b');
      expect(serialize(Parser.getAST('a+=b'))).toEqual('a += b');

      expect(serialize(Parser.getAST('[1,2]~4..6'))).toEqual('[1, 2] ~ 4..6');
      expect(serialize(Parser.getAST('[1,2]++4..6'))).toEqual('[1, 2] ++ 4..6');

      expect(serialize(Parser.getAST('i+=j.\ni-=j'))).toEqual('i += j.\ni -= j');
    });

    test('should keep repeated-operators around literals', () => {
      expect(serialize(Parser.getAST('a ++ b'))).toEqual('a++ b');
      expect(serialize(Parser.getAST('1 ++ b'))).toEqual('1 ++b');

      expect(serialize(Parser.getAST('n -- 0'))).toEqual('n-- 0');
      expect(serialize(Parser.getAST('(> n -- 0)'))).toEqual('(> n-- 0)');

      expect(serialize(Parser.getAST('n --.\n-- n'))).toEqual('n--.\n--n');
      expect(serialize(Parser.getAST('n ++.\n++ n'))).toEqual('n++.\n++n');
    });

    test('should add no white-space around range-expressions', () => {
      expect(serialize(Parser.getAST('[ - 1 ..3 ]'))).toEqual('[-1..3]');
      expect(serialize(Parser.getAST('1 .. 3'))).toEqual('1..3');
      expect(serialize(Parser.getAST('[ 1 .. 3 ] , 4 , 5'))).toEqual('[1..3], 4, 5');

      expect(serialize(Parser.getAST('[ - 10 .. 10 ] :-19..3'))).toEqual('[-10..10]:-19..3');
      expect(serialize(Parser.getAST('[ [ - 10 .. 10 ] :1..3 ]'))).toEqual('[[-10..10]:1..3]');
    });

    test('should add no white-space around function-calls', () => {
      expect(serialize(Parser.getAST('fact(n-1)'))).toEqual('fact(n - 1)');
      expect(serialize(Parser.getAST('foo.bar()'))).toEqual('foo.bar()');
    });

    test('should add delimiters where appropriate', () => {
      expect(serialize(Parser.getAST('[1 2 3]'))).toEqual('[1 + 2 + 3]');
      expect(serialize(Parser.getAST('@import a, b @from "c".\n'))).toEqual('@import a, b @from "c".\n');
    });

    test('should add white-space between units', () => {
      Env.register = Expr.Unit.from;

      expect(serialize(Parser.getAST('1cm'))).toEqual('1 cm');

      Env.register = () => null;
    });

    test('should keep markdown formatting', () => {
      expect(stringify(example('markdown.md'))).toEqual(example('markdown.md'));
    });

    test('should run concat.md example', async () => {
      expect(await run(example('concat.md'))).toEqual([Expr.array([1, 2, 4, 5, 6, 7, 8, 9].map(Expr.value))]);
    });

    test('should run fib_loop.md example', async () => {
      const result = await run(example('fib_loop.md'));
      expect(result.map(r => r.value)).toEqual([
        '1', '1', '2', '3', '5', '8', '13', '21', '34', '55',
        '89', '144', '233', '377', '610', '987', '1597', '2584', '4181', '6765', '10946',
      ]);
    });

    test('should run fib_memo.md example', async () => {
      expect(await run(example('fib_memo.md'))).toEqual([Expr.value(10946)]);
    });

    test('should order sibling items in ordered lists', () => {
      expect(stringify(deindent(`
        1. a
        1. b
        1. c
          1. x
            1. m
            1. n
          1. y
          1. z
        1. d

        Some text...

        1. foo
        1. bar

        More text...

        1. baz
        1. buzz
      `), {})).toEqual(deindent(`
        1. a
        2. b
        3. c
          1. x
            1. m
            2. n
          2. y
          3. z
        4. d

        Some text...

        1. foo
        2. bar

        More text...

        1. baz
        2. buzz
      `));
    });

    test('should apply formatting on foreign values', async () => {
      Env.resolve = source => ({
        Test: {
          sample: {
            num: 42,
            str: 'OK',
            arr: [1, 2, 3],
            obj: { k: 'v' },
            undef: undefined,
          },
        },
      })[source];

      const result = await run('@import sample @from "Test".\nsample');

      expect(serialize(result)).toEqual('(:num 42, :str "OK", :arr [1, 2, 3], :obj (:k "v"), :undef undefined)');
    });

    test('should apply formatting on callstack chunks', async () => {
      await run('sum=a->b->a+b.\nadd3=sum(3).\nadd3', null, true);

      const chunks = [
        'sum = (a b) -> a + b.\nadd3 = sum(3).\nadd3',
        'sum(3)',
        '(a b) -> a + b',
      ];

      run.info.calls.forEach((ast, i) => {
        expect(serialize(ast[2], true)).toEqual(chunks[i]);
      });
    });

    test('should apply formatting on results', async () => {
      expect(serialize(await run('[1, 2], 3'))).toEqual('[1, 2], 3');
    });

    test('should inline formatted code', () => {
      const sample = deindent(`
        fib = n ->
          @if (< n 2) 1, (< n 1) 0
          @else fib(n - 1) + fib(n - 2)
          .

        fib!(20).
      `);

      const result = 'fib = n -> @if (< n 2) 1, (< n 1) 0 @else fib(n - 1) + fib(n - 2).\nfib!(20).\n';

      expect(serialize(Parser.getAST(sample))).toEqual(result);
      expect(serialize(Parser.getAST(sample, 'raw'))).toEqual(sample);
      expect(serialize(Parser.getAST(sample, 'inline'))).toEqual(result);
    });

    test('should inline formatted code', () => {
      const sample = deindent(`
        @template >> ((a b) -> [a, b], 42).

        -1 >> 2.
      `);

      const result = '([-1, 2], 42).\n';

      const resolved = '@template >> ((a b) -> [a, b], 42).\n-1 >> 2.\n';

      expect(serialize(Parser.getAST(sample))).toEqual(result);
      expect(serialize(Parser.getAST(sample, 'raw'))).toEqual(sample);
      expect(serialize(Parser.getAST(sample, 'inline'))).toEqual(resolved);
    });

    test('should inline formatted code (basic templates)', () => {
      const sample1 = deindent(`
        @import puts, err, input @from "IO".

        @let buffer = input().

        @if (~ buffer :nil)
          err("No input provided.\\n")
        @else
          puts("Thank you! Your input:\\n<![[CDATA[\\n#{buffer}\\n]>!").
      `);

      const logic = '@if (~ buffer :nil) err("No input provided.\\n") @else puts("Thank you! Your input:\\n<![[CDATA[\\n#{buffer}\\n]>!").\n';

      const result1 = `@import puts, err, input @from "IO".\n@let buffer = input().\n${logic}`;

      expect(serialize(Parser.getAST(sample1))).toEqual(result1);
      expect(serialize(Parser.getAST(sample1, 'raw'))).toEqual(sample1);
      expect(serialize(Parser.getAST(sample1, 'inline'))).toEqual(result1);

      const sample2 = deindent(`
        @template
          += ((a b) -> @let a = a + b),
          -- (a -> @let a = a - 1).

        fib = n ->
          @let
            a = 1, b = 0, temp = 0
          /* test */
          @while (>= n-- 0)
            temp = a, a += b, b = temp, b
          .

        // test
        fib(20).
      `);

      const resolved = 'fib = n -> @let a = 1, b = 0, temp = 0 /* test */ '
        + '@while (>= (n, @let n = n - 1) 0), temp = a, (@let a = a + b), b = temp, b.\n\n// test\nfib(20).\n';

      const result = 'fib = n -> @let a = 1, b = 0, temp = 0 /* test */ @while (>= n-- 0), temp = a, (a += b), b = temp, b.\n\n// test\nfib(20).\n';

      const inline = `@template += ((a b) -> @let a = a + b), -- (a -> @let a = a - 1).\n${result}`;

      expect(serialize(Parser.getAST(sample2))).toEqual(resolved);
      expect(serialize(Parser.getAST(sample2, 'raw'))).toEqual(sample2);
      expect(serialize(Parser.getAST(sample2, 'inline'))).toEqual(inline);
    });

    test('should inline formatted code (advanced templates)', () => {
      const sample = deindent(`
        @template
          => ((k v) -> @if ([argv.flags]:(k)) v).

        @let argv = getopts(
          :boolean [:ask, :help],
          :alias (:h :help),
        ).

        usageInfo = """
          Usage info:

          -h, --help  Display this info
        """.

        messageOutput =
          :help => usageInfo | :ask => (
            puts("Ask mode!").
            "got it"
          ) | "missing #{usageInfo}".

        puts(messageOutput).
      `);

      const result = serialize(Parser.getAST(sample));
      expect(result).toContain('usageInfo');
      expect(result).toContain('#{usageInfo}');
    });
  });
});
