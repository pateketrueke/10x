import { test, describe, expect } from 'bun:test';
import { build } from 'bun';
import tenxPlugin from '../packages/bun-10x/index.js';

describe('Counter Module Compilation', () => {
  test('counter.md compiles to valid JS', async () => {
    const result = await build({
      entrypoints: ['examples/bun-counter/counter.md'],
      outdir: '/tmp/10x-test',
      plugins: [tenxPlugin],
    });
    
    expect(result.success).toBe(true);
    expect(result.outputs.length).toBeGreaterThan(0);
    
    const output = result.outputs[0];
    const contents = await output.text();
    
    // Check compiled output contains expected elements
    expect(contents).toContain('signal');
    expect(contents).toContain('count');
    expect(contents).toContain('click');
  });
});
