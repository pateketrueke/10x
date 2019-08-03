import { expect } from 'chai';
import Solvente from '../src/lib';

const calc = expr => new Solvente().resolve(expr);
const values = ({ results }) => results.map(x => x.format);

describe('DSL', () => {
  describe('Basic operations', () => {
    it('should handle most basic operators', () => {
      expect(values(calc('1+2, 3-4, 5/6, 7*8'))).to.eql(['3', '-1', '0.83', '56']);
    });

    it('should handle converting to fractions', () => {
      expect(values(calc('0.5 as fr'))).to.eql(['1/2']);
      expect(values(calc('0.5 as frac'))).to.eql(['1/2']);
      expect(values(calc('0.5 as fraction'))).to.eql(['1/2']);
      expect(values(calc('0.5 as fractions'))).to.eql(['1/2']);
    });
  });

  describe('Tokenization', () => {
    it('...');
  });
});
