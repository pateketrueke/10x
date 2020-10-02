import {
  EOF, EOL, TEXT, HEADING, BLOCKQUOTE, OL_ITEM, UL_ITEM, REF,
  OPEN, CLOSE, COMMA, BEGIN, DONE, CODE, START, FINISH,
  MINUS, PLUS, MUL, DIV, MOD,
  OR, DOT, PIPE, TUPLE, BLOCK, RANGE, SOME, EVERY,
  REGEX, SYMBOL, LITERAL, NUMBER, STRING,
  NOT, LIKE, EQUAL, NOT_EQ, EXACT_EQ,
  LESS, LESS_EQ, GREATER, GREATER_EQ,
  COMMENT, COMMENT_MULTI,
} from './symbols';

import {
  Token, split, quote, raise, format, deindent, isPlain, isDigit, isReadable, isAlphaNumeric,
} from '../helpers';

import Env from './env';
import Expr from './expr';

export default class Scanner {
  constructor(source, tokenInfo) {
    this.refs = {};
    this.chars = split(source);
    this.source = source;
    this.tokens = [];
    this.chunks = [];
    this.current = null;
    this.blank = '';
    this.offset = 0;
    this.start = 0;
    this.line = 0;
    this.col = 0;

    if (tokenInfo) {
      this.line = tokenInfo.line;
      this.col = tokenInfo.col;
    }
  }

  tokenInfo(clear) {
    if (!this.current) {
      this.current = { line: this.line, col: this.col };
    }

    if (clear) {
      const info = this.current;
      delete this.current;
      return info;
    }
  }

  append(value, tokenInfo) {
    if (this.chunks.length) {
      this.chunks.push(new Token(PLUS, '+', null, tokenInfo));
    }

    if (!Array.isArray(value)) {
      if (value.indexOf('#{') === -1) {
        this.chunks.push(new Token(STRING, value, null, { ...tokenInfo, kind: 'raw' }));
      } else {
        this.chunks.push(...new Scanner(quote(value), { line: 0, col: 3 }).scanTokens()[0].value);
      }
    } else {
      value.pop();
      this.chunks.push(new Token(OPEN, '#{', null, { ...value[0], kind: 'raw' }));
      this.chunks.push(...value);
      this.chunks.push(new Token(CLOSE, '}', null, { ...value[value.length - 1], kind: 'raw' }));
    }
  }

  appendText(char, depth) {
    if (this.blank.length) {
      const { line, col } = this.tokenInfo(true);

      let style;
      let level = 0;
      let kind = TEXT;

      if (char) {
        if (char === '#') {
          let i = 0;

          level++;

          for (; i < 4; i++) {
            if (this.blank.charAt(i) === '#') level++;
            else break;
          }

          // invalidate headings without white-space
          if (this.blank.charAt(i) !== ' ') {
            this.appendBuffer({ buffer: format(char + this.blank) }, line, col);
            return;
          }

          kind = HEADING;
          this.blank = this.blank.substr(level);
        } else if (char === '>') {
          kind = BLOCKQUOTE;
        } else if (isDigit(char)) kind = OL_ITEM;
        else kind = UL_ITEM;

        this.blank = this.blank.replace(/^\s+/, '');

        if (isDigit(char)) level = parseFloat(char);
        if (kind === OL_ITEM || kind === UL_ITEM) style = char;
      }

      const value = {
        buffer: format(this.blank),
      };

      if (level) value.level = level;
      if (style) value.style = style;
      if (depth) value.depth = depth;
      if (kind !== TEXT) value.kind = kind;

      this.appendBuffer(value, line, col);
    }
  }

