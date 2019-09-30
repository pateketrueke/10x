# Lists

Values inside lists can be unwinded by adding a
range operator right after the list, e.g. (1, 2, 3)..

Ranges inside lists are lazy, so they're not
immediately evaluated, e.g. (1..3, 7, 9, 12..15)

To produce values from those lists we need to sequence
them by adding a range operator right before list:

..(1..3, 7, 9, 12..15);

> Similar to `:loop (1..3, 7, 9, 12..15) _;` but with all values also unwinded.

Lists can be merged using the range operator in between:

(1, 2, 3) .. (4, 5);

# Tuples

By using symbols, you can create tuples from lists, e.g. (:key "value")

Those can be merged to, be they cannot be unwinded!

(:foo "bar") .. (:baz "buzz");

Tuples can be nested, e.g.

pkg=(:name "solv-lang" :version "1.2");
deps=(:k "undef", :dependencies (:chalk "^2.4.2" :wargs "^0.8.2"));

(pkg)..(deps);
