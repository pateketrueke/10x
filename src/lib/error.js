function deindent(text, length) {
  const tabs = ((text.match(/^\s+/m) || [])[0] || '').substr(1);

  return text.split('\n').map(x => x.substr(tabs.length)).join('\n').trim();
}

function repeat(char, length) {
  return Array.from({ length }).join(char);
}

function pad(nth, length) {
  return `     ${nth}`.substr(-length);
}

export default class LangErr extends Error {
  constructor(msg, ctx) {
    super(deindent(msg));

    this.target = undefined;
    this.offsets = undefined;

    if (ctx) {
      this.target = ctx.cur;

      if (ctx.content) {
        this.offsets = [ctx.begin, ctx.end];
      }

      if (ctx.cur) {
        if (!ctx.tokens.length) {
          this.offsets = [ctx.cur.begin, ctx.cur.end];
        } else {
          this.offsets = [ctx.tokens[0].begin, ctx.tokens[ctx.tokens.length - 1].end];
        }
      }
    }
  }

  static build(e, src, lines = 2, filepath = null) {
    if (e.offsets) {
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
