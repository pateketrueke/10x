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
    const listeners = {};
    const node = {
      innerHTML: '',
      addEventListener: (name, fn) => { listeners[name] = fn; },
      removeEventListener: name => { delete listeners[name]; },
    };

    const originalDocument = globalThis.document;
    const count = signal(1);

    globalThis.document = {
      querySelector: selector => (selector === '#app' || selector === '#btn' ? node : null),
    };

    try {
      const view = html(() => `<h1>${count.get()}</h1>`);
      render('#app', view);

      expect(node.innerHTML).to.eql('<h1>1</h1>');

      const dispose = on('click', '#btn', () => count.set(count.get() + 1));
      listeners.click();

      expect(node.innerHTML).to.eql('<h1>2</h1>');

      dispose();
      expect(listeners.click).to.be.undefined;
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
