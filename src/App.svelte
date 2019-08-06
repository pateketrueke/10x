<script>
  import In from './Line2.svelte';

  export let debug = false;

  let tests = `
    # Expressions
    Expressions like 1 + 2 just works, however expressions like 1 2 3 / 4 5 are calculated differently.
    > Operator-less expressions between numbers are implicitly added/subtracted as above.
    In such cases, last unary-operator (+ or -) is still used on further operations, e.g. 1 2 3 - 4 5
    > Numbers can have some separators as $1,000 (or 1_000), add spaces to disambiguate.
    Notice: all math-expressions are disabled within formatting tags.
    # Definitions
    Local definitions are possible too, e.g. x=1.5; 3x
    Basic function-expressions are available: f(d',x)=d'*x; f(3, 5)
    > Also, previously defined functions and variables can be shared, e.g. f(2, x) / .33
    Definitions yield nothing back:
      a'= 1.2;
      b'= 3.4;
      c'= a' * b' / 2;
    Number-less units are not evaluated: c'.
    Numbers along with units are evaluated: 1c', -0.2a' or 2-b'.
    # Units
    Some values are already units, like 1cm - 35mm.
    Numbers are not tokenized if they're alone within parenthesis, e.g. (123)
    Numbers can alse be expressed as fractions, e.g. 1/2 or 0.00032 as fr.
    # Sandbox
    2 cm / 35mm
    2 cm of 3 inch
    365 days / 2years
    2TB + 25GB
    3GB / 1MB
    2 + 1 inch + 1cm
    $15,000 MXN / 14 days of **work** 😅😇👋🏿👨‍👨‍👧‍👧
    160 pounds as kg
    3 weeks as days
    1 2 3 / 4 5
    1 2 3 4 5
    1 2 3 - 4 5
    3in / 2 cm
    1+2-3+4/2+7/-.12
    (1+2) - (3 + 4/2) + (7/-.12)
    (1 + 2) - (3 + (4 / 2)) + (7 / -.12)
    30 + 20%
    100_000
    1m as in
    1ft-us as cm
    1ft - .3ft
    2 cm in 3 in
    10 inches in cm
    450 km in miles
    3 days in 4 years
    2+3 as cm
    2+3, as cm
    12 from 1987
    Jun 10 - Apr 15, 2019
    6:00:00 pm - 3:15:05 am
    now, today,
    this week or weekend is fine?
  `.trim().split('\n').map(x => [0, x.replace(/^\s{4}/, '')]);

  function toggle(text) {
    tests = tests.map(([x, y]) => [text === y ? !x : x, y]);
  }
</script>

<style>
  ul {
    padding: 0;
  }
  input {
    cursor: pointer;
    margin-right: 5px;
  }
  li {
    clear: both;
    font-size: 1em;
    min-height: 1.5em;
  }
  label {
    z-index: 1;
    float: left;
    opacity: 0.6;
    padding: 0 3px;
    cursor: pointer;
    position: relative;
  }
  label:hover {
    opacity: 1;
  }
</style>

<ul>
  {#each tests as [on, text]}
    <li>
      {#if debug}
        <label>
          <input
            on:click={e => toggle(text)}
            type="checkbox"
            checked={on}
            tabIndex="-1"
          />
          {#if !on}<input type="text" bind:value={text} />{/if}
        </label>
      {/if}
      {#if !debug || on}
        <In {debug} bind:markup={text} />
      {/if}
    </li>
  {/each}
</ul>
