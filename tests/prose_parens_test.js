import { execute as run } from '../src/lib';

async function test(label, src) {
  try {
    const result = await run(src);
    console.log(`  OK: ${label}`);
  } catch(e) {
    console.log(`  ERR: ${label} — ${e.message?.slice(0, 80)}`);
  }
}

// What prose content is safe?
await test('plain words', '\n\nHello world.\n\nx = 1.\nx.');
await test('parens in prose', '\n\nHello (world).\n\nx = 1.\nx.');
await test('backtick in prose', '\n\nUse `foo` here.\n\nx = 1.\nx.');
await test('backtick expr in prose', '\n\nUse `(< x 2)` here.\n\nx = 1.\nx.');
await test('arrow in prose', '\n\nThe lambda `x -> y` maps.\n\nx = 1.\nx.');
await test('paren then newline', '\n\nSome (always\ntruthy) text.\n\nx = 1.\nx.');
await test('multiline prose', '\n\nFirst line.\nSecond line.\n\nx = 1.\nx.');
await test('multiline with parens', '\n\nFirst line (with parens)\nand second line.\n\nx = 1.\nx.');
