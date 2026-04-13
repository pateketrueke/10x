# Reactive Demo

A simple counter with HMR state preservation.

count = @signal 0.
step = @signal 1.

@render "#app" @html
  <div style="font-family: system-ui; padding: 2rem; text-align: center">
    <h1>Counter: #{count}</h1>
    <p>Step size: #{step}</p>
    <div style="display: flex; gap: 0.5rem; justify-content: center">
      <button id="dec">-#{step}</button>
      <button id="inc">+#{step}</button>
    </div>
    <div style="margin-top: 1rem">
      <button id="step-up">Increase Step</button>
      <button id="step-down">Decrease Step</button>
    </div>
  </div>.

@on :click "#inc" count = count + step.
@on :click "#dec" count = count - step.
@on :click "#step-up" step = step + 1.
@on :click "#step-down" step = step - 1.
