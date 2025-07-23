# Figma Visual Alignment Guide

This document outlines the visual design discrepancies between the current implementation and Figma
designs, focusing solely on shapes, layouts, lines, and alignments (independent of data).

## Overview

The implementation has functional visualizations but requires visual adjustments to match Figma
specifications in terms of layout structure, shape types, line styling, and spatial relationships.

## Screen-by-Screen Visual Analysis

### 1. Anticipated Tariff Impact

#### Shape Types

- **❌ INCORRECT: Circle Arrangement**
  - **Current**: Overlapping circles (Venn diagram style)
  - **Expected**: Separated bubble chart with spacing between circles
  - **Fix**: Use D3 pack layout or force simulation with collision detection

#### Container & Background

- **❌ MISSING: Content Container**
  - Figma shows subtle gray background container
  - Current implementation lacks visual containment

#### Grid & Lines

- **❌ MISSING: Section Dividers**
  - Horizontal separator line between header and content
  - Visual hierarchy separation needed

### 2. Country Exposure

#### Chart Type

- **❌ INCORRECT: Visualization Type**
  - **Current**: Donut/pie chart
  - **Expected**: Sunburst chart (concentric circles)
  - **Fix**: Implement D3 sunburst or nested circles

#### Layout Proportions

- **✅ CORRECT: Three-column layout**
- **❌ INCORRECT: Column width ratios**
  - Center visualization should be larger
  - Legend column too wide

#### Spacing Issues

- **❌ Legend Vertical Spacing**
  - Items too tightly packed
  - Need consistent padding between entries
  - Values should breathe more

#### Alignment

- **❌ Chart Centering**
  - Visualization not perfectly centered in container
  - Needs equal margins on all sides

### 3. Company Timeline

#### Grid Styling

- **❌ INCORRECT: Grid Line Prominence**
  - **Current**: Dark, prominent grid lines
  - **Expected**: Subtle light gray grid
  - **Fix**: Reduce opacity to ~0.1-0.2

#### Chart Proportions

- **❌ Aspect Ratio**
  - **Current**: Too tall (portrait orientation)
  - **Expected**: Wider, landscape orientation
  - **Fix**: Adjust height to ~60% of current

#### Line Styling

- **❌ Line Weight**
  - **Current**: Thin lines (~1px)
  - **Expected**: Bolder lines (~2-3px)
  - **Fix**: Increase strokeWidth

#### Container Padding

- **❌ Insufficient Padding**
  - Chart touches edges too closely
  - Need 20-30px padding around chart area

### 4. Country Timeline

#### Critical Shape Issue

- **❌ INCORRECT: Line Type**
  - **Current**: Step/staircase function
  - **Expected**: Smooth curved lines
  - **Fix**: Use D3 curve interpolation (e.g., curveMonotoneX)

#### Visual Flow

- **❌ Jarring Transitions**
  - Step functions create harsh visual breaks
  - Should flow smoothly between points

#### Grid Refinements

- **❌ Vertical Grid Lines**
  - Too prominent and distracting
  - Should be barely visible

#### Layout Dimensions

- **❌ Chart Height**
  - Occupies too much vertical space
  - Should be more panoramic/wide

### 5. Startup Universe

#### Network Density

- **❌ Node Spacing**
  - **Current**: Too spread out/sparse
  - **Expected**: More compact clustering
  - **Fix**: Adjust force simulation parameters

#### Node Styling

- **❌ Node Sizes**
  - **Current**: Small uniform circles
  - **Expected**: Slightly larger with size variation
  - **Fix**: Scale nodes based on importance/connections

#### Edge Styling

- **❌ Connection Lines**
  - **Current**: Too prominent
  - **Expected**: Subtle, lower opacity
  - **Fix**: Reduce stroke opacity to 0.3-0.4

#### Control Panel

- **❌ Slider Spacing**
  - Insufficient vertical gap between sliders
  - Need 16-20px between each control

## Global Visual Issues

### Typography Alignment

- **❌ Vertical Text Alignment**
  - Some labels not properly baseline-aligned
  - Inconsistent text positioning

### Container Styling

- **❌ Background Containers**
  - Missing subtle backgrounds for content areas
  - No visual separation from page background

### Spacing System

- **❌ Inconsistent Margins**
  - Need standardized 8px grid system
  - Padding values should follow consistent scale

### Color & Contrast

- **❌ Grid Line Colors**
  - All grids too dark (#000 at 0.3+)
  - Should be #000 at 0.1 or #gray-300

## Implementation Priority

### High Priority (Breaking Visual Consistency)

1. Fix Country Exposure chart type (donut → sunburst)
2. Fix Country Timeline line type (steps → smooth curves)
3. Reduce grid line prominence across all charts

### Medium Priority (Polish)

1. Adjust chart aspect ratios and proportions
2. Fix node spacing in Startup Universe
3. Add proper container backgrounds
4. Increase line weights where needed

### Low Priority (Fine-tuning)

1. Perfect center alignment of visualizations
2. Standardize all spacing to 8px grid
3. Fine-tune typography alignment
4. Adjust animation timings

## Technical Implementation Notes

### D3.js Adjustments Needed

```javascript
// Country Timeline - Add curve interpolation
line.curve(d3.curveMonotoneX) // or curveCardinal

// Country Exposure - Switch to sunburst
d3.partition() // Instead of d3.pie()

  // Grid styling
  .style('stroke', '#000')
  .style('stroke-opacity', 0.1) // Very subtle

// Node spacing
simulation
  .force(
    'collision',
    d3.forceCollide().radius((d) => d.r + 5),
  )
  .force('charge', d3.forceManyBody().strength(-50))
```

### CSS Grid Adjustments

```css
/* Subtle backgrounds */
.content-container {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 24px;
}

/* Consistent spacing */
.element + .element {
  margin-top: 16px; /* or 24px for sections */
}
```

## Visual Specifications

### Grid Lines

- Color: `#000000`
- Opacity: `0.1`
- Width: `1px`
- Style: `solid`

### Chart Lines

- Width: `2-3px`
- Opacity: `1`
- Smooth curves where applicable

### Container Backgrounds

- Color: `#F5F5F5` or `rgba(0,0,0,0.02)`
- Border radius: `8px`
- Padding: `24px`

### Spacing Scale

- Base: `8px`
- Scale: `8, 16, 24, 32, 48, 64`

This guide should be used to systematically address visual inconsistencies and achieve pixel-perfect
alignment with Figma designs.
