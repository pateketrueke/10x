import {
  hasTagName,
  hasOp, hasSep, hasChar,
} from './shared';

import {
  toToken,
  fixCut, fixArgs, fixApply, fixInput, fixTokens,
} from './ast';

import LangErr from './error';

// FIXME: clean up this shit...
export function fixChunk(tokens, i) {
  const offset  = tokens.slice(i).findIndex(x => !Array.isArray(x) && x.token[0] === 'expr' && x.token[2] === 'k');
  const subTree = offset > 0 ? tokens.splice(i, offset) : tokens.splice(i);

  return subTree;
}

export function fixTree(ast) {
  let tokens = ast.filter(x => Array.isArray(x) || !hasTagName(x.token[0]));

  for (let i = 0; i < tokens.length; i += 1) {
    let cur = Array.isArray(tokens[i])
      ? fixTree(tokens[i])
      : tokens[i];

    const prev = tokens[i - 1] || { token: [] };
    const next = tokens[i + 1] || { token: [] };

    if (Array.isArray(cur) && cur.length > 1 && !Array.isArray(cur[0])) {
      // handle tuples
      if (cur[0].token[0] === 'symbol' && ['number', 'string', 'unit'].includes(cur[1].token[0])) {
        tokens.splice(i, 1, toToken(['object', fixTokens(cur)]));
        continue;
      }
    }

    if (!Array.isArray(prev)) {
      if (prev.token[0] === 'def' && !prev.token[2]) {
        let subTree = [];

        // FIXME: dedupe...
        if (Array.isArray(cur)) {
          prev._args = true;
          tokens.splice(i, 1);
        } else if (cur.token[0] === 'expr' && cur.token[2] === 'equal') {
          subTree = fixChunk(tokens, i);
          prev._body = true;
        }

        if (!Array.isArray(next) && next.token[0] === 'expr' && next.token[2] === 'equal' && !prev._body) {
          subTree = fixChunk(tokens, i);
          prev._body = true;
        }

        // discard token separator
        if (prev._body && !prev._args) {
          tokens.splice(i, 1);
        }

        // update token definition
        prev.token[2] = {
          args: prev._args ? fixArgs(cur, true) : null,
          body: prev._body ? fixTree(subTree.slice(1)) : null,
        };
        continue;
      }
    }

    // FIXME: compose lambda-calls with multiple arguments...
    if (
      !Array.isArray(cur)
      && !Array.isArray(next)
      && cur.token[0] === 'unit'
      && ((next.token[0] === 'expr' && next.token[2] === 'or') || (next.token[0] === 'fx' && next.token[2] === 'func'))
    ) {
      const offset = tokens.slice(i).findIndex(x => !Array.isArray(x) && x.token[0] === 'fx' && x.token[2] === 'func');

      if (offset > 0) {
        const cut = tokens.slice(offset).findIndex(x => !Array.isArray(x) && x.token[0] === 'expr' && hasSep(x.token[1]));
        const endPos = cut >= 0 ? cut : tokens.length - offset;

        tokens.splice(i, 0, toToken(['fn', '$', {
          args: fixArgs(tokens.splice(i, offset), true),
          body: fixTree(tokens.splice(i, endPos).slice(1)),
        }]));
        break;
      }
    }

    tokens[i] = cur;
  }

  return tokens;
}

export function buildTree(tokens) {
  let root = [];

  const tree = root;
  const stack = [];
  const offsets = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const next = tokens[i + 1] || { token: [] };
    const t = tokens[i];

    // reassign definition tokens
    if (t.token[0] === 'unit' && '(='.includes(next.token[1])) {
      t.token[0] = 'def';
    }

    // handle nesting
    if (['open', 'close'].includes(t.token[0])) {
      if (t.token[0] === 'open') {
        const leaf = [];

        root.push(leaf);
        stack.push(root);
        offsets.push(t);
        root = leaf;
      } else {
        root = stack.pop();
        offsets.pop(t);
      }
    } else {
      if (!root) {
        throw new LangErr('Unexpected end, missing `(`', tokens[i - 1]);
      }

      root.push(t);
    }
  }

  if (stack.length) {
    const fixedOffset = offsets.pop();
    const fixedToken = fixedOffset.token[1];

    throw new LangErr(`Missing terminator for \`${fixedToken}\``, fixedOffset);
  }

  return tree;
}
