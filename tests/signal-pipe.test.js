import { describe, test, expect, beforeAll } from 'bun:test';
import { execute } from '../src/main.js';
import Env from '../src/lib/tree/env.js';
import Expr from '../src/lib/tree/expr.js';
import { signal, read, effect, html } from '../src/runtime/core.js';
import { on, render } from '../src/runtime/dom.js';
import { map, filter, push } from '../src/lib/prelude.js';

describe('Signal Pipe Syntax', () => {
  let env;

  beforeAll(async () => {
    env = new Env();
    // Add runtime functions directly as tokens
    env.def('signal', Expr.value(signal));
    env.def('read', Expr.value(read));
    env.def('effect', Expr.value(effect));
    env.def('html', Expr.value(html));
    env.def('on', Expr.value(on));
    env.def('render', Expr.value(render));
    env.def('map', Expr.value(map));
    env.def('filter', Expr.value(filter));
    env.def('push', Expr.value(push));
  });

  test('basic signal creation and reading', async () => {
    const e = new Env(env);
    await execute('tasks = @signal [].', e);
    
    const tasksEntry = e.get('tasks');
    expect(tasksEntry).toBeDefined();
    
    const [signalToken] = tasksEntry.body || [];
    const signalObj = signalToken?.valueOf();
    expect(signalObj).toBeDefined();
    expect(typeof signalObj.peek).toBe('function');
    expect(signalObj.peek()).toEqual([]);
  });

  test('pipe operator with array', async () => {
    const e = new Env(env);
    await execute('result = [1, 2, 3] |> map((x) -> x * 2).', e);
    
    const resultEntry = e.get('result');
    const [resultToken] = resultEntry.body || [];
    expect(resultToken?.valueOf()).toEqual([2, 4, 6]);
  });

  test('pipe operator with signal unwrapping', async () => {
    const e = new Env(env);
    await execute('tasks = @signal [1, 2, 3].', e);
    await execute('result = tasks |> map((x) -> x * 2).', e);
    
    const resultEntry = e.get('result');
    const [resultToken] = resultEntry.body || [];
    expect(resultToken?.valueOf()).toEqual([2, 4, 6]);
  });

  test('push with array', async () => {
    const e = new Env(env);
    await execute('result = push([1, 2], 3, 4).', e);
    
    const resultEntry = e.get('result');
    const [resultToken] = resultEntry.body || [];
    expect(resultToken?.valueOf()).toEqual([1, 2, 3, 4]);
  });

  test('push with signal via pipe', async () => {
    const e = new Env(env);
    await execute('tasks = @signal [].', e);
    await execute('result = tasks |> push("a", "b").', e);
    
    const resultEntry = e.get('result');
    const [resultToken] = resultEntry.body || [];
    expect(resultToken?.valueOf()).toEqual(['a', 'b']);
  });

  test('push with object via pipe', async () => {
    const e = new Env(env);
    await execute('tasks = @signal [].', e);
    await execute('result = tasks |> push(:text "hello", :done :off).', e);
    
    const resultEntry = e.get('result');
    const [resultToken] = resultEntry.body || [];
    expect(resultToken?.valueOf()).toEqual([{ text: 'hello', done: false }]);
  });

  test('@on handler with pipe syntax', async () => {
    const e = new Env(env);
    await execute('tasks = @signal [].', e);
    await execute('input = @signal "test".', e);
    await execute('addTask = @on tasks = tasks |> push(:text input, :done :off).', e);
    
    // Get the handler
    const addTaskEntry = e.get('addTask');
    expect(addTaskEntry).toBeDefined();
    
    const [handlerToken] = addTaskEntry.body || [];
    const handler = handlerToken?.valueOf();
    expect(typeof handler).toBe('function');
    
    // Call the handler
    await handler();
    
    // Check tasks was updated
    const tasksEntry = e.get('tasks');
    const [signalToken] = tasksEntry.body || [];
    const signalObj = signalToken?.valueOf();
    expect(signalObj.peek()).toEqual([{ text: 'test', done: false }]);
  });

  test('full todolist add task flow', async () => {
    const e = new Env(env);
    await execute('tasks = @signal [].', e);
    await execute('input = @signal "".', e);
    
    // Simulate typing
    const inputEntry = e.get('input');
    const [inputSignalToken] = inputEntry.body || [];
    const inputSignal = inputSignalToken?.valueOf();
    inputSignal.set('Buy milk');
    
    // Add task handler
    await execute('addTask = @on tasks = tasks |> push(:text input, :done :off), input = "".', e);
    
    const addTaskEntry = e.get('addTask');
    const [handlerToken] = addTaskEntry.body || [];
    const handler = handlerToken?.valueOf();
    
    await handler();
    
    // Check tasks
    const tasksEntry = e.get('tasks');
    const [tasksSignalToken] = tasksEntry.body || [];
    const tasksSignal = tasksSignalToken?.valueOf();
    expect(tasksSignal.peek()).toEqual([{ text: 'Buy milk', done: false }]);
    
    // Check input was cleared
    expect(inputSignal.peek()).toBe('');
  });
});
