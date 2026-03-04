import { isVoidTag } from './void-tags';

function fail(message) {
  throw new Error(message);
}

function isPlain(value) {
  return value && Object.prototype.toString.call(value) === '[object Object]';
}

function skipSpaces(input, state) {
  while (state.i < input.length && /\s/.test(input[state.i])) state.i++;
}

function consumeOptionalClosingTag(input, state, name) {
  let offset = state.i;

  while (offset < input.length && /\s/.test(input[offset])) offset++;
  if (input[offset] !== '<' || input[offset + 1] !== '/') return;
  offset += 2;

  const start = offset;
  while (offset < input.length && /[A-Za-z0-9:_-]/.test(input[offset])) offset++;
  if (offset === start) return;

  const closeName = input.slice(start, offset);
  if (closeName.toLowerCase() !== String(name || '').toLowerCase()) return;

  while (offset < input.length && /\s/.test(input[offset])) offset++;
  if (input[offset] !== '>') return;

  state.i = offset + 1;
}

function readName(input, state) {
  const start = state.i;

  while (state.i < input.length && /[A-Za-z0-9:_-]/.test(input[state.i])) state.i++;
  if (state.i === start) fail('Invalid tag name');

  return input.slice(start, state.i);
}

function readQuoted(input, state) {
  const quote = input[state.i++];
  const start = state.i;

  while (state.i < input.length && input[state.i] !== quote) state.i++;
  if (state.i >= input.length) fail('Unterminated attribute string');

  const value = input.slice(start, state.i);
  state.i++;
  return value;
}

function readUnquoted(input, state) {
  const start = state.i;

  while (state.i < input.length && !/[\s/>]/.test(input[state.i])) state.i++;
  return input.slice(start, state.i);
}

function parseAttrs(input, state) {
  const attrs = {};
  const spreads = [];

  while (state.i < input.length) {
    skipSpaces(input, state);

    if (input[state.i] === '/' || input[state.i] === '>') break;

    if (input[state.i] === '{') {
      const spreadExpr = readExpr(input, state);

      if (!spreadExpr.expr.startsWith('...')) fail('Only spread expressions are allowed in tag attrs');

      const source = spreadExpr.expr.slice(3).trim();
      if (!source) fail('Missing source after spread operator in tag attrs');

      spreads.push({ expr: source });
      continue;
    }

    const key = readName(input, state);

    skipSpaces(input, state);

    if (input[state.i] === '=') {
      state.i++;
      skipSpaces(input, state);

      if (input[state.i] === '{') {
        attrs[key] = readExpr(input, state);
      } else if (input[state.i] === '"' || input[state.i] === '\'') {
        attrs[key] = readQuoted(input, state);
      } else {
        attrs[key] = readUnquoted(input, state);
      }
    } else {
      attrs[key] = true;
    }
  }

  return { attrs, spreads };
}

function parseText(input, state) {
  const start = state.i;

  while (state.i < input.length && input[state.i] !== '<' && input[state.i] !== '{') state.i++;
  return input.slice(start, state.i);
}

function readExpr(input, state) {
  if (input[state.i] !== '{') fail('Expecting `{`');

  state.i++;
  let depth = 1;
  let buffer = '';
  let inQuote = null;

  while (state.i < input.length && depth > 0) {
    const cur = input[state.i++];

    if (inQuote) {
      buffer += cur;
      if (cur === inQuote && input[state.i - 2] !== '\\') inQuote = null;
      continue;
    }

    if (cur === '"' || cur === '\'') {
      inQuote = cur;
      buffer += cur;
      continue;
    }

    if (cur === '{') {
      depth++;
      buffer += cur;
      continue;
    }

    if (cur === '}') {
      depth--;
      if (depth > 0) buffer += cur;
      continue;
    }

    buffer += cur;
  }

  if (depth !== 0) fail('Unterminated expression in tag');

  const source = buffer.trim();

  if (source === '@render') fail('Missing expression after @render');
  if (source.startsWith('@render ')) {
    return { expr: source.slice(8).trim() };
  }

  return { expr: source };
}

function parseNode(input, state) {
  if (input[state.i] !== '<') fail('Expecting `<`');

  state.i++;
  const name = readName(input, state);
  const { attrs, spreads } = parseAttrs(input, state);

  let selfClosing = false;

  if (input[state.i] === '/') {
    selfClosing = true;
    state.i++;
  }

  if (input[state.i] !== '>') fail('Expecting `>`');
  state.i++;

  const node = {
    name,
    attrs,
    children: [],
    selfClosing,
  };

  if (spreads.length) node.spreads = spreads;

  if (selfClosing) return node;
  if (isVoidTag(name)) {
    node.selfClosing = true;
    consumeOptionalClosingTag(input, state, name);
    return node;
  }

  while (state.i < input.length) {
    if (input[state.i] === '<' && input[state.i + 1] === '/') {
      state.i += 2;
      const closeName = readName(input, state);

      if (closeName !== name) fail(`Mismatched closing tag: </${closeName}>`);
      skipSpaces(input, state);

      if (input[state.i] !== '>') fail('Expecting `>`');
      state.i++;
      return node;
    }

    if (input[state.i] === '<') {
      node.children.push(parseNode(input, state));
      continue;
    }

    if (input[state.i] === '{') {
      node.children.push(readExpr(input, state));
      continue;
    }

    const text = parseText(input, state);

    if (text.length) {
      node.children.push(text);
    }
  }

  fail(`Missing closing tag for <${name}>`);
}

function escapeText(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

export function parseTag(input) {
  if (!input || typeof input !== 'string') fail('Invalid tag input');

  const source = input.trim();
  const state = { i: 0 };
  const node = parseNode(source, state);

  skipSpaces(source, state);
  if (state.i !== source.length) fail('Unexpected trailing content after tag');

  return node;
}

export function renderTag(node) {
  if (!node || typeof node.name !== 'string') fail('Invalid tag value');

  const attrs = Object.keys(node.attrs || {}).map(key => {
    const value = node.attrs[key];
    if (value === true) return key;
    return `${key}="${escapeAttr(String(value))}"`;
  }).join(' ');

  const open = attrs.length ? `<${node.name} ${attrs}` : `<${node.name}`;
  const children = (node.children || []).map(child => {
    if (typeof child === 'string') return escapeText(child);
    if (typeof child === 'number' || typeof child === 'boolean') return escapeText(String(child));
    if (child && typeof child.expr === 'string') return '';
    return renderTag(child);
  }).join('');

  if (node.selfClosing && !children.length) {
    return `${open} />`;
  }

  return `${open}>${children}</${node.name}>`;
}

function asChild(value) {
  if (value === null || typeof value === 'undefined') return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (isPlain(value) && typeof value.name === 'string') return value;
  return String(value);
}

export function composeTag(node, args) {
  const next = {
    name: node.name,
    attrs: { ...(node.attrs || {}) },
    children: [...(node.children || [])],
    selfClosing: false,
  };

  let offset = 0;

  if (args[0] && isPlain(args[0]) && !Array.isArray(args[0]) && !('name' in args[0])) {
    Object.assign(next.attrs, args[0]);
    offset = 1;
  }

  for (let i = offset; i < args.length; i++) {
    const child = asChild(args[i]);
    if (child !== null) next.children.push(child);
  }

  return next;
}