  appendBuffer(value, line, col) {
    let offset = col;

    // extract links from buffers
    value.buffer = value.buffer.reduce((prev, cur) => {
      if (typeof cur === 'string' && cur.includes('[')) {
        const parts = cur.split(/(!?\[.+?\](?:\s*\[.*?\]|\(.+?\)))/g);

        parts.forEach(chunk => {
          if (chunk.indexOf(']') !== -1) {
            const matches = chunk.match(/\[(.+?)\](?:\s*\[(.*?)\]|\((.+?)\))/);
            const [href, title] = (matches[3] || matches[2]).split(/\s+/);

            const desc = title && title.charAt() === '"'
              ? title.substr(1, title.length - 2)
              : null;

            const alt = matches[1];

            prev.push(new Token(REF, {
              image: chunk.charAt() === '!',
              text: chunk,
              href: href || alt,
              cap: desc || null,
              alt: href ? alt : null,
            }, null, { line, col: offset }));
          } else {
            prev.push(chunk);
          }
          offset += chunk.length;
        });
      } else {
        if (Array.isArray(cur)) offset += cur[2].length;
        else offset += cur.length;
        prev.push(cur);
      }
      return prev;
    }, []);

    this.tokens.push(new Token(TEXT, value, null, { line, col }));
    this.blank = '';
  }

  scanTokens() {
    while (!this.isDone()) {
      this.start = this.offset;

      if (this.scanToken() === false) break;
    }

    if (!this.tokens.length) {
      raise('Missing input', this);
    }

    this.appendText();
    this.tokens.push(new Token(EOF, '', null));
    return this.tokens;
  }

  scanToken() {
    const char = this.getToken();

    if (typeof char !== 'string') return false;

    // reset cursor as soon non line-breaks are found!
    if (char !== '\n' && this.blank[this.blank.length - 1] === '\n') this.appendText();

    if (this.col === 1) {
      // extract link references, e.g. `[1]: ...`
      if (char === '[' && this.parseRef(this.col)) return;

      // extract markdown block-tags, e.g. `#...` OR `>...`, etc.
      if (char === '#' && this.parseBlock(char)) return;
      if (char === '>' && this.peek() === ' ' && this.parseBlock(char)) return;

      // prevent text-phrases to be parsed as tokens, e.g. `a b` OR `A, b`, etc.
      if ((isAlphaNumeric(char) || char === '*') && this.parseText(char)) return;

      // extract code-blocks, e.g. ````\n...\n````
      if (char === '`' && char === this.peek() && char === this.peekNext() && this.parseFence(char)) return;
    }

    // extract string-blocks, e.g. `"""\n...\n"""`
    if (char === '"' && char === this.peek() && char === this.peekNext() && this.parseFence(char)) return;

    // extract nested ordered list-items, e.g. `  1. ...`
    if (this.blank.length === this.col - 1 && isDigit(char)) {
      let chunk = char;

      // consume extra digits available...
      while (isDigit(this.peek())) chunk += this.getToken();

      // only parse if it followed the rules!
      if (this.peek() === '.' && this.peekNext() === ' ') {
        this.parseItem(chunk);
        return;
      }
    }

    // extract list-items, e.g. `- ...` OR `* ...`
    if (
      '-+*'.includes(char) && this.blank.length === this.col - 1
      && this.peekToken() === ' ' && this.parseItem(char)
    ) return;

    switch (char) {
      case '{': this.addToken(START); break;
      case '}': this.addToken(FINISH); break;
      case '(': this.addToken(OPEN); break;
      case ')': this.addToken(CLOSE); break;
      case ',': this.addToken(COMMA); break;
      case '[': this.addToken(BEGIN); break;
      case ']': this.addToken(DONE); break;

      case '.':
        if (this.isMatch('.')) {
          this.addToken(RANGE);
        } else if (isDigit(this.peekToken())) {
          this.parseNumber();
        } else {
          this.addToken(DOT);
        }
        break;

      case '-':
        if (this.isMatch('.') && isDigit(this.peekToken())) {
          this.parseNumber();
        } else if (this.isMatch('>')) {
          this.addToken(BLOCK);
        } else {
          this.addToken(MINUS);
        }
        break;

      case '+': this.addToken(PLUS); break;
      case '*': this.addToken(MUL); break;

      case '!': this.addToken(this.isMatch('=') ? NOT_EQ : NOT); break;
      case '=': this.addToken(this.isMatch('=') ? EXACT_EQ : EQUAL); break;

      case ';': this.addToken(EOL); break;
      case '%': this.addToken(MOD); break;
      case '~': this.addToken(LIKE); break;
      case '?': this.addToken(SOME); break;
      case '$': this.addToken(EVERY); break;

      case '|': this.addToken(this.isMatch('>') ? PIPE : OR); break;
      case '>': this.addToken(this.isMatch('=') ? GREATER_EQ : GREATER); break;

      case '<':
        if (isReadable(this.peekToken())) {
          this.parseMarkup();
        } else {
          this.addToken(this.isMatch('=') ? LESS_EQ : LESS);
        }
        break;

      case '/':
        if (this.isMatch('/')) {
          this.parseComment();
        } else if (this.isMatch('*')) {
          this.parseComment(true);
        } else if (this.peekToken() !== ' ') {
          this.parseRegex();
        } else {
          this.addToken(DIV);
        }
        break;

      case ' ':
      case '\r':
      case '\t':
        this.pushToken(char);
        break;

      case '\n':
        this.pushToken(char);
        this.col = 0;
        this.line++;
        break;

      case '"': this.parseString(); break;
      case ':': this.parseSymbol(); break;

      default:
        if (isDigit(char)) {
          this.parseNumber();
        } else if (isReadable(char)) {
          if (this.peek() === '.' && this.peekNext() === '.') {
            this.addToken(LITERAL);
          } else {
            this.parseIdentifier();
          }
        } else {
          this.col--;
          raise(`Unexpected ${char}`, this);
        }
        break;
    }
  }

