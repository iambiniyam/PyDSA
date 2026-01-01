"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Eye, Brain, FlaskConical, BarChart, CheckCircle, RefreshCcw, Lightbulb } from "lucide-react"

const learningPhases = [
  {
    id: "observe",
    icon: Eye,
    title: "Observe",
    description: "Watch the algorithm or data structure in action",
    prompt: "What patterns do you notice? What happens at each step?",
    color: "blue",
  },
  {
    id: "predict",
    icon: Brain,
    title: "Predict",
    description: "Make predictions about what will happen next",
    prompt: "Before running the next operation, what do you think will happen?",
    color: "indigo",
  },
  {
    id: "hypothesize",
    icon: Lightbulb,
    title: "Hypothesize",
    description: "Form a hypothesis about how it works",
    prompt: "Why do you think this algorithm works this way? What is the underlying principle?",
    color: "violet",
  },
  {
    id: "experiment",
    icon: FlaskConical,
    title: "Experiment",
    description: "Test your hypothesis with different inputs",
    prompt: "Try different inputs. What happens with edge cases?",
    color: "purple",
  },
  {
    id: "analyze",
    icon: BarChart,
    title: "Analyze",
    description: "Analyze the results and time complexity",
    prompt: "How many operations were performed? What is the time complexity?",
    color: "pink",
  },
  {
    id: "conclude",
    icon: CheckCircle,
    title: "Conclude",
    description: "Draw conclusions from your experiments",
    prompt: "What did you learn? When would you use this algorithm?",
    color: "green",
  },
  {
    id: "replicate",
    icon: RefreshCcw,
    title: "Replicate",
    description: "Practice with similar problems",
    prompt: "Can you solve a similar problem using what you learned?",
    color: "amber",
  },
]

export function LearningCycleGuide() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentResponse, setCurrentResponse] = useState("")

  const phase = learningPhases[currentPhase]
  const Icon = phase.icon

  const handleNext = () => {
    if (currentResponse.trim()) {
      setResponses((prev) => ({ ...prev, [phase.id]: currentResponse }))
      setCurrentResponse("")

      if (currentPhase < learningPhases.length - 1) {
        setCurrentPhase((prev) => prev + 1)
      }
    }
  }

  const handleReset = () => {
    setCurrentPhase(0)
    setResponses({})
    setCurrentResponse("")
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Scientific Learning Cycle</CardTitle>
          <CardDescription>Follow these phases to deeply understand DSA concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-6">
            {learningPhases.map((p, index) => (
              <Badge
                key={p.id}
                variant={index === currentPhase ? "default" : index < currentPhase ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setCurrentPhase(index)}
              >
                {p.title}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Phase {currentPhase + 1} of {learningPhases.length}
          </div>
        </CardContent>
      </Card>

      {/* Current Phase */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>{phase.title}</CardTitle>
              <CardDescription>{phase.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold mb-2">Guiding Question:</p>
            <p className="text-muted-foreground">{phase.prompt}</p>
          </div>

          <Textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Write your response here..."
            rows={6}
            className="resize-none"
          />

          <div className="flex gap-2">
            <Button onClick={handleNext} disabled={!currentResponse.trim()} className="flex-1">
              {currentPhase < learningPhases.length - 1 ? (
                <>
                  Next Phase <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Complete <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {currentPhase === learningPhases.length - 1 && (
              <Button onClick={handleReset} variant="outline">
                Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Previous Responses */}
      {Object.keys(responses).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
            <CardDescription>Review your responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningPhases.map((p) => {
              const response = responses[p.id]
              if (!response) return null

              const PhaseIcon = p.icon
              return (
                <div key={p.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <PhaseIcon className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{p.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
