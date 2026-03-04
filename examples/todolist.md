# TodoList

`TodoList` is a minimal reactive UI written as one document.
It demonstrates the full loop:
state, rendering, and event-driven updates.

## State

`todos` is a simple text list rendered as one line.
`count` tracks how many items have been added.
Both are signals, so any update automatically refreshes the view.

todos = @signal "Write parser regression tests".
count = @signal 1.

## View

The component renders into `#app`.
The template reads `count` and `todos` directly, and the runtime subscribes to both.

@render "#app" @html
  <section class="todo-card">
    <h1>TodoList</h1>
    <p class="meta">items added: {count}</p>
    <p class="items">{todos}</p>
    <div class="actions">
      <button id="add">+ add item</button>
      <button id="clear">clear</button>
    </div>
  </section>.

## Behavior

`#add` appends a new item label and increments the counter.
`#clear` resets the text to a clean baseline.

@on "click", "#add", todos = todos + ", ship feature " + count.
@on "click", "#add", count = count + 1.
@on "click", "#clear", todos = "Inbox zero".
