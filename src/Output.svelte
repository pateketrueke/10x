<script>
  export let values = [];
</script>

<style>
  ul { list-style: none; width: 50%; }
</style>

<ul>
  {#each values as { key, text, offset } (key)}
    <li>{text} ({offset})</li>
  {/each}
</ul>
