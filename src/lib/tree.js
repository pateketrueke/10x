export function buildTree(tokens) {
  let root = [];
  let depth = 0;

  const tree = root;
  const stack = [];
  const calls = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];

    // fix nested-nodes
    if (t[0] === 'def' && t[2]) {
      t[2] = buildTree(t[2]);
    }

    // handle nesting
    if (['open', 'close'].includes(t[0]) || ['begin', 'end'].includes(t[2])) {
      if (t[0] === 'open' || t[2] === 'begin') {
        const leaf = [];

        // flag tokens for further detection...
        if (t[1] === '{') root._object = true;
        if (t[1] === '[') root._array = true;

        root._offset = i;
        root.push(leaf);
        stack.push(root);
        root = leaf;
      } else {
        root = stack.pop();
      }
    } else {
      if (!root) {
        stack.push(t);
        break;
      }

      root.push(t);
    }
  }

  return tree;
}

export function fixTree(ast) {
  let tokens = ast.filter(x => !hasTagName(x[0]));

  let arr = ast._array;
  let obj = ast._object;

  for (let i = 0; i < tokens.length; i += 1) {
    let cur = Array.isArray(tokens[i][0])
      ? fixTree(fixCalls(tokens[i]))
      : tokens[i];

    const prev = tokens[i - 1];
    const next = tokens[i + 1];

    // skip and merge empty leafs
    if (cur.length === 0) {
      if (prev && prev[0] === 'def') {
        tokens.splice(i, 1);
        prev[2] = [cur];
      }
      continue;
    }

    // look for partial-applications
    if (cur[0] === 'def' && cur[2]) {
      cur[2] = fixTree(cur[2]);

      if (!(arr || obj)) {
        cur[2] = fixCalls(cur[2]);
      }
    }

    // compose lambda-calls with multiple arguments...
    if (cur[0] === 'unit' && next && ((next[0] === 'expr' && next[1] === ',') || (next[0] === 'fx' && next[2] === 'func'))) {
      const offset = tokens.slice(i).findIndex(x => x[0] === 'fx' && x[2] === 'func');

      if (offset > 0) {
        const cut = tokens.slice(offset).findIndex(x => x[0] === 'expr' && isSep(x[1]));
        const endPos = cut >= 0 ? cut : tokens.length - offset;

        const args = tokens.splice(i, offset);
        const subTree = tokens.splice(i, endPos).slice(1);

        tokens.splice(i, 0, ['fn', '$', [args, fixTree(subTree)]]);
        break;
      }
    }

    if (next && next[0] === 'fx' && ['lpipe', 'rpipe'].includes(next[2]) && cur[0] !== 'symbol') {
      const offset  = tokens.slice(i).findIndex(x => x[0] === 'expr' || x[0] === 'fx');

      // make sure we're extending valid combinations...
      if (prev && prev[0] !== 'expr' && offset > 0) {
        if (prev[0] === 'def' && !prev[2]) {
          tokens.splice(i + 1, 0, ...fixCalls(tokens.splice(i + 1, i + offset - 1)));
          continue;
        }
      }

      // otherwise, we just fix everything!
      tokens.splice(i, i + tokens.length, ...fixCalls(tokens.slice(i)));
      while (tokens.length === 1) tokens = tokens[0];
      break;
    }

    // compose all tokens, or before a terminator ; char
    if (prev && prev[0] === 'symbol' && ['unit', 'symbol', 'number'].includes(cur[0])) {
      let subTree;

      const rightNext = tokens[i + 2];

      // collect all ops from tokens
      if (next && next[0] === 'expr' && isOp(next[1])) {
        const fixedTree = fixTokens(fixArgs(tokens.splice(i, i + tokens.length)));
        const target = fixTokens([prev, fixedTree.shift()]);

        return fixedTree.reduce((p, c) => {
          if (Array.isArray(p)) p.push(c);
          else Object.assign(p, c);
          return p;
        }, target);
      }

      // ensure we consume from lists only!
      if (rightNext && rightNext[0] === 'expr' && rightNext[1] === ',') {
        const cut = tokens.slice(i + 1).indexOf(';');
        const offset = cut !== -1 ? cut : tokens.length - 1;

        subTree = fixTree(tokens.splice(i, i + offset).slice(1));
      } else {
        subTree = fixTree(next || []);
        tokens.splice(i, next ? 2 : 1);
      }

      // keep pairs of symbols together
      if (next && next[0] === 'symbol' && rightNext && rightNext[0] !== 'symbol') {
        prev[2] = cur;
        subTree[2] = rightNext;
        tokens.splice(i, 1, subTree);
        continue;
      }

      // keep side-effects without modification
      if (Array.isArray(subTree[0])) {
        cur[2] = fixTokens(subTree);
        prev[2] = ['object', cur];
      } else if (!prev[2]) {
        // skip :symbol continuations
        if (next && next[0] === 'symbol' && !['unit', 'symbol'].includes(cur[0])) {
          tokens.splice(i, 0, cur, subTree);
          continue;
        }

        prev[2] = prev[2] || (prev[2] = []);

        if (subTree.length) {
          prev[2].push(cur);

          // skip and reinject from expressions and side-effects
          if (['fx', 'expr', 'range'].includes(subTree[0])) {
            // eat one more token in case of ranges...
            if (subTree[0] === 'range') {
              prev[2].push(next, rightNext);
              tokens.splice(i, 1);
            } else {
              tokens.splice(i, 0, subTree);
            }
          } else {
            prev[2].push(subTree);
          }
        } else {
          prev[2].push(cur);

          // skip when tokens are not values...
          if (!(arr || obj) && ['unit', 'symbol'].includes(cur[0])) continue;

          // apply type, but only on valid tokens...
          if ((arr || obj) && ['unit', 'symbol'].includes(prev[2][0][0])) {
            prev[2][0][2] = arr ? [] : {};
            prev[2] = ['object', prev[2][0]];
          }
        }
      }
      continue;
    }

    // merge lambda-calls and symbols as single tokens
    if (prev && prev[0] === 'symbol' && cur[0][0] === 'fn') {
      tokens.splice(i, 1);
      prev[2] = cur;
      continue;
    }

    tokens[i] = cur;
  }

  return tokens;
}

