# Counter Component

start = 0.
count = @signal start.

@render "#app" @html
  <div style="text-align:center;padding:1rem">
    <h2>Counter</h2>
    <h1>#{count}</h1>
    <button id="dec">-</button>
    <button id="inc">+</button>
  </div>.

@on :click "#dec" count = count - 1.
@on :click "#inc" count = count + 1.
