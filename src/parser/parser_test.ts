import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";

const input = `
let x = 5;
let y = 10;
let foobar = 838383;
`;

const lexer = new Lexer(input);
const program = new Parser(lexer);

const output = program.parseProgram();
console.log(output);
