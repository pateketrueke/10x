import {
  isOp, isSep, isNum, hasNum, isChar, isExpr, hasKeyword, hasDatetime, hasDays,
  getOp, parseBuffer, joinTokens, buildTree,
} from './parser';

function fromMarkdown(text) {
  // escape for HTML
  const buffer = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // handle code blocks
  if (buffer.charAt() === '`' && buffer.charAt(buffer.length - 1) === '`') {
    return ['code', buffer];
  }

  // handle markdown-like headings
  if (buffer.charAt() === '#') {
    const matches = buffer.match(/^(#+)(.*)$/);
    const level = Math.min(matches[1].length, 6);

    return ['heading', buffer, level];
  }

  // handle more formats: del, em, bold
  const begin = buffer.substr(0, 2);
  const end = buffer.substr(buffer.length - 2, 2);

  if (begin === '~~' && end === '~~') {
    return ['deleted', buffer];
  }

  if (begin === '__' && end === '__') {
    return ['italic', buffer];
  }

  if (begin === '**' && end === '**') {
    return ['bold', buffer];
  }

  return ['text', buffer];
}

function fromSymbols(text, units, expression) {
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
  if (isSep(text)) {
    return [text === '(' ? 'open' : 'close', text];
  }

  // handle fraction numbers
  if (/^\d+\/\d+$/.test(text)) {
    return ['number', text, 'fraction'];
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

export function fromToken(value, offset) {
  value._offset = offset;
  return value;
}

export default function transform(text, units) {
  const input = joinTokens(parseBuffer(text), units);
  const stack = [];

  let inCall = false;
  let prevToken;
  let nextToken;

  const body = input.reduce((prev, cur, i) => {
    let inExpr = stack[stack.length - 1];
    let key = i;

    do {
      nextToken = input[++key];
    } while (nextToken && nextToken.charAt() === ' ');

    // handle expression blocks
    if (inExpr) {
      const token = fromToken(fromSymbols(cur, units, true), i);

      // handle nested calls
      if (token[0] === 'unit' && nextToken === '(') token[0] = 'def';

      // skip text-nodes
      if (token[0] !== 'text') inExpr[2].push(token);

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
      prev.push(fromToken(fromMarkdown(cur), i));
      return prev;
    }

    if (
      // handle most operators and well-known keywords
      isSep(cur) || hasNum(cur) || hasDays(cur) || prevToken === 'def'

      // handle units before operators
      || (isChar(cur) && isOp(nextToken))

      // handle units after expressions
      || (hasNum(prevToken) && hasKeyword(nextToken, units))

      // handle equal symbols and ;-terminators
      || (hasNum(prevToken) && (cur === '=' || cur === ';'))

      // handle operators between expressions
      || (hasNum(prevToken) && isOp(cur) && isSep(nextToken))
      || (hasKeyword(cur, units) && (isOp(prevToken) || isExpr(prevToken)))

      // handle operators between dates
      || (hasDays(prevToken) && hasDays(nextToken) && isOp(cur))

      // handle operators between numbers
      || ((hasKeyword(prevToken, units) || hasNum(prevToken)) && hasNum(nextToken))

      // handle expressions between keywords
      || (isExpr(cur) && (hasKeyword(nextToken, units) || hasNum(nextToken) || hasNum(prevToken)))
    ) {
      if (
        // handle headings
        cur.charAt() === '#'

        // handle non-op keywords
        || (isExpr(cur) && !hasNum(prevToken))
      ) {
        prev.push(fromToken(fromMarkdown(cur), i));
      } else {
        prev.push(fromToken(fromSymbols(cur, units), i));
      }
    } else {
      prev.push(fromToken(fromMarkdown(cur), i));
    }

    if (!isSep(cur, ' ')) prevToken = cur;
    return prev;
  }, []);

  return {
    input,
    tree: buildTree(body),
    output: body.filter(x => x[0] !== 'text'),
  };
}
