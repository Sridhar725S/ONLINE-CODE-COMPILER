import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMyselfComponent } from './code-myself.component';

describe('CodeMyselfComponent', () => {
  let component: CodeMyselfComponent;
  let fixture: ComponentFixture<CodeMyselfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeMyselfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeMyselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
