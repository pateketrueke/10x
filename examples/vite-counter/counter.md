# Counter

count = @signal 0.

@render "#app" @html
  <div style="text-align:center;padding:2rem;font-family:system-ui">
    <h1 style="font-size:3rem;margin:0.5rem 0">Count: #{count}</h1>
    <div style="display:flex;gap:0.5rem;justify-content:center">
      <button id="dec" style="padding:0.5rem 1rem;font-size:1.25rem;cursor:pointer">-</button>
      <button id="inc" style="padding:0.5rem 1rem;font-size:1.25rem;cursor:pointer">+</button>
    </div>
  </div>.

@on :click "#dec" count = count - 1.
@on :click "#inc" count = count + 1.
