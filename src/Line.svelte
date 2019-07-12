<script context="module">
  import { simpleMarkdown, basicFormat } from './formats';
  import { insertTextAtCursor, getCursor, setCursor, noMarkup } from './text';
</script>

<script>
  import { onMount } from 'svelte';

  export let markup = '';

  let enabled = false;
  let input;

  function run(go) {
    const offset = getCursor(input);

    let source = markup;

    do {
      source = basicFormat(source) + ' ';
    } while (/<\/?font/i.test(source));

    input.innerHTML = simpleMarkdown(source);

    if (go !== false) {
      setCursor(input, Math.min(offset, input.textContent.length - 1))
    };
  }

  function sync(e, go) {
    markup = input.textContent;

    if (e) {
      if (e.metaKey || e.key === 'Meta' || [16, 18, 37, 39, 65, 91].includes(e.keyCode)) return;

      if (/[\d_*]/.test(e.key)) {
        e.preventDefault();
        run(go);
        return;
      }

      if (/\s\s*$/.test(markup)) {
        e.preventDefault();
        return;
      }

      if (e.keyCode === 8) {
        e.preventDefault();

        const a = markup.charAt(markup.length - 1);
        const b = markup.charAt(markup.length - 2);

        if (a === ' ' && b !== ' ') run(go);
        else if (/[\d_*]/.test(a)) run(go);
        return;
      }
    }

    run(go);
  }

  function insert(e) {
    noMarkup(e);
    sync();
  }

  function enable() {
    if (!enabled) {
      input.contentEditable = true;
      input.focus();

      enabled = true;
    }
  }

  function disable() {
    if (enabled) {
      input.contentEditable = false;
      enabled = false;
    }
  }

  function check(e) {
    if (e.keyCode === 38 || e.keyCode == 40) {
      e.preventDefault();
    }
    if (e.keyCode === 13) {
      e.preventDefault();
      sync();
    }
  }
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
    min-height: 1em;
  }
  .main {
    position: relative;
  }
</style>

<div class="main">
  <div class="editor" spellcheck="false"
    bind:this={input}
    on:click={enable}
    on:blur={disable}
    on:paste={insert}
    on:keyup={sync}
    on:keydown={check}
  />
</div>
