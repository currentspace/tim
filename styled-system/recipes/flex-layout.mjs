import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const flexLayoutFn = /* @__PURE__ */ createRecipe('flex-layout', {
  "direction": "row",
  "align": "stretch",
  "justify": "start",
  "wrap": "nowrap"
}, [])

const flexLayoutVariantMap = {
  "direction": [
    "row",
    "column",
    "rowReverse",
    "columnReverse"
  ],
  "align": [
    "start",
    "center",
    "end",
    "stretch",
    "baseline"
  ],
  "justify": [
    "start",
    "center",
    "end",
    "between",
    "around",
    "evenly"
  ],
  "wrap": [
    "wrap",
    "nowrap",
    "reverse"
  ],
  "gap": [
    "none",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
  ],
  "grow": [
    "0",
    "1"
  ],
  "shrink": [
    "0",
    "1"
  ]
}

const flexLayoutVariantKeys = Object.keys(flexLayoutVariantMap)

export const flexLayout = /* @__PURE__ */ Object.assign(memo(flexLayoutFn.recipeFn), {
  __recipe__: true,
  __name__: 'flexLayout',
  __getCompoundVariantCss__: flexLayoutFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: flexLayoutVariantKeys,
  variantMap: flexLayoutVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, flexLayoutVariantKeys)
  },
  getVariantProps: flexLayoutFn.getVariantProps,
})