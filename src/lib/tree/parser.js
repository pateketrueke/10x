import Expr from './expr';
import Scanner from './scanner';

import {
  CONTROL_TYPES, OR, EOF, EOL, COMMA, BEGIN, OPEN, START, FINISH, CLOSE, DONE, PLUS, MINUS, MUL, BLOCK, TUPLE, STRING, LITERAL, SYMBOL, EQUAL, PIPE, SOME,
} from './symbols';

import {
  Token, check, raise, assert, hasBreaks, hasStatements, isStatement, isSpecial, isComment, isRange, isSlice, isComma, isNumber,
  isString, isSymbol, isLogic, isUnit, isSome, isOpen, isClose, isBegin, isStart, isDone, isTuple, isText, isCode,
  isRef, isLiteral, isList, isBlock, isEqual, isMath, isNot, isFinish, isEnd, isEOF, isEOL,
} from '../helpers';

export default class Parser {
  constructor(tokens, plain, ctx) {
    this.templates = (ctx && ctx.templates) || {};
    this.template = null;
    this.partial = [];
    this.raw = plain;

    this.tokens = tokens;
    this.current = null;
    this.buffer = [];

    this.offset = 0;
    this.depth = 0;
  }

  extension(stmts) {
    stmts.forEach(stmt => {
      const subTree = stmt.getBody();
      const expr = subTree.pop();

      let root = this.templates;
      let key;

      // trie for faster look-ups!
      while (subTree.length) {
        key = subTree.shift().valueOf();

        if (!root[key]) root[key] = {};
        if (subTree.length) root = root[key];
      }

      root[key] = expr.getArgs()[0].value;
    });
  }

  collection(token, curToken, nextToken) {
    if (
      // special values/terminators, e.g. `:off` OR `:1-2`
      isSpecial(token) || isSlice(token) || isEnd(curToken)

      // optional symbols
      || (isSome(curToken) && isEnd(nextToken))

      // skip mappings from callable-like values
      || (isOpen(curToken) && isClose(nextToken))

      // return immediate symbols, except those that are special, e.g. `:key :off`
      || (isSymbol(curToken) && !isSpecial(curToken))

      // terminate symbol if text is not allowed after! (most control structures are OK)
      || (isText(curToken) && !CONTROL_TYPES.includes(token.value))

      // terminate if next-token is an operator, but not within templates!
      || ((isMath(curToken) && !isSome(curToken) && curToken.type !== MINUS) && token.value !== ':template')
    ) {
      if (token.value === ':nil') return Expr.value(null, token);
      if (token.value === ':on') return Expr.value(true, token);
      if (token.value === ':off') return Expr.value(false, token);

      return Expr.symbol(token.value, isSome(curToken) || null, token);
    }

    const map = {};

    let optional;
    let stack = [[]];
    let key = token.value;

    while (!this.isDone() && !this.isEnd([OR, PIPE])) {
      const body = stack[stack.length - 1];
      const cur = this.next();

      if (!this.depth && isSymbol(cur)) {
        if (isSpecial(cur) || isSlice(cur)) {
          body.push(Expr.from(cur));
          continue;
        }

        this.appendTo(stack, key, map, token, optional);
        optional = false;
        key = cur.value;
        stack = [[]];
        continue;
      }

      if (!this.depth && isComma(cur)) {
        stack.push([]);
        continue;
      }

      // annotate fields as optional
      if (!body.length && isSome(cur)) {
        if (optional || isStatement(key)) {
          check(cur);
        }

        optional = true;
        continue;
      }

      if (!isText(cur)) {
        body.push(Expr.from(cur));
      }
    }

    this.appendTo(stack, key, map, token, optional);

    return Expr.map(map, token);
  }

