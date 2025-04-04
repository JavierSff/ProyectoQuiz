
import { Component, Input, OnInit } from '@angular/core';
import { Journal, JournalServiceService } from 'src/app/services/journal-service.service';


@Component({
  selector: 'app-journal',
  standalone: false,
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
@Input() id :string
journal : Journal
  constructor(private journalService:JournalServiceService) {
  
   }

  ngOnInit() {
    console.log(this.id);
    this.journalService.getJournalById(this.id).subscribe(res =>{
      this.journal = res
    })
  }

}
