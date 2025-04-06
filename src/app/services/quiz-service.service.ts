import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, docData, query, updateDoc, where, deleteDoc } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private userId: string;

  constructor(private firestore: Firestore, private auth: AuthenticationService) {
    this.auth.getProfile().then(user => this.userId = user?.uid || '');
  }

  addQuiz(quiz: Quiz) {
    quiz.userId = this.userId;
    quiz.createdAt = new Date();
    const ref = collection(this.firestore, 'quizzes');
    return addDoc(ref, quiz);
  }

  getQuizzes(userId: string): Observable<Quiz[]> {
    const ref = query(collection(this.firestore, 'quizzes'), where('userId', '==', userId));
    return collectionData(ref, { idField: 'id' }) as Observable<Quiz[]>;
  }

  getQuizById(id: string): Observable<Quiz> {
    const docRef = doc(this.firestore, `quizzes/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Quiz>;
  }

  updateQuiz(quiz: Quiz) {
    const docRef = doc(this.firestore, `quizzes/${quiz.id}`);
    return updateDoc(docRef, { ...quiz });
  }

  deleteQuiz(id: string) {
    return deleteDoc(doc(this.firestore, `quizzes/${id}`));
  }
}