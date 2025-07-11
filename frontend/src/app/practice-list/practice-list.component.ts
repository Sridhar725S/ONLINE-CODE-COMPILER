import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-practice-list',
  imports: [RouterModule, CommonModule],
  templateUrl: './practice-list.component.html',
  styleUrl: './practice-list.component.css'
})
export class PracticeListComponent {
 problems = [
    { id: 'sum-two', title: 'Sum of Two Numbers' },
    { id: 'palindrome', title: 'Check Palindrome' },
    // Add more
  ];
}
