import App from './App.svelte';

var app = new App({
	target: document.body,
  props: {
    debug: document.location.hash.includes('debug'),
  },
});

export default app;
