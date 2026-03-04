import { getSignalRegistry, effect, read } from './core.js';

function renderRows(container, registry) {
  const entries = Array.from(registry.entries());
  container.innerHTML = '';

  entries.forEach(([name, signal]) => {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr auto auto';
    row.style.gap = '0.6rem';
    row.style.padding = '0.25rem 0';
    row.style.borderBottom = '1px solid rgba(255,255,255,0.08)';

    const key = document.createElement('code');
    key.textContent = String(name);

    const value = document.createElement('code');
    value.textContent = JSON.stringify(read(signal));

    const subs = document.createElement('code');
    subs.textContent = `subs:${signal.subs ? signal.subs.size : 0}`;

    row.appendChild(key);
    row.appendChild(value);
    row.appendChild(subs);
    container.appendChild(row);
  });
}

export function devtools() {
  if (typeof document === 'undefined') return null;

  let panel = document.getElementById('10x-devtools-panel');
  if (panel) return panel;

  const registry = getSignalRegistry();

  panel = document.createElement('aside');
  panel.id = '10x-devtools-panel';
  panel.style.position = 'fixed';
  panel.style.bottom = '1rem';
  panel.style.right = '1rem';
  panel.style.width = '360px';
  panel.style.maxHeight = '45vh';
  panel.style.overflow = 'auto';
  panel.style.zIndex = '99999';
  panel.style.padding = '0.7rem';
  panel.style.borderRadius = '12px';
  panel.style.border = '1px solid rgba(255,255,255,0.15)';
  panel.style.background = 'rgba(12,16,22,0.94)';
  panel.style.color = '#d8dde4';
  panel.style.font = '12px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

  const title = document.createElement('div');
  title.textContent = '10x DevTools · Signals';
  title.style.fontWeight = '700';
  title.style.marginBottom = '0.5rem';

  const body = document.createElement('div');
  panel.appendChild(title);
  panel.appendChild(body);
  document.body.appendChild(panel);

  effect(() => {
    renderRows(body, registry);
  });

  return panel;
}

export function devtoolsEnabledByQuery(search) {
  const input = typeof search === 'string'
    ? search
    : (typeof window !== 'undefined' && window.location ? window.location.search : '');
  if (!input) return false;

  const params = new URLSearchParams(input.startsWith('?') ? input : `?${input}`);
  if (!params.has('devtools')) return false;

  const value = params.get('devtools');
  return value !== '0' && value !== 'false' && value !== 'off';
}

export function maybeEnableDevtools() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null;
  if (!devtoolsEnabledByQuery(window.location && window.location.search)) return null;

  const start = () => {
    try {
      devtools();
    } catch (_) {
      // no-op for environments where DOM is not fully initialized
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
    return null;
  }

  return start();
}

maybeEnableDevtools();
