const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(__dirname));
app.use('/monaco', express.static(path.join(__dirname, 'node_modules/monaco-editor/min')));
app.use(express.json());

const langMap = {
  python: { ext: 'py', cmd: (f) => `python ${f}` },
  c: { ext: 'c', cmd: (f) => process.platform === 'win32' ? `gcc ${f} -o code && code` : `gcc ${f} -o code && ./code` },
  java: { ext: 'java', cmd: (f) => `javac ${f} && java Main` },
  go: { ext: 'go', cmd: (f) => `go run ${f}` },
  js: { ext: 'js', cmd: (f) => `node ${f}` }
};

function executeTests(code, language, tests, callback) {
  const lang = langMap[language];
  if (!lang) return callback('Unsupported language');

  const filename = language === 'java' ? 'Main.java' : `code.${lang.ext}`;
  fs.writeFileSync(filename, code);

  const results = [];
  let done = 0;

  tests.forEach((test, i) => {
    const inputFile = `input_${i}.txt`;
    fs.writeFileSync(inputFile, test.input);

    exec(`${lang.cmd(filename)} < ${inputFile}`, (err, stdout, stderr) => {
      const output = (stdout || '').trim();
      const passed = output === test.output.trim();
      const result = passed ? '✅ Passed' : `❌ Failed (Got: "${output}", Expected: "${test.output}")`;

      results[i] = {
        test: test.visible ? `Input:\n${test.input}` : "Hidden Test Case",
        output,
        expected: test.output.trim(),
        result
      };

      fs.unlinkSync(inputFile);
      done++;

      if (done === tests.length) callback(null, results);
    });
  });
}

app.post('/run', (req, res) => {
  const { code, language, testCases } = req.body;
  executeTests(code, language, testCases, (err, results) => {
    if (err) return res.json({ result: `❌ Error: ${err}` });
    const formatted = results.map(r => `${r.test}\nExpected: ${r.expected}\nYour Output: ${r.output}\n${r.result}`).join('\n\n');
    res.json({ result: formatted });
  });
});

app.post('/runSample', (req, res) => {
  const { code, language, input, output } = req.body;
  const sampleTest = [{ input, output, visible: true }];
  executeTests(code, language, sampleTest, (err, results) => {
    if (err) return res.json({ result: `❌ Error: ${err}` });
    const formatted = results.map(r => `${r.test}\nExpected: ${r.expected}\nYour Output: ${r.output}\n${r.result}`).join('\n\n');
    res.json({ result: formatted });
  });
});

app.post('/runCustom', (req, res) => {
  const { code, language, input } = req.body;
  const lang = langMap[language];
  if (!lang) return res.status(400).json({ result: 'Unsupported language' });

  const filename = language === 'java' ? 'Main.java' : `code.${lang.ext}`;
  fs.writeFileSync(filename, code);
  fs.writeFileSync('input_custom.txt', input);

  exec(`${lang.cmd(filename)} < input_custom.txt`, (err, stdout, stderr) => {
    if (err) {
      return res.json({ result: `❌ Error:\n${stderr || err.message}` });
    }
    res.json({ result: `✅ Output:\n${stdout.trim()}` });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.listen(PORT, () => console.log(`🚀 Compiler running at http://localhost:${PORT}`));

