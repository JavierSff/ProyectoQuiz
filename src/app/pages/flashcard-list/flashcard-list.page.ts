import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardSet } from '../../models/flashcard.model';
import { FlashcardService } from '../../services/flashcard.service';
import { NavController } from '@ionic/angular';
import { IonHeader, IonCheckbox } from "@ionic/angular/standalone";

@Component({
  selector: 'app-flashcard-list',
  standalone: false,
  templateUrl: './flashcard-list.page.html',
  styleUrls: ['./flashcard-list.page.scss'],
  
})
export class FlashcardListPage implements OnInit {
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
  flashcardSets: (FlashcardSet & { selected?: boolean })[] = [];
  deleteMode = false;
  newQuestion = '';
  newAnswer = '';


  constructor(
    private flashcardService: FlashcardService,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  /**loads flashcards when opening the page */
  ngOnInit() {
    this.loadFlashcardSets();
  }
  /** Allows editing flashcard sets */
  editSet(id: string) {
    this.router.navigate([`/flashcard/${id}/edit`]);
  }
  /** Loads flashcard sets */
  loadFlashcardSets() {
    this.flashcardService.getFlashcardSets().subscribe(data => {
      this.flashcardSets = data.map(set => ({ ...set, selected: false }));
    });
  }
  /** Shows selected sets */
  hasSelectedSets(): boolean {
    return this.flashcardSets.some(set => set.selected);
  }
/** Allows set viewing */
  viewSet(id: string) {
    if (this.deleteMode) return; // block navigation in delete mode
    this.router.navigate(['/flashcard', id]);
  }
/** little toggle for allowinf delete */
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    if (!this.deleteMode) {
      this.flashcardSets.forEach(set => (set.selected = false));
    }
  }
/** Returns to previous screen */
  goBack() {
    this.navCtrl.navigateRoot(['/home']);
  }
  /** Deletes selections */
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
