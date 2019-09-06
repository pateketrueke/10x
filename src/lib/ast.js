import {
  hasSep, hasTagName,
} from './shared';

import {
  isArray,
} from './utils';

import Err from './error';
import Expr from './expr';

export function fixStrings(tokens, split) {
  return tokens.reduce((prev, cur) => {
    if (
      cur
      && cur.token[0] === 'text'
      && prev[prev.length - 1]
      && prev[prev.length - 1].token[1] !== '\n'
      && prev[prev.length - 1].token[0] === 'text'
      && (split === false || !cur.token[1].includes(' '))
    ) {
      prev[prev.length - 1].token[1] += cur.token[1];
      prev[prev.length - 1].end = cur.end;
    } else {
      prev.push(cur);
    }

    return prev;
  }, []);
}

export function fixArgs(values, flatten) {
  let offset = 0;

  const stack = [];

  // FIXME: also, a pattern...
  if (flatten === true) {
    values = fixArgs(values.map(x => {
      while (x.length === 1) x = x[0];
      return x;
    }));

    return values.reduce((p, c) => {
      while (c.length === 1) c = c[0];
      p.push(c);
      return p;
    }, stack);
  }

  // break values into single arguments
  for (let i = 0; i < values.length; i += 1) {
    const last = stack[offset] || (stack[offset] = []);
    const cur = values[i];

    if (!isArray(cur)) {
      last.push(cur);

      // normalize raw separators
      if (
        flatten === null
          ? cur === null
          : (cur.token[0] === 'expr' && ';,'.includes(cur.token[1]))
      ) {
        last.pop();
        offset++;
      }
    } else if (flatten !== false) {
      last.push(...fixArgs(cur, flatten));
    } else {
      last.push(fixArgs(cur, flatten));
    }
  }

  if (flatten === null) {
    return stack.reduce((prev, cur) => {
      const firstValue = cur.findIndex(x => x.token[0] !== 'text');

      // prepend non values
      if (firstValue > 0) {
        prev.push(cur.slice(0, firstValue), cur.slice(firstValue));
        return prev;
      }

      prev.push(fixStrings(cur, false));

      return prev;
    }, []);
  }

  return stack;
}

export function fixTokens(ast, re) {
  if (!isArray(ast)) return ast;

  const target = ast[0].token[0] === 'symbol' ? {} : [];
  const array = isArray(target);

  let keyName;

  return ast.reduce((prev, cur) => {
    if (!isArray(cur) && cur.token[0] === 'symbol') {
      keyName = cur.token[1];
    } else if (isArray(cur) || !(cur.token[0] === 'expr' && hasSep(cur.token[1]))) {
      const fixedToken = re && isArray(cur) ? fixArgs(cur).reduce((p, c) => p.concat(c), []) : cur;

      if (!array && keyName) {
        prev[keyName] = prev[keyName] || (prev[keyName] = []);
        prev[keyName].push(fixedToken);
      }

      if (array) {
        prev.push(fixedToken);
      }
    }

    return prev;
  }, target);
}

export function fixLeaf(tokens, i) {
  const offset = tokens.slice(i).findIndex(x => !isArray(x) && x.token[0] === 'expr' && x.token[2] === 'k');
  const subTree = offset > 0 ? tokens.splice(i, offset) : tokens.splice(i);

  return subTree;
}

