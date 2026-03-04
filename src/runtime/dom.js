import { h, mount, patch } from 'somedom';
import { effect } from './core.js';

export { h };

export function render(selectorOrElement, view) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  if (!view || typeof view.render !== 'function') {
    throw new Error('render(...) expects a view from html(...)');
  }

  const target = typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement;

  if (!target) throw new Error(`Render target not found: ${selectorOrElement}`);

  let prev = null;
  let root = null;

  const remount = next => {
    target.innerHTML = '';
    mount(target, next);
    root = target.firstChild;
    prev = next;
  };

  return effect(() => {
    const next = view.render();
    if (typeof next === 'string') {
      target.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      mount(target, next);
      root = target.firstChild;
      prev = next;
    } else {
      Promise.resolve()
        .then(() => patch(root, prev, next))
        .then(node => {
          root = node || root || target.firstChild;
          prev = next;
        })
        .catch(() => remount(next));
    }
  });
}

export function on(eventName, selectorOrElement, handler, root) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  if (typeof handler !== 'function') throw new Error('on(...) expects a handler function');

  if (typeof selectorOrElement === 'string') {
    const eventRoot = root ?? document;
    const delegated = event => {
      const origin = event && event.target;
      const matched = origin && typeof origin.closest === 'function'
        ? origin.closest(selectorOrElement)
        : null;

      if (matched) handler(event);
    };

    eventRoot.addEventListener(eventName, delegated);
    return () => eventRoot.removeEventListener(eventName, delegated);
  }

  const target = selectorOrElement;

  if (!target) throw new Error(`Event target not found: ${selectorOrElement}`);

  target.addEventListener(eventName, handler);
  return () => target.removeEventListener(eventName, handler);
}

export function renderShadow(host, view) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  if (!view || typeof view.render !== 'function') {
    throw new Error('renderShadow(...) expects a view from html(...)');
  }

  const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
  const outlet = document.createElement('div');
  shadow.appendChild(outlet);

  let prev = null;
  let root = null;

  const remount = next => {
    outlet.innerHTML = '';
    mount(outlet, next);
    root = outlet.firstChild;
    prev = next;
  };

  return effect(() => {
    const next = view.render();
    if (typeof next === 'string') {
      outlet.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      mount(outlet, next);
      root = outlet.firstChild;
      prev = next;
    } else {
      Promise.resolve()
        .then(() => patch(root, prev, next))
        .then(node => {
          root = node || root || outlet.firstChild;
          prev = next;
        })
        .catch(() => remount(next));
    }
  });
}
