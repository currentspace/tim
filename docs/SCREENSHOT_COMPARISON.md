# Screenshot Comparison System

This document describes the improved screenshot generation and comparison system for visual
regression testing against Figma designs.

## Overview

The screenshot system captures pixel-perfect screenshots of all application routes and compares them
with Figma design exports to ensure implementation matches the design specifications.

## Features

- **Consistent Screenshot Capture**: Ensures animations are complete and fonts are loaded
- **Multiple Comparison Views**: Side-by-side, slider overlay, and pixel diff views
- **Visual Diff Generation**: Highlights pixel differences between design and implementation
- **Tolerance Configuration**: Adjustable tolerance for each component type
- **Interactive HTML Viewer**: Beautiful comparison interface with multiple view modes

## Quick Start

```bash
# Make sure dev server is running
pnpm dev

# Run the complete screenshot workflow
pnpm screenshots:all

# Open the results in your browser
open screenshot-comparisons/index.html
```

## Available Commands

### Basic Commands

- `pnpm screenshots:all` - Run complete screenshot workflow
- `pnpm screenshots:clean` - Clean previous screenshots and run workflow
- `pnpm screenshots` - Capture screenshots only (no comparison)
- `pnpm screenshots:compare` - Organize and compare existing screenshots

### Advanced Commands

- `pnpm screenshots:ui` - Run screenshot capture with Playwright UI
- `pnpm screenshots:test` - Run visual regression tests
- `pnpm screenshots:install-deps` - Install optional dependencies for visual diff

## Visual Diff Features

To enable pixel-by-pixel visual diff comparisons, install the optional dependencies:

```bash
pnpm screenshots:install-deps
# or manually:
pnpm add -D canvas pixelmatch pngjs @types/pixelmatch
```

With these dependencies, the system will:

- Generate visual diff images showing pixel differences
- Calculate percentage difference for each component
- Show pass/fail status based on 5% threshold
- Color-code differences (red for changes, yellow for anti-aliasing)

## Configuration

### Route Configuration

Routes are configured in `e2e/capture-screenshots-improved.spec.ts`:

```typescript
const routes = [
  {
    path: '/',
    name: 'Anticipated Tariff Impact',
    screenshotName: 'anticipated-tariff-impact',
    figmaFile: 'anticipated_tariff_impact.png',
    waitForSelectors: ['.tariff-impact-grid', '.impact-chart svg'],
    componentSelector: '.anticipated-tariff-impact',
  },
  // ... more routes
]
```

### Tolerance Settings

Visual diff tolerance is configured in `e2e/utils/visual-comparison.ts`:

```typescript
const comparisonMap = [
  {
    captured: 'anticipated-tariff-impact-component.png',
    design: 'anticipated_tariff_impact.png',
    name: 'Anticipated Tariff Impact',
    tolerance: 0.1, // 10% tolerance
  },
  // ... more mappings
]
```

Tolerance guidelines:

- 0.1 (10%) - For static content and simple layouts
- 0.15 (15%) - For charts and data visualizations
- 0.2 (20%) - For complex animations and network graphs

## Comparison Viewer

The HTML viewer provides multiple ways to compare screenshots:

1. **Side by Side** - View design and implementation next to each other
2. **Slider** - Interactive overlay slider to compare differences
3. **Difference** - Visual diff highlighting pixel changes
4. **Figma Only** - View the original Figma design
5. **Captured Only** - View the current implementation

### Understanding Diff Colors

When visual diff is enabled:

- **Red pixels** - Significant differences from design
- **Yellow pixels** - Anti-aliasing or minor differences
- **Green pixels** - Present in implementation but not in design
- **Unchanged pixels** - Shown with transparency

## Best Practices

### For Consistent Screenshots

1. **Always run with dev server** - Ensures consistent environment
2. **Wait for animations** - System automatically waits but some components may need adjustment
3. **Use clean flag** - Run with `--clean` to ensure fresh screenshots
4. **Check font loading** - Verify custom fonts are loaded before capture

### For Accurate Comparisons

1. **Export Figma at 1x** - Ensure Figma exports are at 1440x900 (1x scale)
2. **Match viewport** - Screenshots are captured at 1440x900 to match Figma
3. **Component boundaries** - Ensure component selectors capture the full component
4. **Update tolerances** - Adjust tolerance for components with dynamic content

## Troubleshooting

### Common Issues

**Screenshots not capturing correctly:**

- Ensure dev server is running on http://localhost:5173
- Check that selectors in route configuration are correct
- Verify components are fully loaded before capture

**Visual diff not working:**

- Install optional dependencies: `pnpm screenshots:install-deps`
- Check that both captured and Figma images exist
- Verify image dimensions match

**High diff percentages:**

- Check if fonts are loading correctly
- Verify animations are disabled during capture
- Adjust tolerance for dynamic content
- Ensure Figma export matches implementation viewport

### Debug Mode

Run with Playwright UI to see the capture process:

```bash
pnpm screenshots:ui
```

This opens Playwright's UI mode where you can:

- Step through the capture process
- See what's happening in the browser
- Debug selector issues
- Verify timing issues

## File Structure

```
project/
├── figma/                          # Figma design exports
│   ├── anticipated_tariff_impact.png
│   ├── country_exposure.png
│   └── ...
├── screenshots/                    # Captured screenshots (git ignored)
│   ├── anticipated-tariff-impact-full.png
│   ├── anticipated-tariff-impact-component.png
│   └── ...
├── screenshot-comparisons/         # Organized comparisons (git ignored)
│   ├── index.html                 # Interactive comparison viewer
│   ├── anticipated-tariff-impact/
│   │   ├── captured.png
│   │   ├── design.png
│   │   └── diff.png
│   └── ...
└── e2e/
    ├── capture-screenshots-improved.spec.ts
    └── utils/
        ├── visual-comparison.ts
        └── run-screenshots.ts
```

## Extending the System

### Adding New Routes

1. Add route configuration to `capture-screenshots-improved.spec.ts`
2. Add Figma export to `figma/` directory
3. Update comparison mapping in `visual-comparison.ts`
4. Run `pnpm screenshots:all`

### Custom Capture Logic

For components requiring special handling, modify the capture logic:

```typescript
// In capture-screenshots-improved.spec.ts
if (route.name === 'Special Component') {
  // Custom wait logic
  await page.waitForFunction(() => {
    // Custom condition
    return document.querySelector('.special-loaded')
  })
}
```

### Integration with CI/CD

The system can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: pnpm install

- name: Install Playwright
  run: pnpm exec playwright install chromium

- name: Run visual regression tests
  run: pnpm screenshots:all

- name: Upload comparison results
  uses: actions/upload-artifact@v3
  with:
    name: screenshot-comparisons
    path: screenshot-comparisons/
```

## Future Enhancements

Potential improvements to consider:

- Automated PR comments with visual diff results
- Historical comparison tracking
- Responsive viewport testing
- Component-level screenshot testing
- Integration with design systems
- Approval workflow for visual changes
