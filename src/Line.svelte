<script context="module">
  import images from 'emoji.json';
  import { simpleMarkdown, basicFormat } from './formats';
  import { insertTextAtCursor, getCursor, setCursor, noMarkup } from './text';
</script>

<script>
  import { onMount } from 'svelte';

  export let markup = '';

  // FIXME: cleanup...


  let enabled = false;
  let emojis = false;
  let image = null;
  let search = '';
  let offset = 0;
  let input;
  let t;

  function run(go) {
    const offset = getCursor(input);

    let source = markup;

    do {
      source = basicFormat(source) + ' ';
    } while (/<\/?font/i.test(source));

    input.innerHTML = simpleMarkdown(images.reduce((prev, cur) => {
      return prev.replace(new RegExp(`:${cur.name.replace(/\W/g, '-').replace(/--+/g, '-').toLowerCase()}:`, 'g'), cur.char);
    }, source));

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
    if (e.keyCode === 27 || (e.keyCode === 8 && !search)) {
      emojis = false;
      return;
    }
    if (e.key.length === 1 && t) {
      clearTimeout(t);
    }
    if (emojis) {
      if (e.keyCode === 13) {
        const code = filtered[image] && `${filtered[image].name.replace(/\W/g, '-').replace(/--+/g, '-').toLowerCase()}:`;

        if (code) {
          insertTextAtCursor(code);
          setCursor(input, offset + code.length);
          sync();
        }

        emojis = false;
        return;
      }

      if (e.keyCode === 37 || e.keyCode === 38) {
        image = Math.max(0, image - (e.keyCode === 38 ? 20 : 1));
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        image = Math.min(filtered.length - 1, image + (e.keyCode === 40 ? 20 : 1));
      }

      if (e.keyCode === 8) search = search.substr(0, search.length - 1);
      else if (e.key.length === 1) search += e.key;

      e.preventDefault();
      return;
    }
    if (e.keyCode === 186) {
      clearTimeout(t);
      t = setTimeout(() => {
        const lastChar = markup.trim().split('').pop();

        if (lastChar && lastChar !== ':') return;

        t = null;
        image = 0;
        search = '';
        emojis = true;
        offset = getCursor(input);
        setCursor(input, offset);
      }, 500);
    }
  }

  function activate(e) {
    enable();
    setCursor(input, offset);

    const code = e.target.title && `${e.target.title.replace(/\W/g, '-').replace(/--+/g, '-').toLowerCase()}:`;

    if (code) {
      insertTextAtCursor(code);
      setCursor(input, offset + code.length);
      sync();
    }

    emojis = false;
  }

  $: filtered = images
    .filter(x => x.name.includes(search))
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
    min-height: 1em;
    outline: none;
    box-shadow: none;
  }
  .main {
    position: relative;
  }
  .on {
    outline: 1px dotted gray;
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
  <div on:click={activate}>
    {#if emojis}
      {search} ({filtered[image] ? filtered[image].name : '?'})
      {#each filtered as emoji, key (emoji.codes)}
        {#if (key % 20) === 0}<br />{/if}
        <span class={image === key ? 'on' : ''} title={emoji.name}>{emoji.char}</span>
      {/each}
    {/if}
  </div>
</div>
