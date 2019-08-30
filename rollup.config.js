import json from 'rollup-plugin-json';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

function makeEntry(input, output, liveReload) {
  return {
    input,
    output,
    plugins: [
      json(),
      svelte({
        dev: !production,
        css: css => {
          css.write('public/bundle.css');
        }
      }),
      resolve({ browser: true }),
      commonjs(),
      liveReload && livereload('public'),
      production && terser()
    ],
    watch: {
      clearScreen: false,
    },
    external: ['convert-units', 'currency-symbol.js'],
  };
}

export default [
  makeEntry('src/lib/index.js', { format: 'cjs', file: 'dist/lib.js' }, false),
  // makeEntry('src/main.js', { format: 'iife', file: 'public/bundle.js' }, !production),
];
