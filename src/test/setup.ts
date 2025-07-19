import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { resetNetworkDataCache } from '../data/networkDataProvider'
import { resetNetworkDataResource } from '../utils/testUtils'

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
  resetNetworkDataResource()
})
