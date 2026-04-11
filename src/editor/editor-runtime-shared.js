import { compact } from '../main.js';
import {
  ensureDefaultMappings,
  DEFAULT_MAPPINGS,
  DEFAULT_INFLECTIONS,
} from '../lib/builtins.js';

export const SYMBOL_NAME = sym => {
  if (!sym || typeof sym !== 'symbol') return '';
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? '';
};

let symbolCatalogReady = false;

function ensureSymbolCatalog() {
  if (symbolCatalogReady) return;
  symbolCatalogReady = true;
  ensureDefaultMappings();
}

export function catalogSymbolHint(symbolText) {
  const raw = String(symbolText || '').trim();
  if (!raw.startsWith(':') || raw.length < 2) return '';

  ensureSymbolCatalog();

  const key = raw.slice(1).toLowerCase();
  const canonical = DEFAULT_MAPPINGS[key] || DEFAULT_MAPPINGS[raw.slice(1)] || '';
  if (!canonical) return '';

  const forms = DEFAULT_INFLECTIONS[canonical];
  if (Array.isArray(forms) && forms.length) {
    const preferred = forms[1] || forms[0] || '';
    return String(preferred || '').trim();
  }

  return '';
}

function unitKindFromToken(token) {
  const kind = token?.value?.value?.kind ?? token?.value?.kind;
  if (typeof kind === 'string' && kind.trim()) return kind.trim();

  const asText = String(token?.value?.toString?.() ?? '');
  const match = asText.match(/[A-Za-z]{1,10}$/);
  return match?.[0] || '';
}

export function inferTokenType(token) {
  if (!token) return 'unknown';

  if (token.isCallable || token.isFunction) return 'fn';
  if (token.isTag) return 'tag';
  if (token.isObject) {
    const shape = token.valueOf ? token.valueOf() : token.value;
    if (shape && typeof shape === 'object' && shape.__tag && shape.value) return 'result';
    return 'record';
  }
  if (token.isRange) return Array.isArray(token.value) ? 'list' : 'range';
  if (token.isNumber) {
    const unitKind = unitKindFromToken(token);
    if (unitKind) return `unit<${unitKind}>`;
    return 'number';
  }
  if (token.isString) return 'string';
  if (token.isSymbol) return 'symbol';

  const symbol = SYMBOL_NAME(token.type);
  return symbol ? symbol.toLowerCase() : 'unknown';
}

export function inferRuntimeType(value) {
  if (value === null) return 'nil';
  if (value === undefined) return 'unknown';

  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'function') return 'fn';

  if (Array.isArray(value)) {
    if (!value.length) return 'list<unknown>';
    if (value.length === 1) return inferRuntimeType(value[0]);

    const sample = value.find(Boolean);
    const inner = sample ? inferRuntimeType(sample) : 'unknown';
    return `list<${inner}>`;
  }

  if (value && typeof value === 'object' && typeof value.type === 'symbol') {
    return inferTokenType(value);
  }

  if (value && typeof value === 'object') {
    if (value.__tag && value.value) return 'result';
    return 'record';
  }

  return 'unknown';
}

