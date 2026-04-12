/**
 * somedom/ssr integration tests for 10x components
 *
 * Uses somedom's virtual DOM to exercise real component rendering,
 * signal reactivity, and event handlers without a browser.
 *
 * Key insight: useWindow() restores document after the synchronous
 * callback exits, so we capture the virtual document and pin it
 * to globalThis for the duration of each async test.
 */

import { useWindow } from 'somedom/ssr';
import { execute as run, applyAdapter } from '../src/main.js';
import { createBrowserAdapter } from '../src/adapters/browser/index.js';
import Env from '../src/lib/tree/env.js';
import { expect, test, describe, beforeAll, afterAll } from 'bun:test';

// ─── Virtual DOM setup ───────────────────────────────────────────────────────

let virtualDoc = null;
const originalDoc = globalThis.document;

/**
 * Pin somedom's virtual document to globalThis so async effects can
 * call document.querySelector etc. after the useWindow callback returns.
 */
function acquireVirtualDoc() {
  useWindow(() => { virtualDoc = globalThis.document; });
  if (!virtualDoc) throw new Error('somedom/ssr: useWindow did not set document');

  // Patch APIs the 10x runtime expects but somedom SSR omits
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

const wait = (ms = 80) => new Promise(r => setTimeout(r, ms));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('somedom/ssr component rendering', () => {
  let runtimeEnv;

  beforeAll(async () => {
    acquireVirtualDoc();
    applyAdapter(createBrowserAdapter());
    runtimeEnv = new Env();
    await run('@import signal, html, render, on @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  test('simple @render inserts HTML into the virtual DOM', async () => {
    const container = makeContainer('simple-test');
    const env = new Env(runtimeEnv);
    await run('@render "#simple-test" @html <h1>hello</h1>.', env);
    await wait();
    expect(container.innerHTML).toContain('hello');
  });

  test('Counter renders with correct initial value (start=7)', async () => {
    const container = makeContainer('counter-test');
    const env = new Env(runtimeEnv);
    // Counter must be a child of an HTML tag so the view object goes through
    // evaluateNode's viewCache path (top-level component vdoms aren't supported).
    await run(`
Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  @html <h1 id="val">#{count}</h1>.

@render "#counter-test" @html <div><Counter start=7 /></div>.
`, env);
    await wait();
    expect(container.innerHTML).toContain('7');
  });

  test('two Counter instances start with independent values', async () => {
    const containerA = makeContainer('iso-a');
    const containerB = makeContainer('iso-b');
    const env = new Env(runtimeEnv);
    await run(`
Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  @html <span>#{count}</span>.

@render "#iso-a" @html <div><Counter start=0 /></div>.
@render "#iso-b" @html <div><Counter start=10 /></div>.
`, env);
    await wait();
    expect(containerA.innerHTML).toContain('>0<');
    expect(containerB.innerHTML).toContain('>10<');
    expect(containerA.innerHTML).not.toContain('>10<');
    expect(containerB.innerHTML).not.toContain('>0<');
  });

  test('clicking + button increments count and re-renders', async () => {
    const container = makeContainer('click-test');
    const env = new Env(runtimeEnv);
    await run(`
Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  @html <div><span id="ct">#{count}</span><button id="inc-btn" onclick={inc}>+</button></div>.

@render "#click-test" @html <div><Counter start=3 /></div>.
`, env);
    await wait();

    expect(container.innerHTML).toContain('3');

    const btn = container.querySelector('#inc-btn');
    expect(btn).not.toBeNull();
    btn.dispatchEvent(new Event('click'));
    await wait();

    expect(container.innerHTML).toContain('4');
    expect(container.innerHTML).not.toContain('>3<');
  });

  test('clicking A does not affect B (signal isolation across instances)', async () => {
    const containerA = makeContainer('sig-iso-a');
    const containerB = makeContainer('sig-iso-b');
    const env = new Env(runtimeEnv);
    await run(`
Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  @html <div><span id="ct">#{count}</span><button id="inc-btn" onclick={inc}>+</button></div>.

@render "#sig-iso-a" @html <div><Counter start=0 /></div>.
@render "#sig-iso-b" @html <div><Counter start=10 /></div>.
`, env);
    await wait();

    expect(containerA.innerHTML).toContain('>0<');
    expect(containerB.innerHTML).toContain('>10<');

    const btnA = containerA.querySelector('#inc-btn');
    btnA.dispatchEvent(new Event('click'));
    await wait();

    expect(containerA.innerHTML).toContain('>1<');
    expect(containerB.innerHTML).toContain('>10<');
    expect(containerB.innerHTML).not.toContain('>11<');
  });
});
