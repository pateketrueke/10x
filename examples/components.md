# Component Examples

Reusable components with state in 10x.

## Simple Component

Box = props -> <div class={props.kind}>#{props.content}</div>.

@render "#app" @html
  <Box kind="info" content="Hello" />.

## Counter Component

Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  dec = @on count = count - 1,
  @html
    <div class="counter">
      <h2>#{props.title}: #{count}</h2>
      <button onclick={dec}>-</button>
      <button onclick={inc}>+</button>
    </div>.

@render "#app" @html
  <Counter title="Count" start=0 />.

## Multiple Instances

@render "#app" @html
  <div>
    <Counter title="First" start=0 />
    <Counter title="Second" start=10 />
    <Counter title="Third" start=100 />
  </div>.

## Toggle Component

Toggle props =>
  active = @signal :off,
  toggle = @on active = @if (= active :on) :off @else :on,
  @html
    <div class="toggle">
      <span>#{active}</span>
      <button onclick={toggle}>Toggle</button>
    </div>.

@render "#app" @html
  <Toggle />.

## Input Component

Input props =>
  value = @signal props.initial,
  update = @on value = event.target.value,
  @html
    <div class="input">
      <label>#{props.label}</label>
      <input type="text" value={value} oninput={update}>
      <span>Current: #{value}</span>
    </div>.

@render "#app" @html
  <Input label="Name" initial="" />.

## List Component

ItemList props =>
  items = @signal props.items,
  @html
    <ul>
      #{map(items, (item i) -> <li>#{item}</li>)}
    </ul>.

@render "#app" @html
  <ItemList items=["Apple", "Banana", "Cherry"] />.

## Nested Components

Card props =>
  @html
    <div class="card">
      <h3>#{props.title}</h3>
      <div class="card-body">
        #{props.children}
      </div>
    </div>.

@render "#app" @html
  <Card title="My Card">
    <Counter start=0 />
  </Card>.

## Shadow DOM Component

# XCounter::

count = @signal @prop "start" 0.

@render @shadow @html
  <style>
    .counter { font-family: system-ui; }
    .count { font-size: 2rem; }
  </style>
  <div class="counter">
    <span class="count">#{count}</span>
    <button onclick={@on count = count + 1}>+</button>
    <button onclick={@on count = count - 1}>-</button>
  </div>.
