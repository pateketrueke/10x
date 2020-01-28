/* istanbul ignore file */

import chalk from 'chalk';

import Env from './lib/tree/env';
import Expr from './lib/tree/expr';
import Parser from './lib/tree/parser';

import { execute } from './lib';

import {
  debug, literal, serialize,
} from './lib/helpers';

import {
  TEXT, COMMENT, COMMENT_MULTI, REGEX, SYMBOL, STRING, LITERAL, NUMBER, PIPE, SOME, EVERY,
  OR, NOT, LESS, LESS_EQ, GREATER, GREATER_EQ, EXACT_EQ, NOT_EQ, EQUAL, LIKE,
  RANGE, BLOCK, COMMA, BEGIN, DONE, CLOSE, OPEN, DOT, EOL, EOF,
  MINUS, PLUS, MOD, MUL, DIV, HEADING, BLOCKQUOTE,
  OL_ITEM, UL_ITEM, CODE, BOLD, ITALIC, REF,
} from './lib/tree/symbols';

export function print(...args) {
  process.stdout.write(args.join(''));
}

export function markers(color, value) {
  return value
    .replace(/(?<![{#])\{(.+?)\}/g, (_, v) => color.gray(`{${v}}`));
}

export function colorize(type, value, dimmed) {
  const color = dimmed ? chalk.dim : chalk;

  value = value || literal({ type });

  if (type === EOF) return '';

  switch (type) {
    case true:
    case COMMENT: case COMMENT_MULTI:
    case CLOSE: case OPEN: case BEGIN: case DONE:
      return color.gray(value);

    case null:
    case EOL: case COMMA: case RANGE: case DOT:
      return color.white(value);


    case CODE: return color.cyanBright(value);
    case BOLD: return color.redBright.bold(value);
    case ITALIC: return color.yellowBright.italic(value);

    case REF:
      value = chalk.underline(value);

    case TEXT:
      return color.white(value);

    case LESS: case LESS_EQ: case GREATER: case GREATER_EQ: case EXACT_EQ: case NOT_EQ: case EQUAL:
    case MINUS: case PLUS: case MUL: case DIV: case MOD: case NOT: case SOME: case EVERY:
    case MOD: case PIPE: case BLOCK: case MINUS: case PLUS: case LIKE: case OR:
    case OL_ITEM: case UL_ITEM: case HEADING: case BLOCKQUOTE:
      return color.magenta(value);

    case SYMBOL:
      return color.yellow(value);

    case STRING:
      value = markers(color, value);

    case REGEX:
      return color.blueBright(value);

    case LITERAL:
      if (value === null) return color.yellow(':nil');
      if (value === true) return color.yellow(':on');
      if (value === false) return color.yellow(':off');

      return color.white(value);

    case NUMBER:
      return color.blue(value);

    default:
      return color.bgRedBright(value);
  }
}

export function summary(e, code, noInfo) {
  return debug(e, code, noInfo, source => {
    try {
      return Parser.getAST(source, true).map(chunk => {
        const highlighted = !chunk.lines.includes(e.line);

        return chunk.body.map(x => {
          return serialize(x, null, (k, v) => colorize(k, v, highlighted));
        }).join('');
      }).join('');
    } catch (e) {
      return chalk.red(source);
    }
  }, colorize).trim();
}

export function inspect(calls) {
  calls.forEach(([type, depth, tokens], key, items) => {
    const nextItem = items[key + 1];

    let prefix = '';
    let pivot = '';

    if (!nextItem || nextItem[1] !== depth) {
      pivot = key ? '└─' : '├──';
    } else {
      pivot = '├─';
    }

    if (depth > 1) {
      prefix += `│${Array.from({ length: depth }).join('  ')}${pivot} `;
    } else {
      prefix += `${pivot} `;
    }

    const value = serialize(tokens, true, colorize, type);
    const indent = `             ${type} `.substr(-15);

    print(indent, prefix, value, '\n');
  });
}

export async function format(code, color, inline) {
  print(serialize.call({}, Parser.getAST(code, inline ? false : null), null, color ? colorize : undefined), '\n');
}

export async function main(code, raw, env, info, noInfo, prelude) {
  try {
    if (!raw && typeof prelude === 'function') {
      code = await prelude(env, code) || code;
    }

    const result = raw ? Parser.getAST(code, false, env) : await execute(code, env, info);

    if (execute.failure) {
      throw execute.failure;
    }

    print('\r');

    if (info) {
      const { length } = execute.info.calls;

      if (length < 100) {
        inspect(execute.info.calls);
      } else {
        inspect([execute.info.calls[0]]);
      }

      print(`               ├ ${colorize(true, `${length} step${length === 1 ? '' : 's'}`)} \n`);
      print('               └ ', serialize(result, null, colorize), '\n');
    } else if (result) {
      print(serialize(result, null, colorize), '\n');
    }
  } catch (e) {
    print(summary(e, code, noInfo), '\n');
  }
}
