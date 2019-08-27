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

  // handle white-space and dots...
  if (' \n'.includes(text)) {
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
    && (leftToken.token[0] === 'number')
    && (hasNum(rightToken) || hasKeyword(rightToken, units))
  ) {
    return ['expr', text];
  }

  // handle operators
  if (hasOp(text)) {
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

  // handle definitions
  if (hasChar(text) && rightToken === '=') {
    return ['unit', text];
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
    let key = i;
    let nextToken;

    do { nextToken = input[++key]; } while (nextToken && nextToken.content === ' ');

    const fixedToken = toToken(cur, fromSymbols, units, lastToken, nextToken && nextToken.content);;

    if (fixedToken.token[0] !== 'text') {
      lastToken = fixedToken;
    }

    prev.push(fixedToken);
    return prev;
  }, []);
}

export function normalize(subTree) {
  const nonOps = subTree.filter(x => !hasSep(x.cur) && !' \n'.includes(x.cur));

  if (nonOps.length) {
    const avg = nonOps.reduce((prev, cur) => prev + cur.score, 0) / nonOps.length;

    if (avg < 2) {
      delete subTree._fixed;
    }
  } else {
    delete subTree._fixed;
  }
}

export function transform(tokens, units) {
  const chunks = [];

  let open = false;
  let inc = 0;

  // split tokens based on their complexity
  for (let i = 0; i < tokens.length; i += 1) {
    const subTree = chunks[inc] || (chunks[inc] = []);
    const token = tokens[i];

    let key = i;
    let nextScore;

    do { nextScore = (tokens[++key] || {}).score; } while (nextScore < 2);

    if (token.depth || token.score) {
      // enable depth by blocks, just for symbols
      if (!open && token.cur.charAt() === ':' && nextScore > 2) {
        if (subTree.length) {
          chunks[++inc] = [token];
          chunks[inc]._fixed = true;
        } else {
          subTree._fixed = true;
          subTree.push(token)
        }
        open = true;
        continue;
      }

      // split on first high-ranked token
      if (subTree.length && !subTree._fixed) {
        if (subTree[0].score > 2 || (';(='.includes(token.cur) && subTree.length === 1)) {
          subTree._fixed = true;
          subTree.push(token)
          continue;
        }

        chunks[++inc] = [token];
        chunks[inc]._fixed = true;

        // break on non-regular tokens!
        if ('":'.includes(token.cur.charAt()) && (nextScore < 2 || nextScore > 3)) inc++;
        continue;
      }
    } else {
      // break on any non-white space
      if (!' \n'.includes(token.cur) && subTree._fixed) {
        chunks[++inc] = [token];
        normalize(subTree);
        open = false;
        continue;
      }
    }

    subTree.push(token);

    // disable depth by blocks...
    if (open && token.cur === ';') open = false;

    // make sure we're always splitting on new-lines!
    if (!(open || token.depth) && token.cur === '\n') inc++;
  }

  // merge non-fixed chunks
  const body = fixStrings(chunks.reduce((prev, cur) => {
    if (cur._fixed) {
      prev.push(null, ...tokenize(cur.map(x => ({
        content: x.cur,
        begin: [x.row, x.col],
        end: [x.row, x.col + x.cur.length],
      })), units));
      return prev;
    }

    const last = cur[cur.length - 1];

    prev.push(null, toToken({
      content: cur.reduce((p, c) => p + c.cur, ''),
      begin: [cur[0].row, cur[0].col],
      end: [last.row, last.col + last.cur.length],
    }, fromMarkdown));

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
    ast: body.filter(x => x !== null),
    tree: fixedTree,
    error: _e || undefined,
  };
}
