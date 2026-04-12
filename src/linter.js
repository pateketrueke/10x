import Parser from './lib/tree/parser.js';
import { splitStatements, normalizeDirectiveArgs, collectSignalBindings } from './compiler/index.js';

function walk(tokens, visitor) {
  if (!Array.isArray(tokens)) return;
  for (const token of tokens) {
    if (!token || typeof token !== 'object') continue;
    visitor(token);
    if (token.isCallable && token.hasBody) walk(token.getBody(), visitor);
    if (token.isObject && token.value) {
      for (const val of Object.values(token.value)) {
        if (val && typeof val.getBody === 'function') walk(val.getBody(), visitor);
      }
    }
    if (token.isTag && token.value) {
      const node = token.value;
      if (node.children) {
        walk(node.children.filter(c => c && typeof c === 'object' && !Array.isArray(c)), visitor);
      }
    }
  }
}

function tokenLine(token) {
  const info = token && token.tokenInfo;
  return info ? (info.line ?? 0) : 0;
}

function tokenCol(token) {
  const info = token && token.tokenInfo;
  return info ? (info.col ?? 0) : 0;
}

function collectIdentifiers(token, ids = new Set()) {
  if (!token || typeof token !== 'object') return ids;
  if (token.isSymbol && typeof token.value === 'string') {
    ids.add(token.value);
  }
  if (token.isCallable && token.hasBody) {
    const args = token.value && Array.isArray(token.value.args) ? token.value.args : [];
    const argNames = new Set(args.map(a => a && typeof a.value === 'string' ? a.value : null).filter(Boolean));
    for (const t of token.getBody()) {
      if (t && typeof t.value === 'string' && !argNames.has(t.value)) {
        collectIdentifiers(t, ids);
      }
    }
  }
  if (token.isObject && token.value) {
    for (const val of Object.values(token.value)) {
      if (val && typeof val.getBody === 'function') collectIdentifiers(val, ids);
    }
  }
  if (token.isTag && token.value && token.value.attrs) {
    for (const v of Object.values(token.value.attrs)) {
      if (v && typeof v.expr === 'string') {
        const matches = v.expr.match(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g) || [];
        matches.forEach(m => ids.add(m));
      }
    }
  }
  return ids;
}

function countStatements(tokens) {
  if (!Array.isArray(tokens)) return 0;
  let count = 0;
  for (const t of tokens) {
    if (!t || typeof t !== 'object') continue;
    count++;
  }
  return count;
}

export function lintCode(source, ast) {
  const warnings = [];
  const tokens = ast || Parser.getAST(source, 'parse');
  const statements = splitStatements(tokens);
  const signalVars = collectSignalBindings(statements);

  // Track which statement-level tokens are callable (have names) to detect bare directives
  const namedCallableHeads = new Set();
  for (const stmt of statements) {
    if (stmt.length === 1 && stmt[0].isCallable && stmt[0].getName()) {
      const [head] = stmt[0].getBody();
      if (head) namedCallableHeads.add(head);
    }
  }

  walk(tokens, token => {
    // on-arrow-updater: @on signal -> expr (deprecated, use @on signal = expr)
    if (token.isObject && token.value && token.value.on) {
      const args = normalizeDirectiveArgs(token.value.on.getBody());
      if (args.length === 1 && args[0] && args[0].isCallable) {
        const callable = args[0];
        // Arrow-form (count -> body) has value.args; assignment-form (count = body) has no args.
        const arrowArgs = callable.value && Array.isArray(callable.value.args) ? callable.value.args : [];
        const hasArrowArgs = arrowArgs.length > 0;
        // Arrow-form: signal name is the first arg's value (anonymous lambda, getName() is undefined)
        const name = hasArrowArgs
          ? (arrowArgs[0] && typeof arrowArgs[0].value === 'string' ? arrowArgs[0].value : null)
          : callable.getName();
        if (hasArrowArgs && name && signalVars.has(name)) {
          warnings.push({
            line: tokenLine(token),
            col: tokenCol(token),
            code: 'on-arrow-updater',
            message: '`@on signal -> expr` is deprecated — use `@on signal = expr`',
          });
        }
        // on-handler-target: handler must reference its signal
        if (name && signalVars.has(name)) {
          const ids = collectIdentifiers(callable);
          if (!ids.has(name)) {
            warnings.push({
              line: tokenLine(token),
              col: tokenCol(token),
              code: 'on-handler-target',
              severity: 'error',
              message: `\`@on ${name} -> ...\` handler does not reference signal "${name}"`,
            });
          }
        }
      }
    }

    // inline-lambda-in-attr / inline-directive-in-attr
    if (token.isTag && token.value && token.value.attrs) {
      for (const [k, v] of Object.entries(token.value.attrs)) {
        if (!v || typeof v !== 'object' || typeof v.expr !== 'string') continue;
        const expr = v.expr.trim();
        if (/^@[a-z]/.test(expr)) {
          warnings.push({
            line: tokenLine(token),
            col: tokenCol(token),
            code: 'inline-directive-in-attr',
            message: `Attribute "${k}" uses an inline directive — declare it before the markup`,
          });
        } else if (/^[a-zA-Z_$][a-zA-Z0-9_$,\s]*\s*->/.test(expr)) {
          warnings.push({
            line: tokenLine(token),
            col: tokenCol(token),
            code: 'inline-lambda-in-attr',
            message: `Attribute "${k}" uses an inline lambda — declare the handler before the markup`,
          });
        }
      }
    }

    // render-without-html: @render without @html
    if (token.isObject && token.value && token.value.render && !token.value.html) {
      warnings.push({
        line: tokenLine(token),
        col: tokenCol(token),
        code: 'render-without-html',
        message: '`@render` without `@html` — add `@html <expr>` to specify the view',
      });
    }

    // signal-without-binding: bare @signal not assigned to a name
    if (token.isObject && token.value && token.value.signal && !namedCallableHeads.has(token)) {
      warnings.push({
        line: tokenLine(token),
        col: tokenCol(token),
        code: 'signal-without-binding',
        message: '`@signal` without a binding name — assign it: `name = @signal <value>`',
      });
    }

    // block-fn-complexity: => bodies with too many statements
    if (token.isCallable && token.hasBody && token.value && token.value.type === 'block') {
      const body = token.getBody();
      const stmtCount = countStatements(body);
      if (stmtCount > 5) {
        warnings.push({
          line: tokenLine(token),
          col: tokenCol(token),
          code: 'block-fn-complexity',
          severity: 'hint',
          message: `Block function has ${stmtCount} statements — consider extracting helper functions`,
        });
      }
    }
  });

  return warnings;
}
