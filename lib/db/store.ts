// In-memory store for progress tracking
// No authentication - uses localStorage on client side

import { randomUUID } from "crypto";

import type {
  UserProgress,
  LearningSession,
  Achievement,
} from "./schema";

interface UserAchievement {
visitorId: string
  achievementId: string
  unlockedAt: Date
}

interface StudyStreak {
  visitorId: string
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date
}

class InMemoryStore {
  private progress: Map<string, UserProgress[]> = new Map();
  private sessions: Map<string, LearningSession[]> = new Map();
  private achievements: Map<string, UserAchievement[]> = new Map();
  private streaks: Map<string, StudyStreak> = new Map();

  // Progress operations
  async getProgress(visitorId: string): Promise<UserProgress[]> {
    return this.progress.get(visitorId) || [];
  }

  async updateProgress(
    visitorId: string,
    algorithmId: string,
    data: Partial<UserProgress>
  ): Promise<UserProgress> {
    const userProgress = this.progress.get(visitorId) || [];
    const existing = userProgress.find((p) => p.algorithmId === algorithmId);

    if (existing) {
      Object.assign(existing, data, { lastAttemptAt: new Date() });
      return existing;
    }

    const newProgress: UserProgress = {
      visitorId,
      algorithmId,
      completed: false,
      attempts: 0,
      lastAttemptAt: new Date(),
      ...data,
    };
    userProgress.push(newProgress);
    this.progress.set(visitorId, userProgress);
    return newProgress;
  }

  async getCompletedCount(visitorId: string): Promise<number> {
    const progress = this.progress.get(visitorId) || [];
    return progress.filter((p) => p.completed).length;
  }

  // Session operations
  async createSession(
    visitorId: string,
    data: Partial<LearningSession>
  ): Promise<LearningSession> {
    const session: LearningSession = {
      id: randomUUID(),
      visitorId,
      startedAt: new Date(),
      predictions: [],
      insights: [],
      ...data,
    };
    const userSessions = this.sessions.get(visitorId) || [];
    userSessions.push(session);
    this.sessions.set(visitorId, userSessions);
    return session;
  }

  async endSession(
    sessionId: string,
    visitorId: string
  ): Promise<LearningSession | null> {
    const userSessions = this.sessions.get(visitorId) || [];
    const session = userSessions.find((s) => s.id === sessionId);
    if (session) {
      session.endedAt = new Date();
    }
    return session || null;
  }

  async getTotalStudyTime(visitorId: string): Promise<number> {
    const userSessions = this.sessions.get(visitorId) || [];
    return userSessions.reduce((total, session) => {
      if (session.endedAt) {
        return (
          total +
          (session.endedAt.getTime() - session.startedAt.getTime()) / 60000
        );
      }
      return total;
    }, 0);
  }

  // Achievement operations
  async getUserAchievements(visitorId: string): Promise<UserAchievement[]> {
    return this.achievements.get(visitorId) || [];
  }

  async unlockAchievement(
    visitorId: string,
    achievementId: string
  ): Promise<UserAchievement> {
    const userAchievements = this.achievements.get(visitorId) || [];
    const existing = userAchievements.find(
      (a) => a.achievementId === achievementId
    );
    if (existing) return existing;

    const achievement: UserAchievement = {
      visitorId,
      achievementId,
      unlockedAt: new Date(),
    };
    userAchievements.push(achievement);
    this.achievements.set(visitorId, userAchievements);
    return achievement;
  }

  // Streak operations
  async getStreak(visitorId: string): Promise<StudyStreak> {
    return (
      this.streaks.get(visitorId) || {
        visitorId,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: new Date(0),
      }
    );
  }

  async updateStreak(visitorId: string): Promise<StudyStreak> {
    const streak = await this.getStreak(visitorId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStudy = new Date(streak.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      return streak;
    } else if (daysDiff === 1) {
      streak.currentStreak++;
    } else {
      streak.currentStreak = 1;
    }

    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastStudyDate = today;
    this.streaks.set(visitorId, streak);
    return streak;
  }
}

export const store = new InMemoryStore();
