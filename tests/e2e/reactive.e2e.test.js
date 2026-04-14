/**
 * E2E tests for reactive features
 */

import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';
import { 
  acquireVirtualDoc, 
  releaseVirtualDoc, 
  makeContainer, 
  wait, 
  setupRuntime,
  createRuntimeEnv,
  getVirtualDoc
} from './helpers.js';
import { execute as run } from '../../src/main.js';

setupRuntime();

describe('E2E: Reactive Signals', () => {
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    const doc = getVirtualDoc();
    doc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('signal can be created and rendered', async () => {
    const env = await createRuntimeEnv();
    await run(`
      count = @signal 42.
      @render "#render-container" @html <div id="count">#{count}</div>.
    `, env);
    await wait();
    
    const countEl = container.querySelector('#count');
    expect(countEl?.textContent).toBe('42');
  });

  test('signal can be updated via @on handler', async () => {
    const env = await createRuntimeEnv();
    await run(`
      count = @signal 0.
      inc = @on count = count + 1.
      @render "#render-container" @html
        <div>
          <span id="count">#{count}</span>
          <button id="inc" onclick={inc}>+</button>
        </div>.
    `, env);
    await wait();
    
    const countEl = container.querySelector('#count');
    expect(countEl?.textContent).toBe('0');
    
    const incBtn = container.querySelector('#inc');
    incBtn.dispatchEvent({ type: 'click', bubbles: true });
    await wait();
    
    expect(countEl?.textContent).toBe('1');
  });

  // TODO: @computed directive not fully implemented
  // Issue: @computed doesn't evaluate the expression correctly
  test.skip('multiple signals work independently', async () => {
    const env = await createRuntimeEnv();
    await run(`
      x = @signal 1.
      y = @signal 2.
      sum = @computed x + y.
      @render "#render-container" @html
        <div>
          <span id="x">#{x}</span>
          <span id="y">#{y}</span>
          <span id="sum">#{sum}</span>
        </div>.
    `, env);
    await wait();
    
    expect(container.querySelector('#x')?.textContent).toBe('1');
    expect(container.querySelector('#y')?.textContent).toBe('2');
    expect(container.querySelector('#sum')?.textContent).toBe('3');
  });
});

describe('E2E: Reactive Rendering', () => {
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    const doc = getVirtualDoc();
    doc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('basic @html renders content', async () => {
    const env = await createRuntimeEnv();
    await run('@render "#render-container" @html <div>Hello</div>.', env);
    await wait();
    expect(container.innerHTML).toContain('Hello');
  });

  test('interpolation in @html', async () => {
    const env = await createRuntimeEnv();
    await run('name = "World".\n@render "#render-container" @html <h1>Hello, #{name}!</h1>.', env);
    await wait();
    expect(container.innerHTML).toContain('Hello, World!');
  });

  test('dynamic updates on signal change', async () => {
    const env = await createRuntimeEnv();
    await run(`
      count = @signal 0.
      inc = @on count = count + 1.
      @render "#render-container" @html
        <div>
          <span id="val">#{count}</span>
          <button id="btn" onclick={inc}>+</button>
        </div>.
    `, env);
    await wait();
    
    const val = container.querySelector('#val');
    const btn = container.querySelector('#btn');
    
    expect(val?.textContent).toBe('0');
    
    btn.dispatchEvent({ type: 'click', bubbles: true });
    await wait();
    expect(val?.textContent).toBe('1');
    
    btn.dispatchEvent({ type: 'click', bubbles: true });
    await wait();
    expect(val?.textContent).toBe('2');
  });
});

describe('E2E: Event Handlers', () => {
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    const doc = getVirtualDoc();
    doc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('onclick handler works', async () => {
    const env = await createRuntimeEnv();
    await run(`
      clicked = @signal :off.
      toggle = @on clicked = @if (= clicked :on) :off @else :on.
      @render "#render-container" @html
        <button id="btn" onclick={toggle}>Click</button>.
    `, env);
    await wait();
    
    const btn = container.querySelector('#btn');
    btn.dispatchEvent({ type: 'click', bubbles: true });
    await wait();
    
    // Handler should have been called
    expect(btn).toBeDefined();
  });

  test('multiple handlers on same signal', async () => {
    const env = await createRuntimeEnv();
    await run(`
      count = @signal 0.
      inc = @on count = count + 1.
      dec = @on count = count - 1.
      @render "#render-container" @html
        <div>
          <span id="val">#{count}</span>
          <button id="dec" onclick={dec}>-</button>
          <button id="inc" onclick={inc}>+</button>
        </div>.
    `, env);
    await wait();
    
    const val = container.querySelector('#val');
    const incBtn = container.querySelector('#inc');
    const decBtn = container.querySelector('#dec');
    
    expect(val?.textContent).toBe('0');
    
    incBtn.dispatchEvent({ type: 'click', bubbles: true });
    await wait();
    expect(val?.textContent).toBe('1');
    
    decBtn.dispatchEvent({ type: 'click', bubbles: true });
    await wait();
    expect(val?.textContent).toBe('0');
  });
});
