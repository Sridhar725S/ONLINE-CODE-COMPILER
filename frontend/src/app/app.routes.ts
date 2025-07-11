import { Routes } from '@angular/router';
import { CodeMyselfComponent } from './code-myself/code-myself.component';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { PracticeQuestionComponent } from './practice-question/practice-question.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
{ path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'code-myself', component: CodeMyselfComponent },
  { path: 'practice', component: PracticeListComponent },
  { path: 'practice/:id', component: PracticeQuestionComponent },
];
