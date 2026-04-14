# Reactive Examples

Signals, computed values, and event handlers in 10x.

## Basic Signals

count = @signal 0.
name = @signal "Alice".
active = @signal :on.

## Reading Signals

# Signals are read by referencing them
count.
name.
active.

## Computed Values

doubled = @computed count * 2.
greeting = @computed "Hello, " + name.
isPositive = @computed (> count 0).

## Event Handlers

# Basic handler
inc = @on count = count + 1.
dec = @on count = count - 1.

# Handler with computation
reset = @on count = 0.
double = @on count = count * 2.

# Handler with multiple updates
incrementAndDouble = @on
  count = count + 1,
  count = count * 2.

## @on with Assignment

# Assign handler to variable
handler = @on count = count + 1.

# Use handler in template
# <button onclick={handler}>Click</button>

## Signal Composition

# Multiple signals
x = @signal 1.
y = @signal 2.
sum = @computed x + y.
product = @computed x * y.

# Update one signal
updateX = @on x = x + 1.
updateY = @on y = y * 2.

## Conditional Signals

# Signal with conditional update
toggle = @on active = @if (= active :on) :off @else :on.

## Signal in Templates

@render "#app" @html
  <div>
    <h1>Count: #{count}</h1>
    <p>Doubled: #{doubled}</p>
    <button onclick={dec}>-</button>
    <button onclick={inc}>+</button>
    <button onclick={reset}>Reset</button>
  </div>.
