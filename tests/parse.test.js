/* eslint-disable no-unused-expressions */

import { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from 'bun:test';

import Expr from '../src/lib/tree/expr';
import Env from '../src/lib/tree/env';
import Parser from '../src/lib/tree/parser';

import {
  LESS, EXACT_EQ, GREATER, GREATER_EQ, MINUS, SOME, EVERY, PLUS, MUL, DIV, DOT, OR, EQUAL,
  EOL, TEXT, CODE, BLOCKQUOTE, COMMA, STRING, OPEN, CLOSE, RANGE, REGEX, LITERAL, NUMBER,
} from '../src/lib/tree/symbols';

describe('Parser', () => {
  test('should allow to parse raw-statements', () => {
    const input = `1..3,
a,b.
(j+"""m
n""".
k).
x.

y _z_`;
    const ast = Parser.getAST(input, 'split');
    expect(ast).toHaveLength(4);
  });

  test('should keep text and white-space', () => {
    expect(Parser.getAST('1 ?')).toEqual([Expr.value(1), Expr.from(SOME)]);
  });

  test('should parse regex-expressions', () => {
    expect(Parser.getAST('/x/')).toEqual([Expr.from(REGEX, /x/)]);
  });

  test('should parse markup tags', () => {
    // #{name} in tag content is interpolated by parseTag (not the scanner)
    expect(Parser.getAST('<div class="box">Hello #{name}!</div>')).toEqual([
      Expr.tag({
        name: 'div',
        attrs: { class: 'box' },
        children: ['Hello ', { expr: 'name' }, '!'],
        selfClosing: false,
      }),
    ]);
  });

  test('should parse simple markup literal as tag value', () => {
    expect(Parser.getAST('<div class="box">Hi</div>')).toEqual([
      Expr.tag({
        name: 'div',
        attrs: { class: 'box' },
        children: ['Hi'],
        selfClosing: false,
      }),
    ]);
  });

  test('should parse tag expression attrs and children', () => {
    // #{expr} in content = interpolation; {expr} = plain text; attr={expr} unchanged
    expect(Parser.getAST('<div class={kind}>#{x+1}</div>')).toEqual([
      Expr.tag({
        name: 'div',
        attrs: {
          class: { expr: 'kind' },
        },
        children: [{ expr: 'x+1' }],
        selfClosing: false,
      }),
    ]);
  });

  test('should parse render directive expressions in tags', () => {
    expect(Parser.getAST('<div>#{@render view()}</div>')).toEqual([
      Expr.tag({
        name: 'div',
        attrs: {},
        children: [{ expr: 'view()' }],
        selfClosing: false,
      }),
    ]);
  });

  test('should parse spread props in tag attrs', () => {
    expect(Parser.getAST('<div {...props} class="ok" />')).toEqual([
      Expr.tag({
        name: 'div',
        attrs: { class: 'ok' },
        spreads: [{ expr: 'props' }],
        children: [],
        selfClosing: true,
      }),
    ]);
  });

  test('should parse self-closing void tags', () => {
    expect(Parser.getAST('<input type="text" />')).toEqual([
      Expr.tag({
        name: 'input',
        attrs: { type: 'text' },
        children: [],
        selfClosing: true,
      }),
    ]);
  });

  test('should parse markdown tags', () => {
    expect(Parser.getAST('> x `y`', 'split')[0].body).toEqual([
      Expr.from(TEXT, {
        buffer: ['x ', [CODE, '`', 'y']],
        kind: BLOCKQUOTE,
      }),
    ]);

    const parsed = Parser.getAST('> x #{1+2}', 'split')[0].body[0];
    expect(parsed.type, TEXT);
    expect(parsed.value.kind, BLOCKQUOTE);
    expect(parsed.value.buffer[0], 'x ');
    expect(parsed.value.buffer.slice(1).map(part => [part.type, part.value])).toEqual([
      [OPEN, '#{'],
      [NUMBER, '1'],
      [PLUS, '+'],
      [NUMBER, '2'],
      [CLOSE, '}'],
    ]);
  });

  test('should parse heading namespaces', () => {
    expect(Parser.getAST('# Math::')).toEqual([
      Expr.map({
        namespace: Expr.stmt('@namespace', [Expr.value('Math'), Expr.value(1)]),
      }),
    ]);

    expect(Parser.getAST('# Math')).toEqual([]);
  });

  test('should parse markdown tables as table statements', () => {
    expect(Parser.getAST('| name | age |\n|---|---|\n| Alice | 30 |')).toEqual([
      Expr.map({
        table: Expr.stmt('@table', [Expr.value({
          headers: ['name', 'age'],
          rows: [['Alice', '30']],
        })]),
      }),
    ]);
  });

  test('should parse standalone markdown links as imports', () => {
    expect(Parser.getAST('[utils](./utils.md)')).toEqual([
      Expr.map({
        import: Expr.stmt('@import', [Expr.local('utils')]),
        from: Expr.stmt('@from', [Expr.value('./utils.md')]),
      }),
    ]);

    expect(Parser.getAST('[ops, @template](./ops.md)')).toEqual([
      Expr.map({
        import: Expr.stmt('@import', [Expr.local('ops')]),
        from: Expr.stmt('@from', [Expr.value('./ops.md')]),
        template: Expr.stmt('@template', [
          Expr.stmt([Expr.local('*')]),
        ]),
      }),
    ]);

    expect(Parser.getAST('[ops, @template >>](./ops.md)')).toEqual([
      Expr.map({
        import: Expr.stmt('@import', [Expr.local('ops')]),
        from: Expr.stmt('@from', [Expr.value('./ops.md')]),
        template: Expr.stmt('@template', [
          Expr.stmt([Expr.local('>>')]),
        ]),
      }),
    ]);
  });

  test('should keep @export @template declarations in AST without crashing', () => {
    expect(Parser.getAST('@export @template >>, +=.')).toEqual([
      Expr.map({
        export: Expr.stmt('@export', []),
        template: Expr.stmt('@template', [
          Expr.stmt([Expr.from(GREATER), Expr.from(GREATER)]),
          Expr.stmt([Expr.from(PLUS), Expr.from(EQUAL)]),
        ]),
      }),
      Expr.from(EOL),
    ]);
  });

  test('should sum consecutive numbers', () => {
    expect(Parser.getAST('.\n1 2 3')).toEqual([
      Expr.from(EOL),
      Expr.value(1),
      Expr.from(PLUS),
      Expr.value(2),
      Expr.from(PLUS),
      Expr.value(3),
    ]);
  });

  test('should multiply number groups', () => {
    expect(Parser.getAST('1(2)')).toEqual([
      Expr.value(1),
      Expr.from(MUL),
      Expr.group([Expr.value(2)]),
    ]);
  });

  test('should skip units by default', () => {
    const register = Env.register;

    try {
      Env.register = () => null;
      expect(Parser.getAST('1cm')).toEqual([Expr.value(1), Expr.from(MUL), Expr.local('cm')]);
    } finally {
      Env.register = register;
    }
  });

  test('should keep nested trees', () => {
    expect(Parser.getAST('(((x=(1.\n42))))')).toEqual([
      Expr.group([Expr.group([Expr.group([Expr.block({
        body: [Expr.group([Expr.value(1), Expr.from(EOL), Expr.value(42)])],
        name: 'x',
      })])])]),
    ]);
  });

  test('should allow simple AST-transformations', () => {
    expect(Parser.getAST(`
      @template ++ (a -> @let a = a + 1).
      a++, ++b
    `)).toEqual([
      Expr.group([
        Expr.local('a'),
        Expr.let([Expr.body([
          Expr.block({
            body: [Expr.local('a'), Expr.from(PLUS), Expr.value(1)],
            name: 'a',
          }),
        ])]),
      ]),
      Expr.from(COMMA),
      Expr.group([
        Expr.let([Expr.body([
          Expr.block({
            body: [Expr.local('b'), Expr.from(PLUS), Expr.value(1)],
            name: 'b',
          }),
        ])]),
        Expr.local('b'),
      ]),
    ]);

    expect(Parser.getAST(`
      @template += ((a b) -> @let a = a + b).
      x.i += (2 / 5)
    `)).toEqual([
      Expr.group([
        Expr.map({
          let: Expr.body([
            Expr.body([
              Expr.local('x'),
              Expr.from(DOT),
              Expr.block({
                body: [
                  Expr.local('x'),
                  Expr.from(DOT),
                  Expr.local('i'),
                  Expr.from(PLUS),
                  Expr.group([
                    Expr.value(2),
                    Expr.from(DIV),
                    Expr.value(5),
                  ]),
                ],
                name: 'i',
              }),
            ]),
          ]),
        }),
      ]),
    ]);

    expect(Parser.getAST(`
      @template
        ++! ((a b) -> [a, b]),
        ++? (a..b).

      1 ++! 2.
      1 +++ 2.
    `)).toEqual([
      Expr.group([Expr.array([Expr.value(1), Expr.from(COMMA), Expr.value(2)])]),
      Expr.from(EOL),
      Expr.value(1),
      Expr.from(PLUS),
      Expr.from(PLUS),
      Expr.from(PLUS),
      Expr.value(2),
      Expr.from(EOL),
    ]);
  });

  describe('BLOCK', () => {
    test('should parse noop-functions', () => {
      expect(Parser.getAST('->')).toEqual([Expr.block()]);
    });

    test('should parse functions with body', () => {
      expect(Parser.getAST('-> x')).toEqual([Expr.body([Expr.local('x')])]);
    });

    test('should parse range arguments', () => {
      expect(Parser.getAST('x(y,..)')).toEqual([
        Expr.local('x'),
        Expr.group([
          Expr.local('y'),
          Expr.from(COMMA),
          Expr.from(LITERAL, '..'),
        ]),
      ]);

      expect(Parser.getAST('x(..,y)')).toEqual([
        Expr.local('x'),
        Expr.group([
          Expr.from(LITERAL, '..'),
          Expr.from(COMMA),
          Expr.local('y'),
        ]),
      ]);
    });

    test('should parse nested arguments', () => {
      expect(Parser.getAST('x -> y -> z')).toEqual([Expr.block({
        args: [Expr.local('x')],
        body: [Expr.block({
          args: [Expr.local('y')],
          body: [Expr.local('z')],
        })],
      })]);
    });

    test('should parse multiple arguments', () => {
      expect(Parser.getAST('.\n(a b) -> a + b')).toEqual([
        Expr.from(EOL),
        Expr.block({
          args: [Expr.local('a'), Expr.local('b')],
          body: [Expr.local('a'), Expr.from(PLUS), Expr.local('b')],
        }),
      ]);
    });

    test('should parse named functions', () => {
      expect(Parser.getAST('f=->')).toEqual([Expr.block({
        body: [Expr.block()],
        name: 'f',
      })]);
    });

    test('should parse anonymous blocks', () => {
      expect(Parser.getAST('f(->)')).toEqual([
        Expr.local('f'),
        Expr.group([Expr.block()]),
      ]);
    });

    test('should parse function-calls', () => {
      expect(Parser.getAST('a()(1)()')).toEqual([
        Expr.local('a'),
        Expr.group([]),
        Expr.group([Expr.value(1)]),
        Expr.group([]),
      ]);
    });

    test('should parse function modifiers', () => {
      expect(Parser.getAST('def!')[0].cached).toBe(true);
    });

    test('should parse nested calls', () => {
      const args = [Expr.local('a'), Expr.local('b')];
      const body = [Expr.local('a'), Expr.from(PLUS), Expr.local('b')];

      const call = Expr.block({ args, body });
      const input = [Expr.value(5), Expr.from(COMMA), Expr.value(6)];

      expect(Parser.getAST('.\n(a b) -> a + b')).toEqual([Expr.from(EOL), call]);
      expect(Parser.getAST('((a b) -> a + b)')).toEqual([Expr.group([call])]);
      expect(Parser.getAST('((a b) -> a + b)(5, 6)')).toEqual([Expr.group([call]), Expr.group(input)]);
      expect(Parser.getAST('((a b) -> (a + b)(5, 6))')).toEqual([Expr.group([
        Expr.block({
          args,
          body: [
            Expr.group(body),
            Expr.group(input),
          ],
        }),
      ])]);
    });

    test('should parse logical operators', () => {
      expect(Parser.getAST('a|b')).toEqual([
        Expr.local('a'),
        Expr.from(OR),
        Expr.local('b'),
      ]);
    });

    test('should parse logical expressions', () => {
      expect(Parser.getAST('(< 1 2)')).toEqual([Expr.group([
        Expr.from(LESS, [Expr.value(1), Expr.value(2)]),
      ])]);

      expect(Parser.getAST('(? a b c)')).toEqual([Expr.group([
        Expr.from(SOME, [Expr.local('a'), Expr.local('b'), Expr.local('c')]),
      ])]);

      expect(Parser.getAST('($ x y z)')).toEqual([Expr.group([
        Expr.from(EVERY, [Expr.local('x'), Expr.local('y'), Expr.local('z')]),
      ])]);

      expect(Parser.getAST('(== 1 ((1 / 3) * 3))')).toEqual([Expr.group([
        Expr.from(EXACT_EQ, [Expr.value(1), Expr.group([
          Expr.group([Expr.value(1), Expr.from(DIV), Expr.value(3)]),
          Expr.from(MUL),
          Expr.value(3),
        ])]),
      ])]);
    });

    test('should parse maps as statements', () => {
      expect(Parser.getAST('@if (< n 2) 1, (< n 1) 0')).toEqual([
        Expr.map({
          if: Expr.stmt([
            Expr.block({
              body: [Expr.group([Expr.from(LESS, [Expr.local('n'), Expr.value(2)])]), Expr.value(1)],
            }),
            Expr.block({
              body: [Expr.group([Expr.from(LESS, [Expr.local('n'), Expr.value(1)])]), Expr.value(0)],
            }),
          ]),
        }),
      ]);
    });

    test('should parse assignments too', () => {
      expect(Parser.getAST('@let\n(a = 1)')).toEqual([Expr.map({
        let: Expr.group({
          body: [Expr.stmt([Expr.block({
            body: [Expr.value(1)],
            name: 'a',
          })])],
        }),
      })]);

      expect(Parser.getAST('@while (>= n-- 0)\ntemp = a')).toEqual([Expr.map({
        while: Expr.stmt([
          Expr.block({
            body: [
              Expr.group([Expr.from(GREATER_EQ, [Expr.local('n'), Expr.from(MINUS, '-'), Expr.from(MINUS, '-'), Expr.value(0)])]),
              Expr.block({ body: [Expr.local('a')], name: 'temp' }),
            ],
          }),
        ]),
      })]);
    });
  });

  describe('LITERAL', () => {
    test('should parse definitions as functions', () => {
      expect(Parser.getAST('a=1')).toEqual([Expr.block({ body: [Expr.value(1)], name: 'a' })]);
    });

    test('should parse multiple definitions', () => {
      expect(Parser.getAST('a=1.\nb=2')).toEqual([
        Expr.block({ body: [Expr.value(1)], name: 'a' }),
        Expr.from(EOL),
        Expr.block({ body: [Expr.value(2)], name: 'b' }),
      ]);
    });
  });

  describe('STRING', () => {
    test('should keep nested expressions within', () => {
      expect(Parser.getAST('"Is? #{is_divisible(3, 2)?"YES"|"NO"}!"')).toEqual([Expr.from(STRING, [
        Expr.value('Is? '),
        Expr.from(PLUS),
        Expr.body([
          Expr.local('is_divisible'),
          Expr.group({ args: [Expr.value(3), Expr.from(COMMA), Expr.value(2)] }),
          Expr.from(SOME),
          Expr.value('YES'),
          Expr.from(OR),
          Expr.value('NO'),
        ]),
        Expr.from(PLUS),
        Expr.value('!'),
      ])]);
    });

    test('should keep escaped quotes', () => {
      expect(Parser.getAST('"foo=\\"bar\\""')).toEqual([Expr.value('foo=\\"bar\\"')]);

      expect(Parser.getAST('"foo=\\"#{bar}\\""')).toEqual([Expr.from(STRING, [
        Expr.value('foo="'),
        Expr.from(PLUS),
        Expr.body([
          Expr.local('bar'),
        ]),
        Expr.from(PLUS),
        Expr.value('"'),
      ])]);
    });

    test('should parse interpolated strings', () => {
      expect(Parser.getAST('"x#{1+2}z"')).toEqual([Expr.from(STRING, [
        Expr.value('x'),
        Expr.from(PLUS),
        Expr.body([Expr.value(1), Expr.from(PLUS), Expr.value(2)]),
        Expr.from(PLUS),
        Expr.value('z'),
      ])]);

      expect(Parser.getAST('"x#{"y{}"}z"')).toEqual([Expr.from(STRING, [
        Expr.value('x'),
        Expr.from(PLUS),
        Expr.body([Expr.value('y{}')]),
        Expr.from(PLUS),
        Expr.value('z'),
      ])]);

      expect(Parser.getAST('"foo#{bar/2+"BUZZ"}!!"')).toEqual([Expr.from(STRING, [
        Expr.value('foo'),
        Expr.from(PLUS),
        Expr.body([Expr.local('bar'), Expr.from(DIV), Expr.value(2), Expr.from(PLUS), Expr.value('BUZZ')]),
        Expr.from(PLUS),
        Expr.value('!!'),
      ])]);

      expect(Parser.getAST('"foo#{bar/2+"BUZZ"+2}!!"')).toEqual([Expr.from(STRING, [
        Expr.value('foo'),
        Expr.from(PLUS),
        Expr.body([Expr.local('bar'), Expr.from(DIV), Expr.value(2), Expr.from(PLUS), Expr.value('BUZZ'), Expr.from(PLUS), Expr.value(2)]),
        Expr.from(PLUS),
        Expr.value('!!'),
      ])]);

      expect(Parser.getAST('"foo#{"bar"}"')).toEqual([Expr.from(STRING, [
        Expr.value('foo'),
        Expr.from(PLUS),
        Expr.body([Expr.value('bar')]),
      ])]);

      expect(Parser.getAST('"foo#{bar}buzz"')).toEqual([
        Expr.from(STRING, [Expr.value('foo'), Expr.from(PLUS), Expr.body([Expr.local('bar')]), Expr.from(PLUS), Expr.value('buzz')]),
      ]);

      expect(Parser.getAST('"foo#{bar}"')).toEqual([
        Expr.from(STRING, [Expr.value('foo'), Expr.from(PLUS), Expr.body([Expr.local('bar')])]),
      ]);

      expect(Parser.getAST('"#{bar}"')).toEqual([
        Expr.from(STRING, [Expr.body([Expr.local('bar')])]),
      ]);
    });
  });

  describe('SYMBOL', () => {
    test('should parse standalone symbols', () => {
      expect(Parser.getAST(':x')).toEqual([Expr.symbol(':x')]);
    });

    test('should parse lists of symbols', () => {
      expect(Parser.getAST(':x, :y')).toEqual([Expr.symbol(':x'), Expr.from(COMMA), Expr.symbol(':y')]);
    });
  });

  describe('RANGE', () => {
    test('should parse ranges', () => {
      expect(Parser.getAST('a..b')).toEqual([Expr.range([Expr.local('a')], [Expr.local('b')])]);
      expect(Parser.getAST('1..')).toEqual([Expr.range([Expr.value(1)], [])]);
    });

    test('should parse arrays', () => {
      expect(Parser.getAST('[1, 2], 3, [4, [5]]')).toEqual([
        Expr.array([
          Expr.value(1),
          Expr.from(COMMA),
          Expr.value(2),
        ]),
        Expr.from(COMMA),
        Expr.value(3),
        Expr.from(COMMA),
        Expr.array([
          Expr.value(4),
          Expr.from(COMMA),
          Expr.array([Expr.value(5)]),
        ]),
      ]);
    });
  });

  describe('MAP', () => {
    test('should use symbols to store single values', () => {
      expect(Parser.getAST(':key -1')).toEqual([
        Expr.map({
          key: Expr.body([Expr.body([Expr.from(MINUS), Expr.value(1)])]),
        }),
      ]);

      expect(Parser.getAST('(:key 42)')).toEqual([Expr.group([Expr.map({
        key: Expr.body([Expr.value(42)]),
      })])]);
    });

    test('should use symbols to store multiple values', () => {
      expect(Parser.getAST(':key x, y')).toEqual([Expr.map({
        key: Expr.body([Expr.local('x'), Expr.local('y')]),
      })]);
    });

    test('should use symbols to store multiple props/values', () => {
      expect(Parser.getAST(':key "value" :other :finish')).toEqual([
        Expr.map({
          key: Expr.body([Expr.value('value')]),
          other: Expr.body(),
          finish: Expr.body(),
        }),
      ]);

      expect(Parser.getAST('[:key "value" 42 :other :finish]')).toEqual([Expr.array([
        Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
          other: Expr.body(),
          finish: Expr.body(),
        }),
      ])]);
    });

    test('should store special symbols as values', () => {
      expect(Parser.getAST(':key :off')).toEqual([
        Expr.map({
          key: Expr.body([Expr.local(false)]),
        }),
      ]);
    });

    test('should break on consecutive symbols', () => {
      expect(Parser.getAST(':key :other 42')).toEqual([
        Expr.symbol(':key'),
        Expr.map({
          other: Expr.body([Expr.value(42)]),
        }),
      ]);
    });

    test('should keep maps within nested blocks', () => {
      expect(Parser.getAST(':key (:value 42)')).toEqual([
        Expr.map({
          key: Expr.body([Expr.body([
            Expr.group([Expr.map({
              value: Expr.body([Expr.value(42)]),
            })]),
          ])]),
        }),
      ]);
    });

    test('should parse lists, blocks and mappings', () => {
      expect(Parser.getAST('[(:key "value" 42) :other :finish]')).toEqual([Expr.array([
        Expr.group([Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
        })]),
        Expr.symbol(':other'),
        Expr.symbol(':finish'),
      ])]);

      expect(Parser.getAST('[:key "value" 42, :other, :finish]')).toEqual([Expr.array([
        Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
          other: Expr.body(),
          finish: Expr.body(),
        }),
      ])]);

      expect(Parser.getAST('[(:key "value" 42), :other, :finish]')).toEqual([Expr.array([
        Expr.group([Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
        })]),
        Expr.from(COMMA),
        Expr.symbol(':other'),
        Expr.from(COMMA),
        Expr.symbol(':finish'),
      ])]);

      expect(Parser.getAST('[(:key "value" 42), :other, :finish]')).toEqual([Expr.array([
        Expr.group([
          Expr.map({
            key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
          }),
        ]),
        Expr.from(COMMA),
        Expr.symbol(':other'),
        Expr.from(COMMA),
        Expr.symbol(':finish'),
      ])]);
    });
  });
});
