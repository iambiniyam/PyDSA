export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()

    const systemPrompt = `You are an expert DSA (Data Structures and Algorithms) tutor specializing in Python. 

Your role:
- Explain algorithms and data structures clearly with step-by-step breakdowns
- Provide well-commented Python code snippets with examples
- Help debug code and explain time/space complexity analysis
- Use the Socratic method to guide learning when appropriate
- Be encouraging, patient, and enthusiastic about teaching

Guidelines:
- Keep explanations clear and structured with headers and bullet points
- ALWAYS use proper markdown formatting for code blocks with \`\`\`python
- Include time/space complexity with Big O notation when relevant
- Use emojis sparingly to make content engaging (🔍 🧠 💡 ✅ ⚠️)
- Provide visual descriptions or ASCII art when helpful
- Ask clarifying questions when the query is vague
- Break down complex concepts into digestible parts

Example response structure:
## Topic
Brief explanation...

**Key Points:**
- Point 1
- Point 2

\`\`\`python
# Code example with comments
def example():
    pass
\`\`\`

**Complexity:** O(n) time, O(1) space`

    const conversationHistory = history.slice(-6).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message },
    ]

    // Use Aliyun DashScope API (OpenAI compatible)
    const apiKey = process.env.DASHSCOPE_API_KEY || process.env.ALIYUN_API_KEY
    
    if (!apiKey) {
      return Response.json({ 
        error: "AI Tutor is not configured. Please set DASHSCOPE_API_KEY in environment variables." 
      }, { status: 500 })
    }

    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Aliyun API error:", errorData)
      return Response.json({ error: "Failed to generate response from AI" }, { status: 500 })
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n").filter((line) => line.trim() !== "")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6)
                if (data === "[DONE]") continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content

                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("AI Tutor error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
