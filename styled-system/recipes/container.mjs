import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const containerFn = /* @__PURE__ */ createRecipe('container', {
  "background": "white",
  "padding": "none",
  "border": "none"
}, [])

const containerVariantMap = {
  "variant": [
    "page",
    "section",
    "header",
    "visualization"
  ],
  "background": [
    "white",
    "gray",
    "transparent"
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
    "none",
    "bottom",
    "top",
    "all"
  ]
}

const containerVariantKeys = Object.keys(containerVariantMap)

export const container = /* @__PURE__ */ Object.assign(memo(containerFn.recipeFn), {
  __recipe__: true,
  __name__: 'container',
  __getCompoundVariantCss__: containerFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: containerVariantKeys,
  variantMap: containerVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, containerVariantKeys)
  },
  getVariantProps: containerFn.getVariantProps,
})