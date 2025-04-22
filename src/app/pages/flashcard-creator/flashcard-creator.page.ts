import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Flashcard, FlashcardSet } from '../../models/flashcard.model';
import { FlashcardService } from 'src/app/services/flashcard.service';
import { IonHeader, IonToolbar, IonItem, IonButtons } from "@ionic/angular/standalone";

@Component({
  selector: 'app-flashcard-creator',
  standalone: false,
  templateUrl: './flashcard-creator.page.html',
  styleUrls: ['./flashcard-creator.page.scss'],
})
export class FlashcardCreatorPage {
  title = '';
  newQuestion = '';
  newAnswer = '';
  cards: Flashcard[] = [];
  selectedBackground: string = '/assets/fondocards.png'; // Default background
  availableBackgrounds = [
    'fondocards.png', 'brightgrey.svg', 'brightpurple.svg',
    'darkgrey.svg', 'darkpink.svg', 'grassgreen.svg', 'lila.svg'
  ];

  constructor(
    private flashcardService: FlashcardService,
    private auth: Auth,
    private router: Router
  ) {}

  addCard() {
    if (this.newQuestion && this.newAnswer) {
      this.cards.push({ question: this.newQuestion, answer: this.newAnswer });
      this.newQuestion = '';
      this.newAnswer = '';
    }
  }

  async saveSet() {
    const user = this.auth.currentUser;
    if (!user) return;

    const set: FlashcardSet = {
      title: this.title,
      cards: this.cards,
      uid: user.uid,
      backgroundImage: this.selectedBackground
    };

    await this.flashcardService.addFlashcardSet(set);
    this.router.navigate(['/flashcard-list']);
  }
  changeBackground(event: any) {
    // Handle background change
    const selectedImage = event.detail.value;
    this.selectedBackground = selectedImage;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
