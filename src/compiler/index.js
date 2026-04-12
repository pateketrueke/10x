import Parser from '../lib/tree/parser';
import { generateAtomicCss } from './atoms.js';
import {
  BLOCK, COMMA, DIV, DOT, EOL, EQUAL, GREATER, GREATER_EQ, LESS, LESS_EQ, LIKE, MINUS, MOD, MUL, NOT_EQ, EXACT_EQ, OR, PIPE, PLUS,
  TEXT, COMMENT, COMMENT_MULTI, EOF, RANGE, SOME, EVERY, SYMBOL, NOT, FAT_ARROW, LITERAL,
} from '../lib/tree/symbols';

const OPERATOR = new Map([
  [PLUS, '+'],
  [MINUS, '-'],
  [MUL, '*'],
  [DIV, '/'],
  [MOD, '%'],
  [EQUAL, '==='],
  [LESS, '<'],
  [LESS_EQ, '<='],
  [GREATER, '>'],
  [GREATER_EQ, '>='],
  [NOT_EQ, '!='],
  [EXACT_EQ, '==='],
  [OR, '||'],
  [LIKE, '~'],
  [PIPE, '|>'],
]);

export function splitStatements(tokens) {
  const out = [];
  let current = [];

  tokens.forEach(token => {
    if (token.type === EOL) {
      if (current.length) out.push(current);
      current = [];
      return;
    }

    current.push(token);
  });

  if (current.length) out.push(current);
  return out;
}

function preserveMarkdownLine(line) {
  return String(line || '').replace(/\s+$/, '');
}

function normalizeProseBlock(lines) {
  const out = [];

  lines.forEach(line => {
    const isEmpty = !line.trim().length;
    const prev = out[out.length - 1];
    const prevIsEmpty = typeof prev === 'string' && !prev.trim().length;
    if (isEmpty && (!out.length || prevIsEmpty)) return;
    out.push(line);
  });

  while (out.length && !out[0].trim().length) out.shift();
  while (out.length && !out[out.length - 1].trim().length) out.pop();
  return out;
}

function textTokenToSource(token) {
  if (!token || !token.value || !Array.isArray(token.value.buffer)) return '';

  return token.value.buffer.reduce((prev, cur) => {
    if (typeof cur === 'string') return prev + cur;
    if (Array.isArray(cur) && typeof cur[2] === 'string') return prev + cur[2];
    return prev;
  }, '');
}

export function normalizeDirectiveArgs(body) {
  if (!Array.isArray(body)) return [];

  const flat = body.length === 1
    && body[0]
    && body[0].type === BLOCK
    && body[0].hasBody
    ? body[0].getBody()
    : body;

  return flat.filter(token => token && token.type !== COMMA);
}

function collectProseComments(source, statementCount) {
  const sourceLines = String(source || '').split('\n');
  const raw = Parser.getAST(source, null);
  const commentsByStatement = Array.from({ length: statementCount }, () => []);

  const ranges = [];
  let currentStart = null;
  let currentEnd = null;

  raw.forEach(token => {
    if (token.type === EOF) return;

    if (token.type === EOL) {
      if (currentStart !== null) {
        const line = Number.isFinite(token.line) ? token.line : currentEnd;
        ranges.push({ start: currentStart, end: line });
        currentStart = null;
        currentEnd = null;
      }
      return;
    }

    if (token.type === TEXT || token.type === COMMENT || token.type === COMMENT_MULTI) return;

    const line = Number.isFinite(token.line) ? token.line : null;
    if (line === null) return;

    if (currentStart === null) {
      currentStart = line;
      currentEnd = line;
      return;
    }

    currentEnd = Math.max(currentEnd, line);
  });

  if (currentStart !== null) {
    ranges.push({ start: currentStart, end: currentEnd });
  }

  let cursor = 0;
  ranges.slice(0, statementCount).forEach((range, index) => {
    const prose = sourceLines
      .slice(cursor, range.start)
      .map(preserveMarkdownLine);
    commentsByStatement[index] = normalizeProseBlock(prose);
    cursor = range.end + 1;
  });

  return commentsByStatement;
}

function splitByEol(tokens) {
  const out = [];
  let current = [];

  (tokens || []).forEach(token => {
    if (token.type === EOL) {
      if (current.length) out.push(current);
      current = [];
      return;
    }
    current.push(token);
  });

  if (current.length) out.push(current);
  return out;
}

function getRuntimeSiblingPath(runtimePath, moduleName) {
  if (runtimePath.endsWith('/runtime')) {
    return `${runtimePath.slice(0, -'/runtime'.length) || '.'}/${moduleName}`.replace('//', '/');
  }
  if (runtimePath.endsWith('/runtime/index.js')) {
    return `${runtimePath.slice(0, -'/runtime/index.js'.length) || '.'}/${moduleName}`.replace('//', '/');
  }
  if (runtimePath === './runtime') return `./${moduleName}`;
  if (runtimePath === '10x/runtime') return `10x/${moduleName}`;
  return `./${moduleName}`;
}

function getPreludePath(runtimePath) {
  return getRuntimeSiblingPath(runtimePath, 'prelude');
}

function getCoreRuntimePath(runtimePath) {
  if (runtimePath.startsWith('./') || runtimePath.startsWith('../')) return runtimePath;
  if (runtimePath.endsWith('/runtime')) return `${runtimePath}/core`;
  if (runtimePath.endsWith('/runtime/index.js')) return `${runtimePath.slice(0, -'/index.js'.length)}/core.js`;
  return runtimePath;
}

function toTokenLike(node) {
  if (!node) return node;
  if (node.type) return node;

  if (typeof node === 'string') {
    if (/^-?\d+(\.\d+)?$/.test(node)) return { isNumber: true, value: node };
    return { isLiteral: true, value: node };
  }

  if (typeof node === 'number') {
    return { isNumber: true, value: String(node) };
  }

  if (typeof node === 'object' && Object.prototype.hasOwnProperty.call(node, 'value')) {
    return toTokenLike(node.value);
  }

  return node;
}

function splitArgGroups(args) {
  const groups = [];
  let current = [];

  (args || []).forEach(token => {
    if (token.type === COMMA) {
      if (current.length) groups.push(current);
      current = [];
      return;
    }
    current.push(token);
  });

  if (current.length) groups.push(current);
  return groups;
}

function unwrapSingleBodyBlock(token) {
  let current = token;

  while (
    current
    && current.type === BLOCK
    && current.hasBody
    && !current.hasArgs
    && current.getBody().length === 1
  ) {
    [current] = current.getBody();
  }

  return current;
}

function extractPostUpdatePartsFromArgs(args, ctx) {
  if (!Array.isArray(args)) return null;
  if (args.length !== 2) return null;

  const [targetToken, updateToken] = args;
  if (!(targetToken && targetToken.isLiteral && typeof targetToken.value === 'string')) return null;

  const target = String(targetToken.value);
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(target)) return null;

  if (!(updateToken && updateToken.isObject && updateToken.value && updateToken.value.let && updateToken.value.let.hasBody)) return null;

  const [entryRaw] = updateToken.value.let.getBody();
  const entry = unwrapSingleBodyBlock(entryRaw);
  if (!(entry && entry.isCallable && entry.getName && entry.getName() === target && entry.hasBody)) return null;

  const rhs = compileExpression(entry.getBody(), { ...ctx, autoPrintExpressions: false, exportDefinitions: false });
  return { target, rhs };
}

function isQuestionToken(token) {
  return !!token && (token.type === SOME || (token.isLiteral && token.value === '?'));
}

function isPipeChoiceToken(token) {
  return !!token && (token.type === OR || (token.isLiteral && token.value === '|'));
}

