# Charles - React Web App

## Project Setup Summary

This is a React 19.1 web application built with:
- **pnpm** as package manager
- **Vite** for fast development and optimized builds
- **TypeScript** with strict configuration
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **Recharts** for data visualization (React-friendly wrapper around D3)

## Key Commands

```bash
# Development
pnpm dev          # Start development server on http://localhost:5173

# Testing
pnpm test         # Run tests in watch mode
pnpm test:ui      # Run tests with interactive UI
pnpm test:coverage # Run tests with coverage report

# Building
pnpm build        # Build for production
pnpm preview      # Preview production build locally

# Code Quality
pnpm lint         # Run ESLint
```

## Project Structure

```
charles/
├── src/
│   ├── components/      # React components
│   │   └── SampleChart.tsx
│   ├── test/           # Test setup
│   │   └── setup.ts
│   ├── App.tsx         # Main app component
│   ├── App.test.tsx    # App tests
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── vitest.config.ts    # Vitest configuration
├── tsconfig.json       # TypeScript config
└── eslint.config.js    # ESLint configuration
```

## Technical Notes

- React 19.1 with modern hooks and features
- Recharts provides declarative React components for charts
- ResizeObserver is mocked in tests (src/test/setup.ts)
- TypeScript configured with strict mode
- Vite provides HMR (Hot Module Replacement) for fast development
- Tests run in jsdom environment