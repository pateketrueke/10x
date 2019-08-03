import {
  isOp, isInt, isSep, isNum, hasNum, isChar, isExpr, hasKeyword, hasDatetime, hasMonths, hasDays,
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
  if (expression && isChar(text)) {
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

export default function transform(input, units, types) {
  const stack = [];

  let inCall = false;

  let prevToken;
  let nextToken;

  const body = input.reduce((prev, cur, i) => {
    // resolve from given types
    if (types[cur]) {
      prev.push(toToken(i, () => ['number', cur, types[cur]]));
      return prev;
    }

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
      // if (token[0] === 'unit' && !units[token[1]]) units[token[1]] = token[1];

      // append all nodes
      inExpr[2].push(token);

      // ensure we close and continue eating...
      if (cur === ';' || (inCall && cur === ')')) {
        prevToken = 'def';
        inCall = false;

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
    if (isChar(cur) && (nextToken === '=' || nextToken === '(')) {
      inCall = nextToken === '(';
      stack.push(['def', cur, []]);

      // don't override builtins!
      if (!units[cur]) {
        units[cur] = cur;
      }

      return prev;
    }

    // skip number inside parens/brackets (however sorrounding chars are highlighted)
    if (input[i - 1] === '(' && nextToken === ')') {
      prev.push(toToken(i, fromMarkdown, cur));
      return prev;
    }

    if (
      // handle most operators
      isSep(cur) || hasNum(cur) || isOp(cur)

      // allow keywords after some dates
      || (isExpr(prevToken) && hasMonths(cur))
      || hasDays(cur) || (hasNum(prevToken) && isExpr(cur))
      || (hasDatetime(prevToken) && isExpr(cur) && isNum(nextToken))

      // handle expressions between numbers/units
      || (isExpr(cur) && hasKeyword(nextToken, units))
      || ((isOp(prevToken) || isSep(prevToken)) && hasNum(cur))
      || (hasKeyword(cur, units) && (isOp(nextToken) || isExpr(prevToken) || isOp(prevToken)))
    ) {
      prev.push(toToken(i, fromSymbols, cur, units));
    } else {
      prev.push(toToken(i, fromMarkdown, cur));
    }

    if (!isSep(cur, ' ')) prevToken = cur;
    return prev;
  }, []);

  return {
    ast: body,
    tree: buildTree(body),
  };
}
