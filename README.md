
# 10x

> ...slower than JavaScript!

A toy programming language written in JavaScript, with a markdown-native syntax — source files are `.md` files, so code blocks are optional and most text is just text.

## Why?

I wanted to build a language from scratch without knowing C or anything low-level, so I picked JavaScript as the host environment. It has built-in unit conversions, fractions, ranges, and a few other ideas I wanted to play with.

## Getting Started

**Requirements:** [Bun](https://bun.sh) and Node.js.

```sh
bun install
```

### REPL

```sh
make repl
# or: node bin/cli
```

### Evaluate a snippet

```sh
make eval code="1 + 2"
```

### Run a file

```sh
node bin/cli examples/fib_loop.md
```

### Browser demo

```sh
make demo   # builds and serves at http://localhost:3131
```

### Tests

```sh
bun test tests/
```

### Tooling (Plan 07 WIP)

```sh
# Build language server bundle
npm run lsp:build

# Generate/test tree-sitter grammar
npm run ts:generate
npm run ts:test

# End-to-end tooling smoke check (LSP + tree-sitter + zed wiring)
npm run tooling:smoke
```

### Performance Tracking

Track the plan-05 perf hot paths (`Eval.walk` and `Env.resolved` lookup):

```sh
npm run bench
```

This writes `bench/results/latest.json` and compares against `bench/plan05-baseline.json`.
Override workload with env vars when needed:

```sh
BENCH_TERMS=4000 BENCH_ITERS=800 npm run bench
```

---

## Language Reference

10x has four basic types: `string`, `number`, `symbol`, and `range`. Everything else is built on top of them.

Statements are separated by semicolons (`;`). Source files are Markdown — prose, headings, and fenced code blocks are ignored; only indented blocks and inline expressions are evaluated.

### Blocks (functions)

The arrow operator (`->`) defines a block. Literals on the left are arguments; everything to the right (before `;`) is the body.

```
sum = a -> b -> a + b;
sum(2, 3);
```

> Result: `5`

Arguments can also be comma-separated:

```
sum = a, b -> a + b;
```

A block with exactly two arguments can be used as an infix operator:

```
adds = a, b -> a + b;
3 adds 5;
```

> Result: `8`

Parentheses create a new context and bind values positionally:

```
(2, 3) => (a, b -> a + b)
```

### Numbers

Decimals, leading-dot, consecutive addition, and parenthesized multiplication all work:

```
.5;
1 2 3 (4 5);
```

> Results: `0.5`, `30`

Fractions are preserved when written as `1/3` (no spaces):

```
1/2;
1 /2;
1 / 2;
```

> Results: `1/2`, `0.5`, `0.5`

A literal (identifier) prefixed by a number is multiplied by that number:

```
x = 42;
3x;
```

> Result: `126`

### Units

Units are special literals that wrap numeric values and support conversion:

```
to = a, b -> a.to(b);
5cm to :in;
```

> Result: `~1.969 in`

### Strings

Strings use double-quotes. Regular expressions and HTML tags are also string-like values:

```
"Hello World";
/test/i;
<b>I am just markup</b>;
```

> Results: `"Hello World"`, `/test/i`, `<b>I am just markup</b>`

Interpolation works in strings and HTML with `#{expr}`:

```
name = "World";
"Hello #{name}!";
<p>Hello #{name}!</p>;
```

Regular expressions don't allow spaces or newlines — use `\s` and `\n` instead.

### Symbols

Symbols are prefixed with `:`. They behave like strings when used as values, and are used as keys in maps and for control flow:

```
:hello;
:(3 - 2);
:\"test-#{:key}\";
```

> Results: `:hello`, `:1`, `:test-key`

Built-in symbols: `:true`, `:false`, `:null`, `:on`, `:off`.

### Maps

Mix named symbols (`:key`) with values to build a map:

```
user =
  :name "John", "Doe",
  :email "john@doe.com";
```

Access values with the dot operator or bracket notation:

```
user.name;
[user]:email;
```

> Results: `"John"`, `"Doe"`, `"john@doe.com"`

Bracket notation is preferred for dynamic key access:

```
[user]:(logged_in ? :name | :email)
```

### Ranges and Lists

Lists use `[` and `]`. Items can be any value or expression:

```
[0, [(< 1 2), (:three 3)]]
```

> Result: `[0, [:on, (:three 3)]]`

Ranges are lazy sequences using `..`:

```
[1..3, "a".."c"]:
```

> Result: `1, 2, 3, "a", "b", "c"`

Named symbol selectors configure list access:

| Selector      | Meaning                                         |
|---------------|-------------------------------------------------|
| `:`           | Expand any ranges within the list               |
| `:1`          | Access item at offset 1                         |
| `::2`         | All values with step 2                          |
| `:1..2`       | 2 items starting at offset 1                    |
| `:1-2`        | Take 1, step 2                                  |
| `:1-2:1..3`   | Combined: `take, step, offset, length`          |

Direct block children are flattened:

```
[(1..3, "a".."c", (4, (5)))];
```

> Result: `[[1, 2, 3], ["a", "b", "c"], 4, 5]`

### Control Flow

```
@if (:on) "yes" "no";
@while (condition) body;
@let x = 1;
:return value;
```

Short-circuit operators: `|` (or), `&` (and), `?` (ternary-like).

### Templates and Imports

Extend operators with `@template`:

```
@template ++ (a, b -> a.concat(b));
```

Import from built-in modules:

```
@import concat @from "Array";
```

Markdown links are also module imports, but only in standalone form:

```
[utils](./utils.md)
```

Keep them on their own line. Inline prose like `See [utils](./utils.md)` is treated as prose/code text and is not a valid import form.

---

## Examples

See the [`examples/`](examples/) directory:

- [`fib_loop.md`](examples/fib_loop.md) — Fibonacci with mutable loop state
- [`fib_memo.md`](examples/fib_memo.md) — Fibonacci with memoization
- [`concat.md`](examples/concat.md) — Custom operator + import
- [`lulz.md`](examples/lulz.md) — Range + pipe + `@match` + map-heavy toy program
- [`markdown.md`](examples/markdown.md) — Prose mixed with code
- [`todolist.md`](examples/todolist.md) — Reactive directives demo (`@signal`, `@html`, `@render`, `@on`)
- [`prompt.md`](examples/prompt.md) — Interactive input
- [`stdin.md`](examples/stdin.md) — Reading from stdin
