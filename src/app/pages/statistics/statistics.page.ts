import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { StatisticsService } from 'src/app/services/statistics.service'; // Already imported

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  stats: { [key: string]: { highestScore: number; totalQuestions: number } } = {};
  statsKeys: string[] = [];  // Array to store the keys of the stats object

  constructor(
    private statsService: StatisticsService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authService.getProfile().then(user => {
      if (user) {
        this.stats = this.statsService.getUserStatistics(user.uid); // Get statistics for the logged-in user
        // Populate the keys of the stats object for the template
        this.statsKeys = Object.keys(this.stats);
      }
    });
  }
  
}
