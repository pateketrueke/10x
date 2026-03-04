import { compile } from '../../src/compiler/index.js';

export default function tenx(options = {}) {
  return {
    name: 'vite-plugin-tenx',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      return {
        code: compile(code, {
          runtimePath: '10x/runtime',
          ...options,
        }),
        map: null,
      };
    },
  };
}
