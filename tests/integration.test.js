/* eslint-disable no-unused-expressions */

import fs from 'fs';
import path from 'path';

import tk from 'timekeeper';
import { expect } from 'chai';
import { stdout } from 'stdout-stderr';

import { summary } from '../src/util';
import { execute as run, evaluate } from '../src/lib';
import { useCurrencies } from '../src/lib/builtins';

import {
  Token, debug, hasDiff, copy, literal, serialize, deindent,
} from '../src/lib/helpers';

import {
  EOL, PLUS, MINUS, MUL, TEXT, BLOCK, NUMBER, LITERAL, UL_ITEM, OL_ITEM, HEADING, BLOCKQUOTE,
  TUPLE, OPEN, CLOSE, COMMA, BEGIN, DONE, DOT, DIV, RANGE, SOME, EVERY, OR, EQUAL, LESS,
  MOD, PIPE, SYMBOL, NOT_EQ, NOT, LIKE, EXACT_EQ, LESS_EQ, GREATER_EQ, GREATER,
} from '../src/lib/tree/symbols';

import Expr from '../src/lib/tree/expr';
import Env from '../src/lib/tree/env';
import Parser from '../src/lib/tree/parser';
import Scanner from '../src/lib/tree/scanner';

tk.freeze(1577858400000);

/* global describe, beforeEach, afterEach, it */

function stringify(source, ctx) {
  return new Scanner(source).scanTokens().map(x => serialize.call(ctx, x)).join('');
}

function example(src) {
  return fs.readFileSync(path.join(__dirname, '../examples', src)).toString();
}

