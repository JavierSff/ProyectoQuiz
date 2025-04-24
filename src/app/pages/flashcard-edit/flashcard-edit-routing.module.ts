import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlashcardEditPage } from './flashcard-edit.page';

const routes: Routes = [
  {
    path: '',
    component: FlashcardEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlashcardEditPageRoutingModule {}
