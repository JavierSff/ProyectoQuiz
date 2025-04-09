import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from 'src/app/services/event-service.service';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-event.modal.html',
  styleUrls: ['add-event.modal.scss'],
})
export class AddEventModal {
  @Input() selectedDate: string = '';
  title: string = '';
  time: string = '';

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private eventService: EventService
  ) {}

  async saveEvent() {
    if (!this.title.trim()) return;

    const event = {
      title: this.title.trim(),
      date: this.selectedDate,
      time: this.time,
      createdAt: new Date(),
    };

    await this.eventService.addEvent(event);
    const toast = await this.toastCtrl.create({ message: 'Event added!', duration: 1500 });
    toast.present();
    this.modalCtrl.dismiss();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