function collectImportSpecs(statements, runtimePath) {
  const imports = [];
  const globals = [];
  const seenImport = new Set();
  const seenGlobal = new Set();

  statements.forEach(tokens => {
    if (tokens.length === 1) {
      const [token] = tokens;
      if (!token.isObject || !token.value || !token.value.import) return;

      const fromBody = token.value.from && token.value.from.getBody ? token.value.from.getBody() : [];
      const source = fromBody[0] && typeof fromBody[0].value === 'string' ? fromBody[0].value : null;
      const importToken = token.value.import;
      const importBodyRaw = importToken && importToken.getBody ? importToken.getBody() : [];
      const importBody = importBodyRaw.length === 1
        && importBodyRaw[0]
        && importBodyRaw[0].type === BLOCK
        && importBodyRaw[0].hasBody
        ? importBodyRaw[0].getBody()
        : importBodyRaw;
      const specifiers = (importBody.length
        ? importBody.filter(x => x && x.type !== COMMA).map(x => x.value)
        : [importToken && importToken.value]
      ).filter(Boolean);

      if (!specifiers.length) return;

      if (source === 'Prelude' || source === 'IO' || source === 'Proc' || (source === 'Array' && specifiers.includes('concat'))) {
        const modulePath = source === 'Prelude'
          ? getPreludePath(runtimePath)
          : source === 'IO'
            ? getRuntimeSiblingPath(runtimePath, 'io')
            : source === 'Proc'
              ? getRuntimeSiblingPath(runtimePath, 'proc')
              : getPreludePath(runtimePath);
        const preludeSpecifiers = source === 'Prelude'
          ? specifiers
          : source === 'IO' || source === 'Proc'
            ? specifiers
          : specifiers.filter(x => x === 'concat');
        const key = `${modulePath}::${specifiers.join(',')}`;
        if (!seenImport.has(key)) {
          imports.push({ source: modulePath, specifiers: preludeSpecifiers });
          seenImport.add(key);
        }
        if (source === 'Array') {
          const remaining = specifiers.filter(x => x !== 'concat');
          if (!remaining.length) return;
          const gKey = `${source}::${remaining.join(',')}`;
        if (!seenGlobal.has(gKey)) {
          globals.push({ source, specifiers: remaining });
          seenGlobal.add(gKey);
        }
        return;
      }
      return;
    }

    if (source && /^[A-Z][A-Za-z0-9_]*$/.test(source)) {
      const key = `${source}::${specifiers.join(',')}`;
      if (!seenGlobal.has(key)) {
        globals.push({ source, specifiers });
        seenGlobal.add(key);
      }
    }
    }
    
    if (tokens.length >= 4 && tokens[0].value === 'import' && tokens[2].value === 'from') {
      const importBlock = tokens[1];
      const sourceToken = tokens[3];
      
      if (importBlock && importBlock.hasArgs && sourceToken && sourceToken.isString) {
        const source = sourceToken.value;
        const specifiers = importBlock.getArgs()
          .filter(t => t.type !== COMMA)
          .map(t => t.value)
          .filter(Boolean);
        
        if (specifiers.length && source) {
          const key = `${source}::${specifiers.join(',')}`;
          if (!seenImport.has(key)) {
            imports.push({ source, specifiers });
            seenImport.add(key);
          }
        }
      }
    }
  });

  return { imports, globals };
}

function collectNeedsDom(statements) {
  return statements.some(tokens => {
    if (tokens.length !== 1) return false;
    const [token] = tokens;
    if (!token.isObject || !token.value) return false;
    return !!(token.value.render || token.value.on || token.value.shadow || token.value.style || token.value.mount || token.value.click);
  });
}

function collectNeedsTest(statements) {
  return statements.some(tokens => {
    if (tokens.length !== 1) return false;
    const [token] = tokens;
    if (!token.isObject || !token.value) return false;
    return !!(token.value.test || token.value.expect || token.value.before_all || token.value.before_each || token.value.after_all || token.value.after_each);
  });
}

function collectPrintStatements(source) {
  const raw = Parser.getAST(source, null);
  const printIdx = new Set();
  let idx = 0;
  let seenCode = false;
  let seenPrint = false;

  raw.forEach(token => {
    if (token.type === EOF) return;
    if (token.type === EOL) {
      if (seenCode) {
        if (seenPrint) printIdx.add(idx);
        idx++;
      }
      seenCode = false;
      seenPrint = false;
      return;
    }
    if (token.type === TEXT || token.type === COMMENT || token.type === COMMENT_MULTI) return;
    seenCode = true;
    if (token.type === NOT) seenPrint = true;
  });

  return printIdx;
}

function quote(value) {
  return JSON.stringify(String(value));
}

function indentMultiline(value, indent) {
  return String(value)
    .split('\n')
    .map(line => `${indent}${line}`)
    .join('\n');
}

function formatFirstInline(value, indent) {
  const lines = String(value).split('\n');
  if (lines.length === 1) return lines[0];
  return `${lines[0]}\n${lines.slice(1).map(line => `${indent}${line}`).join('\n')}`;
}

function compileTag(node, depth = 0, ctx = {}) {
  const attrEntries = Object.entries(node.attrs || {});
  const attrsStr = attrEntries.length === 0
    ? 'null'
    : '{ ' + attrEntries.map(([k, v]) => {
        if (v === true) return `${JSON.stringify(k)}: true`;
        if (v && typeof v === 'object' && typeof v.expr === 'string') {
          const expr = v.expr.trim();
          // Track B: reject inline lambdas and directives in attribute values
          if (/^@[a-z]/.test(expr)) {
            throw new Error(`Attribute "${k}" uses an inline directive — declare it before the markup`);
          }
          if (/^[a-zA-Z_$][a-zA-Z0-9_$,\s]*\s*->/.test(expr)) {
            throw new Error(`Attribute "${k}" uses an inline lambda — declare the handler before the markup`);
          }
          const passSignal = /^(d:|s:|class:|style:)/.test(k) || k === 'ref';
          return passSignal
            ? `${JSON.stringify(k)}: ${expr}`
            : `${JSON.stringify(k)}: $.read(${expr})`;
        }
        return `${JSON.stringify(k)}: ${JSON.stringify(String(v))}`;
      }).join(', ') + ' }';

  const childrenParts = (node.children || []).map(child => {
    if (typeof child === 'string') return JSON.stringify(child);
    if (child && typeof child.expr === 'string') {
      const expr = child.expr.trim();
      // #{@if cond then @else else} → $.computed(() => cond ? then : else)
      // so somedom handles it as a reactive signal child with surgical updates.
      if (expr.startsWith('@if ') || expr === '@if') {
        const tokens = Parser.sub(expr);
        if (tokens.length) return `$.computed(() => ${compileToken(tokens[0], ctx)})`;
      }
      // #{@html expr} → inject trusted vdom/array directly (no escape wrapper)
      if (expr.startsWith('@html ')) {
        return expr.slice(6).trim();
      }
      // Pass the signal/value directly so somedom can create a surgical text-node
      // subscription (via its isSignal check) rather than subscribing the outer effect.
      return expr;
    }
    return compileTag(child, depth + 1, ctx);
  });

  // Component dispatch: uppercase tag names call the function directly.
  if (/^[A-Z]/.test(node.name)) {
    const propsBase = attrsStr === 'null' ? '' : attrsStr.slice(2, -2); // strip '{ ' / ' }'
    const childrenEntry = childrenParts.length
      ? `"children": [${childrenParts.join(', ')}]`
      : '';
    const entries = [propsBase, childrenEntry].filter(Boolean).join(', ');
    return `${node.name}({ ${entries} })`;
  }

  if (!childrenParts.length) {
    return `$.h(${JSON.stringify(node.name)}, ${attrsStr})`;
  }

  const indent = '  '.repeat(depth);
  const childIndent = '  '.repeat(depth + 1);
  const [firstRawChild, ...restRawChildren] = childrenParts;
  const firstChild = formatFirstInline(firstRawChild, childIndent);
  const restChildren = restRawChildren.map(part => indentMultiline(part, childIndent));
  const rest = restChildren.length ? `,\n${restChildren.join(',\n')}` : '';

  return `$.h(${JSON.stringify(node.name)}, ${attrsStr}, ${firstChild}${rest})`;
}

