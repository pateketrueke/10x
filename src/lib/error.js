function repeat(char, length) {
  return Array.from({ length }).join(char);
}

function pad(nth, length) {
  return `     ${nth}`.substr(-length);
}

export default class ParseError extends Error {
  constructor(msg, ctx, expr) {
    super(msg);

    this.ctx = ctx;
    this.expr = expr;
  }

  static build(e, code, lines = 2, source = null) {
    const [[x1, y1], [x2, y2]] = e.ctx.token || (Array.isArray(e.ctx.cur[0]) ? e.ctx.cur[0] : e.ctx.cur)._offset;

    e.stack = `${e.message}\n  at ${source || 'line '}${x1 + 1}:${y1 + 1}\n\n${code.split('\n').reduce((prev, cur, i) => {

      if (i >= x1 - lines && i <= x2 + lines) {
        if (i === x1) {
          prev.push(` ${pad(i + 1, 5)} | ${cur}\n${repeat('-', y1 + 10)}${repeat('^', y2 - y1)}^`);
        } else {
          prev.push(` ${pad(i + 1, 5)} | ${cur}`);
        }
      }

      return prev;
    }, []).join('\n')}\n`;

    return e;
  }
}
