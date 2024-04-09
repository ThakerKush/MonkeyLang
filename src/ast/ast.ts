import { Token, TokenType } from "../lexer/token";

interface Node {
  TokenLiteral(): string;
}

interface Statement extends Node {
  statementNode(): void;
}

export interface Expression extends Node {
  expressionNode(): void;
}

export type prefixParseFn = () => Expression;
export type infixParseFn = (leftSide: Expression) => Expression;

export class Program {
  statements: Statement[];
  constructor() {
    this.statements = [];
  }

  TokenLiteral() {
    if (this.statements.length > 0 && this.statements[0]) {
      return this.statements[0].TokenLiteral(); //returns the TokenLiteral() method on the first object of the statements array
    } else {
      return "";
    }
  }
}

export class LetStatement implements Statement {
  Token: Token;
  Name?: Identifier;
  value?: Expression;
  constructor(Token: Token, Name?: Identifier, Value?: Expression) {
    this.Token = Token;
    this.Name = Name;
    this.value = Value;
  }

  statementNode() {}
  TokenLiteral() {
    return this.Token.Literal;
  }
}

export class Identifier implements Identifier {
  Token: Token;
  value: string;
  constructor(Token: Token, Value: string) {
    this.Token = Token;
    this.value = Value;
  }
  expressionNode() {}
  TokenLiteral() {
    return this.Token.Literal;
  }
}

export class ReturnStatement implements Statement {
  Token: Token;
  ReturnValue?: Expression;
  constructor(Token: Token, ReturnValue?: Expression) {
    this.Token = Token;
    this.ReturnValue = ReturnValue;
  }

  statementNode() {}
  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class ExpressionStatement implements Statement {
  Token: Token;
  Expression: Expression;
  constructor(Token: Token, Expression: Expression) {
    this.Token = Token;
    this.Expression = Expression;
  }
  statementNode(): void {}

  TokenLiteral(): string {
    return this.Token.Literal;
  }
}

export class IntegerLiteral implements Expression {
  token: Token;
  value: number;
  constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }
  expressionNode(): void {}
  TokenLiteral(): string {
    return this.token.Literal;
  }
}

export class PrefixExpression implements Expression {
  token: Token;
  operator: string;
  right?: Expression;
  constructor(token: Token, operator: string, right?: Expression) {
    this.token = token;
    this.operator = operator;
    this.right = right;
  }
  expressionNode(): void {}
  TokenLiteral(): string {
    return this.token.Literal;
  }
}

export class InfxExpression implements Expression {
  token: Token;
  operator: string;
  left: Expression;
  right?: Expression;
  constructor(
    token: Token,
    operator: string,
    left: Expression,
    right?: Expression
  ) {
    this.token = token;
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  expressionNode(): void {}
  TokenLiteral(): string {
    return this.token.Literal;
  }
}
