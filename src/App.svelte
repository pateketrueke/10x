<script>
  import Line2 from './Line2.svelte';
  let markup = '1 + 2, 3 + 4; 3/5 * 7/8.';
</script>

<input type="text" bind:value={markup} />
<Line2 bind:markup />
<pre>{markup}</pre>
