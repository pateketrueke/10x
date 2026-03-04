/* eslint-disable no-unused-expressions */

import { expect } from 'chai';

import Expr from '../src/lib/tree/expr';
import Env from '../src/lib/tree/env';
import Parser from '../src/lib/tree/parser';

import {
  LESS, EXACT_EQ, GREATER, GREATER_EQ, MINUS, SOME, EVERY, PLUS, MUL, DIV, DOT, OR, EQUAL,
  EOL, TEXT, CODE, BLOCKQUOTE, COMMA, STRING, OPEN, CLOSE, RANGE, REGEX, LITERAL, NUMBER,
} from '../src/lib/tree/symbols';

describe('Parser', () => {
  it('should allow to parse raw-statements', () => {
    expect(Parser.getAST('1..3,\na,b.\n(j+"m\nn".\n\nk).\nx.\n\ny _z_', 'split')).to.eql([
      {
        body: [
          Expr.value(1),
          Expr.from(RANGE),
          Expr.value(3),
          Expr.from(COMMA),
          Expr.from(TEXT, '\n'),
          Expr.local('a'),
          Expr.from(COMMA),
          Expr.local('b'),
          Expr.from(EOL),
        ],
        lines: [0, 1],
      },
      {
        body: [
          Expr.from(TEXT, '\n'),
          Expr.from(OPEN),
          Expr.local('j'),
          Expr.from(PLUS),
          Expr.value('m\nn'),
          Expr.from(EOL),
          Expr.from(TEXT, '\n\n'),
          Expr.local('k'),
          Expr.from(CLOSE),
          Expr.from(EOL),
        ],
        lines: [2, 3, 4, 5],
      },
      {
        body: [Expr.from(TEXT, '\n'), Expr.local('x'), Expr.from(EOL)],
        lines: [6],
      },
      {
        body: [Expr.from(TEXT, '\n\n'), Expr.text('y _z_')],
        lines: [7, 8],
      },
    ]);
  });

  it('should keep text and white-space', () => {
    expect(Parser.getAST('1 ?')).to.eql([Expr.value(1), Expr.from(SOME)]);
  });

  it('should parse regex-expressions', () => {
    expect(Parser.getAST('/x/')).to.eql([Expr.from(REGEX, /x/)]);
  });

  it('should parse markup tags', () => {
    expect(Parser.getAST(`
      <div (title) class="static #{dyn}">
        Hello #{name}!
      </div>
    `)).to.eql([Expr.from(STRING, [
      Expr.value('<div (title) class="static '),
      Expr.from(PLUS),
      Expr.body([Expr.local('dyn')]),
      Expr.from(PLUS),
      Expr.value('">\n        Hello '),
      Expr.from(PLUS),
      Expr.body([Expr.local('name')]),
      Expr.from(PLUS),
      Expr.value('!\n      </div>'),
    ])]);
  });

  it('should parse simple markup literal as tag value', () => {
    expect(Parser.getAST('<div class="box">Hi</div>')).to.eql([
      Expr.tag({
        name: 'div',
        attrs: { class: 'box' },
        children: ['Hi'],
        selfClosing: false,
      }),
    ]);
  });

  it('should parse tag expression attrs and children', () => {
    expect(Parser.getAST('<div class={kind}>{x+1}</div>')).to.eql([
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

  it('should parse render directive expressions in tags', () => {
    expect(Parser.getAST('<div>{@render view()}</div>')).to.eql([
      Expr.tag({
        name: 'div',
        attrs: {},
        children: [{ expr: 'view()' }],
        selfClosing: false,
      }),
    ]);
  });

  it('should parse spread props in tag attrs', () => {
    expect(Parser.getAST('<div {...props} class="ok" />')).to.eql([
      Expr.tag({
        name: 'div',
        attrs: { class: 'ok' },
        spreads: [{ expr: 'props' }],
        children: [],
        selfClosing: true,
      }),
    ]);
  });

  it('should parse markdown tags', () => {
    expect(Parser.getAST('> x `y`', 'split')[0].body).to.eql([
      Expr.from(TEXT, {
        buffer: ['x ', [CODE, '`', 'y']],
        kind: BLOCKQUOTE,
      }),
    ]);

    const parsed = Parser.getAST('> x #{1+2}', 'split')[0].body[0];
    expect(parsed.type).to.eql(TEXT);
    expect(parsed.value.kind).to.eql(BLOCKQUOTE);
    expect(parsed.value.buffer[0]).to.eql('x ');
    expect(parsed.value.buffer.slice(1).map(part => [part.type, part.value])).to.eql([
      [OPEN, '#{'],
      [NUMBER, '1'],
      [PLUS, '+'],
      [NUMBER, '2'],
      [CLOSE, '}'],
    ]);
  });

  it('should parse heading namespaces', () => {
    expect(Parser.getAST('# Math::')).to.eql([
      Expr.map({
        namespace: Expr.stmt('@namespace', [Expr.value('Math'), Expr.value(1)]),
      }),
    ]);

    expect(Parser.getAST('# Math')).to.eql([Expr.value('# Math')]);
  });

  it('should parse markdown tables as table statements', () => {
    expect(Parser.getAST('| name | age |\n|---|---|\n| Alice | 30 |')).to.eql([
      Expr.map({
        table: Expr.stmt('@table', [Expr.value({
          headers: ['name', 'age'],
          rows: [['Alice', '30']],
        })]),
      }),
    ]);
  });

  it('should parse standalone markdown links as imports', () => {
    expect(Parser.getAST('[utils](./utils.md)')).to.eql([
      Expr.map({
        import: Expr.stmt('@import', [Expr.local('utils')]),
        from: Expr.stmt('@from', [Expr.value('./utils.md')]),
      }),
    ]);

    expect(Parser.getAST('[ops, @template](./ops.md)')).to.eql([
      Expr.map({
        import: Expr.stmt('@import', [Expr.local('ops')]),
        from: Expr.stmt('@from', [Expr.value('./ops.md')]),
        template: Expr.stmt('@template', [
          Expr.stmt([Expr.local('*')]),
        ]),
      }),
    ]);

    expect(Parser.getAST('[ops, @template >>](./ops.md)')).to.eql([
      Expr.map({
        import: Expr.stmt('@import', [Expr.local('ops')]),
        from: Expr.stmt('@from', [Expr.value('./ops.md')]),
        template: Expr.stmt('@template', [
          Expr.stmt([Expr.local('>>')]),
        ]),
      }),
    ]);
  });

  it('should keep @export @template declarations in AST without crashing', () => {
    expect(Parser.getAST('@export @template >>, +=.')).to.eql([
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

  it('should sum consecutive numbers', () => {
    expect(Parser.getAST('.\n1 2 3')).to.eql([
      Expr.from(EOL),
      Expr.value(1),
      Expr.from(PLUS),
      Expr.value(2),
      Expr.from(PLUS),
      Expr.value(3),
    ]);
  });

  it('should multiply number groups', () => {
    expect(Parser.getAST('1(2)')).to.eql([
      Expr.value(1),
      Expr.from(MUL),
      Expr.group([Expr.value(2)]),
    ]);
  });

  it('should skip units by default', () => {
    const register = Env.register;

    try {
      Env.register = () => null;
      expect(Parser.getAST('1cm')).to.eql([Expr.value(1), Expr.from(MUL), Expr.local('cm')]);
    } finally {
      Env.register = register;
    }
  });

  it('should keep nested trees', () => {
    expect(Parser.getAST('(((x=(1.\n42))))')).to.eql([
      Expr.group([Expr.group([Expr.group([Expr.block({
        body: [Expr.group([Expr.value(1), Expr.from(EOL), Expr.value(42)])],
        name: 'x',
      })])])]),
    ]);
  });

  it('should allow simple AST-transformations', () => {
    expect(Parser.getAST(`
      @template ++ (a -> @let a = a + 1).
      a++, ++b
    `)).to.eql([
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
    `)).to.eql([
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
    `)).to.eql([
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
    it('should parse noop-functions', () => {
      expect(Parser.getAST('->')).to.eql([Expr.block()]);
    });

    it('should parse functions with body', () => {
      expect(Parser.getAST('-> x')).to.eql([Expr.body([Expr.local('x')])]);
    });

    it('should parse range arguments', () => {
      expect(Parser.getAST('x(y,..)')).to.eql([
        Expr.local('x'),
        Expr.group([
          Expr.local('y'),
          Expr.from(COMMA),
          Expr.from(LITERAL, '..'),
        ]),
      ]);

      expect(Parser.getAST('x(..,y)')).to.eql([
        Expr.local('x'),
        Expr.group([
          Expr.from(LITERAL, '..'),
          Expr.from(COMMA),
          Expr.local('y'),
        ]),
      ]);
    });

    it('should parse nested arguments', () => {
      expect(Parser.getAST('x -> y -> z')).to.eql([Expr.block({
        args: [Expr.local('x')],
        body: [Expr.block({
          args: [Expr.local('y')],
          body: [Expr.local('z')],
        })],
      })]);
    });

    it('should parse multiple arguments', () => {
      expect(Parser.getAST('.\n(a b) -> a + b')).to.eql([
        Expr.from(EOL),
        Expr.block({
          args: [Expr.local('a'), Expr.local('b')],
          body: [Expr.local('a'), Expr.from(PLUS), Expr.local('b')],
        }),
      ]);
    });

    it('should parse named functions', () => {
      expect(Parser.getAST('f=->')).to.eql([Expr.block({
        body: [Expr.block()],
        name: 'f',
      })]);
    });

    it('should parse anonymous blocks', () => {
      expect(Parser.getAST('f(->)')).to.eql([
        Expr.local('f'),
        Expr.group([Expr.block()]),
      ]);
    });

    it('should parse function-calls', () => {
      expect(Parser.getAST('a()(1)()')).to.eql([
        Expr.local('a'),
        Expr.group([]),
        Expr.group([Expr.value(1)]),
        Expr.group([]),
      ]);
    });

    it('should parse function modifiers', () => {
      expect(Parser.getAST('def!')[0].cached).to.be.true;
    });

    it('should parse nested calls', () => {
      const args = [Expr.local('a'), Expr.local('b')];
      const body = [Expr.local('a'), Expr.from(PLUS), Expr.local('b')];

      const call = Expr.block({ args, body });
      const input = [Expr.value(5), Expr.from(COMMA), Expr.value(6)];

      expect(Parser.getAST('.\n(a b) -> a + b')).to.eql([Expr.from(EOL), call]);
      expect(Parser.getAST('((a b) -> a + b)')).to.eql([Expr.group([call])]);
      expect(Parser.getAST('((a b) -> a + b)(5, 6)')).to.eql([Expr.group([call]), Expr.group(input)]);
      expect(Parser.getAST('((a b) -> (a + b)(5, 6))')).to.eql([Expr.group([
        Expr.block({
          args,
          body: [
            Expr.group(body),
            Expr.group(input),
          ],
        }),
      ])]);
    });

    it('should parse logical operators', () => {
      expect(Parser.getAST('a|b')).to.eql([
        Expr.local('a'),
        Expr.from(OR),
        Expr.local('b'),
      ]);
    });

    it('should parse logical expressions', () => {
      expect(Parser.getAST('(< 1 2)')).to.eql([Expr.group([
        Expr.from(LESS, [Expr.value(1), Expr.value(2)]),
      ])]);

      expect(Parser.getAST('(? a b c)')).to.eql([Expr.group([
        Expr.from(SOME, [Expr.local('a'), Expr.local('b'), Expr.local('c')]),
      ])]);

      expect(Parser.getAST('($ x y z)')).to.eql([Expr.group([
        Expr.from(EVERY, [Expr.local('x'), Expr.local('y'), Expr.local('z')]),
      ])]);

      expect(Parser.getAST('(== 1 ((1 / 3) * 3))')).to.eql([Expr.group([
        Expr.from(EXACT_EQ, [Expr.value(1), Expr.group([
          Expr.group([Expr.value(1), Expr.from(DIV), Expr.value(3)]),
          Expr.from(MUL),
          Expr.value(3),
        ])]),
      ])]);
    });

    it('should parse maps as statements', () => {
      expect(Parser.getAST('@if (< n 2) 1, (< n 1) 0')).to.eql([
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

    it('should parse assignments too', () => {
      expect(Parser.getAST('@let\n(a = 1)')).to.eql([Expr.map({
        let: Expr.group({
          body: [Expr.stmt([Expr.block({
            body: [Expr.value(1)],
            name: 'a',
          })])],
        }),
      })]);

      expect(Parser.getAST('@while (>= n-- 0)\ntemp = a')).to.eql([Expr.map({
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
    it('should parse definitions as functions', () => {
      expect(Parser.getAST('a=1')).to.eql([Expr.block({ body: [Expr.value(1)], name: 'a' })]);
    });

    it('should parse multiple definitions', () => {
      expect(Parser.getAST('a=1.\nb=2')).to.eql([
        Expr.block({ body: [Expr.value(1)], name: 'a' }),
        Expr.from(EOL),
        Expr.block({ body: [Expr.value(2)], name: 'b' }),
      ]);
    });
  });

  describe('STRING', () => {
    it('should keep nested expressions within', () => {
      expect(Parser.getAST('"Is? #{is_divisible(3, 2)?"YES"|"NO"}!"')).to.eql([Expr.from(STRING, [
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

    it('should keep escaped quotes', () => {
      expect(Parser.getAST('"foo=\\"bar\\""')).to.eql([Expr.value('foo=\\"bar\\"')]);

      expect(Parser.getAST('"foo=\\"#{bar}\\""')).to.eql([Expr.from(STRING, [
        Expr.value('foo="'),
        Expr.from(PLUS),
        Expr.body([
          Expr.local('bar'),
        ]),
        Expr.from(PLUS),
        Expr.value('"'),
      ])]);
    });

    it('should parse interpolated strings', () => {
      expect(Parser.getAST('"x#{1+2}z"')).to.eql([Expr.from(STRING, [
        Expr.value('x'),
        Expr.from(PLUS),
        Expr.body([Expr.value(1), Expr.from(PLUS), Expr.value(2)]),
        Expr.from(PLUS),
        Expr.value('z'),
      ])]);

      expect(Parser.getAST('"x#{"y{}"}z"')).to.eql([Expr.from(STRING, [
        Expr.value('x'),
        Expr.from(PLUS),
        Expr.body([Expr.value('y{}')]),
        Expr.from(PLUS),
        Expr.value('z'),
      ])]);

      expect(Parser.getAST('"foo#{bar/2+"BUZZ"}!!"')).to.eql([Expr.from(STRING, [
        Expr.value('foo'),
        Expr.from(PLUS),
        Expr.body([Expr.local('bar'), Expr.from(DIV), Expr.value(2), Expr.from(PLUS), Expr.value('BUZZ')]),
        Expr.from(PLUS),
        Expr.value('!!'),
      ])]);

      expect(Parser.getAST('"foo#{bar/2+"BUZZ"+2}!!"')).to.eql([Expr.from(STRING, [
        Expr.value('foo'),
        Expr.from(PLUS),
        Expr.body([Expr.local('bar'), Expr.from(DIV), Expr.value(2), Expr.from(PLUS), Expr.value('BUZZ'), Expr.from(PLUS), Expr.value(2)]),
        Expr.from(PLUS),
        Expr.value('!!'),
      ])]);

      expect(Parser.getAST('"foo#{"bar"}"')).to.eql([Expr.from(STRING, [
        Expr.value('foo'),
        Expr.from(PLUS),
        Expr.body([Expr.value('bar')]),
      ])]);

      expect(Parser.getAST('"foo#{bar}buzz"')).to.eql([
        Expr.from(STRING, [Expr.value('foo'), Expr.from(PLUS), Expr.body([Expr.local('bar')]), Expr.from(PLUS), Expr.value('buzz')]),
      ]);

      expect(Parser.getAST('"foo#{bar}"')).to.eql([
        Expr.from(STRING, [Expr.value('foo'), Expr.from(PLUS), Expr.body([Expr.local('bar')])]),
      ]);

      expect(Parser.getAST('"#{bar}"')).to.eql([
        Expr.from(STRING, [Expr.body([Expr.local('bar')])]),
      ]);
    });
  });

  describe('SYMBOL', () => {
    it('should parse standalone symbols', () => {
      expect(Parser.getAST(':x')).to.eql([Expr.symbol(':x')]);
    });

    it('should parse lists of symbols', () => {
      expect(Parser.getAST(':x, :y')).to.eql([Expr.symbol(':x'), Expr.from(COMMA), Expr.symbol(':y')]);
    });
  });

  describe('RANGE', () => {
    it('should parse ranges', () => {
      expect(Parser.getAST('a..b')).to.eql([Expr.range([Expr.local('a')], [Expr.local('b')])]);
      expect(Parser.getAST('1..')).to.eql([Expr.range([Expr.value(1)], [])]);
    });

    it('should parse arrays', () => {
      expect(Parser.getAST('[1, 2], 3, [4, [5]]')).to.eql([
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
    it('should use symbols to store single values', () => {
      expect(Parser.getAST(':key -1')).to.eql([
        Expr.map({
          key: Expr.body([Expr.body([Expr.from(MINUS), Expr.value(1)])]),
        }),
      ]);

      expect(Parser.getAST('(:key 42)')).to.eql([Expr.group([Expr.map({
        key: Expr.body([Expr.value(42)]),
      })])]);
    });

    it('should use symbols to store multiple values', () => {
      expect(Parser.getAST(':key x, y')).to.eql([Expr.map({
        key: Expr.body([Expr.local('x'), Expr.local('y')]),
      })]);
    });

    it('should use symbols to store multiple props/values', () => {
      expect(Parser.getAST(':key "value" :other :finish')).to.eql([
        Expr.map({
          key: Expr.body([Expr.value('value')]),
          other: Expr.body(),
          finish: Expr.body(),
        }),
      ]);

      expect(Parser.getAST('[:key "value" 42 :other :finish]')).to.eql([Expr.array([
        Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
          other: Expr.body(),
          finish: Expr.body(),
        }),
      ])]);
    });

    it('should store special symbols as values', () => {
      expect(Parser.getAST(':key :off')).to.eql([
        Expr.map({
          key: Expr.body([Expr.local(false)]),
        }),
      ]);
    });

    it('should break on consecutive symbols', () => {
      expect(Parser.getAST(':key :other 42')).to.eql([
        Expr.symbol(':key'),
        Expr.map({
          other: Expr.body([Expr.value(42)]),
        }),
      ]);
    });

    it('should keep maps within nested blocks', () => {
      expect(Parser.getAST(':key (:value 42)')).to.eql([
        Expr.map({
          key: Expr.body([Expr.body([
            Expr.group([Expr.map({
              value: Expr.body([Expr.value(42)]),
            })]),
          ])]),
        }),
      ]);
    });

    it('should parse lists, blocks and mappings', () => {
      expect(Parser.getAST('[(:key "value" 42) :other :finish]')).to.eql([Expr.array([
        Expr.group([Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
        })]),
        Expr.symbol(':other'),
        Expr.symbol(':finish'),
      ])]);

      expect(Parser.getAST('[:key "value" 42, :other, :finish]')).to.eql([Expr.array([
        Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
          other: Expr.body(),
          finish: Expr.body(),
        }),
      ])]);

      expect(Parser.getAST('[(:key "value" 42), :other, :finish]')).to.eql([Expr.array([
        Expr.group([Expr.map({
          key: Expr.body([Expr.body([Expr.value('value'), Expr.value(42)])]),
        })]),
        Expr.from(COMMA),
        Expr.symbol(':other'),
        Expr.from(COMMA),
        Expr.symbol(':finish'),
      ])]);

      expect(Parser.getAST('[(:key "value" 42), :other, :finish]')).to.eql([Expr.array([
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
