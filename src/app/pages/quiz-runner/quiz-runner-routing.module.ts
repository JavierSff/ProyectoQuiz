import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizRunnerPage } from './quiz-runner.page';

const routes: Routes = [
  {
    path: ':id',  // <- This is key for dynamic routing
    component: QuizRunnerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRunnerPageRoutingModule {}
