import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizCreatorPage } from './quiz-creator.page';

const routes: Routes = [
  {
    path: '',
    component: QuizCreatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizCreatorPageRoutingModule {}
