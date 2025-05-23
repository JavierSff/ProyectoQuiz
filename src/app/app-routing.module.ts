import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupPage } from './pages/signup/signup.page';
import { ResetPasswordPage } from './pages/reset-password/reset-password.page';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'forgot-password',  // This is the path you want to navigate to
    component: ResetPasswordPage  // The page that should be loaded when this path is accessed
  },
  {
    path: '',
    redirectTo: 'splash-page',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'journals',
    loadChildren: () => import('./pages/journals/journals.module').then( m => m.JournalsPageModule)
  },
  {
    path: 'journal',
    loadChildren: () => import('./pages/journal/journal.module').then( m => m.JournalPageModule)
  },
  {
    path: 'todo',
    loadChildren: () => import('./pages/todo/todo.module').then( m => m.TodoPageModule)
  },
  {
    path: 'quiz-runner',
    loadChildren: () => import('./pages/quiz-runner/quiz-runner.module').then( m => m.QuizRunnerPageModule)
  },
  {
    path: 'quiz-creator',
    loadChildren: () => import('./pages/quiz-creator/quiz-creator.module').then( m => m.QuizCreatorPageModule)
  },
  {
    path: 'quiz-list',
    loadChildren: () => import('./pages/quiz-list/quiz-list.module').then( m => m.QuizListPageModule)
  },
  {
    path: 'splash-page',
    loadChildren: () => import('./pages/splash-page/splash-page.module').then( m => m.SplashPagePageModule)
  },
  {
    path: 'planner',
    loadChildren: () => import('./pages/planner/planner.module').then( m => m.PlannerPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'statistics',
    loadChildren: () => import('./pages/statistics/statistics.module').then( m => m.StatisticsPageModule)
  },
  {
    path: 'flashcard',
    loadChildren: () => import('./pages/flashcard/flashcard.module').then( m => m.FlashcardPageModule)
  },
  {
    path: 'pomodoro',
    loadChildren: () => import('./pages/pomodoro/pomodoro.module').then( m => m.PomodoroPageModule)
  },
  {
    path: 'flashcard-list',
    loadChildren: () => import('./pages/flashcard-list/flashcard-list.module').then(m => m.FlashcardListPageModule)
  },
  {
    path: 'flashcard-creator',
    loadChildren: () => import('./pages/flashcard-creator/flashcard-creator.module').then(m => m.FlashcardCreatorPageModule)
  },
  {
    path: 'flashcard/:id',
    loadChildren: () => import('./pages/flashcard/flashcard.module').then(m => m.FlashcardPageModule)
  },
  {
    path: 'flashcard-edit',
    loadChildren: () => import('./pages/flashcard-edit/flashcard-edit.module').then( m => m.FlashcardEditPageModule)
  },
  {
    path: 'flashcard/:id/edit',
    loadChildren: () =>
      import('./pages/flashcard-edit/flashcard-edit.module').then(m => m.FlashcardEditPageModule)
  },
  {
    path: 'quiz-edit',
    loadChildren: () => import('./pages/quiz-edit/quiz-edit.module').then( m => m.QuizEditPageModule)
  },
  {
    path: 'quiz/:id/edit',
    loadChildren: () =>
      import('./pages/quiz-edit/quiz-edit.module').then(m => m.QuizEditPageModule)
  }
  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
