import { Component, OnInit,ViewChild } from '@angular/core';
import { IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthenticationService } from 'src/app/authentication.service';
import { Journal, JournalServiceService } from 'src/app/services/journal-service.service';
import { JournalPage } from '../journal/journal.page';

@Component({
  selector: 'app-journals',
  standalone: false,
  templateUrl: './journals.page.html',
  styleUrls: ['./journals.page.scss'],
})
export class JournalsPage implements OnInit {
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();
      // Handles every call to load data
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
  @ViewChild(IonModal) modal: IonModal;

  title:string
  note:string
  userId:any

  selectedJournal:Journal={
  userId: '',
  title: '',
  content: '',
  createdAt: undefined,
}
  journals:Journal[] = []
  constructor(private modalCtrl: ModalController,private toastCtrl: ToastController,private loadingController: LoadingController,private journalServive:JournalServiceService,private authService:AuthenticationService) {
   }

/** Allows adding new journals */
  addJournal(){
       
      this.journalServive.addJournal(
        {userId:"", title:this.title,content:this.note,createdAt:new Date()}
      )?.then(async ()=>{
        this.title =''
        this.note = ''
        const toast = await this.toastCtrl.create({
          message: "Note added successfully",
          duration:2000
        })
        toast.present()
      }).catch(async (error)=>{
        const toast = await this.toastCtrl.create({
          message: error,
          duration:2000
        })
        toast.present()
        
      })
    
  }
 /** Dismisses actions */
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }
  
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(ev.detail.data);
    }
  }
/** Confirms changes */
  confirm() {
    this.modal.dismiss('confirm');
    this.addJournal()
  }
/** retrieves profile data */
  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user?.uid;
      console.log(user?.uid);
      this.journalServive.getJournals(this.userId).subscribe(res =>{
        this.journals = res
        console.log(this.journals);
        
    })
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }
/** Opens journal data */
  async openJournal(journal:Journal){
    const modal = await this.modalCtrl.create({
      component:JournalPage,
      componentProps:{id:journal.id},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6
    })

    await modal.present()
  }

}