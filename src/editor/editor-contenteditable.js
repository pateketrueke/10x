/**
 * <x-editor> — scoped contenteditable demo editor.
 *
 * Architecture:
 *   - Immediate syntax highlighting on every input
 *   - Statement-ID anchors derived from Parser split chunks
 *   - Lazy non-blocking evaluation in a Worker
 *   - Result sync by statementId + requestId (stale response safe)
 *   - Minimal offset-based caret restoration across full re-renders
 *
 * Public API:
 *   el.value          — get/set source text
 *   el.addEventListener('change', e => e.detail.results)
 *   el.addEventListener('error',  e => e.detail.error)
 */
import { Parser, Env, execute, applyAdapter } from '../main.js';
import { createBrowserAdapter } from '../adapters/browser/index.js';
import {
  SYMBOL_NAME,
  inferRuntimeType,
  formatRuntimeValue,
  formatRuntimeError,
  normalizeUnitLiterals,
  unitLiteralDisplay,
  hasUnitSuffix,
  isFunctionDefinitionSource,
  extractInlineExpressions,
  bootstrapEnv,
} from './editor-runtime-shared.js';

applyAdapter(createBrowserAdapter());

// ─── Token → CSS class mapping (mirrors src/util.js colorize) ────────────────

function tokenClass(token) {
  const n = SYMBOL_NAME(token.type);
  switch (n) {
    case 'COMMENT': case 'COMMENT_MULTI': return 'xt-comment';
    case 'NUMBER':  return 'xt-number';
    case 'STRING':  return 'xt-string';
    case 'TAG':     return 'xt-tag';
    case 'REGEX':   return 'xt-regex';
    case 'SYMBOL':  return 'xt-symbol';
    case 'LITERAL': return 'xt-literal';
    case 'BLOCK':   return 'xt-op';
    case 'MINUS': case 'PLUS': case 'MUL': case 'DIV': case 'MOD':
    case 'EQUAL': case 'NOT': case 'LIKE': case 'PIPE': case 'OR':
    case 'LESS': case 'LESS_EQ': case 'GREATER': case 'GREATER_EQ':
    case 'EXACT_EQ': case 'NOT_EQ': case 'SOME': case 'EVERY':
      return 'xt-op';
    case 'TEXT':       return 'xt-text';
    case 'HEADING':    return 'xt-heading';
    case 'BOLD':       return 'xt-bold';
    case 'ITALIC':     return 'xt-italic';
    case 'CODE':       return 'xt-code';
    case 'BLOCKQUOTE': case 'OL_ITEM': case 'UL_ITEM': return 'xt-prose';
    case 'COMMA':      return 'xt-punct';
    default: return '';
  }
}

function tokenTooltipLabel(token) {
  const n = SYMBOL_NAME(token?.type);
  if (!n) return '';

  if (n === 'TEXT' && token?.value && typeof token.value === 'object') {
    const kind = SYMBOL_NAME(token.value.kind);
    if (kind === 'BLOCKQUOTE') return 'Block quote';
    if (kind === 'OL_ITEM') return 'Ordered list item';
    if (kind === 'UL_ITEM') return 'Unordered list item';
    if (typeof token.value.level === 'number' && token.value.level > 0) {
      return `Heading (h${token.value.level})`;
    }
    return '';
  }

  switch (n) {
    case 'NUMBER': return 'Number';
    case 'STRING': return 'String';
    case 'REGEX': return 'Regex';
    case 'SYMBOL': return 'Symbol';
    case 'LITERAL': return 'Literal';
    case 'COMMENT':
    case 'COMMENT_MULTI': return 'Comment';
    case 'BOLD': return 'Bold markdown';
    case 'ITALIC': return 'Italic markdown';
    case 'CODE': return 'Code markdown';
    case 'COMMA': return 'Punctuation';
    case 'BLOCK':
    case 'MINUS':
    case 'PLUS':
    case 'MUL':
    case 'DIV':
    case 'MOD':
    case 'EQUAL':
    case 'NOT':
    case 'LIKE':
    case 'PIPE':
    case 'OR':
    case 'LESS':
    case 'LESS_EQ':
    case 'GREATER':
    case 'GREATER_EQ':
    case 'EXACT_EQ':
    case 'NOT_EQ':
    case 'SOME':
    case 'EVERY':
      return 'Operator';
    default:
      return n.toLowerCase();
  }
}

function tokenText(token) {
  const n = SYMBOL_NAME(token.type);
  // boolean/null literals are represented as JS values in token payloads
  if (n === 'LITERAL') {
    if (token.value === null)  return ':nil';
    if (token.value === true)  return ':on';
    if (token.value === false) return ':off';
  }
  const v = token.value;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (n === 'NUMBER' && v && typeof v === 'object') {
    if (typeof v.num === 'number' && typeof v.kind === 'string') {
      return `${v.num}${v.kind}`;
    }
    if (typeof v.toString === 'function' && v.toString !== Object.prototype.toString) {
      return String(v);
    }
  }
  if ((n === 'LITERAL' || n === 'SYMBOL' || n === 'DIRECTIVE') && v && typeof v === 'object') {
    if (typeof v.value === 'string' || typeof v.value === 'number') return String(v.value);
    if (typeof v.name === 'string') return v.name;
    if (typeof v.kind === 'string') return v.kind;
    if (typeof v.toString === 'function' && v.toString !== Object.prototype.toString) {
      return String(v);
    }
  }
  // Nested token containers are rendered recursively elsewhere.
  if (v && typeof v === 'object' && !Array.isArray(v)) return '';
  const text = v != null ? String(v) : '';
  return text;
}

