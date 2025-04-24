import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService } from 'src/app/services/flashcard.service';
import { Flashcard, FlashcardSet } from 'src/app/models/flashcard.model';
import { doc, updateDoc, Firestore } from '@angular/fire/firestore';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flashcard-edit',
  standalone: false,
  templateUrl: './flashcard-edit.page.html',
  styleUrls: ['./flashcard-edit.page.scss']
})
export class FlashcardEditPage implements OnInit {
  flashcardSet: FlashcardSet | null = null;
  currentEditIndex: number | null = null;

  editQuestion = '';
  editAnswer = '';
  editQuestionImageUrl: string | null = null;
  editAnswerImageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private firestore: Firestore,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flashcardService.getFlashcardSetById(id).subscribe(set => {
        this.flashcardSet = set;
      });
    }
  }

  
  editCard(index: number) {
    const card = this.flashcardSet?.cards[index];
    if (card) {
      this.currentEditIndex = index;
      this.editQuestion = card.question || '';
      this.editAnswer = card.answer || '';
      this.editQuestionImageUrl = card.questionImageUrl || null;
      this.editAnswerImageUrl = card.answerImageUrl || null;
    }
  }

  async saveEditedCard() {
    if (
      this.flashcardSet &&
      this.currentEditIndex !== null &&
      this.flashcardSet.cards[this.currentEditIndex]
    ) {
      this.flashcardSet.cards[this.currentEditIndex] = {
        question: this.editQuestion,
        answer: this.editAnswer,
        questionImageUrl: this.editQuestionImageUrl || undefined,
        answerImageUrl: this.editAnswerImageUrl || undefined,
      };

      const ref = doc(this.firestore, `flashcards/${this.flashcardSet.id}`);
      await updateDoc(ref, { cards: this.flashcardSet.cards });

      const toast = await this.toastCtrl.create({
        message: 'Card updated successfully',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.currentEditIndex = null;
      this.editQuestion = '';
      this.editAnswer = '';
      this.editQuestionImageUrl = null;
      this.editAnswerImageUrl = null;
    }
  }

  goBack() {
    this.router.navigate(['/flashcard-list']);
  }
}
