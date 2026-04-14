import { describe, test, expect } from 'bun:test';
import { Env, execute as run, applyAdapter, createBrowserAdapter } from '../src/main.js';

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
    const createMockElement = (tagName = 'DIV') => {
      const children = [];
      const el = {
        nodeType: 1,
        childNodes: children,
        firstChild: null,
        tagName: tagName.toUpperCase(),
        appendChild: (child) => {
          children.push(child);
          el.firstChild = children[0];
          return child;
        },
        insertBefore: (child, ref) => {
          const idx = ref ? children.indexOf(ref) : 0;
          if (idx >= 0) children.splice(idx, 0, child);
          else children.push(child);
          el.firstChild = children[0];
          return child;
        },
        setAttribute: () => {},
        style: {},
        get textContent() {
          return children.map(c => c.textContent || c.nodeValue || '').join('');
        },
        get innerHTML() {
          return children.map(c => {
            if (c.nodeType === 3) return c.nodeValue;
            if (c.tagName) {
              const content = c.textContent || '';
              return `<${c.tagName.toLowerCase()}>${content}</${c.tagName.toLowerCase()}>`;
            }
            return '';
          }).join('');
        },
      };
      return el;
    };

    const createMockTextNode = (text) => ({
      nodeType: 3,
      nodeValue: text,
      textContent: text,
    });

    const rootChildren = [];
    const node = {
      get innerHTML() {
        return rootChildren.map(c => {
          if (c.nodeType === 3) return c.nodeValue;
          if (c.tagName) {
            const content = c.textContent || '';
            return `<${c.tagName.toLowerCase()}>${content}</${c.tagName.toLowerCase()}>`;
          }
          return '';
        }).join('');
      },
      set innerHTML(v) { rootChildren.length = 0; rootChildren.push(createMockTextNode(v)); },
      get firstChild() { return rootChildren[0] || null; },
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: (child) => {
        rootChildren.push(child);
        return child;
      },
      childNodes: rootChildren,
    };
    const documentListeners = {};
    const originalDocument = globalThis.document;

    globalThis.document = {
      querySelector: selector => (selector === '#app' ? node : null),
      addEventListener: (name, fn) => { documentListeners[name] = fn; },
      removeEventListener: name => { delete documentListeners[name]; },
      head: { appendChild: () => {} },
      body: { appendChild: () => {} },
      createElement: createMockElement,
      createTextNode: createMockTextNode,
    };

    try {
      const env = new Env();
      await run('@import signal, read, html, render, on @from "Runtime".', env);

      const source = `
count = @signal 0.
@render "#app" @html <button id="inc">#{count}</button>.
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
    const createMockElement = (tagName = 'DIV') => {
      const children = [];
      const el = {
        nodeType: 1,
        childNodes: children,
        firstChild: null,
        tagName: tagName.toUpperCase(),
        appendChild: (child) => {
          children.push(child);
          el.firstChild = children[0];
          return child;
        },
        insertBefore: (child, ref) => {
          const idx = ref ? children.indexOf(ref) : 0;
          if (idx >= 0) children.splice(idx, 0, child);
          else children.push(child);
          el.firstChild = children[0];
          return child;
        },
        setAttribute: () => {},
        style: {},
        get textContent() {
          return children.map(c => c.textContent || c.nodeValue || '').join('');
        },
        set textContent(value) {
          children.length = 0;
          if (value !== null && value !== undefined && value !== '') {
            children.push({
              nodeType: 3,
              nodeValue: String(value),
              textContent: String(value),
            });
          }
          el.firstChild = children[0] || null;
        },
        get innerHTML() {
          return children.map(c => {
            if (c.nodeType === 3) return c.nodeValue;
            if (c.tagName) {
              const content = c.textContent || '';
              return `<${c.tagName.toLowerCase()}>${content}</${c.tagName.toLowerCase()}>`;
            }
            return '';
          }).join('');
        },
      };
      return el;
    };

    const createMockTextNode = (text) => {
      const node = {
        nodeType: 3,
        _value: text,
        get nodeValue() { return node._value; },
        set nodeValue(v) { node._value = v; },
        get textContent() { return node._value; },
        set textContent(v) { node._value = v; },
      };
      return node;
    };

    const rootListeners = {};
    let shadowChildren = [];
    const host = {
      shadowRoot: null,
      attachShadow: () => {
        const shadowRoot = {
          outlet: null,
          get innerHTML() {
            return shadowChildren.map(c => {
              if (c.nodeType === 3) return c.nodeValue;
              if (c.tagName) {
                const content = c.textContent || '';
                return `<${c.tagName.toLowerCase()}>${content}</${c.tagName.toLowerCase()}>`;
              }
              return '';
            }).join('');
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
      createElement: createMockElement,
      createTextNode: createMockTextNode,
    };

    try {
      const env = new Env();
      await run('@import signal, html, renderShadow, on @from "Runtime".', env);

      const source = `
count = @signal 0.
@render "#host" @shadow @html <button id="inc">#{count}</button>.
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
    const createMockElement = (tagName = 'DIV') => {
      const children = [];
      const el = {
        nodeType: 1,
        childNodes: children,
        firstChild: null,
        tagName: tagName.toUpperCase(),
        appendChild: (child) => {
          children.push(child);
          el.firstChild = children[0];
          return child;
        },
        insertBefore: (child, ref) => {
          const idx = ref ? children.indexOf(ref) : 0;
          if (idx >= 0) children.splice(idx, 0, child);
          else children.push(child);
          el.firstChild = children[0];
          return child;
        },
        setAttribute: () => {},
        style: {},
        get textContent() {
          return children.map(c => c.textContent || c.nodeValue || '').join('');
        },
        set textContent(value) {
          children.length = 0;
          if (value !== null && value !== undefined && value !== '') {
            children.push({
              nodeType: 3,
              nodeValue: String(value),
              textContent: String(value),
            });
          }
          el.firstChild = children[0] || null;
        },
        get innerHTML() {
          return children.map(c => {
            if (c.nodeType === 3) return c.nodeValue;
            if (c.tagName) {
              const content = c.textContent || '';
              return `<${c.tagName.toLowerCase()}>${content}</${c.tagName.toLowerCase()}>`;
            }
            return '';
          }).join('');
        },
      };
      return el;
    };

    const createMockTextNode = (text) => {
      const node = {
        nodeType: 3,
        _value: text,
        get nodeValue() { return node._value; },
        set nodeValue(v) { node._value = v; },
        get textContent() { return node._value; },
        set textContent(v) { node._value = v; },
      };
      return node;
    };

    const rootListeners = {};
    let shadowChildren = [];
    const host = {
      shadowRoot: null,
      attachShadow: () => {
        const shadowRoot = {
          outlet: null,
          get innerHTML() {
            return shadowChildren.map(c => {
              if (c.nodeType === 3) return c.nodeValue;
              if (c.tagName) {
                const content = c.textContent || '';
                return `<${c.tagName.toLowerCase()}>${content}</${c.tagName.toLowerCase()}>`;
              }
              return '';
            }).join('');
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
      createElement: createMockElement,
      createTextNode: createMockTextNode,
    };

    try {
      const env = new Env();
      await run('@import signal, html, renderShadow, on @from "Runtime".', env);

      const source = `
count = @signal 0.
@render "#host" @shadow @html <button id="inc">#{count}</button>.
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
