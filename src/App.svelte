<script>
  import In from './Line2.svelte';

  export let debug = false;

  let tests = `
    f(x)=x*2;n=3;f(3)
    π=3.141592654;3π
    Test: 3/2
    2019-08-05T00:21:16.635Z
    This is now, or this week, who nows?
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
