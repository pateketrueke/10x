import { Env, execute, applyAdapter } from '../main.js';
import { createBrowserAdapter } from '../adapters/browser/index.js';
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

self.addEventListener('message', async ({ data }) => {
  const { requestId, statements, skipStatementIds } = data || {};
  if (!requestId) return;

  try {
    if (!Array.isArray(statements) || !statements.length) {
      self.postMessage({ requestId, done: true });
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
        const result = await execute(statementSource, env);
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

    self.postMessage({ requestId, done: true });
  } catch (error) {
    self.postMessage({ requestId, error: String(error?.message || error) });
  }
});
