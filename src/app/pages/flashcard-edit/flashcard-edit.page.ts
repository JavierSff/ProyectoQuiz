import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlashcardService } from 'src/app/services/flashcard.service';
import { Flashcard, FlashcardSet } from 'src/app/models/flashcard.model';
import { doc, updateDoc, Firestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  newQuestion = '';
  newAnswer = '';
  newQuestionImageUrl: string | null = null;
  newAnswerImageUrl: string | null = null;
  newQuestionImageUploaded = false;
  newAnswerImageUploaded = false;


  constructor(
    private route: ActivatedRoute,
    private flashcardService: FlashcardService,
    private firestore: Firestore,
    private toastCtrl: ToastController,
    private router: Router,
    private auth: Auth
    
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.flashcardService.getFlashcardSetById(id).subscribe(set => {
        this.flashcardSet = set;
      });
    }
  }

  async uploadNewImage(event: any, side: 'question' | 'answer') {
    const file = event.target.files[0];
    if (!file) return;
  
    const user = await this.auth.currentUser;
    if (!user) return;
  
    const storage = getStorage();
    const path = `flashcards/${user.uid}/${Date.now()}_${file.name}`;
    const ref = storageRef(storage, path);
  
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
  
    if (side === 'question') {
      this.newQuestionImageUrl = url;
      this.newQuestionImageUploaded = true; // ✅ disable question input
    } else {
      this.newAnswerImageUrl = url;
      this.newAnswerImageUploaded = true; // ✅ disable answer input
    }
  }
  

  async addNewCard() {
    if (!this.flashcardSet) return;
  
    // Validate: at least text or image for both sides
    if (!this.newQuestion.trim() && !this.newQuestionImageUrl) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter a question or upload an image.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }
  
    if (!this.newAnswer.trim() && !this.newAnswerImageUrl) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter an answer or upload an image.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }
  
    // Build the card and strip undefined values
    const newCard: any = {
      question: this.newQuestion.trim() || '',
      answer: this.newAnswer.trim() || ''
    };
  
    if (this.newQuestionImageUrl) {
      newCard.questionImageUrl = this.newQuestionImageUrl;
    }
  
    if (this.newAnswerImageUrl) {
      newCard.answerImageUrl = this.newAnswerImageUrl;
    }
  
    // Push to the array
    this.flashcardSet.cards.push(newCard);
  
    // Save to Firestore
    const ref = doc(this.firestore, `flashcards/${this.flashcardSet.id}`);
    await updateDoc(ref, { cards: this.flashcardSet.cards });
  
    // Reset form fields
    this.newQuestion = '';
    this.newAnswer = '';
    this.newQuestionImageUrl = null;
    this.newAnswerImageUrl = null;
    this.newQuestionImageUploaded = false;
    this.newAnswerImageUploaded = false;
  
    const toast = await this.toastCtrl.create({
      message: 'New flashcard added!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }
  async saveTitleAndCards() {
    if (!this.flashcardSet) return;
  
    const ref = doc(this.firestore, `flashcards/${this.flashcardSet.id}`);
    await updateDoc(ref, {
      title: this.flashcardSet.title,
      cards: this.flashcardSet.cards
    });
  
    const toast = await this.toastCtrl.create({
      message: 'Title and cards saved!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  
    // ✅ Navigate back to the flashcard list
    this.router.navigate(['/flashcard-list']);
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
        color: 'success'
      });
      await toast.present();

      this.currentEditIndex = null;
      this.editQuestion = '';
      this.editAnswer = '';
      this.editQuestionImageUrl = null;
      this.editAnswerImageUrl = null;
    }
    this.newQuestionImageUploaded = false;
    this.newAnswerImageUploaded = false;
  }

  goBack() {
    this.router.navigate(['/flashcard-list']);
  }
}
