import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const visualizationFn = /* @__PURE__ */ createRecipe('visualization', {
  "background": "white",
  "height": "auto",
  "padding": "none"
}, [])

const visualizationVariantMap = {
  "background": [
    "white",
    "gray",
    "transparent"
  ],
  "height": [
    "auto",
    "full",
    "sm",
    "md",
    "lg",
    "screen"
  ],
  "padding": [
    "none",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "border": [
    "true"
  ],
  "rounded": [
    "true"
  ],
  "shadow": [
    "true"
  ],
  "centered": [
    "true"
  ]
}

const visualizationVariantKeys = Object.keys(visualizationVariantMap)

export const visualization = /* @__PURE__ */ Object.assign(memo(visualizationFn.recipeFn), {
  __recipe__: true,
  __name__: 'visualization',
  __getCompoundVariantCss__: visualizationFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: visualizationVariantKeys,
  variantMap: visualizationVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, visualizationVariantKeys)
  },
  getVariantProps: visualizationFn.getVariantProps,
})