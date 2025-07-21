# DEVELOPER NOTE: TESTING SUSPENSE AND ASYNC COMPONENTS IN REACT 19.1

## GOAL:

- Test that both Suspense fallbacks (loading placeholders) and loaded content render as expected.
- DO NOT introduce test-only code, flags, or props into production components.
- Keep the production bundle clean; all test controls should live in test code only.

## WHY THIS MATTERS:

React 19.1 with Suspense and use() means your components may suspend (throw a Promise)
while loading data. To test fallbacks, you need to control when the Promise resolves.
But you *should not* add test flags or conditional logic to your components for this!

## KEY POINTS FROM REACT TEAM AND TESTING COMMUNITY:

1. "When using Suspense and async functions, if the promise resolves synchronously or too quickly, you may never see the fallback rendered in a test. For test coverage of loading states, inject a way to delay data resolution."
   (React RFC: Suspense for Data Fetching)
   [https://github.com/reactjs/rfcs/pull/263#testing-suspense-and-async-rendering](https://github.com/reactjs/rfcs/pull/263#testing-suspense-and-async-rendering)

2. "Don't use act unnecessarily. Use dependency injection or mocks to control async timing."
   (Kent C. Dodds, Testing Suspense)
   [https://kentcdodds.com/blog/stop-using-act-more-often-than-not](https://kentcdodds.com/blog/stop-using-act-more-often-than-not)

3. "You rarely need to use act directly. The async utilities already wrap things in act for you."
   (React Testing Library: Async Utilities)
   [https://testing-library.com/docs/dom-testing-library/api-async/](https://testing-library.com/docs/dom-testing-library/api-async/)

## HOW TO TEST SUSPENSE WITHOUT POLLUTING PRODUCTION CODE:

### APPROACH 1: MODULE MOCKING (RECOMMENDED, ZERO PROD IMPACT)

- Export your data loader (e.g., getNetworkData) from a separate module.
- In tests, mock that module to return a deferred Promise that you control.
- In production, the real loader is used; no test logic ships.

Example:

```javascript
// data/networkDataProvider.js
export default function getNetworkData() {
  return fetch('/api/network').then(r => r.json());
}

// In StartupUniverse or NetworkVisualization:
const data = use(getNetworkData());

// -- TEST FILE --
import { vi } from 'vitest';
import getNetworkData from '../data/networkDataProvider';

it('shows loading then data', async () => {
  let resolver;
  const deferred = new Promise(res => { resolver = res; });
  vi.mock('../data/networkDataProvider', () => ({
    default: () => deferred
  }));

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <StartupUniverse />
    </Suspense>
  );

  // Check fallback
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Resolve data
  resolver(mockData);
  await screen.findByText('The Startup Universe');
});
```

### APPROACH 2: DEPENDENCY INJECTION (AS A PROP)

- If you want even more control and flexibility, allow your component to accept a loader as a prop, defaulting to the real one.
- In tests, pass a controlled loader; in production, nothing changes.

Example:

```javascript
function StartupUniverse({ loader = getNetworkData }) {
  const data = use(loader());
  ...
}

// Then, in test:
render(
  <Suspense fallback={<div>Loading...</div>}>
    <StartupUniverse loader={() => deferredPromise} />
  </Suspense>
);
```

This keeps test logic out of production code, and lets you verify the loading UI appears.

## COMMON PITFALLS AND HOW TO AVOID THEM:

- DO NOT pass a "testing" prop or set a "delay" just for tests; this bloats prod code.
- DO NOT add conditional logic (e.g., "if (process.env.NODE_ENV === 'test')") in production code.
- Only use mocking or dependency injection, which have no impact on production builds.

## USING act:

React Testing Library's async functions (waitFor, findBy*) automatically wrap updates in act.
You generally do NOT need to call act() manually unless you're writing low-level or timing-sensitive tests.

From Kent C. Dodds:
"With modern React Testing Library, act is wrapped for you, so avoid using it directly except in very specific situations."
[https://kentcdodds.com/blog/stop-using-act-more-often-than-not](https://kentcdodds.com/blog/stop-using-act-more-often-than-not)

## SUMMARY CHECKLIST:

- [ ] NO test-only code, props, or flags in production component files.
- [ ] Data loading utilities are always imported from a separate module.
- [ ] Tests mock those modules (or inject via prop) to control promise resolution and test both fallback and loaded states.
- [ ] All async assertions use waitFor or findBy* (no manual act required).

## REFERENCES:

React RFC (Suspense for Data Fetching, see 'Testing Suspense and async rendering'):
[https://github.com/reactjs/rfcs/pull/263#testing-suspense-and-async-rendering](https://github.com/reactjs/rfcs/pull/263#testing-suspense-and-async-rendering)

Kent C. Dodds: Stop Using act So Much
[https://kentcdodds.com/blog/stop-using-act-more-often-than-not](https://kentcdodds.com/blog/stop-using-act-more-often-than-not)

Vitest Module Mocking
[https://vitest.dev/guide/mocking.html](https://vitest.dev/guide/mocking.html)

React Testing Library: Async Utilities
[https://testing-library.com/docs/dom-testing-library/api-async/](https://testing-library.com/docs/dom-testing-library/api-async/)

## PRACTICAL LIMITATIONS

In practice, testing Suspense with React 19.1's `use()` hook can be challenging:

1. **Promise Caching**: React caches the promise result internally. Once a component suspends with a promise, it won't re-render until React itself decides to retry.

2. **Module State**: If your data provider module maintains internal state (like a cached promise), you need to reset it between tests.

3. **Timing Issues**: Even with controllable promises, React's internal scheduling can make it difficult to reliably test transitions between loading and loaded states.

For these reasons, consider:
- Testing loading states with never-resolving promises
- Testing success states with immediately-resolved promises
- Testing error states with immediately-rejected promises
- Using integration tests or E2E tests for complex loading sequences

## NEED HELP?

If you want, ask for an example PR using your StartupUniverse/getNetworkData, or for a more complex multi-component scenario.

---

This ensures our async UI is testable without introducing *any* test overhead or logic into production code.