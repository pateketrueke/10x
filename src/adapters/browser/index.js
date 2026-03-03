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
    },
  };
}
