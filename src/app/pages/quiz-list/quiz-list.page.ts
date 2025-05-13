import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { QuizService } from 'src/app/services/quiz-service.service';
import { Quiz } from 'src/app/services/quiz-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz-list',
  standalone: false,
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
})
export class QuizListPage implements OnInit {
  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();
      // Any calls to load data go here
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
  quizzes: Quiz[] = [];
  userId: string = '';
  deleteMode = false;
  selectedQuizzes: string[] = [];
  availableBackgrounds = [
    'lightorange.png', 'brightgrey.svg', 'brightpurple.svg', 
    'darkgrey.svg', 'darkpink.svg', 'grassgreen.svg', 'lila.svg', 'green.png', 'mustard.png', 'palegreen.png', 'turquoise.png','violet.png', 'wine.png'
  ];

  constructor(
    private quizService: QuizService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}
/** preloads profile data when opening screen */
  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user?.uid || '';
      this.quizService.getQuizzes(this.userId).subscribe(data => {
        this.quizzes = data;
      });
    });
  }
/** Allows going back to the previous screem */
  goBack() {
    this.navCtrl.navigateRoot(['/home']);
  }
/** Navigates to the quiz runner */
  takeQuiz(id: string) {
    if (!this.deleteMode) {
      this.navCtrl.navigateForward(['/quiz-runner', id]);
    }
  }
/** Allows editing quizzes */
  editQuiz(id: string) {
    this.router.navigate([`/quiz/${id}/edit`]);
  }
  /** toggles the option to delete quizzes from the list */
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    if (!this.deleteMode) {
      this.selectedQuizzes = [];
    }
  }
/** performs actions on selected quizzes */
  onSelectQuiz(event: any, id: string) {
    if (event.detail.checked) {
      if (!this.selectedQuizzes.includes(id)) {
        this.selectedQuizzes.push(id);
      }
    } else {
      this.selectedQuizzes = this.selectedQuizzes.filter(qid => qid !== id);
    }
  }
/** allows deleting selected quizzes */
  async deleteSelectedQuizzes() {
    const deletePromises = this.selectedQuizzes.map(id => this.quizService.deleteQuiz(id));
    try {
      await Promise.all(deletePromises);
      const toast = await this.toastCtrl.create({
        message: 'Successfully deleted selected quizzes!',
        duration: 2000,
      });
      toast.present();
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

  // Function to update the background of a quiz
  changeBackground(selectedBackground: string, quizId: string) {
    this.quizService.updateQuizBackground(quizId, selectedBackground).then(() => {
      const quiz = this.quizzes.find(q => q.id === quizId);
      if (quiz) {
        quiz.backgroundImage = selectedBackground;
      }
    });
  }
}
