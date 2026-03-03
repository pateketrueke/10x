/**
 * <tenx-editor-ce> — scoped contenteditable demo editor.
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

import { Parser, Env, execute, serialize, applyAdapter } from '../main.js';
import { createBrowserAdapter } from '../adapters/browser/index.js';

applyAdapter(createBrowserAdapter());

// ─── Token → CSS class mapping (mirrors src/util.js colorize) ────────────────

const SYMBOL_NAME = sym => {
  if (!sym || typeof sym !== 'symbol') return '';
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? '';
};

function tokenClass(token) {
  const n = SYMBOL_NAME(token.type);
  switch (n) {
    case 'COMMENT': case 'COMMENT_MULTI': return 'xt-comment';
    case 'NUMBER':  return 'xt-number';
    case 'STRING':  return 'xt-string';
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
  // Nested token containers are rendered recursively elsewhere.
  if (v && typeof v === 'object' && !Array.isArray(v)) return '';
  return v != null ? String(v) : '';
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
        const exprTokens = Parser.getAST(expr, null);
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
    const tokens = Parser.getAST(source, null);
    for (const token of tokens) appendToken(frag, token);
  } catch (_) {
    // Parse fallback: keep raw text editable when tokenization fails.
    appendPlainTextWithBreaks(frag, source);
  }
  return frag;
}

function normalizeStatement(source) {
  return source.replace(/\s+/g, ' ').trim();
}

function extractInlineExpressions(source, statementId = '') {
  const text = String(source || '');
  const expressions = [];
  const re = /#\{([^{}]+)\}/g;
  let match;
  let index = 0;

  while ((match = re.exec(text))) {
    index += 1;
    expressions.push({
      inlineId: `${statementId}:${index}`,
      expr: match[1].trim(),
      // Place inline result inside interpolation, before the closing `}`.
      insertOffset: match.index + match[0].length - 1,
    });
  }

  return expressions;
}

function isFunctionDefinitionSource(source) {
  const normalized = String(source || '').replace(/\s+/g, ' ').trim();
  return /^[^=]+=\s*.*->/.test(normalized);
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
    const chunks = Parser.getAST(source, true);
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
    display: inline-block;
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

class TenXEditor extends HTMLElement {
  #shadow;
  #editable;
  #tooltip;
  #tooltipTimer = null;
  #tooltipTarget = null;
  #copyFeedbackTimer = null;
  #history = [];
  #historyIndex = -1;
  #debounce = null;
  #evaluating = false;
  #worker = null;
  #evalRequestId = 0;
  #appliedEvalRequestId = 0;
  #lastText = '';
  #anchors = [];
  #resultsById = new Map();
  #inlineAnchors = [];
  #inlineResultsById = new Map();
  // Suppress onInput feedback loops while we rebuild DOM.
  #rendering = false;

  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLES;

    this.#editable = document.createElement('div');
    this.#editable.setAttribute('contenteditable', 'plaintext-only');
    this.#editable.setAttribute('spellcheck', 'false');
    this.#editable.setAttribute('autocorrect', 'off');
    this.#editable.setAttribute('autocapitalize', 'off');

    this.#tooltip = document.createElement('div');
    this.#tooltip.dataset.tooltipLayer = '';

    this.#shadow.appendChild(style);
    this.#shadow.appendChild(this.#editable);
    this.#shadow.appendChild(this.#tooltip);

    this.#editable.addEventListener('beforeinput', e => this.#onBeforeInput(e));
    this.#editable.addEventListener('input', () => this.#onInput());
    this.#editable.addEventListener('keydown', e => this.#onKeydown(e));
    this.#editable.addEventListener('mousedown', e => this.#onMouseDown(e));
    this.#editable.addEventListener('click', e => this.#onClick(e));
    this.#editable.addEventListener('mousemove', e => this.#onMouseMove(e));
    this.#editable.addEventListener('mouseleave', () => this.#hideTooltip());
    this.#editable.addEventListener('scroll', () => this.#hideTooltip());
    this.#setupWorker();

    const initial = this.textContent || this.getAttribute('value') || '';
    if (initial) {
      this.#applySource(initial);
      this.#scheduleEval();
    } else {
      this.#pushHistory('');
    }
  }

  disconnectedCallback() {
    if (this.#copyFeedbackTimer) {
      clearTimeout(this.#copyFeedbackTimer);
      this.#copyFeedbackTimer = null;
    }
    this.#clearTooltipTimer();
    if (this.#worker) {
      this.#worker.terminate();
      this.#worker = null;
    }
  }

  get value() { return this.#extractText(); }

  set value(text) {
    this.#applySource(text, text?.length ?? 0);
    this.#scheduleEval();
  }

  // ── extract plain text (excluding injected result badges) ─────────────────

  #extractText() {
    const walker = document.createTreeWalker(
      this.#editable,
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

  #applySource(source, cursorOffset = null) {
    this.#hideTooltip();
    this.#rendering = true;
    this.#editable.innerHTML = '';
    this.#editable.appendChild(renderTokens(source));
    this.#anchors = buildStatementAnchors(source);
    this.#inlineAnchors = buildInlineAnchors(this.#anchors);
    this.#injectResults();
    this.#lastText = source;
    this.#rendering = false;
    setCursorOffset(this.#editable, this.#shadow, cursorOffset);
  }

  // ── inject result widgets at statement EOL anchors ───────────────────────

  #injectResults() {
    this.#editable.querySelectorAll('[data-result], [data-inline-result]').forEach(el => el.remove());
    if (!this.#anchors.length && !this.#inlineAnchors.length) return;

    const byLine = new Map();
    this.#anchors.forEach(anchor => {
      const result = this.#resultsById.get(anchor.id);
      if (!result) return;
      if (!byLine.has(anchor.line)) byLine.set(anchor.line, []);
      byLine.get(anchor.line).push({ result, anchor });
    });

    if (!byLine.size) {
      this.#injectInlineResults();
      return;
    }

    const makeWidget = (result, anchor) => {
      const text = result.resultText;
      if (!text?.trim()) return null;

      const widget = document.createElement('span');
      widget.dataset.result = '';
      widget.setAttribute('contenteditable', 'false');
      const label = document.createElement('span');
      label.textContent = result.kind === 'function' ? 'ƒ' : `→ ${text}`;
      widget.appendChild(label);

      if (result.kind !== 'function') {
        widget.dataset.copyValue = text;
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.dataset.copyBtn = '';
        copyBtn.setAttribute('aria-label', 'Copy result');
        copyBtn.title = 'Copy result';
        copyBtn.textContent = '⧉';
        widget.appendChild(copyBtn);
      }

      if (result.errorText) widget.classList.add('error');
      if (result.kind === 'function') {
        widget.classList.add('function-anchor');
        const meta = getFunctionDefinitionMeta(anchor?.source || '');
        widget.dataset.tooltip = meta?.signature || 'Function definition';
      }
      return widget;
    };

    const previousRenderableTextNode = (fromNode) => {
      let node = fromNode;
      if (node === this.#editable) {
        node = this.#editable.lastChild;
        while (node && node.lastChild) node = node.lastChild;
      }
      while (node && node !== this.#editable) {
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
      this.#editable,
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
          const widget = makeWidget(entry.result, entry.anchor);
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
        const widget = makeWidget(entry.result, entry.anchor);
        if (!widget) continue;
        if (!insertBeforeLineEOL(widget, this.#editable)) {
          this.#editable.appendChild(widget);
        }
      }
    }

    this.#injectInlineResults();
  }

  #insertWidgetAtOffset(offset, widget) {
    const walker = document.createTreeWalker(
      this.#editable,
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

    this.#editable.appendChild(widget);
  }

  #injectInlineResults() {
    if (!this.#inlineAnchors.length || !this.#inlineResultsById.size) return;

    for (const inlineAnchor of this.#inlineAnchors) {
      const inlineResult = this.#inlineResultsById.get(inlineAnchor.id);
      if (!inlineResult?.resultText?.trim()) continue;

      const badge = document.createElement('span');
      badge.dataset.inlineResult = '';
      badge.setAttribute('contenteditable', 'false');
      badge.textContent = `= ${inlineResult.resultText}`;
      if (inlineResult.errorText) badge.classList.add('error');
      this.#insertWidgetAtOffset(inlineAnchor.offset, badge);
    }
  }

  // ── evaluate ──────────────────────────────────────────────────────────────

  #scheduleEval() {
    clearTimeout(this.#debounce);
    this.#debounce = setTimeout(() => this.#requestEval(), 600);
  }

  #setupWorker() {
    try {
      this.#worker = new Worker(new URL('./editor-eval-worker.js', import.meta.url), { type: 'module' });
      this.#worker.addEventListener('message', ({ data }) => {
        const { requestId, results, inlineResults, error } = data || {};
        if (!requestId || requestId < this.#appliedEvalRequestId) return;
        this.#appliedEvalRequestId = requestId;

        if (error) {
          this.#emitError(new Error(error));
          return;
        }

        const next = new Map();
        const emitted = [];
        (Array.isArray(results) ? results : []).forEach(result => {
          if (!result?.statementId) return;
          next.set(result.statementId, result);
          if (result.resultText && !result.errorText && result.kind !== 'function') {
            emitted.push(result.resultText);
          }
        });

        const inlineNext = new Map();
        (Array.isArray(inlineResults) ? inlineResults : []).forEach(inline => {
          if (!inline?.inlineId) return;
          inlineNext.set(inline.inlineId, inline);
        });

        this.#resultsById = next;
        this.#inlineResultsById = inlineNext;
        this.#injectResults();
        this.#emit(emitted);
      });
    } catch (_) {
      this.#worker = null;
    }
  }

  #requestEval() {
    const text = this.#extractText();
    if (!text.trim() || !this.#anchors.length) {
      this.#resultsById = new Map();
      this.#inlineResultsById = new Map();
      this.#injectResults();
      this.#emit([]);
      return;
    }

    const statements = this.#anchors.map(anchor => ({
      statementId: anchor.id,
      source: anchor.source,
    }));

    if (this.#worker) {
      const requestId = ++this.#evalRequestId;
      this.#worker.postMessage({ requestId, statements });
      return;
    }

    this.#evaluateOnMainThread(statements);
  }

  async #evaluateOnMainThread(statements) {
    if (this.#evaluating) return;

    this.#evaluating = true;
    try {
      const next = new Map();
      const inlineNext = new Map();
      const emitted = [];
      const env = new Env();

      for (const statement of statements) {
        if (!statement?.source?.trim()) continue;
        try {
          const result = await execute(statement.source, env);
          if (isFunctionDefinitionSource(statement.source)) {
            const functionBadge = {
              statementId: statement.statementId,
              resultText: 'ƒ',
              kind: 'function',
            };
            next.set(statement.statementId, functionBadge);
          } else if (result !== undefined && result !== null) {
            const resultText = serialize(result);
            next.set(statement.statementId, { statementId: statement.statementId, resultText });
            emitted.push(resultText);
          }

          const inlineExpressions = extractInlineExpressions(statement.source, statement.statementId);
          for (const inline of inlineExpressions) {
            if (!inline.expr) continue;
            try {
              const inlineResult = await execute(inline.expr, env);
              if (inlineResult === undefined || inlineResult === null) continue;
              inlineNext.set(inline.inlineId, {
                inlineId: inline.inlineId,
                resultText: serialize(inlineResult),
              });
            } catch (error) {
              inlineNext.set(inline.inlineId, {
                inlineId: inline.inlineId,
                resultText: '!',
                errorText: String(error?.message || error),
              });
            }
          }
        } catch (_) {
          // Scoped behavior: skip statement failures silently.
        }
      }

      this.#resultsById = next;
      this.#inlineResultsById = inlineNext;
      this.#injectResults();
      this.#emit(emitted);
    } catch (e) {
      this.#emitError(e);
    } finally {
      this.#evaluating = false;
    }
  }

  #emit(results) {
    this.dispatchEvent(new CustomEvent('change', { detail: { results }, bubbles: true, composed: true }));
  }

  #emitError(error) {
    this.dispatchEvent(new CustomEvent('error', { detail: { error }, bubbles: true, composed: true }));
  }

  // ── undo/redo (text+caret snapshots) ──────────────────────────────────────

  #pushHistory(text, cursor) {
    this.#history = this.#history.slice(0, this.#historyIndex + 1);
    this.#history.push({ text, cursor: cursor ?? 0 });
    if (this.#history.length > 200) this.#history.shift();
    this.#historyIndex = this.#history.length - 1;
  }

  #undo() {
    if (this.#historyIndex <= 0) return;
    const { text, cursor } = this.#history[--this.#historyIndex];
    this.#applySource(text, cursor);
    this.#scheduleEval();
  }

  #redo() {
    if (this.#historyIndex >= this.#history.length - 1) return;
    const { text, cursor } = this.#history[++this.#historyIndex];
    this.#applySource(text, cursor);
    this.#scheduleEval();
  }

  // ── event handlers ────────────────────────────────────────────────────────

  #onBeforeInput() {
    // Snapshot text+caret before browser DOM mutation.
    const text = this.#extractText();
    const cursor = getCursorOffset(this.#editable, this.#shadow);
    this.#pushHistory(text, cursor);
    this.#lastText = text;
  }

  #onInput() {
    if (this.#rendering) return;
    this.#hideTooltip();

    const text = this.#extractText();
    if (text === this.#lastText) return;

    const cursor = getCursorOffset(this.#editable, this.#shadow) ?? text.length;
    this.#applySource(text, cursor);
    this.#scheduleEval();
  }

  #onKeydown(e) {
    this.#hideTooltip();
    const meta = e.metaKey || e.ctrlKey;

    if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.#undo(); return; }
    if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); this.#redo(); return; }

    if (meta && e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(this.#debounce);
      this.#requestEval();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  }

  #onMouseDown(e) {
    const copyBtn = e.target instanceof Element ? e.target.closest('[data-copy-btn]') : null;
    if (!copyBtn) return;
    e.preventDefault();
  }

  async #copyText(value) {
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

  #setCopyFeedback(resultNode, copyBtn, ok) {
    if (!resultNode || !copyBtn) return;
    if (this.#copyFeedbackTimer) clearTimeout(this.#copyFeedbackTimer);

    resultNode.dataset.copyState = ok ? 'copied' : 'error';
    resultNode.dataset.copyLabel = ok ? 'Copied' : 'Copy failed';
    copyBtn.textContent = ok ? '✓' : '!';

    this.#copyFeedbackTimer = setTimeout(() => {
      if (!resultNode.isConnected || !copyBtn.isConnected) return;
      delete resultNode.dataset.copyState;
      delete resultNode.dataset.copyLabel;
      copyBtn.textContent = '⧉';
      this.#copyFeedbackTimer = null;
    }, 900);
  }

  async #onClick(e) {
    const copyBtn = e.target instanceof Element ? e.target.closest('[data-copy-btn]') : null;
    if (!copyBtn) return;
    e.preventDefault();
    e.stopPropagation();

    const resultNode = copyBtn.closest('[data-result]');
    const value = resultNode?.dataset.copyValue || '';
    if (!value) return;

    const ok = await this.#copyText(value);
    this.#setCopyFeedback(resultNode, copyBtn, ok);
  }

  #clearTooltipTimer() {
    if (!this.#tooltipTimer) return;
    clearTimeout(this.#tooltipTimer);
    this.#tooltipTimer = null;
  }

  #hideTooltip() {
    this.#clearTooltipTimer();
    this.#tooltipTarget = null;
    if (this.#tooltip) this.#tooltip.style.display = 'none';
  }

  #positionTooltip(x, y) {
    if (!this.#tooltip || this.#tooltip.style.display === 'none') return;
    const hostRect = this.getBoundingClientRect();
    const pad = 8;
    const tipW = this.#tooltip.offsetWidth || 0;
    const tipH = this.#tooltip.offsetHeight || 0;

    let left = x + 12;
    let top = y + 14;
    if (left + tipW > hostRect.width - pad) left = Math.max(pad, hostRect.width - tipW - pad);
    if (top + tipH > hostRect.height - pad) top = Math.max(pad, y - tipH - 10);

    this.#tooltip.style.left = `${left}px`;
    this.#tooltip.style.top = `${top}px`;
  }

  #showTooltip(label, x, y, target) {
    if (!this.#tooltip || !label) return;
    this.#tooltip.textContent = label;
    this.#tooltip.style.display = 'block';
    this.#tooltipTarget = target;
    this.#positionTooltip(x, y);
  }

  #onMouseMove(e) {
    const node = e.target instanceof Element
      ? e.target.closest('[data-token-type], [data-tooltip]')
      : null;
    if (!node) {
      this.#hideTooltip();
      return;
    }

    const hostRect = this.getBoundingClientRect();
    const x = e.clientX - hostRect.left;
    const y = e.clientY - hostRect.top;
    const label = node.dataset.tooltip || node.dataset.tokenType || '';
    if (!label) {
      this.#hideTooltip();
      return;
    }

    if (this.#tooltipTarget === node && this.#tooltip.style.display !== 'none') {
      this.#positionTooltip(x, y);
      return;
    }

    this.#clearTooltipTimer();
    this.#tooltipTimer = setTimeout(() => {
      this.#showTooltip(label, x, y, node);
    }, 150);
  }
}

customElements.define('tenx-editor-ce', TenXEditor);

export default TenXEditor;
