/**
 * E2E test helpers
 * Shared utilities for testing examples in different modes
 */

import { useWindow } from 'somedom/ssr';
import { execute as run, applyAdapter } from '../../src/main.js';
import { createBrowserAdapter } from '../../src/adapters/browser/index.js';
import Env from '../../src/lib/tree/env.js';

let virtualDoc = null;
const originalDoc = globalThis.document;

export function acquireVirtualDoc() {
  useWindow(() => { virtualDoc = globalThis.document; });
  if (!virtualDoc) throw new Error('somedom/ssr: useWindow did not set document');
  if (!virtualDoc.addEventListener) virtualDoc.addEventListener = () => {};
  if (!virtualDoc.removeEventListener) virtualDoc.removeEventListener = () => {};
  if (!virtualDoc.head) virtualDoc.head = { appendChild: () => {} };
  globalThis.document = virtualDoc;
}

export function releaseVirtualDoc() {
  globalThis.document = originalDoc;
  virtualDoc = null;
}

export function makeContainer(id) {
  const el = virtualDoc.createElement('div');
  el.setAttribute('id', id);
  virtualDoc.body.appendChild(el);
  return el;
}

export const wait = (ms = 50) => new Promise(r => setTimeout(r, ms));

export function setupRuntime() {
  applyAdapter(createBrowserAdapter());
}

export async function createRuntimeEnv() {
  const env = new Env();
  await run('@import signal, html, render, on @from "Runtime".', env);
  return env;
}

export function getVirtualDoc() {
  return virtualDoc;
}

// Helper to convert code to shadow mode
export function toShadowMode(code) {
  return code
    .replace(/(@render\b[^.]*?) (@html\b)/g, '$1 @shadow $2')
    .replace(/(@on\b\s+:[^\s]+\s+"[^"]*")\s+/g, '$1 @shadow ');
}

// Helper to convert code to non-shadow mode
export function toNonShadowMode(code) {
  return code
    .replace(/(@render\b[^.]*?) @shadow (@html\b)/g, '$1 $2')
    .replace(/(@on\b\s+:[^\s]+\s+"[^"]*")\s+@shadow\s+/g, '$1 ');
}
