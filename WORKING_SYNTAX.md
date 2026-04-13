# Working Syntax for Signal Operations

## What Works

### 1. Direct `@on` (not assigned to variable)
```10x
@on tasks = tasks |> push(:text read(input), :done :off).
```
Returns a handler function that can be called.

### 2. Pipe operator with signals
```10x
tasks |> push(:text "hello", :done :off)
tasks |> map((t) -> t.text)
tasks |> filter((t) -> !t.done)
```

### 3. `read(signal)` to get signal value
```10x
read(tasks)  # Returns the array value
read(input)  # Returns the string value
```

### 4. Object merge with `|`
```10x
t | (:done !t.done)  # Merges object, overriding :done
```

## What Doesn't Work

### 1. Assignment doesn't evaluate right-hand side
```10x
result = map([1,2,3], (x) -> x * 2)  # Stores tokens, not result
```

### 2. Multi-statement `@on` bodies
```10x
@on tasks = push(...), input = ""  # Doesn't work
```

## Working Todolist Pattern

```10x
tasks = @signal [].
input = @signal "".

# Create handlers separately
addTask = @on tasks = tasks |> push(:text read(input), :done :off).
clearInput = @on input = "".
toggleTask = (i) -> tasks = tasks |> map((t j) -> @if (i == j) t | (:done !t.done) @else t).
clearDone = @on tasks = tasks |> filter((t) -> !t.done).

# Combined add + clear
addAndClear = @on
  tasks = tasks |> push(:text read(input), :done :off),
  input = "".
```

Wait, multi-statement doesn't work. Need separate handlers:

```10x
# In template, call both handlers
<button onclick={@on tasks = tasks |> push(:text read(input), :done :off), input = ""}>Add</button>
```

Or use inline @on in template:
```10x
<button onclick={@on tasks = tasks |> push(:text read(input), :done :off). @on input = "".}>Add</button>
```
