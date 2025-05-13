
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
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
  constructor(private journalService:JournalServiceService,private toastCtrl:ToastController, private modalCtrl: ModalController) {
  
   }
/** retrieves journals by id when loading screen */
  ngOnInit() {
    console.log(this.id);
    this.journalService.getJournalById(this.id).subscribe(res =>{
      this.journal = res
    })
  }
  /** updates journal when there are changes */
  async updateJournal(){
    this.journalService.updateJournal(this.journal)
    const toast = await this.toastCtrl.create({
      message:'Note Updated',
      duration: 2000
    })
    toast.present()
    this.modalCtrl.dismiss()
  }
  /** allows deleting journals */
  async deleteJournal(){
    this.journalService.removeJournal(this.id)
    const toast = await this.toastCtrl.create({
      message:'Note Succesfully deleted',
      duration: 2000
    })
    toast.present()
    this.modalCtrl.dismiss()
  }
}
