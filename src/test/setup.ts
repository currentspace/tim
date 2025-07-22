import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { resetNetworkDataCache } from '../data/networkDataProvider'
import { configure } from '@testing-library/react'
import './mocks' // Import centralized mocks

// Configure React Testing Library for React 19
configure({
  // This helps with act() warnings in React 19
  asyncUtilTimeout: 2000,
})

declare global {
  // You can augment the globalThis interface with your property
  // Note: type should be boolean for IS_REACT_ACT_ENVIRONMENT
  // If you have more custom globals, add them here!
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

// Suppress act() warnings in test environment
// These are often false positives with React 19's automatic batching
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Also suppress console errors about act() warnings
const originalError = console.error
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes(
      'When testing, code that causes React state updates should be wrapped into act',
    ) ||
      args[0].includes(
        'Warning: The current testing environment is not configured to support act',
      ) ||
      args[0].includes('A component suspended inside an `act` scope'))
  ) {
    return
  }
  originalError.call(console, ...args)
}

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(_callback: ResizeObserverCallback) {
    // Callback parameter is required by ResizeObserver interface but not used in mock
  }

  observe(_target: Element) {
    // Mock implementation
  }

  unobserve(_target: Element) {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }
}

// Reset data cache between tests
afterEach(() => {
  resetNetworkDataCache()
})
