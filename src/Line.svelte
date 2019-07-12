<script>
  import { onMount } from 'svelte';
  import { saveCaretPosition } from './text';

  export let markup = '';

  let enabled = false;
  let buffer;
  let input;

  function sync() {
    markup = input.textContent;

    const restore = saveCaretPosition(input);

    input.innerHTML = markup.replace(/\s/g, '&nbsp;')
      .replace(/(?!<)([=+/*-])/g, '<b style="color:red">$1</b>')
      .replace(/[\d]+([\d,.]*)?/g, '<i style="color:blue">$&</i>')
      ;

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
    background-color: pink;
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
/>

{JSON.stringify(markup)}
