import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/services/quiz-service.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OpenaiService } from 'src/app/services/openai.service';

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
  topic = '';
  loading = false;
  generatedQuiz: any[] = [];

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
    private navCtrl: NavController,
    private auth: AuthenticationService,
    private toastController: ToastController, 
    private openaiService: OpenaiService, 
  private router: Router    
  ) {}
/** preloads page content */
  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user?.uid || '';
    });
  }

  generateQuizFromTopic() {
    if (this.loading) return;
  
    this.loading = true;
  
    this.openaiService.getGPTResponse(this.topic).subscribe({
      next: (res) => {
        try {
          const content = res.choices[0].message.content;
          this.generatedQuiz = JSON.parse(content);
        } catch {
          alert('Error parsing GPT response');
        }
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 429) {
          alert('Too many requests — please wait a few seconds and try again.');
        } else {
          alert('Error generating quiz');
        }
        this.loading = false;
      }
    });
  }
  

importGeneratedQuiz() {
  this.questions = this.generatedQuiz;
  this.generatedQuiz = [];
  this.topic = '';
}
/** allows moving to previous page */
  goBack() {
    this.navCtrl.back();
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const quizData = JSON.parse(reader.result as string);
  
        const user = await this.auth.getProfile();
        if (!user) {
          console.error('User not logged in');
          return;
        }
  
        const quizWithUser = {
          ...quizData,
          userId: user.uid,
          createdAt: new Date()
        };
  
        await this.quizService.addQuiz(quizWithUser);
  
        // Toast success
        const toast = await this.toastController.create({
          message: 'Quiz imported successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
  
        // Navigate back to quiz list
        this.router.navigate(['/quiz-list']);
  
      } catch (error) {
        console.error('Invalid JSON file', error);
        const toast = await this.toastController.create({
          message: 'Error importing quiz: Invalid file',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    };
    reader.readAsText(file);
  }
  
  /** adds new questions to the quiz */
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
