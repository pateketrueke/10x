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
