<script>
  import Line2 from './Line2.svelte';

  let markup = 'a+bdef  1+2-3 -5*6.  = **FOO** BAR __BAZ  BUZZ___? 3/2 OR 72 / -.12';
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