  definition(token, isAnonymous) {
    let subTree;

    if (isAnonymous) {
      subTree = this.subTree(this.statement([OR, PIPE]));
    } else {
      subTree = this.expression();
    }

    const [head, ...body] = subTree;
    const node = {
      type: BLOCK,
      value: {},
    };

    // not assignment, restore given token
    if (head && head.type !== EQUAL) {
      body.unshift(head);
    }

    // bind if spread-operator if found!
    if (isLiteral(body[0]) && isTuple(body[1])) {
      const args = body[1].getArgs();

      if (args.some(x => isLiteral(x, '..'))) {
        node.value.args = node.value.args || [];
        node.value.args[isLiteral(args[0], '..') ? 'unshift' : 'push'](Expr.from(LITERAL, '..', token));
      }
    }

    if (body.length) node.value.body = body;
    if (!isAnonymous) node.value.name = token.value;

    // identify blocks without arguments...
    Object.defineProperty(node.value, 'plain', {
      value: isTuple(body[0]) && !body[0].hasArgs,
    });

    return node;
  }

  expression(keepHead) {
    const [head, ...tail] = this.statement();
    const body = this.subTree(keepHead ? [head].concat(tail) : tail);

    return body;
  }

  statement(endToken, raw) {
    while (!this.isDone() && !this.isEnd(endToken, raw)) this.push(raw);
    return this.pull();
  }

  isDone() {
    return isEOF(this.peek());
  }

  isEnd(endToken, raw) {
    const token = this.peek();

    // break on call-expressions
    if (isOpen(token) || isBegin(token)) this.depth++;
    if (isClose(token) || isDone(token)) this.depth--;
    if (isStart(token)) {
      this.offset++;
      this.depth++;
      return true;
    }

    if (isFinish(token) && this.depth === 1) {
      this.depth = 0;
      return true;
    }

    if (this.depth > 0) return false;

    // reset on negative offsets ;-)
    if (this.depth < 0) {
      this.depth = 0;
      return true;
    }

    return isEOL(token)
      || (endToken && endToken.includes(token.type))
      || (!raw && isText(token) && !hasBreaks(token));
  }

  has(token) {
    for (let i = this.offset, c = this.tokens.length; i < c; i++) {
      if (this.tokens[i].type === token) return true;
    }
    return false;
  }

  peek() {
    return this.tokens[this.offset];
  }

  blank() {
    return isText(this.peek()) && !hasBreaks(this.peek());
  }

  skip(raw) {
    this.current = this.peek();
    this.offset++;

    while (!this.isDone() && (!raw && this.blank())) this.offset++;
    return this;
  }

  prev() {
    return this.current || {};
  }

  next(raw) {
    return this.skip(raw).prev();
  }

  seek() {
    let inc = this.offset + 1;
    let token;

    do {
      token = this.tokens[inc++] || {};
    } while (isText(token) || isComma(token));

    return token;
  }

  leaf() {
    return this.subTree(this.statement([OR, SOME, COMMA, SYMBOL]), true);
  }

  pull() {
    return this.buffer.splice(0, this.buffer.length);
  }

  push(raw) {
    this.buffer.push(Expr.from(this.next(raw)));
  }