  addToken(type, literal, tokenInfo) {
    const value = this.getCurrent();

    this.appendText();

    tokenInfo = {
      line: this.line,
      col: this.col - value.length,
      ...tokenInfo,
    };

    this.tokens.push(new Token(type, value, literal, tokenInfo));
  }

  nextToken(nth = 1) {
    this.tokenInfo();

    while (nth--) {
      if (this.chars[this.offset] !== '') {
        this.col++;
        this.offset++;
      }
    }
  }

  pushToken(...chars) {
    this.blank += chars.join('');
  }

  peekToken(offset = 0) {
    return this.chars[this.offset + offset];
  }

  getToken() {
    this.nextToken();

    return this.chars[this.offset - 1];
  }

  getCurrent(chunk) {
    if (chunk) {
      return this.source.substring(this.start, this.offset).substr(-chunk.length);
    }

    return this.source.substring(this.start, this.offset);
  }

  parseIdentifier() {
    while (isAlphaNumeric(this.peek())) this.nextToken();

    this.addToken(LITERAL);
  }

  parseNumber() {
    let value;

    while (isDigit(this.peek())) this.nextToken();

    if (this.peek() === '.' && isDigit(this.peekNext())) {
      this.nextToken();

      while (isDigit(this.peek())) this.nextToken();
    }

    // keep fractions together, e.g. `1/2`
    if (this.peek() === '/' && isDigit(this.peekNext())) {
      this.nextToken();
      while (isDigit(this.peek())) this.nextToken();

      const [left, right] = this.getCurrent().split('/');

      value = new Expr.Frac(parseFloat(left), parseFloat(right));
    }

    // expand possible units, e.g. `1m` OR `2 cm`
    if (this.peek() === ' ' || isReadable(this.peek())) {
      const num = value ? value.valueOf() : this.getCurrent();

      let i = this.offset + (this.peek() === ' ' ? 1 : 0);
      let kind = '';

      // consume valid chars only!
      for (let c = this.chars.length; i < c; i++) {
        if (!isReadable(this.chars[i])) break;
        kind += this.chars[i];
      }

      // look-up if given num/kind is maybe a unit?
      const retval = kind && Env.register(parseFloat(num), kind);

      if (isPlain(retval)) {
        this.offset = this.start = i;
        this.addToken(NUMBER, retval);
        return;
      }
    }

    this.addToken(NUMBER, value);
  }


