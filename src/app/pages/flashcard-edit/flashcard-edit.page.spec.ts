import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlashcardEditPage } from './flashcard-edit.page';

describe('FlashcardEditPage', () => {
  let component: FlashcardEditPage;
  let fixture: ComponentFixture<FlashcardEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashcardEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
