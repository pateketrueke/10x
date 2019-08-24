import {
  isInt,
  hasKeyword, hasDatetime,
  hasOp, hasSep, hasNum, hasChar, hasExpr,
} from './shared';

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
  // handle comments
  if (text.substr(0, 2) === '//') {
    return ['comment', text];
  }

  // handle mixed objects
  if (text === '[]' || text === '{}') {
    return ['object', text === '[]' ? [] : {}];
  }

  // handle white-space
  if (' \n'.includes(text) || text === '...') {
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

  // handle double-quoted strings
  if (text.charAt() === '"' && text.charAt(text.length - 1) === '"') {
    return ['string', text];
  }

  // handle separators
  if (text === '(' || text === ')') {
    return [text === '(' ? 'open' : 'close', text];
  }

  // handle expressions
  if (
    hasExpr(text)
    && (leftToken && leftToken[0] === 'number')
    && (hasNum(rightToken) || hasKeyword(rightToken, units))
  ) {
    return ['expr', text];
  }

  // handle operators
  if (
    text.length <= 2
    && (
      hasSep(text)
      || (hasOp(text[0]) && !isInt(text[1]))
    )
  ) {
    return [(text.length === 1 && !'<>'.includes(text)) ? 'expr' : 'fx', text, hasOp(text)];
  }

  // handle fraction numbers
  if (hasNum(text) && text.includes('/')) {
    return ['number', text, 'x-fraction'];
  }

  // handle all datetimes
  if (hasDatetime(text)) {
    return ['number', text, 'datetime'];
  }

  const fixedUnit = hasKeyword(text, units, true);

  // extract well-known units
  if (fixedUnit) {
    if (hasNum(text)) {
      return ['number', text, fixedUnit];
    }

    return ['unit', text].concat(fixedUnit !== text ? fixedUnit : []);
  }

  if (hasNum(text)) {
    return ['number', text];
  }
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

export function transform(tokens, units) {
  const chunks = [];

  let depth = 0;
  let inc = 0;

  // split tokens based on their complexity
  for (let i = 0; i < tokens.length; i += 1) {
    const subTree = chunks[inc] || (chunks[inc] = []);
    const token = tokens[i];

    if (token.score) {
      if (subTree.length && !subTree._fixed) {
        chunks[++inc] = [token];
        chunks[inc]._fixed = true;
      } else {
        subTree.push(token);
        subTree._fixed = true;
      }
    } else {
      subTree.push(token);
    }

    // split on new-lines
    if (token.cur === '\n' && !token.depth) {
      inc++;
    }
  }

  // merge non-fixed chunks
  const body = fixStrings(chunks.reduce((prev, cur) => {
    if (prev.length > 1) {
      prev.push(['expr', null]);
    }

    if (cur._fixed) {
      prev.push(...tokenize(cur.map(x => ({
        complexity: 1,
        content: x.cur,
        begin: [x.row, x.col],
        end: [x.row, x.col + x.cur.length],
      })), units));
    } else {
      const last = cur[cur.length - 1];

      prev.push(toToken({
        complexity: 0,
        content: cur.reduce((p, c) => p + c.cur, ''),
        begin: [cur[0].row, cur[0].col],
        end: [last.row, last.col + last.cur.length],
      }, fromMarkdown));
    }

    return prev;
  }, []));

  // handle errors during tree-building
  let fixedTree;
  let _e;

  try {
    fixedTree = fixArgs(body, null).map(x => buildTree(x)).filter(x => x.length);
  } catch (e) {
    _e = e;
  }

  return {
    ast: body,
    tree: fixedTree,
    error: _e || undefined,
  };
}
