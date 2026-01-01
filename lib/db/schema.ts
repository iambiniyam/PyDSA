// Database schema for learning progress tracking
// Simplified - no authentication or subscription tiers

export interface UserProgress {
  visitorId: string
  algorithmId: string
  completed: boolean
  attempts: number
  bestTime?: number
  lastAttemptAt: Date
  notes?: string
}

export interface LearningSession {
  id: string
  visitorId: string
  startedAt: Date
  endedAt?: Date
  algorithmId?: string
  dataStructureId?: string
  predictions: string[]
  insights: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: AchievementRequirement
}

export interface AchievementRequirement {
  type: 'algorithms_completed' | 'streak_days' | 'study_time' | 'predictions_correct'
  value: number
}

// Default achievements for the platform
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-algorithm',
    name: 'First Steps',
    description: 'Complete your first algorithm',
    icon: '🎯',
    requirement: { type: 'algorithms_completed', value: 1 }
  },
  {
    id: 'algorithm-explorer',
    name: 'Explorer',
    description: 'Complete 5 algorithms',
    icon: '🔍',
    requirement: { type: 'algorithms_completed', value: 5 }
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    requirement: { type: 'streak_days', value: 7 }
  },
  {
    id: 'algorithm-master',
    name: 'Master',
    description: 'Complete all available algorithms',
    icon: '🏆',
    requirement: { type: 'algorithms_completed', value: 15 }
  }
]
export interface StudyStreak {
  visitorId: string
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date
}