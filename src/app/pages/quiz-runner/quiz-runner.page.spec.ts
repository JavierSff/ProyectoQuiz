import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizRunnerPage } from './quiz-runner.page';

describe('QuizRunnerPage', () => {
  let component: QuizRunnerPage;
  let fixture: ComponentFixture<QuizRunnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizRunnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
