import { compile } from '../../src/compiler/index.js';
import { watch } from 'fs';
import { join, dirname, basename } from 'path';

const TEST_FILE_PATTERN = /\.(test|spec|feature|steps)\.md$/;
const clients = new Set();

export const plugin = {
  name: '10x',
  target: 'browser',
  setup(build) {
    build.onLoad({ filter: /\.md$/ }, async ({ path }) => {
      if (TEST_FILE_PATTERN.test(path)) {
        return {
          contents: `throw new Error('Test files should not be bundled: ${path}');`,
          loader: 'js',
        };
      }
      
      const source = await Bun.file(path).text();
      try {
        let compiled = compile(source, {
          hmr: true,
          module: true,
        });
        
        compiled = compiled.replace(
          /from\s+["']\.\/runtime["']/g,
          'from "10x/runtime"'
        );
        
        return {
          contents: compiled,
          loader: 'js',
        };
      } catch (err) {
        return {
          contents: `throw new Error(${JSON.stringify(err.message)})`,
          loader: 'js',
        };
      }
    });
  },
};

// Dev server with HMR support
export async function createDevServer(options = {}) {
  const {
    root = process.cwd(),
    port = 3000,
  } = options;
  
  // File watcher for HMR
  const watcher = watch(root, { recursive: true }, (event, filename) => {
    if (!filename) return;
    
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['md', 'js', 'html', 'css'].includes(ext)) {
      console.log(`[10x:HMR] ${event}: ${filename}`);
      // Notify all connected clients to reload
      for (const client of clients) {
        client.send(JSON.stringify({ type: 'reload', file: filename }));
      }
    }
  });
  
  const server = Bun.serve({
    port,
    async fetch(req, server) {
      const url = new URL(req.url);
      let pathname = url.pathname;
      
      // WebSocket upgrade for HMR
      if (pathname === '/__hmr__') {
        const upgraded = server.upgrade(req);
        if (!upgraded) {
          return new Response('WebSocket upgrade failed', { status: 400 });
        }
        return undefined;
      }
      
      // Default to index.html
      if (pathname === '/') pathname = '/index.html';
      
      const filePath = join(root, pathname);
      const file = Bun.file(filePath);
      
      if (!(await file.exists())) {
        return new Response('Not Found', { status: 404 });
      }
      
      const ext = pathname.split('.').pop()?.toLowerCase();
      
      // Handle .md files - compile to JS
      if (ext === 'md') {
        const source = await file.text();
        try {
          let compiled = compile(source, {
            hmr: true,
            module: true,
            runtimePath: '../../dist/runtime.js',
          });
          
          return new Response(compiled, {
            headers: { 'Content-Type': 'application/javascript' },
          });
        } catch (err) {
          return new Response(`Error: ${err.message}`, { status: 500 });
        }
      }
      
      // Handle HTML files - inject HMR client
      if (ext === 'html') {
        let html = await file.text();
        
        // Inject HMR client script before </body>
        const hmrScript = `
<script type="module">
  // 10x HMR Client
  const ws = new WebSocket('ws://localhost:${port}/__hmr__');
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === 'reload') {
      console.log('[10x:HMR] File changed:', data.file, '- reloading...');
      location.reload();
    }
  };
  ws.onopen = () => console.log('[10x:HMR] Connected');
  ws.onclose = () => console.log('[10x:HMR] Disconnected');
  ws.onerror = (e) => console.log('[10x:HMR] Error:', e);
</script>`;
        
        html = html.replace('</body>', `${hmrScript}</body>`);
        
        return new Response(html, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
      
      // Serve other files as-is
      return new Response(file);
    },
    
    websocket: {
      open(ws) {
        clients.add(ws);
        console.log('[10x:HMR] Client connected (' + clients.size + ' total)');
      },
      close(ws) {
        clients.delete(ws);
        console.log('[10x:HMR] Client disconnected (' + clients.size + ' total)');
      },
      message(ws, msg) {
        // Handle WebSocket messages if needed
      },
    },
  });
  
  console.log(`[10x] Dev server running at http://localhost:${port}`);
  console.log(`[10x] Watching ${root} for changes...`);
  
  // Cleanup on exit
  process.on('SIGINT', () => {
    watcher.close();
    server.stop();
    process.exit(0);
  });
  
  return server;
}

export default plugin;
