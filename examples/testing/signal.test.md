import { signal } from "10x/core"

@test "signal starts with initial value" =>
  count = @signal 5,
  @expect count.peek() == 5.

@test "signal can be updated" =>
  count = @signal 0,
  count.set(10),
  @expect count.peek() == 10.

@test "signal can be incremented" =>
  count = @signal 1,
  count.set(count.peek() + 1),
  @expect count.peek() == 2.
