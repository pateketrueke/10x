# Counter Component

Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  dec = @on count = count - 1,
  @html
    <div style="text-align:center;border:1px solid #333;border-radius:8px;padding:1.5rem;margin:0.5rem">
      <h2 style="margin:0 0 0.5rem">#{props.label}</h2>
      <h1 style="font-size:3rem;margin:0.25rem 0">#{count}</h1>
      <button id="dec" style="padding:0.5rem 1rem;font-size:1.25rem;margin:0.25rem;cursor:pointer">-</button>
      <button id="inc" style="padding:0.5rem 1rem;font-size:1.25rem;margin:0.25rem;cursor:pointer">+</button>
    </div>.

export Counter.