describe('Integration', () => {
  const token = { type: 'x', value: 'y' };
  const value = Symbol('OK');

  it('should fail on invalid tokens', () => {
    expect(() => Token.get()).to.throw('Invalid token');
  });

  it('should wrap well-known values as tokens', () => {
    expect(Expr.value(42)).to.eql(Expr.value(42));
    expect(Expr.value('foo')).to.eql(Expr.value('foo'));
    expect(Expr.value(null)).to.eql(Expr.value(null));
    expect(Expr.value(true)).to.eql(Expr.value(true));
    expect(Expr.value(false)).to.eql(Expr.value(false));
    expect(Expr.value([false])).to.eql(Expr.array([Expr.value(false)]));
  });

  it('should keep objects as plain literals', () => {
    expect(Expr.value({ foo: 'bar' })).to.eql(Expr.map({ foo: 'bar' }));
  });

  it('should keep instances without wrapping', () => {
    class Dummy {}
    const instance = new Dummy();

    expect(Expr.value(instance)).to.eql(Expr.value(instance));
  });

  it('should wrap unknown values as LITERAL tokens', () => {
    expect(Expr.value(value)).to.eql(Expr.value(value));
  });

  it('should wrap lists of tokens as Expr symbols', () => {
    expect(Expr.from([new Expr(token)])).to.eql([token]);
  });

  it('should parse markdown-tags within TEXT values', () => {
    expect(Expr.text('- fun')).to.eql({
      type: TEXT,
      value: {
        buffer: ['fun'],
        kind: UL_ITEM,
      },
    });

    expect(Expr.text('## fun')).to.eql({
      type: TEXT,
      value: {
        buffer: ['fun'],
        level: 2,
        kind: HEADING,
      },
    });

    expect(Expr.text('> fun')).to.eql({
      type: TEXT,
      value: {
        buffer: ['fun'],
        kind: BLOCKQUOTE,
      },
    });

    expect(Expr.text('1111. fun')).to.eql({
      type: TEXT,
      value: {
        buffer: ['fun'],
        level: 1111,
        kind: OL_ITEM,
      },
    });
  });

  it('should allow to set/update environment locals', async () => {
    const env = new Env();

    env.set('test', { body: [Expr.value(0)] });
    Env.up('test', 'Tets', () => 42, env);

    expect(env.get('test')).to.eql({
      body: [Expr.value(42)],
    });
  });

  it.skip('should share templates through top-level environment', async () => {
    const env = new Env();

    await run(':template <> (a, b -> (!= a b))', env);

    expect(await run('1 <> 2', env)).to.eql([Expr.value(true)]);
  });

  it.skip('should allow call locals from other environments', async () => {
    stdout.start();

    const a = new Env();
    const b = new Env();

    await run(`
      :from "Prelude" :import check, items;
      :from "IO" :import puts;

      test = desc, block -> (
        output = block() | :nil;
        failed = (? output :nil);
        puts("# #{failed ? "not ok" | "ok"} — #{desc}\n");
        :if (failed) puts("  - ", items(output).join("\n  - "), "\n");
      );
    `, b);

    a.defn('proxy', {
      body: [Expr.fn({
        env: b, label: 'Proxy/test', target: 'test',
      }, { line: 0, col: 0 })],
    }, { line: 0, col: 0 });

    const result = await run(`
      proxy("msg", -> (
        check((= 1 2));
      ));
    `, a);

    stdout.stop();

    if (run.failure) throw run.failure;

    expect(stdout.output).to.eql(`${deindent(`
      # not ok — msg
        - \`(= 1 2)\` did not passed
    `)}\n`);

    expect(result).to.eql([]);
  });

  describe('Diffing', () => {
    const a = Parser.getAST('[1, :foo "bar"]');
    const b = Parser.getAST('[1, :foo "bar"]');

    it('should help to strictly compare any value', () => {
      expect(hasDiff(0, 1)).to.be.true;
      expect(hasDiff([0], [])).to.be.true;
      expect(hasDiff([0], [0])).to.be.false;
      expect(hasDiff({ x: 1 }, { x: 0 })).to.be.true;
      expect(hasDiff({ x: 0 }, { x: 0 })).to.be.false;
    });

    it('should compare full tokens in strict-mode', () => {
      expect(hasDiff(a, b)).to.be.false;
    });

    it('should help to compare any value in weak-mode', () => {
      expect(hasDiff(0, '0', true)).to.be.false;
      expect(hasDiff(a, copy(a), true)).to.be.false;
    });

    it('should compare type and value from any given token', () => {
      expect(hasDiff(Expr.value(0), Expr.value('0'))).to.be.true;
      expect(hasDiff(Expr.value(0), Expr.value('0'), true)).to.be.false;
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

      it('should allow fractions as regular units', async () => {
        expect(await run('1/2 thing')).to.eql([Expr.unit(0.5, 'thing')]);
      });

      it('should allow to register external units', async () => {
        expect(await run('1x')).to.eql([Expr.unit(1, 'x')]);
      });

      it('should respond to most basic math-calls', async () => {
        expect(await run('3 - 2a')).to.eql([Expr.value(1)]);
        expect(await run('4mm % 2')).to.eql([Expr.unit(0, 'mm')]);
        expect(await run('3cm - 2cm')).to.eql([Expr.unit(1, 'cm')]);
        expect(await run('1cm + 1.5in')).to.eql([Expr.unit(1.8937008, 'in')]);
        expect(await run('7 d / 2')).to.eql([Expr.unit(3.5, 'd')]);
        expect(await run('; 3cm * 1.5mm')).to.eql([Expr.unit(45, 'mm')]);
      });

      it('should allow to work with fractions', async () => {
        expect(await run(`
          :import (:default Frac) :from "Frac";
          Frac.from(12);
          Frac.from(.5);
          Frac.from(.005);
        `)).to.eql([Expr.value(12), Expr.frac(1, 2), Expr.frac(1, 200)]);

        expect(await run(':import (:default fr) :from "Frac"; fr(1, 2)')).to.eql([Expr.frac(1, 2)]);
      });

      it('should convert between currencies', async () => {
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

        expect(await run(':import to, MXN :from "Unit"; 1000USD to MXN')).to.eql([
          Expr.unit(18594.908688433865, 'MXN'),
        ]);
      });

      it('should convert between values', async () => {
        expect(await run(`
          :import to, inches, convert :from "Unit";
          convert(5, :cm, :in);
          2 cm to inches
        `)).to.eql([
          Expr.unit(1.9685040000000003, 'in'),
          Expr.unit(0.7874016, 'in'),
        ]);
      });

      it('should allow to compare between units', async () => {
        expect(await run('(> 1cm 2cm)')).to.eql([Expr.value(false)]);
      });

      it('should set value of unit-less calls', () => {
        expect(new Expr.Unit(1, 'cm').from(-1)).to.eql(Expr.unit(-1, 'cm').value);
      });

      it('should return values from alised units', () => {
        expect(Expr.Unit.exists('d')).to.eql('d');
        expect(Expr.Unit.exists('day')).to.eql('d');
        expect(Expr.Unit.exists('days')).to.eql('d');
      });

      it('should return nothing on missing units', () => {
        expect(Expr.Unit.from(1, 'foo')).to.be.undefined;
      });

      it('should evaluate other literals as units', async () => {
        Env.register = Expr.Unit.from;

        expect(await run(':import (:MXN pesos) :from "Unit"; 15pesos')).to.eql([Expr.unit(15, 'MXN')]);
      });
    });
  });

  describe('Callstack', () => {
    const err = new Error('Oh noes!');
    const code = 'FIXME';

    err.prevToken = Expr.from(TEXT, code, { line: 0, col: 0 });
    err.stack = '';

    it('should repair errors before formatting', () => {
      expect(debug(new Error('Unexpected!'))).to.eql('Unexpected!');

      const test = debug(err, code);

      expect(test).to.contains('at `FIXME` at line 1:1');
      expect(test).to.contains('1 | FIXME');

      expect(debug(new Error('FIXME: at line 0:0'), '', true)).not.to.contains('at line 0:0');
    });

    it('should report failures on formatting', async () => {
      try {
        await run('"\n"');
      } catch (e) {
        expect(summary(e, '"\n"')).to.contains('Unexpected `\\n` character at line 1:2');
      }
    });

    it('should report previous token from callstack', () => {
      err.prevToken = undefined;
      err.stack = undefined;
      err.line = 0;
      err.col = 0;

      expect(debug(err, code)).to.eql(`${deindent(`
        Oh noes!

             1 | FIXME
        ---------^
      `)}\n`);
    });

    it('should allow formatting of single errors', async () => {
      let error;

      try {
        await run('x');
      } catch (e) {
        error = e;
      } finally {
        expect(debug(error)).to.eql('Undeclared local `x` at line 1:1 (Eval)');
        expect(debug(error, 'x')).to.eql([
          'Undeclared local `x` at line 1:1 (Eval)',
          '',
          '     1 | x',
          '---------^',
          '',
        ].join('\n'));
      }
    });

    it('should allow formatting of nested errors', async () => {
      let error;

      try {
        await run('x = y ; x');
      } catch (e) {
        error = e;
      } finally {
        expect(debug(error)).to.eql('Undeclared local `y` at line 1:5 (Lit)');
        expect(debug(error, 'x = y ; x')).to.eql([
          'Undeclared local `y` at line 1:5 (Lit)',
          '  at `;` at line 1:7',
          '',
          '     1 | x = y ; x',
          '-------------^',
          '',
        ].join('\n'));
      }
    });

    it('should report callstack if enabled', async () => {
      await run('x = 42; y = x * 2; 3y', null, true);

      const x = [Expr.value(42)];
      const y = [Expr.local('x'), Expr.from(MUL, '*'), Expr.value(2)];

      expect(run.info.enabled).to.be.true;
      expect(run.info.depth).to.eql(0);
      expect(run.info.calls).to.eql([
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

    it('should allow tu parse/format on debug', async () => {
      const e = new Error('OK');

      e.stack = e.message;
      e.line = 0;
      e.col = 1;

      expect(debug(e, '1+2', false, source => Parser.getAST(source, null).map(x => x.value).join(''))).to.eql(`${deindent(`
        OK

             1 | 1+2
        ----------^
      `)}\n`);
    });

    it('should cut around the errored line', async () => {
      const e = new Error('OK');

      e.stack = e.message;
      e.line = 6;
      e.col = 0;

      expect(debug(e, '-\n-\n-\n-\n-\n-\n+\n-\n-\n-\n-\n-')).to.eql(`${deindent(`
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
    it('should allow wrapping functions to keep tokenInfo', async () => {
      const type = Expr.unsafe(t => t.type);
      const undef = Expr.unsafe(() => undefined);
      const truth = Expr.unsafe(() => Expr.value(true));

      Env.resolve = source => ({
        Test: { type, truth, undef },
      })[source];

      const result = await run(':import type, undef, truth :from "Test"; type(42); truth(); undef()');

      expect(result).to.eql([Expr.from(LITERAL, NUMBER), Expr.value(true)]);
    });

    it('should transform tokens into plain-values', async () => {
      expect(Expr.plain(await run('1..3'))).to.eql([[1, 2, 3]]);
      expect(Expr.plain(await run(':foo "bar"'))).to.eql([{ foo: 'bar' }]);
      expect(Expr.plain(await run(':foo "bar", "buzz"'))).to.eql([{ foo: ['bar', 'buzz'] }]);
      expect(Expr.plain(await run(':import fromCharCode :from "String"; fromCharCode'))).to.eql([String.fromCharCode]);
    });

    it('should export definitions as functions', async () => {
      const env = new Env();
      const [sum] = Expr.plain(await run('sum=a->b->a+b;sum', env));

      expect(await evaluate(sum(1, 3), env)).to.eql({
        info: { calls: [], depth: 0, enabled: undefined },
        error: undefined,
        result: [Expr.value(4)],
      });
    });

    it('should run through any callback if given', async () => {
      const output = [];
      const source = await run('sum=a,b->a+b;sum');
      const result = Expr.plain(source, async (call, args) => {
        output.push({ call, args });
      });

      await result[0]();

      expect(output).to.eql([{
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

    it('should convert-back values from foreign-calls', async () => {
      Env.resolve = source => ({
        Fun: { test: fn => fn(1, 2) },
        Test: { nested: { noop: () => {} } },
      })[source];

      expect(await run(':import test :from "Fun";sum=a,b->a+b;test(sum)')).to.eql([Expr.value(3)]);
      expect(await run(':import nested :from "Test";nested.noop()')).to.eql([]);

      expect(await run(`
        :import (:test fun) :from "Fun";
        x = fun(a, b -> [a, b]);
        :if (== x [1, 2]) 42;
      `)).to.eql([Expr.value(42)]);
    });

    it('should allow most values as literals', async () => {
      const Url = require('url');

      Env.resolve = source => ({
        Test: {
          obj: { foo: { nested: 'bar' } },
          mixed: { location: Url.parse('/'), twice: n => n * 2 },
        },
      })[source];

      expect(await run(':import obj :from "Test"; obj.foo.nested')).to.eql([Expr.value('bar')]);
      expect(await run(':import (:default test) :from "Test"; test.obj.foo.nested')).to.eql([Expr.value('bar')]);
      expect(await run(':import mixed :from "Test"; mixed.location.path; mixed.twice(21)')).to.eql([Expr.value('/'), Expr.value(42)]);
    });
  });

  describe('Serialization', () => {
    it('should serialize scalar values', () => {
      expect(serialize(null)).to.eql(':nil');
      expect(serialize(true)).to.eql(':on');
      expect(serialize(false)).to.eql(':off');
      expect(serialize('OK')).to.eql('OK');
      expect(serialize(42)).to.eql(42);
    });

    it.skip('should serialize string types', () => {
      expect(serialize(Parser.getAST(deindent(`
        tpl = <div>
          #{42}
        </div>;
      `)))).to.eql('tpl = <div>\n  #{42}\n</div>;');

      expect(serialize(Parser.getAST(deindent(`
        tpl = """
          <div>
            #{42}
          </div>
        """;
      `)))).to.eql('tpl = """<div>\n  #{42}\n</div>""";');

      expect(Parser.getAST('"EXAMPLE"').join('')).to.eql('"..."');

      expect(serialize(Parser.getAST('<div>X</div>'))).to.eql('<div>X</div>');
      expect(serialize(Parser.getAST('<div>X</div>'), true)).to.eql('<.../>');

      expect(serialize(Parser.getAST('"#{bar}"'))).to.eql('"#{bar}"');
      expect(serialize(Parser.getAST('"#{42}x"'))).to.eql('"#{42}x"');
      expect(serialize(Parser.getAST('"x:#{1+2}"'))).to.eql('"x:#{1 + 2}"');
      expect(serialize(Parser.getAST('"foo"+"bar"'))).to.eql('"foo" + "bar"');
      expect(serialize(Parser.getAST('"foo: #{bar}"'))).to.eql('"foo: #{bar}"');
      expect(serialize(Parser.getAST('"#{foo}: bar"'))).to.eql('"#{foo}: bar"');

      expect(serialize('"foo#{1 2 3 4}!!"')).to.eql('"foo#{1 2 3 4}!!"');
      expect(serialize('"foo#{bar / 2 + "BUZZ"}!!"')).to.eql('"foo#{bar / 2 + "BUZZ"}!!"');
      expect(serialize('"foo#{bar / 2 + "BUZZ" + 2}!!"')).to.eql('"foo#{bar / 2 + "BUZZ" + 2}!!"');
    });

    it('should serialize mixed values', () => {
      const F = () => 42;
      F.x = () => -1;
      F.y = 2;

      expect(serialize(F)).to.eql('F()[:x :y]');
      expect(serialize(Symbol('TEST'))).to.eql('TEST');
      expect(serialize(new Date())).to.eql('"2020-01-01T06:00:00.000Z"');
      expect(serialize(() => -1)).to.eql('()');
      expect(serialize(/xxx/i)).to.eql('/xxx/i');
      expect(serialize(class X { constructor(a, b) { return [a, b]; } })).to.eql('X(a, b)');
    });

    it('should serialize other values', () => {
      expect(serialize({ foo: 'BAR' }, true)).to.eql(':foo');
      expect(serialize({ type: LITERAL, value: 'TEST' })).to.eql('TEST');
    });

    it.skip('should serialize on toString() calls', async () => {
      expect(Expr.value(undefined).toString()).to.eql('undefined');

      expect(Expr.fn(x => x).toString()).to.eql('(x)');
      expect(Expr.fn(function $(x) { return x; }).toString()).to.eql('$(x)');

      expect(Parser.getAST(':x?').join('')).to.eql(':x?');
      expect(Parser.getAST(':x? y').join('')).to.eql(':x?');

      expect(Parser.getAST('(< 1 2)').join('')).to.eql('(<)');
      expect(Parser.getAST('[1, 2, 3]').join('')).to.eql('[..]');
      expect(Parser.getAST('x=y->fn(y,..);').join('')).to.eql('x = y -> fn(y, ..);');

      expect((await run(':import map :from "Array"; map')).join('')).to.eql('Array/map');

      expect(serialize(Parser.getAST('[1, 2, 3]'))).to.eql('[1, 2, 3]');
      expect(serialize(Parser.getAST('[1..3:1]'))).to.eql('[1..3:1]');
      expect(serialize(Parser.getAST('[..,x]'))).to.eql('[.., x]');
      expect(serialize(Parser.getAST(':t 42'))).to.eql(':t 42');
      expect(serialize(Parser.getAST('1..3'))).to.eql('1..3');

      expect((await run('[1..3]')).join('')).to.eql('[..]');

      const fixedEnv = new Env();

      fixedEnv.defn('x', {
        body: [Expr.fn({
          env: fixedEnv, label: 'Proxy/test', target: 'test',
        }, { line: 0, col: 0 })],
      });

      Env.resolve = source => ({
        Other: fixedEnv,
      })[source];

      expect(serialize(await run(':import x :from "Other";x'))).to.eql('Other/x');
    });

    it('should serialize well-known symbols', () => {
      expect(serialize(Expr.from(OPEN))).to.eql('(');
      expect(serialize(Expr.from(CLOSE))).to.eql(')');
      expect(serialize(Expr.from(COMMA))).to.eql(',');
      expect(serialize(Expr.from(BEGIN))).to.eql('[');
      expect(serialize(Expr.from(DONE))).to.eql(']');
      expect(serialize(Expr.from(EOL))).to.eql(';');
      expect(serialize(Expr.from(DOT))).to.eql('.');
      expect(serialize(Expr.from(MINUS))).to.eql('-');
      expect(serialize(Expr.from(PLUS))).to.eql('+');
      expect(serialize(Expr.from(MOD))).to.eql('%');
      expect(serialize(Expr.from(MUL))).to.eql('*');
      expect(serialize(Expr.from(DIV))).to.eql('/');
      expect(serialize(Expr.from(PIPE))).to.eql('|>');
      expect(serialize(Expr.from(BLOCK))).to.eql('->');
      // expect(serialize(Expr.from(TUPLE))).to.eql('->');
      expect(serialize(Expr.from(RANGE))).to.eql('..');
      expect(serialize(Expr.from(SYMBOL))).to.eql(':');
      expect(serialize(Expr.from(NOT_EQ))).to.eql('!=');
      expect(serialize(Expr.from(SOME))).to.eql('?');
      expect(serialize(Expr.from(EVERY))).to.eql('$');
      expect(serialize(Expr.from(OR))).to.eql('|');
      expect(serialize(Expr.from(NOT))).to.eql('!');
      expect(serialize(Expr.from(LIKE))).to.eql('~');
      expect(serialize(Expr.from(EXACT_EQ))).to.eql('==');
      expect(serialize(Expr.from(EQUAL))).to.eql('=');
      expect(serialize(Expr.from(LESS_EQ))).to.eql('<=');
      expect(serialize(Expr.from(LESS))).to.eql('<');
      expect(serialize(Expr.from(GREATER_EQ))).to.eql('>=');
      expect(serialize(Expr.from(GREATER))).to.eql('>');
    });

    it('should return literal values on unknown types', () => {
      expect(literal({ value: 'OK' })).to.eql('OK');
    });
  });

  describe('Formatting', () => {
    it.skip('should add commas between values', () => {
      expect(serialize(Parser.getAST('x = a b c'))).to.eql('x = a, b, c');
    });

    it('should add white-space around operators', () => {
      expect(serialize(Parser.getAST('; 1 2 3'))).to.eql('; 1 + 2 + 3');
    });

    it('should add white-space around single operators', () => {
      expect(serialize(Parser.getAST('n-1'))).to.eql('n - 1');
    });

    it('should add white-space around mixed operators', () => {
      expect(serialize(Parser.getAST('a>>b'))).to.eql('a>> b');
      expect(serialize(Parser.getAST('a+=b'))).to.eql('a += b');

      expect(serialize(Parser.getAST('[1,2]~4..6'))).to.eql('[1, 2] ~ 4..6');
      expect(serialize(Parser.getAST('[1,2]++4..6'))).to.eql('[1, 2] ++ 4..6');

      expect(serialize(Parser.getAST('i+=j; i-=j'))).to.eql('i += j; i -= j');
    });

    it('should keep repeated-operators around literals', () => {
      expect(serialize(Parser.getAST('a ++ b'))).to.eql('a++ b');
      expect(serialize(Parser.getAST('1 ++ b'))).to.eql('1 ++b');

      expect(serialize(Parser.getAST('n -- 0'))).to.eql('n-- 0');
      expect(serialize(Parser.getAST('(> n -- 0)'))).to.eql('(> n-- 0)');

      expect(serialize(Parser.getAST('n --; -- n'))).to.eql('n--; --n');
      expect(serialize(Parser.getAST('n ++; ++ n'))).to.eql('n++; ++n');
    });

    it('should add no white-space around range-expressions', () => {
      expect(serialize(Parser.getAST('[ - 1 ..3 ]'))).to.eql('[-1..3]');
      expect(serialize(Parser.getAST('1 .. 3'))).to.eql('1..3');
      expect(serialize(Parser.getAST('[ 1 .. 3 ] , 4 , 5'))).to.eql('[1..3], 4, 5');

      expect(serialize(Parser.getAST('[ - 10 .. 10 ] :-19..3'))).to.eql('[-10..10]:-19..3');
      expect(serialize(Parser.getAST('[ [ - 10 .. 10 ] :1..3 ]'))).to.eql('[[-10..10]:1..3]');
    });

    it('should add no white-space around function-calls', () => {
      expect(serialize(Parser.getAST('fact(n-1)'))).to.eql('fact(n - 1)');
      expect(serialize(Parser.getAST('foo.bar()'))).to.eql('foo.bar()');
    });

    it.skip('should add delimiters where appropriate', () => {
      expect(serialize(Parser.getAST('[1 2 3]'))).to.eql('[1 + 2 + 3]');
      expect(serialize(Parser.getAST(':import a, b :from "c";'))).to.eql(':import a, b :from "c";');
    });

    it('should add white-space between units', () => {
      Env.register = Expr.Unit.from;

      expect(serialize(Parser.getAST('1cm'))).to.eql('1 cm');

      Env.register = () => null;
    });

    it('should keep markdown formatting', () => {
      expect(stringify(example('markdown.x'))).to.eql(example('markdown.x'));
    });

    it('should order sibling items in ordered lists', () => {
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
      `), {})).to.eql(deindent(`
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

    it('should apply formatting on foreign values', async () => {
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

      const result = await run(':import sample :from "Test";sample');

      expect(serialize(result)).to.eql('(:num 42, :str "OK", :arr [1, 2, 3], :obj (:k "v"), :undef undefined)');
    });

    it.skip('should apply formatting on callstack chunks', async () => {
      await run('sum=a->b->a+b;add3=sum(3);add3', null, true);

      const chunks = [
        'sum = a, b -> a + b; add3 = sum(3); add3',
        'sum(3)',
        'a, b -> a + b',
      ];

      run.info.calls.forEach((ast, i) => {
        expect(serialize(ast[2], true)).to.eql(chunks[i]);
      });
    });

    it('should apply formatting on results', async () => {
      expect(serialize(await run('[1, 2], 3'))).to.eql('[1, 2], 3');
    });

    it.skip('should inline formatted code', () => {
      const sample = deindent(`
        fib = n ->
          :if (< n 2) 1, (< n 1) 0
          :else fib(n - 1) + fib(n - 2)
          ;

        fib!(20);
      `);

      const result = deindent(`
        fib = n -> :if (< n 2) 1, (< n 1) 0 :else fib(n - 1) + fib(n - 2); fib!(20);
      `);

      expect(serialize(Parser.getAST(sample))).to.eql(result);
      expect(serialize(Parser.getAST(sample, null))).to.eql(sample);
      expect(serialize(Parser.getAST(sample, false))).to.eql(result);
    });

    it.skip('should inline formatted code', () => {
      const sample = deindent(`
        :template >> (a, b -> [a, b], 42);

        -1 >> 2;
      `);

      const result = deindent(`
        ([-1, 2], 42);
      `);

      const resolved = deindent(`
        :template >> (a, b -> [a, b], 42); -1 >> 2;
      `);

      expect(serialize(Parser.getAST(sample))).to.eql(result);
      expect(serialize(Parser.getAST(sample, null))).to.eql(sample);
      expect(serialize(Parser.getAST(sample, false))).to.eql(resolved);
    });

    it.skip('should inline formatted code (basic templates)', () => {
      const sample1 = deindent(`
        :import puts, err, input :from "IO";

        :let buffer = input();

        :if (~ buffer :nil)
          err("No input provided.\n")
        :else
          puts("Thank you! Your input:\n<![[CDATA[\n#{buffer}\n]>");
      `);

      const logic = ':if (~ buffer :nil) err("No input provided.\n") :else puts("Thank you! Your input:\n<![[CDATA[\n#{buffer}\n]>");';

      const result1 = deindent(`
        :import puts, err, input :from "IO"; :let buffer = input(); ${logic}
      `);

      expect(serialize(Parser.getAST(sample1))).to.eql(result1);
      expect(serialize(Parser.getAST(sample1, null))).to.eql(sample1);
      expect(serialize(Parser.getAST(sample1, false))).to.eql(result1);

      const sample2 = deindent(`
        :template
          += (a, b -> :let a = a + b),
          -- (a -> :let a = a - 1);

        fib = n ->
          :let
            a = 1, b = 0, temp = 0
          /* test */
          :while (>= n-- 0)
            temp = a, a += b, b = temp, b
          ;

        // test
        fib(20);
      `);

      const resolved = deindent(`
        fib = n -> :let a = 1, b = 0, temp = 0 /* test */ :while (>= (n, :let n = n - 1) 0), temp = a, (:let a = a + b), b = temp, b;
        // test
        fib(20);
      `);

      const result = deindent(`
        fib = n -> :let a = 1, b = 0, temp = 0 /* test */ :while (>= n-- 0), temp = a, (a += b), b = temp, b;
        // test
        fib(20);
      `);

      const inline = deindent(`
        :template += (a, b -> :let a = a + b), -- (a -> :let a = a - 1); ${result}
      `);

      expect(serialize(Parser.getAST(sample2))).to.eql(resolved);
      expect(serialize(Parser.getAST(sample2, null))).to.eql(sample2);
      expect(serialize(Parser.getAST(sample2, false))).to.eql(inline);
    });

    it.skip('should inline formatted code (advanced templates)', async () => {
      const sample = deindent(`
        :import puts, input :from "IO";
        :import getopts :from "Proc";

        :template
          => (k, v -> :if ([argv.flags]:(k)) v);

        :let argv = getopts(
          :boolean [:ask, :help],
          :alias (:h :help),
        );

        usageInfo = "
          Usage info:

          -h, --help  Display this info
              --ask   Prompts user for input
        ";

        messageOutput =
          :help => usageInfo | :ask => (
            puts("\\nPlease ask a few questions:\\n\\n");

            :let ask = input([
              (:type :text, :name :foo, :message "A"),
              (:type "text" :name "bar" :message "B"),
            ]);

            "\\nGot: #{ask.bar} (#{(~ ask.foo 42) ? "Gotcha!" | ":("})\\n";
          ) | "\\nMissing input.\\n#{usageInfo}";

        puts(messageOutput, "\\n");
      `);

      const prompt = ':let ask = input([(:type :text, :name :foo, :message "A"), (:type "text", :name "bar", :message "B"),])';
      const prelude = ':template => (k, v -> :if ([argv.flags]:(k)) v); :let argv = getopts(:boolean [:ask, :help], :alias (:h :help))';

      const resolved = deindent(`
        :import puts, input :from "IO"; :import getopts :from "Proc"; :let argv = getopts(:boolean [:ask, :help], :alias (:h :help)); usageInfo = "
          Usage info:

          -h, --help  Display this info
              --ask   Prompts user for input
        "; messageOutput = (:if ([argv.flags]:(:help)) usageInfo) | (:if ([argv.flags]:(:ask)) (puts("\\nPlease ask a few questions:\\n\\n"); ${
          prompt
        }; "\\nGot: #{ask.bar} (#{(~ ask.foo 42) ? "Gotcha!" | ":("})\\n";)) | "\\nMissing input.\\n#{usageInfo}"; puts(messageOutput, "\\n");
      `);

      const result = deindent(`
        :import puts, input :from "IO"; :import getopts :from "Proc"; ${prelude}; usageInfo = "
          Usage info:

          -h, --help  Display this info
              --ask   Prompts user for input
        "; messageOutput = :help => usageInfo | :ask => (puts("\\nPlease ask a few questions:\\n\\n"); ${
          prompt
        }; "\\nGot: #{ask.bar} (#{(~ ask.foo 42) ? "Gotcha!" | ":("})\\n";) | "\\nMissing input.\\n#{usageInfo}"; puts(messageOutput, "\\n");
      `);

      expect(serialize(Parser.getAST(sample))).to.eql(resolved);
      expect(serialize(Parser.getAST(sample, null))).to.eql(sample);
      expect(serialize(Parser.getAST(sample, false))).to.eql(result);
      expect(serialize(Parser.getAST(sample), true))
        .to.eql(':import :from; :import :from; :let; usageInfo = "..."; messageOutput = (:if) | (:if) | "..."; puts(messageOutput, "...");');
    });
  });
});
