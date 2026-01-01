import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateComplexityData, ComplexityType } from '../../components/complexity-chart'

describe('Complexity Chart', () => {
  /**
   * Feature: algorithm-learning-enhancements, Property 10: Complexity Curve Mathematical Correctness
   * Validates: Requirements 3.4, 4.2
   */
  describe('Property 10: Complexity Curve Mathematical Correctness', () => {
    it('O(1) is constant for all input sizes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.integer({ min: 1, max: 1000 }),
          (n1, n2) => {
            const val1 = generateComplexityData('O(1)', n1)
            const val2 = generateComplexityData('O(1)', n2)
            expect(val1).toBe(1)
            expect(val2).toBe(1)
            expect(val1).toBe(val2)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('O(log n) grows logarithmically', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 1000 }), (n) => {
          const logN = generateComplexityData('O(log n)', n)
          const expected = Math.log2(n)
          expect(logN).toBeCloseTo(expected, 10)
        }),
        { numRuns: 100 }
      )
    })

    it('O(n) grows linearly', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000 }), (n) => {
          const linearN = generateComplexityData('O(n)', n)
          expect(linearN).toBe(n)
        }),
        { numRuns: 100 }
      )
    })

    it('O(n log n) satisfies n * log(n)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 500 }), (n) => {
          const nLogN = generateComplexityData('O(n log n)', n)
          const expected = n * Math.log2(n)
          expect(nLogN).toBeCloseTo(expected, 10)
        }),
        { numRuns: 100 }
      )
    })

    it('O(n²) grows quadratically', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 500 }), (n) => {
          const quadratic = generateComplexityData('O(n²)', n)
          expect(quadratic).toBe(n * n)
        }),
        { numRuns: 100 }
      )
    })

    it('O(2^n) grows exponentially', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 20 }), (n) => {
          const exponential = generateComplexityData('O(2^n)', n)
          const expected = Math.pow(2, n)
          expect(exponential).toBe(expected)
        }),
        { numRuns: 100 }
      )
    })

    it('complexity ordering: O(1) < O(log n) < O(n) < O(n log n) < O(n²)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 10, max: 100 }), (n) => {
          const constant = generateComplexityData('O(1)', n)
          const logarithmic = generateComplexityData('O(log n)', n)
          const linear = generateComplexityData('O(n)', n)
          const nLogN = generateComplexityData('O(n log n)', n)
          const quadratic = generateComplexityData('O(n²)', n)

          expect(constant).toBeLessThan(logarithmic)
          expect(logarithmic).toBeLessThan(linear)
          expect(linear).toBeLessThan(nLogN)
          expect(nLogN).toBeLessThan(quadratic)
        }),
        { numRuns: 100 }
      )
    })

    it('doubling input size doubles O(n) operations', () => {
      fc.assert(
        fc.property(fc.integer({ min: 10, max: 500 }), (n) => {
          const ops1 = generateComplexityData('O(n)', n)
          const ops2 = generateComplexityData('O(n)', n * 2)
          expect(ops2).toBe(ops1 * 2)
        }),
        { numRuns: 100 }
      )
    })

    it('doubling input size quadruples O(n²) operations', () => {
      fc.assert(
        fc.property(fc.integer({ min: 10, max: 200 }), (n) => {
          const ops1 = generateComplexityData('O(n²)', n)
          const ops2 = generateComplexityData('O(n²)', n * 2)
          expect(ops2).toBe(ops1 * 4)
        }),
        { numRuns: 100 }
      )
    })
  })
})
