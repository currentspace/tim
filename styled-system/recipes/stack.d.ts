/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface StackVariant {
  /**
 * @default "md"
 */
spacing: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
/**
 * @default "stretch"
 */
align: "start" | "center" | "end" | "stretch"
}

type StackVariantMap = {
  [key in keyof StackVariant]: Array<StackVariant[key]>
}

export type StackVariantProps = {
  [key in keyof StackVariant]?: ConditionalValue<StackVariant[key]> | undefined
}

export interface StackRecipe {
  __type: StackVariantProps
  (props?: StackVariantProps): string
  raw: (props?: StackVariantProps) => StackVariantProps
  variantMap: StackVariantMap
  variantKeys: Array<keyof StackVariant>
  splitVariantProps<Props extends StackVariantProps>(props: Props): [StackVariantProps, Pretty<DistributiveOmit<Props, keyof StackVariantProps>>]
  getVariantProps: (props?: StackVariantProps) => StackVariantProps
}

/**
 * Vertical stack layout with consistent spacing
 */
export declare const stack: StackRecipe