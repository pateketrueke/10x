import { signal } from "10x/core"

@test "signal starts with initial value" => @signal(5).peek() == 5.
@test "signal can be updated" => @signal(0).set(10).peek() == 10.
@test "signal can be incremented" =>
  count = @signal 1.
  @expect count.peek() == 1.
