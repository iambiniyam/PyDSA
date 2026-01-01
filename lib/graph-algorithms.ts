// Graph Data Structures and Types

export interface GraphNode {
  id: string
  value: any
  x: number
  y: number
  highlighted?: boolean
  visited?: boolean
  distance?: number
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
  highlighted?: boolean
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  directed: boolean
}

export interface GraphAlgorithmStep {
  graph: Graph
  currentNode?: string
  visitedNodes: string[]
  queue?: string[]
  stack?: string[]
  distances?: Map<string, number>
  priorityQueue?: Array<{ node: string; distance: number }>
  description: string
  comparison?: string
}

export interface GraphAlgorithm {
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  category: 'graph'
  difficulty: 'medium' | 'hard'
  execute: (graph: Graph, startNode: string, endNode?: string) => GraphAlgorithmStep[]
}

export interface AdjacencyList {
  [nodeId: string]: Array<{
    neighbor: string
    weight?: number
  }>
}

export interface ValidationResult {
  valid: boolean
  error?: string
}


// Convert visual graph to adjacency list
export function graphToAdjacencyList(graph: Graph): AdjacencyList {
  const adjList: AdjacencyList = {}
  
  // Initialize empty adjacency lists for all nodes
  graph.nodes.forEach(node => {
    adjList[node.id] = []
  })
  
  // Add edges to adjacency list
  graph.edges.forEach(edge => {
    adjList[edge.from].push({ neighbor: edge.to, weight: edge.weight })
    if (!graph.directed) {
      adjList[edge.to].push({ neighbor: edge.from, weight: edge.weight })
    }
  })
  
  return adjList
}

// Validate graph input
export function validateGraphInput(graph: Graph): ValidationResult {
  if (!graph.nodes || graph.nodes.length === 0) {
    return { valid: false, error: "Graph must have at least one node" }
  }
  
  const nodeIds = new Set(graph.nodes.map(n => n.id))
  
  // Check for duplicate node IDs
  if (nodeIds.size !== graph.nodes.length) {
    return { valid: false, error: "Graph contains duplicate node IDs" }
  }
  
  // Check that all edges reference existing nodes
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from)) {
      return { valid: false, error: `Edge references non-existent node: ${edge.from}` }
    }
    if (!nodeIds.has(edge.to)) {
      return { valid: false, error: `Edge references non-existent node: ${edge.to}` }
    }
  }
  
  return { valid: true }
}


// Deep clone a graph for step generation
function cloneGraph(graph: Graph): Graph {
  return {
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
    directed: graph.directed
  }
}

// BFS Algorithm Implementation
export function bfs(graph: Graph, startNode: string): GraphAlgorithmStep[] {
  const validation = validateGraphInput(graph)
  if (!validation.valid) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: validation.error || 'Invalid graph'
    }]
  }

  const nodeIds = new Set(graph.nodes.map(n => n.id))
  if (!nodeIds.has(startNode)) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: `Start node "${startNode}" does not exist in graph`
    }]
  }

  const steps: GraphAlgorithmStep[] = []
  const visited = new Set<string>()
  const queue: string[] = [startNode]
  const adjList = graphToAdjacencyList(graph)

  // Initial step
  steps.push({
    graph: cloneGraph(graph),
    currentNode: startNode,
    visitedNodes: [],
    queue: [...queue],
    description: `Starting BFS from node ${startNode}. Queue: [${startNode}]`
  })

  while (queue.length > 0) {
    const currentNode = queue.shift()!
    
    if (visited.has(currentNode)) {
      continue
    }

    visited.add(currentNode)
    const visitedArray = Array.from(visited)

    // Create step for visiting current node
    const graphState = cloneGraph(graph)
    graphState.nodes.forEach(n => {
      n.visited = visited.has(n.id)
      n.highlighted = n.id === currentNode
    })

    steps.push({
      graph: graphState,
      currentNode,
      visitedNodes: visitedArray,
      queue: [...queue],
      description: `Visiting node ${currentNode}. Visited: [${visitedArray.join(', ')}]`
    })

    // Add unvisited neighbors to queue
    const neighbors = adjList[currentNode] || []
    for (const { neighbor } of neighbors) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor)
      }
    }

    // Create step showing queue update
    if (neighbors.length > 0) {
      const graphStateAfter = cloneGraph(graph)
      graphStateAfter.nodes.forEach(n => {
        n.visited = visited.has(n.id)
        n.highlighted = n.id === currentNode
      })
      graphStateAfter.edges.forEach(e => {
        e.highlighted = e.from === currentNode || (!graph.directed && e.to === currentNode)
      })

      steps.push({
        graph: graphStateAfter,
        currentNode,
        visitedNodes: visitedArray,
        queue: [...queue],
        description: `Explored neighbors of ${currentNode}. Queue: [${queue.join(', ')}]`
      })
    }
  }

  // Final step
  const finalGraph = cloneGraph(graph)
  finalGraph.nodes.forEach(n => {
    n.visited = visited.has(n.id)
    n.highlighted = false
  })

  steps.push({
    graph: finalGraph,
    visitedNodes: Array.from(visited),
    queue: [],
    description: `BFS complete. Visited ${visited.size} nodes.`
  })

  return steps
}

