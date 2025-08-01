/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface ButtonVariant {
  /**
 * @default "solid"
 */
variant: "solid" | "outline" | "ghost" | "icon" | "nav" | "tab" | "danger" | "primary"
/**
 * @default "md"
 */
size: "sm" | "md" | "lg"
/**
 * @default "rectangle"
 */
shape: "rectangle" | "rounded" | "square"
fullWidth: boolean
}

type ButtonVariantMap = {
  [key in keyof ButtonVariant]: Array<ButtonVariant[key]>
}

export type ButtonVariantProps = {
  [key in keyof ButtonVariant]?: ButtonVariant[key] | undefined
}

export interface ButtonRecipe {
  __type: ButtonVariantProps
  (props?: ButtonVariantProps): string
  raw: (props?: ButtonVariantProps) => ButtonVariantProps
  variantMap: ButtonVariantMap
  variantKeys: Array<keyof ButtonVariant>
  splitVariantProps<Props extends ButtonVariantProps>(props: Props): [ButtonVariantProps, Pretty<DistributiveOmit<Props, keyof ButtonVariantProps>>]
  getVariantProps: (props?: ButtonVariantProps) => ButtonVariantProps
}

/**
 * Button styles with variants
 */
export declare const button: ButtonRecipe