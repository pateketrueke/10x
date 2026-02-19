/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { failWith } from './helpers';
import { execute as run } from '../src/lib';
import { CURRENCY_EXCHANGES, useCurrencies } from '../src/lib/builtins';

import Env from '../src/lib/tree/env';
import Eval from '../src/lib/tree/eval';
import Expr from '../src/lib/tree/expr';
import Range from '../src/lib/range';

describe('Errors', () => {
  describe('Eval', () => {
    it('should fail on invalid input', async () => {
      await failWith(() => Eval.run('xxx'), 'Given `"xxx"` as input!');

      const range = new Range(1, 2);
      const value = JSON.stringify(range);

      await failWith(Eval.run(['xxx']), 'Given `"xxx"` as token!');
      await failWith(Eval.run([range]), `Given \`${value}\` as token!`);
      await failWith(Eval.run([Expr.block()]), 'Given `null` as tokenInfo!');
    });
  });

  describe('Parse', () => {
    it('should fail on empty input', async () => {
      await failWith(run(''), 'Missing input at line 1:1');
    });

    it('should fail on unexpected chars', async () => {
      await failWith(run('ÿ'), 'Unexpected ÿ at line 1:1');
    });

    describe('REGEX', () => {
      it('should fail on invalid modifiers', async () => {
        await failWith(run('/x/y'), 'Unknown modifier `y` at line 1:4');
        await failWith(run('/x/gym'), 'Unknown modifier `y` at line 1:5');
      });
    });

    describe('STRING', () => {
      it('should fail on unterminated strings', async () => {
        await failWith(run('"foo'), 'Unterminated string at line 1:5');
        await failWith(run('"foo#{x"'), 'Expecting `}` at line 1:8');
        await failWith(run('"foo#{x + "foo}"'), 'Expecting `"` at line 1:15');
      });

      it('should report failures on interpolation', async () => {
        await failWith(run('"#{x}" % :nil'), 'Expecting map but found `:nil` at line 1:10');
        await failWith(run('"x:#{:nil+2}"'), 'Expecting string, number or symbol but found `:nil` at line 1:6');
      });

      it('should report failures on formatting', async () => {
        await failWith(run('"{} {}" % [1]'), 'Missing argument #2 at line 1:11');
        await failWith(run('"{}" % :nil'), 'Expecting block or list but found `:nil` at line 1:8');
        await failWith(run('"{}" % (:x 2)'), 'Expecting block or list but found `(:x)` at line 1:8');
      });

      it('should report failures on strings', async () => {
        const env = new Env();

        expect(await run('tag = "<div class=\\"#{"static #{foo}"}\\">"', env)).to.eql([]);
        expect(await run('tag', env)).to.be.undefined;

        expect(run.failure.message).to.contains('Undeclared local `foo`');
        expect(run.failure.line).to.eql(0);
        expect(run.failure.col).to.eql(32);
        expect(run.failure.prevToken).to.be.undefined;
      });

      it('should report failures within markup', async () => {
        const env = new Env();

        expect(await run('tag = <div class="#{"static #{bar}"}">x</div>', env)).to.eql([]);
        expect(await run('tag', env)).to.be.undefined;

        expect(run.failure.message).to.contains('Undeclared local `bar`');
        expect(run.failure.line).to.eql(0);
        expect(run.failure.col).to.eql(30);
        expect(run.failure.prevToken).to.be.undefined;
      });
    });

    it('should fail on unterminated comments', async () => {
      await failWith(run('/* foo'), 'Unterminated comment at line 1:7');
    });

    it('should fail if arguments are not literals', async () => {
      await failWith(run('x=y->4->3'), 'Expecting literal but found `4` at line 1:6');
      await failWith(run('x=y,1->42'), 'Expecting literal but found `1` at line 1:5');
      await failWith(run('x=y,..1->42'), 'Expecting literal but found `..` at line 1:5');
      await failWith(run('x=y,0..1->42'), 'Expecting literal but found `0` at line 1:5');
    });

    it('should report failures after comments', async () => {
      await failWith(run(`
        1 + /*
          ignore
          this
          text
        */ :nil
      `), 'Expecting string, number or symbol but found `:nil` at line 6:12');
    });

    describe('BLOCK / RANGE', () => {
      it('should fail if no closing ) or ] is found', async () => {
        await failWith(run('(a'), 'Expecting `)` at line 1:3');
        await failWith(run('\n[a'), 'Expecting `]` at line 2:3');
      });

      it('should fail if no opening ( or [ is found', async () => {
        await failWith(run('a)'), 'Expecting `(` before `)` at line 1:2');
        await failWith(run('\na]'), 'Expecting `[` before `]` at line 2:2');
      });

      it('should fail if closing ) or ] is found early', async () => {
        await failWith(run('[ ( a ]'), 'Expecting `)` but found `]` at line 1:7');
        await failWith(run('\n( [ a )'), 'Expecting `]` but found `)` at line 2:7');

        await failWith(run('  ( [4, [5, [6]] ) ];'), 'Expecting `]` but found `)` at line 1:18');
        await failWith(run('\n  [ (4, (5, (6)) ] );'), 'Expecting `)` but found `]` at line 2:18');
      });
    });
  });

  describe('Math', () => {
    it('should fail if MINUS is not followed by NUMBER', async () => {
      await failWith(run('-:nil'), 'Expecting number but found `:nil` at line 1:2');
    });

    it('should fail if PLUS is used with non-compatible values', async () => {
      await failWith(run('1 + []'), 'Expecting string, number or symbol but found `[..]` at line 1:5');
      await failWith(run('[] + 1'), 'Expecting string, number or symbol but found `[..]` at line 1:1');
    });

    it('should fail if math-ops are used with non-compatible values', async () => {
      await failWith(run('"x" / 2'), 'Expecting number but found `"..."` at line 1:1');
    });
  });

  describe('Units', () => {
    beforeEach(() => {
      Object.keys(CURRENCY_EXCHANGES).forEach(k => delete CURRENCY_EXCHANGES[k]);
      Env.register = () => ({
        mod() {
          throw new Error('FIXME');
        },
      });
    });

    afterEach(() => {
      Env.register = () => null;
    });

    it('should report failures from missing methods calling external units', async () => {
      await failWith(run('1x % 3'), 'Failed to call `mod` (FIXME)');
    });

    it('should report failures from unsupported currencies', async () => {
      Env.register = Expr.Unit.from;
      Env.resolve = source => ({ Unit: Expr.unit })[source];

      await failWith(run(':import to :from "Unit"; 1000USD to :UNDEF'), 'Unsupported USD currency');

      await useCurrencies({
        key: 'x',
        read: () => ({
          date: '2020-01-01',
          rates: {
            EUR: 1,
          },
        }),
        write: () => null,
        exists: () => true,
        resolve: () => null,
      }, '2020-01-01');

      await failWith(run(':import to :from "Unit"; 1000 EUR to :UNDEF'), 'Unsupported UNDEF currency');
    });

    it('should fail if symbols cannot resolve to units', async () => {
      Env.register = Expr.Unit.from;

      await failWith(run('15*:x'), 'Expecting number but found `:x` at line 1:4');
      await failWith(run('x=:nil; 2*x'), 'Expecting number but found `:nil` at line 1:3');
    });
  });

  describe('Runtime', () => {
    describe('SYMBOL', () => {
      it('should fail on invalid module/export statements', async () => {
        await failWith(run(':module 2;'), 'Unexpected `2` at line 1:9');
        await failWith(run(':export :nil;'), 'Unexpected `:nil` at line 1:9');
        await failWith(run(':export sum;:export sum;'), 'Export for `sum` already exists at line 1:1');
        await failWith(run(':module "Test";:module "Other";'), 'Module name `Test` is already set at line 1:16');
      });

      it('should fail on invalid import/from statements', async () => {
        await failWith(run(':from 42;'), 'Unexpected `:from` at line 1:1');
        await failWith(run(':import stuff;'), 'Missing `:from` for `:import` at line 1:1');
        await failWith(run(':import (:x foo, bar) :from "Array","Bar";'), 'Unexpected `"..."` at line 1:37');
        await failWith(run(':import foo :from "im_not_exists"'), 'Could not load `foo` at line 1:9 (im_not_exists/foo)');

        await failWith(run(':import (:nil) :from "Test"'), 'Unexpected `:nil` at line 1:10');
        await failWith(run(':import 1 :from "Test"'), 'Expecting literal but found `1` at line 1:9');
        await failWith(run(':import (1, :k 2) :from "Test"'), 'Expecting literal but found `1` at line 1:10');

        await failWith(run(':import (:key (:nil)) :from "Test"'), 'Unexpected `:nil` at line 1:16');
        await failWith(run(':import (:key foo, (:nil)) :from "Test"'), 'Unexpected `:nil` at line 1:21');
        await failWith(run(':import (a, :k 2) :from "Test"'), 'Expecting literal but found `2` at line 1:16');
        await failWith(run(':import (:a b, 1) :from "Test"'), 'Expecting literal but found `1` at line 1:16');
      });

      it('should fail on missing export definitions', async () => {
        await failWith(run(':import fr :from "Frac"'), 'Symbol `fr` not exported (Frac/fr)');

        Env.resolve = source => ({
          Undef: { t: 42 },
        })[source];

        await failWith(run(':import undef :from "Undef"'), 'Symbol `undef` not exported (Undef/undef)');
        await failWith(run(':import default :from "Unit"'), 'Symbol `default` not exported (Unit/default)');
      });

      it('should fail on missing export definitions', async () => {
        const env = new Env();

        await run(':module "Test" :export (:undef ok);', env);

        Env.resolve = source => ({
          './other.md': env,
        })[source];

        await failWith(run(':import (:s sum) :from "./other.md";'), 'Local `s` not exported (Test/s:sum) at line 1:1');
      });

      it('should report failures from foreign-calls', async () => {
        Env.resolve = source => ({
          Fun: { test: fn => fn(), fail: fn => fn([], false) },
        })[source];

        await failWith(run(':import test :from "Fun";sum=a,b->a+b;test(sum)'),
          'Missing arguments to call `sum` at line 1:43');

        await failWith(run(':import fail :from "Fun";sum=a,b->a+b;fail(sum)'),
          'Expecting string, number or symbol but found `[..]` at line 1:43');
      });

      it('should report failures on sub-expressions', async () => {
        await failWith(run(':(1..3)'), 'Expecting string, number or symbol but found `[..]` at line 1:4');
      });

      it('should fail if on invalid/optional statements', async () => {
        await failWith(run(':do i++'), 'Unexpected `:do` at line 1:1');
        await failWith(run(':if? true'), 'Unexpected `?` at line 1:4');
        await failWith(run(':test?? true'), 'Unexpected `?` at line 1:7');
      });

      it('should fail when mapping has preceding operators', async () => {
        await failWith(run('~ :key "value"'), 'Unexpected `~` at line 1:1');
      });

      it('should fail on if-blocks when no-conditional is given', async () => {
        await failWith(run(':if x'), 'Missing block before `x` at line 1:5');
      });

      it('should fail on if-blocks when no-statements are given', async () => {
        await failWith(run(':if (x)'), 'Expecting statement after `)` at line 1:7');
      });

      it('should fail on while-blocks when no-conditional is given', async () => {
        await failWith(run(':while x'), 'Missing block before `x` at line 1:8');
      });

      it('should fail on if-blocks when invalid-statements are given', async () => {
        await failWith(run(':if (x) 1 :y 2'), 'Unexpected `:y` on statement at line 1:1');
      });

      it('should fail on if-statement when is not preceeded by a conditional', async () => {
        await failWith(run(':if true 1 :else 0'), 'Missing block before `1` at line 1:10');
      });

      it('should fail on missing statements from any match-expressions', async () => {
        await failWith(run(':match (1) 2, 1 :on'), 'Expecting statement after `2` at line 1:12');
        await failWith(run(':match (:x (:y 42)) 1 2, 3 | 0'), 'Expecting statement after `3` at line 1:26');
      });

      it('should fail if :rescue has too many arguments', async () => {
        await failWith(run(':try x :rescue b, c -> 1'), 'Undeclared local `b` at line 1:16');
        await failWith(run(':try x :rescue (b, c -> 1)'), 'Expecting block but found `c` at line 1:20');
      });

      it('should fail if :try has no :rescue block', async () => {
        await failWith(run(':try x'), 'Undeclared local `x` at line 1:6');
      });
    });

    describe('LITERAL', () => {
      it('should fail on undeclared locals', async () => {
        await failWith(run('1 + b'), 'Undeclared local `b` at line 1:5');
      });

      it("should fail on definitions' calls", async () => {
        await failWith(run('x=1;x()'), 'Unexpected call to `x` at line 1:5');
      });

      it('should fail on recursion of locals', async () => {
        await failWith(run('a=1.5 * a; a'), 'Unexpected reference to `a` at line 1:9');
      });
    });

    describe('NUMBER', () => {
      it('should fail if both operands are not numbers', async () => {
        await failWith(run(':nil * :nil'), 'Expecting number but found `:nil` at line 1:1');
        await failWith(run('3 / :nil'), 'Expecting number but found `:nil` at line 1:5');
      });
    });

    describe('RANGE', () => {
      it('should fail if boundaries are not given', async () => {
        await failWith(run('..'), 'Expecting values around `..` at line 1:1');
      });

      it('should fail if no left-value is given', async () => {
        await failWith(run('..2'), 'Expecting value before `..` at line 1:1');
      });

      it('should fail if no right-value is given', async () => {
        await failWith(run('1..'), 'Expecting value after `..` at line 1:2');
      });

      it('should fail if incompatible values are given', async () => {
        await failWith(run('1 .. []'), 'Expecting number or string but found `[..]` at line 1:6');
        await failWith(run(':nil .. 2'), 'Expecting number or string but found `:nil` at line 1:1');
      });

      it('should fail on invalid arguments', async () => {
        await failWith(run('1..3:-1-2'), 'Invalid take-step `:-1-2`');
        await failWith(run('1..3:1--2'), 'Invalid take-step `:1--2`');
        await failWith(run('[1..3:::]'), 'Unexpected `:` after `1..3::`');
        await failWith(run('[1..3::1-2]'), 'Unexpected take-step `:1-2` after `1..3:`');
        await failWith(run('[1..3:1:1-2]'), 'Unexpected take-step `:1-2` after `1..3:1`');
        await failWith(run('[1..3:::1:2]'), 'Unexpected take-range `:2` after `1..3:1::1`');
        await failWith(run('[1..3:1:1..2]'), 'Unexpected take-range `:1..2` after `1..3:1`');
        await failWith(run('[1..3:1:2:3-4]'), 'Unexpected take-step `:3-4` after `1..3:1:2`');
      });
    });

    describe('BLOCK', () => {
      it('should fail on missing arguments', async () => {
        await failWith(run('sum=a,b->a+b; sum();'), 'Missing arguments to call `sum` at line 1:18');
        await failWith(run('sum=a->b->a+b;sum(5)()'), 'Missing argument `b` to call `sum` at line 1:21');
        await failWith(run('test=a,b,c->a+b+c;fix=test(_,"B",_);fix("X")'), 'Missing argument `c` to call `test` at line 1:40');
      });

      it('should fail on too many arguments', async () => {
        await failWith(run('test=a->a; test(1, 2, 3)'), 'Unexpected argument `2` to call `test` at line 1:16');
        await failWith(run('sum=a->b->a+b; add5=sum(5); add5(3, 4)'), 'Unexpected argument `4` to call `sum` at line 1:33');
        await failWith(run('test=a,b,c->a+b+c;fix=test(_,"B",_);fix("X","Y","Z")'), 'Unexpected argument `"..."` to call `test` at line 1:40');
      });

      it('should fail if non-callable is invoked', async () => {
        await failWith(run('[]()'), 'Expecting callable but found `[..]` at line 1:1');
        await failWith(run('42()'), 'Expecting callable but found `42` at line 1:1');
        await failWith(run('|>()'), 'Expecting value before `|>` at line 1:1');
        await failWith(run('"x"()'), 'Expecting callable but found `"..."` at line 1:1');
        await failWith(run('f=n->n+; f(1)(2)(3)'), 'Expecting callable but found `2` at line 1:15');
      });

      it('should fail on invalid conditionals', async () => {
        await failWith(run('(< 1 2 3)'), 'Expecting exactly 2 arguments, given 3');
      });
    });

    describe('PIPE', () => {
      it('should fail if there is no-value before', async () => {
        await failWith(run('|>'), 'Expecting value before `|>` at line 1:1');
        await failWith(run('~ |>'), 'Expecting value before `|>` at line 1:3');
      });

      it('should fail if following value is not compatible', async () => {
        await failWith(run('1 |>'), 'Expecting callable after `|>` at line 1:3');
        await failWith(run('1 |> [2]'), 'Expecting literal or block but found `[..]` at line 1:6');
      });
    });

    describe('DOT', () => {
      it('should fail if previous value is not a mapping', async () => {
        await failWith(run('.'), 'Expecting map before `.` at line 1:1');
        await failWith(run('1.foo'), 'Expecting map but found `1` at line 1:1');
        await failWith(run('noop=x,y->x*y;1.noop'), 'Unexpected call to `noop` at line 1:16');
      });

      it('should fail if following value is not a literal', async () => {
        await failWith(run('(:truth 42).'), 'Expecting literal after `.` at line 1:12');
        await failWith(run('(:truth 42).[]'), 'Expecting literal but found `[..]` at line 1:13');
      });

      it('should fail if property is not present on mapping', async () => {
        await failWith(run('"x".y'), 'Missing property `y` in `x` at line 1:5');
        await failWith(run('[1].y'), 'Missing property `y` in [1] at line 1:5');
        await failWith(run('[1,2,3].y'), 'Missing property `y` in [0..2] at line 1:9');
        await failWith(run('(:t 42, :k -1).x'), 'Missing property `x` in (:t :k) at line 1:16');
      });
    });
  });
});