export function fixTree(ast, self) {
  const tokens = ast.filter(x => isArray(x) || !hasTagName(x.token[0]));

  for (let i = 0; i < tokens.length; i += 1) {
    const cur = isArray(tokens[i])
      ? fixTree(tokens[i], self)
      : tokens[i];

    const prev = tokens[i - 1] || { token: [] };
    const next = tokens[i + 1] || { token: [] };

    if (isArray(cur) && cur.length > 1 && !isArray(cur[0])) {
      // handle tuples
      // FIXME: more helpers
      if (
        !isArray(cur[1])
        && cur[0].token[0] === 'symbol'
        && ['number', 'string', 'unit'].includes(cur[1].token[0])
      ) {
        tokens.splice(i, 1, Expr.from(['object', fixTokens(cur, true)]));
        continue;
      }
    }

    // sub-tokenize strings
    if (!isArray(cur) && cur.token[0] === 'string') {
      let fixedOffset = 0;

      // FIXME: split on tokens for full-highlighting!
      cur.token.splice(1, 1, ...cur.token[1].split(/(#{[^{}]*?})/)
        .reduce((p, x) => {
          if (x.indexOf('#{') === 0 && x.substr(-1) === '}') {
            p.push(self.partial(x.substr(2, x.length - 3), cur, fixedOffset + 3).tree);
          } else {
            p.push(x);
          }

          fixedOffset += x.length;

          return p;
        }, []));
      continue;
    }

    // compose definition calls
    if (!isArray(prev) && prev.token[0] === 'def' && !prev.token[2]) {
      let subTree = [];

      // FIXME: dedupe...
      if (isArray(cur)) {
        Object.defineProperty(prev, '_args', { value: true });
        tokens.splice(i, 1);
        // FIXME: more helpers
      } else if (cur.token[0] === 'expr' && cur.token[2] === 'equal') {
        Object.defineProperty(prev, '_body', { value: true });
        subTree = fixLeaf(tokens, i);
      }

      // FIXME: more helpers
      if (!isArray(next) && next.token[0] === 'expr' && next.token[2] === 'equal' && !prev._body) {
        Object.defineProperty(prev, '_body', { value: true });
        subTree = fixLeaf(tokens, i);
      }

      // discard token separator
      if (prev._body && !prev._args) {
        tokens.splice(i, 1);
      }

      // flag definition for memoization
      if (prev.token[1].substr(-1) === '!') {
        prev.token[1] = prev.token[1].replace('!', '');
        prev._memo = true;
      }

      // update token definition
      prev.token[2] = {
        args: prev._args ? fixArgs(cur, true) : null,
        body: prev._body ? fixTree(subTree.slice(1)) : null,
      };
      continue;
    }

    // FIXME: compose lambda-calls with multiple arguments... helpers!!
    if (
      !isArray(cur)
      && !isArray(next)
      && cur.token[0] === 'unit'
      && ((next.token[0] === 'expr' && next.token[2] === 'or') || (next.token[0] === 'fx' && next.token[2] === 'func'))
    ) {
      const offset = tokens.slice(i).findIndex(x => !isArray(x) && x.token[0] === 'fx' && x.token[2] === 'func');

      if (offset !== -1) {
        const cutBody = tokens.slice(i).findIndex(x => !isArray(x) && x.token[0] === 'expr' && hasSep(x.token[1]));
        const cutOffset = cutBody >= 0 ? cutBody : tokens.length - offset;
        const fixedTokens = tokens.splice(i, cutOffset + 1);

        tokens.splice(i, 1, Expr.from(['fn', '$', {
          args: fixArgs(fixedTokens.slice(0, offset), true),
          body: fixTree(fixedTokens.slice(offset + 1)),
        }]));
      }
      continue;
    }

    tokens[i] = cur;
  }

  return tokens;
}

export function fixValues(tokens, cb, y) {
  if (isArray(tokens[0])) {
    const subTree = tokens.map(x => fixValues(x, cb, y));

    return y && subTree.length === 1
      ? subTree[0]
      : subTree;
  }

  // FIXME: add object support...

  const subTree = cb(tokens);

  if (y
    && Array.isArray(subTree)
    && subTree.length === 1 && typeof subTree[0] !== 'string'
  ) {
    return subTree[0];
  }

  return subTree;
}

export function fixBinding(obj, name, alias, context) {
  let target;

  // FIXME: load from well-knwon symbols, and for external sources?
  // e.g. white-list or allow most methods as they are?
  switch (obj) {
    case 'Object':
    case 'String':
    case 'Array':
    case 'Math':
      target = Function.prototype.call.bind(global[obj].prototype[name]);
      break;
    default: {
      // FIXME: for browser usage, decouple this...
      const fs = require('fs');
      const path = require('path');

      const srcDir = context.filepath
        ? path.dirname(context.filepath)
        : process.cwd();

      const srcFile = path.resolve(srcDir, obj);

      // FIXME: cache this shit... also, disable for browser!! (or replace...)
      if (fs.existsSync(srcFile)) {
        if (srcFile.indexOf('.js') === srcFile.length - 3) {
          let def = require(srcFile);

          // normalize default-exported functions
          def = typeof def === 'function'
            ? { default: def }
            : def;

          if (def) {
            target = def[name];
          }
        } else {
          const ast = context.include(fs.readFileSync(srcFile).toString(), srcFile).tree;

          for (let i = 0; i < ast.length; i += 1) {
            const subTree = ast[i];

            for (let j = 0; j < subTree.length; j += 1) {
              const node = subTree[j];

              if (!isArray(node) && node.token[0] === 'def' && node.token[1] === name && node._body) {
                // rename matching definition if it's aliased!
                fixValues(node.token[2].body, x => x.map(y => {
                  if (!isArray(y) && y.token[0] === 'def' && y.token[1] === name && alias) y.token[1] = alias;
                  return y;
                }));

                return node.token[2];
              }
            }
          }
        }
      }

      if (!target) {
        throw new Error(`Missing \`${name}\` binding from \`${obj}\``);
      }
    }
      break;
  }

  // FIXME: this would lead to disasters?
  if (typeof target !== 'function') {
    return {
      body: [Expr.derive(target)],
    };
  }

  return {
    body: [Expr.from(['bind', [obj, name, target]])],
  };
}

export function buildTree(tokens) {
  let root = [];

  const tree = root;
  const stack = [];
  const offsets = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];

    // handle nesting
    // FIXME: more helpers
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
        throw new Err('Unexpected end, missing `(`', tokens[i - 1]);
      }

      root.push(t);
    }
  }

  if (stack.length) {
    const fixedOffset = offsets.pop();
    const fixedToken = fixedOffset.token[1];

    throw new Err(`Missing terminator for \`${fixedToken}\``, fixedOffset);
  }

  return tree;
}
