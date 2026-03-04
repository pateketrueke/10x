/**
---
$format: esm
---
*/

import { execute, evaluate } from './lib/index.js';
import Env from './lib/tree/env';
import Expr from './lib/tree/expr';
import Parser from './lib/tree/parser';
import { applyAdapter as applyRuntimeAdapter, createEnv as createRuntimeEnv } from './adapters/index.js';

export { execute, evaluate };
export { useCurrencies } from './lib/builtins';
export { compile } from './compiler/index.js';
export * as Runtime from './runtime/index.js';

export { Env, Expr, Parser };

export { main, format } from './util';

export function applyAdapter(adapter, options) {
  applyRuntimeAdapter({
    Env,
    Expr,
    execute,
    evaluate,
  }, adapter, options);
}

export function createEnv(adapter, options) {
  return createRuntimeEnv({
    Env,
    Expr,
    execute,
    evaluate,
  }, adapter, options);
}

export {
  Token, debug, serialize, deindent, hasDiff,
  copy, repr, raise, assert, check, argv, only,
} from './lib/helpers';
