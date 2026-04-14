# Arithmetic Step Definitions

@before_all => @setup.

Given "numbers {num} and {num}" (a b) =>
  @let x = a,
  @let y = b.

When "I add them" =>
  @let result = x + y.

When "I subtract them" =>
  @let result = x - y.

When "I multiply them" =>
  @let result = x* y.

When "I divide them" =>
  @let result = x / y.

Then "the result should be {num}" (expected) =>
  @expect result == expected.
