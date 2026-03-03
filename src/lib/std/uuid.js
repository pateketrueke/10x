export function v4() {
  const hex = '0123456789abcdef';
  const chars = new Array(36);

  for (let i = 0; i < 36; i += 1) {
    chars[i] = hex[(Math.random() * 16) | 0];
  }

  // RFC4122-ish shape: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  chars[8] = '-';
  chars[13] = '-';
  chars[14] = '4';
  chars[18] = '-';
  chars[23] = '-';
  chars[19] = hex[(((Math.random() * 16) | 0) & 0x3) | 0x8];

  return chars.join('');
}

export default {
  v4,
};
