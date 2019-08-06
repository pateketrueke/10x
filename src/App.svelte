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

  function modify(evt, offset) {
    if (!(evt && evt.detail) && offset >= 0) {
      idx = offset;
      return;
    }

    const { key, position } = evt.detail;

    if (position !== 'undefined') {
      pos = Math.max(0, pos, position);
    }

    // FIXME: is eating too much... try to flag first, on second
    // attemp then it will move... or remove previous, whatever
    if (key === 8 && idx > 0 && position === 0) {
      if (!input[idx - 1][2].length) {
        input = input.filter(x => x[1] !== idx - 1)
          .map((x, i) => [false, i, x[2]]);
      } else if (!input[idx][2].length) {
        input = input.filter(x => x[1] !== idx)
          .map((x, i) => [false, i, x[2]]);
      }

      idx = Math.max(0, idx - 1);
      pos = input[idx][2].length;
      return;
    }

    // FIXME: cut is good... but render is wrong
    if (key === 13) {
      const left = input[idx][2].substr(0, pos);
      const right = input[idx][2].substr(pos);

      input.splice(idx, 1, [false, null, left], [false, null, right]);
      input = input.map((x, i) => [false, i, x[2]]);

      setTimeout(() => {
        idx++;
      });
      return;
    }

    if (key === 37 || key === 39) {
      pos = Math.max(0, position);
      return;
    }

    if (key === 38) idx = Math.max(0, idx - 1);
    if (key === 40) idx = Math.min(input.length - 1, idx + 1);
  }

  $: if (ref) {
    if (document.activeElement) document.activeElement.blur();

    let node = ref.childNodes[idx];

    while (node && node.contentEditable !== 'true') {
      node = node.children[0];
    }

    if (node && node.textContent) {
      node.focus();
      setCursor(node, Math.min(pos, node.textContent.length - 1));
    }
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
        <In {debug} on:move={e => modify(e, idx)} bind:markup={text} />
      {/if}
    </li>
  {/each}
</ul>