function compileArgs(args, ctx) {
  if (!Array.isArray(args) || !args.length) return '';
  const groups = splitArgGroups(args);

  const hasObjectPair = groups.some(group => group.length === 2 && (group[0].type === SYMBOL || group[0].isString));
  const isObjectArg = hasObjectPair
    && groups.every(group => (group.length === 2 && (group[0].type === SYMBOL || group[0].isString))
      || (group.length === 1 && (group[0].isObject || (group[0].isLiteral && typeof group[0].value === 'object')))
    );

  if (isObjectArg) {
    return `{ ${groups.map(group => {
      if (group.length === 1) return `...${compileToken(group[0], ctx)}`;
      const keyRaw = String(group[0].value || '').replace(/^:/, '');
      return `${JSON.stringify(keyRaw)}: ${compileToken(group[1], ctx)}`;
    }).join(', ')} }`;
  }

  return groups.map(group => {
    const post = extractPostUpdatePartsFromArgs(group, ctx);
    if (post) {
      return `(() => { const __prev = ${post.target}; ${post.target} = ${post.rhs}; return __prev; })()`;
    }

    if (group.some(token => token.type === EOL)) {
      const nested = splitByEol(group);
      const localCtx = { ...ctx, autoPrintExpressions: false, exportDefinitions: false };
      const head = nested.slice(0, -1).map(stmt => compileStatement(stmt, localCtx, -1));
      const tail = compileStatement(nested[nested.length - 1], localCtx, -1).replace(/;\s*$/, '');
      return `(() => { ${head.join(' ')} return ${tail}; })()`;
    }

    const hasOperator = group.some(token => OPERATOR.get(token.type));
    const hasCall = group.some(token => token.type === BLOCK && token.hasArgs);
    if (!hasOperator && !hasCall && group.length > 1) {
      return `[${group.map(token => compileToken(token, ctx)).join(', ')}]`;
    }
    return compileExpression(group, ctx);
  }).join(', ');
}

function compileLambda(token, ctx) {
  const args = token.hasArgs ? token.getArgs().map(arg => compileToken(arg, ctx)).join(', ') : '';
  const body = token.hasBody ? compileExpression(token.getBody(), ctx) : 'undefined';
  return `(${args}) => (${body})`;
}

function compileToken(token, ctx = { signalVars: new Set() }) {
  if (token && token.isObject) {
    const value = token.value || {};
    const keys = Object.keys(value);
    const directiveKeys = [
      'render', 'on', 'html', 'signal', 'computed', 'prop', 'if', 'else', 'do', 'let',
      'match', 'while', 'loop', 'try', 'rescue', 'export', 'import', 'from', 'style',
      'test', 'expect', 'before_all', 'before_each', 'after_all', 'after_each', 'mount', 'click',
    ];
    const isDirective = keys.some(k => directiveKeys.includes(k));

    if (isDirective) return compileDirectiveObject(token, ctx);

    const pairs = keys.map(key => {
      const body = value[key] && value[key].getBody ? value[key].getBody() : [];
      const rhs = body.length ? compileExpression(body, ctx) : 'undefined';
      return `${JSON.stringify(key)}: ${rhs}`;
    });
    return `{ ${pairs.join(', ')} }`;
  }

  if (token.isTag) {
    return compileTag(token.value, 0, ctx);
  }

  if (token.isCallable && !token.getName()) {
    return compileLambda(token, ctx);
  }

  if (token.isNumber) {
    return token.value;
  }

  if (token.isString) {
    if (Array.isArray(token.value)) {
      return compileExpression(token.value, ctx);
    }
    return quote(token.value);
  }

  if (token.type === BLOCK && token.hasArgs && !token.hasBody) {
    const groups = splitArgGroups(token.getArgs());
    const objectLike = groups.length
      && groups.every(group => group.length === 2 && (group[0].type === SYMBOL || group[0].isString));

    if (objectLike) {
      const pairs = groups.map(group => {
        const keyRaw = String(group[0].value || '').replace(/^:/, '');
        return `${JSON.stringify(keyRaw)}: ${compileToken(group[1], ctx)}`;
      });
      return `{ ${pairs.join(', ')} }`;
    }

    return `(${compileArgs(token.getArgs(), ctx)})`;
  }

  if (token.type === BLOCK && token.hasBody && !token.isCallable) {
    const body = token.getBody();
    const keyValuePair = body.length === 2
      && (body[0].type === SYMBOL || body[0].isString)
      && (body[1].type === SYMBOL || body[1].isString || body[1].isLiteral);

    if (keyValuePair) {
      const keyRaw = String(body[0].value || '').replace(/^:/, '');
      return `{ ${JSON.stringify(keyRaw)}: ${compileToken(body[1], ctx)} }`;
    }

    return `(${compileExpression(body, ctx)})`;
  }

  if (token.type === SYMBOL) {
    const value = String(token.value || '').replace(/^:/, '');
    return quote(value);
  }

  if (token.type === RANGE) {
    if (Array.isArray(token.value)) {
      const items = token.value
        .map(toTokenLike)
        .filter(x => {
          if (!x) return false;
          if (x.type === COMMA) return false;
          return !(x.isLiteral && x.value === ',');
        });
      if (items.some(x => x.type === DOT)) {
        return `(${compileExpression(items, ctx)})`;
      }
      return `[${items.map(x => compileToken(x, ctx)).join(', ')}]`;
    }
    if (token.value && Array.isArray(token.value.begin)) {
      const begin = token.value.begin.map(x => compileToken(x, ctx)).join(', ');
      const end = Array.isArray(token.value.end) && token.value.end.length
        ? `, ${token.value.end.map(x => compileToken(x, ctx)).join(', ')}`
        : '';
      return `range(${begin}${end})`;
    }
  }

  if (token.isLiteral) {
    if (token.value === null) return 'null';
    if (token.value === true) return 'true';
    if (token.value === false) return 'false';
    if (typeof token.value === 'string') {
      if (token.value === '|') return '||';
      if (token.value === '?') return '?';
      if (ctx.signalVars.has(token.value)) return `$.read(${token.value})`;
      return token.value;
    }
    if (token.value && typeof token.value === 'object') {
      if (Object.prototype.hasOwnProperty.call(token.value, 'value')) {
        return compileToken(token.value, ctx);
      }
      if (Array.isArray(token.value.body)) {
        return compileExpression(token.value.body, ctx);
      }
      if (Array.isArray(token.value.args)) {
        return `(${compileArgs(token.value.args, ctx)})`;
      }
    }
    return JSON.stringify(token.value);
  }

  if (token.type === SOME) {
    const target = compileToken(token.value, ctx);
    return `(${target} != null)`;
  }

  if (token.type === EVERY) {
    const target = compileToken(token.value, ctx);
    return `${target}.every(Boolean)`;
  }

  if (token.type === NOT && token.value !== '!') {
    return '!';
  }

  if (token.type === LIKE && Array.isArray(token.value) && token.value.length >= 2) {
    const parts = token.value.map(toTokenLike).filter(Boolean);
    const leftTokens = parts.length > 2 ? parts.slice(0, -1) : [parts[0]];
    const rightToken = parts.length > 2 ? parts[parts.length - 1] : parts[1];
    const left = leftTokens.length > 1 ? compileExpression(leftTokens, ctx) : compileToken(leftTokens[0], ctx);
    const right = compileToken(rightToken, ctx);
    return `(String(${left}).includes(String(${right})))`;
  }

  if (token.type === BLOCK && token.hasBody && token.isCallable) {
    return compileLambda(token, ctx);
  }

  const op = OPERATOR.get(token.type);
  if (op) {
    if (Array.isArray(token.value)) {
      return token.value.map(x => compileToken(x, ctx)).join(` ${op} `);
    }
    return op;
  }

  throw new Error(`Unsupported token in compiler: ${String(token.type)}`);
}

