/* eslint-disable */
import type { ConditionalValue } from './conditions';
import type { CssProperties } from './system-types';
import type { Tokens } from '../tokens/index';

export interface UtilityValues {
	top: Tokens["spacing"];
	left: Tokens["spacing"];
	inset: "auto" | Tokens["spacing"];
	insetInline: Tokens["spacing"];
	insetBlock: Tokens["spacing"];
	insetBlockEnd: Tokens["spacing"];
	insetBlockStart: Tokens["spacing"];
	insetInlineEnd: Tokens["spacing"];
	insetInlineStart: Tokens["spacing"];
	right: Tokens["spacing"];
	bottom: Tokens["spacing"];
	float: "start" | "end" | CssProperties["float"];
	flexBasis: "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "full";
	flex: "1" | "auto" | "initial" | "none";
	gridAutoColumns: "min" | "max" | "fr";
	gridAutoRows: "min" | "max" | "fr";
	gap: Tokens["spacing"];
	gridGap: Tokens["spacing"];
	gridRowGap: Tokens["spacing"];
	gridColumnGap: Tokens["spacing"];
	rowGap: Tokens["spacing"];
	columnGap: Tokens["spacing"];
	padding: Tokens["spacing"];
	paddingLeft: Tokens["spacing"];
	paddingRight: Tokens["spacing"];
	paddingTop: Tokens["spacing"];
	paddingBottom: Tokens["spacing"];
	paddingBlock: Tokens["spacing"];
	paddingBlockEnd: Tokens["spacing"];
	paddingBlockStart: Tokens["spacing"];
	paddingInline: Tokens["spacing"];
	paddingInlineEnd: Tokens["spacing"];
	paddingInlineStart: Tokens["spacing"];
	marginLeft: "auto" | Tokens["spacing"];
	marginRight: "auto" | Tokens["spacing"];
	marginTop: "auto" | Tokens["spacing"];
	marginBottom: "auto" | Tokens["spacing"];
	margin: "auto" | Tokens["spacing"];
	marginBlock: "auto" | Tokens["spacing"];
	marginBlockEnd: "auto" | Tokens["spacing"];
	marginBlockStart: "auto" | Tokens["spacing"];
	marginInline: "auto" | Tokens["spacing"];
	marginInlineEnd: "auto" | Tokens["spacing"];
	marginInlineStart: "auto" | Tokens["spacing"];
	spaceX: "auto" | Tokens["spacing"] | CssProperties["marginInlineStart"];
	spaceY: "auto" | Tokens["spacing"] | CssProperties["marginBlockStart"];
	outlineColor: Tokens["colors"];
	outlineOffset: Tokens["spacing"];
	divideColor: Tokens["colors"];
	divideStyle: CssProperties["borderStyle"];
	width: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "screen";
	inlineSize: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "screen";
	minWidth: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "screen";
	minInlineSize: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "screen";
	maxWidth: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "screen";
	maxInlineSize: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6" | "1/12" | "2/12" | "3/12" | "4/12" | "5/12" | "6/12" | "7/12" | "8/12" | "9/12" | "10/12" | "11/12" | "screen";
	height: "auto" | "svh" | "lvh" | "dvh" | "screen" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6";
	blockSize: "auto" | "svh" | "lvh" | "dvh" | "screen" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6";
	minHeight: "auto" | "svh" | "lvh" | "dvh" | "screen" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6";
	minBlockSize: "auto" | "svh" | "lvh" | "dvh" | "screen" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6";
	maxHeight: "auto" | "svh" | "lvh" | "dvh" | "screen" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6";
	maxBlockSize: "auto" | "svh" | "lvh" | "dvh" | "screen" | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "1/5" | "2/5" | "3/5" | "4/5" | "1/6" | "2/6" | "3/6" | "4/6" | "5/6";
	color: Tokens["colors"];
	fontFamily: Tokens["fonts"];
	fontSize: Tokens["fontSizes"];
	fontWeight: Tokens["fontWeights"];
	fontSmoothing: "antialiased" | "subpixel-antialiased";
	letterSpacing: Tokens["letterSpacings"];
	lineHeight: Tokens["lineHeights"];
	textDecorationColor: Tokens["colors"];
	textEmphasisColor: Tokens["colors"];
	textIndent: Tokens["spacing"];
	textShadow: Tokens["shadows"];
	textShadowColor: Tokens["colors"];
	textWrap: "wrap" | "balance" | "nowrap";
	truncate: boolean;
	background: Tokens["colors"];
	backgroundColor: Tokens["colors"];
	backgroundGradient: "to-t" | "to-tr" | "to-r" | "to-br" | "to-b" | "to-bl" | "to-l" | "to-tl";
	textGradient: "to-t" | "to-tr" | "to-r" | "to-br" | "to-b" | "to-bl" | "to-l" | "to-tl";
	gradientFrom: Tokens["colors"];
	gradientTo: Tokens["colors"];
	gradientVia: Tokens["colors"];
	borderRadius: Tokens["radii"];
	borderTopLeftRadius: Tokens["radii"];
	borderTopRightRadius: Tokens["radii"];
	borderBottomRightRadius: Tokens["radii"];
	borderBottomLeftRadius: Tokens["radii"];
	borderTopRadius: Tokens["radii"] | CssProperties["borderRadius"];
	borderRightRadius: Tokens["radii"] | CssProperties["borderRadius"];
	borderBottomRadius: Tokens["radii"] | CssProperties["borderRadius"];
	borderLeftRadius: Tokens["radii"] | CssProperties["borderRadius"];
	borderStartStartRadius: Tokens["radii"];
	borderStartEndRadius: Tokens["radii"];
	borderStartRadius: Tokens["radii"] | CssProperties["borderRadius"];
	borderEndStartRadius: Tokens["radii"];
	borderEndEndRadius: Tokens["radii"];
	borderEndRadius: Tokens["radii"] | CssProperties["borderRadius"];
	borderColor: Tokens["colors"];
	borderInlineColor: Tokens["colors"];
	borderBlockColor: Tokens["colors"];
	borderLeftColor: Tokens["colors"];
	borderInlineStartColor: Tokens["colors"];
	borderRightColor: Tokens["colors"];
	borderInlineEndColor: Tokens["colors"];
	borderTopColor: Tokens["colors"];
	borderBottomColor: Tokens["colors"];
	borderBlockEndColor: Tokens["colors"];
	borderBlockStartColor: Tokens["colors"];
	boxShadow: Tokens["shadows"];
	boxShadowColor: Tokens["colors"];
	filter: "auto";
	backdropFilter: "auto";
	borderSpacing: Tokens["spacing"] | "auto";
	borderSpacingX: Tokens["spacing"];
	borderSpacingY: Tokens["spacing"];
	transitionTimingFunction: Tokens["easings"];
	transitionDelay: Tokens["durations"];
	transitionDuration: Tokens["durations"];
	transition: "all" | "common" | "background" | "colors" | "opacity" | "shadow" | "transform";
	animationTimingFunction: Tokens["easings"];
	animationDuration: Tokens["durations"];
	animationDelay: Tokens["durations"];
	rotate: "auto" | "auto-3d" | CssProperties["rotate"];
	rotateX: CssProperties["rotate"];
	rotateY: CssProperties["rotate"];
	rotateZ: CssProperties["rotate"];
	scale: "auto" | CssProperties["scale"];
	translate: "auto" | "auto-3d" | CssProperties["translate"];
	translateX: Tokens["spacing"] | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "full" | "-1/2" | "-1/3" | "-2/3" | "-1/4" | "-2/4" | "-3/4" | "-full";
	translateY: Tokens["spacing"] | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "full" | "-1/2" | "-1/3" | "-2/3" | "-1/4" | "-2/4" | "-3/4" | "-full";
	translateZ: Tokens["spacing"] | "1/2" | "1/3" | "2/3" | "1/4" | "2/4" | "3/4" | "full" | "-1/2" | "-1/3" | "-2/3" | "-1/4" | "-2/4" | "-3/4" | "-full";
	accentColor: Tokens["colors"];
	caretColor: Tokens["colors"];
	scrollbar: "visible" | "hidden";
	scrollbarColor: Tokens["colors"];
	scrollMargin: Tokens["spacing"];
	scrollMarginLeft: Tokens["spacing"];
	scrollMarginRight: Tokens["spacing"];
	scrollMarginTop: Tokens["spacing"];
	scrollMarginBottom: Tokens["spacing"];
	scrollMarginBlock: Tokens["spacing"];
	scrollMarginBlockEnd: Tokens["spacing"];
	scrollMarginBlockStart: Tokens["spacing"];
	scrollMarginInline: Tokens["spacing"];
	scrollMarginInlineEnd: Tokens["spacing"];
	scrollMarginInlineStart: Tokens["spacing"];
	scrollPadding: Tokens["spacing"];
	scrollPaddingBlock: Tokens["spacing"];
	scrollPaddingBlockStart: Tokens["spacing"];
	scrollPaddingBlockEnd: Tokens["spacing"];
	scrollPaddingInline: Tokens["spacing"];
	scrollPaddingInlineEnd: Tokens["spacing"];
	scrollPaddingInlineStart: Tokens["spacing"];
	scrollPaddingLeft: Tokens["spacing"];
	scrollPaddingRight: Tokens["spacing"];
	scrollPaddingTop: Tokens["spacing"];
	scrollPaddingBottom: Tokens["spacing"];
	scrollSnapType: "none" | "x" | "y" | "both";
	scrollSnapStrictness: "mandatory" | "proximity";
	scrollSnapMargin: Tokens["spacing"];
	scrollSnapMarginTop: Tokens["spacing"];
	scrollSnapMarginBottom: Tokens["spacing"];
	scrollSnapMarginLeft: Tokens["spacing"];
	scrollSnapMarginRight: Tokens["spacing"];
	fill: Tokens["colors"];
	stroke: Tokens["colors"];
	srOnly: boolean;
	debug: boolean;
	containerName: CssProperties["containerName"];
	colorPalette: "ink" | "paper" | "ink-light" | "ink-muted" | "accent" | "data" | "alert" | "orange" | "blue" | "purple" | "cyan" | "gray" | "text" | "bg" | "border";
}



