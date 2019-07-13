<script context="module">
  import Emoji from './pick/Emoji.svelte';
  import { simpleMarkdown, basicFormat, plainOps } from './formats';
  import { insertTextAtCursor, getSelectionStart, getCursor, setCursor, noMarkup } from './text';

  const MODES = {
    ':': {
      component: Emoji,
      pagination: 10,
    },
  };
</script>

<script>
  export let markup = '';

  function p() {
    let source = markup;

    do {
      source = basicFormat(source);
      source += !/\s$/.test(source) ? ' ' : '';
    } while (/<\/?font/i.test(source));

    input.innerHTML = simpleMarkdown(source);
  }

  function f() {
    const node = getSelectionStart();

    if (node.tagName === 'SPAN') {
      console.log(node.parentNode);
    } else if (node !== input) {
      console.log(node);
    }
  }

  let usingMode = null;
  let enabled = false;
  let search = '';
  let sources = [];
  let selected = 0;
  let offset = 0;
  let overlay;
  let input;
  let t;

  function run() {
    const pos = getCursor(input);

    p();
    setCursor(input, Math.min(pos, input.textContent.length - 1));
  }

  function sync(e) {
    if (!usingMode) {
      markup = input.textContent;
    }

    if (e) {
      if (e.metaKey || e.key === 'Meta' || [16, 18, 37, 38, 39, 40, 65, 91].includes(e.keyCode)) return;
    }

    run();
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
    } else {
      f();
    }
  }

  function disable() {
    if (enabled) {
      input.contentEditable = false;
      enabled = false;
    }
  }

  function update(e) {
    sources = e.detail.data;
    selected = e.detail.offset;
  }

  function append() {
    const code = sources[selected] && sources[selected].char;

    if (code) {
      markup = markup.substr(0, offset - search.length - 1) + code + markup.substr(offset);
      run();
      setCursor(input, (offset - search.length - 1) + code.length);
    }
  }

  function check(e) {
    clearTimeout(t);
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    if (e.keyCode === 32) {
      if (usingMode) usingMode = null;
      insertTextAtCursor(String.fromCharCode(160) + (!input.firstChild ? ' ' : ''));
      setCursor(input, Math.min(input.textContent.length - 1, getCursor(input)));
      e.preventDefault();
      return;
    }
    if (e.keyCode === 27) {
      usingMode = null;
      return;
    }
    if (usingMode) {
      if (e.keyCode === 13) {
        append();
        usingMode = null;
        return;
      }

      if (/\W/.test(e.key)) {
        usingMode = null;
        return;
      }

      e.preventDefault();

      if (usingMode) {
        if (e.keyCode === 37 || e.keyCode === 38) {
          selected = Math.max(0, selected - (e.keyCode === 38 ? usingMode.pagination : 1));
        } else if (e.keyCode === 39 || e.keyCode === 40) {
          selected = Math.min(sources.length - 1, selected + (e.keyCode === 40 ? usingMode.pagination : 1));
        }
      }

      if (e.keyCode === 8) {
        if (!search.length) {
          usingMode = null;
          return;
        }

        markup = markup.substr(0, offset - 1) + markup.substr(offset);
        search = search.substr(0, search.length - 1);
        offset -= 1;

        run();
        setCursor(input, offset);
      } else if (e.key.length === 1 && !(e.metaKey || e.ctrlKey)) {
        markup = markup.substr(0, offset) + e.key + markup.substr(offset);
        search += e.key;
        offset += 1;

        run();
        setCursor(input, offset);
      }
      return;
    }

    if (MODES[e.key]) {
      clearTimeout(t);
      t = setTimeout(() => {
        offset = getCursor(input);
        setCursor(input, offset);
        usingMode = MODES[e.key];
        search = '';
      }, 180);
    }
  }

  function activate(e) {
    enable();
    setCursor(input, offset);

    if (e.target.tagName === 'SPAN') {
      const fixedOffset = [].slice.call(overlay.querySelectorAll('span')).indexOf(e.target);

      if (fixedOffset !== -1) {
        selected = fixedOffset;
        append();
        usingMode = null;
      }
    }
  }

  $: if (input && !enabled) p();
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
    on:paste={insert}
    on:keyup={sync}
    on:keydown={check}
    on:click={enable}
  />
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click={activate}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
</div>
