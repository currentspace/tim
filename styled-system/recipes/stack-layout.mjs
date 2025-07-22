import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const stackLayoutFn = /* @__PURE__ */ createRecipe('stack-layout', {
  "spacing": "md",
  "align": "stretch"
}, [])

const stackLayoutVariantMap = {
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

const stackLayoutVariantKeys = Object.keys(stackLayoutVariantMap)

export const stackLayout = /* @__PURE__ */ Object.assign(memo(stackLayoutFn.recipeFn), {
  __recipe__: true,
  __name__: 'stackLayout',
  __getCompoundVariantCss__: stackLayoutFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: stackLayoutVariantKeys,
  variantMap: stackLayoutVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, stackLayoutVariantKeys)
  },
  getVariantProps: stackLayoutFn.getVariantProps,
})