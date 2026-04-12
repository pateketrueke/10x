import { expect, test, describe } from 'bun:test';
import { lintCode } from '../src/linter.js';

// Helper: parse and lint a multi-line 10x program.
// Prefix with a dummy statement so the scanner treats every line as code context.
function lint(lines) {
  return lintCode(Array.isArray(lines) ? lines.join('\n') : lines);
}

describe('lintCode', () => {
  describe('on-arrow-updater', () => {
    test('warns on @on signal -> form', () => {
      const w = lint(['count = @signal 0.', 'inc = @on count -> count + 1.']);
      expect(w.filter(x => x.code === 'on-arrow-updater').length).toEqual(1);
    });

    test('does not warn on @on signal = form', () => {
      const w = lint(['count = @signal 0.', 'inc = @on count = count + 1.']);
      expect(w.filter(x => x.code === 'on-arrow-updater').length).toEqual(0);
    });

    test('does not warn on DOM event form (@on :event selector handler)', () => {
      const w = lint(['count = @signal 0.', '@on :click "#btn" count -> count + 1.']);
      expect(w.filter(x => x.code === 'on-arrow-updater').length).toEqual(0);
    });

    test('does not warn when identifier is not a signal', () => {
      const w = lint(['add = a -> a + 1.', 'inc = @on add -> add + 1.']);
      expect(w.filter(x => x.code === 'on-arrow-updater').length).toEqual(0);
    });
  });

  describe('inline-lambda-in-attr', () => {
    test('warns on inline lambda in tag attribute', () => {
      const w = lint(['count = @signal 0.', '@render "#app" @html <button on_click={x -> x + 1}>+</button>.']);
      expect(w.filter(x => x.code === 'inline-lambda-in-attr').length).toEqual(1);
    });

    test('does not warn on plain identifier attribute', () => {
      const w = lint(['inc = x -> x + 1.', '@render "#app" @html <button on_click={inc}>+</button>.']);
      expect(w.filter(x => x.code === 'inline-lambda-in-attr').length).toEqual(0);
    });
  });

  describe('inline-directive-in-attr', () => {
    test('warns on inline directive in tag attribute', () => {
      const w = lint(['count = @signal 0.', '@render "#app" @html <div class={@signal 0}>x</div>.']);
      expect(w.filter(x => x.code === 'inline-directive-in-attr').length).toEqual(1);
    });

    test('does not warn on plain expression', () => {
      const w = lint(['cls = "active".', '@render "#app" @html <div class={cls}>x</div>.']);
      expect(w.filter(x => x.code === 'inline-directive-in-attr').length).toEqual(0);
    });
  });

  describe('render-without-html', () => {
    test('warns on bare @render without @html', () => {
      const w = lint(['@render "#app".']);
      expect(w.filter(x => x.code === 'render-without-html').length).toEqual(1);
    });

    test('does not warn when @html is present', () => {
      const w = lint(['@render "#app" @html <p>ok</p>.']);
      expect(w.filter(x => x.code === 'render-without-html').length).toEqual(0);
    });
  });

  describe('signal-without-binding', () => {
    test('warns on bare @signal statement', () => {
      const w = lint(['@signal 0.']);
      expect(w.filter(x => x.code === 'signal-without-binding').length).toEqual(1);
    });

    test('does not warn when @signal is bound to a name', () => {
      const w = lint(['count = @signal 0.']);
      expect(w.filter(x => x.code === 'signal-without-binding').length).toEqual(0);
    });
  });
});
