import { webcrypto as crypto } from 'crypto';

export function v4() {
  return crypto.randomUUID();
}

export default {
  v4,
};
