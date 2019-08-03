import { expect } from 'chai';
import Solvente from '../src/lib';

const calc = (expr, opts) => new Solvente(opts).resolve(expr);
const values = ({ results }) => results.map(x => x.format);

describe.only('DSL', () => {
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

    it('should handle converting from units', () => {
      expect(values(calc('3cm as inches'))).to.eql(['1.18 in']);
    });

    it('should skip converting from currencies', () => {
      expect(values(calc('1 MXN as USD'))).to.eql(['1 USD']);
    });

    it('should handle fixed-length expressions', () => {
      expect(values(calc('1123foo', { types: [['0000foo', 'cm']] }))).to.eql(['1123foo cm']);
    });

    it('should allow ISO dates', () => {
      expect(values(calc('1987-06-10T06:00:00.000Z'))).to.eql(['Wed Jun 10 1987 06:00:00']);
    });
  });

  describe('Tokenization', () => {
    it('...');
  });
});
