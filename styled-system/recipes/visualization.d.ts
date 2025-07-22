/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface VisualizationVariant {
  /**
 * @default "white"
 */
background: "white" | "gray" | "transparent"
/**
 * @default "auto"
 */
height: "auto" | "full" | "sm" | "md" | "lg" | "screen"
/**
 * @default "none"
 */
padding: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
border: boolean
rounded: boolean
shadow: boolean
centered: boolean
}

type VisualizationVariantMap = {
  [key in keyof VisualizationVariant]: Array<VisualizationVariant[key]>
}

export type VisualizationVariantProps = {
  [key in keyof VisualizationVariant]?: ConditionalValue<VisualizationVariant[key]> | undefined
}

export interface VisualizationRecipe {
  __type: VisualizationVariantProps
  (props?: VisualizationVariantProps): string
  raw: (props?: VisualizationVariantProps) => VisualizationVariantProps
  variantMap: VisualizationVariantMap
  variantKeys: Array<keyof VisualizationVariant>
  splitVariantProps<Props extends VisualizationVariantProps>(props: Props): [VisualizationVariantProps, Pretty<DistributiveOmit<Props, keyof VisualizationVariantProps>>]
  getVariantProps: (props?: VisualizationVariantProps) => VisualizationVariantProps
}

/**
 * Container styles for data visualizations and charts
 */
export declare const visualization: VisualizationRecipe