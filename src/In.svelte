<script>
  import Line2 from './Line2.svelte';
  export let markup = '';

  let results = [];

  function onUpdate(e) {
    results = e.detail.results;
  }

  function toValue(value, unit) {
    if (value instanceof Date) {
      return value.toString().split(' ').slice(0, 5).join(' ');
    }

    if (typeof value === 'number') {
      value = value.toFixed(2).replace(/\.0+$/, '');
    }

    if (unit) {
      return `${value} ${unit}`;
    }

    return value;
  }
</script>

<style>
  div { display: flex; align-items: center; }
</style>

<div>
  <Line2 bind:markup on:change={onUpdate} />
  <span>
    {#each results as [type, value, unit]}
      <span data-result={type}>{toValue(value, unit)}</span>
    {/each}
  </span>
</div>
