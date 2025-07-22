import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const buttonFn = /* @__PURE__ */ createRecipe('button', {
  "variant": "solid",
  "size": "md",
  "shape": "rectangle"
}, [
  {
    "variant": "icon",
    "size": "sm",
    "css": {
      "width": "24px",
      "height": "24px"
    }
  },
  {
    "variant": "icon",
    "size": "md",
    "css": {
      "width": "32px",
      "height": "32px"
    }
  },
  {
    "variant": "icon",
    "size": "lg",
    "css": {
      "width": "40px",
      "height": "40px"
    }
  }
])

const buttonVariantMap = {
  "variant": [
    "solid",
    "outline",
    "ghost",
    "icon",
    "nav",
    "tab",
    "danger",
    "primary"
  ],
  "size": [
    "sm",
    "md",
    "lg"
  ],
  "shape": [
    "rectangle",
    "rounded",
    "square"
  ],
  "fullWidth": [
    "true"
  ]
}

const buttonVariantKeys = Object.keys(buttonVariantMap)

export const button = /* @__PURE__ */ Object.assign(memo(buttonFn.recipeFn), {
  __recipe__: true,
  __name__: 'button',
  __getCompoundVariantCss__: buttonFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: buttonVariantKeys,
  variantMap: buttonVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, buttonVariantKeys)
  },
  getVariantProps: buttonFn.getVariantProps,
})