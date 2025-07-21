# D3 Visualization Implementation Plan

## Overview

This document outlines the plan to implement high-fidelity D3 visualizations based on the
screenshots provided. There are 8 distinct visualizations that need to be recreated with accurate
styling and data representation.

## 1. Animated Timeline Bubble Chart (Screenshots 12.05.50 & 12.06.07)

**Image:** `Screenshot 2025-07-21 at 12.05.50 PM.png` & `Screenshot 2025-07-21 at 12.06.07 PM.png`

**Component:** `AnticipatedTariffImpact.tsx` (needs major updates)

### Current Issues:

- Using force simulation instead of static positioning
- Incorrect color scheme and styling
- Missing animated timeline interaction
- Not showing the exact visualization from the screenshots

### Target Visualization:

- **Type:** Animated bubble chart with timeline
- **Data:** Shows tariff exposure & rate for companies (Canon 9.7%, HP 16.1%, Apple 0%)
- **Colors:** Pink (Canon), Teal (HP), Orange (Apple)
- **Timeline:** Interactive slider from Jun 2025 to Dec 2025
- **Layout:** Force-directed

### Implementation Plan:

2. Create bubble scale based on percentage values
3. Implement smooth transitions when timeline changes
4. Add proper color mapping for each company
5. Create timeline slider with proper date formatting
6. Implement hover effects with tooltips

## 2. Multi-Line Time Series Chart (Screenshot 12.06.20)

**Image:** `Screenshot 2025-07-21 at 12.06.20 PM.png`

**Component:** New component needed - `TariffRateTimeline.tsx`

### Target Visualization:

- **Type:** Multi-line chart showing tariff rates over time
- **Data:** Shows tariff rate increases for multiple companies from 2025-2026 in quarterly
  increments
- **Y-axis:** Tariff Rate (%) ranging from 0-32%
- **X-axis:** Monthly timeline with tick marks
- **Lines:** Smooth curves with company-specific colors
- **Legend:** Shows company names with their values for the point in time on the timeline slider

### Implementation Plan:

1. Create D3 line generator with curve interpolation
2. Implement responsive scales for time (x) and percentage (y)
3. Add grid lines and axis styling
4. Create color scale matching the screenshot
5. Add interactive legend with their values for the point in time on the timeline slider
6. Implement hover interactions showing exact values
7. Add smooth transitions for data updates

## 3. Notification Settings UI (Screenshots 12.06.36 & 12.06.51)

**Images:** `Screenshot 2025-07-21 at 12.06.36 PM.png` & `Screenshot 2025-07-21 at 12.06.51 PM.png`

**Component:** New component needed - `NotificationSettings.tsx`

### Target Visualization:

- **Type:** Interactive selection interface (not a traditional chart)
- **Data:** Company and country selections with checkboxes
- **Layout:** Two-column layout with selection lists
- **Features:**
  - Company selection (HP, Apple, Canon, etc.)
  - Country selection (China, Vietnam, Mexico, etc.)
  - Selected items panel
  - "Send notifications to..." button

### Implementation Plan:

1. Create checkbox list components with proper styling
2. Implement selection state management
3. Add color coding for each company/country
4. Create selected items display panel
5. Style the send notifications button
6. Add proper typography and spacing

## 4. Country Tariff Rate Time Series (Screenshot 12.07.07)

**Image:** `Screenshot 2025-07-21 at 12.07.07 PM.png`

**Component:** New component needed - `CountryTariffTimeline.tsx`

### Target Visualization:

- **Type:** Multi-line chart for country-specific tariff rates
- **Data:** Shows tariff rates for different countries over time
- **Y-axis:** Tariff Rate (%) ranging from 0-28%
- **X-axis:** Timeline from 2025 to 2026
- **Legend:** Country list with their values for the point in time on the timeline slider and color
  codes

### Implementation Plan:

1. Similar to component #2 but with country-specific data
2. Implement wider date range on x-axis
3. Add country-specific color palette
4. Create legend showing their values for the point in time on the timeline slider snapshot values
5. Add grid lines and proper axis formatting
6. Implement smooth curve interpolation
7. Add interactive tooltips

