/**
 * E2E tests for string examples
 */

import { execute as run } from '../../src/lib';
import Expr from '../../src/lib/tree/expr';
import { expect, test, describe } from 'bun:test';

describe('E2E: String Examples', () => {
  describe('Basic Strings', () => {
    test('"hello"', async () => {
      expect(await run('"hello".')).toEqual([Expr.value('hello')]);
    });

    test('empty string', async () => {
      expect(await run('"".')).toEqual([Expr.value('')]);
    });
  });

  describe('String Concatenation', () => {
    test('"hello" + " world"', async () => {
      expect(await run('"hello" + " world".')).toEqual([Expr.value('hello world')]);
    });

    test('"foo" + "bar"', async () => {
      expect(await run('"foo" + "bar".')).toEqual([Expr.value('foobar')]);
    });
  });

  describe('String Interpolation', () => {
    test('simple interpolation', async () => {
      expect(await run('name = "World".\n"Hello, #{name}!".')).toEqual([Expr.value('Hello, World!')]);
    });

    test('expression interpolation', async () => {
      expect(await run('"#{1 + 2}".')).toEqual([Expr.value('3')]);
    });

    test('multiple interpolations', async () => {
      expect(await run('a = 1.\nb = 2.\n"#{a} + #{b} = #{a + b}".')).toEqual([Expr.value('1 + 2 = 3')]);
    });
  });

  describe('Multi-line Strings', () => {
    test('triple quote strings', async () => {
      const result = await run('"""line1\nline2""".');
      expect(result[0].value).toContain('line1');
      expect(result[0].value).toContain('line2');
    });
  });
});
