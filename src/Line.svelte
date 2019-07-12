<script>
  import { onMount } from 'svelte';
  import { simpleMarkdown } from './formats';
  import { getCursor, setCursor } from './text';

  export let markup = '';

  let enabled = false;
  let input;
  let t;

  function tag(_, $1) {
    let type;

    switch ($1) {
      case '=': type = 'equal'; break;
      case '+': type = 'plus'; break;
      case '-': type = 'min'; break;
      case '/': type = 'div'; break;
      case '*': type = 'mul'; break;
      default: break;
    }

    return `<var data-${type}>${$1}</var>`;
  }

  function run(go) {
    const offset = getCursor(input);

    let source = markup;

    do {
      source = source
        .replace(/<\/font[^<>]*>/ig, '')
        .replace(/(?![<*])([=*/+-])/g, tag)
        .replace(/([$]?\d[\d,.]*)/g, '<var data-number>$1</var>')
        .trim() + ' ';
    } while (/<\/?font/i.test(source));

    input.innerHTML = simpleMarkdown(source);

    if (go !== false) {
      setCursor(input, Math.min(offset, input.textContent.length - 1))
    };
  }

  function sync(e, go) {
    markup = input.textContent;

    if (e && /[\d_*]/.test(e.key)) {
      e.preventDefault();
      run(go);
      return;
    }

    if (e && /\s\s*$/.test(markup)) {
      e.preventDefault();
      return;
    }

    run(go);
  }

  function insert(e) {
    e.preventDefault();

    if (window.clipboardData) {
      const content = window.clipboardData.getData('Text');

      if (window.getSelection) {
        const selObj = window.getSelection();
        const selRange = selObj.getRangeAt(0);

        selRange.deleteContents();
        selRange.insertNode(document.createTextNode(content));
      }
    } else if (e.clipboardData) {
      document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    }

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
</style>

<div class="editor" spellcheck="false"
  bind:this={input}
  on:click={enable}
  on:blur={disable}
  on:paste={insert}
  on:keyup={sync}
  on:keydown={check}
/>
