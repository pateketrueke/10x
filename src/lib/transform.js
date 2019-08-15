import {
  isOp, isFx, isInt, isSep, isNum, hasNum, isAlpha, isChar, isExpr,
  hasKeyword, hasOwnKeyword, hasDatetime, hasMonths, hasDays,
  getOp,
} from './parser';

import {
  buildTree,
} from './tree';

import {
  toToken,
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

export function fromSymbols(text, units, expression, previousToken) {
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

  return [hasNum(text) ? 'number' : 'unit', text];
}

export function transform(input, units) {
  const tokens = input.slice();

  let mayNumber = false;
  let inMaths = false;
  let older = null;

  for (let i = 0; i < tokens.length; i += 1) {
    const prev = (tokens[i - 1] || {}).content;
    const cur = tokens[i].content;

    let key = i;
    let nextToken;

    do { nextToken = (tokens[++key] || {}).content; } while (nextToken === ' ');

    console.log({inMaths,older,prev,cur,nextToken});

    // flag for further checks
    if (!' \n'.includes(prev)) older = prev;
  }

  // while (tokens.length) {
  //   const cur = tokens.shift();
  //   const next = tokens[i + 1];

  //   if (!inMaths) {
  //     if ((hasNum(cur) || isSep(cur, '()')) && (hasNum(next) || isOp(nextToken))) mayNumber = true;
  //   }

  //   console.log({mayNumber, inMaths, cur});
  // }

  return tokens;
}
export function old_transform(input, units) {
  const stack = [];
  const vars = {};

  let depth = 0;
  let inCall = false;
  let inMaths = false;

  let oldToken;
  let prevToken;
  let nextToken;

  input = input.map(x => x.content);

  // FIXME: concatenation happens here... so, as soon tokens are detected
  // text-nodes are keept together, also, other expressions remain grouped
  // for easier evaluation later... numbers+units should be joined here too!

  // but.... how identify expressions? I mean, as text is just the opossite...
  // semantics? how we identify an expressión?

  // ... => N|U

  // ... Op N|U ...
  // ... N|U [Op] N|U ...
  // ... N|U [Op] ( ... N|U [Op] N|U ... ) ...

  // also, as soon one non-keyword is introduced we must break from math-mode...

  const body = input.reduce((prev, cur, i) => {
    let inExpr = stack[stack.length - 1];
    let key = i;

    do {
      nextToken = input[++key];
    } while (nextToken && nextToken.charAt() === ' ');

    // always disable evaluation on ;
    if (cur === ';') inMaths = false;

    // flag possible expressions
    if (
      hasNum(cur) || isFx(cur)
      || (vars[cur] && isOp(nextToken))
    ) inMaths = true;

    // flag possible subcalls
    if (cur === '(') depth++;
    if (cur === ')') depth--;

    // handle expression blocks
    if (inExpr) {
      const token = toToken(i, fromSymbols, cur, units, true);

      // handle nested calls
      if (token[0] === 'unit' && nextToken === '(') token[0] = 'def';

      // reassign _ placeholder
      if (token[0] === 'symbol' && token[1] === '_') token[0] = 'unit';

      // append all nodes
      inExpr[2].push(token);

      // ensure we close and continue eating...
      if (cur === ';' || (inCall && cur === ')')) {
        prevToken = 'def';
        inCall = false;
        inMaths = depth > 0;

        // close var-expressions
        if (nextToken !== '=' && depth === inExpr._depth) {
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
      (isChar(cur) || isAlpha(cur))
      && (input[i + 1] === '=' || input[i + 1] === '(')
    ) {
      const token = toToken(i, () => ['def', cur, []]);

      inCall = input[i + 1] === '(';
      stack.push(token);

      token._depth = depth;

      // don't override builtins!
      if (!hasOwnKeyword(units, cur)) {
        units[cur] = cur;
      }

      // save as local too!
      vars[cur] = 1;

      return prev;
    }

    if (
      vars[cur]

      // handle most values
      || isSep(cur) || isNum(cur)

      // keep logical ops
      || (cur[0] === ':')
      || (cur === '[]' || cur === '{}')
      || (cur === '|>' || cur === '<|')
      || (isChar(cur) && nextToken === '::')
      || (cur[0] === '"' || '=!<>'.includes(cur))
      || (cur[0] === '.' && cur[1] === '.' && nextToken !== '.')
      || (cur.length === 2 && isOp(cur[0]) && isOp(cur[1]) && cur !== '//')

      // handle sub-calls, symbols and side-effects
      || (cur === '(' && (oldToken === ',' || isFx(nextToken) || isFx(prevToken) || hasNum(nextToken) || hasKeyword(nextToken, units)))
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

      // handle special unit-like values
      || (isChar(cur) && ('[{'.includes(nextToken) || (isFx(prevToken) && prevToken[0] !== '-')))
      || ((hasNum(cur) || isChar(cur) || hasKeyword(cur, units)) && vars[prevToken])

      || (inMaths && (
        // allow units between ops/expressions
        ((isChar(cur) || hasKeyword(cur, units)) && (
          depth || isOp(nextToken) || isExpr(prevToken) || isOp(prevToken)
        ))

        // handle units/expressions after maths, never before
        || (isOp(cur) && ((hasNum(prevToken) || isChar(prevToken)) || (isChar(nextToken) || hasNum(nextToken))))
      ))
    ) {
      const t = toToken(i, fromSymbols, cur, units, null, prevToken);

      // register units to help detection and proper tokenization!
      if (['unit', 'def'].includes(t[0])) vars[t[1]] = 1;

      prev.push(t);
    } else {
      const token = toToken(i, fromMarkdown, cur);
      const old = prev[prev.length - 1];

      // concatenate text tokens
      if (old && old[0] === 'text' && token[0] === 'text') {
        old[1] += token[1];
      } else {
        prev.push(token);
      }
    }

    // FIXME: re-evaluate this shit...
    if (!isSep(cur, '( )')) prevToken = cur;
    if (cur !== ' ') oldToken = cur;
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