export function compactResultText(value, max = 180) {
  const text = String(value ?? '').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(1, max - 1)).trim()}…`;
}

export function isUnitToken(token) {
  return SYMBOL_NAME(token?.type) === 'NUMBER'
    && token?.value
    && typeof token.value.toString === 'function'
    && /[A-Za-z]/.test(String(token.value.toString()));
}

export function formatRuntimeValue(value, max = 180) {
  if (Array.isArray(value) && value.length === 1 && isUnitToken(value[0])) {
    return compactResultText(value[0].value.toString(), max);
  }
  if (isUnitToken(value)) {
    return compactResultText(value.value.toString(), max);
  }
  return compact(value, max);
}

export function formatRuntimeError(error) {
  const message = String(error?.message || error || 'Runtime error');
  return compactResultText(message, 160);
}

export function normalizeUnitLiterals(source) {
  return String(source || '').replace(/\b(\d+(?:\.\d+)?)([A-Za-z]{1,5})\b/g, '$1 $2');
}

export function unitLiteralDisplay(source) {
  const match = String(source || '').trim().match(/^(-?\d+(?:\.\d+)?)\s*([A-Za-z]{1,5})\.?$/);
  if (!match) return '';
  return `${match[1]} ${match[2]}`;
}

export function hasUnitSuffix(text) {
  return /[A-Za-z]/.test(String(text || ''));
}

export function isFunctionDefinitionSource(source) {
  const normalized = String(source || '').replace(/\s+/g, ' ').trim();
  return /^[^=]+=\s*.*->/.test(normalized);
}

export function assignedNameFromSource(source) {
  const text = String(source || '');
  const match = text.match(/^\s*([A-Za-z_][A-Za-z0-9_!?-]*)\s*=/);
  return match ? match[1] : '';
}

export function annotationTypeForSource(source, env) {
  const name = assignedNameFromSource(source);
  if (!name || !env || typeof env.getAnnotation !== 'function') return '';
  const ann = env.getAnnotation(name);
  return ann ? String(ann) : '';
}

function canonicalTypeName(typeName) {
  const text = String(typeName || '').trim().toLowerCase();
  if (!text) return '';
  if (text === 'num' || text === 'number') return 'number';
  if (text === 'str' || text === 'string') return 'string';
  if (text === 'bool' || text === 'boolean') return 'boolean';
  if (text.startsWith('unit<') && text.endsWith('>')) return 'number';
  if (text === 'list' || text.startsWith('list<')) return 'list';
  return text;
}

function prettyTypeName(typeName) {
  const canon = canonicalTypeName(typeName);
  if (canon === 'number') return 'num';
  if (canon === 'string') return 'str';
  if (canon === 'boolean') return 'bool';
  if (canon === 'list') return 'list';
  return String(typeName || '').trim() || 'unknown';
}

export function annotationWarningForSource(source, env, runtimeType) {
  const expected = annotationTypeForSource(source, env);
  if (!expected) return null;

  const inferred = String(runtimeType || '').trim();
  if (!inferred || inferred === 'unknown') return null;

  const expectedCanon = canonicalTypeName(expected);
  const inferredCanon = canonicalTypeName(inferred);
  if (!expectedCanon || !inferredCanon || expectedCanon === inferredCanon) return null;

  return {
    expectedType: expected,
    runtimeType: inferred,
    message: `Type mismatch: expected ${prettyTypeName(expected)}, got ${prettyTypeName(inferred)}`,
  };
}

export function annotationHintFromSource(source) {
  const text = String(source || '').trim();
  const match = text.match(/^([A-Za-z_][A-Za-z0-9_!?-]*)\s*::\s*(.+?)\.\s*$/s);
  if (!match) return null;
  return {
    name: match[1],
    typeText: match[2].trim(),
  };
}

export function extractInlineExpressions(source, statementId = '') {
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
      insertOffset: match.index + match[0].length - 1,
    });
  }

  return expressions;
}

export const EDITOR_BOOTSTRAP = `
@import to @from "Unit".
@from "Prelude" @import (map, filter, take, drop, head, tail, size, keys, vals, pairs, rev, list, push, show).
@import signal, read, html, render, renderShadow, h, style, on @from "Runtime".
`;

export function emitEditorRuntimeLog(level, ...args) {
  const sink = globalThis.__10x_runtime_log;
  if (typeof sink !== 'function') return;
  try {
    sink({
      source: 'editor-main',
      level,
      args,
      ts: Date.now(),
    });
  } catch (_) {
    // no-op
  }
}

export async function bootstrapEnv(env, executeFn) {
  if (!env || env.__xEditorBootstrapDone) return;
  env.__xEditorBootstrapDone = true;

  emitEditorRuntimeLog('info', '[editor] bootstrapping env...');
  const result = await executeFn(EDITOR_BOOTSTRAP, env);
  if (executeFn.failure) {
    emitEditorRuntimeLog('error', '[editor] bootstrap error:', executeFn.failure);
    return;
  }
  emitEditorRuntimeLog('info', '[editor] bootstrap done', result);
  emitEditorRuntimeLog('debug', '[editor] render available:', env.has('render', true));
}
