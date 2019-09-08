import { readdirSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import { expect } from 'chai';
import Solv from '../src/lib';

const fixtures = readdirSync(`${__dirname}/fixtures`);

describe('Integration', () => {
  fixtures.forEach(file => {
    it(file.replace('.json', '.sv'), () => {
      const expected = JSON.parse(readFileSync(`${__dirname}/fixtures/${file}`).toString()).results;
      const filepath = `${__dirname}/examples/${file.replace('.json', '.sv')}`;
      const sample = readFileSync(filepath);
      const calc = new Solv({
        filepath,
        source: sample.toString(),
      });
      const results = calc.eval();

      expect(calc.error).to.be.null;
      expect(calc.raw(results)).to.eql(expected);
    });
  });
});
