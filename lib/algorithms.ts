export type AlgorithmStep = {
  array: number[];
  currentIndex: number;
  compareIndex?: number;
  sortedIndices?: number[];
  pivotIndex?: number;
  leftPointer?: number;
  rightPointer?: number;
  description: string;
  comparison?: string;
  auxiliaryArray?: number[];
};

export type Algorithm = {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: "searching" | "sorting" | "divide-conquer" | "dynamic";
  difficulty: "easy" | "medium" | "hard";
  requiresTarget?: boolean;
  execute: (arr: number[], target?: number) => AlgorithmStep[];
};

// Memoization cache for algorithm results
const algorithmCache = new Map<string, AlgorithmStep[]>();

function getCacheKey(
  algorithm: string,
  arr: number[],
  target?: number
): string {
  return `${algorithm}-${arr.join(",")}-${target ?? ""}`;
}

function getCachedResult(key: string): AlgorithmStep[] | undefined {
  return algorithmCache.get(key);
}

function setCachedResult(key: string, result: AlgorithmStep[]): void {
  if (algorithmCache.size > 100) {
    const firstKey = algorithmCache.keys().next().value;
    if (firstKey) algorithmCache.delete(firstKey);
  }
  algorithmCache.set(key, result);
}

export const algorithms: Record<string, Algorithm> = {
  linearSearch: {
    name: "Linear Search",
    description:
      "Searches for a target by checking each element sequentially from start to end",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    category: "searching",
    difficulty: "easy",
    requiresTarget: true,
    execute: (arr: number[], target = 0) => {
      const cacheKey = getCacheKey("linearSearch", arr, target);
      const cached = getCachedResult(cacheKey);
      if (cached) return cached;

      const steps: AlgorithmStep[] = [];
      steps.push({
        array: [...arr],
        currentIndex: -1,
        description: `Starting linear search for ${target}`,
      });

      for (let i = 0; i < arr.length; i++) {
        steps.push({
          array: [...arr],
          currentIndex: i,
          description: `Checking index ${i}: value is ${arr[i]}`,
          comparison:
            arr[i] === target
              ? `Found! ${arr[i]} equals ${target}`
              : `${arr[i]} does not equal ${target}, continue searching`,
        });

        if (arr[i] === target) {
          steps.push({
            array: [...arr],
            currentIndex: i,
            description: `Success! Found ${target} at index ${i}`,
          });
          setCachedResult(cacheKey, steps);
          return steps;
        }
      }

      steps.push({
        array: [...arr],
        currentIndex: -1,
        description: `${target} not found in array`,
      });

      setCachedResult(cacheKey, steps);
      return steps;
    },
  },

  binarySearch: {
    name: "Binary Search",
    description:
      "Efficiently searches a sorted array by repeatedly dividing the search interval in half",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    category: "searching",
    difficulty: "easy",
    requiresTarget: true,
    execute: (arr: number[], target = 0) => {
      const cacheKey = getCacheKey("binarySearch", arr, target);
      const cached = getCachedResult(cacheKey);
      if (cached) return cached;

      const steps: AlgorithmStep[] = [];
      const sortedArr = [...arr].sort((a, b) => a - b);

      steps.push({
        array: sortedArr,
        currentIndex: -1,
        description: `Starting binary search for ${target} (array must be sorted)`,
      });

      let left = 0;
      let right = sortedArr.length - 1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
          array: sortedArr,
          currentIndex: mid,
          leftPointer: left,
          rightPointer: right,
          description: `Checking middle index ${mid}: value is ${sortedArr[mid]}`,
          comparison: `Comparing ${sortedArr[mid]} with target ${target}`,
        });

        if (sortedArr[mid] === target) {
          steps.push({
            array: sortedArr,
            currentIndex: mid,
            description: `Success! Found ${target} at index ${mid}`,
          });
          setCachedResult(cacheKey, steps);
          return steps;
        }

        if (sortedArr[mid] < target) {
          steps.push({
            array: sortedArr,
            currentIndex: mid,
            leftPointer: mid + 1,
            rightPointer: right,
            description: `${sortedArr[mid]} < ${target}, search right half`,
          });
          left = mid + 1;
        } else {
          steps.push({
            array: sortedArr,
            currentIndex: mid,
            leftPointer: left,
            rightPointer: mid - 1,
            description: `${sortedArr[mid]} > ${target}, search left half`,
          });
          right = mid - 1;
        }
      }

      steps.push({
        array: sortedArr,
        currentIndex: -1,
        description: `${target} not found in array`,
      });

      setCachedResult(cacheKey, steps);
      return steps;
    },
  },

  jumpSearch: {
    name: "Jump Search",
    description:
      "Searches sorted array by jumping ahead by fixed steps, then linear search in block",
    timeComplexity: "O(√n)",
    spaceComplexity: "O(1)",
    category: "searching",
    difficulty: "medium",
    requiresTarget: true,
    execute: (arr: number[], target = 0) => {
      const steps: AlgorithmStep[] = [];
      const sortedArr = [...arr].sort((a, b) => a - b);
      const n = sortedArr.length;
      const jumpSize = Math.floor(Math.sqrt(n));

      steps.push({
        array: sortedArr,
        currentIndex: -1,
        description: `Starting jump search for ${target}. Jump size: ${jumpSize}`,
      });

      let prev = 0;
      let curr = jumpSize;

      while (curr < n && sortedArr[curr] < target) {
        steps.push({
          array: sortedArr,
          currentIndex: curr,
          leftPointer: prev,
          description: `Jumping to index ${curr}: value ${sortedArr[curr]} < ${target}`,
        });
        prev = curr;
        curr += jumpSize;
      }

      steps.push({
        array: sortedArr,
        currentIndex: Math.min(curr, n - 1),
        leftPointer: prev,
        description: `Block found. Linear search from index ${prev} to ${Math.min(
          curr,
          n - 1
        )}`,
      });

      for (let i = prev; i <= Math.min(curr, n - 1); i++) {
        steps.push({
          array: sortedArr,
          currentIndex: i,
          description: `Checking index ${i}: value is ${sortedArr[i]}`,
          comparison: sortedArr[i] === target ? `Found!` : `Continue...`,
        });

        if (sortedArr[i] === target) {
          steps.push({
            array: sortedArr,
            currentIndex: i,
            description: `Success! Found ${target} at index ${i}`,
          });
          return steps;
        }
      }

      steps.push({
        array: sortedArr,
        currentIndex: -1,
        description: `${target} not found in array`,
      });

      return steps;
    },
  },

  interpolationSearch: {
    name: "Interpolation Search",
    description:
      "Improved binary search for uniformly distributed sorted arrays",
    timeComplexity: "O(log log n) avg, O(n) worst",
    spaceComplexity: "O(1)",
    category: "searching",
    difficulty: "hard",
    requiresTarget: true,
    execute: (arr: number[], target = 0) => {
      const steps: AlgorithmStep[] = [];
      const sortedArr = [...arr].sort((a, b) => a - b);

      steps.push({
        array: sortedArr,
        currentIndex: -1,
        description: `Starting interpolation search for ${target}`,
      });

      let low = 0;
      let high = sortedArr.length - 1;

      while (
        low <= high &&
        target >= sortedArr[low] &&
        target <= sortedArr[high]
      ) {
        if (low === high) {
          if (sortedArr[low] === target) {
            steps.push({
              array: sortedArr,
              currentIndex: low,
              description: `Success! Found ${target} at index ${low}`,
            });
            return steps;
          }
          break;
        }

        const pos: number =
          low +
          Math.floor(
            ((target - sortedArr[low]) * (high - low)) /
              (sortedArr[high] - sortedArr[low])
          );

        steps.push({
          array: sortedArr,
          currentIndex: pos,
          leftPointer: low,
          rightPointer: high,
          description: `Interpolated position: ${pos}, value: ${sortedArr[pos]}`,
          comparison: `Comparing ${sortedArr[pos]} with ${target}`,
        });

        if (sortedArr[pos] === target) {
          steps.push({
            array: sortedArr,
            currentIndex: pos,
            description: `Success! Found ${target} at index ${pos}`,
          });
          return steps;
        }

        if (sortedArr[pos] < target) {
          low = pos + 1;
        } else {
          high = pos - 1;
        }
      }

      steps.push({
        array: sortedArr,
        currentIndex: -1,
        description: `${target} not found in array`,
      });

      return steps;
    },
  },

  bubbleSort: {
    name: "Bubble Sort",
    description:
      "Repeatedly swaps adjacent elements if they are in wrong order",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    category: "sorting",
    difficulty: "easy",
    execute: (arr: number[]) => {
      const cacheKey = getCacheKey("bubbleSort", arr);
      const cached = getCachedResult(cacheKey);
      if (cached) return cached;

      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];
      const n = workingArr.length;

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: [],
        description: "Starting bubble sort",
      });

      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          steps.push({
            array: [...workingArr],
            currentIndex: j,
            compareIndex: j + 1,
            sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
            description: `Comparing ${workingArr[j]} and ${workingArr[j + 1]}`,
            comparison:
              workingArr[j] > workingArr[j + 1]
                ? `${workingArr[j]} > ${workingArr[j + 1]}, swap them`
                : `${workingArr[j]} ≤ ${workingArr[j + 1]}, no swap needed`,
          });

          if (workingArr[j] > workingArr[j + 1]) {
            [workingArr[j], workingArr[j + 1]] = [
              workingArr[j + 1],
              workingArr[j],
            ];
            swapped = true;

            steps.push({
              array: [...workingArr],
              currentIndex: j,
              compareIndex: j + 1,
              sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
              description: `Swapped: array is now [${workingArr.join(", ")}]`,
            });
          }
        }
        if (!swapped) break;
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Bubble sort complete! Array is fully sorted",
      });

      setCachedResult(cacheKey, steps);
      return steps;
    },
  },

  selectionSort: {
    name: "Selection Sort",
    description:
      "Repeatedly finds the minimum element and places it at the beginning",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    category: "sorting",
    difficulty: "easy",
    execute: (arr: number[]) => {
      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];
      const n = workingArr.length;

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: [],
        description: "Starting selection sort",
      });

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
          steps.push({
            array: [...workingArr],
            currentIndex: j,
            compareIndex: minIdx,
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            description: `Comparing ${workingArr[j]} with current minimum ${workingArr[minIdx]}`,
            comparison:
              workingArr[j] < workingArr[minIdx]
                ? `Found new minimum: ${workingArr[j]}`
                : `${workingArr[minIdx]} is still the minimum`,
          });

          if (workingArr[j] < workingArr[minIdx]) {
            minIdx = j;
          }
        }

        if (minIdx !== i) {
          steps.push({
            array: [...workingArr],
            currentIndex: i,
            compareIndex: minIdx,
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            description: `Swapping ${workingArr[i]} and ${workingArr[minIdx]}`,
          });
          [workingArr[i], workingArr[minIdx]] = [
            workingArr[minIdx],
            workingArr[i],
          ];
        }

        steps.push({
          array: [...workingArr],
          currentIndex: i,
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          description: `Position ${i} is now sorted with value ${workingArr[i]}`,
        });
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Selection sort complete! Array is fully sorted",
      });

      return steps;
    },
  },

  insertionSort: {
    name: "Insertion Sort",
    description:
      "Builds sorted array one element at a time by inserting each element in its correct position",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    category: "sorting",
    difficulty: "easy",
    execute: (arr: number[]) => {
      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];
      const n = workingArr.length;

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: [0],
        description:
          "Starting insertion sort. First element is already sorted.",
      });

      for (let i = 1; i < n; i++) {
        const key = workingArr[i];
        let j = i - 1;

        steps.push({
          array: [...workingArr],
          currentIndex: i,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          description: `Inserting ${key} into sorted portion`,
        });

        while (j >= 0 && workingArr[j] > key) {
          steps.push({
            array: [...workingArr],
            currentIndex: j + 1,
            compareIndex: j,
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            description: `${workingArr[j]} > ${key}, shift right`,
          });

          workingArr[j + 1] = workingArr[j];
          j--;
        }

        workingArr[j + 1] = key;

        steps.push({
          array: [...workingArr],
          currentIndex: j + 1,
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          description: `Inserted ${key} at position ${j + 1}`,
        });
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Insertion sort complete! Array is fully sorted",
      });

      return steps;
    },
  },

  quickSort: {
    name: "Quick Sort",
    description:
      "Divide and conquer algorithm that picks a pivot and partitions array around it",
    timeComplexity: "O(n log n) avg, O(n²) worst",
    spaceComplexity: "O(log n)",
    category: "divide-conquer",
    difficulty: "medium",
    execute: (arr: number[]) => {
      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];
      const n = workingArr.length;

      if (n <= 1) {
        steps.push({
          array: [...workingArr],
          currentIndex: -1,
          sortedIndices: n === 1 ? [0] : [],
          description:
            n === 0 ? "Empty array" : "Single element is already sorted",
        });
        return steps;
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        description: "Starting quick sort",
      });

      function partition(low: number, high: number): number {
        const pivot = workingArr[high];
        let i = low - 1;

        steps.push({
          array: [...workingArr],
          pivotIndex: high,
          currentIndex: low,
          description: `Partitioning [${low}:${high}] with pivot ${pivot}`,
        });

        for (let j = low; j < high; j++) {
          steps.push({
            array: [...workingArr],
            currentIndex: j,
            pivotIndex: high,
            leftPointer: i >= low ? i : undefined,
            description: `Comparing ${workingArr[j]} with pivot ${pivot}`,
            comparison:
              workingArr[j] <= pivot
                ? `${workingArr[j]} ≤ ${pivot}, swap`
                : `${workingArr[j]} > ${pivot}, skip`,
          });

          if (workingArr[j] <= pivot) {
            i++;
            if (i !== j) {
              const temp = workingArr[i];
              workingArr[i] = workingArr[j];
              workingArr[j] = temp;

              steps.push({
                array: [...workingArr],
                currentIndex: i,
                compareIndex: j,
                pivotIndex: high,
                description: `Swapped ${workingArr[j]} and ${workingArr[i]}`,
              });
            }
          }
        }

        // Swap pivot to its final position
        const pivotFinalPos = i + 1;
        const temp = workingArr[pivotFinalPos];
        workingArr[pivotFinalPos] = workingArr[high];
        workingArr[high] = temp;

        steps.push({
          array: [...workingArr],
          currentIndex: pivotFinalPos,
          pivotIndex: pivotFinalPos,
          description: `Pivot ${pivot} placed at position ${pivotFinalPos}`,
        });

        return pivotFinalPos;
      }

      function quickSortHelper(low: number, high: number): void {
        if (low < high) {
          const pi = partition(low, high);
          quickSortHelper(low, pi - 1);
          quickSortHelper(pi + 1, high);
        }
      }

      quickSortHelper(0, n - 1);

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Quick sort complete! Array is fully sorted",
      });

      return steps;
    },
  },

  mergeSort: {
    name: "Merge Sort",
    description:
      "Divide and conquer algorithm that divides array, sorts halves, and merges them",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    category: "divide-conquer",
    difficulty: "medium",
    execute: (arr: number[]) => {
      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        description: "Starting merge sort",
      });

      function merge(left: number, mid: number, right: number): void {
        const leftArr = workingArr.slice(left, mid + 1);
        const rightArr = workingArr.slice(mid + 1, right + 1);

        steps.push({
          array: [...workingArr],
          currentIndex: left,
          leftPointer: left,
          rightPointer: right,
          auxiliaryArray: [...leftArr, ...rightArr],
          description: `Merging [${leftArr.join(", ")}] and [${rightArr.join(
            ", "
          )}]`,
        });

        let i = 0,
          j = 0,
          k = left;

        while (i < leftArr.length && j < rightArr.length) {
          if (leftArr[i] <= rightArr[j]) {
            workingArr[k] = leftArr[i];
            i++;
          } else {
            workingArr[k] = rightArr[j];
            j++;
          }
          k++;

          steps.push({
            array: [...workingArr],
            currentIndex: k - 1,
            description: `Placed ${workingArr[k - 1]} at position ${k - 1}`,
          });
        }

        while (i < leftArr.length) {
          workingArr[k] = leftArr[i];
          i++;
          k++;
        }

        while (j < rightArr.length) {
          workingArr[k] = rightArr[j];
          j++;
          k++;
        }

        steps.push({
          array: [...workingArr],
          currentIndex: left,
          leftPointer: left,
          rightPointer: right,
          description: `Merged section [${left}:${right}]: [${workingArr
            .slice(left, right + 1)
            .join(", ")}]`,
        });
      }

      function mergeSortHelper(left: number, right: number): void {
        if (left < right) {
          const mid = Math.floor((left + right) / 2);

          steps.push({
            array: [...workingArr],
            leftPointer: left,
            rightPointer: right,
            currentIndex: mid,
            description: `Dividing array at index ${mid}`,
          });

          mergeSortHelper(left, mid);
          mergeSortHelper(mid + 1, right);
          merge(left, mid, right);
        }
      }

      mergeSortHelper(0, workingArr.length - 1);

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: Array.from({ length: workingArr.length }, (_, i) => i),
        description: "Merge sort complete! Array is fully sorted",
      });

      return steps;
    },
  },

  heapSort: {
    name: "Heap Sort",
    description: "Uses binary heap data structure to sort elements efficiently",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    category: "sorting",
    difficulty: "hard",
    execute: (arr: number[]) => {
      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];
      const n = workingArr.length;

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        description: "Starting heap sort - building max heap",
      });

      function heapify(size: number, root: number): void {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        steps.push({
          array: [...workingArr],
          currentIndex: root,
          leftPointer: left < size ? left : undefined,
          rightPointer: right < size ? right : undefined,
          description: `Heapifying at index ${root}`,
        });

        if (left < size && workingArr[left] > workingArr[largest]) {
          largest = left;
        }

        if (right < size && workingArr[right] > workingArr[largest]) {
          largest = right;
        }

        if (largest !== root) {
          [workingArr[root], workingArr[largest]] = [
            workingArr[largest],
            workingArr[root],
          ];

          steps.push({
            array: [...workingArr],
            currentIndex: root,
            compareIndex: largest,
            description: `Swapped ${workingArr[largest]} and ${workingArr[root]}`,
          });

          heapify(size, largest);
        }
      }

      // Build max heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        description: `Max heap built: [${workingArr.join(", ")}]`,
      });

      // Extract elements from heap
      for (let i = n - 1; i > 0; i--) {
        [workingArr[0], workingArr[i]] = [workingArr[i], workingArr[0]];

        steps.push({
          array: [...workingArr],
          currentIndex: 0,
          compareIndex: i,
          sortedIndices: Array.from({ length: n - i }, (_, k) => n - 1 - k),
          description: `Moved max ${workingArr[i]} to position ${i}`,
        });

        heapify(i, 0);
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Heap sort complete! Array is fully sorted",
      });

      return steps;
    },
  },

  countingSort: {
    name: "Counting Sort",
    description: "Non-comparison sort that counts occurrences of each element",
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(k)",
    category: "sorting",
    difficulty: "medium",
    execute: (arr: number[]) => {
      const steps: AlgorithmStep[] = [];
      const workingArr = [...arr];
      const n = workingArr.length;

      if (n === 0) {
        steps.push({ array: [], currentIndex: -1, description: "Empty array" });
        return steps;
      }

      const max = Math.max(...workingArr);
      const min = Math.min(...workingArr);
      const range = max - min + 1;
      const count = new Array(range).fill(0);
      const output = new Array(n);

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        auxiliaryArray: [...count],
        description: `Starting counting sort. Range: ${min} to ${max}`,
      });

      // Count occurrences
      for (let i = 0; i < n; i++) {
        count[workingArr[i] - min]++;
        steps.push({
          array: [...workingArr],
          currentIndex: i,
          auxiliaryArray: [...count],
          description: `Counting ${workingArr[i]}: count[${
            workingArr[i] - min
          }] = ${count[workingArr[i] - min]}`,
        });
      }

      // Cumulative count
      for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
      }

      steps.push({
        array: [...workingArr],
        currentIndex: -1,
        auxiliaryArray: [...count],
        description: `Cumulative count: [${count.join(", ")}]`,
      });

      // Build output array
      for (let i = n - 1; i >= 0; i--) {
        output[count[workingArr[i] - min] - 1] = workingArr[i];
        count[workingArr[i] - min]--;

        steps.push({
          array: [...output.map((v) => v ?? 0)],
          currentIndex: count[workingArr[i] - min],
          description: `Placed ${workingArr[i]} at position ${
            count[workingArr[i] - min]
          }`,
        });
      }

      steps.push({
        array: [...output],
        currentIndex: -1,
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Counting sort complete! Array is fully sorted",
      });

      return steps;
    },
  },
};

export function clearAlgorithmCache(): void {
  algorithmCache.clear();
}

export function getAlgorithmsByCategory(
  category: Algorithm["category"]
): Algorithm[] {
  return Object.values(algorithms).filter((algo) => algo.category === category);
}

export function getAlgorithmsByDifficulty(
  difficulty: Algorithm["difficulty"]
): Algorithm[] {
  return Object.values(algorithms).filter(
    (algo) => algo.difficulty === difficulty
  );
}
