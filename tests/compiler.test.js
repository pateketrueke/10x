import { expect } from 'chai';
import { compile } from '../src/compiler';

describe('Compiler', () => {
  it('should compile single-arg definitions', () => {
    const output = compile('inc = a -> a + 1.');

    expect(output).to.contain('const inc = (a) => (a + 1);');
  });

  it('should compile canonical multi-arg definitions', () => {
    const output = compile('add = (a b) -> a + b.');

    expect(output).to.contain('const add = (a, b) => (a + b);');
  });

  it('should keep non-definition statements as expressions', () => {
    const output = compile('x = 1.\nadd(1, 2).', { module: false });

    expect(output).to.contain('let x = 1;');
    expect(output).to.contain('add(1, 2);');
  });

  it('should compile render/html directives to Runtime calls', () => {
    const output = compile('@render "#app" @html <h1>{count}</h1>.');

    expect(output).to.contain('import * as Runtime from "./runtime";');
    expect(output).to.contain('Runtime.render("#app", Runtime.html(() => Runtime.h("h1", null, Runtime.read(count))));');
  });

  it('should compile signal assignment and on-handler updates', () => {
    const output = compile([
      'count = @signal 0.',
      '@on "click", "#btn", count = count + 1.',
    ].join('\n'));

    expect(output).to.contain('const count = Runtime.signal(0, "count");');
    expect(output).to.contain('Runtime.on("click", "#btn", () => { count.set(Runtime.read(count) + 1); });');
  });

  it('should compile shadow components to setup(host)', () => {
    const output = compile([
      'count = @signal @prop "start" 0.',
      '@render @shadow @html <h1>{count}</h1>.',
      '@on "click", "#inc", count = count + 1.',
      '@on "click", "#reset", count = @prop "start" 0.',
    ].join('\n'));

    expect(output).to.contain('export function setup(host) {');
    expect(output).to.contain('Runtime.signal(Runtime.prop(host, "start", 0), "count")');
    expect(output).to.contain('Runtime.renderShadow(host,');
    expect(output).to.contain('Runtime.on("click", "#inc",');
    expect(output).to.contain(', host.shadowRoot)');
    expect(output).to.contain('Runtime.prop(host, "start", 0)');
    expect(output).to.contain('}');
  });

  it('should allow overriding runtime import path', () => {
    const output = compile('@render "#app" @html <h1>{count}</h1>.', {
      runtimePath: '/vendor/tenx-runtime.mjs',
    });

    expect(output).to.contain('import * as Runtime from "/vendor/tenx-runtime.mjs";');
  });

  it('should emit prose lines as comments above compiled statements', () => {
    const output = compile([
      '# Counter setup',
      'count = @signal 0.',
      '',
      '> increment handler',
      '@on "click", "#inc", count = count + 1.',
    ].join('\n'));

    expect(output).to.contain('// Counter setup');
    expect(output).to.contain('const count = Runtime.signal(0, "count");');
    expect(output).to.contain('// increment handler');
    expect(output).to.contain('Runtime.on("click", "#inc", () => { count.set(Runtime.read(count) + 1); });');
  });

  it('should compile @on directives without comma separators', () => {
    const output = compile([
      'count = @signal 0.',
      '@on "click" "#inc" count = count + 1.',
    ].join('\n'));

    expect(output).to.contain('Runtime.on("click", "#inc", () => { count.set(Runtime.read(count) + 1); });');
  });

  it('should compile non-DOM modules with runtime core import', () => {
    const output = compile([
      '@from "Prelude" @import (head, tail).',
      'pick = list -> head(tail(list)).',
      'count = @signal 0.',
    ].join('\n'));

    expect(output).to.contain('import { head, tail } from "./prelude";');
    expect(output).to.contain('import * as Runtime from "./runtime";');
    expect(output).to.contain('export const pick = (list) => (head(tail(list)));');
  });

  it('should compile @if/@else and @do directives', () => {
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

    expect(output).to.contain('export const fib = (n) => (');
    expect(output).to.contain('n < 2');
    expect(output).to.contain('n < 1');
    expect(output).to.contain('n + 1');
    expect(output).to.contain('export const sum2 = (a, b) => ((() => { let x = a + b; return x; })());');
  });

  it('should compile print-marked calls to console.log', () => {
    const output = compile([
      'fib = n -> n + 1.',
      'fib!(20).',
    ].join('\n'));

    expect(output).to.contain('console.log(fib(20));');
  });

  it('should compile @match and range pipeline expressions', () => {
    const output = compile([
      '@import map, take @from "Prelude".',
      'classify = x -> @match{x 0 "zero", @else "other"}.',
      '1.. |> map(classify) |> take(3).',
    ].join('\n'));

    expect(output).to.contain('import { map, take } from "./prelude";');
    expect(output).to.contain('import { range } from "./prelude";');
    expect(output).to.contain('export const classify = (x) => (');
    expect(output).to.contain('console.log(take(map(range(1), classify), 3));');
  });

  it('should compile while/loop/try/export directives', () => {
    const output = compile([
      'n = 0.',
      '@while (< n 2) n = n + 1.',
      '@loop (items) x -> x.',
      'safe = @try (x / 0) @rescue e -> 0.',
      '@export (n, safe).',
    ].join('\n'));

    expect(output).to.contain('while');
    expect(output).to.contain('for (const x of items)');
    expect(output).to.contain('try { return (x / 0); } catch (e) { return 0; }');
    expect(output).to.contain('export { n, safe };');
  });

});