  parse() {
    let root = [];

    const tree = root;
    const stack = [];
    const offsets = [];

    function get() {
      let leaf = root;

      if (leaf instanceof Expr) {
        leaf = isTuple(leaf) ? leaf.value.args : leaf.valueOf();
      }

      return leaf;
    }

    // eat left-sided expressions
    function pop() {
      const leaf = get();
      const set = [];

      let count = leaf.length;

      while (count--) {
        const token = leaf[count];

        // split on any terminators!
        if (isEnd(token)) break;
        set.unshift(token);
      }

      leaf.length = ++count;
      return set;
    }

    // intercept push-call to append tokens as arguments
    function push(...token) {
      let target;

      if (root instanceof Expr) {
        if (isTuple(root) || isBlock(root)) {
          target = root.value.args || root.value.body;
        } else {
          target = root.value;
        }
      } else {
        target = root;
      }

      target.push(...token);
    }

    // iterate over all tokens...
    while (!this.isDone()) {
      const prev = this.prev();
      const token = this.next();
      const curToken = this.peek();
      const nextToken = this.seek();

      // always pass right tokenInfo aswell!
      const tokenInfo = token.tokenInfo || token;

      // collect pairs of symbols as tuples, but leave single and well-know symbols alone!
      if (isSymbol(token)) {
        const fixedToken = this.collection(tokenInfo, curToken, nextToken);

        // consume next-token if symbol was set as optional, e.g. `:test?`
        if (isSymbol(fixedToken) && fixedToken.isOptional) this.next();

        // load transformations for later
        if (
          this.raw !== false
          && fixedToken.value
          && fixedToken.value.template instanceof Expr.TemplateStatement
        ) {
          this.extension(fixedToken.value.template.value.body);

          if (isEOL(this.peek())) this.skip();
          continue;
        }

        push(fixedToken);
        continue;
      }

      if (isRange(token)) {
        // keep first/last-range argument for varargs, e.g. `fn(x,..)` OR `[..,x]`
        if (prev && [OPEN, BEGIN, COMMA].includes(prev.type) && [CLOSE, DONE, COMMA, TUPLE].includes(curToken.type)) {
          push(Expr.from(LITERAL, '..', tokenInfo));
          continue;
        }

        // otherwise, just group parts of range-expressions!
        push(Expr.range(pop(), this.leaf(), tokenInfo));
        continue;
      }

      // expand templates on the fly, char-by-char
      if (!this.template && this.templates[tokenInfo.value]) {
        this.template = this.templates[tokenInfo.value];

        // replace template calls in-place
        if (curToken.type === OPEN && this.template.body) {
          push(...Expr.mix(this.template, this.leaf(), []));
          this.template = null;
          continue;
        }

        if (this.template[curToken.value]) {
          this.partial = [tokenInfo];
          continue;
        }

        // allow single-char templates!
        if (!this.template.args) {
          this.template = null;
        }
      }

      // continue eating chars from templates,
      if (this.template && (this.template.args || this.template[tokenInfo.value])) {
        if (!this.template.args) {
          this.template = this.template[tokenInfo.value];
          this.partial.push(tokenInfo);
        }

        // then, expand definition...
        if (this.template.args) {
          const left = pop();
          const right = this.leaf();

          if (this.template.args.length === 1) {
            if (left.some(isLiteral) && right.length) {
              push(Expr.body([...left, ...Expr.mix(this.template, left, [])], tokenInfo), ...right);
            } else if (!left.length) {
              push(Expr.body([...Expr.mix(this.template, Expr.cut(right), []), ...right], tokenInfo));
            } else {
              push(Expr.body([...left, ...Expr.mix(this.template, left, [])], tokenInfo));
            }
          } else {
            push(Expr.body([...Expr.mix(this.template, left, right)], tokenInfo));
          }
          this.template = null;
        }
        continue;
      }

      // restore missed tokens from templates
      if (this.template) {
        this.partial.forEach(x => push(Expr.from(x)));
        this.template = null;
      }

      // handle regular definitions and function-shortcuts
      if (isLiteral(token)) {
        // parse local definitions, e.g. `x =`
        if (isEqual(curToken)) {
          if (!this.has(START)) {
            push(Expr.callable(this.definition(token), tokenInfo));
          } else {
            offsets.push(START);

            const args = Expr.args(this.expression());
            const body = this.statement();

            push(Expr.callable({
              type: BLOCK,
              value: {
                name: token.value,
                body: [Expr.callable({
                  type: BLOCK,
                  value: { args, body },
                }, tokenInfo)],
              }
            }, tokenInfo));
          }
          continue;
        }

        // parse local functions, e.g. `a ->` OR `n, m ->` OR `a { b }`
        if (
          ((isComma(curToken) || isBlock(curToken)) && this.has(BLOCK))
          || ((isComma(curToken) || isStart(curToken)) && this.has(FINISH))
        ) {
          const args = Expr.args([Expr.from(token)].concat(this.statement([BLOCK])));
          const body = this.expression(this.has(FINISH));

          // fix spread withih arguments
          args.forEach(x => {
            if (isRange(x)) x.type = LITERAL;

            assert(Array.isArray(x) ? x[0] : x, true, LITERAL);
          });

          // keeps the stack
          if (this.has(FINISH)) {
            offsets.push(START);
          }

          push(Expr.callable({
            type: BLOCK,
            value: { args, body },
          }, tokenInfo));
          continue;
        }
      }

      // validate functions after literals
      if (!isLiteral(token) && isBlock(curToken) && !(isOpen(token) || isComma(token))) {
        raise(`Expecting literal but found \`${token.value}\``, tokenInfo);
      }

      // mark functions to be cached, e.g. `fn!`
      if (isLiteral(token) && isNot(curToken)) {
        push(Expr.literal({ type: LITERAL, value: token.value, cached: true }, tokenInfo));
        this.next();
        continue;
      }

      // handle anonymous functions
      if (isBlock(token)) {
        push(Expr.callable(this.definition(token, true), tokenInfo));
        continue;
      }

      // group logical-expressions, two or more tokens!
      if (isOpen(prev) && isLogic(token) && !isClose(nextToken)) {
        this.depth++;
        push(Expr.expression({
          type: token.type,
          value: this.subTree(this.statement([CLOSE]), true),
        }, tokenInfo));
        continue;
      }

      if (isList(token)) {
        if (isOpen(token) || isBegin(token) || isStart(token)) {
          let leaf;

          // keep blocks from interpolation safe!
          if (token.value === '#{') {
            leaf = Expr.body([], tokenInfo);
          } else if (isOpen(token)) {
            leaf = Expr.tuple([], tokenInfo);
          } else if (isBegin(token)) {
            leaf = Expr.array([], tokenInfo);
          } else {
            leaf = Expr.block({ args: [] }, tokenInfo);
          }

          push(leaf);
          stack.push(root);
          offsets.push(token);
          root = leaf;
        } else {
          const start = offsets[offsets.length - 1];

          if (!start) {
            let fixedToken;
            if (isClose(token)) fixedToken = '(';
            if (isDone(token)) fixedToken = '[';
            if (isFinish(token)) fixedToken = '{';

            raise(`Expecting \`${fixedToken}\` before \`${token.value}\``, tokenInfo);
          }

          if (isOpen(start) && !isClose(token)) {
            raise(`Expecting \`)\` but found \`${token.value}\``, tokenInfo);
          }

          if (isBegin(start) && !isDone(token)) {
            raise(`Expecting \`]\` but found \`${token.value}\``, tokenInfo);
          }

          if (isStart(start) && !isFinish(token)) {
            raise(`Expecting \`}\` but found \`${token.value}\``, tokenInfo);
          }

          root = stack.pop() || root;
          offsets.pop();
        }
      } else if (!(isText(token) || isCode(token) || isRef(token))) {
        // parse within tokenized strings!
        if (isString(token) && Array.isArray(token.value)) {
          push(Expr.literal({ type: STRING, value: this.subTree(token.value, true) }, tokenInfo));
        } else {
          push(Expr.from(token));
        }
      }

      // additional transforms, if enabled
      if (isNumber(token) && !isUnit(token) && this.raw !== true) {
        // add two numbers, e.g. `1 2` => `1 + 2`
        if (isNumber(curToken)) push(Expr.from(PLUS, '+'));

        // multiply, e.g. `3(4)` => `3 * (4)` OR `3x` => `3 * x`
        if (
          (isLiteral(curToken) && (isMath(nextToken) || isLiteral(nextToken) || isEnd(nextToken) || isComment(nextToken)))
          || (isOpen(curToken) && !(isClose(nextToken) || isComment(nextToken)))
        ) push(Expr.from(MUL, '*'));
      }
    }

    if (offsets.length) {
      const lastToken = offsets[offsets.length - 1];
      const { value, line, col } = this.current.tokenInfo || this.current;

      let fixedToken;
      if (isOpen(lastToken)) fixedToken = ')';
      if (isBegin(lastToken)) fixedToken = ']';
      if (isStart(lastToken)) fixedToken = '}';

      raise(`Expecting \`${fixedToken}\``, { line, col: col + value.length });
    }

    return tree;
  }

