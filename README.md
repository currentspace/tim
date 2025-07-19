# Charles - Interactive Network Visualization

A React 19.1 web application featuring interactive D3.js network visualizations of the startup
ecosystem.

## 🚀 Deployment

This project automatically deploys to Cloudflare Pages when changes are pushed to the `main` branch.

### Live Site

- Production: `https://tim.current.space`
- Preview deployments created for each PR

### Manual Deployment

```bash
# Build locally
pnpm run build

# The `dist` folder contains all static files ready for deployment
```

## 🛠️ Tech Stack

- **React 19.1** - Using latest features including `use` hook and Suspense
- **D3.js** - Force-directed network visualization
- **TypeScript** - Full type safety with strict mode
- **Vite** - Lightning fast build tool
- **pnpm** - Efficient package management

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run tests
pnpm test

# Build for production
pnpm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── NetworkGraph.tsx      # D3 visualization component
│   ├── StartupUniverse.tsx   # Main app component
│   └── LoadingSpinner.tsx    # Loading states
├── data/
│   └── networkDataProvider.ts # Data fetching with React 19 patterns
└── types/
    └── network.ts            # TypeScript types
```

## 🔧 Key Features

- **Interactive Force Simulation**: Drag, zoom, and pan the network
- **Real-time Controls**: Adjust physics parameters with sliders
- **Optimized Performance**: Efficient D3 + React integration
- **Responsive Design**: Adapts to window resizing
- **State Persistence**: Maintains zoom state across dimension changes

## 📝 Code Quality

- **ESLint**: Strict configuration with TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled
- **Testing**: Vitest with React Testing Library

## 📄 License

ISC
