import { Component, OnInit } from '@angular/core';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
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

  questions: Question[] = [
    {
      question: 'What is the capital of France?',
      options: ['Madrid', 'Berlin', 'Paris', 'Rome'],
      correctAnswer: 2,
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
    },
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
    },
  ];

  constructor() {}

  ngOnInit() {}

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
