/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface FlexVariant {
  /**
 * @default "row"
 */
direction: "row" | "column" | "rowReverse" | "columnReverse"
/**
 * @default "stretch"
 */
align: "start" | "center" | "end" | "stretch" | "baseline"
/**
 * @default "start"
 */
justify: "start" | "center" | "end" | "between" | "around" | "evenly"
/**
 * @default "nowrap"
 */
wrap: "wrap" | "nowrap" | "reverse"
gap: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
grow: "0" | "1"
shrink: "0" | "1"
}

type FlexVariantMap = {
  [key in keyof FlexVariant]: Array<FlexVariant[key]>
}

export type FlexVariantProps = {
  [key in keyof FlexVariant]?: ConditionalValue<FlexVariant[key]> | undefined
}

export interface FlexRecipe {
  __type: FlexVariantProps
  (props?: FlexVariantProps): string
  raw: (props?: FlexVariantProps) => FlexVariantProps
  variantMap: FlexVariantMap
  variantKeys: Array<keyof FlexVariant>
  splitVariantProps<Props extends FlexVariantProps>(props: Props): [FlexVariantProps, Pretty<DistributiveOmit<Props, keyof FlexVariantProps>>]
  getVariantProps: (props?: FlexVariantProps) => FlexVariantProps
}

/**
 * Flexible box layout with common patterns
 */
export declare const flex: FlexRecipe