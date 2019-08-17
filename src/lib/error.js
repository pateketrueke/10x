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

  static build(e, code) {
    const [[x1, y1], [x2, y2]] = e.ctx.cur._offset;

    e.stack = `${e.message} (at line ${x1 + 1}:${y1 + 1})\n${code.split('\n').map((x, i) => {
      if (i === x1) {
        return ` ${pad(i + 1, 3)} | ${x}\n${repeat('-',y1 + 8)}${repeat('^', y2)}^`;
      }

      return ` ${pad(i + 1, 3)} | ${x}`;
    }).join('\n')}`;

    return e;
  }
}
