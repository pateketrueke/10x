import { expect, test, describe } from 'bun:test';
import { parseGherkin, compileFeature, parseStepDefinitions, stepPatternToKey, compileStepDefinitions } from '../src/compiler/gherkin';

describe('Gherkin Parser', () => {
  test('should parse feature name', () => {
    const feature = parseGherkin('Feature: Counter');
    expect(feature.name).toBe('Counter');
  });

  test('should parse @steps tag', () => {
    const feature = parseGherkin(`
Feature: Counter
  @steps "./counter.steps.md"
    `);
    expect(feature.steps).toBe('./counter.steps.md');
  });

  test('should parse @component tag', () => {
    const feature = parseGherkin(`
Feature: Counter
  @component "./counter.md"
    `);
    expect(feature.component).toBe('./counter.md');
  });

  test('should parse scenario', () => {
    const feature = parseGherkin(`
Feature: Counter

Scenario: Increment counter
  Given a counter starting at 0
  When I click the increment button
  Then the count should be 1
    `);
    
    expect(feature.scenarios.length).toBe(1);
    expect(feature.scenarios[0].name).toBe('Increment counter');
    expect(feature.scenarios[0].steps.length).toBe(3);
  });

  test('should parse Given/When/Then steps', () => {
    const feature = parseGherkin(`
Feature: Counter

Scenario: Test
  Given a counter starting at 0
  When I click the button
  Then the count should be 1
    `);
    
    expect(feature.scenarios[0].steps[0].type).toBe('given');
    expect(feature.scenarios[0].steps[0].text).toBe('a counter starting at 0');
    expect(feature.scenarios[0].steps[1].type).toBe('when');
    expect(feature.scenarios[0].steps[2].type).toBe('then');
  });

  test('should parse And steps', () => {
    const feature = parseGherkin(`
Feature: Counter

Scenario: Test
  Given a counter starting at 0
  And the counter is visible
  When I click the button
  And I wait
  Then the count should be 1
    `);
    
    expect(feature.scenarios[0].steps.length).toBe(5);
    expect(feature.scenarios[0].steps[1].type).toBe('given');
    expect(feature.scenarios[0].steps[3].type).toBe('when');
  });

  test('should parse multiple scenarios', () => {
    const feature = parseGherkin(`
Feature: Counter

Scenario: Increment
  Given a counter starting at 0
  When I click increment
  Then count is 1

Scenario: Decrement
  Given a counter starting at 10
  When I click decrement
  Then count is 9
    `);
    
    expect(feature.scenarios.length).toBe(2);
    expect(feature.scenarios[0].name).toBe('Increment');
    expect(feature.scenarios[1].name).toBe('Decrement');
  });
});

describe('Feature Compiler', () => {
  test('should compile feature to test file', () => {
    const feature = parseGherkin(`
Feature: Counter
  @steps "./counter.steps.md"
  @component "./counter.md"

Scenario: Increment
  Given a counter starting at 0
  When I click increment
  Then count is 1
    `);
    
    const output = compileFeature(feature, feature.steps, feature.component);
    expect(output).toContain('describe("Counter"');
    expect(output).toContain('import Counter from "./counter.md"');
    expect(output).toContain('import * as steps from "./counter.steps.md"');
    expect(output).toContain('test("Increment"');
  });
});

describe('Step Definition Parser', () => {
  test('should parse @before_all hook', () => {
    const steps = parseStepDefinitions('@before_all @mount "#app".');
    expect(steps.before_all).toBeDefined();
    expect(steps.before_all.type).toBe('hook');
  });

  test('should parse Given step', () => {
    const steps = parseStepDefinitions('Given "a counter starting at {num}" (n) => Counter({ start: n }).');
    expect(steps.definitions.length).toBe(1);
    expect(steps.definitions[0].type).toBe('given');
    expect(steps.definitions[0].pattern).toBe('a counter starting at {num}');
    expect(steps.definitions[0].params).toEqual(['n']);
  });

  test('should parse When step', () => {
    const steps = parseStepDefinitions('When "I click the button" => @click "#btn".');
    expect(steps.definitions.length).toBe(1);
    expect(steps.definitions[0].type).toBe('when');
  });

  test('should parse Then step', () => {
    const steps = parseStepDefinitions('Then "the count should be {num}" (expected) => @expect count == expected.');
    expect(steps.definitions.length).toBe(1);
    expect(steps.definitions[0].type).toBe('then');
    expect(steps.definitions[0].params).toEqual(['expected']);
  });

  test('should convert pattern to key', () => {
    expect(stepPatternToKey('given', 'a counter starting at {num}')).toBe('given_a_counter_starting_at');
    expect(stepPatternToKey('when', 'I click the button')).toBe('when_I_click_the_button');
  });

  test('should compile step definitions', () => {
    const steps = parseStepDefinitions(`
@before_all @mount "#app".

Given "a counter starting at {num}" (n) =>
  Counter({ start: n }).

When "I click increment" =>
  @click "#inc".

Then "count is {num}" (expected) =>
  @expect count == expected.
    `);
    
    const output = compileStepDefinitions(steps);
    expect(output).toContain('export const before_all');
    expect(output).toContain('export const given_a_counter_starting_at');
    expect(output).toContain('export const when_I_click_increment');
    expect(output).toContain('export const then_count_is');
  });
});
