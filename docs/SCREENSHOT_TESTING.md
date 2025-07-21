# Screenshot Testing Guide

This project uses Playwright to capture screenshots of visualization components and compare them
with design images.

## Prerequisites

All required dependencies are already installed in the project:

- Playwright test runner
- Playwright Chromium browser
- tsx for running TypeScript scripts

## Capturing Screenshots

To capture screenshots of all visualization components:

```bash
pnpm screenshots
```

This will:

1. Start the development server automatically
2. Navigate to each visualization component
3. Capture full-page and component-specific screenshots
4. Save them to the `screenshots/` directory

### Interactive Mode

To run screenshot capture with Playwright's UI (useful for debugging):

```bash
pnpm screenshots:ui
```

## Comparing Screenshots

After capturing screenshots, organize them for comparison with design images:

```bash
pnpm screenshots:compare
```

This will:

1. Create a `screenshot-comparisons/` directory
2. Organize captured screenshots alongside design images
3. Generate an HTML comparison page at `screenshot-comparisons/index.html`

## Workflow

1. **Capture screenshots**: `pnpm screenshots`
2. **Organize for comparison**: `pnpm screenshots:compare`
3. **View comparisons**: Open `screenshot-comparisons/index.html` in your browser

## Screenshot Mappings

The following visualizations are captured and compared:

| Component                 | Design Image                               |
| ------------------------- | ------------------------------------------ |
| Anticipated Tariff Impact | `anticipated.png`                          |
| Country Exposure          | `exposure.png`                             |
| Tariff Rate Timeline      | `Screenshot 2025-07-21 at 12.06.07 PM.png` |
| Country Tariff Timeline   | `company_timeline.png`                     |
| Startup Universe          | `Screenshot 2025-07-21 at 12.05.50 PM.png` |

## Directory Structure

```
charles/
├── screenshots/                    # Captured screenshots (gitignored)
│   ├── *-full.png                 # Full page screenshots
│   └── *-component.png            # Component-only screenshots
├── screenshot-comparisons/         # Organized comparisons (gitignored)
│   ├── index.html                 # Comparison viewer
│   └── [visualization-name]/      # Per-visualization comparisons
│       ├── captured.png
│       └── design.png
└── src/images/                    # Original design images
```

## Troubleshooting

### Screenshots not capturing correctly

1. Ensure the dev server is running or can be started
2. Check that all visualizations have the expected CSS class selectors
3. Increase wait times in the test if animations need more time

### Missing design images

Update the mapping in `scripts/organize-screenshots.ts` if design image filenames change.

## Advanced Usage

### Visual Regression Testing

Playwright supports visual regression testing. To set this up:

1. Capture baseline screenshots
2. Move them to a `__screenshots__` directory
3. Use `toHaveScreenshot()` assertions in tests

See Playwright's visual testing documentation for details.
