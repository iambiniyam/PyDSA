// Dynamic Programming Data Structures and Types

export interface DPCell {
  value: number
  row: number
  col: number
  highlighted?: boolean
  isComputed?: boolean
  dependencies?: Array<{ row: number; col: number }>
}

export interface DPTable {
  cells: DPCell[][]
  rows: number
  cols: number
  rowLabels?: string[]
  colLabels?: string[]
}

export interface DPAlgorithmStep {
  table: DPTable
  currentCell?: { row: number; col: number }
  highlightedCells?: Array<{ row: number; col: number }>
  description: string
  comparison?: string
  result?: any
}

export interface DPAlgorithm {
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  category: 'dynamic'
  difficulty: 'medium' | 'hard'
  execute: (...args: any[]) => DPAlgorithmStep[]
}

// Create an empty DP table
export function createDPTable(rows: number, cols: number, defaultValue = 0): DPTable {
  const cells: DPCell[][] = []
  for (let i = 0; i < rows; i++) {
    cells[i] = []
    for (let j = 0; j < cols; j++) {
      cells[i][j] = {
        value: defaultValue,
        row: i,
        col: j,
        isComputed: false
      }
    }
  }
  return { cells, rows, cols }
}

// Clone a DP table for step generation
export function cloneDPTable(table: DPTable): DPTable {
  return {
    cells: table.cells.map(row =>
      row.map(cell => ({ ...cell, dependencies: cell.dependencies ? [...cell.dependencies] : undefined }))
    ),
    rows: table.rows,
    cols: table.cols,
    rowLabels: table.rowLabels ? [...table.rowLabels] : undefined,
    colLabels: table.colLabels ? [...table.colLabels] : undefined
  }
}


// Update a cell in the DP table
export function updateDPCell(
  table: DPTable,
  row: number,
  col: number,
  value: number,
  dependencies?: Array<{ row: number; col: number }>
): void {
  if (row >= 0 && row < table.rows && col >= 0 && col < table.cols) {
    table.cells[row][col] = {
      ...table.cells[row][col],
      value,
      isComputed: true,
      dependencies
    }
  }
}

// Fibonacci DP Algorithm Implementation
export function fibonacci(n: number): DPAlgorithmStep[] {
  if (n < 0) {
    return [{
      table: createDPTable(1, 1),
      description: 'Invalid input: n must be non-negative'
    }]
  }

  if (n === 0) {
    const table = createDPTable(1, 1)
    updateDPCell(table, 0, 0, 0)
    return [{
      table,
      currentCell: { row: 0, col: 0 },
      description: 'F(0) = 0',
      result: 0
    }]
  }

  const steps: DPAlgorithmStep[] = []
  const tableSize = n + 1
  const table = createDPTable(1, tableSize)
  table.colLabels = Array.from({ length: tableSize }, (_, i) => `F(${i})`)

  // Initial step
  steps.push({
    table: cloneDPTable(table),
    description: `Computing Fibonacci(${n}) using dynamic programming. Table size: ${tableSize}`
  })

  // Base cases
  updateDPCell(table, 0, 0, 0)
  steps.push({
    table: cloneDPTable(table),
    currentCell: { row: 0, col: 0 },
    description: 'Base case: F(0) = 0'
  })

  if (n >= 1) {
    updateDPCell(table, 0, 1, 1)
    steps.push({
      table: cloneDPTable(table),
      currentCell: { row: 0, col: 1 },
      description: 'Base case: F(1) = 1'
    })
  }

  // Fill the table
  for (let i = 2; i <= n; i++) {
    const prevVal1 = table.cells[0][i - 1].value
    const prevVal2 = table.cells[0][i - 2].value
    const newVal = prevVal1 + prevVal2

    // Show dependencies
    steps.push({
      table: cloneDPTable(table),
      currentCell: { row: 0, col: i },
      highlightedCells: [{ row: 0, col: i - 1 }, { row: 0, col: i - 2 }],
      description: `Computing F(${i}) = F(${i - 1}) + F(${i - 2}) = ${prevVal1} + ${prevVal2}`,
      comparison: `Reusing computed values: F(${i - 1}) = ${prevVal1}, F(${i - 2}) = ${prevVal2}`
    })

    updateDPCell(table, 0, i, newVal, [{ row: 0, col: i - 1 }, { row: 0, col: i - 2 }])

    steps.push({
      table: cloneDPTable(table),
      currentCell: { row: 0, col: i },
      description: `F(${i}) = ${newVal}`
    })
  }

  // Final step
  steps.push({
    table: cloneDPTable(table),
    description: `Fibonacci(${n}) = ${table.cells[0][n].value}`,
    result: table.cells[0][n].value
  })

  return steps
}

