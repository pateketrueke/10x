import transform from './src/lib/transform';

import {
  convertFrom,
  DEFAULT_MAPPINGS,
} from './src/lib/convert';

const argv = process.argv.slice(Math.max(2, process.argv.indexOf('--') + 1));

const tokens = transform(argv.join(' '), {
  units: {
    ...DEFAULT_MAPPINGS,
  },
  convert: (num, base, target) => {
    console.log('HANDLE', num, base, target);
    console.log('DEFAULTS', convertFrom(num, base, target));
  },
});

console.log(tokens);
