import Solvente from '../src/lib';
import { deepEqual } from 'assert';

const cases = [
  ['# Expressions', []],
  ['Expressions like 1 + 2 just works, however expressions like 1 2 3 / 4 5 are calculated differently.', ['3', '8.75']],
  ['> Operator-less expressions between numbers are implicitly added/subtracted as above.', []],
  ['In such cases, last unary-operator (+ or -) is still used on further operations, e.g. 1 2 3 - 4 5', ['-3']],
  ['> Numbers can have some separators as $1,000 (or 1_000), add spaces to disambiguate.', []],
  ['Notice: all math-expressions are disabled within formatting tags.', []],
  ['# Definitions', []],
  ['Local definitions are possible too, e.g. x=1.5; 3x', ['4.5']],
  ["Basic function-expressions are available: f(d',x)=d'*x; f(3, 5)", ['15']],
  ['> Also, previously defined functions and variables can be shared, e.g. f(2, x) / .33', []],
  ['Definitions yield nothing back:', []],
  ["  a' = 1.2;", []],
  ["  b' = 3.4;", []],
  ["  c' = a' * b' / 2;", []],
  ["Number-less units are not evaluated: c'.", []],
  ["Numbers along with units are evaluated: 1c', -0.2a' or 2-b'.", ['2.04', '-0.24', '-1.4']],
  ['# Units', []],
  ['Some values are already units, like 1cm - 35mm.', ['-2.5 cm']],
  ["Numbers are not tokenized if they're alone within parenthesis, e.g. (123)", []],
  ['Numbers can alse be expressed as fractions, e.g. 1/2 or 0.00032 as fr.', ['0.5', '1/5000']],
];

describe('Playbook', () => {
  const c = new Solvente();

  cases.forEach(test => {
    it(test[0], () => {
      const x = c.resolve(test[0]);

      if (x.error) throw x.error;

      deepEqual(x.results.map(x => x.format), test[1]);
    });
  });
});
