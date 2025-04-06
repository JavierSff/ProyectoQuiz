import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz-service.service';


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

  questions: Question[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.quizService.getQuizById(quizId).subscribe(quiz => {
        this.questions = quiz.questions;
      });
    }
  }

  selectOption(index: number) {
    if (this.hasAnswered) return;

    this.selectedOptionIndex = index;
    this.hasAnswered = true;

    if (index === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.score++;
    }
  }

  nextQuestion() {
    this.selectedOptionIndex = null;
    this.hasAnswered = false;

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.showResult = true;
    }
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.selectedOptionIndex = null;
    this.hasAnswered = false;
  }
}