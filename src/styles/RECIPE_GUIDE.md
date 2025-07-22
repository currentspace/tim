# Panda CSS Recipe System Guide

This guide documents the recipe system for consistent styling across the application.

## Available Recipes

### 1. Typography Recipe

The typography recipe provides consistent text styling with semantic variants.

```typescript
import { typography } from '../styled-system/recipes'

// Basic usage
<h1 className={typography({ variant: 'editorialDisplay' })}>Title</h1>

// With size override
<p className={typography({ variant: 'dataLabel', size: 'lg' })}>Label</p>

// With color variant
<span className={typography({ variant: 'dataValue', color: 'muted' })}>Value</span>
```

**Variants:**

- `variant`: editorialDisplay, editorialHeader, editorialTitle, dataValue, dataLabel, dataCaption,
  sectionTitle
- `size`: xs, sm, base, lg, xl, 2xl, 3xl
- `weight`: regular, medium, semibold, bold
- `color`: primary, secondary, muted, accent, alert
- `align`: left, center, right

### 2. Layout Recipes

#### flexLayout

Flexible box layout with common patterns.

```typescript
import { flexLayout } from '../styled-system/recipes'

// Center content
<div className={flexLayout({ align: 'center', justify: 'center' })}>

// Vertical stack with gap
<div className={flexLayout({ direction: 'column', gap: 'md' })}>

// Space between items
<nav className={flexLayout({ justify: 'between', align: 'center' })}>
```

**Variants:**

- `direction`: row, column, rowReverse, columnReverse
- `align`: start, center, end, stretch, baseline
- `justify`: start, center, end, between, around, evenly
- `wrap`: wrap, nowrap, reverse
- `gap`: none, xs, sm, md, lg, xl, 2xl
- `grow`: 0, 1
- `shrink`: 0, 1

#### pageContainer

Container layouts for pages and sections.

```typescript
import { pageContainer } from '../styled-system/recipes'

// Full page container
<div className={pageContainer({ variant: 'page' })}>

// Section with padding
<section className={pageContainer({ variant: 'section', background: 'gray' })}>

// Header with border
<header className={pageContainer({ variant: 'header' })}>
```

**Variants:**

- `variant`: page, section, header, visualization
- `background`: white, gray, transparent
- `padding`: none, sm, md, lg, xl, 2xl
- `border`: none, bottom, top, all

#### stackLayout

Vertical stack layout with consistent spacing.

```typescript
import { stackLayout } from '../styled-system/recipes'

// Form fields stack
<form className={stackLayout({ spacing: 'md' })}>

// Centered stack
<div className={stackLayout({ spacing: 'lg', align: 'center' })}>
```

**Variants:**

- `spacing`: none, xs, sm, md, lg, xl, 2xl
- `align`: start, center, end, stretch

### 3. Button Recipe

Button styles with multiple variants.

```typescript
import { button } from '../styled-system/recipes'

// Primary button
<button className={button({ variant: 'solid', size: 'md' })}>Submit</button>

// Icon button
<button className={button({ variant: 'icon', size: 'sm' })}>×</button>

// Navigation link
<a className={button({ variant: 'nav' })} data-active={isActive}>Home</a>

// Full width button
<button className={button({ variant: 'outline', fullWidth: true })}>Continue</button>
```

**Variants:**

- `variant`: solid, outline, ghost, icon, nav
- `size`: sm, md, lg
- `shape`: rectangle, rounded, square
- `fullWidth`: true/false

## Combining Recipes with Custom Styles

Use `cx()` to combine recipes with custom overrides:

```typescript
import { cx } from '../styled-system/css'
import { typography, button } from '../styled-system/recipes'

// Recipe + custom styles
<h1 className={cx(
  typography({ variant: 'editorialDisplay' }),
  css({ marginBottom: '2rem', textTransform: 'none' })
)}>

// Multiple recipes
<button className={cx(
  button({ variant: 'solid' }),
  typography({ weight: 'bold' }),
  css({ minWidth: '200px' })
)}>
```

## Migration Examples

### Before (inline styles)

```typescript
<h2 className={css({
  fontFamily: 'editorial',
  fontSize: '2xl',
  fontWeight: 'bold',
  lineHeight: 'tight',
  letterSpacing: 'tight',
  textTransform: 'uppercase',
})}>Title</h2>

<div className={css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
})}>Content</div>
```

### After (using recipes)

```typescript
<h2 className={typography({ variant: 'editorialDisplay' })}>Title</h2>

<div className={flexLayout({ align: 'center', justify: 'between', gap: 'md' })}>
  Content
</div>
```

## Benefits

1. **Consistency**: All components use the same typography and layout patterns
2. **Type Safety**: TypeScript ensures valid variant combinations
3. **Performance**: Recipe styles are optimized at build time
4. **Maintainability**: Changes to design system propagate automatically
5. **Reduced Bundle Size**: Eliminates duplicate style definitions

## Next Steps

1. Continue migrating remaining components to use recipes
2. Add more recipe variants as patterns emerge
3. Create component-specific recipes for complex patterns
4. Remove deprecated styles from shared.ts
