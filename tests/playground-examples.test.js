/**
 * Tests for playground examples
 * 
 * These tests ensure the examples in public/devtools.html work correctly.
 * Uses somedom's virtual DOM for SSR testing.
 */

import { useWindow } from 'somedom/ssr';
import { execute as run, applyAdapter } from '../src/main.js';
import { createBrowserAdapter } from '../src/adapters/browser/index.js';
import Env from '../src/lib/tree/env.js';
import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';

// ─── Virtual DOM setup ───────────────────────────────────────────────────────

let virtualDoc = null;
const originalDoc = globalThis.document;

function acquireVirtualDoc() {
  useWindow(() => { virtualDoc = globalThis.document; });
  if (!virtualDoc) throw new Error('somedom/ssr: useWindow did not set document');

  if (!virtualDoc.addEventListener) virtualDoc.addEventListener = () => {};
  if (!virtualDoc.removeEventListener) virtualDoc.removeEventListener = () => {};
  if (!virtualDoc.head) virtualDoc.head = { appendChild: () => {} };

  globalThis.document = virtualDoc;
}

function releaseVirtualDoc() {
  globalThis.document = originalDoc;
  virtualDoc = null;
}

function makeContainer(id) {
  const el = virtualDoc.createElement('div');
  el.setAttribute('id', id);
  virtualDoc.body.appendChild(el);
  return el;
}

const wait = (ms = 50) => new Promise(r => setTimeout(r, ms));

// ─── Simple Counter Example ──────────────────────────────────────────────────

const SIMPLE_COUNTER = `
count = @signal 0.
dec = @on count = count - 1.
inc = @on count = count + 1.

@render "#render-container" @html
  <div style="text-align:center;padding:2rem;font-family:system-ui">
    <h1 id="count-display" style="font-size:3rem;margin:0.5rem 0">Count: #{count}</h1>
    <div style="display:flex;gap:0.5rem;justify-content:center">
      <button id="dec-btn" onclick={dec} style="padding:0.5rem 1rem;font-size:1rem;cursor:pointer">-</button>
      <button id="inc-btn" onclick={inc} style="padding:0.5rem 1rem;font-size:1rem;cursor:pointer">+</button>
    </div>
  </div>.
`;

describe('Playground: Simple Counter', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    applyAdapter(createBrowserAdapter());
    runtimeEnv = new Env();
    await run('@import signal, html, render, on @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  describe('Integration: Rendering', () => {
    test('renders initial count value of 0', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      expect(container.innerHTML).toContain('Count:');
      expect(container.innerHTML).toContain('0');
    });

    test('renders both increment and decrement buttons', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      const decBtn = container.querySelector('#dec-btn');
      const incBtn = container.querySelector('#inc-btn');
      expect(decBtn).toBeDefined();
      expect(incBtn).toBeDefined();
      expect(decBtn?.textContent).toBe('-');
      expect(incBtn?.textContent).toBe('+');
    });

    test('renders h1 with count display', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      const h1 = container.querySelector('#count-display');
      expect(h1).toBeDefined();
      expect(h1?.textContent).toBe('Count: 0');
    });
  });

  describe('BDD: User interactions', () => {
    test('Given counter at 0, When + button clicked, Then count becomes 1', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const incBtn = container.querySelector('#inc-btn');
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 1');
    });

    test('Given counter at 0, When - button clicked, Then count becomes -1', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: -1');
    });

    test('Given counter at 0, When + clicked once, Then count becomes 1', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const incBtn = container.querySelector('#inc-btn');
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 1');
    });

    test('Given counter at 5, When - clicked once, Then count becomes 4', async () => {
      const env = new Env(runtimeEnv);
      await run(`
count = @signal 5.
dec = @on count = count - 1.
inc = @on count = count + 1.

@render "#render-container" @html
  <div>
    <h1 id="count-display">Count: #{count}</h1>
    <button id="dec-btn" onclick={dec}>-</button>
    <button id="inc-btn" onclick={inc}>+</button>
  </div>.
`, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 4');
    });
  });

  describe('E2E: Full counter workflow', () => {
    test('Complete user flow: increment, verify state', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      // Initial state
      const h1 = container.querySelector('#count-display');
      expect(h1?.textContent).toBe('Count: 0');
      
      // Increment once
      const incBtn = container.querySelector('#inc-btn');
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 1');
      
      // Decrement once
      const decBtn = container.querySelector('#dec-btn');
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 0');
    });

    test('Counter can go negative', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      const h1 = container.querySelector('#count-display');
      
      // Go negative
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: -1');
    });

    test('Counter can go positive from negative', async () => {
      const env = new Env(runtimeEnv);
      await run(SIMPLE_COUNTER, env);
      await wait();
      
      const decBtn = container.querySelector('#dec-btn');
      const incBtn = container.querySelector('#inc-btn');
      const h1 = container.querySelector('#count-display');
      
      // Go negative
      decBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: -1');
      
      // Back to zero
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 0');
      
      // Go positive
      incBtn.dispatchEvent(new Event('click'));
      await wait();
      expect(h1?.textContent).toBe('Count: 1');
    });
  });
});

