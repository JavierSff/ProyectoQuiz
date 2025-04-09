import { Component, OnInit, ChangeDetectorRef, NgZone, AfterViewInit } from '@angular/core';
import { IonDatetime, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { EventService } from 'src/app/services/event-service.service';
import { AddEventModal } from './add-event.modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: 'planner.page.html',
  styleUrls: ['planner.page.scss'],
})
export class PlannerPage implements OnInit, AfterViewInit {
  selectedDate: string;
  eventsForSelectedDate: any[] = [];
  events: { [key: string]: any[] } = {};
  minDate: string;
  maxDate: string;
  highlightedDatesArray: { date: string; textColor: string; backgroundColor: string }[] = [];

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

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.fetchAllEvents().then(() => {
      this.fetchEventsForSelectedDate();
      this.cdr.detectChanges();
    });
  }

  async fetchAllEvents() {
    const events = await this.eventService.getAllEvents();
    this.events = {};
    this.highlightedDatesArray = [];

    events.forEach(event => {
      const date = event.date;
      if (!this.events[date]) this.events[date] = [];
      this.events[date].push(event);

      this.highlightedDatesArray.push({
        date,
        textColor: '#ffffff',
        backgroundColor: '#ff4081',
      });
    });

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
      componentProps: { selectedDate: this.selectedDate },
    });

    modal.onDidDismiss().then(() => {
      this.fetchAllEvents();
    });

    await modal.present();
  }
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.fetchAllEvents().then(() => {
        this.fetchEventsForSelectedDate();
        (event.target as HTMLIonRefresherElement).complete();

      });
    }, 1000); // Optional: wait 1 second for UX
  }
  
  async deleteEvent(eventToDelete: any) {
    await this.eventService.deleteEvent(eventToDelete);
    const toast = await this.toastCtrl.create({
      message: 'Event deleted',
      duration: 1500,
    });
    toast.present();
    this.fetchAllEvents();
  }

  // no longer needed: highlightedDatesFunc
}
