<script context="module">
  import Emoji from './pick/Emoji.svelte';
  import {
    simpleMarkdown,
    basicFormat,
    getCursor,
    setCursor,
    getClipbordText,
  } from './util';

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
  let offset = 0;
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

  // apply changes to current markup
  function mutate(text, length = 0) {
    const prefix = markup.substr(0, offset + length);
    const suffix = markup.substr(offset);

    markup = prefix + text + suffix;
    render();
    setCursor(input, (offset + length) + text.length);
  }

  function disable() {
    if (enabled) {
      input.contentEditable = false;
      enabled = false;
    }
  }

  function enable() {
    if (!enabled) {
      input.contentEditable = true;
      input.focus();
      enabled = true;
    }
  }

  function sync(e) {
    // update offset and reset cursor again,
    // otherwise the cursor gets reset
    offset = getCursor(input);
    setCursor(input, offset);

    if (e.key.length === 1) {
      mutate(e.key);
    } else if (e.keyCode === 8) {
      mutate('', -1);
    }
  }

  function check(e) {
    if (e) {
      // allow to select-all the text
      if (e.metaKey && e.keyCode === 65) return;

      // allow some keys for moving inside the contenteditable
      if (e.metaKey || e.key === 'Meta' || [16, 18, 37, 38, 39, 40, 91].includes(e.keyCode)) return;
      e.preventDefault();
    }
  }

  function insert(e) {
    const text = getClipbordText(e);
    const pos = getCursor(input);

    markup = text;
    render();

    setCursor(input, pos);
  }

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
    on:keydown={check}
    on:click|preventDefault={enable}
  />
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click={activate}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
</div>
