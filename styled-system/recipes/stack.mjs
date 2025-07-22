import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const stackFn = /* @__PURE__ */ createRecipe('stack', {
  "spacing": "md",
  "align": "stretch"
}, [])

const stackVariantMap = {
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

const stackVariantKeys = Object.keys(stackVariantMap)

export const stack = /* @__PURE__ */ Object.assign(memo(stackFn.recipeFn), {
  __recipe__: true,
  __name__: 'stack',
  __getCompoundVariantCss__: stackFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: stackVariantKeys,
  variantMap: stackVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, stackVariantKeys)
  },
  getVariantProps: stackFn.getVariantProps,
})