function quoteStringDisplay(text) {
  const value = String(text ?? '');
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function hasTextBody(buffer) {
  return buffer.some(chunk => (
    typeof chunk === 'string' ? chunk.length > 0 : !!chunk
  ));
}

function resolveStructuralPrefix(textTokenValue) {
  if (!textTokenValue || !Array.isArray(textTokenValue.buffer)) {
    return { prefix: '', cls: '' };
  }

  const hasBody = hasTextBody(textTokenValue.buffer);
  const kind = SYMBOL_NAME(textTokenValue.kind);

  if (kind === 'BLOCKQUOTE') {
    return {
      prefix: hasBody ? '> ' : '>',
      cls: 'xt-prose',
    };
  }

  if (typeof textTokenValue.style === 'string' && textTokenValue.style.trim()) {
    if (/^\d+$/.test(textTokenValue.style)) {
      return {
        prefix: hasBody ? `${textTokenValue.style}. ` : `${textTokenValue.style}.`,
        cls: 'xt-prose',
      };
    }
    return {
      prefix: hasBody ? `${textTokenValue.style} ` : `${textTokenValue.style}`,
      cls: 'xt-prose',
    };
  }

  if (typeof textTokenValue.level === 'number' && textTokenValue.level > 0) {
    const marks = '#'.repeat(textTokenValue.level);
    return {
      prefix: hasBody ? `${marks} ` : marks,
      cls: 'xt-heading',
    };
  }

  return { prefix: '', cls: '' };
}

// ─── Caret offset helpers (minimal, no selection normalization) ──────────────

function getSelection(root) {
  if (root?.getSelection) return root.getSelection();
  return window.getSelection();
}

function getCursorOffset(root, shadowRoot) {
  const sel = getSelection(shadowRoot);
  if (!sel || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  const targetNode = range.startContainer;
  const targetOffset = range.startOffset;

  let offset = 0;

  const visibleTextLen = node => {
    if (!node) return 0;
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest('[data-result], [data-inline-result]')) return 0;
      return node.textContent.length;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ('result' in (node.dataset ?? {}) || 'inlineResult' in (node.dataset ?? {})) return 0;
      if (node.tagName === 'BR') return 1;
      let len = 0;
      node.childNodes.forEach(child => { len += visibleTextLen(child); });
      return len;
    }
    return 0;
  };

  const walk = node => {
    if (node === targetNode) {
      if (node.nodeType === Node.TEXT_NODE) {
        offset += Math.min(targetOffset, node.textContent.length);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < Math.min(targetOffset, node.childNodes.length); i++) {
          offset += visibleTextLen(node.childNodes[i]);
        }
      }
      return true;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.parentElement?.closest('[data-result], [data-inline-result]')) offset += node.textContent.length;
      return false;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if ('result' in (node.dataset ?? {}) || 'inlineResult' in (node.dataset ?? {})) return false;
      if (node.tagName === 'BR') {
        offset += 1;
        return false;
      }
      for (const child of node.childNodes) {
        if (walk(child)) return true;
      }
    }

    return false;
  };

  walk(root);
  return offset;
}

function setCursorOffset(root, shadowRoot, offset) {
  if (offset === null || offset === undefined) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if ('result' in (node.dataset ?? {}) || 'inlineResult' in (node.dataset ?? {})) return NodeFilter.FILTER_REJECT;
          if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_SKIP;
        }
        if (node.parentElement?.closest('[data-result], [data-inline-result]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let remaining = offset;
  let node;
  while ((node = walker.nextNode())) {
    if (node.tagName === 'BR') {
      if (remaining === 0) {
        const range = document.createRange();
        range.setStartBefore(node);
        range.collapse(true);
        const sel = getSelection(shadowRoot);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      remaining -= 1;
      continue;
    }

    const len = node.textContent.length;
    if (remaining <= len) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      const sel = getSelection(shadowRoot);
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    remaining -= len;
  }

  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  const sel = getSelection(shadowRoot);
  sel.removeAllRanges();
  sel.addRange(range);
}

// ─── Token rendering ──────────────────────────────────────────────────────────

// Append text (possibly containing \n) to parent, splitting on newlines → <br>
function appendText(parent, text, cls, tooltip = '') {
  if (!text) return;
  const parts = text.split('\n');
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      if (cls || tooltip) {
        const span = document.createElement('span');
        if (cls) span.className = cls;
        if (tooltip) span.dataset.tokenType = tooltip;
        span.textContent = parts[i];
        parent.appendChild(span);
      } else {
        parent.appendChild(document.createTextNode(parts[i]));
      }
    }
    if (i < parts.length - 1) parent.appendChild(document.createElement('br'));
  }
}

