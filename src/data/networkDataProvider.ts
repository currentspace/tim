import { NetworkData } from '../types/network'
import { networkData } from './networkData'

// Simulate async data fetching with a stable promise
let dataPromise: Promise<NetworkData> | null = null

// This creates a stable promise that can be used with React 19's use hook
export function fetchNetworkData(): Promise<NetworkData> {
  dataPromise ??= new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(networkData)
    }, 500)
  })
  return dataPromise
}

// Create a stable promise for the initial data load
const networkDataPromise = fetchNetworkData()

// Export a default function that returns the stable promise
export default function getNetworkData(): Promise<NetworkData> {
  return networkDataPromise
}

// Reset function for testing
export function resetNetworkDataCache() {
  dataPromise = null
}
