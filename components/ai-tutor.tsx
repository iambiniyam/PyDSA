"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Highlight, themes } from "prism-react-renderer";
import { CodeEditor } from "@/components/code-editor";
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  User,
  Copy,
  Check,
  Code2,
  Play,
  MessageSquare,
  Lightbulb,
  BookOpen,
  Zap,
  History,
  Trash2,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Terminal,
  Wand2,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  codeBlocks?: { language: string; code: string }[];
};

type ConversationMode = "chat" | "explain" | "debug" | "optimize";

const QUICK_PROMPTS = {
  chat: [
    "Explain how binary search works step by step",
    "What's the difference between a stack and a queue?",
    "Show me how to implement a linked list in Python",
    "Explain Big O notation with examples",
  ],
  explain: [
    "Explain this sorting algorithm",
    "What does this recursive function do?",
    "Break down this tree traversal code",
    "Explain the time complexity of this code",
  ],
  debug: [
    "Why is my binary search not working?",
    "Find the bug in this sorting code",
    "Why am I getting an index out of range error?",
    "Help me fix this infinite loop",
  ],
  optimize: [
    "How can I make this code faster?",
    "Reduce the space complexity of this solution",
    "Is there a more Pythonic way to write this?",
    "Optimize this nested loop",
  ],
};

const MODE_CONFIG = {
  chat: {
    icon: MessageSquare,
    label: "Chat",
    color: "text-blue-500",
    description: "General DSA questions",
  },
  explain: {
    icon: Lightbulb,
    label: "Explain",
    color: "text-amber-500",
    description: "Understand code & concepts",
  },
  debug: {
    icon: Zap,
    label: "Debug",
    color: "text-red-500",
    description: "Find and fix bugs",
  },
  optimize: {
    icon: Wand2,
    label: "Optimize",
    color: "text-green-500",
    description: "Improve performance",
  },
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-primary/20 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-primary/20">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-gray-400">{language}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
            onClick={copyCode}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          {language === "python" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
              onClick={() => setShowSandbox(!showSandbox)}
              title="Run in sandbox"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <Highlight
        theme={themes.vsDark}
        code={code.trim()}
        language={language as any}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className="p-4 overflow-x-auto text-sm" style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell pr-4 text-gray-500 text-right select-none w-8">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>

      {showSandbox && (
        <div className="border-t border-primary/20">
          <CodeEditor initialCode={code} />
        </div>
      )}
    </div>
  );
}

function parseCodeBlocks(content: string): {
  text: string;
  codeBlocks: { language: string; code: string }[];
} {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeBlocks: { language: string; code: string }[] = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }

  return { text: content, codeBlocks };
}

function MessageContent({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none
      prose-headings:font-semibold prose-headings:text-foreground
      prose-h1:text-lg prose-h1:mt-4 prose-h1:mb-2
      prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2
      prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1
      prose-p:my-1.5 prose-p:text-foreground
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:font-semibold prose-strong:text-foreground
      prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
      prose-pre:p-0 prose-pre:bg-transparent
      prose-ul:my-1 prose-ul:ml-1 prose-ol:my-1 prose-ol:ml-1
      prose-li:my-0.5
      prose-blockquote:border-l-2 prose-blockquote:border-primary/50 prose-blockquote:pl-3 prose-blockquote:my-2 prose-blockquote:text-muted-foreground prose-blockquote:italic
      prose-table:text-xs prose-th:px-3 prose-th:py-1.5 prose-th:bg-muted/50 prose-td:px-3 prose-td:py-1.5 prose-td:border prose-th:border"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock language={match[1]} code={code} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `## Welcome! 👋

I'm here to help you learn data structures and algorithms with Python.

**I can help you:**
- Understand algorithms step by step
- Write clean Python code
- Debug your code
- Optimize for better performance
- Analyze time & space complexity

What would you like to learn?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [mode, setMode] = useState<ConversationMode>("chat");
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxCode, setSandboxCode] = useState(`# Python Sandbox
# Write and run your code here!

def hello():
    print("Hello, PyDSA!")

hello()
`);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    setInput("");
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage("");

    // Add mode context to the message
    const modeContext = {
      chat: "",
      explain: "Please explain in detail with examples: ",
      debug: "Help me debug this code. Find issues and suggest fixes: ",
      optimize: "Help me optimize this code for better performance: ",
    };

    const enhancedMessage = modeContext[mode] + messageToSend;

    try {
      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: enhancedMessage,
          history: messages.slice(-8),
          mode,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullMessage += parsed.content;
                  setStreamingMessage(fullMessage);
                }
              } catch (e) {}
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("AI Tutor error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  const exportChat = () => {
    const content = messages
      .map((m) => `${m.role === "user" ? "You" : "AI Tutor"}: ${m.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pydsa-chat.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(MODE_CONFIG) as ConversationMode[]).map((m) => {
          const config = MODE_CONFIG[m];
          const Icon = config.icon;
          return (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              onClick={() => setMode(m)}
              className={`gap-2 ${mode === m ? "" : "hover:bg-muted"}`}
            >
              <Icon className={`w-4 h-4 ${mode === m ? "" : config.color}`} />
              {config.label}
            </Button>
          );
        })}
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSandbox(!showSandbox)}
          className="gap-2"
        >
          <Terminal className="w-4 h-4" />
          {showSandbox ? "Hide" : "Show"} Sandbox
        </Button>
      </div>

      <div className={`grid gap-4 ${showSandbox ? "lg:grid-cols-2" : ""}`}>
        {/* Chat Panel */}
        <Card className="border overflow-hidden">
          <CardHeader className="py-3 px-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    DSA Tutor
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {MODE_CONFIG[mode].description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={exportChat}
                  title="Export"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={clearChat}
                  title="Clear"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-112.5 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <MessageContent content={message.content} />
                      )}
                    </div>
                  </div>
                ))}

                {streamingMessage && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div className="max-w-[85%] rounded-xl px-3 py-2 bg-muted/50">
                      <MessageContent content={streamingMessage} />
                    </div>
                  </div>
                )}

                {isLoading && !streamingMessage && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="rounded-xl px-3 py-2 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 border-t bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Quick prompts:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS[mode].map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => sendMessage(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about DSA..."
                  className="min-h-16 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-16 w-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Sandbox Panel */}
        {showSandbox && (
          <div className="space-y-4">
            <CodeEditor
              initialCode={sandboxCode}
              onCodeChange={setSandboxCode}
            />
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Sandbox Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>
                    • Click <Play className="w-3 h-3 inline" /> on any code
                    block to run it
                  </li>
                  <li>• Use print() to see output</li>
                  <li>• Supports Python 3.x syntax</li>
                  <li>
                    • File I/O and system commands are disabled for security
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
