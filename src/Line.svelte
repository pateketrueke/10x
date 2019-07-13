<script context="module">
  import images from 'emoji.json';
  import { simpleMarkdown, basicFormat } from './formats';
  import { getCursor, setCursor, noMarkup } from './text';
</script>

<script>
  import { onMount } from 'svelte';

  export let markup = '';

  // FIXME: cleanup...

  let enabled = false;
  let emojis = false;
  let search = '';
  let offset = 0;
  let image = 0;
  let input;
  let t;

  function run() {
    const pos = getCursor(input);

    let source = markup;

    do {
      source = basicFormat(source);
      source += !/\s$/.test(source) ? ' ' : '';
    } while (/<\/?font/i.test(source));

    input.innerHTML = simpleMarkdown(source);

    if (filtered) {
      image = Math.max(0, Math.min(filtered.length - 1, image));
    }

    setCursor(input, Math.min(pos, input.textContent.length - 1));
  }

  function sync(e) {
    if (!emojis) {
      markup = input.textContent;
    }

    if (e) {
      if (e.metaKey || e.key === 'Meta' || [16, 18, 37, 39, 65, 91].includes(e.keyCode)) return;
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
    }
  }

  function disable() {
    if (enabled) {
      input.contentEditable = false;
      enabled = false;
    }
  }

  function insertTextAtCursor(text) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(document.createTextNode(text));
  }


  function check(e) {
    if ([13, 38, 40].includes(e.keyCode)) {
      e.preventDefault();
    }
    if (e.keyCode === 32) {
      if (emojis) {
        emojis = false;
        insertTextAtCursor(String.fromCharCode(160));
        setCursor(input, getCursor(input));
      } else {
        if (!input.firstChild) {
          insertTextAtCursor(String.fromCharCode(160) + ' ');
          setTimeout(() => setCursor(input, 1));
        } else {
          insertTextAtCursor(String.fromCharCode(160));
          setCursor(input, getCursor(input));
        }
      }
      e.preventDefault();
      return;
    }
    if (e.keyCode === 27) {
      emojis = false;
      return;
    }
    if (emojis) {
      if (e.keyCode === 13) {
        const code = filtered[image] && filtered[image].char;

        if (code) {
          markup = markup.substr(0, offset - search.length - 1) + code + markup.substr(offset);
          run();
          setCursor(input, (offset - search.length - 1) + code.length);
        }

        emojis = false;
        return;
      }

      if (/\W/.test(e.key)) {
        emojis = false;
        return;
      }

      e.preventDefault();

      if (e.keyCode === 37 || e.keyCode === 38) {
        image = Math.max(0, image - (e.keyCode === 38 ? 10 : 1));
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        image = Math.min(filtered.length - 1, image + (e.keyCode === 40 ? 10 : 1));
      }

      if (e.keyCode === 8) {
        if (!search.length) {
          emojis = false;
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
    if (e.key === ':') {
      clearTimeout(t);
      t = setTimeout(() => {
        offset = getCursor(input);
        setCursor(input, offset);
        emojis = true;
        search = '';
        image = 0;
      }, 180);
    }
  }

  function activate(e) {
    enable();
    setCursor(input, offset);

    if (e.target.tagName === 'SPAN') {
      const code = e.target.textContent.trim();

      if (code) {
        markup = markup.substr(0, offset - search.length - 1) + code + markup.substr(offset);
        run();
        setCursor(input, (offset - search.length - 1) + code.length);
      }

      emojis = false;
    }
  }

  $: filtered = emojis && images
    .filter(x => x.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 100);
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
  .on, .off:hover {
    background-color: gray;
  }
  span {
    padding: 0 2px 5px 2px;
    transition: all .3s;
    transform-origin: 50% 50%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
  small {
    color: silver;
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
  <div class="overlay" on:click={activate}>
    {#if emojis}
      <small>{filtered[image] ? filtered[image].name : '?'}</small>
      {#each filtered as emoji, key (emoji.codes)}
        {#if (key % 10) === 0}<br />{/if}
        <span class={image === key ? 'on' : 'off'} title={emoji.name}>{emoji.char}</span>
      {/each}
    {/if}
  </div>
</div>
