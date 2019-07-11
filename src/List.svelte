<script>
  import Item from './Item.svelte';

  let offset = 0;
  let ref;

  export let items = [];

  function add() {
    items = [...items, { key: offset++, text: '', offset: 0, selected: true, added: true }];
  }

  function sync({ detail: { type, value } }) {
    if (type === 'ENTER') {
      const currentOffset = items.findIndex(x => x.selected);
      const newItems = items.map(x => ({ ...x, selected: false }));

      newItems.splice(currentOffset + 1, 0, { key: offset++, text: '', offset: 0, selected: true, added: true });

      items = newItems;
    } else if (type === 'SELECT') {
      items = items.map(x => ({ ...x, added: false, selected: value === x.key }));
    } else if (type === 'PREV_UP') {
      const currentOffset = items.findIndex(x => x.selected) - 1;
      const fixedOffset = currentOffset < 0 ? 0 : currentOffset;

      items = items.map((x, k) => ({ ...x, added: false, selected: fixedOffset === k }));
    } else if (type === 'NEXT_DOWN') {
      const currentOffset = items.findIndex(x => x.selected) + 1;
      const fixedOffset = currentOffset >= items.length ? items.length - 1 : currentOffset;

      items = items.map((x, k) => ({ ...x, added: false, selected: fixedOffset === k }));
    } else if (type === 'BACK_DROP') {
      const currentOffset = items.findIndex(x => x.selected);
      const fixedOffset = Math.max(0, currentOffset - 1);
      const fixedItems = items
        .filter((_, k) => k !== currentOffset)
        .map((x, k) => ({ ...x, added: false, selected: k === fixedOffset }));

      items = fixedItems;
    } else if (type === 'EVALUATE') {
      items = items.map(x => ({
        ...x,
        added: false,
        text: x.selected ? value.text : x.text,
        offset: x.selected ? value.offset : x.offset,
      }));
    }
  }
</script>

<style>
  div { width: 50%; }
  ol { width: 100% }
</style>

<div>
  <ol bind:this={ref}>
    {#each items as { key, text, offset, added, selected } (key)}
      <Item {key} {text} {offset} {added} {selected} on:change={sync} />
    {/each}
  </ol>
  <button on:click={add}>+</button>
</div>
