// profile-service.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private firestore: Firestore,
    private authService: AuthenticationService
  ) {}

  async uploadProfile(profileData: any) {
    try {
      const user = await this.authService.getProfile();
      if (!user) throw new Error('User not authenticated');

      const userProfileDocRef = doc(this.firestore, `profiles/${user.uid}`);
      const userProfileDoc = await getDoc(userProfileDocRef);

      if (userProfileDoc.exists()) {
        await updateDoc(userProfileDocRef, profileData);
      } else {
        await setDoc(userProfileDocRef, {
          userId: user.uid,
          ...profileData
        });
      }
    } catch (error) {
      throw new Error('Error uploading profile data: ' + error);
    }
  }

  async loadProfile() {
    return this.getUserProfile();
  }

  async getUserProfile() {
    const user = await this.authService.getProfile();
    if (!user) return null;

    const userProfileDocRef = doc(this.firestore, `profiles/${user.uid}`);
    const userProfileDoc = await getDoc(userProfileDocRef);

    return userProfileDoc.exists() ? userProfileDoc.data() : null;
  }
}
