import { signal, read } from "10x/core"

@test "signal starts with initial value" => @expect read(@signal 5) == 5.
@test "signal can be updated" => @expect read(@signal 0) == 0.
@test "signal can be incremented" => @expect read(@signal 1) == 1.
