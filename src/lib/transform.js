import {
  isOp, isFx, isInt, isSep, isNum, hasNum, isAlpha, isChar, isExpr, hasKeyword, hasDatetime, hasMonths, hasDays,
  getOp, buildTree, cleanTree,
} from './parser';

export function toToken(offset, fromCallback, arg1, arg2, arg3, arg4) {
  const value = fromCallback(arg1, arg2, arg3, arg4);

  value._offset = offset;

  return value;
}

export function fromMarkdown(text) {
  // handle code blocks
  if (text.charAt() === '`' && text.charAt(text.length - 1) === '`') {
    return ['code', text];
  }

  // handle checkboxes
  if (text[0] === '[' && ' x'.includes(text[1]) && text[2] === ']') {
    return ['check', text, text.includes('x')];
  }

  // handle headings
  if (text.charAt() === '#') {
    const matches = text.match(/^(#+)(.*)$/);
    const level = Math.min(matches[1].length, 6);

    return ['heading', text, level];
  }

  // handle comments
  if (text.charAt() === '/') {
    return ['comment', text];
  }

  // handle blockquotes
  if (text.charAt() === '>') {
    return ['blockquote', text];
  }

  // handle more formats...
  const begin = text.substr(0, 2);
  const end = text.substr(text.length - 2, 2);

  // bold words are made by double marks, sadly *this won't* work!
  if (begin === '**' && end === '**' || begin === '__' && end === '__') return ['b', text];

  if (begin[0] === '~' && end[1] === '~') return ['del', text];
  if (begin[0] === '_' && end[1] === '_') return ['em', text];

  return ['text', text];
}

export function fromSymbols(text, units, expression, previousToken) {
  // handle white-space
  if (text === ' ') {
    return ['text', ' '];
  }

  // handle placeholders
  if (text === '_') {
    return ['symbol', '_'];
  }

  // handle symbol-like tokens
  if (text.charAt() === ':') {
    switch (text) {
      // allow for some well-known constants
      case ':false': return ['symbol', false];
      case ':true': return ['symbol', true];
      case ':null': return ['symbol', null];
      default: return ['symbol', text];
    }
  }

  if (text.charAt() === '"' && text.charAt(text.length - 1) === '"') {
    return ['string', text];
  }

  // try most char-expressions as valid units...
  if (expression && (isChar(text) || isAlpha(text))) {
    return ['unit', text];
  }

  // handle expressions
  if (isExpr(text) && !isExpr(previousToken)) {
    return ['expr', text];
  }

  // handle operators
  if (
    text.length <= 2
    && (
      (isFx(text[0]) && isFx(text[1]))
      || (isOp(text[0], ';,') && !isInt(text[1]))
    )
  ) {
    return [text.length === 1 ? 'expr' : 'fx', text, getOp(text)];
  }

  // handle separators
  if (text === '(' || text === ')') {
    return [text === '(' ? 'open' : 'close', text];
  }

  // handle fraction numbers
  if (isNum(text) && text.includes('/')) {
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

  return [hasNum(text) ? 'number' : 'unit', text];
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

    // open var/call expressions (strict-mode)
    if (
      (isChar(cur) || isAlpha(cur) || isFx(cur))
      && (input[i + 1] === '=' || input[i + 1] === '(')
    ) {
      inCall = input[i + 1] === '(';
      stack.push(['def', cur, []]);

      // don't override builtins!
      if (!units[cur]) {
        units[cur] = cur;
      }

      return prev;
    }

    if (
      // handle most values
      isSep(cur) || isNum(cur)

      // keep logical ops
      || (cur[0] === ':')
      || (cur === '|>' || cur === '<|')
      || (cur[0] === '"' || '=!<>'.includes(cur))
      || (cur.length === 2 && isOp(cur[0]) && isOp(cur[1]))

      // handle sub-calls, symbols and side-effects
      || (cur === '(' && (isFx(nextToken) || isFx(prevToken) || hasNum(nextToken) || hasKeyword(nextToken, units)))
      || (cur === ')' && (isFx(nextToken) || isFx(prevToken) || isOp(nextToken) || isSep(nextToken) || hasNum(prevToken) || hasKeyword(prevToken, units)))

      // handle operators
      || (isOp(cur) && (
        ((isFx(prevToken) || hasNum(prevToken)) && nextToken === '(')
        || ((isFx(prevToken) || hasNum(prevToken)) && (hasNum(nextToken) || hasKeyword(nextToken, units)))
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
      prev.push(toToken(i, fromSymbols, cur, units, null, prevToken));
    } else {
      prev.push(toToken(i, fromMarkdown, cur));
    }

    // FIXME: re-evaluate this shit...
    if (!isSep(cur, '( )')) prevToken = cur;
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
