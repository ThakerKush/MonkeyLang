import { Lexer } from "../lexer/lexer";
import { Token } from "../lexer/token";
import { Program } from "../ast/ast";


export class Parser {
  lexer: Lexer;
  curToken!: Token;
  peekToken!: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  parseProgram(): Program {
    const program = new Program()

    while(this.curToken.Type != EOF)

  }
}
