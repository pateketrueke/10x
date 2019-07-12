<script>
  import { onMount } from 'svelte';
  import { saveCaretPosition } from './text';

  export let markup = '';

  let enabled = false;
  let buffer;
  let input;

  function sync(e) {
    markup = input.textContent;

    if (markup.substr(markup.length - 1, 1).charCodeAt(0) === 160) {
      e.preventDefault();
      return;
    }

    const restore = saveCaretPosition(input);

    input.innerHTML = markup
      .replace(/(?!<)([=+/*-])/g, '<b style="color:gray">$1</b>')
      .replace(/[\d]+([\d,.]*)?/g, '<b style="color:purple">$&</b>')
      .trim() + ' ';

    restore();
  }

  function update() {
    buffer.style.height = `${input.getBoundingClientRect().height}px`;
  }

  function insert(e) {
    e.preventDefault();
    document.execCommand('insertHTML', false, e.clipboardData.getData('text/plain'));
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

  function validate(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  $: if (input && buffer) {
    update();
  }
</script>

<style>
  div {
    word-break: break-word;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: text;
    font-size: 1em;
    min-height: 1em;
  }
</style>

<div
  bind:this={input}
  on:click={enable}
  on:blur={disable}
  on:input={sync}
  on:paste={insert}
  on:keydown={validate}
/>
