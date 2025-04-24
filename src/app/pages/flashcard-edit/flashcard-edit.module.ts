import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlashcardEditPageRoutingModule } from './flashcard-edit-routing.module';

import { FlashcardEditPage } from './flashcard-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashcardEditPageRoutingModule
  ],
  declarations: [FlashcardEditPage]
})
export class FlashcardEditPageModule {}
