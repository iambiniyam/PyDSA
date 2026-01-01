import { describe, it, expect, beforeEach } from 'vitest'
import { algorithms, clearAlgorithmCache, getAlgorithmsByCategory, getAlgorithmsByDifficulty } from '@/lib/algorithms'

describe('Algorithms', () => {
  beforeEach(() => {
    clearAlgorithmCache()
  })

  describe('Linear Search', () => {
    const linearSearch = algorithms.linearSearch

    it('should have correct metadata', () => {
      expect(linearSearch.name).toBe('Linear Search')
      expect(linearSearch.timeComplexity).toBe('O(n)')
      expect(linearSearch.spaceComplexity).toBe('O(1)')
      expect(linearSearch.category).toBe('searching')
      expect(linearSearch.requiresTarget).toBe(true)
    })

    it('should find target in array', () => {
      const steps = linearSearch.execute([5, 2, 8, 1, 9], 8)
      const lastStep = steps[steps.length - 1]
      expect(lastStep.description).toContain('Found 8')
    })

    it('should handle target not found', () => {
      const steps = linearSearch.execute([5, 2, 8, 1, 9], 100)
      const lastStep = steps[steps.length - 1]
      expect(lastStep.description).toContain('not found')
    })

    it('should find first element', () => {
      const steps = linearSearch.execute([5, 2, 8], 5)
      expect(steps.length).toBeGreaterThan(1)
      expect(steps[steps.length - 1].description).toContain('Found 5')
    })

    it('should find last element', () => {
      const steps = linearSearch.execute([5, 2, 8], 8)
      expect(steps[steps.length - 1].description).toContain('Found 8')
    })
  })

  describe('Binary Search', () => {
    const binarySearch = algorithms.binarySearch

    it('should have correct metadata', () => {
      expect(binarySearch.name).toBe('Binary Search')
      expect(binarySearch.timeComplexity).toBe('O(log n)')
      expect(binarySearch.category).toBe('searching')
    })

    it('should find target in sorted array', () => {
      const steps = binarySearch.execute([1, 2, 3, 5, 8, 9], 5)
      const lastStep = steps[steps.length - 1]
      expect(lastStep.description).toContain('Found 5')
    })

    it('should sort array before searching', () => {
      const steps = binarySearch.execute([9, 1, 5, 3, 8, 2], 5)
      // First step should show sorted array
      expect(steps[0].array).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('should handle target not found', () => {
      const steps = binarySearch.execute([1, 2, 3, 5, 8, 9], 7)
      const lastStep = steps[steps.length - 1]
      expect(lastStep.description).toContain('not found')
    })
  })

  describe('Bubble Sort', () => {
    const bubbleSort = algorithms.bubbleSort

    it('should have correct metadata', () => {
      expect(bubbleSort.name).toBe('Bubble Sort')
      expect(bubbleSort.timeComplexity).toBe('O(n²)')
      expect(bubbleSort.category).toBe('sorting')
    })

    it('should sort array correctly', () => {
      const steps = bubbleSort.execute([5, 2, 8, 1, 9, 3])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 5, 8, 9])
      expect(lastStep.description).toContain('complete')
    })

    it('should handle already sorted array', () => {
      const steps = bubbleSort.execute([1, 2, 3, 4, 5])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle reverse sorted array', () => {
      const steps = bubbleSort.execute([5, 4, 3, 2, 1])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle single element', () => {
      const steps = bubbleSort.execute([1])
      expect(steps[steps.length - 1].array).toEqual([1])
    })
  })

  describe('Selection Sort', () => {
    const selectionSort = algorithms.selectionSort

    it('should sort array correctly', () => {
      const steps = selectionSort.execute([5, 2, 8, 1, 9, 3])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('should handle duplicates', () => {
      const steps = selectionSort.execute([3, 1, 3, 2, 1])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 1, 2, 3, 3])
    })
  })

  describe('Insertion Sort', () => {
    const insertionSort = algorithms.insertionSort

    it('should sort array correctly', () => {
      const steps = insertionSort.execute([5, 2, 8, 1, 9, 3])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('should have correct category', () => {
      expect(insertionSort.category).toBe('sorting')
      expect(insertionSort.difficulty).toBe('easy')
    })
  })

  describe('Quick Sort', () => {
    const quickSort = algorithms.quickSort

    it('should have correct metadata', () => {
      expect(quickSort.name).toBe('Quick Sort')
      expect(quickSort.category).toBe('divide-conquer')
      expect(quickSort.difficulty).toBe('medium')
    })

    it('should sort array correctly', () => {
      const steps = quickSort.execute([5, 2, 8, 1, 9, 3])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('should handle negative numbers', () => {
      const steps = quickSort.execute([-3, 5, -1, 0, 2])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([-3, -1, 0, 2, 5])
    })
  })

  describe('Merge Sort', () => {
    const mergeSort = algorithms.mergeSort

    it('should sort array correctly', () => {
      const steps = mergeSort.execute([5, 2, 8, 1, 9, 3])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('should have O(n log n) complexity', () => {
      expect(mergeSort.timeComplexity).toBe('O(n log n)')
    })
  })

  describe('Heap Sort', () => {
    const heapSort = algorithms.heapSort

    it('should sort array correctly', () => {
      const steps = heapSort.execute([5, 2, 8, 1, 9, 3])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 3, 5, 8, 9])
    })

    it('should be marked as hard difficulty', () => {
      expect(heapSort.difficulty).toBe('hard')
    })
  })

  describe('Counting Sort', () => {
    const countingSort = algorithms.countingSort

    it('should sort array correctly', () => {
      const steps = countingSort.execute([4, 2, 2, 8, 3, 3, 1])
      const lastStep = steps[steps.length - 1]
      expect(lastStep.array).toEqual([1, 2, 2, 3, 3, 4, 8])
    })

    it('should handle empty array', () => {
      const steps = countingSort.execute([])
      expect(steps.length).toBe(1)
    })
  })

  describe('Helper Functions', () => {
    it('getAlgorithmsByCategory should filter correctly', () => {
      const searchAlgos = getAlgorithmsByCategory('searching')
      expect(searchAlgos.every(a => a.category === 'searching')).toBe(true)
      expect(searchAlgos.length).toBeGreaterThan(0)
    })

    it('getAlgorithmsByDifficulty should filter correctly', () => {
      const easyAlgos = getAlgorithmsByDifficulty('easy')
      expect(easyAlgos.every(a => a.difficulty === 'easy')).toBe(true)
    })

    it('clearAlgorithmCache should not throw', () => {
      expect(() => clearAlgorithmCache()).not.toThrow()
    })
  })

  describe('Caching', () => {
    it('should return same result for same input', () => {
      const steps1 = algorithms.linearSearch.execute([1, 2, 3], 2)
      const steps2 = algorithms.linearSearch.execute([1, 2, 3], 2)
      expect(steps1).toEqual(steps2)
    })
  })
})
