<script>
  import In from './Line2.svelte';

  export let debug = false;

  let tests = `
    1 as mm
    1 as mm2
    1 as mcg
    1 as mm3
    1 as mm3/s
    1 as C
    1 as ns
    1 as Hz
    1 as m/s
    1 as s/m
    1 as Pa
    1 as b
    1 as lx
    1 as ppm
    1 as V
    1 as A
    1 as W
    1 as VA
    1 as VAR
    1 as Wh
    1 as VARh
    1 as deg
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
