import {
  TIME_UNITS,
} from './convert';

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

export const isOp = (a, b = '') => `${b}-+=*/;_`.includes(a);
export const isSep = (a, b = '') => `${b}(;,)`.includes(a);
export const isChar = (a, b = '') => /^[a-zA-Z]+/.test(a) || b.includes(a);

export const isInt = x => /^\d+$/.test(x);
export const isFmt = x => /^[_*~]$/.test(x);
export const isAny = x => /\W/.test(x) && !isOp(x);
export const isNth = x => /^(?:th|[rn]d)y?$/.test(x);
export const isNum = x => /^-?[$€£¢]?(?:\.\d+|\d+(?:[_,.]\d+)*)%?/.test(x);
export const isExpr = x => /^(?:from|of|a[ts]|in)$/i.test(x);
export const isTime = x => TIME_UNITS.includes(x);
export const isJoin = x => '_,.'.includes(x);

export const getOp = x => OP_TYPES[x];

export const hasNum = x => /\d/.test(x);
export const hasDays = x => RE_DAYS.test(x);
export const hasMonths = x => RE_MONTHS.test(x);

export const hasPercent = x => {
  return typeof x === 'string' && x.charAt(x.length - 1) === '%';
};

export const hasKeyword = (x, units) => {
  if (!x) return false;

  const key = x.replace(/^[^a-zA-Z]*/g, '');
  const test = key && (units[key] || units[key.toLowerCase()]);

  return test;
};

export const hasDatetime = x => {
  return x && (RE_MONTHS.test(x) || RE_DAYS.test(x) || RE_HOURS.test(x));
};

export function toNumber(value) {
  if (typeof value === 'string') {
    if (value.includes('/')) {
      const [a, b] = value.split('/');

      return a / b;
    }

    return parseFloat(value.replace(/[^a-z\s\d.-]/ig, ''));
  }

  return value;
}

export function joinTokens(data, units) {
  const buffer = [];

  let offset = 0;

  for (let i = 0; i < data.length; i += 1) {
    const cur = data[i];
    const next = data[i + 1];

    // accumulated tokens from current line
    const stack = buffer[offset] || (buffer[offset] = []);

    // last added token on the stack
    const oldChar = stack[stack.length - 1]
      || (buffer.length > 1 && buffer[offset - 1][0]);

    // handle unit expressions, with numbers
    if (hasNum(oldChar) && cur === ' ' && hasKeyword(next, units)) {
      if (stack.length) {
        buffer[offset++] = [oldChar + cur + next];
      } else {
        buffer.splice(offset - 1, 2, [oldChar + cur + next]);
      }

      data.splice(i - 1, 1);
      stack.pop();
      continue;
    }

    // split on date formats
    if (hasMonths(stack[0])) {
      buffer[++offset] = [cur];
      offset++;
      continue;
    }

    // concatenate until we reach units
    if (
      (!isOp(next, '()')
        && (isChar(cur) || cur === ' ')
        && !(isSep(stack[0]) || isOp(stack[0])))

      || (isChar(oldChar) && (isSep(cur, ' ') || (next === ',' || next === ' ')))
      || ((next === '-' && isChar(cur) && isChar(stack[0])) || (cur === '-' && isChar(next)))
    ) {
      // ensure we skip white-space
      if (stack[0] !== ' ' || (next === ' ' || cur === ' ' || !next)) {
        stack.push(cur);
        continue;
      }
    }

    // otherwise, just continue splitting...
    if (!buffer[offset].length) offset--;
    buffer[++offset] = [cur];
    offset++;
  }

  return buffer.map(x => x.join(''));
}

export function parseBuffer(text) {
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
    if (hasMonths(line) && (cur === ',' || cur === ' ')) {
      if (cur === ',' || (cur === ' ' && isNum(next)) || hasNum(cur)) {
        buffer.push(cur);
        return prev;
      }

      if (!hasNum(cur)) {
        prev[++offset] = [cur];
        return prev;
      }
    }

    if (
      inFormat || inHeading || typeof last === 'undefined'

      // keep white-space
      || ((last === ' ' && cur === ' '))
      || (isChar(last) && isAny(cur) && !isSep(cur, ' '))
      || ((isNum(cur) || isChar(cur)) && !(isOp(last, ' ') || isSep(last)))

      // keep words and numbers together
      || (isNum(last) && isNum(cur)) || (isChar(last) && isChar(cur))
      || (isNum(last) && isChar(cur)) || (isChar(last) && isNum(cur))

      // keep some separators between numbers
      || (isJoin(last) && isNum(cur)) || (isNum(last) && isJoin(cur) && isNum(next))

      // handle fractions
      || (isNum(last) && cur === '/' && isNum(next)) || (isNum(oldChar) && last === '/' && isNum(cur))

      // handle numbers, including negatives between ops; notice all N-N are splitted
      || (isNum(last) && cur === '.') || (last === '-' && isNum(cur) && !isNum(oldChar)) || (last === '.' && isNum(cur) && hasNum(oldChar))
    ) {
      buffer.push(cur);
    } else {
      prev[++offset] = [cur];
    }

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

    // skip non math-tokens
    if (!['def', 'call', 'unit', 'expr', 'open', 'close', 'number'].includes(t[0])) continue;

    // fix nested-nodes
    if ((t[0] === 'def' || t[0] === 'call') && t[2]) {
      t[2] = buildTree(t[2]);
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
  if (depth || calls.length || (stack.length && ops)) {
    depth = depth || (calls[0] || stack[0])._offset;

    const err = new Error(`Missing terminator for \`${
      tokens.slice(0, Math.max(1, depth - 1)).map(x => x[1]).join(' ')
    }\``);

    err.offset = depth;

    throw err;
  }

  return tree;
}
