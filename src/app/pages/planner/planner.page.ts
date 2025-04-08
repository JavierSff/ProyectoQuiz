import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { EventService } from 'src/app/services/event-service.service';
import { AddEventModal } from './add-event.modal';



@Component({
  selector: 'app-planner',
  standalone: false,
  templateUrl: 'planner.page.html',
  styleUrls: ['planner.page.scss'],
})
export class PlannerPage implements OnInit {
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
  selectedDate: string;
  eventsForSelectedDate: any[] = [];
  events: { [key: string]: any[] } = {};
  minDate: string;
  maxDate: string;
  highlightedDates: { [key: string]: boolean } = {};

  constructor(
    private eventService: EventService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone 
  ) {
    const currentDate = new Date();
    this.selectedDate = currentDate.toISOString().split('T')[0];
    this.minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).toISOString().split('T')[0];
    this.maxDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2)).toISOString().split('T')[0];
  }

  ngOnInit() {
    this.fetchAllEvents().then(() => {
      // Ensure Angular runs in the correct zone
      this.ngZone.run(() => {
        setTimeout(() => {
          this.fetchEventsForSelectedDate();
          this.cdr.markForCheck(); // Mark for change detection
        }, 0);
      });
    });
  }
  
  
  async fetchAllEvents() {
    const events = await this.eventService.getAllEvents();
    this.events = {};
    this.highlightedDates = {};

    events.forEach(event => {
      const date = event.date;
      if (!this.events[date]) this.events[date] = [];
      this.events[date].push(event);
      this.highlightedDates[date] = true;
    });

    this.fetchEventsForSelectedDate();
    this.cdr.detectChanges();
  }

  fetchEventsForSelectedDate() {
    this.eventsForSelectedDate = this.events[this.selectedDate] || [];
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value.split('T')[0];
    this.fetchEventsForSelectedDate();
  }

  async openAddEventModal() {
    const modal = await this.modalCtrl.create({
      component: AddEventModal,
      componentProps: { selectedDate: this.selectedDate }
    });

    modal.onDidDismiss().then(() => {
      this.fetchAllEvents();
    });

    await modal.present();
  }

  async deleteEvent(eventToDelete: any) {
    await this.eventService.deleteEvent(eventToDelete);
    const toast = await this.toastCtrl.create({
      message: 'Event deleted',
      duration: 1500
    });
    toast.present();
    this.fetchAllEvents();
  }

  highlightedDatesFunc = (isoString: string) => {
    if (this.highlightedDates[isoString]) {
      return {
        textColor: '#fff',
        backgroundColor: '#ff4081',
      };
    }
    return undefined;
  };
}
