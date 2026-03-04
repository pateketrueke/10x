import { expect } from 'chai';
import { deindent } from '../src/lib/helpers';

import Scanner from '../src/lib/tree/scanner';

import {
  STRING, PLUS, OPEN, LITERAL, CLOSE, TEXT, EQUAL, REF, NUMBER,
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

  it('can scan emojis', () => {
    expect(getTokens('⚓')).to.eql(['⚓']);
    expect(getTokens('"⚓"')).to.eql(['⚓']);
  });

  it('can scan unicode', () => {
    expect(getTokens('"ÿ"')).to.eql(['ÿ']);
  });

  it('can scan literals', () => {
    expect(getTokens('in?')).to.eql(['in', '?']);
  });

  it('can scan numbers', () => {
    expect(getTokens('1')).to.eql(['1']);
    expect(getTokens('1.3')).to.eql(['1.3']);

    expect(getTokens('-0.3')).to.eql(['-', '0.3']);
  });

  it('can scan fractions', () => {
    expect(getTokens('1/2')).to.eql(['1/2']);
    expect(getTokens('1/ 2')).to.eql(['1', '/', ' ', '2']);
    expect(getTokens('1 / 2')).to.eql(['1', ' ', '/', ' ', '2']);
  });

  it('can scan symbols', () => {
    expect(getTokens('::foo')).to.eql([':', ':foo']);
    expect(getTokens(':1..2')).to.eql([':1..2']);
    expect(getTokens(':1/2')).to.eql([':1/2']);
    expect(getTokens(':foo')).to.eql([':foo']);
    expect(getTokens(':📦')).to.eql([':📦']);
  });

  it('can scan strings', () => {
    expect(getTokens('"4:20"')).to.eql(['4:20']);
    expect(getTokens('"foo\\"bar"')).to.eql(['foo\\"bar']);
    expect(getTokens('"foo\\n bar"')).to.eql(['foo\\n bar']);
  });

  it('can scan regexps', () => {
    expect(getTokens('/x/')).to.eql(['/x/']);
    expect(getTokens('/x/.\n')).to.eql(['/x/', '.', '\n']);
    expect(getTokens('/x\\/y/')).to.eql(['/x\\/y/']);
    expect(getTokens('/x\\/y/ig')).to.eql(['/x\\/y/gi']);
    expect(getTokens('/x/i.x(y)')).to.eql(['/x/i', '.', 'x', '(', 'y', ')']);
  });

  it('can scan markup', () => {
    expect(getTokens('<foo />')).to.eql(['<foo />']);
    expect(getTokens('a<a />a')).to.eql(['a', '<a />', 'a']);
    expect(getTokens('a<bar/>c')).to.eql(['a', '<bar/>', 'c']);
    expect(getTokens('a<bar />c')).to.eql(['a', '<bar />', 'c']);
    expect(getTokens('<baz>OK<buzz /></baz>')).to.eql(['<baz>OK<buzz /></baz>']);
    expect(getTokens('<foo><bar><baz>x</baz></bar></foo>')).to.eql(['<foo><bar><baz>x</baz></bar></foo>']);
    expect(getTokens('[<div><div><div>x</div></div></div>]')).to.eql(['[', '<div><div><div>x</div></div></div>', ']']);
  });

  it('can scan interpolation', () => {
    expect(getTokens('"foo#{bar/ 2+"BUZZ"}!!"')).to.eql(['foo', '+', '#{', 'bar', '/', ' ', '2', '+', 'BUZZ', '}', '+', '!!']);
    expect(getTokens('<foo>#{bar}</foo>')).to.eql(['<foo>', '+', '#{', 'bar', '}', '+', '</foo>']);
  });

  it('can scan comments', () => {
    expect(getTokens('// this\nis real')).to.eql(['// this', '\n', 'is real']);
    expect(getTokens('/* a \n multi-line \n comment */')).to.eql(['/* a \n multi-line \n comment */']);
  });

  it('can scan operators', () => {
    expect(getTokens('<= >= -> ! = ~ < | .. |> $ ? > != ==').filter(x => x !== ' ').length).to.eql(15);
  });

  it('can scan identifiers', () => {
    expect(getTokens("osoms\n isn't?")).to.eql(['osoms', '\n', ' ', "isn't", '?']);
  });

  it('can scan mixed expressions', () => {
    expect(getTokens('*!')).to.eql(['*', '!']);
    expect(getTokens('! 2 * (:3 / -"muffin🍺")')).to.eql([
      '!', ' ', '2', ' ', '*', ' ', '(', ':3', ' ', '/', ' ', '-', 'muffin🍺', ')',
    ]);
  });

  describe('Markdown', () => {
    it('can scan text blocks', () => {
      expect(getTokens('x')).to.eql(['x']);
      expect(getTokens('x y')).to.eql(['x y']);
      expect(getTokens('1, 2')).to.eql(['1, 2']);
      expect(getTokens('a) b')).to.eql(['a) b']);
      expect(getTokens('e.g. x')).to.eql(['e.g. x']);
    });

    it('can scan headings', () => {
      expect(getTokens('# OK')).to.eql(['OK']);
      expect(getTokens('## OK')).to.eql(['OK']);
      expect(getTokens('#NOT OK')).to.eql(['#NOT OK']);
      expect(getTokens('\n# OK\n')).to.eql(['\n', 'OK', '\n']);
      expect(getTokens(' #NOT OK')).to.eql([' ', '#NOT', ' ', 'OK']);
    });

    it('can scan blockquotes', () => {
      expect(getTokens('> OK')).to.eql(['OK']);
      expect(getTokens('>NOT OK')).to.eql(['>', 'NOT', ' ', 'OK']);
      expect(getTokens(' >NOT OK')).to.eql([' ', '>', 'NOT', ' ', 'OK']);
    });

    it('can scan ordered list-items', () => {
      expect(getTokens('1. osoms')).to.eql(['osoms']);
      expect(getTokens('11. osoms')).to.eql(['osoms']);
      expect(getTokens('111. osoms')).to.eql(['osoms']);
      expect(getTokens('  22. osoms')).to.eql(['osoms']);
      expect(getTokens('  222. osoms')).to.eql(['osoms']);
      expect(getTokens('\n111. osoms\n')).to.eql(['\n', 'osoms', '\n']);
    });

    it('can scan unordered list-items', () => {
      expect(getTokens('- osoms')).to.eql(['osoms']);
      expect(getTokens('  * osoms')).to.eql(['osoms']);
      expect(getTokens('    + osoms')).to.eql(['osoms']);
      expect(getTokens('\n  * osoms\n')).to.eql(['\n', 'osoms', '\n']);
    });

    it('can scan emphasis/bold tags', () => {
      expect(getTokens('*x* y')).to.eql(['x', ' y']);
      expect(getTokens('**x** y')).to.eql(['x', ' y']);
      expect(getTokens('foo*bar*buzz')).to.eql(['foo', 'bar', 'buzz']);
      expect(getTokens('foo**bar**buzz')).to.eql(['foo', 'bar', 'buzz']);
      expect(getTokens('*have fun* bro!')).to.eql(['have fun', ' bro!']);
      expect(getTokens('**have fun** bro!')).to.eql(['have fun', ' bro!']);
      expect(getTokens('OK *have fun* bro!')).to.eql(['OK ', 'have fun', ' bro!']);
      expect(getTokens('OK __have fun__ bro!')).to.eql(['OK ', 'have fun', ' bro!']);
      expect(getTokens('\nOK __have fun__ bro!\n')).to.eql(['\n', 'OK ', 'have fun', ' bro!', '\n']);
    });

    it('can scan inline-code tags', () => {
      expect(getTokens('`this is fun`')).to.eql(['this is fun']);
      expect(getTokens('``this `is` fun``')).to.eql(['this `is` fun']);
    });

    it('can scan code blocks', () => {
      expect(getTokens('```\nthis is fun\n```')).to.eql(['\nthis is fun\n']);
    });

    it('can scan markdown refs/links', () => {
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

      expect(out).to.eql([
        '[this reference] [1]',
        '[links](. "Home")',
        '![images](icon.gif)',
        '[Google][]',
      ]);

      expect(tokens[4].value.buffer[1]).to.eql({
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

      expect(scanner.refs).to.eql({
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
    it('should handle white-space', () => {
      expect(getTokens(' "x" y', true).slice(0, -1)).to.eql([
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

    it('should reject line-breaks in single-line strings', () => {
      expect(() => getTokens('"\nx\n"y', true)).to.throw('Unterminated string');
    });

    it('should handle markup-strings', () => {
      expect(getTokens('<a/>', true).slice(0, -1)).to.eql([{
        col: 0, line: 0, type: STRING, value: '<a/>', kind: 'markup',
      }]);
    });

    it('should handle block-strings', () => {
      expect(getTokens('"""x"""', true).slice(0, -1)).to.eql([{
        col: 0, line: 0, type: STRING, value: 'x', kind: 'multi',
      }]);

      expect(getTokens('"""\nx\n"""', true).slice(0, -1)).to.eql([{
        col: 0, line: 0, type: STRING, value: '\nx\n', kind: 'multi',
      }]);
    });

    it('should handle single interpolation', () => {
      expect(getTokens('"#{a}"', true).slice(0, -1)).to.eql([{
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

    it('should handle string + interpolation', () => {
      expect(getTokens('"x#{y}"', true).slice(0, -1)).to.eql([{
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

    it('should allow line-breaks inside interpolation blocks', () => {
      const [token] = getTokens('"#{x\n+ y}"', true);
      expect(token.type).to.eql(STRING);
    });

    it('should reject line-breaks before interpolation in single-line strings', () => {
      expect(() => getTokens('"a\nb#{x}c"', true)).to.throw('Unterminated string');
    });

    it('should extract interpolation tokens from markdown text buffers', () => {
      const [token] = getTokens('hello #{x+1}', true);

      expect(token.type).to.eql(TEXT);
      expect(token.value.buffer[0]).to.eql('hello ');
      expect(token.value.buffer.slice(1).map(part => [part.type, part.value])).to.eql([
        [OPEN, '#{'],
        [LITERAL, 'x'],
        [PLUS, '+'],
        [NUMBER, '1'],
        [CLOSE, '}'],
      ]);
    });
  });
});
