import { build } from 'bun';
import tenxPlugin from '../packages/bun-10x/index.js';

const result = await build({
  entrypoints: ['examples/bun-counter/counter.md'],
  outdir: '/tmp/10x-build',
  plugins: [tenxPlugin],
  external: ['../../src/*', '../../dist/*'],
});

console.log('Build result:', result);
console.log('Outputs:', result.outputs?.map(o => o.path));
