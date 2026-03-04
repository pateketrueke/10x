import { Env, execute, compact, applyAdapter } from '../main.js';
import { createBrowserAdapter } from '../adapters/browser/index.js';

applyAdapter(createBrowserAdapter());

const SYMBOL_NAME = sym => {
  if (!sym || typeof sym !== 'symbol') return '';
  return sym.toString().match(/Symbol\((.+)\)/)?.[1] ?? '';
};

function inferTokenType(token) {
  if (!token) return 'unknown';

  if (token.isCallable || token.isFunction) return 'fn';
  if (token.isTag) return 'tag';
  if (token.isObject) {
    const shape = token.valueOf ? token.valueOf() : token.value;
    if (shape && typeof shape === 'object' && shape.__tag && shape.value) return 'result';
    return 'record';
  }
  if (token.isRange) return Array.isArray(token.value) ? 'list' : 'range';
  if (token.isNumber) return 'number';
  if (token.isString) return 'string';
  if (token.isSymbol) return 'symbol';

  const symbol = SYMBOL_NAME(token.type);
  return symbol ? symbol.toLowerCase() : 'unknown';
}

function inferRuntimeType(value) {
  if (value === null) return 'nil';
  if (value === undefined) return 'unknown';

  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'function') return 'fn';

  if (Array.isArray(value)) {
    if (!value.length) return 'list<unknown>';

    // Eval returns an array of tokens; expose single-value type directly.
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

function compactResultText(value, max = 180) {
  const text = String(value ?? '').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(1, max - 1)).trim()}…`;
}

function formatRuntimeError(error) {
  const message = String(error?.message || error || 'Runtime error');
  return compactResultText(message, 160);
}

function normalizeUnitLiterals(source) {
  return String(source || '').replace(/\b(\d+(?:\.\d+)?)([A-Za-z]{1,5})\b/g, '$1 $2');
}

function unitLiteralDisplay(source) {
  const match = String(source || '').trim().match(/^(-?\d+(?:\.\d+)?)\s*([A-Za-z]{1,5})\.?$/);
  if (!match) return '';
  return `${match[1]} ${match[2]}`;
}

function isFunctionDefinitionSource(source) {
  const normalized = String(source || '').replace(/\s+/g, ' ').trim();
  return /^[^=]+=\s*.*->/.test(normalized);
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
    });
  }

  return expressions;
}

const EDITOR_BOOTSTRAP = '@import to @from "Unit".';

async function bootstrapEnv(env) {
  if (!env || env.__xEditorBootstrapDone) return;
  env.__xEditorBootstrapDone = true;

  try {
    await execute(EDITOR_BOOTSTRAP, env);
  } catch (_) {
    // Keep editor resilient when optional imports fail.
  }
}

self.addEventListener('message', async ({ data }) => {
  const { requestId, statements, skipStatementIds } = data || {};
  if (!requestId) return;

  try {
    if (!Array.isArray(statements) || !statements.length) {
      self.postMessage({ requestId, done: true });
      return;
    }

    const env = new Env();
    await bootstrapEnv(env);

    const skipped = new Set(Array.isArray(skipStatementIds) ? skipStatementIds : []);

    for (const statement of statements) {
      if (!statement?.statementId || !statement?.source?.trim()) {
        continue;
      }
      if (skipped.has(statement.statementId)) continue;

      self.postMessage({
        requestId,
        statementId: statement.statementId,
        start: true,
      });

      const partial = {
        requestId,
        statementId: statement.statementId,
        completed: true,
      };

      try {
        const statementSource = normalizeUnitLiterals(statement.source);
        const unitDisplay = unitLiteralDisplay(statementSource);
        const result = await execute(statementSource, env);
        if (isFunctionDefinitionSource(statementSource)) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: 'ƒ',
            kind: 'function',
            typeText: 'fn',
          };
        } else if (result !== undefined && result !== null) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: compact(result, 180),
            typeText: inferRuntimeType(result),
          };
        }

        const inlineResults = [];
        const inlineExpressions = extractInlineExpressions(statementSource, statement.statementId);
        for (const inline of inlineExpressions) {
          if (!inline.expr) continue;
          try {
            const inlineResult = await execute(inline.expr, env);
            if (inlineResult === undefined || inlineResult === null) continue;
            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: compact(inlineResult, 120),
              typeText: inferRuntimeType(inlineResult),
            });
          } catch (error) {
            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: '!',
              errorText: formatRuntimeError(error),
            });
          }
        }

        if (inlineResults.length) {
          partial.inlineResults = inlineResults;
        }

        if (!partial.statementResult && unitDisplay) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: unitDisplay,
            typeText: 'unit',
          };
        }
      } catch (error) {
        partial.statementResult = {
          statementId: statement.statementId,
          resultText: `! ${formatRuntimeError(error)}`,
          errorText: formatRuntimeError(error),
          typeText: 'error',
        };
      }

      self.postMessage(partial);
    }

    self.postMessage({ requestId, done: true });
  } catch (error) {
    self.postMessage({ requestId, error: String(error?.message || error) });
  }
});
