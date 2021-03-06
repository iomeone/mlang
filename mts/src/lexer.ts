import { Token, TokenType, Literal } from "./token";

const reservedWords = {
  def: TokenType.DEF,
  class: TokenType.CLASS,
  var: TokenType.VAR,
  extends: TokenType.EXTENDS,
  print: TokenType.PRINT,
  new: TokenType.NEW,
  if: TokenType.IF,
  else: TokenType.ELSE,
  for: TokenType.FOR,
  while: TokenType.WHILE,
  break: TokenType.BREAK,
  continue: TokenType.CONTINUE,
  return: TokenType.RETURN,
  and: TokenType.AND,
  or: TokenType.OR,
  null: TokenType.NULL,
  this: TokenType.THIS,
  super: TokenType.SUPER,
  true: TokenType.BOOLEAN,
  false: TokenType.BOOLEAN,
};

export class Lexer {
  source: string;
  current: number;
  runner: number;
  line: number;
  column: number;

  constructor(source: string) {
    this.source = source;
  }

  scan() {
    const tokens: Token[] = [];
    this.runner = 0;
    this.line = 1;
    this.column = 1;

    while (this.notAtEnd()) {
      this.current = this.runner;

      const token = this.scanToken();

      if (token) tokens.push(token);
    }

    tokens.push(
      new Token(TokenType.EOF, "", undefined, this.line, this.column),
    );

    return tokens;
  }

  scanToken() {
    const char = this.advance();

    switch (char) {
      case "{":
        return this.generateToken(TokenType.LEFT_BRACE);
      case "}":
        return this.generateToken(TokenType.RIGHT_BRACE);
      case "(":
        return this.generateToken(TokenType.LEFT_PAREN);
      case ")":
        return this.generateToken(TokenType.RIGHT_PAREN);
      case "[":
        return this.generateToken(TokenType.LEFT_BRACKET);
      case "]":
        return this.generateToken(TokenType.RIGHT_BRACKET);
      case ".":
        return this.generateToken(TokenType.DOT);
      case ";":
        return this.generateToken(TokenType.SEMICOLON);
      case ",":
        return this.generateToken(TokenType.COMMA);
      case ":":
        return this.generateToken(TokenType.COLON);

      case "/":
        if (this.match("/")) {
          return this.comment();
        } else {
          return this.generateToken(TokenType.SLASH);
        }
      case "*":
        if (this.match("*")) {
          return this.generateToken(TokenType.STAR_STAR);
        } else {
          return this.generateToken(TokenType.STAR);
        }
      case "+":
        if (this.match("+")) {
          return this.generateToken(TokenType.PLUS_PLUS);
        } else {
          return this.generateToken(TokenType.PLUS);
        }
      case "-":
        if (this.match("-")) {
          return this.generateToken(TokenType.MINUS_MINUS);
        } else {
          return this.generateToken(TokenType.MINUS);
        }
      case "=":
        if (this.match("=")) {
          return this.generateToken(TokenType.EQUAL_EQUAL);
        } else if (this.match(">")) {
          return this.generateToken(TokenType.ARROW);
        } else {
          return this.generateToken(TokenType.EQUAL);
        }
      case "!":
        if (this.match("=")) {
          return this.generateToken(TokenType.BANG_EQUAL);
        } else {
          return this.generateToken(TokenType.BANG);
        }
      case ">":
        if (this.match("=")) {
          return this.generateToken(TokenType.GREAT_THAN);
        } else {
          return this.generateToken(TokenType.GREAT);
        }
      case "<":
        if (this.match("=")) {
          return this.generateToken(TokenType.LESS_THAN);
        } else {
          return this.generateToken(TokenType.LESS);
        }

      case "\n":
        this.newline();
        return;

      case '"':
        return this.string();

      default:
        if (this.isDigit(char)) {
          return this.number();
        } else if (this.isAlpha(char)) {
          return this.identifier();
        } else if (/^\s$/.test(char)) {
          return;
        } else {
          throw new Error(`${this.line}: Unexpected character ${char}.`);
        }
    }
  }

  comment() {
    while (this.peek() !== "\n" && this.notAtEnd()) this.advance();
    this.newline();
    return this.generateToken(TokenType.COMMENT);
  }

  string() {
    while (this.peek() !== '"' && this.notAtEnd()) {
      if (this.peek() === "\n") this.newline();

      this.advance();
    }

    if (!this.notAtEnd()) {
      throw new Error(`${this.line}: Unterminated string.`);
    }

    this.advance();

    return this.generateToken(
      TokenType.STRING,
      this.getLexeme(this.current + 1, this.runner - 1),
    );
  }

  number() {
    this.moveCursor(-1);

    while (/^[0-9]$/.test(this.peek()) && this.notAtEnd()) this.advance();
    if (this.match(".")) {
      while (/[0-9]/.test(this.peek()) && this.notAtEnd()) this.advance();
    }

    return this.generateToken(TokenType.NUMBER, parseFloat(this.getLexeme()));
  }

  identifier() {
    while (/^\w$/.test(this.peek()) && this.notAtEnd()) this.advance();

    const lexeme = this.getLexeme();

    if (Object.keys(reservedWords).includes(lexeme)) {
      const word = reservedWords[lexeme];

      if (word === TokenType.BOOLEAN) {
        return this.generateToken(word, lexeme === "true");
      } else if (word === TokenType.NULL) {
        return this.generateToken(word, null);
      } else {
        return this.generateToken(word);
      }
    } else {
      return this.generateToken(TokenType.IDENTIFIER);
    }
  }

  generateToken(type: TokenType, literal?: Literal) {
    return new Token(
      type,
      this.getLexeme(),
      literal,
      this.line,
      this.column - (this.runner - this.current),
    );
  }

  getLexeme(start = this.current, end = this.runner) {
    return this.source.substring(start, end);
  }

  isDigit(char: string) {
    return /^[0-9]$/.test(char);
  }

  isAlpha(char: string) {
    return /^\w$/.test(char);
  }

  match(char: string) {
    if (this.peek() !== char) return false;

    this.moveCursor(1);
    return true;
  }

  newline() {
    this.line += 1;
    this.column = 1;
  }

  peek() {
    return this.source[this.runner];
  }

  advance() {
    return this.source[this.moveCursor(1)];
  }

  moveCursor(distance) {
    const current = this.runner;

    this.column += distance;
    this.runner += distance;
    return current;
  }

  notAtEnd() {
    return this.runner < this.source.length;
  }
}
