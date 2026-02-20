import Expr from './tree/expr';
import Eval from './tree/eval';
import Parser from './tree/parser';

import { DEFAULT_MAPPINGS } from './builtins';

// export helpers and all units!
Expr.Unit.to = Parser.sub('a, b -> a.to(b)');

Object.keys(DEFAULT_MAPPINGS).forEach(kind => {
  Expr.Unit[kind] = Parser.sub(`:${DEFAULT_MAPPINGS[kind]}`);
});

export async function evaluate(tokens, environment, enabledDetail) {
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
