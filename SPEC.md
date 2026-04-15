# 10x Language Specification

10x is a Markdown-friendly expression language with built-in unit conversions, currency exchange, ranges/lists, blocks (lambdas), and a type system built on four primitives: `string`, `number`, `symbol`, and `range`. Source files use the `.md` extension.

## Table of Contents

1. [Literals](#literals)
2. [Operators](#operators)
3. [Functions and Blocks](#functions-and-blocks)
4. [Collections](#collections)
5. [Control Flow](#control-flow)
6. [Directives](#directives)
7. [Components](#components)
8. [HTML Templates](#html-templates)
9. [Modules and Imports](#modules-and-imports)
10. [Markdown Integration](#markdown-integration)
11. [Standard Library](#standard-library)
12. [Complete Example](#complete-example--todolist)

---

## Literals

### Numbers

```markdown
42
3.14
-7
1/2              # Fraction literal (evaluates to 0.5)
1/2 + 3/4        # Fraction arithmetic
```

### Strings

```markdown
"hello"
"foo\"bar"              # Escaped quotes
"""multi
line
string"""               # Multi-line strings (triple quotes)
"Hello #{name}!"        # String interpolation
"#{1 + 2}"              # Expression interpolation
```

### Symbols

Symbols are atoms/enums prefixed with `:`:

```markdown
:foo
:click
:nil              # null value
:on               # true value
:off              # false value
:(1 + 2)          # Computed symbol: :3
:"#{:on}"         # Resolves to :on
```

### Ranges

```markdown
1..3              # Range [1, 2, 3]
-3..0             # Range [-3, -2, -1, 0]
1..               # Infinite range starting at 1
"a".."z"          # Character range
0..10:2           # Range with step of 2
1..:5             # Take first 5 from infinite range
[1..3 :1-2]       # Range with offset (1) and length (2)
```

### Units

Numbers can have units attached:

```markdown
1m                # 1 meter
2 cm              # 2 centimeters
5 kg              # 5 kilograms
10 USD            # 10 US dollars
1m to cm          # Unit conversion → 100 cm
5km to miles      # Distance conversion
```

---

## Operators

### Arithmetic

```markdown
1 + 2             # Addition → 3
3 - 1             # Subtraction → 2
2 * 3             # Multiplication → 6
6 / 2             # Division → 3
5 % 3             # Modulo → 2
-x                # Unary minus on variable → negated value
-x.n              # Unary minus with dot access
```

### Comparison

All comparison operators use prefix notation:

```markdown
(= 1 1)           # Equal (weak) → :on
(== 1 "1")        # Exact equal (strict) → :off
(!= 1 2)          # Not equal → :on
(< 1 2)           # Less than → :on
(<= 2 2)          # Less than or equal → :on
(> 3 1)           # Greater than → :on
(>= 3 3)          # Greater than or equal → :on
(~ "hello" "ell") # Contains/match → :on
```

### Logical

```markdown
!x                # NOT — negation
!x.done           # NOT with dot access (no parens needed)
!t.done           # Works in callbacks too: (t) -> !t.done
(? 0 1 0)         # Some (OR) — true if any is truthy → :on
($ 1 1 1)         # Every (AND) — true if all are truthy → :on
```

> **Note:** `||` and `&&` are not valid operators. Use `(? a b)` for OR, `($ a b)` for AND.

### Pipe

```markdown
3 |> double       # Pipe value to function
1.. |> filter(n -> (= n % 2 0)) |> take(5)
```

### Ternary (If-Then-Else)

```markdown
:on ? 42 | -1     # If truthy, return 42, else -1 → 42
:off ? 42 | -1    # → -1
x ? x | :default  # Nil-coalescing pattern
```

### Suffix Conditional

```markdown
v @if v > 0 @else 0           # Suffix @if — condition after value
x | (:done :on) @if !x.done @else x   # Object merge with condition
f = (v) -> v @if v > 0 @else 0        # In function bodies
```

### Record Merge

```markdown
{:a 1} | {"b": 2}   # Merge records → {:a 1, "b": 2}
```

---

## Functions and Blocks

### Lambda Syntax

```markdown
-> 42                   # No-op function (returns 42)
x -> x + 1              # Single argument
(a b) -> a + b          # Multiple arguments (space-separated)
(a b ..) -> [a, b, ..]  # Variadic (rest args with ..)
```

### Named Functions

```markdown
double = x -> x * 2.
sum = (a b) -> a + b.
```

### Block-Body Functions (Fat Arrow)

Used for multi-statement bodies:

```markdown
Name => statement, statement.
Name arg => statement, statement.
Name arg1 arg2 => statement, statement.
```

Example:

```markdown
Counter props =>
  count = @signal props.start,
  @html <div>#{count}</div>.
```

### Function Calls

```markdown
sum(1, 2)           # Explicit call
sum 1 2             # Implicit call (no parens)
f()(1)()            # Chained calls
```

### Partial Application

```markdown
add3 = sum(3).      # Partial application
add3(5)             # Returns 8

div2 = div(_, 2).   # Placeholder for argument
div2(10)            # Returns 5
```

### Closures

```markdown
makeAdder = n -> (m -> m + n).
add5 = makeAdder(5).
add5(3)             # Returns 8
```

### Memoization

```markdown
fib = n -> @if (< n 2) 1 @else fib(n - 1) + fib(n - 2).
fib!(10)            # Cached/memoized call (use ! suffix)
```

---

## Collections

### Lists/Arrays

```markdown
[1, 2, 3]
[1, [2, [3]]]       # Nested
[1..3]              # Range as array → [1, 2, 3]
```

### Maps/Objects

```markdown
:key "value"                    # Tagged value
:key 42, :other "x"             # Multiple tagged values
(:key 42)                       # Single tagged value
{:a 1, :b 2}                    # Object with symbol keys
{"name": "Alice", "age": 30}    # Object with string keys
```

### Access

```markdown
data.key                        # Dot access
data.nested.value               # Nested access
xs.0                            # Numeric index via dot → first element
xs.1                            # Second element
"hello".0                       # String character by index → "h"
xs.0.name                       # Chained: index then property
get(xs, 0)                      # Index via prelude get()
get(xs, :key)                   # Key lookup via prelude get()
[list]:0                        # Bracket index access
[user]:("name")                 # Dynamic key access
[:t 42]:t                       # Symbol key access
x?.prop                         # Optional chaining — nil if x is nil
x?.a?.b                         # Chained optional access
```

### Spread

```markdown
[..xs]                          # Spread array into new array
[1, ..xs]                       # Prepend then spread
[..xs, ..ys]                    # Merge two arrays
f(..xs)                         # Spread array as function arguments
div(.., 2)                      # Placeholder spread (partial application)
(a b ..) -> [a, b, ..]          # Rest parameters
```

### Destructuring

```markdown
a, b = (1, 2).                  # a = 1, b = 2
x, y, z = (10, 20, 30).
a, b, ...rest = (1, 2, 3, 4).  # rest = [3, 4]
_, b = (4, 5).                  # Discard first value
```

---

## Control Flow

### @if / @else

Prefix form — condition first:

```markdown
@if (< 1 2) "yes" @else "no"   # With comparison
@if x 1 @else 0                # Bare variable condition
@if !x 1 @else 0               # Negated condition
@if !x.done 1 @else 0          # Negated dot-access condition
@if (:on) "truthy" @else @do (x = 42. x)
```

Suffix form — value first, condition after:

```markdown
1 @if y @else 0                # Value @if condition @else fallback
v @if v > 0 @else 0            # Multi-token condition
f = (v) -> v @if v > 0 @else 0 # In function bodies
t | (:done :on) @if !t.done @else t  # Object merge with condition
```

### @while / @do

```markdown
@while (> n 0) @do (n = n - 1. n)
@let n = 3 @while (> n 0) @do (n = n - 1. n + 1)
```

### @match

Pattern matching with conditions:

```markdown
@match 1 (1) :one, (2) :two, _ :other   # Symbol results, _ wildcard
@match x (1) 42, (2) 99 @else 0         # Number results with @else
@match x (< 2) "small" @else "big"      # Comparison pattern
@match value (1) :one @else :other       # Inline comma or @else form
```

Wildcard and catch-all:

```markdown
_ :fallback                      # _ matches anything (catch-all)
@else :fallback                  # @else also works as catch-all
```

First-class match functions:

```markdown
classify = @match{1 "one", 2 "two", @else "other"}.
classify(1)                       # Returns "one"
```

### @try / @check / @rescue

```markdown
@try riskyOp @rescue 0            # Return 0 on error (no binding)
@try riskyOp @rescue (e) e        # Bind error to e, use in body
@try riskyOp @rescue (e) :caught  # Bind and ignore error value
@try riskyOp @rescue (_) :caught  # Discard error explicitly
@try x @check (> x 0) @rescue -1  # Check condition, rescue if fails
```

### @let

```markdown
@let x = 1.
@let x = 3 @if (> x 0) (x = x - 1).
```

### @loop

```markdown
@loop 1..3                        # Iterate over range
@loop (1..3) x -> x * 2           # Map over range
@loop (list) item -> process(item)
```

---

## Directives

### Result Types

```markdown
(@ok 42)              # Success result
(@err "failed")       # Error result
(@ok 5) ? 0           # Unwrap with default → 5
(@err "x") ? 0        # Unwrap with default → 0
```

### Reactive Runtime

#### @signal

Creates reactive state:

```markdown
count = @signal 0.
name = @signal "Alice".
```

#### @computed

Creates a derived reactive value that automatically updates when its dependencies change:

```markdown
doubled = @computed count * 2.
greeting = @computed "Hello, " + name + "!".
sum = @computed x + y.
```

**How it works:**

- Creates a signal that auto-updates when any referenced signal changes
- Dependencies are tracked automatically - no manual subscription needed
- Works with any expression: arithmetic, string concatenation, comparisons, etc.

**Why use `@computed` vs template interpolation:**

```markdown
# Template interpolation - evaluated once, NOT reactive
@html <span>#{count * 2}</span>.

# @computed - creates a reactive signal
doubled = @computed count * 2.
@html <span>#{doubled}</span>.  # Updates when count changes
```

Template interpolation `#{count}` is reactive because somedom subscribes to the signal directly. But `#{count * 2}` is an expression evaluated once during render. Use `@computed` for reactive derived values.

#### @render / @html

Renders HTML to a target:

```markdown
@render "#app" @html
  <div>#{count}</div>.

@render @shadow @html
  <div class="counter">#{count}</div>.
```

`@html:tag` wraps the rendered output in the specified element:

```markdown
# Fragment — children go directly into #app
@render "#app" @html
  <div>foo</div>
  <b>baz</b>.

# Wrapped — children are inside <section> inside #app
@render "#app" @html:section
  <div>foo</div>
  <b>baz</b>.
```

When used as a standalone value embedded via `#{}` interpolation,
`@html:tag` sets the placeholder wrapper element (default is `x-slot`):

```markdown
# Uses <x-slot> as placeholder (default)
view = @html <span>#{name}</span>.
<p>Hello #{view}</p>   →  <p>Hello <x-slot>...</x-slot></p>

# Uses <span> as placeholder — safe for inline contexts
view = @html:span <span>#{name}</span>.
<p>Hello #{view}</p>   →  <p>Hello <span>...</span></p>
```

#### @on

Event handlers that update signals:

```markdown
@on :click "#inc" count = count + 1.          # Single assignment
@on :click "#dec" count = count - 1.
@on :input "#field" name = event.target.value.

@on                                            # Multi-statement
  tasks = tasks |> push(:text read(input), :done :off),
  input = "".
```

Inline event handlers:

```markdown
<button onclick={@on count = count + 1}>+</button>
```

Regular functions can also update signals via assignment:

```markdown
toggleTask = (i) ->
  tasks = tasks |> map((t j) -> @if (i == j) t | (:done !t.done) @else t).
```

Use `read(signal)` to get the current value of a signal:

```markdown
read(tasks)   # Returns the array value
read(input)   # Returns the string value
```

#### @shadow

Render into shadow DOM (scoped styles):

```markdown
@render @shadow @html <style>.box { color: red; }</style><div class="box">Hi</div>.
```

### Testing

```markdown
@test "adds numbers" => 1 + 1.
@test "check value" => @expect 1 == 1.
@before_all @mount "#app".
@before_each => @reset.
```

### Annotations

Type annotations for documentation, linting, and runtime validation:

```markdown
a :: number.
a = 1.
name :: string.
name = "Alice".
```

#### Supported Types

```markdown
count :: number.
name :: string.
active :: boolean.
items :: list.
fn :: function.
result :: :ok | :err.           # Symbol types
value :: number | string.       # Union types
```

#### Runtime Validation

Type annotations are opt-in and validated at runtime in dev mode:

```markdown
x :: number.
x = "hello".                    # Type error: expected number, got string
```

Union types allow multiple valid types:

```markdown
id :: number | string.
id = 42.                        # OK
id = "abc".                     # OK
id = :on.                       # Type error: expected number | string, got symbol
```

---

## Components

### Inline Component Syntax

```markdown
Box = props -> <div class={props.kind} />.
<Box kind={"ok"} />
```

### Component with State

```markdown
Counter props =>
  count = @signal props.start,
  @html
    <div>
      <h1>#{count}</h1>
      <button onclick={@on count = count + 1}>+</button>
    </div>.
```

### Using Components

```markdown
@render "#app" @html
  <div>
    <Counter start=0 />
    <Counter start=10 />
  </div>.
```

### Shadow DOM Components

For web components with style isolation:

```markdown
# XCounter::

count = @signal @prop "start" 0.

@render @shadow @html
  <style>.count { font-size: 2rem; }</style>
  <div class="count">#{count}</div>.

@on :click "#inc" count = count + 1.
```

### Props

```markdown
count = @signal @prop "start" 0.    # Get prop "start" with default 0
name = @prop "title" "Untitled".    # Get prop without signal
```

---

## HTML Templates

### Basic Tags

```markdown
<div>Hello</div>
<span class="label">Text</span>
<input type="text" />
```

### Dynamic Attributes

```markdown
<div class={kind}>Content</div>
<button disabled={isDisabled}>Click</button>
```

### Interpolation

```markdown
<div>#{count}</div>
<span>Hello #{name}!</span>
```

### Spread Props

```markdown
<div {...props} class="override" />
```

### Nested Components

```markdown
<Container>
  <Header title="My App" />
  <Content>{children}</Content>
</Container>
```

---

## Modules and Imports

### @import / @from

```markdown
@import sum @from "Prelude".
@import (head, take, map) @from "Prelude".
@import signal, html, render @from "Runtime".
@import (:toFixed d) @from "Number".
```

### @module / @export

```markdown
@module "Math" @export pi.
@export @template ++.
```

### @template

Define operators:

```markdown
@template ++ (a b) -> a + b.
@template += ((a b) -> @let a = a + b).
@template >> ((a b) -> a + b).
```

Usage:

```markdown
1 ++ 2              # → 3
x += 5             # x = x + 5
```

### Standalone Links as Imports

```markdown
[utils](./utils.md)
[ops, @template](./ops.md)
```

---

## Markdown Integration

### Prose is Ignored

Regular Markdown text is not evaluated:

```markdown
# This is a heading

This is prose text that is ignored.

> Blockquotes are also ignored.

- List items are prose too.
```

### Code is Evaluated

Code expressions are evaluated:

```markdown
x = 1.
y = 2.
x + y              # → 3
```

### Mixed Content

```markdown
# My Program

This is documentation.

x = 42.

The value is #{x}.
```

### Namespaces (Headings)

Headings with `::` create namespaces:

```markdown
# Math::

pi = 3.14159.
area = r -> pi * r * r.

Math.area(2)       # → 12.566
```

### Tables

```markdown
| name | age |
|------|-----|
| Alice | 30 |
| Bob | 25 |
```

---

## Standard Library

### Prelude Functions

```markdown
# Collections
head(list)              # First element
tail(list)              # Rest of list
take(list, n)           # First n elements
drop(list, n)           # Drop first n elements
map(list, fn)           # Transform elements
filter(list, fn)        # Filter elements
rev(list)               # Reverse
size(list)              # Length

# Objects
pairs(obj)              # Key-value pairs
keys(obj)               # Keys
vals(obj)               # Values
get(target, key)        # Get by index (number) or key (symbol)
                        #   get(xs, 0)    → first element
                        #   get(xs, :key) → property lookup
push(target, ...sources) # Merge/push

# Utility
equals(a, b)            # Deep equality
show(...args)           # String representation
format(str, ...args)    # Format string
```

### Runtime Functions

```markdown
signal(initial, name)       # Create reactive signal
computed(fn)                # Create computed signal
read(signal)                # Read signal value
html(fn)                    # Create HTML view
render(target, view)        # Render to DOM
renderShadow(host, view)    # Render to shadow DOM
on(event, selector, handler) # Event handler
style(host, css)            # Inject styles
```

---

## Event Symbols

```markdown
:click :focus :blur :input :change :submit :load :error
:mouseenter :mouseleave :mousedown :mouseup :mouseover :mouseout
:keydown :keyup :keypress
:touchstart :touchend :touchmove :touchcancel
```

---

## Special Values

| Symbol | Value |
|--------|-------|
| `:nil` | `null` |
| `:on` | `true` |
| `:off` | `false` |

---

## Comments

```markdown
// Single line comment
/* Multi-line
   comment */
```

---

## Regex

```markdown
/x/                  # Basic regex
/x/i                 # With flags
/x\\/y/g             # Escaped
(= /^x/ "xyz")       # Match test
```

---

## Format Strings

The `%` operator formats strings:

```markdown
"Test: {} {}" % (1, 2)           # → "Test: 1 2"
"Test: {1} {0}" % [1, 2]         # → "Test: 2 1"
"x: #{y}" % (:y 42)              # → "x: 42"
```

---

## Operator Precedence

From highest to lowest:

1. Parentheses `()` and blocks `{}`
2. Range `..`
3. Unary `-`, `!`
4. Multiplication `*`, Division `/`, Modulo `%`
5. Addition `+`, Subtraction `-`
6. Comparison `<`, `<=`, `>`, `>=`
7. Equality `=`, `==`, `!=`, `~`
8. Logical `?` (some), `$` (every)
9. Pipe `|>`
10. Ternary `? |`

---

## Statement Termination

Statements end with `.`:

```markdown
x = 1.
y = 2.
x + y.
```

Multiple statements on one line use `,`:

```markdown
x = 1, y = 2, x + y.
```

---

## Complete Example — Todolist

A full reactive todolist demonstrating signals, events, pipes, callbacks, and HTML rendering:

```markdown
tasks = @signal [].
input = @signal "".

addTask = @on
  tasks = tasks |> push(:text read(input), :done :off),
  input = "".

updateInput = @on input = e -> e.target.value.

toggleTask = (i) ->
  tasks = tasks |> map((t j) -> @if (i == j) t | (:done !t.done) @else t).

clearDone = @on
  tasks = tasks |> filter((t) -> !t.done).

@render "#app" @html
  <section>
    <input value={input} oninput={updateInput} />
    <button onclick={addTask}>Add</button>
    <ul>
      #{tasks |> map((t i) ->
        <li>
          <input type="checkbox" checked={t.done} onchange={() -> toggleTask(i)} />
          #{t.text}
        </li>
      )}
    </ul>
    <button onclick={clearDone}>Clear done</button>
  </section>.
```
