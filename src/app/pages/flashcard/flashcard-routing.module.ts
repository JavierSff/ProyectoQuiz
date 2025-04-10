import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashcardPage } from './flashcard.page';  // Import the renamed component

const routes: Routes = [
  {
    path: '',
    component: FlashcardPage,  // Use the updated name here
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlashcardPageRoutingModule {}
