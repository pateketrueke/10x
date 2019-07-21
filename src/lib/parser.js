const OP_TYPES = {
  '=': 'equal',
  '+': 'plus',
  '-': 'min',
  '/': 'div',
  '*': 'mul',
  ',': 'or',
  ';': 'k',
};

const RE_DAYS = /^(?:now|today|tonight|tomorrow|yesterday|weekend)$/i;
const RE_HOURS = /^(?:2[0-3]|[01]?[0-9])(?::[0-5]?[0-9])*(?:\s*[ap]m)$/i;
const RE_MONTHS = /^(?:jan|feb|mar|apr|mar|may|jun|jul|aug|sep|oct|nov|dec)/i;

export const isOp = (a, b = '') => /^[-+=*/;_]$/.test(a) && !b.includes(a);
export const isSep = (a, b = '') => a === '(' || a === ')' || a === ' ' || b.includes(a);

export const isInt = x => /^\d+$/.test(x);
export const isFmt = x => /^[_*~]$/.test(x);
export const isNum = x => /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const isExpr = x => /^(?:from|of|a[ts]|in)$/i.test(x);
export const isChar = x => /^[a-zA-Z]+$/.test(x);

export const getOp = x => OP_TYPES[x];

export const hasNum = x => /\d/.test(x);
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
      || (isInt(line) && cur === '/')
      || (hasNum(line) && isChar(cur))
      || (isChar(last) && cur === '-' && isChar(next))
      || (hasNum(oldChar) && last === '/' && isChar(next))
      || (cur === '/' && isChar(next) && hasNum(last) && !isNum(line))

      // add possible numbers
      || (hasNum(cur) && last === '/')
      || (hasNum(last) && cur === ':')
      || (hasNum(oldChar) && last === ' ' && isChar(cur))
      || (hasNum(last) && (cur === '%' || cur === ' ') && isChar(next))

      // underscores as unit/number separators
      || (isChar(last) && cur === '_' && hasNum(next)) || (last === '_' && hasNum(cur))
      || (hasNum(last) && cur === '_' && hasNum(next)) || (isChar(last) && cur === '_' && isChar(next))
    ) {
      // break on unknown units, or expressions
      if (last !== ' ' && !isChar(cur) && line.includes(' ')) {
        const [pre, word] = line.split(' ');
        const key = word + cur;

        // make sure we're ignoring unknown units
        if (isExpr(key) || !hasKeyword(key, units)) {
          prev[offset] = pre.split('');
          prev[++offset] = key.split('');

          return prev;
        }
      }

      buffer.push(cur);
    } else if (
      // skip separators
      isSep(cur, '/') || isSep(last, '*/') || line.charAt() === ','

      // skip after words
      || (isOp(last) && isChar(cur))
      || (isChar(cur) && last === '=')
      || (isChar(last) && cur === ',')

      // skip possible numbers
      || (hasNum(last) && isOp(cur) && cur !== '/')
      || (hasNum(last) && cur === '/' && !hasNum(next))
      || (hasNum(last) && cur === ',' && !hasNum(next))
      || (isOp(last, '-') && hasNum(cur) && !mayNumber)
      || (!hasNum(last) && isOp(cur) && oldChar !== cur)
      || (hasNum(oldChar) && last === '-' && hasNum(cur))
    ) {
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
  let depth = 0;

  const tree = root;
  const stack = [];
  const calls = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const fn = calls[calls.length - 1];
    const t = tokens[i];

    // skip text-nodes
    if (t[0] === 'text') continue;

    // group functions and calls
    if (fn) {
      fn[2].push(t);

      if (t[0] === 'open') depth++;
      if (t[0] === 'close') depth--;

      // handle definitions (end)
      if (t[0] === 'expr' && t[1] === ';') {
        if (depth !== 0) break;

        // build sub-tree and merge
        fn[2] = buildTree(fn[2]);
        root.push(fn);
        calls.pop();
      }

      continue;
    }

    // handle definitions (begin)
    if (t[0] === 'def') {
      const leaf = [t[0], t[1], []];

      leaf._offset = i;
      calls.push(leaf);
      continue;
    }

    // handle nesting
    if (t[0] === 'open' || t[0] === 'close') {
      if (t[0] === 'open') {
        const leaf = [];

        root._offset = i;
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

  // handle exceptions
  if (depth || (stack.length && ops)) {
    depth = depth || stack[0]._offset;

    const err = new Error(`Missing terminator for \`${
      tokens.slice(0, Math.max(1, depth - 1)).map(x => x[1]).join(' ')
    }\``);

    err.offset = depth;

    throw err;
  }

  return tree;
}
