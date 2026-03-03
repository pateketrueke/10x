import applyLoader from './loader.js';
import applyShared from './shared.js';

export function createNodeAdapter(argv = process.argv.slice(2)) {
  return {
    name: 'node',
    setup(runtime) {
      applyLoader(runtime);
      applyShared(runtime, argv);
    },
  };
}
