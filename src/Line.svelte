<script>
  import { setCursor, getCursor } from './text';

  export let text = '';

  let offset = 0;
  let buffer;
  let input;

  $: if (input && buffer) {
    if (offset !== getCursor(input)) {
      setCursor(input, offset);
    }

    buffer.style.height = `${input.getBoundingClientRect().height}px`;
  }

  function update(e) {
    e.preventDefault();

    if (e.keyCode === 39) {
      offset = Math.min(text.length, offset + 1);
    } else if (e.keyCode === 37) {
      offset = Math.max(0, offset - 1);
    } else if (e.keyCode === 8 || (e.keyCode >= 32 && e.keyCode <= 127)) {
      if (e.key === 'Backspace') {
        text = text.substr(0, text.length - 1);
        offset = Math.max(0, offset - 1);
      } else if (e.key.length === 1) {
        text += e.key;
        offset += 1;
      }
    }
  }

  function enable() {
    input.contentEditable = true;
    input.focus();

    offset = getCursor(input);
  }

  function disable() {
    input.contentEditable = false;
  }
</script>

<style>
  .wrap {
    position: relative;
  }
  .field {
    background-color: transparent;
    visibility: hidden;
    width: 100%;
    border: 0;
  }
  .input {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    cursor: text;
    font-size: 1em;
    min-height: 1em;
    outline: 1px dotted silver;
  }
</style>

<div class="wrap">
  <textarea class="field" bind:this={buffer} bind:value={text} />
  <div class="input"
    bind:this={input}
    on:keydown={update}
    on:click={enable}
    on:blur={disable}
  >{text}</div>
</div>
