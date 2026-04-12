import { expect, test, describe } from 'bun:test';
import { compile } from '../src/compiler';

describe('Test Directives', () => {
  test('should compile @test directive', () => {
    const output = compile('@test "adds numbers" => 1 + 1.', { module: true });
    expect(output).toInclude('test("adds numbers"');
    expect(output).toInclude('bun:test');
  });

  test('should compile @expect directive', () => {
    const output = compile('@test "check value" => @expect 1 == 1.', { module: true });
    expect(output).toInclude('expect(');
    expect(output).toInclude('.toBe(true)');
  });

  test('should compile @before_all directive', () => {
    const output = compile('@before_all @mount "#app".', { module: true });
    expect(output).toInclude('beforeAll(');
    expect(output).toInclude('mount(');
  });

  test('should compile @before_each directive', () => {
    const output = compile('@before_each => @reset.', { module: true });
    expect(output).toInclude('beforeEach(');
  });

  test('should compile @mount directive', () => {
    const output = compile('@mount "#app".', { module: true });
    expect(output).toInclude('mount("#app")');
  });

  test('should compile @click directive', () => {
    const output = compile('@click "#btn".', { module: true });
    expect(output).toInclude('click("#btn")');
  });

  test('should import test runtime for test files', () => {
    const output = compile('@test "example" => @expect true.', { module: true });
    expect(output).toInclude('bun:test');
    expect(output).toInclude('10x/testing');
  });
});
