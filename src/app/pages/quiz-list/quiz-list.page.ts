import { Component, OnInit } from '@angular/core';
import { QuizService, Quiz } from 'src/app/services/quiz-service.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-list',
  standalone: false,
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
})
export class QuizListPage implements OnInit {
  quizzes: Quiz[] = [];
  userId: string = '';

  constructor(
    private quizService: QuizService,
    private authService: AuthenticationService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user?.uid || '';
      this.quizService.getQuizzes(this.userId).subscribe(data => {
        this.quizzes = data;
      });
    });
  }

  takeQuiz(id: string) {
    this.navCtrl.navigateForward(['/quiz-runner', id]);
  }

  createQuiz() {
    this.navCtrl.navigateForward(['/quiz-creator']);
  }
}
