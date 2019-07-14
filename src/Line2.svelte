<script context="module">
  import Emoji from './pick/Emoji.svelte';
  import {
    simpleMarkdown,
    basicFormat,
    getCursor,
    setCursor,
    getClipbordText,
    removeSelectedText,
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
    // FIXME: instead of this, try render using vDOM?
    let source = simpleMarkdown(basicFormat(markup));

    // somehow, we need to hard-code ending white-space
    source = source.replace(/\s$/, String.fromCharCode(160));

    input.innerHTML = source + ' ';
  }

  // apply changes to current markup
  function mutate(text, length = 0) {
    const prefix = markup.substr(0, offset + length);
    const suffix = markup.substr(offset);
    const change = prefix + text + suffix;

    if (markup !== change) {
      markup = change;
      render();
      setCursor(input, (offset + length) + text.length);
    }
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

  // normalize white-space back, see check()
  function reset(e) {
    if (e.keyCode === 8) {
      removeSelectedText();
      input.style.whiteSpace = 'normal';
    }
  }

  // store current cursor, notice setCursor() is required afterwards!
  // otherwise, the cursor will move back to the beginning...
  function saveCursor() {
    offset = getCursor(input);
    setCursor(input, offset);
  }

  // FIXME: handle undo...
  function revert() {}

  // extract source from current contenteditable
  function sync(e) {
    markup = input.textContent.substr(0, markup.length - e.selectedText.length);
  }

  function clear(selectedText) {
    removeSelectedText();

    // restore from updated cursor
    saveCursor();
    sync({ selectedText });
  }

  // test input and mutate buffer, keep control-keys as is
  function check(e) {
    if (e) {
      const selection = window.getSelection();
      const selectedText = selection.toString();

      // remove user-selection and sync buffer
      if (!selection.isCollapsed && !e.metaKey && (e.keyCode === 8 || e.key.length === 1)) {
        clear(selectedText);

        // append on given input
        if (e.key.length && e.keyCode !== 8) mutate(e.key);
        e.preventDefault();
        return;
      }

      // select-all, undo buffer, sync after cutting
      if (e.metaKey && e.keyCode === 65) return;
      if (e.metaKey && e.keyCode === 90) revert(e.preventDefault());
      if (e.metaKey && e.keyCode === 88) setTimeout(() => sync({ selectedText }), 10);

      // allow some keys for moving inside the contenteditable
      if (e.metaKey || e.key === 'Meta' || [16, 18, 37, 38, 39, 40, 91].includes(e.keyCode)) return;

      // update offset and reset cursor again,
      // otherwise the cursor gets reset
      e.preventDefault();
      saveCursor();

      // append chars to buffer while trying to avoid system-replacements,
      // e.g. on OSX when you press spacebar-twice there's no way to stopping from it...
      if (e.key.length === 1) {
        clearTimeout(check.t);
        check.t = setTimeout(() => {
          mutate(e.keyCode === 32 ? String.fromCharCode(160) : e.key);
        }, 10);
        return;
      }

      if (e.keyCode === 8) {
        // make white-space visible during this
        input.style.whiteSpace = 'pre';
        mutate('', -1);
      }
    }
  }

  // merge current buffer with inconmig user-input
  function insert(e) {
    const selectedText = window.getSelection().toString();

    if (selectedText) {
      clear(selectedText);
    }

    const text = getClipbordText(e);

    saveCursor();
    mutate(text);
  }

  function update() {}

  function activate() {}

  // render upon changes from props
  $: if (input && !enabled) render();
</script>

<style>
  .editor {
    word-break: break-word;
    /*white-space: pre;*/
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
    on:keydown={check}
    on:keyup|preventDefault={reset}
    on:paste|preventDefault={insert}
    on:click|preventDefault={enable}
  />
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click={activate}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
</div>
