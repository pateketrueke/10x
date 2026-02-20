/* eslint-disable no-multi-assign */

import chalk from 'chalk';
import { expect } from 'chai';

import Parser from '../src/lib/tree/parser';
import { execute } from '../src/lib';
import {
  print, markers, colorize, summary, inspect, format, main,
} from '../src/util';

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

  it('print(...) writes joined text to stdout', async () => {
    const output = await captureStdout(() => {
      print('A', 'B', 1);
    });

    expect(output).to.eql('AB1');
  });

  it('markers(...) only highlights bare template markers', () => {
    const color = { gray: x => `<${x}>` };
    const value = markers(color, 'a{b} #{c} {{d}}');

    expect(value).to.eql('a<{b}> #{c} <{{d}>}');
  });

  it('colorize(...) formats known token groups and default branch', () => {
    expect(colorize(EOF, 'x')).to.eql('');

    expect(colorize(COMMENT, 'x')).to.eql(chalk.gray('x'));
    expect(colorize(null, ',')).to.eql(chalk.white(','));

    expect(colorize(CODE, 'x')).to.eql(chalk.cyanBright('x'));
    expect(colorize(BOLD, 'x')).to.eql(chalk.redBright.bold('x'));
    expect(colorize(ITALIC, 'x')).to.eql(chalk.yellowBright.italic('x'));

    expect(colorize(REF, 'x')).to.eql(chalk.white(chalk.underline('x')));

    expect(colorize(PLUS, '+')).to.eql(chalk.magenta('+'));
    expect(colorize(SYMBOL, ':x')).to.eql(chalk.yellow(':x'));

    expect(colorize(STRING, 'x{y}')).to.eql(chalk.blueBright(`x${chalk.gray('{y}')}`));
    expect(colorize(REGEX, '/x/')).to.eql(chalk.blueBright('/x/'));

    expect(colorize(LITERAL)).to.eql(chalk.white(undefined));
    expect(colorize(LITERAL, true)).to.eql(chalk.yellow(':on'));
    expect(colorize(LITERAL, false)).to.eql(chalk.white(undefined));
    expect(colorize(LITERAL, 'ok')).to.eql(chalk.white('ok'));

    expect(colorize(NUMBER, 10)).to.eql(chalk.blue(10));
    expect(colorize(Symbol('unknown'), 'x')).to.eql(chalk.bgRedBright('x'));

    expect(colorize(COMMENT, 'x', true)).to.eql(chalk.dim.gray('x'));
  });

  it('colorize(...) handles remaining grouped operator tokens', () => {
    [
      PIPE, SOME, EVERY, OR, NOT, LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, EQUAL, LIKE,
      RANGE, BLOCK, COMMA, BEGIN, DONE, CLOSE, OPEN, DOT, EOL,
      MINUS, MOD, MUL, DIV, HEADING, BLOCKQUOTE, OL_ITEM, UL_ITEM, TEXT,
    ].forEach(type => {
      colorize(type, 'x');
    });
  });

  it('summary(...) returns formatted debug and parser-fallback text', () => {
    const err = new Error('Boom');

    err.stack = 'Boom';
    err.line = 0;
    err.col = 0;

    const ok = summary(err, '1+2');

    expect(ok).to.contains('Boom');
    expect(ok).to.contains('|');

    const originalGetAST = Parser.getAST;

    try {
      Parser.getAST = () => {
        throw new Error('fail');
      };

      const failed = summary(err, 'x+y');

      expect(failed).to.contains('x+y');
    } finally {
      Parser.getAST = originalGetAST;
    }
  });

  it('inspect(...) prints tree-like lines for pivot/depth combinations', async () => {
    const output = await captureStdout(() => {
      inspect([
        ['Eval', 1, [1]],
        ['Lit', 2, [2]],
        ['Lit', 2, [3]],
        ['Eval', 1, [4]],
      ]);
    });

    expect(output).to.contains('├──');
    expect(output).to.contains('├─');
    expect(output).to.contains('└─');
    expect(output).to.contains('│');
  });

  it('format(...) uses inline flag to control parser mode', async () => {
    const originalGetAST = Parser.getAST;
    const args = [];

    try {
      Parser.getAST = (...input) => {
        args.push(input);
        return [];
      };

      await captureStdout(() => format('1+2', false, true));
      await captureStdout(() => format('1+2', true, false));

      expect(args[0][1]).to.eql(false);
      expect(args[1][1]).to.eql(null);
    } finally {
      Parser.getAST = originalGetAST;
    }
  });

  it('main(...) evaluates code and prints result', async () => {
    const output = await captureStdout(() => main('1+2'));

    expect(output).to.contains('3');
  });

  it('main(...) applies prelude and supports info mode for short callstacks', async () => {
    const output = await captureStdout(() => main('1+1', false, null, true, false, () => '2+2'));

    expect(output).to.contains('step');
    expect(output).to.contains('4');
  });

  it('main(...) uses truncated inspect path for long callstacks in raw mode', async () => {
    execute.failure = null;
    execute.info = {
      calls: Array.from({ length: 100 }).map(() => ['Eval', 1, [1]]),
    };

    const output = await captureStdout(() => main('1+2', true, null, true));

    expect(output).to.contains('100 steps');
  });

  it('main(...) prints summary on execution failures', async () => {
    const output = await captureStdout(() => main('x'));

    expect(output).to.contains('Undeclared local `x`');
  });
});
