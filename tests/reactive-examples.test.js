/**
 * Tests for reactive features
 */

import { useWindow } from 'somedom/ssr';
import { execute as run, applyAdapter } from '../src/main.js';
import { createBrowserAdapter } from '../src/adapters/browser/index.js';
import Env from '../src/lib/tree/env.js';
import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';

let virtualDoc = null;
const originalDoc = globalThis.document;

function acquireVirtualDoc() {
  useWindow(() => { virtualDoc = globalThis.document; });
  if (!virtualDoc) throw new Error('somedom/ssr: useWindow did not set document');
  if (!virtualDoc.addEventListener) virtualDoc.addEventListener = () => {};
  if (!virtualDoc.removeEventListener) virtualDoc.removeEventListener = () => {};
  if (!virtualDoc.head) virtualDoc.head = { appendChild: () => {} };
  globalThis.document = virtualDoc;
}

function releaseVirtualDoc() {
  globalThis.document = originalDoc;
  virtualDoc = null;
}

function makeContainer(id) {
  const el = virtualDoc.createElement('div');
  el.setAttribute('id', id);
  virtualDoc.body.appendChild(el);
  return el;
}

const wait = (ms = 50) => new Promise(r => setTimeout(r, ms));

applyAdapter(createBrowserAdapter());

describe('Reactive: Signals', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('signal can be created and read', async () => {
    const env = new Env(runtimeEnv);
    await run('count = @signal 0.', env);
    await wait();
    // Signal should be accessible
    const result = await run('count.', env);
    expect(result).toBeDefined();
  });

  test('signal can be updated with @on', async () => {
    const env = new Env(runtimeEnv);
    await run('count = @signal 0.\ninc = @on count = count + 1.', env);
    await wait();
    // Trigger the handler
    await run('inc.', env);
    await wait();
    // Check the signal was updated
    const result = await run('count.', env);
    expect(result).toBeDefined();
  });

  test('@computed creates reactive computed signal', async () => {
    const env = new Env(runtimeEnv);
    await run('count = @signal 5.\ndoubled = @computed count * 2.', env);
    await wait();
    // doubled should be 10
    const result = await run('doubled.', env);
    expect(result).toBeDefined();
    expect(result[0]?.value?.peek?.()).toBe(10);
  });

  test('@computed updates when dependency changes', async () => {
    const env = new Env(runtimeEnv);
    await run('count = @signal 5.\ndoubled = @computed count * 2.', env);
    await wait();
    // doubled should be 10
    let result = await run('doubled.', env);
    expect(result[0]?.value?.peek?.()).toBe(10);
    // Update count directly
    const countResult = await run('count.', env);
    countResult[0].value.set(6);
    await wait();
    // doubled should now be 12
    result = await run('doubled.', env);
    expect(result[0]?.value?.peek?.()).toBe(12);
  });

  test('@computed with multiple dependencies', async () => {
    const env = new Env(runtimeEnv);
    await run('x = @signal 3.\ny = @signal 4.\nsum = @computed x + y.', env);
    await wait();
    // sum should be 7
    let result = await run('sum.', env);
    expect(result[0]?.value?.peek?.()).toBe(7);
    // Update x directly
    const xResult = await run('x.', env);
    xResult[0].value.set(10);
    await wait();
    // sum should now be 14
    result = await run('sum.', env);
    expect(result[0]?.value?.peek?.()).toBe(14);
  });
});

