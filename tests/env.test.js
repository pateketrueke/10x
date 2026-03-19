import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';

import Env from '../src/lib/tree/env';
import Expr from '../src/lib/tree/expr';

import { BLOCK, COMMA, FFI } from '../src/lib/tree/symbols';

async function getError(run) {
  try {
    await run();
  } catch (e) {
    return e;
  }

  throw new Error('Expected failure');
}

describe('Env', () => {
  const tokenInfo = { line: 0, col: 0 };

  let previousResolve;
  let previousShared;

  beforeEach(() => {
    previousResolve = Env.resolve;
    previousShared = Env.shared;
  });

  afterEach(() => {
    Env.resolve = previousResolve;
    Env.shared = previousShared;
  });

  test('has(...) resolves names recursively when requested', () => {
    const parent = new Env();
    const child = new Env(parent);

    parent.def('root', Expr.value(42));

    expect(child.has('root')).toEqual(false);
    expect(child.has('root', true)).toEqual(true);
  });

  test('get(...) resolves from parent and fails on unknown names', () => {
    const parent = new Env();
    const child = new Env(parent);

    parent.def('x', Expr.value(7));

    expect(child.get('x').body[0].valueOf()).toEqual(7);
    expect(() => child.get('missing')).toThrow('Undeclared local `missing`');
  });

  test('get(...) blocks non-callable self-references but allows callable refs', () => {
    const env = new Env();

    env.def('x', Expr.local('x', tokenInfo));
    env.get('x');

    expect(() => env.get('x')).toThrow('Unexpected reference to `x`');

    env.locals.fn = {
      body: [Expr.callable({ type: BLOCK, value: { body: [] } }, tokenInfo)],
    };
    env.resolved.add('fn');

    expect(env.get('fn')).toEqual(env.locals.fn);
  });

  test('def(...) and defn(...) register locals with context', () => {
    const env = new Env();

    env.def('a', Expr.value(1));
    env.defn('b', { body: [Expr.value(2)] }, tokenInfo);

    expect(env.get('a').body[0].valueOf()).toEqual(1);
    expect(env.get('b').body[0].valueOf()).toEqual(2);
    expect(env.get('b').ctx).toEqual(tokenInfo);
  });

  test('set(...) with function traverses parent scopes when inheritance is enabled', () => {
    const root = new Env();
    const child = new Env(root);

    root.def('name', Expr.value(1));

    child.set('name', scope => {
      scope.def('name', Expr.value(3));
    });

    expect(root.get('name').body[0].valueOf()).toEqual(3);
    expect(child.has('name')).toEqual(false);
  });

  test('up(...) updates existing locals preserving token metadata', () => {
    const env = new Env();

    env.defn('n', { body: [Expr.value(1, tokenInfo)] }, tokenInfo);
    Env.up('n', 'N', () => 99, env);

    const token = env.get('n').body[0];

    expect(token.valueOf()).toEqual(99);
    expect(token.tokenInfo, tokenInfo);
  });

  test('sub(...) merges curried callable arguments into a child scope', () => {
    const env = new Env();

    const argA = Expr.local('a', tokenInfo);
    const argB = Expr.local('b', tokenInfo);

    const target = {
      args: [argA],
      body: [Expr.callable({
        type: BLOCK,
        value: {
          args: [argB],
          body: [Expr.local('b', tokenInfo)],
        },
      }, tokenInfo)],
    };

    const args = [Expr.value(11), Expr.from(COMMA), Expr.value(22)];
    const result = Env.sub(args, target, env);

    expect(result.scope.get('a').body[0].valueOf()).toEqual(11);
    expect(result.scope.get('b').body[0].valueOf()).toEqual(22);
    expect(result.target.args[0].value, 'b');
  });

  test('merge(...) supports spread keys and hygiene checks', () => {
    const parent = new Env();
    const env = new Env(parent);

    parent.def('skip', Expr.value(1));

    Env.merge([
      Expr.value(10),
      Expr.value(20),
    ], [
      Expr.local('skip', tokenInfo),
      Expr.from(COMMA),
      Expr.local('..', tokenInfo),
    ], true, env);

    expect(env.has('skip')).toEqual(false);

    const spread = env.get('..').body[0];

    expect(spread.isBlock, true);
    expect(spread.getBody()).toHaveLength(1);
    expect(spread.getBody()[0].valueOf()).toEqual(20);
  });

  test('create(...) wraps plain values and keeps Expr instances', () => {
    const source = {
      a: 1,
      b: Expr.value(2),
    };

    const scope = Env.create(source);

    expect(scope.get('a').body[0].valueOf()).toEqual(1);
    expect(scope.get('b').body[0].valueOf()).toEqual(2);
  });

  test('load(...) imports from safe globals', async () => {
    const env = new Env();

    await Env.load({ tokenInfo }, 'max', 'mx', 'Math', env);

    const target = env.get('mx').body[0].value.target;

    expect(target(1, 5, 3)).toEqual(5);
  });

  test('load(...) imports from shared prelude as FFI wrappers', async () => {
    const env = new Env();

    await Env.load({ tokenInfo }, 'show', 'showx', 'Prelude', env);

    const token = env.get('showx').body[0];

    expect(token.type, FFI);
    expect(token.value.label).toInclude('show');
    expect(typeof token.value.target, 'function');
  });

  test('load(...) imports shared objects and wraps scalar exports', async () => {
    const env = new Env();

    Env.shared = {
      Demo: {
        value: 42,
      },
    };

    await Env.load({ tokenInfo }, 'value', 'x', 'Demo', env);

    expect(env.get('x').body[0].valueOf()).toEqual(42);
  });

  test('load(...) imports Env exports with descriptor and alias remapping', async () => {
    const root = new Env();
    const mod = new Env();

    mod.descriptor = 'pkg/mod';
    mod.exported = { public: 'secret' };
    mod.def('secret', Expr.value(9));

    Env.resolve = async () => mod;

    await Env.load({ tokenInfo }, 'public', 'alias', 'src/module', root);

    const call = root.get('alias').body[0].value;

    expect(call.target, 'secret');
    expect(call.label, 'pkg/mod/public:alias');
  });

  test('load(...) wraps default exports from plain objects and functions', async () => {
    const env = new Env();

    Env.resolve = async source => {
      if (source === 'obj') return { ok: true };
      return function Sum(a, b) { return a + b; };
    };

    await Env.load({ tokenInfo }, 'default', 'objDefault', 'obj', env);
    await Env.load({ tokenInfo }, 'default', 'fnDefault', 'fn', env);

    expect(env.get('objDefault').body[0].value.ok).toEqual(true);
    expect(typeof env.get('fnDefault').body[0].valueOf()).toEqual('function');
  });

  test('load(...) wraps explicit FFI tuples from resolved modules', async () => {
    const env = new Env();

    Env.resolve = async () => ({
      native: Expr.unsafe(() => 'ok', 'Demo/native', true),
    });

    await Env.load({ tokenInfo }, 'native', 'native', 'ffi-mod', env);

    const token = env.get('native').body[0];

    expect(token.type, FFI);
    expect(token.tokenInfo.kind, 'raw');
    expect(token.value.label, 'Demo/native');
    expect(token.value.target()).toEqual('ok');
  });

  test('load(...) reports missing exports and resolver failures', async () => {
    const env = new Env();

    Env.resolve = async () => ({});

    const missing = await getError(() => Env.load({ tokenInfo }, 'x', 'x', 'mod', env));
    expect(missing.message).toInclude('Symbol `x` not exported');

    Env.resolve = async () => null;

    const couldNotLoad = await getError(() => Env.load({ tokenInfo }, 'x', 'y', 'mod', env));
    expect(couldNotLoad.message).toInclude('Could not load `x`');

    Env.resolve = async () => {
      throw new Error('Boom');
    };

    const wrapped = await getError(() => Env.load({ tokenInfo }, 'x', 'y', 'mod', env));
    expect(wrapped.message).toInclude('Boom (mod/x:y)');
  });

  test('load(...) reports missing named exports on Env instances', async () => {
    const env = new Env();

    Env.resolve = async () => new Env();

    const err = await getError(() => Env.load({ tokenInfo }, 'x', 'y', 'pkg/mod', env));

    expect(err.message).toInclude('Local `x` not exported');
  });

  test('register() and resolve() keep nullish defaults', async () => {
    expect([null, undefined]).toContain(Env.register());
    expect([null, undefined]).toContain(await Env.resolve());
  });
});
