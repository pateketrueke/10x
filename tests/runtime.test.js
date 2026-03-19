import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import {
  signal, effect, html, render, on, isSignal, read, computed,
} from '../src/runtime';

describe('Runtime', () => {
  test('should create and update signals', () => {
    const count = signal(0);

    expect(isSignal(count)).toEqual(true);
    expect(count.get()).toEqual(0);
    expect(count.set(2)).toEqual(2);
    expect(count.get()).toEqual(2);
  });

  test('should re-run effects when signals change', () => {
    const count = signal(0);
    let seen = null;

    effect(() => {
      seen = count.get();
    });

    expect(seen, 0);
    count.set(7);
    expect(seen, 7);
  });

  test('should read plain values and signals transparently', () => {
    const plain = 9;
    const wrapped = signal(3);

    expect(read(plain)).toEqual(9);
    expect(read(wrapped)).toEqual(3);
  });

  test('should expose .value getter/setter on signals', () => {
    const count = signal(1);

    expect(count.value, 1);
    count.value = 5;
    expect(count.get()).toEqual(5);
    expect(count.value, 5);
  });

  test('should support computed values via runtime exports', () => {
    const count = signal(2);
    const doubled = computed(() => count.value * 2);

    expect(doubled.value, 4);
    count.value = 7;
    expect(doubled.value, 14);
  });

  test('should render html views and bind events', () => {
    const nodeListeners = {};
    const documentListeners = {};
    const node = {
      innerHTML: '',
      addEventListener: (name, fn) => { nodeListeners[name] = fn; },
      removeEventListener: name => { delete nodeListeners[name]; },
    };

    const originalDocument = globalThis.document;
    const count = signal(1);

    globalThis.document = {
      querySelector: selector => (selector === '#app' ? node : null),
      addEventListener: (name, fn) => { documentListeners[name] = fn; },
      removeEventListener: name => { delete documentListeners[name]; },
    };

    try {
      const view = html(() => `<button id="btn">${count.get()}</button>`);
      render('#app', view);

      expect(node.innerHTML, '<button id="btn">1</button>');

      const dispose = on('click', '#btn', () => count.set(count.get() + 1));
      documentListeners.click({ target: { closest: selector => (selector === '#btn' ? {} : null) } });
      documentListeners.click({ target: { closest: selector => (selector === '#btn' ? {} : null) } });

      expect(node.innerHTML, '<button id="btn">3</button>');

      dispose();
      expect(documentListeners.click).toBe(undefined);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
