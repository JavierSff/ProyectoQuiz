import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, query, where, getDocs } from '@angular/fire/firestore';

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

  // Method to retrieve events from Firestore for a specific date
  async getEventsByDate(date: string): Promise<string[]> {
    const eventsRef = collection(this.firestore, 'events');
    const q = query(eventsRef, where('date', '==', date));  // Filter events by the selected date

    try {
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => doc.data()['title']);
      return events;
    } catch (error) {
      console.error("Error retrieving events: ", error);
      throw error;
    }
  } 

  // Method to retrieve all events (to populate datesWithEvents)
  async getAllEvents(): Promise<any[]> {
    const eventsRef = collection(this.firestore, 'events');
    try {
      const querySnapshot = await getDocs(eventsRef);
      const events = querySnapshot.docs.map(doc => doc.data());
      return events;
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }
}
