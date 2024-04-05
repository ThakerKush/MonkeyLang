import { Token } from "../lexer/token";

interface Node {
  TokenLiteral(): string;
}

interface Statement extends Node {
  statementNode(): void;
}

interface Expression extends Node {
  expressionNode(): void;
}

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

class LetStatement {
  Token: Token;
  Name: Identifier;
  value: Expression;
  constructor(Token: Token, Name: Identifier, Value: Expression) {
    this.Token = Token;
    this.Name = Name;
    this.value = Value;
  }

  statementNode() {}
  TokenLiteral() {
    return this.Token.Literal;
  }
}

class Identifier {
  Token: Token;
  value: string;
  constructor(Token: Token, Name: Identifier, Value: string) {
    this.Token = Token;
    this.value = Value;
  }
  expressionNode() {}
  TokenLiteral() {
    return this.Token.Literal;
  }
}
