import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FlashcardSet } from '../../models/flashcard.model';
import { FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-flashcard-list',
  standalone: false,
  templateUrl: './flashcard-list.page.html',
  styleUrls: ['./flashcard-list.page.scss'],
})
export class FlashcardListPage implements OnInit {
  flashcardSets: FlashcardSet[] = [];

  constructor(private flashcardService: FlashcardService, private router: Router) {}

  ngOnInit() {
    this.flashcardService.getFlashcardSets().subscribe(data => {
      this.flashcardSets = data;
    });
  }

  viewSet(id: string) {
    this.router.navigate(['/flashcard', id]);

  }
}
