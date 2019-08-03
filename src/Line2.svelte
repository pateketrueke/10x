<script context="module">
  import EmojiPicker from './pick/Emoji.svelte';
  import DebugInfo from './Debug.svelte';
  import Solvente from './lib';

  import { isOp, hasTagName } from './lib/parser';

  import {
    getCursor,
    setCursor,
    getClipbordText,
    getSelectionStart,
    removeSelectedText,
  } from './util';

  const calc = new Solvente();

  const MODES = {
    ':': {
      component: EmojiPicker,
      pagination: 10,
    },
  };

  const RE_EMOJI = /[\uD83C-\uDBFF\uDC00-\uDFFF]/;
</script>

<script>
  import { createEventDispatcher } from 'svelte';

  export let debug = false;
  export let markup = '';

  const dispatch = createEventDispatcher();

  let info = calc.resolve(markup);
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

  function all(cb) {
    const nodes = [].slice.call(input.children).filter(x => 'op' in x.dataset);

    if (typeof cb === 'function') return nodes.map(cb);

    return nodes;
  }

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

  // we take the markup and inject HTML from it
  function render() {
    // FIXME: instead of this, try render using vDOM?
    const html = info.input.reduce((prev, cur) => {
      if (cur[0] === 'text') {
        prev.push(`<var>${cur[1].replace(/\s/g, String.fromCharCode(160))}</var>`);
      } else if (cur[0] === 'expr') {
        if (isOp(cur[1])) prev.push(`<var data-op="${cur[2]}">${cur[1]}</var>`);
        else prev.push(`<var data-op="expr">${cur[1]}</var>`);
      } else if (cur[0] === 'open' || cur[0] === 'close') {
        prev.push(`<var data-op="${cur[0]}">${cur[1]}</var>`);
      } else if (cur[0] === 'number') {
        prev.push(`<var data-op="number">${cur[1]}</var>`);
      } else if (hasTagName(cur[0])) {
        if (cur[0] === 'heading') prev.push(`<h${cur[2]}>${cur[1]}</h${cur[2]}>`);
        else prev.push(`<${cur[0]}>${cur[1]}</${cur[0]}>`);
      }

      return prev;
    }, []).join('');

    input.innerHTML = `${html} `;
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

    sel();
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
          push();
          sync({ selectedText });
        }, 10);
      }

      // allow some keys for moving inside the contenteditable
      if (
        e.metaKey || e.key === 'Meta'
        || [16, 18, 37, 38, 39, 40, 91].includes(e.keyCode)
      ) {
        // keep selection as normal
        if (!window.getSelection().isCollapsed) return;

        // we can't save immediately or the cursor will reset!
        setTimeout(() => {
          if (!e.shiftKey || [16, 18, 91].includes(e.keyCode)) saveCursor();

          // we adjust the cursor due emojis at the end...
          if (offset > markup.length) {
            offset = Math.min(markup.length, offset);
            setCursor(input, offset);
          }
        });

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

      if (e.keyCode === 8) {
        saveCursor();

        // let's the browser do his job...
        if (RE_EMOJI.test(markup.substr(offset - 2, 2))) {
          push();
          setTimeout(() => {
            // remove last white-space to preserve length
            markup = input.textContent.substr(0, input.textContent.length - 1);

            saveCursor();
            pull();
            sel();
          });
          return;
        }
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

        mutate('', -1);
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

  function select(e) {
    clearTimeout(select.t);

    const { offset } = e.detail;

    if (node) node.classList.remove('highlighted');

    // patch parsed input as regular nodes, or text nodes...
    const sub = input.childNodes[offset];

    // highlight regular nodes
    if (sub && sub.nodeType === 1) {
      node = sub;
    }

    if (node) {
      node.classList.add('highlighted');
      select.t = setTimeout(() => {
        node.classList.remove('highlighted');
      }, 260);
    }
  }

  // render upon changes from props
  $: if (input && !enabled) render();
</script>

<style>
  .input {
    word-break: break-word;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: text;
    outline: none;
    min-width: 5px;
    min-height: 20px;
    box-shadow: none;
    padding-left: 1px;
  }
  .editor {
    display: flex;
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
  .results {
    display: flex;
    align-items: center;
  }
</style>

<div class="wrapper">
  <div class="editor">
    <div class="input" spellcheck="false" contenteditable
      bind:this={input}
      on:blur={disable}
      on:focus={enable}
      on:keydown={check}
      on:click|preventDefault={cursor}
      on:keyup|preventDefault={reset}
      on:paste|preventDefault={insert}
    />
    {#if info.results}
      <div class="results">
        {#each info.results as { type, format }}
          <var data-result={type}>{format}</var>
        {/each}
      </div>
    {/if}
  </div>
  {#if usingMode}
    <div class="overlay" bind:this={overlay} on:click|preventDefault={pick}>
      <svelte:component bind:search bind:selected on:change={update} this={usingMode.component} />
    </div>
  {/if}
  {#if debug}
    <DebugInfo on:focus={select} input={info.input} tokens={info.tokens} errored={info.errored} />
  {/if}
</div>
