export function transform(tokens) {
  const chunks = [];

  let depth = 0;
  let inc = 0;

  // split tokens based on their complexity
  for (let i = 0; i < tokens.length; i += 1) {
    const subTree = chunks[inc] || (chunks[inc] = []);
    const token = tokens[i];

    if (token.score) {
      if (subTree.length && !subTree._fixed) {
        chunks[++inc] = [token];
        chunks[inc]._fixed = true;
      } else {
        subTree.push(token);
        subTree._fixed = true;
      }
    } else {
      subTree.push(token);
    }

    // split on new-lines
    if (token.cur === '\n' && !token.depth) {
      inc++;
    }
  }

  return chunks;
}

export function parseFrom(tokens) {
  const fixedChunks = transform(tokens);

  console.log(fixedChunks);
}
