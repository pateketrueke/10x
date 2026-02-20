/**
 * <tenx-editor> — zero-dependency contenteditable custom element
 *
 * Features:
 *   - Syntax highlighting via the 10x Scanner (raw token stream)
 *   - Inline result widgets injected after each top-level expression
 *   - Cursor preservation across re-renders
 *   - Basic undo via beforeinput + manual history stack
 *
 * Public API:
 *   el.value          — get/set source text
 *   el.addEventListener('change', e => e.detail.results)
 *   el.addEventListener('error',  e => e.detail.error)
 */

import { Parser, Env, execute, serialize } from '../dist/main.js';

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

function tokenText(token) {
  const n = SYMBOL_NAME(token.type);
  // boolean/null literals stored as actual JS values
  if (n === 'LITERAL') {
    if (token.value === null)  return ':nil';
    if (token.value === true)  return ':on';
    if (token.value === false) return ':off';
  }
  const v = token.value;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  // Token objects or other non-primitives — use their text property if available
  if (v && typeof v === 'object' && !Array.isArray(v)) return '';
  return v != null ? String(v) : '';
}

// ─── Cursor save/restore (Shadow DOM aware) ───────────────────────────────────

function getSelection(root) {
  // Modern browsers support shadowRoot.getSelection()
  if (root.getSelection) return root.getSelection();
  return window.getSelection();
}


function getCursorOffset(root, shadowRoot) {
  const sel = getSelection(shadowRoot);
  if (!sel || !sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  const targetNode = range.startContainer;
  const targetOffset = range.startOffset;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if ('result' in (node.dataset ?? {})) return NodeFilter.FILTER_REJECT;
          if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_SKIP;
        }
        if (node.parentElement?.closest('[data-result]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let offset = 0;
  let node;
  while ((node = walker.nextNode())) {
    if (node === targetNode) return offset + targetOffset;
    offset += node.tagName === 'BR' ? 1 : node.textContent.length;
  }
  return null;
}

function setCursorOffset(root, shadowRoot, offset) {
  if (offset === null || offset === undefined) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if ('result' in (node.dataset ?? {})) return NodeFilter.FILTER_REJECT;
          if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_SKIP;
        }
        if (node.parentElement?.closest('[data-result]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let remaining = offset;
  let node;

  while ((node = walker.nextNode())) {
    if (node.tagName === 'BR') {
      if (remaining === 0) {
        // place cursor before the <br> (end of previous text node is not available here,
        // so place after the previous sibling text node if any)
        const range = document.createRange();
        range.setStartBefore(node);
        range.collapse(true);
        const sel = getSelection(shadowRoot);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      remaining -= 1;
    } else {
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
  }

  // fallback: end of content
  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  const sel = getSelection(shadowRoot);
  sel.removeAllRanges();
  sel.addRange(range);
}

// ─── Token rendering ──────────────────────────────────────────────────────────

// Append text (possibly containing \n) to parent, splitting on newlines → <br>
function appendText(parent, text, cls) {
  if (!text) return;
  const parts = text.split('\n');
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) {
      if (cls) {
        const span = document.createElement('span');
        span.className = cls;
        span.textContent = parts[i];
        parent.appendChild(span);
      } else {
        parent.appendChild(document.createTextNode(parts[i]));
      }
    }
    if (i < parts.length - 1) parent.appendChild(document.createElement('br'));
  }
}

function appendToken(parent, token) {
  if (!token) return;

  const n = SYMBOL_NAME(token.type ?? '');
  if (n === 'EOF') return;
  // EOL = semicolon ';' — render as text, not a line break
  if (n === 'EOL') { parent.appendChild(document.createTextNode(';')); return; }

  // Tokens with array values (TEXT buffer, interpolated strings, markup, etc.)
  if (Array.isArray(token.value)) {
    const cls = tokenClass(token);
    const wrapper = cls ? document.createElement('span') : parent;
    if (cls) wrapper.className = cls;
    for (const sub of token.value) {
      if (typeof sub === 'string') {
        appendText(wrapper, sub, null);
      } else if (sub && typeof sub === 'object') {
        appendToken(wrapper, sub);
      }
    }
    if (cls) parent.appendChild(wrapper);
    return;
  }

  // TEXT tokens have a .value.buffer array
  if (token.value && typeof token.value === 'object' && Array.isArray(token.value.buffer)) {
    const cls = tokenClass(token);
    for (const chunk of token.value.buffer) {
      if (typeof chunk === 'string') {
        appendText(parent, chunk, cls);
      } else if (chunk && typeof chunk === 'object') {
        appendToken(parent, chunk);
      }
    }
    return;
  }

  const text = tokenText(token);
  if (!text) return;

  appendText(parent, text, tokenClass(token));
}

function renderTokens(source) {
  const frag = document.createDocumentFragment();
  try {
    const tokens = Parser.getAST(source, null);
    for (const token of tokens) appendToken(frag, token);
  } catch (_) {
    // Parse error — fall back to plain text with line splits
    const lines = source.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]) frag.appendChild(document.createTextNode(lines[i]));
      if (i < lines.length - 1) frag.appendChild(document.createElement('br'));
    }
  }
  return frag;
}

