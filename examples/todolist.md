## TodoList (Reactive Demo)

This example showcases the reactive directives:
`@signal`, `@html`, `@render`, and `@on`.

todos = @signal "Write parser regression tests".
count = @signal 1.

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

@on "click", "#add", todos = todos + ", ship feature " + count.
@on "click", "#add", count = count + 1.
@on "click", "#clear", todos = "Inbox zero".
