import * as Runtime from '../../runtime/index.js';
import * as Prelude from '../../lib/prelude.js';

export function createBrowserAdapter() {
  const safeUnits = [];

  return {
    name: 'browser',
    setup({ Env, Expr }) {
      Env.register = (num, kind) => {
        if (typeof num === 'function') {
          safeUnits.push(num);
          return;
        }

        for (let i = 0; i < safeUnits.length; i++) {
          const result = safeUnits[i](num, kind);
          if (result) return result;
        }

        return Expr.Unit.from(num, kind);
      };

      Env.shared = Env.shared || {};
      Env.shared.Runtime = Runtime;
      // Prelude functions - available globally without import
      Env.shared.map = Prelude.map;
      Env.shared.filter = Prelude.filter;
      Env.shared.reduce = Prelude.reduce;
      Env.shared.head = Prelude.head;
      Env.shared.tail = Prelude.tail;
      Env.shared.take = Prelude.take;
      Env.shared.drop = Prelude.drop;
      Env.shared.rev = Prelude.rev;
      Env.shared.size = Prelude.size;
      Env.shared.push = Prelude.push;
      Env.shared.pairs = Prelude.pairs;
      Env.shared.keys = Prelude.keys;
      Env.shared.vals = Prelude.vals;
      Env.shared.get = Prelude.get;
      Env.shared.equals = Prelude.equals;
      Env.shared.show = Prelude.show;
      Env.shared.format = Prelude.format;
      Env.shared.list = Prelude.list;
      Env.shared.items = Prelude.items;
      Env.shared.unwrap = Prelude.unwrap;
      Env.shared.render = Prelude.render;
      Env.shared.cast = Prelude.cast;
      Env.shared.repr = Prelude.repr;
    },
  };
}
