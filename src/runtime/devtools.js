import { getSignalRegistry, effect, read, isDevtoolsActive, setDevtoolsActive } from './core.js';

const MAX_HISTORY = 20;

function getValueColor(value) {
  if (value === null || value === undefined) return '#888';
  if (typeof value === 'number') return '#79c0ff';
  if (typeof value === 'string') return '#7ee787';
  if (Array.isArray(value)) return '#ffa657';
  if (typeof value === 'object') return '#ffa657';
  return '#d8dde4';
}

function formatValue(value, container) {
  const str = JSON.stringify(value);
  container.textContent = str;
  container.style.color = getValueColor(value);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Visual feedback could be added here
  });
}

function renderRows(container, registry, collapsedSignals) {
  const entries = Array.from(registry.entries());
  const moduleGroups = new Map();

  entries.forEach(([name, signal]) => {
    const moduleUrl = signal._moduleUrl || 'global';
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push([name, signal]);
  });

  container.innerHTML = '';

  moduleGroups.forEach((signals, moduleUrl) => {
    const groupHeader = document.createElement('div');
    groupHeader.style.cssText = 'font-weight:600;margin:0.75rem 0 0.25rem;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.5px;';
    groupHeader.textContent = moduleUrl === 'global' ? 'Global' : moduleUrl.split('/').pop() || moduleUrl;
    container.appendChild(groupHeader);

    signals.forEach(([name, signal]) => {
      const isCollapsed = collapsedSignals.has(name);
      const history = signal._history || [];

      const row = document.createElement('div');
      row.style.cssText = 'margin-bottom:0.25rem;';

      const header = document.createElement('div');
      header.style.cssText = 'display:grid;grid-template-columns:1fr auto auto;gap:0.6rem;padding:0.25rem 0;cursor:pointer;';
      header.onclick = () => {
        if (collapsedSignals.has(name)) {
          collapsedSignals.delete(name);
        } else {
          collapsedSignals.add(name);
        }
        renderRows(container, registry, collapsedSignals);
      };

      const key = document.createElement('code');
      key.textContent = String(name);
      key.style.color = '#d2a8ff';

      const value = document.createElement('code');
      formatValue(read(signal), value);
      value.style.cursor = 'pointer';
      value.title = 'Click to copy';
      value.onclick = (e) => {
        e.stopPropagation();
        copyToClipboard(JSON.stringify(read(signal)));
      };

      const subs = document.createElement('code');
      subs.textContent = `subs:${signal.subs ? signal.subs.size : 0}`;
      subs.style.color = '#8b949e';

      header.appendChild(key);
      header.appendChild(value);
      header.appendChild(subs);
      row.appendChild(header);

      if (!isCollapsed && history.length > 0) {
        const historyDiv = document.createElement('div');
        historyDiv.style.cssText = 'font-size:10px;margin-left:1rem;padding:0.25rem;background:rgba(255,255,255,0.03);border-radius:4px;max-height:120px;overflow:auto;';
        
        const historyHeader = document.createElement('div');
        historyHeader.style.cssText = 'color:#888;margin-bottom:0.25rem;';
        historyHeader.textContent = `History (${history.length})`;
        historyDiv.appendChild(historyHeader);

        [...history].reverse().forEach((h, i) => {
          const entry = document.createElement('div');
          entry.style.cssText = 'display:flex;justify-content:space-between;gap:0.5rem;margin:0.15rem 0;';
          
          const ts = document.createElement('span');
          const date = new Date(h.ts);
          ts.textContent = date.toLocaleTimeString();
          ts.style.color = '#666';
          
          const val = document.createElement('span');
          formatValue(h.value, val);
          val.style.fontWeight = i === 0 ? '600' : '400';
          
          entry.appendChild(ts);
          entry.appendChild(val);
          historyDiv.appendChild(entry);
        });

        row.appendChild(historyDiv);
      }

      container.appendChild(row);
    });
  });
}

export function devtools(options = {}) {
  if (typeof document === 'undefined') return null;

  const { docked = false, container = null } = options;

  let panel = document.getElementById('10x-devtools-panel');
  if (panel) return panel;

  const registry = getSignalRegistry();
  const collapsedSignals = new Set();
  let hmrMessage = null;
  let hmrTimeout = null;

  panel = document.createElement('aside');
  panel.id = '10x-devtools-panel';
  panel.style.cssText = docked
    ? 'width:100%;height:100%;overflow:auto;padding:0.5rem;'
    : 'position:fixed;bottom:1rem;right:1rem;width:360px;max-height:45vh;overflow:auto;z-index:99999;padding:0.7rem;border-radius:12px;border:1px solid rgba(255,255,255,0.15);background:rgba(12,16,22,0.94);color:#d8dde4;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;';

  if (!docked) {
    panel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
  }

  const title = document.createElement('div');
  title.style.cssText = 'font-weight:700;margin-bottom:0.5rem;display:flex;justify-content:space-between;align-items:center;';
  title.innerHTML = `<span>10x DevTools</span><span style="font-weight:400;font-size:10px;color:#888;">Alt+D</span>`;

  const hmrStatus = document.createElement('div');
  hmrStatus.id = '10x-hmr-status';
  hmrStatus.style.cssText = 'font-size:11px;margin-bottom:0.5rem;padding:0.25rem 0.5rem;background:#238636;border-radius:4px;color:#fff;display:none;';

  const body = document.createElement('div');
  panel.appendChild(title);
  panel.appendChild(hmrStatus);
  panel.appendChild(body);

  if (docked && container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }

  setDevtoolsActive(true);

  effect(() => {
    renderRows(body, registry, collapsedSignals);
  });

  function toggle() {
    if (docked && container) return;
    if (panel.style.display === 'none') {
      panel.style.display = '';
    } else {
      panel.style.display = 'none';
    }
  }

  function showHmrMessage(count, url) {
    hmrMessage = { count, url, ts: Date.now() };
    hmrStatus.textContent = `HMR — ${count} signals restored`;
    hmrStatus.style.display = 'block';
    clearTimeout(hmrTimeout);
    hmrTimeout = setTimeout(() => {
      hmrStatus.style.display = 'none';
      hmrMessage = null;
    }, 3000);
  }

  globalThis.__10x_devtools = {
    active: true,
    onHmr: ({ restored = 0, url = '' }) => showHmrMessage(restored, url),
    toggle,
  };

  if (!docked) {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        toggle();
      }
    });
  }

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

export function maybeEnableDevtools(options = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null;
  if (!devtoolsEnabledByQuery(window.location && window.location.search) && !options.force) return null;

  const start = () => {
    try {
      devtools(options);
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