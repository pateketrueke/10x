import { defineConfig } from 'vite';
import tenx from '../../packages/vite-plugin/index.js';

export default defineConfig({
  plugins: [tenx()],
  resolve: {
    alias: {
      '10x/runtime': '/dist/runtime.js',
    },
  },
});
