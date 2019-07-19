<script context="module">
  import EmojiPicker from './pick/Emoji.svelte';

  import {
    basicFormat,
    getCursor,
    setCursor,
    getClipbordText,
    getSelectionStart,
    removeSelectedText,
    calculateFromTokens,
  } from './util';

  const MODES = {
    ':': {
      component: EmojiPicker,
      pagination: 10,
    },
  };

  const RE_EMOJI_BASE = /[\uD83C-\uDBFF\uDC00-\uDFFF]/;
  const RE_EMOJI_PAIRS = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  export let markup = '';

  const dispatch = createEventDispatcher();

  let node;
  let input;
  let overlay;
  let sources = [];
  let selected = 0;
  let history = [];
  let revision = -1;
  let offset = -1;
  let search = '';
  let enabled = false;
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
      .filter(x => 'op' in x.dataset)
      .map(x => [x.dataset.op, x.textContent, x.dataset.unit || undefined]);

    try {
      input.classList.remove('errored');
      input.removeAttribute('title');

      dispatch('change', calculateFromTokens(ast));
    } catch (e) {
      const ops = [].slice.call(input.children)
        .filter(x => x.dataset.op);

      if (e.offset > 0 && ops[e.offset - 1]) {
        ops[e.offset - 1].classList.add('errored');
        ops[e.offset - 1].setAttribute('title', e.message);
      } else {
        input.classList.add('errored');
        input.setAttribute('title', e.message);
      }
    }
  }

  // we take the markup and inject HTML from it
  function render() {
    try {
      // FIXME: instead of this, try render using vDOM?
      input.innerHTML = basicFormat(markup) + ' ';
    } catch (e) {
      input.innerHTML =
        basicFormat(markup.substr(0, e.offset))
        + `<span style="background-color:red;color:white">${
          markup.substr(e.offset).replace(/\s/g, String.fromCharCode(160))
        }</span> `;
    }

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

  function sel() {
    if (sel.t) return;

    setTimeout(() => {
      if (node) {
        node.classList.remove('selected');
        node = null;
      }

      const sub = getSelectionStart();

      if (sub) {
        if (['SPAN', 'SUB', 'SUP'].includes(sub.tagName)) {
          node = sub.parentNode;
        } else if (sub !== input) {
          node = sub;
        } else {
          node = null;
        }
      }

      // highlight number-values only
      if (node && ['number', 'unit'].includes(node.dataset.op)) node.classList.add('selected');
    });

    sel.t = setTimeout(() => { sel.t = null; }, 50);
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

  function pull() {
    push();
    render();
    setCursor(input, offset);
  }

  let isDead;

  // normalize white-space back, see check()
  function reset(e) {
    e.preventDefault();

    if (e.keyCode === 8) {
      removeSelectedText();
      input.style.whiteSpace = 'normal';
    }
  }

  // test input and mutate buffer, keep control-keys as is
  function check(e) {
    if (e.key === 'Dead') {
      isDead = true;
    }

    clearTimeout(check.t);
    clearTimeout(check.t2);

    if (e) {
      if (usingMode) {
        if (e.keyCode === 9) {
          usingMode = null;
          return;
        }

        e.preventDefault();

        if (e.keyCode === 13) {
          mutate(sources[selected].char, -(search.length + 1));
          usingMode = null;
          return;
        }

        if (e.keyCode === 37 || e.keyCode === 38) {
          selected = Math.max(0, selected - (e.keyCode === 38 ? usingMode.pagination : 1));
        } else if (e.keyCode === 39 || e.keyCode === 40) {
          selected = Math.min(sources.length - 1, selected + (e.keyCode === 40 ? usingMode.pagination : 1));
        }

        // disable overlay on any non-words
        if (/[^a-zA-Z\d]/.test(e.key) || e.keyCode === 27) usingMode = null;
        else if (e.keyCode === 8) search = search.substr(0, search.length - 1);
        else if (e.key.length === 1) search += e.key;
      }

      if (e.keyCode === 9) return;

      const selection = window.getSelection();
      const selectedText = selection.toString();

      // remove user-selection and sync buffer
      if (!selection.isCollapsed && !e.metaKey && (e.keyCode === 8 || e.key.length === 1)) {
        push();
        e.preventDefault();

        if (selectedText) {
          push();
          clear(selectedText);
          if (history[revision - 1]) history[revision - 1].pos = offset;
        }

        // append on given input
        if (e.key.length && e.keyCode !== 8) mutate(e.key);
        else setTimeout(pull);
        return;
      }

      // select-all, undo/redo buffer, sync after cutting
      if (e.metaKey && e.keyCode === 65) return;
      if (e.metaKey && e.keyCode === 90) revert(e);
      if (e.metaKey && e.keyCode === 88) {
        setTimeout(() => {
          maths(push());
          sync({ selectedText });
        }, 10);
      }

      // allow some keys for moving inside the contenteditable
      if (
        e.metaKey || e.key === 'Meta'
        || [16, 18, 37, 38, 39, 40, 91].includes(e.keyCode)
      ) {
        // we can't save immediately or the cursor will reset!
        if (!(e.altKey || e.shiftKey || e.metaKey)) setTimeout(saveCursor);
        return sel();
      }

      // handle backticks and such
      if (isDead) {
        if (e.key !== 'Dead') {
          setTimeout(() => {
            saveCursor();

            // retrive buffer con rendered content
            markup = input.textContent;
            isDead = false;

            pull();
          });
        }
        return;
      }

      // update offset and reset cursor again,
      // otherwise the cursor gets reset
      e.preventDefault();
      saveCursor();
      push();

      // append chars to buffer while trying to avoid system-replacements,
      // e.g. on OSX when you press spacebar-twice there's no way to stopping from it...
      if (e.key.length === 1) {
        if (!usingMode && MODES[e.key]) {
          clearTimeout(check.t2);
          check.t2 = setTimeout(() => {
            saveCursor();
            search = '';
            usingMode = MODES[e.key];
          }, 320);
        }

        clearTimeout(check.t);
        check.t = setTimeout(() => {
          mutate(e.keyCode === 32 ? String.fromCharCode(160) : e.key);
          sel();
        }, 10);
        return;
      }

      if (e.keyCode === 8) {
        if (usingMode && MODES[markup.charAt(offset - 1)]) usingMode = null;

        // make white-space visible during this
        input.style.whiteSpace = 'pre';

        let x = 0;
        let n = 2;
        let k = offset;

        // first, try regular offset looking for emojis
        const char = markup.substr(offset - 2, 2);

        // no luck, just remove a single character
        if (!RE_EMOJI_BASE.test(char)) {
          mutate('', -1);
          sel();
          return;
        }

        // you cannot simple remove single-chars in case of emojis,
        // so we need to detect how much to delete from...
        do {
          const tt = markup.substr(--k);
          const mm = tt.match(RE_EMOJI_PAIRS);

          if (mm) {
            x = mm[0].length;
            break;
          } else if (RE_EMOJI_BASE.test(tt)) {
            x = 1 + (offset -  k);
            break;
          }
        } while (--n);

        mutate('', x ? x * -1 : -1);
        sel();
      }
    }
  }

  // this will cancel overlays on-click
  function cursor(e) {
    if (usingMode) usingMode = null;
    sel();
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

  function update(e) {
    sources = e.detail.data;
    selected = e.detail.offset;
  }

  function pick(e) {
    enable();

    if (e.target.tagName === 'SPAN') {
      const fixedOffset = [].slice.call(overlay.querySelectorAll('span')).indexOf(e.target);

      if (fixedOffset !== -1) {
        mutate(sources[fixedOffset].char, -(search.length + 1));
        selected = fixedOffset;
        usingMode = null;
      }
    }
  }

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
    padding: 0 3px;
    outline: none;
    box-shadow: none;
  }
  .overlay {
    box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
    background-color: white;
    padding: 0 3px 3px 3px;
    position: absolute;
    cursor: pointer;
    width: 240px;
    z-index: 2;
  }
  .wrapper {
    position: relative;
  }
</style>

<div class="wrapper">
  <div class="editor" spellcheck="false" contenteditable
    bind:this={input}
    on:blur={disable}
    on:focus={enable}
    on:keydown={check}
    on:click|preventDefault={cursor}
    on:keyup|preventDefault={reset}
    on:paste|preventDefault={insert}
  />
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click|preventDefault={pick}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
</div>
