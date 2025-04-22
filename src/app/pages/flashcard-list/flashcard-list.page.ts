import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardSet } from '../../models/flashcard.model';
import { FlashcardService } from '../../services/flashcard.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-flashcard-list',
  standalone: false,
  templateUrl: './flashcard-list.page.html',
  styleUrls: ['./flashcard-list.page.scss'],
})
export class FlashcardListPage implements OnInit {
  flashcardSets: (FlashcardSet & { selected?: boolean })[] = [];
  deleteMode = false;

  constructor(
    private flashcardService: FlashcardService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    this.loadFlashcardSets();
  }

  loadFlashcardSets() {
    this.flashcardService.getFlashcardSets().subscribe(data => {
      this.flashcardSets = data.map(set => ({ ...set, selected: false }));
    });
  }
  hasSelectedSets(): boolean {
    return this.flashcardSets.some(set => set.selected);
  }
  
  viewSet(id: string) {
    if (this.deleteMode) return; // block navigation in delete mode
    this.router.navigate(['/flashcard', id]);
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    if (!this.deleteMode) {
      this.flashcardSets.forEach(set => (set.selected = false));
    }
  }

  goBack() {
    this.navCtrl.navigateRoot(['/home']);
  }
  deleteSelectedSets() {
    const selected = this.flashcardSets.filter(set => set.selected);
    selected.forEach(set => {
      if (set.id) {
        this.flashcardService.deleteFlashcardSet(set.id);
      }
    });
    this.deleteMode = false;
  }
}
