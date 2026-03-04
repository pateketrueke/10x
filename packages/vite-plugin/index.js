import { compile } from '../../src/compiler/index.js';

export default function plugin(options = {}) {
  const {
    runtimePath = '10x/runtime',
    atomicCss = true,
    hmr = true,
    include,
    exclude,
    ...compileOptions
  } = options;

  const includePattern = include || /\.md(?:$|\?)/;
  const excludePattern = exclude || null;

  const shouldTransform = id => {
    if (!includePattern.test(id)) return false;
    if (excludePattern && excludePattern.test(id)) return false;
    return true;
  };

  return {
    name: 'vite-plugin-10x',
    enforce: 'pre',
    transform(code, id) {
      if (!shouldTransform(id)) return null;
      return {
        code: compile(code, {
          runtimePath,
          atomicCss,
          hmr,
          ...compileOptions,
        }),
        map: null,
      };
    },
  };
}
