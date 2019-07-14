<script>
  import Line2 from './Line2.svelte';
  let markup = '1/2 - 3/4 = **OSOMS** 4 * ( 2 / -.5% ) =';
</script>

<input type="text" bind:value={markup} />
<Line2 bind:markup />
<pre>{markup}</pre>
