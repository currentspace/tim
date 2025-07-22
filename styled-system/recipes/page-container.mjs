import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const pageContainerFn = /* @__PURE__ */ createRecipe('page-container', {
  "background": "white",
  "padding": "none",
  "border": "none"
}, [])

const pageContainerVariantMap = {
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

const pageContainerVariantKeys = Object.keys(pageContainerVariantMap)

export const pageContainer = /* @__PURE__ */ Object.assign(memo(pageContainerFn.recipeFn), {
  __recipe__: true,
  __name__: 'pageContainer',
  __getCompoundVariantCss__: pageContainerFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: pageContainerVariantKeys,
  variantMap: pageContainerVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, pageContainerVariantKeys)
  },
  getVariantProps: pageContainerFn.getVariantProps,
})