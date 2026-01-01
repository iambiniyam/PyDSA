'use client'

import { useState, useRef, useEffect } from 'react'
import { Graph, GraphNode, GraphEdge, graphToAdjacencyList } from '@/lib/graph-algorithms'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GraphVisualizerProps {
  graph: Graph
  width?: number
  height?: number
  onNodePositionChange?: (nodeId: string, x: number, y: number) => void
}

export function GraphVisualizer({
  graph,
  width = 600,
  height = 400,
  onNodePositionChange
}: GraphVisualizerProps) {
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(
    new Map(graph.nodes.map(n => [n.id, { x: n.x, y: n.y }]))
  )
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setNodePositions(new Map(graph.nodes.map(n => [n.id, { x: n.x, y: n.y }])))
  }, [graph.nodes])

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    const pos = nodePositions.get(nodeId)
    if (!pos) return

    setDraggingNode(nodeId)
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = Math.max(20, Math.min(width - 20, e.clientX - rect.left - dragOffset.x))
    const y = Math.max(20, Math.min(height - 20, e.clientY - rect.top - dragOffset.y))

    setNodePositions(prev => new Map(prev).set(draggingNode, { x, y }))
  }

  const handleMouseUp = () => {
    if (draggingNode && onNodePositionChange) {
      const pos = nodePositions.get(draggingNode)
      if (pos) {
        onNodePositionChange(draggingNode, pos.x, pos.y)
      }
    }
    setDraggingNode(null)
  }

  const getNodePosition = (nodeId: string) => {
    return nodePositions.get(nodeId) || { x: 0, y: 0 }
  }

  const renderEdge = (edge: GraphEdge) => {
    const fromPos = getNodePosition(edge.from)
    const toPos = getNodePosition(edge.to)

    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const angle = Math.atan2(dy, dx)
    const nodeRadius = 20

    const startX = fromPos.x + nodeRadius * Math.cos(angle)
    const startY = fromPos.y + nodeRadius * Math.sin(angle)
    const endX = toPos.x - nodeRadius * Math.cos(angle)
    const endY = toPos.y - nodeRadius * Math.sin(angle)

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={edge.highlighted ? '#3b82f6' : '#94a3b8'}
          strokeWidth={edge.highlighted ? 3 : 2}
          markerEnd={graph.directed ? 'url(#arrowhead)' : undefined}
        />
        {edge.weight !== undefined && (
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 - 5}
            fill="#64748b"
            fontSize="12"
            textAnchor="middle"
          >
            {edge.weight}
          </text>
        )}
      </g>
    )
  }

  const renderNode = (node: GraphNode) => {
    const pos = getNodePosition(node.id)
    const fillColor = node.highlighted
      ? '#3b82f6'
      : node.visited
      ? '#10b981'
      : '#e2e8f0'
    const textColor = node.highlighted || node.visited ? '#ffffff' : '#1e293b'

    return (
      <g
        key={node.id}
        onMouseDown={(e) => handleMouseDown(node.id, e)}
        style={{ cursor: draggingNode === node.id ? 'grabbing' : 'grab' }}
      >
        <circle
          cx={pos.x}
          cy={pos.y}
          r={20}
          fill={fillColor}
          stroke="#64748b"
          strokeWidth={2}
        />
        <text
          x={pos.x}
          y={pos.y + 5}
          fill={textColor}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
        >
          {node.id}
        </text>
        {node.distance !== undefined && node.distance !== Infinity && (
          <text
            x={pos.x}
            y={pos.y + 35}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
          >
            d={node.distance}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="border rounded"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
            </marker>
          </defs>
          {graph.edges.map(renderEdge)}
          {graph.nodes.map(renderNode)}
        </svg>
      </Card>

      <AdjacencyDisplay graph={graph} />
    </div>
  )
}

interface AdjacencyDisplayProps {
  graph: Graph
}

function AdjacencyDisplay({ graph }: AdjacencyDisplayProps) {
  const adjList = graphToAdjacencyList(graph)
  const nodeIds = graph.nodes.map(n => n.id).sort()

  const adjMatrix: number[][] = []
  for (let i = 0; i < nodeIds.length; i++) {
    adjMatrix[i] = []
    for (let j = 0; j < nodeIds.length; j++) {
      const neighbors = adjList[nodeIds[i]] || []
      const edge = neighbors.find(n => n.neighbor === nodeIds[j])
      adjMatrix[i][j] = edge ? (edge.weight ?? 1) : 0
    }
  }

  return (
    <Card className="p-4">
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Adjacency List</TabsTrigger>
          <TabsTrigger value="matrix">Adjacency Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-2">
          {nodeIds.map(nodeId => {
            const neighbors = adjList[nodeId] || []
            return (
              <div key={nodeId} className="flex gap-2 text-sm">
                <span className="font-semibold min-w-[60px]">{nodeId}:</span>
                <span className="text-muted-foreground">
                  {neighbors.length > 0
                    ? neighbors.map(n => 
                        n.weight !== undefined 
                          ? `${n.neighbor}(${n.weight})` 
                          : n.neighbor
                      ).join(', ')
                    : '∅'}
                </span>
              </div>
            )
          })}
        </TabsContent>

        <TabsContent value="matrix">
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted"></th>
                  {nodeIds.map(id => (
                    <th key={id} className="border p-2 bg-muted font-semibold">
                      {id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodeIds.map((rowId, i) => (
                  <tr key={rowId}>
                    <th className="border p-2 bg-muted font-semibold">{rowId}</th>
                    {nodeIds.map((colId, j) => (
                      <td
                        key={colId}
                        className={`border p-2 text-center ${
                          adjMatrix[i][j] > 0 ? 'bg-blue-50 dark:bg-blue-950' : ''
                        }`}
                      >
                        {adjMatrix[i][j]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
