<script>
  import Line2 from './Line2.svelte';
  let markup = '1/2 - 3/4 = **OSOMS** 4 * ( 2 / -.5% ) =';
</script>

<Line2 bind:markup />
<pre>{markup}</pre>