export const fibonacciAlgorithm: DPAlgorithm = {
  name: 'Fibonacci (DP)',
  description: 'Computes Fibonacci numbers using dynamic programming with memoization',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  category: 'dynamic',
  difficulty: 'medium',
  execute: fibonacci
}


// Longest Common Subsequence Algorithm Implementation
export function lcs(str1: string, str2: string): DPAlgorithmStep[] {
  if (!str1 || !str2) {
    return [{
      table: createDPTable(1, 1),
      description: 'Empty string provided. LCS length is 0.',
      result: { length: 0, subsequence: '' }
    }]
  }

  const m = str1.length
  const n = str2.length
  const steps: DPAlgorithmStep[] = []

  // Create table with extra row/col for base cases
  const table = createDPTable(m + 1, n + 1)
  table.rowLabels = ['', ...str1.split('')]
  table.colLabels = ['', ...str2.split('')]

  // Initial step
  steps.push({
    table: cloneDPTable(table),
    description: `Computing LCS of "${str1}" and "${str2}". Table size: ${m + 1} x ${n + 1}`
  })

  // Base cases (first row and column are already 0)
  steps.push({
    table: cloneDPTable(table),
    description: 'Base cases: First row and column initialized to 0 (empty string has LCS 0 with any string)'
  })

  // Fill the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = str1[i - 1]
      const char2 = str2[j - 1]

      if (char1 === char2) {
        const diagVal = table.cells[i - 1][j - 1].value
        const newVal = diagVal + 1

        steps.push({
          table: cloneDPTable(table),
          currentCell: { row: i, col: j },
          highlightedCells: [{ row: i - 1, col: j - 1 }],
          description: `Characters match: '${char1}' = '${char2}'`,
          comparison: `LCS[${i}][${j}] = LCS[${i - 1}][${j - 1}] + 1 = ${diagVal} + 1`
        })

        updateDPCell(table, i, j, newVal, [{ row: i - 1, col: j - 1 }])
      } else {
        const topVal = table.cells[i - 1][j].value
        const leftVal = table.cells[i][j - 1].value
        const newVal = Math.max(topVal, leftVal)

        steps.push({
          table: cloneDPTable(table),
          currentCell: { row: i, col: j },
          highlightedCells: [{ row: i - 1, col: j }, { row: i, col: j - 1 }],
          description: `Characters differ: '${char1}' ≠ '${char2}'`,
          comparison: `LCS[${i}][${j}] = max(LCS[${i - 1}][${j}], LCS[${i}][${j - 1}]) = max(${topVal}, ${leftVal})`
        })

        updateDPCell(table, i, j, newVal, [
          topVal >= leftVal ? { row: i - 1, col: j } : { row: i, col: j - 1 }
        ])
      }

      steps.push({
        table: cloneDPTable(table),
        currentCell: { row: i, col: j },
        description: `LCS[${i}][${j}] = ${table.cells[i][j].value}`
      })
    }
  }

  // Backtrack to find the actual subsequence
  const subsequence = backtrackLCS(table, str1, str2)

  steps.push({
    table: cloneDPTable(table),
    description: `LCS complete. Length: ${table.cells[m][n].value}, Subsequence: "${subsequence}"`,
    result: { length: table.cells[m][n].value, subsequence }
  })

  return steps
}

// Backtrack to find the actual LCS string
function backtrackLCS(table: DPTable, str1: string, str2: string): string {
  let i = str1.length
  let j = str2.length
  const result: string[] = []

  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      result.unshift(str1[i - 1])
      i--
      j--
    } else if (table.cells[i - 1][j].value > table.cells[i][j - 1].value) {
      i--
    } else {
      j--
    }
  }

  return result.join('')
}

export const lcsAlgorithm: DPAlgorithm = {
  name: 'Longest Common Subsequence',
  description: 'Finds the longest subsequence common to two strings using dynamic programming',
  timeComplexity: 'O(m × n)',
  spaceComplexity: 'O(m × n)',
  category: 'dynamic',
  difficulty: 'medium',
  execute: lcs
}


// 0/1 Knapsack Algorithm Implementation
export interface KnapsackItem {
  weight: number
  value: number
  name?: string
}

export interface KnapsackResult {
  maxValue: number
  selectedItems: number[]
  totalWeight: number
}