  parseRef(col) {
    const offset = this.offset;
    const chunks = ['[', ''];

    this.blank = chunks[0];

    while (!this.isDone() && this.peek() !== '\n') {
      const char = this.getToken();

      this.pushToken(char);

      if (chunks.length >= 4) {
        if (!(
          chunks[0] === '['
          && chunks[2] === ']'
          && chunks[3] === ':'
        )) break;
      } else if (char !== ']' && (isAlphaNumeric(char) || char === ' ')) {
        chunks[chunks.length - 1] += char;
      } else {
        chunks.push(char);
      }
    }

    if (chunks[2] !== ']' || chunks[3] !== ':') {
      this.offset = offset;
      this.blank = '';
      this.col = col;
      return;
    }

    const matches = this.blank.match(/\[(.+?)\]:\s+(\S+)(?:\s+(\(.+?\)|".+?"|'.+?'|.+?))?/);
    const fixedHref = matches[2].charAt() === '<' && matches[2].substr(-1) === '>'
      ? matches[2].substr(1, matches[2].length - 2)
      : matches[2];

    this.refs[matches[1]] = {
      text: this.blank,
      href: fixedHref,
      alt: matches[3]
        ? matches[3].substr(1, matches[3].length - 2)
        : null,
    };

    this.blank = '';
    this.addToken(REF, this.refs[matches[1]], { kind: 'raw' });
    return true;
  }

  parseLine() {
    while (!this.isDone() && this.peek() !== '\n') this.pushToken(this.getToken());
  }

  parseBlock(char) {
    this.appendText();
    this.parseLine();
    this.appendText(char);
    return true;
  }

  parseFence(char) {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: 'multi' };

    this.appendText();
    this.nextToken(2);

    while (!this.isDone()) {
      const cur = this.getToken();

      if (cur === '\n') {
        this.col = -1;
        this.line++;
      }

      if (cur === char && this.peek() === char && this.peekNext() === char) break;
      this.pushToken(cur);
    }

    const chunk = this.blank;

    this.offset += 2;
    this.blank = '';