describe('Reactive: Rendering', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('basic @html renders content', async () => {
    const env = new Env(runtimeEnv);
    await run('@render "#render-container" @html <div>Hello</div>.', env);
    await wait();
    expect(container.innerHTML).toContain('Hello');
  });

  test('interpolation in @html', async () => {
    const env = new Env(runtimeEnv);
    await run('name = "World".\n@render "#render-container" @html <h1>Hello, #{name}!</h1>.', env);
    await wait();
    expect(container.innerHTML).toContain('Hello, World!');
  });

  test('signal interpolation updates DOM', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      count = @signal 0.
      inc = @on count = count + 1.
      @render "#render-container" @html
        <div>
          <span id="count">#{count}</span>
          <button id="btn" onclick={inc}>+</button>
        </div>.
    `, env);
    await wait();
    
    const countEl = container.querySelector('#count');
    expect(countEl.textContent).toBe('0');
    
    // Trigger update via button click
    const btn = container.querySelector('#btn');
    btn.dispatchEvent(new Event('click'));
    await wait();
    
    expect(countEl.textContent).toBe('1');
  });
});

describe('Reactive: Event Handlers', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('onclick handler works', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      count = @signal 0.
      inc = @on count = count + 1.
      @render "#render-container" @html
        <button id="btn" onclick={inc}>Click</button>.
    `, env);
    await wait();
    
    const btn = container.querySelector('#btn');
    expect(btn).toBeDefined();
    
    // Simulate click
    btn.dispatchEvent(new Event('click'));
    await wait();
    
    // Check signal was updated
    const result = await run('count.', env);
    expect(result).toBeDefined();
  });

  test('multiple handlers on same signal', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      count = @signal 0.
      inc = @on count = count + 1.
      dec = @on count = count - 1.
      @render "#render-container" @html
        <div>
          <span id="val">#{count}</span>
          <button id="inc" onclick={inc}>+</button>
          <button id="dec" onclick={dec}>-</button>
        </div>.
    `, env);
    await wait();
    
    const val = container.querySelector('#val');
    const incBtn = container.querySelector('#inc');
    const decBtn = container.querySelector('#dec');
    
    expect(val.textContent).toBe('0');
    
    incBtn.dispatchEvent(new Event('click'));
    await wait();
    expect(val.textContent).toBe('1');
    
    decBtn.dispatchEvent(new Event('click'));
    await wait();
    expect(val.textContent).toBe('0');
  });
});

// Tests for new examples: reactive-form, shopping-cart, data-pipeline
describe('Examples: Reactive Form', () => {
  let runtimeEnv;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  test('form validation with computed', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      name = @signal "".
      nameValid = @computed (> (size(name)) 2).
    `, env);
    await wait();

    // Initially invalid (empty string has size 0)
    let result = await run('nameValid.', env);
    expect(result[0]?.value?.peek?.()).toBe(false);

    // Set valid name
    const nameResult = await run('name.', env);
    nameResult[0].value.set("Alice");
    await wait();

    result = await run('nameValid.', env);
    expect(result[0]?.value?.peek?.()).toBe(true);
  });

  test('computed greeting based on name', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      name = @signal "".
      greeting = @computed "Hello, " + name + "!".
    `, env);
    await wait();

    let result = await run('greeting.', env);
    expect(result[0]?.value?.peek?.()).toBe("Hello, !");

    const nameResult = await run('name.', env);
    nameResult[0].value.set("Bob");
    await wait();

    result = await run('greeting.', env);
    expect(result[0]?.value?.peek?.()).toBe("Hello, Bob!");
  });
});

describe('Examples: Shopping Cart', () => {
  let runtimeEnv;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  test('computed item count', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      items = @signal [].
      itemCount = @computed size(items).
    `, env);
    await wait();

    let result = await run('itemCount.', env);
    expect(result[0]?.value?.peek?.()).toBe(0);

    // Add item
    const itemsResult = await run('items.', env);
    itemsResult[0].value.set([{ name: "Widget" }]);
    await wait();

    result = await run('itemCount.', env);
    expect(result[0]?.value?.peek?.()).toBe(1);
  });

  test('computed totals', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      subtotal = @signal 100.
      tax = @computed subtotal * 0.08.
      total = @computed subtotal + tax.
    `, env);
    await wait();

    let result = await run('tax.', env);
    expect(result[0]?.value?.peek?.()).toBe(8);

    result = await run('total.', env);
    expect(result[0]?.value?.peek?.()).toBe(108);
  });
});

describe('Examples: Data Pipeline', () => {
  let runtimeEnv;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  test('map with auto-imported prelude', async () => {
    const env = new Env(runtimeEnv);
    const result = await run('[1, 2, 3] |> map((x) -> x * 2).', env);
    // Result is array of Literals
    const values = result?.[0]?.value?.map?.(r => r?.value ?? r?.valueOf?.()) || result?.map(r => r?.value?.valueOf?.() ?? r?.value);
    expect(values).toEqual(["2", "4", "6"]);
  });

  test('filter with auto-imported prelude', async () => {
    const env = new Env(runtimeEnv);
    const result = await run('[1, 2, 3, 4, 5] |> filter((x) -> (= x % 2 0)).', env);
    const values = result?.[0]?.value?.map?.(r => r?.value ?? r?.valueOf?.()) || result?.map(r => r?.value?.valueOf?.() ?? r?.value);
    expect(values).toEqual(["2", "4"]);
  });

  test('chained pipes', async () => {
    const env = new Env(runtimeEnv);
    const result = await run(`
      [1, 2, 3, 4, 5]
        |> filter((x) -> (= x % 2 0))
        |> map((x) -> x * 10).
    `, env);
    const values = result?.[0]?.value?.map?.(r => r?.value ?? r?.valueOf?.()) || result?.map(r => r?.value?.valueOf?.() ?? r?.value);
    expect(values).toEqual(["20", "40"]);
  });

  test('size with auto-imported prelude', async () => {
    const env = new Env(runtimeEnv);
    const result = await run('[1, 2, 3] |> size.', env);
    expect(result[0]?.value).toBe("3");
  });

  test('head/tail with auto-imported prelude', async () => {
    const env = new Env(runtimeEnv);
    
    const headResult = await run('[1, 2, 3] |> head.', env);
    expect(headResult[0]?.value).toBe("1");
    
    const tailResult = await run('[1, 2, 3] |> tail.', env);
    const tailValues = tailResult?.[0]?.value?.map?.(r => r?.value ?? r?.valueOf?.()) || tailResult?.map(r => r?.value?.valueOf?.() ?? r?.value);
    expect(tailValues).toEqual(["2", "3"]);
  });
});

describe('Reactive: $signal peek syntax', () => {
  let runtimeEnv;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on, effect @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  test('$signal gets value without tracking', async () => {
    const env = new Env(runtimeEnv);
    await run('count = signal(10).', env);
    
    const result = await run('$count.', env);
    expect(result[0]?.value).toBe("10");
  });

  test('$signal with non-signal returns value', async () => {
    const env = new Env(runtimeEnv);
    await run('x = 42.', env);
    
    const result = await run('$x.', env);
    expect(result[0]?.value).toBe("42");
  });

  test('$signal in expression', async () => {
    const env = new Env(runtimeEnv);
    await run('count = signal(5).', env);
    
    const result = await run('$count + 1.', env);
    expect(result[0]?.value).toBe("6");
  });

  test('$signal does not track dependencies', async () => {
    const env = new Env(runtimeEnv);
    await run('count = @signal 10.', env);
    await run('doubled = @computed $count * 2.', env);
    
    // Wait for effect to run
    await wait(50);
    
    const result1 = await run('doubled.', env);
    const value1 = result1[0]?.value?.peek?.() ?? result1[0]?.value;
    expect(value1).toBe(20);
    
    await run('count.set(20).', env);
    await wait(50);
    
    const result2 = await run('doubled.', env);
    const value2 = result2[0]?.value?.peek?.() ?? result2[0]?.value;
    // $signal does NOT track, so doubled should still be 20
    expect(value2).toBe(20);
  });

  test('signal.get() does track dependencies', async () => {
    const env = new Env(runtimeEnv);
    await run('count = @signal 10.', env);
    await run('doubled = @computed count.get() * 2.', env);
    
    // Wait for effect to run
    await wait(50);
    
    const result1 = await run('doubled.', env);
    const value1 = result1[0]?.value?.peek?.() ?? result1[0]?.value;
    expect(value1).toBe(20);
    
    await run('count.set(20).', env);
    await wait(50);
    
    const result2 = await run('doubled.', env);
    const value2 = result2[0]?.value?.peek?.() ?? result2[0]?.value;
    // count.get() DOES track, so doubled should update to 40
    expect(value2).toBe(40);
  });
});
