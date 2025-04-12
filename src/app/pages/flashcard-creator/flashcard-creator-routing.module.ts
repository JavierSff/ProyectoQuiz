import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlashcardCreatorPage } from './flashcard-creator.page';

const routes: Routes = [
  {
    path: '',
    component: FlashcardCreatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlashcardCreatorPageRoutingModule {}
