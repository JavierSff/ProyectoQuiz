import { Component, OnInit } from '@angular/core';
import { QuizService, Quiz } from 'src/app/services/quiz-service.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-list',
  standalone: false,
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
})
export class QuizListPage implements OnInit {
  quizzes: Quiz[] = [];
  userId: string = '';
  deleteMode = false;
  selectedQuizzes: string[] = [];

  constructor(
    private quizService: QuizService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
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
    // If delete mode is active, don’t navigate on item click.
    if (!this.deleteMode) {
      this.navCtrl.navigateForward(['/quiz-runner', id]);
    }
  }

  createQuiz() {
    this.navCtrl.navigateForward(['/quiz-creator']);
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    // Clear any selections when toggling out of delete mode.
    if (!this.deleteMode) {
      this.selectedQuizzes = [];
    }
  }

  onSelectQuiz(event: any, id: string) {
    if (event.detail.checked) {
      if (!this.selectedQuizzes.includes(id)) {
        this.selectedQuizzes.push(id);
      }
    } else {
      this.selectedQuizzes = this.selectedQuizzes.filter(qid => qid !== id);
    }
  }

  async deleteSelectedQuizzes() {
    const deletePromises = this.selectedQuizzes.map(id => this.quizService.deleteQuiz(id));
    try {
      await Promise.all(deletePromises);
      const toast = await this.toastCtrl.create({
        message: 'Successfully deleted selected quizzes!',
        duration: 2000,
      });
      toast.present();
      // Clear selections and turn off delete mode.
      this.selectedQuizzes = [];
      this.deleteMode = false;
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error deleting quizzes',
        duration: 2000,
      });
      toast.present();
    }
  }
}
