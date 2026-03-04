import { expect } from 'chai';
import { execute as run } from '../src/lib';
import Expr from '../src/lib/tree/expr';

// Test markdown element behavior in the evaluator/parser
async function test(label, src) {
  try {
    const result = await run(src);
    console.log(`  ${label}: ${JSON.stringify(result)}`);
  } catch(e) {
    console.log(`  ${label}: ERROR — ${e.message?.slice(0, 80)}`);
  }
}

console.log('\n=== Prose / Text ===');
await test('prose at TOP', 'Some text here.\n\nx = 1.\nx.');
await test('prose with blank lines', '\n\nSome prose here.\n\nx = 1.\nx.');
await test('bold in prose', '\n\n**bold text** here.\n\nx = 1.\nx.');

console.log('\n=== Block elements ===');
await test('blockquote', '\n\n> A note.\n\nx = 1.\nx.');
await test('unordered bullet', '\n\n- A bullet.\n\nx = 1.\nx.');
await test('ordered list', '\n\n1. First item.\n\nx = 1.\nx.');
await test('horizontal rule ---', '\n\n---\n\nx = 1.\nx.');

console.log('\n=== Fenced code ===');
await test('fenced code block', '\n\n```js\nsome code\n```\n\nx = 1.\nx.');

console.log('\n=== Inline elements in prose ===');
await test('inline code in prose', '\n\n`foo` is a fn.\n\nx = 1.\nx.');
await test('link in prose', '\n\nSee [utils](./utils.md) for help.\n\nx = 1.\nx.');

console.log('\n=== Tables ===');
await test('markdown table', '\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\nx = 1.\nx.');

console.log('\n=== Headings ===');
await test('plain heading', '\n\n# A Heading\n\nx = 1.\nx.');
await test('heading with ::', '\n\n# Math::\n\nx = 1.\nx.');
