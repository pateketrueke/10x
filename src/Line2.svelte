<script context="module">
  import Emoji from './pick/Emoji.svelte';

  import {
    simpleMarkdown,
    basicFormat,
    getCursor,
    setCursor,
    getClipbordText,
    removeSelectedText,
    calculateFromTokens,
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
  let results;
  let history = [];
  let revision = -1;
  let offset = -1;
  let search = '';
  let enabled = false;
  let selected = 0;
  let usingMode = null;

  function push() {
    // clean but keep at least one entry!
    if (revision !== -1) {
      history = history.slice(0, revision + 1);
    }

    revision = history.length;

    const fixedOffset = offset === -1 ? markup.length : offset;

    // adding non-registered revisions, otherwise just update offset
    if (!revision || (history[revision - 1] && history[revision - 1].text !== markup)) {
      history.push({ text: markup, pos: fixedOffset });
    } else {
      history[revision - 1].pos = fixedOffset;
    }
  }

  // evaluate aftermath
  function maths() {
    const ast = [].slice.call(input.children)
      .filter(x => x.textContent)
      .map(x => [Object.keys(x.dataset)[0], x.textContent]);

    results = calculateFromTokens(ast);
  }

  // we take the markup and inject HTML from it
  function render() {
    // FIXME: instead of this, try render using vDOM?
    let source = simpleMarkdown(basicFormat(markup));

    // somehow, we need to hard-code ending/starting white-space
    source = source.replace(/^\s|\s$/, String.fromCharCode(160));

    input.innerHTML = source + ' ';

    maths();
  }

  // apply changes to current markup
  function mutate(text, length = 0) {
    const prefix = markup.substr(0, offset + length);
    const suffix = markup.substr(offset);
    const change = prefix + text + suffix;

    // make sure we don't render twice!
    if (markup !== change) {
      markup = change;
      render();

      // recalculate offset from input
      offset = (offset + length) + text.length;
      setCursor(input, offset);
      push();
    }
  }

  function disable() {
    if (enabled) {
      enabled = false;
    }
  }

  function enable() {
    if (!enabled) {
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

  // retrive latest state from current stack
  function revert(e) {
    e.preventDefault();

    const maximum = history.length - 1;

    revision += (e.shiftKey ? 1 : -1);
    revision = Math.min(Math.max(0, revision), maximum);

    // re-render given revision only
    if (history[revision]) {
      const { text, pos } = history[revision];

      if (markup !== text) {
        markup = text;

        // re-adjust caret position
        let newOffset = pos + (pos === text.length - 1 ? 1 : 0);

        newOffset = Math.min(pos, Math.min(newOffset, markup.length));

        render();
        setCursor(input, newOffset);
      }
    }
  }

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
        push();
        clear(selectedText);

        // append on given input
        if (e.key.length && e.keyCode !== 8) mutate(e.key);
        else setTimeout(maths, 50);

        e.preventDefault();
        return;
      }

      // select-all, undo/redo buffer, sync after cutting
      if (e.metaKey && e.keyCode === 65) return;
      if (e.metaKey && e.keyCode === 90) revert(e);
      if (e.metaKey && e.keyCode === 88) {
        setTimeout(() => {
          maths(push());
          sync({ selectedText })
        }, 10);
      }

      // allow some keys for moving inside the contenteditable
      if (e.metaKey || e.key === 'Meta' || [9, 16, 18, 37, 38, 39, 40, 91].includes(e.keyCode)) return;

      // update offset and reset cursor again,
      // otherwise the cursor gets reset
      e.preventDefault();
      saveCursor();
      push();

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

    push();

    if (selectedText) {
      clear(selectedText);
    }

    saveCursor();
    mutate(getClipbordText(e));
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
  <div class="editor" spellcheck="false" contenteditable
    bind:this={input}
    on:blur={disable}
    on:focus={enable}
    on:keydown={check}
    on:keyup|preventDefault={reset}
    on:paste|preventDefault={insert}
  />
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click={activate}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
</div>

{#if results}{JSON.stringify(results.simplified, null, 2)}{/if}
