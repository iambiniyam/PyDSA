"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2, Circle, Lock, Play, Clock, 
  Zap, Target, Trophy, ChevronRight, Sparkles
} from "lucide-react"

interface LearningModule {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  topics: string[]
  completed: boolean
  locked: boolean
  progress: number
}

const learningPaths = {
  fundamentals: {
    id: "fundamentals",
    title: "DSA Fundamentals",
    description: "Master the basics of Data Structures & Algorithms",
    icon: "🎯",
    color: "from-blue-500 to-cyan-500",
    modules: [
      {
        id: "intro-complexity",
        title: "Time & Space Complexity",
        description: "Learn Big O notation and analyze algorithm efficiency",
        duration: "30 min",
        difficulty: "beginner" as const,
        topics: ["Big O", "Time Complexity", "Space Complexity"],
        completed: false,
        locked: false,
        progress: 0,
      },
      {
        id: "linear-search",
        title: "Linear Search",
        description: "The simplest searching algorithm",
        duration: "20 min",
        difficulty: "beginner" as const,
        topics: ["Searching", "Arrays", "O(n)"],
        completed: false,
        locked: false,
        progress: 0,
      },
      {
        id: "binary-search",
        title: "Binary Search",
        description: "Efficient searching in sorted arrays",
        duration: "25 min",
        difficulty: "beginner" as const,
        topics: ["Searching", "Divide & Conquer", "O(log n)"],
        completed: false,
        locked: false,
        progress: 0,
      },
      {
        id: "bubble-sort",
        title: "Bubble Sort",
        description: "Simple comparison-based sorting",
        duration: "25 min",
        difficulty: "beginner" as const,
        topics: ["Sorting", "Comparison", "O(n²)"],
        completed: false,
        locked: true,
        progress: 0,
      },
    ],
  },
  sorting: {
    id: "sorting",
    title: "Sorting Mastery",
    description: "From basic to advanced sorting algorithms",
    icon: "📊",
    color: "from-purple-500 to-pink-500",
    modules: [
      {
        id: "selection-sort",
        title: "Selection Sort",
        description: "Find minimum and swap approach",
        duration: "20 min",
        difficulty: "beginner" as const,
        topics: ["Sorting", "In-place", "O(n²)"],
        completed: false,
        locked: false,
        progress: 0,
      },
      {
        id: "insertion-sort",
        title: "Insertion Sort",
        description: "Build sorted array one element at a time",
        duration: "25 min",
        difficulty: "beginner" as const,
        topics: ["Sorting", "Adaptive", "O(n²)"],
        completed: false,
        locked: false,
        progress: 0,
      },
      {
        id: "merge-sort",
        title: "Merge Sort",
        description: "Divide and conquer sorting",
        duration: "35 min",
        difficulty: "intermediate" as const,
        topics: ["Sorting", "Divide & Conquer", "O(n log n)"],
        completed: false,
        locked: true,
        progress: 0,
      },
      {
        id: "quick-sort",
        title: "Quick Sort",
        description: "Efficient in-place sorting with partitioning",
        duration: "40 min",
        difficulty: "intermediate" as const,
        topics: ["Sorting", "Partitioning", "O(n log n)"],
        completed: false,
        locked: true,
        progress: 0,
      },
      {
        id: "heap-sort",
        title: "Heap Sort",
        description: "Sorting using heap data structure",
        duration: "35 min",
        difficulty: "advanced" as const,
        topics: ["Sorting", "Heap", "O(n log n)"],
        completed: false,
        locked: true,
        progress: 0,
      },
    ],
  },
  interview: {
    id: "interview",
    title: "Interview Prep",
    description: "Ace your technical interviews",
    icon: "💼",
    color: "from-amber-500 to-orange-500",
    modules: [
      {
        id: "two-pointers",
        title: "Two Pointers Technique",
        description: "Solve array problems efficiently",
        duration: "30 min",
        difficulty: "intermediate" as const,
        topics: ["Arrays", "Optimization", "Common Pattern"],
        completed: false,
        locked: false,
        progress: 0,
      },
      {
        id: "sliding-window",
        title: "Sliding Window",
        description: "Process subarrays efficiently",
        duration: "35 min",
        difficulty: "intermediate" as const,
        topics: ["Arrays", "Strings", "Optimization"],
        completed: false,
        locked: true,
        progress: 0,
      },
      {
        id: "binary-tree-basics",
        title: "Binary Tree Traversals",
        description: "Master tree traversal techniques",
        duration: "40 min",
        difficulty: "intermediate" as const,
        topics: ["Trees", "Recursion", "DFS/BFS"],
        completed: false,
        locked: true,
        progress: 0,
      },
    ],
  },
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function LearningPath() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  const calculatePathProgress = (modules: LearningModule[]) => {
    const completed = modules.filter(m => m.completed).length
    return Math.round((completed / modules.length) * 100)
  }

  if (selectedPath) {
    const path = learningPaths[selectedPath as keyof typeof learningPaths]
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedPath(null)}>
            ← Back to Paths
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${path.color}`} />
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{path.icon}</span>
              <div>
                <CardTitle className="text-2xl">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <Progress value={calculatePathProgress(path.modules)} className="h-2" />
              </div>
              <span className="text-sm font-medium">
                {calculatePathProgress(path.modules)}% Complete
              </span>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {path.modules.map((module, index) => (
            <Card 
              key={module.id} 
              className={`transition-all ${module.locked ? 'opacity-60' : 'hover:shadow-md cursor-pointer'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      module.completed 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : module.locked 
                          ? 'bg-muted' 
                          : 'bg-primary/10'
                    }`}>
                      {module.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : module.locked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <span className="font-bold text-primary">{index + 1}</span>
                      )}
                    </div>
                    {index < path.modules.length - 1 && (
                      <div className={`w-0.5 h-full min-h-[40px] mt-2 ${
                        module.completed ? 'bg-green-500' : 'bg-border'
                      }`} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      </div>
                      {!module.locked && !module.completed && (
                        <Button size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Start
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration}
                      </Badge>
                      <Badge className={difficultyColors[module.difficulty]}>
                        {module.difficulty}
                      </Badge>
                      {module.topics.map(topic => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    {module.progress > 0 && module.progress < 100 && (
                      <div className="mt-3">
                        <Progress value={module.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {module.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Paths</h2>
          <p className="text-muted-foreground">
            Structured courses to master DSA step by step
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="w-3 h-3" />
          3 Paths Available
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(learningPaths).map((path) => {
          const progress = calculatePathProgress(path.modules)
          return (
            <Card 
              key={path.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedPath(path.id)}
            >
              <div className={`h-2 bg-gradient-to-r ${path.color}`} />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{path.icon}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle className="mt-2">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {path.modules.length} modules
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    ~{path.modules.reduce((acc, m) => acc + parseInt(m.duration), 0)} min total
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Complete learning paths to earn certificates
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">0/3</p>
              <p className="text-sm text-muted-foreground">Paths Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