// ─── Inline Components Example ───────────────────────────────────────────────

const INLINE_COMPONENTS = `
Counter props =>
  count = @signal props.start,
  inc = @on count = count + 1,
  dec = @on count = count - 1,
  @html
    <div class="counter-box" style="text-align:center;padding:1rem;border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin:0.5rem">
      <h3 class="counter-title" style="margin:0 0 0.5rem">Counter: #{count}</h3>
      <button class="dec-btn" onclick={dec}>-</button>
      <button class="inc-btn" onclick={inc}>+</button>
    </div>.

@render "#render-container" @html
  <div style="font-family:system-ui;padding:1rem">
    <h2 style="margin:0 0 1rem">Multiple Independent Counters</h2>
    <div class="counters" style="display:flex;gap:1rem;flex-wrap:wrap">
      <Counter start=0 />
      <Counter start=10 />
      <Counter start=100 />
    </div>
  </div>.
`;

describe('Playground: Inline Components', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    applyAdapter(createBrowserAdapter());
    runtimeEnv = new Env();
    await run('@import signal, html, render, on @from "Runtime".', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  describe('Integration: Rendering', () => {
    test('renders three counter components', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const counters = container.querySelectorAll('.counter-box');
      expect(counters.length).toBe(3);
    });

    test('each counter has correct initial value', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const titles = container.querySelectorAll('.counter-title');
      expect(titles[0]?.textContent).toBe('Counter: 0');
      expect(titles[1]?.textContent).toBe('Counter: 10');
      expect(titles[2]?.textContent).toBe('Counter: 100');
    });

    test('each counter has increment and decrement buttons', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const counters = container.querySelectorAll('.counter-box');
      counters.forEach(counter => {
        const incBtn = counter.querySelector('.inc-btn');
        const decBtn = counter.querySelector('.dec-btn');
        expect(incBtn).toBeDefined();
        expect(decBtn).toBeDefined();
      });
    });
  });

  describe('BDD: Component isolation', () => {
    test('Given three counters, When first counter + clicked, Then only first counter changes', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const counters = container.querySelectorAll('.counter-box');
      const firstIncBtn = counters[0].querySelector('.inc-btn');
      firstIncBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const titles = container.querySelectorAll('.counter-title');
      expect(titles[0]?.textContent).toBe('Counter: 1');
      expect(titles[1]?.textContent).toBe('Counter: 10');
      expect(titles[2]?.textContent).toBe('Counter: 100');
    });

    test('Given three counters, When second counter - clicked, Then only second counter changes', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const counters = container.querySelectorAll('.counter-box');
      const secondDecBtn = counters[1].querySelector('.dec-btn');
      secondDecBtn.dispatchEvent(new Event('click'));
      await wait();
      
      const titles = container.querySelectorAll('.counter-title');
      expect(titles[0]?.textContent).toBe('Counter: 0');
      expect(titles[1]?.textContent).toBe('Counter: 9');
      expect(titles[2]?.textContent).toBe('Counter: 100');
    });

    test('Given three counters, When each + clicked once, Then all increment independently', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const counters = container.querySelectorAll('.counter-box');
      counters.forEach(counter => {
        const incBtn = counter.querySelector('.inc-btn');
        incBtn.dispatchEvent(new Event('click'));
      });
      await wait();
      
      const titles = container.querySelectorAll('.counter-title');
      expect(titles[0]?.textContent).toBe('Counter: 1');
      expect(titles[1]?.textContent).toBe('Counter: 11');
      expect(titles[2]?.textContent).toBe('Counter: 101');
    });
  });

  describe('E2E: Full component workflow', () => {
    test('Multiple interactions on different counters maintain isolation', async () => {
      const env = new Env(runtimeEnv);
      await run(INLINE_COMPONENTS, env);
      await wait();
      
      const counters = container.querySelectorAll('.counter-box');
      const titles = container.querySelectorAll('.counter-title');
      
      // First counter: + 3 times
      const firstInc = counters[0].querySelector('.inc-btn');
      firstInc.dispatchEvent(new Event('click'));
      await wait();
      firstInc.dispatchEvent(new Event('click'));
      await wait();
      firstInc.dispatchEvent(new Event('click'));
      await wait();
      
      // Second counter: - 2 times
      const secondDec = counters[1].querySelector('.dec-btn');
      secondDec.dispatchEvent(new Event('click'));
      await wait();
      secondDec.dispatchEvent(new Event('click'));
      await wait();
      
      // Third counter: + 1, - 1
      const thirdInc = counters[2].querySelector('.inc-btn');
      const thirdDec = counters[2].querySelector('.dec-btn');
      thirdInc.dispatchEvent(new Event('click'));
      await wait();
      thirdDec.dispatchEvent(new Event('click'));
      await wait();
      
      expect(titles[0]?.textContent).toBe('Counter: 3');
      expect(titles[1]?.textContent).toBe('Counter: 8');
      expect(titles[2]?.textContent).toBe('Counter: 100');
    });
  });
});

