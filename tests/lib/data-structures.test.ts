import { describe, it, expect } from 'vitest'
import {
  dataStructures,
  createBSTFromArray,
  insertIntoBST,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  calculateTreePositions,
} from '@/lib/data-structures'

describe('Data Structures', () => {
  describe('Data Structure Definitions', () => {
    it('should have all required data structures', () => {
      const requiredStructures = ['stack', 'queue', 'linkedList', 'binaryTree', 'heap', 'hashTable', 'graph']
      
      for (const structure of requiredStructures) {
        expect(dataStructures[structure]).toBeDefined()
      }
    })

    it('should have correct metadata for each structure', () => {
      for (const [key, ds] of Object.entries(dataStructures)) {
        expect(ds.name).toBeDefined()
        expect(ds.description).toBeDefined()
        expect(ds.category).toBeDefined()
        expect(ds.operations).toBeDefined()
        expect(ds.complexity).toBeDefined()
        expect(Array.isArray(ds.operations)).toBe(true)
      }
    })

    it('should categorize structures correctly', () => {
      expect(dataStructures.stack.category).toBe('linear')
      expect(dataStructures.queue.category).toBe('linear')
      expect(dataStructures.linkedList.category).toBe('linear')
      expect(dataStructures.binaryTree.category).toBe('tree')
      expect(dataStructures.heap.category).toBe('tree')
      expect(dataStructures.hashTable.category).toBe('hash')
      expect(dataStructures.graph.category).toBe('graph')
    })
  })

  describe('Stack', () => {
    it('should have O(1) push and pop complexity', () => {
      const stack = dataStructures.stack
      expect(stack.complexity.push).toBe('O(1)')
      expect(stack.complexity.pop).toBe('O(1)')
      expect(stack.complexity.peek).toBe('O(1)')
    })

    it('should have correct operations', () => {
      const stack = dataStructures.stack
      expect(stack.operations).toContain('push')
      expect(stack.operations).toContain('pop')
      expect(stack.operations).toContain('peek')
      expect(stack.operations).toContain('isEmpty')
    })
  })

  describe('Queue', () => {
    it('should have O(1) enqueue and dequeue complexity', () => {
      const queue = dataStructures.queue
      expect(queue.complexity.enqueue).toBe('O(1)')
      expect(queue.complexity.dequeue).toBe('O(1)')
    })

    it('should have correct operations', () => {
      const queue = dataStructures.queue
      expect(queue.operations).toContain('enqueue')
      expect(queue.operations).toContain('dequeue')
      expect(queue.operations).toContain('front')
    })
  })

  describe('Binary Search Tree', () => {
    it('should create BST from array', () => {
      const arr = [5, 3, 7, 1, 4, 6, 8]
      const root = createBSTFromArray(arr)
      
      expect(root).toBeDefined()
      expect(root?.value).toBeDefined()
    })

    it('should return undefined for empty array', () => {
      const root = createBSTFromArray([])
      expect(root).toBeUndefined()
    })

    it('should insert into BST correctly', () => {
      let root = insertIntoBST(undefined, 5)
      root = insertIntoBST(root, 3)
      root = insertIntoBST(root, 7)
      
      expect(root.value).toBe(5)
      expect(root.left?.value).toBe(3)
      expect(root.right?.value).toBe(7)
    })

    it('should maintain BST property after insertions', () => {
      let root = insertIntoBST(undefined, 5)
      root = insertIntoBST(root, 3)
      root = insertIntoBST(root, 7)
      root = insertIntoBST(root, 1)
      root = insertIntoBST(root, 4)
      
      // Inorder should be sorted
      const inorder = inorderTraversal(root)
      expect(inorder).toEqual([1, 3, 4, 5, 7])
    })
  })

  describe('Tree Traversals', () => {
    let root: ReturnType<typeof createBSTFromArray>

    beforeEach(() => {
      // Create a balanced BST: [1, 3, 4, 5, 6, 7, 8]
      root = createBSTFromArray([5, 3, 7, 1, 4, 6, 8])
    })

    it('should perform inorder traversal (sorted)', () => {
      const result = inorderTraversal(root)
      expect(result).toEqual([1, 3, 4, 5, 6, 7, 8])
    })

    it('should perform preorder traversal', () => {
      const result = preorderTraversal(root)
      // Root first, then left subtree, then right subtree
      expect(result[0]).toBe(5) // Root of balanced BST from [1,3,4,5,6,7,8] is 5
      expect(result.length).toBe(7)
    })

    it('should perform postorder traversal', () => {
      const result = postorderTraversal(root)
      // Left subtree, right subtree, then root
      expect(result[result.length - 1]).toBe(5) // Root is last
      expect(result.length).toBe(7)
    })

    it('should handle empty tree', () => {
      expect(inorderTraversal(undefined)).toEqual([])
      expect(preorderTraversal(undefined)).toEqual([])
      expect(postorderTraversal(undefined)).toEqual([])
    })

    it('should handle single node', () => {
      const single = { value: 42 }
      expect(inorderTraversal(single)).toEqual([42])
      expect(preorderTraversal(single)).toEqual([42])
      expect(postorderTraversal(single)).toEqual([42])
    })
  })

  describe('Tree Position Calculation', () => {
    it('should calculate positions for visualization', () => {
      const root = createBSTFromArray([5, 3, 7])
      const positioned = calculateTreePositions(root)
      
      expect(positioned?.x).toBeDefined()
      expect(positioned?.y).toBeDefined()
    })

    it('should position children relative to parent', () => {
      const root = createBSTFromArray([5, 3, 7])
      const positioned = calculateTreePositions(root, 400, 50)
      
      if (positioned?.left && positioned?.right) {
        // Left child should be to the left of root
        expect(positioned.left.x).toBeLessThan(positioned.x!)
        // Right child should be to the right of root
        expect(positioned.right.x).toBeGreaterThan(positioned.x!)
        // Children should be below parent
        expect(positioned.left.y).toBeGreaterThan(positioned.y!)
        expect(positioned.right.y).toBeGreaterThan(positioned.y!)
      }
    })

    it('should handle undefined root', () => {
      const positioned = calculateTreePositions(undefined)
      expect(positioned).toBeUndefined()
    })
  })

  describe('Hash Table', () => {
    it('should have O(1) average complexity', () => {
      const hashTable = dataStructures.hashTable
      expect(hashTable.complexity.put).toBe('O(1) avg')
      expect(hashTable.complexity.get).toBe('O(1) avg')
      expect(hashTable.complexity.remove).toBe('O(1) avg')
    })
  })

  describe('Graph', () => {
    it('should have correct traversal complexity', () => {
      const graph = dataStructures.graph
      expect(graph.complexity.bfs).toBe('O(V + E)')
      expect(graph.complexity.dfs).toBe('O(V + E)')
    })

    it('should have correct operations', () => {
      const graph = dataStructures.graph
      expect(graph.operations).toContain('addVertex')
      expect(graph.operations).toContain('addEdge')
      expect(graph.operations).toContain('bfs')
      expect(graph.operations).toContain('dfs')
    })
  })

  describe('Heap', () => {
    it('should have O(log n) insert and extract complexity', () => {
      const heap = dataStructures.heap
      expect(heap.complexity.insert).toBe('O(log n)')
      expect(heap.complexity.extractMin).toBe('O(log n)')
    })

    it('should have O(1) peek complexity', () => {
      const heap = dataStructures.heap
      expect(heap.complexity.peek).toBe('O(1)')
    })
  })
})

// Import beforeEach for the test
import { beforeEach } from 'vitest'
