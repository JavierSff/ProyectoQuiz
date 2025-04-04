import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';  // Import AuthenticationService
import { Router } from '@angular/router';  // Import Router to navigate after logout
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const { API_URL, API_KEY } = environment.weatherApi;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  weatherTemp: any
  todayDate = new Date()
  cityName: any
  weatherIcon:any
  weatherDetails: any
  constructor(private authService: AuthenticationService, private router: Router, public httpClient:HttpClient) {}

  loadData(){
    this.httpClient.get(`${API_URL}/weather?q=${"Madrid"}&appid=${API_KEY}`).subscribe(results =>
    {
      console.log(results);
      this.weatherTemp = results['main']
      this.cityName = results['name']
      console.log(this.weatherTemp);
      this.weatherDetails = results['weather'][0]
      console.log(this.weatherDetails);
      this.weatherIcon = `https://openweathermap.org/img/wn/${this.weatherDetails.icon}@4x.png`
    })
  }
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
  ngOnInit() {
    this.loadData();
  }
}
