const CODES = {
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  redBright: [91, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  cyanBright: [96, 39],
  bgRedBright: [101, 49],
};

function style(open, close) {
  return value => `\x1b[${open}m${value}\x1b[${close}m`;
}

const ansi = {};
const names = Object.keys(CODES);

names.forEach(name => {
  const [open, close] = CODES[name];
  ansi[name] = style(open, close);
});

// Support two-level chaining like ansi.redBright.bold(value) and ansi.dim.gray(value)
names.forEach(first => {
  names.forEach(second => {
    ansi[first][second] = value => ansi[first](ansi[second](value));
  });
});

export default ansi;
