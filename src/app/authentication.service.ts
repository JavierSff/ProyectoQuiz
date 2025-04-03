import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public ngFireAuth: AngularFireAuth) { }

  async registerUser (email: string, password: string, fullname: any){

    return await this.ngFireAuth.createUserWithEmailAndPassword(email,password)
  }
  async loginUser(email: string, password: string) {
    try {
      const userCredential = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
      return userCredential.user;  // This returns the authenticated user
    } catch (error) {
      throw error;  // Propagate the error to be handled in the component
    }
  }

  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);

  }
  async getProfile() {
    return await this.ngFireAuth.signOut()
  }

  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  

}