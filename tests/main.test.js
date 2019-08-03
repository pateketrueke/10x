import { expect } from 'chai';
import Solvente from '../src/lib';

const calc = (expr, opts) => new Solvente(opts).resolve(expr);
const values = ({ results }) => results.map(x => x.format);

describe.only('DSL', () => {
  describe('Basic operations', () => {
    it('should handle common errors', () => {
       expect(calc('1ml - 1cm').error.message).to.eql('Cannot convert incompatible measures of volume and length');
    });

    it('should handle most basic units', () => {
      expect(values(calc('1cm'))).to.eql(['1 cm']);
    });
    it('should handle most basic operators', () => {
      expect(values(calc('1+2, 3-4, 5/6, 7*8'))).to.eql(['3', '-1', '0.83', '56']);
    });

    it('should skip empty sub-expressions', () => {
      expect(calc(';;;').results).to.eql([]);
    });

    it('should apply well-known inflections', () => {
      expect(values(calc('2 weeks as day'))).to.eql(['14 days']);
      expect(values(calc('1d'))).to.eql(['1 day']);
    });

    it('should handle separated sub-expressions', () => {
      expect(values(calc('1 2 or 3 4 or 5 6'))).to.eql(['3', '7', '11']);
    });

    it('should add basic operators between numbers', () => {
      expect(values(calc('1 2 3'))).to.eql(['6']);
      expect(values(calc('1 - 2 3'))).to.eql(['-4']);
      expect(values(calc('1 ( 2 3 )'))).to.eql(['6']);
      expect(values(calc('1 - ( 2 3 )'))).to.eql(['-4']);
      expect(values(calc('1 2 3 / 4 5'))).to.eql(['8.75']);
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
      expect(values(calc('1123foo', { types: [['0000foo', 'cm']] }))).to.eql(['1,123 cm']);
    });

    it('should handle local expressions', () => {
      expect(values(calc("x'=1.2;3x'"))).to.eql(['3.6']);
    });

    it('should handle external expressions', () => {
      expect(values(calc('2x', { expressions: { x: [['expr', '=', 'equal'], ['number', 1.5], ['expr', ';', 'k']] } }))).to.eql(['3']);
    });

    it('should allow ISO dates', () => {
      expect(values(calc('1987-06-10T06:00:00.000Z'))).to.eql(['Wed Jun 10 1987 06:00:00']);
    });
  });

  describe('Tokenization', () => {
    it('...');
  });
});
