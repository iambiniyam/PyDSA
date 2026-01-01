"use client"

import { useState, useCallback } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Play, Square, Copy, Check, Download, Trash2, 
  Loader2, Terminal, Code2, RotateCcw, Maximize2, Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  initialCode?: string
  language?: string
  readOnly?: boolean
  showLineNumbers?: boolean
  onCodeChange?: (code: string) => void
  className?: string
}

export function CodeEditor({
  initialCode = "",
  language = "python",
  readOnly = false,
  showLineNumbers = true,
  onCodeChange,
  className,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)

  const handleCodeChange = useCallback((value: string) => {
    setCode(value)
    onCodeChange?.(value)
  }, [onCodeChange])

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setError(null)
    setExecutionTime(null)

    const startTime = performance.now()

    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })

      const data = await response.json()
      const endTime = performance.now()
      setExecutionTime(Math.round(endTime - startTime))

      if (data.error) {
        setError(data.error)
      } else {
        setOutput(data.output || "No output")
      }
    } catch (err) {
      setError("Failed to execute code. Please try again.")
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${language === "python" ? "py" : language}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearOutput = () => {
    setOutput("")
    setError(null)
    setExecutionTime(null)
  }

  const resetCode = () => {
    setCode(initialCode)
    clearOutput()
  }

  return (
    <Card className={cn("overflow-hidden border-2 border-primary/20", className, isExpanded && "fixed inset-4 z-50")}>
      <CardHeader className="py-3 px-4 bg-[#1e1e1e] border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-medium text-white">Python Editor</CardTitle>
            <Badge variant="secondary" className="text-xs bg-[#3776AB]/20 text-[#3776AB]">
              Python 3.x
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={resetCode}
              title="Reset code"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={copyCode}
              title="Copy code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={downloadCode}
              title="Download code"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={cn("grid", isExpanded ? "grid-cols-2 h-[calc(100vh-8rem)]" : "grid-cols-1")}>
          {/* Code Editor */}
          <div className={cn("relative", !isExpanded && "max-h-[400px]")}>
            <CodeMirror
              value={code}
              height={isExpanded ? "100%" : "300px"}
              theme={vscodeDark}
              extensions={[python()]}
              onChange={handleCodeChange}
              readOnly={readOnly}
              basicSetup={{
                lineNumbers: showLineNumbers,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                searchKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
              className="text-sm"
            />
          </div>

          {/* Output Panel (shown when expanded or after running) */}
          {(isExpanded || output || error) && (
            <div className={cn("bg-[#1e1e1e] border-l border-primary/20", !isExpanded && "border-t")}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Output</span>
                  {executionTime !== null && (
                    <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                      {executionTime}ms
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={clearOutput}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className={cn("p-4 font-mono text-sm overflow-auto", isExpanded ? "h-[calc(100%-40px)]" : "max-h-[200px]")}>
                {error ? (
                  <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
                ) : output ? (
                  <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                ) : (
                  <p className="text-gray-500 italic">Run your code to see output here...</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Run Button Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-t border-primary/20">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-gray-600">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-gray-600">Enter</kbd>
            <span>to run</span>
          </div>
          <Button
            onClick={runCode}
            disabled={isRunning || !code.trim()}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
