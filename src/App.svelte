<script>
  import In from './Line2.svelte';

  export let debug = false;

  let tests = `
    2 cm / 35mm
    2 cm of 3 inch
    365 days / 2years
    2TB + 25GB
    3GB / 1MB
    2 + 1 inch + 1cm
    $15,000 MXN / 14 days of **work**  😅😇👋🏿👨‍👨‍👧‍👧
    10 inches in cm
    450 km in miles
    160 pounds as kg
    3 weeks as days
    Yesterday + 3 weeks 2 days
    3:35 am + 9 hours 20 minutes
    Now at 6:00 pm - 3 days + 15 min
    Now at 6:00 pm - Apr 15 2019
    Jun 10, 1987 - 1 week
    1+2-3+4/2+7/-.12
    (1+2) - (3 + 4/2) + (7/-.12)
    (1 + 2) - (3 + (4 / 2)) + (7 / -.12)
    30 + 20%
    100_000
    1ft - .3ft
    3 days in 4 years
    1 month from today
    2 cm in 3 in
    -1 week as 1990
    12 from 1987
    now as 10 of Jun from 1987
    3in / 2 cm
    in cm 2+3
    in cm, 2+3
    2+3 as cm
    2+3, as cm
    1 2 3 / 4 5
    1 2 3 4 5
    1 2 3 - 4 5
    Jun 10 of 1987
    Jun 10 1987
    Jun 10
    Jun 1
  `.trim().split('\n').map(x => [0, x.trim()]);

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
          {#if !on}{text}{/if}
        </label>
      {/if}
      {#if !debug || on}
        <In {debug} bind:markup={text} />
      {/if}
    </li>
  {/each}
</ul>
