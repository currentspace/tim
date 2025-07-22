/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface NavItemVariant {
  /**
 * @default false
 */
active: boolean
}

type NavItemVariantMap = {
  [key in keyof NavItemVariant]: Array<NavItemVariant[key]>
}

export type NavItemVariantProps = {
  [key in keyof NavItemVariant]?: ConditionalValue<NavItemVariant[key]> | undefined
}

export interface NavItemRecipe {
  __type: NavItemVariantProps
  (props?: NavItemVariantProps): string
  raw: (props?: NavItemVariantProps) => NavItemVariantProps
  variantMap: NavItemVariantMap
  variantKeys: Array<keyof NavItemVariant>
  splitVariantProps<Props extends NavItemVariantProps>(props: Props): [NavItemVariantProps, Pretty<DistributiveOmit<Props, keyof NavItemVariantProps>>]
  getVariantProps: (props?: NavItemVariantProps) => NavItemVariantProps
}

/**
 * Navigation item styles
 */
export declare const navItem: NavItemRecipe