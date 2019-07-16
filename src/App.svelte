<script>
  import Line2 from './Line2.svelte';

  let markup = '(1+2)) - 3 = **1+2** __A___ AND **IT*x+** SUCKS?';
  let results = [];

  function onUpdate(e) {
    results = e.detail.results.map(x => x.toFixed(2).replace(/\.0+$/, ''));
  }
</script>

<style>
  .row { display: flex; align-items: center; }
  .data { padding-left: 20px; display: flex; }
</style>

<div class="row">
  <Line2 bind:markup on:change={onUpdate} />
  <div class="result">
    {#each results as value}
      <span data-result>{value}</span>
    {/each}
  </div>
</div>
