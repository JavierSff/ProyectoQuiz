import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../services/profile-service.service';
import { EventService } from '../services/event-service.service';

const { API_URL, API_KEY } = environment.weatherApi;

const weatherIconMap = {
  '01d': 'sunny.svg',
  '02d': 'partly-cloudy.svg',
  '03d': 'cloudy.svg',
  '04d': 'broken-clouds.svg',
  '09d': 'shower-rain.svg',
  '10d': 'rainy.svg',
  '11d': 'thunderstorm.svg',
  '13d': 'snowy.svg',
  '50d': 'mist.svg',
  '01n': 'clear-night.svg',
  '02n': 'partly-cloudy-night.svg',
  '03n': 'cloudy-night.svg',
  '04n': 'broken-clouds-night.svg',
  '09n': 'shower-rain-night.svg',
  '10n': 'rainy-night.svg',
  '11n': 'thunderstorm-night.svg',
  '13n': 'snowy-night.svg',
  '50n': 'mist-night.svg',
};

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  profileImage: string = '';
  fullName: string = '';
  tipOfTheDay: string = '';
  weatherTemp: any;
  todayDate = new Date();
  cityName: any;
  weatherIcon: any;
  weatherDetails: any;
  todayEvents: any[] = []; // You can change 'any' to your proper event model if defined


  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public httpClient: HttpClient,
    private profileService: ProfileService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadDailyTip();
    this.loadProfileInfo();
    this.loadTodayEvents();
  }

  async loadProfileInfo() {
    const profileData = await this.profileService.getProfileData();
    this.profileImage = profileData?.['profileImage'] || 'assets/noprofile.jpg';
    this.fullName = profileData?.['fullName'] || 'Your Name';
  }
  loadTodayEvents() {
    this.eventService.getTodayEvents().then(events => {
      this.todayEvents = events;
    });
  }
  loadData() {
    this.httpClient
      .get(`${API_URL}/weather?q=Madrid&appid=${API_KEY}&units=metric`)
      .subscribe((results: any) => {
        this.weatherTemp = results['main'];
        this.cityName = results['name'];
        this.weatherDetails = results['weather'][0];
        const iconCode = this.weatherDetails.icon;
        this.weatherIcon = `assets/weather-icons/${weatherIconMap[iconCode] || 'default.svg'}`;
      });
  }

  loadDailyTip() {
    this.httpClient.get<any>('assets/student-tips.json').subscribe((data) => {
      const dayIndex = new Date().getDate() % data.tips.length;
      this.tipOfTheDay = data.tips[dayIndex];
    });
  }

  handleRefresh(event: CustomEvent) {
    this.loadData();
    this.loadDailyTip();
    this.loadProfileInfo();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  }
}
