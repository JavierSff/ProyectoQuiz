import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: Firestore,
    private authService: AuthenticationService // Inject the authentication service
  ) {}

  // Method to upload profile information to Firestore
  async uploadProfile(profileData: any) {
    try {
      const user = await this.authService.getProfile(); // Get the current user
      if (user) {
        // Check if the user already has a profile document
        const userProfileDocRef = doc(this.firestore, `profiles/${user.uid}`);
        const userProfileDoc = await getDoc(userProfileDocRef);

        if (userProfileDoc.exists()) {
          // If the profile document exists, update it
          await updateDoc(userProfileDocRef, profileData);
        } else {
          // If the profile document does not exist, create one
          await addDoc(collection(this.firestore, 'profiles'), {
            userId: user.uid,
            ...profileData
          });
        }
      }
    } catch (error) {
      throw new Error('Error uploading profile data: ' + error);
    }
  }

  // Method to get the current user's profile from Firestore
  async getUserProfile() {
    const user = await this.authService.getProfile(); // Get the current user

    if (user) {
      const userProfileDocRef = doc(this.firestore, `profiles/${user.uid}`);
      const userProfileDoc = await getDoc(userProfileDocRef);
      if (userProfileDoc.exists()) {
        return userProfileDoc.data(); // Return profile data if it exists
      } else {
        return null; // Return null if no profile is found
      }
    }

    return null; // Return null if no user is logged in
  }
}
