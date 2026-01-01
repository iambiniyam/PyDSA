/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { KeyboardShortcutManager } from '../../lib/keyboard-shortcuts'

describe('Keyboard Shortcuts', () => {
  let manager: KeyboardShortcutManager

  beforeEach(() => {
    manager = new KeyboardShortcutManager()
  })

  afterEach(() => {
    manager.stop()
    manager.clear()
  })

  /**
   * Feature: algorithm-learning-enhancements, Property 11: Keyboard Shortcut Input Focus Blocking
   * Validates: Requirements 5.7
   */
  describe('Property 11: Keyboard Shortcut Input Focus Blocking', () => {
    it('shortcuts are blocked when input element is focused', () => {
      const handler = vi.fn()
      manager.register({
        key: 'a',
        handler,
        description: 'Test shortcut'
      })
      manager.start()

      // Create and focus an input element
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      // Simulate keypress
      const event = new KeyboardEvent('keydown', { key: 'a' })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()

      document.body.removeChild(input)
    })

    it('shortcuts are blocked when textarea is focused', () => {
      const handler = vi.fn()
      manager.register({
        key: 'b',
        handler,
        description: 'Test shortcut'
      })
      manager.start()

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.focus()

      const event = new KeyboardEvent('keydown', { key: 'b' })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()

      document.body.removeChild(textarea)
    })

    it('shortcuts are blocked when contenteditable is focused', () => {
      const handler = vi.fn()
      manager.register({
        key: 'c',
        handler,
        description: 'Test shortcut'
      })
      manager.start()

      const div = document.createElement('div')
      div.setAttribute('contenteditable', 'true')
      document.body.appendChild(div)
      div.focus()

      const event = new KeyboardEvent('keydown', { key: 'c' })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()

      document.body.removeChild(div)
    })

    it('shortcuts work when no input is focused', () => {
      const handler = vi.fn()
      manager.register({
        key: 'd',
        handler,
        description: 'Test shortcut'
      })
      manager.start()

      // Blur any focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      const event = new KeyboardEvent('keydown', { key: 'd', bubbles: true })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('shortcuts are blocked for select elements', () => {
      const handler = vi.fn()
      manager.register({
        key: 'e',
        handler,
        description: 'Test shortcut'
      })
      manager.start()

      const select = document.createElement('select')
      document.body.appendChild(select)
      select.focus()

      const event = new KeyboardEvent('keydown', { key: 'e' })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()

      document.body.removeChild(select)
    })
  })

  describe('Shortcut Registration', () => {
    it('registers and triggers simple shortcuts', () => {
      const handler = vi.fn()
      manager.register({
        key: 'x',
        handler,
        description: 'Test'
      })
      manager.start()

      const event = new KeyboardEvent('keydown', { key: 'x', bubbles: true })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('registers shortcuts with modifiers', () => {
      const handler = vi.fn()
      manager.register({
        key: 's',
        ctrlKey: true,
        handler,
        description: 'Save'
      })
      manager.start()

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        bubbles: true
      })
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('unregisters shortcuts correctly', () => {
      const handler = vi.fn()
      manager.register({
        key: 'y',
        handler,
        description: 'Test'
      })
      manager.start()

      manager.unregister('y')

      const event = new KeyboardEvent('keydown', { key: 'y', bubbles: true })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })

    it('can stop and start listening', () => {
      const handler = vi.fn()
      manager.register({
        key: 'z',
        handler,
        description: 'Test'
      })

      manager.start()
      manager.stop()

      const event = new KeyboardEvent('keydown', { key: 'z', bubbles: true })
      window.dispatchEvent(event)

      expect(handler).not.toHaveBeenCalled()

      manager.start()
      window.dispatchEvent(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
