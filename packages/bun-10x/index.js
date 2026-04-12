import { compile } from '../../src/compiler/index.js';
import { relative, dirname } from 'path';

export default {
  name: '10x',
  target: 'browser',
  setup(build) {
    build.onLoad({ filter: /\.md$/ }, async ({ path, loader }) => {
      const source = await Bun.file(path).text();
      try {
        let compiled = compile(source, {
          hmr: true,
          module: true,
        });
        
        // Fix runtime import path to be absolute
        compiled = compiled.replace(
          /from\s+["']\.\/runtime["']/g,
          'from "10x/runtime"'
        );
        
        return {
          contents: compiled,
          loader: 'js',
        };
      } catch (err) {
        return {
          contents: `throw new Error(${JSON.stringify(err.message)})`,
          loader: 'js',
        };
      }
    });
  },
};