function compileExpression(tokens, ctx = { signalVars: new Set() }) {
  const qIndex = tokens.findIndex(isQuestionToken);
  if (qIndex > 0) {
    const elseIndex = tokens.findIndex((token, index) => index > qIndex && isPipeChoiceToken(token));
    if (elseIndex > qIndex) {
      const cond = tokens.slice(0, qIndex);
      const thenBranch = tokens.slice(qIndex + 1, elseIndex);
      const elseBranch = tokens.slice(elseIndex + 1);
      return `((${compileExpression(cond, ctx)}) ? (${compileExpression(thenBranch, ctx)}) : (${compileExpression(elseBranch, ctx)}))`;
    }
  }

  const out = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];
    const prev = tokens[i - 1];

    if (token.type === PIPE) {
      const left = out.pop();
      const rhs = tokens[i + 1];
      const rhsNext = tokens[i + 2];

      if (rhs && rhs.isLiteral && rhsNext && rhsNext.type === BLOCK && rhsNext.hasArgs) {
        const args = rhsNext.getArgs().filter(x => x.type !== COMMA).map(x => compileToken(x, ctx));
        out.push(`${compileToken(rhs, ctx)}(${[left].concat(args).join(', ')})`);
        i += 2;
        continue;
      }

      if (rhs && rhs.isLiteral) {
        out.push(`${compileToken(rhs, ctx)}(${left})`);
        i += 1;
        continue;
      }
    }

    if (
      token.type === BLOCK
      && token.hasArgs
      && !token.hasBody
      && prev
      && (prev.isLiteral || prev.isTag || (prev.type === BLOCK && prev.hasArgs))
    ) {
      if (prev.isString && prev.value === '' && out.length >= 2) {
        const indexExpr = compileArgs(token.getArgs(), ctx);
        out.pop();
        out[out.length - 1] = `${out[out.length - 1]}[${indexExpr}]`;
        continue;
      }
      out[out.length - 1] = `${out[out.length - 1]}(${compileArgs(token.getArgs(), ctx)})`;
      continue;
    }

    if (token.type === SYMBOL && token.value === ':' && next && next.type === BLOCK && next.hasArgs && out.length) {
      const key = compileArgs(next.getArgs(), ctx);
      out[out.length - 1] = `${out[out.length - 1]}[${key}]`;
      i += 1;
      continue;
    }

    if (token.type === DOT && next && next.isLiteral) {
      out.push('.');
      continue;
    }

    out.push(compileToken(token, ctx));
  }

  return out.join(' ').replace(/\s+\./g, '.').replace(/\.\s+/g, '.');
}

function compileHandler(token, ctx) {
  const callable = (() => {
    if (token && token.isCallable && token.getName()) return token;
    if (token && token.type === BLOCK && token.hasBody) {
      const [first] = token.getBody();
      if (first && first.isCallable && first.getName()) return first;
    }
    return null;
  })();

  if (callable) {
    if (ctx.signalVars.has(callable.getName())) {
      return `() => { ${callable.getName()}.set(${compileExpression(callable.getBody(), ctx)}); }`;
    }

    return `() => { ${compileDefinition(callable, true, { ...ctx, exportDefinitions: false, autoPrintExpressions: false })} }`;
  }

  if (token && token.type === BLOCK && token.hasBody) {
    return `() => (${compileExpression(token.getBody(), ctx)})`;
  }

  return `() => (${compileToken(token, ctx)})`;
}

function compileSignalDirective(body, ctx) {
  return `$.signal(${compileExpression(body, ctx)})`;
}

function compileIfDirective(value, ctx) {
  const branches = value.if && value.if.getBody ? value.if.getBody() : [];
  const elseBody = value.else && value.else.getBody ? value.else.getBody() : [];

  const branchExprs = branches.map(branch => {
    const body = branch && branch.hasBody ? branch.getBody() : [];
    const [cond, ...rest] = body;
    return {
      cond: cond ? compileExpression([cond], ctx) : 'false',
      thenExpr: rest.length ? compileExpression(rest, ctx) : 'undefined',
    };
  });

  let out = elseBody.length ? compileExpression(elseBody, ctx) : 'undefined';
  for (let i = branchExprs.length - 1; i >= 0; i--) {
    out = `((${branchExprs[i].cond}) ? (${branchExprs[i].thenExpr}) : (${out}))`;
  }

  return out;
}

function compileDoDirective(body, ctx) {
  const [block] = body;
  const statements = block && block.hasBody ? splitByEol(block.getBody()) : [];
  if (!statements.length) return '(() => undefined)()';

  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const head = statements.slice(0, -1).map(stmt => compileStatement(stmt, localCtx, -1));
  const tail = compileStatement(statements[statements.length - 1], localCtx, -1).replace(/;\s*$/, '');
  return `(() => { ${head.join(' ')} return ${tail}; })()`;
}

function compileLetDirective(body, ctx) {
  const items = (body || []).flatMap(part => (part && part.hasBody ? part.getBody() : [part])).filter(Boolean);
  if (!items.length) return 'undefined';

  const mode = ctx.letMode || 'declare';
  const assignOne = entry => {
    if (entry && entry.isCallable && entry.getName()) {
      const left = entry.getName();
      const rhs = compileExpression(entry.getBody(), { ...ctx, exportDefinitions: false, autoPrintExpressions: false });
      if (mode === 'assign') return `(${left} = ${rhs})`;
      return `let ${left} = ${rhs}`;
    }
    return compileToken(entry, { ...ctx, autoPrintExpressions: false });
  };

  const exprs = items.map(assignOne);
  if (mode === 'assign') {
    return exprs[exprs.length - 1];
  }

  return exprs.join('; ');
}

function compileMatchDirective(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  if (!tokens.length) return 'undefined';

  const key = compileToken(tokens[0], ctx);
  const pairs = [];
  let elseExpr = 'undefined';

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === COMMA) continue;
    if (token.isObject && token.value && token.value.else) {
      elseExpr = compileExpression(token.value.else.getBody(), ctx);
      continue;
    }
    const next = tokens[i + 1];
    if (!next) break;
    pairs.push({ when: compileToken(token, ctx), thenExpr: compileToken(next, ctx) });
    i++;
  }

  let out = elseExpr;
  for (let i = pairs.length - 1; i >= 0; i--) {
    out = `(${key} === ${pairs[i].when} ? ${pairs[i].thenExpr} : ${out})`;
  }
  return out;
}

