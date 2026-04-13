/**
 * Tests for playground examples
 * 
 * These tests ensure the examples in public/devtools.html work correctly.
 * Uses somedom's virtual DOM for SSR testing.
 */

import { useWindow } from 'somedom/ssr';
import { execute as run, applyAdapter } from '../src/main.js';
import { createBrowserAdapter } from '../src/adapters/browser/index.js';
import Env from '../src/lib/tree/env.js';
import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';

// ─── Virtual DOM setup ───────────────────────────────────────────────────────

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

describe('Playground: Simple Counter', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    applyAdapter(createBrowserAdapter());
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

  describe('Integration: Rendering', () => {
    test('renders initial count value of 0', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      expect(container.innerHTML).toContain('Count:');
      expect(container.innerHTML).toContain('0');
    });

    test('renders both increment and decrement buttons', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      const decBtn = container.querySelector('#dec-btn');
      const incBtn = container.querySelector('#inc-btn');
      expect(decBtn).toBeDefined();
      expect(incBtn).toBeDefined();
      expect(decBtn?.textContent).toBe('-');
      expect(incBtn?.textContent).toBe('+');
    });

    test('renders h1 with count display', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      const h1 = container.querySelector('#count-display');
      expect(h1).toBeDefined();
      expect(h1?.textContent).toBe('Count: 0');
    });
  });

  describe('BDD: User interactions', () => {
    test('Given counter at 0, When + button clicked, Then count becomes 1', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const incBtn = container.querySelector('#inc-btn');
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 1');
    });

    test('Given counter at 0, When - button clicked, Then count becomes -1', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: -1');
    });

    test('Given counter at 0, When + clicked once, Then count becomes 1', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const incBtn = container.querySelector('#inc-btn');
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 1');
    });

    test('Given counter at 5, When - clicked once, Then count becomes 4', async () => {
      const env = new Env(runtimeEnv);
      await run(`
count = @signal 5.
dec = @on count = count - 1.
inc = @on count = count + 1.

@render "#render-container" @html
  <div>
    <h1 id="count-display">Count: #{count}</h1>
    <button id="dec-btn" onclick={dec}>-</button>
    <button id="inc-btn" onclick={inc}>+</button>
  </div>.
`, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 4');
    });
  });

  describe('E2E: Full counter workflow', () => {
    test('Complete user flow: increment, verify state', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      // Initial state
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 0');
      
      // Increment once
      const incBtn = container.querySelector('#inc-btn');
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 1');
      
      // Decrement once
      const decBtn = container.querySelector('#dec-btn');
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 0');
    });

    test('Counter can go negative', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      const h1 = container.querySelector('#count-display');
      
      // Go negative
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: -1');
    });

    test('Counter can go positive from negative', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      const incBtn = container.querySelector('#inc-btn');
      const h1 = container.querySelector('#count-display');
      
      // Go negative
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: -1');
      
      // Back to zero
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 0');
      
      // Go positive
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 1');
    });
  });
});
