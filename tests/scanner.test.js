import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';
import { deindent } from '../src/lib/helpers';

import Scanner from '../src/lib/tree/scanner';

import {
  STRING, PLUS, OPEN, LITERAL, CLOSE, TEXT, EQUAL, REF, NUMBER, EOL,
} from '../src/lib/tree/symbols';

describe('Scanner', () => {
  const getTokens = (source, raw) => {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    if (raw) return tokens;

    function join(values) {
      return values.reduce((p, c) => p.concat(Array.isArray(c) ? c[2] : c), []);
    }

    return tokens.reduce((prev, cur) => {
      if (Array.isArray(cur.value)) {
        prev.push(...cur.value.reduce((p, c) => {
          if (Array.isArray(c.value)) {
            p.push(...c.value.map(x => x.value));
          } else {
            p.push(...(c.type === TEXT ? join(c.value.buffer) : [c.value.toString()]));
          }
          return p;
        }, []));
      } else {
        prev.push(...(cur.type === TEXT ? join(cur.value.buffer) : [cur.value.toString()]));
      }
      return prev;
    }, []).slice(0, -1);
  };

  test('can scan emojis', () => {
    expect(getTokens('⚓')).toEqual(['⚓']);
    expect(getTokens('"⚓"')).toEqual(['⚓']);
  });

  test('can scan unicode', () => {
    expect(getTokens('"ÿ"')).toEqual(['ÿ']);
  });

  test('can scan literals', () => {
    expect(getTokens('in?')).toEqual(['in', '?']);
  });

  test('can scan numbers', () => {
    expect(getTokens('1')).toEqual(['1']);
    expect(getTokens('1.3')).toEqual(['1.3']);

    expect(getTokens('-0.3')).toEqual(['-', '0.3']);
  });

  test('can scan fractions', () => {
    expect(getTokens('1/2')).toEqual(['1/2']);
    expect(getTokens('1/ 2')).toEqual(['1', '/', ' ', '2']);
    expect(getTokens('1 / 2')).toEqual(['1', ' ', '/', ' ', '2']);
  });

  test('can scan symbols', () => {
    expect(getTokens('::foo')).toEqual([':', ':foo']);
    expect(getTokens(':1..2')).toEqual([':1..2']);
    expect(getTokens(':1/2')).toEqual([':1/2']);
    expect(getTokens(':foo')).toEqual([':foo']);
    expect(getTokens(':📦')).toEqual([':📦']);
  });

  test('can scan strings', () => {
    expect(getTokens('"4:20"')).toEqual(['4:20']);
    expect(getTokens('"foo\\"bar"')).toEqual(['foo\\"bar']);
    expect(getTokens('"foo\\n bar"')).toEqual(['foo\\n bar']);
  });

  test('can scan regexps', () => {
    expect(getTokens('/x/')).toEqual(['/x/']);
    expect(getTokens('/x/.\n')).toEqual(['/x/', '.', '\n']);
    expect(getTokens('/x\\/y/')).toEqual(['/x\\/y/']);
    expect(getTokens('/x\\/y/ig')).toEqual(['/x\\/y/gi']);
    expect(getTokens('/x/i.x(y)')).toEqual(['/x/i', '.', 'x', '(', 'y', ')']);
  });

  test('can scan markup', () => {
    expect(getTokens('<foo />')).toEqual(['<foo />']);
    expect(getTokens('a<a />a')).toEqual(['a', '<a />', 'a']);
    expect(getTokens('a<bar/>c')).toEqual(['a', '<bar/>', 'c']);
    expect(getTokens('a<bar />c')).toEqual(['a', '<bar />', 'c']);
    expect(getTokens('<baz>OK<buzz /></baz>')).toEqual(['<baz>OK<buzz /></baz>']);
    expect(getTokens('<foo><bar><baz>x</baz></bar></foo>')).toEqual(['<foo><bar><baz>x</baz></bar></foo>']);
    expect(getTokens('[<div><div><div>x</div></div></div>]')).toEqual(['[', '<div><div><div>x</div></div></div>', ']']);
  });

  test('can scan interpolation', () => {
    expect(getTokens('"foo#{bar/ 2+"BUZZ"}!!"')).toEqual(['foo', '+', '#{', 'bar', '/', ' ', '2', '+', 'BUZZ', '}', '+', '!!']);
    expect(getTokens('<foo>#{bar}</foo>')).toEqual(['<foo>', '+', '#{', 'bar', '}', '+', '</foo>']);
  });

  test('can scan comments', () => {
    expect(getTokens('// this\nis real')).toEqual(['// this', '\n', 'is real']);
    expect(getTokens('/* a \n multi-line \n comment */')).toEqual(['/* a \n multi-line \n comment */']);
  });

  test('can scan operators', () => {
    expect(getTokens('<= >= -> ! = ~ < | .. |> $ ? > != ==').filter(x => x !== ' ').length).toEqual(15);
  });

  test('can scan identifiers', () => {
    expect(getTokens("osoms\n isn't?")).toEqual(['osoms', '\n', ' ', "isn't", '?']);
  });

  test('can scan mixed expressions', () => {
    expect(getTokens('*!')).toEqual(['*', '!']);
    expect(getTokens('! 2 * (:3 / -"muffin🍺")')).toEqual([
      '!', ' ', '2', ' ', '*', ' ', '(', ':3', ' ', '/', ' ', '-', 'muffin🍺', ')',
    ]);
  });

  test.skip('treats trailing-space statement dots as EOL for unit literals', () => {
    const tokens = getTokens('2cm. ', true);
    const eolTokens = tokens.filter(token => token.type === EOL);
    expect(eolTokens).toHaveLength(1);
    expect(eolTokens[0].value, '.');
  });

  describe('Markdown', () => {
    test('can scan text blocks', () => {
      expect(getTokens('x')).toEqual(['x']);
      expect(getTokens('x y')).toEqual(['x y']);
      expect(getTokens('1, 2')).toEqual(['1, 2']);
      expect(getTokens('a) b')).toEqual(['a) b']);
      expect(getTokens('e.g. x')).toEqual(['e.g. x']);
    });

    test('can scan headings', () => {
      expect(getTokens('# OK')).toEqual(['OK']);
      expect(getTokens('## OK')).toEqual(['OK']);
      expect(getTokens('#NOT OK')).toEqual(['#NOT OK']);
      expect(getTokens('\n# OK\n')).toEqual(['\n', 'OK', '\n']);
      expect(getTokens(' #NOT OK')).toEqual([' ', '#NOT', ' ', 'OK']);
    });

    test('can scan blockquotes', () => {
      expect(getTokens('> OK')).toEqual(['OK']);
      expect(getTokens('>NOT OK')).toEqual(['>', 'NOT', ' ', 'OK']);
      expect(getTokens(' >NOT OK')).toEqual([' ', '>', 'NOT', ' ', 'OK']);
    });

    test('can scan ordered list-items', () => {
      expect(getTokens('1. osoms')).toEqual(['osoms']);
      expect(getTokens('11. osoms')).toEqual(['osoms']);
      expect(getTokens('111. osoms')).toEqual(['osoms']);
      expect(getTokens('  22. osoms')).toEqual(['osoms']);
      expect(getTokens('  222. osoms')).toEqual(['osoms']);
      expect(getTokens('\n111. osoms\n')).toEqual(['\n', 'osoms', '\n']);
    });

    test('can scan unordered list-items', () => {
      expect(getTokens('- osoms')).toEqual(['osoms']);
      expect(getTokens('  * osoms')).toEqual(['osoms']);
      expect(getTokens('    + osoms')).toEqual(['osoms']);
      expect(getTokens('\n  * osoms\n')).toEqual(['\n', 'osoms', '\n']);
    });

    test('can scan emphasis/bold tags', () => {
      expect(getTokens('*x* y')).toEqual(['x', ' y']);
      expect(getTokens('**x** y')).toEqual(['x', ' y']);
      expect(getTokens('foo*bar*buzz')).toEqual(['foo', 'bar', 'buzz']);
      expect(getTokens('foo**bar**buzz')).toEqual(['foo', 'bar', 'buzz']);
      expect(getTokens('*have fun* bro!')).toEqual(['have fun', ' bro!']);
      expect(getTokens('**have fun** bro!')).toEqual(['have fun', ' bro!']);
      expect(getTokens('OK *have fun* bro!')).toEqual(['OK ', 'have fun', ' bro!']);
      expect(getTokens('OK __have fun__ bro!')).toEqual(['OK ', 'have fun', ' bro!']);
      expect(getTokens('\nOK __have fun__ bro!\n')).toEqual(['\n', 'OK ', 'have fun', ' bro!', '\n']);
    });

    test('can scan inline-code tags', () => {
      expect(getTokens('`this is fun`')).toEqual(['this is fun']);
      expect(getTokens('``this `is` fun``')).toEqual(['this `is` fun']);
    });

    test('can scan code blocks', () => {
      expect(getTokens('```\nthis is fun\n```')).toEqual(['\nthis is fun\n']);
    });

    test('can scan markdown refs/links', () => {
      const source = deindent(`
        Please read the docs,
        see at [this reference] [1].

        Inline refs like [links](. "Home") and ![images](icon.gif) are allowed.

        Self-closing links are allowed too, e.g. [Google][]

        [1]: <https://soypache.co> "OK"
        [this reference]: https://google.com?q=42&y=z
      `);

      const scanner = new Scanner(source);
      const tokens = scanner.scanTokens();
      const out = tokens.reduce((p, c) => {
        if (c.value.buffer) {
          c.value.buffer.forEach(x => {
            if (x.type === REF) p.push(x.value.text);
          });
        }
        return p;
      }, []);

      expect(out, [
        '[this reference] [1]',
        '[links](. "Home")',
        '![images](icon.gif)',
        '[Google][]',
      ]);

      expect(tokens[4].value.buffer[1], {
        type: REF,
        value: {
          image: false,
          text: '[links](. "Home")',
          href: '.',
          alt: 'links',
          cap: 'Home',
        },
        line: 3,
        col: 18,
      });

      expect(scanner.refs, {
        1: {
          text: '[1]: <https://soypache.co> "OK"',
          href: 'https://soypache.co',
          alt: 'OK',
        },
        'this reference': {
          text: '[this reference]: https://google.com?q=42&y=z',
          href: 'https://google.com?q=42&y=z',
          alt: null,
        },
      });
    });
  });

  describe('tokenInfo', () => {
    test('should handle white-space', () => {
      expect(getTokens(' "x" y', true).slice(0, -1)).toEqual([
        {
          col: 0,
          line: 0,
          type: TEXT,
          value: {
            buffer: [' '],
          },
        },
        {
          col: 1, line: 0, type: STRING, value: 'x',
        },
        {
          col: 4,
          line: 0,
          type: TEXT,
          value: {
            buffer: [' '],
          },
        },
        {
          col: 5, line: 0, type: LITERAL, value: 'y',
        },
      ]);
    });

    test('should reject line-breaks in single-line strings', () => {
      expect(() => getTokens('"\nx\n"y', true)).toThrow('Unterminated string');
    });

    test('should handle markup-strings', () => {
      expect(getTokens('<a/>', true).slice(0, -1)).toEqual([{
        col: 0, line: 0, type: STRING, value: '<a/>', kind: 'markup',
      }]);
    });

    test('should handle block-strings', () => {
      expect(getTokens('"""x"""', true).slice(0, -1)).toEqual([{
        col: 0, line: 0, type: STRING, value: 'x', kind: 'multi',
      }]);

      expect(getTokens('"""\nx\n"""', true).slice(0, -1)).toEqual([{
        col: 0, line: 0, type: STRING, value: '\nx\n', kind: 'multi',
      }]);
    });

    test('should handle single interpolation', () => {
      expect(getTokens('"#{a}"', true).slice(0, -1)).toEqual([{
        col: 0,
        line: 0,
        type: STRING,
        value: [
          {
            col: 3, line: 0, type: OPEN, value: '#{', kind: 'raw',
          },
          {
            col: 3, line: 0, type: LITERAL, value: 'a',
          },
          {
            col: 3, line: 0, type: CLOSE, value: '}', kind: 'raw',
          },
        ],
      }]);
    });

    test('should handle string + interpolation', () => {
      expect(getTokens('"x#{y}"', true).slice(0, -1)).toEqual([{
        col: 0,
        line: 0,
        type: STRING,
        value: [
          {
            col: 1, line: 0, type: STRING, value: 'x', kind: 'raw',
          },
          {
            col: 4, line: 0, type: PLUS, value: '+',
          },
          {
            col: 4, line: 0, type: OPEN, value: '#{', kind: 'raw',
          },
          {
            col: 4, line: 0, type: LITERAL, value: 'y',
          },
          {
            col: 4, line: 0, type: CLOSE, value: '}', kind: 'raw',
          },
        ],
      }]);
    });

    test('should allow line-breaks inside interpolation blocks', () => {
      const [token] = getTokens('"#{x\n+ y}"', true);
      expect(token.type, STRING);
    });

    test('should reject line-breaks before interpolation in single-line strings', () => {
      expect(() => getTokens('"a\nb#{x}c"', true)).toThrow('Unterminated string');
    });

    test('should extract interpolation tokens from markdown text buffers', () => {
      const [token] = getTokens('hello #{x+1}', true);

      expect(token.type, TEXT);
      expect(token.value.buffer[0], 'hello ');
      expect(token.value.buffer.slice(1).map(part => [part.type, part.value])).toEqual([
        [OPEN, '#{'],
        [LITERAL, 'x'],
        [PLUS, '+'],
        [NUMBER, '1'],
        [CLOSE, '}'],
      ]);
    });
  });
});
