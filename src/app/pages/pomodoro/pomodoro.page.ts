import { Component } from '@angular/core';

@Component({
  selector: 'app-pomodoro',
  standalone: false,
  templateUrl: './pomodoro.page.html',
  styleUrls: ['./pomodoro.page.scss'],
})
export class PomodoroPage {
  workDuration: number = 25 * 60; // 25 minutes in seconds
  shortBreakDuration: number = 5 * 60; // 5 minutes in seconds
  longBreakDuration: number = 15 * 60; // 15 minutes in seconds
  timeLeft: number = this.workDuration; // Current session time
  isRunning: boolean = false;
  currentSessionType: string = 'Work Session'; // Type of current session
  pomodoroCount: number = 0; // Pomodoro cycle counter
  timer: any; // Timer reference for clearing

  startTimer() {
    this.isRunning = true;

    // Start countdown
    this.timer = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.handleSessionEnd();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer); // Stop the timer
    this.isRunning = false;
  }

  resetTimer() {
    clearInterval(this.timer); // Stop the timer
    this.isRunning = false;
    this.pomodoroCount = 0; // Reset Pomodoro count
    this.timeLeft = this.workDuration; // Reset to work session
    this.currentSessionType = 'Work Session'; // Reset session type
  }

  handleSessionEnd() {
    if (this.currentSessionType === 'Work Session') {
      this.pomodoroCount++; // Increment the Pomodoro cycle
      if (this.pomodoroCount % 4 === 0) {
        this.currentSessionType = 'Long Break';
        this.timeLeft = this.longBreakDuration;
      } else {
        this.currentSessionType = 'Short Break';
        this.timeLeft = this.shortBreakDuration;
      }
    } else {
      this.currentSessionType = 'Work Session';
      this.timeLeft = this.workDuration;
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
}
