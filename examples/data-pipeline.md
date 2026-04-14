# Data Pipeline Example

Testing pipe operator, list operations, and data transformations.

## Basic Pipes

numbers = [1, 2, 3, 4, 5].

# Simple pipe
doubled = numbers |> map((n) -> n * 2).

# Chained pipes
sumOfEvens = numbers
  |> filter((n) -> (= n % 2 0))
  |> map((n) -> n * 10)
  |> reduce((a b) -> a + b, 0).

## String Operations

words = "hello world from 10x"
  |> (s -> s |> split(" "))
  |> map((w) -> w |> (x -> x |> upper))
  |> join(" ").

## Complex Pipeline

data = [
  (:name "Alice", :score 85),
  (:name "Bob", :score 92),
  (:name "Charlie", :score 78),
  (:name "Diana", :score 95)
].

# Find top performers
topScores = data
  |> filter((p) -> (> p.score 80))
  |> map((p) -> p.name)
  |> join(", ").

# Calculate average
avgScore = data
  |> map((p) -> p.score)
  |> (scores -> scores |> reduce((a b) -> a + b, 0) / (scores |> size)).

## Reactive Pipeline

values = @signal [5, 3, 8, 1, 9, 2].

sorted = @computed values |> (v -> v |> sort).

sum = @computed values |> reduce((a b) -> a + b, 0).

max = @computed values |> (v -> v |> reduce((a b) -> @if (> a b) a @else b, 0)).

shuffle = @on
  values = values |> (v -> v |> sort((a b) -> (= (random 0 1) 0.5 ? -1 | 1))).

## Results

doubled.
sumOfEvens.
words.
topScores.
avgScore.
sorted.
sum.
max.
