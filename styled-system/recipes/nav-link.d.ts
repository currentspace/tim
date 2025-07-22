/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface NavLinkVariant {
  /**
 * @default false
 */
active: boolean
}

type NavLinkVariantMap = {
  [key in keyof NavLinkVariant]: Array<NavLinkVariant[key]>
}

export type NavLinkVariantProps = {
  [key in keyof NavLinkVariant]?: ConditionalValue<NavLinkVariant[key]> | undefined
}

export interface NavLinkRecipe {
  __type: NavLinkVariantProps
  (props?: NavLinkVariantProps): string
  raw: (props?: NavLinkVariantProps) => NavLinkVariantProps
  variantMap: NavLinkVariantMap
  variantKeys: Array<keyof NavLinkVariant>
  splitVariantProps<Props extends NavLinkVariantProps>(props: Props): [NavLinkVariantProps, Pretty<DistributiveOmit<Props, keyof NavLinkVariantProps>>]
  getVariantProps: (props?: NavLinkVariantProps) => NavLinkVariantProps
}

/**
 * Navigation link styles
 */
export declare const navLink: NavLinkRecipe