'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export type ComplexityType = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2^n)'

interface ComplexityChartProps {
  complexities: ComplexityType[]
  maxN?: number
  width?: number | string
  height?: number
}

export function ComplexityChart({
  complexities,
  maxN = 100,
  width = '100%',
  height = 400
}: ComplexityChartProps) {
  const data = useMemo(() => {
    const points: any[] = []
    const step = Math.max(1, Math.floor(maxN / 50))

    for (let n = 1; n <= maxN; n += step) {
      const point: any = { n }

      if (complexities.includes('O(1)')) {
        point['O(1)'] = 1
      }
      if (complexities.includes('O(log n)')) {
        point['O(log n)'] = Math.log2(n)
      }
      if (complexities.includes('O(n)')) {
        point['O(n)'] = n
      }
      if (complexities.includes('O(n log n)')) {
        point['O(n log n)'] = n * Math.log2(n)
      }
      if (complexities.includes('O(n²)')) {
        point['O(n²)'] = n * n
      }
      if (complexities.includes('O(2^n)') && n <= 20) {
        point['O(2^n)'] = Math.pow(2, n)
      }

      points.push(point)
    }

    return points
  }, [complexities, maxN])

  const colors: Record<ComplexityType, string> = {
    'O(1)': '#10b981',
    'O(log n)': '#3b82f6',
    'O(n)': '#8b5cf6',
    'O(n log n)': '#f59e0b',
    'O(n²)': '#ef4444',
    'O(2^n)': '#dc2626'
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Time Complexity Comparison</h3>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="n"
            label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Operations', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null

              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <p className="font-semibold mb-2">n = {label}</p>
                  {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="font-medium">{entry.name}:</span>
                      <span className="text-muted-foreground">
                        {typeof entry.value === 'number'
                          ? entry.value.toFixed(2)
                          : entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )
            }}
          />
          <Legend />
          {complexities.map(complexity => (
            <Line
              key={complexity}
              type="monotone"
              dataKey={complexity}
              stroke={colors[complexity]}
              strokeWidth={2}
              dot={false}
              name={complexity}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function generateComplexityData(
  complexity: ComplexityType,
  n: number
): number {
  switch (complexity) {
    case 'O(1)':
      return 1
    case 'O(log n)':
      return Math.log2(n)
    case 'O(n)':
      return n
    case 'O(n log n)':
      return n * Math.log2(n)
    case 'O(n²)':
      return n * n
    case 'O(2^n)':
      return Math.pow(2, n)
    default:
      return 0
  }
}
