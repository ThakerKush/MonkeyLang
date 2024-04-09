import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";

const input = `
a + b + c
`;

const lexer = new Lexer(input);
const program = new Parser(lexer);
console.log(lexer);
const output = program.parseProgram();
console.log(output.statements);
console.log(JSON.stringify(output.statements, null, 2));
