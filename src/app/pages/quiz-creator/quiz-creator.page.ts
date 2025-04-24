import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz-service.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-creator',
  standalone: false,
  templateUrl: './quiz-creator.page.html',
  styleUrls: ['./quiz-creator.page.scss'],
})
export class QuizCreatorPage implements OnInit {
  title: string = '';
  userId: string = '';
  questions: { question: string; options: string[]; correctAnswer: number }[] = [];

  newQuestion = '';
  newOption1 = '';
  newOption2 = '';
  newOption3 = '';
  newOption4 = '';
  selectedAnswer = 0;

  selectedBackground: string = '/assets/lightorange.png'; // Default background

  // List of available backgrounds
  availableBackgrounds = [
    'lightorange.png', 'brightgrey.svg', 'brightpurple.svg',
    'darkgrey.svg', 'darkpink.svg', 'grassgreen.svg', 'lila.svg' , 'green.png', 'mustard.png', 'palegreen.png', 'turquoise.png','violet.png', 'wine.png'
  ];

  constructor(
    private quizService: QuizService,
    private authService: AuthenticationService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user?.uid || '';
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  addQuestion() {
    if (
      !this.newQuestion ||
      !this.newOption1 ||
      !this.newOption2 ||
      !this.newOption3 ||
      !this.newOption4
    ) {
      this.showToast('Please fill in all question fields');
      return;
    }

    const options = [this.newOption1, this.newOption2, this.newOption3, this.newOption4];

    this.questions.push({
      question: this.newQuestion,
      options: options,
      correctAnswer: this.selectedAnswer,
    });

    // Reset inputs for the next question.
    this.newQuestion = '';
    this.newOption1 = '';
    this.newOption2 = '';
    this.newOption3 = '';
    this.newOption4 = '';
    this.selectedAnswer = 0;
  }

  async saveQuiz() {
    if (!this.title || this.questions.length === 0) {
      this.showToast('Please add a title and at least one question');
      return;
    }

    const quiz = {
      userId: this.userId,
      title: this.title,
      questions: this.questions,
      backgroundImage: this.selectedBackground, // Include the background image in the quiz data
      createdAt: new Date(),
    };

    try {
      await this.quizService.addQuiz(quiz);
      this.title = '';
      this.questions = [];
      this.showToast('Quiz saved successfully!');
    } catch (err) {
      this.showToast('Error saving quiz');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  changeBackground(event: any) {
    // Handle background change
    const selectedImage = event.detail.value;
    this.selectedBackground = selectedImage;
  }
}