function appendHtmlTagToken(parent, tag, baseClass = '') {
  const appendPart = (value, extraClass, tooltip = 'HTML tag') => {
    if (!value) return;
    const cls = [baseClass, extraClass].filter(Boolean).join(' ');
    appendText(parent, value, cls || null, tooltip);
  };

  const closing = /^<\//.test(tag);
  const selfClosing = /\/>$/.test(tag);
  const nameMatch = tag.match(/^<\/?\s*([^\s/>]+)/);
  const tagName = nameMatch?.[1] || '';

  appendPart('<', 'xt-tag');
  if (closing) appendPart('/', 'xt-tag');
  appendPart(tagName, 'xt-tag-name', 'HTML tag name');

  const attrSliceStart = nameMatch ? nameMatch[0].length : (closing ? 2 : 1);
  const attrSliceEnd = Math.max(attrSliceStart, tag.length - (selfClosing ? 2 : 1));
  const attrs = tag.slice(attrSliceStart, attrSliceEnd);
  let cursor = 0;
  const attrRegex = /(\s+)([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
  let match;
  while ((match = attrRegex.exec(attrs))) {
    const chunk = attrs.slice(cursor, match.index);
    if (chunk) appendPart(chunk, 'xt-tag');
    appendPart(match[1], 'xt-tag');
    appendPart(match[2], 'xt-attr', 'HTML attribute');
    if (typeof match[3] === 'string') {
      const nameEnd = match[1].length + match[2].length;
      const valueStart = match[0].indexOf(match[3], nameEnd);
      const between = valueStart >= 0 ? match[0].slice(nameEnd, valueStart) : '';
      if (between) appendPart(between, 'xt-tag');
      appendPart(match[3], 'xt-attr-value', 'HTML attribute value');
    }
    cursor = match.index + match[0].length;
  }
  const tailAttrs = attrs.slice(cursor);
  if (tailAttrs) appendPart(tailAttrs, 'xt-tag');

  if (selfClosing) appendPart('/>', 'xt-tag');
  else appendPart('>', 'xt-tag');
}

function appendHtmlTaggedText(parent, text, baseClass = '', fallbackTooltip = '') {
  if (!text) return;
  const tagRegex = /<\/?[A-Za-z][^>]*>/g;
  let match;
  let cursor = 0;

  while ((match = tagRegex.exec(text))) {
    const before = text.slice(cursor, match.index);
    if (before) appendText(parent, before, baseClass || null, fallbackTooltip);
    appendHtmlTagToken(parent, match[0], baseClass);
    cursor = match.index + match[0].length;
  }

  const tail = text.slice(cursor);
  if (tail) appendText(parent, tail, baseClass || null, fallbackTooltip);
}

function appendInterpolatedText(parent, text, fallbackClass = '') {
  if (!text || !text.includes('#{')) {
    appendText(parent, text, fallbackClass || null);
    return;
  }

  const re = /#\{([^{}]+)\}/g;
  let match;
  let cursor = 0;

  while ((match = re.exec(text))) {
    const before = text.slice(cursor, match.index);
    if (before) appendText(parent, before, fallbackClass || null);

    const delimClass = [fallbackClass, 'xt-interp-delim'].filter(Boolean).join(' ');
    appendText(parent, '#{', delimClass || null);

    const expr = (match[1] || '').trim();
    if (expr) {
      try {
        const exprTokens = Parser.getAST(expr, 'raw');
        for (const exprToken of exprTokens) appendToken(parent, exprToken);
      } catch (_) {
        appendText(parent, expr, fallbackClass || null);
      }
    }

    appendText(parent, '}', delimClass || null);
    cursor = match.index + match[0].length;
  }

  const tail = text.slice(cursor);
  if (tail) appendText(parent, tail, fallbackClass || null);
}

function appendToken(parent, token) {
  if (!token) return;

  // Some markdown inline fragments (e.g. `code`) can come as tuple-like
  // arrays: [Symbol(CODE), ...parts]. Normalize to regular token shape.
  if (Array.isArray(token) && typeof token[0] === 'symbol') {
    const [type, ...value] = token;
    appendToken(parent, { type, value });
    return;
  }

  const n = SYMBOL_NAME(token.type ?? '');
  const tooltip = tokenTooltipLabel(token);
  if (n === 'EOF') return;
  // EOL = dot '.' — render as text, not a line break
  if (n === 'EOL') { parent.appendChild(document.createTextNode('.')); return; }

  // Inline markdown tuples may encode as TOKEN + [openDelimiter, body...].
  // Rebuild both delimiters so extract/render round-trips correctly.
  if (Array.isArray(token.value) && ['CODE', 'BOLD', 'ITALIC'].includes(n)) {
    const delimiter = typeof token.value[0] === 'string' ? token.value[0] : '';
    const body = token.value.slice(1).map(part => (typeof part === 'string' ? part : '')).join('');
    appendText(parent, `${delimiter}${body}${delimiter}`, tokenClass(token), tooltip);
    return;
  }

  // Tokens with array values (TEXT buffer, interpolated strings, markup, etc.)
  if (Array.isArray(token.value)) {
    const cls = tokenClass(token);
    const wrapper = cls ? document.createElement('span') : parent;
    if (cls) {
      wrapper.className = cls;
      if (tooltip) wrapper.dataset.tokenType = tooltip;
    }
    for (const sub of token.value) {
      if (typeof sub === 'string') {
        appendInterpolatedText(wrapper, sub);
      } else if (sub && typeof sub === 'object') {
        appendToken(wrapper, sub);
      }
    }
    if (cls) parent.appendChild(wrapper);
    return;
  }

  // TEXT tokens have a .value.buffer array
  if (token.value && typeof token.value === 'object' && Array.isArray(token.value.buffer)) {
    let cls = tokenClass(token);
    const { prefix, cls: structuralClass } = resolveStructuralPrefix(token.value);
    if (structuralClass) cls = structuralClass;

    const wrapper = cls ? document.createElement('span') : parent;
    if (cls) {
      wrapper.className = cls;
      if (tooltip) wrapper.dataset.tokenType = tooltip;
    }

    if (prefix) appendText(wrapper, prefix, null);

    for (const chunk of token.value.buffer) {
      if (typeof chunk === 'string') {
        appendInterpolatedText(wrapper, chunk, cls);
      } else if (chunk && typeof chunk === 'object') {
        appendToken(wrapper, chunk);
      }
    }

    if (cls) parent.appendChild(wrapper);
    return;
  }

  const text = tokenText(token);
  if (!text) return;

  if (n === 'STRING') {
    if (/<\/?[A-Za-z]/.test(text)) {
      appendHtmlTaggedText(parent, text, tokenClass(token), tooltip);
      return;
    }
    appendText(parent, quoteStringDisplay(text), tokenClass(token), tooltip);
    return;
  }

  appendText(parent, text, tokenClass(token), tooltip);
}

function appendPlainTextWithBreaks(parent, source) {
  const lines = source.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) parent.appendChild(document.createTextNode(lines[i]));
    if (i < lines.length - 1) parent.appendChild(document.createElement('br'));
  }
}

