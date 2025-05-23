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
/** preload of screen */
  async ngOnInit() {
    const user = await this.authService.getProfile();
    if (user) {
      const uid = user.uid;
      const statsRaw = this.statsService.getUserStatistics(uid); // returns a plain object
      const quizzes = await this.quizService.getQuizzesOnce(uid); // returns a Promise

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
/** Clear the currently shown stats */
  clearStats() {
    this.authService.getProfile().then(user => {
      if (user) {
        this.statsService.clearUserStats(user.uid);
        this.stats = {};
        this.statsKeys = [];
      }
    });
  }
/** retrieves the user progress */
  getProgressPercent(score: number, total: number): number {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  }
/** Retrieves the icon correspondig to each background */
  getIconByBackground(bgPath: string): string {
    const iconMap: { [key: string]: string } = {
      '/assets/lightorange.png': 'american-football-outline',
      '/assets/brightgrey.svg': 'calculator',
      '/assets/brightpink.svg': 'globe',
      '/assets/brightpurple.svg': 'library',
      '/assets/darkgrey.svg': 'cafe-outline',
      '/assets/darkpink.svg': 'extension-puzzle-outline',
      '/assets/grassgreen.svg': 'leaf-outline',
      '/assets/lila.svg': 'color-palette-outline',
      '/assets/green.png': 'bug-outline',
      '/assets/mustard.png': 'earth-outline',
      '/assets/palegreen.png': 'desktop-outline',
      '/assets/turquoise.png': 'flask-outline',
      '/assets/violet.png': 'language-outline',
      '/assets/wine.png': 'podium-outline',

    };
    return iconMap[bgPath] || 'help-circle';
  }
/** Retrieves the avatar corresponfing each background */
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
