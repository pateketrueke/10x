# Counter Step Definitions

import Counter from "./counter.md"
import { read } from "10x/core"

@before_all @mount "#app".

Given "a counter starting at {num}" (n) =>
  Counter({ start: n }).

When "I click the increment button" =>
  @click "#inc".

When "I click the decrement button" =>
  @click "#dec".

Then "the count should be {num}" (expected) =>
  @expect read(count) == expected.
