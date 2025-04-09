import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { QuizService } from 'src/app/services/quiz-service.service';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  stats: {
    [key: string]: {
      highestScore: number;
      totalQuestions: number;
      backgroundImage?: string;
    };
  } = {};
  statsKeys: string[] = [];

  constructor(
    private statsService: StatisticsService,
    private authService: AuthenticationService,
    private quizService: QuizService
  ) {}

  async ngOnInit() {
    const user = await this.authService.getProfile();
    if (user) {
      const uid = user.uid;
      const statsRaw = this.statsService.getUserStatistics(uid); // returns a plain object
      const quizzes = await this.quizService.getQuizzesOnce(uid); // ✅ now a Promise

      const combinedStats: any = {};
      for (const title in statsRaw) {
        const stat = statsRaw[title];
        const quizMatch = quizzes.find((q: any) => q.title === title);

        combinedStats[title] = {
          ...stat,
          backgroundImage: quizMatch?.backgroundImage || '',
        };
      }

      this.stats = combinedStats;
      this.statsKeys = Object.keys(this.stats);
    }
  }

  clearStats() {
    this.authService.getProfile().then(user => {
      if (user) {
        this.statsService.clearUserStats(user.uid);
        this.stats = {};
        this.statsKeys = [];
      }
    });
  }

  getProgressPercent(score: number, total: number): number {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  }

  getIconByBackground(bgPath: string): string {
    const iconMap: { [key: string]: string } = {
      '/assets/fondocards.png': 'american-football-outline',
      '/assets/brightgrey.svg': 'calculator',
      '/assets/brightpink.svg': 'globe',
      '/assets/brightpurple.svg': 'library',
      '/assets/darkgrey.svg': 'cafe-outline',
      '/assets/darkpink.svg': 'extension-puzzle-outline',
      '/assets/grassgreen.svg': 'leaf-outline',
      '/assets/lila.svg': 'bug-outline',

    };
    return iconMap[bgPath] || 'help-circle';
  }

  getAvatarStyle(imagePath: string): any {
    if (imagePath) {
      return {
        'background-image': `url(${imagePath})`,
        'background-size': 'cover',
        'background-position': 'center',
      };
    } else {
      return {
        'background-color': '#e0e0e0',
      };
    }
  }
}
