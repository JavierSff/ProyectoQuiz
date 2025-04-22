import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../services/profile-service.service';
import { StudyGoalsWidgetComponent } from '../components/study-goals-widget/study-goals-widget.component';


const { API_URL, API_KEY } = environment.weatherApi;

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

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public httpClient: HttpClient,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadDailyTip();
    this.loadProfileInfo();
  }

  async loadProfileInfo() {
    const profileData = await this.profileService.getProfileData();
    this.profileImage = profileData?.['profileImage'] || 'assets/noprofile.jpg';
    this.fullName = profileData?.['fullName'] || 'Your Name';
    
  }

  loadData() {
    this.httpClient
      .get(`${API_URL}/weather?q=Madrid&appid=${API_KEY}`)
      .subscribe((results: any) => {
        this.weatherTemp = results['main'];
        this.cityName = results['name'];
        this.weatherDetails = results['weather'][0];
        this.weatherIcon = `https://openweathermap.org/img/wn/${this.weatherDetails.icon}@4x.png`;
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
