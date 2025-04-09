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
        this.statsKeys = Object.keys(this.stats); // Populate the keys (quiz titles)
      }
    });
  }
  getIconName(quizTitle: string): string {
    const icons: { [key: string]: string } = {
      'Fruits': 'nutrition',
      'Hydration': 'water',
      'Yoga': 'accessibility',
      // Add more as needed
    };
    return icons[quizTitle] || 'help-circle';
  }
  
  getGoalText(quizTitle: string): string {
    const goals: { [key: string]: string } = {
      'Fruits': 'Watermelon every day',
      'Hydration': '8 cups a day',
      'Yoga': '5 exercises',
      // Add more as needed
    };
    return goals[quizTitle] || 'No goal set';
  }
  
  getProgress(score: number, total: number): number {
    return total > 0 ? score / total : 0;
  }
  getProgressPercent(score: number, total: number): number {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  }
  
  
  
  // Add this method to clear statistics
  clearStats() {
    this.authService.getProfile().then(user => {
      if (user) {
        this.statsService.clearUserStats(user.uid); // Clear stats for the logged-in user
        this.stats = {}; // Reset the stats in the component
        this.statsKeys = []; // Reset the keys
      }
    });
  }
}
