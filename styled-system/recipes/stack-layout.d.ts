/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface StackLayoutVariant {
  /**
 * @default "md"
 */
spacing: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
/**
 * @default "stretch"
 */
align: "start" | "center" | "end" | "stretch"
}

type StackLayoutVariantMap = {
  [key in keyof StackLayoutVariant]: Array<StackLayoutVariant[key]>
}

export type StackLayoutVariantProps = {
  [key in keyof StackLayoutVariant]?: ConditionalValue<StackLayoutVariant[key]> | undefined
}

export interface StackLayoutRecipe {
  __type: StackLayoutVariantProps
  (props?: StackLayoutVariantProps): string
  raw: (props?: StackLayoutVariantProps) => StackLayoutVariantProps
  variantMap: StackLayoutVariantMap
  variantKeys: Array<keyof StackLayoutVariant>
  splitVariantProps<Props extends StackLayoutVariantProps>(props: Props): [StackLayoutVariantProps, Pretty<DistributiveOmit<Props, keyof StackLayoutVariantProps>>]
  getVariantProps: (props?: StackLayoutVariantProps) => StackLayoutVariantProps
}

/**
 * Vertical stack layout with consistent spacing
 */
export declare const stackLayout: StackLayoutRecipe