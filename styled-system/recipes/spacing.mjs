import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const spacingFn = /* @__PURE__ */ createRecipe('spacing', {}, [])

const spacingVariantMap = {
  "m": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "mt": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "mb": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "ml": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "mr": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "mx": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "auto"
  ],
  "my": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "p": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "px": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "py": [
    "0",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ]
}

const spacingVariantKeys = Object.keys(spacingVariantMap)

export const spacing = /* @__PURE__ */ Object.assign(memo(spacingFn.recipeFn), {
  __recipe__: true,
  __name__: 'spacing',
  __getCompoundVariantCss__: spacingFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: spacingVariantKeys,
  variantMap: spacingVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, spacingVariantKeys)
  },
  getVariantProps: spacingFn.getVariantProps,
})