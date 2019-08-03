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
  // escape for HTML
  const buffer = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // handle code blocks
  if (buffer.charAt() === '`' && buffer.charAt(buffer.length - 1) === '`') {
    return ['code', buffer];
  }

  // handle headings
  if (buffer.charAt() === '#') {
    const matches = buffer.match(/^(#+)(.*)$/);
    const level = Math.min(matches[1].length, 6);

    return ['heading', buffer, level];
  }

  // handle blockquotes
  if (buffer.charAt() === '>') {
    return ['blockquote', buffer];
  }

  // handle more formats: del, em, bold
  const begin = buffer.substr(0, 2);
  const end = buffer.substr(buffer.length - 2, 2);

  if (begin === '~~' && end === '~~') {
    return ['del', buffer];
  }

  if (begin === '__' && end === '__') {
    return ['em', buffer];
  }

  if (begin === '**' && end === '**') {
    return ['b', buffer];
  }

  return ['text', buffer];
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
  if (/^\d+\/\d+$/.test(text)) {
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

  // all numbers
  if (isNum(text)) {
    return ['number', text];
  }

  return ['text', text];
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
      isSep(cur) || hasNum(cur)

      // allow keywords after some dates
      || (isExpr(prevToken) && hasMonths(cur))
      || hasDays(cur) || (hasNum(prevToken) && isExpr(cur))
      || (hasDatetime(prevToken) && isExpr(cur) && isNum(nextToken))

      // operators, followed by numbers or separators
      || (isOp(cur) && (hasNum(nextToken) || isSep(nextToken)))

      // numbers, if they have preceding operators or separators
      || ((isOp(prevToken) || isSep(prevToken)) && hasNum(cur))

      // numbers sorrounding numbers
      || (hasNum(cur) && (hasNum(nextToken) || hasNum(prevToken)))

      // handle expressions between numbers/units
      || (isExpr(cur) && hasKeyword(nextToken, units))
      || (hasNum(prevToken) && isOp(cur) && hasKeyword(nextToken, units))
      || (isOp(cur) && hasKeyword(prevToken, units) && hasKeyword(nextToken, units))
      || (hasKeyword(cur, units) && (isOp(nextToken) || isExpr(prevToken) || isOp(prevToken)))

      // handle operators between separators
      || ((prevToken === ')' || hasNum(prevToken)) && isOp(cur) && (nextToken === '(' || hasNum(nextToken)))
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
