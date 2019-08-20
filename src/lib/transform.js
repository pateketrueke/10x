import {
  isOp, isFx, isAny, isInt, isSep, isNum, hasNum, isAlpha, isChar, isExpr,
  hasKeyword, hasOwnKeyword, hasDatetime, hasMonths, hasDays,
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
    const matches = text.match(/^#{1,6}/);

    return ['heading', text, matches[0].length];
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

  // bold words are made by double marks, sadly *this won't* work!
  if (begin === '**' || begin === '__') return ['b', text];

  if (begin[0] === '~') return ['del', text];
  if (begin[0] === '_') return ['em', text];

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
    return [(text.length === 1 && !'<>'.includes(text)) ? 'expr' : 'fx', text, isOp(text)];
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
  const scores = [];

  let oldChar = '';
  let depth = 0;
  let inc = 0;

  // split tokens based on their complexity
  for (let i = 0; i < tokens.length; i += 1) {
    if (oldChar === '\n') {
      inc++;
    }

    const subTree = chunks[inc] || (chunks[inc] = []);
    const cur = tokens[i].content;
    const t = tokens[i].complexity;

    // split if previous token contains spaces, but no numbers
    if (
      t >= 3
      && tokens[i - 1]
      && tokens[i - 1].content !== ' '
      && tokens[i - 1].content.includes(' ')
      && !hasNum(tokens[i - 1].content)
    ) {
      chunks[++inc] = [tokens[i]];
      chunks[inc]._fixed = true;
      delete subTree._fixed;
      continue;
    }

    let key = 0;
    let nextToken;

    do { nextToken = (tokens[++key] || {}).content; } while (isAny(nextToken, ' \n'));

    // check for average complexity between tokens
    if (scores.length > 2) {
      const avg = scores.reduce((prev, cur) => prev + cur, 0) / scores.length;

      // this array contains expressions
      if (!subTree._fixed && (
        avg >= 3 || ((isOp(cur) || isSep(cur, '()')) && (hasNum(nextToken) || isChar(nextToken)))
      )) {
        subTree._fixed = true;
      }
    }

    subTree.push(tokens[i]);

    if (t) scores.push(t);
    if (cur !== ' ') oldChar = cur;
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

  return {
    ast: body,
    tree: fixedTree,
    error: _e || undefined,
  };
}
