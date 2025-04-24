import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Flashcard, FlashcardSet } from 'src/app/models/flashcard.model';
import { FlashcardService } from 'src/app/services/flashcard.service';
import { ToastController } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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
  questionImageUrl: string | null = null;
  answerImageUrl: string | null = null;
  questionImageUploaded = false;
  answerImageUploaded = false;
  cards: Flashcard[] = [];
  selectedBackground: string = '/assets/fondocards.png';
  availableBackgrounds = ['lightorange.png', 'brightgrey.svg', 'brightpurple.svg', 'darkgrey.svg', 'darkpink.svg', 'grassgreen.svg', 'lila.svg', 'green.png', 'mustard.png', 'palegreen.png', 'turquoise.png','violet.png', 'wine.png'];

  constructor(
    private flashcardService: FlashcardService,
    private auth: Auth,
    private router: Router,
    private toastController: ToastController,
    private firestore: Firestore
  ) {}

  async uploadImage(event: any, side: 'question' | 'answer') {
    const file = event.target.files[0];
    if (!file) return;

    const user = await this.auth.currentUser;
    if (!user) {
      const toast = await this.toastController.create({
        message: 'You must be logged in to upload images.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const storage = getStorage();
    const path = `flashcards/${user.uid}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, path);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      if (side === 'question') {
        this.questionImageUrl = url;
        this.questionImageUploaded = true;
      } else {
        this.answerImageUrl = url;
        this.answerImageUploaded = true;
      }

      const toast = await this.toastController.create({
        message: `${side === 'question' ? 'Question' : 'Answer'} image uploaded successfully!`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Upload failed. Please try again.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
      console.error(error);
    }
  }

  addCard() {
    if (!this.newQuestion && !this.questionImageUrl) {
      console.warn('Please enter a question or upload an image.');
      return;
    }

    if (!this.newAnswer && !this.answerImageUrl) {
      console.warn('Please enter an answer or upload an image.');
      return;
    }

    this.cards.push({
      question: this.newQuestion || '',
      answer: this.newAnswer || '',
      questionImageUrl: this.questionImageUrl || undefined,
      answerImageUrl: this.answerImageUrl || undefined
    });

    // Reset fields
    this.newQuestion = '';
    this.newAnswer = '';
    this.questionImageUrl = null;
    this.answerImageUrl = null;
    this.questionImageUploaded = false;
    this.answerImageUploaded = false;
  }

  async saveSet() {
    const user = await this.auth.currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    if (!this.title.trim() || this.cards.length === 0) {
      const toast = await this.toastController.create({
        message: 'Title and at least one flashcard are required.',
        duration: 3000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const set: FlashcardSet = {
      title: this.title.trim(),
      cards: this.cards.map(card => ({
        question: card.question || '',
        answer: card.answer || '',
        ...(card.questionImageUrl ? { questionImageUrl: card.questionImageUrl } : {}),
        ...(card.answerImageUrl ? { answerImageUrl: card.answerImageUrl } : {})
      })),
      
      uid: user.uid,
      backgroundImage: this.selectedBackground || null
    };

    try {
      console.log('Saving flashcard set:', set);
      const ref = collection(this.firestore, 'flashcards');
      await addDoc(ref, set);

      const toast = await this.toastController.create({
        message: 'Flashcard set saved successfully!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();

      this.router.navigate(['/flashcard-list']);
    } catch (error) {
      console.error('🔥 Error while saving flashcard set:', error);
      const toast = await this.toastController.create({
        message: 'Failed to save set. Check console for error.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  changeBackground(event: any) {
    this.selectedBackground = event.detail.value;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
