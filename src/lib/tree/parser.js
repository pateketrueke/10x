import Expr from './expr';
import Scanner from './scanner';
import { parseTag } from '../tag';

import {
  CONTROL_TYPES, OR, EOF, EOL, COMMA, BEGIN, OPEN, CLOSE, DONE, PLUS, MINUS, MUL, BLOCK, STRING, LITERAL, SYMBOL, EQUAL, PIPE, SOME, DOT, PEEK,
  HEADING, BLOCKQUOTE, UL_ITEM, OL_ITEM, TABLE, FAT_ARROW,
} from './symbols';

import {
  Token, check, raise, assert, hasBreaks, hasStatements, isStatement, isSpecial, isComment, isRange, isSlice, isComma, isNumber,
  isString, isSymbol, isDirective, isLogic, isUnit, isSome, isOpen, isClose, isBegin, isDone, isBlock, isText, isCode,
  isRef, isLiteral, isList, isEqual, isMath, isNot, isPeek, isEnd, isEOF, isEOL, quote, literal as tokenLiteral, isWhitespaceText,
} from '../helpers';

export default class Parser {
  constructor(tokens, plain, ctx) {
    this.templates = (ctx && ctx.templates) || {};
    this.template = null;
    this.partial = [];
    this.blockBodyDepth = 0;
    this.inBlockBody = false;
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

      if (!isBlock(expr) || !expr.hasArgs || !expr.getArg(0) || !expr.getArg(0).isCallable) {
        return;
      }

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

  parseRefImportSpec(alias) {
    const parts = String(alias || '')
      .split(',')
      .map(part => part.trim())
      .filter(Boolean);

    const imports = [];
    const templates = [];
    let includeAllTemplates = false;

    parts.forEach(part => {
      if (!part.startsWith('@template')) {
        imports.push(part);
        return;
      }

      const rest = part.slice('@template'.length).trim();

      if (!rest) {
        includeAllTemplates = true;
        return;
      }

      rest.split(/\s+/)
        .map(name => name.trim())
        .filter(Boolean)
        .forEach(name => templates.push(name));
    });

    return { imports, includeAllTemplates, templates };
  }

  collection(token, curToken, nextToken) {
    const isFirstClassMatch = isDirective(token)
      && token.value === '@match'
      && isOpen(curToken)
      && curToken.tokenInfo
      && curToken.tokenInfo.kind === 'brace';

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
      || (isText(curToken) && !(isDirective(token) && CONTROL_TYPES.includes(token.value)))

      // terminate if next-token is an operator, but not within templates!
      || ((isMath(curToken) && !isSome(curToken) && curToken.type !== MINUS) && token.value !== '@template')
    ) {
      if (token.value === ':nil') return Expr.value(null, token);
      if (token.value === ':on') return Expr.value(true, token);
      if (token.value === ':off') return Expr.value(false, token);

      if (isDirective(token)) {
        return Expr.stmt(token.value, [], token);
      }

      return Expr.symbol(token.value, isSome(curToken) || null, token);
    }

    const map = {};

    let optional;
    let stack = [[]];
    let key = token.value;

    // For @on, don't stop at PIPE (e.g., tasks = tasks |> push(...))
    const endTokens = key === '@on' ? [OR] : [OR, PIPE];

    while (!this.isDone() && !this.isEnd(endTokens)) {
      const body = stack[stack.length - 1];
      const cur = this.next();

      const keepElseBodyDirective = key === '@else'
        && !body.length
        && isDirective(cur)
        && ['@do', '@match', '@let'].includes(cur.value);

      if (!this.depth && (isSymbol(cur) || isDirective(cur)) && !keepElseBodyDirective) {
        if (isSpecial(cur) || isSlice(cur)) {
          body.push(Expr.from(cur));
          continue;
        }

        if (isDirective(cur) && this.blockBodyDepth > 0) {
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
        if (cur.type === FAT_ARROW) {
          this.blockBodyDepth++;
          this.inBlockBody = true;
        }
        if (isDirective(cur) && this.blockBodyDepth > 0) {
          const savedInBlockBody = this.inBlockBody;
          this.inBlockBody = false;
          body.push(Expr.from(cur));
          this.inBlockBody = savedInBlockBody;
        } else if (isString(cur) && cur.kind === 'markup' && typeof cur.value === 'string') {
          try {
            body.push(Expr.tag(parseTag(cur.value), cur.tokenInfo || cur));
          } catch (_) {
            body.push(Expr.from(cur));
          }
        } else {
          body.push(Expr.from(cur));
        }
      }
    }

    this.appendTo(stack, key, map, token, optional);

    if (isFirstClassMatch && map.match instanceof Expr.MatchStatement) {
      const [braceBody] = map.match.getBody();
      const cases = isBlock(braceBody) ? braceBody.getBody() : [];
      const input = Expr.local('$', token);

      return Expr.callable({
        type: BLOCK,
        value: {
          args: [input.clone()],
          body: [
            Expr.map({
              match: Expr.stmt('@match', [
                Expr.stmt([input].concat(cases), token),
              ], token),
            }, token),
          ],
        },
      }, token);
    }

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
    if (isLiteral(body[0]) && isBlock(body[1])) {
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
      value: isBlock(body[0]) && !body[0].hasArgs,
    });

    return node;
  }

