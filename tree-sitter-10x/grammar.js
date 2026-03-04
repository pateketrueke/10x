module.exports = grammar({
  name: 'tenx',

  extras: $ => [
    /[ \t\r]/,
    $.line_comment,
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => seq(
      choice(
        $.definition,
        $.directive,
        $.expression,
      ),
      optional('.'),
      optional('\n'),
    ),

    definition: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', choice($.lambda, $.directive, $.expression)),
    ),

    lambda: $ => prec.right(seq(
      field('params', choice($.identifier, $.param_list)),
      '->',
      field('body', choice($.directive, $.expression)),
    )),

    param_list: $ => seq(
      '(',
      optional(seq(
        $.identifier,
        repeat(seq(choice(',', /\s+/), $.identifier)),
      )),
      ')',
    ),

    directive: $ => prec.left(seq(
      field('name', $.directive_name),
      repeat1($.expression),
    )),

    directive_name: $ => token(prec(1, /@[A-Za-z_][A-Za-z0-9_-]*/)),

    expression: $ => choice(
      $.tag,
      $.collection,
      $.symbol,
      $.number,
      $.string,
      $.call,
      $.identifier,
      $.binary_expression,
      $.interpolation,
    ),

    call: $ => prec.left(seq(
      field('callee', $.identifier),
      field('args', $.arg_list),
    )),

    arg_list: $ => seq(
      '(',
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression)),
      )),
      ')',
    ),

    collection: $ => seq(
      '[',
      optional(seq(
        $.expression,
        repeat(seq(',', $.expression)),
      )),
      ']',
    ),

    binary_expression: $ => choice(
      prec.left(10, seq($.expression, choice('+', '-'), $.expression)),
      prec.left(11, seq($.expression, choice('*', '/', '%'), $.expression)),
      prec.left(8, seq($.expression, choice('<', '>', '<=', '>='), $.expression)),
      prec.left(7, seq($.expression, choice('|', '&'), $.expression)),
    ),

    interpolation: $ => seq(
      choice(
        seq('#{', $.expression, '}'),
        seq('{', $.expression, '}'),
      ),
    ),

    tag: $ => seq(
      '<',
      field('name', $.tag_name),
      repeat($.attribute),
      choice('/>', seq('>', repeat(choice($.tag, $.text_node, $.interpolation)), '</', $.tag_name, '>')),
    ),

    attribute: $ => seq(
      field('key', $.attribute_name),
      optional(seq('=', field('value', choice($.string, $.identifier, $.interpolation)))),
    ),

    tag_name: $ => token(/[A-Za-z][A-Za-z0-9:-]*/),
    attribute_name: $ => token(/[A-Za-z_:][A-Za-z0-9_:-]*/),
    text_node: $ => token(prec(-1, /[^<#{\n][^<#{]*/)),

    identifier: $ => token(/[A-Za-z_][A-Za-z0-9_]*/),
    symbol: $ => token(/:[A-Za-z_][A-Za-z0-9_-]*/),
    number: $ => token(/-?\d+(\.\d+)?/),
    string: $ => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),
    line_comment: $ => token(seq('//', /.*/)),
  },
});
