# Working Syntax Reference

## Signals & Reactivity

### `@signal` / `@computed`
```10x
count = @signal 0.
doubled = @computed count * 2.
greeting = @computed "Hello, " + name + "!".
```

### `@on` — event handlers that update signals
```10x
# Single assignment
addTask = @on tasks = tasks |> push(:text read(input), :done :off).

# Multi-statement
addTask = @on
  tasks = tasks |> push(:text read(input), :done :off),
  input = "".
```

### Regular functions can update signals too
```10x
toggleTask = (i) ->
  tasks = tasks |> map((t j) -> @if (i == j) t | (:done !t.done) @else t).
```

### `read(signal)` to get signal value
```10x
read(tasks)   # Returns the array value
read(input)   # Returns the string value
```

---

## Unary Operators

```10x
!x            # NOT
!x.done       # NOT with dot access — no parens needed
!t.done       # Works in callbacks: (t) -> !t.done
-x            # Unary minus on variable
-x.n          # Unary minus with dot access
-(expr)       # Unary minus on expression
```

---

## Collections

### Array index access
```10x
xs.0          # First element
xs.1          # Second element
"hello".0     # Character by index → "h"
xs.0.name     # Chained: index then property
get(xs, 0)    # Via prelude get()
get(xs, :key) # Key lookup via get()
```

### Spread
```10x
[..xs]        # Spread into array
[1, ..xs]     # Prepend then spread
[..xs, ..ys]  # Merge two arrays
f(..xs)       # Spread as function arguments
```

### Optional chaining
```10x
x?.prop       # nil if x is nil, else x.prop
x?.a?.b       # Chained optional access
```

### Object merge
```10x
t | (:done :on)       # Override :done
t | (:done !t.done)   # Toggle :done
```

---

## Control Flow

### @if — prefix and suffix forms
```10x
# Prefix
@if x 1 @else 0
@if !x 1 @else 0
@if !x.done 1 @else 0

# Suffix
1 @if y @else 0
v @if v > 0 @else 0
t | (:done :on) @if !t.done @else t
f = (v) -> v @if v > 0 @else 0
```

### Ternary
```10x
x ? :yes | :no        # x ? then | else
x ? x | :default      # nil-coalescing pattern
```

### @match
```10x
@match x (1) :one, (2) :two, _ :other    # _ wildcard catch-all
@match x (1) :one @else :other            # @else catch-all
@match x (< 2) "small" @else "big"        # Comparison pattern
classify = @match{1 "one", 2 "two", @else "?"}.  # First-class
```

### @try / @rescue
```10x
@try riskyOp @rescue 0            # Ignore error, return 0
@try riskyOp @rescue (e) e        # Bind error message to e
@try riskyOp @rescue (e) :caught  # Bind but ignore — return :caught
@try riskyOp @rescue (_) :caught  # Explicitly discard error
```

### Logical
```10x
($ a b c)     # AND — true if all truthy
(? a b c)     # OR  — true if any truthy
!x            # NOT
```

> `&&` and `||` are not valid — use `($ a b)` and `(? a b)`.

---

## Full Todolist Example

```10x
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
