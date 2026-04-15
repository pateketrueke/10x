/**
 * Tests for component examples
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

describe('Components: Basic', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('simple component renders', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      Box = props -> <div class={props.kind}>#{props.content}</div>.
      @render "#render-container" @html <Box kind="info" content="Hello" />.
    `, env);
    await wait();
    expect(container.innerHTML).toContain('Hello');
    expect(container.innerHTML).toContain('info');
  });

  test('component with state', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      Counter props =>
        count = @signal props.start,
        inc = @on count = count + 1,
        @html
          <div class="counter">
            <span id="count">#{count}</span>
            <button id="inc" onclick={inc}>+</button>
          </div>.
      @render "#render-container" @html <Counter start=0 />.
    `, env);
    await wait();
    
    const countEl = container.querySelector('#count');
    expect(countEl.textContent).toBe('0');
    
    const incBtn = container.querySelector('#inc');
    incBtn.dispatchEvent(new Event('click'));
    await wait();
    
    const countElAfter = container.querySelector('#count');
    expect(countElAfter.textContent).toBe('1');
  });
});

describe('Components: Multiple Instances', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('multiple component instances have independent state', async () => {
    const env = new Env(runtimeEnv);
    await run(`
      Counter props =>
        count = @signal props.start,
        inc = @on count = count + 1,
        @html
          <div class="counter" data-id={props.id}>
            <span class="count">#{count}</span>
            <button class="inc" onclick={inc}>+</button>
          </div>.
      @render "#render-container" @html
        <div>
          <Counter id="c1" start=0 />
          <Counter id="c2" start=10 />
        </div>.
    `, env);
    await wait();
    
    const counters = container.querySelectorAll('.counter');
    expect(counters.length).toBe(2);
    
    // Check initial values
    const count1 = counters[0].querySelector('.count');
    const count2 = counters[1].querySelector('.count');
    expect(count1.textContent).toBe('0');
    expect(count2.textContent).toBe('10');
    
    // Click first counter's button
    const inc1 = counters[0].querySelector('.inc');
    inc1.dispatchEvent(new Event('click'));
    await wait();
    
    // First counter should increment, second should stay same
    expect(count1.textContent).toBe('1');
    expect(count2.textContent).toBe('10');
    
    // Click second counter's button
    const inc2 = counters[1].querySelector('.inc');
    inc2.dispatchEvent(new Event('click'));
    await wait();
    
    // First should stay at 1, second should increment
    expect(count1.textContent).toBe('1');
    expect(count2.textContent).toBe('11');
  });
});

describe('Components: Props', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, html, render, on @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  test('numeric props are passed correctly', async () => {
    const env = new Env(runtimeEnv);
    // Use the exact pattern from playground tests
    const code = `Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  dec = @on count = count - 1,
  @html
    <div class="counter-box">
      <h3 class="counter-title">Counter: #{count}</h3>
      <button class="dec-btn" onclick={dec}>-</button>
      <button class="inc-btn" onclick={inc}>+</button>
    </div>.

@render "#render-container" @html
  <Counter start=42 />.`;
    await run(code, env);
    await wait();
    const title = container.querySelector('.counter-title');
    expect(title?.textContent).toBe('Counter: 42');
  });
});
