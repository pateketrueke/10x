# Sorting Algorithms

A comparison of classic sorting algorithms and their performance
characteristics on different input shapes.

## Bubble Sort

The simplest approach — repeatedly swap adjacent elements until sorted.

bubble = lst ->
  1.. |> take (size lst)
      |> reduce (acc _ -> swap_pass acc) lst.

bubble [5 3 1 4 2].

## Quicksort

Divide and conquer. Pick a pivot, partition, recurse.

quick = lst ->
  @match lst
    []  -> [],
    [x] -> [x],
    _   -> do
      pivot = head lst.
      left  = tail lst |> filter (n -> n < pivot).
      right = tail lst |> filter (n -> n >= pivot).
      (quick left) ++ [pivot] ++ (quick right).

quick [5 3 1 4 2].

## Live Comparison

count = @signal [5 3 1 4 2].

@render "#demo" @html
  <div class="comparison">
    <label>Input</label>
    <input @bind=input>.

    <div class="result">
      <span>Bubble: #{bubble input}</span>
      <span>Quick:  #{quick input}</span>
    </div>
  </div>.
