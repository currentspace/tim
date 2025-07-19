// Test utilities for resetting global state
let resetFn: (() => void) | null = null

export function setResetFunction(fn: () => void): void {
  resetFn = fn
}

export function resetNetworkDataResource(): void {
  if (resetFn) {
    resetFn()
  }
}
