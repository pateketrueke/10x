import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { compile, compileBundle } from '../src/compiler';

describe('Compiler', () => {
  test('should compile single-arg definitions', () => {
    const output = compile('inc = a -> a + 1.');

    expect(output).toInclude('const inc = (a) => (a + 1);');
  });

  test('should compile canonical multi-arg definitions', () => {
    const output = compile('add = (a b) -> a + b.');

    expect(output).toInclude('const add = (a, b) => (a + b);');
  });

  test('should keep non-definition statements as expressions', () => {
    const output = compile('x = 1.\nadd(1, 2).', { module: false });

    expect(output).toInclude('let x = 1;');
    expect(output).toInclude('add(1, 2);');
  });

  test('should compile render/html directives to Runtime calls', () => {
    const output = compile('@render "#app" @html <h1>#{count}</h1>.');

    expect(output).toInclude('import * as $ from "./runtime";');
    expect(output).toInclude('$.render("#app", $.html(() => $.h("h1", null, $.read(count))));');
  });

  test('should compile signal assignment and on-handler updates', () => {
    const output = compile([
      'count = @signal 0.',
      '@on :click, "#btn", count = count + 1.',
    ].join('\n'));

    expect(output).toInclude('export const count = $.signal(0, "count");');
    expect(output).toInclude('$.on("click", "#btn", () => { count.set($.read(count) + 1); });');
  });

  test('should compile shadow components to setup(host)', () => {
    const output = compile([
      'count = @signal @prop "start" 0.',
      '@render @shadow @html <h1>#{count}</h1>.',
      '@on :click, "#inc", count = count + 1.',
      '@on :click, "#reset", count = @prop "start" 0.',
    ].join('\n'));

    expect(output).toInclude('export function setup(host) {');
    expect(output).toInclude('$.signal($.prop(host, "start", 0), "count")');
    expect(output).toInclude('$.renderShadow(host,');
    expect(output).toInclude('$.on("click", "#inc",');
    expect(output).toInclude(', host.shadowRoot)');
    expect(output).toInclude('$.prop(host, "start", 0)');
    expect(output).toInclude('}');
  });

  test('should not emit HMR footer by default', () => {
    const output = compile('count = @signal 0.');
    expect(output).not.toInclude('import.meta.hot');
  });

  test('should emit HMR footer when enabled', () => {
    const output = compile('count = @signal 0.', { hmr: true });
    expect(output).toInclude('if (import.meta.hot)');
    expect(output).toInclude('import.meta.hot.dispose(data => {');
    expect(output).toInclude('import.meta.hot.accept(newMod => {');
    expect(output).toInclude('globalThis.__10x_components?.get(_hmrUrl)');
  });

  test('should pass import.meta.url to renderShadow when HMR is enabled', () => {
    const output = compile('@render @shadow @html <h1>x</h1>.', { hmr: true });
    expect(output).toInclude('$.renderShadow(host, $.html(() => $.h("h1", null, "x")), import.meta.url);');
  });

  test('should allow overriding runtime import path', () => {
    const output = compile('@render "#app" @html <h1>#{count}</h1>.', {
      runtimePath: '/vendor/10x-runtime.mjs',
    });

    expect(output).toInclude('import * as $ from "/vendor/10x-runtime.mjs";');
  });

  test('should emit prose lines as comments above compiled statements', () => {
    const output = compile([
      '# Counter setup',
      'count = @signal 0.',
      '',
      '> increment handler',
      '@on :click, "#inc", count = count + 1.',
    ].join('\n'));

    expect(output).toInclude('// # Counter setup');
    expect(output).toInclude('export const count = $.signal(0, "count");');
    expect(output).toInclude('// > increment handler');
    expect(output).toInclude('$.on("click", "#inc", () => { count.set($.read(count) + 1); });');
  });

  test('should compile @on directives without comma separators', () => {
    const output = compile([
      'count = @signal 0.',
      '@on :click "#inc" count = count + 1.',
    ].join('\n'));

    expect(output).toInclude('$.on("click", "#inc", () => { count.set($.read(count) + 1); });');
  });

  test('should compile non-DOM modules with runtime core import', () => {
    const output = compile([
      '@from "Prelude" @import (head, tail).',
      'pick = list -> head(tail(list)).',
      'count = @signal 0.',
    ].join('\n'));

    expect(output).toInclude('import { head, tail } from "./prelude";');
    expect(output).toInclude('import * as $ from "./runtime";');
    expect(output).toInclude('export const pick = (list) => (head(tail(list)));');
  });

  test('should compile @if/@else and @do directives', () => {
    const output = compile([
      'fib = n ->',
      '  @if (< n 2) 1, (< n 1) 0',
      '  @else n + 1.',
      '',
      'sum2 = (a b) ->',
      '  @do (',
      '    x = a + b.',
      '    x',
      '  ).',
    ].join('\n'));

    expect(output).toInclude('export const fib = (n) => (');
    expect(output).toInclude('n < 2');
    expect(output).toInclude('n < 1');
    expect(output).toInclude('n + 1');
    expect(output).toInclude('export const sum2 = (a, b) => ((() => { let x = a + b; return x; })());');
  });

  test('should compile print-marked calls to console.log', () => {
    const output = compile([
      'fib = n -> n + 1.',
      'fib!(20).',
    ].join('\n'));

    expect(output).toInclude('console.log(fib(20));');
  });

  test('should compile @match and range pipeline expressions', () => {
    const output = compile([
      '@import map, take @from "Prelude".',
      'classify = x -> @match{x 0 "zero", @else "other"}.',
      '1.. |> map(classify) |> take(3).',
    ].join('\n'));

    expect(output).toInclude('import { map, take } from "./prelude";');
    expect(output).toInclude('import { range } from "./prelude";');
    expect(output).toInclude('export const classify = (x) => (');
    expect(output).toInclude('console.log(take(map(range(1), classify), 3));');
  });

  test('should compile while/loop/try/export directives', () => {
    const output = compile([
      'n = 0.',
      '@while (< n 2) n = n + 1.',
      '@loop (items) x -> x.',
      'safe = @try (x / 0) @rescue e -> 0.',
      '@export (n, safe).',
    ].join('\n'));

    expect(output).toInclude('while');
    expect(output).toInclude('for (const x of items)');
    expect(output).toInclude('try { return (x / 0); } catch (e) { return 0; }');
    expect(output).toInclude('export { n, safe };');
  });

  test('should bundle local .md modules into a single output', () => {
    const files = {
      '/app/fib.md': 'fib = n -> @if (< n 2) n @else fib(n - 1) + fib(n - 2).',
      '/app/main.md': '@import fib @from "./fib".\nfib!(6).',
    };

    const output = compileBundle('/app/main.md', {
      readFile: modulePath => files[modulePath],
      resolveModule: (specifier, importerPath) => {
        const base = importerPath.slice(0, importerPath.lastIndexOf('/'));
        return `${base}/${specifier.replace('./', '')}.md`;
      },
    });

    expect(output).toInclude('// Module: /app/fib.md');
    expect(output).toInclude('const fib = (n) => (');
    expect(output).toInclude('// Module: /app/main.md');
    expect(output).toInclude('console.log(fib(6));');
    expect(output).not.toInclude('export const fib');
  });

  test('should dedupe runtime imports when bundling multiple local modules', () => {
    const files = {
      '/app/helper.md': 'count = @signal 1.',
      '/app/main.md': '@import count @from "./helper".\ncount = @signal 2.',
    };

    const output = compileBundle('/app/main.md', {
      readFile: modulePath => files[modulePath],
      resolveModule: (specifier, importerPath) => {
        const base = importerPath.slice(0, importerPath.lastIndexOf('/'));
        return `${base}/${specifier.replace('./', '')}.md`;
      },
    });

    const runtimeImports = output.match(/import \* as \$ from "\.\/runtime";/g) || [];
    expect(runtimeImports).toHaveLength(1);
    expect(output).toInclude('// Module: /app/helper.md');
    expect(output).toInclude('// Module: /app/main.md');
    expect(output).not.toInclude('export const count');
  });

  test('should bundle aliased non-local imports when resolver rules allow it', () => {
    const files = {
      '/app/lib/fib.md': 'fib = n -> @if (< n 2) n @else fib(n - 1) + fib(n - 2).',
      '/app/main.md': '@import fib @from "@app/lib/fib".\nfib!(7).',
    };

    const output = compileBundle('/app/main.md', {
      readFile: modulePath => files[modulePath],
      shouldBundleImport: specifier => specifier.startsWith('@app/'),
      resolveModule: specifier => `/app/${specifier.replace(/^@app\//, '')}.md`,
    });

    expect(output).toInclude('// Module: /app/lib/fib.md');
    expect(output).toInclude('// Module: /app/main.md');
    expect(output).toInclude('console.log(fib(7));');
    expect(output).not.toInclude('import { fib }');
  });

  test('should compile @style directives for global and shadow contexts', () => {
    const globalOut = compile('@style "body { color: red; }".');
    expect(globalOut).toInclude('$.style("body { color: red; }");');

    const shadowOut = compile([
      '@render @shadow @html <div class="box">hello</div>.',
      '@style "div { color: red; }".',
    ].join('\n'));
    expect(shadowOut).toInclude('$.style(host, "div { color: red; }");');
  });

  test('should inject atomic css rules from class attributes', () => {
    const output = compile([
      '@render "#app" @html <div class="flex items-center gap-4 p-2 text-blue-500">x</div>.',
    ].join('\n'));

    expect(output).toInclude('$.style(');
    expect(output).toInclude('.flex{display:flex}');
    expect(output).toInclude('.items-center{align-items:center}');
    expect(output).toInclude('.gap-4{gap:16px}');
    expect(output).toInclude('.p-2{padding:8px}');
    expect(output).toInclude('.text-blue-500{color:#3b82f6}');
    expect(output.indexOf('$.style(')).toBeLessThan(output.indexOf('$.render('));
  });

  test('should allow disabling atomic css injection', () => {
    const output = compile('@render "#app" @html <div class="flex p-2">x</div>.', {
      atomicCss: false,
    });

    expect(output).not.toInclude('.flex{display:flex}');
    expect(output).not.toInclude('.p-2{padding:8px}');
  });

  test('should pass signal objects through directive/ref attrs in tags', () => {
    const output = compile([
      'visible = @signal :on.',
      'inputValue = @signal "x".',
      'refObj = @signal :nil.',
      '@render "#app" @html <input d:show={visible} d:model={inputValue} ref={refObj} value={inputValue} />.',
    ].join('\n'));

    expect(output).toInclude('"d:show": visible');
    expect(output).toInclude('"d:model": inputValue');
    expect(output).toInclude('"ref": refObj');
    expect(output).toInclude('"value": $.read(inputValue)');
  });

  test('should compile @computed and html fragments', () => {
    const output = compile([
      'count = @signal 1.',
      'double = @computed count * 2.',
      '@render "#app" @html [<h1>#{count}</h1>, <p>#{double}</p>].',
    ].join('\n'));

    expect(output).toInclude('const double = $.computed(() => ($.read(count) * 2));');
    expect(output).toInclude('$.html(() => [$.h("h1"');
    expect(output).toInclude('$.h("p"');
  });
});