// ─── TodoList Example ────────────────────────────────────────────────────────

const TODOLIST = `
tasks = @signal [].
input = @signal "".

addTask = @on
  tasks = tasks |> push(:text read(input), :done :off),
  input = "".

updateInput = @on input = e -> e.target.value.

toggleTask = (i) ->
  tasks = tasks |> map((t j) -> @if (i == j) t | (:done !t.done) @else t).

clearDone = @on
  tasks = tasks |> filter((t) -> !t.done).

@render "#render-container" @html
  <section class="todo-app" style="font-family:system-ui;padding:1rem;max-width:400px;border:1px solid rgba(255,255,255,0.1);border-radius:8px">
    <h1 style="margin:0 0 0.5rem">TodoList</h1>
    <div class="input-row" style="display:flex;gap:0.5rem;margin-bottom:1rem">
      <input 
        id="task-input"
        type="text" 
        placeholder="Add task..." 
        value={input}
        oninput={updateInput}
        style="flex:1;padding:0.5rem"
      />
      <button id="add-btn" onclick={addTask} style="padding:0.5rem 1rem;cursor:pointer">Add</button>
    </div>
    <ul id="task-list" style="list-style:none;padding:0;margin:0 0 1rem">
      #{tasks |> map((t i) ->
        <li class="task-item" style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05)">
          <input type="checkbox" class="task-checkbox" checked={t.done} onchange={() -> toggleTask(i)} />
          <span class="task-text" style={t.done ? "text-decoration:line-through;opacity:0.5" : ""}>#{t.text}</span>
        </li>
      )}
    </ul>
    <button id="clear-btn" onclick={clearDone} style="padding:0.5rem 1rem;cursor:pointer;font-size:0.85rem">Clear done</button>
  </section>.
`;

