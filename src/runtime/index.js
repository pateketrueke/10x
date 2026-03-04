const SIGNAL = Symbol('10x.signal');

let currentEffect = null;

export function signal(initialValue) {
  return {
    [SIGNAL]: true,
    value: initialValue,
    subs: new Set(),
    get() {
      if (currentEffect) this.subs.add(currentEffect);
      return this.value;
    },
    set(nextValue) {
      this.value = nextValue;
      this.subs.forEach(fn => fn());
      return this.value;
    },
  };
}

export function isSignal(value) {
  return !!(value && value[SIGNAL]);
}

export function read(value) {
  return isSignal(value) ? value.get() : value;
}

export function effect(fn) {
  const run = () => {
    currentEffect = run;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };

  run();
  return run;
}

export function html(renderFn) {
  if (typeof renderFn !== 'function') {
    throw new Error('html(...) expects a function');
  }

  return {
    render: renderFn,
  };
}

export function render(selectorOrElement, view) {
  if (!view || typeof view.render !== 'function') {
    throw new Error('render(...) expects a view from html(...)');
  }

  const target = typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement;

  if (!target) throw new Error(`Render target not found: ${selectorOrElement}`);

  return effect(() => {
    target.innerHTML = String(view.render());
  });
}

export function on(eventName, selectorOrElement, handler) {
  const target = typeof selectorOrElement === 'string'
    ? document.querySelector(selectorOrElement)
    : selectorOrElement;

  if (!target) throw new Error(`Event target not found: ${selectorOrElement}`);
  if (typeof handler !== 'function') throw new Error('on(...) expects a handler function');

  target.addEventListener(eventName, handler);
  return () => target.removeEventListener(eventName, handler);
}
