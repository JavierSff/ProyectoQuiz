import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';  // Import AuthenticationService
import { Router } from '@angular/router';  // Import Router to navigate after logout

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private authService: AuthenticationService, private router: Router) {}

  // Logout function
  async logout() {
    try {
      await this.authService.signOut();
      console.log('User logged out');
      // Redirect user to login page after logout
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  }
}
