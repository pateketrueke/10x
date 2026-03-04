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

    expect(output).to.contain("import * as Runtime from '../runtime/index.js';");
    expect(output).to.contain('Runtime.render("#app", Runtime.html(() => Runtime.h("h1", null, Runtime.read(count))));');
  });

  it('should compile signal assignment and on-handler updates', () => {
    const output = compile([
      'count = @signal 0.',
      '@on "click", "#btn", count = count + 1.',
    ].join('\n'));

    expect(output).to.contain('const count = Runtime.signal(0);');
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
    expect(output).to.contain('Runtime.signal(Runtime.prop(host, "start", 0))');
    expect(output).to.contain('Runtime.renderShadow(host,');
    expect(output).to.contain('Runtime.on("click", "#inc",');
    expect(output).to.contain(', host.shadowRoot)');
    expect(output).to.contain('Runtime.prop(host, "start", 0)');
    expect(output).to.contain('}');
  });
});
