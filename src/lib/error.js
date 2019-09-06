import {
  deindent,
  flatten,
  repeat,
  pad,
} from './utils';

export default class Err extends Error {
  constructor(msg, ctx) {
    let stack;

    if (msg instanceof Error) {
      stack = msg.stack;
      msg = msg.message;
    }

    super(deindent(msg));

    this._stack = stack;
    this.target = undefined;
    this.offsets = undefined;

    if (ctx) {
      this.target = ctx.cur;

      if (ctx.begin) {
        this.target = ctx;
        this.offsets = [ctx.begin, ctx.end];
      }

      if (ctx.cur) {
        const ast = flatten(ctx.tokens);

        if (!ast.length) {
          this.offsets = [ctx.cur.begin, ctx.cur.end];
        } else {
          this.offsets = [ast[0].begin, ast[ast.length - 1].end];
        }
      }
    }
  }

  static build(e, src, lines = 2, filepath = null) {
    if (e.offsets && e.offsets[0]) {
      const [[x1, y1], [x2, y2]] = e.offsets;
      const prefix = filepath ? `${filepath}:` : 'line ';

      e.stack = `${e.message} at ${prefix}${x1 + 1}:${y1 + 1}\n\n${src.split('\n').reduce((prev, cur, i) => {
        if (i >= x1 - lines && i <= x2 + lines) {
          if (i === x1) {
            prev.push(` ${pad(i + 1, 5)} | ${cur}\n${repeat('-', y1 + 10)}${repeat('^', y2 - y1)}^`);
          } else {
            prev.push(` ${pad(i + 1, 5)} | ${cur}`);
          }
        }
        return prev;
      }, []).join('\n')}\n`;
    }

    return e;
  }
}
