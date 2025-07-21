# React 19.1 Data Visualization App

## Project Setup Summary

This is a React 19.1 web application using modern patterns without useEffect:

- **pnpm** as package manager
- **Vite** for fast development and optimized builds
- **TypeScript** with strict configuration
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **D3.js** for advanced network visualizations

## Key Commands

```bash
# Development
pnpm dev          # Start development server on http://localhost:5173

# Testing
pnpm test         # Run tests in watch mode
pnpm test --run   # Run tests once (CI mode)
pnpm test:ui      # Run tests with interactive UI
pnpm test:coverage # Run tests with coverage report

# Building
pnpm build        # Build for production (runs TypeScript check first)
pnpm preview      # Preview production build locally

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint and fix issues
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting (CI)
pnpm test:ci      # Run tests once (CI mode)

# Package Management
pnpm add <package>      # Add a dependency
pnpm add -D <package>   # Add a dev dependency
pnpm install            # Install all dependencies
```

## CI/CD Workflow

This project uses GitHub Actions for CI/CD with branch protection on `main`. All code must pass formatting, linting, and tests before merging.

### Creating a Pull Request

```bash
# 1. Create a new feature branch
git checkout -b feature/my-feature

# 2. Make your changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push -u origin feature/my-feature

# 4. Create a pull request
gh pr create --base main --title "Add new feature" --body "Description of changes"

# Or create PR with auto-merge enabled
gh pr create --base main --title "Add new feature" --body "Description of changes" --auto-merge
```

### Auto-Merge Setup

To enable auto-merge when creating a PR:

```bash
# Create PR with auto-merge (squash merge)
gh pr create --base main --title "Title" --body "Description" && \
gh pr merge --auto --squash

# Or set auto-merge after PR creation
gh pr merge <PR-NUMBER> --auto --squash
```

### Branch Protection Rules

The `main` branch is protected with:
- ✅ Pull request required before merging
- ✅ Status checks must pass (`build` workflow)
- ✅ Branches must be up to date before merging
- ✅ Force pushes blocked
- ✅ Branch deletion blocked

### Workflow Summary

1. **Never push directly to main** - Always use feature branches
2. **Create PR** - Use `gh pr create` or GitHub web UI
3. **CI runs automatically** - Format check, lint, and tests must pass
4. **Enable auto-merge** - PR merges automatically when checks pass
5. **Cloudflare deploys** - Automatic deployment on main branch update

### Quick Commands

```bash
# Create feature branch and PR with auto-merge
git checkout -b feature/my-feature
# ... make changes ...
git add . && git commit -m "My changes"
git push -u origin feature/my-feature
gh pr create --base main --title "My changes" --body "Description" && gh pr merge --auto --squash

# Check PR status
gh pr status

# View PR checks
gh pr checks <PR-NUMBER>

# Cancel auto-merge
gh pr merge <PR-NUMBER> --disable-auto
```

## React 19.1 Patterns (No useEffect!)

### 1. Data Fetching with Suspense

Instead of useEffect, use Suspense with a resource pattern:

```typescript
// Create a resource for Suspense
interface Resource<T> {
  read(): T
}

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T
  let error: any

  const suspender = promise.then(
    (data) => {
      status = 'success'
      result = data
    },
    (err) => {
      status = 'error'
      error = err
    }
  )

  return {
    read() {
      if (status === 'pending') throw suspender
      if (status === 'error') throw error
      if (status === 'success') return result
      throw new Error('This should never happen')
    }
  }
}

// Component that uses the data
function DataComponent() {
  const resource = getDataResource()
  const data = resource.read() // This will suspend

  return <div>{data.content}</div>
}

// Parent with Suspense boundary
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

### 2. DOM Initialization with Callback Refs

Instead of useEffect for DOM manipulation, use callback refs:

```typescript
function ComponentWithD3() {
  const [isInitialized, setIsInitialized] = useState(false)
  const visualizationRef = useRef<Visualization | null>(null)

  // Callback ref - called when DOM element is attached/detached
  const svgRefCallback = (node: SVGSVGElement | null) => {
    if (node && !isInitialized) {
      setIsInitialized(true)

      // Initialize D3 or other DOM manipulation here
      visualizationRef.current = new Visualization()
      visualizationRef.current.initialize(node)
    }
  }

  return <svg ref={svgRefCallback} />
}
```

### 3. State Updates with startTransition

Use startTransition to prevent loading states from replacing visible content:

```typescript
import { startTransition } from 'react'

