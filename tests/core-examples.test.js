/**
 * Tests for core language examples
 */

import { expect, test, describe } from 'bun:test';
import { execute as run } from '../src/lib';
import Expr from '../src/lib/tree/expr';

describe('Core: Arithmetic', () => {
  test('basic addition', async () => {
    expect(await run('1 + 2.')).toEqual([Expr.value(3)]);
  });

  test('basic subtraction', async () => {
    expect(await run('3 - 1.')).toEqual([Expr.value(2)]);
  });

  test('basic multiplication', async () => {
    // NOTE: `2 * 3` with spaces fails - use `2*3` without spaces
    expect(await run('2*3.')).toEqual([Expr.value(6)]);
  });

  test('basic division', async () => {
    expect(await run('6 / 2.')).toEqual([Expr.value(3)]);
  });

  test('modulo', async () => {
    expect(await run('5 % 3.')).toEqual([Expr.value(2)]);
  });

  test('negative numbers', async () => {
    expect(await run('-5 + 3.')).toEqual([Expr.value(-2)]);
  });

  test('order of operations', async () => {
    expect(await run('2 + 3 * 4.')).toEqual([Expr.value(14)]);
  });

  test('parentheses', async () => {
    expect(await run('(2 + 3) * 4.')).toEqual([Expr.value(20)]);
  });
});

describe('Core: Comparisons', () => {
  test('equal', async () => {
    expect(await run('(= 1 1).')).toEqual([Expr.value(true)]);
  });

  test('not equal', async () => {
    expect(await run('(!= 1 2).')).toEqual([Expr.value(true)]);
  });

  test('less than', async () => {
    expect(await run('(< 1 2).')).toEqual([Expr.value(true)]);
  });

  test('greater than', async () => {
    expect(await run('(> 3 1).')).toEqual([Expr.value(true)]);
  });

  test('less than or equal', async () => {
    expect(await run('(<= 2 2).')).toEqual([Expr.value(true)]);
  });

  test('greater than or equal', async () => {
    expect(await run('(>= 3 3).')).toEqual([Expr.value(true)]);
  });
});

describe('Core: Strings', () => {
  test('basic string', async () => {
    expect(await run('"hello".')).toEqual([Expr.value('hello')]);
  });

  test('string concatenation', async () => {
    expect(await run('"hello" + " world".')).toEqual([Expr.value('hello world')]);
  });

  test('string interpolation', async () => {
    expect(await run('name = "World".\n"Hello, #{name}!".')).toEqual([Expr.value('Hello, World!')]);
  });
});

describe('Core: Ranges', () => {
  test('simple range', async () => {
    expect(await run('1..5')).toEqual([Expr.array([
      Expr.value(1),
      Expr.value(2),
      Expr.value(3),
      Expr.value(4),
      Expr.value(5),
    ])]);
  });

  test('negative range', async () => {
    expect(await run('-3..0')).toEqual([Expr.array([
      Expr.value(-3),
      Expr.value(-2),
      Expr.value(-1),
      Expr.value(0),
    ])]);
  });

  test('take from infinite range', async () => {
    expect(await run('1..:5')).toEqual([
      Expr.value(1),
      Expr.value(2),
      Expr.value(3),
      Expr.value(4),
      Expr.value(5),
    ]);
  });
});

describe('Core: Lists', () => {
  test('empty list', async () => {
    const result = await run('[].');
    expect(result.length).toBe(1);
    expect(result[0].isRange).toBe(true);
  });

  test('list with elements', async () => {
    const result = await run('[1, 2, 3].');
    expect(result.length).toBe(1);
    expect(result[0].isRange).toBe(true);
  });
});

describe('Core: Functions', () => {
  test('simple function', async () => {
    expect(await run('double = x -> x * 2.\ndouble(5).')).toEqual([Expr.value(10)]);
  });

  test('multi-arg function', async () => {
    expect(await run('add = (a b) -> a + b.\nadd(3, 4).')).toEqual([Expr.value(7)]);
  });

  test('recursive function', async () => {
    expect(await run('factorial = n -> @if (= n 0) 1 @else n * factorial(n - 1).\nfactorial(5).')).toEqual([Expr.value(120)]);
  });
});

describe('Core: Control Flow', () => {
  test('ternary operator true', async () => {
    expect(await run(':on ? "yes" | "no".')).toEqual([Expr.value('yes')]);
  });

  test('ternary operator false', async () => {
    expect(await run(':off ? "yes" | "no".')).toEqual([Expr.value('no')]);
  });

  test('default value', async () => {
    expect(await run('0 | 1.')).toEqual([Expr.value(1)]);
  });

  test('@if/@else', async () => {
    expect(await run('@if (= 1 1) "yes" @else "no".')).toEqual([Expr.value('yes')]);
  });

  test('@if/@else false branch', async () => {
    expect(await run('@if (= 1 2) "yes" @else "no".')).toEqual([Expr.value('no')]);
  });
});
