import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonCheckbox,
  IonLabel,
  IonIcon, IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [IonButton, 
    CommonModule,
    FormsModule,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonCheckbox,
    IonLabel,
    IonIcon
  ],
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  todoList: any[] = [];
  newTask: string = '';
  userId: string = '';
  selectedIds: string[] = [];

  @ViewChild('todoText') todoInputRef: ElementRef<HTMLInputElement> = null!;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getUserProfile().then(user => {
      if (user) {
        this.userId = user.uid;
        this.loadTodos();
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todoList = todos;
    });
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.loadTodos();
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  addTask(text: string): void {
    if (text.trim() !== '') {
      this.todoService.addTask(text).then(() => {
        this.todoInputRef.nativeElement.value = '';
        this.loadTodos();
      }).catch(error => console.error('Error adding task:', error));
    }
  }

  deleteTask(id: string): void {
    this.todoService.deleteTask(id).then(() => {
      this.loadTodos();
    }).catch(error => console.error('Error deleting task:', error));
  }

  archiveTask(id: string): void {
    this.todoService.archiveTask(id).then(() => {
      this.loadTodos();
    }).catch(error => console.error('Error archiving task:', error));
  }

  toggleCompleted(id: string, currentStatus: boolean): void {
    this.todoService.toggleCompleted(id, currentStatus).then(() => {
      this.loadTodos();
    }).catch(error => console.error('Error updating task:', error));
  }

  onToggle(todoItem: any) {
    this.toggleCompleted(todoItem.id, todoItem.completed);
  }

  toggleSelection(id: string) {
    const index = this.selectedIds.indexOf(id);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(id);
    }
  }

  deleteSelected() {
    Promise.all(this.selectedIds.map(id => this.todoService.deleteTask(id)))
      .then(() => {
        this.selectedIds = [];
        this.loadTodos();
      })
      .catch(err => console.error('Error deleting selected:', err));
  }
}
