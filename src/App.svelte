<script>
  import Line from './Line.svelte';
  let markup = '1 + 1 = **OSOMS** 4 * ( 2 / -.5% ) =';
</script>

<Line bind:markup />
<pre>{markup}</pre>
