import { test, describe, expect } from 'bun:test';

describe('Counter Module Import', () => {
  test('counter.md can be imported as module', async () => {
    const mod = await import('../examples/bun-counter/counter.md');
    expect(mod.Counter).toBeDefined();
    expect(typeof mod.Counter).toBe('function');
  });
});