function compileWhileDirective(body, ctx) {
  const tokens = (body || []).flatMap(part => (part && part.hasBody ? part.getBody() : [part])).filter(Boolean);
  const [cond, ...rest] = tokens;
  const condition = cond ? compileExpression([cond], { ...ctx, letMode: 'assign', autoPrintExpressions: false }) : 'false';
  const innerParts = rest.map(token => {
    if (token && token.isCallable && token.getName()) {
      return `${token.getName()} = ${compileExpression(token.getBody(), { ...ctx, autoPrintExpressions: false })};`;
    }
    return `${compileToken(token, { ...ctx, letMode: 'assign', autoPrintExpressions: false })};`;
  });

  const tail = innerParts.length ? innerParts[innerParts.length - 1].replace(/;\s*$/, '') : 'undefined';
  const bodyLines = innerParts.slice(0, -1).join(' ');

  return `(() => { let __whileResult; while (${condition}) { ${bodyLines} __whileResult = ${tail}; } return __whileResult; })()`;
}

function compileLoopDirective(body, ctx) {
  const [block] = body;
  const tokens = block && block.hasBody ? block.getBody() : [];
  const [iterableToken, fnToken] = tokens;
  const iterable = iterableToken && iterableToken.hasArgs
    ? compileArgs(iterableToken.getArgs(), ctx)
    : compileToken(iterableToken, ctx);

  if (!fnToken || !fnToken.isCallable) return `for (const _ of ${iterable}) {}`;

  const args = fnToken.hasArgs ? fnToken.getArgs().map(arg => compileToken(arg, ctx)).join(', ') : '_';
  const bodyExpr = fnToken.hasBody ? compileExpression(fnToken.getBody(), { ...ctx, autoPrintExpressions: false }) : 'undefined';
  return `for (const ${args} of ${iterable}) { ${bodyExpr}; }`;
}

function compileTryDirective(value, ctx) {
  const tryBody = value.try && value.try.getBody ? value.try.getBody() : [];
  const rescueBody = value.rescue && value.rescue.getBody ? value.rescue.getBody() : [];

  const tryExpr = tryBody.length ? compileExpression(tryBody, { ...ctx, autoPrintExpressions: false }) : 'undefined';
  let rescueArg = 'error';
  let rescueExpr = 'undefined';

  if (rescueBody.length) {
    let [first] = rescueBody;
    if (first && first.type === BLOCK && first.hasBody && first.getBody().length === 1) {
      [first] = first.getBody();
    }
    if (first && first.isCallable) {
      rescueArg = first.hasArgs && first.getArgs().length ? compileToken(first.getArgs()[0], ctx) : rescueArg;
      rescueExpr = first.hasBody ? compileExpression(first.getBody(), { ...ctx, autoPrintExpressions: false }) : rescueExpr;
    } else {
      rescueExpr = compileExpression(rescueBody, { ...ctx, autoPrintExpressions: false });
    }
  }

  return `(() => { try { return ${tryExpr}; } catch (${rescueArg}) { return ${rescueExpr}; } })()`;
}

function compileExportDirective(body, ctx) {
  const names = normalizeDirectiveArgs(body).map(token => compileToken(token, ctx));
  return `export { ${names.join(', ')} }`;
}

function compileHtmlDirective(body, ctx) {
  const [template] = body;
  if (template && template.type === RANGE && Array.isArray(template.value)) {
    const items = template.value
      .filter(token => token && token.type !== COMMA)
      .map(token => compileToken(token, ctx));
    return `$.html(() => [${items.join(', ')}])`;
  }
  // Multi-root: a BLOCK wrapping multiple sibling nodes → emit as array fragment
  if (template && template.type === BLOCK && template.hasBody) {
    const inner = template.getBody();
    if (inner.length > 1) {
      const items = inner.map(t => compileToken(t, ctx));
      return `$.html(() => [${items.join(', ')}])`;
    }
  }
  return `$.html(() => ${compileToken(template, ctx)})`;
}

function compileComputedDirective(body, ctx) {
  return `$.computed(() => ${compileExpression(body, ctx)})`;
}

function compileStyleDirective(body, ctx) {
  const [arg] = body;
  const hostArg = ctx.shadow ? 'host, ' : '';
  return `$.style(${hostArg}${compileToken(arg, ctx)})`;
}

function compileTestDirective(body, value, ctx) {
  const [stmt] = body;
  const testBody = stmt && stmt.hasBody ? stmt.getBody() : body;
  const firstBlock = testBody[0] && testBody[0].hasBody ? testBody[0].getBody() : testBody;
  const testName = firstBlock[0] && firstBlock[0].isString ? firstBlock[0].value : 'test';
  
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  
  const compiled = [];
  
  for (const token of firstBlock) {
    if (token.type === FAT_ARROW) continue;
    if (token.isString) continue;
    
    if (token && token.value && token.value.name) {
      const name = token.value.name;
      const tokenBody = token.getBody ? token.getBody() : [];
      
      if (tokenBody && tokenBody.length === 1 && tokenBody[0] && tokenBody[0].value && tokenBody[0].value.signal) {
        const signalBody = tokenBody[0].value.signal.getBody();
        const signalExpr = compileExpression(signalBody, localCtx);
        compiled.push(`const ${name} = $.signal(${signalExpr});`);
      } else if (tokenBody && tokenBody.length) {
        const expr = compileExpression(tokenBody, localCtx);
        compiled.push(`${expr};`);
      }
    }
  }
  
  for (let i = 1; i < testBody.length; i++) {
    const token = testBody[i];
    
    if (token && token.hasBody) {
      const tokenBody = token.getBody();
      if (tokenBody && tokenBody.length) {
        const expr = compileExpression(tokenBody, localCtx);
        compiled.push(`${expr};`);
      }
    } else if (token && token.isObject && token.value) {
      if (token.value.expect) {
        compiled.push(compileExpectDirective(token.value.expect.getBody(), localCtx));
      }
    }
  }
  
  if (value && value.expect) {
    compiled.push(compileExpectDirective(value.expect.getBody(), localCtx));
  }
  
  if (!compiled.length) {
    compiled.push('undefined');
  }
  
  return `test(${JSON.stringify(testName)}, async () => { ${compiled.join(' ')}; })`;
}

function compileExpectDirective(body, ctx) {
  const expr = compileExpression(body, ctx);
  return `expect(${expr}).toBe(true)`;
}

function compileBeforeAllDirective(body, ctx) {
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const compiled = [];
  
  if (ctx.currentValue && ctx.currentValue.mount) {
    compiled.push(compileMountDirective(ctx.currentValue.mount.getBody(), localCtx));
  }
  
  if (body.length) {
    const block = body.find(t => t && t.hasBody);
    const statements = block ? splitByEol(block.getBody()) : body;
    statements.forEach(stmt => {
      const result = compileStatement(stmt, localCtx, -1);
      if (result) compiled.push(result);
    });
  }
  
  return `beforeAll(async () => { ${compiled.join(' ')} })`;
}

function compileBeforeEachDirective(body, ctx) {
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const compiled = [];
  
  if (body.length) {
    const block = body.find(t => t && t.hasBody);
    const statements = block ? splitByEol(block.getBody()) : body;
    statements.forEach(stmt => {
      const result = compileStatement(stmt, localCtx, -1);
      if (result) compiled.push(result);
    });
  }
  
  return `beforeEach(async () => { ${compiled.join(' ')} })`;
}

function compileAfterAllDirective(body, ctx) {
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const compiled = [];
  
  if (body.length) {
    const block = body.find(t => t && t.hasBody);
    const statements = block ? splitByEol(block.getBody()) : body;
    statements.forEach(stmt => {
      const result = compileStatement(stmt, localCtx, -1);
      if (result) compiled.push(result);
    });
  }
  
  return `afterAll(async () => { ${compiled.join(' ')} })`;
}

