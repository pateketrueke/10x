import { execute as run } from '../src/lib';

async function test(label, src) {
  try {
    const result = await run(src);
    console.log(`  ${label}: OK →`, JSON.stringify(result));
  } catch(e) {
    console.log(`  ${label}: ERROR — ${e.message?.slice(0, 100)}`);
  }
}

// Table: standalone vs assigned
console.log('\n=== Table contexts ===');
await test('table standalone (blank lines)', '\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n');
await test('table assigned', 't = @table {\n| a | b |\n|---|---|\n| 1 | 2 |\n}.\nt.');
await test('table in document with other code', '\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\nx = 1.\nx.');

// Prose at top: variations
console.log('\n=== Prose at top ===');
await test('just prose no code', 'Some prose here.');
await test('prose then newline then code', 'Some prose here.\n\nx = 1.\nx.');
await test('leading blank then prose then code', '\nSome prose here.\n\nx = 1.\nx.');

// Links
console.log('\n=== Links in prose ===');
await test('pure link (own line)', '\n\n[utils](./utils.md)\n\nx = 1.\nx.');
await test('link mid-sentence', '\n\nSee [utils](./utils.md) for help.\n\nx = 1.\nx.');
await test('link after blank line pure', '\n\n[utils](./utils.md).\n\nx = 1.\nx.');