type WithColorOpacityModifier<T> = [T] extends [string] ? `${T}/${string}` & { __colorOpacityModifier?: true } : never

type ImportantMark = "!" | "!important"
type WhitespaceImportant = ` ${ImportantMark}`
type Important = ImportantMark | WhitespaceImportant
type WithImportant<T> = [T] extends [string] ? `${T}${Important}` & { __important?: true } : never

/**
 * Only relevant when using `strictTokens` or `strictPropertyValues` in your config.
 * - Allows you to use an escape hatch (e.g. `[123px]`) to use any string as a value.
 * - Allows you to use a color opacity modifier (e.g. `red/300`) with known color values.
 * - Allows you to use an important mark (e.g. `!` or `!important`) in the value.
 *
 * This is useful when you want to use a value that is not defined in the config or want to opt-out of the defaults.
 *
 * @example
 * css({
 *   fontSize: '[123px]', // ⚠️ will not throw even if you haven't defined 123px as a token
 * })
 *
 * @see https://panda-css.com/docs/concepts/writing-styles#stricttokens
 * @see https://panda-css.com/docs/concepts/writing-styles#strictpropertyvalues
 */
export type WithEscapeHatch<T> = T | `[${string}]` | WithColorOpacityModifier<T> | WithImportant<T>

/**
 * Will restrict the value of properties that have predefined values to those values only.
 *
 * @example
 * css({
 *   display: 'abc', // ❌ will throw
 * })
 *
 * @see https://panda-css.com/docs/concepts/writing-styles#strictpropertyvalues
 */
export type OnlyKnown<Key, Value> = Value extends boolean
  ? Value
  : Value extends `${infer _}` ? Value : never