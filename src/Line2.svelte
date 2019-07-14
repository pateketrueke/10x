<script context="module">
  import Emoji from './pick/Emoji.svelte';
  import { simpleMarkdown, basicFormat } from './util';
  // import { insertTextAtCursor, getSelectionStart, getCursor, setCursor, noMarkup } from './text';

  const MODES = {
    ':': {
      component: Emoji,
      pagination: 10,
    },
  };
</script>

<script>
  export let markup = '';

  let input;
  let overlay;
  let search = '';
  let enabled = false;
  let selected = 0;
  let usingMode = null;

  // we take the markup and inject HTML from it
  function render() {
    let source = markup;

    // FIXME: instead of this, try render using vDOM?
    source = simpleMarkdown(basicFormat(source));
    source += !/\s$/.test(source) ? ' ' : '';

    input.innerHTML = source;
  }

  function disable() {}
  function enable() {}
  function sync() {}
  function check() {}
  function insert() {}
  function update() {}
  function activate() {}

  // render upon changes from props
  $: if (input && !enabled) render();
</script>

<style>
  .editor {
    word-break: break-word;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: text;
    font-size: 1em;
    min-height: 26px;
    line-height: 26px;
    padding: 0 3px;
    outline: none;
    box-shadow: none;
  }
  .editor:focus {
    outline: 1px dotted silver;
  }
  .overlay {
    cursor: pointer;
  }
  .main {
    position: relative;
  }
</style>

<div class="main">
  <div class="editor" spellcheck="false"
    bind:this={input}
    on:blur={disable}
    on:paste|preventDefault={insert}
    on:keyup|preventDefault={sync}
    on:keydown|preventDefault={check}
    on:click|preventDefault={enable}
  />
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click={activate}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
</div>
