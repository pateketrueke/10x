export const twice = n => n * 2;

export const wait = ms => new Promise(ok => setTimeout(ok, ms));
