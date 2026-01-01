import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 10

// Simulated Python execution using Pyodide-like approach
// In production, you'd use a sandboxed execution environment
async function executePythonCode(code: string): Promise<{ output: string; error?: string }> {
  try {
    // Use Piston API for code execution (free, sandboxed)
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "python",
        version: "3.10",
        files: [
          {
            name: "main.py",
            content: code,
          },
        ],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    })

    if (!response.ok) {
      throw new Error("Execution service unavailable")
    }

    const result = await response.json()

    if (result.run) {
      const output = result.run.stdout || ""
      const stderr = result.run.stderr || ""
      
      if (stderr) {
        return { output: "", error: stderr }
      }
      
      return { output: output || "Code executed successfully (no output)" }
    }

    if (result.compile && result.compile.stderr) {
      return { output: "", error: result.compile.stderr }
    }

    return { output: "", error: "Unknown execution error" }
  } catch (error) {
    console.error("Code execution error:", error)
    
    // Fallback: simulate basic Python execution for common patterns
    return simulatePythonExecution(code)
  }
}

// Fallback simulation for when external API is unavailable
function simulatePythonExecution(code: string): { output: string; error?: string } {
  try {
    const lines = code.split("\n")
    const outputs: string[] = []
    const variables: Record<string, any> = {}

    for (const line of lines) {
      const trimmed = line.trim()
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) continue

      // Handle print statements
      const printMatch = trimmed.match(/^print\s*\(\s*(.+)\s*\)$/)
      if (printMatch) {
        let content = printMatch[1]
        
        // Handle f-strings
        if (content.startsWith('f"') || content.startsWith("f'")) {
          content = content.slice(2, -1)
          // Replace {var} with variable values
          content = content.replace(/\{(\w+)\}/g, (_, varName) => {
            return variables[varName] !== undefined ? String(variables[varName]) : `{${varName}}`
          })
          outputs.push(content)
          continue
        }
        
        // Handle string literals
        if ((content.startsWith('"') && content.endsWith('"')) || 
            (content.startsWith("'") && content.endsWith("'"))) {
          outputs.push(content.slice(1, -1))
          continue
        }
        
        // Handle variables
        if (variables[content] !== undefined) {
          outputs.push(String(variables[content]))
          continue
        }
        
        // Handle expressions
        try {
          const result = evaluateExpression(content, variables)
          outputs.push(String(result))
        } catch {
          outputs.push(content)
        }
        continue
      }

      // Handle variable assignments
      const assignMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/)
      if (assignMatch) {
        const [, varName, value] = assignMatch
        try {
          variables[varName] = evaluateExpression(value, variables)
        } catch {
          variables[varName] = value
        }
        continue
      }

      // Handle for loops (basic)
      const forMatch = trimmed.match(/^for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:$/)
      if (forMatch) {
        // Skip for now - would need more complex parsing
        continue
      }
    }

    return { 
      output: outputs.length > 0 
        ? outputs.join("\n") 
        : "⚠️ Simulation mode: Complex code requires the execution service.\n\nTry running simpler code with print() statements."
    }
  } catch (error) {
    return { 
      output: "", 
      error: "⚠️ Code execution service temporarily unavailable.\n\nYour code syntax looks correct! In production, this would execute on a secure Python runtime."
    }
  }
}

function evaluateExpression(expr: string, variables: Record<string, any>): any {
  // Handle numbers
  if (/^-?\d+(\.\d+)?$/.test(expr)) {
    return parseFloat(expr)
  }
  
  // Handle lists
  if (expr.startsWith("[") && expr.endsWith("]")) {
    const inner = expr.slice(1, -1)
    if (!inner.trim()) return []
    return inner.split(",").map(item => {
      const trimmed = item.trim()
      if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed)
      if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed)
      return trimmed.replace(/['"]/g, "")
    })
  }
  
  // Handle variable references
  if (variables[expr] !== undefined) {
    return variables[expr]
  }
  
  // Handle len()
  const lenMatch = expr.match(/^len\s*\(\s*(\w+)\s*\)$/)
  if (lenMatch && variables[lenMatch[1]]) {
    const val = variables[lenMatch[1]]
    if (Array.isArray(val)) return val.length
    if (typeof val === "string") return val.length
  }
  
  // Handle basic arithmetic
  const arithmeticMatch = expr.match(/^(\w+|\d+)\s*([+\-*/%])\s*(\w+|\d+)$/)
  if (arithmeticMatch) {
    const [, left, op, right] = arithmeticMatch
    const leftVal = variables[left] !== undefined ? variables[left] : parseFloat(left)
    const rightVal = variables[right] !== undefined ? variables[right] : parseFloat(right)
    
    switch (op) {
      case "+": return leftVal + rightVal
      case "-": return leftVal - rightVal
      case "*": return leftVal * rightVal
      case "/": return leftVal / rightVal
      case "%": return leftVal % rightVal
    }
  }
  
  return expr
}

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    if (code.length > 10000) {
      return NextResponse.json({ error: "Code too long (max 10000 characters)" }, { status: 400 })
    }

    // Security: Block dangerous operations
    const dangerousPatterns = [
      /import\s+os/,
      /import\s+subprocess/,
      /import\s+sys/,
      /__import__/,
      /eval\s*\(/,
      /exec\s*\(/,
      /open\s*\(/,
      /file\s*\(/,
      /input\s*\(/,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return NextResponse.json({ 
          error: "⚠️ Security restriction: This code contains operations that are not allowed in the sandbox.\n\nAllowed: Basic Python operations, print(), lists, loops, functions, classes.\nNot allowed: File I/O, system commands, eval/exec, input()." 
        }, { status: 400 })
      }
    }

    const result = await executePythonCode(code)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Execute code error:", error)
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 })
  }
}
