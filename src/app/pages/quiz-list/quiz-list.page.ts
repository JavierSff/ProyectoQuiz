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
  quizzes: Quiz[] = []; // Array to hold quizzes
  userId: string = ''; // User ID for fetching quizzes
  deleteMode = false; // To toggle delete mode
  selectedQuizzes: string[] = []; // Array to hold selected quizzes for deletion
  availableBackgrounds = [
    'fondocards.png', // Default
    'brightgrey.svg', 
    'brightpurple.svg', 
    'darkgrey.svg', 
    'darkpink.svg', 
    'grassgreen.svg', 
    'lila.svg', 
  ];
  backgroundMenuVisible = false; // Controls visibility of background selection menu
  selectedBackground = '/assets/fondocards.png'; // Default background image

  constructor(
    private quizService: QuizService,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Fetch user profile and quizzes
    this.authService.getProfile().then(user => {
      this.userId = user?.uid || ''; // Set userId
      this.quizService.getQuizzes(this.userId).subscribe(data => {
        this.quizzes = data; // Set quizzes fetched from the service
      });
    });
  }

  // Toggle visibility of the background selection menu
  toggleBackgroundMenu() {
    this.backgroundMenuVisible = !this.backgroundMenuVisible;
  }

  // Method to change the background image of the quiz cards
  changeBackground(image: string) {
    this.selectedBackground = '/assets/' + image; // Set selected background image
    this.backgroundMenuVisible = false; // Close the background menu
  }

  goBack() {
    // Navigate to the home page instead of simply going back
    this.navCtrl.navigateRoot(['/home']);
  }

  takeQuiz(id: string) {
    if (!this.deleteMode) {
      this.navCtrl.navigateForward(['/quiz-runner', id]); // Navigate to quiz runner
    }
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode; // Toggle delete mode
    if (!this.deleteMode) {
      this.selectedQuizzes = []; // Clear selected quizzes when exiting delete mode
    }
  }

  // Method to handle selecting or deselecting quizzes in delete mode
  onSelectQuiz(event: any, id: string) {
    if (event.detail.checked) {
      if (!this.selectedQuizzes.includes(id)) {
        this.selectedQuizzes.push(id); // Add quiz to selection
      }
    } else {
      this.selectedQuizzes = this.selectedQuizzes.filter(qid => qid !== id); // Remove quiz from selection
    }
  }

  // Method to delete selected quizzes
  async deleteSelectedQuizzes() {
    const deletePromises = this.selectedQuizzes.map(id => this.quizService.deleteQuiz(id)); // Delete selected quizzes
    try {
      await Promise.all(deletePromises); // Wait for all deletions to complete
      const toast = await this.toastCtrl.create({
        message: 'Successfully deleted selected quizzes!',
        duration: 2000,
      });
      toast.present(); // Show success toast
      this.selectedQuizzes = []; // Clear selected quizzes
      this.deleteMode = false; // Exit delete mode
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error deleting quizzes',
        duration: 2000,
      });
      toast.present(); // Show error toast
    }
  }
}
