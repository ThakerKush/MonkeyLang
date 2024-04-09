import { Lexer } from "../lexer/lexer";
import { Token, TokenType } from "../lexer/token";
import {
  Program,
  LetStatement,
  Identifier,
  ReturnStatement,
  prefixParseFn,
  infixParseFn,
  ExpressionStatement,
  Expression,
  IntegerLiteral,
  PrefixExpression,
  InfxExpression,
} from "../ast/ast";

enum OperatorPrecedence {
  _,
  LOWEST,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL,
}
type precidenceTokens =
  | TokenType.EQ
  | TokenType.NOT_EQ
  | TokenType.LT
  | TokenType.GT
  | TokenType.PLUS
  | TokenType.MINUS
  | TokenType.SLASH
  | TokenType.ASTERISK;

const precedences: Record<precidenceTokens, number> = {
  [TokenType.EQ]: OperatorPrecedence.EQUALS,
  [TokenType.NOT_EQ]: OperatorPrecedence.EQUALS,
  [TokenType.LT]: OperatorPrecedence.LESSGREATER,
  [TokenType.GT]: OperatorPrecedence.LESSGREATER,
  [TokenType.PLUS]: OperatorPrecedence.SUM,
  [TokenType.MINUS]: OperatorPrecedence.SUM,
  [TokenType.SLASH]: OperatorPrecedence.PRODUCT,
  [TokenType.ASTERISK]: OperatorPrecedence.PRODUCT,
};

export class Parser {
  lexer: Lexer;
  curToken!: Token;
  peekToken!: Token;
  errors: string[];
  prefixParseFns: Record<TokenType, prefixParseFn>;
  infixParseFns: Record<TokenType, infixParseFn>;
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.nextToken();
    this.nextToken();
    this.errors = [];
    this.prefixParseFns = {} as Record<TokenType, prefixParseFn>;
    this.infixParseFns = {} as Record<TokenType, prefixParseFn>;
    this.registerPrefix(TokenType.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(TokenType.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(TokenType.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(TokenType.MINUS, this.parsePrefixExpression.bind(this));
    this.registerInfix(TokenType.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(
      TokenType.ASTERISK,
      this.parseInfixExpression.bind(this)
    );
    this.registerInfix(TokenType.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(TokenType.GT, this.parseInfixExpression.bind(this));
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram(): Program {
    const program = new Program();

    while (this.curToken.Type != TokenType.EOF) {
      const stm = this.parseStatement();
      if (stm != null) {
        program.statements.push(stm);
      }
      this.nextToken();
    }
    return program;
  }

  parseLetStatement(): LetStatement | null {
    const smt = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    smt.Name = new Identifier(this.curToken, this.curToken.Literal);
    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    //skipping the expressions till we encounter a semicolon

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return smt;
  }

  parseReturnStatement(): ReturnStatement | null {
    const smt = new ReturnStatement(this.curToken);
    this.nextToken();

    while (!this.curTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return smt;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    console.log("parseExpressionStatement is being called");
    const smt = new ExpressionStatement(
      this.curToken,
      this.parseExpression(OperatorPrecedence.LOWEST)
    );

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return smt;
  }

  parsePrefixExpression(): Expression {
    const expression = new PrefixExpression(
      this.curToken,
      this.curToken.Literal
    );
    this.nextToken();

    expression.right = this.parseExpression(OperatorPrecedence.PREFIX);

    return expression;
  }

  parseInfixExpression(left: Expression): Expression {
    const expression = new InfxExpression(
      this.curToken,
      this.curToken.Literal,
      left
    );
    const precedence = this.curPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence);

    return expression;
  }

  parseIdentifier() {
    console.log("this is the value of curToken", this.curToken);
    return new Identifier(this.curToken, this.curToken.Literal);
  }

  parseIntegerLiteral(): Expression {
    const value = parseInt(this.curToken.Literal, 10);
    if (isNaN(value)) {
      const msg = `could not parse ${this.curToken.Literal} as integer`;
      console.log(msg);
      this.errors.push(msg);
    }
    const lit = new IntegerLiteral(this.curToken, value);
    return lit;
  }

  curTokenIs(token: TokenType): boolean {
    return this.curToken.Type === token;
  }

  peekTokenIs(token: TokenType): boolean {
    return this.peekToken.Type === token;
  }

  peekPrecedence(): number {
    return (
      precedences[this.peekToken.Type as precidenceTokens] ||
      OperatorPrecedence.LOWEST
    );
  }

  curPrecedence(): number {
    return (
      precedences[this.curToken.Type as precidenceTokens] ||
      OperatorPrecedence.LOWEST
    );
  }

  expectPeek(token: TokenType): boolean {
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(token);
      return false;
    }
  }

  parseStatement() {
    switch (this.curToken.Type) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseExpression(precedence: number): Expression {
    const prefix = this.prefixParseFns[this.curToken.Type];
    if (prefix == null) {
      this.noPrefixParseFnErr(this.curToken.Type);
    }
    let leftExp = prefix();
    while (
      !this.peekTokenIs(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken.Type];
      if (infix == null) {
        return leftExp;
      }
      this.nextToken();

      leftExp = infix(leftExp);
    }
    return leftExp;
  }

  Errors(): string[] {
    return this.errors;
  }

  noPrefixParseFnErr(token: TokenType) {
    const msg = `No prefix parse function for ${token} found`;
    console.log(msg);
    this.errors.push(msg);
  }

  peekError(token: TokenType) {
    const msg = `Expected next token to be ${token} but got ${this.peekToken.Type}`;
    console.log(msg);
    this.errors.push(msg);
  }
  registerPrefix(tokenType: TokenType, fn: prefixParseFn) {
    this.prefixParseFns[tokenType] = fn;
  }
  registerInfix(tokenType: TokenType, fn: infixParseFn) {
    this.infixParseFns[tokenType] = fn;
  }
}
