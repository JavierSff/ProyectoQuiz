import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private STORAGE_KEY = 'quizStatistics';

  constructor() {}

  // Save the highest score per quiz
  saveUserScore(userId: string, quizTitle: string, score: number, totalQuestions: number) {
    const rawData = localStorage.getItem(this.STORAGE_KEY);
    let stats = rawData ? JSON.parse(rawData) : {};
  
    if (!stats[userId]) {
      stats[userId] = {};
    }
  
    // Ensure that we don't overwrite existing statistics, but only update if the new score is higher
    if (!stats[userId][quizTitle]) {
      stats[userId][quizTitle] = {
        highestScore: score,
        totalQuestions: totalQuestions,
      };
    } else {
      // If there's already a score for the quiz, update it only if the new score is higher
      if (score > stats[userId][quizTitle].highestScore) {
        stats[userId][quizTitle].highestScore = score;
      }
    }
  
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }
  

  // ⬇️ Retrieve all stats for a specific user
  getUserStatistics(userId: string): Record<string, { highestScore: number; totalQuestions: number }> {
    const rawData = localStorage.getItem(this.STORAGE_KEY);
    const stats = rawData ? JSON.parse(rawData) : {};
    return stats[userId] || {};
  }

  // 🗑 Optional: Reset stats for a user
  clearUserStats(userId: string) {
    const rawData = localStorage.getItem(this.STORAGE_KEY);
    const stats = rawData ? JSON.parse(rawData) : {};

    delete stats[userId];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }
}
