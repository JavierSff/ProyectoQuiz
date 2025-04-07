import { Component, OnInit } from '@angular/core';

import { ToastController } from '@ionic/angular'; // If you want to show success/failure toast notifications
import { EventService } from 'src/app/services/event-service.service';

@Component({
  selector: 'app-planner',
  standalone: false,
  templateUrl: 'planner.page.html',
  styleUrls: ['planner.page.scss'],
})
export class PlannerPage implements OnInit {

  selectedDate: string;
  eventsForSelectedDate: string[] = [];
  newEvent: string = '';  // Variable for storing the new event entered by the user

  events: { [key: string]: string[] } = {
    '2025-04-07': ['Event 1: Meeting with John', 'Event 2: Lunch with Sarah'],
    '2025-04-08': ['Event 1: Conference'],
    '2025-04-09': ['Event 1: Doctor Appointment', 'Event 2: Dinner with Friends']
  };

  constructor(
    private eventService: EventService,  // Inject EventService
    private toastCtrl: ToastController  // Inject ToastController to show success/error messages
  ) {
    this.selectedDate = new Date().toISOString(); // Default to today's date
  }

  ngOnInit() {
    // Fetch the events for the selected date when the page loads
    this.fetchEventsForSelectedDate();
  }

  // Method to retrieve events from Firestore for the selected date
  async fetchEventsForSelectedDate() {
    try {
      const events = await this.eventService.getEventsByDate(this.selectedDate);
      this.eventsForSelectedDate = events;  // Store the fetched events in the array
    } catch (error) {
      console.error("Error fetching events:", error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to load events.',
        duration: 2000
      });
      toast.present();
    }
  }

  onDateChange(event: any) {
    const selectedDateString = event.detail.value;
    this.selectedDate = selectedDateString;  // Update the selected date
    this.fetchEventsForSelectedDate();  // Re-fetch events for the new date
  }

  // Method to add a new event to Firestore
  async addEvent() {
    if (this.newEvent.trim() !== '') {
      const event = {
        title: this.newEvent.trim(),
        date: this.selectedDate,
        createdAt: new Date() // Timestamp for when the event was added
      };

      try {
        // Call the addEvent method in EventService to store the event in Firebase
        await this.eventService.addEvent(event);
        
        // Show success message
        const toast = await this.toastCtrl.create({
          message: 'Event added successfully!',
          duration: 2000
        });
        toast.present();

        // Re-fetch the events after adding the new one
        this.fetchEventsForSelectedDate();

        // Clear the input field
        this.newEvent = '';
      } catch (error) {
        // Show error message if there is a failure
        const toast = await this.toastCtrl.create({
          message: 'Error adding event: ' + error,
          duration: 2000
        });
        toast.present();
      }
    }
  }
}