    if (char === '"') {
      this.subString(deindent(chunk), false, tokenInfo);
    } else {
      this.addToken(CODE, chunk, tokenInfo);
    }
    return true;
  }

  parseItem(char) {
    const depth = Math.floor(this.blank.length / 2);

    // eat until white-space is found...
    while (this.peek() !== ' ') this.nextToken();

    // clear-out current buffer!
    if (isDigit(char)) {
      this.blank = '';
    }

    this.parseLine();
    this.appendText(char, depth);
    return true;
  }

  parseText(char) {
    this.appendText();

    let i = this.offset;

    // validate input
    if ('*_'.includes(char)) {
      if (this.peek() === char) {
        char += this.getToken(++i);
      } else if (!isAlphaNumeric(this.peek())) return;
    } else {
      this.pushToken(char);
    }

    // consume first word, no-spaces, alpha-numeric, e.g. `abc...`
    for (let c = this.chars.length; i < c; i++) {
      if ('*_'.includes(char)) {
        if (this.chars[i] === char) break;
      } else if (char.length === 2) {
        if (char === this.chars[i] + this.chars[i + 1]) break;
      } else if (!isAlphaNumeric(this.chars[i], true)) break;

      // break on ordered list-items, e.g. `1. ...`
      if (this.chars[i] === '.' && isDigit(this.blank)) break;

      this.pushToken(this.chars[i]);
    }

    const token = this.chars[i];
    const nextToken = this.chars[i + 1];

    // break on numbers followed by words, e.g. `1 x ...`
    if (isDigit(this.blank) && token === ' ' && isAlphaNumeric(nextToken)) {
      this.blank = '';
      return;
    }

    // extract ordered list-items, e.g. `1. ...`
    if (isDigit(this.blank) && token === '.' && nextToken === ' ') {
      this.parseItem(this.blank);
      return true;
    }

    // extract formatting tags from current buffer, e.g. `_x_` OR `**x**`
    if ((char.length === 1 && char === token) || (char.length === 2 && char === token + nextToken)) {
      this.offset = this.start = i + char.length;
      this.blank = char + this.blank + char;
      this.appendText();
      this.parseLine();
      this.appendText();
      return true;
    }

    // consume words and embedded formatting, e.g. `abc...[:,.] def...` OR `foo*bar*`
    if (
      (isReadable(this.blank) && token === '*')
      || (nextToken === ' ' && ');:.,'.includes(token))
      || (token === ' ' && (nextToken === '*' || isAlphaNumeric(nextToken)))
    ) {
      this.pushToken(token, nextToken);
      this.offset = this.start = i + 2;

      this.parseLine();
      this.appendText();

      return true;
    }

    this.blank = '';
  }

  subString(chunk, isMarkup, tokenInfo) {
    if (chunk.indexOf('#{') === -1) {
      this.addToken(STRING, chunk, tokenInfo);
      return;
    }

    const info = { line: tokenInfo.line, col: tokenInfo.col + 1 };
    const input = split(chunk);
    const stack = [];

    let curInfo = { ...info };
    let buffer = '';
    let depth = 0;

    while (input.length) {
      const char = input.shift();

      // keep escaped quotes
      if (char === '\\' && input[0] === '"') {
        buffer += input.shift();
        info.col += 2;
        continue;
      }

      // open interpolation gate
      if (char === '#' && input[0] === '{') {
        if (!depth && buffer.length) {
          this.append(buffer, curInfo);
          buffer = '';
        }

        buffer += char + input.shift();
        info.col += 2;
        curInfo = { ...info };
        stack.push(OPEN);
        depth++;
        continue;
      }

      buffer += char;

      // close interpolation gate
      if (char === '}' && stack[stack.length - 1] === OPEN) {
        stack.pop();
        depth--;

        if (!depth) {
          buffer = buffer.substr(2, buffer.length - 3);

          // reset column-info for nested interpolation
          if (buffer.indexOf('#{') !== -1) {
            curInfo.col -= buffer.length - 5;
          }

          this.append(new Scanner(buffer, curInfo).scanTokens(), curInfo);
          buffer = '';
        }

        info.col++;
        continue;
      }

      // toggle quote-gates
      if (char === '"') {
        info.col++;
        if (stack[stack.length - 1] === BEGIN) {
          stack.pop();
          depth--;
        } else {
          stack.push(BEGIN);
          depth++;
        }
        continue;
      }

      if (char === '\n') {
        info.col = 0;
        info.line++;
      } else {
        info.col++;
      }
    }

    if (buffer.length) {
      curInfo.col += 2;
      this.append(buffer, curInfo);
    }

    if (isMarkup) {
      tokenInfo.kind = 'markup';
    }

    this.addToken(STRING, this.chunks, tokenInfo);
    this.chunks = [];
  }

  parseString() {
    const stack = [];
    const info = { line: this.line, col: this.col - 1 };

    while (!this.isDone()) {
      if (this.peek() === '\n') {
        this.col = -1;
        this.line++;
      }

      // keep strings within nested interpolation, e.g. `"foo#{bar + "baz"}"`
      if (this.peek() === '#' && this.peekNext() === '{') stack.push(OPEN);
      if (this.peek() === '}' && stack[stack.length - 1] === OPEN) stack.pop();

      // keep pairs of quotes safely from interpolation!
      if (stack.length && this.peek() === '"' && this.peekToken(-1) !== '\\') {
        if (stack[stack.length - 1] === BEGIN) stack.pop();
        else stack.push(BEGIN);
      }

      if (!stack.length && this.peek() === '"' && this.peekToken(-1) !== '\\') break;

      this.nextToken();
    }

    if (stack.length) {
      this.col -= stack[stack.length - 1] === OPEN ? 2 : 1;

      raise(`Expecting \`${stack[stack.length - 1] === OPEN ? '"' : '}'}\``, this);
    }

    if (this.isDone()) {
      raise('Unterminated string', this);
    }

    this.nextToken();
    this.subString(this.source.substring(this.start + 1, this.offset - 1), false, info);
  }

  parseMarkup() {
    const tokenInfo = { line: this.line, col: this.col - 1, kind: 'markup' };

    while (isAlphaNumeric(this.peek())) this.nextToken();

    const openTag = this.peekCurrent(4);
    const tagName = openTag.substr(1);
    const close = [tagName];

    let offset = 0;

    while (!this.isDone()) {
      if (this.peek() === '\n') {
        this.col = -1;
        this.line++;
      }

      const cur = this.peek();
      const old = this.peekToken(-1);
      const next = this.peekNext();
      const tag = `</${close[close.length - 1]}>`;

      if (cur === '/' && next === '>') {
        this.nextToken(2);
        close.pop();
      }

      if (offset && cur === '<' && isAlphaNumeric(next)) {
        let nextTag = '';
        let char;

        do {
          this.nextToken();
          char = this.peek();
          if (!isAlphaNumeric(char)) break;
          nextTag += char;
        } while (isAlphaNumeric(char));

        this.col -= 2;
        close.push(nextTag);
      }

      if (old === '>' && tag === this.getCurrent(tag)) close.pop();
      if (!close.length) break;
      this.nextToken();
      offset++;
    }

    this.subString(this.getCurrent(), true, tokenInfo);
  }

  parseRegex() {
    const prevToken = this.peekToken(-2);

    // skip math-expressions including literals, e.g. `x/y`
    if (prevToken && isAlphaNumeric(prevToken)) {
      this.addToken(DIV);
      return;
    }

    let flags = '';
    let pattern = '';
    let i = this.offset;

    for (let c = this.chars.length; i < c; i++) {
      const last = this.chars[i - 1];
      const cur = this.chars[i];

      if (flags) {
        if ('igmu'.includes(cur)) {
          flags += cur;
          continue;
        }

        if (isAlphaNumeric(cur)) {
          this.col = i;
          raise(`Unknown modifier \`${cur}\``, this);
        }
        --i;
        break;
      }

      // cancel on next slash, if not escaped, e.g. `/x/`
      if (cur === '/' && last !== '\\') {
        const next = this.chars[i + 1];

        if (next && isAlphaNumeric(next)) {
          if ('igmu'.includes(next)) {
            flags += this.chars[++i];
            continue;
          }

          this.col = ++i;
          raise(`Unknown modifier \`${next}\``, this);
        }
        break;
      }

      // break expression on white-space
      if (cur === ' ' || cur === '\n') {
        this.addToken(DIV);
        return;
      }

      pattern += cur;
    }

    this.offset = this.start = ++i;

    this.addToken(REGEX, new RegExp(pattern, flags));
  }

  parseSymbol() {
    while (!this.isDone()) {
      const cur = this.peek();

      if (cur === '/' || isAlphaNumeric(cur, true)) this.nextToken();
      else break;
    }

    this.addToken(SYMBOL);
  }

  parseComment(multiline) {
    if (multiline) {
      while (this.peek() !== '*' && this.peekNext() !== '/' && !this.isDone()) {
        if (this.peek() === '\n') {
          this.col = -1;
          this.line++;
        }

        this.nextToken();
      }

      if (this.isDone()) {
        raise('Unterminated comment', this);
      }

      this.nextToken(2);
      this.addToken(COMMENT_MULTI);
    } else {
      while (this.peek() !== '\n' && !this.isDone()) this.nextToken();

      this.addToken(COMMENT);
    }
  }

  isMatch(expected) {
    if (this.isDone()) return false;
    if (this.chars[this.offset] !== expected) return false;

    this.nextToken();

    return true;
  }

  isDone() {
    return this.offset >= this.chars.length;
  }

  peek() {
    if (this.isDone()) return '\0';

    return this.chars[this.offset];
  }

  peekNext() {
    if (this.offset + 1 >= this.chars.length) return '\0';

    return this.chars[this.offset + 1];
  }

  peekCurrent(offset) {
    const buffer = this.getCurrent();

    this.offset += buffer.length - offset;

    return buffer;
  }
}
