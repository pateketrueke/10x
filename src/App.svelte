<script>
  import In from './Line2.svelte';
  import { setCursor } from './util';

  export let debug = false;
  export let lines = [];

  let idx = 0;
  let pos = 0;
  let ref = null;
  let input = lines.map((x, i) => [false, i, x]);

  function toggle(offset) {
    input = input.map(x => [x[1] === offset ? !x[0] : x[0], x[1], x[2]]);
  }

  function select(evt, offset) {
    if (evt.detail && typeof evt.detail.position !== 'undefined') {
      pos = Math.max(0, evt.detail.position);
    }

    idx = offset;
  }

  function focus(evt) {
    const { key, position } = evt.detail;

    if (key === 37 || key === 39) {
      pos = Math.max(0, position);
      return;
    }

    if (key === 38) idx = Math.max(0, idx - 1);
    if (key === 40) idx = Math.min(input.length - 1, idx + 1);

    if (document.activeElement) document.activeElement.blur();

    let node = ref.childNodes[idx];

    while (node.contentEditable !== 'true') {
      node = node.children[0];
    }

    pos = Math.min(pos, node.textContent.length - 1);
    node.focus();
    setCursor(node, pos);
  }
</script>

<style>
  ul {
    padding: 0;
    border: 1px inset;
  }
  li {
    cursor: text;
    display: flex;
    font-size: 1em;
    min-height: 1.5em;
  }
  label:hover {
    opacity: 1;
  }
  input[type=text] {
    border: 0;
    width: 100%;
    outline: none;
    min-height: 20px;
    font-size: inherit;
    margin-bottom: 5px;
  }
</style>

<ul bind:this={ref}>
  {#each input as [on, idx, text] (idx)}
    <li>
      {#if debug}
        <input
          on:click={e => toggle(idx)}
          type="checkbox"
          checked={on}
          tabIndex="-1"
        />
        {#if !on}<input type="text" bind:value={text} />{/if}
      {/if}
      {#if !debug || on}
        <In {debug} on:move={focus} on:pick={e => select(e, idx)} bind:markup={text} />
      {/if}
    </li>
  {/each}
</ul>
