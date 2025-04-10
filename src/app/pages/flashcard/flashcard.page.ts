import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  standalone: false,
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss'],
})
export class FlashcardPage implements OnInit {
  currentIndex = 0;
  totalCards = 5;  // Example total card count
  flipped = false; // Track the flipped state of the card

  flashcards = [
    { question: 'Who created Helvetica?', answer: 'Max Miedinger' },
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What is 2 + 2?', answer: '4' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
    { question: 'Who painted the Mona Lisa?', answer: 'Leonardo da Vinci' }
  ];

  get currentCard() {
    return this.flashcards[this.currentIndex];
  }

  flipCard() {
    this.flipped = !this.flipped; // Toggle the flipped state
  }

  nextCard() {
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    this.flipped = false; // Reset flip state when moving to the next card
  }

  previousCard() {
    this.currentIndex = (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
    this.flipped = false; // Reset flip state when moving to the previous card
  }

  constructor() {}

  ngOnInit() {}
}
