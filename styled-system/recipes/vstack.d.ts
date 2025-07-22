/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface VstackVariant {
  /**
 * @default "md"
 */
spacing: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
/**
 * @default "stretch"
 */
align: "start" | "center" | "end" | "stretch"
}

type VstackVariantMap = {
  [key in keyof VstackVariant]: Array<VstackVariant[key]>
}

export type VstackVariantProps = {
  [key in keyof VstackVariant]?: ConditionalValue<VstackVariant[key]> | undefined
}

export interface VstackRecipe {
  __type: VstackVariantProps
  (props?: VstackVariantProps): string
  raw: (props?: VstackVariantProps) => VstackVariantProps
  variantMap: VstackVariantMap
  variantKeys: Array<keyof VstackVariant>
  splitVariantProps<Props extends VstackVariantProps>(props: Props): [VstackVariantProps, Pretty<DistributiveOmit<Props, keyof VstackVariantProps>>]
  getVariantProps: (props?: VstackVariantProps) => VstackVariantProps
}

/**
 * Vertical stack layout with consistent spacing
 */
export declare const vstack: VstackRecipe