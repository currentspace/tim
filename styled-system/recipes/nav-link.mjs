import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const navLinkFn = /* @__PURE__ */ createRecipe('nav-link', {
  "active": false
}, [])

const navLinkVariantMap = {
  "active": [
    "true"
  ]
}

const navLinkVariantKeys = Object.keys(navLinkVariantMap)

export const navLink = /* @__PURE__ */ Object.assign(memo(navLinkFn.recipeFn), {
  __recipe__: true,
  __name__: 'navLink',
  __getCompoundVariantCss__: navLinkFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: navLinkVariantKeys,
  variantMap: navLinkVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, navLinkVariantKeys)
  },
  getVariantProps: navLinkFn.getVariantProps,
})