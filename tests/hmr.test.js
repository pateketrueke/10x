import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { signal, html, renderShadow } from '../src/runtime';

describe('HMR', () => {
  test('should snapshot and restore named signals across HMR cycle', () => {
    const originalSignals = globalThis.__10x_signals;

    const before = new Map();
    const beforeCount = signal(0, 'count');
    const beforeAnon = signal(1);
    before.set('count', beforeCount);
    before.set(Symbol('anon'), beforeAnon);
    globalThis.__10x_signals = before;

    beforeCount.set(5);

    const snap = {};
    for (const [k, s] of (globalThis.__10x_signals || new Map())) {
      if (s && s._devtoolsName) snap[s._devtoolsName] = s.peek();
    }

    const after = new Map();
    const afterCount = signal(0, 'count');
    const afterAnon = signal(9);
    after.set('count', afterCount);
    after.set(Symbol('anon-next'), afterAnon);
    globalThis.__10x_signals = after;

    for (const [k, s] of (globalThis.__10x_signals || new Map())) {
      if (s && s._devtoolsName && snap[s._devtoolsName] !== undefined) s.set(snap[s._devtoolsName]);
    }

    expect(afterCount.get()).toBe(5);
    expect(afterAnon.get()).toBe(9);

    globalThis.__10x_signals = originalSignals;
  });

  test('should register shadow hosts by module url and cleanup on disconnect', () => {
    const originalDocument = globalThis.document;
    const originalMutationObserver = globalThis.MutationObserver;
    const originalRegistry = globalThis.__10x_components;

    const observers = [];
    class FakeMutationObserver {
      constructor(cb) {
        this.cb = cb;
        this.disconnected = false;
        observers.push(this);
      }

      observe() {}

      disconnect() {
        this.disconnected = true;
      }

      trigger() {
        this.cb();
      }
    }

    globalThis.MutationObserver = FakeMutationObserver;
    globalThis.document = {
      body: {},
      createElement: () => ({ innerHTML: '', firstChild: null }),
    };

    const shadow = {
      firstChild: null,
      appendChild(node) {
        this.firstChild = node;
        return node;
      },
    };

    const host = {
      isConnected: true,
      shadowRoot: null,
      attachShadow() {
        this.shadowRoot = shadow;
        return shadow;
      },
    };

    try {
      renderShadow(host, html(() => '<h1>v1</h1>'), '/module-a');

      const hosts = globalThis.__10x_components.get('/module-a');
      expect(hosts.has(host)).toBe(true);

      host.isConnected = false;
      observers.forEach(observer => observer.trigger());

      const afterHosts = globalThis.__10x_components.get('/module-a');
      expect(afterHosts).toBe(undefined);
    } finally {
      globalThis.document = originalDocument;
      globalThis.MutationObserver = originalMutationObserver;
      globalThis.__10x_components = originalRegistry;
    }
  });
});
