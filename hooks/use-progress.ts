"use client"

import { useState, useEffect, useCallback } from 'react'
import type { UserProgress, Achievement, StudyStreak } from '@/lib/db/schema'

interface ProgressStats {
  algorithmsCompleted: number
  totalStudyTime: number
  currentStreak: number
  longestStreak: number
}

interface AchievementWithStatus extends Achievement {
  unlocked: boolean
  unlockedAt?: Date
}

interface UseProgressReturn {
  progress: UserProgress[]
  achievements: AchievementWithStatus[]
  streak: StudyStreak | null
  stats: ProgressStats | null
  isLoading: boolean
  error: string | null
  markCompleted: (algorithmId: string, notes?: string) => Promise<string[]>
  refresh: () => Promise<void>
}

export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([])
  const [streak, setStreak] = useState<StudyStreak | null>(null)
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const res = await fetch('/api/progress')
      
      if (!res.ok) {
        if (res.status === 401) {
          // Not logged in, use local storage
          const local = localStorage.getItem('dsa-progress')
          if (local) {
            const data = JSON.parse(local)
            setProgress(data.progress || [])
            setStats(data.stats || null)
          }
          return
        }
        throw new Error('Failed to fetch progress')
      }
      
      const data = await res.json()
      setProgress(data.progress)
      setAchievements(data.achievements)
      setStreak(data.streak)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const markCompleted = useCallback(async (algorithmId: string, notes?: string): Promise<string[]> => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithmId, completed: true, notes }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          // Not logged in, save to local storage
          const local = localStorage.getItem('dsa-progress')
          const data = local ? JSON.parse(local) : { progress: [], stats: { algorithmsCompleted: 0 } }
          
          const existing = data.progress.find((p: UserProgress) => p.algorithmId === algorithmId)
          if (existing) {
            existing.completed = true
            existing.notes = notes
          } else {
            data.progress.push({
              algorithmId,
              completed: true,
              notes,
              attempts: 1,
              lastAttemptAt: new Date().toISOString(),
            })
          }
          
          data.stats.algorithmsCompleted = data.progress.filter((p: UserProgress) => p.completed).length
          localStorage.setItem('dsa-progress', JSON.stringify(data))
          
          setProgress(data.progress)
          setStats(data.stats)
          return []
        }
        throw new Error('Failed to update progress')
      }

      const data = await res.json()
      await fetchProgress() // Refresh all data
      return data.newAchievements || []
    } catch (err) {
      console.error('Failed to mark completed:', err)
      return []
    }
  }, [fetchProgress])

  return {
    progress,
    achievements,
    streak,
    stats,
    isLoading,
    error,
    markCompleted,
    refresh: fetchProgress,
  }
}
