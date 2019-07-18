<script>
  import In from './In.svelte';

  let tests = [
    [0, '$15,000 MXN / 14 days of **work**'],
    [0, '10 inches in cm'],
    [0, '450 km in miles'],
    [0, '160 pounds as kg'],
    [0, '3 weeks as days'],
    [0, 'Yesterday + 3 weeks 2 days'],
    [0, '3:35 am + 9 hours 20 minutes'],
    [0, 'Now at 6:00 pm - 3 days + 15 min'],
    [0, 'Jun 10, 1987 - 1 week'],
    [0, '1+2-3+4/2+7/-.12 ='],
    [0, '(1+2) - (3 + 4/2) + (7/-.12) ='],
    [0, '(1 + 2) - (3 + (4 / 2)) + (7 / -.12) ='],
    [0, '30 + 20%'],
    [0, '100k'],
    [0, '20M'],
    [0, '3G'],
    [0, '1 2 3 / 4 5 ='],
    [0, '1 2 3 4 5 ='],
    [0, '1 2 3 - 4 5 ='],
    [0, '# today + tomorrow'],
    [0, 'Jun 10 of 1987'],
    [0, 'Jun 10 1987'],
    [0, 'Jun 10'],
    [0, 'Jun 1'],
  ];

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
  label {
    display: flex;
    align-items: center;
  }
  li {
    font-size: 1em;
    min-height: 26px;
    line-height: 26px;
  }
  span {
    padding: 0 3px;
  }
</style>

<ul>
  {#each tests as [on, text]}
    <li>
      <label>
        <input type="checkbox" checked={on} on:click={e => toggle(text)} />
        {#if on}
          <In markup={text} />
        {:else}
          <span>{text}</span>
        {/if}
      </label>
    </li>
  {/each}
</ul>