function hasIncompleteMarkdownPrefixLine(source) {
  const lines = source.split('\n');
  const incompletePrefix = /^\s*(#{1,6}|>+|[-+*]|\d+[.)]|```|~~~)\s*$/;
  return lines.some(line => incompletePrefix.test(line));
}

function renderTokens(source) {
  const frag = document.createDocumentFragment();
  if (hasIncompleteMarkdownPrefixLine(source)) {
    appendPlainTextWithBreaks(frag, source);
    return frag;
  }

  try {
    const tokens = Parser.getAST(source, 'raw');
    for (const token of tokens) {
      appendToken(frag, token);
    }
  } catch (_) {
    // Parse fallback: keep raw text editable when tokenization fails.
    appendPlainTextWithBreaks(frag, source);
  }
  return frag;
}

function normalizeStatement(source) {
  return source.replace(/\s+/g, ' ').trim();
}

function getFunctionDefinitionMeta(source) {
  const text = String(source || '');
  const match = text.match(/^\s*([A-Za-z_][\w!?-]*)\s*=\s*(.*?)\s*->/s);
  if (!match) return null;

  const name = match[1];
  const rawArgs = (match[2] || '').trim();
  const argsText = rawArgs.replace(/^\((.*)\)$/, '$1').trim();
  const args = argsText
    ? argsText.split(',').map(part => part.trim()).filter(Boolean)
    : [];

  return {
    name,
    args,
    signature: `${name}(${args.length ? args.join(', ') : ''})`,
  };
}

function hashString(input) {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(36);
}

function buildInlineAnchors(anchors) {
  const inlineAnchors = [];
  for (const anchor of anchors) {
    const inlineExpressions = extractInlineExpressions(anchor.source, anchor.id);
    for (const inline of inlineExpressions) {
      inlineAnchors.push({
        id: inline.inlineId,
        offset: anchor.startOffset + inline.insertOffset,
      });
    }
  }
  return inlineAnchors;
}

function buildStatementAnchors(source) {
  const anchors = [];

  try {
    const chunks = Parser.getAST(source, 'split');
    const sourceLines = source.split('\n');
    const lineStarts = [];
    let offset = 0;
    for (const lineText of sourceLines) {
      lineStarts.push(offset);
      offset += lineText.length + 1;
    }
    const counts = new Map();

    for (const chunk of chunks) {
      if (!chunk.body.length) continue;

      const line = Array.isArray(chunk.lines) && chunk.lines.length
        ? chunk.lines[chunk.lines.length - 1]
        : 0;
      const firstLine = Array.isArray(chunk.lines) && chunk.lines.length
        ? chunk.lines[0]
        : line;
      const statementSource = sourceLines.slice(firstLine, line + 1).join('\n');
      if (!statementSource.trim()) continue;

      const normalized = normalizeStatement(statementSource);
      const nth = (counts.get(normalized) || 0) + 1;
      counts.set(normalized, nth);

      anchors.push({
        id: `${hashString(normalized)}-${nth}`,
        line,
        firstLine,
        startOffset: lineStarts[firstLine] ?? 0,
        source: statementSource,
      });
    }
  } catch (_) {
    // Keep current anchors empty on parse failure.
  }

  return anchors;
}

// ─── Custom Element ───────────────────────────────────────────────────────────

const STYLES = `
  :host {
    display: block;
    position: relative;
    height: 100%;
    font-family: 'Berkeley Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 14px;
    line-height: 1.7;
    color: #d4d4d4;
  }

  [contenteditable="plaintext-only"] {
    outline: none;
    height: 100%;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: #569cd6;
    min-height: 100%;
    padding: 14px 16px;
  }

  [contenteditable="plaintext-only"]::selection,
  [contenteditable="plaintext-only"] *::selection { background: #264f78; }

  .xt-number  { color: #b5cea8; }
  .xt-string  { color: #ce9178; }
  .xt-regex   { color: #ce9178; }
  .xt-symbol  { color: #dcdcaa; }
  .xt-literal { color: #dcdcaa; }
  .xt-op      { color: #c586c0; }
  .xt-tag     { color: #4fc1ff; }
  .xt-tag-name { color: #4fc1ff; }
  .xt-attr    { color: #9cdcfe; }
  .xt-attr-value { color: #ce9178; }
  .xt-comment { color: #6a9955; }
  .xt-heading { color: #569cd6; }
  .xt-bold    { color: #d4d4d4; font-weight: bold; }
  .xt-italic  { color: #d4d4d4; font-style: italic; }
  .xt-code    { color: #9cdcfe; }
  .xt-text    { color: #d4d4d4; }
  .xt-prose   { color: #c586c0; }
  .xt-punct   { color: #808080; }
  .xt-interp-delim { opacity: 0.55; }

  .xt-heading .xt-bold,
  .xt-heading .xt-italic,
  .xt-heading .xt-code,
  .xt-prose .xt-bold,
  .xt-prose .xt-italic,
  .xt-prose .xt-code {
    color: inherit;
  }

  [data-result] {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 1px 6px;
    border-radius: 3px;
    background: #1e3a2f;
    color: #4ec9b0;
    font-size: 12px;
    line-height: 1.6;
    vertical-align: middle;
    user-select: none;
    pointer-events: auto;
  }

  [data-result].error {
    background: #3a1e1e;
    color: #f48771;
  }

  [data-result].function-anchor {
    cursor: help;
  }

  [data-result].loading {
    background: #293241;
    color: #b7c0cf;
  }

  [data-result].loading > span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  [data-result].loading > span::before {
    content: '';
    width: 8px;
    height: 8px;
    border: 2px solid #5d6a7e;
    border-top-color: #d9e1ee;
    border-radius: 50%;
    animation: xt-spin 0.8s linear infinite;
  }

  [data-result].loading [data-copy-btn] {
    display: none !important;
  }

  [data-cancel-btn] {
    display: none;
    margin-left: 6px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 11px;
    line-height: 1;
    opacity: 0.8;
    cursor: pointer;
  }

  [data-result].loading:hover [data-cancel-btn],
  [data-result].loading:focus-within [data-cancel-btn] {
    display: inline-block;
  }

  [data-cancel-btn]:hover,
  [data-cancel-btn]:focus-visible {
    opacity: 1;
    outline: none;
  }

  @keyframes xt-spin {
    to { transform: rotate(360deg); }
  }

  [data-copy-btn] {
    display: none;
    margin-left: 6px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 11px;
    line-height: 1;
    opacity: 0.75;
    cursor: pointer;
  }

  [data-result]:hover [data-copy-btn],
  [data-result]:focus-within [data-copy-btn] {
    display: inline-block;
  }

  [data-copy-btn]:hover,
  [data-copy-btn]:focus-visible {
    opacity: 1;
    outline: none;
  }

  [data-type-hint] {
    white-space: nowrap;
    display: inline-block;
    padding: 0 4px;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: #9aa8b5;
    font-size: 10px;
    line-height: 1.4;
    letter-spacing: 0.01em;
    opacity: 0.92;
  }

  [data-result].error [data-type-hint] {
    color: #d3a59d;
    border-color: rgba(244, 135, 113, 0.28);
  }

  [data-result][data-copy-state="copied"]::after,
  [data-result][data-copy-state="error"]::after {
    content: attr(data-copy-label);
    position: absolute;
    left: 50%;
    top: -22px;
    transform: translateX(-50%);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
  }

  [data-result][data-copy-state="copied"]::after {
    background: #2b5a48;
    color: #dff6ed;
  }

  [data-result][data-copy-state="error"]::after {
    background: #5a2b2b;
    color: #ffe4e4;
  }

  [data-inline-result] {
    display: inline-block;
    margin-left: 4px;
    padding: 0 5px;
    border-radius: 3px;
    background: #243244;
    color: #9cdcfe;
    font-size: 11px;
    line-height: 1.6;
    vertical-align: middle;
    user-select: none;
    pointer-events: none;
  }

  [data-inline-result].error {
    background: #4a2d2d;
    color: #f48771;
  }

  [data-tooltip-layer] {
    position: absolute;
    z-index: 20;
    display: none;
    pointer-events: none;
    padding: 3px 7px;
    border-radius: 5px;
    border: 1px solid #2b2b2b;
    background: #1f1f1f;
    color: #c5c5c5;
    font-size: 11px;
    line-height: 1.4;
    white-space: pre-line;
    max-width: 320px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }
`;

class XEditor extends HTMLElement {
  // Suppress onInput feedback loops while we rebuild DOM.

  connectedCallback() {
    this._shadow = this.attachShadow({ mode: 'open' });
    this._tooltipTimer = null;
    this._tooltipTarget = null;
    this._copyFeedbackTimer = null;
    this._history = [];
    this._historyIndex = -1;
    this._replHistory = [];
    this._replHistoryIndex = -1;
    this._replDraft = '';
    this._showTypeHints = true;
    this._debounce = null;
    this._evaluating = false;
    this._worker = null;
    this._evalRequestId = 0;
    this._appliedEvalRequestId = 0;
    this._lastText = '';
    this._anchors = [];
    this._resultsById = new Map();
    this._pendingResultIds = new Set();
    this._inlineAnchors = [];
    this._inlineResultsById = new Map();
    this._killedStatementIds = new Set();
    this._rendering = false;

    const style = document.createElement('style');
    style.textContent = STYLES;

    this._editable = document.createElement('div');
    this._editable.setAttribute('contenteditable', 'plaintext-only');
    this._editable.setAttribute('spellcheck', 'false');
    this._editable.setAttribute('autocorrect', 'off');
    this._editable.setAttribute('autocapitalize', 'off');

    this._tooltip = document.createElement('div');
    this._tooltip.dataset.tooltipLayer = '';

    this._shadow.appendChild(style);
    this._shadow.appendChild(this._editable);
    this._shadow.appendChild(this._tooltip);

    this._editable.addEventListener('beforeinput', e => this._onBeforeInput(e));
    this._editable.addEventListener('input', () => this._onInput());
    this._editable.addEventListener('keydown', e => this._onKeydown(e));
    this._editable.addEventListener('mousedown', e => this._onMouseDown(e));
    this._editable.addEventListener('click', e => this._onClick(e));
    this._editable.addEventListener('mousemove', e => this._onMouseMove(e));
    this._editable.addEventListener('mouseleave', () => this._hideTooltip());
    this._editable.addEventListener('scroll', () => this._hideTooltip());
    this._setupWorker();
    this._loadUIState();
    this._loadReplHistory();

    const initial = this.textContent || this.getAttribute('value') || '';
    if (initial) {
      this._applySource(initial);
      this._scheduleEval();
    } else {
      this._pushHistory('');
    }
  }

  disconnectedCallback() {
    if (this._copyFeedbackTimer) {
      clearTimeout(this._copyFeedbackTimer);
      this._copyFeedbackTimer = null;
    }
    this._clearTooltipTimer();
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  }

  get value() { return this._extractText(); }

  set value(text) {
    this._applySource(text, text?.length ?? 0);
    this._scheduleEval();
  }

  // ── extract plain text (excluding injected result badges) ─────────────────

  _extractText() {
    const walker = document.createTreeWalker(
      this._editable,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if ('result' in (node.dataset ?? {}) || 'inlineResult' in (node.dataset ?? {})) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
          }
          if (node.parentElement?.closest('[data-result], [data-inline-result]')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let text = '';
    let node;
    while ((node = walker.nextNode())) {
      text += node.tagName === 'BR' ? '\n' : node.textContent;
    }
    return text;
  }

  // ── render source text + rebuild anchors + reattach current results ──────

  _applySource(source, cursorOffset = null) {
    this._hideTooltip();
    this._rendering = true;
    this._editable.innerHTML = '';
    this._editable.appendChild(renderTokens(source));
    this._anchors = buildStatementAnchors(source);
    this._inlineAnchors = buildInlineAnchors(this._anchors);
    this._injectResults();
    this._lastText = source;
    this._rendering = false;
    setCursorOffset(this._editable, this._shadow, cursorOffset);
  }

  // ── inject result widgets at statement EOL anchors ───────────────────────

  _injectResults() {
    this._editable.querySelectorAll('[data-result], [data-inline-result]').forEach(el => el.remove());
    if (!this._anchors.length && !this._inlineAnchors.length) return;

    const byLine = new Map();
    this._anchors.forEach(anchor => {
      const pending = this._pendingResultIds.has(anchor.id);
      const result = pending ? null : this._resultsById.get(anchor.id);
      const fallbackUnitText = unitLiteralDisplay(normalizeUnitLiterals(anchor.source));
      if (!pending && !result && !fallbackUnitText) return;
      if (!byLine.has(anchor.line)) byLine.set(anchor.line, []);
      byLine.get(anchor.line).push({
        result,
        anchor,
        pending,
        fallbackUnitText,
      });
    });

    if (!byLine.size) {
      this._injectInlineResults();
      return;
    }

    const makeWidget = ({ result, anchor, pending, fallbackUnitText }) => {
      if (pending) {
        const widget = document.createElement('span');
        widget.dataset.result = '';
        widget.dataset.statementId = anchor.id;
        widget.setAttribute('contenteditable', 'false');
        widget.classList.add('loading');
        const label = document.createElement('span');
        label.textContent = '…';
        widget.appendChild(label);

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.dataset.cancelBtn = '';
        cancelBtn.setAttribute('aria-label', 'Cancel evaluation');
        cancelBtn.title = 'Cancel evaluation';
        cancelBtn.textContent = '×';
        widget.appendChild(cancelBtn);
        return widget;
      }

      const text = (result && result.resultText) || fallbackUnitText || '';
      if (!text?.trim()) return null;

      const widget = document.createElement('span');
      widget.dataset.result = '';
      widget.dataset.statementId = anchor.id;
      widget.setAttribute('contenteditable', 'false');
      const label = document.createElement('span');
      label.dataset.resultLabel = '';
      label.textContent = result?.kind === 'function' ? 'ƒ' : `→ ${text}`;
      widget.appendChild(label);

      if (this._showTypeHints && result?.typeText) {
        const typeHint = document.createElement('span');
        typeHint.dataset.typeHint = '';
        typeHint.textContent = result.typeText;
        typeHint.title = `runtime type: ${result.typeText}`;
        widget.appendChild(typeHint);
      }

      if (result?.kind !== 'function') {
        widget.dataset.copyValue = text;
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.dataset.copyBtn = '';
        copyBtn.setAttribute('aria-label', 'Copy result');
        copyBtn.title = 'Copy result';
        copyBtn.textContent = '⧉';
        widget.appendChild(copyBtn);
      }

      if (result?.errorText) widget.classList.add('error');
      if (result?.kind === 'function') {
        widget.classList.add('function-anchor');
        const meta = getFunctionDefinitionMeta(anchor?.source || '');
        widget.dataset.tooltip = meta?.signature || 'Function definition';
      }
      return widget;
    };

    const previousRenderableTextNode = (fromNode) => {
      let node = fromNode;
      if (node === this._editable) {
        node = this._editable.lastChild;
        while (node && node.lastChild) node = node.lastChild;
        if (
          node
          && node.nodeType === Node.TEXT_NODE
          && !node.parentElement?.closest('[data-result], [data-inline-result]')
        ) {
          return node;
        }
      }
      while (node && node !== this._editable) {
        if (node.previousSibling) {
          node = node.previousSibling;
          while (node && node.lastChild) node = node.lastChild;
          if (
            node
            && node.nodeType === Node.TEXT_NODE
            && !node.parentElement?.closest('[data-result], [data-inline-result]')
          ) {
            return node;
          }
        } else {
          if (
            node.nodeType === Node.TEXT_NODE
            && !node.parentElement?.closest('[data-result], [data-inline-result]')
          ) {
            return node;
          }
          node = node.parentNode;
        }
      }
      return null;
    };

    const insertBeforeLineEOL = (widget, lineEndNode) => {
      const textNode = previousRenderableTextNode(lineEndNode);
      if (textNode && textNode.textContent.endsWith('.')) {
        const range = document.createRange();
        range.setStart(textNode, Math.max(0, textNode.textContent.length - 1));
        range.collapse(true);
        range.insertNode(widget);
        return true;
      }
      return false;
    };

    // Count all <br> in DOM order (including nested spans) for visual EOL.
    const walker = document.createTreeWalker(
      this._editable,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: node => (node.tagName === 'BR'
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP),
      }
    );

    let lineIdx = 0;
    let brNode;
    while ((brNode = walker.nextNode())) {
      const lineResults = byLine.get(lineIdx);
      if (lineResults?.length) {
        for (const entry of lineResults) {
          const widget = makeWidget(entry);
          if (!widget) continue;
          if (!insertBeforeLineEOL(widget, brNode)) {
            brNode.parentNode.insertBefore(widget, brNode);
          }
        }
      }
      lineIdx++;
    }

    // Final line (without trailing <br>)
    const trailing = byLine.get(lineIdx);
    if (trailing?.length) {
      for (const entry of trailing) {
        const widget = makeWidget(entry);
        if (!widget) continue;
        if (!insertBeforeLineEOL(widget, this._editable)) {
          this._editable.appendChild(widget);
        }
      }
    }

    this._injectInlineResults();
  }

  _insertWidgetAtOffset(offset, widget) {
    const walker = document.createTreeWalker(
      this._editable,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if ('result' in (node.dataset ?? {}) || 'inlineResult' in (node.dataset ?? {})) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
          }
          if (node.parentElement?.closest('[data-result], [data-inline-result]')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let remaining = Math.max(0, offset);
    let node;
    while ((node = walker.nextNode())) {
      if (node.tagName === 'BR') {
        if (remaining === 0) {
          node.parentNode.insertBefore(widget, node);
          return;
        }
        remaining -= 1;
        continue;
      }

      const len = node.textContent.length;
      if (remaining <= len) {
        const range = document.createRange();
        range.setStart(node, remaining);
        range.collapse(true);
        range.insertNode(widget);
        return;
      }
      remaining -= len;
    }

    this._editable.appendChild(widget);
  }

  _injectInlineResults() {
    if (!this._inlineAnchors.length || !this._inlineResultsById.size) return;

    for (const inlineAnchor of this._inlineAnchors) {
      const inlineResult = this._inlineResultsById.get(inlineAnchor.id);
      if (!inlineResult?.resultText?.trim()) continue;

      const badge = document.createElement('span');
      badge.dataset.inlineResult = '';
      badge.setAttribute('contenteditable', 'false');
      badge.textContent = `= ${inlineResult.resultText}`;
      if (inlineResult.errorText) badge.classList.add('error');
      if (this._showTypeHints && inlineResult.typeText) {
        badge.title = `runtime type: ${inlineResult.typeText}`;
      }
      this._insertWidgetAtOffset(inlineAnchor.offset, badge);
    }
  }

  // ── evaluate ──────────────────────────────────────────────────────────────

  _scheduleEval() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this._requestEval(), 600);
  }

  _startWorker() {
    try {
      const workerUrl = new URL('./editor-eval-worker.js', import.meta.url);
      const moduleUrl = new URL(import.meta.url);
      const inheritedRev = moduleUrl.searchParams.get('v')
        || moduleUrl.searchParams.get('debug')
        || moduleUrl.searchParams.get('t')
        || '';
      const rev = globalThis.__X_EDITOR_WORKER_REV || inheritedRev || '';
      if (rev) workerUrl.searchParams.set('v', String(rev));
      this._worker = new Worker(workerUrl, { type: 'module' });
      this._worker.addEventListener('message', ({ data }) => {
        const {
          requestId, statementId, start, completed, statementResult, inlineResults, done, error,
        } = data || {};
        if (!requestId || requestId < this._appliedEvalRequestId) return;
        this._appliedEvalRequestId = requestId;

        if (error) {
          this._pendingResultIds = new Set();
          this._injectResults();
          this._emitError(new Error(error));
          return;
        }

        if (statementId && start) {
          this._pendingResultIds.add(statementId);
          this._injectResults();
          return;
        }

        if (statementId && completed) {
          this._pendingResultIds.delete(statementId);
          this._resultsById.delete(statementId);

          Array.from(this._inlineResultsById.keys()).forEach(inlineId => {
            if (inlineId.startsWith(`${statementId}:`)) {
              this._inlineResultsById.delete(inlineId);
            }
          });

          if (statementResult?.resultText?.trim()) {
            this._resultsById.set(statementId, statementResult);
          }
        }

        (Array.isArray(inlineResults) ? inlineResults : []).forEach(inline => {
          if (!inline?.inlineId) return;
          if (!inline?.resultText?.trim()) return;
          this._inlineResultsById.set(inline.inlineId, inline);
        });

        this._injectResults();

        if (done) {
          this._pendingResultIds = new Set();
          this._injectResults();

          const emitted = [];
          this._resultsById.forEach(result => {
            if (result?.resultText && !result.errorText && result.kind !== 'function') {
              emitted.push(result.resultText);
            }
          });
          this._emit(emitted);
        }
      });
    } catch (_) {
      this._worker = null;
    }
  }

  _setupWorker() {
    this._startWorker();
  }

  _restartWorker() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
    this._startWorker();
  }

  _requestEval({ preserveKilled = false } = {}) {
    const text = this._extractText();
    if (!preserveKilled) {
      this._killedStatementIds = new Set();
    }

    if (!text.trim() || !this._anchors.length) {
      this._killedStatementIds = new Set();
      this._pendingResultIds = new Set();
      this._resultsById = new Map();
      this._inlineResultsById = new Map();
      this._injectResults();
      this._emit([]);
      return;
    }

    const statements = this._anchors.map(anchor => ({
      statementId: anchor.id,
      source: anchor.source,
    }));

    const activeStatements = statements.filter(statement => !this._killedStatementIds.has(statement.statementId));

    if (!activeStatements.length) {
      this._pendingResultIds = new Set();
      this._injectResults();
      this._emit([]);
      return;
    }

    const statementIds = new Set(activeStatements.map(statement => statement.statementId));
    Array.from(this._resultsById.keys()).forEach(id => {
      if (!statementIds.has(id)) this._resultsById.delete(id);
    });
    const inlineIds = new Set(this._inlineAnchors.map(anchor => anchor.id));
    Array.from(this._inlineResultsById.keys()).forEach(id => {
      if (!inlineIds.has(id)) this._inlineResultsById.delete(id);
    });

    this._pendingResultIds = new Set();
    this._injectResults();

    if (this._worker) {
      // Abort previous long-running evaluation (e.g. fib(99)) so new input is responsive.
      if (this._evalRequestId > this._appliedEvalRequestId) {
        this._restartWorker();
      }

      const requestId = ++this._evalRequestId;
      this._worker.postMessage({
        requestId,
        statements: activeStatements,
        skipStatementIds: Array.from(this._killedStatementIds),
      });
      return;
    }

    this._evaluateOnMainThread(activeStatements);
  }

  async _evaluateOnMainThread(statements) {
    if (this._evaluating) return;

    this._evaluating = true;
    try {
      const env = new Env();
      await bootstrapEnv(env, execute);

      for (const statement of statements) {
        if (!statement?.source?.trim()) continue;
        this._pendingResultIds.add(statement.statementId);
        this._injectResults();
        try {
          const statementSource = normalizeUnitLiterals(statement.source);
          const unitDisplay = unitLiteralDisplay(statementSource);
          const result = await execute(statementSource, env);
          this._resultsById.delete(statement.statementId);
          Array.from(this._inlineResultsById.keys()).forEach(inlineId => {
            if (inlineId.startsWith(`${statement.statementId}:`)) {
              this._inlineResultsById.delete(inlineId);
            }
          });

          if (isFunctionDefinitionSource(statementSource)) {
            const functionBadge = {
              statementId: statement.statementId,
              resultText: 'ƒ',
              kind: 'function',
              typeText: 'fn',
            };
            this._resultsById.set(statement.statementId, functionBadge);
          } else if (result !== undefined && result !== null) {
            const resultText = formatRuntimeValue(result, 180);
            const displayText = unitDisplay && !hasUnitSuffix(resultText) ? unitDisplay : resultText;
            this._resultsById.set(statement.statementId, {
              statementId: statement.statementId,
              resultText: displayText,
              typeText: inferRuntimeType(result),
            });
          }

          const inlineExpressions = extractInlineExpressions(statementSource, statement.statementId);
          for (const inline of inlineExpressions) {
            if (!inline.expr) continue;
            const inlineSource = normalizeUnitLiterals(inline.expr);
            try {
              const inlineResult = await execute(inlineSource, env);
              if (inlineResult === undefined || inlineResult === null) continue;

              const compactInline = formatRuntimeValue(inlineResult, 120);
              if (!compactInline?.trim()) continue;

              this._inlineResultsById.set(inline.inlineId, {
                inlineId: inline.inlineId,
                resultText: compactInline,
                typeText: inferRuntimeType(inlineResult),
              });
            } catch (error) {
              this._inlineResultsById.set(inline.inlineId, {
                inlineId: inline.inlineId,
                resultText: '!',
                errorText: formatRuntimeError(error),
              });
            }
          }

          if (
            unitDisplay
            && (
              !this._resultsById.has(statement.statementId)
              || !this._resultsById.get(statement.statementId)?.resultText?.trim()
            )
          ) {
            this._resultsById.set(statement.statementId, {
              statementId: statement.statementId,
              resultText: unitDisplay,
              typeText: 'unit',
            });
          }
        } catch (error) {
          this._resultsById.set(statement.statementId, {
            statementId: statement.statementId,
            resultText: `! ${formatRuntimeError(error)}`,
            errorText: formatRuntimeError(error),
            typeText: 'error',
          });
        }

        this._pendingResultIds.delete(statement.statementId);
        this._injectResults();
      }

      this._pendingResultIds = new Set();
      this._injectResults();

      const emitted = [];
      this._resultsById.forEach(result => {
        if (result?.resultText && !result.errorText && result.kind !== 'function') {
          emitted.push(result.resultText);
        }
      });
      this._emit(emitted);
    } catch (e) {
      this._pendingResultIds = new Set();
      this._injectResults();
      this._emitError(e);
    } finally {
      this._evaluating = false;
    }
  }

  _emit(results) {
    this.dispatchEvent(new CustomEvent('change', { detail: { results }, bubbles: true, composed: true }));
  }

  _emitError(error) {
    this.dispatchEvent(new CustomEvent('error', { detail: { error }, bubbles: true, composed: true }));
  }

  // ── undo/redo (text+caret snapshots) ──────────────────────────────────────

  _pushHistory(text, cursor) {
    this._history = this._history.slice(0, this._historyIndex + 1);
    this._history.push({ text, cursor: cursor ?? 0 });
    if (this._history.length > 200) this._history.shift();
    this._historyIndex = this._history.length - 1;
  }

  _undo() {
    if (this._historyIndex <= 0) return;
    const { text, cursor } = this._history[--this._historyIndex];
    this._applySource(text, cursor);
    this._scheduleEval();
  }

  _redo() {
    if (this._historyIndex >= this._history.length - 1) return;
    const { text, cursor } = this._history[++this._historyIndex];
    this._applySource(text, cursor);
    this._scheduleEval();
  }

  // ── repl history / type hint settings ─────────────────────────────────────

  _isReplMode() {
    return this.hasAttribute('repl');
  }

  _storageKey(name) {
    const explicit = this.getAttribute('storage-key');
    const base = explicit || `x-editor:${this.id || 'default'}`;
    return `${base}:${name}`;
  }

  _loadUIState() {
    try {
      const raw = localStorage.getItem(this._storageKey('ui'));
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.showTypeHints === 'boolean') {
        this._showTypeHints = parsed.showTypeHints;
      }
    } catch (_) {
      // keep defaults
    }
  }

  _saveUIState() {
    try {
      localStorage.setItem(this._storageKey('ui'), JSON.stringify({
        showTypeHints: this._showTypeHints,
      }));
    } catch (_) {
      // ignore storage failures
    }
  }

  _loadReplHistory() {
    if (!this._isReplMode()) return;

    try {
      const raw = localStorage.getItem(this._storageKey('repl-history'));
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      this._replHistory = parsed
        .filter(entry => typeof entry === 'string')
        .slice(-100);
      this._replHistoryIndex = this._replHistory.length;
    } catch (_) {
      // ignore malformed storage
    }
  }

  _saveReplHistory() {
    if (!this._isReplMode()) return;

    try {
      localStorage.setItem(this._storageKey('repl-history'), JSON.stringify(this._replHistory.slice(-100)));
    } catch (_) {
      // ignore storage failures
    }
  }

  _commitReplEntry() {
    if (!this._isReplMode()) return;

    const text = this._extractText().trim();
    if (!text) return;

    if (!this._replHistory.length || this._replHistory[this._replHistory.length - 1] !== text) {
      this._replHistory.push(text);
      if (this._replHistory.length > 100) this._replHistory.shift();
      this._saveReplHistory();
    }

    this._replHistoryIndex = this._replHistory.length;
    this._replDraft = '';
  }

  _browseReplHistory(delta) {
    if (!this._isReplMode()) return false;
    if (!this._replHistory.length) return false;

    const current = this._extractText();
    if (this._replHistoryIndex === this._replHistory.length) {
      this._replDraft = current;
    }

    const nextIndex = Math.min(
      this._replHistory.length,
      Math.max(0, this._replHistoryIndex + delta)
    );

    if (nextIndex === this._replHistoryIndex) return false;
    this._replHistoryIndex = nextIndex;

    const nextText = this._replHistoryIndex === this._replHistory.length
      ? this._replDraft
      : this._replHistory[this._replHistoryIndex];

    this._applySource(nextText, nextText.length);
    return true;
  }

  // ── event handlers ────────────────────────────────────────────────────────

  _onBeforeInput() {
    // Snapshot text+caret before browser DOM mutation.
    const text = this._extractText();
    const cursor = getCursorOffset(this._editable, this._shadow);
    this._pushHistory(text, cursor);
    this._lastText = text;
  }

  _onInput() {
    if (this._rendering) return;
    this._hideTooltip();

    const text = this._extractText();
    if (text === this._lastText) return;

    const cursor = getCursorOffset(this._editable, this._shadow) ?? text.length;
    this._applySource(text, cursor);
    this._scheduleEval();
  }

  _onKeydown(e) {
    this._hideTooltip();
    const meta = e.metaKey || e.ctrlKey;

    if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); this._undo(); return; }
    if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); this._redo(); return; }

    if (meta && e.key === 'Enter') {
      e.preventDefault();
      this._commitReplEntry();
      clearTimeout(this._debounce);
      this._requestEval();
      return;
    }

    if (meta && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      this._showTypeHints = !this._showTypeHints;
      this._saveUIState();
      this._injectResults();
      return;
    }

    if (this._isReplMode() && !meta && !e.shiftKey && e.key === 'ArrowUp' && this._browseReplHistory(-1)) {
      e.preventDefault();
      return;
    }

    if (this._isReplMode() && !meta && !e.shiftKey && e.key === 'ArrowDown' && this._browseReplHistory(1)) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  }

  _onMouseDown(e) {
    const copyBtn = e.target instanceof Element ? e.target.closest('[data-copy-btn]') : null;
    const cancelBtn = e.target instanceof Element ? e.target.closest('[data-cancel-btn]') : null;
    if (!copyBtn && !cancelBtn) return;
    e.preventDefault();
  }

  async _copyText(value) {
    if (!value) return false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_) {
      // Fall through to legacy copy path.
    }

    try {
      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', 'readonly');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.focus();
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      return !!ok;
    } catch (_) {
      return false;
    }
  }

  _setCopyFeedback(resultNode, copyBtn, ok) {
    if (!resultNode || !copyBtn) return;
    if (this._copyFeedbackTimer) clearTimeout(this._copyFeedbackTimer);

    resultNode.dataset.copyState = ok ? 'copied' : 'error';
    resultNode.dataset.copyLabel = ok ? 'Copied' : 'Copy failed';
    copyBtn.textContent = ok ? '✓' : '!';

    this._copyFeedbackTimer = setTimeout(() => {
      if (!resultNode.isConnected || !copyBtn.isConnected) return;
      delete resultNode.dataset.copyState;
      delete resultNode.dataset.copyLabel;
      copyBtn.textContent = '⧉';
      this._copyFeedbackTimer = null;
    }, 900);
  }

  async _onClick(e) {
    const cancelBtn = e.target instanceof Element ? e.target.closest('[data-cancel-btn]') : null;
    if (cancelBtn) {
      e.preventDefault();
      e.stopPropagation();
      const resultNode = cancelBtn.closest('[data-result]');
      const statementId = resultNode?.dataset.statementId;
      if (statementId) {
        this._killedStatementIds.add(statementId);
        this._pendingResultIds.delete(statementId);
        this._resultsById.delete(statementId);
        Array.from(this._inlineResultsById.keys()).forEach(inlineId => {
          if (inlineId.startsWith(`${statementId}:`)) {
            this._inlineResultsById.delete(inlineId);
          }
        });
        clearTimeout(this._debounce);
        this._requestEval({ preserveKilled: true });
      }
      return;
    }

    const copyBtn = e.target instanceof Element ? e.target.closest('[data-copy-btn]') : null;
    if (!copyBtn) return;
    e.preventDefault();
    e.stopPropagation();

    const resultNode = copyBtn.closest('[data-result]');
    const value = resultNode?.dataset.copyValue || '';
    if (!value) return;

    const ok = await this._copyText(value);
    this._setCopyFeedback(resultNode, copyBtn, ok);
  }

  _clearTooltipTimer() {
    if (!this._tooltipTimer) return;
    clearTimeout(this._tooltipTimer);
    this._tooltipTimer = null;
  }

  _hideTooltip() {
    this._clearTooltipTimer();
    this._tooltipTarget = null;
    if (this._tooltip) this._tooltip.style.display = 'none';
  }

  _positionTooltip(x, y) {
    if (!this._tooltip || this._tooltip.style.display === 'none') return;
    const hostRect = this.getBoundingClientRect();
    const pad = 8;
    const tipW = this._tooltip.offsetWidth || 0;
    const tipH = this._tooltip.offsetHeight || 0;

    let left = x + 12;
    let top = y + 14;
    if (left + tipW > hostRect.width - pad) left = Math.max(pad, hostRect.width - tipW - pad);
    if (top + tipH > hostRect.height - pad) top = Math.max(pad, y - tipH - 10);

    this._tooltip.style.left = `${left}px`;
    this._tooltip.style.top = `${top}px`;
  }

  _showTooltip(label, x, y, target) {
    if (!this._tooltip || !label) return;
    this._tooltip.textContent = label;
    this._tooltip.style.display = 'block';
    this._tooltipTarget = target;
    this._positionTooltip(x, y);
  }

  _onMouseMove(e) {
    const node = e.target instanceof Element
      ? e.target.closest('[data-token-type], [data-tooltip]')
      : null;
    if (!node) {
      this._hideTooltip();
      return;
    }

    const hostRect = this.getBoundingClientRect();
    const x = e.clientX - hostRect.left;
    const y = e.clientY - hostRect.top;
    const label = node.dataset.tooltip || node.dataset.tokenType || '';
    if (!label) {
      this._hideTooltip();
      return;
    }

    if (this._tooltipTarget === node && this._tooltip.style.display !== 'none') {
      this._positionTooltip(x, y);
      return;
    }

    this._clearTooltipTimer();
    this._tooltipTimer = setTimeout(() => {
      this._showTooltip(label, x, y, node);
    }, 150);
  }
}

customElements.define('x-editor', XEditor);

export default XEditor;
