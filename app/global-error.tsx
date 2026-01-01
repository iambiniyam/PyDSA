"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 px-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-red-500">Critical Error</h1>
            <p className="text-gray-600 max-w-md">
              A critical error occurred. Please refresh the page.
            </p>
          </div>
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </Button>
        </div>
      </body>
    </html>
  )
}
