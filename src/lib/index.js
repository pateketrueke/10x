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
  execute.failure = null;
  execute.value = null;
  execute.info = {};

  try {
    const { result, error, info } = await evaluate(Parser.getAST(code, undefined, environment), environment, enabledDetail);

    execute.failure = error;
    execute.value = result;
    execute.info = info;
  } catch (e) {
    execute.failure = execute.failure || e;
  }

  if (execute.failure && !environment) {
    throw execute.failure;
  }

  return execute.value;
}
