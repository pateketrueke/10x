/* eslint-disable no-unused-expressions */

import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { stdout } from 'stdout-stderr';

import { failWith } from './helpers';
import { execute as run } from '../src/lib';
import { useCurrencies } from '../src/lib/builtins';
import { serialize, deindent } from '../src/lib/helpers';

import Env from '../src/lib/tree/env';
import Expr from '../src/lib/tree/expr';
import shared from '../src/adapters/node/shared.js';

shared({ Env }, process.argv.slice(2));

describe('Prelude', () => {
  describe('equals(a, b, weak)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import equals @from "Prelude".\nequals().\n'), 'Missing left value');
      await failWith(run('@import equals @from "Prelude".\nequals(1).\n'), 'Missing right value');
    });

    test('should compare two given tokens', async () => {
      expect(await run('@import equals @from "Prelude".\nequals(1,2)')).toEqual([Expr.value(false)]);
    });
  });

  describe('items(...)', () => {
    test('should split tokens from given arguments', async () => {
      expect(await run('@import items @from "Prelude".\nitems(1..3,4)')).toEqual([
        Expr.value([Expr.value([1, 2, 3]), Expr.value(4)]),
      ]);
    });
  });

  describe('show(t)', () => {
    test('should serialize given input', async () => {
      expect(await run('@import show @from "Prelude".\nshow("OK")')).toEqual([Expr.value('"OK"')]);
    });

    test('should serialize evaluated tokens', async () => {
      expect(await run('@import show @from "Prelude".\nx="x:#{y}".\ny=42.\nshow(x)')).toEqual([Expr.value('"x:42"')]);
    });
  });

  describe('render(t)', () => {
    test('should fail on missing input', async () => {
      await failWith(run('@import render @from "Prelude".\nrender().\n'), 'No input to render');
    });

    test('should convert values into renderable output', async () => {
      const result = await run(`
        @import render @from "Prelude".
        render("foo").
        render(42).
        render(<div />).
      `);

      expect(result, [
        Expr.value('foo'),
        Expr.value('42'),
        Expr.value('<div />'),
      ]);
    });
  });

  describe('cast(x, t)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import cast @from "Prelude".\ncast().\n'), 'Missing input to cast');
      await failWith(run('@import cast @from "Prelude".\ncast(1).\n'), 'Missing type to cast');
      await failWith(run('@import cast @from "Prelude".\ncast(1,2).\n'), 'Expecting symbol but found `2`');
      await failWith(run('@import cast @from "Prelude".\ncast(1,:undef).\n'), 'Invalid cast to :undef');
    });

    test('should convert between types', async () => {
      expect(await run('@import cast @from "Prelude".\ncast(1,:string)')).toEqual([Expr.value('1')]);
      expect(await run('@import cast @from "Prelude".\ncast("1",:number)')).toEqual([Expr.value(1)]);
    });
  });

  describe('repr(t)', () => {
    test('should return the kind given tokens', async () => {
      const result = await run(`
        @import repr @from "Prelude".
        @import (:concat cat) @from "Array".

        def = x -> 4x.

        repr(42).
        repr(def).
        repr(cat).
        repr(-1..3).
        repr(:foo).
        repr("bar").
        repr(<a />).
        repr(:foo "bar").
      `);

      expect(result, [
        Expr.symbol(':number'),
        Expr.symbol(':definition'),
        Expr.symbol(':function'),
        Expr.symbol(':range'),
        Expr.symbol(':symbol'),
        Expr.symbol(':string'),
        Expr.symbol(':markup'),
        Expr.symbol(':object'),
      ]);
    });
  });

  describe('size(t)', () => {
    test('should return the size of given tokens', async () => {
      const result = await run(`
        @import size @from "Prelude".
        @import (:concat cat) @from "Array".

        def = x -> 4x.

        size(def).
        size(cat).
        size(-1..3).
        size(:foo).
        size("bar").
        size(<a />).
        size(:foo "bar").
      `);

      expect(result, [
        Expr.value(1),
        Expr.value(0),
        Expr.value(5),
        Expr.value(3),
        Expr.value(3),
        Expr.value(0),
        Expr.value(1),
      ]);
    });
  });

  describe('push(t, ...)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import push @from "Prelude".\npush().\n'), 'No target given');
      await failWith(run('@import push @from "Prelude".\npush(:nil).\n'), 'Invalid target');
    });

    test('should append values into given tokens', async () => {
      expect(serialize(await run('@import push @from "Prelude".\npush(1, 2)'))).toEqual('3');
      expect(serialize(await run('@import push @from "Prelude".\npush([], 42)'))).toEqual('[42]');
      expect(serialize(await run('@import push @from "Prelude".\npush([], [42])'))).toEqual('[42]');
      expect(serialize(await run('@import push @from "Prelude".\npush("x", "y")'))).toEqual('"xy"');
      expect(serialize(await run('@import push @from "Prelude".\npush("x#{1}", "y")'))).toEqual('"x1y"');
    });
  });

  describe('list(t)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import list @from "Prelude".\nlist().\n'), 'No input to list given');
      await failWith(run('@import list @from "Prelude".\nlist(:nil).\n'), 'Input is not iterable');
    });

    test('should return a list from given tokens', async () => {
      expect(serialize(await run('@import list @from "Prelude".\nlist((1, 2))'))).toEqual('[1, 2]');
      expect(serialize(await run('@import list @from "Prelude".\nlist((1, 2), (3, 4))'))).toEqual('[1, 2, 3, 4]');
    });
  });

  describe('head(t)', () => {
    test('should return the first item from given tokens', async () => {
      expect(await run('@import head @from "Prelude".\nhead([1,2,3])')).toEqual([Expr.value(1)]);
      expect(await run('@import head @from "Prelude".\nhead("foo")')).toEqual([Expr.value('f')]);
      expect(await run('@import head @from "Prelude".\nhead("foo")')).toEqual([Expr.value('f')]);
    });

    test('should fail on empty lists', async () => {
      await failWith(run('@import head @from "Prelude".\nhead([])'), 'head: empty list');
    });
  });

  describe('tail(t)', () => {
    test('should return all but first item from given tokens', async () => {
      expect(await run('@import tail @from "Prelude".\ntail([1,2,3])')).toEqual([Expr.value([2, 3])]);
      expect(await run('@import tail @from "Prelude".\ntail("foo")')).toEqual([Expr.value('oo')]);
    });
  });

  describe('take(t, c)', () => {
    test('should return items from given tokens', async () => {
      expect(await run('@import take @from "Prelude".\ntake([1,2,3])')).toEqual([Expr.value([1])]);
      expect(await run('@import take @from "Prelude".\ntake([1,2,3],2)')).toEqual([Expr.value([1, 2])]);
    });
  });

  describe('drop(t, n, i)', () => {
    test('should remove items from given tokens', async () => {
      expect(await run('@import drop @from "Prelude".\ndrop([1,2,3])')).toEqual([Expr.value([1, 2])]);
      expect(await run('@import drop @from "Prelude".\ndrop([4,5,6],1,0)')).toEqual([Expr.value([5, 6])]);
    });
  });

  describe('rev(...)', () => {
    test('should reverse order from given tokens', async () => {
      expect(await run('@import rev @from "Prelude".\nrev([1,2,3])')).toEqual([Expr.value([3, 2, 1])]);
    });
  });

  describe('pairs(...)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import pairs @from "Prelude".\npairs().\n'), 'No input given');
      await failWith(run('@import pairs @from "Prelude".\npairs(1).\n'), 'Invalid input');
    });

    test('should enumerate keys/vals from given tokens', async () => {
      expect(await run('@import pairs @from "Prelude".\npairs([1,2,3])')).toEqual([
        Expr.value([
          Expr.value(['0', 1]),
          Expr.value(['1', 2]),
          Expr.value(['2', 3]),
        ]),
      ]);
    });
  });

  describe('keys(t)', () => {
    test('should return keys/indices from given input', async () => {
      expect(await run('@import keys @from "Prelude".\nkeys(1..3)')).toEqual([Expr.value(['0', '1', '2'])]);
      expect(await run('@import keys @from "Prelude".\nkeys(:x 1 :y 2)')).toEqual([Expr.value(['x', 'y'])]);
    });
  });

  describe('vals(t)', () => {
    test('should return values from given input', async () => {
      expect(await run('@import vals @from "Prelude".\nvals(1..3)')).toEqual([Expr.value([1, 2, 3])]);
      expect(await run('@import vals @from "Prelude".\nvals(:x 1 :y 2)')).toEqual([
        Expr.array([Expr.body([Expr.value(1)]), Expr.body([Expr.value(2)])]),
      ]);
    });
  });

  describe('show(...)', () => {
    test('should serialize any given input', async () => {
      expect(await run('@import show @from "Prelude".\nshow().\n')).toEqual([Expr.value('')]);
      expect(await run('@import show @from "Prelude".\nshow(42).\n')).toEqual([Expr.value('42')]);
      expect(await run('@import show @from "Prelude".\nshow(1,2,3).\n')).toEqual([Expr.value('1, 2, 3')]);
    });
  });

  describe('check(_)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import check @from "Prelude".\ncheck().\n'), 'Missing expression to check');
    });

    test('should test and report failures', async () => {
      stdout.start();

      const result = await run(`
        @from "Prelude" @import check items.
        @from "IO" @import puts.

        test = (desc block) -> (
          output = block() | :nil.
          failed = (? output :nil).
          puts("# #{failed ? "not ok" | "ok"} — #{desc}\\n").
          @if (failed) puts("  - ", items(output).join("\\n  - "), "\\n").
        ).

        @let
          test("this is fine", -> (
            check((= 1 1)).
          ))
          test("it should be fine", -> (
            check((= 1 1)).
            check((~ [1, 2] 3)).
            check((= 1 1) ? "NO").
            check((= 1 2) | "YES").
          )).
      `);

      stdout.stop();

      expect(result, []);
      expect(stdout.output, `${deindent(`
        # ok — this is fine
        # not ok — it should be fine
          - \`(~ [1, 2] 3)\` did not passed
          - \`(= 1 1)\` NO
          - \`(= 1 2)\` YES
      `)}\n`);
    });
  });

  describe('format(str, ...)', () => {
    test('should fail on invalid input', async () => {
      await failWith(run('@import format @from "Prelude".\nformat().\n'), 'No format string given');
      await failWith(run('@import format @from "Prelude".\nformat(1).\n'), 'Invalid format string');
      await failWith(run('@import format @from "Prelude".\nformat("x").\n'), 'Missing value to format');
      await failWith(run('@import format @from "Prelude".\nformat("{:xyz}",1).\n'), 'Invalid format `{:xyz}`');
    });

    test('should access values by offset', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{}",42).\n')).toEqual([Expr.value('42')]);
      expect(await run('@import format @from "Prelude".\nformat("{:}",42).\n')).toEqual([Expr.value('42')]);
      expect(await run('@import format @from "Prelude".\nformat("{:}","ok").\n')).toEqual([Expr.value('ok')]);
    });

    test('should return identity if no match is done', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{0}",[42]).\n')).toEqual([Expr.value('42')]);
      expect(await run('@import format @from "Prelude".\nformat("{1}",[42]).\n')).toEqual([Expr.value('{1}')]);
    });

    test('should allow to upper/lower-transform', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:$}","OK").\n')).toEqual([Expr.value('ok')]);
      expect(await run('@import format @from "Prelude".\nformat("{:^}","ok").\n')).toEqual([Expr.value('OK')]);
    });

    test('should allow to hexadecimal-transform', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:x}",42).\n')).toEqual([Expr.value('2a')]);
      expect(await run('@import format @from "Prelude".\nformat("{:x^}",42).\n')).toEqual([Expr.value('2A')]);
    });

    test('should allow to binary-transform', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:b}",42).\n')).toEqual([Expr.value('101010')]);
    });

    test('should allow to octal-transform', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:o}",42).\n')).toEqual([Expr.value('52')]);
    });

    test('should allow to serialize values', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:?}","X").\n')).toEqual([Expr.value('"X"')]);
    });

    test('should allow precision on numbers', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:.0}",1.23).\n')).toEqual([Expr.value('1')]);
      expect(await run('@import format @from "Prelude".\nformat("{y:.4}",:y 10/3).\n')).toEqual([Expr.value('10/3')]);
    });

    test('should keep units when formatting', async () => {
      Env.register = Expr.Unit.from;

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

      expect(await run(`
        @import format @from "Prelude".
        @import MXN, USD, to @from "Unit".

        format("\${:~<20.2}", 32000 MXN to USD).
      `)).toEqual([Expr.value('$~~~~~~~~~1720.90 USD')]);
    });

    test('should allow padding around values', async () => {
      expect(await run('@import format @from "Prelude".\nformat("{:3}",42).\n')).toEqual([Expr.value(' 42')]);
      expect(await run('@import format @from "Prelude".\nformat("{:<0}",42).\n')).toEqual([Expr.value('42')]);
      expect(await run('@import format @from "Prelude".\nformat("{:<3}",42).\n')).toEqual([Expr.value(' 42')]);
      expect(await run('@import format @from "Prelude".\nformat("{:0<4}",42).\n')).toEqual([Expr.value('0042')]);
      expect(await run('@import format @from "Prelude".\nformat("{:-^4}",42).\n')).toEqual([Expr.value('-42-')]);
      expect(await run('@import format @from "Prelude".\nformat("{:>>4}",42).\n')).toEqual([Expr.value('42>>')]);
      expect(await run('@import format @from "Prelude".\nformat("{:XXX>4}",42).\n')).toEqual([Expr.value('42XXXXXX')]);
    });

    test('should allow multiple mappings', async () => {
      expect(await run('@import format @from "Prelude".\na=[42].\nb=[-1].\nformat("{1}",a,b).\n')).toEqual([Expr.value('-1')]);
      expect(await run('@import format @from "Prelude".\na=:x 42.\nb=:y -1.\nformat("{y}",a,b).\n')).toEqual([Expr.value('(-1)')]);
    });
  });
});
