import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Quiz, QuizService } from 'src/app/services/quiz-service.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-quiz-edit',
  standalone: false,
  templateUrl: './quiz-edit.page.html',
  styleUrls: ['./quiz-edit.page.scss']
})
export class QuizEditPage implements OnInit {
  quizId!: string;
  quiz: Quiz | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private quizService: QuizService,
    private toastCtrl: ToastController,
    public router: Router
  ) {}
/** Loads quizes when starting the page */
  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id')!;
    this.quizService.getQuizById(this.quizId).subscribe(q => {
      this.quiz = { ...q };
    });
  }
/** Saves changes made on quizzes */
  async saveChanges() {
    if (!this.quiz) return;

    const ref = doc(this.firestore, `quizzes/${this.quizId}`);
    await updateDoc(ref, {
      title: this.quiz.title,
      questions: this.quiz.questions,
      backgroundImage: this.quiz.backgroundImage || null
    });

    const toast = await this.toastCtrl.create({
      message: 'Quiz updated successfully!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/quiz-list']);
  }
}
