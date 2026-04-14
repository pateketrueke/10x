/**
 * E2E tests for playground examples in all modes
 */

import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';
import { 
  acquireVirtualDoc, 
  releaseVirtualDoc, 
  makeContainer, 
  wait, 
  setupRuntime,
  createRuntimeEnv,
  toShadowMode,
  getVirtualDoc
} from './helpers.js';
import { execute as run } from '../../src/main.js';

setupRuntime();

// ─── Simple Counter Example ──────────────────────────────────────────────────

const SIMPLE_COUNTER = `
count = @signal 0.
dec = @on count = count - 1.
inc = @on count = count + 1.

@render "#render-container" @html
  <div style="text-align:center;padding:2rem;font-family:system-ui">
    <h1 id="count-display" style="font-size:3rem;margin:0.5rem 0">Count: #{count}</h1>
    <div style="display:flex;gap:0.5rem;justify-content:center">
      <button id="dec-btn" onclick={dec} style="padding:0.5rem 1rem;font-size:1rem;cursor:pointer">-</button>
      <button id="inc-btn" onclick={inc} style="padding:0.5rem 1rem;font-size:1rem;cursor:pointer">+</button>
    </div>
  </div>.
`;

describe('E2E: Simple Counter - Non-Shadow Mode', () => {
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

  test('renders initial count value of 0', async () => {
    const env = await createRuntimeEnv();
    await run(SIMPLE_COUNTER, env);
    await wait();
    expect(container.innerHTML).toContain('Count:');
    expect(container.innerHTML).toContain('0');
  });

  test('increment button works', async () => {
    const env = await createRuntimeEnv();
    await run(SIMPLE_COUNTER, env);
    await wait();
    
    const incBtn = container.querySelector('#inc-btn');
    incBtn.dispatchEvent(new Event('click'));
    await wait();
    
    const h1 = container.querySelector('#count-display');
    expect(h1?.textContent).toBe('Count: 1');
  });

  test('decrement button works', async () => {
    const env = await createRuntimeEnv();
    await run(SIMPLE_COUNTER, env);
    await wait();
    
    const decBtn = container.querySelector('#dec-btn');
    decBtn.dispatchEvent(new Event('click'));
    await wait();
    
    const h1 = container.querySelector('#count-display');
    expect(h1?.textContent).toBe('Count: -1');
  });
});

describe('E2E: Simple Counter - Shadow Mode', () => {
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

  // TODO: Shadow mode doesn't work in virtual DOM environment
  // Issue: Shadow DOM rendering requires real browser environment
  test.skip('renders initial count value of 0', async () => {
    const env = await createRuntimeEnv();
    const shadowCode = toShadowMode(SIMPLE_COUNTER);
    await run(shadowCode, env);
    await wait();
    expect(container.innerHTML).toContain('Count:');
    expect(container.innerHTML).toContain('0');
  });

  test.skip('increment button works in shadow mode', async () => {
    const env = await createRuntimeEnv();
    const shadowCode = toShadowMode(SIMPLE_COUNTER);
    await run(shadowCode, env);
    await wait();
    
    const incBtn = container.querySelector('#inc-btn');
    incBtn.dispatchEvent(new Event('click'));
    await wait();
    
    const h1 = container.querySelector('#count-display');
    expect(h1?.textContent).toBe('Count: 1');
  });
});

// ─── Inline Components Example ───────────────────────────────────────────────

const INLINE_COMPONENTS = `
Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  dec = @on count = count - 1,
  @html
    <div class="counter-box" style="text-align:center;padding:1rem;border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin:0.5rem">
      <h3 class="counter-title" style="margin:0 0 0.5rem">Counter: #{count}</h3>
      <button class="dec-btn" onclick={dec}>-</button>
      <button class="inc-btn" onclick={inc}>+</button>
    </div>.

@render "#render-container" @html
  <div style="font-family:system-ui;padding:1rem">
    <h2 style="margin:0 0 1rem">Multiple Independent Counters</h2>
    <div class="counters" style="display:flex;gap:1rem;flex-wrap:wrap">
      <Counter start=0 />
      <Counter start=10 />
      <Counter start=100 />
    </div>
  </div>.
`;

describe('E2E: Inline Components - Non-Shadow Mode', () => {
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

  test('renders three counter components', async () => {
    const env = await createRuntimeEnv();
    await run(INLINE_COMPONENTS, env);
    await wait();
    
    const counters = container.querySelectorAll('.counter-box');
    expect(counters.length).toBe(3);
  });

  test('each counter has correct initial value', async () => {
    const env = await createRuntimeEnv();
    await run(INLINE_COMPONENTS, env);
    await wait();
    
    const titles = container.querySelectorAll('.counter-title');
    expect(titles[0]?.textContent).toBe('Counter: 0');
    expect(titles[1]?.textContent).toBe('Counter: 10');
    expect(titles[2]?.textContent).toBe('Counter: 100');
  });

  test('counters have independent state', async () => {
    const env = await createRuntimeEnv();
    await run(INLINE_COMPONENTS, env);
    await wait();
    
    const counters = container.querySelectorAll('.counter-box');
    const firstIncBtn = counters[0].querySelector('.inc-btn');
    firstIncBtn.dispatchEvent(new Event('click'));
    await wait();
    
    const titles = container.querySelectorAll('.counter-title');
    expect(titles[0]?.textContent).toBe('Counter: 1');
    expect(titles[1]?.textContent).toBe('Counter: 10');
    expect(titles[2]?.textContent).toBe('Counter: 100');
  });
});

describe('E2E: Inline Components - Shadow Mode', () => {
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

  // TODO: Shadow mode doesn't work in virtual DOM environment
  // Issue: Shadow DOM rendering requires real browser environment
  test.skip('renders three counter components in shadow mode', async () => {
    const env = await createRuntimeEnv();
    const shadowCode = toShadowMode(INLINE_COMPONENTS);
    await run(shadowCode, env);
    await wait();
    
    const counters = container.querySelectorAll('.counter-box');
    expect(counters.length).toBe(3);
  });

  test.skip('counters have independent state in shadow mode', async () => {
    const env = await createRuntimeEnv();
    const shadowCode = toShadowMode(INLINE_COMPONENTS);
    await run(shadowCode, env);
    await wait();
    
    const counters = container.querySelectorAll('.counter-box');
    const firstIncBtn = counters[0].querySelector('.inc-btn');
    firstIncBtn.dispatchEvent(new Event('click'));
    await wait();
    
    const titles = container.querySelectorAll('.counter-title');
    expect(titles[0]?.textContent).toBe('Counter: 1');
    expect(titles[1]?.textContent).toBe('Counter: 10');
    expect(titles[2]?.textContent).toBe('Counter: 100');
  });
});
