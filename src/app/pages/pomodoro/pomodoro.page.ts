import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';

// This is the current logic for the Pomodoro timer
// The timer automatically switches between:
// Work sessions (25 minutes)
// Short breaks (5 minutes)
// Long breaks (15 minutes after every 4 work sessions)


@Component({
  selector: 'app-pomodoro',
  standalone: false,
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
})
export class PomodoroPage implements OnInit, OnDestroy {
  workDuration = 25 * 60;
  shortBreak = 5 * 60;
  longBreak = 15 * 60;

  timeLeft = this.workDuration;
  totalTime = this.workDuration;

  sessionType: 'Work' | 'Short Break' | 'Long Break' = 'Work';
  workSessionCount = 0;

  interval: any;
  isRunning = false;

  radius = 45;
  circumference = 2 * Math.PI * this.radius;
  progressOffset = this.circumference;
  
  constructor(
   
    private navCtrl: NavController,
  ) {}
/** preloads contetnt for page */
  ngOnInit() {
    this.updateProgressRing(100);
  }
/** allows claring time */
  ngOnDestroy() {
    this.clearTimer();
  }
/** toggles timer */
  toggleTimer() {
    this.isRunning ? this.stopTimer() : this.startTimer();
  }
/** allows moving to the previous screen */
  goBack() {
    this.navCtrl.navigateRoot(['/home']);
  }
  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateProgressRing((this.timeLeft / this.totalTime) * 100);
      } else {
        this.endSession();
      }
    }, 1000);
  }
/** stops timer */
  stopTimer() {
    this.clearTimer();
  }
/** resets timer */
  resetTimer() {
    this.clearTimer();
    this.setSession(this.sessionType); // resets current session
  }
/** clears time */
  clearTimer() {
    clearInterval(this.interval);
    this.isRunning = false;
  }
/** ends session of study*/
  endSession() {
    this.clearTimer();
    if (this.sessionType === 'Work') {
      this.workSessionCount++;
      const next = this.workSessionCount % 4 === 0 ? 'Long Break' : 'Short Break';
      this.setSession(next);
    } else {
      this.setSession('Work');
    }
    this.startTimer();
  }
/** sets up a new session of study */
  setSession(type: 'Work' | 'Short Break' | 'Long Break') {
    this.sessionType = type;

    switch (type) {
      case 'Work':
        this.timeLeft = this.totalTime = this.workDuration;
        break;
      case 'Short Break':
        this.timeLeft = this.totalTime = this.shortBreak;
        break;
      case 'Long Break':
        this.timeLeft = this.totalTime = this.longBreak;
        break;
    }

    this.updateProgressRing(100);
  }
/** gives format to time */
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
/** keeps progress ring updated */
  updateProgressRing(percent: number) {
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.progressOffset = offset;
  }
}
