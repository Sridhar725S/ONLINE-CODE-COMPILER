import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';

declare var monaco: any;
declare var require: any;
declare var snippets: any;

@Component({
  standalone: true,
  selector: 'app-practice-question',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './practice-question.component.html',
  styleUrls: ['./practice-question.component.css']
})
export class PracticeQuestionComponent implements AfterViewInit {
  problem: any;
  language = 'python';
  input = '';
  output = '';
  editor: any;
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id') || '';
  this.problem = getMockProblem(id);
}
  ngAfterViewInit() {
  require.config({ paths: { vs: 'assets/monaco/vs' } });

  require(['vs/editor/editor.main'], async () => {
    const editorElement = document.getElementById('editor');
    if (editorElement) {
      this.editor = monaco.editor.create(editorElement, {
        value: snippets[this.language] || '',
        language: this.language,
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 20,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        minimap: { enabled: false },
        wordWrap: 'on'
      });

    }
  });
}




  onLanguageChange() {
     const model = this.editor.getModel();
     this.editor.setValue(snippets[this.language]);
     monaco.editor.setModelLanguage(model, this.language === 'js' ? 'javascript' : this.language);
   }

  runSample() {
  this.http.post<any>('http://localhost:3000/runSample', {
    language: this.language,
    code: this.editor.getValue(),
    input: this.problem.sampleInput,
    output: this.problem.sampleOutput
  }).subscribe(res => this.output = res.result || res.error || 'No output');
}

submit() {
  this.http.post<any>('http://localhost:3000/run', {
    language: this.language,
    code: this.editor.getValue(),
    testCases: this.problem.hiddenTestCases.map((t: any) => ({ ...t, visible: false }))
  }).subscribe(res => this.output = res.result || res.error || 'No output');
}

  runWithCustomInput() {
    this.http.post<any>('http://localhost:3000/runCustom', {
      code: this.editor.getValue(),
      language: this.language,
      input: this.input
    }).subscribe(res => this.output = res.result);
  }
  toggleFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
 toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }
startRecording() {
    
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        this.mediaRecorder.ondataavailable = e => chunks.push(e.data);
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'session.webm';
          a.click();
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch(err => {
        console.error('🚫 Recording error:', err);
        alert('Permission denied or screen selection canceled.');
      });
  }
  stopRecording() {
  if (this.mediaRecorder?.state === 'recording') {
    this.mediaRecorder.stop();
  }

  // 💥 This part is CRUCIAL: stop the actual screen stream
  const tracks = (this.mediaRecorder?.stream?.getTracks() || []);
  tracks.forEach(track => track.stop()); // This kills Chrome's sharing popup

  document.exitFullscreen?.();
  this.isRecording = false;
}

  
}

function getMockProblem(id: string) {
  if (id === 'sum-two') {
    return {
      title: 'Sum of Two Numbers',
      timeComplexity: 'O(1)',
      description: 'Take two integers and output their sum.',
      sampleInput: '2\n3',
      sampleOutput: '5',
      starterCode: {
        python: 'a = int(input())\nb = int(input())\nprint(a + b)',
        java: 'import java.util.*;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}',
        cpp: '#include<iostream>\nusing namespace std;\nint main() {\n  int a,b;\n  cin >> a >> b;\n  cout << a + b;\n  return 0;\n}'
      },
      hiddenTestCases: [
        { input: '100\n200', output: '300' },
        { input: '7\n8', output: '15' },
      ]
    };
  }

  if (id === 'palindrome') {
    return {
      title: 'Palindrome Check',
      timeComplexity: 'O(n)',
      description: 'Check if the input string is a palindrome.',
      sampleInput: 'racecar',
      sampleOutput: 'Yes',
      starterCode: {
        python: 's = input()\nprint("Yes" if s == s[::-1] else "No")',
        java: 'import java.util.*;\nclass Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.next();\n    String reversed = new StringBuilder(s).reverse().toString();\n    System.out.println(s.equals(reversed) ? "Yes" : "No");\n  }\n}',
        cpp: '#include<iostream>\n#include<algorithm>\nusing namespace std;\nint main() {\n  string s;\n  cin >> s;\n  string r = s;\n  reverse(r.begin(), r.end());\n  cout << (s == r ? "Yes" : "No");\n  return 0;\n}'
      },
      hiddenTestCases: [
        { input: 'madam', output: 'Yes' },
        { input: 'hello', output: 'No' },
      ]
    };
  }

  return null;
}
