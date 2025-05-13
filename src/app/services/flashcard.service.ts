import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { FlashcardSet } from '../models/flashcard.model';
import { docData } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })
export class FlashcardService {
  private flashcardCollection = collection(this.firestore, 'flashcards');

  constructor(private firestore: Firestore) {}
/** adds a new flashcard */
  addFlashcardSet(set: FlashcardSet) {
    const ref = collection(this.firestore, 'flashcards');
    return addDoc(ref, set);
  }
  /** retrieves every flashcard sets */
  getFlashcardSets(): Observable<FlashcardSet[]> {
    return collectionData(this.flashcardCollection, { idField: 'id' }) as Observable<FlashcardSet[]>;
  }
/** deletes flashcards sets */
  deleteFlashcardSet(id: string) {
    const docRef = doc(this.firestore, `flashcards/${id}`);
    return deleteDoc(docRef);
  }
  /** retrieves flashcard by their ID */
  getFlashcardSetById(id: string): Observable<FlashcardSet> {
    const ref = doc(this.firestore, `flashcards/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<FlashcardSet>;
  }
}
