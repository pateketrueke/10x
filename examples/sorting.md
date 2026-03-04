# Sorting Algorithms

A comparison of classic sorting algorithms and their performance
characteristics on different input shapes.

@from "Prelude" @import (head, tail, size, filter).
@import concat @from "Array".

ISSUE 5: horizontal rule `---` crashes — parsed as three MINUS tokens.
Removed until the scanner recognises it as a thematic break.

## Quicksort

Divide and conquer. Pick a **pivot**, partition around it, recurse on each half.

ISSUE 7: `- bullet` emits a string value in the AST and crashes when code follows.
Using plain prose paragraphs instead — those surrounded by blank lines are silently ignored.

Best case: O(n log n) with good pivot selection.
Worst case: O(n²) on already-sorted input with naive pivot.

ISSUE 7: `> blockquote` also emits a string and crashes. Using plain prose.
The pivot here is always the first element — simple but not ideal for sorted data.

The recursive step only fires when the list has 2+ elements. We need a helper
to avoid calling `head` on an empty list. Note: inline code spans like `head` are fine.

ISSUE 1 workaround: the `@else @do` form is broken — the @do block runs
unconditionally regardless of the branch taken. Fix: extract the else-body
into a named helper function and call it from the @else arm.

quick_inner = lst ->
  @do (
    pivot = head(lst).
    rest  = tail(lst).
    left  = filter(rest, x -> (< x pivot)).
    right = filter(rest, x -> (>= x pivot)).
    concat(quick(left), [pivot], quick(right))
  ).

ISSUE 2 workaround: `(< size(lst) 2)` fails — `size(lst)` is not pre-reduced inside
logic parens, so `<` sees 3 arguments instead of 2. Pre-bind to a local name first.

ISSUE 3 workaround: infix `x < pivot` in a lambda returns a display expression
that is always truthy. Use prefix form `(< x pivot)` in filter callbacks instead.

quick = lst ->
  @do (
    len = size(lst).
    @if (< len 2) lst @else quick_inner(lst)
  ).

quick([5, 3, 1, 4, 2]).

## Bubble Sort

Repeatedly pass through the list, swapping adjacent elements that are out of order.
After each pass, the largest unsorted element sinks to its final position.

ISSUE 9: markdown tables crash when code follows — the table data array is left in the
AST without a trailing EOL, so the next statement is treated as a call argument.
Pass trace written as prose below until standalone tables are fixed.

Pass 1: input 5 3 1 4 2, output 3 1 4 2 5.
Pass 2: input 3 1 4 2 5, output 1 3 2 4 5.
Pass 3: input 1 3 2 4 5, output 1 2 3 4 5.

one_pass_inner = lst ->
  @do (
    a    = head(lst).
    b    = head(tail(lst)).
    rest = tail(tail(lst)).
    @if (> a b)
      concat([b], one_pass(concat([a], rest)))
    @else
      concat([a], one_pass(concat([b], rest)))
  ).

one_pass = lst ->
  @do (
    len = size(lst).
    @if (< len 2) lst @else one_pass_inner(lst)
  ).

bubble_n = (lst n) ->
  @if (== n 0) lst @else bubble_n(one_pass(lst), n - 1).

bubble = lst -> bubble_n(lst, size(lst)).

bubble([5, 3, 1, 4, 2]).
