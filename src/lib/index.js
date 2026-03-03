import Expr from './tree/expr';
import Eval from './tree/eval';
import Parser from './tree/parser';

import { ensureDefaultMappings } from './builtins';

let builtinsReady = false;

function ensureBuiltins() {
  if (builtinsReady) return;
  builtinsReady = true;

  const mappings = ensureDefaultMappings();

  // export helpers and all units lazily to avoid eager startup cost
  Expr.Unit.to = Parser.sub('a, b -> a.to(b)');

  Object.keys(mappings).forEach(kind => {
    Expr.Unit[kind] = Parser.sub(`:${mappings[kind]}`);
  });
}

export async function evaluate(tokens, environment, enabledDetail) {
  ensureBuiltins();
  const info = Eval.info({
    enabled: enabledDetail,
    depth: 0,
    calls: [],
  });

  let result;
  let error;

  try {
    result = await Eval.run(tokens, environment, 'Eval', !!environment);
  } catch (e) {
    if (!environment) throw e;
    error = e;
  }

  return { result, error, info };
}

export async function execute(code, environment, enabledDetail) {
  ensureBuiltins();
  let failure = null;
  let value = null;
  let info = {};

  try {
    const res = await evaluate(Parser.getAST(code, undefined, environment), environment, enabledDetail);

    failure = res.error;
    value = res.result;
    info = res.info;
  } catch (e) {
    failure = failure || e;
  }

  // Expose on function object for backward compat with CLI callers (src/util.js)
  // Note: these are NOT safe for concurrent browser use — read the returned value instead
  execute.failure = failure;
  execute.value = value;
  execute.info = info;

  if (failure && !environment) {
    throw failure;
  }

  return value;
}
