"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, TreeDeciduous } from "lucide-react"
import { PythonCodeViewer } from "@/components/python-code-viewer"
import { BinaryTreeVisualizer } from "@/components/binary-tree-visualizer"
import { pythonCodeSamples } from "@/lib/python-code-samples"

type Operation = {
  operation: string
  value?: any
  result: string
  complexity: string
}

export function DataStructureVisualizer() {
  const [dataStructure, setDataStructure] = useState("stack")
  const [inputValue, setInputValue] = useState("")
  const [stack, setStack] = useState<number[]>([])
  const [queue, setQueue] = useState<number[]>([])
  const [list, setList] = useState<number[]>([])
  const [operations, setOperations] = useState<Operation[]>([])

  const getCurrentData = () => {
    switch (dataStructure) {
      case "stack":
        return stack
      case "queue":
        return queue
      case "list":
        return list
      default:
        return []
    }
  }

  const addOperation = (op: string, value: any, result: string, complexity: string) => {
    setOperations((prev) => [...prev, { operation: op, value, result, complexity }])
  }

  const handlePush = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) return

    switch (dataStructure) {
      case "stack":
        setStack((prev) => [...prev, value])
        addOperation("Push", value, `Added ${value} to top of stack`, "O(1)")
        break
      case "queue":
        setQueue((prev) => [...prev, value])
        addOperation("Enqueue", value, `Added ${value} to end of queue`, "O(1)")
        break
      case "list":
        setList((prev) => [...prev, value])
        addOperation("Append", value, `Added ${value} to end of list`, "O(1)")
        break
    }
    setInputValue("")
  }

  const handlePop = () => {
    switch (dataStructure) {
      case "stack":
        if (stack.length > 0) {
          const value = stack[stack.length - 1]
          setStack((prev) => prev.slice(0, -1))
          addOperation("Pop", null, `Removed ${value} from top of stack`, "O(1)")
        }
        break
      case "queue":
        if (queue.length > 0) {
          const value = queue[0]
          setQueue((prev) => prev.slice(1))
          addOperation("Dequeue", null, `Removed ${value} from front of queue`, "O(1)")
        }
        break
      case "list":
        if (list.length > 0) {
          const value = list[list.length - 1]
          setList((prev) => prev.slice(0, -1))
          addOperation("Remove", null, `Removed ${value} from end of list`, "O(1)")
        }
        break
    }
  }

  const handleClear = () => {
    setStack([])
    setQueue([])
    setList([])
    setOperations([])
  }

  const data = getCurrentData()

  const codeMap: Record<string, keyof typeof pythonCodeSamples> = {
    stack: "stack",
    queue: "queue",
    list: "linkedList",
  }

  return (
    <Tabs defaultValue="visualize" className="w-full">
      <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
        <TabsTrigger value="visualize">Linear</TabsTrigger>
        <TabsTrigger value="tree">
          <TreeDeciduous className="w-4 h-4 mr-2" />
          Tree
        </TabsTrigger>
        <TabsTrigger value="python-code">
          <Code2 className="w-4 h-4 mr-2" />
          Code
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visualize" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Structure</CardTitle>
                <CardDescription>Select and interact with different data structures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Structure Type</Label>
                  <Select value={dataStructure} onValueChange={setDataStructure}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stack">Stack (LIFO)</SelectItem>
                      <SelectItem value="queue">Queue (FIFO)</SelectItem>
                      <SelectItem value="list">Linked List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a number"
                    onKeyDown={(e) => e.key === "Enter" && handlePush()}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handlePush} disabled={!inputValue} className="flex-1">
                    {dataStructure === "stack" ? "Push" : dataStructure === "queue" ? "Enqueue" : "Add"}
                  </Button>
                  <Button
                    onClick={handlePop}
                    variant="outline"
                    disabled={data.length === 0}
                    className="flex-1 bg-transparent"
                  >
                    {dataStructure === "stack" ? "Pop" : dataStructure === "queue" ? "Dequeue" : "Remove"}
                  </Button>
                </div>

                <Button onClick={handleClear} variant="secondary" className="w-full">
                  Clear All
                </Button>
              </CardContent>
            </Card>

            {/* Operation History */}
            <Card>
              <CardHeader>
                <CardTitle>Operation History</CardTitle>
                <CardDescription>{operations.length} operations performed</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {operations.map((op, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{op.operation}</span>
                          <Badge variant="secondary">{op.complexity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{op.result}</p>
                      </div>
                    ))}
                    {operations.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No operations yet</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Current state: {data.length} elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] flex items-end justify-center gap-2 p-6 bg-muted/30 rounded-lg">
                {dataStructure === "stack" && (
                  <div className="flex flex-col-reverse gap-2">
                    {data.map((value, index) => (
                      <div
                        key={index}
                        className="w-32 h-16 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-xl border-2 border-primary/80 shadow-lg"
                      >
                        {value}
                      </div>
                    ))}
                    {data.length === 0 && <p className="text-muted-foreground">Stack is empty</p>}
                  </div>
                )}

                {dataStructure === "queue" && (
                  <div className="flex gap-2">
                    {data.map((value, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-xl border-2 border-primary/80 shadow-lg"
                      >
                        {value}
                      </div>
                    ))}
                    {data.length === 0 && <p className="text-muted-foreground">Queue is empty</p>}
                  </div>
                )}

                {dataStructure === "list" && (
                  <div className="flex gap-2 flex-wrap">
                    {data.map((value, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 flex items-center justify-center bg-accent text-accent-foreground rounded-lg font-bold text-xl border-2 border-accent/80 shadow-lg">
                          {value}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">[{index}]</span>
                      </div>
                    ))}
                    {data.length === 0 && <p className="text-muted-foreground">Linked List is empty</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="tree" className="space-y-6">
        <BinaryTreeVisualizer />
        
        <PythonCodeViewer
          title="Binary Search Tree"
          code={pythonCodeSamples.binaryTree || "# Code sample coming soon!"}
          complexity={{
            time: "O(log n) avg for insert/search",
            space: "O(n) for storage",
          }}
        />
      </TabsContent>

      <TabsContent value="python-code" className="space-y-6">
        <PythonCodeViewer
          title={
            dataStructure === "stack" ? "Stack (LIFO)" : dataStructure === "queue" ? "Queue (FIFO)" : "Linked List"
          }
          code={pythonCodeSamples[codeMap[dataStructure]] || "# Code sample coming soon!"}
          complexity={{
            time: "O(1) for push/pop/enqueue/dequeue",
            space: "O(n) where n is number of elements",
          }}
        />

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Understanding the Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {dataStructure === "stack" && (
              <>
                <p>
                  <strong>Stack follows LIFO</strong> (Last In, First Out) - like a stack of plates. The last item added
                  is the first one removed.
                </p>
                <p>
                  <strong>Key operations:</strong> push() adds to top, pop() removes from top, peek() views top without
                  removing.
                </p>
                <p>
                  <strong>Use cases:</strong> Function call stack, undo operations, browser history, expression
                  evaluation.
                </p>
              </>
            )}
            {dataStructure === "queue" && (
              <>
                <p>
                  <strong>Queue follows FIFO</strong> (First In, First Out) - like a line at a store. The first item
                  added is the first one removed.
                </p>
                <p>
                  <strong>Key operations:</strong> enqueue() adds to rear, dequeue() removes from front, front() views
                  front without removing.
                </p>
                <p>
                  <strong>Use cases:</strong> Task scheduling, breadth-first search, printer queue, message queues.
                </p>
              </>
            )}
            {dataStructure === "list" && (
              <>
                <p>
                  <strong>Linked List</strong> is a dynamic data structure where each element (node) contains data and a
                  reference to the next node.
                </p>
                <p>
                  <strong>Key operations:</strong> append() adds to end, prepend() adds to beginning, delete() removes a
                  node.
                </p>
                <p>
                  <strong>Use cases:</strong> Dynamic memory allocation, implementing stacks/queues, music playlists,
                  image viewers.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
