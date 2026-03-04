import { h, mount, patch } from 'somedom';
import { effect } from './core.js';

export { h };

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function dashCase(input) {
  return String(input || '').replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
}

function objectToCss(value, selector = ':host') {
  if (!value || typeof value !== 'object') return '';

  const declarations = [];
  const nested = [];

  Object.entries(value).forEach(([key, entry]) => {
    if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
      const nestedSelector = selector === ':host' ? key : `${selector} ${key}`;
      const nestedCss = objectToCss(entry, nestedSelector);
      if (nestedCss) nested.push(nestedCss);
      return;
    }
    declarations.push(`  ${dashCase(key)}: ${entry};`);
  });

  const block = declarations.length
    ? `${selector} {\n${declarations.join('\n')}\n}`
    : '';

  return [block].concat(nested).filter(Boolean).join('\n');
}

export function style(hostOrCss, css) {
  if (typeof document === 'undefined') return;

  const hasHost = css !== undefined;
  const host = hasHost ? hostOrCss : null;
  const raw = hasHost ? css : hostOrCss;
  const cssText = typeof raw === 'string' ? raw : objectToCss(raw);

  if (!cssText || !cssText.trim()) return;

  if (hasHost) {
    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    const element = document.createElement('style');
    element.textContent = cssText;
    shadow.insertBefore(element, shadow.firstChild);
    return;
  }

  const id = `10x-${hashStr(cssText)}`;
  if (document.getElementById(id)) return;

  const element = document.createElement('style');
  element.id = id;
  element.textContent = cssText;
  document.head.appendChild(element);
}

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
