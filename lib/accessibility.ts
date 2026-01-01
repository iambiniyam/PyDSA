// Accessibility utilities for algorithm visualizations

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window === 'undefined') return

  const liveRegion = document.getElementById('sr-live-region') || createLiveRegion()
  liveRegion.setAttribute('aria-live', priority)
  liveRegion.textContent = message
}

function createLiveRegion(): HTMLElement {
  const region = document.createElement('div')
  region.id = 'sr-live-region'
  region.setAttribute('role', 'status')
  region.setAttribute('aria-live', 'polite')
  region.setAttribute('aria-atomic', 'true')
  region.className = 'sr-only'
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `
  document.body.appendChild(region)
  return region
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getAnimationDuration(defaultMs: number): number {
  return prefersReducedMotion() ? 0 : defaultMs
}

export interface ColorContrastResult {
  ratio: number
  passes: boolean
  level: 'AAA' | 'AA' | 'fail'
}

export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function checkColorContrast(foreground: string, background: string): ColorContrastResult {
  const ratio = calculateContrastRatio(foreground, background)
  
  return {
    ratio,
    passes: ratio >= 4.5,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail'
  }
}

function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    const normalized = val / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

export const ariaLabels = {
  algorithmVisualizer: {
    playButton: 'Play algorithm visualization',
    pauseButton: 'Pause algorithm visualization',
    stepForward: 'Step forward one step',
    stepBackward: 'Step backward one step',
    reset: 'Reset visualization to beginning',
    speedControl: 'Adjust playback speed',
    algorithmSelector: 'Select algorithm to visualize'
  },
  graphVisualizer: {
    node: (id: string) => `Graph node ${id}`,
    edge: (from: string, to: string, weight?: number) =>
      weight !== undefined
        ? `Edge from ${from} to ${to} with weight ${weight}`
        : `Edge from ${from} to ${to}`,
    dragNode: 'Drag to reposition node'
  },
  codeEditor: {
    editor: 'Code editor',
    runButton: 'Run code',
    output: 'Code execution output',
    errors: 'Code execution errors'
  }
}
