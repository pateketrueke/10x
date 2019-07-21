const OP_TYPES = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
  ',': 'or',
  ';': 'k',
};

const RE_NUM = /\d/;
const RE_FMT = /^[_*~]$/;
const RE_OPS = /^[-+=*/;_]$/;
const RE_WORD = /^[a-zA-Z]+$/;
const RE_EXPRS = /^(?:from|of|a[ts]|in)$/i;
const RE_DIGIT = /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/;
const RE_DAYS = /^(?:now|today|tonight|tomorrow|yesterday|weekend)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::[0-5]?[0-9])*(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)/i;

export const isOp = (a, b = '') => RE_OPS.test(a) && !b.includes(a);
export const isSep = (a, b = '') => a === '(' || a === ')' || a === ' ' || b.includes(a);

export const isFmt = x => RE_FMT.test(x);
export const isNum = x => RE_DIGIT.test(x);
export const isExpr = x => RE_EXPRS.test(x);
export const isWord = x => RE_WORD.test(x);

export const getOp = x => OP_TYPES[x];

export const hasNum = x => RE_NUM.test(x);
export const hasDays = x => RE_DAYS.test(x);
export const hasMonths = x => RE_MONTHS.test(x);

export const hasKeyword = (x, units) => {
  if (!x) return false;

  const key = x.replace(/^[^a-zA-Z]*/g, '');
  const test = key && (units[key] || units[key.toLowerCase()]);

  return test;
};

export const hasDatetime = x => {
  return x && (RE_MONTHS.test(x) || RE_DAYS.test(x) || RE_HOURS.test(x));
};

export function parseBuffer(text, units) {
  let mayNumber = false;
  let inHeading = false;
  let inFormat = false;
  let oldChar = '';
  let offset = 0;
  let open = 0;

  const chars = text.replace(/\s/g, ' ').split('');
  const tokens = chars.reduce((prev, cur, i) => {
    const buffer = prev[offset] || (prev[offset] = []);
    const last = buffer[buffer.length - 1];
    const line = buffer.join('');
    const next = chars[i + 1];

    // skip closing chars if they're not well paired
    if (!open && cur === ')') {
      buffer.push(cur);
      return prev;
    }

    if (cur === '(') open++;
    if (cur === ')') open--;

    // normalize well-known dates
    if (hasMonths(line)) {
      if (cur === ',' || (cur === ' ' && hasNum(next)) || hasNum(cur)) {
        buffer.push(cur);
        return prev;
      }

      if (!hasNum(cur)) {
        prev[++offset] = [cur];
        return prev;
      }
    }

    // otherwise, we just add anything to the current buffer line
    if (
      inFormat || inHeading || typeof last === 'undefined'

      // add consecutive format-chars
      || (isFmt(last) && isFmt(cur) && last === cur)

      // add from other units
      || (isWord(last) && cur === '/')
      || (hasNum(last) && cur === '/' && isWord(next))
      || (isWord(last) && cur === '-' && isWord(next))

      // add possible numbers
      || (hasNum(cur) && last === '/')
      || (hasNum(last) && cur === ':')
      || (hasNum(oldChar) && last === ' ' && isWord(cur))
      || (hasNum(last) && (cur === '%' || cur === ' ') && isWord(next))

      // underscores as unit/number separators
      || (isWord(last) && cur === '_' && hasNum(next)) || (last === '_' && hasNum(cur))
      || (hasNum(last) && cur === '_' && hasNum(next)) || (isWord(last) && cur === '_' && isWord(next))
    ) {
      buffer.push(cur);
    } else if (
      // skip separators
      isSep(cur, '/') || isSep(last, '*/') || line.charAt() === ','

      // skip after words
      || (isOp(last) && isWord(cur))
      || (isWord(cur) && last === '=')
      || (isWord(last) && cur === ',')

      // skip possible numbers
      || (hasNum(last) && isOp(cur) && cur !== '/')
      || (hasNum(last) && cur === '/' && !hasNum(next))
      || (hasNum(last) && cur === ',' && !hasNum(next))
      || (isOp(last, '-') && hasNum(cur) && !mayNumber)
      || (!hasNum(last) && isOp(cur) && oldChar !== cur)
      || (hasNum(oldChar) && last === '-' && hasNum(cur))
    ) {
      // break on unknown units, or expressions
      if (last !== ' ' && line.includes(' ')) {
        const [pre, word] = line.split(' ');

        // make sure we're ignoring unknown units
        if (isExpr(word) || !hasKeyword(word, units)) {
          prev[offset] = [pre];
          prev[++offset] = [word];
        }
      } else if (line.charAt(line.length - 1) === '/') {
        prev[offset] = prev[offset].slice(0, line.length - 1);
        prev[++offset] = ['/'];
      }

      prev[++offset] = [cur];
    } else {
      buffer.push(cur);
    }

    // flag possible negative numbers
    mayNumber = last === '-' && hasNum(cur);

    // enable headings, skip everything
    if (cur === '#' && i === 0) inHeading = true;

    // handle backticks for inline-code
    if (cur === '`') inFormat = !inFormat;

    // allow skip from open/close chars
    if (last === cur && isFmt(cur)) {
      inFormat = !inFormat;
      oldChar = '';
    } else if (last !== ' ') {
      oldChar = last;
    }

    return prev;
  }, []);

  return tokens.map(l => l.join(''));
}

export function buildTree(tokens) {
  let ops = false;
  let root = [];

  const tree = root;
  const stack = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];

    if (t[0] === 'open' || t[0] === 'close') {
      if (t[0] === 'open') {
        const leaf = [];
        root._depth = i;
        root.push(leaf);
        stack.push(root);
        root = leaf;
        ops = false;
      } else if (t[0] === 'close') {
        root = stack.pop();
        ops = false;
      }
    } else if (root) {
      if (isOp(t[1])) ops = true;
      root.push(t);
    } else break;
  }

  if (stack.length && ops) {
    const depth = stack[0]._depth;
    const prefix = depth === 0 ? '^' : '';
    const expr = tokens.slice(0, depth + 1).map(x => x[1]).join(' ');
    const err = new Error(`Missing terminator for \`${prefix}${expr}\``);

    err.offset = depth;

    throw err;
  }

  return tree;
}
