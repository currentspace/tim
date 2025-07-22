/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface FlexLayoutVariant {
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

type FlexLayoutVariantMap = {
  [key in keyof FlexLayoutVariant]: Array<FlexLayoutVariant[key]>
}

export type FlexLayoutVariantProps = {
  [key in keyof FlexLayoutVariant]?: ConditionalValue<FlexLayoutVariant[key]> | undefined
}

export interface FlexLayoutRecipe {
  __type: FlexLayoutVariantProps
  (props?: FlexLayoutVariantProps): string
  raw: (props?: FlexLayoutVariantProps) => FlexLayoutVariantProps
  variantMap: FlexLayoutVariantMap
  variantKeys: Array<keyof FlexLayoutVariant>
  splitVariantProps<Props extends FlexLayoutVariantProps>(props: Props): [FlexLayoutVariantProps, Pretty<DistributiveOmit<Props, keyof FlexLayoutVariantProps>>]
  getVariantProps: (props?: FlexLayoutVariantProps) => FlexLayoutVariantProps
}

/**
 * Flexible box layout with common patterns
 */
export declare const flexLayout: FlexLayoutRecipe