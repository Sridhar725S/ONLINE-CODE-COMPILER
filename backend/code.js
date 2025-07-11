const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let lines = [];
rl.on('line', input => {
  lines.push(parseInt(input));
  if (lines.length === 2) {
    console.log(lines[0] + lines[1]);
    rl.close();
  }
});