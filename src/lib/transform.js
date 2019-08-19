import {
  isOp, isFx, isAny, isInt, isSep, isNum, hasNum, isAlpha, isChar, isExpr,
  hasKeyword, hasOwnKeyword, hasDatetime, hasMonths, hasDays,
  getOp,
} from './parser';

import {
  buildTree,
} from './tree';

import {
  toToken,
  fixArgs, fixStrings,
} from './ast';

export function fromMarkdown(text) {
  // handle code blocks
  if (text.charAt() === '`' && text.charAt(text.length - 1) === '`') {
    return ['code', text];
  }

  // handle checkboxes
  if (['[x]', '[ ]'].includes(text)) {
    return ['check', text, text.includes('x')];
  }

  // handle headings
  if (text.charAt() === '#') {
    const matches = text.match(/^(#+)(.*)$/);
    const level = Math.min(matches[1].length, 6);

    return ['heading', text, level];
  }

  // handle comments
  if (text.substr(0, 2) === '//') {
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

export function fromSymbols(text, units, leftToken, rightToken) {
  // handle mixed objects
  if (text === '[]' || text === '{}') {
    return ['object', text === '[]' ? [] : {}];
  }

  // handle white-space
  if (text === '...' || text === ' ' || text === '\n') {
    return ['text', text];
  }

  // handle placeholders
  if (text === '_') {
    return ['symbol', '_'];
  }

  // handle range-values
  if (text.includes('..')) {
    return ['range', text];
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

  // handle expressions
  if (
    isExpr(text)
    && (leftToken && leftToken[0] === 'number')
    && (hasNum(rightToken) || hasKeyword(rightToken, units))
  ) {
    return ['expr', text];
  }

  // handle operators
  if (
    text.length <= 2
    && (
      isSep(text)
      || (isFx(text[0]) && isFx(text[1]))
      || (isOp(text[0], ';,') && !isInt(text[1]))
    )
  ) {
    return [(text.length === 1 && !'<>'.includes(text)) ? 'expr' : 'fx', text, getOp(text)];
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

  const fixedUnit = hasKeyword(text, units, true);

  // FIXME: seems like unita are not being evaluated...
  // console.log({text,fixedUnit});

  // extract well-known units
  if (fixedUnit) {
    if (isNum(text)) {
      return ['number', text, fixedUnit];
    }

    return ['unit', text].concat(fixedUnit !== text ? fixedUnit : []);
  }

  // return definitions as units
  if (
    isChar(text) && (
    // make sure we're validating right after...
    !rightToken || isOp(leftToken)
    || '(='.includes(rightToken)
    || isSep(rightToken, '()')
    || hasNum(rightToken) || hasNum(leftToken)
    || isOp(rightToken) || isOp(leftToken)
    || isFx(rightToken) || isFx(leftToken)
  )) {
    return ['unit', text];
  }

  return [hasNum(text) ? 'number' : 'text', text];
}

export function tokenize(input, units) {
  let lastToken;

  return input.reduce((prev, cur, i) => {
    if (cur.content === ' ') {
      prev.push(toToken(cur, fromMarkdown));
      return prev;
    }

    let key = i;
    let nextToken;

    do { nextToken = input[++key]; } while (nextToken && nextToken.content === ' ');

    lastToken = toToken(cur, fromSymbols, units, lastToken, nextToken && nextToken.content);

    prev.push(lastToken);
    return prev;
  }, []);
}

export function transform(input, units) {
  const tokens = input.slice();
  const chunks = [];

  let oldComplexity = 0.0;
  let complexity = 0.0;
  let inMaths = false;
  let depth = 0;
  let inc = 0;

  // split tokens based on their complexity
  for (let i = 0; i < tokens.length; i += 1) {
    const subTree = chunks[inc] || (chunks[inc] = []);
    const next = (tokens[i + 1] || {}).content;
    const cur = tokens[i].content;
    const t = tokens[i].complexity;

    if (t < 3 && !(isChar(cur) && isAny(next, '(='))) {
      if (isAny(cur, '\n;')) {
        chunks[++inc] = [tokens[i]];
      } else {
        subTree.push(tokens[i]);
      }
      continue;
    }

    let key = i;
    let nextToken;

    do { nextToken = tokens[++key]; } while (nextToken && isAny(nextToken.content, ' \n'));

    // split based on complexity
    if (t >= 3 || (!nextToken || nextToken.complexity >= 3)) {
      inMaths = true;

      if (hasNum(cur)) {
        subTree._fixed = true;
      }

      if (!depth && isChar(nextToken)) {
        inMaths = false;
      }
    } else {
      inMaths = depth > 0 || cur === '(';
    }

    // flag for depth-checking
    if (cur === '(') depth++;
    if (cur === ')') depth--;

    // console.log({t,cur});

    // FIXME: there should be also a rhythm, so tokens should be added
    // only if they have enough complexity and fits into the ryhthm...

    if (inMaths) {
      if (!isOp(cur) && subTree.length && !subTree._fixed) {
        // console.log({t,cur,nextToken});
        chunks[++inc] = [tokens[i]];
        chunks[inc]._fixed = true;
        continue;
      } else {
        subTree._fixed = t >= 3;
      }
    }

    subTree.push(tokens[i]);
  }

  // FIXME: is not cutting good...
  // console.log({chunks});

  // merge non-fixed chunks
  const body = fixStrings(chunks.reduce((prev, cur) => {
    const lastChunk = prev[prev.length - 1];

    if (cur._fixed) {
      prev.push(...tokenize(cur, units), ['expr', null]);
    } else {
      prev.push(...fixStrings(cur.map(x => toToken(x, fromMarkdown))));
    }

    return prev;
  }, []));

  // copy all tokens to protect them!
  const fixedBody = fixArgs(body.map(x => toToken(x)), null);

  // handle errors during tree-building
  let fixedTree;
  let _e;

  try {
    // FIXME: last newline is missing on final tree...
    fixedTree = fixedBody.map(x => buildTree(x)).filter(x => x.length);
  } catch (e) {
    _e = e;
  }

  // console.log({fixedTree});

  return {
    ast: body,
    tree: fixedTree,
    error: _e || undefined,
  };
}
