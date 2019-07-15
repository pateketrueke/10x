<script>
  import Line2 from './Line2.svelte';

  let markup = '1 * (3/2), (.5 * (76 / .12)) =';
  let results = [];

  function onUpdate(e) {
    results = e.detail.results.map(x => x.toFixed(2).replace(/0+$/, ''));
  }
</script>

<style>
  .row { display: flex; align-items: center; }
  .data { padding-left: 20px; }
</style>

<div class="row">
  <Line2 bind:markup on:change={onUpdate} />
  <div class="data">{results.join(', ')}</div>
</div>
