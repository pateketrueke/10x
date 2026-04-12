import { compile } from '../../src/compiler/index.js';

export default {
  name: '10x',
  target: 'browser',
  setup(build) {
    build.onLoad({ filter: /\.md$/ }, async ({ path, loader }) => {
      const source = await Bun.file(path).text();
      try {
        const compiled = compile(source, {
          hmr: true,
          module: true,
        });
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
