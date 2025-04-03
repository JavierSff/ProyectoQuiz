import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class JournalServiceService {
  userId:any
  constructor(private authService:AuthenticationService) { 
    this.authService.getProfile().then(user =>{
      this.userId = user.uid
      console.log(this.userId);
    })
  }
}
