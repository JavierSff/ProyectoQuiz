import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pomodoro',
  standalone: false,
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
})
export class PomodoroPage implements OnInit, OnDestroy {
  timeLeft = 25 * 60; // 25 minutes in seconds
  totalTime = 25 * 60;
  interval: any;
  isRunning = false;

  radius = 45;
  circumference = 2 * Math.PI * this.radius;
  progressOffset = this.circumference;

  ngOnInit() {
    this.updateProgressRing(0);
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  toggleTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateProgressRing((this.timeLeft / this.totalTime) * 100);
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    this.clearTimer();
  }

  resetTimer() {
    this.clearTimer();
    this.timeLeft = this.totalTime;
    this.updateProgressRing(100);
  }

  clearTimer() {
    clearInterval(this.interval);
    this.isRunning = false;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  updateProgressRing(percent: number) {
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.progressOffset = offset;
  }
}
