/* eslint-disable no-multi-assign */

import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';

import Parser from '../src/lib/tree/parser';
import { execute } from '../src/lib';
import {
  print, markers, colorize, summary, inspect, format, main,
} from '../src/util';
import ansi from '../src/lib/ansi';

import {
  TEXT, COMMENT, REGEX, SYMBOL, STRING, LITERAL, NUMBER, PIPE, SOME, EVERY,
  OR, NOT, LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, EQUAL, LIKE,
  RANGE, BLOCK, COMMA, BEGIN, DONE, CLOSE, OPEN, DOT, EOL, EOF,
  MINUS, PLUS, MOD, MUL, DIV, HEADING, BLOCKQUOTE,
  OL_ITEM, UL_ITEM, CODE, BOLD, ITALIC, REF,
} from '../src/lib/tree/symbols';

function captureStdout(fn) {
  const prev = process.stdout.write;
  let output = '';

  process.stdout.write = chunk => {
    output += chunk;
    return true;
  };

  return Promise.resolve()
    .then(fn)
    .then(() => output)
    .finally(() => {
      process.stdout.write = prev;
    });
}

describe('Util', () => {
  beforeEach(() => {
    execute.failure = null;
    execute.info = { calls: [] };
  });

  test('print(...) writes joined text to stdout', async () => {
    const output = await captureStdout(() => {
      print('A', 'B', 1);
    });

    expect(output, 'AB1');
  });

  test('markers(...) only highlights bare template markers', () => {
    const color = { gray: x => `<${x}>` };
    const value = markers(color, 'a{b} #{c} {{d}}');

    expect(value, 'a<{b}> #{c} <{{d}>}');
  });

  test('colorize(...) formats known token groups and default branch', () => {
    expect(colorize(EOF, 'x')).toEqual('');

    expect(colorize(COMMENT, 'x')).toEqual(ansi.gray('x'));
    expect(colorize(null, ',')).toEqual(ansi.white(','));

    expect(colorize(CODE, 'x')).toEqual(ansi.cyanBright('x'));
    expect(colorize(BOLD, 'x')).toEqual(ansi.redBright.bold('x'));
    expect(colorize(ITALIC, 'x')).toEqual(ansi.yellowBright.italic('x'));

    expect(colorize(REF, 'x')).toEqual(ansi.white(ansi.underline('x')));

    expect(colorize(PLUS, '+')).toEqual(ansi.magenta('+'));
    expect(colorize(SYMBOL, ':x')).toEqual(ansi.yellow(':x'));

    expect(colorize(STRING, 'x{y}')).toEqual(ansi.blueBright(`x${ansi.gray('{y}')}`));
    expect(colorize(REGEX, '/x/')).toEqual(ansi.blueBright('/x/'));

    expect(colorize(LITERAL)).toEqual(ansi.white(undefined));
    expect(colorize(LITERAL, true)).toEqual(ansi.yellow(':on'));
    expect(colorize(LITERAL, false)).toEqual(ansi.white(undefined));
    expect(colorize(LITERAL, 'ok')).toEqual(ansi.white('ok'));

    expect(colorize(NUMBER, 10)).toEqual(ansi.blue(10));
    expect(colorize(Symbol('unknown'), 'x')).toEqual(ansi.bgRedBright('x'));

    expect(colorize(COMMENT, 'x', true)).toEqual(ansi.dim.gray('x'));
  });

  test('colorize(...) handles remaining grouped operator tokens', () => {
    [
      PIPE, SOME, EVERY, OR, NOT, LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, EQUAL, LIKE,
      RANGE, BLOCK, COMMA, BEGIN, DONE, CLOSE, OPEN, DOT, EOL,
      MINUS, MOD, MUL, DIV, HEADING, BLOCKQUOTE, OL_ITEM, UL_ITEM, TEXT,
    ].forEach(type => {
      colorize(type, 'x');
    });
  });

  test('summary(...) returns formatted debug and parser-fallback text', () => {
    const err = new Error('Boom');

    err.stack = 'Boom';
    err.line = 0;
    err.col = 0;

    const ok = summary(err, '1+2');

    expect(ok).toContain('Boom');
    expect(ok).toContain('|');

    const originalGetAST = Parser.getAST;

    try {
      Parser.getAST = () => {
        throw new Error('fail');
      };

      const failed = summary(err, 'x+y');

      expect(failed).toContain('x+y');
    } finally {
      Parser.getAST = originalGetAST;
    }
  });

  test('inspect(...) prints tree-like lines for pivot/depth combinations', async () => {
    const output = await captureStdout(() => {
      inspect([
        ['Eval', 1, [1]],
        ['Lit', 2, [2]],
        ['Lit', 2, [3]],
        ['Eval', 1, [4]],
      ]);
    });

    expect(output).toContain('├──');
    expect(output).toContain('├─');
    expect(output).toContain('└─');
    expect(output).toContain('│');
  });

  test('format(...) uses inline flag to control parser mode', async () => {
    const originalGetAST = Parser.getAST;
    const args = [];

    try {
      Parser.getAST = (...input) => {
        args.push(input);
        return [];
      };

      await captureStdout(() => format('1+2', false, true));
      await captureStdout(() => format('1+2', true, false));

      expect(args[0][1], 'inline');
      expect(args[1][1], 'raw');
    } finally {
      Parser.getAST = originalGetAST;
    }
  });

  test('main(...) evaluates code and prints result', async () => {
    const output = await captureStdout(() => main('1+2'));

    expect(output).toContain('3');
  });

  test('main(...) applies prelude and supports info mode for short callstacks', async () => {
    const output = await captureStdout(() => main('1+1', false, null, true, false, () => '2+2'));

    expect(output).toContain('step');
    expect(output).toContain('4');
  });

  test('main(...) uses truncated inspect path for long callstacks in raw mode', async () => {
    execute.failure = null;
    execute.info = {
      calls: Array.from({ length: 100 }).map(() => ['Eval', 1, [1]]),
    };

    const output = await captureStdout(() => main('1+2', true, null, true));

    expect(output).toContain('100 steps');
  });

  test('main(...) prints summary on execution failures', async () => {
    const output = await captureStdout(() => main('x'));

    expect(output).toContain('Undeclared local `x`');
  });
});
