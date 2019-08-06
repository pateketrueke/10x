import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    debug: document.location.hash.includes('debug'),
    lines: Array.from({ length: 3 }).map(() => ''),
  },
});

export default app;
