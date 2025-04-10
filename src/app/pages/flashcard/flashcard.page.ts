import { Component } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  standalone: false,
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss'],
})
export class FlashcardPage {
  flashcards = [
    { question: 'What is 2 + 2?', answer: '4' },
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
  ];

  currentIndex = 0;
  flipped: boolean = false;

  get flashcard() {
    return this.flashcards[this.currentIndex];
  }

  constructor() {}

  flip() {
    this.flipped = !this.flipped;
  }

  nextCard() {
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    this.flipped = false;
  }

  previousCard() {
    this.currentIndex = (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
    this.flipped = false;
  }
}
