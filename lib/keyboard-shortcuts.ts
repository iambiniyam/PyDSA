export type ShortcutHandler = () => void

export interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  handler: ShortcutHandler
  description: string
  category?: string
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, ShortcutConfig> = new Map()
  private isListening = false
  private boundHandler: ((e: KeyboardEvent) => void) | null = null

  constructor() {
    this.boundHandler = this.handleKeyDown.bind(this)
  }

  private getShortcutKey(config: Omit<ShortcutConfig, 'handler' | 'description'>): string {
    const parts: string[] = []
    if (config.ctrlKey) parts.push('ctrl')
    if (config.shiftKey) parts.push('shift')
    if (config.altKey) parts.push('alt')
    parts.push(config.key.toLowerCase())
    return parts.join('+')
  }

  private isInputFocused(): boolean {
    const activeElement = document.activeElement
    if (!activeElement) return false

    const tagName = activeElement.tagName.toLowerCase()
    const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'
    
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      isContentEditable
    )
  }

  register(config: ShortcutConfig): void {
    const key = this.getShortcutKey(config)
    this.shortcuts.set(key, config)
  }

  unregister(key: string, ctrlKey = false, shiftKey = false, altKey = false): void {
    const shortcutKey = this.getShortcutKey({ key, ctrlKey, shiftKey, altKey })
    this.shortcuts.delete(shortcutKey)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Block shortcuts when input is focused
    if (this.isInputFocused()) {
      return
    }

    const shortcutKey = this.getShortcutKey({
      key: e.key,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey
    })

    const config = this.shortcuts.get(shortcutKey)
    if (config) {
      e.preventDefault()
      config.handler()
    }
  }

  start(): void {
    if (this.isListening || !this.boundHandler) return
    
    this.isListening = true
    window.addEventListener('keydown', this.boundHandler)
  }

  stop(): void {
    if (!this.isListening || !this.boundHandler) return
    
    this.isListening = false
    window.removeEventListener('keydown', this.boundHandler)
  }

  getShortcuts(): ShortcutConfig[] {
    return Array.from(this.shortcuts.values())
  }

  clear(): void {
    this.shortcuts.clear()
  }
}

// Singleton instance
let managerInstance: KeyboardShortcutManager | null = null

export function getKeyboardShortcutManager(): KeyboardShortcutManager {
  if (!managerInstance) {
    managerInstance = new KeyboardShortcutManager()
  }
  return managerInstance
}

export function formatShortcut(config: Pick<ShortcutConfig, 'key' | 'ctrlKey' | 'shiftKey' | 'altKey'>): string {
  const parts: string[] = []
  if (config.ctrlKey) parts.push('Ctrl')
  if (config.shiftKey) parts.push('Shift')
  if (config.altKey) parts.push('Alt')
  parts.push(config.key.toUpperCase())
  return parts.join(' + ')
}
