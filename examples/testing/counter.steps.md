# Counter Step Definitions

import { read } from "10x/core"
import { count } from "./counter.md"

@before_all @mount "#app".

Given "a counter starting at {num}" (n) =>
  count.set(n).

When "I click the increment button" =>
  @click "#inc".

When "I click the decrement button" =>
  @click "#dec".

Then "the count should be {num}" (expected) =>
  @expect read(count) == expected.
