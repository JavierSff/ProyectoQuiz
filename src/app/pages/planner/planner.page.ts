import { Component } from '@angular/core';

@Component({
  selector: 'app-planner',
  standalone: false,
  templateUrl: 'planner.page.html',
  styleUrls: ['planner.page.scss'],
})
export class PlannerPage {

  selectedDate: string;
  eventsForSelectedDate: string[] = [];
  newEvent: string = ''; // Variable for storing the new event entered by the user

  events: { [key: string]: string[] } = {
    '2025-04-07': ['Event 1: Meeting with John', 'Event 2: Lunch with Sarah'],
    '2025-04-08': ['Event 1: Conference'],
    '2025-04-09': ['Event 1: Doctor Appointment', 'Event 2: Dinner with Friends']
  };

  constructor() {
    this.selectedDate = new Date().toISOString(); // Default to today's date
  }

  onDateChange(event: any) {
    const selectedDateString = event.detail.value;
    this.eventsForSelectedDate = this.events[selectedDateString] || [];
  }

  // Function to add new event to the selected date
  addEvent() {
    if (this.newEvent.trim() !== '') {
      // Check if the selected date already has events
      if (!this.events[this.selectedDate]) {
        this.events[this.selectedDate] = [];
      }
      
      // Add the new event to the events list for the selected date
      this.events[this.selectedDate].push(this.newEvent.trim());

      // Update the displayed events list
      this.eventsForSelectedDate = this.events[this.selectedDate];
      
      // Clear the new event input field
      this.newEvent = '';
    }
  }
}
