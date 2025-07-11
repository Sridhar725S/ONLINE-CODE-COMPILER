var snippets = {
  python: "a = int(input())\nb = int(input())\nprint(a + b)",

  c: "#include <stdio.h>\nint main() {\n  int a, b;\n  scanf(\"%d %d\", &a, &b);\n  printf(\"%d\\n\", a + b);\n  return 0;\n}",

  java: "import java.util.*;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}",

  go: "package main\nimport \"fmt\"\nfunc main() {\n  var a, b int\n  fmt.Scan(&a, &b)\n  fmt.Println(a + b)\n}",

  js: "const readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin, output: process.stdout });\nlet lines = [];\nrl.on('line', input => {\n  lines.push(parseInt(input));\n  if (lines.length === 2) {\n    console.log(lines[0] + lines[1]);\n    rl.close();\n  }\n});"
};
