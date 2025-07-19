import { useMemo } from 'react'
import { fetchNetworkData } from '../data/networkDataProvider'

// Custom hook to create a stable promise reference
export function useNetworkData() {
  // Use useMemo to ensure the promise is stable across renders
  const dataPromise = useMemo(() => fetchNetworkData(), [])
  return dataPromise
}