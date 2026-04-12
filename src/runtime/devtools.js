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

function renderGroupedRows(container, groups, collapsedSignals, rerender) {
  container.innerHTML = '';

  groups.forEach((signals, moduleUrl) => {
    const groupHeader = document.createElement('div');
    groupHeader.style.cssText = 'font-weight:600;margin:0.75rem 0 0.25rem;font-size:11px;color:#888;letter-spacing:0.5px;';
    groupHeader.textContent = moduleUrl === 'global' ? 'Global' : moduleUrl.split('/').pop() || moduleUrl;
    container.appendChild(groupHeader);

    signals.forEach(({ name, value, subsCount, history, lazy }) => {
      const isCollapsed = collapsedSignals.has(name);

      const displayName = name.includes('.') ? name.split('.').pop() : name;

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
        rerender();
      };

      const key = document.createElement('code');
      key.textContent = displayName;
      key.style.color = '#d2a8ff';

      const valueEl = document.createElement('code');
      if (lazy && value === undefined) {
        valueEl.textContent = '…';
        valueEl.style.color = '#555';
        valueEl.style.fontStyle = 'italic';
      } else {
        formatValue(value, valueEl);
        valueEl.style.cursor = 'pointer';
        valueEl.title = 'Click to copy';
        valueEl.onclick = (e) => {
          e.stopPropagation();
          copyToClipboard(JSON.stringify(value));
        };
      }

      const subs = document.createElement('code');
      subs.textContent = `subs:${subsCount}`;
      subs.style.color = '#8b949e';

      header.appendChild(key);
      header.appendChild(valueEl);
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

function buildLazySnapshot(registry) {
  const entries = Array.from(registry.entries());
  return entries.map(([key, signal]) => ({
    id: signal._devtoolsId || null,
    name: signal._devtoolsName || `signal_${signal._devtoolsId}`,
    moduleUrl: signal._moduleUrl || 'global',
    value: undefined,
    subs: signal.subs ? signal.subs.size : 0,
    history: [],
    lazy: true,
  }));
}

function renderRowsFromSnapshot(container, snapshot, collapsedSignals) {
  const moduleGroups = new Map();

  (Array.isArray(snapshot) ? snapshot : []).forEach((entry) => {
    if (!entry || !entry.name) return;
    const moduleUrl = entry.moduleUrl || 'global';
    if (!moduleGroups.has(moduleUrl)) {
      moduleGroups.set(moduleUrl, []);
    }
    moduleGroups.get(moduleUrl).push({
      id: entry.id || null,
      name: entry.name,
      value: entry.value,
      subsCount: Number.isFinite(entry.subs) ? entry.subs : 0,
      history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY) : [],
      lazy: !!entry.lazy,
    });
  });

  renderGroupedRows(
    container,
    moduleGroups,
    collapsedSignals,
    () => renderRowsFromSnapshot(container, snapshot, collapsedSignals),
  );
}

function mergeSignalUpdate(snapshot, update) {
  if (!update || typeof update.name !== 'string') return snapshot;
  const current = Array.isArray(snapshot) ? snapshot : [];
  const next = current.map(entry => ({ ...entry }));
  const index = next.findIndex(entry => (
    entry
    && (
      (update.id != null && entry.id === update.id)
      || entry.name === update.name
    )
  ));
  const history = Array.isArray(update.history)
    ? update.history.slice(-MAX_HISTORY)
    : [{ ts: update.ts || Date.now(), value: update.value }];

  const merged = {
    id: update.id || null,
    name: update.name,
    moduleUrl: update.moduleUrl || 'global',
    value: update.value,
    subs: Number.isFinite(update.subs) ? update.subs : 0,
    history,
    lazy: false,
  };

  if (index >= 0) {
    next[index] = merged;
  } else {
    next.push(merged);
  }
  return next;
}

export function devtools(options = {}) {
  if (typeof document === 'undefined') return null;

  const { docked = false, container = null } = options;
  const dockedPane = docked && container ? container.closest('.devtools-pane') || container : null;
  const dockedLayout = dockedPane ? dockedPane.closest('.layout') : null;

  let panel = document.getElementById('10x-devtools-panel');
  if (panel) return panel;

  const registry = getSignalRegistry();
  const collapsedSignals = new Set();
  let latestSnapshot = [];
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
  title.innerHTML = `<span>10x DevTools</span><span style="font-weight:400;font-size:10px;color:#888;">Alt+D / Ctrl+Shift+D</span>`;

  const buildStatus = document.createElement('div');
  buildStatus.style.cssText = 'font-size:10px;color:#666;margin-bottom:0.5rem;';

  function formatAgo(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return 'just now';
  }

  function updateBuildStatus() {
    const ts = globalThis.__10x_BUILD_TS;
    if (!ts) { buildStatus.textContent = ''; return; }
    const diff = Date.now() - new Date(ts).getTime();
    buildStatus.textContent = `build: ${formatAgo(diff)}`;
  }

  updateBuildStatus();
  setInterval(updateBuildStatus, 60000);

  const hmrStatus = document.createElement('div');
  hmrStatus.id = '10x-hmr-status';
  hmrStatus.style.cssText = 'font-size:11px;margin-bottom:0.5rem;padding:0.25rem 0.5rem;background:#238636;border-radius:4px;color:#fff;display:none;';

  const body = document.createElement('div');
  panel.appendChild(title);
  panel.appendChild(buildStatus);
  panel.appendChild(hmrStatus);
  panel.appendChild(body);

  if (docked && container) {
    container.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }

  setDevtoolsActive(true);

  latestSnapshot = buildLazySnapshot(registry);
  renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);

  function toggle() {
    const target = dockedPane || panel;
    const hidden = target.style.display === 'none';
    if (hidden) {
      target.style.display = '';
      if (dockedLayout && dockedPane) {
        dockedLayout.style.gridTemplateColumns = '';
      }
    } else {
      target.style.display = 'none';
      if (dockedLayout && dockedPane) {
        dockedLayout.style.gridTemplateColumns = '1fr';
      }
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
    onSignals: (snapshot) => {
      latestSnapshot = Array.isArray(snapshot) ? snapshot : [];
      if (globalThis.__10x_devtools_debug) {
        console.debug('[10x:devtools] onSignals snapshot', { count: latestSnapshot.length });
      }
      renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
    },
    toggle,
  };

  globalThis.__10x_devtools_notify = (update) => {
    if (globalThis.__10x_devtools_debug) {
      console.debug('[10x:devtools] notify update', update);
    }
    latestSnapshot = mergeSignalUpdate(latestSnapshot, update);
    renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  };

  globalThis.__10x_devtools_signal_created = (info) => {
    if (globalThis.__10x_devtools_debug) {
      console.debug('[10x:devtools] signal created', info);
    }
    const existing = latestSnapshot.find(e => e && (e.id === info.id || e.name === info.name));
    if (existing) return;
    latestSnapshot.push({
      id: info.id || null,
      name: info.name,
      moduleUrl: info.moduleUrl || 'global',
      value: undefined,
      subs: 0,
      history: [],
      lazy: true,
    });
    renderRowsFromSnapshot(body, latestSnapshot, collapsedSignals);
  };

  document.addEventListener('keydown', (e) => {
    const isAltD = e.altKey && (e.key === 'd' || e.key === 'D');
    const isCtrlShiftD = e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D');
    if (isAltD || isCtrlShiftD) {
      e.preventDefault();
      toggle();
    }
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
