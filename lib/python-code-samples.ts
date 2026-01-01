export const pythonCodeSamples: Record<string, string> = {
  linearSearch: `def linear_search(arr: list, target: int) -> int:
    """
    Search for target in array sequentially.
    Time: O(n), Space: O(1)
    """
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Example usage
numbers = [5, 2, 8, 1, 9, 3]
result = linear_search(numbers, 8)
print(f"Found at index: {result}")  # Output: Found at index: 2`,

  binarySearch: `def binary_search(arr: list, target: int) -> int:
    """
    Search for target in sorted array using divide and conquer.
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Example usage
numbers = [1, 2, 3, 5, 8, 9]  # Must be sorted!
result = binary_search(numbers, 5)
print(f"Found at index: {result}")  # Output: Found at index: 3`,

  jumpSearch: `import math

def jump_search(arr: list, target: int) -> int:
    """
    Search sorted array by jumping ahead by fixed steps.
    Time: O(√n), Space: O(1)
    """
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    
    if arr[prev] == target:
        return prev
    return -1

# Example
arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(jump_search(arr, 6))  # Output: 6`,

  interpolationSearch: `def interpolation_search(arr: list, target: int) -> int:
    """
    Improved binary search for uniformly distributed data.
    Time: O(log log n) avg, O(n) worst, Space: O(1)
    """
    low, high = 0, len(arr) - 1
    
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            return low if arr[low] == target else -1
        
        pos = low + ((target - arr[low]) * (high - low)) // (arr[high] - arr[low])
        
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1

# Example
arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
print(interpolation_search(arr, 70))  # Output: 6`,

  bubbleSort: `def bubble_sort(arr: list) -> list:
    """
    Sort by repeatedly swapping adjacent elements.
    Time: O(n²), Space: O(1)
    """
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Example
numbers = [5, 2, 8, 1, 9, 3]
print(bubble_sort(numbers.copy()))  # [1, 2, 3, 5, 8, 9]`,

  selectionSort: `def selection_sort(arr: list) -> list:
    """
    Sort by repeatedly finding minimum element.
    Time: O(n²), Space: O(1)
    """
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Example
numbers = [5, 2, 8, 1, 9, 3]
print(selection_sort(numbers.copy()))  # [1, 2, 3, 5, 8, 9]`,

  insertionSort: `def insertion_sort(arr: list) -> list:
    """
    Build sorted array one element at a time.
    Time: O(n²), Space: O(1)
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Example
numbers = [5, 2, 8, 1, 9, 3]
print(insertion_sort(numbers.copy()))  # [1, 2, 3, 5, 8, 9]`,

  quickSort: `def quick_sort(arr: list) -> list:
    """
    Divide and conquer using pivot partitioning.
    Time: O(n log n) avg, O(n²) worst, Space: O(log n)
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# In-place version
def quick_sort_inplace(arr: list, low: int = 0, high: int = None) -> list:
    if high is None:
        high = len(arr) - 1
    
    def partition(low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    if low < high:
        pi = partition(low, high)
        quick_sort_inplace(arr, low, pi - 1)
        quick_sort_inplace(arr, pi + 1, high)
    return arr

# Example
print(quick_sort([5, 2, 8, 1, 9, 3]))  # [1, 2, 3, 5, 8, 9]`,

  mergeSort: `def merge_sort(arr: list) -> list:
    """
    Divide and conquer by splitting and merging.
    Time: O(n log n), Space: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left: list, right: list) -> list:
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Example
print(merge_sort([5, 2, 8, 1, 9, 3]))  # [1, 2, 3, 5, 8, 9]`,

  heapSort: `def heap_sort(arr: list) -> list:
    """
    Sort using binary heap data structure.
    Time: O(n log n), Space: O(1)
    """
    def heapify(n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n and arr[left] > arr[largest]:
            largest = left
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(n, largest)
    
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(i, 0)
    
    return arr

# Example
print(heap_sort([5, 2, 8, 1, 9, 3]))  # [1, 2, 3, 5, 8, 9]`,

  countingSort: `def counting_sort(arr: list) -> list:
    """
    Non-comparison sort counting occurrences.
    Time: O(n + k), Space: O(k) where k is range
    """
    if not arr:
        return arr
    
    min_val, max_val = min(arr), max(arr)
    range_val = max_val - min_val + 1
    count = [0] * range_val
    output = [0] * len(arr)
    
    # Count occurrences
    for num in arr:
        count[num - min_val] += 1
    
    # Cumulative count
    for i in range(1, range_val):
        count[i] += count[i - 1]
    
    # Build output
    for num in reversed(arr):
        output[count[num - min_val] - 1] = num
        count[num - min_val] -= 1
    
    return output

# Example
print(counting_sort([4, 2, 2, 8, 3, 3, 1]))  # [1, 2, 2, 3, 3, 4, 8]`,

  stack: `class Stack:
    """LIFO (Last In First Out) data structure."""
    
    def __init__(self):
        self._items: list = []
    
    def push(self, item) -> None:
        """Add item to top. Time: O(1)"""
        self._items.append(item)
    
    def pop(self):
        """Remove and return top item. Time: O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items.pop()
    
    def peek(self):
        """Return top item without removing. Time: O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items[-1]
    
    def is_empty(self) -> bool:
        return len(self._items) == 0
    
    def size(self) -> int:
        return len(self._items)
    
    def __repr__(self) -> str:
        return f"Stack({self._items})"

# Example
stack = Stack()
stack.push(1)
stack.push(2)
stack.push(3)
print(stack.pop())   # 3
print(stack.peek())  # 2`,

  queue: `from collections import deque

class Queue:
    """FIFO (First In First Out) data structure."""
    
    def __init__(self):
        self._items = deque()
    
    def enqueue(self, item) -> None:
        """Add item to rear. Time: O(1)"""
        self._items.append(item)
    
    def dequeue(self):
        """Remove and return front item. Time: O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items.popleft()
    
    def front(self):
        """Return front item without removing. Time: O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items[0]
    
    def is_empty(self) -> bool:
        return len(self._items) == 0
    
    def size(self) -> int:
        return len(self._items)

# Example
queue = Queue()
queue.enqueue("Alice")
queue.enqueue("Bob")
print(queue.dequeue())  # Alice
print(queue.front())    # Bob`,

  linkedList: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    """Singly Linked List implementation."""
    
    def __init__(self):
        self.head = None
        self._size = 0
    
    def append(self, data) -> None:
        """Add node at end. Time: O(n)"""
        new_node = Node(data)
        self._size += 1
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def prepend(self, data) -> None:
        """Add node at beginning. Time: O(1)"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self._size += 1
    
    def delete(self, data) -> bool:
        """Delete first occurrence. Time: O(n)"""
        if not self.head:
            return False
        if self.head.data == data:
            self.head = self.head.next
            self._size -= 1
            return True
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                self._size -= 1
                return True
            current = current.next
        return False
    
    def __len__(self) -> int:
        return self._size
    
    def __repr__(self) -> str:
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " -> ".join(elements)

# Example
ll = LinkedList()
ll.append(1)
ll.append(2)
ll.prepend(0)
print(ll)  # 0 -> 1 -> 2`,

  binaryTree: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BinarySearchTree:
    """Binary Search Tree implementation."""
    
    def __init__(self):
        self.root = None
    
    def insert(self, val) -> None:
        """Insert value. Time: O(log n) avg, O(n) worst"""
        if not self.root:
            self.root = TreeNode(val)
            return
        self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if val < node.val:
            if node.left:
                self._insert_recursive(node.left, val)
            else:
                node.left = TreeNode(val)
        else:
            if node.right:
                self._insert_recursive(node.right, val)
            else:
                node.right = TreeNode(val)
    
    def search(self, val) -> bool:
        """Search for value. Time: O(log n) avg"""
        return self._search_recursive(self.root, val)
    
    def _search_recursive(self, node, val) -> bool:
        if not node:
            return False
        if node.val == val:
            return True
        if val < node.val:
            return self._search_recursive(node.left, val)
        return self._search_recursive(node.right, val)
    
    def inorder(self) -> list:
        """Inorder traversal (sorted). Time: O(n)"""
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _inorder_recursive(self, node, result):
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.val)
            self._inorder_recursive(node.right, result)

# Example
bst = BinarySearchTree()
for val in [5, 3, 7, 1, 4, 6, 8]:
    bst.insert(val)
print(bst.inorder())  # [1, 3, 4, 5, 6, 7, 8]
print(bst.search(4))  # True`,

  hashTable: `class HashTable:
    """Hash Table with chaining for collision resolution."""
    
    def __init__(self, size: int = 10):
        self.size = size
        self.buckets = [[] for _ in range(size)]
        self._count = 0
    
    def _hash(self, key) -> int:
        return hash(key) % self.size
    
    def put(self, key, value) -> None:
        """Insert or update. Time: O(1) avg"""
        index = self._hash(key)
        bucket = self.buckets[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        
        bucket.append((key, value))
        self._count += 1
    
    def get(self, key, default=None):
        """Get value by key. Time: O(1) avg"""
        index = self._hash(key)
        for k, v in self.buckets[index]:
            if k == key:
                return v
        return default
    
    def remove(self, key) -> bool:
        """Remove key-value pair. Time: O(1) avg"""
        index = self._hash(key)
        bucket = self.buckets[index]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self._count -= 1
                return True
        return False
    
    def __len__(self) -> int:
        return self._count

# Example
ht = HashTable()
ht.put("name", "Alice")
ht.put("age", 25)
print(ht.get("name"))  # Alice
print(ht.get("city", "Unknown"))  # Unknown`,

  graph: `from collections import defaultdict, deque

class Graph:
    """Graph implementation with adjacency list."""
    
    def __init__(self, directed: bool = False):
        self.graph = defaultdict(list)
        self.directed = directed
    
    def add_edge(self, u, v, weight: int = 1) -> None:
        """Add edge. Time: O(1)"""
        self.graph[u].append((v, weight))
        if not self.directed:
            self.graph[v].append((u, weight))
    
    def bfs(self, start) -> list:
        """Breadth-First Search. Time: O(V + E)"""
        visited = set([start])
        queue = deque([start])
        result = []
        
        while queue:
            vertex = queue.popleft()
            result.append(vertex)
            
            for neighbor, _ in self.graph[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return result
    
    def dfs(self, start) -> list:
        """Depth-First Search. Time: O(V + E)"""
        visited = set()
        result = []
        
        def dfs_recursive(vertex):
            visited.add(vertex)
            result.append(vertex)
            for neighbor, _ in self.graph[vertex]:
                if neighbor not in visited:
                    dfs_recursive(neighbor)
        
        dfs_recursive(start)
        return result

# Example
g = Graph()
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 2)
g.add_edge(2, 3)
print(g.bfs(0))  # [0, 1, 2, 3]
print(g.dfs(0))  # [0, 1, 2, 3]`,

  heap: `class MinHeap:
    """Min Heap implementation."""
    
    def __init__(self):
        self.heap = []
    
    def parent(self, i: int) -> int:
        return (i - 1) // 2
    
    def left_child(self, i: int) -> int:
        return 2 * i + 1
    
    def right_child(self, i: int) -> int:
        return 2 * i + 2
    
    def push(self, val) -> None:
        """Insert value. Time: O(log n)"""
        self.heap.append(val)
        self._heapify_up(len(self.heap) - 1)
    
    def pop(self):
        """Remove and return minimum. Time: O(log n)"""
        if not self.heap:
            raise IndexError("Heap is empty")
        if len(self.heap) == 1:
            return self.heap.pop()
        
        min_val = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._heapify_down(0)
        return min_val
    
    def peek(self):
        """Return minimum without removing. Time: O(1)"""
        if not self.heap:
            raise IndexError("Heap is empty")
        return self.heap[0]
    
    def _heapify_up(self, i: int) -> None:
        while i > 0 and self.heap[self.parent(i)] > self.heap[i]:
            self.heap[i], self.heap[self.parent(i)] = \\
                self.heap[self.parent(i)], self.heap[i]
            i = self.parent(i)
    
    def _heapify_down(self, i: int) -> None:
        smallest = i
        left = self.left_child(i)
        right = self.right_child(i)
        
        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
            smallest = right
        
        if smallest != i:
            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            self._heapify_down(smallest)

# Example
heap = MinHeap()
for val in [5, 3, 8, 1, 2]:
    heap.push(val)
print(heap.pop())  # 1
print(heap.pop())  # 2`,
}
