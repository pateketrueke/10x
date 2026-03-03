import { Env, execute, serialize, applyAdapter } from '../main.js';
import { createBrowserAdapter } from '../adapters/browser/index.js';

applyAdapter(createBrowserAdapter());

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

self.addEventListener('message', async ({ data }) => {
  const { requestId, statements, skipStatementIds } = data || {};
  if (!requestId) return;

  try {
    if (!Array.isArray(statements) || !statements.length) {
      self.postMessage({ requestId, done: true });
      return;
    }

    const env = new Env();

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
        const result = await execute(statement.source, env);
        if (isFunctionDefinitionSource(statement.source)) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: 'ƒ',
            kind: 'function',
          };
        } else if (result !== undefined && result !== null) {
          partial.statementResult = {
            statementId: statement.statementId,
            resultText: serialize(result),
          };
        }

        const inlineResults = [];
        const inlineExpressions = extractInlineExpressions(statement.source, statement.statementId);
        for (const inline of inlineExpressions) {
          if (!inline.expr) continue;
          try {
            const inlineResult = await execute(inline.expr, env);
            if (inlineResult === undefined || inlineResult === null) continue;
            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: serialize(inlineResult),
            });
          } catch (error) {
            inlineResults.push({
              inlineId: inline.inlineId,
              resultText: '!',
              errorText: String(error?.message || error),
            });
          }
        }

        if (inlineResults.length) {
          partial.inlineResults = inlineResults;
        }
      } catch (_) {
        // keep old behavior: skip failed statements
      }

      self.postMessage(partial);
    }

    self.postMessage({ requestId, done: true });
  } catch (error) {
    self.postMessage({ requestId, error: String(error?.message || error) });
  }
});
