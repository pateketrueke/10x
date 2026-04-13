/**
---
$format: esm
---
 */

import { execute, evaluate } from './lib/index.js';
import Env from './lib/tree/env';
import Expr from './lib/tree/expr';
import Parser from './lib/tree/parser';
import * as Symbols from './lib/tree/symbols.js';
import { applyAdapter as applyRuntimeAdapter, createEnv as createRuntimeEnv } from './adapters/index.js';

export { execute, evaluate };
export { useCurrencies } from './lib/builtins';
export { compile, compileBundle } from './compiler/index.js';
export * as Runtime from './runtime/index.js';

export { Env, Expr, Parser };
export * from './lib/tree/symbols.js';

export { main, format } from './util';

export { createBrowserAdapter } from './adapters/browser/index.js';

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
  Token, debug, serialize, compact, deindent, hasDiff,
  copy, repr, raise, assert, check, argv, only,
} from './lib/helpers';

export { getComponentInstanceId, resetComponentInstanceId } from './lib/tree/eval.js';
