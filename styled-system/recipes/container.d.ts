/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface ContainerVariant {
  variant: "page" | "section" | "header" | "visualization"
/**
 * @default "white"
 */
background: "white" | "gray" | "transparent"
/**
 * @default "none"
 */
padding: "none" | "sm" | "md" | "lg" | "xl" | "2xl"
/**
 * @default "none"
 */
border: "none" | "bottom" | "top" | "all"
}

type ContainerVariantMap = {
  [key in keyof ContainerVariant]: Array<ContainerVariant[key]>
}

export type ContainerVariantProps = {
  [key in keyof ContainerVariant]?: ConditionalValue<ContainerVariant[key]> | undefined
}

export interface ContainerRecipe {
  __type: ContainerVariantProps
  (props?: ContainerVariantProps): string
  raw: (props?: ContainerVariantProps) => ContainerVariantProps
  variantMap: ContainerVariantMap
  variantKeys: Array<keyof ContainerVariant>
  splitVariantProps<Props extends ContainerVariantProps>(props: Props): [ContainerVariantProps, Pretty<DistributiveOmit<Props, keyof ContainerVariantProps>>]
  getVariantProps: (props?: ContainerVariantProps) => ContainerVariantProps
}

/**
 * Container layouts for pages and sections
 */
export declare const container: ContainerRecipe