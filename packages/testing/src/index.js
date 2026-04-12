import { useWindow } from 'somedom/ssr';
import { signal, effect, untracked, html, getSignalRegistry } from '10x/core';

export { useWindow, signal, effect, untracked, html, getSignalRegistry };

let currentWindow = null;

export function mount(selectorOrElement) {
  if (!currentWindow) {
    currentWindow = useWindow();
  }
  
  const target = typeof selectorOrElement === 'string'
    ? currentWindow.document.querySelector(selectorOrElement)
    : selectorOrElement;
  
  if (!target) {
    const el = currentWindow.document.createElement('div');
    el.id = selectorOrElement.replace('#', '');
    currentWindow.document.body.appendChild(el);
  }
  
  return currentWindow;
}

export function getWindow() {
  return currentWindow;
}

export function setWindow(win) {
  currentWindow = win;
}

export async function click(selector) {
  if (!currentWindow) {
    throw new Error('No window context. Call mount() first.');
  }
  
  const target = typeof selector === 'string'
    ? currentWindow.document.querySelector(selector)
    : selector;
  
  if (!target) {
    throw new Error(`Element not found: ${selector}`);
  }
  
  const event = new currentWindow.Event('click', { bubbles: true });
  target.dispatchEvent(event);
  
  await new Promise(resolve => setTimeout(resolve, 0));
}

export async function type(selector, text) {
  if (!currentWindow) {
    throw new Error('No window context. Call mount() first.');
  }
  
  const target = typeof selector === 'string'
    ? currentWindow.document.querySelector(selector)
    : selector;
  
  if (!target) {
    throw new Error(`Element not found: ${selector}`);
  }
  
  target.value = text;
  const event = new currentWindow.Event('input', { bubbles: true });
  target.dispatchEvent(event);
  
  await new Promise(resolve => setTimeout(resolve, 0));
}

export function expect(actual) {
  return {
    toBe(expected) {
      const actualValue = actual && typeof actual === 'object' && 'value' in actual
        ? actual.value
        : actual;
      
      if (actualValue !== expected) {
        throw new Error(`Expected ${expected}, got ${actualValue}`);
      }
    },
    toEqual(expected) {
      const actualValue = actual && typeof actual === 'object' && 'value' in actual
        ? actual.value
        : actual;
      
      if (JSON.stringify(actualValue) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actualValue)}`);
      }
    },
    toBeTruthy() {
      const actualValue = actual && typeof actual === 'object' && 'value' in actual
        ? actual.value
        : actual;
      
      if (!actualValue) {
        throw new Error(`Expected truthy value, got ${actualValue}`);
      }
    },
    toBeFalsy() {
      const actualValue = actual && typeof actual === 'object' && 'value' in actual
        ? actual.value
        : actual;
      
      if (actualValue) {
        throw new Error(`Expected falsy value, got ${actualValue}`);
      }
    },
  };
}

export function cleanup() {
  if (currentWindow) {
    currentWindow.document.body.innerHTML = '';
  }
  const registry = getSignalRegistry();
  registry.clear();
  currentWindow = null;
}

export function reset() {
  cleanup();
}