function compileAfterEachDirective(body, ctx) {
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false };
  const compiled = [];
  
  if (body.length) {
    const block = body.find(t => t && t.hasBody);
    const statements = block ? splitByEol(block.getBody()) : body;
    statements.forEach(stmt => {
      const result = compileStatement(stmt, localCtx, -1);
      if (result) compiled.push(result);
    });
  }
  
  return `afterEach(async () => { ${compiled.join(' ')} })`;
}

function compileMountDirective(body, ctx) {
  const [selector] = body;
  return `mount(${compileToken(selector, ctx)})`;
}

function compileClickDirective(body, ctx) {
  const [selector] = body;
  return `await click(${compileToken(selector, ctx)})`;
}

function compileHmrFooter() {
  return [
    'if (import.meta.hot) {',
    '  const _hmrUrl = import.meta.url;',
    '  import.meta.hot.dispose(data => {',
    '    data.__signals = {};',
    '    for (const [k, s] of (globalThis.__10x_signals || new Map())) {',
    "      if (typeof k === 'string') data.__signals[k] = s.peek();",
    '    }',
    '  });',
    '  import.meta.hot.accept(newMod => {',
    '    const snap = import.meta.hot.data.__signals || {};',
    '    let _restoredCount = 0;',
    '    for (const [k, s] of (globalThis.__10x_signals || new Map())) {',
    "      if (typeof k === 'string' && snap[k] !== undefined) {",
    '        s.set(snap[k]);',
    '        _restoredCount++;',
    '      }',
    '    }',
    "    if (globalThis.__10x_devtools?.onHmr) {",
    '      globalThis.__10x_devtools.onHmr({ restored: _restoredCount, url: _hmrUrl });',
    '    }',
    '    const hosts = globalThis.__10x_components?.get(_hmrUrl);',
    '    if (hosts && newMod?.setup) {',
    '      hosts.forEach(host => {',
    '        if (host.shadowRoot) host.shadowRoot.innerHTML = "";',
    '        newMod.setup(host);',
    '      });',
    '    }',
    '  });',
    '}',
  ];
}

function compileRenderDirective(body, value, ctx) {
  const htmlExpr = value.html instanceof Object ? compileHtmlDirective(value.html.getBody(), ctx) : 'undefined';
  if (value.shadow) {
    const hmrUrlArg = ctx.hmr ? ', import.meta.url' : '';
    return `$.renderShadow(host, ${htmlExpr}${hmrUrlArg})`;
  }
  const selector = body.length ? compileExpression(body, ctx) : 'undefined';
  return `$.render(${selector}, ${htmlExpr})`;
}

function compileOnDirective(body, ctx) {
  const args = normalizeDirectiveArgs(body);

  // Signal-updater form: @on signal = expr
  // e.g. `inc = @on count = count + 1` → `() => { count.set(((count) => (count + 1))(count.peek())); }`
  // normalizeDirectiveArgs unwraps the BLOCK wrapper, exposing the callable directly.
  // Form A: single callable in args → name = signal, body = expr tokens
  // Form B: raw [LITERAL, EQUAL, ...exprTokens] — fallback
  let _signalName = null;
  let _bodyTokens = null;

  if (args.length === 1 && args[0] && args[0].isCallable) {
    // Form A
    const callable = args[0];
    _signalName = callable.getName();
    _bodyTokens = callable.hasBody ? callable.getBody() : null;
  } else if (args.length >= 2 && args[0] && args[0].type === LITERAL && args[1] && args[1].type === EQUAL) {
    // Form B: raw tokens from directive body
    _signalName = typeof args[0].value === 'string' ? args[0].value : null;
    _bodyTokens = args.slice(2);
  }

  if (_signalName && _bodyTokens && ctx.signalVars && ctx.signalVars.has(_signalName)) {
    const innerCtx = { ...ctx, signalVars: new Set([...(ctx.signalVars || [])].filter(v => v !== _signalName)) };
    const bodyExpr = compileExpression(_bodyTokens, innerCtx);
    return `() => { ${_signalName}.set(((${_signalName}) => (${bodyExpr}))(${_signalName}.peek())); }`;
  }

  // DOM event form: @on "event" selector handler
  const [eventToken, selectorToken, handlerToken] = args;
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);
  const handler = compileHandler(handlerToken, ctx);
  const rootArg = ctx.shadow ? ', host.shadowRoot' : '';
  return `$.on(${eventName}, ${selector}, ${handler}${rootArg})`;
}

function compileOnPropDirective(onBody, propBody, ctx) {
  const [eventToken, selectorToken, handlerToken] = normalizeDirectiveArgs(onBody);
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);

  // handler is a BLOCK containing the assignment callable (e.g. count =)
  let signalName;
  if (handlerToken.type === BLOCK && handlerToken.hasBody) {
    const [first] = handlerToken.getBody();
    signalName = first && first.getName ? first.getName() : String(first && first.value);
  } else if (handlerToken.isCallable) {
    signalName = handlerToken.getName();
  } else {
    signalName = String(handlerToken.value);
  }

  const propArgs = propBody[0].getBody();
  const propName = compileToken(propArgs[0], ctx);
  const fallback = compileToken(propArgs[1], ctx);
  const rootArg = ctx.shadow ? ', host.shadowRoot' : '';
  return `$.on(${eventName}, ${selector}, () => { ${signalName}.set($.prop(host, ${propName}, ${fallback})); }${rootArg})`;
}

function compileDirectiveObject(token, ctx) {
  const { value } = token;
  const keys = Object.keys(value || {});

  if (keys.length > 1 && !value.try && !value.if && !value.match && (value.let || value.while || value.loop || value.do)) {
    const statements = [];
    let tail = 'undefined';

    keys.forEach((key, idx) => {
      if (key === 'rescue' && value.try) return;
      const single = { [key]: value[key] };
      const out = compileDirectiveObject({ value: single }, { ...ctx, autoPrintExpressions: false });
      if (!out) return;
      if (idx === keys.length - 1) {
        tail = out.replace(/;\s*$/, '');
      } else {
        statements.push(`${out.replace(/;\s*$/, '')};`);
      }
    });

    return `(() => { ${statements.join(' ')} return ${tail}; })()`;
  }

  if (value.render) {
    return compileRenderDirective(value.render.getBody(), value, ctx);
  }

  if (value.on && value.prop) {
    return compileOnPropDirective(value.on.getBody(), value.prop.getBody(), ctx);
  }

  if (value.on) {
    return compileOnDirective(value.on.getBody(), ctx);
  }

  if (value.if) {
    return compileIfDirective(value, ctx);
  }

  if (value.do) {
    return compileDoDirective(value.do.getBody(), ctx);
  }

  if (value.let) {
    return compileLetDirective(value.let.getBody(), ctx);
  }

  if (value.match) {
    return compileMatchDirective(value.match.getBody(), ctx);
  }

  if (value.while) {
    return compileWhileDirective(value.while.getBody(), ctx);
  }

  if (value.loop) {
    return compileLoopDirective(value.loop.getBody(), ctx);
  }

  if (value.try) {
    return compileTryDirective(value, ctx);
  }

  if (value.export) {
    return compileExportDirective(value.export.getBody(), ctx);
  }

  if (value.else) {
    return compileExpression(value.else.getBody(), ctx);
  }

  if (value.import) {
    return '';
  }

  if (value.html) {
    return compileHtmlDirective(value.html.getBody(), ctx);
  }

  if (value.test) {
    return compileTestDirective(value.test.getBody(), value, ctx);
  }

  if (value.signal) {
    return compileSignalDirective(value.signal.getBody(), ctx);
  }

  if (value.computed) {
    return compileComputedDirective(value.computed.getBody(), ctx);
  }

  if (value.style) {
    return compileStyleDirective(value.style.getBody(), ctx);
  }

  if (value.expect) {
    return compileExpectDirective(value.expect.getBody(), ctx);
  }

  if (value.before_all) {
    return compileBeforeAllDirective(value.before_all.getBody(), { ...ctx, currentValue: value });
  }

  if (value.before_each) {
    return compileBeforeEachDirective(value.before_each.getBody(), { ...ctx, currentValue: value });
  }

  if (value.after_all) {
    return compileAfterAllDirective(value.after_all.getBody(), { ...ctx, currentValue: value });
  }

  if (value.after_each) {
    return compileAfterEachDirective(value.after_each.getBody(), { ...ctx, currentValue: value });
  }

  if (value.mount) {
    return compileMountDirective(value.mount.getBody(), ctx);
  }

  if (value.click) {
    return compileClickDirective(value.click.getBody(), ctx);
  }

  throw new Error(`Unsupported directive object: ${Object.keys(value).join(', ')}`);
}

