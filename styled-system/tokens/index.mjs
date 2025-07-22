const tokens = {
  "fonts.editorial": {
    "value": "ABC Monument Grotesk, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "variable": "var(--fonts-editorial)"
  },
  "fonts.data": {
    "value": "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "variable": "var(--fonts-data)"
  },
  "fontSizes.xs": {
    "value": "0.8125rem",
    "variable": "var(--font-sizes-xs)"
  },
  "fontSizes.sm": {
    "value": "0.9375rem",
    "variable": "var(--font-sizes-sm)"
  },
  "fontSizes.base": {
    "value": "1.0625rem",
    "variable": "var(--font-sizes-base)"
  },
  "fontSizes.lg": {
    "value": "1.1875rem",
    "variable": "var(--font-sizes-lg)"
  },
  "fontSizes.xl": {
    "value": "1.375rem",
    "variable": "var(--font-sizes-xl)"
  },
  "fontSizes.2xl": {
    "value": "1.625rem",
    "variable": "var(--font-sizes-2xl)"
  },
  "fontSizes.3xl": {
    "value": "2rem",
    "variable": "var(--font-sizes-3xl)"
  },
  "fontSizes.4xl": {
    "value": "2.5rem",
    "variable": "var(--font-sizes-4xl)"
  },
  "fontWeights.regular": {
    "value": "400",
    "variable": "var(--font-weights-regular)"
  },
  "fontWeights.medium": {
    "value": "500",
    "variable": "var(--font-weights-medium)"
  },
  "fontWeights.semibold": {
    "value": "600",
    "variable": "var(--font-weights-semibold)"
  },
  "fontWeights.bold": {
    "value": "700",
    "variable": "var(--font-weights-bold)"
  },
  "lineHeights.tight": {
    "value": "1.15",
    "variable": "var(--line-heights-tight)"
  },
  "lineHeights.snug": {
    "value": "1.35",
    "variable": "var(--line-heights-snug)"
  },
  "lineHeights.normal": {
    "value": "1.5",
    "variable": "var(--line-heights-normal)"
  },
  "lineHeights.relaxed": {
    "value": "1.75",
    "variable": "var(--line-heights-relaxed)"
  },
  "letterSpacings.tight": {
    "value": "-0.02em",
    "variable": "var(--letter-spacings-tight)"
  },
  "letterSpacings.snug": {
    "value": "-0.01em",
    "variable": "var(--letter-spacings-snug)"
  },
  "letterSpacings.normal": {
    "value": "0",
    "variable": "var(--letter-spacings-normal)"
  },
  "letterSpacings.wide": {
    "value": "0.025em",
    "variable": "var(--letter-spacings-wide)"
  },
  "letterSpacings.wider": {
    "value": "0.05em",
    "variable": "var(--letter-spacings-wider)"
  },
  "colors.ink": {
    "value": "#1a1a1a",
    "variable": "var(--colors-ink)"
  },
  "colors.paper": {
    "value": "#ffffff",
    "variable": "var(--colors-paper)"
  },
  "colors.ink-light": {
    "value": "rgba(26, 26, 26, 0.87)",
    "variable": "var(--colors-ink-light)"
  },
  "colors.ink-muted": {
    "value": "#666666",
    "variable": "var(--colors-ink-muted)"
  },
  "colors.accent": {
    "value": "#646cff",
    "variable": "var(--colors-accent)"
  },
  "colors.data": {
    "value": "#ff8800",
    "variable": "var(--colors-data)"
  },
  "colors.alert": {
    "value": "#ff4d4d",
    "variable": "var(--colors-alert)"
  },
  "colors.alert.hover": {
    "value": "#e63939",
    "variable": "var(--colors-alert-hover)"
  },
  "colors.orange": {
    "value": "#ff8a00",
    "variable": "var(--colors-orange)"
  },
  "colors.orange.hover": {
    "value": "#ff7a00",
    "variable": "var(--colors-orange-hover)"
  },
  "colors.blue": {
    "value": "#00b4d8",
    "variable": "var(--colors-blue)"
  },
  "colors.blue.hover": {
    "value": "#0096c7",
    "variable": "var(--colors-blue-hover)"
  },
  "colors.purple": {
    "value": "#8B5CF6",
    "variable": "var(--colors-purple)"
  },
  "colors.purple.hover": {
    "value": "#7C3AED",
    "variable": "var(--colors-purple-hover)"
  },
  "colors.cyan": {
    "value": "#06B6D4",
    "variable": "var(--colors-cyan)"
  },
  "colors.cyan.hover": {
    "value": "#0891B2",
    "variable": "var(--colors-cyan-hover)"
  },
  "colors.gray.50": {
    "value": "#f9fafb",
    "variable": "var(--colors-gray-50)"
  },
  "colors.gray.100": {
    "value": "#f3f4f6",
    "variable": "var(--colors-gray-100)"
  },
  "colors.gray.200": {
    "value": "#e5e7eb",
    "variable": "var(--colors-gray-200)"
  },
  "colors.gray.300": {
    "value": "#d1d5db",
    "variable": "var(--colors-gray-300)"
  },
  "colors.gray.400": {
    "value": "#9ca3af",
    "variable": "var(--colors-gray-400)"
  },
  "colors.gray.500": {
    "value": "#6b7280",
    "variable": "var(--colors-gray-500)"
  },
  "colors.gray.600": {
    "value": "#4b5563",
    "variable": "var(--colors-gray-600)"
  },
  "colors.gray.700": {
    "value": "#374151",
    "variable": "var(--colors-gray-700)"
  },
  "colors.gray.800": {
    "value": "#1f2937",
    "variable": "var(--colors-gray-800)"
  },
  "colors.gray.900": {
    "value": "#111827",
    "variable": "var(--colors-gray-900)"
  },
  "spacing.0": {
    "value": "0",
    "variable": "var(--spacing-0)"
  },
  "spacing.1": {
    "value": "8px",
    "variable": "var(--spacing-1)"
  },
  "spacing.2": {
    "value": "16px",
    "variable": "var(--spacing-2)"
  },
  "spacing.3": {
    "value": "24px",
    "variable": "var(--spacing-3)"
  },
  "spacing.4": {
    "value": "32px",
    "variable": "var(--spacing-4)"
  },
  "spacing.5": {
    "value": "40px",
    "variable": "var(--spacing-5)"
  },
  "spacing.6": {
    "value": "48px",
    "variable": "var(--spacing-6)"
  },
  "spacing.7": {
    "value": "56px",
    "variable": "var(--spacing-7)"
  },
  "spacing.8": {
    "value": "64px",
    "variable": "var(--spacing-8)"
  },
  "spacing.9": {
    "value": "72px",
    "variable": "var(--spacing-9)"
  },
  "spacing.10": {
    "value": "80px",
    "variable": "var(--spacing-10)"
  },
  "spacing.xs": {
    "value": "8px",
    "variable": "var(--spacing-xs)"
  },
  "spacing.sm": {
    "value": "16px",
    "variable": "var(--spacing-sm)"
  },
  "spacing.md": {
    "value": "24px",
    "variable": "var(--spacing-md)"
  },
  "spacing.lg": {
    "value": "32px",
    "variable": "var(--spacing-lg)"
  },
  "spacing.xl": {
    "value": "48px",
    "variable": "var(--spacing-xl)"
  },
  "spacing.2xl": {
    "value": "64px",
    "variable": "var(--spacing-2xl)"
  },
  "spacing.3xl": {
    "value": "80px",
    "variable": "var(--spacing-3xl)"
  },
  "radii.sm": {
    "value": "4px",
    "variable": "var(--radii-sm)"
  },
  "radii.md": {
    "value": "8px",
    "variable": "var(--radii-md)"
  },
  "radii.lg": {
    "value": "12px",
    "variable": "var(--radii-lg)"
  },
  "radii.xl": {
    "value": "18px",
    "variable": "var(--radii-xl)"
  },
  "radii.2xl": {
    "value": "24px",
    "variable": "var(--radii-2xl)"
  },
  "radii.full": {
    "value": "9999px",
    "variable": "var(--radii-full)"
  },
  "shadows.sm": {
    "value": "0 1px 2px rgba(0, 0, 0, 0.05)",
    "variable": "var(--shadows-sm)"
  },
  "shadows": {
    "value": "0 2px 4px rgba(0, 0, 0, 0.05)",
    "variable": "var(--shadows)"
  },
  "shadows.md": {
    "value": "0 4px 6px rgba(0, 0, 0, 0.07)",
    "variable": "var(--shadows-md)"
  },
  "shadows.lg": {
    "value": "0 10px 15px rgba(0, 0, 0, 0.1)",
    "variable": "var(--shadows-lg)"
  },
  "shadows.xl": {
    "value": "0 20px 25px rgba(0, 0, 0, 0.1)",
    "variable": "var(--shadows-xl)"
  },
  "shadows.brand.orange": {
    "value": "0 2px 4px rgba(255, 138, 0, 0.25)",
    "variable": "var(--shadows-brand-orange)"
  },
  "shadows.brand.blue": {
    "value": "0 2px 4px rgba(0, 180, 216, 0.2)",
    "variable": "var(--shadows-brand-blue)"
  },
  "shadows.brand.accent": {
    "value": "0 2px 4px rgba(100, 108, 255, 0.2)",
    "variable": "var(--shadows-brand-accent)"
  },
  "durations.fast": {
    "value": "0.15s",
    "variable": "var(--durations-fast)"
  },
  "durations.base": {
    "value": "0.2s",
    "variable": "var(--durations-base)"
  },
  "durations.slow": {
    "value": "0.3s",
    "variable": "var(--durations-slow)"
  },
  "durations.slower": {
    "value": "0.4s",
    "variable": "var(--durations-slower)"
  },
  "easings.default": {
    "value": "ease",
    "variable": "var(--easings-default)"
  },
  "easings.in": {
    "value": "ease-in",
    "variable": "var(--easings-in)"
  },
  "easings.out": {
    "value": "ease-out",
    "variable": "var(--easings-out)"
  },
  "easings.inOut": {
    "value": "ease-in-out",
    "variable": "var(--easings-in-out)"
  },
  "colors.text.primary": {
    "value": "var(--colors-text-primary)",
    "variable": "var(--colors-text-primary)"
  },
  "colors.text.secondary": {
    "value": "var(--colors-text-secondary)",
    "variable": "var(--colors-text-secondary)"
  },
  "colors.text.muted": {
    "value": "var(--colors-text-muted)",
    "variable": "var(--colors-text-muted)"
  },
  "colors.bg.primary": {
    "value": "var(--colors-bg-primary)",
    "variable": "var(--colors-bg-primary)"
  },
  "colors.bg.secondary": {
    "value": "var(--colors-bg-secondary)",
    "variable": "var(--colors-bg-secondary)"
  },
  "colors.bg.hover": {
    "value": "rgba(0, 0, 0, 0.04)",
    "variable": "var(--colors-bg-hover)"
  },
  "colors.border": {
    "value": "rgba(0, 0, 0, 0.08)",
    "variable": "var(--colors-border)"
  },
  "colors.border.subtle": {
    "value": "rgba(0, 0, 0, 0.04)",
    "variable": "var(--colors-border-subtle)"
  },
  "colors.border.strong": {
    "value": "rgba(0, 0, 0, 0.15)",
    "variable": "var(--colors-border-strong)"
  },
  "spacing.-0": {
    "value": "calc(var(--spacing-0) * -1)",
    "variable": "var(--spacing-0)"
  },
  "spacing.-1": {
    "value": "calc(var(--spacing-1) * -1)",
    "variable": "var(--spacing-1)"
  },
  "spacing.-2": {
    "value": "calc(var(--spacing-2) * -1)",
    "variable": "var(--spacing-2)"
  },
  "spacing.-3": {
    "value": "calc(var(--spacing-3) * -1)",
    "variable": "var(--spacing-3)"
  },
  "spacing.-4": {
    "value": "calc(var(--spacing-4) * -1)",
    "variable": "var(--spacing-4)"
  },
  "spacing.-5": {
    "value": "calc(var(--spacing-5) * -1)",
    "variable": "var(--spacing-5)"
  },
  "spacing.-6": {
    "value": "calc(var(--spacing-6) * -1)",
    "variable": "var(--spacing-6)"
  },
  "spacing.-7": {
    "value": "calc(var(--spacing-7) * -1)",
    "variable": "var(--spacing-7)"
  },
  "spacing.-8": {
    "value": "calc(var(--spacing-8) * -1)",
    "variable": "var(--spacing-8)"
  },
  "spacing.-9": {
    "value": "calc(var(--spacing-9) * -1)",
    "variable": "var(--spacing-9)"
  },
  "spacing.-10": {
    "value": "calc(var(--spacing-10) * -1)",
    "variable": "var(--spacing-10)"
  },
  "spacing.-xs": {
    "value": "calc(var(--spacing-xs) * -1)",
    "variable": "var(--spacing-xs)"
  },
  "spacing.-sm": {
    "value": "calc(var(--spacing-sm) * -1)",
    "variable": "var(--spacing-sm)"
  },
  "spacing.-md": {
    "value": "calc(var(--spacing-md) * -1)",
    "variable": "var(--spacing-md)"
  },
  "spacing.-lg": {
    "value": "calc(var(--spacing-lg) * -1)",
    "variable": "var(--spacing-lg)"
  },
  "spacing.-xl": {
    "value": "calc(var(--spacing-xl) * -1)",
    "variable": "var(--spacing-xl)"
  },
  "spacing.-2xl": {
    "value": "calc(var(--spacing-2xl) * -1)",
    "variable": "var(--spacing-2xl)"
  },
  "spacing.-3xl": {
    "value": "calc(var(--spacing-3xl) * -1)",
    "variable": "var(--spacing-3xl)"
  },
  "colors.colorPalette": {
    "value": "var(--colors-color-palette)",
    "variable": "var(--colors-color-palette)"
  },
  "colors.colorPalette.hover": {
    "value": "var(--colors-color-palette-hover)",
    "variable": "var(--colors-color-palette-hover)"
  },
  "colors.colorPalette.50": {
    "value": "var(--colors-color-palette-50)",
    "variable": "var(--colors-color-palette-50)"
  },
  "colors.colorPalette.100": {
    "value": "var(--colors-color-palette-100)",
    "variable": "var(--colors-color-palette-100)"
  },
  "colors.colorPalette.200": {
    "value": "var(--colors-color-palette-200)",
    "variable": "var(--colors-color-palette-200)"
  },
  "colors.colorPalette.300": {
    "value": "var(--colors-color-palette-300)",
    "variable": "var(--colors-color-palette-300)"
  },
  "colors.colorPalette.400": {
    "value": "var(--colors-color-palette-400)",
    "variable": "var(--colors-color-palette-400)"
  },
  "colors.colorPalette.500": {
    "value": "var(--colors-color-palette-500)",
    "variable": "var(--colors-color-palette-500)"
  },
  "colors.colorPalette.600": {
    "value": "var(--colors-color-palette-600)",
    "variable": "var(--colors-color-palette-600)"
  },
  "colors.colorPalette.700": {
    "value": "var(--colors-color-palette-700)",
    "variable": "var(--colors-color-palette-700)"
  },
  "colors.colorPalette.800": {
    "value": "var(--colors-color-palette-800)",
    "variable": "var(--colors-color-palette-800)"
  },
  "colors.colorPalette.900": {
    "value": "var(--colors-color-palette-900)",
    "variable": "var(--colors-color-palette-900)"
  },
  "colors.colorPalette.primary": {
    "value": "var(--colors-color-palette-primary)",
    "variable": "var(--colors-color-palette-primary)"
  },
  "colors.colorPalette.secondary": {
    "value": "var(--colors-color-palette-secondary)",
    "variable": "var(--colors-color-palette-secondary)"
  },
  "colors.colorPalette.muted": {
    "value": "var(--colors-color-palette-muted)",
    "variable": "var(--colors-color-palette-muted)"
  },
  "colors.colorPalette.subtle": {
    "value": "var(--colors-color-palette-subtle)",
    "variable": "var(--colors-color-palette-subtle)"
  },
  "colors.colorPalette.strong": {
    "value": "var(--colors-color-palette-strong)",
    "variable": "var(--colors-color-palette-strong)"
  }
}

export function token(path, fallback) {
  return tokens[path]?.value || fallback
}

function tokenVar(path, fallback) {
  return tokens[path]?.variable || fallback
}

token.var = tokenVar