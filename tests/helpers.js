import { expect } from 'chai';

export async function failWith(input, message) {
  let error;

  try {
    await (typeof input === 'function' ? input() : input);
  } catch (e) {
    error = e;
  } finally {
    expect(error.message).to.contains(message);
  }
}