export const bfsAlgorithm: GraphAlgorithm = {
  name: 'Breadth-First Search',
  description: 'Explores all neighbors at the current depth before moving to nodes at the next depth level',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  category: 'graph',
  difficulty: 'medium',
  execute: bfs
}


// DFS Algorithm Implementation
export function dfs(graph: Graph, startNode: string): GraphAlgorithmStep[] {
  const validation = validateGraphInput(graph)
  if (!validation.valid) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: validation.error || 'Invalid graph'
    }]
  }

  const nodeIds = new Set(graph.nodes.map(n => n.id))
  if (!nodeIds.has(startNode)) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: `Start node "${startNode}" does not exist in graph`
    }]
  }

  const steps: GraphAlgorithmStep[] = []
  const visited = new Set<string>()
  const stack: string[] = [startNode]
  const adjList = graphToAdjacencyList(graph)

  // Initial step
  steps.push({
    graph: cloneGraph(graph),
    currentNode: startNode,
    visitedNodes: [],
    stack: [...stack],
    description: `Starting DFS from node ${startNode}. Stack: [${startNode}]`
  })

  while (stack.length > 0) {
    const currentNode = stack.pop()!
    
    if (visited.has(currentNode)) {
      continue
    }

    visited.add(currentNode)
    const visitedArray = Array.from(visited)

    // Create step for visiting current node
    const graphState = cloneGraph(graph)
    graphState.nodes.forEach(n => {
      n.visited = visited.has(n.id)
      n.highlighted = n.id === currentNode
    })

    steps.push({
      graph: graphState,
      currentNode,
      visitedNodes: visitedArray,
      stack: [...stack],
      description: `Visiting node ${currentNode}. Visited: [${visitedArray.join(', ')}]`
    })

    // Add unvisited neighbors to stack (in reverse order for consistent traversal)
    const neighbors = adjList[currentNode] || []
    const unvisitedNeighbors = neighbors
      .filter(({ neighbor }) => !visited.has(neighbor))
      .reverse()

    for (const { neighbor } of unvisitedNeighbors) {
      if (!stack.includes(neighbor)) {
        stack.push(neighbor)
      }
    }

    // Create step showing stack update
    if (unvisitedNeighbors.length > 0) {
      const graphStateAfter = cloneGraph(graph)
      graphStateAfter.nodes.forEach(n => {
        n.visited = visited.has(n.id)
        n.highlighted = n.id === currentNode
      })
      graphStateAfter.edges.forEach(e => {
        e.highlighted = e.from === currentNode || (!graph.directed && e.to === currentNode)
      })

      steps.push({
        graph: graphStateAfter,
        currentNode,
        visitedNodes: visitedArray,
        stack: [...stack],
        description: `Pushed neighbors to stack. Stack: [${stack.join(', ')}]`
      })
    }
  }

  // Final step
  const finalGraph = cloneGraph(graph)
  finalGraph.nodes.forEach(n => {
    n.visited = visited.has(n.id)
    n.highlighted = false
  })

  steps.push({
    graph: finalGraph,
    visitedNodes: Array.from(visited),
    stack: [],
    description: `DFS complete. Visited ${visited.size} nodes.`
  })

  return steps
}

export const dfsAlgorithm: GraphAlgorithm = {
  name: 'Depth-First Search',
  description: 'Explores as far as possible along each branch before backtracking',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  category: 'graph',
  difficulty: 'medium',
  execute: dfs
}


// Check if graph has negative edge weights
function hasNegativeWeights(graph: Graph): boolean {
  return graph.edges.some(e => e.weight !== undefined && e.weight < 0)
}

