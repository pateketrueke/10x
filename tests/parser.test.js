import { expect } from 'chai';
import { transform } from '../src/lib/parser';
import { getTokensFrom } from '../src/lib/lexer';
import { DEFAULT_MAPPINGS } from '../src/lib/convert';

const tree = (sample, customUnits) => {
  const units = { ...DEFAULT_MAPPINGS, ...customUnits };
  const context = { input: getTokensFrom(sample, units) };

  return transform(context, { units }).tree;
}

describe('Parser', () => {
  it('should produce fixed tokens from well-known units', () => {
    expect(tree('1 cm')).to.eql([[{ token: ['number', '1 cm', 'cm'] }]]);
  });

  it('should omit unknown units from produced tokens', () => {
    expect(tree('1 foo')).to.eql([[{ token: ['number', '1'] }]]);
  });

  it('should use custom units from produced tokens', () => {
    expect(tree('1 foo', { foo: 'x' })).to.eql([[{ token: ['number', '1 foo', 'x'] }]]);
  });
});
