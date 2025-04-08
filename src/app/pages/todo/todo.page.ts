import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service'; // Import the TodoService

@Component({
  selector: 'app-todo',
  standalone: true,  // Set this as standalone component
  imports: [CommonModule, FormsModule],  // Import FormsModule for ngModel binding
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todoList: any[] = [];  // Array to store to-do items
  newTask: string = '';  // New task text
  userId: string = '';   // User ID for authentication (could be used for personalization)

  @ViewChild('todoText') todoInputRef: ElementRef<HTMLInputElement> = null!;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos().subscribe(todos => {
      this.todoList = todos;  // Populate todoList with tasks from Firestore
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
