"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, RotateCcw, Play } from "lucide-react";
import {
  createBSTFromArray,
  insertIntoBST,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  calculateTreePositions,
  type TreeNode,
} from "@/lib/data-structures";

type TraversalType = "inorder" | "preorder" | "postorder";

export function BinaryTreeVisualizer() {
  const [tree, setTree] = useState<TreeNode | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<TraversalType>("inorder");
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const positionedTree = useMemo(() => {
    return calculateTreePositions(tree, 300, 40, 0, 120);
  }, [tree]);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setTree((prev) => insertIntoBST(prev, value));
    setInputValue("");
    setHighlightedNodes([]);
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value) || !tree) return;

    const path: number[] = [];
    let current: TreeNode | undefined = tree;

    while (current) {
      path.push(current.value);
      if (current.value === value) {
        break;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    setHighlightedNodes(path);
  };

  const handleTraversal = async () => {
    if (!tree || isAnimating) return;

    setIsAnimating(true);
    setHighlightedNodes([]);

    let result: number[];
    switch (traversalType) {
      case "inorder":
        result = inorderTraversal(tree);
        break;
      case "preorder":
        result = preorderTraversal(tree);
        break;
      case "postorder":
        result = postorderTraversal(tree);
        break;
    }

    setTraversalResult(result);

    // Animate through the traversal
    for (let i = 0; i < result.length; i++) {
      setHighlightedNodes(result.slice(0, i + 1));
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsAnimating(false);
  };

  const handleReset = () => {
    setTree(undefined);
    setHighlightedNodes([]);
    setTraversalResult([]);
  };

  const handleCreateSample = () => {
    const sampleTree = createBSTFromArray([50, 30, 70, 20, 40, 60, 80]);
    setTree(sampleTree);
    setHighlightedNodes([]);
  };

  // Render tree recursively
  const renderNode = (
    node: TreeNode | undefined
  ): React.ReactElement | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isHighlighted = highlightedNodes.includes(node.value);

    return (
      <g key={`node-${node.value}-${node.x}-${node.y}`}>
        {/* Lines to children */}
        {node.left &&
          node.left.x !== undefined &&
          node.left.y !== undefined && (
            <line
              x1={node.x}
              y1={node.y}
              x2={node.left.x}
              y2={node.left.y}
              stroke={
                highlightedNodes.includes(node.left.value)
                  ? "#22c55e"
                  : "#94a3b8"
              }
              strokeWidth="2"
            />
          )}
        {node.right &&
          node.right.x !== undefined &&
          node.right.y !== undefined && (
            <line
              x1={node.x}
              y1={node.y}
              x2={node.right.x}
              y2={node.right.y}
              stroke={
                highlightedNodes.includes(node.right.value)
                  ? "#22c55e"
                  : "#94a3b8"
              }
              strokeWidth="2"
            />
          )}

        {/* Node circle */}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          fill={isHighlighted ? "#22c55e" : "#3b82f6"}
          stroke={isHighlighted ? "#16a34a" : "#2563eb"}
          strokeWidth="2"
        />

        {/* Node value */}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          {node.value}
        </text>

        {/* Render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Binary Search Tree</CardTitle>
        <CardDescription>
          Interactive BST visualization with traversals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Insert Value</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              />
              <Button onClick={handleInsert} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Search Value</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="icon" variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Traversal</Label>
            <div className="flex gap-2">
              <Select
                value={traversalType}
                onValueChange={(v) => setTraversalType(v as TraversalType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inorder">In-order (LNR)</SelectItem>
                  <SelectItem value="preorder">Pre-order (NLR)</SelectItem>
                  <SelectItem value="postorder">Post-order (LRN)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleTraversal}
                size="icon"
                disabled={!tree || isAnimating}
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Actions</Label>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateSample}
                variant="outline"
                className="flex-1"
              >
                Sample
              </Button>
              <Button onClick={handleReset} variant="destructive" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Complexity info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Insert: O(log n) avg</Badge>
          <Badge variant="secondary">Search: O(log n) avg</Badge>
          <Badge variant="secondary">Traversal: O(n)</Badge>
        </div>

        {/* Tree visualization */}
        <div className="border rounded-lg bg-muted/30 p-4 min-h-[300px] flex items-center justify-center">
          {positionedTree ? (
            <svg width="600" height="300" className="overflow-visible">
              {renderNode(positionedTree)}
            </svg>
          ) : (
            <p className="text-muted-foreground">
              Insert values or click "Sample" to create a tree
            </p>
          )}
        </div>

        {/* Traversal result */}
        {traversalResult.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="font-semibold text-green-900 dark:text-green-100">
              {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)}{" "}
              Traversal:
            </p>
            <p className="text-green-700 dark:text-green-300 font-mono">
              [{traversalResult.join(" → ")}]
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
