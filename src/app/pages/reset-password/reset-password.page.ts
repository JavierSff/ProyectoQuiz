import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';  // Import the ToastController
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';  // Bind the email input field to this variable

  constructor(
    private authService: AuthenticationService,  // Inject AuthenticationService
    private toastController: ToastController      // Inject ToastController
  ) {}

  async reset() {
    if (this.email.trim() === '') {
      // Show a toast if the email is empty
      this.presentToast('Please enter a valid email address.');
      return;
    }

    try {
      // Call the resetPassword method from AuthenticationService
      await this.authService.resetPassword(this.email);
      // Show a success toast
      this.presentToast('Password reset link sent to your email!');
    } catch (error) {
      // Show an error toast if something went wrong
      this.presentToast(error.message);
    }
  }

  // Function to display a toast message
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
