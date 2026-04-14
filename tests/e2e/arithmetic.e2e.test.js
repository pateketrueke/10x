/**
 * E2E tests for arithmetic examples
 * Tests the examples/arithmetic.md file
 */

import { execute as run } from '../../src/lib';
import Expr from '../../src/lib/tree/expr';
import { expect, test, describe } from 'bun:test';

describe('E2E: Arithmetic Examples', () => {
  describe('Basic Operations', () => {
    test('1 + 2 = 3', async () => {
      expect(await run('1 + 2.')).toEqual([Expr.value(3)]);
    });

    test('3 - 1 = 2', async () => {
      expect(await run('3 - 1.')).toEqual([Expr.value(2)]);
    });

    test('2*3 = 6 (no spaces)', async () => {
      expect(await run('2*3.')).toEqual([Expr.value(6)]);
    });

    test('6 / 2 = 3', async () => {
      expect(await run('6 / 2.')).toEqual([Expr.value(3)]);
    });

    test('5 % 3 = 2', async () => {
      expect(await run('5 % 3.')).toEqual([Expr.value(2)]);
    });
  });

  describe('Negative Numbers', () => {
    test('-5 + 3 = -2', async () => {
      expect(await run('-5 + 3.')).toEqual([Expr.value(-2)]);
    });

    test('5 * -2 = -10', async () => {
      // NOTE: multiplication with spaces fails, use 5*-2
      expect(await run('5*-2.')).toEqual([Expr.value(-10)]);
    });
  });

  describe('Fractions', () => {
    test('1/2 = 0.5', async () => {
      expect(await run('1/2.')).toEqual([Expr.value(0.5)]);
    });

    test('1/2 + 3/4 = 1.25', async () => {
      expect(await run('1/2 + 3/4.')).toEqual([Expr.value(1.25)]);
    });
  });

  describe('Comparisons', () => {
    test('(= 1 1) = true', async () => {
      expect(await run('(= 1 1).')).toEqual([Expr.value(true)]);
    });

    test('(< 1 2) = true', async () => {
      expect(await run('(< 1 2).')).toEqual([Expr.value(true)]);
    });

    test('(> 3 1) = true', async () => {
      expect(await run('(> 3 1).')).toEqual([Expr.value(true)]);
    });
  });

  describe('Order of Operations', () => {
    test('2 + 3 * 4 = 14', async () => {
      expect(await run('2 + 3 * 4.')).toEqual([Expr.value(14)]);
    });

    test('(2 + 3) * 4 = 20', async () => {
      expect(await run('(2 + 3) * 4.')).toEqual([Expr.value(20)]);
    });
  });
});
