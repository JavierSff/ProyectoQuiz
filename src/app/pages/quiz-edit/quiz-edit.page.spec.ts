import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizEditPage } from './quiz-edit.page';

describe('QuizEditPage', () => {
  let component: QuizEditPage;
  let fixture: ComponentFixture<QuizEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
