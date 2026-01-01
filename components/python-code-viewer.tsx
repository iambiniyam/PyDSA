"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

type PythonCodeViewerProps = {
  title: string
  code: string
  complexity?: {
    time: string
    space: string
  }
}

export function PythonCodeViewer({ title, code, complexity }: PythonCodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-accent/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none">
              <path
                d="M24.047 5c-1.555.005-2.633.142-3.936.367-3.848.67-4.549 2.077-4.549 4.67V14h9v2H11.22c-2.694 0-5.054 1.615-5.791 4.685-.844 3.52-.878 5.713 0 9.396.652 2.74 2.211 4.685 4.905 4.685h3.162v-4.201c0-3.058 2.648-5.761 5.791-5.761h8.999c2.574 0 4.63-2.117 4.63-4.685v-7.457c0-2.51-2.118-4.396-4.63-4.685C27.117 5.027 25.603 4.995 24.047 5zm-5.025 2.523c.962 0 1.74.786 1.74 1.754 0 .966-.778 1.74-1.74 1.74-.961 0-1.74-.774-1.74-1.74 0-.968.779-1.754 1.74-1.754z"
                fill="#3776AB"
              />
              <path
                d="M23.078 43c1.555-.005 2.633-.142 3.936-.367 3.848-.67 4.549-2.077 4.549-4.67V34h-9v-2h13.342c2.694 0 5.054-1.615 5.791-4.685.844-3.52.878-5.713 0-9.396-.652-2.74-2.211-4.685-4.905-4.685h-3.162v4.201c0 3.058-2.648 5.761-5.791 5.761h-8.999c-2.574 0-4.63 2.117-4.63 4.685v7.457c0 2.51 2.118 4.396 4.63 4.685 1.169.04 2.683.072 4.239.077zm5.025-2.523c-.962 0-1.74-.786-1.74-1.754 0-.966.778-1.74 1.74-1.74.961 0 1.74.774 1.74 1.74 0 .968-.779 1.754-1.74 1.754z"
                fill="#FFD343"
              />
            </svg>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={copyCode} className="h-8 w-8">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        {complexity && (
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              Time: {complexity.time}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Space: {complexity.space}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono text-foreground">{code}</code>
        </pre>
      </CardContent>
    </Card>
  )
}