function compileBlockBody(token, ctx) {
  // Compile a `=>` block-body callable: comma-separated stmts, last is return.
  const name = token.getName();
  const rawArgs = token.value && token.value.args;
  const args = rawArgs ? rawArgs.map(a => compileToken(a, ctx)).join(', ') : '';
  const rawBody = token.value && token.value.body ? token.value.body : [];
  const declConst = ctx.exportDefinitions ? 'export const' : 'const';

  // Split raw body tokens by COMMA
  const stmts = [];
  let cur = [];
  for (const tok of rawBody) {
    if (tok && tok.type === COMMA) { if (cur.length) stmts.push(cur); cur = []; }
    else cur.push(tok);
  }
  if (cur.length) stmts.push(cur);

  // Track C: collect signal defs from block body so @on signal-updater detection works inside
  const localSignalVars = collectSignalBindings(stmts);
  const mergedSignalVars = new Set([...(ctx.signalVars || []), ...localSignalVars]);
  const localCtx = { ...ctx, exportDefinitions: false, autoPrintExpressions: false, signalVars: mergedSignalVars };
  const head = stmts.slice(0, -1).map(stmt => {
    if (stmt.length === 1 && stmt[0].isCallable && stmt[0].getName()) {
      return `${compileDefinition(stmt[0], true, localCtx)}`;
    }
    return `${compileStatement(stmt, localCtx, -1)}`;
  });
  const tail = stmts[stmts.length - 1];
  const ret = tail
    ? (tail.length === 1 && tail[0].isObject
      ? `return ${compileToken(tail[0], localCtx)};`
      : `return ${compileStatement(tail, localCtx, -1).replace(/;\s*$/, '')};`)
    : 'return undefined;';

  const body = [...head, ret].join('\n  ');
  return `${declConst} ${name} = (${args}) => {\n  ${body}\n}`;
}

function compileDefinition(token, asStatement = false, ctx = { signalVars: new Set() }) {
  const name = token.getName();
  const [head] = token.getBody();
  const declConst = ctx.exportDefinitions ? 'export const' : 'const';
  const declLet = ctx.exportDefinitions ? 'export let' : 'let';

  if (!head) return asStatement ? `${declConst} ${name} = undefined;` : `${declConst} ${name} = undefined`;

  // Block-body callable: `Name [args] => comma-chain.`
  if (token.value && token.value.blockBody) {
    const out = compileBlockBody(token, ctx);
    return asStatement ? `${out};` : out;
  }

  if (head.isCallable) {
    const args = head.hasArgs ? head.getArgs().map(arg => compileToken(arg, ctx)).join(', ') : '';
    const body = head.hasBody ? compileExpression(head.getBody(), ctx) : 'undefined';
    const out = `${declConst} ${name} = (${args}) => (${body})`;
    return asStatement ? `${out};` : out;
  }

  if (head.isObject && head.value && head.value.signal) {
    if (head.value.prop) {
      const propArgs = head.value.prop.getBody()[0].getBody();
      const propName = compileToken(propArgs[0], ctx);
      const fallback = compileToken(propArgs[1], ctx);
      const out = `${declConst} ${name} = $.signal($.prop(host, ${propName}, ${fallback}), ${JSON.stringify(name)})`;
      return asStatement ? `${out};` : out;
    }
    const out = `${declConst} ${name} = $.signal(${compileExpression(head.value.signal.getBody(), ctx)}, ${JSON.stringify(name)})`;
    return asStatement ? `${out};` : out;
  }

  if (head.isObject && head.value && head.value.computed) {
    const out = `${declConst} ${name} = $.computed(() => ${compileExpression(head.value.computed.getBody(), ctx)})`;
    return asStatement ? `${out};` : out;
  }

  if (head.isObject && head.value && head.value.on && !head.value.prop) {
    const out = `${declConst} ${name} = ${compileDirectiveObject(head, ctx)}`;
    return asStatement ? `${out};` : out;
  }

  const out = `${declLet} ${name} = ${compileExpression(token.getBody(), ctx)}`;
  return asStatement ? `${out};` : out;
}

function compileStatement(tokens, ctx, statementIndex) {
  if (!tokens.length) return '';

  if (tokens.length >= 4 && tokens[0].value === 'import' && tokens[2].value === 'from') {
    return '';
  }

  const shouldPrint = ctx.printStatements && ctx.printStatements.has(statementIndex);
  const autoPrint = !!ctx.autoPrintExpressions;

  if (tokens.length === 1) {
    const [token] = tokens;

    if (token.isObject && token.value && token.value.import) {
      return '';
    }

    if (token.isCallable && token.getName()) {
      return `${compileDefinition(token, false, ctx)};`;
    }

    if (token.isObject) {
      const out = compileDirectiveObject(token, ctx);
      if (!out) return '';
      return `${out};`;
    }

    const out = compileToken(token, ctx);
    if (shouldPrint || autoPrint) return `console.log(${out});`;
    return `${out};`;
  }

  const hasOperator = tokens.some(token => OPERATOR.get(token.type));
  const looksLikeCall = tokens.length === 2
    && tokens[0].isLiteral
    && tokens[1].type === BLOCK
    && tokens[1].hasArgs
    && !tokens[1].hasBody;

  if (!hasOperator && !looksLikeCall) {
    const exprs = tokens.map(token => compileToken(token, ctx)).join(', ');
    if (shouldPrint || autoPrint) return `console.log(${exprs});`;
    return `${exprs};`;
  }

  const out = compileExpression(tokens, ctx);
  if (shouldPrint || autoPrint) return `console.log(${out});`;
  return `${out};`;
}

function collectShadowFlag(statements) {
  return statements.some(tokens => {
    if (tokens.length !== 1) return false;
    const [token] = tokens;
    return token.isObject && token.value && token.value.shadow;
  });
}

export function collectSignalBindings(statements) {
  const signalVars = new Set();

  statements.forEach(tokens => {
    if (tokens.length !== 1) return;

    const [token] = tokens;
    if (!token.isCallable || !token.getName()) return;

    const [head] = token.getBody();
    if (head && head.isObject && head.value && head.value.signal) {
      signalVars.add(token.getName());
    }
  });

  return signalVars;
}

