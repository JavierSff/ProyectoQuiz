import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'flashcard/:id/edit',
    loadChildren: () =>
      import('./pages/flashcard-edit/flashcard-edit.module').then(m => m.FlashcardEditPageModule)
  },
  {
    path: 'quiz/:id/edit',
    loadChildren: () =>
      import('./pages/quiz-edit/quiz-edit.module').then(m => m.QuizEditPageModule)
  }
  
  
  
];
