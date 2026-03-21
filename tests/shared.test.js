/* eslint-disable no-unused-expressions */

import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';

import { stdin } from 'mock-stdin';
import { stdout, stderr } from 'stdout-stderr';

import td from 'testdouble';
import path from 'path';
import fs from 'fs';
import os from 'os';

import Env from '../src/lib/tree/env';

import { execute as run } from '../src/lib';
import { deindent, serialize } from '../src/lib/helpers';

import shared from '../src/adapters/node/shared.js';

process.argv = [null, null, 'a', 'X=Y', 'M:N', '-b', '--c', '--', 'd', 'e'];

shared({ Env }, process.argv.slice(2));

describe('Shared', () => {
  describe('Proc', () => {
    test('cwd() and chdir(p)', async () => {
      const result = await run(deindent(`
        @import cwd, chdir @from "Proc".
        is = (a b) -> (== a b).

        cwd() is "${process.cwd()}"
        chdir("..").
        cwd() is "${path.dirname(process.cwd())}".
      `));

      expect(serialize(result)).toEqual(':on, :on');
    });

    test('getenv(k), setenv(k, v) and unsetenv(k)', async () => {
      process.env.TRUTH = Math.random().toString(36).substr(2);
      process.env.FIXED = 'OK';
      process.env.TEXT = '';

      const result = await run(deindent(`
        @import getenv, setenv, unsetenv @from "Proc".
        is = (a b) -> (== a b).

        unsetenv(:FIXED).
        getenv(:FIXED) | 1.
        getenv(:TEXT) is "".
        setenv(:TEXT, 42).
        getenv(:TEXT) is "42".
        getenv(:TRUTH) is "${process.env.TRUTH}".
      `));

      expect(serialize(result)).toEqual('1, :on, :on, :on');
    });

    test('homedir() and tmpdir()', async () => {
      const result = await run(deindent(`
        @import homedir, tmpdir @from "Proc".
        is = (a b) -> (== a b).
        isin = (a b) -> (~ b a).

        homedir() is "${os.homedir()}".
        tmpdir() isin "${os.tmpdir()}".
      `));

      expect(serialize(result)).toEqual(':on, :on');
    });

    test('exit() and wait()', async () => {
      td.replace(process, 'exit', td.func());

      await run(deindent(`
        @import exit, wait @from "Proc".
        wait(100).
        exit().
      `));

      expect(td.explain(process.exit).callCount).toEqual(1);

      td.reset();
    });

    test('getopts(...) — returns input from argv', async () => {
      const result = await run(deindent(`
        @import getopts @from "Proc".
        getopts().
      `));

      const flags = ':data (:X "Y"), :flags (:b :on, :c :on)';
      const code = `(:_ ["a"], :raw ["d", "e"], ${flags}, :params (:M "N"))`;

      expect(serialize(result)).toEqual(code);
    });
  });

  describe('IO', () => {
    describe('Printing and reading', () => {
      test('input() — reads from the stdin', async () => {
        const x = stdin();

        setTimeout(() => {
          x.send('OK\n');
          x.end();
          x.reset();

          process.stdin.isTTY = true;
        });

        const result = await run('@import input @from "IO".\ninput().\ninput()');

        expect(serialize(result)).toEqual('"OK\n", :nil');
      });

      test('input(p, ...) — asks user for input', async () => {
        stdout.start();

        const x = stdin();

        setTimeout(() => {
          x.send('42\n');
          setTimeout(() => {
            x.send('OK\n');
            setTimeout(() => {
              x.send('-1\n');
              x.end();
              x.reset();
            });
          });
        });

        const result = await run(deindent(`
          @import input @from "IO".
          input(:type :text, :name :a, :message "A?").
          input(
            (:type :text, :name :b, :message "B?"),
            (:type :number, :name :c, :message "C?"),
          ).
        `));

        stdout.stop();

        expect(serialize(result)).toEqual('(:a "42"), (:b "OK", :c -1)');
        expect(stdout.output, `${deindent(`
          ? A? › ? A? › 4? A? › 42✔ A? … 42
          ? B? › ? B? › O? B? › OK✔ B? … OK
          ? C? › ? C? › ? C? › -1✔ C? … -1
        `)}\n`);
      });

      test('puts(...) — will print to the stdout', async () => {
        stdout.start();

        await run('@import puts @from "IO".\nputs("""OK\n""")');

        stdout.stop();
        expect(stdout.output).toEqual('OK\n');
      });

      test('err(...) — will print to the stderr', async () => {
        stderr.start();

        await run('@import err @from "IO".\nerr("""ERR\n""")');

        stderr.stop();
        expect(stderr.output).toEqual('ERR\n');
      });
    });
  });

  describe('Fs', () => {
    test('should allow to read filesystem', async () => {
      const result = await run(deindent(`
        @import read @from "Fs".
        @rescue read("im_not_exists").
        read("${__filename}").
      `));

      expect(result).toHaveLength(1);
      expect(serialize(result)).toContain(fs.readFileSync(__filename).toString());
    });
  });
});
