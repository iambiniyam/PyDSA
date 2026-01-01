import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  createDPTable,
  cloneDPTable,
  updateDPCell,
  fibonacci,
  lcs,
  knapsack,
  KnapsackItem
} from '../../lib/dp-algorithms'

describe('DP Table Utilities', () => {
  it('createDPTable creates table with correct dimensions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 1, max: 20 }),
        (rows, cols) => {
          const table = createDPTable(rows, cols)
          expect(table.rows).toBe(rows)
          expect(table.cols).toBe(cols)
          expect(table.cells.length).toBe(rows)
          expect(table.cells[0].length).toBe(cols)
        }
      ),
      { numRuns: 50 }
    )
  })

  it('cloneDPTable creates independent copy', () => {
    const table = createDPTable(3, 3)
    updateDPCell(table, 1, 1, 42)
    const clone = cloneDPTable(table)
    
    updateDPCell(clone, 1, 1, 100)
    expect(table.cells[1][1].value).toBe(42)
    expect(clone.cells[1][1].value).toBe(100)
  })
})

describe('Fibonacci Algorithm', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 6: Fibonacci DP Recurrence
   * Validates: Requirements 2.1
   */
  describe('Property 6: Fibonacci DP Recurrence', () => {
    it('satisfies F(n) = F(n-1) + F(n-2) for all computed values', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 30 }), (n) => {
          const steps = fibonacci(n)
          const finalStep = steps[steps.length - 1]
          const table = finalStep.table

          // Verify recurrence relation for all values >= 2
          for (let i = 2; i <= n; i++) {
            const fib_i = table.cells[0][i].value
            const fib_i_1 = table.cells[0][i - 1].value
            const fib_i_2 = table.cells[0][i - 2].value
            expect(fib_i).toBe(fib_i_1 + fib_i_2)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('base cases are correct: F(0) = 0, F(1) = 1', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 30 }), (n) => {
          const steps = fibonacci(n)
          const finalStep = steps[steps.length - 1]
          const table = finalStep.table

          expect(table.cells[0][0].value).toBe(0)
          if (n >= 1) {
            expect(table.cells[0][1].value).toBe(1)
          }

          return true
        }),
        { numRuns: 100 }
      )
    })

    it('produces known Fibonacci values', () => {
      const knownFib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
      
      for (let i = 0; i < knownFib.length; i++) {
        const steps = fibonacci(i)
        const result = steps[steps.length - 1].result
        expect(result).toBe(knownFib[i])
      }
    })
  })
})


