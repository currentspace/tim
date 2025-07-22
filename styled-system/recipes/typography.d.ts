/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface TypographyVariant {
  /**
 * @default "dataValue"
 */
variant: "editorialDisplay" | "pageTitle" | "sectionHeader" | "sectionTitle" | "companyTitle" | "dataValue" | "dataLabel" | "captionText" | "timelineLabel" | "navTab" | "badgeText" | "toggleLabel" | "backButton"
size: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
weight: "regular" | "medium" | "semibold" | "bold"
/**
 * @default "primary"
 */
color: "primary" | "secondary" | "muted" | "accent" | "orange" | "white" | "alert"
align: "left" | "center" | "right"
m: "0" | "1" | "2" | "3" | "4" | "xs" | "sm" | "md" | "lg" | "xl"
mb: "0" | "1" | "2" | "3" | "4" | "xs" | "sm" | "md" | "lg" | "xl"
mt: "0" | "1" | "2" | "3" | "4" | "xs" | "sm" | "md" | "lg" | "xl"
transform: "none" | "uppercase" | "lowercase" | "capitalize"
}

type TypographyVariantMap = {
  [key in keyof TypographyVariant]: Array<TypographyVariant[key]>
}

export type TypographyVariantProps = {
  [key in keyof TypographyVariant]?: ConditionalValue<TypographyVariant[key]> | undefined
}

export interface TypographyRecipe {
  __type: TypographyVariantProps
  (props?: TypographyVariantProps): string
  raw: (props?: TypographyVariantProps) => TypographyVariantProps
  variantMap: TypographyVariantMap
  variantKeys: Array<keyof TypographyVariant>
  splitVariantProps<Props extends TypographyVariantProps>(props: Props): [TypographyVariantProps, Pretty<DistributiveOmit<Props, keyof TypographyVariantProps>>]
  getVariantProps: (props?: TypographyVariantProps) => TypographyVariantProps
}

/**
 * Typography styles matching Figma specifications
 */
export declare const typography: TypographyRecipe