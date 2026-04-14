Feature: Arithmetic
  @steps "./arithmetic.steps.md"

  Scenario: Addition
    Given numbers 1 and 2
    When I add them
    Then the result should be 3

  Scenario: Subtraction
    Given numbers 5 and 3
    When I subtract them
    Then the result should be 2

  Scenario: Multiplication
    Given numbers 4 and 3
    When I multiply them
    Then the result should be 12

  Scenario: Division
    Given numbers 10 and 2
    When I divide them
    Then the result should be 5
