# x-counter

`x-counter` is a tiny reactive web component.
The goal is to keep all behavior in one readable document:
state, view, and user interactions.

## State

The counter starts from a `start` prop when provided.
If the prop is missing, it falls back to `0`.
`@signal` keeps state local to each component instance.

count = @signal @prop "start" 0.

## View

The UI is rendered into `@shadow`, so styles and markup stay scoped.
Whenever `count` changes, `{count}` updates automatically.

@render @shadow @html
  <div class="counter">
    <h1>{count}</h1>
    <div class="actions">
      <button id="dec">−</button>
      <button id="inc">+</button>
      <button id="reset">reset</button>
    </div>
  </div>.

## Behavior

Buttons map directly to state transitions:
increment, decrement, and reset back to the initial prop value.

@on :click "#inc"   count = count + 1.
@on :click "#dec"   count = count - 1.
@on :click "#reset" count = @prop "start" 0.

## Usage Notes

Multiple `x-counter` instances are independent.
Each one keeps its own `count` signal and own `start` baseline.