## 5. Radial Country Exposure Chart (Screenshot 12.07.16)

**Image:** `Screenshot 2025-07-21 at 12.07.16 PM.png`

**Component:** `CountryExposure.tsx` (needs significant updates)

### Current Issues:

- Incorrect radial layout algorithm
- Missing leader lines and labels
- Wrong color scheme
- Not showing dollar volume properly

### Target Visualization:

- **Type:** Radial/sunburst chart with leader lines
- **Data:** Selected country exposure showing dollar volumes
- **Center:** Selected company name
- **Segments:** Countries with varying arc sizes based on exposure
- **Labels:** Country names with dollar amounts connected by leader lines
- **Colors:** Distinct color for each country segment

### Implementation Plan:

1. Rewrite radial layout to match screenshot exactly
2. Calculate proper arc sizes based on dollar volumes
3. Implement leader lines from segments to labels
4. Position labels outside the circle with proper spacing
5. Add concentric circle guidelines
6. Use exact color palette from screenshot
7. Add timeline slider at bottom

## 6. Anticipated Impact Bubble Chart (Screenshot 12.07.51)

**Image:** `Screenshot 2025-07-21 at 12.07.51 PM.png`

**Component:** Update to `AnticipatedTariffImpact.tsx`

### Target Visualization:

- **Type:** Three-bubble chart showing October 2025 anticipated impact
- **Data:** Dell (28.4%), HP (21.7%), Microsoft (14.9%)
- **Colors:** Purple (Dell), Teal (HP), Light Blue (Microsoft)
- **Timeline:** Shows October 2025 specifically
- **Layout:** Vertically stacked bubbles

### Implementation Plan:

1. Create vertical layout algorithm for bubble positioning
2. Scale bubbles based on percentage values
3. Add percentage labels inside bubbles
4. Implement timeline showing current date (for values for the point in time on the timeline slider)
5. Create smooth transitions between dates
6. Add legend showing rate impact connections

## Common Implementation Details

### Typography:

- Primary font: ABC Monument Grotesk or similar (Inter as fallback)
- Number formatting: Tabular numbers for data values
- Font weights: 700 for headers, 400-600 for data

### Color Palette:

```javascript
const colors = {
  // Companies
  hp: '#00b8a9', // Teal
  apple: '#ff8c1a', // Orange
  canon: '#ff66b3', // Pink
  dell: '#8b5cf6', // Purple
  microsoft: '#3b82f6', // Light Blue

  // Countries
  china: '#ff4d4d',
  vietnam: '#ff8c1a',
  mexico: '#ffcc00',
  eu: '#4dff4d',
  taiwan: '#1affe6',
  japan: '#1a75ff',
  malaysia: '#6666ff',
  southKorea: '#b366ff',
  philippines: '#ff66ff',
  thailand: '#ff66b3',
}
```

### Fonts

Use Inter for data values and changing data Use AG Monument Grotesk for headings and titles Going
for a two font asthetic like ft.com

### Interactions:

1. Smooth hover effects with 200ms transitions
2. Tooltips showing detailed information
3. Click interactions for filtering/selection
4. Timeline scrubbing with real-time updates
5. Animated transitions between states

### Responsive Design:

1. SVG viewBox for scalability
2. Dynamic text sizing based on container
3. Breakpoints for mobile/tablet views
4. Touch-friendly interactions

### Performance Optimizations:

1. Use D3's enter/update/exit pattern efficiently
2. Debounce timeline updates
3. Memoize expensive calculations
4. Use CSS transforms for animations
5. Implement virtual scrolling for large datasets

## Testing Strategy

Each component will need comprehensive tests for:

1. Data transformation accuracy
2. Scale calculations
3. User interactions (hover, click, drag)
4. Timeline updates
5. Responsive behavior
6. Accessibility features

## Next Steps

1. Create base D3 utilities for common functionality
2. Implement each visualization component
3. Add comprehensive test coverage
4. Integrate with existing data structure
5. Add accessibility features (ARIA labels, keyboard navigation)
6. Performance optimization pass
7. Cross-browser testing
