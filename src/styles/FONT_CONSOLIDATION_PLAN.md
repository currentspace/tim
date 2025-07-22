# Font System Consolidation Plan

## Current Issues

1. **Multiple Variable Names**:
   - `--font-editorial` (correct)
   - `--font-data` (correct)
   - `--font-heading` (duplicate of editorial)
   - `--font-body` (duplicate of data)

2. **Font Definitions in Multiple Places**:
   - `src/index.css` - Font faces + variables
   - `src/styles/fonts.css` - Duplicate variables
   - `src/styles/global.css` - Font faces + variables
   - `panda.config.ts` - Token definitions
   - `src/styles/shared.ts` - Using Panda tokens
   - Component CSS files - Using CSS variables

3. **D3 Code Using CSS Variables**:
   - Direct `.style('font-family', 'var(--font-data)')` calls
   - Should use constants or utilities

## Consolidation Strategy

### 1. Single Source of Truth

- Keep font-face declarations ONLY in `global.css`
- Define font tokens ONLY in `panda.config.ts`
- Remove all other font variable definitions

### 2. Standardize Variable Names

- Use only two font families:
  - `editorial` - ABC Monument Grotesk (headings, badges)
  - `data` - Inter (body text, data values)
- Remove `--font-heading` and `--font-body` aliases

### 3. Create Font Constants for D3

```typescript
// src/constants/fonts.ts
export const FONTS = {
  EDITORIAL: 'ABC Monument Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  DATA: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const
```

### 4. Migration Steps

1. Update all `--font-heading` → `--font-editorial`
2. Update all `--font-body` → `--font-data`
3. Replace D3 font styling with constants
4. Remove duplicate font CSS files
5. Update shared styles to handle all font patterns

## Files to Update

### Remove/Consolidate:

- ❌ `src/index.css` - Already replaced by global.css
- ❌ `src/styles/fonts.css` - Duplicate definitions
- ❌ All component CSS font definitions

### Keep/Update:

- ✅ `src/styles/global.css` - Font faces only
- ✅ `panda.config.ts` - Font tokens
- ✅ `src/styles/shared.ts` - Typography patterns
- ✅ Create `src/constants/fonts.ts` - For D3 usage
