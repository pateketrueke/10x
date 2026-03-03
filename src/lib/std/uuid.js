export function v4() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const hex = '0123456789abcdef';
  const chars = new Array(36);

  for (let i = 0; i < 36; i += 1) {
    chars[i] = hex[Math.floor(Math.random() * 16)];
  }

  // RFC4122-ish shape: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  chars[8] = '-';
  chars[13] = '-';
  chars[14] = '4';
  chars[18] = '-';
  chars[23] = '-';
  chars[19] = hex[8 + Math.floor(Math.random() * 4)];

  return chars.join('');
}

export default {
  v4,
};
