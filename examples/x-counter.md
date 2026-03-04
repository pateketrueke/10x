# x-counter

A self-contained counter web component.
Each instance keeps its own state — no shared globals.

count = @signal @prop "start" 0.

@render @shadow @html
  <div class="counter">
    <h1>{count}</h1>
    <div class="actions">
      <button id="dec">−</button>
      <button id="inc">+</button>
      <button id="reset">reset</button>
    </div>
  </div>.

@on "click" "#inc"   count = count + 1.
@on "click" "#dec"   count = count - 1.
@on "click" "#reset" count = @prop "start" 0.
