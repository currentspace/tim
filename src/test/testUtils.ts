/**
 * Test utilities for testing Suspense components without polluting production code
 * Following the guidance in docs/TESTING_SUSPENSE.md
 */

/**
 * Creates a deferred promise that can be resolved/rejected manually in tests
 * This allows us to control when Suspense components transition from loading to loaded
 */
export function createDeferredPromise<T>() {
  let resolve: ((value: T) => void) | undefined
  let reject: ((error: unknown) => void) | undefined

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  if (!resolve || !reject) {
    throw new Error('Promise executor did not run synchronously')
  }

  return {
    promise,
    resolve,
    reject,
  }
}
