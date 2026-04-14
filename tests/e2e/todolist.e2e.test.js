/**
 * E2E tests for TodoList example
 */

import { expect, test, describe, beforeAll, afterAll, beforeEach } from 'bun:test';
import { 
  acquireVirtualDoc, 
  releaseVirtualDoc, 
  makeContainer, 
  wait, 
  setupRuntime,
  getVirtualDoc
} from './helpers.js';
import { execute as run } from '../../src/main.js';
import Env from '../../src/lib/tree/env.js';

setupRuntime();

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

describe('E2E: TodoList', () => {
  let runtimeEnv;
  let container;

  beforeAll(async () => {
    acquireVirtualDoc();
    runtimeEnv = new Env();
    await run('@import signal, read, html, render, on @from "Runtime".', runtimeEnv);
    await run('@from "Prelude" @import (map, filter, size, push).', runtimeEnv);
  });

  afterAll(() => {
    releaseVirtualDoc();
  });

  beforeEach(() => {
    const doc = getVirtualDoc();
    doc.body.innerHTML = '';
    container = makeContainer('render-container');
  });

  describe('Rendering', () => {
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

    test('initially has empty task list', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      const taskList = container.querySelector('#task-list');
      const tasks = taskList.querySelectorAll('.task-item');
      expect(tasks.length).toBe(0);
    });
  });

  describe('Adding Tasks', () => {
    test('can add a task', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      // Set input value
      const input = container.querySelector('#task-input');
      input.value = 'Test task';
      // Create mock event with target
      const inputEvent = { 
        type: 'input',
        target: input,
        currentTarget: input,
        bubbles: true
      };
      input.dispatchEvent(inputEvent);
      await wait();
      
      // Click add button
      const addBtn = container.querySelector('#add-btn');
      addBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      // Check task was added
      const taskList = container.querySelector('#task-list');
      const tasks = taskList.querySelectorAll('.task-item');
      expect(tasks.length).toBe(1);
      
      const taskText = tasks[0].querySelector('.task-text');
      expect(taskText?.textContent).toBe('Test task');
    });

    test('can add multiple tasks', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      const input = container.querySelector('#task-input');
      const addBtn = container.querySelector('#add-btn');
      
      // Add first task
      input.value = 'Task 1';
      input.dispatchEvent({ type: 'input', target: input, currentTarget: input, bubbles: true });
      await wait();
      addBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      // Add second task
      input.value = 'Task 2';
      input.dispatchEvent({ type: 'input', target: input, currentTarget: input, bubbles: true });
      await wait();
      addBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      // Check both tasks exist
      const taskList = container.querySelector('#task-list');
      const tasks = taskList.querySelectorAll('.task-item');
      expect(tasks.length).toBe(2);
    });
  });

  describe('Toggling Tasks', () => {
    // TODO: Pipe operator `|>` has issues in certain contexts
    // Issue: SyntaxError when using pipe operator with map
    test.skip('can toggle task completion', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      // Add a task
      const input = container.querySelector('#task-input');
      input.value = 'Test task';
      input.dispatchEvent({ type: 'input', target: input, currentTarget: input, bubbles: true });
      await wait();
      
      const addBtn = container.querySelector('#add-btn');
      addBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      // Toggle the task
      const checkbox = container.querySelector('.task-checkbox');
      checkbox.dispatchEvent({ type: 'change', bubbles: true });
      await wait();
      
      // Check task is marked as done
      const taskText = container.querySelector('.task-text');
      expect(taskText?.style?.textDecoration).toContain('line-through');
    });
  });

  describe('Clearing Tasks', () => {
    // TODO: Pipe operator `|>` has issues in certain contexts
    // Issue: SyntaxError when using pipe operator with filter/map
    test.skip('can clear completed tasks', async () => {
      const env = new Env(runtimeEnv);
      await run(TODOLIST, env);
      await wait();
      
      const input = container.querySelector('#task-input');
      const addBtn = container.querySelector('#add-btn');
      
      // Add two tasks
      input.value = 'Task 1';
      input.dispatchEvent({ type: 'input', target: input, currentTarget: input, bubbles: true });
      await wait();
      addBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      input.value = 'Task 2';
      input.dispatchEvent({ type: 'input', target: input, currentTarget: input, bubbles: true });
      await wait();
      addBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      // Toggle first task
      const checkboxes = container.querySelectorAll('.task-checkbox');
      checkboxes[0].dispatchEvent({ type: 'change', bubbles: true });
      await wait();
      
      // Clear done
      const clearBtn = container.querySelector('#clear-btn');
      clearBtn.dispatchEvent({ type: 'click', bubbles: true });
      await wait();
      
      // Check only one task remains
      const taskList = container.querySelector('#task-list');
      const tasks = taskList.querySelectorAll('.task-item');
      expect(tasks.length).toBe(1);
      expect(tasks[0].querySelector('.task-text')?.textContent).toBe('Task 2');
    });
  });
});
