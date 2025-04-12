import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlashcardListPageRoutingModule } from './flashcard-list-routing.module';

import { FlashcardListPage } from './flashcard-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashcardListPageRoutingModule
  ],
  declarations: [FlashcardListPage]
})
export class FlashcardListPageModule {}
