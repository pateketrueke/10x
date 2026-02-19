/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import { stdin } from 'mock-stdin';
import { stdout, stderr } from 'stdout-stderr';

import td from 'testdouble';
import path from 'path';
import fs from 'fs';

import Env from '../src/lib/tree/env';

import { execute as run } from '../src/lib';
import { deindent, serialize } from '../src/lib/helpers';

import shared from '../lib/shared.js';

process.argv = [null, null, 'a', 'X=Y', 'M:N', '-b', '--c', '--', 'd', 'e'];

shared({ Env }, process.argv.slice(2));

describe('Shared', () => {
  describe('Proc', () => {
    it('cwd() and chdir(p)', async () => {
      const result = await run(deindent(`
        :import cwd, chdir :from "Proc";
        is = a, b -> (== a b);

        cwd() is "${process.cwd()}"
        chdir("..");
        cwd() is "${path.dirname(process.cwd())}";
      `));

      expect(serialize(result)).to.eql(':on, :on');
    });

    it('getenv(k), setenv(k, v) and unsetenv(k)', async () => {
      process.env.TRUTH = Math.random().toString(36).substr(2);
      process.env.FIXED = 'OK';
      process.env.TEXT = '';

      const result = await run(deindent(`
        :import getenv, setenv, unsetenv :from "Proc";
        is = a, b -> (== a b);

        unsetenv(:FIXED);
        getenv(:FIXED) | 1;
        getenv(:TEXT) is "";
        setenv(:TEXT, 42);
        getenv(:TEXT) is "42";
        getenv(:TRUTH) is "${process.env.TRUTH}";
      `));

      expect(serialize(result)).to.eql('1, :on, :on, :on');
    });

    it('homedir() and tmpdir()', async () => {
      const result = await run(deindent(`
        :import homedir, tmpdir :from "Proc";
        is = a, b -> (== a b);
        isin = a, b -> (~ b a);

        homedir() is "${process.env.HOME}";
        tmpdir() isin "${process.env.TMPDIR}";
      `));

      expect(serialize(result)).to.eql(`:on, :${process.env.CI ? 'off' : 'on'}`);
    });

    it('exit() and wait()', async () => {
      td.replace(process, 'exit', td.func());

      await run(deindent(`
        :import exit, wait :from "Proc";
        wait(100);
        exit();
      `));

      expect(td.explain(process.exit).callCount).to.eql(1);

      td.reset();
    });

    it('getopts(...) — returns input from argv', async () => {
      const result = await run(deindent(`
        :import getopts :from "Proc";
        getopts();
      `));

      const flags = ':data (:X "Y"), :flags (:b :on, :c :on)';
      const code = `(:_ ["a"], :raw ["d", "e"], ${flags}, :params (:M "N"))`;

      expect(serialize(result)).to.eql(code);
    });
  });

  describe('IO', () => {
    describe('Printing and reading', () => {
      it('input() — reads from the stdin', async () => {
        const x = stdin();

        setTimeout(() => {
          x.send('OK\n');
          x.end();
          x.reset();

          process.stdin.isTTY = true;
        });

        const result = await run(':import input :from "IO";input();input()');

        expect(serialize(result)).to.eql('"OK\n", :nil');
      });

      it('input(p, ...) — asks user for input', async () => {
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
          :import input :from "IO";
          input(:type :text, :name :a, :message "A?");
          input(
            (:type :text, :name :b, :message "B?"),
            (:type :number, :name :c, :message "C?"),
          );
        `));

        stdout.stop();

        expect(serialize(result)).to.eql('(:a "42"), (:b "OK", :c -1)');
        expect(stdout.output).to.eql(`${deindent(`
          ? A? › ? A? › 4? A? › 42✔ A? … 42
          ? B? › ? B? › O? B? › OK✔ B? … OK
          ? C? › ? C? › ? C? › -1✔ C? … -1
        `)}\n`);
      });

      it('puts(...) — will print to the stdout', async () => {
        stdout.start();

        await run(':import puts :from "IO";puts("OK\n")');

        stdout.stop();
        expect(stdout.output).to.eql('OK\n');
      });

      it('err(...) — will print to the stderr', async () => {
        stderr.start();

        await run(':import err :from "IO";err("ERR\n")');

        stderr.stop();
        expect(stderr.output).to.eql('ERR\n');
      });
    });
  });

  describe('Fs', () => {
    it('should allow to read filesystem', async () => {
      const result = await run(deindent(`
        :import read :from "Fs";
        :rescue read("im_not_exists");
        read("${__filename}");
      `));

      expect(result.length).to.eql(1);
      expect(serialize(result)).to.contains(fs.readFileSync(__filename).toString());
    });
  });
});
