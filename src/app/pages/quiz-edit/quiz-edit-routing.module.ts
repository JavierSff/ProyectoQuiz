import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizEditPage } from './quiz-edit.page';

const routes: Routes = [
  {
    path: '',
    component: QuizEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizEditPageRoutingModule {}
