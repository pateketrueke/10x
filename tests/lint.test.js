/* eslint-disable no-undef */

function lintMarkdown(source) {
  const warnings = [];
  const lines = source.split('\n');
  let inFence = false;
  let fenceOpenLine = -1;
  let fenceChar = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!inFence && /^(`{3,}|"{3,})/.test(trimmed)) {
      inFence = true;
      fenceChar = trimmed[0];
      fenceOpenLine = i;
      if (!/^(`{3,}|"{3,})\w/.test(trimmed)) {
        warnings.push({ line: i, code: 'missing-lang-tag', message: 'Code block missing language tag — evaluator will skip it' });
      }
      continue;
    }
    if (inFence && trimmed.startsWith(fenceChar.repeat(3))) {
      inFence = false;
      fenceOpenLine = -1;
      continue;
    }
    if (inFence) continue;

    if (/^---+$/.test(trimmed)) {
      warnings.push({ line: i, code: 'thematic-break', message: '`---` evaluates as subtraction in 10x — use `***` instead' });
    }

    if (i === 0 && trimmed === '---') {
      warnings.push({ line: i, code: 'frontmatter', message: 'Frontmatter `---` block is not supported — evaluates as subtraction' });
    }

    if (/^#{1,6}\s.+\.$/.test(trimmed) || /^[-*+]\s.+\.$/.test(trimmed)) {
      warnings.push({ line: i, code: 'trailing-dot', message: 'Trailing `.` on heading/list item may conflict with EOL token' });
    }
  }

  if (inFence) {
    warnings.push({ line: fenceOpenLine, code: 'unclosed-fence', message: 'Unclosed code fence' });
  }

  return warnings;
}

function fixMarkdown(source) {
  const lines = source.split('\n');
  let inFence = false;

  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (!inFence && /^(`{3,}|"{3,})/.test(trimmed)) {
      inFence = true;
      if (!/^(`{3,}|"{3,})\w/.test(trimmed)) {
        return line.replace(/^(`{3,}|"{3,})/, '$110x');
      }
    }
    if (inFence && /^(`{3,}|"{3,})$/.test(trimmed)) { inFence = false; }
    if (inFence) return line;

    if (/^---+$/.test(trimmed)) return line.replace(/^-+/, '***');

    if (/^#{1,6}\s.+\.$/.test(trimmed) || /^[-*+]\s.+\.$/.test(trimmed)) {
      return line.replace(/\.$/, '');
    }

    return line;
  }).join('\n');
}

describe('Lint Markdown', () => {
  describe('thematic-break', () => {
    test('warns on bare ---', () => {
      const warnings = lintMarkdown('---\ncode\n---');
      const thematic = warnings.filter(w => w.code === 'thematic-break');
      expect(thematic.length).toEqual(2);
    });

    test('fixes --- to ***', () => {
      const fixed = fixMarkdown('---\ncode\n---');
      expect(fixed).toEqual('***\ncode\n***');
    });
  });

  describe('missing-lang-tag', () => {
    test('warns on fence without lang', () => {
      const warnings = lintMarkdown('```\ncode\n```');
      const missing = warnings.filter(w => w.code === 'missing-lang-tag');
      expect(missing.length).toEqual(1);
    });

    test('does not warn on fence with lang', () => {
      const warnings = lintMarkdown('```js\ncode\n```');
      const missing = warnings.filter(w => w.code === 'missing-lang-tag');
      expect(missing.length).toEqual(0);
    });

    test('fixes missing lang to 10x', () => {
      const fixed = fixMarkdown('```\ncode\n```');
      expect(fixed).toEqual('```10x\ncode\n```');
    });
  });

  describe('trailing-dot', () => {
    test('warns on heading with trailing dot', () => {
      const warnings = lintMarkdown('# Hello.\n## World.');
      const trailing = warnings.filter(w => w.code === 'trailing-dot');
      expect(trailing.length).toEqual(2);
    });

    test('warns on list item with trailing dot', () => {
      const warnings = lintMarkdown('- Item.');
      const trailing = warnings.filter(w => w.code === 'trailing-dot');
      expect(trailing.length).toEqual(1);
    });

    test('fixes trailing dot on heading', () => {
      const fixed = fixMarkdown('# Hello.');
      expect(fixed).toEqual('# Hello');
    });
  });

  describe('frontmatter', () => {
    test('warns on frontmatter at start', () => {
      const warnings = lintMarkdown('---\ntitle: Test\n---');
      const frontmatter = warnings.filter(w => w.code === 'frontmatter');
      expect(frontmatter.length).toEqual(1);
    });

    test('does not warn on --- elsewhere', () => {
      const warnings = lintMarkdown('# Test\n---');
      const frontmatter = warnings.filter(w => w.code === 'frontmatter');
      expect(frontmatter.length).toEqual(0);
    });
  });

  describe('unclosed-fence', () => {
    test('warns on unclosed fence', () => {
      const warnings = lintMarkdown('```\ncode');
      const unclosed = warnings.filter(w => w.code === 'unclosed-fence');
      expect(unclosed.length).toEqual(1);
    });

    test('does not warn on closed fence', () => {
      const warnings = lintMarkdown('```\ncode\n```');
      const unclosed = warnings.filter(w => w.code === 'unclosed-fence');
      expect(unclosed.length).toEqual(0);
    });
  });

  describe('fixMarkdown', () => {
    test('handles multiple issues', () => {
      const input = `# Title.
---
\`\`\`
code
\`\`\`
- Item.`;
      const fixed = fixMarkdown(input);
      expect(fixed).toEqual(`# Title
***
\`\`\`10x
code
\`\`\`
- Item`);
    });

    test('does not modify normal code', () => {
      const input = `# Hello
\`\`\`js
x = 1
\`\`\``;
      const fixed = fixMarkdown(input);
      expect(fixed).toEqual(input);
    });
  });
});
