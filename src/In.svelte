<script>
  import Line2 from './Line2.svelte';
  export let markup = '';

  let results = [];

  function onUpdate(e) {
    results = e.detail.results;
  }
</script>

<style>
  .row { display: flex; align-items: center; }
  .data { padding-left: 20px; display: flex; }
</style>

<div class="row">
  <Line2 bind:markup on:change={onUpdate} />
  <div class="result">
    {#each results as { value }}
      <span data-result>{value[1]}</span>
    {/each}
  </div>
</div>
