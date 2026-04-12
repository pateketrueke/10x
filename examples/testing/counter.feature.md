Feature: Counter
  @steps "./counter.steps.md"
  @component "./counter.md"

Scenario: Increment counter
  Given a counter starting at 0
  When I click the increment button
  Then the count should be 1

Scenario: Decrement counter
  Given a counter starting at 10
  When I click the decrement button
  Then the count should be 9
