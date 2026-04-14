# Working Syntax for Signal Operations

## What Works

### 1. `@on` with assignment
```10x
addTask = @on tasks = tasks |> push(:text read(input), :done :off).
```
Returns a handler function that can be called.

### 2. Multi-statement `@on`
```10x
addTask = @on
  tasks = tasks |> push(:text read(input), :done :off),
  input = "".
```
Updates multiple signals in sequence.

### 3. `@computed` for reactive derived values
```10x
doubled = @computed count * 2.
greeting = @computed "Hello, " + name + "!".
sum = @computed x + y.
```
Creates a signal that auto-updates when any dependency changes. Dependencies are tracked automatically.

### 4. Pipe operator with signals
```10x
tasks |> push(:text "hello", :done :off)
tasks |> map((t) -> t.text)
tasks |> filter((t) -> !t.done)
```

### 4. `read(signal)` to get signal value
```10x
read(tasks)  # Returns the array value
read(input)  # Returns the string value
```

### 5. Object merge with `|`
```10x
t | (:done !t.done)  # Merges object, overriding :done
```

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

## Notes

- `@on` is syntax sugar for signal updates - it finds the signal and updates it
- Use `read(signal)` when passing signal values to functions
- Pipe operator `|>` auto-unwraps signals
- Multi-statement `@on` updates signals in sequence