  // Parse block-body callable: `Name [args...] => comma-chain.`
  // Args are any LITERAL tokens between the name and `=>`.
  // Body is comma-separated statements up to EOL; last statement is the return value.
  definitionBlock(token) {
    // consume any LITERAL args before `=>`
    const args = [];
    while (this.offset < this.tokens.length) {
      const cur = this.tokens[this.offset];
      if (!cur || cur.type === FAT_ARROW) break;
      if (isText(cur)) { this.offset++; continue; }
      if (isLiteral(cur)) {
        args.push(Expr.from(cur));
        this.offset++;
        continue;
      }
      break;
    }
    // consume the `=>` token
    if (this.tokens[this.offset] && this.tokens[this.offset].type === FAT_ARROW) this.offset++;

    // parse comma-chain body: each COMMA-separated segment is a statement
    const body = [];
    while (this.offset < this.tokens.length) {
      const cur = this.tokens[this.offset];
      if (!cur || isEOL(cur) || isEOF(cur)) break;
      if (isText(cur)) { this.offset++; continue; }
      if (isComma(cur)) { body.push(Expr.from(cur)); this.offset++; continue; }
      // parse one statement up to the next COMMA or EOL
      const stmt = this.subTree(this.statement([COMMA, EOL]));
      body.push(...stmt);
    }

    return {
      type: BLOCK,
      value: {
        name: token.value,
        args: args.length ? args : undefined,
        body,
        blockBody: true,
      },
    };
  }

  destructure(token) {
    const bindings = [{ name: token.value, rest: false }];
    let offset = this.offset;
    let hasRest = false;

    while (offset < this.tokens.length) {
      let cur = this.tokens[offset];

      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }

      if (!isComma(cur)) return null;

      offset++;
      cur = this.tokens[offset];

      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }

      const isRest = isRange(cur);

