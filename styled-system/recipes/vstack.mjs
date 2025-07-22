import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const vstackFn = /* @__PURE__ */ createRecipe('vstack', {
  "spacing": "md",
  "align": "stretch"
}, [])

const vstackVariantMap = {
  "spacing": [
    "none",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "align": [
    "start",
    "center",
    "end",
    "stretch"
  ]
}

const vstackVariantKeys = Object.keys(vstackVariantMap)

export const vstack = /* @__PURE__ */ Object.assign(memo(vstackFn.recipeFn), {
  __recipe__: true,
  __name__: 'vstack',
  __getCompoundVariantCss__: vstackFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: vstackVariantKeys,
  variantMap: vstackVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, vstackVariantKeys)
  },
  getVariantProps: vstackFn.getVariantProps,
})