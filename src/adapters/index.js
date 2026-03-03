export function applyAdapter(runtime, adapter, options = {}) {
  if (!adapter) return;
  if (typeof adapter.setup === 'function') {
    adapter.setup(runtime, options);
  }
}

export function createEnv(runtime, adapter, options = {}) {
  applyAdapter(runtime, adapter, options);
  return new runtime.Env(options.parent);
}
