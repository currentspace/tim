/* eslint-disable */
export type Token = `fonts.${FontToken}` | `fontSizes.${FontSizeToken}` | `fontWeights.${FontWeightToken}` | `lineHeights.${LineHeightToken}` | `letterSpacings.${LetterSpacingToken}` | `colors.${ColorToken}` | `spacing.${SpacingToken}` | `radii.${RadiusToken}` | `shadows.${ShadowToken}` | `durations.${DurationToken}` | `easings.${EasingToken}`

export type ColorPalette = "ink" | "paper" | "ink-light" | "ink-muted" | "accent" | "data" | "alert" | "orange" | "blue" | "purple" | "cyan" | "gray" | "text" | "bg" | "border"

export type FontToken = "editorial" | "data"

export type FontSizeToken = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"

export type FontWeightToken = "regular" | "medium" | "semibold" | "bold"

export type LineHeightToken = "tight" | "snug" | "normal" | "relaxed"

export type LetterSpacingToken = "tight" | "snug" | "normal" | "wide" | "wider"

export type ColorToken = "ink" | "paper" | "ink-light" | "ink-muted" | "accent" | "data" | "alert" | "alert.hover" | "orange" | "orange.hover" | "blue" | "blue.hover" | "purple" | "purple.hover" | "cyan" | "cyan.hover" | "gray.50" | "gray.100" | "gray.200" | "gray.300" | "gray.400" | "gray.500" | "gray.600" | "gray.700" | "gray.800" | "gray.900" | "text.primary" | "text.secondary" | "text.muted" | "bg.primary" | "bg.secondary" | "bg.hover" | "border" | "border.subtle" | "border.strong" | "colorPalette" | "colorPalette.hover" | "colorPalette.50" | "colorPalette.100" | "colorPalette.200" | "colorPalette.300" | "colorPalette.400" | "colorPalette.500" | "colorPalette.600" | "colorPalette.700" | "colorPalette.800" | "colorPalette.900" | "colorPalette.primary" | "colorPalette.secondary" | "colorPalette.muted" | "colorPalette.subtle" | "colorPalette.strong"

export type SpacingToken = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "-0" | "-1" | "-2" | "-3" | "-4" | "-5" | "-6" | "-7" | "-8" | "-9" | "-10" | "-xs" | "-sm" | "-md" | "-lg" | "-xl" | "-2xl" | "-3xl"

export type RadiusToken = "sm" | "md" | "lg" | "xl" | "2xl" | "full"

export type ShadowToken = "sm" | "" | "md" | "lg" | "xl" | "brand.orange" | "brand.blue" | "brand.accent"

export type DurationToken = "fast" | "base" | "slow" | "slower"

export type EasingToken = "default" | "in" | "out" | "inOut"

export type Tokens = {
		fonts: FontToken
		fontSizes: FontSizeToken
		fontWeights: FontWeightToken
		lineHeights: LineHeightToken
		letterSpacings: LetterSpacingToken
		colors: ColorToken
		spacing: SpacingToken
		radii: RadiusToken
		shadows: ShadowToken
		durations: DurationToken
		easings: EasingToken
} & { [token: string]: never }

export type TokenCategory = "aspectRatios" | "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "cursor" | "shadows" | "spacing" | "radii" | "borders" | "borderWidths" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"