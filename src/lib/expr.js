export default class LangExpr {
  constructor(info, token) {
    if (!token) {
      token = info.token;
      delete info.token;
    }

    Object.keys(info).forEach(k => {
      Object.defineProperty(this, k, {
        value: info[k],
        writable: true,
        configurable: true,
      });
    });

    this.token = token.slice();

    // not needed anymore
    delete this.content;
  }
}
