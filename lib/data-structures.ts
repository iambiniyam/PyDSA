export type DataStructureOperation = {
  type: string
  value?: any
  result: string
  complexity: string
  state: any[]
}

export type DataStructure = {
  name: string
  description: string
  category: 'linear' | 'tree' | 'graph' | 'hash'
  operations: string[]
  complexity: Record<string, string>
}

export const dataStructures: Record<string, DataStructure> = {
  stack: {
    name: 'Stack (LIFO)',
    description: 'Last In First Out - elements are added and removed from the same end',
    category: 'linear',
    operations: ['push', 'pop', 'peek', 'isEmpty'],
    complexity: {
      push: 'O(1)',
      pop: 'O(1)',
      peek: 'O(1)',
      search: 'O(n)',
    },
  },
  queue: {
    name: 'Queue (FIFO)',
    description: 'First In First Out - elements are added at rear and removed from front',
    category: 'linear',
    operations: ['enqueue', 'dequeue', 'front', 'isEmpty'],
    complexity: {
      enqueue: 'O(1)',
      dequeue: 'O(1)',
      front: 'O(1)',
      search: 'O(n)',
    },
  },
  linkedList: {
    name: 'Linked List',
    description: 'Linear collection where each element points to the next',
    category: 'linear',
    operations: ['append', 'prepend', 'delete', 'search'],
    complexity: {
      append: 'O(n)',
      prepend: 'O(1)',
      delete: 'O(n)',
      search: 'O(n)',
    },
  },
  binaryTree: {
    name: 'Binary Search Tree',
    description: 'Tree where each node has at most two children, left < parent < right',
    category: 'tree',
    operations: ['insert', 'search', 'delete', 'traverse'],
    complexity: {
      insert: 'O(log n) avg',
      search: 'O(log n) avg',
      delete: 'O(log n) avg',
      traverse: 'O(n)',
    },
  },
  heap: {
    name: 'Min/Max Heap',
    description: 'Complete binary tree where parent is smaller/larger than children',
    category: 'tree',
    operations: ['insert', 'extractMin', 'peek', 'heapify'],
    complexity: {
      insert: 'O(log n)',
      extractMin: 'O(log n)',
      peek: 'O(1)',
      heapify: 'O(n)',
    },
  },
  hashTable: {
    name: 'Hash Table',
    description: 'Key-value store with O(1) average access using hash function',
    category: 'hash',
    operations: ['put', 'get', 'remove', 'contains'],
    complexity: {
      put: 'O(1) avg',
      get: 'O(1) avg',
      remove: 'O(1) avg',
      contains: 'O(1) avg',
    },
  },
  graph: {
    name: 'Graph',
    description: 'Collection of vertices connected by edges',
    category: 'graph',
    operations: ['addVertex', 'addEdge', 'bfs', 'dfs'],
    complexity: {
      addVertex: 'O(1)',
      addEdge: 'O(1)',
      bfs: 'O(V + E)',
      dfs: 'O(V + E)',
    },
  },
}

// Binary Tree Node for visualization
export interface TreeNode {
  value: number
  left?: TreeNode
  right?: TreeNode
  x?: number
  y?: number
  highlighted?: boolean
}

// Graph Node for visualization
export interface GraphNode {
  id: string
  value: any
  x: number
  y: number
  highlighted?: boolean
}

export interface GraphEdge {
  from: string
  to: string
  weight?: number
  highlighted?: boolean
}

// Helper to create a balanced BST from sorted array
export function createBSTFromArray(arr: number[]): TreeNode | undefined {
  if (arr.length === 0) return undefined
  
  const sorted = [...arr].sort((a, b) => a - b)
  
  function buildTree(start: number, end: number): TreeNode | undefined {
    if (start > end) return undefined
    
    const mid = Math.floor((start + end) / 2)
    return {
      value: sorted[mid],
      left: buildTree(start, mid - 1),
      right: buildTree(mid + 1, end),
    }
  }
  
  return buildTree(0, sorted.length - 1)
}

// Helper to insert into BST
export function insertIntoBST(root: TreeNode | undefined, value: number): TreeNode {
  if (!root) return { value }
  
  if (value < root.value) {
    root.left = insertIntoBST(root.left, value)
  } else {
    root.right = insertIntoBST(root.right, value)
  }
  
  return root
}

// Helper for tree traversals
export function inorderTraversal(root: TreeNode | undefined): number[] {
  if (!root) return []
  return [...inorderTraversal(root.left), root.value, ...inorderTraversal(root.right)]
}

export function preorderTraversal(root: TreeNode | undefined): number[] {
  if (!root) return []
  return [root.value, ...preorderTraversal(root.left), ...preorderTraversal(root.right)]
}

export function postorderTraversal(root: TreeNode | undefined): number[] {
  if (!root) return []
  return [...postorderTraversal(root.left), ...postorderTraversal(root.right), root.value]
}

// Calculate tree positions for visualization
export function calculateTreePositions(
  root: TreeNode | undefined,
  x: number = 400,
  y: number = 50,
  level: number = 0,
  horizontalSpacing: number = 150
): TreeNode | undefined {
  if (!root) return undefined
  
  const spacing = horizontalSpacing / Math.pow(2, level)
  
  return {
    ...root,
    x,
    y,
    left: calculateTreePositions(root.left, x - spacing, y + 60, level + 1, horizontalSpacing),
    right: calculateTreePositions(root.right, x + spacing, y + 60, level + 1, horizontalSpacing),
  }
}
