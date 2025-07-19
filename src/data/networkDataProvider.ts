import { NetworkData } from '../types/network'
import { networkData } from './networkData'

// Simulate async data fetching
let dataPromise: Promise<NetworkData> | null = null

export function fetchNetworkData(): Promise<NetworkData> {
  if (!dataPromise) {
    dataPromise = new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve(networkData)
      }, 500)
    })
  }
  return dataPromise
}

// Reset function for testing
export function resetNetworkDataCache() {
  dataPromise = null
}