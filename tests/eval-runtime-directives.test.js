import { describe, test, expect } from 'bun:test';
import { Env, execute as run, applyAdapter } from '../src/main.js';
import { createBrowserAdapter } from '../src/adapters/browser/index.js';

applyAdapter(createBrowserAdapter());

describe('Eval Runtime Directives', () => {
  test('should execute @signal/@render/@on directives in interpreter mode', async () => {
    const node = {
      innerHTML: '',
      firstChild: null,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    const documentListeners = {};
    const originalDocument = globalThis.document;

    globalThis.document = {
      querySelector: selector => (selector === '#app' ? node : null),
      addEventListener: (name, fn) => { documentListeners[name] = fn; },
      removeEventListener: name => { delete documentListeners[name]; },
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      createElement: () => ({
        appendChild: () => {},
        insertBefore: () => {},
        style: {},
      }),
    };

    try {
      const env = new Env();
      await run('@import signal, read, html, render, on @from "Runtime".', env);

      const source = `
count = @signal 0.
@render "#app" @html "<button id='inc'>#{count}</button>".
@on :click "#inc" count = count + 1.
`;

      await run(source, env);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(run.failure).toBeFalsy();
      expect(node.innerHTML).toContain('0');

      documentListeners.click({
        target: {
          closest: selector => (selector === '#inc' ? {} : null),
        },
      });
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(node.innerHTML).toContain('1');
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