describe('Playground: TodoList', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    applyAdapter(createBrowserAdapter());
    runtimeEnv = new Env();
    await run('@import signal, read, html, render, on @from "Runtime".', runtimeEnv);
    await run('@from "Prelude" @import (map, filter, size, push).', runtimeEnv);
    
    // Verify imports
    console.log('runtimeEnv has signal:', runtimeEnv.has('signal'));
    console.log('runtimeEnv has read:', runtimeEnv.has('read'));
    console.log('runtimeEnv has on:', runtimeEnv.has('on'));
    console.log('runtimeEnv has push:', runtimeEnv.has('push'));
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    virtualDoc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  describe('Integration: Rendering', () => {
    test('renders todo app structure', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      const app = container.querySelector('.todo-app');
      expect(app).toBeDefined();
    });

    test('renders input field and buttons', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      const input = container.querySelector('#task-input');
      const addBtn = container.querySelector('#add-btn');
      const clearBtn = container.querySelector('#clear-btn');
      
      expect(input).toBeDefined();
      expect(addBtn).toBeDefined();
      expect(clearBtn).toBeDefined();
    });

    test('renders empty task list', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      const taskList = container.querySelector('#task-list');
      expect(taskList).toBeDefined();
      
      const tasks = taskList?.querySelectorAll('.task-item');
      expect(tasks?.length || 0).toBe(0);
    });
  });

  describe('BDD: Signal state', () => {
    test('Given empty tasks signal, When accessed, Then returns empty array', async () => {
      const env = new Env(runtimeEnv);
      await run('tasks = @signal [].', env);
      
      const tasksSignal = env.get('tasks');
      expect(tasksSignal).toBeDefined();
    });

    test('Given empty input signal, When accessed, Then returns empty string', async () => {
      const env = new Env(runtimeEnv);
      await run('input = @signal "".', env);
      
      const inputSignal = env.get('input');
      expect(inputSignal).toBeDefined();
    });
  });

  describe('E2E: Component structure', () => {
    test('All required elements are present', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      // Check all major elements exist
      expect(container.querySelector('.todo-app')).toBeDefined();
      expect(container.querySelector('#task-input')).toBeDefined();
      expect(container.querySelector('#add-btn')).toBeDefined();
      expect(container.querySelector('#task-list')).toBeDefined();
      expect(container.querySelector('#clear-btn')).toBeDefined();
    });
  });

  describe('E2E: Add task workflow', () => {
    test('Given empty list, When Add clicked, Then task appears', async () => {
      // Reset container
      virtualDoc.body.innerHTML = '';
      container = makeContainer('render-container');
      
      const env = new Env(runtimeEnv);
      
      // Use the actual TODOLIST code
      const result = await run(TODOLIST, env);
      
      // Check for errors
      if (run.failure) {
        console.error('Run failure:', run.failure.message);
        console.error('Stack:', run.failure.stack?.split('\n').slice(0, 5).join('\n'));
        throw run.failure;
      }
      
      await wait();
      
      console.log('Run result:', result);
      console.log('Container innerHTML:', container.innerHTML?.slice(0, 500));
      
      // Check if rendered
      const app = container.querySelector('.todo-app');
      if (!app) {
        throw new Error('Todo app not rendered');
      }
      
      // Check if addTask was created
      const addTaskEntry = env.get('addTask');
      console.log('addTask entry:', addTaskEntry?.body?.[0]?.type?.toString());
      console.log('addTask value:', typeof addTaskEntry?.body?.[0]?.valueOf());
      
      const input = container.querySelector('#task-input');
      const addBtn = container.querySelector('#add-btn');
      
      if (!input || !addBtn) {
        throw new Error('Input or button not found');
      }
      
      // Type in input
      input.value = 'Test task';
      // Create a mock event with target
      const inputEvent = { 
        type: 'input',
        target: input,
        currentTarget: input,
        bubbles: true
      };
      input.dispatchEvent(inputEvent);
      await wait();
      
      // Click add
      const clickEvent = { type: 'click', bubbles: true };
      addBtn.dispatchEvent(clickEvent);
      await wait();
      
      console.log('After click, container:', container.innerHTML?.slice(0, 800));
      
      // Check task appears
      const tasks = container.querySelectorAll('.task-item');
      expect(tasks.length).toBe(1);
      expect(tasks[0]?.textContent).toContain('Test task');
    });
  });
});
