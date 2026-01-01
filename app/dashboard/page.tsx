"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlgorithmVisualizer } from "@/components/algorithm-visualizer"
import { DataStructureVisualizer } from "@/components/data-structure-visualizer"
import { AiTutor } from "@/components/ai-tutor"
import { BookOpen, Brain, Bot, Home, Github } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("algorithms")

  return (
    <div className="min-h-screen bg-background">
      {/* Clean header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#3776AB] to-[#FFD343] flex items-center justify-center">
              <span className="text-white text-xs font-bold">Py</span>
            </div>
            PyDSA
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="sm">
                <Github className="w-4 h-4" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Simple tabs - the core of the app */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="algorithms" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Algorithms</span>
            </TabsTrigger>
            <TabsTrigger value="structures" className="gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Structures</span>
            </TabsTrigger>
            <TabsTrigger value="tutor" className="gap-2">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Tutor</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms">
            <AlgorithmVisualizer />
          </TabsContent>

          <TabsContent value="structures">
            <DataStructureVisualizer />
          </TabsContent>

          <TabsContent value="tutor">
            <AiTutor />
          </TabsContent>
        </Tabs>
      </main>

      {/* Minimal footer */}
      <footer className="border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          PyDSA — Free & open source Python DSA learning
        </div>
      </footer>
    </div>
  )
}