// ─── Custom Element ───────────────────────────────────────────────────────────

const STYLES = `
  :host {
    display: block;
    font-family: 'Berkeley Mono', 'Fira Code', 'Cascadia Code', monospace;
    font-size: 14px;
    line-height: 1.7;
    color: #d4d4d4;
  }

  [contenteditable] {
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: #569cd6;
    min-height: 2em;
    padding: 14px 16px;
  }

  [contenteditable]::selection,
  [contenteditable] *::selection { background: #264f78; }

  .xt-number  { color: #b5cea8; }
  .xt-string  { color: #ce9178; }
  .xt-regex   { color: #ce9178; }
  .xt-symbol  { color: #dcdcaa; }
  .xt-literal { color: #dcdcaa; }
  .xt-op      { color: #c586c0; }
  .xt-comment { color: #6a9955; }
  .xt-heading { color: #569cd6; font-weight: bold; }
  .xt-bold    { color: #d4d4d4; font-weight: bold; }
  .xt-italic  { color: #d4d4d4; font-style: italic; }
  .xt-code    { color: #9cdcfe; }
  .xt-text    { color: #d4d4d4; }
  .xt-prose   { color: #c586c0; }
  .xt-punct   { color: #808080; }

  [data-result] {
    display: inline-block;
    margin-left: 1em;
    padding: 1px 6px;
    border-radius: 3px;
    background: #1e3a2f;
    color: #4ec9b0;
    font-size: 12px;
    line-height: 1.6;
    vertical-align: middle;
    user-select: none;
    pointer-events: none;
  }

  [data-result].error {
    background: #3a1e1e;
    color: #f48771;
  }
`;

class TenXEditor extends HTMLElement {
  #shadow;
  #editable;
  #history = [];
  #historyIndex = -1;
  #debounce = null;
  #evaluating = false;
  #lastText = '';
  // flag: we are in the middle of a programmatic re-render, suppress onInput
  #rendering = false;

  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLES;

    this.#editable = document.createElement('div');
    this.#editable.setAttribute('contenteditable', 'true');
    this.#editable.setAttribute('spellcheck', 'false');
    this.#editable.setAttribute('autocorrect', 'off');
    this.#editable.setAttribute('autocapitalize', 'off');

    this.#shadow.appendChild(style);
    this.#shadow.appendChild(this.#editable);

    this.#editable.addEventListener('beforeinput', e => this.#onBeforeInput(e));
    this.#editable.addEventListener('input', () => this.#onInput());
    this.#editable.addEventListener('keydown', e => this.#onKeydown(e));

