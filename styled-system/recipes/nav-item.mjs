import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const navItemFn = /* @__PURE__ */ createRecipe('nav-item', {
  "active": false
}, [])

const navItemVariantMap = {
  "active": [
    "true"
  ]
}

const navItemVariantKeys = Object.keys(navItemVariantMap)

export const navItem = /* @__PURE__ */ Object.assign(memo(navItemFn.recipeFn), {
  __recipe__: true,
  __name__: 'navItem',
  __getCompoundVariantCss__: navItemFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: navItemVariantKeys,
  variantMap: navItemVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, navItemVariantKeys)
  },
  getVariantProps: navItemFn.getVariantProps,
})