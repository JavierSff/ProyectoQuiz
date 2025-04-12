import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { FlashcardSet } from '../models/flashcard.model';

@Injectable({ providedIn: 'root' })
export class FlashcardService {
  private flashcardCollection = collection(this.firestore, 'flashcards');

  constructor(private firestore: Firestore) {}

  addFlashcardSet(set: FlashcardSet) {
    return addDoc(this.flashcardCollection, set);
  }

  getFlashcardSets(): Observable<FlashcardSet[]> {
    return collectionData(this.flashcardCollection, { idField: 'id' }) as Observable<FlashcardSet[]>;
  }

  deleteFlashcardSet(id: string) {
    const docRef = doc(this.firestore, `flashcards/${id}`);
    return deleteDoc(docRef);
  }
}
