/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import { stdout } from 'stdout-stderr';

import { failWith } from './helpers';
import { execute as run } from '../src/lib';
import { useCurrencies } from '../src/lib/builtins';
import { serialize, deindent } from '../src/lib/helpers';

import Env from '../src/lib/tree/env';
import Expr from '../src/lib/tree/expr';

describe('Prelude', () => {
  describe('equals(a, b, weak)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import equals :from "Prelude";equals();'), 'Missing left value');
      await failWith(run(':import equals :from "Prelude";equals(1);'), 'Missing right value');
    });

    it('should compare two given tokens', async () => {
      expect(await run(':import equals :from "Prelude"; equals(1,2)')).to.eql([Expr.value(false)]);
    });
  });

  describe('items(...)', () => {
    it('should split tokens from given arguments', async () => {
      expect(await run(':import items :from "Prelude";items(1..3,4)')).to.eql([
        Expr.value([Expr.value([1, 2, 3]), Expr.value(4)]),
      ]);
    });
  });

  describe('show(t)', () => {
    it('should serialize given input', async () => {
      expect(await run(':import show :from "Prelude";show("OK")')).to.eql([Expr.value('"OK"')]);
    });

    it('should serialize evaluated tokens', async () => {
      expect(await run(':import show :from "Prelude";x="x:#{y}";y=42;show(x)')).to.eql([Expr.value('"x:42"')]);
    });
  });

  describe('cast(x, t)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import cast :from "Prelude";cast();'), 'Missing input to cast');
      await failWith(run(':import cast :from "Prelude";cast(1);'), 'Missing type to cast');
      await failWith(run(':import cast :from "Prelude";cast(1,2);'), 'Expecting symbol but found `2`');
      await failWith(run(':import cast :from "Prelude";cast(1,:undef);'), 'Invalid cast to :undef');
    });

    it('should convert between types', async () => {
      expect(await run(':import cast :from "Prelude"; cast(1,:string)')).to.eql([Expr.value('1')]);
      expect(await run(':import cast :from "Prelude"; cast("1",:number)')).to.eql([Expr.value(1)]);
    });
  });

  describe('repr(t)', () => {
    it('should return the kind given tokens', async () => {
      const result = await run(`
        :import repr :from "Prelude";
        :import (:concat cat) :from "Array";

        def = x -> 4x;

        repr(42);
        repr(def);
        repr(cat);
        repr(-1..3);
        repr(:foo);
        repr("bar");
        repr(<a />);
        repr(:foo "bar");
      `);

      expect(result).to.eql([
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
    it('should return the size of given tokens', async () => {
      const result = await run(`
        :import size :from "Prelude";
        :import (:concat cat) :from "Array";

        def = x -> 4x;

        size(def);
        size(cat);
        size(-1..3);
        size(:foo);
        size("bar");
        size(<a />);
        size(:foo "bar");
      `);

      expect(result).to.eql([
        Expr.value(1),
        Expr.value(0),
        Expr.value(5),
        Expr.value(3),
        Expr.value(3),
        Expr.value(5),
        Expr.value(1),
      ]);
    });
  });

  describe('push(t, ...)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import push :from "Prelude";push();'), 'No target given');
      await failWith(run(':import push :from "Prelude";push(:nil);'), 'Invalid target');
    });

    it('should append values into given tokens', async () => {
      expect(serialize(await run(':import push :from "Prelude";push(1, 2)'))).to.eql('3');
      expect(serialize(await run(':import push :from "Prelude";push([], 42)'))).to.eql('[42]');
      expect(serialize(await run(':import push :from "Prelude";push([], [42])'))).to.eql('[42]');
      expect(serialize(await run(':import push :from "Prelude";push("x", "y")'))).to.eql('"xy"');
      expect(serialize(await run(':import push :from "Prelude";push("x#{1}", "y")'))).to.eql('"x1y"');
      expect(serialize(await run(':import push :from "Prelude";push(<x#{1} />, "y")'))).to.eql('<x1 />y');
    });
  });

  describe('list(t)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import list :from "Prelude";list();'), 'No input to list given');
      await failWith(run(':import list :from "Prelude";list(:nil);'), 'Input is not iterable');
    });

    it('should return a list from given tokens', async () => {
      expect(serialize(await run(':import list :from "Prelude";list((1, 2))'))).to.eql('[1, 2]');
      expect(serialize(await run(':import list :from "Prelude";list((1, 2), (3, 4))'))).to.eql('[1, 2, 3, 4]');
    });
  });

  describe('head(t)', () => {
    it('should return the first item from given tokens', async () => {
      expect(await run(':import head :from "Prelude";head([1,2,3])')).to.eql([Expr.value(1)]);
      expect(await run(':import head :from "Prelude";head("foo")')).to.eql([Expr.value('f')]);
      expect(await run(':import head :from "Prelude";head("foo")')).to.eql([Expr.value('f')]);
    });
  });

  describe('tail(t)', () => {
    it('should return all but first item from given tokens', async () => {
      expect(await run(':import tail :from "Prelude";tail([1,2,3])')).to.eql([Expr.value([2, 3])]);
      expect(await run(':import tail :from "Prelude";tail("foo")')).to.eql([Expr.value('oo')]);
    });
  });

  describe('take(t, c)', () => {
    it('should return items from given tokens', async () => {
      expect(await run(':import take :from "Prelude";take([1,2,3])')).to.eql([Expr.value([1])]);
      expect(await run(':import take :from "Prelude";take([1,2,3],2)')).to.eql([Expr.value([1, 2])]);
    });
  });

  describe('drop(t, n, i)', () => {
    it('should remove items from given tokens', async () => {
      expect(await run(':import drop :from "Prelude";drop([1,2,3])')).to.eql([Expr.value([1, 2])]);
      expect(await run(':import drop :from "Prelude";drop([4,5,6],1,0)')).to.eql([Expr.value([5, 6])]);
    });
  });

  describe('rev(...)', () => {
    it('should reverse order from given tokens', async () => {
      expect(await run(':import rev :from "Prelude";rev([1,2,3])')).to.eql([Expr.value([3, 2, 1])]);
    });
  });

  describe('pairs(...)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import pairs :from "Prelude";pairs();'), 'No input given');
      await failWith(run(':import pairs :from "Prelude";pairs(1);'), 'Invalid input');
    });

    it('should enumerate keys/vals from given tokens', async () => {
      expect(await run(':import pairs :from "Prelude";pairs([1,2,3])')).to.eql([
        Expr.value([
          Expr.value(['0', 1]),
          Expr.value(['1', 2]),
          Expr.value(['2', 3]),
        ]),
      ]);
    });
  });

  describe('keys(t)', () => {
    it('should return keys/indices from given input', async () => {
      expect(await run(':import keys :from "Prelude";keys(1..3)')).to.eql([Expr.value(['0', '1', '2'])]);
      expect(await run(':import keys :from "Prelude";keys(:x 1 :y 2)')).to.eql([Expr.value(['x', 'y'])]);
    });
  });

  describe('vals(t)', () => {
    it('should return values from given input', async () => {
      expect(await run(':import vals :from "Prelude";vals(1..3)')).to.eql([Expr.value([1, 2, 3])]);
      expect(await run(':import vals :from "Prelude";vals(:x 1 :y 2)')).to.eql([
        Expr.array([Expr.body([Expr.value(1)]), Expr.body([Expr.value(2)])]),
      ]);
    });
  });

  describe('show(...)', () => {
    it('should serialize any given input', async () => {
      expect(await run(':import show :from "Prelude";show();')).to.eql([Expr.value('')]);
      expect(await run(':import show :from "Prelude";show(42);')).to.eql([Expr.value('42')]);
      expect(await run(':import show :from "Prelude";show(1,2,3);')).to.eql([Expr.value('1, 2, 3')]);
    });
  });

  describe('check(_)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import check :from "Prelude";check();'), 'Missing expression to check');
    });

    it('should test and report failures', async () => {
      stdout.start();

      const result = await run(`
        :from "Prelude" :import check items;
        :from "IO" :import puts;

        test = desc, block -> (
          output = block() | :nil;
          failed = (? output :nil);
          puts("# #{failed ? "not ok" | "ok"} — #{desc}\n");
          :if (failed) puts("  - ", items(output).join("\n  - "), "\n");
        );

        :let
          test("this is fine", -> (
            check((= 1 1));
          ))
          test("it should be fine", -> (
            check((= 1 1));
            check((~ [1, 2] 3));
            check((= 1 1) ? "NO");
            check((= 1 2) | "YES");
          ));
      `);

      stdout.stop();

      expect(result).to.eql([]);
      expect(stdout.output).to.eql(`${deindent(`
        # ok — this is fine
        # not ok — it should be fine
          - \`(~ [1, 2] 3)\` did not passed
          - \`(= 1 1)\` NO
          - \`(= 1 2)\` YES
      `)}\n`);
    });
  });

  describe('format(str, ...)', () => {
    it('should fail on invalid input', async () => {
      await failWith(run(':import format :from "Prelude";format();'), 'No format string given');
      await failWith(run(':import format :from "Prelude";format(1);'), 'Invalid format string');
      await failWith(run(':import format :from "Prelude";format("x");'), 'Missing value to format');
      await failWith(run(':import format :from "Prelude";format("{:xyz}",1);'), 'Invalid format `{:xyz}`');
    });

    it('should access values by offset', async () => {
      expect(await run(':import format :from "Prelude";format("{}",42);')).to.eql([Expr.value('42')]);
      expect(await run(':import format :from "Prelude";format("{:}",42);')).to.eql([Expr.value('42')]);
      expect(await run(':import format :from "Prelude";format("{:}","ok");')).to.eql([Expr.value('ok')]);
    });

    it('should return identity if no match is done', async () => {
      expect(await run(':import format :from "Prelude";format("{0}",[42]);')).to.eql([Expr.value('42')]);
      expect(await run(':import format :from "Prelude";format("{1}",[42]);')).to.eql([Expr.value('{1}')]);
    });

    it('should allow to upper/lower-transform', async () => {
      expect(await run(':import format :from "Prelude";format("{:$}","OK");')).to.eql([Expr.value('ok')]);
      expect(await run(':import format :from "Prelude";format("{:^}","ok");')).to.eql([Expr.value('OK')]);
    });

    it('should allow to hexadecimal-transform', async () => {
      expect(await run(':import format :from "Prelude";format("{:x}",42);')).to.eql([Expr.value('2a')]);
      expect(await run(':import format :from "Prelude";format("{:x^}",42);')).to.eql([Expr.value('2A')]);
    });

    it('should allow to binary-transform', async () => {
      expect(await run(':import format :from "Prelude";format("{:b}",42);')).to.eql([Expr.value('101010')]);
    });

    it('should allow to octal-transform', async () => {
      expect(await run(':import format :from "Prelude";format("{:o}",42);')).to.eql([Expr.value('52')]);
    });

    it('should allow to serialize values', async () => {
      expect(await run(':import format :from "Prelude";format("{:?}","X");')).to.eql([Expr.value('"X"')]);
    });

    it('should allow precision on numbers', async () => {
      expect(await run(':import format :from "Prelude";format("{:.0}",1.23);')).to.eql([Expr.value('1')]);
      expect(await run(':import format :from "Prelude";format("{y:.4}",:y 10/3);')).to.eql([Expr.value('10/3')]);
    });

    it('should keep units when formatting', async () => {
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
        :import format :from "Prelude";
        :import MXN, USD, to :from "Unit";

        format("\${:~<20.2}", 32000 MXN to USD);
      `)).to.eql([Expr.value('$~~~~~~~~~1720.90 USD')]);
    });

    it('should allow padding around values', async () => {
      expect(await run(':import format :from "Prelude";format("{:3}",42);')).to.eql([Expr.value(' 42')]);
      expect(await run(':import format :from "Prelude";format("{:<0}",42);')).to.eql([Expr.value('42')]);
      expect(await run(':import format :from "Prelude";format("{:<3}",42);')).to.eql([Expr.value(' 42')]);
      expect(await run(':import format :from "Prelude";format("{:0<4}",42);')).to.eql([Expr.value('0042')]);
      expect(await run(':import format :from "Prelude";format("{:-^4}",42);')).to.eql([Expr.value('-42-')]);
      expect(await run(':import format :from "Prelude";format("{:>>4}",42);')).to.eql([Expr.value('42>>')]);
      expect(await run(':import format :from "Prelude";format("{:XXX>4}",42);')).to.eql([Expr.value('42XXXXXX')]);
    });

    it('should allow multiple mappings', async () => {
      expect(await run(':import format :from "Prelude";a=[42];b=[-1];format("{1}",a,b);')).to.eql([Expr.value('-1')]);
      expect(await run(':import format :from "Prelude";a=:x 42;b=:y -1;format("{y}",a,b);')).to.eql([Expr.value('(-1)')]);
    });
  });
});
