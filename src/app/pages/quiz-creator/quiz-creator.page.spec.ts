import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizCreatorPage } from './quiz-creator.page';

describe('QuizCreatorPage', () => {
  let component: QuizCreatorPage;
  let fixture: ComponentFixture<QuizCreatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizCreatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
