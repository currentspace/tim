import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { resetNetworkDataCache } from '../data/networkDataProvider'
import { resetNetworkDataResource } from '../components/StartupUniverse'

// Mock ResizeObserver
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Reset data cache between tests
afterEach(() => {
  resetNetworkDataCache()
  resetNetworkDataResource()
})