import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var monaco: any;
declare var require: any;
declare var snippets: any;
@Component({
  standalone: true,
  selector: 'app-code-myself',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [],
  templateUrl: './code-myself.component.html',
  styleUrls: ['./code-myself.component.css']
})
export class CodeMyselfComponent implements AfterViewInit{
  editor: any;
   language = 'python';
   customInput = '';
   output = '';
 
   constructor(private http: HttpClient) {}
 
   
   ngAfterViewInit() {
  const that = this;

  // Set path to Monaco
  require.config({ paths: { vs: 'assets/monaco/vs' } });

  // Load Monaco async
  require(['vs/editor/editor.main'], () => {
    that.editor = monaco.editor.create(document.getElementById('editor'), {
      value: snippets[that.language] || '',
      language: that.language === 'js' ? 'javascript' : that.language,
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 20, // 🔍 Increase font size
      suggestOnTriggerCharacters: true, // ✨ IntelliSense
      quickSuggestions: true,
      minimap: { enabled: false },
      wordWrap: 'on'
    });
  });
}

 
   onLanguageChange() {
     const model = this.editor.getModel();
     this.editor.setValue(snippets[this.language]);
     monaco.editor.setModelLanguage(model, this.language === 'js' ? 'javascript' : this.language);
   }
 
  runCode() {
  if (!this.editor) {
    console.error('Editor not initialized yet');
    return;
  }

  this.http.post<any>('https://online-code-compiler-phok.onrender.com/runCustom', {
    code: this.editor.getValue(),
    language: this.language,
    input: this.customInput
  }).subscribe(res => {
    this.output = res.result;
  });
}


}
