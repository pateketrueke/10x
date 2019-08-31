export default class LangExpr {
  constructor(info, token) {
    if (!token) {
      token = info.token;
    }

    // clone exact properties!
    ['depth', 'begin', 'end'].forEach(k => {
      Object.defineProperty(this, k, {
        value: info[k],
        writable: true,
        configurable: true,
      });
    });

    this.token = token.slice();

    // not needed anymore
    delete this.content;

    // shortcuts
    Object.defineProperty(this, 'is', { get: () => this.token[0] });
    Object.defineProperty(this, 'expr', { get: () => this.token[1] });
    Object.defineProperty(this, 'value', { get: () => this.token[2] });
  }
}
