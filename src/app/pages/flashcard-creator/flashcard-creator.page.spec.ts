import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashcardCreatorPage } from './flashcard-creator.page';

describe('FlashcardCreatorPage', () => {
  let component: FlashcardCreatorPage;
  let fixture: ComponentFixture<FlashcardCreatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashcardCreatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
