<script>
  import Line2 from './Line2.svelte';

  export let debug = false;
  export let markup = '';
</script>

<Line2 {debug} bind:markup />