      if (isRest) {
        offset++;
        cur = this.tokens[offset];

        // support `...rest` in addition to `..rest`.
        if (cur && cur.type === DOT) {
          offset++;
          cur = this.tokens[offset];
        }
      }

      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }

      if (!isLiteral(cur)) return null;
      if (hasRest) raise('Rest binding must be last', cur);

      bindings.push({ name: cur.value, rest: isRest });
      hasRest = isRest;

      offset++;
      cur = this.tokens[offset];

      while (isText(cur)) {
        offset++;
        cur = this.tokens[offset];
      }

      if (isEqual(cur)) {
        return { bindings, offset };
      }

      if (!isComma(cur)) return null;
    }

    return null;
  }

  expression() {
    const [, ...tail] = this.statement();
    const body = this.subTree(tail);

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

    if (isOpen(token) || isBegin(token)) this.depth++;
    if (isClose(token) || isDone(token)) this.depth--;

    if (this.depth > 0) return false;

    if (this.depth < 0) {
      this.depth = 0;
      return true;
    }

    return isEOL(token)
      || (endToken && endToken.includes(token.type))
      || (!raw && isText(token) && !hasBreaks(token) && !isWhitespaceText(token));
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
    const token = this.peek();
    return isText(token) && !(token.value && token.value.kind) && !hasBreaks(token);
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
    return this.subTree(this.statement([OR, PIPE, SOME, COMMA, SYMBOL]), true);
  }

  nextSignificantIndex(offset = this.offset) {
    let idx = offset;
    while (idx < this.tokens.length && isText(this.tokens[idx])) idx++;
    return idx;
  }

  // Returns true if FAT_ARROW appears before any = or EOL/EOF from current offset.
  // Used to detect `Name arg1 arg2 => body` forms.
  peekFatArrow() {
    for (let i = this.offset; i < this.tokens.length; i++) {
      const t = this.tokens[i];
      if (!t) break;
      if (isText(t)) continue;
      if (t.type === FAT_ARROW) return true;
      if (isEOL(t) || isEOF(t)) return false;
      // stop if we hit = or -> (would be definition or lambda instead)
      if (isEqual(t) || t.type === BLOCK) return false;
    }
    return false;
  }

  tokenSourceText(token) {
    if (!token) return '';
    if (isText(token) && token.value && Array.isArray(token.value.buffer)) {
      return token.value.buffer.map(part => (typeof part === 'string' ? part : '')).join('');
    }
    if (token.type === STRING) {
      return `"${String(token.value || '')}"`;
    }
    return tokenLiteral(token);
  }

  parseAnnotation(token, tokenInfo) {
    const colon1 = this.nextSignificantIndex(this.offset);
    const first = this.tokens[colon1];
    if (!isSymbol(first) || first.value !== ':') return null;

    const colon2 = this.nextSignificantIndex(colon1 + 1);
    const second = this.tokens[colon2];
    if (!isSymbol(second) || second.value !== ':') return null;

    let i = colon2 + 1;
    const parts = [];

    while (i < this.tokens.length && !isEOL(this.tokens[i]) && !isEOF(this.tokens[i])) {
      parts.push(this.tokenSourceText(this.tokens[i]));
      i++;
    }

    const typeText = parts.join('').trim();
    if (!typeText) return null;

    this.offset = i;
    this.current = this.tokens[Math.min(i, this.tokens.length - 1)];

    return Expr.map({
      annot: Expr.stmt('@annot', [
        Expr.local(token.value, tokenInfo),
        Expr.value(typeText, tokenInfo),
      ], tokenInfo),
    }, tokenInfo);
  }

  pull() {
    return this.buffer.splice(0, this.buffer.length);
  }

  push(raw) {
    const token = this.next(raw);
    // Check if this is a markup token that should be parsed as a tag
    if (isString(token) && token.kind === 'markup' && typeof token.value === 'string') {
      try {
        this.buffer.push(Expr.tag(parseTag(token.value), token.tokenInfo || token));
        return;
      } catch (_) {
        // Fall through to default handling
      }
    }
    this.buffer.push(Expr.from(token));
  }

  parse() {
    let root = [];

    const tree = root;
    const stack = [];
    const offsets = [];

    function get() {
      let leaf = root;

      if (leaf instanceof Expr) {
        leaf = isBlock(leaf) ? leaf.value.args : leaf.valueOf();
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
        if (isBlock(root)) {
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
      if (isSymbol(token) || isDirective(token)) {
        const fixedToken = this.collection(tokenInfo, curToken, nextToken);

        // consume next-token if symbol was set as optional, e.g. `:test?`
        if (isSymbol(fixedToken) && fixedToken.isOptional) this.next();

        // load transformations for later
        if (
          this.raw !== false
          && fixedToken.value
          && Object.keys(fixedToken.value).length === 1
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
        if (prev && [OPEN, BEGIN, COMMA].includes(prev.type) && [CLOSE, DONE, COMMA, BLOCK].includes(curToken.type)) {
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
              push(Expr.group([...left, ...Expr.mix(this.template, left, [])], tokenInfo), ...right);
            } else if (!left.length) {
              push(Expr.group([...Expr.mix(this.template, Expr.cut(right), []), ...right], tokenInfo));
            } else {
              push(Expr.group([...left, ...Expr.mix(this.template, left, [])], tokenInfo));
            }
          } else {
            push(Expr.group([...Expr.mix(this.template, left, right)], tokenInfo));
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
        const annotation = this.parseAnnotation(token, tokenInfo);
        if (annotation) {
          push(annotation);
          continue;
        }

        if (isComma(curToken) && this.has(EQUAL)) {
          const parsed = this.destructure(tokenInfo);

          if (parsed) {
            this.offset = parsed.offset + 1;
            this.current = this.tokens[parsed.offset];

            const body = this.subTree(this.statement([OR, PIPE]));

            push(Expr.map({
              destructure: Expr.stmt('@destructure', [
                Expr.from(LITERAL, parsed.bindings, tokenInfo),
                Expr.stmt(body, { ...tokenInfo, kind: 'raw' }),
              ], tokenInfo),
            }, tokenInfo));
            continue;
          }
        }

        // parse local definitions, e.g. `x =`
        if (isEqual(curToken)) {
          push(Expr.callable(this.definition(token), tokenInfo));
          continue;
        }

        // parse block-body callables: `Name =>` or `Name arg =>` or `Name arg1 arg2 =>`
        if (curToken && (curToken.type === FAT_ARROW || (isLiteral(curToken) && this.peekFatArrow()))) {
          push(Expr.callable(this.definitionBlock(token), tokenInfo));
          continue;
        }

        // parse local single-arg functions, e.g. `a ->`
        if (isBlock(curToken) && this.has(BLOCK)) {
          const args = Expr.args([Expr.from(token)].concat(this.statement([BLOCK])));
          const body = this.expression();

          // fix spread withih arguments
          args.forEach(x => {
            if (isRange(x)) x.type = LITERAL;

            assert(Array.isArray(x) ? x[0] : x, true, LITERAL);
          });

          push(Expr.callable({
            type: BLOCK,
            value: { args, body },
          }, tokenInfo));
          continue;
        }
      }

      if (isRef(token) && token.isRaw && token.value && token.value.alt && token.value.href) {
        const spec = this.parseRefImportSpec(token.value.alt.trim());
        const importBody = spec.imports.map(name => Expr.local(name, tokenInfo));
        const map = {
          import: Expr.stmt('@import', importBody, tokenInfo),
          from: Expr.stmt('@from', [Expr.value(token.value.href.trim(), tokenInfo)], tokenInfo),
        };

        if (spec.includeAllTemplates || spec.templates.length) {
          const templateBody = [];

          if (spec.includeAllTemplates) {
            templateBody.push(Expr.stmt([Expr.local('*', tokenInfo)], tokenInfo));
          }

          spec.templates.forEach(name => {
            templateBody.push(Expr.stmt([Expr.local(name, tokenInfo)], tokenInfo));
          });

          map.template = Expr.stmt('@template', templateBody, tokenInfo);
        }

        push(Expr.map(map, tokenInfo));
        continue;
      }

      // validate functions after literals
      if (!isLiteral(token) && isBlock(curToken) && !(isOpen(token) || isClose(token) || isComma(token))) {
        raise(`Expecting literal but found \`${token.value}\``, tokenInfo);
      }

      // mark functions to be cached, e.g. `fn!`
      if (isLiteral(token) && isNot(curToken)) {
        push(Expr.literal({ type: LITERAL, value: token.value, cached: true }, tokenInfo));
        this.next();
        continue;
      }

      // handle $signal peek syntax, e.g. `$items` to get signal value without tracking
      if (isPeek(token) && isLiteral(curToken)) {
        this.next();
        push(Expr.expression({
          type: PEEK,
          value: [Expr.from(curToken)],
        }, tokenInfo));
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
        if (isOpen(token) || isBegin(token)) {
          let leaf;

          // keep blocks from interpolation safe!
          if (token.value === '#{') {
            leaf = Expr.body([], tokenInfo);
          } else {
            leaf = isOpen(token)
              ? Expr.block({ args: [] }, tokenInfo, true)
              : Expr.array([], tokenInfo);
          }

          push(leaf);
          stack.push(root);
          offsets.push(token);
          root = leaf;
        } else {
          const start = offsets[offsets.length - 1];

          if (!start) {
            raise(`Expecting \`${isClose(token) ? '(' : '['}\` before \`${token.value}\``, tokenInfo);
          }

          if (isOpen(start) && !isClose(token)) {
            raise(`Expecting \`)\` but found \`${token.value}\``, tokenInfo);
          }

          if (isBegin(start) && !isDone(token)) {
            raise(`Expecting \`]\` but found \`${token.value}\``, tokenInfo);
          }

          root = stack.pop();
          offsets.pop();

          // parse canonical multi-arg functions, e.g. `(a b) ->`
          if (isClose(token) && isBlock(curToken)) {
            const leaf = get();
            const group = leaf[leaf.length - 1];

            if (isBlock(group) && group.hasArgs) {
              let args = group.getArgs();

              // Normalize `(a b ..) ->` parsed as an open-ended range into varargs.
              if (
                args.length === 1
                && isRange(args[0])
                && args[0].value
                && Array.isArray(args[0].value.begin)
                && (!args[0].value.end || !args[0].value.end.length)
              ) {
                args = args[0].value.begin.concat([Expr.from(LITERAL, '..', args[0].tokenInfo || tokenInfo)]);
              }

              args = args.map(arg => {
                if (isRange(arg)) {
                  arg = arg.clone();
                  arg.type = LITERAL;
                }

                return arg;
              });

              if (args.length && args.every(arg => isLiteral(arg))) {
                this.next();
                const body = this.subTree(this.statement([OR, PIPE]));

                leaf[leaf.length - 1] = Expr.callable({
                  type: BLOCK,
                  value: {
                    args: Expr.args(args),
                    body,
                  },
                }, (args[0] && args[0].tokenInfo) || group.tokenInfo || curToken.tokenInfo || tokenInfo);
                continue;
              }
            }
          }
        }
      } else if (isText(token) && token.value.kind === TABLE) {
        const rows = [token];

        while (!this.isDone()) {
          const nextRow = this.peek();

          if (isText(nextRow) && nextRow.value.kind === TABLE) {
            rows.push(this.next(true));
            continue;
          }

          if (this.isBlankTextToken(nextRow)) {
            this.next(true);
            continue;
          }

          break;
        }

        const table = this.tableFromTokens(rows, tokenInfo);

        if (table) {
          push(table);
          if (!(isEnd(this.peek()) || isClose(this.peek()) || isDone(this.peek()))) {
            push(Expr.from(EOL, '.', tokenInfo));
          }
        } else {
          rows.forEach(row => {
            if (this.isTextConvertible(row)) {
              push(this.convertTextToString(row, tokenInfo));
            }
          });
        }
      } else if (isText(token) && token.value.kind === HEADING) {
        const namespace = this.namespaceFromHeading(token, tokenInfo);

        if (namespace) {
          push(namespace);
        } else if (this.hasInterpolation(token)) {
          push(this.convertTextToString(token, tokenInfo));
        }
      } else if (isText(token) && this.hasInterpolation(token)) {
        push(this.convertTextToString(token, tokenInfo));
      } else if (!(isText(token) || isCode(token) || isRef(token))) {
        // parse within tokenized strings!
        if (isString(token) && token.kind === 'markup' && typeof token.value === 'string') {
          try {
            push(Expr.tag(parseTag(token.value), tokenInfo));
          } catch (_) {
            push(Expr.from(token));
          }
        } else if (isString(token) && Array.isArray(token.value)) {
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

      raise(`Expecting \`${isOpen(lastToken) ? ')' : ']'}\``, { line, col: col + value.length });
    }

    return tree;
  }

  isTextConvertible(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer)) return false;
    return token.value.buffer.some(chunk => {
      if (typeof chunk === 'string') return chunk.trim().length > 0;
      if (Array.isArray(chunk)) return !!chunk[2];
      return true;
    });
  }

  hasInterpolation(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer)) return false;
    return token.value.buffer.some(chunk => {
      if (Array.isArray(chunk)) return !!chunk[2];
      if (typeof chunk === 'object' && chunk !== null) return chunk.kind !== 'raw';
      return false;
    });
  }

  isBlankTextToken(token) {
    if (!isText(token) || !token.value || !Array.isArray(token.value.buffer)) return false;
    return token.value.buffer.every(chunk => typeof chunk === 'string' && !chunk.trim().length);
  }

  textChunkToSource(chunk) {
    if (typeof chunk === 'string') return chunk;
    if (Array.isArray(chunk)) return `${chunk[1]}${chunk[2]}${chunk[1]}`;
    if (isRef(chunk)) return chunk.value.text;
    if (chunk && typeof chunk.value === 'string') return chunk.value;
    return '';
  }

  convertTextToString(token, tokenInfo) {
    const source = this.textPrefix(token.value) + token.value.buffer.map(chunk => this.textChunkToSource(chunk)).join('');
    const [subToken] = new Scanner(quote(source), tokenInfo).scanTokens();

    if (isString(subToken) && Array.isArray(subToken.value)) {
      return Expr.literal({ type: STRING, value: this.subTree(subToken.value, true) }, tokenInfo);
    }

    return Expr.from(subToken);
  }

  textPrefix(value) {
    if (!value || !value.kind) return '';
    if (value.kind === BLOCKQUOTE) return '> ';
    if (value.kind === HEADING) return `${Array.from({ length: value.level || 1 }).join('#')}# `;
    if (value.kind === OL_ITEM) return `${value.style || value.level || 1}. `;
    if (value.kind === UL_ITEM) return `${value.style || '-'} `;
    return '';
  }

  textTokenToSource(token) {
    if (!token || !token.value || !Array.isArray(token.value.buffer)) return '';
    return token.value.buffer.map(chunk => this.textChunkToSource(chunk)).join('');
  }

  namespaceFromHeading(token, tokenInfo) {
    if (!isText(token) || token.value.kind !== HEADING) return null;

    const source = this.textTokenToSource(token).trim();
    const matches = source.match(/^([A-Za-z_][A-Za-z0-9_]*)::$/);

    if (!matches) return null;

    return Expr.map({
      namespace: Expr.stmt('@namespace', [
        Expr.value(matches[1], tokenInfo),
        Expr.value(token.value.level || 1, tokenInfo),
      ], tokenInfo),
    }, tokenInfo);
  }

  tableFromTokens(rows, tokenInfo) {
    if (!rows || rows.length < 2) return null;

    const parseRow = token => {
      const source = this.textTokenToSource(token).trim();

      if (!source.startsWith('|') || !source.endsWith('|')) return null;

      return source
        .slice(1, -1)
        .split('|')
        .map(cell => cell.trim());
    };

    const header = parseRow(rows[0]);
    const separator = parseRow(rows[1]);

    if (!header || !separator || header.length !== separator.length) return null;
    if (!separator.every(cell => /^:?-{3,}:?$/.test(cell))) return null;

    const dataRows = rows.slice(2).map(parseRow);

    if (dataRows.some(row => !row || row.length !== header.length)) return null;

    return Expr.map({
      table: Expr.stmt('@table', [
        Expr.value({ headers: header, rows: dataRows }, tokenInfo),
      ], tokenInfo),
    }, tokenInfo);
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
        && isBlock(body[0])
        && body[0].tokenInfo.kind !== 'brace'
        && !body[0].isCallable
        && !(body[0].getArg(0) && body[0].getArg(0).isExpression)
        && (
          ['@import', '@export'].includes(name)
          || !(body[0].getArg(0) && body[0].getArg(0).isObject
        ))
      ) {
        body = body[0].getArgs();
      }

      const lastToken = sub[sub.length - 1];

      // validate and transform conditions and statements
      if (name === '@if' || (name === '@while' && !hasConditional)) {
        if (!isBlock(body[0])) {
          if (!isClose(lastToken)) {
            raise(`Missing block before \`${lastToken}\``, lastToken.tokenInfo);
          } else {
            raise(`Expecting statement after \`${lastToken}\``, lastToken.tokenInfo);
          }
        }

        if (name === '@while') hasConditional = true;
      }

      // append non-blocks
      if (isBlock(body[0]) || body.length > 1) {
        if (body.some(isBlock)) {
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

  static getAST(source, mode = 'parse', environment) {
    const scanner = new Scanner(source, null, environment);
    const tokens = scanner.scanTokens();

    // return plain tokens in raw mode
    if (mode === 'raw' || mode === null) return tokens;

    const parserMode = mode === 'parse' || typeof mode === 'undefined'
      ? undefined
      : (mode === 'inline' ? false : mode === 'split' || mode === true);

    const parser = new Parser(tokens, parserMode, environment);

    // return tokens in split mode
    if (mode === 'split') return parser.split();

    return parser.parse();
  }

  static sub(source, environment) {
    return Parser.getAST(`.\n${source}`, 'inline', environment).slice(1);
  }
}
