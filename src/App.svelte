<script>
  import In from './In.svelte';

  export let debug = false;

  let tests = `
    # today + tomorrow
    $15,000 MXN / 14 days of **work** 😅😇👋🏿
    10 inches in cm
    450 km in miles
    160 pounds as kg
    3 weeks as days
    Yesterday + 3 weeks 2 days
    3:35 am + 9 hours 20 minutes
    Now at 6:00 pm - 3 days + 15 min
    Now at 6:00 pm - Apr 15 2019
    Jun 10, 1987 - 1 week
    1+2-3+4/2+7/-.12 =
    (1+2) - (3 + 4/2) + (7/-.12) =
    (1 + 2) - (3 + (4 / 2)) + (7 / -.12) =
    30 + 20%
    100_000
    1ft_us
    3G
    1 2 3 / 4 5 =
    1 2 3 4 5 =
    1 2 3 - 4 5 =
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
    margin-right: 5px;
  }
  li {
    display: flex;
    font-size: 1em;
    min-height: 1.5em;
    line-height: 1.5em;
    align-items: center;
  }
  span {
    padding: 0 3px;
  }
</style>

<ul>
  {#each tests as [on, text]}
    <li>
      {#if debug}
        <input tabIndex="-1" type="checkbox" checked={on} on:click={e => toggle(text)} />
      {/if}
      {#if !debug || on}
        <In bind:markup={text} />
      {:else}
        <span>{text}</span>
      {/if}
    </li>
  {/each}
</ul>
