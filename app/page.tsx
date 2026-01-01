"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const algorithms = [
  { name: "Binary Search", complexity: "O(log n)" },
  { name: "Quick Sort", complexity: "O(n log n)" },
  { name: "Merge Sort", complexity: "O(n log n)" },
  { name: "BFS / DFS", complexity: "O(V + E)" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-[#3776AB] to-[#FFD343] flex items-center justify-center">
              <span className="text-white text-xs font-bold">Py</span>
            </div>
            PyDSA
          </Link>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/iambiniyam/PyDSA" target="_blank" className="text-muted-foreground hover:text-foreground">
              <Github className="w-5 h-5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero - Clean and focused */}
      <main className="pt-14">
        <section className="max-w-4xl mx-auto px-6 py-20 md:py-32">
          <div className="space-y-6">
            <Badge variant="secondary" className="text-xs">
              Free & Open Source
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Learn DSA with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3776AB] to-[#FFD343]">
                Python
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Visual, interactive algorithm learning. Watch code execute step-by-step, 
              understand complexity, and master the fundamentals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" asChild className="h-12 px-8">
                <Link href="/dashboard">
                  Start Learning
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick preview of what you'll learn */}
        <section className="border-t bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-sm font-medium text-muted-foreground mb-6">
              WHAT YOU&apos;LL LEARN
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {algorithms.map((algo) => (
                <div key={algo.name} className="p-4 rounded-lg border bg-background">
                  <div className="font-medium text-sm">{algo.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{algo.complexity}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              + Sorting, Searching, Trees, Graphs, Dynamic Programming, and more
            </p>
          </div>
        </section>

        {/* Simple feature highlights */}
        <section className="border-t">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Visual Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Watch algorithms execute step-by-step with animated visualizations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real Python Code</h3>
                <p className="text-sm text-muted-foreground">
                  Every algorithm includes clean, well-commented Python code you can use.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Tutor</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant help and explanations from an AI assistant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
            <p className="text-muted-foreground mb-6">
              No sign-up required. Just click and learn.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Minimal footer */}
        <footer className="border-t">
          <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>© 2025 PyDSA. Free forever.</div>
            <div className="flex gap-6">
              <Link href="https://github.com/iambiniyam/PyDSA" target="_blank" className="hover:text-foreground">
                GitHub
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
