/**
 * Test utilities for testing Suspense components without polluting production code
 * Following the guidance in docs/TESTING_SUSPENSE.md
 */

/**
 * Creates a deferred promise that can be resolved/rejected manually in tests
 * This allows us to control when Suspense components transition from loading to loaded
 */
export function createDeferredPromise<T>() {
  let resolve: (value: T) => void
  let reject: (error: any) => void
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  
  return {
    promise,
    resolve: resolve!,
    reject: reject!
  }
}

/**
 * Helper to create mock data for network visualization tests
 */
export function createMockNetworkData() {
  return {
    nodes: [
      { id: '1', name: 'Test Startup', type: 'startup' as const, value: 10 },
      { id: '2', name: 'Test VC', type: 'vc' as const, value: 20 },
      { id: '3', name: 'Test Founder', type: 'founder' as const, value: 15 }
    ],
    links: [
      { source: '1', target: '2' },
      { source: '1', target: '3' }
    ]
  }
}