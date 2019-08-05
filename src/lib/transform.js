import {
  isOp, isInt, isSep, isNum, hasNum, isAlpha, isChar, isExpr, hasKeyword, hasDatetime, hasMonths, hasDays,
  getOp, buildTree, cleanTree,
} from './parser';

export function toToken(offset, fromCallback, arg1, arg2, arg3) {
  const value = fromCallback(arg1, arg2, arg3);

  value._offset = offset;

  return value;
}

export function fromMarkdown(text) {
  // handle code blocks
  if (text.charAt() === '`' && text.charAt(text.length - 1) === '`') {
    return ['code', text];
  }

  // handle headings
  if (text.charAt() === '#') {
    const matches = text.match(/^(#+)(.*)$/);
    const level = Math.min(matches[1].length, 6);

    return ['heading', text, level];
  }

  // handle blockquotes
  if (text.charAt() === '>') {
    return ['blockquote', text];
  }

  // handle more formats: del, em, bold
  const begin = text.substr(0, 2);
  const end = text.substr(text.length - 2, 2);

  if (begin === '~~' && end === '~~') {
    return ['del', text];
  }

  if (begin === '__' && end === '__') {
    return ['em', text];
  }

  if (begin === '**' && end === '**') {
    return ['b', text];
  }

  return ['text', text];
}

export function fromSymbols(text, units, expression) {
  // try most char-expressions as valid units...
  if (expression && (isChar(text) || isAlpha(text))) {
    return ['unit', text];
  }

  // handle white-space
  if (text === ' ') {
    return ['text', ' '];
  }

  // handle expressions
  if (isExpr(text)) {
    return ['expr', text];
  }

  // handle operators
  if (isOp(text) || text === ',') {
    return ['expr', text, getOp(text)];
  }

  // handle separators
  if (text === '(' || text === ')') {
    return [text === '(' ? 'open' : 'close', text];
  }

  // handle fraction numbers
  if (text.includes('/')) {
    return ['number', text, 'x-fraction'];
  }

  // handle all datetimes
  if (hasDatetime(text)) {
    return ['number', text, 'datetime'];
  }

  const fixedUnit = hasKeyword(text, units);

  // extract well-known units
  if (fixedUnit) {
    if (isNum(text)) {
      return ['number', text, fixedUnit];
    }

    return ['unit', text].concat(fixedUnit !== text ? fixedUnit : []);
  }

  return ['number', text];
}

export function transform(input, units, types) {
  const stack = [];

  let inCall = false;
  let inMaths = false;

  let prevToken;
  let nextToken;

  const body = input.reduce((prev, cur, i) => {
    // resolve from given types
    if (types[cur]) {
      prev.push(toToken(i, () => ['number', cur, types[cur]]));
      return prev;
    }

    // flag possible expressions
    if (hasNum(cur)) inMaths = true;

    let inExpr = stack[stack.length - 1];
    let key = i;

    do {
      nextToken = input[++key];
    } while (nextToken && nextToken.charAt() === ' ');

    // handle expression blocks
    if (inExpr) {
      const token = toToken(i, fromSymbols, cur, units, true);

      // handle nested calls
      if (token[0] === 'unit' && nextToken === '(') token[0] = 'def';

      // append all nodes
      inExpr[2].push(token);

      // ensure we close and continue eating...
      if (cur === ';' || (inCall && cur === ')')) {
        prevToken = 'def';
        inCall = false;
        inMaths = false;

        // close var-expressions
        if (nextToken !== '=') {
          prev.push(inExpr);
          inExpr = false;
          stack.pop();
        }
      }

      return prev;
    }

    // skip separators after numbers, preceding keywords
    if (hasNum(prevToken) && ':,'.includes(cur) && nextToken && isExpr(nextToken)) return prev;

    // open var/call expressions
    if ((isChar(cur) || isAlpha(cur)) && (nextToken === '=' || nextToken === '(')) {
      inCall = nextToken === '(';
      stack.push(['def', cur, []]);

      // don't override builtins!
      if (!units[cur]) {
        units[cur] = cur;
      }

      return prev;
    }

    if (
      // handle most values
      isSep(cur) || hasNum(cur)

      // handle operators
      || (isOp(cur) && (
        (hasNum(prevToken) && nextToken === '(')
        || (hasNum(prevToken) && (hasNum(nextToken) || hasKeyword(nextToken, units)))
      ))

      // allow keywords after some dates
      || (isExpr(prevToken) && hasMonths(cur))
      || (hasDatetime(prevToken) && isExpr(cur) && isNum(nextToken))
      || hasDays(cur) || hasMonths(cur) || (hasNum(prevToken) && isExpr(cur))

      // handle expressions between numbers/units
      || (isOp(prevToken) && hasNum(cur))

      // handle units/expressions after maths, never before
      || (inMaths && (
        isExpr(cur) || (hasKeyword(cur, units) && (isOp(nextToken) || isExpr(prevToken) || isOp(prevToken)))
       ))
    ) {
      prev.push(toToken(i, fromSymbols, cur, units));
    } else {
      prev.push(toToken(i, fromMarkdown, cur));
    }

    if (!isSep(cur, ' ')) prevToken = cur;
    return prev;
  }, []);

  // append remaining tokens from calls
  if (stack.length) body.push(stack[0]);

  // handle errors during tree-building
  let fixedTree;
  let _e;

  try {
    fixedTree = buildTree(body)
  } catch (e) {
    _e = e;
  }

  return {
    ast: body,
    tree: fixedTree,
    error: _e || undefined,
  };
}
