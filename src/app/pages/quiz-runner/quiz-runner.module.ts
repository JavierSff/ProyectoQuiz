import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizRunnerPageRoutingModule } from './quiz-runner-routing.module';

import { QuizRunnerPage } from './quiz-runner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizRunnerPageRoutingModule
  ],
  declarations: [QuizRunnerPage]
})
export class QuizRunnerPageModule {}
