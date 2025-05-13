import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private firestore: Firestore) {}

  // Method to add an event to Firestore
  addEvent(event: { title: string, date: string, time?: string, createdAt: Date }) {
    const eventRef = collection(this.firestore, 'events');
    return addDoc(eventRef, event);
  }

  // Method to retrieve events from Firestore for a specific date
  async getEventsByDate(date: string): Promise<any[]> {
    const eventsRef = collection(this.firestore, 'events');
    const q = query(eventsRef, where('date', '==', date));

    try {
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      return events;
    } catch (error) {
      console.error("Error retrieving events: ", error);
      throw error;
    }
  }
  // event-service.service.ts
  getTodayEvents(): Promise<any[]> {
    const today = new Date();
    const yyyyMMdd = today.toISOString().split('T')[0];
    return this.getEventsByDate(yyyyMMdd); // ✅ this is already a Promise
  }

  // Method to retrieve all events (to populate calendar highlights)
  async getAllEvents(): Promise<any[]> {
    const eventsRef = collection(this.firestore, 'events');
    try {
      const querySnapshot = await getDocs(eventsRef);
      const events = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      return events;
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }

  // Method to delete an event by document ID
  async deleteEvent(event: { id: string }) {
    try {
      const eventDocRef = doc(this.firestore, `events/${event.id}`);
      await deleteDoc(eventDocRef);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}
