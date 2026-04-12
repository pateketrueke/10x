import { test, describe, expect } from 'bun:test';
import { compile } from '../src/compiler/index.js';
import tenxPlugin from '../packages/bun-10x/index.js';
import { build } from 'bun';

describe('HMR Compiler Output', () => {
  test('compiler generates HMR footer with hmr: true', async () => {
    const source = await Bun.file('examples/bun-counter/counter.md').text();
    const output = compile(source, { hmr: true, module: true });
    
    expect(output).toContain('import.meta.hot');
    expect(output).toContain('import.meta.hot.dispose');
    expect(output).toContain('import.meta.hot.accept');
    expect(output).toContain('__10x_signals');
  });

  test('compiler generates signal snapshot logic', async () => {
    const source = await Bun.file('examples/bun-counter/counter.md').text();
    const output = compile(source, { hmr: true, module: true });
    
    expect(output).toContain('data.__signals');
    expect(output).toContain('.peek()');
    expect(output).toContain('_restoredCount');
  });

  test('compiler generates devtools notification', async () => {
    const source = await Bun.file('examples/bun-counter/counter.md').text();
    const output = compile(source, { hmr: true, module: true });
    
    expect(output).toContain('__10x_devtools');
    expect(output).toContain('onHmr');
  });
});

describe('Bun Plugin HMR Support', () => {
  test('plugin compiles with hmr option', async () => {
    const result = await build({
      entrypoints: ['examples/bun-counter/counter.md'],
      outdir: '/tmp/10x-plugin-test',
      plugins: [tenxPlugin],
    });
    
    expect(result.success).toBe(true);
    expect(result.outputs.length).toBeGreaterThan(0);
    
    const output = result.outputs[0];
    const contents = await output.text();
    
    expect(contents).toContain('signal');
    expect(contents).toContain('count');
    expect(contents).toContain('render');
  });

  test('bundled output works without HMR (production mode)', async () => {
    const result = await build({
      entrypoints: ['examples/bun-counter/counter.md'],
      outdir: '/tmp/10x-prod-test',
      plugins: [tenxPlugin],
    });
    
    const output = result.outputs[0];
    const contents = await output.text();
    
    expect(contents).toContain('signal(0');
    expect(contents).toContain('on("click"');
    expect(contents).toContain('render(');
  });
});

describe('Shadow DOM Support', () => {
  test('shadow mode HTML entry imports renderShadow', async () => {
    const html = await Bun.file('examples/bun-counter/index-shadow.html').text();
    expect(html).toContain('renderShadow');
  });

  test('runtime includes shadow DOM support', async () => {
    const result = await build({
      entrypoints: ['examples/bun-counter/counter.md'],
      outdir: '/tmp/10x-shadow-test',
      plugins: [tenxPlugin],
    });
    
    const output = result.outputs[0];
    const contents = await output.text();
    
    expect(contents).toContain('render');
    expect(contents).toContain('html');
    expect(contents).toContain('signal');
  });
});
