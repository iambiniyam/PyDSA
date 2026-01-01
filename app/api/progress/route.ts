import { NextResponse } from 'next/server'
import { store } from '@/lib/db/store'
import { cookies } from 'next/headers'
import { DEFAULT_ACHIEVEMENTS } from '@/lib/db/schema'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [progress, achievements, streak, studyTime] = await Promise.all([
      store.getProgress(userId),
      store.getUserAchievements(userId),
      store.getStreak(userId),
      store.getTotalStudyTime(userId),
    ])

    const completedCount = progress.filter(p => p.completed).length

    return NextResponse.json({
      progress,
      achievements: DEFAULT_ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: achievements.some(ua => ua.achievementId === a.id),
        unlockedAt: achievements.find(ua => ua.achievementId === a.id)?.unlockedAt,
      })),
      streak,
      stats: {
        algorithmsCompleted: completedCount,
        totalStudyTime: Math.round(studyTime),
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      },
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { algorithmId, completed, notes } = await req.json()

    const progress = await store.updateProgress(userId, algorithmId, {
      completed,
      notes,
      attempts: 1, // Increment in real implementation
    })

    // Update streak
    await store.updateStreak(userId)

    // Check for achievements
    const completedCount = await store.getCompletedCount(userId)
    const streak = await store.getStreak(userId)
    const studyTime = await store.getTotalStudyTime(userId)

    const newAchievements: string[] = []

    for (const achievement of DEFAULT_ACHIEVEMENTS) {
      let shouldUnlock = false

      switch (achievement.requirement.type) {
        case 'algorithms_completed':
          shouldUnlock = completedCount >= achievement.requirement.value
          break
        case 'streak_days':
          shouldUnlock = streak.currentStreak >= achievement.requirement.value
          break
        case 'study_time':
          shouldUnlock = studyTime >= achievement.requirement.value
          break
      }

      if (shouldUnlock) {
        const existing = await store.getUserAchievements(userId)
        if (!existing.some(a => a.achievementId === achievement.id)) {
          await store.unlockAchievement(userId, achievement.id)
          newAchievements.push(achievement.id)
        }
      }
    }

    return NextResponse.json({
      progress,
      newAchievements,
    })
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
