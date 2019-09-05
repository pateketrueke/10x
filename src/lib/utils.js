export const isInt = x => /^-?(?!0)\d+(\.\d+)?$/.test(x);
export const isArray = x => x instanceof Array;

export const pad = (nth, length) => `     ${nth}`.substr(-length);
export const repeat = (char, length) => Array.from({ length }).join(char);
export const flatten = x => x.reduce((p, c) => p.concat(isArray(c) ? flatten(c) : c), []);

export const deindent = (text, length) => {
  const tabs = ((text.match(/^\s+/m) || [])[0] || '').substr(1);

  return text.split('\n').map(x => repeat(' ', length || 0) + x.substr(tabs.length)).join('\n').trim();
};
