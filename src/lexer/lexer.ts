import {
  Token,
  ASSIGN,
  INT,
  SEMICOLON,
  LPAREN,
  LBRACE,
  RPAREN,
  COMMA,
  PLUS,
  RBRACE,
  EOF,
  ILLEGAL,
  TokenType,
  LookUpIdent,
  LT,
  GT,
  MINUS,
  BANG,
  SLASH,
  ASTERISK,
  EQ,
  NOT_EQ,
} from "./token";

export class Lexer {
  input: string;
  position: number; // current position in input (points to current char)
  readPosition: number; // current reading position in input (after current char)
  ch: string; //current character under examination

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = "";
    this.readChar();
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = String.fromCharCode(0);
    } else {
      this.ch = this.input[this.readPosition] as string;
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  nextToken(): Token {
    let tok: Token;
    this.skipWhiteSpace();

    switch (this.ch) {
      case "=":
        if (this.peekChar() === "=") {
          console.log("peeked");
          const ch = this.ch;
          this.readChar();
          tok = { Type: EQ, Literal: ch + this.ch };
        } else {
          tok = this.newToken(ASSIGN, this.ch);
        }
        break;
      case ";":
        tok = this.newToken(SEMICOLON, this.ch);
        break;
      case "(":
        tok = this.newToken(LPAREN, this.ch);
        break;
      case ")":
        tok = this.newToken(RPAREN, this.ch);
        break;
      case ",":
        tok = this.newToken(COMMA, this.ch);
        break;
      case "+":
        tok = this.newToken(PLUS, this.ch);
        break;
      case "{":
        tok = this.newToken(LBRACE, this.ch);
        break;
      case "}":
        tok = this.newToken(RBRACE, this.ch);
        break;
      case "-":
        tok = this.newToken(MINUS, this.ch);
        break;
      case "!":
        if (this.peekChar() == "=") {
          const ch = this.ch;
          this.readChar();
          tok = { Type: NOT_EQ, Literal: ch + this.ch };
        } else {
          tok = this.newToken(BANG, this.ch);
        }
        break;
      case "/":
        tok = this.newToken(SLASH, this.ch);
        break;
      case "*":
        tok = this.newToken(ASTERISK, this.ch);
        break;
      case "<":
        tok = this.newToken(LT, this.ch);
        break;
      case ">":
        tok = this.newToken(GT, this.ch);
        break;
      case "\x00":
        tok = { Literal: "", Type: EOF };
        break;
      default:
        if (this.isLetter(this.ch)) {
          const Literal = this.readIdentifier();
          const Type = LookUpIdent(Literal);
          tok = { Type, Literal };
          return tok;
        } else if (this.isDigit(this.ch)) {
          const type = INT;
          const literal = this.readNumber();
          tok = { Type: type, Literal: literal };
          return tok;
        } else {
          console.log("illlegal being hit");
          tok = this.newToken(ILLEGAL, this.ch);
        }

        break;
    }

    this.readChar();

    if (!tok) {
      throw new Error("Why is there no token?");
    }
    return tok;
  }

  newToken(tokenType: TokenType, ch: string): Token {
    return { Type: tokenType, Literal: ch };
  }

  isLetter(ch: string) {
    return (
      ("a".charCodeAt(0) <= ch.charCodeAt(0) &&
        ch.charCodeAt(0) <= "z".charCodeAt(0)) ||
      ("A".charCodeAt(0) <= ch.charCodeAt(0) &&
        ch.charCodeAt(0) <= "Z".charCodeAt(0)) ||
      ch === "_"
    );
  }

  isDigit(ch: string) {
    const digitRegex = /^[0-9]$/;
    return digitRegex.test(ch);
  }

  readIdentifier(): string {
    const position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  skipWhiteSpace() {
    while (
      this.ch == " " ||
      this.ch == "\t" ||
      this.ch == "\r" ||
      this.ch == "\n"
    ) {
      this.readChar();
    }
  }

  readNumber() {
    const position = this.position;
    while (this.isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  peekChar(): string | 0 {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition]!;
    }
  }
}