function collectAtomicClasses(statements) {
  const classes = new Set();

  function pushClassAttr(value) {
    if (typeof value !== 'string') return;
    value.split(/\s+/).filter(Boolean).forEach(name => classes.add(name));
  }

  function walkTagNode(node) {
    if (!node || typeof node !== 'object') return;
    pushClassAttr(node.attrs && node.attrs.class);
    (node.children || []).forEach(child => {
      if (child && typeof child === 'object' && !Array.isArray(child) && child.name) {
        walkTagNode(child);
      }
    });
  }

  function walkToken(token) {
    if (!token || typeof token !== 'object') return;

    if (token.isTag && token.value) {
      walkTagNode(token.value);
    }

    if (token.value && Array.isArray(token.value.args) && typeof token.getArgs === 'function') {
      token.getArgs().forEach(walkToken);
    }

    if (token.value && Array.isArray(token.value.body) && typeof token.getBody === 'function') {
      token.getBody().forEach(walkToken);
    }

    if (token.isObject && token.value) {
      Object.values(token.value).forEach(value => {
        if (value && value.getBody) value.getBody().forEach(walkToken);
      });
    }

    if (token.type === RANGE && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }

    if (token.isString && Array.isArray(token.value)) {
      token.value.forEach(walkToken);
    }
  }

  statements.forEach(tokens => tokens.forEach(walkToken));
  return classes;
}

function collectImportSources(statements) {
  const sources = [];

  statements.forEach(tokens => {
    if (tokens.length !== 1) return;

    const [token] = tokens;
    if (!token || !token.isObject || !token.value || !token.value.import || !token.value.from) return;

    const fromBody = token.value.from.getBody ? token.value.from.getBody() : [];
    const source = fromBody[0] && typeof fromBody[0].value === 'string' ? fromBody[0].value : null;
    if (source) sources.push(source);
  });

  return sources;
}

function stripModuleExports(line) {
  if (!line.startsWith('export ')) return line;
  if (/^export\s+\{.*\}\s*;?$/.test(line)) return '';
  return line.replace(/^export\s+/, '');
}

function splitImportsAndBody(compiled) {
  const imports = [];
  const body = [];

  String(compiled || '').split('\n').forEach(line => {
    if (!line.trim()) return;
    if (line.startsWith('// Generated by 10x compiler')) return;
    if (line.startsWith('import ')) {
      imports.push(line);
      return;
    }

    const normalized = stripModuleExports(line);
    if (!normalized.trim()) return;
    body.push(normalized);
  });

  return { imports, body };
}

export function compile(source, options = {}) {
  const normalized = String(source || '').replace(/\r\n/g, '\n');
  const ast = Parser.getAST(normalized, 'parse');
  const statements = splitStatements(ast);
  const hasShadow = collectShadowFlag(statements);
  const needsDom = collectNeedsDom(statements);
  const needsTest = collectNeedsTest(statements);
  const hmrEnabled = options.hmr === true && options.module !== false;
  const runtimePath = options.runtimePath || './runtime';
  const testPath = options.testPath || '10x/testing';
  const { imports, globals } = collectImportSpecs(statements, runtimePath);
  const ctx = {
    signalVars: collectSignalBindings(statements),
    shadow: hasShadow,
    hmr: hmrEnabled,
    exportDefinitions: options.module !== false && !hasShadow && options.exportAll !== false,
    printStatements: collectPrintStatements(normalized),
    autoPrintExpressions: options.autoPrintExpressions !== false && options.module !== false && !hasShadow,
  };
  const proseComments = collectProseComments(normalized, statements.length);
  const lines = statements.reduce((prev, tokens, index) => {
    const compiled = compileStatement(tokens, ctx, index);
    const comments = (proseComments[index] || []).map(line => `// ${line}`);

    if (comments.length) prev.push(...comments);
    if (compiled) prev.push(compiled);
    return prev;
  }, []);

  const atomicCss = options.atomicCss === false ? '' : generateAtomicCss(collectAtomicClasses(statements));
  if (atomicCss) {
    const hostArg = hasShadow ? 'host, ' : '';
    lines.unshift(`$.style(${hostArg}${JSON.stringify(atomicCss)});`);
  }

  const requiresRuntime = lines.some(line => line.includes('$.'));
  const usesRange = lines.some(line => line.includes('range('));
  const usesTest = lines.some(line => /^(test|beforeAll|beforeEach|afterAll|afterEach|expect|mount|click)\(/.test(line));
  const output = [];

  if (options.module !== false) {
    output.push('// Generated by 10x compiler (experimental AST backend)');
    if (usesRange && !imports.some(x => x.source === getPreludePath(runtimePath) && x.specifiers.includes('range'))) {
      imports.push({ source: getPreludePath(runtimePath), specifiers: ['range'] });
    }
    imports.forEach(({ source: importSource, specifiers }) => {
      output.push(`import { ${specifiers.join(', ')} } from ${JSON.stringify(importSource)};`);
    });
    globals.forEach(({ source: globalSource, specifiers }) => {
      output.push(`const { ${specifiers.join(', ')} } = ${globalSource};`);
    });
    if (requiresRuntime) {
      const importPath = needsDom ? runtimePath : getCoreRuntimePath(runtimePath);
      output.push(`import * as $ from ${JSON.stringify(importPath)};`);
    }
    if (usesTest) {
      output.push(`import { test, describe, beforeAll, beforeEach, afterAll, afterEach, expect } from 'bun:test';`);
      output.push(`import { mount, click } from ${JSON.stringify(testPath)};`);
    }
  }

  if (hasShadow) {
    output.push('export function setup(host) {');
    output.push(...lines.map(l => '  ' + l));
    output.push('}');
  } else {
    output.push(...lines);
  }
  if (hmrEnabled) output.push(...compileHmrFooter());

  return output.join('\n');
}

export function compileBundle(entryPath, options = {}) {
  const readFile = options.readFile;
  const resolveModule = options.resolveModule;

  if (typeof readFile !== 'function') {
    throw new Error('compileBundle requires options.readFile(path)');
  }

  if (typeof resolveModule !== 'function') {
    throw new Error('compileBundle requires options.resolveModule(specifier, importerPath)');
  }

  const runtimePath = options.runtimePath || './runtime';
  const shouldBundleImport = typeof options.shouldBundleImport === 'function'
    ? options.shouldBundleImport
    : specifier => specifier.startsWith('.');
  const order = [];
  const seen = new Set();
  const active = new Set();
  const modules = new Map();

  function visit(modulePath) {
    if (seen.has(modulePath)) return;
    if (active.has(modulePath)) {
      throw new Error(`Circular local import while bundling: ${modulePath}`);
    }

    active.add(modulePath);
    const source = String(readFile(modulePath) || '');
    const normalized = source.replace(/\r\n/g, '\n');
    const ast = Parser.getAST(normalized, 'parse');
    const statements = splitStatements(ast);
    const deps = collectImportSources(statements)
      .filter(specifier => shouldBundleImport(specifier, modulePath))
      .map(specifier => resolveModule(specifier, modulePath));

    deps.forEach(visit);
    active.delete(modulePath);
    seen.add(modulePath);

    const compiled = compile(normalized, {
      runtimePath,
      module: true,
      autoPrintExpressions: options.autoPrintExpressions,
    });
    modules.set(modulePath, splitImportsAndBody(compiled));
    order.push(modulePath);
  }

  visit(entryPath);

  const importSet = new Set();
  const body = ['// Generated by 10x compiler bundle (experimental resolver backend)'];

  order.forEach(modulePath => {
    const chunk = modules.get(modulePath);
    if (!chunk) return;
    chunk.imports.forEach(line => importSet.add(line));
  });

  if (importSet.size) {
    body.push(...Array.from(importSet));
    body.push('');
  }

  order.forEach(modulePath => {
    const chunk = modules.get(modulePath);
    if (!chunk) return;
    body.push(`// Module: ${modulePath}`);
    body.push(...chunk.body);
    body.push('');
  });

  while (body.length && !body[body.length - 1].trim()) body.pop();
  return body.join('\n');
}

export default compile;
