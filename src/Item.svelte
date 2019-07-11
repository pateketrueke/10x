<script>
  import { createEventDispatcher } from 'svelte';

  export let selected = false;
  export let added = false;
  export let offset = 0;
  export let text = '';
  export let key;

  let ref;

  const dispatch = createEventDispatcher();

  function getTextNodeAtPosition(root, index) {
    let lastNode = null;

    const c = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, elem => {
      if (index >= elem.textContent.length) {
        index -= elem.textContent.length;
        lastNode = elem;
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }).nextNode();

    return {
      node: c ? c : root,
      position: c ? index : 0,
    };
  }

  function sel(target) {
    let range;
    let sel;

    if (window.getSelection && document.createRange) {
      range = document.createRange();
      range.selectNodeContents(target);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(target);
      range.select();
    }
  }

  function get(target) {
    let caretPos = 0;
    let sel;
    let range;

    if (window.getSelection) {
      sel = window.getSelection();

      if (sel.rangeCount) {
        range = sel.getRangeAt(0);

        if (range.commonAncestorContainer.parentNode === target) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();

      if (range.parentElement() === target) {
        const tempEl = document.createElement('span');
        const tempRange = range.duplicate();

        editableDiv.insertBefore(tempEl, target.firstChild);
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint('EndToEnd', range);
        caretPos = tempRange.text.length;
      }
    }

    return caretPos;
  }

  function set(target, offset) {
    const pos = getTextNodeAtPosition(target, offset);
    const selection = window.getSelection();
    const range = new Range();

    selection.removeAllRanges();
    range.setStart(pos.node, pos.position);
    selection.addRange(range);
  }

  function update(e) {
    dispatch('change', { type: 'EVALUATE', value: {
      text: e.target.textContent,
      offset: get(e.target),
    } });
  }

  function select(e) {
    dispatch('change', { type: 'SELECT', value: key });
    update(e)
  }

  function insert(e) {
    e.preventDefault();
    document.execCommand('insertHTML', false, e.clipboardData.getData('text/plain'));
  }

  function validate(e) {
    if (e.keyCode === 13) {
      dispatch('change', { type: 'ENTER' });
      e.preventDefault();
    } else if (e.keyCode === 38 || (e.keyCode === 9 && e.shiftKey)) {
      dispatch('change', { type: 'PREV_UP' });
      e.preventDefault();
    } else if (e.keyCode === 9 || e.keyCode === 40) {
      dispatch('change', { type: 'NEXT_DOWN' });
      e.preventDefault();
    } else if (e.keyCode === 8 && e.target.textContent === '') {
      dispatch('change', { type: 'BACK_DROP' });
      e.preventDefault();
    }
  }

  $: if (ref) {
    ref.contentEditable = selected;
    ref[selected ? 'focus' : 'blur']();
    if (added) sel(ref);
    else if (selected && offset !== get(ref)) set(ref, offset);
  }
</script>

<style>
  li { cursor: text; padding-right: 10px; }
  li:hover { background-color: #ffee11; }
</style>

<li bind:this={ref}
    on:paste={insert}
    on:click={select}
    on:keyup={update}
    on:keydown={validate}>{text}</li>
