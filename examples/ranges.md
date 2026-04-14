# Range and List Examples

Ranges and list operations in 10x.

## Simple Ranges

1..5.
1..10.
-3..3.

## Range with Step

0..10:2.
1..9:2.
0..100:10.

## Character Ranges

"a".."z".
"A".."Z".
"0".."9".

## Infinite Ranges

1...
0..

## Taking from Infinite Ranges

1..:5.
0..:10.

## Lists

[].
[1, 2, 3].
["a", "b", "c"].
[1, "two", 3].

## Nested Lists

[[1, 2], [3, 4]].
[[[1]], [[2]], [[3]]].

## List Operations

# Size
size([1, 2, 3]).
size([]).

# Head
head([1, 2, 3]).
head(["a", "b", "c"]).

# Tail
tail([1, 2, 3]).
tail(["a", "b", "c"]).

# Concat
concat([1, 2], [3, 4]).
concat([], [1, 2, 3]).
