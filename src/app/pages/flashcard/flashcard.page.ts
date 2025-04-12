import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; // ✅ This one!

import { Flashcard, FlashcardSet } from '../../models/flashcard.model';
import { FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-flashcard',
  standalone: false,
  templateUrl: './flashcard.page.html',
  styleUrls: ['./flashcard.page.scss'],
})
export class FlashcardPage implements OnInit {
  currentIndex = 0;
  flipped = false;
  flashcards: Flashcard[] = [];

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private location: Location
  ) {}

  goBack() {
    this.location.back();
  }
  get currentCard() {
    return this.flashcards[this.currentIndex];
  }

  flipCard() {
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

  ngOnInit() {
    const setId = this.route.snapshot.paramMap.get('id');
    if (setId) {
      this.flashcardService.getFlashcardSets().subscribe((sets) => {
        const foundSet = sets.find(set => set.id === setId);
        if (foundSet) {
          this.flashcards = foundSet.cards || [];
        }
      });
    }
  }
}
