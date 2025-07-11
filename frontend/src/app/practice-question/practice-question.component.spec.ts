import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeQuestionComponent } from './practice-question.component';

describe('PracticeQuestionComponent', () => {
  let component: PracticeQuestionComponent;
  let fixture: ComponentFixture<PracticeQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
