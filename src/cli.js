import { cli } from './index.js';

cli().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
