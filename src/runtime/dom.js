import { h, mount, patch } from 'somedom';
import { effect } from './core.js';

export { h };

const componentObservers = new WeakMap();

function registerShadowHost(host, moduleUrl) {
  if (!moduleUrl) return;
  const globalObj = globalThis;
  const registry = globalObj.__10x_components instanceof Map
    ? globalObj.__10x_components
    : (globalObj.__10x_components = new Map());
  let hosts = registry.get(moduleUrl);
  if (!hosts) {
    hosts = new Set();
    registry.set(moduleUrl, hosts);
  }
  hosts.add(host);

  if (typeof MutationObserver !== 'function') return;
  if (typeof document === 'undefined' || !document.body) return;

  let byModule = componentObservers.get(host);
  if (!byModule) {
    byModule = new Map();
    componentObservers.set(host, byModule);
  }
  if (byModule.has(moduleUrl)) return;

  const cleanup = () => {
    const currentHosts = registry.get(moduleUrl);
    if (currentHosts) {
      currentHosts.delete(host);
      if (!currentHosts.size) registry.delete(moduleUrl);
    }
    const currentByModule = componentObservers.get(host);
    if (currentByModule) {
      const observer = currentByModule.get(moduleUrl);
      if (observer) observer.disconnect();
      currentByModule.delete(moduleUrl);
      if (!currentByModule.size) componentObservers.delete(host);
    }
  };

  const observer = new MutationObserver(() => {
    if (!host.isConnected) cleanup();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  byModule.set(moduleUrl, observer);
}

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

  return effect(async () => {
    const next = await view.render();
    if (typeof next === 'string') {
      target.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      mount(target, next);
      root = target.firstChild;
      prev = next;
    } else {
      try {
        const node = await Promise.resolve().then(() => patch(root, prev, next));
        root = node || root || target.firstChild;
        prev = next;
      } catch (_) {
        remount(next);
      }
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

export function renderShadow(host, view, moduleUrl) {
  if (typeof document === 'undefined') {
    return () => {};
  }

  if (!view || typeof view.render !== 'function') {
    throw new Error('renderShadow(...) expects a view from html(...)');
  }

  const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
  registerShadowHost(host, moduleUrl);
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

  return effect(async () => {
    const next = await view.render();
    if (typeof next === 'string') {
      outlet.innerHTML = next;
      prev = null;
      root = null;
    } else if (!prev) {
      mount(outlet, next);
      root = outlet.firstChild;
      prev = next;
    } else {
      try {
        const node = await Promise.resolve().then(() => patch(root, prev, next));
        root = node || root || outlet.firstChild;
        prev = next;
      } catch (_) {
        remount(next);
      }
    }
  });
}
