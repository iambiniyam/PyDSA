"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Lightbulb, Code2, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { algorithms, type AlgorithmStep } from "@/lib/algorithms"
import { PythonCodeViewer } from "@/components/python-code-viewer"
import { pythonCodeSamples } from "@/lib/python-code-samples"
import { useProgress } from "@/hooks/use-progress"
import { toast } from "sonner"

export function AlgorithmVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("linearSearch")
  const [inputArray, setInputArray] = useState("5,2,8,1,9,3")
  const [searchTarget, setSearchTarget] = useState("8")
  const [steps, setSteps] = useState<AlgorithmStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [prediction, setPrediction] = useState("")
  const [showPrediction, setShowPrediction] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1000)

  const { markCompleted } = useProgress()

  const algorithm = algorithms[selectedAlgorithm]
  const currentStepData = steps[currentStep]

  // Group algorithms by category
  const algorithmsByCategory = useMemo(() => {
    const grouped: Record<string, typeof algorithms> = {}
    Object.entries(algorithms).forEach(([key, algo]) => {
      if (!grouped[algo.category]) grouped[algo.category] = {}
      grouped[algo.category][key] = algo
    })
    return grouped
  }, [])

  useEffect(() => {
    setCurrentStep(0)
    setSteps([])
    setShowPrediction(true)
    setPrediction("")
  }, [selectedAlgorithm, inputArray, searchTarget])

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, playbackSpeed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length, playbackSpeed])

  const runAlgorithm = useCallback(() => {
    const arr = inputArray
      .split(",")
      .map((n) => Number.parseInt(n.trim()))
      .filter((n) => !isNaN(n))
    const target = Number.parseInt(searchTarget)

    if (arr.length === 0) {
      toast.error("Please enter a valid array")
      return
    }

    if (algorithm.execute) {
      const result = algorithm.execute(arr, target)
      setSteps(result)
      setCurrentStep(0)
      setShowPrediction(false)
    }
  }, [algorithm, inputArray, searchTarget])

  const handlePredictionSubmit = () => {
    if (prediction.trim()) {
      runAlgorithm()
    }
  }

  const handleComplete = async () => {
    const newAchievements = await markCompleted(selectedAlgorithm, prediction)
    if (newAchievements.length > 0) {
      toast.success("🎉 Achievement unlocked!")
    } else {
      toast.success("Progress saved!")
    }
  }

  const exportCode = () => {
    const code = pythonCodeSamples[selectedAlgorithm as keyof typeof pythonCodeSamples]
    if (code) {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedAlgorithm}.py`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Code exported!")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="visualize" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="visualize">Visualize</TabsTrigger>
          <TabsTrigger value="python-code">
            <Code2 className="w-4 h-4 mr-2" />
            Python Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualize" className="space-y-6">
          {/* Algorithm Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Algorithm</CardTitle>
              <CardDescription>Choose an algorithm to visualize and learn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Algorithm</Label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(algorithmsByCategory).map(([category, algos]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                            {category.replace('-', ' ')}
                          </div>
                          {Object.entries(algos).map(([key, algo]) => {
                            return (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {algo.name}
                                  <Badge variant="outline" className="text-xs">
                                    {algo.difficulty}
                                  </Badge>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Input Array (comma-separated)</Label>
                  <Input value={inputArray} onChange={(e) => setInputArray(e.target.value)} placeholder="5,2,8,1,9,3" />
                </div>
              </div>

              {algorithm.requiresTarget && (
                <div className="space-y-2">
                  <Label>Search Target</Label>
                  <Input
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    placeholder="8"
                    type="number"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Time: {algorithm.timeComplexity}</Badge>
                <Badge variant="secondary">Space: {algorithm.spaceComplexity}</Badge>
                <Badge variant="outline">{algorithm.category}</Badge>
                <Badge variant={algorithm.difficulty === 'easy' ? 'default' : algorithm.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                  {algorithm.difficulty}
                </Badge>
              </div>

              <div className="flex gap-2">
                <div className="space-y-2 flex-1">
                  <Label>Playback Speed</Label>
                  <Select value={playbackSpeed.toString()} onValueChange={(v) => setPlaybackSpeed(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2000">Slow (2s)</SelectItem>
                      <SelectItem value="1000">Normal (1s)</SelectItem>
                      <SelectItem value="500">Fast (0.5s)</SelectItem>
                      <SelectItem value="250">Very Fast (0.25s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Phase */}
          {showPrediction && (
            <Alert className="border-primary bg-primary/5">
              <Lightbulb className="h-4 w-4 text-primary" />
              <AlertDescription className="space-y-3">
                <p className="font-semibold text-foreground">Scientific Method: Make a Prediction</p>
                <p className="text-sm text-muted-foreground">
                  Before running the algorithm, predict what will happen. How many steps will it take? What will be the
                  result?
                </p>
                <div className="space-y-2">
                  <Input
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    placeholder="Type your prediction here..."
                    className="bg-background"
                  />
                  <Button onClick={handlePredictionSubmit} disabled={!prediction.trim()} className="w-full">
                    Submit Prediction & Run Algorithm
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Visualization */}
          {steps.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Visualization</CardTitle>
                  <CardDescription>
                    Step {currentStep + 1} of {steps.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Array Visualization */}
                  <div className="flex flex-wrap gap-2 justify-center p-6 bg-muted/50 rounded-lg">
                    {currentStepData?.array.map((value: number, index: number) => (
                      <div
                        key={index}
                        className={`
                          w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg
                          transition-all duration-300 border-2
                          ${
                            currentStepData.currentIndex === index
                              ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg"
                              : currentStepData.compareIndex === index
                                ? "bg-accent text-accent-foreground border-accent scale-105 shadow-md"
                                : currentStepData.pivotIndex === index
                                  ? "bg-yellow-500 text-white border-yellow-600 scale-105"
                                  : currentStepData.leftPointer === index
                                    ? "bg-blue-500 text-white border-blue-600"
                                    : currentStepData.rightPointer === index
                                      ? "bg-purple-500 text-white border-purple-600"
                                      : currentStepData.sortedIndices?.includes(index)
                                        ? "bg-green-600 text-white border-green-700"
                                        : "bg-white dark:bg-gray-800 border-border"
                          }
                        `}
                      >
                        {value}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 justify-center text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-primary rounded" />
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-accent rounded" />
                      <span>Compare</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <span>Pivot</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-600 rounded" />
                      <span>Sorted</span>
                    </div>
                  </div>

                  {/* Step Description */}
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    <p className="font-semibold text-foreground">{currentStepData?.description}</p>
                    {currentStepData?.comparison && (
                      <p className="text-sm text-muted-foreground">{currentStepData.comparison}</p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentStep(0)}
                      disabled={currentStep === 0}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStep >= steps.length - 1}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep >= steps.length - 1}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Insights */}
              <Card className="border-green-600 bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-green-900 dark:text-green-100">Learning Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Your Prediction:</p>
                    <p className="text-muted-foreground italic">{prediction}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold text-foreground">Actual Result:</p>
                    <p className="text-muted-foreground">{steps[steps.length - 1]?.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold text-foreground">Key Concept:</p>
                    <p className="text-muted-foreground">{algorithm.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-semibold text-foreground">Total Steps: {steps.length}</p>
                  </div>
                  <Button onClick={handleComplete} className="w-full mt-4">
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="python-code" className="space-y-6">
          <PythonCodeViewer
            title={algorithm.name}
            code={
              pythonCodeSamples[selectedAlgorithm as keyof typeof pythonCodeSamples] || "# Code sample coming soon!"
            }
            complexity={{
              time: algorithm.timeComplexity,
              space: algorithm.spaceComplexity,
            }}
          />

          <div className="flex gap-2">
            <Button onClick={exportCode} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export to Python File
            </Button>
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">How to Run This Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium">1. Save the code to a file (e.g., algorithm.py)</p>
                <p className="font-medium">2. Run it from your terminal:</p>
                <pre className="bg-muted p-3 rounded text-xs font-mono">python algorithm.py</pre>
                <p className="font-medium">3. Try modifying the input values and experiment!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
