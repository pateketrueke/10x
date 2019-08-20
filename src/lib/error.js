function repeat(char, length) {
  return Array.from({ length }).join(char);
}

function pad(nth, length) {
  return `     ${nth}`.substr(-length);
}

export default class ParseError extends Error {
  constructor(msg, ctx) {
    super(msg);
    this.ctx = ctx;
  }

  static build(e, src, expr, lines = 2, filepath = null) {
    if (e.ctx) {
      let token = e.ctx.cur;

      if (Array.isArray(token[0])) {
        token = token[0];
      }

      if (!token._offset) {
        return e;
      }

      const [[x1, y1], [x2, y2]] = token._offset;
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
