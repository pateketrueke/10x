# Reactive Form Example

Form handling with signals, computed validation, and reactive state.

## State

name = @signal "".
email = @signal "".
age = @signal 0.

## Computed Validation

nameValid = @computed (> (name |> size) 2).
emailValid = @computed (~ email "@").
ageValid = @computed (&& (> age 0) (< age 150)).

formValid = @computed (&& nameValid (&& emailValid ageValid)).

## Computed Display

greeting = @computed @if nameValid "Hello, " + name + "!" @else "Please enter your name".

## Event Handlers

setName = @on name = e -> e.target.value.
setEmail = @on email = e -> e.target.value.
setAge = @on age = e -> e.target.value |> int.
submit = @on @if formValid (name = "", email = "", age = 0).

## View

@render "#app" @html
  <form class="signup-form">
    <h1>Sign Up</h1>
    
    <div class="field">
      <label>Name</label>
      <input type="text" value={name} oninput={setName} />
      <span class="hint">#{nameValid ? "✓" | "min 3 chars"}</span>
    </div>
    
    <div class="field">
      <label>Email</label>
      <input type="email" value={email} oninput={setEmail} />
      <span class="hint">#{emailValid ? "✓" | "needs @"}</span>
    </div>
    
    <div class="field">
      <label>Age</label>
      <input type="number" value={age} oninput={setAge} />
      <span class="hint">#{ageValid ? "✓" | "1-149"}</span>
    </div>
    
    <p class="greeting">#{greeting}</p>
    
    <button type="button" onclick={submit} disabled={formValid ? false | true}>
      Submit
    </button>
  </form>.
