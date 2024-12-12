
# 10x

> ...slower than Javascript!

## Why I'm doing this?

I want to build a language from scratch but I don't know C or anything low-level, so I picked Javascript as the environment for this such tiny language. :bomb:

Achievements unlocked:

- Markdown-friendly, so I don't have to explicitly use block-fences to denote actual code!
- Built-in unit conversions, so I can play around with expressions like `5cm - 1.5in`

### Syntax/features overview

- Literals can hold any value, depending on its value they can be invoked
- We can consider only four basic types: `string`, `number`, `symbol` and `range`
- Other abstractions are built on top of them, like object-mappings or logical-structures
- There are few delimiters, like comma and semicolon; also grouping parentheses and brackets

We can start with a new literal definition for `sum`:

  sum = a -> b -> a + b;
  sum(2, 3);

> The result is `5`

**Blocks** are denoted by using the arrow-operator (`->`), literals on the left-side are the expected arguments, any statements on the right-side before semicolon (`;`) are the function's body.

> Arguments can also be separated by commas, e.g.  `sum = a, b -> a + b;`

Parentheses will create a new context using the available arguments from its _callee_,
e.g. `(2, 3) => (a, b -> a + b)` &mdash; values `2` and `3` are bound to `a` and `b` respectively.

Declared blocks with only two arguments can be invoked as infix-operators, e.g.

  adds = a, b -> a + b;
  3 adds 5;

> The result is `8`

**Literals** without arguments are invoked right-away, if they're prefixed by a number its result is then multiplied by that, e.g.

  x = 42;
  3x;

> The result is `126`

**Numbers** can be declared with or without decimals, even `.1` is a valid number.

Consecutive numbers are added, and any number followed by parentheses is multiplied, e.g.

  1 2 3 (4 5);

> The result is `30`

Fractions are preserved if they're expressed as `1/3` &mdash; positive integers with no spaces between its components.

  1/2;
  1 /2;
  1 / 2;

> The result is `1/2, 0.5, 0.5`

**Units** are special literals used to enclose numeric values that can be converted, say you want to known the result of `5 cm to inches`, etc.

To enable such expression, we need to know that units can be converted, e.g. `(5cm).to(:in)` &mdash; so the next part is implementing the `to` infix operator as `to = a, b -> a.to(b);` to finally make it work!

**Strings** are all delimited by double-quotes, they can also be RegExp or HTML tags, e.g.

  "Hello World";
  /test/i;
  <b>I am just markup</b>;

> The result is `"Hello World", /test/i, <b>I am just markup</b>`

Interpolation can be used only on html and regular strings, e.g. `<p>#{value}</p>` &mdash; new lines are allowed within, escape sequences for `\r\n\t` may work too.

Regular expressions does not accept any spaces or new lines, use `\s` or `\n` respectively.

**Symbols** are used for `null`, `true` and `false` values, as keys for object-mappings, etc. &mdash; when used as single values they'll behave as if they were strings.

Also you can create symbols on the fly by using parentheses or string-interpolation, e.g.

  :(3 - 2), :"test-#{:key}";

> The result is `:1, :test-key`

**Maps** can be declared by mixing named-symbols (`:k`) as keys followed by one ore more values, otherwise they'll remain as single symbol tokens, e.g.

  user =
    :name "John", "Doe",
    :email "john@doe.com";

  :if (:on) "#{[user.name].join(" ")} <#{user.email}>";

> The result is `"John Doe <john@doe.com>"`

Those will not capture anything after short-circuit expressions like `:x y | 0` &mdash; to include them as value you must add parentheses.

Values can be accessed through the dot-operator (`.`) and named symbols, e.g.

  user.name;
  [user]:email;

> The result is `"John", "Doe", "john@doe.com"`

Later is preferred for dynamic access, e.g. `[user]:(logged_in ? :name | :email)"`

**Ranges** or lists can be expressed as `[` followed by any other values, ending with a `]` delimiter, listed items can contain any value or expression, e.g.

  [0, [(< 1 2), (:three 3)]]

> The result if `[0, [:on, (:three 3)]]`

We can produce lazy sets of values through the range-operator, e.g. `a..b` &mdash; where each component should evaluate to a number or single-character string.

They'll be evaluated through symbols, below we're going to use `:` to expand the range contents into a new fixed list of values.

  [1..3, "a".."c"]:

> The result is `1, 2, 3, "a", "b", "c"`

Named symbols including ranges (`:1..3`), slices (`:1-3`) and offsets (`:1`) are used to configure and access any given list, e.g. `[1, 2, 3]:1` &mdash; returns `2` as the access was by offset.

Available rules:

- `:` &mdash; evaluates any range within lists
- `:1` &mdash; access list-item by numeric offset
- `::2` &mdash; get all values with a `2` step between
- `:1..2` &mdash; access only `2` list-items by offset `1`
- `:1-2` and `:1:2` &mdash; take `1` value with a `2` step between
- `::1` &mdash; default take/step values; access list-item by numeric offset
- `::1..2` &mdash; default take/step values; access only `2` list-items by offset `1`
- `:1-2:1..3` or `:1:2:1..3` &mdash; combined rules, in order: `take, step, offset, length`

Any block as direct child will be unpacked with all its nested blocks flattened, e.g.

  [(1..3, "a".."c", (4, (5)))];

> The result is `[[1, 2, 3], ["a", "b", "c"], 4, 5]`
