import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-goals-widget',
  standalone: false,
  templateUrl: './study-goals-widget.component.html',
  styleUrls: ['./study-goals-widget.component.scss'],
})
export class StudyGoalsWidgetComponent implements OnInit {
  daysCompleted = 0;
  progressMessage = '';
  progressPercent = 0;
  strokeDashOffset = 0;

  readonly radius = 45;
  readonly stroke = 8;
  readonly circumference = 2 * Math.PI * this.radius;

  today: string = new Date().toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
  completedDates: string[] = [];

  ngOnInit() {
    this.loadProgress();
    this.updateProgress();
  }

  loadProgress() {
    const savedDates = localStorage.getItem('completedDates');
    if (savedDates) {
      this.completedDates = JSON.parse(savedDates);
      this.daysCompleted = this.completedDates.length;
    }
  }

  hasCompletedToday(): boolean {
    return this.completedDates.includes(this.today);
  }

  markTodayAsComplete() {
    if (!this.hasCompletedToday()) {
      this.completedDates.push(this.today);
      localStorage.setItem('completedDates', JSON.stringify(this.completedDates));
      this.daysCompleted = this.completedDates.length;
      this.updateProgress();
    }
  }

  updateProgress() {
    this.progressPercent = (this.daysCompleted / 7) * 100;
    this.strokeDashOffset = this.circumference * (1 - this.progressPercent / 100);
    this.setProgressMessage();
  }

  setProgressMessage() {
    if (this.daysCompleted === 7) {
      this.progressMessage = "You've completed your weekly goal! 🎉";
    } else if (this.daysCompleted > 0) {
      this.progressMessage = `You're making progress! Keep it up!`;
    } else {
      this.progressMessage = "Let’s get started with your goals!";
    }
  }
}
