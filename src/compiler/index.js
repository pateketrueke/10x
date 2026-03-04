import Parser from '../lib/tree/parser';
import {
  BLOCK, COMMA, DIV, DOT, EOL, EQUAL, GREATER, GREATER_EQ, LESS, LESS_EQ, LIKE, MINUS, MOD, MUL, NOT_EQ, EXACT_EQ, OR, PIPE, PLUS,
} from '../lib/tree/symbols';

const OPERATOR = new Map([
  [PLUS, '+'],
  [MINUS, '-'],
  [MUL, '*'],
  [DIV, '/'],
  [MOD, '%'],
  [EQUAL, '='],
  [LESS, '<'],
  [LESS_EQ, '<='],
  [GREATER, '>'],
  [GREATER_EQ, '>='],
  [NOT_EQ, '!='],
  [EXACT_EQ, '==='],
  [OR, '|'],
  [LIKE, '~'],
  [PIPE, '|>'],
]);

function splitStatements(tokens) {
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

function quote(value) {
  return JSON.stringify(String(value));
}

function compileTag(node) {
  const attrs = Object.entries(node.attrs || {}).map(([key, value]) => {
    if (value === true) return ` ${key}`;
    if (value && typeof value === 'object' && typeof value.expr === 'string') {
      return ` ${key}="\${Runtime.read(${value.expr.trim()})}"`;
    }

    return ` ${key}=${quote(String(value))}`;
  }).join('');

  if (node.selfClosing) {
    return `<${node.name}${attrs} />`;
  }

  const children = (node.children || []).map(child => {
    if (typeof child === 'string') return child;
    if (child && typeof child.expr === 'string') return `\${Runtime.read(${child.expr.trim()})}`;
    return compileTag(child);
  }).join('');

  return `<${node.name}${attrs}>${children}</${node.name}>`;
}

function compileArgs(args, ctx) {
  if (!Array.isArray(args) || !args.length) return '';
  return args.filter(token => token.type !== COMMA).map(token => compileToken(token, ctx)).join(', ');
}

function compileLambda(token, ctx) {
  const args = token.hasArgs ? token.getArgs().map(arg => compileToken(arg, ctx)).join(', ') : '';
  const body = token.hasBody ? compileExpression(token.getBody(), ctx) : 'undefined';
  return `(${args}) => (${body})`;
}

function compileToken(token, ctx = { signalVars: new Set() }) {
  if (token.isTag) {
    return `\`${compileTag(token.value)}\``;
  }

  if (token.isCallable && !token.getName()) {
    return compileLambda(token, ctx);
  }

  if (token.isNumber) {
    return token.value;
  }

  if (token.isString) {
    return quote(token.value);
  }

  if (token.isLiteral) {
    if (token.value === null) return 'null';
    if (token.value === true) return 'true';
    if (token.value === false) return 'false';
    if (typeof token.value === 'string') {
      if (ctx.signalVars.has(token.value)) return `Runtime.read(${token.value})`;
      return token.value;
    }
    return JSON.stringify(token.value);
  }

  if (token.type === BLOCK && token.hasArgs && !token.hasBody) {
    return `(${compileArgs(token.getArgs(), ctx)})`;
  }

  const op = OPERATOR.get(token.type);
  if (op) return op;

  throw new Error(`Unsupported token in compiler: ${String(token.type)}`);
}

function compileExpression(tokens, ctx = { signalVars: new Set() }) {
  const out = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];
    const prev = tokens[i - 1];

    if (
      token.type === BLOCK
      && token.hasArgs
      && !token.hasBody
      && prev
      && (prev.isLiteral || prev.isTag || (prev.type === BLOCK && prev.hasArgs))
    ) {
      out[out.length - 1] = `${out[out.length - 1]}(${compileArgs(token.getArgs(), ctx)})`;
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
  if (token && token.type === BLOCK && token.hasBody) {
    const [first] = token.getBody();
    if (first && first.isCallable && first.getName()) {
      if (ctx.signalVars.has(first.getName())) {
        return `() => { ${first.getName()}.set(${compileExpression(first.getBody(), ctx)}); }`;
      }

      return `() => { ${compileDefinition(first, true, ctx)} }`;
    }
  }

  return `() => (${compileToken(token, ctx)})`;
}

function compileSignalDirective(body, ctx) {
  return `Runtime.signal(${compileExpression(body, ctx)})`;
}

function compileHtmlDirective(body) {
  const [template] = body;
  return `Runtime.html(() => ${compileToken(template)})`;
}

function compileRenderDirective(body, value, ctx) {
  const selector = body.length ? compileExpression(body, ctx) : 'undefined';
  const htmlExpr = value.html instanceof Object ? compileHtmlDirective(value.html.getBody()) : 'undefined';
  return `Runtime.render(${selector}, ${htmlExpr})`;
}

function compileOnDirective(body, ctx) {
  const [eventToken, selectorToken, handlerToken] = body;
  const eventName = compileToken(eventToken, ctx);
  const selector = compileToken(selectorToken, ctx);
  const handler = compileHandler(handlerToken, ctx);
  return `Runtime.on(${eventName}, ${selector}, ${handler})`;
}

function compileDirectiveObject(token, ctx) {
  const { value } = token;

  if (value.render) {
    return compileRenderDirective(value.render.getBody(), value, ctx);
  }

  if (value.on) {
    return compileOnDirective(value.on.getBody(), ctx);
  }

  if (value.html) {
    return compileHtmlDirective(value.html.getBody());
  }

  if (value.signal) {
    return compileSignalDirective(value.signal.getBody(), ctx);
  }

  throw new Error(`Unsupported directive object: ${Object.keys(value).join(', ')}`);
}

function compileDefinition(token, asStatement = false, ctx = { signalVars: new Set() }) {
  const name = token.getName();
  const [head] = token.getBody();

  if (!head) return asStatement ? `const ${name} = undefined;` : `const ${name} = undefined`;

  if (head.isCallable) {
    const args = head.hasArgs ? head.getArgs().map(arg => compileToken(arg, ctx)).join(', ') : '';
    const body = head.hasBody ? compileExpression(head.getBody(), ctx) : 'undefined';
    const out = `const ${name} = (${args}) => (${body})`;
    return asStatement ? `${out};` : out;
  }

  if (head.isObject && head.value && head.value.signal) {
    const out = `const ${name} = ${compileSignalDirective(head.value.signal.getBody(), ctx)}`;
    return asStatement ? `${out};` : out;
  }

  const out = `let ${name} = ${compileExpression(token.getBody(), ctx)}`;
  return asStatement ? `${out};` : out;
}

function compileStatement(tokens, ctx) {
  if (!tokens.length) return '';

  if (tokens.length === 1) {
    const [token] = tokens;

    if (token.isCallable && token.getName()) {
      return `${compileDefinition(token, false, ctx)};`;
    }

    if (token.isObject) {
      return `${compileDirectiveObject(token, ctx)};`;
    }

    return `${compileToken(token, ctx)};`;
  }

  return `${compileExpression(tokens, ctx)};`;
}

function collectSignalBindings(statements) {
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

export function compile(source, options = {}) {
  const normalized = String(source || '').replace(/\r\n/g, '\n');
  const ast = Parser.getAST(normalized, 'parse');
  const statements = splitStatements(ast);
  const ctx = { signalVars: collectSignalBindings(statements) };
  const lines = statements.map(tokens => compileStatement(tokens, ctx)).filter(Boolean);

  const requiresRuntime = lines.some(line => line.startsWith('Runtime.'));
  const output = [];

  if (options.module !== false) {
    output.push('// Generated by 10x compiler (experimental AST backend)');
    if (requiresRuntime) {
      output.push("import * as Runtime from '../runtime/index.js';");
    }
  }

  output.push(...lines);
  return output.join('\n');
}

export default compile;
