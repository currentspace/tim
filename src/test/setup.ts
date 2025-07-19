import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { resetNetworkDataCache } from '../data/networkDataProvider'
import { resetNetworkDataResource } from '../utils/testUtils'

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {
    // Mock implementation - callback stored but not used in tests
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
  resetNetworkDataResource()
})
