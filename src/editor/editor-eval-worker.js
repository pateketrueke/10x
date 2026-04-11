import { Env, execute, applyAdapter } from '../main.js';
import { createBrowserAdapter } from '../adapters/browser/index.js';
import { getSignalRegistry, read } from '../runtime/core.js';
import {
  inferRuntimeType,
  formatRuntimeValue,
  formatRuntimeError,
  normalizeUnitLiterals,
  unitLiteralDisplay,
  hasUnitSuffix,
  annotationTypeForSource,
  annotationWarningForSource,
  isFunctionDefinitionSource,
  extractInlineExpressions,
  bootstrapEnv,
} from './editor-runtime-shared.js';

applyAdapter(createBrowserAdapter());

function postRuntimeLog(requestId, level, ...args) {
  self.postMessage({
    requestId,
    runtimeLog: {
      source: 'editor-worker',
      level,
      args,
      ts: Date.now(),
    },
  });
}

function toSerializable(value) {
  try {
    return structuredClone(value);
  } catch (_) {
    return formatRuntimeValue(value, 180);
  }
}

function buildSignalSnapshot() {
  const out = [];
  for (const [name, signal] of getSignalRegistry().entries()) {
    const history = Array.isArray(signal?._history) ? signal._history.slice(-20) : [];
    out.push({
      id: signal?._devtoolsId || null,
      name: String(name),
      moduleUrl: signal?._moduleUrl || 'global',
      value: toSerializable(read(signal)),
      subs: signal?.subs ? signal.subs.size : 0,
      history: history.map(entry => ({
        ts: entry?.ts || Date.now(),
        value: toSerializable(entry?.value),
      })),
    });
  }
  return out;
}

self.addEventListener('message', async ({ data }) => {
  const {
    requestId, statements, skipStatementIds, resetSignals,
  } = data || {};
  if (!requestId) return;

  try {
    if (resetSignals) {
      getSignalRegistry().clear();
    }

    if (!Array.isArray(statements) || !statements.length) {
      self.postMessage({ requestId, done: true, signalSnapshot: [] });
      return;
    }

    const env = new Env();
    await bootstrapEnv(env, execute);

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
        postRuntimeLog(requestId, 'info', '[worker] executing:', statementSource.substring(0, 50));
        const result = await execute(statementSource, env);
        postRuntimeLog(requestId, 'info', '[worker] result:', JSON.stringify(result).substring(0, 200));
        if (isFunctionDefinitionSource(statementSource)) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: 'ƒ',
            kind: 'function',
            typeText: 'fn',
          };
        } else if (result !== undefined && result !== null) {
          const resultText = formatRuntimeValue(result, 180);
          const displayText = unitDisplay && !hasUnitSuffix(resultText) ? unitDisplay : resultText;
          const runtimeType = inferRuntimeType(result);
          const annotationType = annotationTypeForSource(statement.source, env);
          const annotationWarning = annotationWarningForSource(statement.source, env, runtimeType);
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: displayText,
            typeText: annotationType || runtimeType,
            annotationWarning,
          };
        }

        const inlineResults = [];
        const inlineExpressions = extractInlineExpressions(statementSource, statement.statementId);
        for (const inline of inlineExpressions) {
          if (!inline.expr) continue;
          const inlineSource = normalizeUnitLiterals(inline.expr);
          try {
            const inlineResult = await execute(inlineSource, env);
            if (inlineResult === undefined || inlineResult === null) continue;

            const compactInline = formatRuntimeValue(inlineResult, 120);
            if (!compactInline?.trim()) continue;

            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: compactInline,
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

        if (unitDisplay && (!partial.statementResult || !partial.statementResult.resultText?.trim())) {
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

    const signalSnapshot = buildSignalSnapshot();
    self.postMessage({ requestId, done: true, signalSnapshot });
  } catch (error) {
    self.postMessage({ requestId, error: String(error?.message || error) });
  }
});
