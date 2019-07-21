import {
  isOp, isSep, isNum, hasNum, isWord, isExpr, hasKeyword, hasDatetime, hasDays,
  getOp, parseBuffer, buildTree,
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
    const nth = Math.min(matches[1].length, 6);

    return ['heading', buffer, nth];
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
  // handle white-space
  if (text === ' ') {
    return ['text', ' '];
  }

  if (expression) {
    if (units[text]) {
      return ['unit', text];
    }

    if (text === ',') {
      return ['expr', text, 'and'];
    }
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

export default function transform(text, units) {
  const all = parseBuffer(text, units);
  const stack = [];

  let inCall;
  let prevToken;
  let nextToken;

  const body = all.reduce((prev, cur, i) => {
    let inExpr = stack[stack.length - 1];
    let key = i;

    do {
      nextToken = all[++key];
    } while (nextToken && nextToken.charAt() === ' ');

    // handle expression blocks
    if (inExpr) {
      const token = fromSymbols(cur, units, inExpr);

      // handle nested calls
      if (token[0] === 'unit' && nextToken === '(') {
        token[0] = 'call';
      }

      prev.push(token);

      // ensure we close and continue eating...
      if (cur === ';' || (inCall && cur === ')')) {
        prevToken = !inCall ? 'def' : 'call';
        stack.pop();
      }

      return prev;
    }

    if (isWord(cur) && (nextToken === '=' || nextToken === '(')) {
      prev.push([!units[cur] ? 'def' : 'call', cur]);

      inCall = units[cur];
      stack.push(cur);

      if (!units[cur]) {
        units[cur] = cur;
      }

      return prev;
    }

    // skip number inside parens/brackets (however sorrounding chars are highlighted)
    if (all[i - 1] === '(' && nextToken === ')') {
      prev.push(fromMarkdown(cur));
      return prev;
    }

    if (
      isSep(cur) || hasNum(cur) || prevToken === 'call'

      // handle units after expressions
      || (hasNum(prevToken) && hasKeyword(nextToken, units))

      // handle equal symbols and ;-terminators
      || (hasNum(prevToken) && (cur === '=' || cur === ';'))

      // handle operators between expressions
      || (hasKeyword(cur, units) && isOp(prevToken))
      || (hasNum(prevToken) && isOp(cur) && isSep(nextToken))

      // handle operators between dates
      || (hasDays(prevToken) && hasDays(nextToken) && isOp(cur))

      // handle operators between numbers
      || ((hasKeyword(prevToken, units) || hasNum(prevToken)) && hasNum(nextToken))

      // handle expressions between keywords
      || (isExpr(cur) && (hasKeyword(nextToken, units) || hasNum(nextToken) || hasNum(prevToken)))
    ) {
      prev.push(fromSymbols(cur, units));
    } else {
      prev.push(fromMarkdown(cur));
    }

    if (!isSep(cur)) prevToken = cur;
    return prev;
  }, []);

  return {
    tree: buildTree(body),
    input: all,
    output: body,
  };
}
