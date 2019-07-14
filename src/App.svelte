<script>
  import Line2 from './Line2.svelte';
  let a = '$16,000 + -$610 + -$1290 + -$200 + -$7,000 / 14 days =';
  let b = '(16000-610-1290-200-7000)/14=';
</script>

<Line2 markup={a} />
<Line2 markup={b} />
