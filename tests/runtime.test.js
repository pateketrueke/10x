import { expect } from 'chai';
import {
  signal, effect, html, render, on, isSignal, read,
} from '../src/runtime';

describe('Runtime', () => {
  it('should create and update signals', () => {
    const count = signal(0);

    expect(isSignal(count)).to.eql(true);
    expect(count.get()).to.eql(0);
    expect(count.set(2)).to.eql(2);
    expect(count.get()).to.eql(2);
  });

  it('should re-run effects when signals change', () => {
    const count = signal(0);
    let seen = null;

    effect(() => {
      seen = count.get();
    });

    expect(seen).to.eql(0);
    count.set(7);
    expect(seen).to.eql(7);
  });

  it('should read plain values and signals transparently', () => {
    const plain = 9;
    const wrapped = signal(3);

    expect(read(plain)).to.eql(9);
    expect(read(wrapped)).to.eql(3);
  });

  it('should render html views and bind events', () => {
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

      expect(node.innerHTML).to.eql('<button id="btn">1</button>');

      const dispose = on('click', '#btn', () => count.set(count.get() + 1));
      documentListeners.click({ target: { closest: selector => (selector === '#btn' ? {} : null) } });
      documentListeners.click({ target: { closest: selector => (selector === '#btn' ? {} : null) } });

      expect(node.innerHTML).to.eql('<button id="btn">3</button>');

      dispose();
      expect(documentListeners.click).to.equal(undefined);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
