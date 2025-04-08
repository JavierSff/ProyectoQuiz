import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, query, where, collectionData } from '@angular/fire/firestore';
import { AuthenticationService } from 'src/app/authentication.service';
import { Observable } from 'rxjs';

// TodoItem class to represent a task
export class TodoItem {
  id?: string;
  task: string;
  completed: boolean;
  userId: string;

  constructor(task: string, completed: boolean, userId: string, id?: string) {
    this.task = task;
    this.completed = completed;
    this.userId = userId;
    this.id = id;
  }
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  userId: string = '';

  constructor(private firestore: Firestore, private authService: AuthenticationService) {
    // Fetch the logged-in user's profile using AuthenticationService
    this.authService.getProfile().then(user => {
      if (user) {
        this.userId = user.uid; // Set userId for the current user
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  // Fetch all tasks for the logged-in user from Firestore
  getTodos(): Observable<TodoItem[]> {
    const todosRef = collection(this.firestore, 'todos');
    const q = query(todosRef, where('userId', '==', this.userId)); // Querying by userId
    return collectionData(q, { idField: 'id' }) as Observable<TodoItem[]>; // Return observable
  }

  // Add a new task to Firestore
  addTask(text: string): Promise<void> {
    const newTodoItem = {
      task: text.trim(),
      completed: false,
      userId: this.userId, // Use the stored userId
    };
    const todosRef = collection(this.firestore, 'todos');
    return addDoc(todosRef, newTodoItem).then(() => {});
  }

  // Delete a task from Firestore
  deleteTask(id: string): Promise<void> {
    const todoDocRef = doc(this.firestore, 'todos', id);
    return deleteDoc(todoDocRef);
  }

  // Toggle the completed state of a task
  toggleCompleted(id: string, currentStatus: boolean): Promise<void> {
    const todoDocRef = doc(this.firestore, 'todos', id);
    return updateDoc(todoDocRef, { completed: !currentStatus });
  }
}
