import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private firestore: Firestore) {}

  // Method to add an event to Firestore
  addEvent(event: { title: string, date: string, createdAt: Date }) {
    const eventRef = collection(this.firestore, 'events');
    return addDoc(eventRef, event);
  }

  // Method to retrieve events from Firestore
  async getEventsByDate(date: string): Promise<string[]> {
    const eventsRef = collection(this.firestore, 'events');
    const q = query(eventsRef, where('date', '==', date));  // Filter events by the selected date

    try {
      const querySnapshot = await getDocs(q);
      // Access the 'title' property using bracket notation
      const events = querySnapshot.docs.map(doc => doc.data()['title']);  // Get the event titles
      return events;
    } catch (error) {
      console.error("Error retrieving events: ", error);
      throw error;
    }
  }
}
