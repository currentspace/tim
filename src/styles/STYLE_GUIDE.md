# Style System Architecture

## Overview

This project uses a modern CSS architecture combining:

- **Panda CSS** for compile-time CSS-in-JS with zero runtime
- **Shared style utilities** for common patterns
- **Global CSS** for font-faces and native CSS needs

## Style Hierarchy

### 1. Design Tokens (panda.config.ts)

Foundation tokens that define our design system:

- **Colors**: Core palette, semantic colors, brand colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale (xs to 3xl)
- **Shadows**: Elevation system
- **Transitions**: Animation timings

### 2. Shared Styles (src/styles/shared.ts)

Reusable style patterns:

- **Typography patterns**: `editorialDisplay`, `sectionHeader`, `dataValue`, `dataLabel`
- **Layout patterns**: `visualizationContainer`, `headerSection`, `card`
- **Component patterns**: `badge`, `navigation`, `form`, `tooltip`
- **Utilities**: `cx()` for combining classes, `composeStyles` for variants

### 3. Component Styles

Component-specific styles using Panda CSS `css()` function inline

### 4. Global Styles (src/styles/global.css)

Minimal global styles for:

- Font-face declarations
- CSS custom properties for D3.js
- Keyframe animations
- Native form controls (sliders)

## Usage Examples

### Using Typography Patterns

```typescript
import { typographyStyles, cx } from '../styles/shared'

// Basic usage
<h1 className={typographyStyles.editorialDisplay}>Title</h1>

// With overrides
<p className={cx(
  typographyStyles.dataLabel,
  css({ fontSize: '11px' })
)}>
  Custom Label
</p>
```

### Using Component Patterns

```typescript
import { composeStyles } from '../styles/shared'

// Badge with variant
<span className={composeStyles.badge('anticipated')}>
  ANTICIPATED
</span>

// Navigation link with active state
<Link className={composeStyles.navLink(isActive)}>
  Home
</Link>
```

### Using Panda CSS Tokens

```typescript
import { css } from '../../styled-system/css'

const styles = css({
  // Use semantic tokens
  color: 'text.primary',
  bg: 'bg.secondary',

  // Use design tokens
  fontFamily: 'editorial',
  fontSize: 'lg',
  padding: 'xl',

  // Responsive styles
  '@media (max-width: 768px)': {
    padding: 'md',
  },
})
```

## Best Practices

1. **Use semantic tokens** over raw values
   - ✅ `color: 'text.primary'`
   - ❌ `color: '#213547'`

2. **Compose shared patterns** instead of duplicating
   - ✅ `className={typographyStyles.dataValue}`
   - ❌ `className={css({ fontFamily: 'data', fontWeight: 'semibold' })}`

3. **Keep global CSS minimal**
   - Only for font-faces, keyframes, and native CSS needs
   - Everything else should use Panda CSS

4. **Use cx() for combining classes**
   - ✅ `className={cx(baseStyle, conditionalStyle)}`
   - ❌ `className={\`${baseStyle} ${conditionalStyle}\`}`

5. **Create new shared patterns** when you find duplication
   - If a style combination appears 3+ times, extract to shared.ts

## Migration Checklist

When refactoring a component:

1. Remove component-specific CSS file imports
2. Replace class names with Panda CSS styles
3. Use shared patterns where applicable
4. Add new patterns to shared.ts if needed
5. Test responsive behavior
6. Verify dark mode support (if applicable)

## Font System

### Font Families

We use only two font families throughout the application:

- **editorial** - ABC Monument Grotesk (headings, badges, emphasis)
- **data** - Inter (body text, data values, UI elements)

### Font Usage

- **Panda CSS**: Use tokens `fontFamily: 'editorial'` or `fontFamily: 'data'`
- **CSS Variables**: Use `var(--font-editorial)` or `var(--font-data)`
- **D3/JavaScript**: Import from `src/constants/fonts.ts`:
  ```typescript
  import { FONTS } from '../constants/fonts'
  selection.style('font-family', FONTS.EDITORIAL)
  ```

## Files Removed

These duplicate files have been consolidated:

- ✅ src/index.css (replaced by global.css)
- ✅ src/styles/fonts.css (merged into global.css)
- ✅ src/styles/navigation.ts (replaced by shared.ts)

## Files to Migrate

These CSS files still need migration to Panda CSS:

- ⏳ src/components/Layout.css
- ⏳ src/components/AnticipatedTariffImpact.css
- ⏳ src/styles/timeline-slider.css
- ⏳ Other component CSS files...
