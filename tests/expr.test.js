import { expect } from 'chai';
import Expr from '../src/lib/expr';

describe('Expr', () => {
  it('should resolve intermediate expressions with ok()', () => {
    expect(Expr.value([
      Expr.from(['number', '1.2']),
      Expr.from(['expr', '*', 'mul']),
      Expr.from(['number', '2']),
    ])).to.eql({ token: ['number', 2.4] });
  });
});
