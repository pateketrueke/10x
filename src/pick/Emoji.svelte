<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import images from 'emoji.json';

  export let disabled = false;
  export let selected = 0;
  export let search = '';

  const dispatch = createEventDispatcher();

  onMount(() => {
    dispatch('change', { data: images, offset: selected });
  });

  $: filtered = !disabled && images
      .filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100);

  $: if (filtered) {
    dispatch('change', { data: filtered, offset: selected = Math.max(0, Math.min(filtered.length - 1, selected)) });
  }
</script>

<style>
  .on, .off:hover {
    background-color: gray;
  }
  span {
    padding: 0 2px 5px 2px;
    transition: all .3s;
    transform-origin: 50% 50%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
  small {
    color: silver;
  }
</style>

{#if !disabled}
  <small>{filtered[selected] ? filtered[selected].name : `"${search}" was not found`}</small>
  {#each filtered as emoji, key (emoji.codes)}
    {#if (key % 10) === 0}<br />{/if}
    <span class={selected === key ? 'on' : 'off'} title={emoji.name}>{emoji.char}</span>
  {/each}
{/if}
