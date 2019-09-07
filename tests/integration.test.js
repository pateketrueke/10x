import { readdirSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import { expect } from 'chai';
import Solv from '../src/lib';

const fixtures = readdirSync(`${__dirname}/fixtures`);

describe.only('Integration tests', () => {
  fixtures.forEach(file => {
    it(file.replace('.json', '.sv'), () => {
      const expected = JSON.parse(readFileSync(`${__dirname}/fixtures/${file}`).toString()).results;
      const sample = readFileSync(`${__dirname}/examples/${file.replace('.json', '.sv')}`);
      const calc = new Solv({ source: sample.toString() });

      expect(calc.raw(calc.eval())).to.eql(expected);
    });
  });
});
