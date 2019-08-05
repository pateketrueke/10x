<script>
  import { createEventDispatcher } from 'svelte';

  export let input = [];
  export let tokens = [];
  export let errored = null;

  let mode = 'input';

  const dispatch = createEventDispatcher();

  function focus(type, position) {
    dispatch('focus', { type, position });
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
    padding: 0 3px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .1);
  }
  .error {
    padding-bottom: .2em;
    font-size: .85em;
    color: red;
    margin: 0;
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
    margin: 0 .2em;
    font-style: normal;
  }
  p span {
    color: gray;
    padding: 0 .3em;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, .1);
  }
  p small {
    white-space: nowrap;
    align-items: center;
    display: flex;
    padding: 2px;
    font-size: .75em;
    border: 1px solid rgba(0, 0, 0, .1);
    margin-top: -1px;
    margin-left: -1px;
  }
  p small:hover {
    background-color: rgba(0, 0, 0, .05);
  }
  p small span {
    margin-left: 2px;
  }
  label {
    color: gray;
    cursor: pointer;
  }
  label:hover {
    text-decoration: underline;
  }
  input {
    display: none;
  }
  input:checked + span {
    font-weight: bold;
  }
</style>

<div class="debug">
  {#if mode === 'input' && input.length}
    <p>
      {#each input as chunk, i}
        <small on:click={() => focus('input', i)}>
          {chunk.replace(/\s/g, String.fromCharCode(160))}
          {#if chunk !== ' ' && chunk.length > 5}<span>{chunk.length}</span>{/if}
        </small>
      {/each}
    </p>
  {/if}
  {#if mode === 'tokens' && tokens.length}
    <p>
      {#each tokens as chunk, i}
        <small on:click={() => focus('tokens', i)}>
          <em>{chunk[0]}</em>
          <var>{chunk[1]}</var>
          {#if chunk[2]}<span>{Array.isArray(chunk[2]) ? '...' : chunk[2]}</span>{/if}
        </small>
      {/each}
    </p>
  {/if}
  <small>
    {#if input.length}
      <label>
        <input checked name="mode" value="input" type="radio" on:click={set} />
        <span>input</span>
      </label>
    {/if}
    {#if tokens.length}
      <label>
        <input name="mode" value="tokens" type="radio" on:click={set} />
        <span>tokens</span>
      </label>
    {/if}
  </small>
  {#if errored}
    <p class="error">{errored.message}</p>
  {/if}
</div>
