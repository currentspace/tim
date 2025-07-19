// Test utilities for resetting global state
// With React 19's use hook, we don't need the custom resource pattern
// The data provider handles its own caching
export function resetNetworkDataResource(): void {
  // This is now a no-op since we use the data provider's resetNetworkDataCache
  // Left for backward compatibility with tests
}
