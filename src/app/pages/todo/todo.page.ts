import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { IonRefresher, IonRefresherContent, IonContent } from "@ionic/angular/standalone";


@Component({
  selector: 'app-todo',
  standalone: true,  // Set this as standalone component
  imports: [
    IonContent,
    IonRefresher,
    IonRefresherContent,CommonModule, FormsModule],  // Import FormsModule for ngModel binding
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();

      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
  todoList: any[] = [];  // Array to store to-do items
  newTask: string = '';  // New task text
  userId: string = '';   // User ID for authentication (could be used for personalization)

  @ViewChild('todoText') todoInputRef: ElementRef<HTMLInputElement> = null!;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    // Ensure that user session is retrieved and authenticated before loading todos
    this.todoService.getUserProfile().then(user => {
      if (user) {
        this.userId = user.uid;  // Store userId once the user is authenticated
        this.loadTodos();  // Fetch todos for the authenticated user
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  addTask(text: string): void {
    if (text.trim() !== '') {
      this.todoService.addTask(text).then(() => {
        this.todoInputRef.nativeElement.value = '';  // Clear input field
        this.loadTodos();  // Reload the list after adding the task
      }).catch(error => console.error('Error adding task:', error));
    }
  }

  deleteTask(id: string): void {
    this.todoService.deleteTask(id).then(() => {
      this.loadTodos();  // Reload the list after deleting a task
    }).catch(error => console.error('Error deleting task:', error));
  }

  toggleCompleted(id: string, currentStatus: boolean): void {
    this.todoService.toggleCompleted(id, currentStatus).then(() => {
      this.loadTodos();  // Reload the list after toggling completion status
    }).catch(error => console.error('Error updating task:', error));
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todoList = todos;  // Re-fetch the tasks from Firestore
    });
  }
}
