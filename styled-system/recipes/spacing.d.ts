/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface SpacingVariant {
  m: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
mt: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
mb: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
ml: "0" | "xs" | "sm" | "md" | "lg" | "xl"
mr: "0" | "xs" | "sm" | "md" | "lg" | "xl"
mx: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "auto"
my: "0" | "xs" | "sm" | "md" | "lg" | "xl"
p: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
px: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
py: "0" | "xs" | "sm" | "md" | "lg" | "xl"
}

type SpacingVariantMap = {
  [key in keyof SpacingVariant]: Array<SpacingVariant[key]>
}

export type SpacingVariantProps = {
  [key in keyof SpacingVariant]?: ConditionalValue<SpacingVariant[key]> | undefined
}

export interface SpacingRecipe {
  __type: SpacingVariantProps
  (props?: SpacingVariantProps): string
  raw: (props?: SpacingVariantProps) => SpacingVariantProps
  variantMap: SpacingVariantMap
  variantKeys: Array<keyof SpacingVariant>
  splitVariantProps<Props extends SpacingVariantProps>(props: Props): [SpacingVariantProps, Pretty<DistributiveOmit<Props, keyof SpacingVariantProps>>]
  getVariantProps: (props?: SpacingVariantProps) => SpacingVariantProps
}

/**
 * Utility recipe for consistent spacing
 */
export declare const spacing: SpacingRecipe