export function knapsack(items: KnapsackItem[], capacity: number): DPAlgorithmStep[] {
  if (!items || items.length === 0) {
    return [{
      table: createDPTable(1, 1),
      description: 'No items provided.',
      result: { maxValue: 0, selectedItems: [], totalWeight: 0 }
    }]
  }

  if (capacity <= 0) {
    return [{
      table: createDPTable(1, 1),
      description: 'Invalid capacity. Must be positive.',
      result: { maxValue: 0, selectedItems: [], totalWeight: 0 }
    }]
  }

  const n = items.length
  const steps: DPAlgorithmStep[] = []

  // Create table: rows = items (+ 1 for base), cols = capacities (+ 1 for 0)
  const table = createDPTable(n + 1, capacity + 1)
  table.rowLabels = ['∅', ...items.map((item, i) => item.name || `Item ${i + 1}`)]
  table.colLabels = Array.from({ length: capacity + 1 }, (_, i) => `W=${i}`)

  // Initial step
  steps.push({
    table: cloneDPTable(table),
    description: `0/1 Knapsack: ${n} items, capacity ${capacity}. Items: ${items.map((it, i) => `${it.name || `Item ${i + 1}`}(w=${it.weight}, v=${it.value})`).join(', ')}`
  })

  // Base case: first row is already 0
  steps.push({
    table: cloneDPTable(table),
    description: 'Base case: With 0 items, maximum value is 0 for any capacity'
  })

  // Fill the table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]
    const itemName = item.name || `Item ${i}`

    for (let w = 0; w <= capacity; w++) {
      const excludeVal = table.cells[i - 1][w].value

      if (item.weight > w) {
        // Item too heavy, can't include
        steps.push({
          table: cloneDPTable(table),
          currentCell: { row: i, col: w },
          highlightedCells: [{ row: i - 1, col: w }],
          description: `${itemName} (weight=${item.weight}) > capacity ${w}. Cannot include.`,
          comparison: `K[${i}][${w}] = K[${i - 1}][${w}] = ${excludeVal}`
        })

        updateDPCell(table, i, w, excludeVal, [{ row: i - 1, col: w }])
      } else {
        // Can include: choose max of include vs exclude
        const includeVal = item.value + table.cells[i - 1][w - item.weight].value

        steps.push({
          table: cloneDPTable(table),
          currentCell: { row: i, col: w },
          highlightedCells: [{ row: i - 1, col: w }, { row: i - 1, col: w - item.weight }],
          description: `${itemName}: Include (${item.value} + K[${i - 1}][${w - item.weight}] = ${includeVal}) vs Exclude (K[${i - 1}][${w}] = ${excludeVal})`,
          comparison: `K[${i}][${w}] = max(${includeVal}, ${excludeVal}) = ${Math.max(includeVal, excludeVal)}`
        })

        const newVal = Math.max(includeVal, excludeVal)
        const deps = includeVal > excludeVal
          ? [{ row: i - 1, col: w - item.weight }]
          : [{ row: i - 1, col: w }]

        updateDPCell(table, i, w, newVal, deps)
      }

      steps.push({
        table: cloneDPTable(table),
        currentCell: { row: i, col: w },
        description: `K[${i}][${w}] = ${table.cells[i][w].value}`
      })
    }
  }

  // Backtrack to find selected items
  const selectedItems = backtrackKnapsack(table, items, capacity)
  const totalWeight = selectedItems.reduce((sum, idx) => sum + items[idx].weight, 0)

  steps.push({
    table: cloneDPTable(table),
    description: `Knapsack complete. Max value: ${table.cells[n][capacity].value}. Selected: ${selectedItems.map(i => items[i].name || `Item ${i + 1}`).join(', ')}`,
    result: {
      maxValue: table.cells[n][capacity].value,
      selectedItems,
      totalWeight
    }
  })

  return steps
}

// Backtrack to find selected items
function backtrackKnapsack(table: DPTable, items: KnapsackItem[], capacity: number): number[] {
  const selected: number[] = []
  let i = items.length
  let w = capacity

  while (i > 0 && w > 0) {
    if (table.cells[i][w].value !== table.cells[i - 1][w].value) {
      // Item i-1 was included
      selected.unshift(i - 1)
      w -= items[i - 1].weight
    }
    i--
  }

  return selected
}

export const knapsackAlgorithm: DPAlgorithm = {
  name: '0/1 Knapsack',
  description: 'Finds the maximum value that can be obtained by selecting items without exceeding capacity',
  timeComplexity: 'O(n × W)',
  spaceComplexity: 'O(n × W)',
  category: 'dynamic',
  difficulty: 'hard',
  execute: knapsack
}

// Export all DP algorithms
export const dpAlgorithms: Record<string, DPAlgorithm> = {
  fibonacci: fibonacciAlgorithm,
  lcs: lcsAlgorithm,
  knapsack: knapsackAlgorithm
}
