import { expect } from 'chai';

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

  it('has(...) resolves names recursively when requested', () => {
    const parent = new Env();
    const child = new Env(parent);

    parent.def('root', Expr.value(42));

    expect(child.has('root')).to.eql(false);
    expect(child.has('root', true)).to.eql(true);
  });

  it('get(...) resolves from parent and fails on unknown names', () => {
    const parent = new Env();
    const child = new Env(parent);

    parent.def('x', Expr.value(7));

    expect(child.get('x').body[0].valueOf()).to.eql(7);
    expect(() => child.get('missing')).to.throw('Undeclared local `missing`');
  });

  it('get(...) blocks non-callable self-references but allows callable refs', () => {
    const env = new Env();

    env.def('x', Expr.local('x', tokenInfo));
    env.get('x');

    expect(() => env.get('x')).to.throw('Unexpected reference to `x`');

    env.locals.fn = {
      body: [Expr.callable({ type: BLOCK, value: { body: [] } }, tokenInfo)],
    };
    env.resolved.push('fn');

    expect(env.get('fn')).to.eql(env.locals.fn);
  });

  it('def(...) and defn(...) register locals with context', () => {
    const env = new Env();

    env.def('a', Expr.value(1));
    env.defn('b', { body: [Expr.value(2)] }, tokenInfo);

    expect(env.get('a').body[0].valueOf()).to.eql(1);
    expect(env.get('b').body[0].valueOf()).to.eql(2);
    expect(env.get('b').ctx).to.eql(tokenInfo);
  });

  it('set(...) with function traverses parent scopes when inheritance is enabled', () => {
    const root = new Env();
    const child = new Env(root);

    root.def('name', Expr.value(1));

    child.set('name', scope => {
      scope.def('name', Expr.value(3));
    });

    expect(root.get('name').body[0].valueOf()).to.eql(3);
    expect(child.has('name')).to.eql(false);
  });

  it('up(...) updates existing locals preserving token metadata', () => {
    const env = new Env();

    env.defn('n', { body: [Expr.value(1, tokenInfo)] }, tokenInfo);
    Env.up('n', 'N', () => 99, env);

    const token = env.get('n').body[0];

    expect(token.valueOf()).to.eql(99);
    expect(token.tokenInfo).to.eql(tokenInfo);
  });

  it('sub(...) merges curried callable arguments into a child scope', () => {
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

    expect(result.scope.get('a').body[0].valueOf()).to.eql(11);
    expect(result.scope.get('b').body[0].valueOf()).to.eql(22);
    expect(result.target.args[0].value).to.eql('b');
  });

  it('merge(...) supports spread keys and hygiene checks', () => {
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

    expect(env.has('skip')).to.eql(false);

    const spread = env.get('..').body[0];

    expect(spread.isBlock).to.eql(true);
    expect(spread.getBody()).to.have.length(1);
    expect(spread.getBody()[0].valueOf()).to.eql(20);
  });

  it('create(...) wraps plain values and keeps Expr instances', () => {
    const source = {
      a: 1,
      b: Expr.value(2),
    };

    const scope = Env.create(source);

    expect(scope.get('a').body[0].valueOf()).to.eql(1);
    expect(scope.get('b').body[0].valueOf()).to.eql(2);
  });

  it('load(...) imports from safe globals', async () => {
    const env = new Env();

    await Env.load({ tokenInfo }, 'max', 'mx', 'Math', env);

    const target = env.get('mx').body[0].value.target;

    expect(target(1, 5, 3)).to.eql(5);
  });

  it('load(...) imports from shared prelude as FFI wrappers', async () => {
    const env = new Env();

    await Env.load({ tokenInfo }, 'show', 'showx', 'Prelude', env);

    const token = env.get('showx').body[0];

    expect(token.type).to.eql(FFI);
    expect(token.value.label).to.contain('show');
    expect(typeof token.value.target).to.eql('function');
  });

  it('load(...) imports shared objects and wraps scalar exports', async () => {
    const env = new Env();

    Env.shared = {
      Demo: {
        value: 42,
      },
    };

    await Env.load({ tokenInfo }, 'value', 'x', 'Demo', env);

    expect(env.get('x').body[0].valueOf()).to.eql(42);
  });

  it('load(...) imports Env exports with descriptor and alias remapping', async () => {
    const root = new Env();
    const mod = new Env();

    mod.descriptor = 'pkg/mod';
    mod.exported = { public: 'secret' };
    mod.def('secret', Expr.value(9));

    Env.resolve = async () => mod;

    await Env.load({ tokenInfo }, 'public', 'alias', 'src/module', root);

    const call = root.get('alias').body[0].value;

    expect(call.target).to.eql('secret');
    expect(call.label).to.eql('pkg/mod/public:alias');
  });

  it('load(...) wraps default exports from plain objects and functions', async () => {
    const env = new Env();

    Env.resolve = async source => {
      if (source === 'obj') return { ok: true };
      return function Sum(a, b) { return a + b; };
    };

    await Env.load({ tokenInfo }, 'default', 'objDefault', 'obj', env);
    await Env.load({ tokenInfo }, 'default', 'fnDefault', 'fn', env);

    expect(env.get('objDefault').body[0].value.ok).to.eql(true);
    expect(typeof env.get('fnDefault').body[0].valueOf()).to.eql('function');
  });

  it('load(...) wraps explicit FFI tuples from resolved modules', async () => {
    const env = new Env();

    Env.resolve = async () => ({
      native: Expr.unsafe(() => 'ok', 'Demo/native', true),
    });

    await Env.load({ tokenInfo }, 'native', 'native', 'ffi-mod', env);

    const token = env.get('native').body[0];

    expect(token.type).to.eql(FFI);
    expect(token.tokenInfo.kind).to.eql('raw');
    expect(token.value.label).to.eql('Demo/native');
    expect(token.value.target()).to.eql('ok');
  });

  it('load(...) reports missing exports and resolver failures', async () => {
    const env = new Env();

    Env.resolve = async () => ({});

    const missing = await getError(() => Env.load({ tokenInfo }, 'x', 'x', 'mod', env));
    expect(missing.message).to.contain('Symbol `x` not exported');

    Env.resolve = async () => null;

    const couldNotLoad = await getError(() => Env.load({ tokenInfo }, 'x', 'y', 'mod', env));
    expect(couldNotLoad.message).to.contain('Could not load `x`');

    Env.resolve = async () => {
      throw new Error('Boom');
    };

    const wrapped = await getError(() => Env.load({ tokenInfo }, 'x', 'y', 'mod', env));
    expect(wrapped.message).to.contain('Boom (mod/x:y)');
  });

  it('load(...) reports missing named exports on Env instances', async () => {
    const env = new Env();

    Env.resolve = async () => new Env();

    const err = await getError(() => Env.load({ tokenInfo }, 'x', 'y', 'pkg/mod', env));

    expect(err.message).to.contain('Local `x` not exported');
  });

  it('register() and resolve() keep nullish defaults', async () => {
    expect([null, undefined]).to.include(Env.register());
    expect([null, undefined]).to.include(await Env.resolve());
  });
});
