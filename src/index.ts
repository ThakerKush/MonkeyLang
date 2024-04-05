import * as os from "os";
import { start } from "./repl/repl";

function main() {
  const user = os.userInfo().username;
  console.log("Hello! This is my programming language!\n", user);
  console.log("Feel free to try the commands!\n");
  start(process.stdin, process.stdout);
}
main();
