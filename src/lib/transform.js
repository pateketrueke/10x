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
    && leftToken[0] === 'number'
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

  const fixedUnit = hasKeyword(text, units);

  // extract well-known units
  if (fixedUnit) {
    if (isNum(text)) {
      return ['number', text, fixedUnit];
    }

    return ['unit', text].concat(fixedUnit !== text ? fixedUnit : []);
  }

  // return definitions as units
  if (
    isChar(text)

    // make sure we're validating right after...
    && ('(='.includes(rightToken) || isOp(rightToken) || isFx(rightToken) || isSep(rightToken, '()'))
  ) {
    return ['unit', text];
  }

  // console.log({text,leftToken,rightToken});

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

  let mayNumber = false;
  let inMaths = false;
  let older = null;
  let depth = 0;
  let inc = 0;

  for (let i = 0; i < tokens.length; i += 1) {
    const stack = chunks[inc] || (chunks[inc] = []);
    const prev = (tokens[i - 1] || {}).content;
    const cur = tokens[i].content;

    let key = i;
    let nextToken;

    do { nextToken = (tokens[++key] || {}).content; } while (nextToken === ' ');

    if (cur === '(') depth++;
    if (cur === ')') depth--;

    if (cur === ')' && depth <= 0) {
      inMaths = nextToken === '=';
      depth = 0;
    }

    if (prev === ';') {
      inMaths = mayNumber = false;
    } else if (
      (isChar(cur) && nextToken === '(')
      || (mayNumber && cur === '=' && (isChar(nextToken) || hasNum(nextToken)))
    ) inMaths = stack._fixed = true;

    // detect possible expressions
    if (!inMaths) {
      if (
        ((hasNum(cur) || isChar(cur)) && (!nextToken
          || isOp(nextToken)
          || isExpr(nextToken)
          || isSep(nextToken, '()')
          // || isFx(nextToken)
          // || hasNum(nextToken)
          // || hasKeyword(nextToken, units)
        ))
        || ((isSep(cur, '()') || isOp(cur)) && (!nextToken
          || hasNum(nextToken)
          // isOp(nextToken)
          // || isExpr(nextToken)
          // ||
          // isFx(nextToken)
          // || hasNum(nextToken)
          // || hasKeyword(nextToken, units)
        ))
      ) mayNumber = stack._fixed = true;

      // break also on new lines!
      if (isSep(cur, '\n') || (mayNumber && (
        // brute-force strategy for matching near ops/tokens
        !(!nextToken || isOp(nextToken) || isFx(nextToken) || hasNum(nextToken) || hasKeyword(nextToken, units))
        && !(!prev || isOp(prev) || isSep(prev) || isFx(prev) || hasNum(prev) || hasKeyword(prev, units))
        // && !(!older || isOp(older) || isSep(older) || isFx(older) || hasNum(older) || hasKeyword(older, units))
      ))) {
        if (stack.length) {
          if (hasNum(stack[0].content)) {
            stack._fixed = true;
          }

          chunks[++inc] = [tokens[i]];
          mayNumber = false;

          // ensure we break apart from new-lines
          if (tokens[i].content === '\n') {
            inc++;
          }
          continue;
        }
      }
    }

    stack.push(tokens[i]);

    // flag for further checks
    if (!' \n'.includes(prev)) older = prev;
  }

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

  // console.log({body});

  return {
    ast: body,
    tree: fixedTree,
    error: _e || undefined,
  };
}
