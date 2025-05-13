import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { QuizService } from 'src/app/services/quiz-service.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { StatisticsService } from 'src/app/services/statistics.service'; // already added before


interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-quiz-runner',
  standalone: false,
  templateUrl: './quiz-runner.page.html',
  styleUrls: ['./quiz-runner.page.scss'],
})
export class QuizRunnerPage implements OnInit {
  currentQuestionIndex = 0;
  selectedOptionIndex: number | null = null;
  score = 0;
  showResult = false;
  hasAnswered = false;
  quizTitle: string = '';

  questions: Question[] = [];

  deleteMode = false; // 🔁 nuevo estado para mostrar/hide botones

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private statsService: StatisticsService,
    private authService: AuthenticationService 
  ) {}
  
/** allows user to go out of the quiz runner */
  goBack() {
    this.navCtrl.navigateBack('/quiz-list');
  }
/** toggles delete for quizzes */
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode; // 🔁 alternar modo eliminar
  }
/** preloads page info */
  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.quizService.getQuizById(quizId).subscribe(quiz => {
        this.questions = quiz.questions;
        this.quizTitle = quiz.title;
      });
    }
  }
/** allows selection */
  selectOption(index: number) {
    if (this.hasAnswered) return;

    this.selectedOptionIndex = index;
    this.hasAnswered = true;

    if (index === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.score++;
    }
  }
/** allows user to go to the following screen */
  nextQuestion() {
    this.selectedOptionIndex = null;
    this.hasAnswered = false;
  
    // Increment the question index
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      // When the quiz ends, save the score
      this.showResult = true;
      this.authService.getProfile().then(user => {
        if (user) {
          this.statsService.saveUserScore(
            user.uid,
            this.quizTitle, // Make sure `quizTitle` is set correctly
            this.score,
            this.questions.length
          );
        }
      });
    }
  }
  
  /** Restarts quiz */
  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.selectedOptionIndex = null;
    this.hasAnswered = false;
  }
}
