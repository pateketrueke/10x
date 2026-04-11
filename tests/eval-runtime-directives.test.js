import { describe, test, expect } from 'bun:test';
import { Env, execute as run, applyAdapter } from '../src/main.js';
import { createBrowserAdapter } from '../src/adapters/browser/index.js';

applyAdapter(createBrowserAdapter());

describe('Eval Runtime Directives', () => {
  test('should treat style tag braces as raw text in interpreter mode', async () => {
    const env = new Env();
    await run('<style>button { padding: 1rem; margin: 0; }</style>.', env);

    expect(run.failure).toBeFalsy();
    expect(Array.isArray(run.value)).toBe(true);
    expect(run.value.length).toBe(1);
  });

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

  test('should execute @shadow render/on directives in interpreter mode', async () => {
    const rootListeners = {};
    let shadowChildren = [];
    const host = {
      shadowRoot: null,
      attachShadow: () => {
        const shadowRoot = {
          outlet: null,
          get innerHTML() {
            return '';
          },
          set innerHTML(_) {
            shadowChildren = [];
            shadowRoot.outlet = null;
          },
          addEventListener: (name, fn) => { rootListeners[name] = fn; },
          removeEventListener: name => { delete rootListeners[name]; },
          appendChild: (node) => {
            shadowChildren.push(node);
            shadowRoot.outlet = node;
          },
        };
        host.shadowRoot = shadowRoot;
        return shadowRoot;
      },
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      querySelector: selector => (selector === '#host' ? host : null),
      addEventListener: () => {},
      removeEventListener: () => {},
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      createElement: () => ({
        innerHTML: '',
        firstChild: null,
        appendChild: () => {},
        insertBefore: () => {},
        style: {},
      }),
    };

    try {
      const env = new Env();
      await run('@import signal, html, renderShadow, on @from "Runtime".', env);

      const source = `
count = @signal 0.
@render "#host" @shadow @html "<button id='inc'>#{count}</button>".
@on :click "#inc" @shadow count = count + 1.
`;

      await run(source, env);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(run.failure).toBeFalsy();
      expect(host.shadowRoot).toBeTruthy();
      expect(shadowChildren.length).toBe(1);
      expect(host.shadowRoot.outlet.innerHTML).toContain('0');

      rootListeners.click({
        target: {
          closest: selector => (selector === '#inc' ? {} : null),
        },
      });
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(host.shadowRoot.outlet.innerHTML).toContain('1');

      await run(source, env);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(shadowChildren.length).toBe(1);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  test('should still support legacy @on shadow ordering', async () => {
    const rootListeners = {};
    let shadowChildren = [];
    const host = {
      shadowRoot: null,
      attachShadow: () => {
        const shadowRoot = {
          outlet: null,
          get innerHTML() {
            return '';
          },
          set innerHTML(_) {
            shadowChildren = [];
            shadowRoot.outlet = null;
          },
          addEventListener: (name, fn) => { rootListeners[name] = fn; },
          removeEventListener: name => { delete rootListeners[name]; },
          appendChild: (node) => {
            shadowChildren.push(node);
            shadowRoot.outlet = node;
          },
        };
        host.shadowRoot = shadowRoot;
        return shadowRoot;
      },
    };

    const originalDocument = globalThis.document;
    globalThis.document = {
      querySelector: selector => (selector === '#host' ? host : null),
      addEventListener: () => {},
      removeEventListener: () => {},
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      createElement: () => ({
        innerHTML: '',
        firstChild: null,
        appendChild: () => {},
        insertBefore: () => {},
        style: {},
      }),
    };

    try {
      const env = new Env();
      await run('@import signal, html, renderShadow, on @from "Runtime".', env);

      const source = `
count = @signal 0.
@render "#host" @shadow @html "<button id='inc'>#{count}</button>".
@on :click "#inc" count = count + 1 @shadow.
`;

      await run(source, env);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(run.failure).toBeFalsy();
      expect(shadowChildren.length).toBe(1);
      expect(host.shadowRoot.outlet.innerHTML).toContain('0');

      rootListeners.click({
        target: {
          closest: selector => (selector === '#inc' ? {} : null),
        },
      });
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(host.shadowRoot.outlet.innerHTML).toContain('1');
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
