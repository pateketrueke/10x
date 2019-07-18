<script>
  import Line2 from './Line2.svelte';
  export let markup = '';

  let results = [];

  function onUpdate(e) {
    results = e.detail.results;
  }
</script>

<style>
  div { display: flex; align-items: center; }
</style>

<div>
  <Line2 bind:markup on:change={onUpdate} />
  <span>
    {#each results as [type, value]}
      <span data-result={type}>{value}</span>
    {/each}
  </span>
</div>
