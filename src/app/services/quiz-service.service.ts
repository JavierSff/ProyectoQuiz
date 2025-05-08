import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  addDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id?: string;
  userId: string;
  title: string;
  questions: Question[];
  createdAt: any;
  backgroundImage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private userId: string;

  constructor(private firestore: Firestore, private auth: AuthenticationService) {
    this.auth.getProfile().then(user => this.userId = user?.uid || '');
  }
  

  addQuiz(quiz: Quiz) {
    quiz.userId = this.userId;
    quiz.createdAt = new Date();
    quiz.id = uuidv4();
    const ref = collection(this.firestore, 'quizzes');
    return addDoc(ref, quiz);
  }

  getQuizzes(userId: string): Observable<Quiz[]> {
    const ref = query(
      collection(this.firestore, 'quizzes'),
      where('userId', '==', userId)
    );
    return collectionData(ref, { idField: 'id' }) as Observable<Quiz[]>;
  }

  // One-time fetch method to get quizzes as a Promise 
  async getQuizzesOnce(uid: string): Promise<Quiz[]> {
    const quizCollection = collection(this.firestore, 'quizzes');
    const quizQuery = query(quizCollection, where('userId', '==', uid));
    const snapshot = await getDocs(quizQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[];
  }

  

  getQuizById(id: string): Observable<Quiz> {
    const docRef = doc(this.firestore, `quizzes/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Quiz>;
  }

  updateQuizBackground(quizId: string, backgroundImage: string) {
    const docRef = doc(this.firestore, `quizzes/${quizId}`);
    return updateDoc(docRef, { backgroundImage });
  }

  deleteQuiz(id: string) {
    return deleteDoc(doc(this.firestore, `quizzes/${id}`));
  }
}