  split() {
    const statements = [];

    let currentLine = 0;

    while (!this.isDone()) {
      const body = this.statement([EOL], true);
      const curToken = this.tokens[this.offset++];
      const lines = [];

      if (!isEOF(curToken)) {
        body.push(Expr.literal(curToken));
      }

      if (!currentLine) {
        lines.push(currentLine++);
      } else if (!isText(body[0]) || !hasBreaks(body[0])) {
        lines.push(currentLine - 1);
      }

      for (let i = 0, c = body.length; i < c; i++) {
        if (hasBreaks(body[i])) {
          let count = 0;

          if (isText(body[i])) {
            body[i].value.buffer.forEach(x => {
              count += x.split('\n').length - 1;
            });
          } else {
            count = body[i].value.split('\n').length - 1;
          }

          while (count--) lines.push(currentLine++);
        }
      }

      statements.push({ body, lines });

      if (!this.tokens[this.offset]) break;
    }

    return statements;
  }

  appendTo(set, name, target, tokenInfo, isOptional) {
    const prop = name.substr(1) + (isOptional ? '?' : '');

    if (!isStatement(name)) {
      if (hasStatements(target)) raise(`Unexpected \`:${prop}\` on statement`, tokenInfo);

      target[prop] = Expr.body([], tokenInfo);
    } else {
      target[prop] = Expr.stmt(name, [], tokenInfo);
    }

    let hasConditional = false;

    set.forEach(sub => {
      let body = this.subTree(sub, true);

      // reduce depth
      while (
        body.length === 1
        && isTuple(body[0])
        && !body[0].isCallable
        && !(body[0].getArg(0) && body[0].getArg(0).isExpression)
        && (
          [':import', ':export'].includes(name)
          || !(body[0].getArg(0) && body[0].getArg(0).isObject
        ))
      ) {
        body = body[0].getArgs();
      }

      const lastToken = sub[sub.length - 1];

      // validate and transform conditions and statements
      if (name === ':if' || (name === ':while' && !hasConditional)) {
        if (!isTuple(body[0])) {
          if (!isClose(lastToken)) {
            raise(`Missing block before \`${lastToken}\``, lastToken.tokenInfo);
          } else {
            raise(`Expecting statement after \`${lastToken}\``, lastToken.tokenInfo);
          }
        }

        if (name === ':while') hasConditional = true;
      }

      // append non-blocks
      if (isTuple(body[0]) || body.length > 1) {
        if (body.some(isTuple)) {
          target[prop].push(Expr.body(body, tokenInfo));
        } else {
          target[prop].push(Expr.stmt(body, { ...tokenInfo, kind: 'raw' }));
        }
      } else {
        target[prop].push(...body);
      }
    });
  }

  subTree(tokens, raw = false) {
    return new Parser(tokens.concat(new Token(EOF, '', null)), raw || this.raw, this).parse();
  }

  static getAST(source, rawCode, environment) {
    const scanner = new Scanner(source, null, environment);
    const tokens = scanner.scanTokens();

    // return plain tokens in raw-mode
    if (rawCode === null) return tokens;

    const parser = new Parser(tokens, rawCode, environment);

    // return tokens in split-mode
    if (rawCode) return parser.split();

    return parser.parse();
  }

  static sub(source, environment) {
    return Parser.getAST(`;${source}`, false, environment).slice(1);
  }
}