export function fixCalls(def, skip) {
  const tokens = def.filter(x => !hasTagName(x[0]));

  let args = [];

  // eat arguments from input, usually an array
  if (Array.isArray(tokens[0][0])) {
    args = tokens.shift();
  }

  for (let i = 0; i < tokens.length; i += 1) {
    const cur = tokens[i];
    const left = tokens[i - 1];
    const right = tokens[i + 1];

    // group unit-calls and arguments
    if (cur[0] === 'def' && !cur[2] && right && Array.isArray(right[0])) {
      tokens.splice(i + 1, 1);
      cur[2] = [right];
      continue;
    }

    // append all given tokens to previous unit-definitions
    if (left && left[0] === 'def' && cur[0] !== 'fx') {
      if (left[2] && cur[0] !== 'expr') {
        const cut = tokens.slice(i).findIndex(x => ['fx', 'expr'].includes(x[0]));
        const subTree = cut > 0 ? tokens.splice(i, cut) : tokens.splice(i);

        left[2][0] = left[2][0].concat(fixInput(subTree, true));
        continue;
      }
    }

    // handle units with single arguments
    if (left && left[0] === 'fx' && ['lpipe', 'rpipe'].includes(left[2]) && cur[0] === 'unit') {
      if (right && right[0] !== 'expr') {
        cur[0] = 'def';
        cur[2] = [[right]];
        tokens.splice(i + 1, 1);
        continue;
      }
    }

    // handle partial-application calls
    if (left && cur[0] === 'fx' && ['lpipe', 'rpipe'].includes(cur[2]) && right) {
      if (Array.isArray(left[0]) && right[0] === 'def' && tokens[i - 2]) {
        tokens[i - 2][0] = 'def';
        tokens[i - 2][2] = [left];
        tokens.splice(i - 3, 3, cur, tokens[i - 2]);
        continue;
      }

      // compose from previous calls
      if (left[0] === 'unit') {
        tokens.splice(i, 2, fixApply(cur[2], right, args));
        left._curry = cur.slice();
        left[0] = 'def';
        continue;
      }
    }

    // unit-calls without arguments receives _
    if (left
      && left[0] === 'fx'
      && cur[0] === 'unit'
      && (!right || (right[0] === 'expr' && isSep(right[1])))
    ) {
      cur[2] = [[['symbol', '_']]];
      cur[0] = 'def';
    }
  }

  return [].concat(args.length ? [args] : []).concat(tokens);
}
