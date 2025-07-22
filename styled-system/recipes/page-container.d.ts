/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface PageContainerVariant {
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

type PageContainerVariantMap = {
  [key in keyof PageContainerVariant]: Array<PageContainerVariant[key]>
}

export type PageContainerVariantProps = {
  [key in keyof PageContainerVariant]?: ConditionalValue<PageContainerVariant[key]> | undefined
}

export interface PageContainerRecipe {
  __type: PageContainerVariantProps
  (props?: PageContainerVariantProps): string
  raw: (props?: PageContainerVariantProps) => PageContainerVariantProps
  variantMap: PageContainerVariantMap
  variantKeys: Array<keyof PageContainerVariant>
  splitVariantProps<Props extends PageContainerVariantProps>(props: Props): [PageContainerVariantProps, Pretty<DistributiveOmit<Props, keyof PageContainerVariantProps>>]
  getVariantProps: (props?: PageContainerVariantProps) => PageContainerVariantProps
}

/**
 * Container layouts for pages and sections
 */
export declare const pageContainer: PageContainerRecipe