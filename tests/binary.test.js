import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { spawnSync } from 'child_process';
import path from 'path';

const BIN = path.resolve('./dist/bin/10x');
const RUN_BINARY_TESTS = process.env.BUILD_BIN === '1';

describe('Binary', () => {
  if (!RUN_BINARY_TESTS) {
    test('is skipped unless BUILD_BIN=1', () => {
      expect(true, true);
    });
    return;
  }

  test('evaluates stdin input', () => {
    const res = spawnSync(BIN, [], { encoding: 'utf8', input: '1+1' });
    expect(res.status, 0);
    expect((res.stdout || '').trim()).toInclude('2');
  });

  test('runs sample files', () => {
    const res = spawnSync(BIN, ['examples/fib_memo.md'], { encoding: 'utf8' });
    expect(res.status, 0);
    expect((res.stdout || '').trim()).toInclude('10946');
  });
});
