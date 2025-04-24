import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizEditPageRoutingModule } from './quiz-edit-routing.module';

import { QuizEditPage } from './quiz-edit.page';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: QuizEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizEditPageRoutingModule
  ],
  declarations: [QuizEditPage]
})
export class QuizEditPageModule {}
