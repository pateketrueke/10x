import { expect } from 'chai';
import { devtoolsEnabledByQuery } from '../src/runtime/devtools.js';

describe('Devtools', () => {
  it('should detect enabled query flag', () => {
    expect(devtoolsEnabledByQuery('?devtools')).to.eql(true);
    expect(devtoolsEnabledByQuery('?devtools=1')).to.eql(true);
    expect(devtoolsEnabledByQuery('?x=1&devtools=true')).to.eql(true);
  });

  it('should detect disabled query values', () => {
    expect(devtoolsEnabledByQuery('?devtools=0')).to.eql(false);
    expect(devtoolsEnabledByQuery('?devtools=false')).to.eql(false);
    expect(devtoolsEnabledByQuery('?devtools=off')).to.eql(false);
    expect(devtoolsEnabledByQuery('?foo=bar')).to.eql(false);
  });
});