function Controls({ onUpdate }: { onUpdate: (value: number) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Wrap state updates in startTransition
    startTransition(() => {
      onUpdate(Number(e.target.value))
    })
  }

  return <input type="range" onChange={handleChange} />
}
```

### 4. Error Boundaries

Always wrap Suspense components with error boundaries:

```typescript
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

## Adding New Functionality

### Step 1: Create Data Provider

```typescript
// src/data/myDataProvider.ts
import { MyData } from '../types/myData'

let dataPromise: Promise<MyData> | null = null

export function fetchMyData(): Promise<MyData> {
  if (!dataPromise) {
    dataPromise = fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        // Simulate delay if needed
        return new Promise((resolve) => setTimeout(() => resolve(data), 500))
      })
  }
  return dataPromise
}

export function resetMyDataCache() {
  dataPromise = null
}
```

### Step 2: Create Resource and Component

```typescript
// src/components/MyComponent.tsx
import { Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'
import ErrorBoundary from './ErrorBoundary'

// Resource cache
let myDataResource: Resource<MyData> | null = null

function getMyDataResource(): Resource<MyData> {
  if (!myDataResource) {
    const dataPromise = import('../data/myDataProvider')
      .then(module => module.fetchMyData())
    myDataResource = createResource(dataPromise)
  }
  return myDataResource
}

// Inner component that uses the data
function MyDataVisualization() {
  const resource = getMyDataResource()
  const data = resource.read() // Suspends here

  return <div>{/* Render your data */}</div>
}

// Main component with Suspense
export function MyComponent() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <MyDataVisualization />
      </Suspense>
    </ErrorBoundary>
  )
}

// Export reset for testing
export function resetMyDataResource() {
  myDataResource = null
}
```

### Step 3: Add Tests

```typescript
// src/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MyComponent, resetMyDataResource } from './MyComponent'

describe('MyComponent', () => {
  it('shows loading state initially', () => {
    render(<MyComponent />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders data after loading', async () => {
    render(<MyComponent />)

    await waitFor(() => {
      expect(screen.getByText('Expected Content')).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
```

### Step 4: Update Test Setup

```typescript
// src/test/setup.ts
import { afterEach } from 'vitest'
import { resetMyDataResource } from '../components/MyComponent'

afterEach(() => {
  // Reset all data caches between tests
  resetMyDataResource()
})
```

## Project Structure

```
./
├── src/
│   ├── components/         # React components
│   │   ├── NetworkGraph.tsx      # D3 network visualization
│   │   ├── StartupUniverse.tsx   # Main visualization component
│   │   ├── LoadingSpinner.tsx    # Loading state
│   │   └── ErrorBoundary.tsx     # Error handling
│   ├── data/              # Data providers
│   │   ├── networkData.ts        # Static data
│   │   └── networkDataProvider.ts # Async data fetching
│   ├── types/             # TypeScript types
│   │   └── network.ts            # Network data types
│   ├── test/              # Test setup
│   │   └── setup.ts              # Global test configuration
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── vitest.config.ts       # Vitest configuration
├── tsconfig.json          # TypeScript config
└── eslint.config.js       # ESLint configuration
```

## Key Patterns to Remember

1. **No useEffect** - Use Suspense for data fetching, callback refs for DOM
2. **Resource Pattern** - Wrap promises in resources that throw while pending
3. **Callback Refs** - Initialize DOM elements when they mount
4. **Error Boundaries** - Always wrap Suspense components
5. **startTransition** - Smooth updates without loading flashes
6. **Cache Resources** - Prevent recreating promises on each render
7. **Reset in Tests** - Clear caches between test runs

## Common Gotchas

1. **Don't create promises in render** - Use stable references
2. **Reset resources in tests** - Or tests will share state
3. **Use callback refs for DOM** - Not useEffect
4. **Wrap Suspense in ErrorBoundary** - Always handle errors
5. **Export reset functions** - For test cleanup

## Testing Suspense Components

See [docs/TESTING_SUSPENSE.md](./docs/TESTING_SUSPENSE.md) for comprehensive guidance on testing
Suspense and async components without polluting production code.

## Adding D3 Visualizations

1. Create a class to encapsulate D3 logic
2. Use callback ref to initialize when DOM is ready
3. Store instance in useRef
4. Update parameters without recreating visualization
5. Clean up in destroy method (if needed)

Example pattern in NetworkGraph.tsx - study this for complex D3 integrations!
