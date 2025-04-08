import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { ProfileService } from 'src/app/services/profile-service.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  fullName: string = '';
  username: string = '';
  email: string = '';
  phone: string = '';
  profileImage: string | null = null;
  isEditing: boolean = false; // Flag to toggle between edit and view mode

  constructor(
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadProfile();
  }
  
  async loadProfile() {
    try {
      const userProfile = await this.profileService.loadProfile(); // Fetch profile data from service
      this.fullName = userProfile?.['fullName'] || 'John Doe';
      this.username = userProfile?.['username'] || 'johndoe';
      this.email = userProfile?.['email'] || 'johndoe@example.com';
      this.phone = userProfile?.['phone'] || '+123 456 7890';
      this.profileImage = userProfile?.['profileImage'] || null;
    } catch (error) {
      console.error('Failed to load profile data', error);  // Log the error for debugging
      const toast = await this.toastCtrl.create({
        message: 'Failed to load profile data',
        duration: 2000,
      });
      toast.present();
    }
  }
  

  // Handle the "Edit Profile" button click
  editProfile() {
    if (this.isEditing) {
      // Save changes when exiting edit mode
      this.saveProfile();
    } else {
      // Switch to edit mode
      this.isEditing = true;
    }
  }

  // Save profile changes
  async saveProfile() {
    try {
      const updatedProfile = {
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        profileImage: this.profileImage,
      };

      await this.profileService.uploadProfile(updatedProfile);
      const toast = await this.toastCtrl.create({
        message: 'Profile updated successfully',
        duration: 2000,
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to update profile',
        duration: 2000,
      });
      toast.present();
    } finally {
      // After saving the changes, exit edit mode
      this.isEditing = false;
    }
  }

  // Log the user out
  async logout() {
    try {
      await this.authService.signOut();
      const toast = await this.toastCtrl.create({
        message: 'Logged out successfully',
        duration: 2000,
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Logout failed. Please try again.',
        duration: 2000,
      });
      toast.present();
    }
  }
}
