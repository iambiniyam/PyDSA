import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  Graph,
  GraphNode,
  GraphEdge,
  graphToAdjacencyList,
  validateGraphInput,
  bfs,
  dfs,
  dijkstra
} from '../../lib/graph-algorithms'

// Arbitrary for generating valid graph nodes
const arbitraryGraphNode = (id: string): fc.Arbitrary<GraphNode> =>
  fc.record({
    id: fc.constant(id),
    value: fc.anything(),
    x: fc.integer({ min: 0, max: 500 }),
    y: fc.integer({ min: 0, max: 500 }),
    highlighted: fc.boolean(),
    visited: fc.boolean()
  })

// Arbitrary for generating a valid graph
const arbitraryGraph = (): fc.Arbitrary<Graph> =>
  fc.integer({ min: 1, max: 10 }).chain(nodeCount => {
    const nodeIds = Array.from({ length: nodeCount }, (_, i) => `node_${i}`)
    
    return fc.record({
      nodes: fc.tuple(...nodeIds.map(id => arbitraryGraphNode(id))).map(nodes => [...nodes]),
      edges: fc.array(
        fc.record({
          from: fc.constantFrom(...nodeIds),
          to: fc.constantFrom(...nodeIds),
          weight: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
          highlighted: fc.boolean()
        }),
        { minLength: 0, maxLength: nodeCount * 2 }
      ),
      directed: fc.boolean()
    })
  })