// Dijkstra's Algorithm Implementation
export function dijkstra(graph: Graph, startNode: string, endNode?: string): GraphAlgorithmStep[] {
  const validation = validateGraphInput(graph)
  if (!validation.valid) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: validation.error || 'Invalid graph'
    }]
  }

  const nodeIds = new Set(graph.nodes.map(n => n.id))
  if (!nodeIds.has(startNode)) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: `Start node "${startNode}" does not exist in graph`
    }]
  }

  if (hasNegativeWeights(graph)) {
    return [{
      graph: cloneGraph(graph),
      visitedNodes: [],
      description: 'Dijkstra requires non-negative edge weights'
    }]
  }

  const steps: GraphAlgorithmStep[] = []
  const distances = new Map<string, number>()
  const visited = new Set<string>()
  const adjList = graphToAdjacencyList(graph)

  // Initialize distances
  graph.nodes.forEach(n => {
    distances.set(n.id, n.id === startNode ? 0 : Infinity)
  })

  // Priority queue: array of {node, distance} sorted by distance
  let priorityQueue: Array<{ node: string; distance: number }> = [
    { node: startNode, distance: 0 }
  ]

  // Initial step
  steps.push({
    graph: cloneGraph(graph),
    currentNode: startNode,
    visitedNodes: [],
    distances: new Map(distances),
    priorityQueue: [...priorityQueue],
    description: `Starting Dijkstra from node ${startNode}. Initial distance: 0`
  })

  while (priorityQueue.length > 0) {
    // Sort by distance and get minimum
    priorityQueue.sort((a, b) => a.distance - b.distance)
    const { node: currentNode, distance: currentDist } = priorityQueue.shift()!

    if (visited.has(currentNode)) {
      continue
    }

    visited.add(currentNode)
    const visitedArray = Array.from(visited)

    // Create step for visiting current node
    const graphState = cloneGraph(graph)
    graphState.nodes.forEach(n => {
      n.visited = visited.has(n.id)
      n.highlighted = n.id === currentNode
      n.distance = distances.get(n.id)
    })

    steps.push({
      graph: graphState,
      currentNode,
      visitedNodes: visitedArray,
      distances: new Map(distances),
      priorityQueue: [...priorityQueue],
      description: `Visiting node ${currentNode} with distance ${currentDist}`
    })

    // Check if we reached the end node
    if (endNode && currentNode === endNode) {
      const finalGraph = cloneGraph(graph)
      finalGraph.nodes.forEach(n => {
        n.visited = visited.has(n.id)
        n.distance = distances.get(n.id)
      })

      steps.push({
        graph: finalGraph,
        visitedNodes: visitedArray,
        distances: new Map(distances),
        priorityQueue: [],
        description: `Reached target node ${endNode}. Shortest distance: ${currentDist}`
      })
      return steps
    }

    // Update distances to neighbors
    const neighbors = adjList[currentNode] || []
    for (const { neighbor, weight } of neighbors) {
      if (visited.has(neighbor)) continue

      const edgeWeight = weight ?? 1
      const newDist = currentDist + edgeWeight
      const oldDist = distances.get(neighbor) ?? Infinity

      if (newDist < oldDist) {
        distances.set(neighbor, newDist)
        priorityQueue.push({ node: neighbor, distance: newDist })

        // Create step for distance update
        const updateGraph = cloneGraph(graph)
        updateGraph.nodes.forEach(n => {
          n.visited = visited.has(n.id)
          n.highlighted = n.id === neighbor
          n.distance = distances.get(n.id)
        })
        updateGraph.edges.forEach(e => {
          e.highlighted = (e.from === currentNode && e.to === neighbor) ||
            (!graph.directed && e.from === neighbor && e.to === currentNode)
        })

        steps.push({
          graph: updateGraph,
          currentNode,
          visitedNodes: visitedArray,
          distances: new Map(distances),
          priorityQueue: [...priorityQueue],
          description: `Updated distance to ${neighbor}: ${oldDist} → ${newDist}`
        })
      }
    }
  }

  // Final step
  const finalGraph = cloneGraph(graph)
  finalGraph.nodes.forEach(n => {
    n.visited = visited.has(n.id)
    n.highlighted = false
    n.distance = distances.get(n.id)
  })

  steps.push({
    graph: finalGraph,
    visitedNodes: Array.from(visited),
    distances: new Map(distances),
    priorityQueue: [],
    description: `Dijkstra complete. Found shortest paths to ${visited.size} nodes.`
  })

  return steps
}

export const dijkstraAlgorithm: GraphAlgorithm = {
  name: "Dijkstra's Algorithm",
  description: 'Finds the shortest path from a source node to all other nodes in a weighted graph',
  timeComplexity: 'O((V + E) log V)',
  spaceComplexity: 'O(V)',
  category: 'graph',
  difficulty: 'hard',
  execute: dijkstra
}

// Export all graph algorithms
export const graphAlgorithms: Record<string, GraphAlgorithm> = {
  bfs: bfsAlgorithm,
  dfs: dfsAlgorithm,
  dijkstra: dijkstraAlgorithm
}
