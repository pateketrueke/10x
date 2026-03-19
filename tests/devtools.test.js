import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { devtoolsEnabledByQuery } from '../src/runtime/devtools.js';

describe('Devtools', () => {
  test('should detect enabled query flag', () => {
    expect(devtoolsEnabledByQuery('?devtools')).toEqual(true);
    expect(devtoolsEnabledByQuery('?devtools=1')).toEqual(true);
    expect(devtoolsEnabledByQuery('?x=1&devtools=true')).toEqual(true);
  });

  test('should detect disabled query values', () => {
    expect(devtoolsEnabledByQuery('?devtools=0')).toEqual(false);
    expect(devtoolsEnabledByQuery('?devtools=false')).toEqual(false);
    expect(devtoolsEnabledByQuery('?devtools=off')).toEqual(false);
    expect(devtoolsEnabledByQuery('?foo=bar')).toEqual(false);
  });
});