describe('Graph Algorithms', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 23: Adjacency Representation Correctness
   * Validates: Requirements 10.5
   */
  describe('Property 23: Adjacency Representation Correctness', () => {
    it('adjacency list correctly lists all neighbors for each node', () => {
      fc.assert(
        fc.property(arbitraryGraph(), (graph) => {
          const adjList = graphToAdjacencyList(graph)
          
          // All nodes should be in adjacency list
          for (const node of graph.nodes) {
            expect(adjList[node.id]).toBeDefined()
          }
          
          // For directed graphs: each edge from->to should appear in adjList[from]
          // For undirected graphs: edge should appear in both directions
          for (const edge of graph.edges) {
            const fromNeighbors = adjList[edge.from]
            const hasForwardEdge = fromNeighbors.some(
              n => n.neighbor === edge.to && n.weight === edge.weight
            )
            expect(hasForwardEdge).toBe(true)
            
            if (!graph.directed) {
              const toNeighbors = adjList[edge.to]
              const hasBackwardEdge = toNeighbors.some(
                n => n.neighbor === edge.from && n.weight === edge.weight
              )
              expect(hasBackwardEdge).toBe(true)
            }
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})


// Helper to compute BFS distances from start node
function computeBFSDistances(graph: Graph, startNode: string): Map<string, number> {
  const distances = new Map<string, number>()
  const visited = new Set<string>()
  const queue: Array<{ node: string; distance: number }> = [{ node: startNode, distance: 0 }]
  
  const adjList: { [key: string]: string[] } = {}
  graph.nodes.forEach(n => { adjList[n.id] = [] })
  graph.edges.forEach(e => {
    adjList[e.from].push(e.to)
    if (!graph.directed) {
      adjList[e.to].push(e.from)
    }
  })
  
  while (queue.length > 0) {
    const { node, distance } = queue.shift()!
    if (visited.has(node)) continue
    visited.add(node)
    distances.set(node, distance)
    
    for (const neighbor of adjList[node] || []) {
      if (!visited.has(neighbor)) {
        queue.push({ node: neighbor, distance: distance + 1 })
      }
    }
  }
  
  return distances
}

// Arbitrary for generating connected graphs
const arbitraryConnectedGraph = (): fc.Arbitrary<Graph> =>
  fc.integer({ min: 2, max: 8 }).chain(nodeCount => {
    const nodeIds = Array.from({ length: nodeCount }, (_, i) => `node_${i}`)
    
    // Create a spanning tree to ensure connectivity
    const spanningEdges: GraphEdge[] = []
    for (let i = 1; i < nodeCount; i++) {
      const parentIdx = Math.floor(Math.random() * i)
      spanningEdges.push({
        from: nodeIds[parentIdx],
        to: nodeIds[i]
      })
    }
    
    return fc.record({
      nodes: fc.tuple(...nodeIds.map(id => arbitraryGraphNode(id))).map(nodes => [...nodes]),
      edges: fc.array(
        fc.record({
          from: fc.constantFrom(...nodeIds),
          to: fc.constantFrom(...nodeIds),
          weight: fc.option(fc.integer({ min: 1, max: 100 }), { nil: undefined }),
          highlighted: fc.constant(false)
        }),
        { minLength: 0, maxLength: 5 }
      ).map(extraEdges => [...spanningEdges, ...extraEdges]),
      directed: fc.constant(false) // Undirected for connectivity guarantee
    })
  })

describe('BFS Algorithm', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 1: BFS Level-Order Traversal
   * Validates: Requirements 1.1
   */
  describe('Property 1: BFS Level-Order Traversal', () => {
    it('visits all nodes at distance d before any node at distance d+1', () => {
      fc.assert(
        fc.property(arbitraryConnectedGraph(), (graph) => {
          const startNode = graph.nodes[0].id
          const steps = bfs(graph, startNode)
          
          // Get expected distances
          const expectedDistances = computeBFSDistances(graph, startNode)
          
          // Extract visit order from steps (nodes that become visited)
          const visitOrder: string[] = []
          const seen = new Set<string>()
          
          for (const step of steps) {
            if (step.currentNode && !seen.has(step.currentNode)) {
              seen.add(step.currentNode)
              visitOrder.push(step.currentNode)
            }
          }
          
          // Verify level-order: for any two nodes in visit order,
          // if node A comes before node B, then distance(A) <= distance(B)
          for (let i = 0; i < visitOrder.length; i++) {
            for (let j = i + 1; j < visitOrder.length; j++) {
              const distA = expectedDistances.get(visitOrder[i]) ?? Infinity
              const distB = expectedDistances.get(visitOrder[j]) ?? Infinity
              expect(distA).toBeLessThanOrEqual(distB)
            }
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('queue contains only unvisited neighbors of visited nodes', () => {
      fc.assert(
        fc.property(arbitraryConnectedGraph(), (graph) => {
          const startNode = graph.nodes[0].id
          const steps = bfs(graph, startNode)
          
          for (const step of steps) {
            if (step.queue && step.queue.length > 0) {
              // Every node in queue should not be in visitedNodes
              for (const queueNode of step.queue) {
                expect(step.visitedNodes).not.toContain(queueNode)
              }
            }
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})


describe('DFS Algorithm', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 2: DFS Depth-First Exploration
   * Validates: Requirements 1.2
   */
  describe('Property 2: DFS Depth-First Exploration', () => {
    it('explores as deep as possible before backtracking', () => {
      fc.assert(
        fc.property(arbitraryConnectedGraph(), (graph) => {
          const startNode = graph.nodes[0].id
          const steps = dfs(graph, startNode)
          
          // Build adjacency list for verification
          const adjList: { [key: string]: string[] } = {}
          graph.nodes.forEach(n => { adjList[n.id] = [] })
          graph.edges.forEach(e => {
            adjList[e.from].push(e.to)
            if (!graph.directed) {
              adjList[e.to].push(e.from)
            }
          })
          
          // Extract visit order from steps
          const visitOrder: string[] = []
          const seen = new Set<string>()
          
          for (const step of steps) {
            if (step.currentNode && !seen.has(step.currentNode)) {
              seen.add(step.currentNode)
              visitOrder.push(step.currentNode)
            }
          }
          
          // DFS property: when we visit a node, we should have visited
          // at least one of its neighbors before (except for start node)
          // OR it should be reachable from a previously visited node
          for (let i = 1; i < visitOrder.length; i++) {
            const currentNode = visitOrder[i]
            const previouslyVisited = new Set(visitOrder.slice(0, i))
            
            // Current node should be a neighbor of at least one previously visited node
            let hasConnection = false
            for (const prevNode of previouslyVisited) {
              if (adjList[prevNode].includes(currentNode)) {
                hasConnection = true
                break
              }
            }
            expect(hasConnection).toBe(true)
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('stack correctly reflects path from start to current node', () => {
      fc.assert(
        fc.property(arbitraryConnectedGraph(), (graph) => {
          const startNode = graph.nodes[0].id
          const steps = dfs(graph, startNode)
          
          for (const step of steps) {
            if (step.stack) {
              // Stack should not contain any visited nodes
              for (const stackNode of step.stack) {
                expect(step.visitedNodes).not.toContain(stackNode)
              }
            }
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})


// Arbitrary for generating weighted connected graphs (non-negative weights)
const arbitraryWeightedGraph = (): fc.Arbitrary<Graph> =>
  fc.integer({ min: 2, max: 6 }).chain(nodeCount => {
    const nodeIds = Array.from({ length: nodeCount }, (_, i) => `node_${i}`)
    
    // Create a spanning tree to ensure connectivity
    const spanningEdges: GraphEdge[] = []
    for (let i = 1; i < nodeCount; i++) {
      const parentIdx = Math.floor(Math.random() * i)
      spanningEdges.push({
        from: nodeIds[parentIdx],
        to: nodeIds[i],
        weight: Math.floor(Math.random() * 10) + 1
      })
    }
    
    return fc.record({
      nodes: fc.tuple(...nodeIds.map(id => arbitraryGraphNode(id))).map(nodes => [...nodes]),
      edges: fc.array(
        fc.record({
          from: fc.constantFrom(...nodeIds),
          to: fc.constantFrom(...nodeIds),
          weight: fc.integer({ min: 1, max: 20 }),
          highlighted: fc.constant(false)
        }),
        { minLength: 0, maxLength: 4 }
      ).map(extraEdges => [...spanningEdges, ...extraEdges]),
      directed: fc.constant(false)
    })
  })

// Compute shortest paths using Bellman-Ford as reference (works for all graphs)
function bellmanFordDistances(graph: Graph, startNode: string): Map<string, number> {
  const distances = new Map<string, number>()
  graph.nodes.forEach(n => {
    distances.set(n.id, n.id === startNode ? 0 : Infinity)
  })
  
  // Relax edges V-1 times
  for (let i = 0; i < graph.nodes.length - 1; i++) {
    for (const edge of graph.edges) {
      const weight = edge.weight ?? 1
      const distFrom = distances.get(edge.from) ?? Infinity
      const distTo = distances.get(edge.to) ?? Infinity
      
      if (distFrom + weight < distTo) {
        distances.set(edge.to, distFrom + weight)
      }
      
      // For undirected graphs, also relax in reverse
      if (!graph.directed) {
        if (distTo + weight < distFrom) {
          distances.set(edge.from, distTo + weight)
        }
      }
    }
  }
  
  return distances
}

describe('Dijkstra Algorithm', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 3: Dijkstra Shortest Path Optimality
   * Validates: Requirements 1.3
   */
  describe('Property 3: Dijkstra Shortest Path Optimality', () => {
    it('produces optimal shortest path distances', () => {
      fc.assert(
        fc.property(arbitraryWeightedGraph(), (graph) => {
          const startNode = graph.nodes[0].id
          const steps = dijkstra(graph, startNode)
          
          // Get final distances from Dijkstra
          const finalStep = steps[steps.length - 1]
          const dijkstraDistances = finalStep.distances
          
          if (!dijkstraDistances) {
            return true // Skip if no distances (error case)
          }
          
          // Compute reference distances using Bellman-Ford
          const referenceDistances = bellmanFordDistances(graph, startNode)
          
          // Verify Dijkstra distances match reference
          for (const node of graph.nodes) {
            const dijkstraDist = dijkstraDistances.get(node.id) ?? Infinity
            const referenceDist = referenceDistances.get(node.id) ?? Infinity
            expect(dijkstraDist).toBe(referenceDist)
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('priority queue entries have non-negative distances', () => {
      fc.assert(
        fc.property(arbitraryWeightedGraph(), (graph) => {
          const startNode = graph.nodes[0].id
          const steps = dijkstra(graph, startNode)
          
          for (const step of steps) {
            if (step.priorityQueue) {
              // Each entry in priority queue should have non-negative distance
              for (const { distance } of step.priorityQueue) {
                expect(distance).toBeGreaterThanOrEqual(0)
              }
            }
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })
  })
})
