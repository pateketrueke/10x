<script>
  import List from './List.svelte';
  import Output from './Output.svelte';

  let values = [];
</script>

<style>
  div { display: flex; }
</style>

<div>
  <List bind:items={values}  />
  <Output {values} />
</div>
