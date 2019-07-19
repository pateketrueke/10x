<script>
  import { createEventDispatcher } from 'svelte';

  export let input = [];
  export let tokens = [];
  export let messages = [];
  export let errored = null;

  let mode = 'input';

  const dispatch = createEventDispatcher();

  function focus(offset) {
    dispatch('focus', offset);
  }

  function set(e) {
    mode = e.target.value;
  }
</script>

<style>
  .debug {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-bottom: 3px;
    padding: 0 3px 3px 3px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
  }
  p {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    margin-top: 6px;
    margin-left: 1px;
  }
  em {
    color: silver;
  }
  var {
    font-style: normal;
  }
  span {
    color: gray;
    padding: 0 .3em;
    border-radius: 3px;
    background-color: silver;
  }
  small {
    white-space: nowrap;
    padding: 0 .3em;
    font-size: .75em;
    border: 1px solid silver;
    margin-top: -1px;
    margin-left: -1px;
  }
  small:hover {
    background-color: rgba(0, 0, 0, .05);
  }
</style>

<div class="debug">
  <input checked name="mode" value="input" type="radio" on:click={set} />
  <input name="mode" value="tokens" type="radio" on:click={set} />
  {#if mode === 'input' && input.length}
    <p>
      {#each input as chunk}
        <small>
          {chunk === ' ' ? String.fromCharCode(160) : chunk}
          {#if chunk !== ' '}<span>{chunk.length}</span>{/if}
        </small>
      {/each}
    </p>
  {/if}
  {#if mode === 'tokens' && tokens.length}
    <p>
      {#each tokens as chunk, i}
        <small on:click={() => focus(i)}>
          <em>{chunk[0]}</em>
          <var>{chunk[1]}</var>
          {#if chunk[2]}<span>{chunk[2]}</span>{/if}
        </small>
      {/each}
    </p>
  {/if}
  {#if errored}
    <p>{errored}</p>
  {/if}
</div>
