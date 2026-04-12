import { compile } from '../../src/compiler/index.js';
import { relative, dirname } from 'path';

const TEST_FILE_PATTERN = /\.(test|spec|feature|steps)\.md$/;

export default {
  name: '10x',
  target: 'browser',
  setup(build) {
    build.onLoad({ filter: /\.md$/ }, async ({ path, loader }) => {
      if (TEST_FILE_PATTERN.test(path)) {
        return {
          contents: `throw new Error('Test files should not be bundled in production: ${path}');`,
          loader: 'js',
        };
      }
      
      const source = await Bun.file(path).text();
      try {
        let compiled = compile(source, {
          hmr: true,
          module: true,
        });
        
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
