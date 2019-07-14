<script>
  import Line2 from './Line2.svelte';

  function update(e) {
    console.log(e.detail);
  }
</script>

<Line2 markup="1 * (3 / 2) - (.5 * (76 / .12)) =" on:change={update} />
