import { Lexer } from "./lexer";

export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  IDENT = "IDENT",
  INT = "INT",
  ASSIGN = "=",
  PLUS = "+",
  COMMA = ",",
  SEMICOLON = ";",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  FUNCTION = "FUNCTION",
  LET = "LET",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  LT = "<",
  GT = ">",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
  EQ = "==",
  NOT_EQ = "!=",
}

export interface Token {
  Type: TokenType;
  Literal: string;
}

const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
};

export function LookUpIdent(ident: string): TokenType {
  if (ident in keywords) {
    return keywords[ident]!;
  }
  return TokenType.IDENT;
}

export function test(input: string) {
  const test = new Lexer(input);
  console.log(test, "this is from the test function");
  let tok;
  do {
    tok = test.nextToken();
    console.log(tok);
  } while (tok.Type !== TokenType.EOF);
}
