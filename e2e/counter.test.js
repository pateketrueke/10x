import { test, describe, expect, beforeAll, afterAll } from 'bun:test';

describe('Counter E2E - Light DOM', () => {
  test('renders counter with initial value', async () => {
    const html = await Bun.file('examples/bun-counter/index.html').text();
    expect(html).toContain('Counter A');
    expect(html).toContain('Counter B');
  });
});

describe('Counter E2E - Shadow DOM', () => {
  test('renders counter in shadow DOM', async () => {
    const html = await Bun.file('examples/bun-counter/index-shadow.html').text();
    expect(html).toContain('Shadow A');
    expect(html).toContain('Shadow B');
  });
});

describe('Counter Module Compilation', () => {
  test('counter.md compiles to valid ESM', async () => {
    const source = await Bun.file('examples/bun-counter/counter.md').text();
    expect(source).toContain('@signal');
    expect(source).toContain('@on');
    expect(source).toContain('@html');
  });
});
