"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, TrendingUp, Flame, Clock, Target, Loader2 } from "lucide-react"
import { useProgress } from "@/hooks/use-progress"
import { algorithms } from "@/lib/algorithms"

export function ProgressTracker() {
  const { progress, achievements, streak, stats, isLoading } = useProgress()

  const totalAlgorithms = Object.keys(algorithms).length
  const completedAlgorithms = progress.filter(p => p.completed).length

  // Calculate category progress
  const categoryProgress = {
    searching: {
      completed: progress.filter(p => p.completed && algorithms[p.algorithmId]?.category === 'searching').length,
      total: Object.values(algorithms).filter(a => a.category === 'searching').length,
    },
    sorting: {
      completed: progress.filter(p => p.completed && algorithms[p.algorithmId]?.category === 'sorting').length,
      total: Object.values(algorithms).filter(a => a.category === 'sorting').length,
    },
    'divide-conquer': {
      completed: progress.filter(p => p.completed && algorithms[p.algorithmId]?.category === 'divide-conquer').length,
      total: Object.values(algorithms).filter(a => a.category === 'divide-conquer').length,
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Algorithms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedAlgorithms}/{totalAlgorithms}
            </div>
            <Progress value={(completedAlgorithms / totalAlgorithms) * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((completedAlgorithms / totalAlgorithms) * 100)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak?.currentStreak || 0} days</div>
            <p className="text-xs text-muted-foreground mt-2">
              Longest: {streak?.longestStreak || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudyTime || 0} min</div>
            <p className="text-xs text-muted-foreground mt-2">Total time invested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Learning Progress
          </CardTitle>
          <CardDescription>Track your mastery across algorithm categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Searching Algorithms</span>
              <span className="text-muted-foreground">
                {categoryProgress.searching.completed}/{categoryProgress.searching.total}
              </span>
            </div>
            <Progress 
              value={categoryProgress.searching.total > 0 
                ? (categoryProgress.searching.completed / categoryProgress.searching.total) * 100 
                : 0} 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sorting Algorithms</span>
              <span className="text-muted-foreground">
                {categoryProgress.sorting.completed}/{categoryProgress.sorting.total}
              </span>
            </div>
            <Progress 
              value={categoryProgress.sorting.total > 0 
                ? (categoryProgress.sorting.completed / categoryProgress.sorting.total) * 100 
                : 0} 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Divide & Conquer</span>
              <span className="text-muted-foreground">
                {categoryProgress['divide-conquer'].completed}/{categoryProgress['divide-conquer'].total}
              </span>
            </div>
            <Progress 
              value={categoryProgress['divide-conquer'].total > 0 
                ? (categoryProgress['divide-conquer'].completed / categoryProgress['divide-conquer'].total) * 100 
                : 0} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Completed Algorithms */}
      {progress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Algorithms</CardTitle>
            <CardDescription>Your learning history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progress.filter(p => p.completed).map((p) => {
                const algo = algorithms[p.algorithmId]
                return (
                  <div key={p.algorithmId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{algo?.name || p.algorithmId}</p>
                      {p.notes && <p className="text-sm text-muted-foreground">{p.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{algo?.category}</Badge>
                      <Badge variant="secondary">{p.attempts} attempts</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock badges as you learn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "bg-amber-50 dark:bg-amber-950 border-amber-500"
                    : "bg-muted/30 border-border opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{achievement.name}</h4>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs">Unlocked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
