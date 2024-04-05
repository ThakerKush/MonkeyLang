import { Lexer } from "./lexer";

export type TokenType = string;

export const ILLEGAL = "ILLEGAL";
export const EOF = "EOF";
// Identifiers + literals
export const IDENT = "IDENT"; // add, foobar, x, y, ...
export const INT = "INT"; // 1343456
// Operators
export const ASSIGN = "=";
export const PLUS = "+";
// Delimiters
export const COMMA = ",";
export const SEMICOLON = ";";
export const LPAREN = "(";
export const RPAREN = ")";
export const LBRACE = "{";
export const RBRACE = "}";
// Keywords
export const FUNCTION = "FUNCTION";
export const LET = "LET";
export const MINUS = "-";
export const BANG = "!";
export const ASTERISK = "*";
export const SLASH = "/";
export const LT = "<";
export const GT = ">";
export const TRUE = "TRUE";
export const FALSE = "FALSE";
export const IF = "IF";
export const ELSE = "ELSE";
export const RETURN = "RETURN";
export const EQ = "==";
export const NOT_EQ = "!=";

export interface Token {
  Type: TokenType;
  Literal: string;
}

const keywords: Record<string, TokenType> = {
  fn: FUNCTION,
  let: LET,
  true: TRUE,
  false: FALSE,
  if: IF,
  else: ELSE,
  return: RETURN,
};

export function LookUpIdent(ident: string): TokenType {
  if (ident in keywords) {
    return keywords[ident]!;
  }
  return IDENT;
}

export function test(input: string) {
  const test = new Lexer(input);
  console.log(test, "this is from the test function");
  let tok;
  do {
    tok = test.nextToken();
    console.log(tok);
  } while (tok.Type !== EOF);
}
