import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizCreatorPageRoutingModule } from './quiz-creator-routing.module';

import { QuizCreatorPage } from './quiz-creator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizCreatorPageRoutingModule
  ],
  declarations: [QuizCreatorPage]
})
export class QuizCreatorPageModule {}