    const initial = this.textContent.trim() || this.getAttribute('value') || '';
    if (initial) {
      this.#applySource(initial, initial.length);
    } else {
      this.#pushHistory('', 0);
    }
  }

  get value() { return this.#extractText(); }

  set value(text) {
    this.#applySource(text, text.length);
    this.#scheduleEval(text);
  }

  // ── extract plain text (skip result widgets) ──────────────────────────────

  #extractText() {
    const walker = document.createTreeWalker(
      this.#editable,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if ('result' in (node.dataset ?? {})) return NodeFilter.FILTER_REJECT;
            if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
          }
          if (node.parentElement?.closest('[data-result]')) return NodeFilter.FILTER_REJECT;
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

  // ── render source text with syntax highlighting, restore cursor ───────────

  #applySource(source, cursorOffset) {
    this.#rendering = true;
    this.#editable.innerHTML = '';
    this.#editable.appendChild(renderTokens(source));
    this.#lastText = source;
    this.#rendering = false;

    setCursorOffset(this.#editable, this.#shadow, cursorOffset);
  }

  // ── inject result widgets ─────────────────────────────────────────────────

  #injectResults(annotations) {
    this.#editable.querySelectorAll('[data-result]').forEach(el => el.remove());
    if (!annotations.length) return;

    // Build a map of line number → annotation
    const byLine = new Map(annotations.map(a => [a.line, a]));

    // Walk top-level child nodes counting lines (each <br> ends a line)
    const children = [...this.#editable.childNodes];
    let lineIdx = 0;

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      const isBR = node.nodeName === 'BR';
      const isLast = i === children.length - 1;

      if (isBR || isLast) {
        const annotation = byLine.get(lineIdx);
        if (annotation) {
          const text = serialize(annotation.result);
          if (text?.trim()) {
            const widget = document.createElement('span');
            widget.dataset.result = '';
            widget.setAttribute('contenteditable', 'false');
            widget.textContent = `→ ${text}`;
            this.#editable.insertBefore(widget, isBR ? node : null);
          }
        }
        if (isBR) lineIdx++;
      }
    }
  }

  // ── evaluate ──────────────────────────────────────────────────────────────

  #scheduleEval(text) {
    clearTimeout(this.#debounce);
    this.#debounce = setTimeout(() => this.#evaluate(text), 600);
  }

  async #evaluate(text) {
    if (this.#evaluating) return;
    if (!text.trim()) {
      this.#editable.querySelectorAll('[data-result]').forEach(el => el.remove());
      this.#emit([]);
      return;
    }

    this.#evaluating = true;
    try {
      // Use split() chunks to get per-statement source boundaries and line numbers
      const chunks = Parser.getAST(text, true);
      const annotations = [];
      const emitted = [];

      // Shared env so definitions from earlier statements are visible to later ones
      const env = new Env();

      // Find character indices of each top-level semicolon (skipping those in strings)
      const semiPositions = [];
      let inStr = false;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (!inStr && ch === '"') { inStr = true; }
        else if (inStr && ch === '"' && text[i - 1] !== '\\') { inStr = false; }
        else if (!inStr && ch === ';') { semiPositions.push(i); }
      }

      let charPos = 0;
      let semiIdx = 0;
      for (const chunk of chunks) {
        if (!chunk.body.length) continue;

        // Advance to the next semicolon for this chunk
        if (semiIdx >= semiPositions.length) break;
        const semiCharIdx = semiPositions[semiIdx++];
        const chunkSrc = text.slice(charPos, semiCharIdx + 1);
        charPos = semiCharIdx + 1;

        // Get the source line from the last token's tokenInfo
        const lastTok = chunk.body[chunk.body.length - 1];
        const line = lastTok?.tokenInfo?.line ?? 0;

        try {
          const result = await execute(chunkSrc, env);
          if (result !== undefined && result !== null) {
            annotations.push({ line, result });
            emitted.push(result);
          }
        } catch (_) {
          // skip failed statements silently
        }
      }

      this.#injectResults(annotations);
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

  // ── undo/redo ─────────────────────────────────────────────────────────────

  #pushHistory(text, cursor) {
    this.#history = this.#history.slice(0, this.#historyIndex + 1);
    this.#history.push({ text, cursor });
    if (this.#history.length > 200) this.#history.shift();
    this.#historyIndex = this.#history.length - 1;
  }

  #undo() {
    if (this.#historyIndex <= 0) return;
    const { text, cursor } = this.#history[--this.#historyIndex];
    this.#applySource(text, cursor);
    this.#scheduleEval(text);
  }

  #redo() {
    if (this.#historyIndex >= this.#history.length - 1) return;
    const { text, cursor } = this.#history[++this.#historyIndex];
    this.#applySource(text, cursor);
    this.#scheduleEval(text);
  }

  // ── event handlers ────────────────────────────────────────────────────────

  #onBeforeInput() {
    // snapshot text+cursor just before the browser mutates the DOM
    const text = this.#extractText();
    const cursor = getCursorOffset(this.#editable, this.#shadow);
    this.#pushHistory(text, cursor ?? 0);
    this.#lastText = text;
  }

  #onInput() {
    if (this.#rendering) return;

    const text = this.#extractText();
    if (text === this.#lastText) return;

    // save cursor BEFORE re-render wipes the DOM
    const cursor = getCursorOffset(this.#editable, this.#shadow) ?? text.length;

    this.#applySource(text, cursor);
    this.#scheduleEval(text);
  }

  #onKeydown(e) {
    const meta = e.metaKey || e.ctrlKey;

    if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.#undo(); return; }
    if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); this.#redo(); return; }

    if (meta && e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(this.#debounce);
      this.#evaluate(this.#extractText());
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
    }
  }
}

customElements.define('tenx-editor', TenXEditor);