describe('LCS Algorithm', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 7: LCS Optimal Substructure
   * Validates: Requirements 2.2
   */
  describe('Property 7: LCS Optimal Substructure', () => {
    it('LCS length is symmetric: LCS(A,B) = LCS(B,A)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          fc.string({ minLength: 1, maxLength: 10 }),
          (str1, str2) => {
            const steps1 = lcs(str1, str2)
            const steps2 = lcs(str2, str1)
            
            const result1 = steps1[steps1.length - 1].result
            const result2 = steps2[steps2.length - 1].result

            expect(result1.length).toBe(result2.length)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('LCS length is bounded by min length of inputs', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 15 }),
          fc.string({ minLength: 1, maxLength: 15 }),
          (str1, str2) => {
            const steps = lcs(str1, str2)
            const result = steps[steps.length - 1].result

            expect(result.length).toBeLessThanOrEqual(Math.min(str1.length, str2.length))
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('LCS of identical strings equals the string itself', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 10 }), (str) => {
          const steps = lcs(str, str)
          const result = steps[steps.length - 1].result

          expect(result.length).toBe(str.length)
          expect(result.subsequence).toBe(str)
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('LCS subsequence is actually a subsequence of both strings', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }),
          fc.string({ minLength: 1, maxLength: 10 }),
          (str1, str2) => {
            const steps = lcs(str1, str2)
            const result = steps[steps.length - 1].result
            const subseq = result.subsequence

            if (subseq.length === 0) return true

            // Verify subsequence is in str1
            let idx1 = 0
            for (const char of subseq) {
              while (idx1 < str1.length && str1[idx1] !== char) idx1++
              expect(idx1).toBeLessThan(str1.length)
              idx1++
            }

            // Verify subsequence is in str2
            let idx2 = 0
            for (const char of subseq) {
              while (idx2 < str2.length && str2[idx2] !== char) idx2++
              expect(idx2).toBeLessThan(str2.length)
              idx2++
            }

            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('produces correct LCS for known examples', () => {
      const testCases = [
        { str1: 'ABCDGH', str2: 'AEDFHR', expectedLength: 3 },
        { str1: 'AGGTAB', str2: 'GXTXAYB', expectedLength: 4 },
        { str1: 'ABC', str2: 'DEF', expectedLength: 0 },
        { str1: 'ABC', str2: 'ABC', expectedLength: 3 }
      ]

      for (const { str1, str2, expectedLength } of testCases) {
        const steps = lcs(str1, str2)
        const result = steps[steps.length - 1].result
        expect(result.length).toBe(expectedLength)
      }
    })
  })
})


describe('Knapsack Algorithm', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 8: Knapsack Optimality
   * Validates: Requirements 2.3
   */
  describe('Property 8: Knapsack Optimality', () => {
    const arbitraryKnapsackItems = (): fc.Arbitrary<KnapsackItem[]> =>
      fc.array(
        fc.record({
          weight: fc.integer({ min: 1, max: 20 }),
          value: fc.integer({ min: 1, max: 100 }),
          name: fc.string({ minLength: 1, maxLength: 5 })
        }),
        { minLength: 1, maxLength: 8 }
      )

    it('selected items do not exceed capacity', () => {
      fc.assert(
        fc.property(
          arbitraryKnapsackItems(),
          fc.integer({ min: 1, max: 50 }),
          (items, capacity) => {
            const steps = knapsack(items, capacity)
            const result = steps[steps.length - 1].result as {
              maxValue: number
              selectedItems: number[]
              totalWeight: number
            }

            expect(result.totalWeight).toBeLessThanOrEqual(capacity)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('total value equals sum of selected item values', () => {
      fc.assert(
        fc.property(
          arbitraryKnapsackItems(),
          fc.integer({ min: 1, max: 50 }),
          (items, capacity) => {
            const steps = knapsack(items, capacity)
            const result = steps[steps.length - 1].result as {
              maxValue: number
              selectedItems: number[]
              totalWeight: number
            }

            const computedValue = result.selectedItems.reduce(
              (sum, idx) => sum + items[idx].value,
              0
            )
            expect(result.maxValue).toBe(computedValue)
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('result is at least as good as any single item that fits', () => {
      fc.assert(
        fc.property(
          arbitraryKnapsackItems(),
          fc.integer({ min: 1, max: 50 }),
          (items, capacity) => {
            const steps = knapsack(items, capacity)
            const result = steps[steps.length - 1].result as {
              maxValue: number
              selectedItems: number[]
              totalWeight: number
            }

            for (const item of items) {
              if (item.weight <= capacity) {
                expect(result.maxValue).toBeGreaterThanOrEqual(item.value)
              }
            }
            return true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('produces optimal solution for known examples', () => {
      const items: KnapsackItem[] = [
        { weight: 10, value: 60, name: 'A' },
        { weight: 20, value: 100, name: 'B' },
        { weight: 30, value: 120, name: 'C' }
      ]
      const capacity = 50

      const steps = knapsack(items, capacity)
      const result = steps[steps.length - 1].result as {
        maxValue: number
        selectedItems: number[]
        totalWeight: number
      }

      expect(result.maxValue).toBe(220)
      expect(result.totalWeight).toBeLessThanOrEqual(capacity)
    })

    it('empty capacity returns zero value', () => {
      const items: KnapsackItem[] = [{ weight: 5, value: 10, name: 'A' }]
      const steps = knapsack(items, 0)
      const result = steps[steps.length - 1].result as {
        maxValue: number
        selectedItems: number[]
        totalWeight: number
      }

      expect(result.maxValue).toBe(0)
      expect(result.selectedItems).toHaveLength(0)
    })
  })
})
