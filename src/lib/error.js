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

  static build(e, src, lines = 2, filepath = null) {
    if (e.ctx) {
      let offsets;

      if (e.ctx.content) {
        offsets = [e.ctx.begin, e.ctx.end];
      } else if (e.ctx.cur) {
        offsets = (Array.isArray(e.ctx.cur[0]) ? e.ctx.cur[0] : e.ctx.cur)._offset;
      }

      if (offsets) {
        const [[x1, y1], [x2, y2]] = offsets;
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
    }

    return e;
  }
}
