import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EventService } from 'src/app/services/event-service.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-planner',
  standalone: false,
  templateUrl: 'planner.page.html',
  styleUrls: ['planner.page.scss'],
})
export class PlannerPage implements OnInit {

  selectedDate: string;
  eventsForSelectedDate: string[] = [];
  newEvent: string = '';  

  constructor(
    private eventService: EventService,
    private toastCtrl: ToastController,
    private router: Router,  // Inject the router
    private activatedRoute: ActivatedRoute  // Inject ActivatedRoute to get route parameters (optional)
  ) {
    this.selectedDate = new Date().toISOString().split('T')[0]; // Set the date format
  }

  ngOnInit() {
    console.log('PlannerPage initialized!');
    this.fetchEventsForSelectedDate();  // Fetch events on init

    // Listen to router events to trigger a reload of events when the page is navigated to
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fetchEventsForSelectedDate();  // Re-fetch events when the page is navigated to (or reloaded)
    });
  }

  // Method to fetch events for the selected date
  async fetchEventsForSelectedDate() {
    try {
      console.log('Fetching events for:', this.selectedDate);  
      const events = await this.eventService.getEventsByDate(this.selectedDate);
      console.log('Fetched events:', events);
      this.eventsForSelectedDate = events;  
    } catch (error) {
      console.error("Error fetching events:", error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to load events.',
        duration: 2000
      });
      toast.present();
    }
  }

  // Date change event handler
  onDateChange(event: any) {
    const selectedDateString = event.detail.value;
    this.selectedDate = selectedDateString;  
    this.fetchEventsForSelectedDate();  
  }

  // Method to add a new event
  async addEvent() {
    if (this.newEvent.trim() !== '') {
      const event = {
        title: this.newEvent.trim(),
        date: this.selectedDate,
        createdAt: new Date() // Timestamp for when the event was added
      };

      try {
        await this.eventService.addEvent(event);
        const toast = await this.toastCtrl.create({
          message: 'Event added successfully!',
          duration: 2000
        });
        toast.present();

        // Re-fetch events after adding a new one
        this.fetchEventsForSelectedDate();

        // Clear the input field
        this.newEvent = '';
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Error adding event: ' + error,
          duration: 2000
        });
        toast.present();
      }
    }
  }
}
